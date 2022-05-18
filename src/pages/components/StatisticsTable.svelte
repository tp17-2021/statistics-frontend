<script>
    import LoadingOverlay from "./LoadingOverlay.svelte";

    export let electionsStatus;
</script>

<div class="row">
    <div class="col-12 col-md-8 col-lg-8 mx-auto position-relative">

        {#if !electionsStatus}
            <LoadingOverlay />
        {/if}

        <div class="table-overflow-wrapper">
            <table class="govuk-table">
                <tbody class="govuk-table__body">
                <tr class="govuk-table__row">
                    <th class="govuk-table__cell participation-title">Volebná účasť:</th>
                    <td class="govuk-table__cell govuk-table__cell--numeric participation-value">
                        {#if electionsStatus}
                            {electionsStatus.participation} %
                        {/if}
                    </td>
                </tr>
                <tr class="govuk-table__row">
                    <th class="govuk-table__cell votes-count-title">Počet hlasov spolu:</th>
                    <td class="govuk-table__cell govuk-table__cell--numeric votes-count-value">
                        {#if electionsStatus}
                            {electionsStatus.total_votes}
                        {/if}
                    </td>
                </tr>
                <tr class="govuk-table__row">
                    <th class="govuk-table__cell polling-places-count-title">Počet volebných miestnosti:</th>
                    {#if electionsStatus}
                        <td class="govuk-table__cell govuk-table__cell--numeric polling-places-count-value">{electionsStatus.number_of_polling_places}</td>
                    {/if}
                </tr>
                <!-- <tr class="govuk-table__row">
                    <th class="govuk-table__cell">Počet prázdnych hlasov:</th>
                    {#if electionsStatus}
                        <td class="govuk-table__cell govuk-table__cell--numeric">TODO</td>
                    {/if}
                </tr> -->
                </tbody>
            </table>
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
