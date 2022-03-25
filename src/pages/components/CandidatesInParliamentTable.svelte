<script lang="ts">
    export let partiesInParliament;
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

    function paginateCandidates(partiesInParliament) {
        searchAndPaginate(paginationObject); // paginationObject is updated inside this function
        paginatedCandiadtes = paginationObject.paginatedItems;
    }

    let paginatedCandiadtes = [];

    $: {
        let candidates = [];
        partiesInParliament.forEach((p) => {
            p.candidates.forEach((c) => {
                if (c.in_parliament) {
                    candidates.push(c);
                }
            });
        });
        paginationObject.items = candidates;
        paginationObject = { ...paginationObject };
        paginateCandidates(partiesInParliament);
    }

   
    $: console.log("CPT paginatedCandiadtes", paginatedCandiadtes);
    $: console.log("CPT data", paginationObject.items);
    $: console.log("CPT countOfPages", paginationObject.countOfPages);
</script>

<!-- <p>CPT parties length: {paginationObject.items.length}</p>
<p>CPT parties length: {paginationObject.items.length}</p>
<p>CPT paginatedCandiadtes length: {paginatedCandiadtes.length}</p> -->

<div class="candidates-table-wrapper">
    <div class="row">
        <div class="col-12 col-md-8 mx-auto">
            <div class="govuk-form-group">
                <input class="govuk-input" type="text"
                    placeholder="Hľadať podľa mena"
                    on:input={(e) => {
                        console.log("hladam:", e.target.value);
                        paginationObject.currentPageNumber = 1;
                        paginationObject.searchTerm = e.target.value;
                        paginateCandidates(paginationObject);
                    }}
                >
            </div>
        </div>
    </div>

    <table class="govuk-table mb-3">
        <colgroup>
            <col style="width:30%" />
            <col style="width:30%" />
            <col style="width:20%" />
            <col style="width:20%" />
        </colgroup>
        <thead class="govuk-table__head">
            <tr class="govuk-table__row">
                <th scope="col" class="govuk-table__header">Meno</th>
                <th scope="col" class="govuk-table__header">Strana</th>
                <th scope="col" class="govuk-table__header govuk-table__header--numeric">Hlasov</th>
                <th scope="col" class="govuk-table__header govuk-table__header--numeric">Percent</th>
            </tr>
        </thead>
        <tbody class="govuk-table__body">
            <!-- {#each partiesInParliament as party} -->
            {#each paginatedCandiadtes as candidate}
                <tr class="govuk-table__row">
                    <td class="govuk-table__cell"
                        >{getCandidateFullName(candidate)}</td
                    >
                    <td class="govuk-table__cell"
                        >{
                            lookup.parties[candidate.party_number - 1].name
                        }</td
                    >
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

    {#if paginatedCandiadtes.length == 0}
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
