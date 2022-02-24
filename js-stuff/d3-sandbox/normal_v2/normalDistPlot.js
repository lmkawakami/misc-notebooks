// set the dimensions and margins of the graph
const normal_dist_margin = { top: 10, right: 10, bottom: 30, left: 10 },
  normal_dist_width = 700 - normal_dist_margin.left - normal_dist_margin.right,
  normal_dist_height = 250 - normal_dist_margin.top - normal_dist_margin.bottom;

// append the svg object to the body of the page
const normal_dist_svg = d3.select("#normal_dist_div")
  .append("svg")
  .attr("width", normal_dist_width + normal_dist_margin.left + normal_dist_margin.right)
  .attr("height", normal_dist_height + normal_dist_margin.top + normal_dist_margin.bottom)
  .attr("viewBox", `0 0 ${normal_dist_width + normal_dist_margin.left + normal_dist_margin.right} ${normal_dist_height + normal_dist_margin.top + normal_dist_margin.bottom}`)
  .attr('id','normal_plot')
  .append("g")
  .attr("transform", `translate(${normal_dist_margin.left},${normal_dist_margin.top})`);

// helpers
let xMin, xMax, yMax, x, xI, y, yI, healthyDist, sickDist, threshold

calcNormalHelpers = () => {
  xMin = globals.xMin
  xMax = globals.xMax
  yMax = globals.yMax

  // x to coord. conversion
  x = d3.scaleLinear()
  .domain([xMin, xMax])
  .range([ 0, normal_dist_width ]);

  // coord. to x conversion
  xI = d3.scaleLinear()
  .domain([ 0, normal_dist_width ])
  .range([xMin, xMax]);

  // y to coord. conversion
  y = d3.scaleLinear()
  .domain([0, yMax])
  .range([ normal_dist_height, 0 ]);

  // coord. to y conversion
  yI = d3.scaleLinear()
  .domain([ normal_dist_height, 0 ])
  .range([0, yMax]);

  healthyDist = globals.healthyDist
  sickDist = globals.sickDist
  threshold = globals.threshold
}

plotNormalDistAxis = () => {  
  // Add X axis
  normal_dist_svg.append("g")
    .attr("transform", `translate(0, ${normal_dist_height})`)
    .call(d3.axisBottom(x));

  // Add Y axis
  // normal_dist_svg.append("g")
  //   .call(d3.axisLeft(y));
}

plotNomralDist = () => {
  // Add healthy  distr. line
  normal_dist_svg.select('#healthy-dist-line-plot').remove();
  normal_dist_svg
    .append("path")
    .attr('id','healthy-dist-line-plot')
    .datum(healthyDist)
    .attr("fill", "none")
    .attr("stroke", TNcolor)
    .attr("stroke-width", 1.5)
    .attr("d", d3.line()
      .x(function(d) { return x(d.x) })
      .y(function(d) { return y(d.pdf) })
    )

  // Add sick distr. line
  normal_dist_svg.select('#sick-dist-line-plot').remove();
  normal_dist_svg
    .append("path")
    .attr('id','sick-dist-line-plot')
    .datum(sickDist)
    .attr("fill", "none")
    .attr("stroke", TPcolor)
    .attr("stroke-width", 1.5)
    .attr("d", d3.line()
      .x(function(d) { return x(d.x) })
      .y(function(d) { return y(d.pdf) })
    )
}

fillNormalDist = () => {
  // Add false negative fill
  normal_dist_svg.select('#false-negative-fill').remove();
  normal_dist_svg
    .append("path")
    .attr('id','false-negative-fill')
    .datum(createFillData(sickDist, threshold, 'left'))
    .attr("fill", FNfill)
    .style("opacity", .5)
    .attr("stroke", "none")
    .attr("d", d3.line()
      .x(function(d) { return x(d.x) })
      .y(function(d) { return y(d.pdf) })
    )

  // Add false positive fill
  normal_dist_svg.select('#false-positive-fill').remove();
  normal_dist_svg
    .append("path")
    .attr('id','false-positive-fill')
    .datum(createFillData(healthyDist, threshold, 'right'))
    .attr("fill", FPfill)
    .style("opacity", .5)
    .attr("stroke", "none")
    .attr("d", d3.line()
      .x(function(d) { return x(d.x) })
      .y(function(d) { return y(d.pdf) })
    )
  
  // Add true negative fill
  normal_dist_svg.select('#true-negative-fill').remove();
  normal_dist_svg
    .append("path")
    .attr('id','true-negative-fill')
    .datum(createFillData(healthyDist, threshold, 'left'))
    // .attr("fill", "seagreen")
    .attr("fill", TNfill)
    .style("opacity", .7)
    .attr("stroke", "none")
    .attr("d", d3.line()
      .x(function(d) { return x(d.x) })
      .y(function(d) { return y(d.pdf) })
    )
  
  // Add true positive fill
  normal_dist_svg.select('#true-positive-fill').remove();
  normal_dist_svg
    .append("path")
    .attr('id','true-positive-fill')
    .datum(createFillData(sickDist, threshold, 'right'))
    // .attr("fill", "darkorange")
    .attr("fill", TPfill)
    .style("opacity", FILL_OPACITY)
    .attr("stroke", "none")
    .attr("d", d3.line()
      .x(function(d) { return x(d.x) })
      .y(function(d) { return y(d.pdf) })
    )
}

plotNormalThresholLine = () => {
  normal_dist_svg.select('#threshold-line').remove();

  const dragstarted = (e,d)=>{
    document.documentElement.style.setProperty("cursor", 'col-resize');
  }
  let dragged = (e,d)=>{
    let nx = xI(e.x)
    globals.threshold = nx
    threshold = globals.threshold
    fillNormalDist()
    plotNormalThresholLine()
    calcCoefs()
    fillConfusionMatrix()
    plotTreeMaps()
    plotRocCurve()
  }
  dragged = _.throttle(dragged,50)
  const dragended = (e,d)=>{
    document.documentElement.style.setProperty("cursor", 'default');
  }

  // Add threshold line
  const thresholdCoords = [{x:threshold, y:0},{x:threshold, y:yMax}]
  normal_dist_svg.append('path')
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


plotNormalDistribuiton = () => {
  normal_dist_svg.selectAll('*').remove();
  
  calcNormalHelpers()
  plotNormalDistAxis()
  plotNomralDist()
  fillNormalDist()
  plotNormalThresholLine()
}