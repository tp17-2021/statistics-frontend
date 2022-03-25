<script>
  import { Router } from "@roxi/routify";
  import { routes } from "../.routify/routes";
  import 'bootstrap';
  import {initAll} from '@id-sk/frontend/idsk/all.js';
  import { onMount } from "svelte";

  const config = {
    urlTransform: {
      // set base url based on environment variable
      apply: (url) => `${import.meta.env.VITE_BASE_PATH}${url}`, //external URL
      remove: (url) => url.replace(`${import.meta.env.VITE_BASE_PATH}`, ""), //internal URL
    },
  };

  onMount(() => {
    document.body.className = ((document.body.className) ? document.body.className + ' js-enabled' : 'js-enabled');
    initAll();
    console.log("App no mount");
  });
</script>

<Router {routes} {config} />

<style lang="scss" global>
  $border-radius: 0;
  @import "bootstrap/scss/bootstrap";
  @import '@id-sk/frontend/idsk/all';
</style>
