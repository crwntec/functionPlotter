import { useEffect, useRef } from "react";
import { scaleLinear } from "d3-scale";
import { select } from "d3-selection";
import { axisBottom, axisLeft } from "d3-axis";
import { processExpression, RPNEval, toRPN } from "./util";
import { line as d3Line } from "d3-shape";

export default function Plot({
  f,
  margin = 40,
  range = { x: [-4, 4], y: [-1, 1] },
}: {
  f: string;
  margin?: number;
  range?: { x: number[]; y: number[] };
}) {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    const svgElement = svgRef.current;
    if (!svgElement) return;

    const updateDimensions = () => {
      const width = window.innerWidth;
      const height =
        window.innerHeight;

      const svg = select(svgElement)
        .attr("width", width)
        .attr("height", height);

      const xScale = scaleLinear()
        .domain(range.x)
        .range([margin, width - margin]);

      const yScale = scaleLinear()
        .domain(range.y)
        .range([height - margin, margin]);

      const xAxis = axisBottom(xScale);
      const yAxis = axisLeft(yScale);

      // Clear previous SVG content
      svg.selectAll("*").remove();

      // Append grid for x and y axis
      const grid = svg.append("g").attr("class", "grid grid--cartesian");

      // Plot the x-axis
      const xAxisPlot = grid
        .append("g")
        .attr("class", "axis axis--x")
        .attr("transform", `translate(0,${height / 2})`)
        .call(xAxis.tickSize(-height));

      // Plot the y-axis
      const yAxisPlot = grid
        .append("g")
        .attr("class", "axis axis--y")
        .attr("transform", `translate(${width / 2},0)`)
        .call(yAxis.tickSize(-width));

      // Add x-axis ticks
      xAxisPlot
        .selectAll(".tick line")
        .attr("stroke", "silver")
        .attr("y1", -height / 2)
        .attr("y2", height / 2);

      // Add y-axis ticks
      yAxisPlot
        .selectAll(".tick line")
        .attr("stroke", "silver")
        .attr("x1", -width / 2)
        .attr("x2", width / 2);

      // Convert the input function to RPN and prepare for plotting
      const exp = toRPN(processExpression(f));

      // Create the line generator
      const lineGenerator = d3Line<[number, number]>()
        .x((d) => d[0])
        .y((d) => d[1]);

      // Generate data for the line
      const lineData: [number, number][] = [];
      for (let i = margin; i < width - margin; i += 1) {
        const X = xScale.invert(i);
        const Y = RPNEval(exp, X);
        const j = yScale(Y);
        lineData.push([i, j]);
      }
      if (exp.length == 0) return;
      grid
        .append("path")
        .attr("d", lineGenerator(lineData) || "")
        .style("stroke", "steelblue")
        .style("fill", "none");
    };

    // Call the update function on mount
    updateDimensions();

    // Resize listener for window
    window.addEventListener("resize", updateDimensions);

    // Cleanup the event listener on unmount
    return () => {
      window.removeEventListener("resize", updateDimensions);
    };
  }, [f, margin, range]);

  return <svg ref={svgRef} className="w-full h-full"></svg>;
}
