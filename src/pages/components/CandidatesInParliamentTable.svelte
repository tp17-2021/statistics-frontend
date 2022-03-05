<script>
    export let partiesInParliament;
    import { abbr } from "../../lib/helpers/helpers.js";
    console.log("partiesInParliament : ", partiesInParliament);
</script>

<div class="candidates-table">
    <h1 class="my-3">Tabulka poslancov</h1>
    <table class="mb-5">
        <thead>
            <tr>
                <th>Meno</th>
                <th>Hlasov</th>
                <th>Percent</th>
                <th>Strana</th>
            </tr>
        </thead>
        {#each partiesInParliament as party}
            {#each party.candidates as candidate}
                <tr>
                    <td>{candidate.first_name}</td>
                    <td>{candidate.doc_count}</td>
                    <td>{candidate.percentage}</td>
                    <td>{abbr(party.name)}</td>
                </tr>
            {/each}
        {/each}
    </table>
</div>

<style>
</style>
