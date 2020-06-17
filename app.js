function unpack(rows, index) {
    return rows.map(function(row) {
      return row[index];
    });
  }


// Get a handle to the div that will hold the metadata table
const metadataTable = d3.select("#sample-metadata");

// Get a handle to the div that will hold the bar chart
const bar = d3.select("#bar");


// Function to update the bar chart
function updateBarChart(value) {

    // clear the div
    metadataTable.html("");

    // grab response from json
    d3.json("data/samples.json").then(function(data) {
        
        // extract samples array from response
        var samples = data.samples;

        // assign variable to store data just for the chosen sample
        var filteredSample = samples.filter(row => row.id == value);
        
        // print data for the chosen sample
        console.log("Here is sample data:");
        console.log(filteredSample);
        
        // assign variable to store top 10 OTU IDs
        var otu_ids = filteredSample[0].otu_ids.slice(0, 10).map(d => `OTU ${d}`);
        // console.log(otu_ids);

        // assign variable to store top 10 values
        var sample_values = filteredSample[0].sample_values.slice(0, 10);
        // console.log(rev_sample_values);
  
        
        // assign variable to store top 10 labels
        var otu_labels = filteredSample[0].otu_labels.slice(0, 10);
        //console.log(otu_labels);

        // create a data trace for the bar chart
        var trace = {
            
            x: sample_values.reverse(),
            y: otu_ids.reverse(),
            type: "bar",
            orientation: "h",
            text: otu_labels.reverse()
          };

        var data = [trace];      

        // Define the plot layout
        var layout = {
        title: "Abundance of Top 10 Operational Taxonomic Units"
        };


        Plotly.newPlot("bar", data, layout);

    });

};

// Function to update the demographic metadata table
function updateMetadataTable(value) {

    // clear the div
    metadataTable.html("");

    // add a table element
    metadataTable.append("table");

    d3.json("data/samples.json").then(function(data) {
        var metadata = data.metadata;
        var filteredMetadata = metadata.filter(row => row.id == value);
        console.log("Here is metadata:");
        console.log(filteredMetadata);

        // Build the metadata table
        filteredMetadata.forEach((d) => {
            Object.entries(d).forEach(([key, value]) => {
              metadataTable.append("tr")
              .append("td")
              .text(`${key}: ${value}`);
            });
          });
    })
};

// Function to register that a new sample was selected
function optionChanged() {
    var dropdown = d3.select("#selDataset");

    // Assign the value of the dropdown menu option to a variable
    var newSelection = dropdown.property("value");
    updateMetadataTable(newSelection);
    updateBarChart(newSelection);

};


// Function to do initial data load and visualization
function init() {

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
