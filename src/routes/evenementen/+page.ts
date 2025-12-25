import type { PageLoad } from './$types';

export const prerender = true;

export const load: PageLoad = async ({ fetch }) => {
	try {
		// For Payload CMS: fetch(`${import.meta.env.PAYLOAD_URL}/api/events`)
		const response = await fetch('/api/events');
		const events = response.ok ? await response.json() : [];
		return { events };
	} catch (error) {
		console.error('Error loading events:', error);
		return { events: [] };
	}
};

