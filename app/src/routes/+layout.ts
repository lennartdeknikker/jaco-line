import type { LayoutLoad } from './$types';

// SSR enabled for Sanity CMS integration
export const ssr = true;

export const load: LayoutLoad = async ({data}) => {
	return {
		...data,
		test: 'test'
	};
};


