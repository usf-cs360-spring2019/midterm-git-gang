function get_colors(n) {
    var colors = ["#a6cee3","#1f78b4","#b2df8a","#33a02c",
    "#fb9a99"];
}
    
//      return colors[ n % colors.length];}

var margin = {top: 20, right: 20, bottom: 30, left: 50},
     width = 960 - margin.left - margin.right,
     height = 500 - margin.top - margin.bottom;


// date of incident
var parseDate = d3.timeParse("%x");

var x = d3.scaleTime()
    .range([0, width*.75]);

var y = d3.scaleLinear()
    .range([height*.75 , 0]);

var color = d3.scaleOrdinal(d3.schemeCategory10);

var xAxis = d3.axisBottom(x)

var yAxis = d3.axisLeft(y);
    //.ticks(11, "s");

var area = d3.area()
    .x(function(d) { return x(d.date); })
    .y0(function(d) { return y(d.y0); })
    .y1(function(d) { return y(d.y0 + d.y); });

var stack = d3.stack()
    .keys(["Medical Incident", "Alarms", "Structure Fire", "Traffic Collision", "Citizen Assist Service Call"])
    .order(d3.stackOrdersNone)
    .offset(d3.stackOffsetNone)

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

d3.csv("call_type_data.csv").then(function(data) {
   
    color.domain(d3.keys(data[0]).filter(function(key) {return key !== "date"; }));
    
    data.forEach(function(d) {  
        d.date = parseDate(d.date);

        browsers = stack(color.domain().map(function(name) {
            console.log(name)
            console.log(d.date)
            return {
                name: name,
                values: data.map(function(d) {
                    return {date: d.date, y:d[name] * 1};
                })
            };
        }));
    }); 


    // Find the value of the date with the most incidents
    var maxDateVal = d3.max(data, function(d) {
        var vals = d3.keys(d).map(
            function(key){
                return key !== "date" ? d[key] : 0 
            }
        );
        return d3.sum(vals);
    });

        // Set scale for axis
    x.domain(d3.extent(data, function(d) { return d.date; }));
    y.domain([0, maxDateVal])

    console.log(browsers)

    var browser = svg.selectAll(".browser")
        .data(browsers)
        .enter().append("g")
        .attr("class", "browser");

    browser.append("path")
        .attr("class", "area")
        .attr("d", function(d) { return area(d.values); })
        .style("fill", function(d,i) { 
            return color(d.name); });
    
    browser.append("text")
        .datum(function(d) { return {name: d.name, value: d.values[d.values.length - 1]}; })
        .attr("transform", function(d) { return "translate(" + x(d.value.date) + "," + y(d.value.y0 + d.value.y / 2) + ")"; })
        .attr("x", -6)
        .attr("dy", ".35em")
        .text(function(d) { 
            return d.name; });

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0,+338)")
        .call(xAxis)

        
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
    
        
        
    // Creating legend
    var legend = svg.selectAll(".legend")
        .data(color.domain()).enter()
        .append("g")
        .attr("class","legend")
        .attr("transform", "translate(" + (width +20) + "," + 0+ ")");
    
    // Creates color boxes in legend
    legend.append("rect")
        .attr("x", 0) 
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
        .attr("x",0) 
        .attr("y",-10)
        .text("Incident Call Type");

    });

