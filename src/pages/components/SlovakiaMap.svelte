<script>

    // TODO existuje aj region zahranicie v datach zo serveru, to treba tiez nejako spravit
    // TODO treba upravit seedovanie tak aby sa rozlisili vysledky pre lokality

    import { abbr, baseApiUrl } from "../../lib/helpers/helpers.js";
    import { onMount } from "svelte";

    // Source of codes and inspiration
    // https://cs.github.com/mikenikles/your-analytics/blob/842be6f217db254bc9e6996ce87266461c52e676/services/website/src/components/stats/world-map.svelte?q=chartjs-chart-geo
    export let partiesInParliament;
    export let lookup;
    export let localityResults;
    export let uniqueID;
    //export let localityResultsRegions;
    //export let localityResultsCounties;
    export let mapType = 'regions';

    let isLoadedD3 = false;
    let mapElement = null;

    import Chart from "chart.js/auto";
    import axios from "axios";
    import * as JQProxy from "jquery";
    import LoadingOverlay from "./LoadingOverlay.svelte";
    const JQ = (JQProxy).default || JQProxy;

    // import * as d3 from "d3";
    // import {geoPath} from 'd3-geo';

    $: plotSlovakiaMap(isLoadedD3, localityResults, lookup, partiesInParliament, mapContainerWidth);

    onMount(async () => {

    });

    async function plotSlovakiaMap(isLoadedD3, localityResults, lookup, partiesInParliament, mapContainerWidth) {
        if(!isLoadedD3 || !localityResults || !lookup || !partiesInParliament || !mapContainerWidth) {
            console.log("mapContainerWidth ignored", mapContainerWidth);
            return;
        }
        console.log("mapContainerWidth", mapContainerWidth);


        JQ("#map-container-"+uniqueID).html("");

        // Map dimensions
        let map_wrapper = JQ("#map-container-"+uniqueID);
        console.log("map_wrapper", map_wrapper);
        let width = map_wrapper.parent().parent().width();
        console.log("map_wrapper.parent()", map_wrapper.parent());
        let height = Math.floor(width * 0.7);

        // let formatNumber = d3.format("..0f");
        let projection = d3.geo.mercator()
        .scale(mapContainerWidth * 10) // TODO toto pri mobile robi problem
        .center([19.68007426682414, 48.63670023564952]) //projection center
        .translate([width / 2, height / 2]) //translate to center the map in view

        //Generate paths based on projection
        let path = d3.geo.path()
        .projection(projection);

        //Create an SVG
        let svg = d3.select("#map-container-"+uniqueID).append("svg")
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
        let tooltip = d3.select("body #map-container-"+uniqueID).append("div")
        .attr("id", "slovakia-map-tooltip-"+uniqueID)
        .attr("class", "shadow slovakia-map-tooltip");
        var jq_tooltip = JQ("#slovakia-map-tooltip-"+uniqueID);
        var tooltipLabel = tooltip.append("div").attr("class", "label");
        var tooltipAttendance = tooltip.append("div").attr("class", "attendance");
        var tooltipResults = tooltip.append("div").attr("class", "results");

        // d3.json("okresy_zaklad.topojson", function(error, geodata) {
            d3.json("api/slovakia.topojson", function(error, geodata) {
                if (error) return console.error(error);

                let topojsonDataBasedOnType = (mapType == "regions") ? geodata.objects.kraje : geodata.objects.okresy;

                features.selectAll("path.okres")
                // .data(topojson.feature(geodata, geodata.objects.collection).features)
                .data(topojson.feature(geodata, topojsonDataBasedOnType).features)
                .enter()
                .append("path")
                .attr("class", "locality okres")
                .attr("d", path)
                .attr("lau1_code", function(path){
                    return path.properties.code;
                })
                .style("fill", function(path) {
                    let locality_code = null;
                    // console.log("path", path);
                    if(mapType == "regions"){
                        let nuts3 = path.properties.code;
                        // console.log("nuts3", nuts3);
                        // console.log("lookup.nuts3_to_region_code", lookup.nuts3_to_region_code);
                        locality_code = lookup.nuts3_to_region_code[nuts3]
                        // console.log("locality_code", locality_code);
                    } else {
                        let lau1_code = path.properties.code;
                        locality_code = lookup.lau1_to_code[lau1_code].county_code;
                        // console.log("lau1_code", lau1_code);
                    }

                    let resultsInLocality = localityResults[locality_code];
                    let firstPartyId = resultsInLocality.parties[0].id;
                    let firstPartyColor = lookup.parties[firstPartyId].color;
                    return firstPartyColor;
                })
                .style("fill-opacity", "40%")
                .style("stroke", "white")
                .style("stroke-width", "1");

                d3.selectAll("#map-container-"+uniqueID+" path").on("mouseover", function (e) {
                    let d3object = e;
                    let elem = JQ(d3.select(this)[0]);

                    let locality_code = null;

                    if(mapType == "regions"){
                        let nuts3 = elem.attr("lau1_code");
                        locality_code = lookup.nuts3_to_region_code[nuts3]
                    } else {
                        let lau1_code = elem.attr("lau1_code");
                        locality_code = lookup.lau1_to_code[lau1_code].county_code;
                    }

                    if (locality_code) {
                        let locationName = (mapType == "regions") ? lookup.regions[locality_code].name : lookup.counties[locality_code].name;
                        let text = '';
                        let res = localityResults[locality_code];
                        let first_party_percentage_coefficient = 100 / res.parties[0].percentage;

                        tooltipLabel.text(locationName);
                        tooltipAttendance.text("Volebna ucast: " + res.participation + "%");

                        res.parties.forEach((party, i) => {
                            if(i < 6){
                                text += `
                                <div class="d-flex ">
                                    <div class="party-name">${lookup.parties[party.id].abbr}</div>
                                    <div class="progress mb-1 w-100" style="height: 2rem;">
                                        <div class="progress-bar" role="progressbar" style="width: ${party.percentage * first_party_percentage_coefficient}%; background-color: ${lookup.parties[party.id].color}" aria-valuenow="${party.percentage}" aria-valuemin="0" aria-valuemax="100">${ Math.round(party.percentage * 100) / 100} %</div>
                                    </div>
                                </div>
                                `;
                            }
                        });

                        tooltipResults.html(text);

                        let parentPos = elem.parent().parent().parent()[0].getBoundingClientRect()
                        let childPos = elem[0].getBoundingClientRect();
                        let left = childPos.left  - parentPos.left - 48 + "px";
                        let top = childPos.top - parentPos.top + 64 + "px";  // + (jq_tooltip.height() )

                        tooltip
                        .style("top", top)
                        .style("left", left);

                        return tooltip.style("visibility", "visible");
                    }
                });
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

    let mapContainerWidth;
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

<div class="map-container-wrapper" bind:clientWidth={mapContainerWidth}>
    {#if !isLoadedD3 || !localityResults || !lookup || !partiesInParliament || !mapContainerWidth}
        <LoadingOverlay />
    {/if}
    <div id="map-container-{uniqueID}" class="map-container" ></div>
</div>


<style type="text/scss">
    :global(.slovakia-map-tooltip) {
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
        pointer-events:none;

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

    .map-container {
      position: relative;
    }

    .map-container-wrapper {
      width: 100%;
      min-height: 300px;
    }
</style>
