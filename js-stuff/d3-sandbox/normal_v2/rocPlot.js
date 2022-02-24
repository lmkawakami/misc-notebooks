let rocX, rocXI, rocY, rocYI

// set the dimensions and margins of the confusin matrix
const roc_margin = {top: 10, right: 10, bottom: 40, left: 50},
  roc_width = 250 - roc_margin.left - roc_margin.right,
  roc_height = 230 - roc_margin.top - roc_margin.bottom;

// append the svg object to the body of the confusin matrix
const roc_svg = d3.select("#roc_div")
  .append("svg")
  .attr('id','roc')
  .attr("width", roc_width + roc_margin.left + roc_margin.right)
  .attr("height", roc_height + roc_margin.top + roc_margin.bottom)
  .attr("viewBox", `0 0 ${roc_width + roc_margin.left + roc_margin.right} ${roc_height + roc_margin.top + roc_margin.bottom}`)
  .append("g")
  .attr("transform", `translate(${roc_margin.left},${roc_margin.top})`);

calcRocHelpers = () => {

  // x to coord. conversion
  rocX = d3.scaleLinear()
  .domain([0, 1])
  .range([ 0, roc_width ]);

  // coord. to x conversion
  rocXI = d3.scaleLinear()
  .domain([ 0, roc_width ])
  .range([0, 1]);

  // y to coord. conversion
  rocY = d3.scaleLinear()
  .domain([0, 1])
  .range([ roc_height, 0 ]);

  // coord. to y conversion
  rocYI = d3.scaleLinear()
  .domain([ roc_height, 0 ])
  .range([0, 1]);
}

plotRocAxis = () => {  
  // Add X axis
  roc_svg.append("g")
    .attr("transform", `translate(0, ${roc_height+10})`)
    .call(d3.axisBottom(rocX));

  // Add X axis label:
  roc_svg.append("text")
    .attr("text-anchor", "middle")
    .attr("x", roc_width/2)
    .attr("y", roc_height + roc_margin.top+30)
    .text("FPR");

  // Add Y axis
  roc_svg.append("g")
    .attr("transform", `translate(-10, 0)`)
    .call(d3.axisLeft(rocY));
  
  // Y axis label:
  roc_svg.append("text")
    .attr("text-anchor", "middle")
    .attr("transform", "rotate(-90)")
    .attr("y", -roc_margin.left+10)
    .attr("x", -roc_height/2)
    .text("TPR")
}

plotRocCurve = () => {
  // Add curve
  roc_svg.select('#roc-plot').remove();
  roc_svg
    .append("path")
    .attr('id','roc-plot')
    .datum(globals.rocPoints)
    .attr("fill", "none")
    .attr("stroke", "#888888")
    .attr("stroke-width", 1.5)
    .attr("d", d3.line()
      .x(function(d) { return rocX(d.FPR) })
      .y(function(d) { return rocY(d.TPR) })
    )

  // Add dot
  const rocPoint = [
    {
      TPR: globals.TPR,
      FPR: globals.FPR
    }
  ]
  roc_svg.select('#roc-point').remove();
  roc_svg.append('g')
    .selectAll("dot")
    .data(rocPoint)
    .join("circle")
      .attr('id','roc-point')
      .attr("cx", function (d) { return rocX(d.FPR); } )
      .attr("cy", function (d) { return rocY(d.TPR); } )
      .attr("r", 3)
      .style("fill", "#000000")
}

plotRoc = () => {
  calcRocHelpers()
  plotRocAxis()
  plotRocCurve()
}