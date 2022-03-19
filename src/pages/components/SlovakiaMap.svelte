<script>
    // https://cs.github.com/mikenikles/your-analytics/blob/842be6f217db254bc9e6996ce87266461c52e676/services/website/src/components/stats/world-map.svelte?q=chartjs-chart-geo
    export let partiesInParliament;
    import Chart from "chart.js/auto";
    import axios from "axios";
    import * as JQ from "jquery";

    // import * as d3 from "d3";
    // import {geoPath} from 'd3-geo';

    import { onMount } from "svelte";

    onMount(async () => {
        console.log("========================================");
        // plotSlovakiaMap();
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

        // let legend_labels = ["Bratislavský VÚC", "Trnavský VÚC", "Trenčiansky VÚC", "Nitriansky VÚC", "Žilinský VÚC", "Banskobystrický VÚC", "Prešovský VÚC", "Košický VÚC"]
        // legend_labels.reverse();
        let range_colors = ["#CC0000", "#009933", "#0000CC", "#FFCC00", "#0066CC", "#CC6600", "#909090", "#FA8072", "#7f0000"]
            //range_colors.reverse();


        let color = d3.scale.threshold()
            .domain(color_domain)
            .range(range_colors);


        //Create zoom/pan listener
        //Change [1,Infinity] to adjust the min/max zoom scale
        let zoom = d3.behavior.zoom()
            .scaleExtent([1, Infinity])
            .on("zoom", zoomed);

        svg.call(zoom);

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
        let tooltip = d3.select("body").append("div").attr("class", "tooltip");

        // vykreslenie legendy
        // let legend = svg.selectAll("g.legend")
        //     .data(ext_color_domain2)
        //     .enter().append("g")
        //     .attr("class", "legend");

        let ls_w = 25,
            ls_h = 15; // sirka a vyska dielikov v legende

        // legend.append("rect")
        //     .attr("x", 10)
        //     //.attr("y", function(d, i){ return height - (i*ls_h) - 2*ls_h;})
        //     .attr("y", function(d, i) {
        //         return 160 - (i * ls_h) - 2 * ls_h;
        //     })
        //     .attr("width", ls_w)
        //     .attr("height", ls_h)
        //     .style("fill", function(d, i) {
        //         return color(d);
        //     })
        //     .style("opacity", 1.0); //0.0 - 1.0

        // legend.append("text")
        //     .attr("x", 47)
        //     //.attr("y", function(d, i){ return height - (i*ls_h) - ls_h - 4;})
        //     .attr("y", function(d, i) {
        //         return 160 - (i * ls_h) - ls_h - 4;
        //     })
        //     .text(function(d, i) {
        //         return legend_labels[i];
        //     });

        // d3.json("okresy_zaklad.topojson", function(error, geodata) {
        d3.json("api/slovakia.topojson", function(error, geodata) {
            if (error) return console.error(error);

            features.selectAll("path.okres")
                // .data(topojson.feature(geodata, geodata.objects.collection).features)
                .data(topojson.feature(geodata, geodata.objects.okresy).features)
                .enter()

            .append("path")
                .attr("class", "okres")
                .attr("d", path)
                .style("fill", function() {
                    return range_colors[Math.floor(Math.random() * range_colors.length)];
                })
                .style("fill-opacity", "60%")
                .style("stroke", "white")
                .style("stroke-width", "2")
                // .append("title")

        });

        JQ("path.okres").hover(function(){
            alert("as");
        });

        function zoomed() {
            features.attr("transform", "translate(" + zoom.translate() + ")scale(" + zoom.scale() + ")")
                .selectAll("path.obce")
                .style("stroke-width", 1 / zoom.scale() + "px");
            features.attr("transform", "translate(" + zoom.translate() + ")scale(" + zoom.scale() + ")")
                .selectAll("path.okres")
                .style("stroke-width", 1.0 / zoom.scale() + "px");
        }

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
</style>
