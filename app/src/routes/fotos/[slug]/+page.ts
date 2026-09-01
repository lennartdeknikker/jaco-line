import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const prerender = false;
export const ssr = true;

export const load: PageLoad = async ({ params, fetch }) => {
	const response = await fetch(`/api/photo-categories/${params.slug}`);
	if (!response.ok) {
		throw error(404, 'Categorie niet gevonden');
	}
	const { category, images } = await response.json();
	return { category, images };
};
