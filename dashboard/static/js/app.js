// initialize page with dropdown values, metadata, and plot
(async function() {
    // load the data
    var bellyData = await d3.json("static/json/samples.json").catch(error => console.log(error))

    // populate the dropdown
    populateDropdown(bellyData.names);
    populateMetaData(bellyData.metadata[0]);
    populateGauge(bellyData.metadata[0]);
    populateBarChart(bellyData.samples[0]);
    populateScatterPlot(bellyData.samples[0]);
})();


function populateDropdown(data) {
    data.forEach(value => {
        d3.select('#selDataset')
        .append("option")
        .property("value", value)
        .property("text", value);
    });
}

function populateMetaData(data){
    d3.select('#sample-metadata').html("")
    var $tbody = d3.select('#sample-metadata')
                    .append("table")
                    .classed("table table-striped table-bordered", true)
                    .append("tbody")

    Object.entries(data).forEach(([key, value]) => {
        var trow = $tbody.append("tr");
        trow.append("td").text(key);
        trow.append("td").text(value);
    });
}


function populateBarChart(data){
    // set trace and layout
    var plotData = [{
        y : data.otu_ids.slice(0,10).reverse().map(id => `OTU ${id}`),
        x : data.sample_values.slice(0,10).reverse(),
        text : data.otu_labels,
        type : "bar",
        orientation : 'h'
    }]
    var layout = {
        title : "My Plot",
        yaxis : {type : 'category'}
    }
    // generate plot
    Plotly.newPlot("bar", plotData, layout)
}

function populateScatterPlot(data) {
    var plotData = [{
        x : data.otu_ids,
        y : data.sample_values,
        text : data.otu_labels,
        type : "scatter",
        mode: 'markers',
        marker : {color: data.otu_ids,size : data.sample_values}
    }]
    var layout = {
        title : "My Scatterplot",
        yaxis : {type : 'category'}
    }
    // generate plot
    Plotly.newPlot("bubble", plotData, layout)
}

function populateGauge(data) {

    var maxGauge = d3.max(data, data => data.wfreq)
    var plotData = [{
        type : "indicator",
        mode : "gauge",
        gauge : {
            axis : {range : [0,10],tickwidth: 2, tickmode : "auto", nticks : 11},
            bar: { color: "darkblue" },
        }
    }]
    var layout = {
        title : "My Gauge"
    }
    Plotly.newPlot("gauge", plotData, layout)
}

async function optionChanged() {
    // retrieve data
    var bellyData = await d3.json("static/json/samples.json").catch(error => console.log(error));

    // retrieve selected value
    var nameSelection = d3.select('#selDataset').node().value;

    // filter metadata
    var subjectMetadata = bellyData.metadata.filter((row) => {
        return row.id === +nameSelection;
    })[0];

    // filter samples
    var subjectSamples = bellyData.samples.filter((row) => {
        return row.id === nameSelection
    })[0]
    // populate metadata
    populateMetaData(subjectMetadata);
    populateBarChart(subjectSamples);
    populateScatterPlot(subjectSamples);
}
