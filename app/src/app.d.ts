// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
import type { SanityLocals } from '@sanity/sveltekit';

declare global {
	namespace App {
		// interface Error {}
		interface Locals extends SanityLocals {}
		// interface PageData {}
		// interface Platform {}
	}
}

export {};


