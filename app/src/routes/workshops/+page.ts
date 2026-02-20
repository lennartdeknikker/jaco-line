import type { PageLoad } from './$types';

export const prerender = false;
export const ssr = true;

export const load: PageLoad = async ({ fetch }) => {
	try {
		// Fetching from Sanity CMS
		const response = await fetch('/api/workshops');
		const workshops = response.ok ? await response.json() : [];
		return { workshops };
	} catch (error) {
		console.error('Error loading workshops:', error);
		return { workshops: [] };
	}
};

