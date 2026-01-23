import { SANITY_API_TOKEN } from '$env/static/private';
import { client } from '$lib/sanity';
import imageUrlBuilder from '@sanity/image-url';

// Server-only Sanity client with API token for fetching draft content and write operations
export const serverClient = client.withConfig({
	token: SANITY_API_TOKEN
});

// Image URL builder for Sanity images
const builder = imageUrlBuilder(client);

export function urlFor(source: any) {
	return builder.image(source);
}

// Export serverClient as sanityClient for API routes (has write permissions)
export { serverClient as sanityClient };
