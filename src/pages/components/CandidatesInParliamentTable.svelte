<script>
    export let partiesInParliament;
    import { abbr, getCandidateFullName } from "../../lib/helpers/helpers.js";
    import {searchAndPaginate} from "../../lib/components/pagination/paginate";
    import PaginationLinks from "../../lib/components/pagination/PaginationLinks.svelte";


    // // --- pagination and search ---
    let paginationObject: IpaginationObject = {
        items: get(parties),
        paginatedItems: [],
        searchTerm: "",
        currentPageNumber: 1,
        countOfPages: 1,
        itemsPerPage: 5,
        searchBy: ["name"],
    }

    function paginateParties() {
        searchAndPaginate(paginationObject)  // paginationObject is updated inside this function
        paginatedParties = paginationObject.paginatedItems
    }

    let paginatedParties = []

</script>

<div class="container">
    <div class="candidates-table-wrapper">
        <h1 class="my-3">Tabulka poslancov</h1>
        <table class="govuk-table mb-5">
            <colgroup>
                <col style="width:40%">
                <col style="width:20%">
                <col style="width:20%">
                <col style="width:20%">
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
                {#each partiesInParliament as party}
                    {#each party.candidates as candidate}
                        <tr class="govuk-table__row">
                            <td class="govuk-table__cell">{getCandidateFullName(candidate)}</td>
                            <td class="govuk-table__cell">{abbr(party.name, 30)}</td>
                            <td class="govuk-table__cell govuk-table__cell--numeric">{candidate.doc_count}</td>
                            <td class="govuk-table__cell govuk-table__cell--numeric">{candidate.percentage}</td>
                        </tr>
                    {/each}
                {/each}
            </tbody>
        </table>

        <PaginationLinks paginationObject={paginationObject} paginationObjectChanged={paginateParties}/>
    </div>
</div>

<style type="text/scss">

.candidates-table-wrapper {
    // width: 80%;
    // margin: auto;
}
    .govuk-table {
        margin-bottom: 1rem;
        width: 100%;
        @import "node_modules/@id-sk/frontend/govuk/components/table/_table";
    }
</style>
