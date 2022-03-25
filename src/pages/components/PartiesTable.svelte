<script>
    export let partyResults;
</script>

<div class="parties-table">
    <table class="govuk-table">
        <thead class="govuk-table__head">
            <tr class="govuk-table__row">
                <th scope="col" class="govuk-table__header">Poradie</th>
                <th scope="col" class="govuk-table__header">Názov</th>
                <th scope="col" class="govuk-table__header govuk-table__header--numeric">Hlasov</th>
                <th scope="col" class="govuk-table__header govuk-table__header--numeric">Percent</th>
                <th scope="col" class="govuk-table__header govuk-table__header--numeric">Sedadiel</th>
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
