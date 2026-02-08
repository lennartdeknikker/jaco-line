import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { sanityClient } from '$lib/sanity.server';
import { verifyTurnstileToken } from '$lib/turnstile.server';

export const POST: RequestHandler = async ({ request }) => {
	try {
		const data = await request.json();

		// Validate required fields
		if (!data.name || !data.email || !data.workshopId) {
			return json(
				{ success: false, error: 'Naam, e-mail en workshop zijn verplicht' },
				{ status: 400 }
			);
		}
		if (!data.phone || String(data.phone).trim() === '') {
			return json(
				{ success: false, error: 'Telefoonnummer is verplicht' },
				{ status: 400 }
			);
		}

		// Verify Turnstile token
		if (data.turnstileToken) {
			const isValid = await verifyTurnstileToken(data.turnstileToken);
			if (!isValid) {
				return json(
					{ success: false, error: 'CAPTCHA verificatie mislukt. Probeer het opnieuw.' },
					{ status: 400 }
				);
			}
		}

		// Check if already subscribed to this workshop
		const existing = await sanityClient.fetch(
			`*[_type == "workshopSubscription" && email == $email && workshop._ref == $workshopId][0]`,
			{ email: data.email, workshopId: data.workshopId }
		);

		if (existing) {
			return json(
				{ success: false, error: 'Je bent al ingeschreven voor deze workshop' },
				{ status: 400 }
			);
		}

		// Check if workshop is full
		const workshop = await sanityClient.fetch(
			`*[_type == "workshop" && _id == $workshopId][0]`,
			{ workshopId: data.workshopId }
		);

		if (!workshop) {
			return json(
				{ success: false, error: 'Workshop niet gevonden' },
				{ status: 404 }
			);
		}

		// Check CMS isFull field first (overrides calculation)
		if (workshop.isFull === true) {
			return json(
				{ success: false, error: 'Deze workshop is vol. Er zijn geen plaatsen meer beschikbaar.' },
				{ status: 400 }
			);
		}

		// Fall back to calculation if CMS field is not set
		if (workshop.maxParticipants) {
			const subscriptionCount = await sanityClient.fetch(
				`count(*[_type == "workshopSubscription" && workshop._ref == $workshopId])`,
				{ workshopId: data.workshopId }
			);

			if (subscriptionCount >= workshop.maxParticipants) {
				return json(
					{ success: false, error: 'Deze workshop is vol. Er zijn geen plaatsen meer beschikbaar.' },
					{ status: 400 }
				);
			}
		}

		const rawCount =
			data.participantCount !== undefined && data.participantCount !== ''
				? Number(data.participantCount)
				: undefined;
		const participantCount =
			rawCount != null && !Number.isNaN(rawCount) && rawCount >= 0 && rawCount <= 20
				? rawCount
				: undefined;

		const subscription = {
			_type: 'workshopSubscription',
			name: data.name,
			email: data.email,
			phone: data.phone.trim(),
			...(participantCount != null ? { participantCount } : {}),
			...(data.remarks ? { remarks: data.remarks } : {}),
			workshop: {
				_type: 'reference',
				_ref: data.workshopId
			}
		};

		const result = await sanityClient.create(subscription);

		return json({ success: true, id: result._id }, { status: 201 });
	} catch (error: any) {
		console.error('Error creating workshop subscription:', error);
		return json(
			{ success: false, error: error.message || 'Failed to create subscription' },
			{ status: 500 }
		);
	}
};


