<script lang="ts">
	import type { PageProps } from './$types';
	import type { WorkshopWithSessions, WorkshopSession } from '$lib/types';
	import Button from '$lib/components/Button.svelte';
	import Turnstile from '$lib/components/Turnstile.svelte';

	const { data }: PageProps = $props();

	type WorkshopFromApi = WorkshopWithSessions & {
		mainImageUrl?: string | null;
		imageUrls?: (string | null)[];
	};

	let formData = $state({
		name: '',
		email: '',
		phone: '',
		participantCount: '',
		remarks: '',
		workshopSessionId: ''
	});
	let showForm = $state(false);
	let selectedSession = $state<WorkshopSession | null>(null);
	let selectedWorkshopTitle = $state('');
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

	function getSessionPrice(session: WorkshopSession, defaultPrice?: number): number | undefined {
		return session.price ?? defaultPrice;
	}

	function openForm(session: WorkshopSession, workshopTitle: string) {
		selectedSession = session;
		selectedWorkshopTitle = workshopTitle;
		formData.workshopSessionId = session._id;
		showForm = true;
		error = '';
	}

	function closeForm() {
		showForm = false;
		selectedSession = null;
		selectedWorkshopTitle = '';
		formData = {
			name: '',
			email: '',
			phone: '',
			participantCount: '',
			remarks: '',
			workshopSessionId: ''
		};
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
	<meta property="og:title" content="Workshops - JacoLine" />
	<meta property="og:description" content="Schrijf je in voor een keramiek workshop bij JacoLine." />
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
			{#each data.workshops as workshop (workshop._id)}
				{@const w = workshop as WorkshopFromApi}
				<article class="workshop-card">
					<div class="workshop-text">
						<h2>
							<a href="/workshops/{w.slug?.current ?? w._id}">{w.title}</a>
						</h2>
						{#if w.shortDescription}
							<p class="workshop-short-description">{w.shortDescription}</p>
						{:else if w.description}
							<p class="workshop-short-description">{w.description.slice(0, 150)}{w.description.length > 150 ? '…' : ''}</p>
						{/if}
					</div>
					<a href="/workshops/{w.slug?.current ?? w._id}" class="workshop-image-link">
						{#if w.mainImageUrl}
							<div class="workshop-image" style="background-image: url('{w.mainImageUrl}');"></div>
						{:else}
							<div class="workshop-image workshop-image-placeholder"></div>
						{/if}
					</a>
					<div class="workshop-content">
						<div class="sessions-list">
							<h3>Beschikbare data</h3>
							{#each w.sessions as session (session._id)}
								<div class="session-row">
									<div class="session-date">
										<span class="day">{new Date(session.date).getDate()}</span>
										<span class="month">{new Date(session.date).toLocaleDateString('nl-NL', { month: 'short' })}</span>
									</div>
									<div class="session-details">
										<p class="session-date-text">{formatDate(session.date)}</p>
										{#if session.time}
											<p class="session-meta"><strong>Tijd:</strong> {session.time}</p>
										{/if}
										<p class="session-meta"><strong>Locatie:</strong> {session.location}</p>
										{#if getSessionPrice(session, w.defaultPrice) != null}
											<p class="session-meta"><strong>Prijs:</strong> €{getSessionPrice(session, w.defaultPrice)}</p>
										{/if}
										{#if session.maxParticipants != null}
											<p class="session-meta">
												<strong>Deelnemers:</strong> {session.currentParticipants ?? 0} / {session.maxParticipants}
												{#if session.isFull}
													<span class="full-badge">VOL</span>
												{/if}
											</p>
										{/if}
										{#if session.isFull}
											<Button variant="primary" disabled={true}>Vol</Button>
										{:else}
											<Button variant="primary" onClick={() => openForm(session, w.title)}>Inschrijven</Button>
										{/if}
									</div>
								</div>
							{/each}
						</div>
						<a href="/workshops/{w.slug?.current ?? w._id}" class="link-more">Meer info en foto's →</a>
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

{#if showForm && selectedSession && selectedWorkshopTitle}
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
			<h2 id="modal-title">Inschrijven voor {selectedWorkshopTitle}</h2>
			<p class="modal-session-date">{selectedSession ? formatDate(selectedSession.date) : ''}{#if selectedSession?.time} – {selectedSession.time}{/if}</p>
			{#if submitted}
				<div class="success-message">
					<p>Bedankt voor je inschrijving voor <strong>{selectedWorkshopTitle}</strong>!</p>
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
						<label for="phone">Telefoon *</label>
						<input type="tel" id="phone" bind:value={formData.phone} required />
					</div>
					<div class="form-group">
						<label for="participantCount">Aantal deelnemers</label>
						<input
							type="number"
							id="participantCount"
							min="0"
							max="20"
							placeholder="0"
							bind:value={formData.participantCount}
						/>
					</div>
					<div class="form-group">
						<label for="remarks">Opmerkingen</label>
						<textarea id="remarks" bind:value={formData.remarks} rows="3"></textarea>
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
	@use 'sass:color';
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
		gap: $spacing-2xl;
		margin-bottom: $spacing-3xl;
	}

	.workshop-card {
		display: grid;
		grid-template-columns: 1fr 280px;
		grid-template-rows: auto auto;
		gap: $spacing-xl;
		padding: $spacing-xl;
		background: $color-background-alt;
		border-radius: $border-radius-lg;
		border: 1px solid $color-border;
		transition: box-shadow $transition-base;

		&:hover {
			box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
		}

		@media (max-width: $breakpoint-md) {
			grid-template-columns: 1fr;
			grid-template-rows: auto auto auto;
		}
	}

	.workshop-text {
		grid-column: 1;
		grid-row: 1;
		min-width: 0;

		@media (max-width: $breakpoint-md) {
			grid-column: 1;
			grid-row: 1;
		}
	}

	.workshop-image-link {
		grid-column: 2;
		grid-row: 1;
		display: flex;
		align-items: center;
		justify-content: center;
		min-height: 200px;
		background: $color-background-alt;

		@media (max-width: $breakpoint-md) {
			grid-column: 1;
			grid-row: 2;
		}
	}

	.workshop-image {
		width: 100%;
		height: 200px;
		background-size: cover;
		background-position: center;
	}

	.workshop-image-placeholder {
		background: linear-gradient(135deg, $color-border 0%, color.adjust($color-border, $lightness: -10%) 100%);
	}

	.workshop-content {
		grid-column: 1 / -1;
		grid-row: 2;
		display: flex;
		flex-direction: column;
		gap: $spacing-md;
		padding: 0;
		min-width: 0;

		@media (max-width: $breakpoint-md) {
			grid-row: 3;
		}
	}

	.workshop-text h2 {
		margin: 0 0 $spacing-sm 0;
		font-size: 1.5rem;

		a {
			color: inherit;
			text-decoration: none;

			&:hover {
				text-decoration: underline;
			}
		}
	}

	.workshop-text .workshop-short-description {
		color: $color-text-light;
		margin: 0;
		line-height: $line-height-base;
	}

	.sessions-list {
		margin-top: $spacing-sm;
	}

	.sessions-list h3 {
		font-size: $font-size-base;
		margin: 0 0 $spacing-sm 0;
		color: $color-text-light;
	}

	.session-row {
		display: flex;
		gap: $spacing-lg;
		align-items: flex-start;
		padding: $spacing-md 0;
		border-bottom: 1px solid $color-border;

		&:last-child {
			border-bottom: none;
		}
	}

	.session-date {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		min-width: 70px;
		background: $color-primary;
		color: white;
		border-radius: $border-radius-md;
		padding: $spacing-sm;

		.day {
			font-size: 1.75rem;
			font-weight: $font-weight-bold;
			line-height: 1;
		}

		.month {
			font-size: $font-size-small;
			text-transform: uppercase;
			margin-top: $spacing-xs;
		}
	}

	.session-details {
		flex: 1;
	}

	.session-date-text {
		color: $color-text-light;
		margin: 0 0 $spacing-xs 0;
	}

	.session-meta {
		margin: $spacing-xs 0;
		display: flex;
		align-items: center;
		gap: $spacing-xs;
		flex-wrap: wrap;
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

	.link-more {
		margin-top: auto;
		color: $color-primary;
		font-weight: $font-weight-medium;
		text-decoration: none;

		&:hover {
			text-decoration: underline;
		}
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

	.modal-session-date {
		color: $color-text-light;
		margin: -$spacing-sm 0 $spacing-md 0;
		font-size: $font-size-base;
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

		input,
		textarea {
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

		textarea {
			resize: vertical;
			min-height: 4rem;
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
