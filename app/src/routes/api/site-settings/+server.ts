import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { sanityClient } from '$lib/sanity.server';

// Helper function to clean invisible Unicode characters
function cleanString(str: string | undefined): string {
	if (!str) return '';
	// Remove zero-width spaces and other invisible characters
	return str.replace(/[\u200B-\u200D\uFEFF\u00A0]/g, '').trim();
}

export const GET: RequestHandler = async () => {
	try {
		// Fetch site settings (singleton document)
		const query = `*[_type == "siteSettings"][0]`;
		const settings = await sanityClient.fetch(query);

		if (!settings) {
			// Return default structure if no settings exist yet
			return json({
				contactInfo: {
					email: '',
					phone: null,
				},
				socialLinks: [],
			});
		}

		// Clean social links data
		if (settings.socialLinks && Array.isArray(settings.socialLinks)) {
			settings.socialLinks = settings.socialLinks
				.filter((link: any) => link.platform && link.url) // Filter out invalid links
				.map((link: any) => ({
					platform: cleanString(link.platform),
					url: cleanString(link.url),
					label: link.label ? cleanString(link.label) : undefined,
				}));
		}

		// Clean contact info
		if (settings.contactInfo) {
			settings.contactInfo = {
				email: cleanString(settings.contactInfo.email),
				phone: settings.contactInfo.phone ? cleanString(settings.contactInfo.phone) : null,
			};
		}

		return json(settings);
	} catch (error) {
		console.error('Error fetching site settings:', error);
		return json(
			{
				contactInfo: {
					email: '',
					phone: null,
				},
				socialLinks: [],
			},
			{ status: 500 }
		);
	}
};
