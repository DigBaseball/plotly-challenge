// Get a handle to the div that will hold the metadata table
const metadataTable = d3.select("#sample-metadata");

// Function to update the bar chart
function updateCharts(value) {

    // clear the div
    metadataTable.html("");

    // grab response from json
    d3.json("data/samples.json").then(function(data) {
        
        // extract samples array from response
        var samples = data.samples;

        // assign variable to store data just for the chosen sample
        var filteredSample = samples.filter(row => row.id == value);
        
        // assign variable to store top 10 OTU IDs
        var otu_ids = filteredSample[0].otu_ids.slice(0, 10).map(d => `OTU ${d}`);
        // console.log(otu_ids);

        // assign variable to store top 10 values
        var sample_values = filteredSample[0].sample_values.slice(0, 10);
        // console.log(sample_values);
  
        
        // assign variable to store top 10 labels
        var otu_labels = filteredSample[0].otu_labels.slice(0, 10);
        //console.log(otu_labels);

        // create a data trace for the bar chart
        var trace1 = {
            x: sample_values.reverse(),
            y: otu_ids.reverse(),
            type: "bar",
            orientation: "h",
            text: otu_labels.reverse()
          };     

        // define the plot layout for the bar chart
        var layout1 = {
          autosize: false,
          title: `Abundance of Top 10 Operational Taxonomic Units for Sample ${value}`
        };

        // plot the bar chart
        Plotly.newPlot("bar", [trace1], layout1);

        // create a data trace for the bubble chart
        var trace2 = {
            x: filteredSample[0].otu_ids,
            y: filteredSample[0].sample_values,
            mode: "markers",
            marker: {
              size: filteredSample[0].sample_values,
              color: filteredSample[0].otu_ids,
              colorscale: "Earth"
            }
        };

        // define the plot layout for the bubble chart
        var layout2 = {
          xaxis: { title: "OTU ID"}
        };
        
        // plot the bubble chart
        Plotly.newPlot("bubble", [trace2], layout2);
    });

};

// function to update the demographic metadata table
function updateMetadataTable(value) {

    // clear the div
    metadataTable.html("");

    // add a table element
    metadataTable.append("table");

    // grab response from json
    d3.json("data/samples.json").then(function(data) {

        // extract metadata array from response
        var metadata = data.metadata;

        // assign variable to store data just for the chosen sample
        var filteredMetadata = metadata.filter(row => row.id == value);
        // console.log(filteredMetadata);

        // loop through the sample data to build the metadata table
        filteredMetadata.forEach((d) => {
            Object.entries(d).forEach(([key, value]) => {
              metadataTable.append("tr")
              .append("td")
              .text(`${key}: ${value}`);
            });
          });
    })
};

// function to call when a new sample is selected
function optionChanged() {

    // create a handle to the dropdown menu
    var dropdown = d3.select("#selDataset");

    // assign the value of the dropdown menu option to a variable
    var newSelection = dropdown.property("value");
    
    // call the functions that populate the metadata table and charts
    updateMetadataTable(newSelection);
    updateCharts(newSelection);

};


// function to do initial data load and visualization
function init() {

    // grab response from json
    d3.json("data/samples.json").then(function(data) {
    var names = data.names;
    var metadata = data.metadata;
    //console.log(names);

    // Get a handle to the dropdown menu
    var dropdown = d3.select("#selDataset");

    // Populate dropdown menu with names
    for (var i = 0; i < names.length; i++) {
        dropdown.append("option").text(names[i]);
    };

    optionChanged();

})};

init();
