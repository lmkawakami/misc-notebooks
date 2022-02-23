const TPfill = "url(#orange-c2)"
const TNfill = "url(#green-c2)"
const FPfill = "steelblue"
const FNfill = "tomato"
const TPcolor = "darkorange"
const TNcolor = "seagreen"


let healthyMu
let healthySigma
let sickMu
let sickSigma
let xMin
let xMax
let distributions
let sickDist
let healthyDist
let yMax
let threshold

let sickProportion

let P_TP
let P_TN
let P_FP
let P_FN



const  setDistribution = (healthyMu, healthySigma, sickMu, sickSigma, xMin, xMax) => {
  const sickDist = normalTransform(sickMu,sickSigma,xMin,xMax)
  const healthyDist = normalTransform(healthyMu,healthySigma,xMin,xMax)
  const yMax = 0.45/Math.min(healthySigma, sickSigma)
  console.log(sickDist[0])
  return {
    sickDist: sickDist,
    healthyDist: healthyDist,
    yMax: yMax,
  }
}


const plotDistribuiton = (sickDist, healthyDist, yMax, xMin, xMax, threshold) => {
  normal_dist_svg.selectAll('*').remove();
  // x to coord. conversion
  const x = d3.scaleLinear()
  .domain([xMin, xMax])
  .range([ 0, normal_dist_width ]);

  // coord. to x conversion
  const xI = d3.scaleLinear()
  .domain([ 0, normal_dist_width ])
  .range([xMin, xMax]);

  // y to coord. conversion
  const y = d3.scaleLinear()
  .domain([0, yMax])
  .range([ normal_dist_height, 0 ]);

  // coord. to y conversion
  const yI = d3.scaleLinear()
  .domain([ normal_dist_height, 0 ])
  .range([0, yMax]);
  
  // Add X axis
  normal_dist_svg.append("g")
    .attr("transform", `translate(0, ${normal_dist_height})`)
    .call(d3.axisBottom(x));

  // Add Y axis
  // svg.append("g")
  //   .call(d3.axisLeft(y));
  
  // Add healthy  distr. line
  normal_dist_svg
    .append("path")
    .datum(healthyDist)
    .attr("fill", "none")
    .attr("stroke", TNcolor)
    .attr("stroke-width", 1.5)
    .attr("d", d3.line()
      .x(function(d) { return x(d.x) })
      .y(function(d) { return y(d.pdf) })
    )

  // Add sick distr. line
  normal_dist_svg
    .append("path")
    .datum(sickDist)
    .attr("fill", "none")
    .attr("stroke", TPcolor)
    .attr("stroke-width", 1.5)
    .attr("d", d3.line()
      .x(function(d) { return x(d.x) })
      .y(function(d) { return y(d.pdf) })
    )

  // Add false negative fill
  normal_dist_svg
    .append("path")
    .datum(createFillData(sickDist, threshold, 'left'))
    .attr("fill", FNfill)
    .style("opacity", .5)
    .attr("stroke", "none")
    .attr("d", d3.line()
      .x(function(d) { return x(d.x) })
      .y(function(d) { return y(d.pdf) })
    )

  // Add false positive fill
  normal_dist_svg
    .append("path")
    .datum(createFillData(healthyDist, threshold, 'right'))
    .attr("fill", FPfill)
    .style("opacity", .5)
    .attr("stroke", "none")
    .attr("d", d3.line()
      .x(function(d) { return x(d.x) })
      .y(function(d) { return y(d.pdf) })
    )
  
  // Add true negative fill
  normal_dist_svg
    .append("path")
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
  normal_dist_svg
    .append("path")
    .datum(createFillData(sickDist, threshold, 'right'))
    // .attr("fill", "darkorange")
    .attr("fill", TPfill)
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
    plot_all(sickDist, healthyDist, yMax, xMin, xMax, nx)
  }
  dragged = _.throttle(dragged,30)
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

const plotConfusionMatrix = (P_TP, P_TN, P_FP, P_FN) => {
  confusion_matrix_svg.selectAll('*').remove();
  // Labels of row and columns
  const myGroups = ["Negative","Positive"]
  const myVars = ["Sick", "Healthy"]

  // Build X scales and axis:
  const x = d3.scaleBand()
  .range([ 0, confusion_matrix_width ])
  .domain(myGroups)
  .padding(0.01);
  confusion_matrix_svg.append("g")
  .attr("transform", `translate(0, ${confusion_matrix_height})`)
  .call(d3.axisBottom(x))

  // Build X scales and axis:
  const y = d3.scaleBand()
  .range([ confusion_matrix_height, 0 ])
  .domain(myVars)
  .padding(0.01);
  confusion_matrix_svg.append("g")
  .call(d3.axisLeft(y));

  // Build color scale
  const myColor = d3.scaleLinear()
    .range(["white", "#69b3a2"])
    .domain([0,1])

    data = [
      {test:'Negative', condition:'Healthy', P:P_TN, color:TNfill},
      {test:'Negative', condition:'Sick', P:P_FN, color:FNfill},
      {test:'Positive', condition:'Healthy', P:P_FP, color:FPfill},
      {test:'Positive', condition:'Sick', P:P_TP, color:TPfill},
    ]
    console.log(data)

    confusion_matrix_svg.selectAll()
      .data(data, function(d) {return d.test+':'+d.condition;})
      .join("rect")
      .attr("x", function(d) { return x(d.test) })
      .attr("y", function(d) { return y(d.condition) })
      .attr("width", x.bandwidth() )
      .attr("height", y.bandwidth() )
      .style("fill", function(d) { return myColor(d.P)} )
    
    confusion_matrix_svg.selectAll()
      .data(data, function(d) {return d.test+':'+d.condition;})
      .join("text")
      .attr("text-anchor", "middle")
      .attr("font-family", "sans-serif")
      .attr("x", function(d) { return x(d.test)+x.bandwidth()/2 })
      .attr("y", function(d) { return y(d.condition)+x.bandwidth()/2 })
      .attr("dy", ".35em")
      .text(function(d) { return `${(d.P*100).toFixed(2)}%` });
      // .text(function(d) { return d; });
}

const plot_all = (sickDist, healthyDist, yMax, xMin, xMax, threshold) => {
  plotDistribuiton(sickDist, healthyDist, yMax, xMin, xMax, threshold)

  P_TP = sickDist.find(p=>p.x>threshold).sf
  P_TN = healthyDist.find(p=>p.x>threshold).cdf
  P_FP = healthyDist.find(p=>p.x>threshold).sf
  P_FN = sickDist.find(p=>p.x>threshold).cdf

  plotConfusionMatrix(P_TP, P_TN, P_FP, P_FN)
}


// set the dimensions and margins of the graph
const normal_dist_margin = { top: 10, right: 10, bottom: 30, left: 10 },
  normal_dist_width = 800 - normal_dist_margin.left - normal_dist_margin.right,
  normal_dist_height = 300 - normal_dist_margin.top - normal_dist_margin.bottom;

// append the svg object to the body of the page
const normal_dist_svg = d3.select("#normal_dist_div")
  .append("svg")
  .attr("width", normal_dist_width + normal_dist_margin.left + normal_dist_margin.right)
  .attr("height", normal_dist_height + normal_dist_margin.top + normal_dist_margin.bottom)
  .attr("viewBox", `0 0 ${normal_dist_width + normal_dist_margin.left + normal_dist_margin.right} ${normal_dist_height + normal_dist_margin.top + normal_dist_margin.bottom}`)
  .attr('id','normal_plot')
  .append("g")
  .attr("transform", `translate(${normal_dist_margin.left},${normal_dist_margin.top})`);


// set the dimensions and margins of the confusin matrix
const confusion_matrix_margin = {top: 30, right: 1, bottom: 30, left: 50},
  confusion_matrix_width = 300 - confusion_matrix_margin.left - confusion_matrix_margin.right,
  confusion_matrix_height = 300 - confusion_matrix_margin.top - confusion_matrix_margin.bottom;

// append the svg object to the body of the confusin matrix
const confusion_matrix_svg = d3.select("#confusion_matrix_div")
.append("svg")
  .attr("width", confusion_matrix_width + confusion_matrix_margin.left + confusion_matrix_margin.right)
  .attr("height", confusion_matrix_height + confusion_matrix_margin.top + confusion_matrix_margin.bottom)
  .attr("viewBox", `0 0 ${confusion_matrix_width + confusion_matrix_margin.left + confusion_matrix_margin.right} ${confusion_matrix_height + confusion_matrix_margin.top + confusion_matrix_margin.bottom}`)
  .attr('id','confusion_matrix')
  .append("g")
  .attr("transform", `translate(${confusion_matrix_margin.left},${confusion_matrix_margin.top})`);

// set the dimensions and margins of the full tree map
const margin = {top: 10, right: 10, bottom: 10, left: 10},
  width = 445 - margin.left - margin.right,
  height = 445 - margin.top - margin.bottom;

// append the svg object to the body of the page
const full_tree_svg = d3.select("#full_tree_map_div")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform",
        `translate(${margin.left}, ${margin.top})`);


// Read data
d3.csv('https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/data_hierarchy_1level.csv').then(function(data) {

  // stratify the data: reformatting for d3.js
  const root = d3.stratify()
    .id(function(d) { return d.name; })   // Name of the entity (column name is name in csv)
    .parentId(function(d) { return d.parent; })   // Name of the parent (column name is parent in csv)
    (data);
  root.sum(function(d) { return +d.value })   // Compute the numeric value for each entity
  console.log(root)
})


healthyMu = 6
healthySigma = 2
sickMu = 13
sickSigma = 2
xMin = 0
xMax = 20
distributions = setDistribution(healthyMu, healthySigma, sickMu, sickSigma, xMin, xMax)
sickDist = distributions.sickDist
healthyDist = distributions.healthyDist
yMax = distributions.yMax
threshold = 9
sickProportion = 0.5


plot_all(sickDist, healthyDist, yMax, xMin, xMax, threshold)

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