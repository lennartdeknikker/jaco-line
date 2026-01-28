import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { sanityClient } from '$lib/sanity.server';

export const GET: RequestHandler = async () => {
	try {
		const query = `*[_type == "workshop"] | order(date asc)`;
		const workshops = await sanityClient.fetch(query);

		// Get subscription counts for each workshop
		const workshopsWithCounts = await Promise.all(
			workshops.map(async (workshop: any) => {
				const subscriptionCount = await sanityClient.fetch(
					`count(*[_type == "workshopSubscription" && workshop._ref == $workshopId])`,
					{ workshopId: workshop._id }
				);

				// Check CMS isFull field first, then fall back to calculation
				const isFullFromCMS = workshop.isFull === true;
				const isFullFromCalculation = workshop.maxParticipants
					? subscriptionCount >= workshop.maxParticipants
					: false;

				return {
					...workshop,
					currentParticipants: subscriptionCount,
					isFull: isFullFromCMS || isFullFromCalculation
				};
			})
		);

		return json(workshopsWithCounts);
	} catch (error) {
		console.error('Error fetching workshops:', error);
		return json([], { status: 500 });
	}
};


