<script>
    export let partiesInParliament;
    import Chart from "chart.js/auto";
    import axios from "axios";
    import * as ChartGeo from "chartjs-chart-geo";
    import {
        ChoroplethController,
        GeoFeature,
        ColorScale,
        ProjectionScale,
    } from "chartjs-chart-geo";
    import { onMount } from "svelte";

    // register controller in chart.js and ensure the defaults are set
    Chart.register(
        ChoroplethController,
        GeoFeature,
        ColorScale,
        ProjectionScale
    );

    onMount(async () => {
        console.log("========================================");
        // const us = await fetch(
        //     "https://unpkg.com/us-atlas/states-10m.json"
        // ).then((r) => r.json());
        // console.log(us);
        // // whole US for the outline
        // const nation = ChartGeo.topojson.feature(us, us.objects.nation)
        //     .features[0];
        // // individual states

        // console.log("nation", nation);
        // const states = ChartGeo.topojson.feature(
        //     us,
        //     us.objects.states
        // ).features;
        // console.log("states", states);
        // const alaska = states.find((d) => d.properties.name === "Alaska");
        // const california = states.find(
        //     (d) => d.properties.name === "California"
        // );

        // const config = {
        //     data: {
        //         labels: ["Alaska", "California"],
        //         datasets: [
        //             {
        //                 label: "States",
        //                 outline: nation, // ... outline to compute bounds
        //                 showOutline: true,
        //                 data: [
        //                     {
        //                         value: 0.4,
        //                         feature: alaska, // ... the feature to render
        //                     },
        //                     {
        //                         value: 0.3,
        //                         feature: california,
        //                     },
        //                 ],
        //             },
        //         ],
        //     },
        //     options: {
        //         scales: {
        //             xy: {
        //                 projection: "albersUsa", // ... projection method
        //             },
        //         },
        //     },
        // };

        fetch("https://unpkg.com/us-atlas/states-10m.json")
            .then((r) => r.json())
            .then((us) => {
                console.log("us", us);
                const nation = ChartGeo.topojson.feature(us, us.objects.nation)
                    .features[0];
                const states = ChartGeo.topojson.feature(
                    us,
                    us.objects.states
                ).features;

                console.log(
                    "mapped maerican",
                    states.map((d) => ({
                        feature: d,
                        value: Math.random() * 10,
                    }))
                );
                const chart = new Chart(
                    document.getElementById("slovakia-map").getContext("2d"),
                    {
                        type: "choropleth",
                        data: {
                            labels: states.map((d) => d.properties.name),
                            datasets: [
                                {
                                    label: "States",
                                    outline: nation,
                                    data: states.map((d) => ({
                                        feature: d,
                                        value: Math.random() * 10,
                                    })),
                                },
                            ],
                        },
                        options: {
                            plugins: {
                                legend: {
                                    display: false,
                                },
                            },
                            scales: {
                                xy: {
                                    projection: "albersUsa",
                                },
                                color: {
                                    quantize: 5,
                                    legend: {
                                        position: "bottom-right",
                                        align: "bottom",
                                    },
                                },
                            },
                        },
                    }
                );
            });

        let topo_data = (await axios.get("api/slovakia_topo.json")).data;
        console.log("---------------------------------");
        console.log("topo_data", topo_data);
        const states = ChartGeo.topojson.feature(
            topo_data,
            topo_data.objects.okresy
        ).features;
        console.log("states", states);
        console.log(
            "mapped",
            states.map((d) => ({
                feature: d,
                value: Math.random() * 10,
            }))
        );
        console.log(
            "labels",
            states.map((d) => d.properties.name)
        );
        const chart2 = new Chart(
            document.getElementById("slovakia-map2").getContext("2d"),
            {
                type: "choropleth",
                data: {
                    labels: states.map((d) => d.properties.name),
                    datasets: [
                        {
                            label: "States",
                            // outline: nation,
                            data: states.map((d) => ({
                                feature: d,
                                value: Math.random() * 10,
                            })),
                        },
                    ],
                },
                options: {
                    plugins: {
                        legend: {
                            display: false,
                        },
                    },
                    scales: {
                        xy: {
                            projection: "albersUsa",
                        },
                        color: {
                            quantize: 5,
                            legend: {
                                position: "bottom-right",
                                align: "bottom",
                            },
                        },
                    },
                },
            }
        );
    });
</script>

<div class="parties-table">
    <h1 class="my-3">Mapa slovenska</h1>
    <canvas id="slovakia-map" />
    <canvas id="slovakia-map2" />
</div>

<style type="text/scss">
</style>
