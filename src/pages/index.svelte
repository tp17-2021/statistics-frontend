<script lang="ts">
  // TODO chyba znovu vybrat ten isty kraj
  // TODO, filtrovanie podla strany v tabulke kandidatov
  import { onMount } from "svelte";
  import axios from "axios";
  import * as JQProxy from "jquery";
  const JQ = JQProxy.default || JQProxy;

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

  // types and interfaces
  import type {IConfig, ILau1, ILookup, IPartyResult} from "./types";
  import {fetchConfig, fetchLau1, fetchPartyResults} from "../lib/api";

  let resultsFilterValue = null;
  let resultsFilterStep = "region";
  let selectedLocalityLabel = "Celé Slovensko";
  let selectedRegion = "";
  let selectedCounty = "";
  let selectedMunicipality = "";
  let referenceEle;
  let localityResultsCounties = null;
  let localityResultsRegions = null;
  let partyResults: IPartyResult[] = [];
  let electionsStatus = [];
  let partiesInParliament = [];
  let candidates = [];
  let candidatesInParliament = [];
  let config: IConfig = null;
  let lau1_map: ILau1 = null;
  let lookup: ILookup = {
    parties: [],
    candidates: [],
    municipalities: [],
    counties: [],
    regions: [],
    lau1_to_code: {},
    code_to_lau1: {},
    nuts3_to_region_code: {},
  };

  function createLookup(config: IConfig): ILookup {
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

    // for of
    for (let loc of lau1_map) {
      lookup.lau1_to_code[loc.lau1_code] = loc;
      lookup.lau1_to_code[loc.code] = loc;
    }

    // console.log(
    //         "mmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmm",
    //         lookup.counties["217"]
    // );

    console.log("lookup", lookup)

    return lookup;
  }


  onMount(async () => {
    document.body.className = document.body.className
      ? document.body.className + " js-enabled"
      : "js-enabled";

    config = await fetchConfig();
    lau1_map = await fetchLau1();
    console.debug("config", config);
    console.debug("lau1_map", lau1_map);
    lookup = createLookup(config);

    partyResults = await fetchPartyResults();
    console.log("partyResults before sync", partyResults);
    syncPartyResultsAndLookup(partyResults, lookup );
    console.log("partyResults on start", partyResults);
    console.debug("lookup", lookup);

    // partyResults.forEach((party, index) => {
    //     party.candidates.forEach((candidate, c_index) => {
    //         // Add whole object to results retrieved from elastic
    //         party.candidates[c_index] = {
    //             ...candidate,
    //             ...lookup.candidates[candidate.id],
    //         };

    //         // Also update lookup with results info
    //         lookup.candidates[party.candidates[c_index].id] =
    //             party.candidates[c_index];
    //     });

    //     partyResults[index] = { ...party, ...lookup.parties[party.id] };
    //     lookup.parties[partyResults[index].id] = partyResults[index];
    // });


    partiesInParliament = partyResults.filter((i) => i.in_parliament);

    candidatesInParliament = [];
    partyResults.forEach((party, index) => {
      party.candidates.forEach((candidate) => {
        if (candidate.in_parliament) {
          candidatesInParliament = [...candidatesInParliament, candidate];
        }
        candidates = [...candidates, candidate];
        candidates.push(candidate);
      });
    });

    console.debug("partiesInParliament", partiesInParliament);
    console.debug("candidates", candidates);
    console.debug("candidatesInParliament", candidatesInParliament);

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

    fixIDSKtabs()

    initAll({});
  });


  /**
   * workaround to fix routify incompatibility with IDSK tabs by implementing tab switching logic by ourselves
   */
  function fixIDSKtabs() {
    JQ(".govuk-tabs__tab").click(function () {
      let hash = JQ(this).data("href");
      JQ(hash).show();
      JQ(hash)
              .parent()
              .find(".govuk-tabs__panel:not(" + hash + ")")
              .hide();
      JQ(hash)
              .parent()
              .parent()
              .find(".govuk-tabs__list-item--selected")
              .removeClass("govuk-tabs__list-item--selected");
      JQ('[data-href="' + hash + '"]')
              .parent()
              .addClass("govuk-tabs__list-item--selected");
    });
  }

  async function onFilterValueChange(
    selectedMunicipality,
    selectedCounty,
    selectedRegion
  ) {
    let filter_type = "";
    let filter_value = "";

    if (selectedMunicipality != "") {
      selectedLocalityLabel = lookup.municipalities[selectedMunicipality].name;
      filter_type = "municipality";
      filter_value = selectedMunicipality;
    } else if (selectedCounty != "") {
      selectedLocalityLabel = lookup.counties[selectedCounty].name;
      filter_type = "county";
      filter_value = selectedCounty;
    } else if (selectedRegion != "") {
      selectedLocalityLabel = lookup.regions[selectedRegion].name;
      filter_type = "region";
      filter_value = selectedRegion;
    } else {
      selectedLocalityLabel = "Celé Slovensko";
    }

    if (filter_type != "") {
      // Get new nesults
      console.log("=======================================");
      getResultsByLocality(filter_type, filter_value).then((res) => {
        console.log("res from getResultsByLocality", res);
        // partyResults = [...res[0].parties];
        console.log("first party doc count", res[0].parties[0].doc_count);
        // need to update partyResults from lookup
        let synced = fillLookupDataToFilteredResults(res[0].parties);
        console.log("first party doc count after update", synced[0].doc_count);
        partyResults = [...synced];
        console.log("partyResults new", synced);
        // syncPartyResultsAndLookup();
      });
    } else {
      partyResults = await fetchPartyResults();
      syncPartyResultsAndLookup(partyResults, lookup);
    }
  }

  $: onFilterValueChange(selectedMunicipality, selectedCounty, selectedRegion);

  /**
   * On init sync info inside results and lookup for whole data
   */
  function syncPartyResultsAndLookup(partyResults: IPartyResult[], lookup: ILookup) {
    console.debug("syncPartyResultsAndLookup");

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
  }

  /**
   * complete the newly fetched locality results by data from config
   */
  function fillLookupDataToFilteredResults(results) {
    results.forEach((party, index) => {
      party.candidates.forEach((candidate, c_index) => {
        // Add whole object to results retrieved from elastic
        party.candidates[c_index] = {
          ...lookup.candidates[candidate.id],
          ...candidate,
        };

        // Also update lookup with results info
        lookup.candidates[party.candidates[c_index].id] =
          party.candidates[c_index];
      });
      results[index] = { ...lookup.parties[party.id], ...party };
    });
    return results;
  }

  async function getElectionsStatus() {
    const response = await axios.get(baseApiUrl("/elastic/elections-status"));
    return response.data.data;
  }



  async function getResultsByLocality(
    localityType = "region",
    filter_value = null
  ) {
    let body = { filter_by: `${localityType}_code` };
    console.log("getResultsByLocality", localityType, filter_value);
    console.log("filter_value", filter_value);
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
    <div class="col-12 col-lg-4">
      <div class="govuk-form-group mb-3">
        <label class="govuk-label" for="region-select"> Kraj </label>
        <select
          class="govuk-select w-100"
          bind:value={selectedRegion}
          id="region-select"
          on:change={() => {
            resultsFilterStep = selectedRegion ? "county" : resultsFilterStep;
            selectedCounty = "";
            selectedMunicipality = "";
          }}
        >
          <option value="">Celé Slovensko</option>
          {#if config}
            {#each config.regions as region}
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
          disabled={resultsFilterStep == "region" || null}
          class="govuk-select w-100"
          id="county-select"
          on:change={() => {
            resultsFilterStep = selectedCounty
              ? "municipality"
              : resultsFilterStep;
            selectedMunicipality = "";
          }}
        >
          <option value="">Celý kraj</option>
          {#if config && selectedRegion}
            {#each config.counties.filter((c) => c.region_code == selectedRegion) as county}
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
          disabled={resultsFilterStep == "region" ||
            resultsFilterStep == "county" ||
            null}
          bind:value={selectedMunicipality}
          class="govuk-select w-100"
          id="numicipality-select"
        >
          <option value="">Celý okres</option>
          {#if config && selectedCounty}
            {#each config.municipalities.filter((m) => m.county_code == selectedCounty) as municipality}
              <option value={municipality.code}>{municipality.name}</option>
            {/each}
          {/if}
        </select>
      </div>
    </div>
  </div>

  <div class="parties-graph mb-5">
    <div class="govuk-tabs">
      <ul class="govuk-tabs__list">
        <li class="govuk-tabs__list-item govuk-tabs__list-item--selected">
          <a
            class="govuk-tabs__tab"
            data-href="#parties-tab-1"
            href="javascript:void(0)"
          >
            Strany nad 5%
          </a>
        </li>
        <li class="govuk-tabs__list-item">
          <a
            class="govuk-tabs__tab"
            data-href="#parties-tab-2"
            href="javascript:void(0)"
          >
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

  {#if resultsFilterStep == "region" && selectedRegion === ""}
    <div class="partliament-graph mb-5">
      <h2 class="govuk-heading-l text-center mb-3">Rozloženie parlamentu</h2>
      <div class="row">
        <div class="col-10 mx-auto" style="min-height: 300px;">
          <ParliamentSvgMap {partiesInParliament} {lookup} />
        </div>
      </div>
    </div>
  {/if}

  {#if resultsFilterStep == "region" && selectedRegion === ""}
    <RegionalWinnersCards {lookup} {localityResultsRegions} />
  {/if}

  {#if resultsFilterStep == "region" && selectedRegion === ""}
    <div class="country-map mb-5">
      <h2 class="govuk-heading-l text-center mb-3">Volebná mapa</h2>

      <div class="govuk-tabs">
        <ul class="govuk-tabs__list">
          <li class="govuk-tabs__list-item govuk-tabs__list-item--selected">
            <a
              class="govuk-tabs__tab"
              data-href="#map-tab-1"
              href="javascript:void(0)"
            >
              Okresy
            </a>
          </li>
          <li class="govuk-tabs__list-item">
            <a
              class="govuk-tabs__tab"
              data-href="#map-tab-2"
              href="javascript:void(0)"
            >
              Kraje
            </a>
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
  {/if}

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

