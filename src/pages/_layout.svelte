<script>
    import Header from "../lib/components/header/Header.svelte";
    import Spinner from "../lib/components/spinner/Spinner.svelte";
</script>

<Header />
<main class="container-fluid">
    <Spinner />
    <div class="container">
        <slot />
    </div>
</main>

<style>
    .full-modal {
        flex: 1;
        display: flex;
        flex-direction: column;
        padding: 1rem;
        width: 100%;
        max-width: 768px;
        margin: 0 auto;
        box-sizing: border-box;
    }
</style>
