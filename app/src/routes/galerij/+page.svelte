<script lang="ts">
	import type { PageProps } from './$types';
	import type { GalleryImage } from '$lib/types';

	const { data }: PageProps = $props();
	let selectedImage = $state<GalleryImage | null>(null);

	function openLightbox(image: GalleryImage) {
		selectedImage = image;
	}

	function closeLightbox() {
		selectedImage = null;
	}
</script>

<svelte:head>
	<title>Galerij - Jaco Line</title>
	<meta name="description" content="Bekijk de collectie handgemaakt keramiek van Jaco Line." />
</svelte:head>

<div class="page-header">
	<div class="container">
		<h1>Galerij</h1>
		<p>Een overzicht van mijn handgemaakte keramiek</p>
	</div>
</div>

<div class="container">
	{#if data.images.length > 0}
		<div class="gallery-grid">
			{#each data.images as image}
				<button
					class="gallery-item"
					onclick={() => openLightbox(image)}
					aria-label={image.alt || 'Keramiek werk'}
				>
					<img
						src={image.imageUrl || '/images/foto1.jpg'}
						alt={image.alt || 'Keramiek werk'}
						loading="lazy"
					/>
				</button>
			{/each}
		</div>
	{:else}
		<div class="gallery-grid">
			<img src="/images/foto1.jpg" alt="Keramiek werk" />
			<img src="/images/foto2.jpg" alt="Keramiek werk" />
			<img src="/images/foto3.jpg" alt="Keramiek werk" />
			<img src="/images/foto4.jpg" alt="Keramiek werk" />
		</div>
	{/if}
</div>

{#if selectedImage}
	<div
		class="lightbox"
		onclick={closeLightbox}
		onkeydown={(e) => (e.key === 'Escape' || e.key === 'Enter') && closeLightbox()}
		role="button"
		tabindex="0"
		aria-label="Sluiten"
	>
		<button class="lightbox-close" onclick={closeLightbox} aria-label="Sluiten">×</button>
		<img
			src={selectedImage.imageUrl || '/images/foto1.jpg'}
			alt={selectedImage.alt || 'Keramiek werk'}
			class="lightbox-image"
		/>
	</div>
{/if}

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

	.gallery-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
		gap: $spacing-lg;
		margin-bottom: $spacing-3xl;

		@media (max-width: $breakpoint-md) {
			grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
			gap: $spacing-md;
		}
	}

	.gallery-item {
		background: none;
		border: none;
		padding: 0;
		cursor: pointer;
		overflow: hidden;
		border-radius: $border-radius-lg;
		aspect-ratio: 1;
		transition: transform $transition-base;

		&:hover {
			transform: scale(1.05);
		}

		img {
			width: 100%;
			height: 100%;
			object-fit: cover;
		}
	}

	.lightbox {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.9);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 1000;
		padding: $spacing-xl;
		cursor: pointer;
	}

	.lightbox-close {
		position: absolute;
		top: $spacing-lg;
		right: $spacing-lg;
		background: rgba(255, 255, 255, 0.2);
		border: none;
		color: white;
		font-size: 3rem;
		width: 50px;
		height: 50px;
		border-radius: $border-radius-full;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: background $transition-base;
		z-index: 1001;

		&:hover {
			background: rgba(255, 255, 255, 0.3);
		}
	}

	.lightbox-image {
		max-width: 90%;
		max-height: 90%;
		object-fit: contain;
		border-radius: $border-radius-lg;
		cursor: default;
	}
</style>

