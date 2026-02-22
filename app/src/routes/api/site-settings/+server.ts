import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { sanityClient, urlFor } from '$lib/sanity.server';

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
				notificationEmail: null,
				workshopNotificationEnabled: false,
				contactFormNotificationEnabled: false,
				newsletterNotificationEnabled: false,
				heroBackgroundImageUrl: null,
				heroBackgroundImageFocalPoint: null,
				heroLogoImageUrl: null,
				pageHeaders: null,
				aboutSection: null,
			});
		}

		// Resolve hero image URLs and focal point for frontend
		const heroImage = settings.heroBackgroundImage;
		const heroBackgroundImageUrl = heroImage
			? urlFor(heroImage).width(1920).url()
			: null;
		// Sanity hotspot: { x, y, width, height } (0–1). Focal point = center of hotspot for background-position.
		const hotspot = heroImage?.hotspot;
		const heroBackgroundImageFocalPoint =
			heroImage && hotspot
				? {
						x: (hotspot.x ?? 0) + (hotspot.width ?? 0) / 2,
						y: (hotspot.y ?? 0) + (hotspot.height ?? 0) / 2
					}
				: heroImage
					? { x: 0.5, y: 0.5 }
					: null;
		const heroLogoImageUrl = settings.heroLogoImage
			? urlFor(settings.heroLogoImage).width(400).url()
			: null;
		const pageHeaders = settings.pageHeaders || null;

		// Over mij sectie (homepagina)
		const rawAbout = settings.aboutSection;
		const aboutSection =
			rawAbout && (rawAbout.title || rawAbout.text || rawAbout.image)
				? {
						title: rawAbout.title || null,
						text: rawAbout.text || null,
						imageUrl: rawAbout.image
							? urlFor(rawAbout.image).width(600).url()
							: null,
					}
				: null;

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

		// Clean notification email (optional, for internal use)
		if (settings.notificationEmail != null) {
			settings.notificationEmail = cleanString(settings.notificationEmail) || null;
		}

		return json({
			...settings,
			heroBackgroundImageUrl,
			heroBackgroundImageFocalPoint,
			heroLogoImageUrl,
			pageHeaders,
			aboutSection,
		});
	} catch (error) {
		console.error('Error fetching site settings:', error);
		return json(
			{
				contactInfo: {
					email: '',
					phone: null,
				},
				socialLinks: [],
				notificationEmail: null,
				workshopNotificationEnabled: false,
				contactFormNotificationEnabled: false,
				newsletterNotificationEnabled: false,
				heroBackgroundImageUrl: null,
				heroBackgroundImageFocalPoint: null,
				heroLogoImageUrl: null,
				pageHeaders: null,
				aboutSection: null,
			},
			{ status: 500 }
		);
	}
};
