<script lang="ts">
	import type { PageProps } from './$types';
	import type { Workshop } from '$lib/types';
	import Button from '$lib/components/Button.svelte';
	import Turnstile from '$lib/components/Turnstile.svelte';

	const { data }: PageProps = $props();
	let formData = $state({
		name: '',
		email: '',
		phone: '',
		workshopId: ''
	});
	let showForm = $state(false);
	let selectedWorkshop = $state<Workshop | null>(null);
	let submitting = $state(false);
	let submitted = $state(false);
	let error = $state('');
	let turnstileToken = $state<string | null>(null);
	let turnstileComponent = $state<{ reset: () => void } | null>(null);


	function formatDate(dateString: string) {
		const date = new Date(dateString);
		return date.toLocaleDateString('nl-NL', {
			weekday: 'long',
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	}

	function openForm(workshop: Workshop) {
		selectedWorkshop = workshop;
		formData.workshopId = workshop._id;
		showForm = true;
		error = '';
	}

	function closeForm() {
		showForm = false;
		selectedWorkshop = null;
		formData = { name: '', email: '', phone: '', workshopId: '' };
		submitted = false;
		error = '';
		turnstileToken = null;
		turnstileComponent?.reset();
	}

	async function handleSubmit(event: Event) {
		event.preventDefault();
		submitting = true;
		error = '';

		if (!turnstileToken) {
			error = 'Gelieve de CAPTCHA te voltooien.';
			submitting = false;
			return;
		}

		try {
			const response = await fetch('/api/workshops/subscribe', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					...formData,
					turnstileToken
				})
			});

			if (response.ok) {
				submitted = true;
				turnstileToken = null;
				turnstileComponent?.reset();
			} else {
				const errorData = await response.json().catch(() => ({}));
				error = errorData.error || 'Er is iets misgegaan. Probeer het later opnieuw.';
				turnstileComponent?.reset();
				turnstileToken = null;
			}
		} catch (err) {
			error = 'Er is iets misgegaan. Probeer het later opnieuw.';
			turnstileComponent?.reset();
			turnstileToken = null;
		} finally {
			submitting = false;
		}
	}

	function handleTurnstileVerify(token: string) {
		turnstileToken = token;
	}

	function handleTurnstileError() {
		turnstileToken = null;
		error = 'CAPTCHA verificatie mislukt. Probeer het opnieuw.';
	}
</script>

<svelte:head>
	<title>Workshops - JacoLine</title>
	<meta name="description" content="Schrijf je in voor een keramiek workshop bij JacoLine." />
</svelte:head>

<div class="page-header">
	<div class="container">
		<h1>Workshops</h1>
		<p>Leer keramiek maken in een van mijn workshops</p>
	</div>
</div>

<div class="container">
	{#if data.workshops.length > 0}
		<div class="workshops-list">
			{#each data.workshops as workshop}
				<article class="workshop-card">
					<div class="workshop-date">
						<span class="day">{new Date(workshop.date).getDate()}</span>
						<span class="month">{new Date(workshop.date).toLocaleDateString('nl-NL', { month: 'short' })}</span>
					</div>
					<div class="workshop-content">
						<h2>{workshop.title}</h2>
						<p class="workshop-date-text">{formatDate(workshop.date)}</p>
						{#if workshop.time}
							<p class="workshop-time">
								<strong>Tijd:</strong> {workshop.time}
							</p>
						{/if}
						<p class="workshop-location">
							<strong>Locatie:</strong> {workshop.location}
						</p>
						{#if workshop.price}
							<p class="workshop-price">
								<strong>Prijs:</strong> €{workshop.price}
							</p>
						{/if}
					{#if workshop.maxParticipants}
						<p class="workshop-participants">
							<strong>Deelnemers:</strong> {workshop.currentParticipants || 0} / {workshop.maxParticipants}
							{#if workshop.isFull}
								<span class="full-badge">VOL</span>
							{/if}
						</p>
					{/if}
					{#if workshop.description}
						<p class="workshop-description">{workshop.description}</p>
					{/if}
					{#if workshop.isFull}
						<Button variant="primary" disabled={true}>Workshop vol</Button>
					{:else}
						<Button variant="primary" onClick={() => openForm(workshop)}>Inschrijven</Button>
					{/if}
					</div>
				</article>
			{/each}
		</div>
	{:else}
		<div class="empty-state">
			<p>Er zijn momenteel geen geplande workshops.</p>
			<p>Binnenkort meer informatie!</p>
		</div>
	{/if}
</div>

{#if showForm && selectedWorkshop}
	<div
		class="modal-overlay"
		onclick={closeForm}
		onkeydown={(e) => (e.key === 'Escape' || e.key === 'Enter') && closeForm()}
		role="button"
		tabindex="0"
		aria-label="Sluiten"
	>
		<div
			class="modal-content"
			onclick={(e) => e.stopPropagation()}
			role="dialog"
			tabindex="-1"
			aria-labelledby="modal-title"
			onkeydown={(e) => e.key === 'Escape' && closeForm()}
		>
			<button class="modal-close" onclick={closeForm} aria-label="Sluiten">×</button>
			<h2 id="modal-title">Inschrijven voor {selectedWorkshop.title}</h2>
			{#if submitted}
				<div class="success-message">
					<p>Bedankt voor je inschrijving voor <strong>{selectedWorkshop.title}</strong>!</p>
					<p>Je ontvangt binnenkort een bevestiging per e-mail.</p>
					<Button variant="primary" onClick={closeForm}>Sluiten</Button>
				</div>
			{:else}
				<form onsubmit={handleSubmit} class="workshop-form">
					{#if error}
						<div class="error-message">{error}</div>
					{/if}
					<div class="form-group">
						<label for="name">Naam *</label>
						<input type="text" id="name" bind:value={formData.name} required />
					</div>
					<div class="form-group">
						<label for="email">E-mail *</label>
						<input type="email" id="email" bind:value={formData.email} required />
					</div>
					<div class="form-group">
						<label for="phone">Telefoon</label>
						<input type="tel" id="phone" bind:value={formData.phone} />
					</div>
					<Turnstile
						bind:this={turnstileComponent}
						onVerify={handleTurnstileVerify}
						onError={handleTurnstileError}
					/>
					<Button type="submit" variant="primary" disabled={submitting || !turnstileToken}>
						{submitting ? 'Inschrijven...' : 'Inschrijven'}
					</Button>
				</form>
			{/if}
		</div>
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

	.workshops-list {
		display: flex;
		flex-direction: column;
		gap: $spacing-xl;
		margin-bottom: $spacing-3xl;
	}

	.workshop-card {
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

	.workshop-date {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		min-width: 100px;
		background: $color-primary;
		color: white;
		border-radius: $border-radius-lg;
		padding: $spacing-lg;

		.day {
			font-size: 2.5rem;
			font-weight: $font-weight-bold;
			line-height: 1;
		}

		.month {
			font-size: $font-size-base;
			text-transform: uppercase;
			margin-top: $spacing-xs;
		}
	}

	.workshop-content {
		flex: 1;
	}

	.workshop-date-text {
		color: $color-text-light;
		margin: $spacing-xs 0;
	}

	.workshop-time,
	.workshop-location,
	.workshop-price,
	.workshop-participants {
		margin: $spacing-sm 0;
		color: $color-text;
		display: flex;
		align-items: center;
		gap: $spacing-xs;
	}

	.full-badge {
		display: inline-block;
		padding: $spacing-xs $spacing-sm;
		background: $color-error;
		color: white;
		border-radius: $border-radius-sm;
		font-size: $font-size-small;
		font-weight: $font-weight-bold;
		margin-left: $spacing-xs;
	}

	.workshop-description {
		margin: $spacing-md 0;
		color: $color-text-light;
		line-height: $line-height-base;
	}

	.empty-state {
		text-align: center;
		padding: $spacing-3xl 0;
		color: $color-text-light;
	}

	.modal-overlay {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.5);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 1000;
		padding: $spacing-lg;
	}

	.modal-content {
		background: $color-background;
		border-radius: $border-radius-lg;
		padding: $spacing-2xl;
		max-width: 500px;
		width: 100%;
		position: relative;
		max-height: 90vh;
		overflow-y: auto;
	}

	.modal-close {
		position: absolute;
		top: $spacing-md;
		right: $spacing-md;
		background: none;
		border: none;
		font-size: 2rem;
		cursor: pointer;
		color: $color-text-light;
		width: 40px;
		height: 40px;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: $border-radius-full;
		transition: background $transition-base;

		&:hover {
			background: $color-background-alt;
		}
	}

	.workshop-form {
		display: flex;
		flex-direction: column;
		gap: $spacing-md;
		margin-top: $spacing-lg;
	}

	.form-group {
		display: flex;
		flex-direction: column;
		gap: $spacing-xs;

		label {
			font-weight: $font-weight-medium;
			color: $color-text;
		}

		input {
			padding: $spacing-sm;
			border: 1px solid $color-border;
			border-radius: $border-radius-md;
			font-family: inherit;
			font-size: $font-size-base;
			transition: border-color $transition-base;

			&:focus {
				outline: none;
				border-color: $color-primary;
			}
		}
	}

	.success-message {
		padding: $spacing-lg;
		background: rgba($color-success, 0.1);
		border: 1px solid $color-success;
		border-radius: $border-radius-md;
		color: $color-success;
		text-align: center;
	}

	.error-message {
		padding: $spacing-md;
		background: rgba($color-error, 0.1);
		border: 1px solid $color-error;
		border-radius: $border-radius-md;
		color: $color-error;
	}
</style>

