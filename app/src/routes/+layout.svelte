<script lang="ts">
	import '../styles/global.scss';
	import Nav from '$lib/components/Nav.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import { PreviewMode, VisualEditing } from '@sanity/sveltekit';
	import type { LayoutProps } from './$types';

	const { data, children }: LayoutProps = $props();
</script>

<PreviewMode enabled={data.previewEnabled}>
	<VisualEditing enabled={data.previewEnabled}>
		<Nav />
		<main>
			{@render children()}
		</main>
		<Footer />
	</VisualEditing>
</PreviewMode>


