<script>
    import Chart from "chart.js/auto";
    import { abbr } from "../../lib/helpers/helpers.js";

    export let partyResults;


    $: wathcForResultsChange = renderPartyBarChart(["parties-bar-chart-1", "parties-bar-chart-2"], partyResults);

    function renderPartyBarChart(canvas_ids, data_to_paint) {
        canvas_ids.forEach((element, index) => {
            console.log(index);
            let count_to_paint = [10, 15][index];
            // console.log("count_to_paint" + count_to_paint);
            let start_index = [0, 10][index];
            let data = data_to_paint.slice(
                start_index,
                start_index + count_to_paint
            );
            // console.log(data);
            var ctx = document.getElementById(element).getContext("2d");
            new Chart(ctx, {
                type: "bar",
                data: {
                    labels: data.map((i) => abbr(i.name)),
                    datasets: [
                        {
                            label: "Percent",
                            backgroundColor: data.map((party) => party.color),
                            borderColor: "rgb(255, 99, 132)",
                            data: data.map((party) => party.percentage),
                        },
                    ],
                },
                options: {
                    scales: {
                        x: {
                            grid: {
                                display: false,
                            },
                        },
                    },
                },
            });
        });
    }
</script>

<canvas id="parties-bar-chart-1" />
<canvas id="parties-bar-chart-2" />

<style>
</style>
