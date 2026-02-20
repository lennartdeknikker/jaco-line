<script lang="ts">
	import '../styles/global.scss';
	import { onMount } from 'svelte';
	import Nav from '$lib/components/Nav.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import { PreviewMode, VisualEditing } from '@sanity/sveltekit';
	import type { LayoutProps } from './$types';

	const { data, children }: LayoutProps = $props();
	let mounted = $state(false);
	onMount(() => {
		mounted = true;
	});
</script>

{#if mounted}
	<PreviewMode enabled={data.previewEnabled}>
		<VisualEditing enabled={data.previewEnabled}>
			<Nav />
			<main>
				{@render children()}
			</main>
			<Footer socialLinks={data.socialLinks} />
		</VisualEditing>
	</PreviewMode>
{:else}
	<Nav />
	<main>
		{@render children()}
	</main>
	<Footer socialLinks={data.socialLinks} />
{/if}


