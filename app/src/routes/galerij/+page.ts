import type { PageLoad } from './$types';

export const prerender = false;
export const ssr = true;

export const load: PageLoad = async ({ fetch }) => {
	try {
		// Fetching from Sanity CMS
		const response = await fetch('/api/gallery');
		const images = response.ok ? await response.json() : [];
		return { images };
	} catch (error) {
		console.error('Error loading gallery:', error);
		return { images: [] };
	}
};

