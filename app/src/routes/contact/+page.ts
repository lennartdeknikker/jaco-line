import type { PageLoad } from './$types';

export const ssr = true;

/** Max length of a ?bericht= prefill, so a link can't stuff the form. */
const MAX_PREFILL_LENGTH = 500;

export const load: PageLoad = async ({ fetch, url }) => {
	// Other pages can link here with a prepared message, e.g. /contact?bericht=...
	const prefillMessage = (url.searchParams.get('bericht') ?? '').slice(0, MAX_PREFILL_LENGTH);

	try {
		const response = await fetch('/api/site-settings');
		const settings = response.ok ? await response.json() : null;

		return {
			prefillMessage,
			contactInfo: settings?.contactInfo || {
				email: '',
				phone: null,
			},
		};
	} catch (error) {
		console.error('Error loading contact info:', error);
		return {
			prefillMessage,
			contactInfo: {
				email: '',
				phone: null,
			},
		};
	}
};
