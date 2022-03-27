<script lang="ts">
    export let data;
    export let lookup;

    import { abbr, getCandidateFullName } from "../../lib/helpers/helpers.js";
    import { searchAndPaginate } from "../../lib/components/pagination/paginate";
    import PaginationLinks from "../../lib/components/pagination/PaginationLinks.svelte";
    import type { IpaginationObject } from "../../lib/components/pagination/paginate";

    // // --- pagination and search ---
    let paginationObject: IpaginationObject = {
        items: [],
        paginatedItems: [],
        searchTerm: "",
        currentPageNumber: 1,
        countOfPages: 1,
        itemsPerPage: 10,
        searchBy: ["first_name", "last_name"],
    };

    function paginateCandidates() {
        searchAndPaginate(paginationObject); // paginationObject is updated inside this function
        paginatedCandidates = [...paginationObject.paginatedItems];
    }

    let paginatedCandidates = [];

    $: {
        let candidates = data;
        paginationObject.items = candidates;
        paginateCandidates();
    }

    // $: console.log("CPT data", data);
    // $: console.log("CPT paginatedCandidates", paginatedCandidates);
    // $: console.log("CPT data", paginationObject.items);
    // $: console.log("CPT countOfPages", paginationObject.countOfPages);
</script>

<!-- <p>CPT paginatedCandidates length: {paginatedCandidates.length}</p>
<p>CPT paginationObject items length: {paginationObject.items.length}</p>
<p>CPT data length: {data.length}</p> -->

<div class="candidates-table-wrapper">
    <div class="row">
        <div class="col-12 col-md-8 mx-auto">
            <div class="govuk-form-group">
                <input
                    class="govuk-input"
                    type="text"
                    placeholder="Hľadať podľa mena"
                    on:input={(e) => {
                        console.log("hladam:", e.target.value);
                        paginationObject.currentPageNumber = 1;
                        paginationObject.searchTerm = e.target.value;
                        paginateCandidates(paginationObject);
                    }}
                />
            </div>
        </div>
    </div>

    <table class="govuk-table mb-3">
        <colgroup>
            <col style="width:30%" />
            <col style="width:20%" />
            <col style="width:10%" />
            <col style="width:15%" />
            <col style="width:15%" />
        </colgroup>
        <thead class="govuk-table__head">
            <tr class="govuk-table__row">
                <th scope="col" class="govuk-table__header">Meno</th>
                <th scope="col" class="govuk-table__header">Strana</th>
                <th scope="col" class="govuk-table__header">V parlamente</th>
                <th
                    scope="col"
                    class="govuk-table__header govuk-table__header--numeric"
                    >Hlasov</th
                >
                <th
                    scope="col"
                    class="govuk-table__header govuk-table__header--numeric"
                    >Percent</th
                >
            </tr>
        </thead>
        <tbody class="govuk-table__body">
            <!-- {#each partiesInParliament as party} -->
            {#each paginatedCandidates as candidate}
                <tr class="govuk-table__row">
                    <td class="govuk-table__cell"
                        >{getCandidateFullName(candidate)}</td
                    >
                    <td class="govuk-table__cell"
                        >{lookup.parties[candidate.party_number - 1].abbr}</td
                    >
                    <td class="govuk-table__cell text-center">
                        {#if candidate.in_parliament}
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="currentColor"
                            class="bi bi-check2-circle"
                            viewBox="0 0 16 16"
                            style="fill: green; width: 1.5rem; height: 1.5rem;"
                        >
                            <path
                                d="M2.5 8a5.5 5.5 0 0 1 8.25-4.764.5.5 0 0 0 .5-.866A6.5 6.5 0 1 0 14.5 8a.5.5 0 0 0-1 0 5.5 5.5 0 1 1-11 0z"
                            />
                            <path
                                d="M15.354 3.354a.5.5 0 0 0-.708-.708L8 9.293 5.354 6.646a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0l7-7z"
                            />
                        </svg>
                        {/if}
                    </td>
                    <td class="govuk-table__cell govuk-table__cell--numeric"
                        >{candidate.doc_count}</td
                    >
                    <td class="govuk-table__cell govuk-table__cell--numeric"
                        >{candidate.percentage}</td
                    >
                </tr>
            {/each}

            <!-- {/each} -->
        </tbody>
    </table>

    {#if paginatedCandidates.length == 0}
        <div
            class="no-results-container d-flex justify-content-center align-items-center"
        >
            <h3 class="text-center text-muted">Nevyhovuje žiaden kandidát</h3>
        </div>
    {/if}

    <div class="mb3">
        <PaginationLinks
            {paginationObject}
            paginationObjectChanged={paginateCandidates}
        />
    </div>
</div>

<style type="text/scss">
    .govuk-table {
        margin-bottom: 1rem;
        width: 100%;
        @import "node_modules/@id-sk/frontend/govuk/components/table/_table";
    }

    .no-results-container {
        min-height: 200px;
    }
</style>
