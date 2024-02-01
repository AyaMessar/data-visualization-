// Create SVG container for the pie chart

var svg = d3.select(".centered-box").append("svg")
  .attr("width", 600)
  .attr("height", 600)
  .append("g")
  .attr("transform", "translate(200,200)");

// Load CSV data
d3.csv('Sleep_health_and_lifestyle_dataset.csv').then(function(data) {
  // Count the occurrences of each occupation
  var occupationCounts = d3.rollup(data, v => v.length, d => d.Occupation);

  // Convert the occupationCounts map to an array of objects
  var occupationData = Array.from(occupationCounts, ([occupation, count]) => ({ occupation, count }));

  // Create a pie generator
  var pie = d3.pie()
    .value(d => d.count);

  // Generate the pie chart data
  var pieData = pie(occupationData);

  // Create an arc generator for the pie slices
  var arc = d3.arc()
    .innerRadius(0)
    .outerRadius(180);

  // Create groups for each pie slice
  var arcs = svg.selectAll("arc")
    .data(pieData)
    .enter()
    .append("g")
    .attr("class", "arc");

  // Add paths (slices) to the pie chart
  arcs.append("path")
    .attr("d", arc)
    .attr("fill", (d, i) => d3.schemeCategory10[i]); // Use a color scale for the slices



  // Add a title to the pie chart
  svg.append("text")
    .attr("x", 0)
    .attr("y", 210) // Adjust the position of the title
    .attr("text-anchor", "middle")
    .style("font-size", "20px")
    .text("Occupation Distribution");

  // Add a legend
  var legend = svg.selectAll(".legend")
    .data(pieData)
    .enter().append("g")
    .attr("class", "legend")
    .attr("transform", function(d, i) { return "translate(200," + (i * 20 - 100) + ")"; });

  legend.append("rect")
    .attr("x", 10)
    .attr("width", 18)
    .attr("height", 18)
    .style("fill", (d, i) => d3.schemeCategory10[i]);

  legend.append("text")
    .attr("x", 35)
    .attr("y", 9)
    .attr("dy", ".35em")
    .style("text-anchor", "start")
    .text(d => d.data.occupation);
});






// Create SVG container for the chart 2
var svg2 = d3.select(".centered-box2").append("svg")
  .attr("width", 600)
  .attr("height", 425)
  .append("g")
  .attr("transform", "translate(50,50)");

// Load CSV data
d3.csv('Sleep_health_and_lifestyle_dataset.csv').then(function(data) {
  // Calculate the average stress level for each occupation
  var occupationStressData = d3.rollup(
    data,
    v => d3.mean(v, d => +d['Stress Level']), // Calculate the mean stress level
    d => d.Occupation
  );

  // Convert the occupationStressData map to an array of objects
  var formattedData = Array.from(occupationStressData, ([occupation, stressLevel]) => ({ occupation, stressLevel }));

  // Create scales
  var xScale = d3.scaleBand()
    .domain(formattedData.map(d => d.occupation))
    .range([0, 500]) // Adjust the range to fit the chart width
    .padding(0.1);

  var yScale = d3.scaleLinear()
    .domain([0, d3.max(formattedData, d => d.stressLevel)])
    .nice()
    .range([300, 0]); // Adjust the range to fit the chart height

  // Create and append the bars to svg2
  svg2.selectAll("rect")
    .data(formattedData)
    .enter()
    .append("rect")
    .attr("x", d => xScale(d.occupation))
    .attr("y", d => yScale(d.stressLevel))
    .attr("width", xScale.bandwidth())
    .attr("height", d => 300 - yScale(d.stressLevel)) // Adjust the height based on the yScale
    .attr("fill", "steelblue");

  // Create and append the x-axis to svg2
  var xAxis = d3.axisBottom(xScale);
  svg2.append("g")
  .attr("transform", "translate(0,300)") // Move the x-axis to the bottom
  .call(xAxis)
  .selectAll("text") // Select all the text elements for rotation
  .style("text-anchor", "end") // Set the text-anchor attribute to end
  .attr("dx", "-.8em") // Adjust the x position of the labels
  .attr("dy", ".15em") // Adjust the y position of the labels
  .attr("transform", "rotate(-65)"); // Rotate the labels

  // Create and append the y-axis to svg2
  var yAxis = d3.axisLeft(yScale);
  svg2.append("g")
    .call(yAxis);

  // Add chart title
  svg2.append("text")
    .attr("x", 250)
    .attr("y", -35)
    .attr("text-anchor", "middle")
    .style("font-size", "20px")
    .text("Average Stress Level by Occupation");

  // Add x-axis label
  svg2.append("text")
    .attr("x", 250)
    .attr("y", 370)
    .attr("text-anchor", "middle")
    .text("Occupation");

  // Add y-axis label
  svg2.append("text")
  .attr("transform", "rotate(-90)")
  .attr("x", -200)
  .attr("y", -30)
  .attr("text-anchor", "middle")
  .text("Stress Level");
 
});


// Create SVG container for the scatter plot
// Create SVG container for the line chart
var svg3 = d3.select(".centered-box3").append("svg")
    .attr("width", 600)
    .attr("height", 400);

// Load CSV data
d3.csv('Sleep_health_and_lifestyle_dataset.csv').then(function(data) {
    // Convert Sleep Duration and Stress Level to numeric
    data.forEach(function(d) {
        d['Sleep Duration'] = +d['Sleep Duration'];
        d['Stress Level'] = +d['Stress Level'];
    });

    // Sort data by Sleep Duration
    data.sort(function(a, b) {
        return a['Sleep Duration'] - b['Sleep Duration'];
    });

    // Create scales
    var xScale = d3.scaleLinear()
        .domain([0, data.length - 1])
        .range([50, 550]); // Adjust the range to fit the chart width

    var yScale = d3.scaleLinear()
        .domain([0, d3.max(data, function(d) { return d['Stress Level']; })])
        .range([350, 50]); // Adjust the range to fit the chart height

    // Define the line function
    var line = d3.line()
        .x(function(d, i) { return xScale(i); })
        .y(function(d) { return yScale(d['Stress Level']); });

    // Append the line to the SVG
    svg3.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 2)
        .attr("d", line);

    // Add x-axis label
    svg3.append("text")
        .attr("x", 300)
        .attr("y", 390)
        .attr("text-anchor", "middle")
        .text("Sleep Duration");

    // Add y-axis label
    svg3.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -200)
        .attr("y", 15)
        .attr("text-anchor", "middle")
        .text("Stress Level");

    // Add chart title
    svg3.append("text")
        .attr("x", 300)
        .attr("y", 20)
        .attr("text-anchor", "middle")
        .style("font-size", "20px")
        .text("Line Chart of Sleep Duration vs. Stress Level");
});

// Create SVG container for the scatter plot
var svgScatter = d3.select(".centered-box4")
  .append("svg")
  .attr("width", 600)
  .attr("height", 400);

// Load CSV data
d3.csv('Sleep_health_and_lifestyle_dataset.csv').then(function(data) {
  // Convert data to numeric values
  data.forEach(function(d) {
    d['Physical Activity Level'] = +d['Physical Activity Level'];
    d['Stress Level'] = +d['Stress Level'];
  });

  // Create scales
  var xScale = d3.scaleLinear()
    .domain([0, d3.max(data, function(d) { return d['Physical Activity Level']; })])
    .range([50, 550]); // Adjust the range to fit the chart width

  var yScale = d3.scaleLinear()
    .domain([0, d3.max(data, function(d) { return d['Stress Level']; })])
    .range([350, 50]); // Adjust the range to fit the chart height

  // Create and append circles to represent data points
  svgScatter.selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", function(d) { return xScale(d['Physical Activity Level']); })
    .attr("cy", function(d) { return yScale(d['Stress Level']); })
    .attr("r", 5) // Adjust the radius of the circles
    .attr("fill", "steelblue")
    .attr("opacity", 0.7); // Adjust the opacity of the circles

  // Add x-axis
  svgScatter.append("g")
    .attr("transform", "translate(0, 350)") // Move the x-axis to the bottom
    .call(d3.axisBottom(xScale));

  // Add y-axis
  svgScatter.append("g")
    .attr("transform", "translate(50, 0)") // Move the y-axis to the left
    .call(d3.axisLeft(yScale));

  // Add x-axis label
  svgScatter.append("text")
    .attr("x", 300)
    .attr("y", 390)
    .attr("text-anchor", "middle")
    .text("Physical Activity Level");

  // Add y-axis label
  svgScatter.append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", -200)
    .attr("y", 15)
    .attr("text-anchor", "middle")
    .text("Stress Level");
});



// Load CSV data
d3.csv('Sleep_health_and_lifestyle_dataset.csv').then(function(data) {
    // Define dimensions for the bar chart
    var width = 600;
    var height = 400;
    var margin = { top: 20, right: 20, bottom: 30, left: 40 };

    // Create an array of available variables
    var variables = ['Sleep Duration', 'Quality of Sleep', 'Physical Activity Level', 'Stress Level', 'Heart Rate', 'Daily Steps'];

    // Create a dropdown menu to select variables
    var dropdown = d3.select(".centered-box5")
        .append("select")
        .attr("id", "variable-select")
        .on("change", updateChart);

    dropdown.selectAll("option")
        .data(variables)
        .enter()
        .append("option")
        .text(d => d)
        .attr("value", d => d);

    // Create initial chart with default variable
    updateChart();

    // Function to update the chart based on selected variable
    function updateChart() {
        var selectedVariable = document.getElementById("variable-select").value;

        // Calculate the average value of the selected variable for each gender
        var genderData = d3.rollup(
            data,
            v => d3.mean(v, d => +d[selectedVariable]), // Calculate the mean of the selected variable
            d => d.Gender
        );

        // Convert the genderData map to an array of objects
        var formattedData = Array.from(genderData, ([gender, avgValue]) => ({ gender, avgValue }));

        // Create scales for x and y axes
        var xScale = d3.scaleBand()
            .domain(formattedData.map(d => d.gender))
            .range([margin.left, width - margin.right])
            .padding(0.1);

        var yScale = d3.scaleLinear()
            .domain([0, d3.max(formattedData, d => d.avgValue)])
            .nice()
            .range([height - margin.bottom, margin.top]);

        // Remove previous chart (if any)
        d3.select(".centered-box5").select("svg").remove();

        // Create SVG container for the bar chart
        var svg5 = d3.select(".centered-box5")
            .append("svg")
            .attr("width", width)
            .attr("height", height);

        // Add bars to the bar chart
        svg5.selectAll("rect")
            .data(formattedData)
            .enter()
            .append("rect")
            .attr("x", d => xScale(d.gender))
            .attr("y", d => yScale(d.avgValue))
            .attr("width", xScale.bandwidth())
            .attr("height", d => height - margin.bottom - yScale(d.avgValue))
            .attr("fill", "steelblue");

        // Add x-axis
        svg5.append("g")
            .attr("transform", "translate(0," + (height - margin.bottom) + ")")
            .call(d3.axisBottom(xScale));

        // Add y-axis
        svg5.append("g")
            .attr("transform", "translate(" + margin.left + ",0)")
            .call(d3.axisLeft(yScale));

        // Add chart title
        svg5.append("text")
            .attr("x", width / 2)
            .attr("y", margin.top)
            .attr("text-anchor", "middle")
            .style("font-size", "20px")
            .text("Average " + selectedVariable + " by Gender");

        // Add x-axis label
        svg5.append("text")
            .attr("x", width / 2)
            .attr("y", height - margin.bottom / 2)
            .attr("text-anchor", "middle")
            .text("Gender");

        // Add y-axis label
        svg5.append("text")
            .attr("transform", "rotate(-90)")
            .attr("x", -height / 2)
            .attr("y", margin.left / 2)
            .attr("text-anchor", "middle")
            .text("Average " + selectedVariable);
    }
});
