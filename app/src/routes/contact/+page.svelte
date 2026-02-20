<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import Turnstile from '$lib/components/Turnstile.svelte';
	import type { PageProps } from './$types';

	const { data }: PageProps = $props();
	const contactInfo = $derived(data.contactInfo);

	let formData = $state({
		name: '',
		email: '',
		message: ''
	});

	let submitting = $state(false);
	let submitted = $state(false);
	let error = $state('');
	let turnstileToken = $state<string | null>(null);
	let turnstileComponent = $state<{ reset: () => void } | null>(null);

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
			const response = await fetch('/api/contact', {
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
				formData = { name: '', email: '', message: '' };
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
	<title>Contact - JacoLine</title>
	<meta name="description" content="Neem contact op met JacoLine voor vragen over keramiek of workshops." />
	<meta property="og:title" content="Contact - JacoLine" />
	<meta property="og:description" content="Neem contact op met JacoLine voor vragen over keramiek of workshops." />
</svelte:head>

<div class="page-header">
	<div class="container">
		<h1>Contact</h1>
		<p>Heb je een vraag? Neem gerust contact op!</p>
	</div>
</div>

<div class="container">
	<div class="contact-content">
		<div class="contact-info">
			<h2>Contactgegevens</h2>
			{#if contactInfo.email}
				<div class="info-item">
					<strong>E-mail:</strong>
					<a href="mailto:{contactInfo.email}">{contactInfo.email}</a>
				</div>
			{/if}
			{#if contactInfo.phone}
				<div class="info-item">
					<strong>Telefoon:</strong>
					<a href="tel:{contactInfo.phone}">{contactInfo.phone}</a>
				</div>
			{/if}
		</div>

		<div class="contact-form-wrapper">
			<h2>Stuur een bericht</h2>
			{#if submitted}
				<div class="success-message">
					<p>Bedankt voor je bericht! Ik neem zo snel mogelijk contact met je op.</p>
				</div>
			{:else}
				<form onsubmit={handleSubmit} class="contact-form">
					{#if error}
						<div class="error-message">{error}</div>
					{/if}
					<div class="form-group">
						<label for="name">Naam</label>
						<input type="text" id="name" bind:value={formData.name} required />
					</div>
					<div class="form-group">
						<label for="email">E-mail</label>
						<input type="email" id="email" bind:value={formData.email} required />
					</div>
					<div class="form-group">
						<label for="message">Bericht</label>
						<textarea id="message" bind:value={formData.message} rows="6" required></textarea>
					</div>
					<Turnstile
						bind:this={turnstileComponent}
						onVerify={handleTurnstileVerify}
						onError={handleTurnstileError}
					/>
					<Button type="submit" variant="primary" disabled={submitting || !turnstileToken}>
						{submitting ? 'Verzenden...' : 'Verzenden'}
					</Button>
				</form>
			{/if}
		</div>
	</div>
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

	.contact-content {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: $spacing-3xl;
		margin-bottom: $spacing-3xl;

		@media (max-width: $breakpoint-md) {
			grid-template-columns: 1fr;
		}
	}

	.contact-info,
	.contact-form-wrapper {
		h2 {
			margin-bottom: $spacing-lg;
			color: $color-primary;
		}
	}

	.info-item {
		margin-bottom: $spacing-md;
		color: $color-text;

		strong {
			display: block;
			margin-bottom: $spacing-xs;
			color: $color-text;
		}

		a {
			color: $color-primary;
		}
	}

	.contact-form {
		display: flex;
		flex-direction: column;
		gap: $spacing-md;
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
		}
	}

	.success-message {
		padding: $spacing-lg;
		background: rgba($color-success, 0.1);
		border: 1px solid $color-success;
		border-radius: $border-radius-md;
		color: $color-success;
	}

	.error-message {
		padding: $spacing-md;
		background: rgba($color-error, 0.1);
		border: 1px solid $color-error;
		border-radius: $border-radius-md;
		color: $color-error;
	}
</style>


