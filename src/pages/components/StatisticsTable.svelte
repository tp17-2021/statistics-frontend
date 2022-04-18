<script>
  export let electionsStatus;
  export let electionStatusLoading;
</script>

<div class="row">
  <div class="col-12 col-md-8 col-lg-8 mx-auto position-relative">

    {#if electionStatusLoading}
      <div class="loading-overlay">
        <div class="spinner-border" role="status">
          <span class="sr-only">Loading...</span>
        </div>
      </div>
    {/if}

    <div class="table-overflow-wrapper">
      <table class="govuk-table">
        <tbody class="govuk-table__body">
          <tr class="govuk-table__row">
            <th class="govuk-table__cell">Volebná účasť:</th>
            <td class="govuk-table__cell govuk-table__cell--numeric">
              {electionsStatus.participation} %</td
            >
          </tr>
          <tr class="govuk-table__row">
            <th class="govuk-table__cell">Počet hlasov spolu:</th>
            <td class="govuk-table__cell govuk-table__cell--numeric"
              >{electionsStatus.total_votes}</td
            >
          </tr>
          <tr class="govuk-table__row">
            <th class="govuk-table__cell">Počet volebných miestnosti:</th>
            <td class="govuk-table__cell govuk-table__cell--numeric">{electionsStatus.number_of_polling_places}</td>
          </tr>
          <tr class="govuk-table__row">
            <th class="govuk-table__cell">Počet prázdnych hlasov:</th>
            <td class="govuk-table__cell govuk-table__cell--numeric">TODO</td>
          </tr>
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

  .loading-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(198, 198, 198, 0.809);
    z-index: 1;
    display: flex;
    justify-content: center;
    align-items: center;
  }


</style>
