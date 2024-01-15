// Declare the data variable in the global scope
let data;

// URL for the samples.json file
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

// Fetch data using D3
d3.json(url).then(function(responseData) {
  // Assign the data to the global variable
  data = responseData;

  // Default subject ID for initial display
  const defaultSubjectID = data.names[0];

  // Populate the dropdown menu
  const dropdown = d3.select("#selDataset");
  data.names.forEach(function(subjectID) {
    dropdown.append("option").text(subjectID).property("value", subjectID);
  });

  // Dropdown change event handler
  window.optionChanged = function(selectedSubjectID) {
    updateCharts(selectedSubjectID);
  };

  // Function to update charts based on selected subject ID
  function updateCharts(subjectID) {
    // Find index of selected subject ID
    const index = data.names.indexOf(subjectID);

    // Extract top 10 OTUs data for bar chart
    const top10Values = data.samples[index].sample_values.slice(0, 10).reverse();
    const top10Labels = data.samples[index].otu_ids.slice(0, 10).map(id => `OTU ${id}`).reverse();
    const hoverTextBar = data.samples[index].otu_labels.slice(0, 10).reverse();

    // Bar chart
    const barData = [{
      type: 'bar',
      x: top10Values,
      y: top10Labels,
      orientation: 'h',
      text: hoverTextBar,
    }];

    const barLayout = {
      title: `Top 10 OTUs for Subject ID ${subjectID}`,
      xaxis: { title: 'Sample Values' },
      yaxis: { title: 'OTU ID' },
    };

    Plotly.newPlot('bar', barData, barLayout);

    // Extract bubble chart data
    const bubbleData = [{
      x: data.samples[index].otu_ids,
      y: data.samples[index].sample_values,
      mode: 'markers',
      marker: {
        size: data.samples[index].sample_values,
        color: data.samples[index].otu_ids,
        colorscale: 'Viridis',
        opacity: 0.7,
      },
      text: data.samples[index].otu_labels,
    }];

    const bubbleLayout = {
      title: `Bubble Chart for Subject ID ${subjectID}`,
      xaxis: { title: 'OTU ID' },
      yaxis: { title: 'Sample Values' },
      showlegend: false,
    };

    Plotly.newPlot('bubble', bubbleData, bubbleLayout);

  // Display sample metadata
  displayMetadata(data.metadata[index]);
}

// Function to display sample metadata
function displayMetadata(metadata) {
  // Select the "sample-metadata" div
  const metadataDiv = d3.select("#sample-metadata");

  // Clear existing content
  metadataDiv.html("");

  // Iterate through key-value pairs and display them
  Object.entries(metadata).forEach(([key, value]) => {
    metadataDiv.append("p").text(`${key}: ${value}`);
  });
}

  // Initialize the page with default subject data
  updateCharts(defaultSubjectID)
    .catch(function(error) {
      console.error("Error fetching data:", error);
    });
});

