<script>
    import { url } from '@roxi/routify'
</script>

<style>
  .huge {
    font-size: 12rem;
  }
  .e404 {
    padding: 2rem 0;
    text-align: center;
  }
</style>

<div>
  <div class="e404">
    <div class="huge">404</div>
    <div class="big">Stránka nenájdená
    <!-- link to the parent folder of _fallback.svelte -->
    <a href={$url('../')}>Späť</a>
    </div>
  </div>
</div>
