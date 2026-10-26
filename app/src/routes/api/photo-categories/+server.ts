import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { sanityClient, urlFor } from '$lib/sanity.server';
import { UNCATEGORIZED_NAME, UNCATEGORIZED_SLUG, coverUrl } from '$lib/photoCategories';
import { cleanText } from '$lib/text';

export const GET: RequestHandler = async () => {
	try {
		const query = `{
			"categories": *[_type == "photoCategory"] | order(name asc) {
				_id,
				name,
				slug,
				description,
				coverImage,
				"count": count(*[_type == "gallery" && category._ref == ^._id]),
				"fallbackImage": *[_type == "gallery" && category._ref == ^._id] | order(_createdAt desc)[0].image
			},
			"uncategorized": {
				"count": count(*[_type == "gallery" && !defined(category)]),
				"fallbackImage": *[_type == "gallery" && !defined(category)] | order(_createdAt desc)[0].image
			}
		}`;
		const { categories, uncategorized } = await sanityClient.fetch(query);

		// Only show categories that actually have photos; an empty card would lead to an empty page.
		const withPhotos = (categories ?? [])
			.filter((category: any) => category.count > 0)
			.map((category: any) => ({
				_id: category._id,
				name: cleanText(category.name),
				slug: category.slug,
				description: cleanText(category.description) ?? null,
				count: category.count,
				coverUrl: coverUrl(urlFor, category.coverImage ?? category.fallbackImage)
			}));

		// Photos without a category stay reachable through an "Overige" card. A real category with
		// that same slug wins, so we only add the card when the slug is still free.
		const slugTaken = withPhotos.some((c: any) => c.slug?.current === UNCATEGORIZED_SLUG);
		if (uncategorized?.count > 0 && !slugTaken) {
			withPhotos.push({
				_id: UNCATEGORIZED_SLUG,
				name: UNCATEGORIZED_NAME,
				slug: { current: UNCATEGORIZED_SLUG },
				description: null,
				count: uncategorized.count,
				coverUrl: coverUrl(urlFor, uncategorized.fallbackImage)
			});
		}

		return json(withPhotos);
	} catch (error) {
		console.error('Error fetching photo categories:', error);
		return json([], { status: 500 });
	}
};
