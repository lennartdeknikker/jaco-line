import type { PageLoad } from './$types';

export const ssr = true;

export const load: PageLoad = async ({ fetch }) => {
	try {
		const response = await fetch('/api/site-settings');
		const settings = response.ok ? await response.json() : null;

		return {
			contactInfo: settings?.contactInfo || {
				email: '',
				phone: null,
			},
		};
	} catch (error) {
		console.error('Error loading contact info:', error);
		return {
			contactInfo: {
				email: '',
				phone: null,
			},
		};
	}
};
