import type { PageLoad } from './$types';

// SSR enabled - Sanity CMS requires server-side rendering
export const prerender = false;
export const ssr = true;

export const load: PageLoad = async ({ fetch }) => {
	try {
		// Fetching from Sanity CMS via API routes

		const [eventsRes, imagesRes] = await Promise.all([
			fetch('/api/events?limit=3'),
			fetch('/api/gallery?limit=6')
		]);

		const events = eventsRes.ok ? await eventsRes.json() : [];
		const images = imagesRes.ok ? await imagesRes.json() : [];

		return {
			events,
			images
		};
	} catch (error) {
		console.error('Error loading data:', error);
		return {
			events: [],
			images: []
		};
	}
};

