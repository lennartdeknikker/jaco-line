import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { sanityClient, urlFor } from '$lib/sanity.server';

const today = new Date().toISOString().slice(0, 10);

export const GET: RequestHandler = async ({ params }) => {
	const slug = params.slug;
	if (!slug) {
		return json({ error: 'Slug required' }, { status: 400 });
	}
	try {
		const query = `*[_type == "workshop" && slug.current == $slug][0] {
			_id,
			_type,
			title,
			slug,
			description,
			shortDescription,
			mainImage,
			images,
			defaultPrice,
			_createdAt,
			_updatedAt,
			"sessions": *[_type == "workshopSession" && references(^._id) && date >= $today] | order(date asc) {
				_id,
				_type,
				date,
				time,
				location,
				price,
				maxParticipants,
				isFull,
				_createdAt,
				_updatedAt
			}
		}`;
		const workshop = await sanityClient.fetch(query, { slug, today });
		if (!workshop) {
			return json({ error: 'Workshop not found' }, { status: 404 });
		}

		// Subscription counts and isFull per session
		const sessionsWithCounts = await Promise.all(
			workshop.sessions.map(async (session: any) => {
				const subscriptionCount = await sanityClient.fetch(
					`count(*[_type == "workshopSubscription" && workshopSession._ref == $sessionId])`,
					{ sessionId: session._id }
				);
				const isFullFromCMS = session.isFull === true;
				const isFullFromCalculation = session.maxParticipants
					? subscriptionCount >= session.maxParticipants
					: false;
				return {
					...session,
					currentParticipants: subscriptionCount,
					isFull: isFullFromCMS || isFullFromCalculation
				};
			})
		);

		const mainImageUrl = workshop.mainImage
			? urlFor(workshop.mainImage).width(1200).url()
			: null;
		const imageUrls =
			workshop.images?.map((img: any, i: number) => ({
				url: img?.asset ? urlFor(img).width(1200).url() : null,
				alt: img?.alt ?? workshop.images?.[i]?.alt ?? ''
			})) ?? [];

		return json({
			...workshop,
			sessions: sessionsWithCounts,
			mainImageUrl,
			imageUrls
		});
	} catch (error) {
		console.error('Error fetching workshop:', error);
		return json({ error: 'Failed to fetch workshop' }, { status: 500 });
	}
};
