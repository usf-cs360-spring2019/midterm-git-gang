var data_objects = [];

//data reading
d3.csv("Emmit_Fire_Data.csv").then(function(data){
    data.forEach(function(d){
        var format = d3.timeParse("%x");
        var temp_date = format(d["Call Date"]);

        var format_day = d3.timeFormat("%d");
        var this_day = parseInt(format_day(temp_date), 10)
        var date_exists = 0;

        for (i in data_objects){
            if (data_objects[i].day === this_day){
                date_exists = 1;
                data_objects[i].total_minutes += parseInt(d["Dispatch to On Scene duration"], 10)
                data_objects[i].total_ocurrences += 1
            }
        }
        if (date_exists === 0){
            var object = {};
            object["day"] = this_day;
            object["total_minutes"] = parseInt(d["Dispatch to On Scene duration"], 10)
            object["total_ocurrences"] = 1;
            // console.log(object)
            data_objects.push(object)
        }
    })

    createChart1();
    
});

//actual implementation of chart1
function createChart1(){
    console.log(data_objects)
}
