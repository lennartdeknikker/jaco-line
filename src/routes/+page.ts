import type { PageLoad } from './$types';

// For static generation with Payload CMS:
// 1. Set PAYLOAD_URL environment variable to your Payload CMS instance
// 2. Update fetch URLs to point to your Payload CMS API
// Example: fetch(`${import.meta.env.PAYLOAD_URL}/api/events?limit=3`)

export const prerender = true;

export const load: PageLoad = async ({ fetch }) => {
	try {
		// For Payload CMS integration, replace with:
		// const PAYLOAD_URL = import.meta.env.PAYLOAD_URL || 'http://localhost:3000';
		// const [eventsRes, imagesRes] = await Promise.all([
		//   fetch(`${PAYLOAD_URL}/api/events?limit=3`),
		//   fetch(`${PAYLOAD_URL}/api/gallery?limit=6`)
		// ]);

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

