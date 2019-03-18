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
    console.log(data_objects)
    console.log(cleaned_data)
}

function create_chart(){
    width = 1100
    height = 600
    square_size = 29
    var svg = d3.select("#vis")
        .append("svg")
        .attr("width", width)
        .attr("height", height)

    svg.selectAll("rect")
        .data(cleaned_data)
        .enter()
        .append("rect")
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
        .attr('transform', 'translate(+80, +190)');
        


}