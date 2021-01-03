(async () => {
  const data = await (await fetch("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json")).json();
  const margin = { top: 40, right: 60, bottom: 40, left: 60 };
  const chartHeight = 400;
  const chartWidth = 800;
  const innerHeight = chartHeight - margin.top - margin.bottom;
  const innerWidth = chartWidth - margin.left - margin.right;
  const xScale = d3.scaleLinear().range([0, innerWidth]);
  const yScale = d3.scaleLinear().range([innerHeight, 0]);
  xScale.domain([d3.min(data, d => d.Year), d3.max(data, d => d.Year)]);
  yScale.domain([d3.min(data, d => d.Seconds), d3.max(data, d => d.Seconds)]);
  const chartContainer = d3.select('div').append('svg').attr("height", chartHeight).attr("width", chartWidth);
  const chart = chartContainer.append('g').attr("transform", `translate(${margin.left},${margin.top})`);
  const xAxis = d3.axisBottom(xScale).tickSizeOuter(0);
  const yAxis = d3.axisLeft(yScale).tickSizeOuter(0);
  chart.append('g').call(xAxis).attr("id", "x-axis").attr("transform", `translate(0,${innerHeight})`);
  chart.append('g').call(yAxis).attr("id", "y-axis").attr("transform", `translate(0,0)`);
  console.log(data)
})();