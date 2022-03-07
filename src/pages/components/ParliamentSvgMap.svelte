<script>
    export let partiesInParliament;
    export let lookup;
    import { onMount } from "svelte";
    import * as JQ from "jquery";
    import * as d3 from "d3";
    import { abbr } from "../../lib/helpers/helpers.js";

    onMount(async () => {
        console.log("Parliament map on mount");
        console.log(partiesInParliament);
        setUpParliamentDiagramResults(partiesInParliament);
    });

    $: watchForPartiesData = setUpParliamentDiagramResults(partiesInParliament);

    function setUpParliamentDiagramResults(partiesInParliament) {
        if (!partiesInParliament.length) {
            return;
        }

        var JQparliament_wrapper = JQ("#parliament-map");
        console.log(JQparliament_wrapper);

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

    function getCandidateFullName(c) {
        let x = c.degrees_before ? c.degrees_before + " " : "";
        return x + c.first_name + " " + c.last_name;
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
        console.log("poitsData", poitsData); // Sorted

        let seat_index = 0;
        partiesInParliament.forEach((party) => {
            let number_of_seats = party.seats;
            let seated_candidates = party.candidates.slice(0, number_of_seats);
            console.log("seated_candidates", seated_candidates);

            // Get array of seat number for this party (sorted by lowest angle)
            let available_seats = poitsData
                .slice(seat_index, seat_index + number_of_seats)
                .map((i) => i.seat);
            // console.log("Slicujem:", seat_index, seat_index + number_of_seats);
            // console.log("available_seats", available_seats);

            // Order it by seat number and assign them to seated candiates in ascending order, so candidates with more votes are in the front
            let available_seats_in_order = available_seats.sort(
                (a, b) => a - b
            );
            seated_candidates.forEach((candidate, i) => {
                // console.log(
                //     "Candidate",
                //     candidate.id,
                //     "seating to seat",
                //     available_seats_in_order[i]
                // );
                JQ(".seat-" + available_seats_in_order[i])
                    .attr("data-parliament-member", candidate.id)
                    .attr("fill", party.color);
            });

            seat_index += number_of_seats;
        });

        // create a tooltip
        var tooltip = d3
            .select("#parliament-map-wrapper")
            .append("div")
            .attr("class", "parliament-tooltip");

        var jq_tooltip = JQ(".parliament-tooltip");
        var tooltipLabel = tooltip.append("div").attr("class", "label");
        var tooltipCount = tooltip.append("div").attr("class", "count");
        var tooltipPercent = tooltip.append("div").attr("class", "percent");
        // console.log(tooltip);
        // console.log(JQ("#parliament-map-wrapper"));

        //
        // console.log(d3.select("#parliament-map circle"));
        d3.selectAll("#parliament-map circle")
            .on("mouseover", function (e) {
                // console.log(tooltip);
                // console.log(e.target);
                let elem = JQ(e.target);
                let memberId = elem.data("parliament-member");
                if (memberId) {
                    let member = lookup.candidates[memberId];

                    tooltipLabel.text(getCandidateFullName(member));
                    tooltipCount.text("Počet hlasov:" + member.doc_count);
                    tooltipPercent.text("Percent:" + member.percentage);

                    console.log("tooltip offsets", jq_tooltip.height());

                    tooltip
                        // .text(getCandidateFullName(member))
                        .style("top", elem.offset().top - (jq_tooltip.height() + 32 ) + "px")
                        .style("left", elem.offset().left - 12 + "px");

                    return tooltip.style("visibility", "visible");
                }
            })
            .on("mousemove", function () {
                return tooltip.style("visibility", "visible");
            })
            .on("mouseout", function () {
                return tooltip.style("visibility", "hidden");
            });
    }
</script>

<h2 class="text-center display-5 fw-bold">Rozloženie parlamentu</h2>

<div id="parliament-map-wrapper">
    <div id="parliament-map" />
</div>

<div id="parliament-map-legend">
    <div class="row d-flex justify-content-center gx-3 gy-2">
        {#each partiesInParliament as party, i}
            <div class="col-auto">
                <div
                    class="card border-0 px-3 py-2 d-flex flex-column text-white shadow"
                    style="background-color: {party.color}"
                >
                    <div class="seat-count text-center">{party.seats}</div>

                    <div>
                        <span class="party-name">{abbr(party.name, 20)}...</span
                        >
                    </div>
                </div>
            </div>
        {/each}
    </div>
</div>

<style lang="scss">
    :global(.parliament-tooltip) {
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

    #parliament-map-legend {
        .card {
            width: 120px;
            min-height: 100px;

            .seat-count {
                font-size: 1.5rem;
            }

            .party-name {
                display: flex;
                align-items: center;
                text-align: center;
                font-size: 0.8rem;
                line-break: anywhere;
            }
        }
    }
</style>
