<script>
    import LoadingOverlay from "./LoadingOverlay.svelte";
    import { addZeroes } from "../../lib/helpers/helpers";
    export let partyResults;
</script>

<div class="parties-table table-overflow-wrapper position-relative">
    {#if partyResults.length === 0}
        <LoadingOverlay />
    {/if}
    <table class="govuk-table">

        <thead class="govuk-table__head">
            <tr class="govuk-table__row">
                <th scope="col" class="govuk-table__header">#</th>
                <th scope="col" class="govuk-table__header">Názov</th>
                <th scope="col" class="govuk-table__header govuk-table__header--numeric">Hlasov</th>
                <th scope="col" class="govuk-table__header govuk-table__header--numeric">Percent</th>
                <th scope="col" class="govuk-table__header govuk-table__header--numeric">Sedadiel</th>
            </tr>
        </thead>
        <tbody class="govuk-table__body">
            {#each partyResults as party, i}
                <tr class="govuk-table__row" data-party-number={party.party_number}>
                    <td class="govuk-table__cell">{i + 1}</td>
                    <td class="govuk-table__cell">
                        <div class="d-flex align-items-center">
                            <div>
                                <div class="party-color-dot" style="background-color: {party.color};"></div>
                            </div>
                            <div>{party.name}</div>
                        </div>
                    </td>
                    <td class="govuk-table__cell govuk-table__cell--numeric votes-count">{party.doc_count}</td>
                    <td class="govuk-table__cell govuk-table__cell--numeric percentage">{addZeroes(Math.round(party.percentage * 100) / 100)} %</td>
                    <td class="govuk-table__cell govuk-table__cell--numeric seats">{party.seats ?? '-'}</td>
                </tr>
            {/each}
        </tbody>
    </table>
</div>

<style type="text/scss">
    .govuk-table {
        margin-bottom: 1rem;
        width: 100%;
      min-height: 300px;
        @import "node_modules/@id-sk/frontend/govuk/components/table/_table";
    }
    .party-color-dot {
        width: 1.25rem;
        height: 1.25rem;
        border-radius: 50%;
        margin-right: 1rem;
    }
</style>
