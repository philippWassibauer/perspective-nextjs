// xy-scatter-line.js
import { scaleLinear } from "d3-scale";
import { extent } from "d3-array";
import { seriesSvgMulti, seriesSvgLine, seriesSvgPoint } from "d3fc";
import { select } from "d3-selection";

// You can import or create axis factories similar to how
// Perspective's other D3FC charts do it (e.g., axisFactory).
// This example shows a simplified approach.

// The main plugin export:
export default function xyScatterLine(container, settings) {
  // `data` is typically passed in from Perspective after pivot/aggregation
  const { data } = settings;
  if (!data || data.length === 0) {
    // If there's no data, just clear the container
    select(container).selectAll("*").remove();
    return;
  }

  // 1) Determine data extents for x and y
  const xValues = data.map((d) => d.x); // or whatever your columns are named
  const yValues = data.map((d) => d.y);
  const xDomain = extent(xValues);
  const yDomain = extent(yValues);

  // 2) Create scales
  const xScale = scaleLinear().domain(xDomain);
  const yScale = scaleLinear().domain(yDomain);

  // 3) Create the line series
  const lineSeries = seriesSvgLine()
    .x((d) => xScale(d.x))
    .y((d) => yScale(d.y));

  // 4) Create the scatter series
  const scatterSeries = seriesSvgPoint()
    .x((d) => xScale(d.x))
    .y((d) => yScale(d.y))
    .size(25) // pixel area of each point
    .decorate((sel) => sel.style("fill", "blue"));

  // 5) Combine both with seriesSvgMulti
  const multiSeries = seriesSvgMulti().series([lineSeries, scatterSeries]);

  // 6) Clear the container & append an <svg> for drawing
  select(container).selectAll("*").remove();
  const svg = select(container)
    .append("svg")
    .attr("width", "100%")
    .attr("height", "100%");

  // 7) Add a <g> to hold the multi-series
  svg.append("g").datum(data).call(multiSeries);
}
