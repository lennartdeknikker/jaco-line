import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { sanityClient, urlFor } from '$lib/sanity.server';

export const GET: RequestHandler = async ({ url }) => {
	try {
		const limit = parseInt(url.searchParams.get('limit') || '0');
		
		const query = `*[_type == "gallery"] | order(_createdAt desc)${limit > 0 ? `[0...${limit}]` : ''} {
			_id,
			_type,
			alt,
			image {
				asset-> {
					_id,
					url,
					metadata {
						dimensions {
							width,
							height
						}
					}
				}
			},
			_createdAt,
			_updatedAt
		}`;
		const gallery = await sanityClient.fetch(query);

		// Format images with URLs
		const formattedGallery = gallery.map((item: any) => ({
			...item,
			imageUrl: item.image?.asset?.url || null
		}));

		return json(formattedGallery);
	} catch (error) {
		console.error('Error fetching gallery:', error);
		return json([], { status: 500 });
	}
};


