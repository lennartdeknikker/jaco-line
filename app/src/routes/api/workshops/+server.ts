import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { sanityClient, urlFor } from '$lib/sanity.server';

const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

export const GET: RequestHandler = async () => {
	try {
		// Fetch workshop types with their upcoming sessions (date >= today)
		const query = `*[_type == "workshop"] {
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
		const workshopTypes = await sanityClient.fetch(query, { today });

		// Only include workshop types that have at least one upcoming session
		const withSessions = workshopTypes.filter((w: any) => w.sessions?.length > 0);

		// Get subscription count and resolve isFull for each session
		const withCounts = await Promise.all(
			withSessions.map(async (workshop: any) => {
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
				// Build image URLs for mainImage and images
				const mainImageUrl = workshop.mainImage
					? urlFor(workshop.mainImage).width(800).height(500).url()
					: null;
				const imageUrls =
					workshop.images?.map((img: any) =>
						img?.asset ? urlFor(img).width(1200).url() : null
					) ?? [];
				return {
					...workshop,
					sessions: sessionsWithCounts,
					mainImageUrl,
					imageUrls
				};
			})
		);

		return json(withCounts);
	} catch (error) {
		console.error('Error fetching workshops:', error);
		return json([], { status: 500 });
	}
};
