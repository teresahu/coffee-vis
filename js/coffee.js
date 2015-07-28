var chart;
var dataset;
var margin =20;
var height = 300-margin*2;
var width = 400-margin*2;
var barPadding = 1;
var x;
var y;
var barHeight = 20;
var xAxis;
var yAxis;

function init(){
  chart = d3.select('#vis').append('svg');
  vis = chart.append('g');
  //PUT YOUR INIT CODE BELOW
  x = d3.scale.ordinal().rangeRoundBands([0, width], .1);
  y = d3.scale.linear().range([height,0]);
  xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

  yAxis = d3.svg.axis()
      .scale(y)
      .orient("right")
      .ticks(5);

  //chart.append("g").attr("class", "axis").attr("transform", "translate(15," + (height+10) + " )").call(xAxis);
  //chart.append("g").attr("class", "axis").attr("transform", "translate(" + 15 + ",10)").call(yAxis);
}

//Called when the update button is clicked
function updateClicked(){
  d3.csv('data/CoffeeData.csv', function(data) {
    update(data);
  });
}

//Callback for when data is loaded
function update(rawdata){
  dataset = rawdata;
  chart.selectAll("rect").remove();
  chart.selectAll("text").remove();
  chart.selectAll("axis").remove();
  chart.selectAll("g.tick").remove();

  vis.attr("width", width+margin*2)
    .attr("height", height+margin*2)
    .append("g")
    .attr("transform", "translate(" + margin + "," + margin + ")");

  var regionalSales = [];
  var regionalProfit = [];
  var categorySales = [];
  var categoryProfit = [];
  var i = 0;

  for (i; i<dataset.length; i++) {
    var row = dataset[i];
    if (regionalProfit[row.region]===undefined){
      regionalProfit[row.region]=0;
    }
    regionalProfit[row.region]+=parseInt(row.profit);

    if (regionalSales[row.region]===undefined){
      regionalSales[row.region]=0;
    }
    regionalSales[row.region]+=parseInt(row.sales);

    if (categorySales[row.category]===undefined){
      categorySales[row.category]=0;
    }
    categorySales[row.category]+=parseInt(row.sales);

    if (categoryProfit[row.category]===undefined){
      categoryProfit[row.category]=0;
    }
    categoryProfit[row.category]+=parseInt(row.profit);
  }
  
  var xvar = xdropdown.value;
  var yvar = ydropdown.value;
  var chartData;

  if (xvar=="Region") {
    if (yvar =="Sales") {
      chartData = regionalSales;
    }
    else {chartData = regionalProfit; }
  }

  if (xvar == "Category") {
    if (yvar == "Sales") {
      chartData = categorySales;
    }
    else { chartData = categoryProfit; }
  }

  var arr = [];
  for (var key in chartData) {
    if (chartData.hasOwnProperty(key)) {
      var obj = new Object();
      obj.xval = key;
      obj.yval = chartData[key];
      arr.push(obj);  
    }
  }

  x.domain(arr.map(function(d){return d.xval}));
  y.domain([0, d3.max(arr, function(d){return d.yval;})]);
  var r = d3.scale.category10().range();
  var color = d3.scale.ordinal().range(r);
  console.log(color);
  var barWidth = width/arr.length;

  vis.attr("transform", "translate(5,0)");

  vis.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis)
    .append("text")
    .attr("dx", "1em") 
    .attr("y", 35)
    .attr("x", 150)
    .attr("font-weight", "bold")
    .text(xvar);             

  vis.append("g")
    .attr("class", "y axis")
    .attr("transform", "translate(360,0)")
    .call(yAxis)
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 55)
    .attr("x", -120)
    .attr("dy", "1em")
    .attr("font-weight", "bold")
    .style("text-anchor", "end")
    .text(yvar);

  vis.selectAll(".bar")
    .data(arr)
    .enter().append("rect")
    .attr("class", "bar")
    .style('fill', color)
    .attr("x", function(d) { return x(d.xval); })
    .attr("y", function(d) { return y(d.yval); })
    .attr("height", function(d) { return height - y(d.yval); })
    .attr("width", x.rangeBand());
}

// Returns the selected option in the X-axis dropdown. Use d[getXSelectedOption()] to retrieve value instead of d.getXSelectedOption()
function getXSelectedOption(){
  var node = d3.select('#xdropdown').node();
  var i = node.selectedIndex;
  return node[i].value;
}

// Returns the selected option in the Y-axis dropdown. 
function getYSelectedOption(){
  var node = d3.select('#ydropdown').node();
  var i = node.selectedIndex;
  return node[i].value;
}
