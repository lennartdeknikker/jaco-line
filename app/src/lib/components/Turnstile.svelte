<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { PUBLIC_TURNSTILE_SITE_KEY } from '$env/static/public';

	interface Props {
		onVerify?: (token: string) => void;
		onError?: () => void;
	}

	const { onVerify, onError }: Props = $props();

	let container = $state<HTMLDivElement | undefined>(undefined);
	let widgetId: string | null = null;
	let turnstileToken = $state<string | null>(null);

	onMount(() => {
		if (!PUBLIC_TURNSTILE_SITE_KEY) {
			console.warn('Turnstile site key not configured');
			return;
		}

		// Check if script already loaded
		if (window.turnstile && container !== undefined) {
			renderWidget();
			return;
		}

		// Load Turnstile script
		const script = document.createElement('script');
		script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
		script.async = true;
		script.defer = true;
		document.head.appendChild(script);

		script.onload = () => {
			renderWidget();
		};
	});

	function renderWidget() {
		if (window.turnstile && container !== undefined && PUBLIC_TURNSTILE_SITE_KEY) {
			widgetId = window.turnstile.render(container, {
				sitekey: PUBLIC_TURNSTILE_SITE_KEY,
				callback: (token: string) => {
					turnstileToken = token;
					onVerify?.(token);
				},
				'error-callback': () => {
					turnstileToken = null;
					onError?.();
				}
			});
		}
	}

	onDestroy(() => {
		if (widgetId && window.turnstile) {
			window.turnstile.remove(widgetId);
		}
	});

	export function reset() {
		if (widgetId && window.turnstile) {
			window.turnstile.reset(widgetId);
			turnstileToken = null;
		}
	}

	export function getToken() {
		return turnstileToken;
	}
</script>

{#if PUBLIC_TURNSTILE_SITE_KEY}
	<div bind:this={container}></div>
{/if}

<style>
	div {
		margin: 1rem 0;
	}
</style>
