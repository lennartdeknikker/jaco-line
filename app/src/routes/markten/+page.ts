import type { PageLoad } from './$types';

export const prerender = false;
export const ssr = true;

export const load: PageLoad = async ({ fetch }) => {
	try {
		// Fetching from Sanity CMS
		const response = await fetch('/api/events');
		const events = response.ok ? await response.json() : [];
		return { events };
	} catch (error) {
		console.error('Error loading events:', error);
		return { events: [] };
	}
};

