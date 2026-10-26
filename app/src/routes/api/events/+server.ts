import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { sanityClient, urlFor } from '$lib/sanity.server';

export const GET: RequestHandler = async ({ url }) => {
	try {
		const limit = parseInt(url.searchParams.get('limit') || '0');

		const query = `*[_type == "event"] | order(date asc)${limit > 0 ? `[0...${limit}]` : ''}{
			_id,
			_type,
			title,
			description,
			date,
			location,
			image,
			_createdAt,
			_updatedAt
		}`;
		const events = await sanityClient.fetch(query);

		const eventsWithImageUrls = events.map((event: { image?: any; [key: string]: unknown }) => ({
			...event,
			imageUrl: event.image ? urlFor(event.image).width(800).url() : null
		}));

		return json(eventsWithImageUrls);
	} catch (error) {
		console.error('Error fetching events:', error);
		return json([], { status: 500 });
	}
};

