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

	interface Window {
		turnstile?: {
			render: (container: HTMLElement, options: {
				sitekey: string;
				callback?: (token: string) => void;
				'error-callback'?: () => void;
			}) => string;
			remove: (widgetId: string) => void;
			reset: (widgetId: string) => void;
		};
	}
}

export {};


