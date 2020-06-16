function unpack(rows, index) {
    return rows.map(function(row) {
      return row[index];
    });
  }


const metadataTable = d3.select("#sample-metadata");

// Update the demographic table's values
function updateMetadataTable(value) {
    metadataTable.html("");
    metadataTable.append("table");

    d3.json("data/samples.json").then(function(data) {
        var metadata = data.metadata;
        var filteredMetadata = metadata.filter(row => row.id == value);
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

function optionChanged() {
    var dropdown = d3.select("#selDataset");

    // Assign the value of the dropdown menu option to a variable
    var newSelection = dropdown.property("value");
    updateMetadataTable(newSelection);

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
