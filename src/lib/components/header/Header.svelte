<script>
import {url} from "@roxi/routify";
</script>

<style lang="scss">
	header {
		background-color: black;
		width: 100%;

		&::after {
			content: "";
			display: block;
			width: 100%;
			height: 3px;
			background-image: -webkit-gradient(linear,left top,right top,from(#fff),color-stop(33.3%,#fff),color-stop(33.3%,#003183),color-stop(66.6%,#003183),color-stop(66.6%,#d0190f),to(#d0190f));
			background-image: -webkit-linear-gradient(left,#fff,#fff 33.3%,#003183 0,#003183 66.6%,#d0190f 0,#d0190f);
			background-image: linear-gradient(90deg,#fff 0,#fff 33.3%,#003183 0,#003183 66.6%,#d0190f 0,#d0190f);
			background-size: 150px 100%;
			background-repeat: repeat;
		}
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

