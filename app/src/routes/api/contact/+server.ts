import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { sanityClient } from '$lib/sanity.server';
import { verifyTurnstileToken } from '$lib/turnstile.server';

export const POST: RequestHandler = async ({ request }) => {
	try {
		const data = await request.json();

		// Validate required fields
		if (!data.name || !data.email || !data.message) {
			return json(
				{ success: false, error: 'Naam, e-mail en bericht zijn verplicht' },
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

		// Create contact message in Sanity
		const contactMessage = {
			_type: 'contactMessage',
			name: data.name,
			email: data.email,
			message: data.message,
			read: false
		};

		const result = await sanityClient.create(contactMessage);

		return json({ success: true, id: result._id }, { status: 201 });
	} catch (error: any) {
		console.error('Error creating contact message:', error);
		return json(
			{ success: false, error: error.message || 'Failed to send message' },
			{ status: 500 }
		);
	}
};


