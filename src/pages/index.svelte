<script>
    // TODO chyba znovu vybrat ten isty kraj
    import Chart from "chart.js/auto";
    import { onMount } from "svelte";
    import axios from "axios";
    import * as JQ from "jquery";
    import * as d3 from "d3";

    import { abbr, baseApiUrl } from "../lib/helpers/helpers.js";

    import { initAll } from "@id-sk/frontend/idsk/all.js";

    import Tooltip from "sv-bootstrap-tooltip";
    import PartiesTable from "../pages/components/PartiesTable.svelte";
    import PartiesBarChart from "./components/PartiesBarChart.svelte";
    import SlovakiaMap from "../pages/components/SlovakiaMap.svelte";
    import CandidatesTable from "./components/CandidatesTable.svelte";
    import ParliamentSvgMap from "../pages/components/ParliamentSvgMap.svelte";
    import StatisticsTable from "../pages/components/StatisticsTable.svelte";
    import RegionalWinnersCards from "../pages/components/RegionalWinnersCards.svelte";
    import { filter } from "d3";

    let resultsFilterValue = null;
    let resultsFilterStep = "region";
    let selectedLocalityLabel = "";
    let selectedRegion = "";
    let selectedCounty = "";
    let selectedMunicipality = "";
    let referenceEle;
    let localityResultsCounties = null;
    let localityResultsRegions = null;
    let partyResults = [];
    let electionsStatus = [];
    let partiesInParliament = [];
    let candidates = [];
    let candidatesInParliament = [];
    let config = null;
    let lau1_map = null;
    let lookup = {
        parties: {},
        candidates: {},
        municipalities: {},
        counties: {},
        regions: {},
        lau1_to_code: {},
        code_to_lau1: {},
        nuts3_to_region_code: {},
    };



    onMount(async () => {
        document.body.className = document.body.className
            ? document.body.className + " js-enabled"
            : "js-enabled";

            setTimeout(() => {
                initAll();
            }, 5000);
        

        config = (await axios.get("api/config.json")).data;
        lau1_map = (await axios.get("api/lau1_codes.json")).data;
        console.log("config", config);
        console.log("lau1_map", lau1_map);
        config.parties.forEach((party) => {
            let partyWithoutCandidates = Object.assign({}, party);
            delete partyWithoutCandidates.candidates;

            lookup.parties[party["_id"]] = partyWithoutCandidates;

            party.candidates.forEach((candidate) => {
                lookup.candidates[candidate["_id"]] = candidate;
            });
        });

        config.regions.forEach((r) => {
            lookup.regions[r.code] = r;
        });

        config.municipalities.forEach((m) => {
            lookup.municipalities[m.code] = m;
        });

        config.counties.forEach((c) => {
            lookup.counties[c.code] = c;
        });

        lookup.nuts3_to_region_code = {
            SK010: 1,
            SK021: 2,
            SK022: 3,
            SK023: 4,
            SK031: 5,
            SK032: 6,
            SK041: 7,
            SK042: 8,
        };

        console.log(
            "mmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmm",
            lookup.counties["217"]
        );

        partyResults = await getPartyResults();
        partyResults.forEach((party, index) => {
            party.candidates.forEach((candidate, c_index) => {
                // Add whole object to results retrieved from elastic
                party.candidates[c_index] = {
                    ...candidate,
                    ...lookup.candidates[candidate.id],
                };

                // Also update lookup with results info
                lookup.candidates[party.candidates[c_index].id] =
                    party.candidates[c_index];
            });

            partyResults[index] = { ...party, ...lookup.parties[party.id] };
            lookup.parties[partyResults[index].id] = partyResults[index];
        });

        lau1_map.forEach((loc) => {
            lookup.lau1_to_code[loc.lau1_code] = loc;
            lookup.lau1_to_code[loc.code] = loc;
        });

        console.log("lookup", lookup);
        console.log("partyResults", partyResults);

        partiesInParliament = partyResults.filter((i) => i.in_parliament);

        let ttt = [];
        partyResults.forEach((party, index) => {
            party.candidates.forEach((c) => {
                if (c.in_parliament) {
                    ttt.push(c);
                }
                candidates.push(c);
            });
        });
        candidates = [...candidates];
        candidatesInParliament = [...ttt];

        console.log("partiesInParliament", partiesInParliament);
        console.log("candidates", candidates);
        console.log("candidatesInParliament", candidatesInParliament);

        electionsStatus = await getElectionsStatus();

        // console.log("electionsStatus", electionsStatus);

        // console.log("Loaded");

        console.log(partyResults);
        let tmp = {};
        (await getResultsByLocality("county", null)).forEach((countyRes) => {
            tmp[countyRes.code] = countyRes;
        });
        localityResultsCounties = tmp;

        tmp = {};
        console.log("localityResultsCounties", localityResultsCounties);

        (await getResultsByLocality("region", null)).forEach((regionRes) => {
            tmp[regionRes.code] = regionRes;
        });
        localityResultsRegions = tmp;
        console.log("localityResultsRegions", localityResultsRegions);

        // fix routify error by implementing tab switching logic by ourselves
        JQ(".govuk-tabs__tab").click(function () {
            let hash = JQ(this).data("href");
            JQ(hash).show()
            window.s = JQ(hash)
            JQ(hash).parent().parent().parent().find(".govuk-tabs__panel:not(" + hash + ")").hide()
            JQ(hash).parent().parent().find(".govuk-tabs__list-item--selected").removeClass("govuk-tabs__list-item--selected")
            JQ('[data-href="' + hash + '"]').parent().addClass("govuk-tabs__list-item--selected")
        });
    });

    $: {
        let filter_type = "";
        let filter_value = null;
        if (selectedMunicipality != "") {
            selectedLocalityLabel =
                lookup.municipalities[selectedMunicipality].name;
            filter_type = "municipality";
        } else if (selectedCounty != "") {
            selectedLocalityLabel = lookup.counties[selectedCounty].name;
            filter_type = "county";
        } else if (selectedRegion != "") {
            selectedLocalityLabel = lookup.regions[selectedRegion].name;
            filter_type = "region";
        } else {
            selectedLocalityLabel = "";
        }

        if (filter_type != "") {
            // Get new nesults
            console.log("=======================================");
            getResultsByLocality(filter_type, filter_value).then(res => {
                console.log(res);
            })
        }
    }

    async function getElectionsStatus() {
        const response = await axios.get(
            baseApiUrl("/elastic/elections-status")
        );
        return response.data.data;
    }

    async function getPartyResults() {
        const response = await axios
            .post(baseApiUrl("/elastic/get-party-candidate-results"), {})
            .catch(function (error) {
                if (error.response) {
                    // Request made and server responded
                    console.log(error.response.data);
                    console.log(error.response.status);
                    console.log(error.response.headers);
                } else if (error.request) {
                    // The request was made but no response was received
                    console.log(error.request);
                } else {
                    // Something happened in setting up the request that triggered an Error
                    console.log("Error", error.message);
                }
            });

        if (response.data) {
            return response.data;
        } else {
            return [];
        }
    }

    async function getResultsByLocality(
        localityType = "region",
        filter_value = null
    ) {
        let body = { filter_by: `${localityType}_code` };

        if (filter_value) {
            body["filter_value"] = filter_value;
        }

        const response = await axios.post(
            baseApiUrl("/elastic/get-results-by-locality"),
            body
        );
        return response.data;
    }
</script>

<div class="pt-5">
    <h1 class="govuk-heading-xl mb-5">
        Výsledky volieb - {selectedLocalityLabel}
    </h1>

    <div class="row mb-3">
        <div class="col-md-8 col-lg-6 mx-auto">
            <div>selectedRegion {selectedRegion}</div>
            <div>selectedCounty {selectedCounty}</div>
            <div>selectedMunicipality {selectedMunicipality}</div>

            {#if resultsFilterStep == "region"}
                <div class="govuk-form-group mb-3">
                    <label class="govuk-label" for="region-select">
                        Kraj
                    </label>
                    <select
                        class="govuk-select w-100"
                        bind:value={selectedRegion}
                        id="region-select"
                        on:change={() =>
                            (resultsFilterStep = selectedRegion
                                ? "county"
                                : resultsFilterStep)}
                    >
                        <option value="">Celé Slovensko</option>
                        {#if config}
                            {#each config.regions as region}
                                <option value={region.code}
                                    >{region.name}</option
                                >
                            {/each}
                        {/if}
                    </select>
                </div>
            {/if}

            {#if resultsFilterStep == "county"}
                <button
                    type="submit"
                    class="idsk-button idsk-button--secondary mb-0"
                    data-module="idsk-button"
                    on:click={() => {
                        resultsFilterStep = "region";
                        selectedCounty = "";
                        selectedMunicipality = "";
                    }}
                >
                    Späť na výber krajov
                </button>

                <div class="govuk-form-group mb-3">
                    <label class="govuk-label" for="county-select">
                        Okres
                    </label>
                    <select
                        bind:value={selectedCounty}
                        class="govuk-select w-100"
                        id="county-select"
                        on:change={() => {
                            resultsFilterStep = selectedCounty
                                ? "municipality"
                                : resultsFilterStep;
                        }}
                    >
                        <option value="">Celý kraj</option>
                        {#if config && selectedRegion}
                            {#each config.counties.filter((c) => c.region_code == selectedRegion) as county}
                                <option value={county.code}
                                    >{county.name}</option
                                >
                            {/each}
                        {/if}
                    </select>
                </div>
            {/if}

            {#if resultsFilterStep == "municipality"}
                <button
                    type="submit"
                    class="idsk-button idsk-button--secondary mb-0"
                    data-module="idsk-button"
                    on:click={() => {
                        resultsFilterStep = "county";
                        selectedMunicipality = "";
                    }}
                >
                    Späť na výber okresov
                </button>
                <div class="govuk-form-group mb-3">
                    <label class="govuk-label" for="numicipality-select">
                        Obec
                    </label>
                    <select
                        bind:value={selectedMunicipality}
                        class="govuk-select w-100"
                        id="numicipality-select"
                    >
                        <option value="">Celý okres</option>
                        {#if config && selectedCounty}
                            {#each config.municipalities.filter((m) => m.county_code == selectedCounty) as municipality}
                                <option value={municipality.code}
                                    >{municipality.name}</option
                                >
                            {/each}
                        {/if}
                    </select>
                </div>
            {/if}
        </div>
    </div>

    <RegionalWinnersCards {lookup} {localityResultsRegions} />

    <div class="parties-graph mb-5">
        <div class="govuk-tabs">
            <ul class="govuk-tabs__list">
                <li
                    class="govuk-tabs__list-item govuk-tabs__list-item--selected"
                >
                    <a class="govuk-tabs__tab" data-href="#parties-tab-1" href="javascript:void(0)">
                        Strany nad 5%
                    </a>
                </li>
                <li class="govuk-tabs__list-item">
                    <a class="govuk-tabs__tab" data-href="#parties-tab-2" href="javascript:void(0)">
                        Všetky strany
                    </a>
                </li>
            </ul>
            <section class="govuk-tabs__panel" id="parties-tab-1">
                <h2 class="govuk-heading-m">Strany nad 5%</h2>
                <PartiesBarChart {partyResults} chartType={"elected"} />
            </section>
            <section
                class="govuk-tabs__panel govuk-tabs__panel--hidden"
                id="parties-tab-2"
            >
                <h2 class="govuk-heading-m">Všetky strany</h2>
                <PartiesBarChart {partyResults} chartType={"all"} />
            </section>
        </div>
    </div>

    <div class="partliament-graph mb-5">
        <h2 class="govuk-heading-l text-center mb-3">Rozloženie parlamentu</h2>
        <div class="row">
            <div class="col-10 mx-auto" style="min-height: 300px;">
                <ParliamentSvgMap {partiesInParliament} {lookup} />
            </div>
        </div>com
    </div>

    <div class="country-map mb-5">
        <h2 class="govuk-heading-l text-center mb-3">Volebná mapa</h2>

        <div class="govuk-tabs">
            <ul class="govuk-tabs__list">
                <li
                    class="govuk-tabs__list-item govuk-tabs__list-item--selected"
                >
                    <a class="govuk-tabs__tab" data-href="#map-tab-1" href="javascript:void(0)"> Okresy </a>
                </li>
                <li class="govuk-tabs__list-item">
                    <a class="govuk-tabs__tab" data-href="#map-tab-2" href="javascript:void(0)"> Kraje </a>
                </li>
            </ul>
            <section class="govuk-tabs__panel" id="map-tab-1">
                <h2 class="govuk-heading-m">Výsledky podľa okresov</h2>
                <SlovakiaMap
                    mapType={"counties"}
                    {partiesInParliament}
                    {lookup}
                    localityResults={localityResultsCounties}
                    uniqueID={"2"}
                />
            </section>
            <section
                class="govuk-tabs__panel govuk-tabs__panel--hidden"
                id="map-tab-2"
            >
                <h2 class="govuk-heading-m">Výsledky podľa krajov</h2>
                <SlovakiaMap
                    mapType={"regions"}
                    {partiesInParliament}
                    {lookup}
                    localityResults={localityResultsRegions}
                    uniqueID={"1"}
                />
            </section>
        </div>
    </div>

    <div class="elections-statistics mb-5">
        <h2 class="govuk-heading-l text-center mb-3">Všeobecné štatistiky</h2>
        <StatisticsTable {electionsStatus} />
    </div>

    <div class="parties-table mb-5">
        <h2 class="govuk-heading-l text-center mb-3">Výsledky strán</h2>
        <PartiesTable {partyResults} />
    </div>

    <div class="candidates-table mb-5">
        <h2 class="govuk-heading-l text-center mb-3">Poslanci</h2>
        <CandidatesTable
            data={candidates.sort((a, b) => b.doc_count - a.doc_count)}
            {lookup}
        />
    </div>
</div>

<style lang="scss">
</style>
