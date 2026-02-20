import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals: { sanity }, fetch, url }) => {
	const { previewEnabled } = sanity;

	// Fetch site settings for social links in footer
	let socialLinks: Array<{ platform: string; url: string; label?: string }> = [];
	try {
		const response = await fetch('/api/site-settings');
		if (response.ok) {
			const settings = await response.json();
			socialLinks = settings?.socialLinks || [];
		}
	} catch (error) {
		console.error('Error loading site settings:', error);
	}

	return { previewEnabled, socialLinks, origin: url.origin };
};


