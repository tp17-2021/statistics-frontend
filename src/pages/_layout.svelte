<script>
    import Header from "../lib/components/header/Header.svelte";
    import Spinner from "../lib/components/spinner/Spinner.svelte";
</script>

<Header />
<main class="container">
    <Spinner />
    <slot />
</main>

<div class="footer bg-secondary text-white py-5">
    <div class="container">
        &copy;
    </div>
</div>
