var data_objects = [];
var cleaned_data = [];

//data reading
d3.csv("Emmit_Fire_Data.csv").then(function(data){
    data.forEach(function(d){
        var format = d3.timeParse("%x");
        var temp_date = format(d["Call Date"]);

        var format_day = d3.timeFormat("%d");
        var this_day = parseInt(format_day(temp_date), 10)
        var date_exists = 0;

        for (i in data_objects){
            if (data_objects[i].day === this_day && data_objects[i].neighborhood === d["Neighborhooods - Analysis Boundaries"]){
                date_exists = 1;
                data_objects[i].total_minutes += parseInt(d["Dispatch to On Scene duration"], 10)
                data_objects[i].total_ocurrences += 1
            }
        }
        if (date_exists === 0){
            var object = {};
            object["day"] = this_day;
            object["neighborhood"] = d["Neighborhooods - Analysis Boundaries"]
            object["total_minutes"] = parseInt(d["Dispatch to On Scene duration"], 10)
            object["total_ocurrences"] = 1;
            object["average"] = 0;
            data_objects.push(object)
        }
    })
    clean_and_format_data();
    create_chart();
});

//actual implementation of chart1
function clean_and_format_data(){
    var TI = [];
    var L = [];
    var VV = [];
    var P = [];
    var MB = [];
    var FDSB = [];
    for(i in data_objects){
        data_objects[i].average = (data_objects[i].total_minutes / data_objects[i].total_ocurrences).toFixed(2);
    }
    data_objects.sort(function(a, b) { 
        return a.day - b.day;
    });
    for (i in data_objects){
        if (data_objects[i].neighborhood == "Treasure Island"){
            TI.push(data_objects[i]);
        }
        else if (data_objects[i].neighborhood == "Lakeshore"){
            L.push(data_objects[i])
        }
        else if (data_objects[i].neighborhood == "Visitacion Valley"){
            VV.push(data_objects[i])
        }
        else if (data_objects[i].neighborhood == "Presidio"){
            P.push(data_objects[i])
        }
        else if (data_objects[i].neighborhood == "Mission Bay"){
            MB.push(data_objects[i])
        }
        else if (data_objects[i].neighborhood == "Financial District/South Beach"){
            FDSB.push(data_objects[i])
        }
    }
    for(i in TI){
        cleaned_data.push(TI[i]);
    }
    for(i in L){
        cleaned_data.push(L[i]);
    }
    for(i in VV){
        cleaned_data.push(VV[i]);
    }
    for(i in P){
        cleaned_data.push(P[i]);
    }
    for(i in MB){
        cleaned_data.push(MB[i]);
    }
    for(i in FDSB){
        cleaned_data.push(FDSB[i]);
    }
    // console.log(data_objects)
    // console.log(cleaned_data)
}

function create_chart(){
    var temp_select = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20]
    width = 1100
    height = 600
    square_size = 29
    var svg = d3.select("#vis")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
    
    var div = d3.select("#vis")
        .append("div")	
        .attr("class", "tooltip")				
        .style("opacity", 0);

    svg.selectAll("rect")
        .data(cleaned_data)
        .enter()
        .append("rect")
        .attr("class", "heatmap")				
        .attr("x", function(d, i) {
            return d.day * square_size;
        })
        .attr("y", function(d, i) {
            if (d.neighborhood === "Treasure Island"){
                return 0
            }
            else if (d.neighborhood === "Lakeshore"){
                return square_size * 1
            }
            else if (d.neighborhood === "Visitacion Valley"){
                return square_size * 2
            }
            else if (d.neighborhood === "Presidio"){
                return square_size * 3
            }
            else if (d.neighborhood === "Mission Bay"){
                return square_size * 4
            }
            else if (d.neighborhood === "Financial District/South Beach"){
                return square_size * 5
            }
            return d.day * (square_size + 5);
        })
        .attr("fill", function(d) {
            return "rgb(" + (255 - (d.average * 20)) + ", " + (255 - (d.average * 10)) + ", 255)";
           })
        .attr("width", square_size)
        .attr("height", square_size)
        .attr('transform', 'translate(+160, +160)')
        .on("mouseover", function(d) {		
            div.transition()		
                .duration(200)		
                .style("opacity", .9)
            div.html("Day of the Month: " + d.day + "<br/><br/>" 
                     + "Neighborhood: " + d.neighborhood + "<br/><br/>"
                     + "Average Time : " + d.average + "<br/>")	
                .style("left", (d3.event.pageX - 100) + "px")		
                .style("top", (d3.event.pageY - 280) + "px");	
            })					
        .on("mouseout", function(d) {		
            div.transition()		
                .duration(500)		
                .style("opacity", 0);	
        });;

        var xScale = d3.scaleLinear()
            .domain([0, 31])
            .range([0, 900]);
        
        var xAxis = d3.axisTop(xScale)
            .tickValues([1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,
                        21,22,23,24,25,26,27,28,29,30,31])
            
        svg.append("g")
            .call(xAxis)
            .attr("class", "axes")
            .attr('transform', 'translate(+173, +165)')
            .selectAll('.domain').remove()


        var yScale = d3.scalePoint()
            .domain(["Treasure Island", "Lakeshore", "Visitacion Valley", "Presidio", "Mission Bay", "Fin. District / South Beach"])
            .range([0, 150]);
        
        var yAxis = d3.axisRight(yScale)
            
        svg.append("g")
            .call(yAxis)
            .attr("class", "axes")
            .attr('transform', 'translate(+0, +173)')
            .selectAll('.domain').remove()

        svg.append("text")
            .attr('y', +150)
            .attr('x', +10)
            .attr('class', "axis_label")
            .text("Neighborhood")

        svg.append("text")
            .attr('y', +130)
            .attr('x', +580)
            .attr('class', "axis_label")
            .text("Day of the Week")

        svg.append("text")
            .attr('y', +60)
            .attr('x', +70)
            .attr('class', "title")
            .text("Worst Average Fire Fighter Travel Times | Dec 2018 - Feb 2019 in SF")

        svg.append("text")
            .attr('y', +380)
            .attr('x', +590)
            .attr('class', "axis_label_small")
            .text("Avg Travel Time")

        svg.append("text")
            .attr('y', +400)
            .attr('x', +535)
            .attr('class', "axes")
            .text("3.50")

        svg.append("text")
            .attr('y', +400)
            .attr('x', +715)
            .attr('class', "axes")
            .text("18.25")

        var label = d3.select("#vis")
            .append("svg")
            .attr("width", 143)
            .attr("height", 20)
            .attr('transform', 'translate(+568, -220)')
            .attr('class', "legend")

        label.selectAll("rect")
            .data(temp_select)
            .enter()
            .append("rect")
            .attr('class', "")
            .attr("width", 7)
            .attr("height", 20)
            .attr("x", function(d, i) {
                return i * 7;
            })
            .attr("fill", function(d, i) {
                var color = "rgb(" + (185 - (i * 9.25)) + ", " + (219 - (i * 7.3)) + ", 255)";
                console.log(color)
                return color;
            })
            // .attr("fill", "red")
            
}