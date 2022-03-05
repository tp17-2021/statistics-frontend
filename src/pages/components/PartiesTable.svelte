<script>
    export let partyResults;

</script>

<div class="parties-table">
    <h1 class="my-3">Tabulka stran</h1>
    <table class="mb-5">
        <thead>
            <tr>
                <th>Poradie</th>
                <th>Nazov</th>
                <th>Hlasov</th>
                <th>Percent</th>
                <th>Sedadiel</th>
            </tr>
        </thead>
        {#each partyResults as party, i}
            <tr>
                <td>{i + 1}</td>
                <td>{party.name}</td>
                <td>{party.doc_count}</td>
                <td>{party.percentage}</td>
                <td>{party.seats}</td>
            </tr>
        {/each}
    </table>
</div>

<style>
</style>
