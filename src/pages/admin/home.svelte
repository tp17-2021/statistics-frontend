<script lang="ts">
    import {onDestroy, onMount} from "svelte";
    import Panel from "../../lib/components/Panel.svelte";
    import { getResultsStatus, publishResults, hideResults } from "../../lib/api";

    let electionResultsPublished = undefined;

    function publishResultsButton() {
        publishResults().finally(function (){
            getResultsStatusFn();
        });
    }

    function hideResultsButton() {
        hideResults().finally(function (){
            getResultsStatusFn();
        });
    }

    function getResultsStatusFn(){
        getResultsStatus().then(function(response) {
            electionResultsPublished = response.data.published;
        });
    }

    onMount(async () => {
        getResultsStatusFn();
    });

</script>
<div class="pt-5">
    <div class="row">
      <div class="col-md-9 mx-auto">
        <h1 class="govuk-heading-l mb-5">
          Administrácia
        </h1>
        <div>
            <div class="mb-3">
                {#if electionResultsPublished === true }
                    <Panel anchor="results-state" type="success">Výsledky publikované.</Panel>
                {:else}
                    <Panel anchor="results-state" type="warning">Výsledky nepublikované.</Panel>
                {/if}
            </div>

            <div class="d-grid mb-5">
                {#if electionResultsPublished === true }
                    <button class="idsk-button idsk-button mb-0" data-module="idsk-button" on:click={() => hideResultsButton()} >
                        Skryť výsledky
                    </button>
                {:else}
                    <button class="idsk-button idsk-button mb-0" data-module="idsk-button" on:click={() => publishResultsButton()} >
                        Publikovať výsledky
                    </button>
                {/if}
            </div>
        </div>
      </div>
    </div>
  </div>