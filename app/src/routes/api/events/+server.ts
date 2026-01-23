import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { sanityClient } from '$lib/sanity.server';

export const GET: RequestHandler = async ({ url }) => {
	try {
		const limit = parseInt(url.searchParams.get('limit') || '0');
		
		const query = `*[_type == "event"] | order(date asc)${limit > 0 ? `[0...${limit}]` : ''}`;
		const events = await sanityClient.fetch(query);

		return json(events);
	} catch (error) {
		console.error('Error fetching events:', error);
		return json([], { status: 500 });
	}
};

