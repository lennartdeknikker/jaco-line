import type { PageLoad } from './$types';

export const prerender = true;

export const load: PageLoad = async ({ fetch }) => {
	try {
		// For Payload CMS: fetch(`${import.meta.env.PAYLOAD_URL}/api/workshops`)
		const response = await fetch('/api/workshops');
		const workshops = response.ok ? await response.json() : [];
		return { workshops };
	} catch (error) {
		console.error('Error loading workshops:', error);
		return { workshops: [] };
	}
};

