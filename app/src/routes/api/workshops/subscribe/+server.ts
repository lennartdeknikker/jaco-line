import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { sanityClient } from '$lib/sanity.server';
import { verifyTurnstileToken } from '$lib/turnstile.server';

export const POST: RequestHandler = async ({ request }) => {
	try {
		const data = await request.json();

		// Validate required fields (workshopSessionId = the specific date they sign up for)
		if (!data.name || !data.email || !data.workshopSessionId) {
			return json(
				{ success: false, error: 'Naam, e-mail en workshopdatum zijn verplicht' },
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

		// Check if already subscribed to this workshop session
		const existing = await sanityClient.fetch(
			`*[_type == "workshopSubscription" && email == $email && workshopSession._ref == $sessionId][0]`,
			{ email: data.email, sessionId: data.workshopSessionId }
		);

		if (existing) {
			return json(
				{ success: false, error: 'Je bent al ingeschreven voor deze workshopdatum' },
				{ status: 400 }
			);
		}

		// Check if session exists and is not full
		const session = await sanityClient.fetch(
			`*[_type == "workshopSession" && _id == $sessionId][0]`,
			{ sessionId: data.workshopSessionId }
		);

		if (!session) {
			return json(
				{ success: false, error: 'Workshopdatum niet gevonden' },
				{ status: 404 }
			);
		}

		if (session.isFull === true) {
			return json(
				{ success: false, error: 'Deze workshopdatum is vol. Er zijn geen plaatsen meer beschikbaar.' },
				{ status: 400 }
			);
		}

		if (session.maxParticipants) {
			const subscriptionCount = await sanityClient.fetch(
				`count(*[_type == "workshopSubscription" && workshopSession._ref == $sessionId])`,
				{ sessionId: data.workshopSessionId }
			);

			if (subscriptionCount >= session.maxParticipants) {
				return json(
					{ success: false, error: 'Deze workshopdatum is vol. Er zijn geen plaatsen meer beschikbaar.' },
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
			workshopSession: {
				_type: 'reference',
				_ref: data.workshopSessionId
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
