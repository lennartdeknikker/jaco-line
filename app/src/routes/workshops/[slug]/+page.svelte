<script lang="ts">
	import type { PageProps } from './$types';
	import type { WorkshopSession } from '$lib/types';
	import Button from '$lib/components/Button.svelte';
	import Turnstile from '$lib/components/Turnstile.svelte';

	const { data }: PageProps = $props();

	type WorkshopDetail = {
		_id: string;
		title: string;
		slug?: { current: string };
		description?: string;
		shortDescription?: string;
		mainImageUrl?: string | null;
		imageUrls?: Array<{ url: string | null; alt: string }>;
		defaultPrice?: number;
		sessions: WorkshopSession[];
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
	let submitting = $state(false);
	let submitted = $state(false);
	let error = $state('');
	let turnstileToken = $state<string | null>(null);
	let turnstileComponent = $state<{ reset: () => void } | null>(null);
	let lightboxIndex = $state<number | null>(null);

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

	function openForm(session: WorkshopSession) {
		selectedSession = session;
		formData.workshopSessionId = session._id;
		showForm = true;
		error = '';
	}

	function closeForm() {
		showForm = false;
		selectedSession = null;
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
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ ...formData, turnstileToken })
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

	const workshop = data.workshop as WorkshopDetail | null;
	const galleryImages = workshop?.mainImageUrl
		? [
				{ url: workshop.mainImageUrl, alt: workshop.title },
				...(workshop.imageUrls ?? []).map((img) => ({ url: img.url, alt: img.alt || workshop.title }))
			].filter((img) => img.url)
		: (workshop?.imageUrls ?? []).filter((img) => img.url).map((img) => ({ url: img.url!, alt: img.alt || (workshop?.title ?? '') }));
</script>

<svelte:head>
	<title>{workshop ? `${workshop.title} - Workshops` : 'Workshop'} - JacoLine</title>
	<meta name="description" content={workshop?.shortDescription ?? (workshop?.description?.slice(0, 160) ?? 'Workshop bij JacoLine')} />
	<meta property="og:title" content={workshop ? `${workshop.title} - Workshops - JacoLine` : 'Workshop - JacoLine'} />
	<meta property="og:description" content={workshop?.shortDescription ?? (workshop?.description?.slice(0, 160) ?? 'Workshop bij JacoLine')} />
	{#if workshop?.mainImageUrl}
		<meta property="og:image" content={workshop.mainImageUrl} />
	{/if}
</svelte:head>

{#if !workshop}
	<div class="container">
		<div class="not-found">
			<h1>Workshop niet gevonden</h1>
			<p><a href="/workshops">Terug naar overzicht</a></p>
		</div>
	</div>
{:else}
	<div class="page-header">
		<div class="container">
			<p class="breadcrumb"><a href="/workshops">Workshops</a> / {workshop.title}</p>
			<h1>{workshop.title}</h1>
		</div>
	</div>

	<div class="container">
		{#if workshop.mainImageUrl}
			<div class="workshop-hero">
				<img src={workshop.mainImageUrl} alt={workshop.title} />
			</div>
		{/if}

		{#if workshop.description}
			<div class="workshop-description">
				<h2>Over deze workshop</h2>
				<p>{workshop.description}</p>
			</div>
		{/if}

		{#if galleryImages.length > 0}
			<div class="workshop-gallery">
				<h2>Foto's</h2>
				<div class="gallery-grid">
					{#each galleryImages as img, i}
						{#if img.url}
							<button
								class="gallery-item"
								onclick={() => (lightboxIndex = i)}
								aria-label={img.alt}
							>
								<img src={img.url} alt={img.alt} loading="lazy" />
							</button>
						{/if}
					{/each}
				</div>
			</div>
		{/if}

		<div class="workshop-sessions">
			<h2>Beschikbare data</h2>
			{#if workshop.sessions.length > 0}
				<div class="sessions-list">
					{#each workshop.sessions as session (session._id)}
						<div class="session-card">
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
								{#if getSessionPrice(session, workshop.defaultPrice) != null}
									<p class="session-meta"><strong>Prijs:</strong> €{getSessionPrice(session, workshop.defaultPrice)}</p>
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
									<Button variant="primary" onClick={() => openForm(session)}>Inschrijven</Button>
								{/if}
							</div>
						</div>
					{/each}
				</div>
			{:else}
				<p class="no-sessions">Er zijn momenteel geen geplande data voor deze workshop.</p>
			{/if}
		</div>
	</div>

	{#if showForm && selectedSession}
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
				<h2 id="modal-title">Inschrijven voor {workshop.title}</h2>
				<p class="modal-session-date">{formatDate(selectedSession.date)}{#if selectedSession.time} – {selectedSession.time}{/if}</p>
				{#if submitted}
					<div class="success-message">
						<p>Bedankt voor je inschrijving!</p>
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
							<input type="number" id="participantCount" min="0" max="20" placeholder="0" bind:value={formData.participantCount} />
						</div>
						<div class="form-group">
							<label for="remarks">Opmerkingen</label>
							<textarea id="remarks" bind:value={formData.remarks} rows="3"></textarea>
						</div>
						<Turnstile bind:this={turnstileComponent} onVerify={handleTurnstileVerify} onError={handleTurnstileError} />
						<Button type="submit" variant="primary" disabled={submitting || !turnstileToken}>
							{submitting ? 'Inschrijven...' : 'Inschrijven'}
						</Button>
					</form>
				{/if}
			</div>
		</div>
	{/if}

	{#if lightboxIndex !== null && galleryImages[lightboxIndex]?.url}
		<div
			class="lightbox"
			onclick={() => (lightboxIndex = null)}
			onkeydown={(e) => e.key === 'Escape' && (lightboxIndex = null)}
			role="button"
			tabindex="0"
			aria-label="Sluiten"
		>
			<button class="lightbox-close" onclick={() => (lightboxIndex = null)} aria-label="Sluiten">×</button>
			<img src={galleryImages[lightboxIndex].url} alt={galleryImages[lightboxIndex].alt} class="lightbox-image" />
		</div>
	{/if}
{/if}

<style lang="scss">
	@use '../../../styles/variables' as *;

	.page-header {
		background: linear-gradient(135deg, $color-accent 0%, $color-secondary 100%);
		padding: $spacing-2xl 0;
		text-align: center;
		margin-bottom: $spacing-3xl;
	}

	.breadcrumb {
		margin: 0 0 $spacing-sm 0;
		font-size: $font-size-small;
		color: $color-text-light;

		a {
			color: inherit;
			text-decoration: none;
			&:hover {
				text-decoration: underline;
			}
		}
	}

	.page-header h1 {
		margin: 0;
	}

	.workshop-hero {
		width: 100%;
		max-height: 480px;
		border-radius: $border-radius-lg;
		overflow: hidden;
		margin-bottom: $spacing-2xl;

		img {
			width: 100%;
			height: 100%;
			object-fit: cover;
		}
	}

	.workshop-description {
		margin-bottom: $spacing-2xl;

		h2 {
			margin-bottom: $spacing-md;
		}

		p {
			white-space: pre-wrap;
			line-height: $line-height-base;
			color: $color-text;
		}
	}

	.workshop-gallery {
		margin-bottom: $spacing-2xl;

		h2 {
			margin-bottom: $spacing-md;
		}
	}

	.gallery-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
		gap: $spacing-md;
	}

	.gallery-item {
		padding: 0;
		border: none;
		background: none;
		cursor: pointer;
		border-radius: $border-radius-md;
		overflow: hidden;
		aspect-ratio: 1;
		display: block;

		img {
			width: 100%;
			height: 100%;
			object-fit: cover;
			display: block;
		}
	}

	.workshop-sessions h2 {
		margin-bottom: $spacing-md;
	}

	.sessions-list {
		display: flex;
		flex-direction: column;
		gap: $spacing-md;
	}

	.session-card {
		display: flex;
		gap: $spacing-lg;
		padding: $spacing-lg;
		background: $color-background-alt;
		border-radius: $border-radius-lg;
		border: 1px solid $color-border;
	}

	.session-date {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		min-width: 80px;
		background: $color-primary;
		color: white;
		border-radius: $border-radius-md;
		padding: $spacing-md;

		.day {
			font-size: 2rem;
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
		margin: 0 0 $spacing-xs 0;
		color: $color-text;
	}

	.session-meta {
		margin: $spacing-xs 0;
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

	.no-sessions {
		color: $color-text-light;
	}

	.not-found {
		text-align: center;
		padding: $spacing-3xl 0;

		a {
			color: $color-primary;
		}
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
	}

	.modal-session-date {
		color: $color-text-light;
		margin: -$spacing-sm 0 $spacing-md 0;
	}

	.workshop-form {
		display: flex;
		flex-direction: column;
		gap: $spacing-md;
		margin-top: $spacing-lg;
	}

	.form-group label {
		font-weight: $font-weight-medium;
	}

	.form-group input,
	.form-group textarea {
		padding: $spacing-sm;
		border: 1px solid $color-border;
		border-radius: $border-radius-md;
		font-family: inherit;
		width: 100%;
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
		z-index: 1001;
		padding: $spacing-lg;
		cursor: pointer;
	}

	.lightbox-close {
		position: absolute;
		top: $spacing-lg;
		right: $spacing-lg;
		background: none;
		border: none;
		color: white;
		font-size: 2rem;
		cursor: pointer;
		z-index: 1;
	}

	.lightbox-image {
		max-width: 100%;
		max-height: 90vh;
		object-fit: contain;
	}
</style>
