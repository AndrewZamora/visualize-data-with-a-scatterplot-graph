(async () => {
  const data = await (await fetch("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json")).json();
  const margin = { top: 40, right: 60, bottom: 40, left: 60 };
  const chartHeight = 400;
  const chartWidth = 800;
  const innerHeight = chartHeight - margin.top - margin.bottom;
  const innerWidth = chartWidth - margin.left - margin.right;
  const xScale = d3.scaleTime().range([0, innerWidth]);
  const yScale = d3.scaleTime().range([innerHeight, 0]);
  // passing null to Date object returns Thu Jan 01 1970 09:00:00 GMT+0900 which allows setting seconds without having to pick a random year
  xScale.domain([(new Date(null)).setFullYear(d3.min(data, d => d.Year) - 1), (new Date(null)).setFullYear(d3.max(data, d => d.Year + 1))]);
  yScale.domain([(new Date(null)).setSeconds(d3.max(data, d => d.Seconds)), (new Date(null)).setSeconds(d3.min(data, d => d.Seconds))]);
  const chartContainer = d3.select('div').append('svg').attr("height", chartHeight).attr("width", chartWidth);
  const chart = chartContainer.append('g').attr("transform", `translate(${margin.left},${margin.top})`);
  const xAxis = d3.axisBottom(xScale).ticks(d3.timeYear.every(2));
  const yAxis = d3.axisLeft(yScale).tickFormat(d => {
    // https://stackoverflow.com/a/25279340/8006073
    const [hour, min, sec] = d.toLocaleTimeString("en-US").split(/:| /)
    return `${min}:${sec}`;
  }).ticks(d3.timeSecond.every(15));
  
  chart
    .selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("class", "dot")
    .attr("data-xvalue", d => d.Year)
    .attr("data-yvalue", d => {
      let time = new Date(null)
      time.setSeconds(d.Seconds)
       return time
    })
    .attr("cx", (d,i) => {
      return xScale((new Date(null)).setFullYear(d.Year))
    })
    .attr("cy", d => {
      return yScale((new Date(null)).setSeconds(d.Seconds))
    })
    .attr("r", 5)

  chart.append('g').call(xAxis).attr("id", "x-axis").attr("transform", `translate(0,${innerHeight})`);
  chart.append('g').call(yAxis).attr("id", "y-axis").attr("transform", `translate(0,0)`);
  console.log(data)
})();