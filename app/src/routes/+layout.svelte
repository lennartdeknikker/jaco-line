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

	const ogImage = `${data.origin}/android-chrome-512x512.png`;
	const defaultTitle = 'JacoLine – Handgemaakt keramiek';
	const defaultDescription = 'Ontdek handgemaakt keramiek van JacoLine. Workshops, evenementen en meer.';
</script>

<svelte:head>
	<meta property="og:type" content="website" />
	<meta property="og:title" content={defaultTitle} />
	<meta property="og:description" content={defaultDescription} />
	<meta property="og:image" content={ogImage} />
	<meta property="og:url" content={data.origin} />
	<meta property="og:locale" content="nl_NL" />
	<meta name="twitter:card" content="summary" />
	<meta name="twitter:title" content={defaultTitle} />
	<meta name="twitter:description" content={defaultDescription} />
	<meta name="twitter:image" content={ogImage} />
</svelte:head>

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


