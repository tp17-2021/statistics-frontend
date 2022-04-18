<script>
    export let electionsStatus;
</script>

<div class="row">
    <div class="col-12 col-md-8 col-lg-8 mx-auto">
        <table class="govuk-table">
            <tbody class="govuk-table__body">
                <tr class="govuk-table__row">
                    <th class="govuk-table__cell">Volebná účasť:</th>
                    <td
                        class="govuk-table__cell govuk-table__cell--numeric"
                        > {electionsStatus.participation} %</td
                    >
                </tr>
                <tr class="govuk-table__row">
                    <th class="govuk-table__cell">Počet hlasov spolu: </th>
                    <td
                        class="govuk-table__cell govuk-table__cell--numeric"
                        >{electionsStatus.total_votes}</td
                    >
                </tr>
                <tr class="govuk-table__row">
                    <th class="govuk-table__cell">Počet volebných miestností: </th>
                    <td
                        class="govuk-table__cell govuk-table__cell--numeric"
                        >TODO</td
                    >
                </tr>
                <tr class="govuk-table__row">
                    <th class="govuk-table__cell">Počet prázdnych hlasov: </th>
                    <td
                        class="govuk-table__cell govuk-table__cell--numeric"
                        >TODO</td
                    >
                </tr>
            </tbody>
        </table>
    </div>
</div>

<style type="text/scss">
    .govuk-table {
        margin-bottom: 1rem;
        width: 100%;
        @import "node_modules/@id-sk/frontend/govuk/components/table/_table";
    }
</style>
