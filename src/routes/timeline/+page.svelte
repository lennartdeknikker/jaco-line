<div class="page">
	<div class="container">
		<div class="left-side">
			<div class="item">
				<h2>Akoestival</h2>
				<div class="image-container">
					<img src="images/akoestival.jpg" alt="akoestival poster" />
				</div>
			</div>
			<div class="item">
				<h2>Akoestival</h2>
				<div class="image-container">
					<img src="images/akoestival.jpg" alt="akoestival poster" />
				</div>
			</div>
		</div>
		<div class="right-side">
			<div class="item">
				<h2>December darlings</h2>
				<div class="image-container">
					<img src="images/december-darlings.jpg" alt="December Darlings evenement poster" />
				</div>
			</div>
			<div class="item">
				<h2>December darlings</h2>
				<div class="image-container">
					<img src="images/december-darlings.jpg" alt="December Darlings evenement poster" />
				</div>
			</div>
		</div>
	</div>
</div>

<style>
	.page {
		max-width: 940px;
		margin: 0 auto;
		padding: 0 10px;
	}

	h1 {
		text-align: center;
	}

	.container {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
	}

	.left-side {
		width: 50%;
		position: relative;
		padding-right: 24px;
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
        background-color: rgb(224, 217, 217);
		align-items: flex-end;
	}

	.left-side::after {
		content: '';
		position: absolute;
		right: 0;
		top: 0;
		height: 100%;
		background-color: #d4957c;
		width: 5px;
		transform: translateX(50%);
	}

	.right-side {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		width: 50%;
		padding-left: 24px;
		box-sizing: border-box;
	}

	.item {
		position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        background-color: #d4957c;
        aspect-ratio: 1 / 1;
        border-radius: 5px;
        color: white;
        padding: 12px;
        margin-bottom: 12px;
	}

	.left-side .item::after {
		content: '';
		position: absolute;
		right: -24px;
		top: 50%;
		height: 5px;
		background-color: #d4957c;
		width: 24px;
        transform: translateY(-50%);
        z-index: -1;
	}

	.right-side .item::after {
		content: '';
		position: absolute;
		left: -24px;
		top: 50%;
		height: 5px;
		background-color: #d4957c;
		width: 24px;
        transform: translateY(-50%);
        z-index: -1;
	}

	h2 {
		text-align: left;
        margin-top: 0;
	}

    .image-container {
        flex: 1;
        width: 200px;
        height: 200px;
        aspect-ratio: 1 / 1;
    }

	img {
		border: 1px solid black;
		height: 100%;
        width: 100%;
		object-fit: contain;
		object-position: left;
		flex: 1;
	}

    .left-side .item {
        transform: translateY(calc(50% + 12px));
    }

	.left-side h2 {
		text-align: right;
	}

	.left-side img {
		object-position: right;
	}
</style>
