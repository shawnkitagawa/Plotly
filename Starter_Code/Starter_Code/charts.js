function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
   
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// Deliverable 1: 1. Create the buildChart function.
function buildCharts(sample) {
  // Deliverable 1: 2. Use d3.json to load the samples.json file 
  d3.json("samples.json").then((data) => {
    console.log(data);

    // Deliverable 1: 3. Create a variable that holds the samples array. 
    var samples = data.samples;
    var metadata = data.metadata;
    console.log(samples);
    console.log(metadata);


    // Deliverable 1: 4. Create a variable that filters the samples for the object with the desired sample number.
    let filter = samples.filter(function (sampleObject) { return sampleObject.id == sample;});





    // Deliverable 3: 1. Create a variable that filters the metadata array for the object with the desired sample number.
    let filterMeta = metadata.filter(function (sampleObject) { return sampleObject.id == sample});
    console.log("filterMeta");
    console.log(filterMeta);


    // Deliverable 1: 5. Create a variable that holds the first sample in the array.
    var firstSample = filter[0];
    console.log(firstSample);

    // Deliverable 3: 2. Create a variable that holds the first sample in the metadata array.
    var firstMeta = filterMeta[0];
    console.log("firstMeta");
    console.log(firstMeta);

    // Deliverable 1: 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otu_ids = filter.map(sample => sample.otu_ids);
    var otu_labels = filter.map(sample => sample.otu_labels);
    var sample_values = filter.map(sample => sample.sample_values);
    console.log("Deliverable1:6");
    console.log(otu_ids);
    console.log(otu_labels);
    console.log(sample_values);
    // Deliverable 3: 3. Create a variable that holds the washing frequency.
    var wfreq = filterMeta.map(meta => meta.wfreq);
    console.log("Wfreq");
    console.log(wfreq);

    // Deliverable 1: 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order 
    // so the otu_ids with the most bacteria are last. 
    var tenid = otu_ids[0].slice(0,10);
    console.log(tenid[0]);
    var yticks = []
    tenid.forEach(function(id)
    {
      yticks.push("OTU " + id);

    });


    console.log(yticks);
    var id_values = filter.filter(function (values) {
      return values.otu_ids == tenid[0];
    })


    console.log(id_values);
    // Deliverable 1: 8. Create the trace for the bar chart. 
    var barData = [
      {
      x: sample_values[0].slice(0,10).sort((a,b) => b-a).reverse(),
      y: yticks,
      type: "bar",
      orientation:"h"
    }];

    // Deliverable 1: 9. Create the layout for the bar chart. 
    var barLayout = {
      title: "Top 10 Bacteria Cultures Found",

    };
    Plotly.newPlot("bar", barData, barLayout);

    // Deliverable 1: 10. Use Plotly to plot the data with the layout.
    console.log(firstSample.otu_ids);
    console.log(firstSample.sample_values);
    console.log(firstSample.otu_labels);



    // Deliverable 2: 1. Create the trace for the bubble chart.
    var trace = 
    {
      x: otu_ids[0],
      y: sample_values[0],
      text:otu_labels[0],
      mode:"markers",
      marker:
      {
        size:sample_values[0],
        color:otu_ids[0],
        colorscale: "Earth"
      }

    };

    // Deliverable 2: 2. Create the layout for the bubble chart.
    var layout =
    {
      title: "Bacteria Cultures Per Sample",
      xaxis: {title: "OTU ID"},
      width: 900

    }

    // Deliverable 2: 3. Use Plotly to plot the data with the layout.
     Plotly.newPlot("bubble", [trace], layout);
    
    // Deliverable 3: 4. Create the trace for the gauge chart.
    var trace =
    {
      domain: {x:[0,1], y:[0,1]},
      value: wfreq[0],
      title: "wfreq",
      type:"indicator",
      mode: "gauge+number"
    }
    
    // Deliverable 3: 5. Create the layout for the gauge chart.

    // Deliverable 3: 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", [trace]);

  });
}
