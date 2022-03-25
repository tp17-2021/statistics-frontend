<script>
    import Chart from "chart.js/auto";
    import { abbr } from "../../lib/helpers/helpers.js";

    export let partyResults;

    $: wathcForResultsChange = renderPartyBarChart(
        ["parties-bar-chart-1", "parties-bar-chart-2"],
        partyResults
    );

    function renderPartyBarChart(canvas_ids, data_to_paint) {
        if (!data_to_paint.length) {
            return;
        }

        canvas_ids.forEach((element, index) => {
            console.log(index);
            let count_to_paint = [10, 15][index];
            let start_index = [0, 10][index];
            let data = data_to_paint.slice(
                start_index,
                start_index + count_to_paint
            );
            console.log(element);
            console.log(document.getElementById(element));
            var ctx = document.getElementById(element).getContext("2d");
            new Chart(ctx, {
                type: "bar",
                data: {
                    labels: data.map((p) => p.abbr),
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
                    plugins: {
                        legend: {
                            display: false,
                        },
                        tooltip: {
                            // Disable the on-canvas tooltip
                            enabled: true,

                            /*external: function (context) {
                                // Tooltip Element
                                let tooltipEl =
                                    document.getElementById("chartjs-tooltip");

                                // Create element on first render
                                if (!tooltipEl) {
                                    tooltipEl = document.createElement("div");
                                    tooltipEl.id = "chartjs-tooltip";
                                    tooltipEl.innerHTML = "<table></table>";
                                    document.body.appendChild(tooltipEl);
                                }

                                // Hide if no tooltip
                                const tooltipModel = context.tooltip;
                                if (tooltipModel.opacity === 0) {
                                    tooltipEl.style.opacity = 0;
                                    return;
                                }

                                // Set caret Position
                                tooltipEl.classList.remove(
                                    "above",
                                    "below",
                                    "no-transform"
                                );
                                if (tooltipModel.yAlign) {
                                    tooltipEl.classList.add(
                                        tooltipModel.yAlign
                                    );
                                } else {
                                    tooltipEl.classList.add("no-transform");
                                }

                                function getBody(bodyItem) {
                                    return bodyItem.lines;
                                }

                                // Set Text
                                if (tooltipModel.body) {
                                    const titleLines = tooltipModel.title || [];
                                    const bodyLines =
                                        tooltipModel.body.map(getBody);

                                    let innerHtml = "<thead>";

                                    titleLines.forEach(function (title) {
                                        innerHtml +=
                                            "<tr><th>" + title + "</th></tr>";
                                    });
                                    innerHtml += "</thead><tbody>";

                                    bodyLines.forEach(function (body, i) {
                                        const colors =
                                            tooltipModel.labelColors[i];
                                        let style =
                                            "background:" +
                                            colors.backgroundColor;
                                        style +=
                                            "; border-color:" +
                                            colors.borderColor;
                                        style += "; border-width: 2px";
                                        const span =
                                            '<span style="' +
                                            style +
                                            '"></span>';
                                        innerHtml +=
                                            "<tr><td>" +
                                            span +
                                            body +
                                            "</td></tr>";
                                    });
                                    innerHtml += "</tbody>";

                                    let tableRoot =
                                        tooltipEl.querySelector("table");
                                    tableRoot.innerHTML = innerHtml;
                                }

                                const position =
                                    context.chart.canvas.getBoundingClientRect();
                                const bodyFont = Chart.helpers.toFont(
                                    tooltipModel.options.bodyFont
                                );

                                // Display, position, and set styles for font
                                tooltipEl.style.opacity = 1;
                                tooltipEl.style.position = "absolute";
                                tooltipEl.style.left =
                                    position.left +
                                    window.pageXOffset +
                                    tooltipModel.caretX +
                                    "px";
                                tooltipEl.style.top =
                                    position.top +
                                    window.pageYOffset +
                                    tooltipModel.caretY +
                                    "px";
                                tooltipEl.style.font = bodyFont.string;
                                tooltipEl.style.padding =
                                    tooltipModel.padding +
                                    "px " +
                                    tooltipModel.padding +
                                    "px";
                                tooltipEl.style.pointerEvents = "none";
                            },*/
                        },
                    },
                },
            });
        });
    }
</script>

<canvas id="parties-bar-chart-1" />
<canvas id="parties-bar-chart-2" />
