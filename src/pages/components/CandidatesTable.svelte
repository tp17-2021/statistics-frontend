<script lang="ts">
  export let data;
  export let lookup;

  import { abbr, addZeroes, getCandidateFullName } from "../../lib/helpers/helpers.js";
  import { searchAndPaginate } from "../../lib/components/pagination/paginate";
  import PaginationLinks from "../../lib/components/pagination/PaginationLinks.svelte";
  import type { IpaginationObject } from "../../lib/components/pagination/paginate";
  import SvelteTooltip from "svelte-tooltip";

  let onlyInParliament;

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

  function paginateCandidates(_ = null) {
    if (!data) return;

    if (onlyInParliament) {
      paginationObject.items = data.filter(
        (candidate) => candidate.in_parliament
      );
    } else {
      paginationObject.items = data;
    }
    paginationObject.paginatedItems = [];
    console.log("paginationObject.items", paginationObject.items);
    console.log("paginationObject.items onlyInParliament", onlyInParliament);
    searchAndPaginate(paginationObject); // paginationObject is updated inside this function
    paginatedCandidates = [...paginationObject.paginatedItems];
  }

  let paginatedCandidates = [];

  function checkBoxChanged(onlyInParliament) {
    paginationObject.currentPageNumber = 1;
    paginateCandidates();
  }

  $: checkBoxChanged(onlyInParliament);

  $: paginateCandidates(data);

  // $: console.log("CPT data", data);
  // $: console.log("CPT paginatedCandidates", paginatedCandidates);
  // $: console.log("CPT data", paginationObject.items);
  // $: console.log("CPT countOfPages", paginationObject.countOfPages);
</script>

<!-- <p>CPT paginatedCandidates length: {paginatedCandidates.length}</p>
<p>CPT paginationObject items length: {paginationObject.items.length}</p>
<p>CPT data length: {data.length}</p> -->

<div class="candidates-table-wrapper">
  <div class="row">
    <div class="col-12 col-md-8 mx-auto">
      <div class="govuk-form-group">
        <input
          class="govuk-input"
          type="text"
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
  </div>

  <div class="govuk-form-group">
    <div class="govuk-checkboxes govuk-checkboxes--small">
      <div class="govuk-checkboxes__item">
        <input
          class="govuk-checkboxes__input"
          id="onlyInParliament"
          type="checkbox"
          bind:checked={onlyInParliament}
        />
        <label
          class="govuk-label govuk-checkboxes__label"
          for="onlyInParliament"
        >
          Zobraziť iba kandidátov, ktorí sú v parlamente
        </label>
      </div>
    </div>
  </div>
  <!--    <label>-->
  <!--        <input type=checkbox bind:checked={onlyInParliament}>-->
  <!--        Zobraziť iba kandidátov, ktorí sú v parlamente-->
  <!--    </label>-->

  <div class="table-overflow-wrapper">
    <table class="govuk-table mb-3">
      <colgroup>
        <col style="width:30%" />
        <col style="width:20%" />
        <col style="width:10%" />
        <col style="width:15%" />
        <col style="width:15%" />
      </colgroup>
      <thead class="govuk-table__head">
        <tr class="govuk-table__row">
          <th scope="col" class="govuk-table__header">Meno</th>
          <th scope="col" class="govuk-table__header">Strana</th>
          <th scope="col" class="govuk-table__header">V&nbsp;parlamente</th>
          <th
            scope="col"
            class="govuk-table__header govuk-table__header--numeric"
            >Hlasov
          </th>
          <th
            scope="col"
            class="govuk-table__header govuk-table__header--numeric"
            >Percent
          </th>
        </tr>
      </thead>
      <tbody class="govuk-table__body">
        <!-- {#each partiesInParliament as party} -->
        {#each paginatedCandidates as candidate}
          <tr class="govuk-table__row">
            <td class="govuk-table__cell">{getCandidateFullName(candidate)}</td>
            <td
              class="govuk-table__cell"
              data-bs-toggle="tooltip"
              data-bs-placement="top"
              title="Tooltip on top"
            >
              <SvelteTooltip
                tip={lookup.parties[candidate.party_number - 1].name}
                top
                color="#FFFFFF"
              >
                {lookup.parties[candidate.party_number - 1].abbr}
              </SvelteTooltip>
            </td>
            <td class="govuk-table__cell text-center">
              {#if candidate.in_parliament}
                <svg
                  width="24"
                  height="18"
                  viewBox="0 0 24 18"
                  fill="green"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect
                    x="6.27441"
                    y="15.3357"
                    width="21.3445"
                    height="3.65646"
                    transform="rotate(-45 6.27441 15.3357)"
                  />
                  <rect
                    x="2.60352"
                    y="6.4939"
                    width="12.4919"
                    height="3.68208"
                    transform="rotate(45 2.60352 6.4939)"
                  />
                </svg>
              {/if}
            </td>
            <td class="govuk-table__cell govuk-table__cell--numeric"
              >{candidate.doc_count}</td
            >
            <td class="govuk-table__cell govuk-table__cell--numeric"
              >{addZeroes(Math.round(candidate.percentage * 100) / 100)} %
            </td>
          </tr>
        {/each}

        <!-- {/each} -->
      </tbody>
    </table>
  </div>

  {#if paginatedCandidates.length == 0}
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
