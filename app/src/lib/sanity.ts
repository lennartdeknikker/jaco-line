import { createClient } from '@sanity/sveltekit';
import {
	PUBLIC_SANITY_DATASET,
	PUBLIC_SANITY_PROJECT_ID,
	PUBLIC_SANITY_STUDIO_URL,
	PUBLIC_SANITY_STEGA_ENABLED
} from '$env/static/public';

export const client = createClient({
	projectId: PUBLIC_SANITY_PROJECT_ID,
	dataset: PUBLIC_SANITY_DATASET,
	apiVersion: '2024-01-01',
	useCdn: true,
	stega: {
		enabled: PUBLIC_SANITY_STEGA_ENABLED === 'true',
		studioUrl: PUBLIC_SANITY_STUDIO_URL
	}
});
