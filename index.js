(async () => {
  const data = await (await fetch("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json")).json();
  const margin = { top: 40, right: 60, bottom: 40, left: 60 };
  const chartHeight = 400;
  const chartWidth = 800;
  const innerHeight = chartHeight - margin.top - margin.bottom;
  const innerWidth = chartWidth - margin.left - margin.right;
  const xScale = d3.scaleTime().range([0, innerWidth]);
  const yScale = d3.scaleTime().range([innerHeight, 0]);
  xScale.domain([d3.min(data, d => d.Year), d3.max(data, d => d.Year)]);
  yScale.domain([d3.min(data, d => d.Seconds), d3.max(data, d => d.Seconds)]);
  const chartContainer = d3.select('div').append('svg').attr("height", chartHeight).attr("width", chartWidth);
  const chart = chartContainer.append('g').attr("transform", `translate(${margin.left},${margin.top})`);
  // TickSizeOuter removes last empty tick and tickFormat removes comma from years
  const xAxis = d3.axisBottom(xScale).tickSizeOuter(0).tickFormat(d3.format(""));
  const yAxis = d3.axisLeft(yScale).tickSizeOuter(0);
  
  chart
    .selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("class", "dot")
    .attr("data-xvalue", d => d.Year)
    .attr("data-yvalue", d => d.Seconds)
    .attr("cx", (d,i) => {
      return xScale(d.Year)
    })
    .attr("cy", (d,i) => {
      return  chartHeight - yScale(d.Seconds)
    })
    .attr("r", 5)

  chart.append('g').call(xAxis).attr("id", "x-axis").attr("transform", `translate(0,${innerHeight})`);
  chart.append('g').call(yAxis).attr("id", "y-axis").attr("transform", `translate(0,0)`);
  console.log(data)
})();