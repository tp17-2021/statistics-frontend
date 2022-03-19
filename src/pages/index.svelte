<script>
    import Chart from "chart.js/auto";
    import { onMount } from "svelte";
    import axios from "axios";
    import * as JQ from "jquery";
    import * as d3 from "d3";

    import { abbr, baseApiUrl } from "../lib/helpers/helpers.js";

    import Tooltip from "sv-bootstrap-tooltip";

    import PartiesTable from "../pages/components/PartiesTable.svelte";
    import PartiesBarChart from "./components/PartiesBarChart.svelte";
    import SlovakiaMap from "../pages/components/SlovakiaMap.svelte";
    import CandidatesInParliamentTable from "../pages/components/CandidatesInParliamentTable.svelte";
    import ParliamentSvgMap from "../pages/components/ParliamentSvgMap.svelte";
    import StatisticsTable from "../pages/components/StatisticsTable.svelte";

    let referenceEle;

    let partyResults = [];
    let electionsStatus = [];
    let partiesInParliament = [];
    let config = null;
    let lookup = {
        parties: {},
        candidates: {},
    };

    onMount(async () => {
        config = (await axios.get("api/config.json")).data;
        config.parties.forEach((party) => {
            let partyWithoutCandidates = Object.assign({}, party);
            delete partyWithoutCandidates.candidates;

            lookup.parties[party["_id"]] = partyWithoutCandidates;

            party.candidates.forEach((candidate) => {
                lookup.candidates[candidate["_id"]] = candidate;
            });
        });

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

        console.log("lookup", lookup);
        console.log("partyResults", partyResults);

        partiesInParliament = partyResults.filter((i) => i.in_parliament);
        console.log("partiesInParliament", partiesInParliament);
        electionsStatus = await getElectionsStatus();

        // console.log("electionsStatus", electionsStatus);

        // console.log("Loaded");

        console.log(partyResults);

        let totalSeats = partiesInParliament.reduce((partialSum, party) => partialSum + party.seats, 0);
        console.log("totalSeats", totalSeats);
    });

    async function getElectionsStatus() {
        const response = await axios.get(baseApiUrl("/elastic/elections-status"));
        return response.data.data;
    }

    async function getPartyResults() {
        const response = await axios.post(
            baseApiUrl("/elastic/get-party-candidate-results"),
            {}
        );
        return response.data;
    }

</script>

<SlovakiaMap {partiesInParliament}></SlovakiaMap>

<StatisticsTable {electionsStatus}></StatisticsTable>

<div class="container-fluid">
    <div class="row">
        <div class="col-10 mx-auto my-5" style="min-height: 300px;">
            <ParliamentSvgMap {partiesInParliament} {lookup} />
        </div>
    </div>
</div>


<PartiesBarChart {partyResults}></PartiesBarChart>

<PartiesTable {partyResults} />

<CandidatesInParliamentTable {partiesInParliament} {lookup}/>

<div class="my-5">
    <button type="button" class="btn btn-secondary" bind:this={referenceEle}>
        Tooltip test on top
    </button>

    <Tooltip triggerElement={referenceEle}>
        <em>Tooltip</em>
        <u>with</u>
        <b>HTML</b>
    </Tooltip>
</div>

<style>
</style>
