<script>
	const scrollToPhotos = () => {
		const photos = typeof document !== undefined && document.getElementById('photos');
		if (!photos) return;
		photos.scrollIntoView({ behavior: 'smooth' });
	};
</script>

<img class="background" src="/images/jaco-line.jpg" alt="jaco-line" />
<header>
	<h2>Save the date!</h2>
	<h3>20/21/22-12-‘24</h3>
	<img class="header-image" src="/images/december-darlings.jpg" alt="kopjes van klei" />
    <button aria-label="scroll down" on:click={scrollToPhotos}>
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m6 9 6 6 6-6"/></svg>
	</button>
</header>

<div class="photos" id="photos">
	<img class="photo" src="/images/foto1.jpg" alt="kopjes van klei" />
	<img class="photo" src="/images/foto4.jpg" alt="espresso kopjes" />
	<img class="photo" src="/images/foto2.jpg" alt="capuccino mok" />
	<img class="photo" src="/images/akoestival.jpg" alt="kopjes van klei" />
	<img class="photo" src="/images/kraam.jpg" alt="espresso kopjes" />
	<img class="photo" src="/images/foto3.jpg" alt="espresso kopjes" />
</div>

<footer></footer>

<style>
	:global(body) {
		font-family: 'Poppins', serif;
		margin: 0;
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 0 24px 14px;
		color: white;
	}

	:global(svg) {
		width: 1em;
		height: 1em;
	}

	.background {
		width: 100vw;
		height: 100svh;
		position: fixed;
		top: 0;
		left: 0;
		z-index: -1;
		object-fit: cover;
	}

    header {
        min-height: 100svh;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 100%;
        max-width: 940px;
    }

	header button {
		background: transparent;
		border: none;
		cursor: pointer;
		font-size: 2rem;
		color: white;
		width: 100%;
		margin-top: 24px;
	}

	header button svg {
		animation: upAndDown 2s infinite;
	}

    header img {
        max-width: 400px;
        width: 100%;
    }

	.photos {
		max-width: 940px;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

    h2 {
        margin-top: 0;
    }

	h2,
	h3 {
		text-align: center;
		text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
	}

	.photo {
		max-width: 100%;
		margin: 0 auto;
	}

    footer {
        min-height: 80svh;
    }

	@keyframes upAndDown {
		0% {
			transform: translateY(0) scale(1); 
		}
		50% {
			transform: translateY(10px) scale(1.4);
		}
		100% {
			transform: translateY(0) scale(1);
		}
	}
</style>
