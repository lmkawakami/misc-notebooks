// confusion matrix vars
const cmv = {}
// const confusionMatrixColor = "#69b3a2"
const confusionMatrixColor = "lightslategray"

// set the dimensions and margins of the confusin matrix
const confusion_matrix_margin = {top: 10, right: 1, bottom: 30, left: 50},
  confusion_matrix_width = 250 - confusion_matrix_margin.left - confusion_matrix_margin.right,
  confusion_matrix_height = 230 - confusion_matrix_margin.top - confusion_matrix_margin.bottom;

// append the svg object to the body of the confusin matrix
const confusion_matrix_svg = d3.select("#confusion_matrix_div")
.append("svg")
  .attr('id','confusion_matrix')
  .attr("width", confusion_matrix_width + confusion_matrix_margin.left + confusion_matrix_margin.right)
  .attr("height", confusion_matrix_height + confusion_matrix_margin.top + confusion_matrix_margin.bottom)
  .attr("viewBox", `0 0 ${confusion_matrix_width + confusion_matrix_margin.left + confusion_matrix_margin.right} ${confusion_matrix_height + confusion_matrix_margin.top + confusion_matrix_margin.bottom}`)
  .append("g")
  .attr("transform", `translate(${confusion_matrix_margin.left},${confusion_matrix_margin.top})`);


// Labels of row and columns
cmv.myGroups = ["Negative","Positive"]
cmv.myVars = ["Sick", "Healthy"]

// Build color scale
cmv.myColor = d3.scaleLinear()
  .range(["white", confusionMatrixColor])
  .domain([0,1])

// Build X scales and axis:
cmv.x = d3.scaleBand()
.range([ 0, confusion_matrix_width ])
.domain(cmv.myGroups)
.padding(0.01);

// Build Y scales and axis:
cmv.y = d3.scaleBand()
.range([ confusion_matrix_height, 0 ])
.domain(cmv.myVars)
.padding(0.01);

const plotConfusionMatrixAxes = () => {  
  confusion_matrix_svg.selectAll('.confusion-matrix-axes').remove();
  confusion_matrix_svg.append("g")
  .attr("transform", `translate(0, ${confusion_matrix_height})`)
  .attr('class','confusion-matrix-axes')
  .call(d3.axisBottom(cmv.x))

  confusion_matrix_svg.append("g")
  .attr('class','confusion-matrix-axes')
  .call(d3.axisLeft(cmv.y));
}

const fillConfusionMatrix = () => {
  data = [
    {test:'Negative', condition:'Healthy', P:globals.P_TN, color:TNfill, label:'TN'},
    {test:'Negative', condition:'Sick', P:globals.P_FN, color:FNfill, label:'FN'},
    {test:'Positive', condition:'Healthy', P:globals.P_FP, color:FPfill, label:'FP'},
    {test:'Positive', condition:'Sick', P:globals.P_TP, color:TPfill, label:'TP'},
  ]

  confusion_matrix_svg.selectAll('.confusion-matrix-rects').remove();
  confusion_matrix_svg.selectAll()
    .data(data, function(d) {return d.test+':'+d.condition;})
    .join("rect")
    .attr('class','confusion-matrix-rects')
    .attr("x", function(d) { return cmv.x(d.test) })
    .attr("y", function(d) { return cmv.y(d.condition) })
    .attr("width", cmv.x.bandwidth() )
    .attr("height", cmv.y.bandwidth() )
    .style("fill", function(d) { return cmv.myColor(d.P)} )
  
  confusion_matrix_svg.selectAll('.confusion-matrix-values').remove();
  confusion_matrix_svg.selectAll()
    .data(data, function(d) {return d.test+':'+d.condition;})
    .join("text")
    .attr('class','confusion-matrix-values')
    .attr("text-anchor", "middle")
    .attr("font-family", "sans-serif")
    .attr("x", function(d) { return cmv.x(d.test)+cmv.x.bandwidth()/2 })
    .attr("y", function(d) { return cmv.y(d.condition)+cmv.x.bandwidth()/2+9 })
    .attr("dy", ".35em")
    .text(function(d) { return `${(d.P*100).toFixed(2)}%` });

  confusion_matrix_svg.selectAll()
    .data(data, function(d) {return d.test+':'+d.condition;})
    .join("text")
    .attr('class','confusion-matrix-values')
    .attr("text-anchor", "middle")
    .attr("font-family", "sans-serif")
    .attr("x", function(d) { return cmv.x(d.test)+cmv.x.bandwidth()/2 })
    .attr("y", function(d) { return cmv.y(d.condition)+cmv.x.bandwidth()/2-9 })
    .attr("dy", ".35em")
    .text(function(d) { return `${d.label}` });
}

const plotConfusionMatrix = () => {
  plotConfusionMatrixAxes()
  fillConfusionMatrix()
}