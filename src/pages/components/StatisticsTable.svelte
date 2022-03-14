<script>
    export let electionsStatus;
</script>

<div class="statistics-table my-5">
    <div class="container">
        <div class="row">
            <div class="col-12 col-md-8 col-lg-8 mx-auto">
                <h1 class="my-3">Statistiky</h1>
                <table class="govuk-table mb-5">
                    <tbody class="govuk-table__body">
                        <tr class="govuk-table__row">
                            <th class="govuk-table__cell">Volebna ucast:</th>
                            <td
                                class="govuk-table__cell govuk-table__cell--numeric"
                                > {electionsStatus.participation} %</td
                            >
                        </tr>
                        <tr class="govuk-table__row">
                            <th class="govuk-table__cell">Pocet hlasov spolu: </th>
                            <td
                                class="govuk-table__cell govuk-table__cell--numeric"
                                >{electionsStatus.total_votes}</td
                            >
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</div>

<style type="text/scss">
    .govuk-table {
        margin-bottom: 1rem;
        width: 100%;
        @import "node_modules/@id-sk/frontend/govuk/components/table/_table";
    }
</style>
