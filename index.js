(async () => {
  const data = await (await fetch("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json")).json();
  const margin = { top: 40, right: 60, bottom: 40, left: 60 };
  const chartHeight = 400;
  const chartWidth = 800;
  const innerHeight = chartHeight - margin.top - margin.bottom;
  const innerWidth = chartWidth - margin.left - margin.right;
  console.log(data)
})();