import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import type { Event } from '$lib/types';

// This API route is used during development
// For static builds, data should be fetched in +page.ts load functions
// To connect to Payload CMS, update the load functions to fetch from your Payload instance:
// const PAYLOAD_URL = process.env.PAYLOAD_URL || 'http://localhost:3000';
// const response = await fetch(`${PAYLOAD_URL}/api/events?limit=${limit}`);

export const GET: RequestHandler = async ({ url }) => {
	const limit = parseInt(url.searchParams.get('limit') || '0');

	// TODO: Replace with actual Payload CMS fetch
	// Example:
	// const PAYLOAD_URL = import.meta.env.PAYLOAD_URL || 'http://localhost:3000';
	// const response = await fetch(`${PAYLOAD_URL}/api/events?limit=${limit}`);
	// const data = await response.json();
	// return json(data.docs || []);

	const events: Event[] = [];

	return json(events);
};

