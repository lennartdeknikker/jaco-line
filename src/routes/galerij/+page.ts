import type { PageLoad } from './$types';

export const prerender = true;

export const load: PageLoad = async ({ fetch }) => {
	try {
		// For Payload CMS: fetch(`${import.meta.env.PAYLOAD_URL}/api/gallery`)
		const response = await fetch('/api/gallery');
		const images = response.ok ? await response.json() : [];
		return { images };
	} catch (error) {
		console.error('Error loading gallery:', error);
		return { images: [] };
	}
};

