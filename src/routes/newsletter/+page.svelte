<script lang="ts">
	import Button from '$lib/components/Button.svelte';

	let formData = {
		name: '',
		email: ''
	};

	let submitting = false;
	let submitted = false;
	let error = '';

	async function handleSubmit(event: Event) {
		event.preventDefault();
		submitting = true;
		error = '';

		try {
			const response = await fetch('/api/newsletter/subscribe', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(formData)
			});

			if (response.ok) {
				submitted = true;
				formData = { name: '', email: '' };
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
	<title>Nieuwsbrief - Jaco Line</title>
	<meta name="description" content="Schrijf je in voor de nieuwsbrief van Jaco Line en blijf op de hoogte van nieuwe evenementen en workshops." />
</svelte:head>

<div class="page-header">
	<div class="container">
		<h1>Nieuwsbrief</h1>
		<p>Blijf op de hoogte van nieuwe evenementen, workshops en werk</p>
	</div>
</div>

<div class="container">
	<div class="newsletter-content">
		{#if submitted}
			<div class="success-message">
				<h2>Bedankt voor je inschrijving!</h2>
				<p>Je ontvangt binnenkort een bevestiging per e-mail.</p>
			</div>
		{:else}
			<div class="newsletter-info">
				<h2>Schrijf je in</h2>
				<p>
					Ontvang updates over nieuwe evenementen waar je mijn werk kunt vinden, aankomende
					workshops en het laatste nieuws over mijn keramiek.
				</p>
			</div>
			<form on:submit={handleSubmit} class="newsletter-form">
				{#if error}
					<div class="error-message">{error}</div>
				{/if}
				<div class="form-group">
					<label for="name">Naam</label>
					<input type="text" id="name" bind:value={formData.name} />
				</div>
				<div class="form-group">
					<label for="email">E-mail *</label>
					<input type="email" id="email" bind:value={formData.email} required />
				</div>
				<Button type="submit" variant="primary" disabled={submitting}>
					{submitting ? 'Inschrijven...' : 'Inschrijven'}
				</Button>
			</form>
		{/if}
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

	.newsletter-content {
		max-width: 600px;
		margin: 0 auto $spacing-3xl;
	}

	.newsletter-info {
		text-align: center;
		margin-bottom: $spacing-2xl;

		h2 {
			margin-bottom: $spacing-md;
			color: $color-primary;
		}

		p {
			color: $color-text-light;
			line-height: $line-height-base;
		}
	}

	.newsletter-form {
		display: flex;
		flex-direction: column;
		gap: $spacing-md;
		padding: $spacing-2xl;
		background: $color-background-alt;
		border-radius: $border-radius-lg;
		border: 1px solid $color-border;
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
		text-align: center;
		padding: $spacing-2xl;
		background: rgba($color-success, 0.1);
		border: 1px solid $color-success;
		border-radius: $border-radius-lg;
		color: $color-success;

		h2 {
			margin-bottom: $spacing-md;
		}
	}

	.error-message {
		padding: $spacing-md;
		background: rgba($color-error, 0.1);
		border: 1px solid $color-error;
		border-radius: $border-radius-md;
		color: $color-error;
	}
</style>

