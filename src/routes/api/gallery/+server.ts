import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import type { GalleryImage } from '$lib/types';

// In production, this would fetch from Payload CMS
export const GET: RequestHandler = async ({ url }) => {
	const limit = parseInt(url.searchParams.get('limit') || '0');

	// TODO: Replace with actual Payload CMS fetch
	// const response = await fetch(`${PAYLOAD_URL}/api/gallery?limit=${limit}`);
	// const data = await response.json();

	const images: GalleryImage[] = [];

	return json(images);
};


