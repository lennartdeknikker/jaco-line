import type { PageLoad } from './$types';

export const prerender = false;
export const ssr = true;

export const load: PageLoad = async ({ params, fetch }) => {
	const slug = params.slug;
	const response = await fetch(`/api/workshops/${slug}`);
	if (!response.ok) {
		return { workshop: null };
	}
	const workshop = await response.json();
	return { workshop };
};
