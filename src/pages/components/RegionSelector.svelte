<script lang="ts">
    export let selectedRegion: string;        // kraj
    export let selectedCounty: string;        // okres
    export let selectedMunicipality: string;  // obec

    export let REGIONS: string[];  // regions from config
    export let COUNTRIES: string[];  // countries from config
    export let MUNICIPALITIES: string[];  // municipalities from config


    const FILTER_STEPS = {
        REGION: 'region',
        COUNTY: 'county',
        MUNICIPALITY: 'municipality',
    }
    let resultsFilterStep = FILTER_STEPS.REGION

    function regionChanged() {
        console.log('regionChanged', selectedRegion)
        if (selectedRegion) {
            resultsFilterStep = FILTER_STEPS.COUNTY
        }
        else {
            resultsFilterStep = FILTER_STEPS.REGION
        }
        selectedCounty = ""
        selectedMunicipality = ""
    }

    function countyChanged() {
        console.log('countyChanged', selectedCounty)
        if (selectedCounty) {
            resultsFilterStep = FILTER_STEPS.MUNICIPALITY
        }
        else {
            resultsFilterStep = FILTER_STEPS.COUNTY
        }
        selectedMunicipality = "";
    }

    function municipalityChanged() {
        console.log('municipalityChanged', selectedMunicipality)
        resultsFilterStep = FILTER_STEPS.MUNICIPALITY
    }

    $: console.table({
        selectedRegion,
        selectedCounty,
        selectedMunicipality,
        resultsFilterStep
    })

</script>


<div class="row mb-3">
    <div class="col-12 col-lg-4">
        <div class="govuk-form-group mb-3">
            <label class="govuk-label" for="region-select"> Kraj </label>
            <select
                    class="govuk-select w-100"
                    bind:value={selectedRegion}
                    id="region-select"
                    on:change={regionChanged}
            >
                <option value="">Celé Slovensko</option>
                {#if REGIONS}
                    {#each REGIONS as region}
                        <option value={region.code}>{region.name}</option>
                    {/each}
                {/if}
            </select>
        </div>
    </div>

    <div class="col-12 col-lg-4">
        <div class="govuk-form-group mb-3">
            <label class="govuk-label" for="county-select"> Okres </label>
            <select
                    bind:value={selectedCounty}
                    disabled={resultsFilterStep === FILTER_STEPS.REGION}
                    class="govuk-select w-100"
                    id="county-select"
                    on:change={countyChanged}
            >
                <option value="">Celý kraj</option>
                {#if selectedRegion}
                    {#each COUNTRIES.filter((c) => c.region_code == selectedRegion) as county}
                        <option value={county.code}>{county.name}</option>
                    {/each}
                {/if}
            </select>
        </div>
    </div>

    <div class="col-12 col-lg-4">
        <div class="govuk-form-group mb-3">
            <label class="govuk-label" for="numicipality-select"> Obec </label>
            <select
                    disabled={[FILTER_STEPS.REGION, FILTER_STEPS.COUNTY].includes(resultsFilterStep)}
                    bind:value={selectedMunicipality}
                    class="govuk-select w-100"
                    id="numicipality-select"
            >
                <option value="">Celý okres</option>
                {#if selectedCounty}
                    {#each MUNICIPALITIES.filter((m) => m.county_code == selectedCounty) as municipality}
                        <option value={municipality.code}>{municipality.name}</option>
                    {/each}
                {/if}
            </select>
        </div>
    </div>
</div>
