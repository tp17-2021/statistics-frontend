<script>
import {url} from "@roxi/routify";
</script>

<style>
	header {
		background-color: black;
		width: 100%;
	}
	.header-content {
		color: white;
		padding: 1rem 0;
		font-size: 24px;
		display: flex;
		place-items: center;
		width: 100%;
		margin: 0 auto;
	}


	img {
		margin-right: 1rem;
	}
</style>

<header>
	<div class="container">
		<div class="header-content">
			<img src="{$url('/img/sk.png')}" alt="" height="50px">
			<div>Voľby</div>
		</div>
	</div>
</header>

