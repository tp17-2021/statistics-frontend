<script lang="ts">
    import type {ICounty, IMunicipality, IRegion} from "../types";

    export let selectedRegion: number;        // kraj
    export let selectedCounty: number;        // okres
    export let selectedMunicipality: number;  // obec

    export let selectedLocalityLabel = "";

    export let REGIONS: IRegion[];  // regions from config
    export let COUNTRIES: ICounty[];  // countries from config
    export let MUNICIPALITIES: IMunicipality[];  // municipalities from config

    // console.log("MUNICIPALITIES", MUNICIPALITIES);
    // console.log("COUNTRIES", COUNTRIES);
    // console.log("REGIONS", REGIONS);

    function updateLabel() {
        if (selectedMunicipality) {
            selectedLocalityLabel = MUNICIPALITIES.find(m => m.code === selectedMunicipality)?.name;
        }
        else if (selectedCounty) {
            selectedLocalityLabel = COUNTRIES.find(c => c.code === selectedCounty)?.name;
        }
        else if (selectedRegion) {
            selectedLocalityLabel = REGIONS.find(r => r.code === selectedRegion)?.name;
        }
        else {
            selectedLocalityLabel = "Celé Slovensko";
        }
    }


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
        selectedCounty = null
        selectedMunicipality = null
        updateLabel()
    }

    function countyChanged() {
        console.log('countyChanged', selectedCounty)
        if (selectedCounty) {
            resultsFilterStep = FILTER_STEPS.MUNICIPALITY
        }
        else {
            resultsFilterStep = FILTER_STEPS.COUNTY
        }
        selectedMunicipality = null;
        updateLabel()
    }

    function municipalityChanged() {
        console.log('municipalityChanged', selectedMunicipality)
        resultsFilterStep = FILTER_STEPS.MUNICIPALITY
        updateLabel()
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
                <option value={null}>Celé Slovensko</option>
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
                <option value={null}>Celý kraj</option>
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
                    on:change={municipalityChanged}
            >
                <option value={null}>Celý okres</option>
                {#if selectedCounty}
                    {#each MUNICIPALITIES.filter((m) => m.county_code == selectedCounty) as municipality}
                        <option value={municipality.code}>{municipality.name}</option>
                    {/each}
                {/if}
            </select>
        </div>
    </div>
</div>
