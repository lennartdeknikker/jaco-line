<script lang="ts">
	import type { PageProps } from './$types';
	import Button from '$lib/components/Button.svelte';

	const { data }: PageProps = $props();
</script>

<svelte:head>
	<title>JacoLine - Handgemaakt Keramiek</title>
	<meta name="description" content="Ontdek handgemaakt keramiek van JacoLine. Bezoek onze marktkraam op verschillende evenementen." />
	<meta property="og:title" content="JacoLine - Handgemaakt Keramiek" />
	<meta property="og:description" content="Ontdek handgemaakt keramiek van JacoLine. Bezoek onze marktkraam op verschillende evenementen." />
</svelte:head>

<section class="hero">
	<div class="container">
		<div class="hero-content">
			<img src="/images/jaco-line-logo.png" alt="JacoLine" class="hero-logo" />
			<p class="subtitle">Handgemaakt keramiek met passie en aandacht voor detail</p>
			<div class="hero-actions">
				<Button href="/evenementen" variant="primary">Bekijk evenementen</Button>
				<Button href="/galerij" variant="secondary">Bekijk werk</Button>
			</div>
		</div>
	</div>
</section>

<section class="featured-events">
	<div class="container">
		<h2>Komende evenementen</h2>
		{#if data.events.length > 0}
			<div class="events-grid">
				{#each data.events as event}
					<article class="event-card">
						<div class="event-date">
							<span class="day">{new Date(event.date).getDate()}</span>
							<span class="month">{new Date(event.date).toLocaleDateString('nl-NL', { month: 'short' })}</span>
						</div>
						<div class="event-content">
							<h3>{event.title}</h3>
							<p class="event-location">{event.location}</p>
							<p class="event-description">{event.description}</p>
						</div>
					</article>
				{/each}
			</div>
			<div class="section-actions">
				<Button href="/evenementen">Alle evenementen</Button>
			</div>
		{:else}
			<p>Binnenkort meer evenementen!</p>
		{/if}
	</div>
</section>

<section class="featured-gallery">
	<div class="container">
		<h2>Bekijk mijn werk</h2>
		{#if data.images.length > 0}
			<div class="gallery-grid">
				{#each data.images as image}
					<a href="/galerij" class="gallery-item">
						<img src={image.imageUrl || '/images/foto1.jpg'} alt={image.alt || 'Keramiek werk'} />
					</a>
				{/each}
			</div>
			<div class="section-actions">
				<Button href="/galerij">Bekijk volledige galerij</Button>
			</div>
		{:else}
			<div class="gallery-grid">
				<img src="/images/foto1.jpg" alt="Keramiek werk" />
				<img src="/images/foto2.jpg" alt="Keramiek werk" />
				<img src="/images/foto3.jpg" alt="Keramiek werk" />
			</div>
		{/if}
	</div>
</section>

<style lang="scss">
	@use '../styles/variables' as *;

	.hero {
		background: linear-gradient(135deg, $color-accent 0%, $color-secondary 100%);
		padding: $spacing-3xl 0;
		text-align: center;

		@media (max-width: $breakpoint-md) {
			padding: $spacing-2xl 0;
		}
	}

	.hero-content {
		max-width: 800px;
		margin: 0 auto;
	}

	.hero-logo {
		max-width: 300px;
		width: 300px;
		height: 300px;
		margin: 0 auto $spacing-md;
		display: block;
		padding: 2px;
		background: rgba(255, 255, 255, 0.1);
		border-radius: 50%;
		object-fit: contain;

		@media (max-width: $breakpoint-md) {
			max-width: 280px;
			width: 280px;
			height: 280px;
		}
	}

	.subtitle {
		font-size: $font-size-large;
		margin-bottom: $spacing-xl;
		color: $color-text-light;
	}

	.hero-actions {
		display: flex;
		gap: $spacing-md;
		justify-content: center;
		flex-wrap: wrap;
	}

	.featured-events,
	.featured-gallery {
		padding: $spacing-3xl 0;

		@media (max-width: $breakpoint-md) {
			padding: $spacing-2xl 0;
		}
	}

	.featured-events h2,
	.featured-gallery h2 {
		text-align: center;
		margin-bottom: $spacing-xl;
	}

	.events-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
		gap: $spacing-lg;
		margin-bottom: $spacing-xl;
	}

	.event-card {
		display: flex;
		gap: $spacing-md;
		padding: $spacing-lg;
		background: $color-background-alt;
		border-radius: $border-radius-lg;
		border: 1px solid $color-border;
		transition: transform $transition-base, box-shadow $transition-base;

		&:hover {
			transform: translateY(-4px);
			box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
		}
	}

	.event-date {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		min-width: 80px;
		background: $color-primary;
		color: white;
		border-radius: $border-radius-md;
		padding: $spacing-sm;

		.day {
			font-size: 2rem;
			font-weight: $font-weight-bold;
			line-height: 1;
		}

		.month {
			font-size: $font-size-small;
			text-transform: uppercase;
		}
	}

	.event-content {
		flex: 1;
	}

	.event-location {
		color: $color-text-light;
		font-size: $font-size-small;
		margin-bottom: $spacing-xs;
	}

	.event-description {
		color: $color-text-light;
		font-size: $font-size-small;
		margin-top: $spacing-xs;
	}

	.gallery-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
		gap: $spacing-md;
		margin-bottom: $spacing-xl;
	}

	.gallery-item {
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

	.section-actions {
		text-align: center;
	}
</style>

