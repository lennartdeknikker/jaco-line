import type { PageLoad } from './$types';

export const prerender = false;
export const ssr = true;

export const load: PageLoad = async ({ fetch }) => {
	try {
		const response = await fetch('/api/photo-categories');
		const categories = response.ok ? await response.json() : [];
		return { categories };
	} catch (error) {
		console.error('Error loading photo categories:', error);
		return { categories: [] };
	}
};
