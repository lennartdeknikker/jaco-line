import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { sanityClient } from '$lib/sanity.server';

export const POST: RequestHandler = async ({ request }) => {
	try {
		const data = await request.json();

		const subscription = {
			_type: 'workshopSubscription',
			name: data.name,
			email: data.email,
			phone: data.phone || '',
			workshop: {
				_type: 'reference',
				_ref: data.workshopId
			}
		};

		const result = await sanityClient.create(subscription);

		return json({ success: true, id: result._id }, { status: 201 });
	} catch (error) {
		console.error('Error creating workshop subscription:', error);
		return json({ success: false, error: 'Failed to create subscription' }, { status: 500 });
	}
};


