import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { sanityClient } from '$lib/sanity.server';

export const GET: RequestHandler = async () => {
	try {
		const query = `*[_type == "workshop"] | order(date asc)`;
		const workshops = await sanityClient.fetch(query);

		return json(workshops);
	} catch (error) {
		console.error('Error fetching workshops:', error);
		return json([], { status: 500 });
	}
};


