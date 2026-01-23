<script lang="ts">
	interface Props {
		socialLinks?: Array<{ platform: string; url: string; label?: string }>;
	}

	const { socialLinks: socialLinksProp = [] }: Props = $props();
	const socialLinks = $derived(socialLinksProp);

	const getPlatformIcon = (platform: string): string => `/icons/${platform}.svg`

	function getPlatformLabel(platform: string, label?: string): string {
		if (label) return label;
		return `@${platform}`;
	}
</script>

<footer class="footer">
	<div class="container">
		<div class="footer-content">
			<div class="footer-section">
				<h3>Jaco Line</h3>
				<p>Handgemaakt keramiek met passie en aandacht voor detail</p>
			</div>
			<div class="footer-section">
				<h4>Navigatie</h4>
				<ul>
					<li><a href="/">Home</a></li>
					<li><a href="/evenementen">Evenementen</a></li>
					<li><a href="/galerij">Galerij</a></li>
					<li><a href="/workshops">Workshops</a></li>
					<li><a href="/contact">Contact</a></li>
				</ul>
			</div>
			<div class="footer-section">
				<h4>Volg mij</h4>
				{#if socialLinks.length > 0}
					<div class="social-links">
						{#each socialLinks as link}
							<a
								href={link.url}
								target="_blank"
								rel="noopener noreferrer"
								aria-label={link.platform}
							>
								<img
									src={getPlatformIcon(link.platform)}
									alt={link.platform}
									width="24"
									height="24"
								/>
							</a>
						{/each}
					</div>
				{/if}
			</div>
		</div>
		<div class="footer-bottom">
			<p>&copy; {new Date().getFullYear()} Jaco Line. Alle rechten voorbehouden.</p>
		</div>
	</div>
</footer>

<style lang="scss">
	@use '../../styles/variables' as *;

	.footer {
		background: $color-background-alt;
		border-top: 1px solid $color-border;
		padding: $spacing-2xl 0 $spacing-lg;
		margin-top: $spacing-3xl;
	}

	.footer-content {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
		gap: $spacing-xl;
		margin-bottom: $spacing-xl;
	}

	.footer-section {
		h3,
		h4 {
			margin-bottom: $spacing-md;
			color: $color-primary;
		}

		p {
			color: $color-text-light;
			font-size: $font-size-small;
		}

		ul {
			list-style: none;

			li {
				margin-bottom: $spacing-xs;

				a {
					color: $color-text-light;
					font-size: $font-size-small;
					transition: color $transition-base;

					&:hover {
						color: $color-primary;
					}
				}
			}
		}
	}

	.social-links {
		display: flex;
		gap: $spacing-md;
	}

	.footer-bottom {
		text-align: center;
		padding-top: $spacing-lg;
		border-top: 1px solid $color-border;
		color: $color-text-light;
		font-size: $font-size-small;
	}
</style>


