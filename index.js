(async () => {
  const data = await (await fetch("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json")).json();
  const margin = { top: 40, right: 60, bottom: 40, left: 60 };
  const chartHeight = 400;
  const chartWidth = 800;
  const innerHeight = chartHeight - margin.top - margin.bottom;
  const innerWidth = chartWidth - margin.left - margin.right;
  const chartContainer = d3.select('div').append('svg').attr("height", chartHeight).attr("width", chartWidth);
  const chart = chartContainer.append('g').attr("transform", `translate(${margin.left},${margin.top})`);
  const xScale = d3.scaleTime().range([0, innerWidth]);
  const yScale = d3.scaleTime().range([innerHeight, 0]);
  // passing null to Date object returns Thu Jan 01 1970 09:00:00 GMT+0900 which allows setting seconds without having to pick a random year
  xScale.domain([(new Date(null)).setFullYear(d3.min(data, d => d.Year) - 1), (new Date(null)).setFullYear(d3.max(data, d => d.Year + 1))]);
  yScale.domain([(new Date(null)).setSeconds(d3.max(data, d => d.Seconds)), (new Date(null)).setSeconds(d3.min(data, d => d.Seconds))]);
  const xAxis = d3.axisBottom(xScale).ticks(d3.timeYear.every(2));
  const yAxis = d3.axisLeft(yScale).tickFormat(d => {
    // https://stackoverflow.com/a/25279340/8006073
    const [hour, min, sec] = d.toLocaleTimeString("en-US").split(/:| /);
    return `${min}:${sec}`;
  }).ticks(d3.timeSecond.every(15));
  chart.append("g").call(xAxis).attr("id", "x-axis").attr("transform", `translate(0,${innerHeight})`);
  chart.append("g").call(yAxis).attr("id", "y-axis").attr("transform", "translate(0,0)").append("text").text("Time in Minutes").attr("fill", "#333").attr("transform", "rotate(-90)").attr("x", `-${innerHeight / 3}`).attr("y", "-50");
  const tooltip = d3.select("#title").append("div").attr("id", "tooltip").style("visibility", "hidden");
  const dots = chart
    .selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("class", d => d.Doping.length === 0 ? "maybe-not-doping dot" : "probably-doping dot")
    .attr("data-xvalue", d => d.Year)
    .attr("data-yvalue", d => {
      let time = new Date(null)
      time.setSeconds(d.Seconds)
      return time
    })
    .attr("cx", d => {
      return xScale((new Date(null)).setFullYear(d.Year))
    })
    .attr("cy", d => {
      return yScale((new Date(null)).setSeconds(d.Seconds))
    })
    .attr("r", 4)
  dots
    .on("mouseover", function (d) {
      const windowWidthOffset = (window.innerWidth - chartWidth) / 2;
      const windowHeightOffset = (window.innerHeight - chartHeight) / 2;
      // Those not accused of doping need a bigger offset because their tooltip has less text
      const isDoping = d3.select(this).attr("class").includes("probably-doping");
      const offsetForNonDopers = 25;
      tooltip
        .attr("data-year", d3.select(this).attr("data-xvalue"))
        .style("position", "absolute")
        .style("font-size", "12px")
        .style("background", "#333")
        .style("color", "#FFF")
        .style("border-radius", "4px")
        .style("left", `${parseInt(d3.select(this).attr("cx")) + windowWidthOffset + 70}px`)
        .style("top", `${(parseInt(d3.select(this).attr("cy")) + windowHeightOffset) + (isDoping ? 10: offsetForNonDopers)}px`)
        .style("visibility", "visible")
        .style("padding", "10px")
        .html(`${d.Name}<br/>Year: ${d.Year}, Time: ${d.Time}<br/>${d.Doping}`)
    })
    .on("mouseout", () => {
      tooltip.style("visibility", "hidden")
    });
  const legend = chart.append("g").attr("id", "legend");
  legend.append("text").text("Riders with doping allegations").attr("x",-215).attr("y", 15)
  legend.append("text").text("No doping allegations").attr("x",-156).attr("y", 40)
  legend.attr("transform",`translate(${innerWidth},${(innerHeight/2) - 22})`)
  legend.append("rect").attr('width', 20).attr('height', 20).attr("fill", "red")
  legend.append("rect").attr('width', 20).attr('height', 20).attr("fill", "blue").attr("y", 25)
  console.log(data)
})();