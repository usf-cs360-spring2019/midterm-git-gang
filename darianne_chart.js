var margin = {top: 20, right: 20, bottom: 30, left: 50},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var parseDate = d3.time.format("%x").parse;
    //formatPercent = d3.format(".0%");

var x = d3.time.scale()
    .range([0, width]);

var y = d3.scale.linear()
    .range([height, 0]);

var color = d3.scale.category20();

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    //.tickFormat(formatPercent);

var area = d3.svg.area()
    .x(function(d) { return x(d.date); })
    .y0(function(d) { return y(d.y0); })
    .y1(function(d) { return y(d.y0 + d.y); });

var stack = d3.layout.stack()
    .values(function(d) { return d.values; });

var svg = d3.select("body").select("#vis1").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    svg.append("text")
    .attr("x", 0)
    .attr("y", 50)
    .attr("dy", "0.71em")
    .attr("fill", "#000")
    .text("Top 5 Incident Types (December 2018 - February 2019)")
    .style("font", "23px avenir")
    .style("fill", "#000000");

    svg.append("text")
    .attr("x", 0)
    .attr("y", 402)
    .attr("dy", "0em")
    .style("font", "12px avenir")
    .style("fill", "#000000")
    .text("The plot of count of Call Type for Call Date Day. Color shows details about Call Type. The view is filtered on Call Type, which has multiple members selected.");

d3.csv("call_type_data.csv", function(error, data) {
    // console.log(data)
    color.domain(d3.keys(data[0]).filter(function(key) { return key !== "date"; }));
    data.forEach(function(d) {
  	    d.date = parseDate(d.date);
    });

  var browsers = stack(color.domain().map(function(name) {
    return {
      name: name,
      values: data.map(function(d) {
        return {date: d.date, y: d[name] * 1};
      })
    };
  }));
console.log(browsers)
  // Find the value of the day with highest total value
  var maxDateVal = d3.max(data, function(d){
    var vals = d3.keys(d).map(function(key){ return key !== "date" ? d[key] : 0 });
    return d3.sum(vals);
  });

  // Set domains for axes
  x.domain(d3.extent(data, function(d) { return d.date; }));
  y.domain([0, maxDateVal])

  var browser = svg.selectAll(".browser")
      .data(browsers)
    .enter().append("g")
      .attr("class", "browser");

  browser.append("path")
      .attr("class", "area")
      .attr("d", function(d) { 
          console.log(d);
          return area(d.values); })
      .style("fill", function(d) { return color(d.name); });

  browser.append("text")
      .datum(function(d) { return {name: d.name, value: d.values[d.values.length - 1]}; })
      .attr("transform", function(d) { return "translate(" + x(d.value.date) + "," + y(d.value.y0 + d.value.y / 2) + ")"; })
      .attr("x", -6)
      .attr("dy", ".35em")
      .text(function(d) { return d.name; });

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

    svg.append("text")
      .attr("x", 350)
      .attr("y", 0)
      .attr("fill", "#000")
      .text("Date of Incident")
      .style("font-weight", "bold");

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -250)
      .attr("y", -40)
      .attr("dy", "0.3408em")
      .attr("fill", "#000")
      .text("Number of Incidents")
      .style("font-weight", "bold"); 
});