<script lang="ts">
	import '../styles/global.scss';
	import Nav from '$lib/components/Nav.svelte';
	import Footer from '$lib/components/Footer.svelte';
</script>

<Nav />
<main>
	<slot />
</main>
<Footer />

