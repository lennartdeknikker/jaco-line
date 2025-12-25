import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import type { Workshop } from '$lib/types';

// In production, this would fetch from Payload CMS
export const GET: RequestHandler = async () => {
	// TODO: Replace with actual Payload CMS fetch
	// const response = await fetch(`${PAYLOAD_URL}/api/workshops`);
	// const data = await response.json();

	const workshops: Workshop[] = [];

	return json(workshops);
};

