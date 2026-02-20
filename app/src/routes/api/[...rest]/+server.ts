import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { sanityClient } from '$lib/sanity.server';

// This route handles generic Sanity API requests
export const GET: RequestHandler = async ({ params, url }) => {
	try {
		const type = params.rest?.split('/')[0];
		const id = params.rest?.split('/')[1];

		if (id) {
			// Fetch single document by ID
			const query = `*[_type == $type && _id == $id][0]`;
			const result = await sanityClient.fetch(query, { type, id });
			return json(result);
		} else {
			// Fetch all documents of type
			const limit = url.searchParams.get('limit') ? parseInt(url.searchParams.get('limit')!) : undefined;
			const sort = url.searchParams.get('sort') || '_createdAt desc';
			
			let query = `*[_type == $type]`;
			if (sort) {
				query += ` | order(${sort})`;
			}
			if (limit) {
				query += `[0...${limit}]`;
			}
			
			const result = await sanityClient.fetch(query, { type });
			return json(result);
		}
	} catch (error) {
		console.error('Sanity API error:', error);
		return json({ error: 'Internal server error' }, { status: 500 });
	}
};

export const POST: RequestHandler = async ({ params, request }) => {
	try {
		const type = params.rest?.split('/')[0];
		const data = await request.json();

		const document = {
			_type: type,
			...data
		};

		const result = await sanityClient.create(document);
		return json(result, { status: 201 });
	} catch (error) {
		console.error('Sanity API error:', error);
		return json({ error: 'Internal server error' }, { status: 500 });
	}
};

