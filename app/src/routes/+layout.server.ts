import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals: { sanity }, fetch, url }) => {
	const { previewEnabled } = sanity;

	// Fetch site settings for footer, hero, and page headers
	let socialLinks: Array<{ platform: string; url: string; label?: string }> = [];
	let heroBackgroundImageUrl: string | null = null;
	let heroBackgroundImageFocalPoint: { x: number; y: number } | null = null;
	let heroLogoImageUrl: string | null = null;
	let pageHeaders: Record<string, string> | null = null;
	let aboutSection: { title: string | null; text: string | null; imageUrl: string | null } | null = null;
	try {
		const response = await fetch('/api/site-settings');
		if (response.ok) {
			const settings = await response.json();
			socialLinks = settings?.socialLinks || [];
			heroBackgroundImageUrl = settings?.heroBackgroundImageUrl ?? null;
			heroBackgroundImageFocalPoint = settings?.heroBackgroundImageFocalPoint ?? null;
			heroLogoImageUrl = settings?.heroLogoImageUrl ?? null;
			pageHeaders = settings?.pageHeaders ?? null;
			aboutSection = settings?.aboutSection ?? null;
		}
	} catch (error) {
		console.error('Error loading site settings:', error);
	}

	return {
		previewEnabled,
		socialLinks,
		origin: url.origin,
		heroBackgroundImageUrl,
		heroBackgroundImageFocalPoint,
		heroLogoImageUrl,
		pageHeaders,
		aboutSection,
	};
};


