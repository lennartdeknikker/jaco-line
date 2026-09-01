<script lang="ts">
	import type { PageProps } from './$types';
	import type { PhotoCategoryCard } from '$lib/types';

	const { data }: PageProps = $props();

	const categories = $derived(data.categories as PhotoCategoryCard[]);
	const pageHeaderIntro = $derived(data.pageHeaders?.galerijIntro as string);
</script>

<svelte:head>
	<title>Foto's - JacoLine</title>
	<meta name="description" content="Bekijk de collectie handgemaakt keramiek van JacoLine." />
	<meta property="og:title" content="Foto's - JacoLine" />
	<meta property="og:description" content="Bekijk de collectie handgemaakt keramiek van JacoLine." />
</svelte:head>

<div class="page-header">
	<div class="container">
		<h1>Foto's</h1>
		{#if pageHeaderIntro}
			<p>{pageHeaderIntro}</p>
		{/if}
	</div>
</div>

<div class="container">
	{#if categories.length > 0}
		<div class="category-grid">
			{#each categories as category (category._id)}
				<a class="category-card" href="/fotos/{category.slug.current}">
					<div class="category-image">
						{#if category.coverUrl}
							<img src={category.coverUrl} alt={category.name} loading="lazy" />
						{:else}
							<div class="category-image-placeholder"></div>
						{/if}
					</div>
					<div class="category-body">
						<h2>{category.name}</h2>
						<p class="category-count">
							{category.count}
							{category.count === 1 ? 'foto' : "foto's"}
						</p>
						{#if category.description}
							<p class="category-description">{category.description}</p>
						{/if}
					</div>
				</a>
			{/each}
		</div>
	{:else}
		<p class="no-images">Er zijn nog geen foto's beschikbaar.</p>
	{/if}
</div>

<style lang="scss">
	@use '../../styles/variables' as *;

	.page-header {
		background: linear-gradient(135deg, $color-accent 0%, $color-secondary 100%);
		padding: $spacing-2xl 0;
		text-align: center;
		margin-bottom: $spacing-3xl;
	}

	.page-header h1 {
		margin-bottom: $spacing-sm;
	}

	.page-header p {
		color: $color-text-light;
		font-size: $font-size-large;
	}

	.no-images {
		text-align: center;
		color: $color-text-light;
		padding: $spacing-2xl 0;
	}

	.category-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
		gap: $spacing-lg;
		margin-bottom: $spacing-3xl;

		@media (max-width: $breakpoint-md) {
			grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
			gap: $spacing-md;
		}
	}

	.category-card {
		display: flex;
		flex-direction: column;
		text-decoration: none;
		color: inherit;
		border-radius: $border-radius-lg;
		overflow: hidden;
		background: $color-background-alt;
		border: 1px solid $color-border;
		transition:
			transform $transition-base,
			box-shadow $transition-base;

		&:hover,
		&:focus-visible {
			transform: translateY(-4px);
			box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);

			img {
				transform: scale(1.05);
			}
		}
	}

	.category-image {
		aspect-ratio: 1;
		overflow: hidden;

		img {
			width: 100%;
			height: 100%;
			object-fit: cover;
			transition: transform $transition-base;
		}
	}

	.category-image-placeholder {
		width: 100%;
		height: 100%;
		background: linear-gradient(135deg, $color-accent 0%, $color-secondary 100%);
	}

	.category-body {
		padding: $spacing-md;
	}

	.category-body h2 {
		font-size: $font-size-h4;
		margin-bottom: $spacing-xs;
	}

	.category-count {
		color: $color-text-light;
		font-size: $font-size-small;
	}

	.category-description {
		margin-top: $spacing-xs;
		color: $color-text-light;
	}
</style>
