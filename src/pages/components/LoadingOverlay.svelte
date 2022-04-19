<script>
    import { fade } from 'svelte/transition';
</script>

<div class="loading-overlay" in:fade="{{ delay: 300, duration: 100 }}" out:fade="{{ duration: 100 }}">
    <div class="spinner-border" role="status">
        <span class="sr-only">Loading...</span>
    </div>
</div>

<style>
    .loading-overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        min-height: 200px;
        background-color: rgba(198, 198, 198, 0.809);
        z-index: 1;
        display: flex;
        justify-content: center;
        align-items: center;
    }
</style>