const  setDistribution = (healthyMu, healthySigma, sickMu, sickSigma, xMin, xMax) => {
  const sickDist = normalTransform(sickMu,sickSigma,xMin,xMax)
  const healthyDist = normalTransform(healthyMu,healthySigma,xMin,xMax)
  const yMax = 0.45/Math.min(healthySigma, sickSigma)
  return {
    sickDist: sickDist,
    healthyDist: healthyDist,
    yMax: yMax,
  }
}


const plotDistribuiton = (sickDist, healthyDist, yMax, xMin, xMax, threshold) => {
  // x to coord. conversion
  const x = d3.scaleLinear()
  .domain([xMin, xMax])
  .range([ 0, width ]);

  // coord. to x conversion
  const xI = d3.scaleLinear()
  .domain([ 0, width ])
  .range([xMin, xMax]);

  // y to coord. conversion
  const y = d3.scaleLinear()
  .domain([0, yMax])
  .range([ height, 0 ]);

  // coord. to y conversion
  const yI = d3.scaleLinear()
  .domain([ height, 0 ])
  .range([0, yMax]);
  
  // Add X axis
  svg.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(x));

  // Add Y axis
  // svg.append("g")
  //   .call(d3.axisLeft(y));
  
  // Add healthy  distr. line
  svg
    .append("path")
    .datum(healthyDist)
    .attr("fill", "none")
    .attr("stroke", "seagreen")
    .attr("stroke-width", 1.5)
    .attr("d", d3.line()
      .x(function(d) { return x(d.x) })
      .y(function(d) { return y(d.pdf) })
    )

  // Add sick distr. line
  svg
    .append("path")
    .datum(sickDist)
    .attr("fill", "none")
    .attr("stroke", "darkorange")
    .attr("stroke-width", 1.5)
    .attr("d", d3.line()
      .x(function(d) { return x(d.x) })
      .y(function(d) { return y(d.pdf) })
    )

  // Add false negative fill
  svg
    .append("path")
    .datum(createFillData(sickDist, threshold, 'left'))
    .attr("fill", "tomato")
    .style("opacity", .5)
    .attr("stroke", "none")
    .attr("d", d3.line()
      .x(function(d) { return x(d.x) })
      .y(function(d) { return y(d.pdf) })
    )

  // Add false positive fill
  svg
    .append("path")
    .datum(createFillData(healthyDist, threshold, 'right'))
    .attr("fill", "steelblue")
    .style("opacity", .5)
    .attr("stroke", "none")
    .attr("d", d3.line()
      .x(function(d) { return x(d.x) })
      .y(function(d) { return y(d.pdf) })
    )
  
  // Add true negative fill
  svg
    .append("path")
    .datum(createFillData(healthyDist, threshold, 'left'))
    // .attr("fill", "seagreen")
    .attr("fill", "url(#green-c2)")
    .style("opacity", .7)
    .attr("stroke", "none")
    .attr("d", d3.line()
      .x(function(d) { return x(d.x) })
      .y(function(d) { return y(d.pdf) })
    )
  
  // Add true positive fill
  svg
    .append("path")
    .datum(createFillData(sickDist, threshold, 'right'))
    // .attr("fill", "darkorange")
    .attr("fill", "url(#orange-c2)")
    .style("opacity", .7)
    .attr("stroke", "none")
    .attr("d", d3.line()
      .x(function(d) { return x(d.x) })
      .y(function(d) { return y(d.pdf) })
    )
  
  const dragstarted = (e,d)=>{
    document.documentElement.style.setProperty("cursor", 'col-resize');
  }
  let dragged = (e,d)=>{
    const nx = xI(e.x)
    console.log(threshold-nx)
    svg.selectAll('*').remove();
    plotDistribuiton(sickDist, healthyDist, yMax, xMin, xMax, nx)
  }
  dragged = _.throttle(dragged,30)
  const dragended = (e,d)=>{
    document.documentElement.style.setProperty("cursor", 'default');
  }
  
  // Add threshold line
  const thresholdCoords = [{x:threshold, y:0},{x:threshold, y:yMax}]
  svg.append('path')
    .datum(thresholdCoords)
    .attr('fill', 'none')
    .attr('id','threshold-line')
    .attr('d', d3.line()
      .x(function(d) { return x(d.x) })
      .y(function(d) { return y(d.y) })
    ).call(
      d3
        .drag() // call specific function when circle is dragged
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended)
    );
}



// set the dimensions and margins of the graph
const margin = { top: 10, right: 30, bottom: 30, left: 30 },
  width = 800 - margin.left - margin.right,
  height = 300 - margin.top - margin.bottom;

// append the svg object to the body of the page
const svg = d3.select("#my_dataviz")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", `translate(${margin.left},${margin.top})`);

let healthyMu = 6
let healthySigma = 2
let sickMu = 13
let sickSigma = 2
let xMin = 0
let xMax = 20
let distributions = setDistribution(healthyMu, healthySigma, sickMu, sickSigma, xMin, xMax)
let sickDist = distributions.sickDist
let healthyDist = distributions.healthyDist
let yMax = distributions.yMax
let threshold = 9

plotDistribuiton(sickDist, healthyDist, yMax, xMin, xMax, threshold)

//Read the data
// d3.csv("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/data_IC.csv").then(function(data) {
//     console.log(data)

//     // Add X axis --> it is a date format
//     const x = d3.scaleLinear()
//       .domain([1,100])
//       .range([ 0, width ]);
//     svg.append("g")
//       .attr("transform", `translate(0, ${height})`)
//       .call(d3.axisBottom(x));

//     // Add Y axis
//     const y = d3.scaleLinear()
//       .domain([0, 13])
//       .range([ height, 0 ]);
//     svg.append("g")
//       .call(d3.axisLeft(y));

//     // Show confidence interval
//     svg.append("path")
//       .datum(data)
//       .attr("fill", "#cce5df")
//       .attr("stroke", "none")
//       .attr("d", d3.area()
//         .x(function(d) { return x(d.x) })
//         .y0(function(d) { return y(d.CI_right) })
//         .y1(function(d) { return y(d.CI_left) })
//         )

//     // Add the line
//     svg
//       .append("path")
//       .datum(data)
//       .attr("fill", "none")
//       .attr("stroke", "steelblue")
//       .attr("stroke-width", 1.5)
//       .attr("d", d3.line()
//         .x(function(d) { return x(d.x) })
//         .y(function(d) { return y(d.y) })
//         )

// })