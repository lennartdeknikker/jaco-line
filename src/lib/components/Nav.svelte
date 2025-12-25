<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';

	let mobileMenuOpen = false;
	let mounted = false;

	onMount(() => {
		mounted = true;
	});

	function toggleMobileMenu() {
		mobileMenuOpen = !mobileMenuOpen;
	}

	function closeMobileMenu() {
		mobileMenuOpen = false;
	}
</script>

<nav class="nav">
	<div class="container">
		<div class="nav-content">
			<a href="/" class="logo">Jaco Line</a>
			<button
				class="mobile-toggle"
				aria-label="Toggle menu"
				aria-expanded={mobileMenuOpen}
				on:click={toggleMobileMenu}
			>
				<span class="hamburger" class:open={mobileMenuOpen}></span>
			</button>
			<ul class="nav-links" class:open={mobileMenuOpen && mounted}>
				<li>
					<a href="/" class:active={$page.url.pathname === '/'} on:click={closeMobileMenu}
						>Home</a
					>
				</li>
				<li>
					<a
						href="/evenementen"
						class:active={$page.url.pathname === '/evenementen'}
						on:click={closeMobileMenu}
						>Evenementen</a
					>
				</li>
				<li>
					<a
						href="/galerij"
						class:active={$page.url.pathname === '/galerij'}
						on:click={closeMobileMenu}
						>Galerij</a
					>
				</li>
				<li>
					<a
						href="/workshops"
						class:active={$page.url.pathname === '/workshops'}
						on:click={closeMobileMenu}
						>Workshops</a
					>
				</li>
				<li>
					<a
						href="/contact"
						class:active={$page.url.pathname === '/contact'}
						on:click={closeMobileMenu}
						>Contact</a
					>
				</li>
				<li>
					<a
						href="/newsletter"
						class:active={$page.url.pathname === '/newsletter'}
						on:click={closeMobileMenu}
						>Nieuwsbrief</a
					>
				</li>
			</ul>
		</div>
	</div>
</nav>

<style lang="scss">
	@use '../../styles/variables' as *;

	.nav {
		background: $color-background;
		border-bottom: 1px solid $color-border;
		position: sticky;
		top: 0;
		z-index: 100;
		backdrop-filter: blur(10px);
		background: rgba(255, 255, 255, 0.95);
	}

	.nav-content {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: $spacing-md 0;
	}

	.logo {
		font-size: $font-size-h3;
		font-weight: $font-weight-bold;
		color: $color-primary;
		text-decoration: none;
	}

	.mobile-toggle {
		display: none;
		background: none;
		border: none;
		padding: $spacing-xs;
		cursor: pointer;

		@media (max-width: $breakpoint-md) {
			display: block;
		}
	}

	.hamburger {
		display: block;
		width: 24px;
		height: 2px;
		background: $color-text;
		position: relative;
		transition: background $transition-base;

		&::before,
		&::after {
			content: '';
			position: absolute;
			width: 24px;
			height: 2px;
			background: $color-text;
			transition: transform $transition-base;
		}

		&::before {
			top: -8px;
		}

		&::after {
			bottom: -8px;
		}

		&.open {
			background: transparent;

			&::before {
				transform: rotate(45deg) translate(5px, 5px);
			}

			&::after {
				transform: rotate(-45deg) translate(5px, -5px);
			}
		}
	}

	.nav-links {
		display: flex;
		gap: $spacing-lg;
		list-style: none;
		align-items: center;

		@media (max-width: $breakpoint-md) {
			position: absolute;
			top: 100%;
			left: 0;
			right: 0;
			background: $color-background;
			flex-direction: column;
			padding: $spacing-lg;
			border-bottom: 1px solid $color-border;
			transform: translateY(-100%);
			opacity: 0;
			pointer-events: none;
			transition: transform $transition-base, opacity $transition-base;

			&.open {
				transform: translateY(0);
				opacity: 1;
				pointer-events: all;
			}
		}

		a {
			font-weight: $font-weight-medium;
			padding: $spacing-xs $spacing-sm;
			border-radius: $border-radius-sm;
			transition: background-color $transition-base;

			&:hover,
			&.active {
				background: $color-accent;
			}
		}
	}
</style>

