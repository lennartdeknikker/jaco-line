<script lang="ts">
	import type { PageProps } from './$types';

	const { data }: PageProps = $props();

	function formatDate(dateString: string) {
		const date = new Date(dateString);
		return date.toLocaleDateString('nl-NL', {
			weekday: 'long',
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	}
</script>

<svelte:head>
	<title>Evenementen - JacoLine</title>
	<meta name="description" content="Bekijk waar je JacoLine kunt vinden op verschillende markten en evenementen." />
</svelte:head>

<div class="page-header">
	<div class="container">
		<h1>Evenementen</h1>
		<p>Kom langs bij mijn marktkraam op deze evenementen</p>
	</div>
</div>

<div class="container">
	{#if data.events.length > 0}
		<div class="events-list">
			{#each data.events as event}
				<article class="event-item">
					<div class="event-date-large">
						<span class="day">{new Date(event.date).getDate()}</span>
						<span class="month">{new Date(event.date).toLocaleDateString('nl-NL', { month: 'short' })}</span>
						<span class="year">{new Date(event.date).getFullYear()}</span>
					</div>
					<div class="event-details">
						<h2>{event.title}</h2>
						<p class="event-date-text">{formatDate(event.date)}</p>
						<p class="event-location">
							<strong>Locatie:</strong> {event.location}
						</p>
						{#if event.description}
							<p class="event-description">{event.description}</p>
						{/if}
					</div>
				</article>
			{/each}
		</div>
	{:else}
		<div class="empty-state">
			<p>Er zijn momenteel geen geplande evenementen.</p>
			<p>Binnenkort meer informatie!</p>
		</div>
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

	.events-list {
		display: flex;
		flex-direction: column;
		gap: $spacing-xl;
		margin-bottom: $spacing-3xl;
	}

	.event-item {
		display: flex;
		gap: $spacing-lg;
		padding: $spacing-xl;
		background: $color-background-alt;
		border-radius: $border-radius-lg;
		border: 1px solid $color-border;
		transition: transform $transition-base, box-shadow $transition-base;

		&:hover {
			transform: translateY(-4px);
			box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
		}

		@media (max-width: $breakpoint-md) {
			flex-direction: column;
		}
	}

	.event-date-large {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		min-width: 120px;
		background: $color-primary;
		color: white;
		border-radius: $border-radius-lg;
		padding: $spacing-lg;

		.day {
			font-size: 3rem;
			font-weight: $font-weight-bold;
			line-height: 1;
		}

		.month {
			font-size: $font-size-base;
			text-transform: uppercase;
			margin-top: $spacing-xs;
		}

		.year {
			font-size: $font-size-small;
			margin-top: $spacing-xs;
		}
	}

	.event-details {
		flex: 1;
	}

	.event-date-text {
		color: $color-text-light;
		margin: $spacing-xs 0;
	}

	.event-location {
		margin: $spacing-sm 0;
		color: $color-text;
	}

	.event-description {
		margin-top: $spacing-md;
		color: $color-text-light;
		line-height: $line-height-base;
	}

	.empty-state {
		text-align: center;
		padding: $spacing-3xl 0;
		color: $color-text-light;
	}
</style>

