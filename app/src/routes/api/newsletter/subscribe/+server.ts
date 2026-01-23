import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { sanityClient } from '$lib/sanity.server';

export const POST: RequestHandler = async ({ request }) => {
	try {
		const data = await request.json();

		// Check if email already exists
		const existing = await sanityClient.fetch(
			`*[_type == "newsletterSubscriber" && email == $email][0]`,
			{ email: data.email }
		);

		if (existing) {
			return json({ success: false, error: 'Email already subscribed' }, { status: 400 });
		}

		const subscriber = {
			_type: 'newsletterSubscriber',
			name: data.name || '',
			email: data.email
		};

		const result = await sanityClient.create(subscriber);

		return json({ success: true, id: result._id }, { status: 201 });
	} catch (error: any) {
		console.error('Error creating newsletter subscription:', error);
		return json({ success: false, error: 'Failed to subscribe' }, { status: 500 });
	}
};


