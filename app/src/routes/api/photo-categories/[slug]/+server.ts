import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { sanityClient } from '$lib/sanity.server';
import { UNCATEGORIZED_NAME, UNCATEGORIZED_SLUG } from '$lib/photoCategories';
import { cleanText } from '$lib/text';

const IMAGE_PROJECTION = `{
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

export const GET: RequestHandler = async ({ params }) => {
	const slug = params.slug;
	if (!slug) {
		return json({ error: 'Slug required' }, { status: 400 });
	}

	try {
		const category = await sanityClient.fetch(
			`*[_type == "photoCategory" && slug.current == $slug][0] {
				_id,
				name,
				slug,
				description
			}`,
			{ slug }
		);

		// No matching category document: "overige" is the pseudo-category for photos without one.
		if (!category && slug !== UNCATEGORIZED_SLUG) {
			return json({ error: 'Category not found' }, { status: 404 });
		}

		const images = category
			? await sanityClient.fetch(
					`*[_type == "gallery" && category._ref == $id] | order(_createdAt desc) ${IMAGE_PROJECTION}`,
					{ id: category._id }
				)
			: await sanityClient.fetch(
					`*[_type == "gallery" && !defined(category)] | order(_createdAt desc) ${IMAGE_PROJECTION}`
				);

		const formattedImages = images.map((item: any) => ({
			...item,
			alt: cleanText(item.alt),
			imageUrl: item.image?.asset?.url || null
		}));

		return json({
			category: category
				? {
						...category,
						name: cleanText(category.name),
						description: cleanText(category.description)
					}
				: {
						_id: UNCATEGORIZED_SLUG,
						name: UNCATEGORIZED_NAME,
						slug: { current: UNCATEGORIZED_SLUG },
						description: null
					},
			images: formattedImages
		});
	} catch (error) {
		console.error('Error fetching photo category:', error);
		return json({ error: 'Failed to fetch category' }, { status: 500 });
	}
};
