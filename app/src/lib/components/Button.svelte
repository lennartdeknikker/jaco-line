<script lang="ts">
	interface Props {
		href?: string;
		variant?: 'primary' | 'secondary' | 'outline';
		type?: 'button' | 'submit' | 'reset';
		disabled?: boolean;
	}

	const {
		href = undefined,
		variant = 'primary',
		type = 'button',
		disabled = false
	}: Props = $props();
</script>

{#if href}
	<a href={href} class="button" class:primary={variant === 'primary'} class:secondary={variant === 'secondary'}
		class:outline={variant === 'outline'}>
		<slot />
	</a>
{:else}
	<button
		{type}
		{disabled}
		class="button"
		class:primary={variant === 'primary'}
		class:secondary={variant === 'secondary'}
		class:outline={variant === 'outline'}
		class:disabled={disabled}
	>
		<slot />
	</button>
{/if}

<style lang="scss">
	@use 'sass:color';
	@use '../../styles/variables' as *;

	.button {
		display: inline-block;
		padding: $spacing-sm $spacing-lg;
		font-size: $font-size-base;
		font-weight: $font-weight-medium;
		text-align: center;
		border-radius: $border-radius-md;
		border: 2px solid transparent;
		transition: all $transition-base;
		cursor: pointer;
		text-decoration: none;

		&.primary {
			background: $color-primary;
			color: white;
			border-color: $color-primary;

			&:hover {
				background: $color-primary-dark;
				border-color: $color-primary-dark;
				color: white;
			}
		}

		&.secondary {
			background: $color-secondary;
			color: white;
			border-color: $color-secondary;

			&:hover {
				background: color.adjust($color-secondary, $lightness: -10%);
				border-color: color.adjust($color-secondary, $lightness: -10%);
				color: white;
			}
		}

		&.outline {
			background: transparent;
			color: $color-primary;
			border-color: $color-primary;

			&:hover {
				background: $color-primary;
				color: white;
			}
		}

		&.disabled {
			opacity: 0.6;
			cursor: not-allowed;
			pointer-events: none;
		}
	}
</style>

