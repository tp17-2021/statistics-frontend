<script>

    import { abbr, baseApiUrl } from "../../lib/helpers/helpers.js";
    import { onMount } from "svelte";

    // Source of codes and inspiration
    // https://cs.github.com/mikenikles/your-analytics/blob/842be6f217db254bc9e6996ce87266461c52e676/services/website/src/components/stats/world-map.svelte?q=chartjs-chart-geo
    export let partiesInParliament;
    export let lookup;
    export let localityResults;
    //export let localityResultsRegions;
    //export let localityResultsCounties;
    export let mapType = 'regions';

    let isLoadedD3 = false;
    let mapElement = null;

    import Chart from "chart.js/auto";
    import axios from "axios";
    import * as JQ from "jquery";

    // import * as d3 from "d3";
    // import {geoPath} from 'd3-geo';

    $: { plotSlovakiaMap(isLoadedD3, localityResults, lookup, partiesInParliament); }

    onMount(async () => {

    });

    async function plotSlovakiaMap(isLoadedD3, localityResults, lookup, partiesInParliament) {

        if(!isLoadedD3 || !localityResults || !lookup || !partiesInParliament) {
            return;
        }

        JQ("#map-container").html("");

        // Map dimensions
        let map_wrapper = JQ("#map-container");
        let width = map_wrapper.parent().width();
        let height = Math.floor(width * 0.7);
    
        // let formatNumber = d3.format("..0f");
        let projection = d3.geo.mercator()
            .scale(8000) // TODO toto pri mobile robi problem
            .center([19.68007426682414, 48.63670023564952]) //projection center
            .translate([width / 2, height / 2]) //translate to center the map in view

        //Generate paths based on projection
        let path = d3.geo.path()
            .projection(projection);

        //Create an SVG
        let svg = d3.select("#map-container").append("svg")
            .attr("width", width)
            .attr("height", height);

        //Group for the map features
        let features = svg.append("g")
            .attr("class", "features");

        let range_colors = ["#CC0000", "#009933", "#0000CC", "#FFCC00", "#0066CC", "#CC6600", "#909090", "#FA8072", "#7f0000"]

        let color = d3.scale.threshold()
            // .domain(color_domain)
            .range(range_colors);


        //Create a tooltip, hidden at the start
        let tooltip = d3.select("body #map-container").append("div").attr("id", "slovakia-map-tooltip").attr("class", "shadow");
        var jq_tooltip = JQ("#slovakia-map-tooltip");
        var tooltipLabel = tooltip.append("div").attr("class", "label");
        var tooltipAttendance = tooltip.append("div").attr("class", "attendance");
        var tooltipResults = tooltip.append("div").attr("class", "results");

        // d3.json("okresy_zaklad.topojson", function(error, geodata) {
        d3.json("api/slovakia.topojson", function(error, geodata) {
            if (error) return console.error(error);

            features.selectAll("path.okres")
                // .data(topojson.feature(geodata, geodata.objects.collection).features)
                .data(topojson.feature(geodata, geodata.objects.okresy).features)
                .enter()
                .append("path")
                .attr("class", "locality okres")
                .attr("d", path)
                .attr("lau1_code", function(path){
                    return path.properties.code;
                })
                .style("fill", function(path) {
                    let lau1_code = path.properties.code;
                    let code = lookup.lau1_to_code[lau1_code].county_code;
                    let resultsPerLocality = localityResultsCounties[code];
                    let firstPartyId = resultsPerLocality.parties[0].id;
                    let firstPartyColor = lookup.parties[firstPartyId].color;
                    return firstPartyColor;
                })
                .style("fill-opacity", "40%")
                .style("stroke", "white")
                .style("stroke-width", "1");

            d3.selectAll("#map-container path").on("mouseover", function (e) {
                let d3object = e;
                let elem = JQ(d3.select(this)[0]);
                let lau1_code = elem.attr("lau1_code");
                let locality_code = lookup.lau1_to_code[lau1_code].county_code
                console.log("lau1_code", lau1_code);
                console.log("locality_code", locality_code);

                if (locality_code) {
                    // let member = lookup.candidates[memberId];

                    // tooltipLabel.text(getCandidateFullName(member));
                    // tooltipCount.text("Počet hlasov: " + member.doc_count);
                    // tooltipPercent.text("Percent: " + member.percentage);

                    let locationName = lookup.lau1_to_code[lau1_code].lau1;
                    console.log("locationName", locationName);
                    tooltipLabel.text(locationName);

                    console.log("tooltip offsets", jq_tooltip.height());
                    let text = '';
                    let res = localityResults[locality_code];
                    console.log("res", res);
                    tooltipAttendance.text("Volebna ucast: " + res.participation + "%");
                    let first_party_percentage_coefficient = 100 / res.parties[0].percentage;
                    res.parties.forEach((party, i) => {
                        if(i < 6){
                            text += `
                            <div class="d-flex ">
                            <div class="party-name">${lookup.parties[party.id].abbr}%</div>
                            <div class="progress mb-1 w-100" style="height: 2rem;">
                                    <div class="progress-bar" role="progressbar" style="width: ${party.percentage * first_party_percentage_coefficient}%; background-color: ${lookup.parties[party.id].color}" aria-valuenow="${party.percentage}" aria-valuemin="0" aria-valuemax="100">${lookup.parties[party.id].abbr}</div>
                            </div>
                            </div>
                        `;
                        }
                    });

                    tooltipResults.html(text);

                    tooltip
                        .style("top", elem.offset().top - (jq_tooltip.height() + 16 ) + "px")
                        .style("left", elem.offset().left - 12 + "px");

                    return tooltip.style("visibility", "visible");
                }
            });
            console.log(d3.selectAll("#map-container path"))
            console.log("---------------------------");
        });
    }

    function zoomed() {
            features.attr("transform", "translate(" + zoom.translate() + ")scale(" + zoom.scale() + ")")
                .selectAll("path.obce")
                .style("stroke-width", 1 / zoom.scale() + "px");
            features.attr("transform", "translate(" + zoom.translate() + ")scale(" + zoom.scale() + ")")
                .selectAll("path.okres")
                .style("stroke-width", 1.0 / zoom.scale() + "px");
        }
</script>

<svelte:head>
    <script src="//d3js.org/d3.v3.min.js" on:load={() => {
        // plotSlovakiaMap();
        isLoadedD3 = true;
        }}></script>
    <!-- <script src="https://cdnjs.cloudflare.com/ajax/libs/d3/7.3.0/d3.min.js" on:load={() => plotSlovakiaMap() }></script> -->
    <!-- <script src="https://d3js.org/d3.v7.min.js" on:load={() => plotSlovakiaMap() }></script> -->
    <script src="//d3js.org/topojson.v1.min.js"></script>
</svelte:head>

<div class="map-wrapper">
    {#if isLoadedD3}
        <div id="map-container" class="map-div" this:bind={mapElement}/>
    {:else}
        <h2>Načítavam...</h2>
    {/if}
</div>

<style type="text/scss">
    :global(#slovakia-map-tooltip) {
        background: white;
        color: #333;
        font-size: 14px;
        font-family: Helvetica;
        position: absolute;
        visibility: hidden;
        text-align: center;
        padding: 16px;
        z-index: 10;
        width: 320px;

        :global(.party-name){
            width: 10rem;
            text-align: left;
            display: flex;
            align-items: center;
            margin-right: 1rem;
        }

        :global(.label) {
            font-size: 1.25rem;
            font-weight: bold;
        }
        :global(.count) {
            font-size: 1.125rem;
        }
        :global(.percent) {
            font-size: 1.125rem;
        }
    }

    :global(path){
        &:hover {
            fill-opacity: 1 !important;
        }
    }
</style>
