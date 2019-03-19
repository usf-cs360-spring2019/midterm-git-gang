function get_colors(n) {
    var colors = ["#3977af","#b2c7e5", "#ef8536", "#f5bd82", "#519d3e"];
    
     return colors[ n % colors.length];}

var margin = {top: 30, right: 76, bottom: 25, left: 76},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var parseDate = d3.time.format("%x").parse;
    //formatPercent = d3.format(".0%");

var x = d3.time.scale()
    .range([0, width*.85]);

var y = d3.scale.linear()
    .range([height*.85, 0]);

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

    svg.append("text") //title
    .attr("x", 105)
    .attr("y", -20)
    .attr("dy", "0.71em")
    .attr("fill", "#000")
    .text("Top 5 Incident Types (December 2018 - February 2019)")
    .style("font", "23px avenir")
    .style("fill", "#000000");

    svg.append("text") // bottom description
    .attr("x", 0)
    .attr("y", 450)
    .attr("dy", "0em")
    .style("font", "12px avenir")
    .style("fill", "#000000")
    .text("The plot of count of Call Type for Call Date Day. Color shows details about Call Type. The view is filtered on Call Type, which has multiple members selected.");

var div = d3.select("#vis1")
    .append("div")	
    .attr("class", "tooltip")				
    .style("opacity", 0);

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
//console.log(browsers)
  // Find the value of the day with highest total value
  var maxDateVal = d3.max(data, function(d){
    var vals = d3.keys(d).map(function(key){ return key !== "date" ? d[key] : 0 });
    return d3.sum(vals);
  });

  // Set domains for axes
  x.domain(d3.extent(data, function(d) { return d.date; }));
  y.domain([-8, maxDateVal])

  var browser = svg.selectAll(".browser")
      .data(browsers)
      .enter().append("g")
      .attr("class", "browser");

  browser.append("path")
      .attr("class", "area")
      .attr("d", function(d) { 
          //console.log(d);
          return area(d.values); })
      .style("fill", function(d) { return color(d.name); })
      .on("mouseover", function(d) {		
        div.transition()		
            //.duration(200)		
            .style("opacity", .9)
        div.html("Date: " + d.date + "<br/><br/>" 
                 + "Incident Type: " + d[name] + "<br/><br/>"
                 + "Number of Calls : " + d[name] + "<br/>")	
            .style("left", (d3.event.pageX - 90) + "px")		
            .style("top", (d3.event.pageY - 280) + "px");	
        })					
    .on("mouseout", function(d) {		
        div.transition()		
            .duration(500)		
            .style("opacity", 0);	
    });;;

        
//   browser.append("text")
//       .datum(function(d) { return {name: d.name, value: d.values[d.values.length - 1]}; })
//       .attr("transform", function(d) { return "translate(" + x(d.value.date) + "," + y(d.value.y0 + d.value.y / 2) + ")"; })
//       .attr("x", 5) //labels for each categorized area
//       .attr("dy", ".35em")
//       .text(function(d) { return d.name; });

  svg.append("g") //x-axis
      .attr("class", "x_axis")
      .attr("transform", "translate(0,+372.25)")
      .call(xAxis);

    svg.append("text") //x-axis title
      .attr("x", 290)
      .attr("y", 420)
      .attr("fill", "#000")
      .text("Date of Incident")
      .style("font-weight", "bold");

  svg.append("g") //y-axis
      .attr("class", "y axis")
      .call(yAxis);

    svg.append("text") //y-axis title
      .attr("transform", "rotate(-90)")
      .attr("x", -260)
      .attr("y", -55)
      .attr("dy", "0.3408em")
      .attr("fill", "#000")
      .text("Number of Incidents")
      .style("font-weight", "bold"); 

    // Creating legend
    var legend = svg.selectAll(".legend")
        .data(color.domain()).enter()
        .append("g")
        .attr("class","legend")
        .attr("transform", "translate(" + (width-120) + "," + 50+ ")");
    
    // Creates color boxes in legend
    legend.append("rect")
        .attr("x", 5) 
        .attr("y", function(d, i) { return 20 * i; })
        .attr("width", 10)
        .attr("height", 10)
        .style("fill", function(d, i) {
            return get_colors(i);}); 
    
    // Adds text to the legend
    legend.append("text")
        .attr("x", 20) 
        .attr("dy", "0.75em")
        .attr("y", function(d, i) { return 20 * i; })
        .text(function(d) {return d});
    
    legend.append("text")
        .attr("x",5) 
        .attr("y",-10)
        //.style("font", "12px")
        .text("Incident Call Type");
});