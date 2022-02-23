// set the dimensions and margins of the graph
const tree_map_margin = {top: 10, right: 10, bottom: 10, left: 10},
  width = 200 - tree_map_margin.left - tree_map_margin.right,
  height = 200 - tree_map_margin.top - tree_map_margin.bottom;

// append the svg object to the body of the page
const tree_map_svg = d3.select("#full_tree_map_div")
.append("svg")
  .attr("width", width + tree_map_margin.left + tree_map_margin.right)
  .attr("height", height + tree_map_margin.top + tree_map_margin.bottom)
.append("g")
  .attr("transform", `translate(${tree_map_margin.left}, ${tree_map_margin.top})`);

const plotFullTreeMap = () => {
  fullTreeData = [
    {name: 'FullTreeMap', parent: '', value: '', color:'#00000000'},
    {name: 'True Negative', parent: 'FullTreeMap', value: globals.P_TN, color:TNfill, stroke: TNcolor},
    {name: 'False Negative', parent: 'FullTreeMap', value: globals.P_FN, color:FNfill, stroke: FNColor},
    {name: 'False Positive', parent: 'FullTreeMap', value: globals.P_FP, color:FPfill, stroke: FPColor},
    {name: 'True Positive', parent: 'FullTreeMap', value: globals.P_TP, color:TPfill, stroke: TPcolor},
  ]

  // stratify the data: reformatting for d3.js
  const root = d3.stratify()
    .id(function(d) { return d.name; })   // Name of the entity (column name is name in csv)
    .parentId(function(d) { return d.parent; })   // Name of the parent (column name is parent in csv)
    (fullTreeData);
  root.sum(function(d) { return +d.value })   // Compute the numeric value for each entity

  // Then d3.treemap computes the position of each element of the hierarchy
  // The coordinates are added to the root object above
  d3.treemap()
    .size([width, height])
    .padding(4)
    (root)

  // use this information to add rectangles:
  tree_map_svg
    .selectAll("rect")
    .data(root.leaves())
    .join("rect")
      .attr('x', function (d) { return d.x0; })
      .attr('y', function (d) { return d.y0; })
      .attr('width', function (d) { return d.x1 - d.x0; })
      .attr('height', function (d) { return d.y1 - d.y0; })
      .style("stroke", function (d) { return d.data.stroke; })
      .style("fill", function (d) { return d.data.color; })
      .style("opacity", FILL_OPACITY);

  // and to add the text labels
  // tree_map_svg
  //   .selectAll("text")
  //   .data(root.leaves())
  //   .join("text")
  //     .attr("x", function(d){ return d.x0+10})    // +10 to adjust position (more right)
  //     .attr("y", function(d){ return d.y0+20})    // +20 to adjust position (lower)
  //     .text(function(d){ return d.data.name})
  //     .attr("font-size", "15px")
  //     .attr("fill", "black")

}