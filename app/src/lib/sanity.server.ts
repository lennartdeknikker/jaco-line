import { SANITY_API_TOKEN } from '$env/static/private';
import { client } from '$lib/sanity';
import imageUrlBuilder from '@sanity/image-url';

// Server-only Sanity client with API token. Use perspective: 'published' so the deployed site
// only shows published content; drafts are not exposed until you publish in the CMS.
export const serverClient = client.withConfig({
	token: SANITY_API_TOKEN,
	perspective: 'published'
});

// Image URL builder for Sanity images
const builder = imageUrlBuilder(client);

export function urlFor(source: any) {
	return builder.image(source);
}

// Export serverClient as sanityClient for API routes (has write permissions)
export { serverClient as sanityClient };
