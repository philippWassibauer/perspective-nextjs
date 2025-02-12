// my-custom-plugin.js
import { scaleLinear, scaleTime } from "d3-scale";
import { extent } from "d3-array";
import { seriesSvgMulti, seriesSvgLine, seriesSvgPoint } from "d3fc";
import { select } from "d3-selection";

/**
 * A minimal Perspective plugin that draws a line + scatter plot
 * using d3fc in the same chart.
 */
export function scatterLinePlugin(container, config) {
  // `config.data` -> the array of row objects from Perspective
  const data = config.data ?? [];
  if (data.length === 0) {
    // No data, clear container
    select(container).selectAll("*").remove();
    return;
  }

  // (1) Determine X/Y domains using d3-array's extent
  const xValues = data.map((d) => d.x); // rename to whatever your columns are
  const yValues = data.map((d) => d.y);

  const xDomain = extent(xValues);
  const yDomain = extent(yValues);

  // (2) Choose appropriate scales (linear, time, log, etc.)
  // In a real plugin, you'd detect date vs numeric, etc.
  const xScale = scaleLinear().domain(xDomain);
  const yScale = scaleLinear().domain(yDomain);

  // (3) Define line and scatter series
  const lineSeries = seriesSvgLine()
    .x((d) => xScale(d.x))
    .y((d) => yScale(d.y));

  const scatterSeries = seriesSvgPoint()
    .x((d) => xScale(d.x))
    .y((d) => yScale(d.y))
    .size(25)
    .decorate((sel) => sel.style("fill", "blue"));

  // (4) Create multi-series to combine them
  const multiSeries = seriesSvgMulti().series([lineSeries, scatterSeries]);

  // (5) Clear container & create an <svg> for drawing
  select(container).selectAll("*").remove();
  const svg = select(container)
    .append("svg")
    .attr("width", "100%")
    .attr("height", "100%");

  // (6) Render
  svg.append("g").datum(data).call(multiSeries);
}
