var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg = d3
  .select(".chart")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append an SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Initial Params
var chosenXAxis = "people_fully_vaccinated_per_hundred";

// function used for updating x-scale var upon click on axis label
function xScale(stateData, chosenXAxis) {
  // create scales
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(stateData, d => d[chosenXAxis]) * 0.8,
      d3.max(stateData, d => d[chosenXAxis]) * 1.2
    ])
    .range([0, width]);
    max_xvalue = d3.max(stateData, d => d[chosenXAxis]);
    console.log("Max X value should be: ", max_xvalue);

  return xLinearScale;

}

// function used for updating xAxis var upon click on axis label
function renderAxes(newXScale, xAxis) {
  var bottomAxis = d3.axisBottom(newXScale);

  xAxis.transition()
    .duration(1000)
    .call(bottomAxis);

  return xAxis;
}

// function used for updating circles group with a transition to
// new circles
function renderCircles(circlesGroup, newXScale, chosenXAxis) {

  circlesGroup.transition()
    .duration(1000)
    .attr("cx", d => newXScale(d[chosenXAxis]));

  return circlesGroup;
}

// function used for updating circle labels group with a transition to
// new circles
function renderCircleLabels(circleLabelsGroup, newXScale, chosenXAxis) {

  circleLabelsGroup.transition()
    .duration(1000)
    .attr("x", d => newXScale(d[chosenXAxis]));

  return circleLabelsGroup;
}

// function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis, circlesGroup) {

  var label;

  if (chosenXAxis === "people_fully_vaccinated_per_hundred") {
    label = "People Vaccinated (per 100)";
  }
  else {
    label = "People Vaccinated";
  }

  var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([80, -60])
    .html(function(d) {
      return (`${d.state}<br>${label} ${d[chosenXAxis]}`);
    });

  circlesGroup.call(toolTip);

  circlesGroup.on("mouseover", function(data) {
    toolTip.show(data);
  })
    // onmouseout event
    .on("mouseout", function(data, index) {
      toolTip.hide(data);
    });

  return circlesGroup;
}

// Retrieve data from the CSV file and execute everything below
d3.csv("state_stats.csv").then(function(stateData, err) {
  if (err) throw err;

  // parse data
  stateData.forEach(function(data) {
    data.people_fully_vaccinated_per_hundred = +data.people_fully_vaccinated_per_hundred;
    data.new_weekly_cases_per_100k = +data.new_weekly_cases_per_100k;
    data.people_fully_vaccinated = +data.people_fully_vaccinated;
        
  });
  console.log(stateData);

  // xLinearScale function above csv import
  var xLinearScale = xScale(stateData, chosenXAxis);

  // Create y scale function
  var yLinearScale = d3.scaleLinear()
    .domain([0, d3.max(stateData, d => d.new_weekly_cases_per_100k)])
    .range([height, 0]);

  max_yvalue = d3.max(stateData, d => d.new_weekly_cases_per_100k);
  console.log("Max y value should be: ", max_yvalue);

    // Create initial axis functions
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  // // append x axis
  var xAxis = chartGroup.append("g")
    .classed("x-axis", true)
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  // // append y axis
  chartGroup.append("g")
    .call(leftAxis);

  // append initial circles
  var circlesGroup = chartGroup.selectAll("circle")
    .data(stateData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d[chosenXAxis]))
    .attr("cy", d => yLinearScale(d.new_weekly_cases_per_100k))
    .attr("r", 20)
    .attr("fill", "pink")
    .attr("opacity", ".5");

  // console.log("circlesGroup has: ", circlesGroup)
    
  //  // append initial labels
  // var circleLabelsGroup = chartGroup.selectAll("text")
  // .data(stateData)
  // .enter()
  // .append("text")
  // .attr("x", d => xLinearScale(d[chosenXAxis]))
  // .attr("y", d => yLinearScale(d.new_weekly_cases_per_100k))
  // .text(d => d.state_code); 

   // append initial labels
   var circleLabelsGroup = chartGroup.selectAll(".stateText")
   .data(stateData)
   .enter()
   .append("text")
   .attr("class","stateText")
   .attr("x", d => xLinearScale(d[chosenXAxis]))
   .attr("y", d => yLinearScale(d.new_weekly_cases_per_100k))
   .text(d => d.state_code); 

 // console.log("circleLabelsGroup has: ", circleLabelsGroup);
  
  var labelsGroup = chartGroup.append("g")
    .attr("transform", `translate(${width / 2}, ${height + 20})`);

  var vaxPerLabel = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 20)
    .attr("value", "people_fully_vaccinated_per_hundred") // value to grab for event listener
    .classed("active", true)
    .text("People Vaccinated (per 100)");

  var vaxTotalLabel = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 40)
    .attr("value", "people_fully_vaccinated") // value to grab for event listener
    .classed("inactive", true)
    .text("People Vaccinated");

  // // append y axis
  chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .classed("axis-text", true)
    .text("New COVID-19 Cases in last Week (per 100k)");

  // // updateToolTip function above csv import
  var circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

  // // x axis labels event listener
  labelsGroup.selectAll("text")
    .on("click", function() {
      // get value of selection
      var value = d3.select(this).attr("value");
      if (value !== chosenXAxis) {

        // replaces chosenXAxis with value
        chosenXAxis = value;

        // console.log(chosenXAxis)

        // functions here found above csv import
        // updates x scale for new data
        xLinearScale = xScale(stateData, chosenXAxis);

        // updates x axis with transition
        xAxis = renderAxes(xLinearScale, xAxis);

        // updates circles with new x values
        circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis);

         // updates circle labels with new x values
         circleLabelsGroup = renderCircleLabels(circleLabelsGroup, xLinearScale, chosenXAxis);

        // updates tooltips with new info
        circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

        // changes classes to change bold text
        if (chosenXAxis === "people_fully_vaccinated") {
          vaxTotalLabel
            .classed("active", true)
            .classed("inactive", false);
          vaxPerLabel
            .classed("active", false)
            .classed("inactive", true);
        }
        else {
          vaxTotalLabel
            .classed("active", false)
            .classed("inactive", true);
          vaxPerLabel
            .classed("active", true)
            .classed("inactive", false);
        }
      }
    });
}).catch(function(error) {
  console.log(error);
});

