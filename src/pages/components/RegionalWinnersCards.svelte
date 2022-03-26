<script>
    export let lookup;
    export let localityResultsRegions = [];

    $: watchForResultsChange = renderResultCards(localityResultsRegions);

    let data = [];
    let first_party_percentage_coefficient = null;

    function renderResultCards(_data) {
        if (!_data) {
            return;
        }
        data = Object.values(_data);
        console.log("data t", data);
    }

    function getFirstPartyCoefficient(region_data){
        return (100 / region_data.parties[0].percentage);
    }
</script>

<section class="regional-winners-cards-content mb-5" >
    <h1 class="text-center mb-3">TAbles per region, clicable calls filter ...</h1>
    <div class="wrapper">
        <div class="row">
            {#each data as region_data, i}
                <div class="col-md-6 col-lg-4">
                    <div class="idsk-card idsk-card-basic w-100 shadow p-3">
                        <div class="idsk-card-content idsk-card-content-basic">
                            <div
                                class="idsk-heading idsk-heading-basic text-center"
                            >
                                <a
                                    href="#"
                                    class="idsk-card-title govuk-link"
                                    title="Lorem ipsum dolor sit amet: consectetur adipiscing elit!"
                                    >{lookup.regions[region_data.code].name}</a
                                >
                            </div>

                            <div class="mb-3 text-center small">
                                Participation: {region_data.participation}
                            </div>

                            <p class="idsk-body idsk-body-basic">

                                {#each region_data.parties as party, i}
                                    {#if i < 6}
                                        <div class="d-flex ">
                                            <div class="party-name">
                                                {lookup.parties[party.id].abbr}
                                            </div>
                                            <div
                                                class="progress mb-1 w-100"
                                                style="height: 2rem;"
                                            >
                                                <div
                                                    class="progress-bar"
                                                    role="progressbar"
                                                    style="width: {party.percentage *
                                                        getFirstPartyCoefficient(region_data)}%; background-color: {lookup
                                                        .parties[party.id]
                                                        .color}"
                                                    aria-valuenow="{party.percentage}"
                                                    aria-valuemin="0"
                                                    aria-valuemax="100"
                                                >
                                                    {lookup.parties[party.id]
                                                        .percentage} %
                                                </div>
                                            </div>
                                        </div>
                                    {/if}
                                {/each}
                            </p>
                        </div>
                    </div>
                </div>
            {/each}
        </div>
    </div>
</section>

<style type="text/scss">
    .party-name{
            width: 12rem;
            text-align: left;
            display: flex;
            align-items: center;
            margin-right: 1rem;
        }
</style>
