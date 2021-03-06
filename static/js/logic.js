console.log("JS is loaded");
let jsondata;
let Top10_data;

$.ajax({
    url: "/Top10",
    type: "GET"
}).then(data => {
    Top10_data = data

    // d3.json("/data").then(response => {
    $.ajax({
        url: "/data",
        type: "GET"
    }).then(response => {
        jsondata = response;
        let airports = [];
        jsondata.map(row => {
            if (!airports.includes(row.Airport)) {
                airports.push(row.Airport);
            }
        });
        // console.log(jsondata);
        $("#loading").addClass("hide")
        $("#content").removeClass("hide")
        airport_dropdown(airports)
        weather_dropdown()
    })
})

function airport_dropdown(airports) {
    const selector = d3.select("#airports");
    airports.sort().map(airport => {
        selector
            .append("option")
            .text(airport);
    });
    barchart(airports[0])
    piechart(airports[0])
};

function on_airport_change(event) {
    // console.log(event.target.value)
    barchart(event.target.value);
    piechart(event.target.value);
}




function barchart(airport) {
    const current_data = jsondata.filter(row => row.Airport === airport);
    // console.log(current_data);
    const x_value = current_data.map(row => row.month);
    const values = {
        Cold: current_data.map(row => row.Cold),
        Fog: current_data.map(row => row.Fog),
        Hail: current_data.map(row => row.Hail),
        Precipitation: current_data.map(row => row.Precipitation),
        Rain: current_data.map(row => row.Rain),
        Snow: current_data.map(row => row.Snow),
        Storm: current_data.map(row => row.Storm),

        // x_value : current_data.map(row=> row.month),
    }
    // var trace1 = {
    //     x: ['giraffes', 'orangutans', 'monkeys'],
    //     y: [20, 14, 23],
    //     name: 'SF Zoo',
    //     type: 'bar'
    // };

    var data = Object.entries(values).map(([key, value], i) => {
        return {
            x: x_value,
            y: value,
            name: key,
            type: "bar",
            // marker: {
            //     color: 'rgb(0,202,255)',
            //     // opacity: 1,
            //     // line: {
            //         // color: 'rgb(8,48,107)',
            //         // width: 1.5
            //     // }
            // }
        }
    })

    var layout = { barmode: 'stack' , title:"Number of Events" };

    Plotly.newPlot('bar', data, layout);
}



function piechart(airport) {
    const current_data = jsondata.filter(row => row.Airport === airport);
    const sum = (accumulator, current_value) => accumulator + current_value;
    const values_1 = {
        carrier_ct: current_data.map(row => row.carrier_ct).reduce(sum),
        weather_ct: current_data.map(row => row.weather_ct).reduce(sum),
        nas_ct: current_data.map(row => row.nas_ct).reduce(sum),
        security_ct: current_data.map(row => row.security_ct).reduce(sum),
        late_aircraft_ct: current_data.map(row => row.late_aircraft_ct).reduce(sum),

        // x_value : current_data.map(row=> row.month),
    }

    const values_2 = {
        carrier_delay: current_data.map(row => row.carrier_delay).reduce(sum),
        weather_delay: current_data.map(row => row.weather_delay).reduce(sum),
        nas_delay: current_data.map(row => row.nas_delay).reduce(sum),
        security_delay: current_data.map(row => row.security_delay).reduce(sum),
        late_aircraft_delay: current_data.map(row => row.late_aircraft_delay).reduce(sum),

        // x_value : current_data.map(row=> row.month),
    }
    // console.log(values_1);

    var data = [{
        values: Object.values(values_1),
        labels: Object.keys(values_1),
        domain: { column: 0 },
        // name: "Yearly Delays",
        hoverinfo: 'label+percent',
        hole: .7,
        type: 'pie'
    }, {
        values: Object.values(values_2),
        labels: Object.keys(values_2),
        textposition: 'inside',
        domain: { column: 1 },
        // name: 'Minutes',
        hoverinfo: 'label+percent',
        hole: .7,
        type: 'pie'
    }];

    var layout = {
        title: '2017 Yearly Delay Total',
        annotations: [
            {
                font: {
                    size: 18
                },
                showarrow: false,
                text: `Delays: ${current_data.map(row => row.arr_del15).reduce(sum)}`,
                x: 0.09,
                y: 0.5
            },
            {
                font: {
                    size: 15
                },
                showarrow: false,
                text: `Hours: ${+(current_data.map(row => row.arr_delay).reduce(sum) / 60).toFixed(2)}`,
                x: 0.91,
                y: 0.5
            }
        ],
        // height: 400,
        // width: 600,
        showlegend: false,
        grid: { rows: 1, columns: 2 }
    };

    Plotly.newPlot('pie', data, layout);
}

function weather_dropdown() {
    const selector = d3.select("#Weather");
    const conditions = [
        "Cold", "Fog", "Hail", "Precipitation", "Rain", "Snow", "Storm" , "Total Weather",
    ]
    conditions.sort().map(Weather => {
        selector
            .append("option")
            .text(Weather);
    });
    Top10(conditions[0])
};

function on_weather_change(event) {
    // console.log(event.target.value)
    Top10(event.target.value)
}

function Top10(Weather) {
    const weather_data = Top10_data.map(row =>{
        return{
            airport: row.Airport,
            weather: row[Weather]
        }
    });
    const compare = (a, b) => b.weather - a.weather;
    weather_data.sort(compare)
    console.log(weather_data)


    // var xValue = ['Product A', 'Product B', 'Product C'];
    // var yValue = [20, 14, 23];
    var trace1 = {
        x: weather_data.slice(0, 10).map(x=> x.airport),
        y: weather_data.slice(0, 10).map(x=> x.weather),
        type: 'bar',
        // text: yValue.map(String),
        // textposition: 'auto',
        hoverinfo: 'none',
        marker: {
            color: 'rgb(0,202,255)',
            opacity: 1,
            line: {
                color: 'rgb(8,48,107)',
                width: 1.5
            }
        }
    };
    var data = [trace1];
    var layout = {
        title: 'Top 10 Weather Conditions',
        barmode: 'stack'
    };
    Plotly.newPlot('Top10', data, layout);


};



// d3.select("#airports").on("change", onchange);
$("#airports").on("change", on_airport_change);
$("#Weather").on("change", on_weather_change);