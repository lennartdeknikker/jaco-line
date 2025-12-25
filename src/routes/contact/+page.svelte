<script lang="ts">
	import { onMount } from 'svelte';
	import Button from '$lib/components/Button.svelte';

	let contactInfo = {
		email: 'info@jaco-line.nl',
		phone: '+31 6 12345678',
		instagram: 'https://instagram.com/jacoline'
	};

	let formData = {
		name: '',
		email: '',
		message: ''
	};

	let submitting = false;
	let submitted = false;
	let error = '';

	async function handleSubmit(event: Event) {
		event.preventDefault();
		submitting = true;
		error = '';

		try {
			const response = await fetch('/api/contact', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(formData)
			});

			if (response.ok) {
				submitted = true;
				formData = { name: '', email: '', message: '' };
			} else {
				error = 'Er is iets misgegaan. Probeer het later opnieuw.';
			}
		} catch (err) {
			error = 'Er is iets misgegaan. Probeer het later opnieuw.';
		} finally {
			submitting = false;
		}
	}
</script>

<svelte:head>
	<title>Contact - Jaco Line</title>
	<meta name="description" content="Neem contact op met Jaco Line voor vragen over keramiek of workshops." />
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
			<div class="info-item">
				<strong>E-mail:</strong>
				<a href="mailto:{contactInfo.email}">{contactInfo.email}</a>
			</div>
			<div class="info-item">
				<strong>Telefoon:</strong>
				<a href="tel:{contactInfo.phone}">{contactInfo.phone}</a>
			</div>
			<div class="info-item">
				<strong>Instagram:</strong>
				<a href={contactInfo.instagram} target="_blank" rel="noopener noreferrer">@jacoline</a>
			</div>
		</div>

		<div class="contact-form-wrapper">
			<h2>Stuur een bericht</h2>
			{#if submitted}
				<div class="success-message">
					<p>Bedankt voor je bericht! Ik neem zo snel mogelijk contact met je op.</p>
				</div>
			{:else}
				<form on:submit={handleSubmit} class="contact-form">
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
					<Button type="submit" variant="primary" disabled={submitting}>
						{submitting ? 'Verzenden...' : 'Verzenden'}
					</Button>
				</form>
			{/if}
		</div>
	</div>
</div>

<style lang="scss">
	@import '../../styles/variables';

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

