<script>
    import Chart from "chart.js/auto";
    import { onMount } from "svelte";
    import axios from "axios";
    import * as JQ from "jquery";
    import * as d3 from "d3";

    var partyResults = [];
    var electionsStatus = [];
    var partiesInParliament = [];
    var config = null;
    var lookup = {
        parties: {},
        candidates: {},
    };

    onMount(async () => {
        config = (await axios.get("api/config.json")).data;
        config.parties.forEach((party) => {
            let partyWithoutCandidates = Object.assign({}, party);
            delete partyWithoutCandidates.candidates;

            lookup.parties[party["_id"]] = partyWithoutCandidates;

            party.candidates.forEach((candidate) => {
                lookup.candidates[candidate["_id"]] = candidate;
            });
        });

        partyResults = await getPartyResults();
        console.log("gere");
        partyResults.forEach((party, index) => {
            party.candidates.forEach((candidate, c_index)=> {
                party.candidates[c_index] = { ...candidate, ...lookup.candidates[candidate.id] };
            });
            console.log(party);
            console.log("merging with", lookup.parties[party.id]);
            partyResults[index] = { ...party, ...lookup.parties[party.id] };


        });
        console.log("partyResults", partyResults);

        partiesInParliament = partyResults.filter((i) => i.in_parliament);
        console.log("partiesInParliament", partiesInParliament);
        electionsStatus = await getElectionsStatus();

        console.log("electionsStatus", electionsStatus);


        console.log("Loaded");
        renderPartyBarChart(["myChart1", "myChart2"], partyResults);
        renderLineChartVotesInTime("myChart3");

        console.log(partyResults);

        setUpParliamentDiagramResults();
    });

    async function getElectionsStatus() {
        const response = await axios.get(url("/elastic/elections-status"));
        return response.data.data;
    }

    function abbr(x, count = 4) {
        count = (x.length < count) ?  x.length : count;
        return x.substring(0, count);
    }

    function url(path) {
        let base = "http://localhost:8222";
        return `${base}${path}`;
    }

    async function getPartyResults() {
        const response = await axios.post(
            url("/elastic/get-party-candidate-results"),
            {}
        );
        return response.data;
    }

    function renderPartyBarChart(canvas_ids, data_to_paint) {
        canvas_ids.forEach((element, index) => {
            console.log(index);
            let count_to_paint = [10, 15][index];
            console.log("count_to_paint" + count_to_paint);
            let start_index = [0, 10][index];
            let data = data_to_paint.slice(
                start_index,
                start_index + count_to_paint
            );
            console.log(data);
            var ctx = document.getElementById(element).getContext("2d");
            new Chart(ctx, {
                type: "bar",
                data: {
                    labels: data.map((i) => abbr(i.name)),
                    datasets: [
                        {
                            label: "Percent",
                            backgroundColor: "rgb(255, 99, 132)",
                            borderColor: "rgb(255, 99, 132)",
                            data: data.map((i) => i.percentage),
                        },
                    ],
                },
                options: {},
            });
        });
    }

    function renderLineChartVotesInTime(canvas_id) {
        const labels = [
            "Strana1",
            "Strana2",
            "Strana3",
            "Strana4",
            "Strana5",
            "Strana6",
            "Strana7",
        ];
        const data = {
            labels: labels,
            datasets: [
                {
                    label: "My First Dataset",
                    data: [65, 59, 80, 81, 56, 55, 40],
                    fill: false,
                    borderColor: "rgb(75, 192, 192)",
                    tension: 0.1,
                },
            ],
        };
        const config = {
            type: "line",
            data: data,
        };
        var ctx = document.getElementById(canvas_id).getContext("2d");
        var chart = new Chart(ctx, config);
    }

    function setUpParliamentDiagramResults() {
        var JQparliament_wrapper = JQ("#parliament-map");

        var w = JQparliament_wrapper.parent().width(),
            h = Math.floor(JQparliament_wrapper.parent().width() * 0.7),
            d = Math.min(w, h * 1.5),
            r0 = d * 0.2,
            r1 = d * 0.45,
            cx = w * 0.5,
            cy = d * 0.5,
            dots = 150,
            rows = 6,
            radii = d3.range(rows).map(function (i) {
                return r0 + i * ((r1 - r0) / rows);
            }),
            phi = Math.PI * 1.1,
            total_l = 0;

        radii.forEach(function (r) {
            total_l += phi * r;
        });

        var dot_l = total_l / dots;

        console.log("Sizes:", h, w);
        var svg = d3
            .select("#parliament-map")
            .append("svg")
            .attr("height", h)
            .attr("width", w)
            .append("g")
            .attr("class", "rows-wrapper")
            .attr("transform", "translate(" + cx + "," + cy + ")");

        var dots_total = 0;
        radii.forEach(function (r, i) {
            var dot_cnt =
                    i == radii.length - 1
                        ? dots - dots_total
                        : Math.round(((phi * r) / total_l) * dots),
                arc = Arc(r);

            // Here is problem with flaoting point numbers, previously was d3.range(0, 1.000001, 1 / dot_cnt) but sometimes gave more points that was allowed
            let data = d3.range(0, 1.000001, 1 / (dot_cnt - 1)); // Problem with wrong total count solved here by subscribing 1

            svg.append("g")
                .attr("class", "row")
                .selectAll("circle")
                .data(data)
                .enter()
                .append("circle")
                .attr("transform", function (t) {
                    return "translate(" + arc(t) + ")";
                })
                .attr("class", function (t, index_in_row) {
                    return (
                        "row-seat-" +
                        (index_in_row + 1) +
                        " row-" +
                        (i + 1) +
                        " seat-" +
                        (dots_total + index_in_row + 1)
                    );
                })
                .attr("data-seat", function (t, index_in_row) {
                    return dots_total + index_in_row + 1;
                })
                .attr(
                    "r",
                    Math.min(dot_l * 0.5 - 1, ((r1 - r0) / rows) * 0.5 - 1)
                );
            dots_total += dot_cnt;
        });

        console.log("pocet kruhov");
        console.log(JQ("#parliament-map circle").length);
        console.log(dots_total);

        calcCircleOrderAndLabels();
    }

    function Arc(r) {
        return function (t) {
            let phi = Math.PI * 1.1;
            var p = t * phi - Math.PI * 0.5 - phi * 0.5;
            return [Math.cos(p) * r, Math.sin(p) * r];
        };
    }

    function getElemBottomLeftCoords(elemOffsets, parentOffsets) {
        let x1, y1;
        x1 = elemOffsets.left - parentOffsets.left;
        y1 = elemOffsets.top - parentOffsets.top;
        return [x1, y1];
    }

    function find_angle(A, B, C) {
        var AB = Math.sqrt(Math.pow(B[0] - A[0], 2) + Math.pow(B[1] - A[1], 2));
        var BC = Math.sqrt(Math.pow(B[0] - C[0], 2) + Math.pow(B[1] - C[1], 2));
        var AC = Math.sqrt(Math.pow(C[0] - A[0], 2) + Math.pow(C[1] - A[1], 2));
        return Math.acos((BC * BC + AB * AB - AC * AC) / (2 * BC * AB));
    }

    function calcCircleOrderAndLabels() {
        var JQcanvas = JQ(".rows-wrapper");
        var JQcanvas_offset = JQcanvas[0].getBoundingClientRect(); // Careful svg g elem has no width, needs to be retrieved by this
        let JQcanvas_left_bottom = [0, JQcanvas_offset.height];
        let JQcanvas_bottom_middle = [
            JQcanvas_offset.width / 2,
            JQcanvas_offset.height,
        ];

        console.log("points", JQcanvas_left_bottom, JQcanvas_bottom_middle);
        var poitsData = [];
        JQ("circle").each(function (i, elem) {
            let circleNumber = i + 1;
            let self = JQ(elem);

            let circle_number = self.data("seat");
            let coords = getElemBottomLeftCoords(
                self.offset(),
                JQcanvas_offset
            );
            let angle =
                (find_angle(
                    JQcanvas_left_bottom,
                    JQcanvas_bottom_middle,
                    coords
                ) *
                    180) /
                Math.PI;
            poitsData.push({
                angle: angle,
                seat: circleNumber,
            });
        });

        poitsData.sort((a, b) => a.angle - b.angle);
        console.log(poitsData); // Sorted

        let seat_index = 0;
        partiesInParliament.forEach((party) => {
            let number_of_seats = party.seats;
            let seated_candidates = party.candidates.slice(0, number_of_seats);

            // Get array of seat number for this party (sorted by lowest angle)
            let available_seats = poitsData
                .slice(seat_index, seat_index + number_of_seats)
                .map((i) => i.seat);
            // console.log("available_seats", available_seats);

            // Order it by seat number and assign them to seated candiates in ascending order, so candidates with more votes are in the front
            let available_seats_in_order = available_seats.sort(
                (a, b) => a - b
            );
            seated_candidates.forEach((candidate, i) => {
                // console.log("Candidate", candidate.name, "seating to seat", available_seats_in_order[i]);
                JQ(".seat-" + available_seats_in_order[i]).attr(
                    "data-parliament-member",
                    candidate.name
                ).attr('fill', party.color);
                // console.log(
                //     JQ(".seat-" + available_seats_in_order[i]).attr(
                //         "data-parliament-member"
                //     )
                // );
            });

            seat_index += number_of_seats;
        });
    }

    // function getPartyColor(name) {
    //     if (lookup.parties){
    //         console.log(name)
    //         return lookup.parties[name].color;
    //     } else {
    //         return '';
    //     }

    // }
</script>

<!-- TODO nejdu mi css -->

<button on:click={renderPartyBarChart}>Load</button>

<div id="overview text-center my-5">
    <h2 class="text-center">
        Volebna ucast: {electionsStatus.participation} %
    </h2>
    <h2 class="text-center">
        Pocet hlasov spolu: {electionsStatus.total_votes}
    </h2>
</div>

<div class="container-fluid">
    <div class="row">
        <div class="col-10 mx-auto my-5" style="min-height: 300px;">
            <div id="parliament-map" />
            <div id="parliament-map-legend">
                <div class="row d-flex justify-content-center gx-3">
                    {#each partiesInParliament as party, i}
                        <div class="col-auto">
                            <div
                                class="card border-0 px-3 py-2 d-flex flex-column text-white shadow"
                                style="background-color: {party.color}"
                            >
                                <div class="text-center">{party.seats}</div>
                                <div>{abbr(party.name, 6)}...</div>
                            </div>
                        </div>
                    {/each}
                </div>
            </div>
        </div>
    </div>
</div>

<canvas id="myChart1" />
<canvas id="myChart2" />
<canvas id="myChart3" />

<table>
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

<!-- <h1>Hello {name}!</h1> -->
<style lang="scss">
</style>
