var margin = {top: 80, right: 25, bottom: 30, left: 40},
  width = 450 - margin.left - margin.right,
  height = 450 - margin.top - margin.bottom

var svg = d3.select("#heatmap-corr")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// d3.json('/').then(data => {
d3.csv('static/data/corr_heatmap_vals.csv').then(data => {
    // Labels of row and columns -> unique identifier of the column called 'group' and 'variable'
  var myGroups = d3.map(data, function(d){return d.feat1;}).keys()
  var myVars = d3.map(data, function(d){return d.feat2;}).keys()

  //Axes 
  // X
  var x = d3.scaleBand()
    .range([ 0, width ])
    .domain(myGroups)
    .padding(0.05);

  svg.append("g")
    .style("font-size", 15)
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x).tickSize(0))
    .select(".domain").remove();

  // Y
  var y = d3.scaleBand()
    .range([ height, 0 ])
    .domain(myVars)
    .padding(0.05)

  svg.append("g")
    .style("font-size", 15)
    .call(d3.axisLeft(y).tickSize(0))
    .select(".domain").remove();

  // Color scale
  var myColor = d3.scaleSequential()
    .interpolator(d3.interpolateInferno)
    .domain([-1,1]);

  // Tooltip
  var tooltip = d3.select("#heatmap-corr")
    .append("div")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "2px")
    .style("border-radius", "5px")
    .style("padding", "5px")

  // Three function that change the tooltip when user hover / move / leave a cell
  var mouseover = function(d) {
    tooltip
      .style("opacity", 1)

    d3.select(this)
      .style("stroke", "black")
      .style("opacity", 1)
  }
  var mousemove = function(d) {
    tooltip
      .html(`The correlation between <b>${d.feat1}</b> and <b>${d.feat2}</b> is: ${d.val}`)
      .style("left", (d3.mouse(this)[0]+70) + "px")
      .style("top", (d3.mouse(this)[1]) + "px")
  }
  var mouseleave = function(d) {
    tooltip
      .style("opacity", 0)
    d3.select(this)
      .style("stroke", "none")
      .style("opacity", 0.8)
  }

  // add the squares
  svg.selectAll('rect')
    .data(data)
    .enter()
    .append("rect")
      .attr("x", function(d) {return x(d.feat1)})
      .attr("y", function(d) {return y(d.feat2)})
      .attr("rx", 4)
      .attr("ry", 4)
      .attr("width", x.bandwidth() )
      .attr("height", y.bandwidth() )
      .style("fill", function(d) {return myColor(d.val)})
      .style("stroke-width", 4)
      .style("stroke", "none")
      .style("opacity", 0.8)
    .on("mouseover", mouseover)
    .on("mousemove", mousemove)
    .on("mouseleave", mouseleave)


    // MAKE A LEGEND WHERE YOU HOVER OVER AND IT TELLS YOU HOW TO READ IT, NEGATIVE VALUES 
    // https://raw.githubusercontent.com/d3/d3-interpolate/master/img/rgb.png
// Add title to graph
// svg.append("text")
//         .attr("x", 0)
//         .attr("y", -50)
//         .attr("text-anchor", "left")
//         .style("font-size", "22px")
//         .text("Correlation Heatmap for Top 10 Songs over time");

// Add subtitle to graph
// svg.append("text")
//         .attr("x", 0)
//         .attr("y", -20)
//         .attr("text-anchor", "left")
//         .style("font-size", "14px")
//         .style("fill", "grey")
//         .style("max-width", 400)
//         .text("with values ranging from -1 to 1, 1 signifying a closer relation");

  // Legend 

  var legend_svg = d3.select('#heatmap-corr-legend').append('svg')
    .attr('width', 100)
    .attr('height', 500)
    .append('g')
    .attr('width', 100)
    .attr('height', 500)
    .attr('transfrom', 'translate(10,10)');
    
    // gen continuous range from -1 to 1 
    // use color scale to color 
    // and tooltip 

  var fine_tune_gradient = 0.01;
  var corr_range = [];
  for (var i = -1; i < 1; i+=fine_tune_gradient) {
    corr_range.push(i);
  };

  var leg_mousemove = function(d) {
    tooltip
      .html(`<p>This color represents an r-val of ${Math.round((d + Number.EPSILON) * 100) / 100}</p>`)
      .style("left", (d3.mouse(this)[0]) + "px")
      .style("top", (d3.mouse(this)[1]) + "px")
  };

  legend_svg.selectAll('rect')
    .data(corr_range)
    .enter()
    .append('rect')
    .attr('x', 0)
    .attr('y', d =>  -300 * d)
    .attr('rx', 4)
    .attr('ry', 4)
    .attr('width', 100)
    .attr('height', 300)
    .attr('value', d => d)
    .style("fill", function(d) {return myColor(d)})
    .on("mouseover", mouseover)
    .on('mousemove', leg_mousemove)
    .on("mouseleave", mouseleave);
});
