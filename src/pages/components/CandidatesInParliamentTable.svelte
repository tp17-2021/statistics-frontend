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
        console.log("paginateCandidates");
        console.log("paginateCandidates"), partiesInParliament;
        searchAndPaginate(paginationObject); // paginationObject is updated inside this function
        paginatedCandiadtes = paginationObject.paginatedItems;
        console.log("paginateCandidates", paginateCandidates);
    }

    let paginatedCandiadtes = [];

    $: {
        let candidates = [];
        partiesInParliament.forEach((p) => {
            p.candidates.forEach((c) => {
                if (c.in_parliament) {
                    console.log(p);
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

<div class="container my-5">
    <div class="candidates-table-wrapper">
        <h1 class="my-3 text-center">Tabulka poslancov</h1>

        <div class="row">
            <div class="col-12 col-md-8 mx-auto">
                <input
                    type="text"
                    class="search-filter w-100 my-3 p-3 rounded"
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

        <table class="govuk-table mb-5">
            <colgroup>
                <col style="width:30%" />
                <col style="width:30%" />
                <col style="width:20%" />
                <col style="width:20%" />
            </colgroup>
            <thead class="govuk-table__head">
                <tr class="govuk-table__row">
                    <th>Meno</th>
                    <th>Strana</th>
                    <th class="text-end">Hlasov</th>
                    <th class="text-end">Percent</th>
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
                            >{abbr(
                                lookup.parties[candidate.party_number - 1].name,
                                30
                            )}</td
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

        <div class="my-5">
            <PaginationLinks
                {paginationObject}
                paginationObjectChanged={paginateCandidates}
            />
        </div>
    </div>
</div>

<style type="text/scss">
    .candidates-table-wrapper {
    
    }
    .govuk-table {
        margin-bottom: 1rem;
        width: 100%;
        @import "node_modules/@id-sk/frontend/govuk/components/table/_table";
    }

    .no-results-container {
        min-height: 400px;
    }
</style>
