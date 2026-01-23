import { SANITY_VIEWER_TOKEN } from '$env/static/private';
import { client } from '$lib/sanity';
import imageUrlBuilder from '@sanity/image-url';

// Server-only Sanity client with Viewer token for fetching draft content
export const serverClient = client.withConfig({
	token: SANITY_VIEWER_TOKEN
});

// Image URL builder for Sanity images
const builder = imageUrlBuilder(client);

export function urlFor(source: any) {
	return builder.image(source);
}

// Export the regular client for backward compatibility in API routes
export { client as sanityClient };
