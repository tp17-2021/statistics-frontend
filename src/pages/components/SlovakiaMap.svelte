<script>

    // Source of codes and inspiration
    // https://cs.github.com/mikenikles/your-analytics/blob/842be6f217db254bc9e6996ce87266461c52e676/services/website/src/components/stats/world-map.svelte?q=chartjs-chart-geo
    export let partiesInParliament;
    export let lookup;

    import Chart from "chart.js/auto";
    import axios from "axios";
    import * as JQ from "jquery";

    // import * as d3 from "d3";
    // import {geoPath} from 'd3-geo';

    import { onMount } from "svelte";

    onMount(async () => {
    });

    async function plotSlovakiaMap() {

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

        let color_domain = [200, 300, 400, 500, 600, 700, 800]
        let ext_color_domain = [0, 200, 300, 400, 500, 600, 700, 800]

        let ext_color_domain2 = [0, 200, 300, 400, 500, 600, 700, 800]
        ext_color_domain2.reverse();

        let range_colors = ["#CC0000", "#009933", "#0000CC", "#FFCC00", "#0066CC", "#CC6600", "#909090", "#FA8072", "#7f0000"]

        let color = d3.scale.threshold()
            .domain(color_domain)
            .range(range_colors);


        //Create zoom/pan listener
        //Change [1,Infinity] to adjust the min/max zoom scale
        // let zoom = d3.behavior.zoom()
        //     .scaleExtent([1, Infinity])
        //     .on("zoom", zoomed);

        // svg.call(zoom);

        let rectangle = svg.append("rect")
            .attr("x", 2)
            .attr("y", 10)
            .attr("rx", 10)
            .attr("ry", 10)
            .attr("opacity", 1.0)
            .attr("fill", '#F7F7F7')
            .attr("stroke", '#707070')
            .attr("stroke-width", '0.2px')
            .attr("width", 173)
            .attr("height", 145);

        //Create a tooltip, hidden at the start
        let tooltip = d3.select("body #map-container").append("div").attr("id", "slovakia-map-tooltip");
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
                .attr("code", function(path){
                    return path.properties.code.replace("SK0", "");
                })
                .style("fill", function() {
                    return range_colors[Math.floor(Math.random() * range_colors.length)];
                })
                .style("fill-opacity", "60%")
                .style("stroke", "white")
                .style("stroke-width", "2");

            d3.selectAll("#map-container path").on("mouseover", function (e) {
                console.log(e);
                let d3object = e;
                console.log(d3.select(this));
                let elem = JQ(d3.select(this)[0]);
                console.log(elem);
                let code = elem.attr("code");
                console.log("code", code);

                if (code) {
                    // let member = lookup.candidates[memberId];

                    // tooltipLabel.text(getCandidateFullName(member));
                    // tooltipCount.text("Počet hlasov: " + member.doc_count);
                    // tooltipPercent.text("Percent: " + member.percentage);

                    // let locationName = lookup.counties[code].name
                    // console.log(lookup.counties[code]);
                    // tooltipLabel.text(locationName);
                    tooltipAttendance.text("Volebna ucast hlasov: " + "1");
                    let progressBarMarkup = `
                    <div class="progress">
                            <div class="progress-bar" role="progressbar" style="width: 25%" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div>
                    </div>
                    `;
                    tooltipResults.html(progressBarMarkup);

                    console.log("tooltip offsets", jq_tooltip.height());

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
    <script src="//d3js.org/d3.v3.min.js" on:load={() => plotSlovakiaMap() }></script>
    <!-- <script src="https://cdnjs.cloudflare.com/ajax/libs/d3/7.3.0/d3.min.js" on:load={() => plotSlovakiaMap() }></script> -->
    <!-- <script src="https://d3js.org/d3.v7.min.js" on:load={() => plotSlovakiaMap() }></script> -->
    <script src="//d3js.org/topojson.v1.min.js"></script>
</svelte:head>

<div class="parties-table">
    <button class="btn btn-primary" on:click={() => plotSlovakiaMap()}>plotSlovakiaMap</button>
    <h1 class="my-3">Mapa slovenska</h1>
    <div id="map-container" />
</div>

<style type="text/scss">
    :global(#slovakia-map-tooltip) {
        background: white;
        color: #333;
        font-size: 14px;
        font-family: Helvetica;
        border-radius: 4px;
        position: absolute;
        visibility: hidden;
        text-align: center;
        padding: 16px;
        z-index: 10;

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
</style>
