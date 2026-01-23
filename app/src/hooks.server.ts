import { handlePreviewMode } from '@sanity/sveltekit';
import { redirect } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { serverClient } from '$lib/sanity.server';

export const handle = sequence(
	handlePreviewMode({
		client: serverClient,
		preview: { redirect }
	})
);

