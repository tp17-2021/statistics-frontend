<script>
    export let partyResults;
</script>

<div class="parties-table">
    <h1 class="my-3">Tabulka stran</h1>
    <table class="govuk-table mb-5">
        <thead class="govuk-table__head">
            <tr class="govuk-table__row">
                <th class="govuk-table__header">Poradie</th>
                <th class="govuk-table__header">Nazov</th>
                <th class="govuk-table__header">Hlasov</th>
                <th class="govuk-table__header">Percent</th>
                <th class="govuk-table__header">Sedadiel</th>
            </tr>
        </thead>
        <tbody class="govuk-table__body">
            {#each partyResults as party, i}
                <tr class="govuk-table__row">
                    <td class="govuk-table__cell">{i + 1}</td>
                    <td class="govuk-table__cell">{party.name}</td>
                    <td class="govuk-table__cell govuk-table__cell--numeric">{party.doc_count}</td>
                    <td class="govuk-table__cell govuk-table__cell--numeric">{party.percentage}</td>
                    <td class="govuk-table__cell govuk-table__cell--numeric">{party.seats ?? '-'}</td>
                </tr>
            {/each}
        </tbody>
    </table>
</div>

<style type="text/scss">
    .govuk-table {
        margin-bottom: 1rem;
        width: 100%;
        @import "node_modules/@id-sk/frontend/govuk/components/table/_table";
    }
</style>
