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

<section
	class="hero"
	style={(() => {
		const d = data as any;
		const url = d?.heroBackgroundImageUrl;
		if (!url) return '';
		const fp = d?.heroBackgroundImageFocalPoint;
		const x = fp ? Math.round((fp.x ?? 0.5) * 100) : 50;
		const y = fp ? Math.round((fp.y ?? 0.5) * 100) : 50;
		return `--hero-bg: url(${url}); --hero-focus-x: ${x}%; --hero-focus-y: ${y}%;`;
	})()}
>
	<div class="container">
		<div class="hero-content">
			<p class="subtitle">{(data as any).pageHeaders?.homeSubtitle || 'Handgemaakt keramiek met passie en aandacht voor detail'}</p>
			<div class="hero-actions">
				<Button href="/workshops" variant="primary">Workshops</Button>
				<Button href="/evenementen" variant="secondary">Evenementen</Button>
			</div>
		</div>
	</div>
</section>

{#if (data as any).aboutSection?.title || (data as any).aboutSection?.text || (data as any).aboutSection?.imageUrl}
	{@const about = (data as any).aboutSection}
	<section class="about-section">
		<div class="container">
			<div class="about-inner">
				{#if about?.imageUrl}
					<div class="about-image">
						<img src={about.imageUrl} alt="Over mij" />
					</div>
				{/if}
				<div class="about-content">
					{#if about?.title}
						<h2>{about.title}</h2>
					{/if}
					{#if about?.text}
						<div class="about-text">
							{#each about.text.split(/\n\n+/).filter(Boolean) as paragraph}
								<p>{paragraph.replace(/\n/g, ' ')}</p>
							{/each}
						</div>
					{/if}
				</div>
			</div>
		</div>
	</section>
{/if}

<section class="featured-events">
	<div class="container">
		<h2>Komende evenementen</h2>
		{#if data.events.length > 0}
			<div class="events-grid">
				{#each data.events as event}
					<article class="event-card">
						<div class="event-card-top">
							<div class="event-date">
								<span class="day">{new Date(event.date).getDate()}</span>
								<span class="month">{new Date(event.date).toLocaleDateString('nl-NL', { month: 'short' })}</span>
							</div>
							<div class="event-content">
								<h3>{event.title}</h3>
								<p class="event-location">{event.location}</p>
								{#if event.description}
									<p class="event-description">{event.description}</p>
								{/if}
							</div>
						</div>
						{#if event.imageUrl}
							<div class="event-card-image">
								<img src={event.imageUrl} alt={event.title} />
							</div>
						{/if}
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
		position: relative;
		padding: $spacing-3xl 0;
		text-align: center;
		background: linear-gradient(135deg, $color-accent 0%, $color-secondary 100%);

		&[style*='--hero-bg'] {
			background-image: linear-gradient(
				to bottom,
				rgba(0, 0, 0, 0) 0%,
				rgba(0, 0, 0, 0.4) 60%,
				rgba(0, 0, 0, 0.85) 100%
			), var(--hero-bg);
			background-size: cover;
			background-position: var(--hero-focus-x, 50%) var(--hero-focus-y, 50%);
		}

		@media (min-width: $breakpoint-lg) {
			padding: 16rem 0;
		}

		@media (max-width: $breakpoint-md) {
			padding: $spacing-2xl 0;
		}
	}

	.hero-content {
		max-width: 800px;
		margin: 0 auto;
		position: relative;
		z-index: 1;
	}

	.hero[style*='--hero-bg'] .subtitle {
		color: rgba(255, 255, 255, 0.95);
		text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
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

	.about-section {
		padding: $spacing-3xl 0;

		@media (max-width: $breakpoint-md) {
			padding: $spacing-2xl 0;
		}
	}

	.about-inner {
		display: flex;
		gap: $spacing-2xl;
		flex-wrap: wrap;
		align-items: start;
		max-width: 900px;
		margin: 0 auto;

		@media (max-width: $breakpoint-md) {
			gap: $spacing-xl;
		}
	}

	.about-image {
		width: 280px;
		flex-shrink: 0;

		@media (max-width: $breakpoint-md) {
			width: 100%;
			max-width: 320px;
			margin: 0 auto;
		}

		img {
			width: 100%;
			height: auto;
			display: block;
			border-radius: $border-radius-lg;
			object-fit: cover;
		}
	}

	.about-content {
		flex: 1;
		min-width: 0;
	}

	.about-content h2 {
		margin: 0 0 $spacing-md 0;
		color: $color-primary;
	}

	.about-text {
		color: $color-text-light;
		line-height: $line-height-base;

		p {
			margin: 0 0 $spacing-md 0;

			&:last-child {
				margin-bottom: 0;
			}
		}
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
		align-items: start;
	}

	.event-card {
		display: flex;
		flex-direction: column;
		padding: 0;
		overflow: hidden;
		background: $color-background-alt;
		border-radius: $border-radius-lg;
		border: 1px solid $color-border;
		transition: transform $transition-base, box-shadow $transition-base;

		&:hover {
			transform: translateY(-4px);
			box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
		}
	}

	.event-card-top {
		display: flex;
		gap: $spacing-md;
		padding: $spacing-lg;
	}

	.event-date {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
		width: 70px;
		height: 70px;
		background: $color-primary;
		color: white;
		border-radius: $border-radius-md;

		.day {
			font-size: 1.5rem;
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
		min-width: 0;
	}

	.event-card-image {
		width: 100%;
		background: $color-border;

		img {
			width: 100%;
			height: auto;
			display: block;
		}
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

