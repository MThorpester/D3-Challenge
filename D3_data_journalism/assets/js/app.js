// Function that makes chart responsive
function Responsify() {

  // Select the SVG area of the document
  var svgArea = d3.select("body").select("svg");

  // If the SVG area already contains a chart when the browser loads
  // remove it

  if (!svgArea.empty()) {
      svgArea.remove();
  }

  // Set chart display size dynamically based on the size of window 
  var svgWidth = window.innerWidth /1.2;
  var svgHeight = window.innerHeight / 1.2;

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

  // function used for updating circles group with a transition to new circles
  function renderCircles(circlesGroup, newXScale, chosenXAxis) {

    circlesGroup.transition()
      .duration(1000)
      .attr("cx", d => newXScale(d[chosenXAxis]));

    return circlesGroup;
  }

  // function used for updating circle labels group with a transition to new circles
  function renderCircleLabels(circleLabelsGroup, newXScale, chosenXAxis) {

    circleLabelsGroup.transition()
      .duration(1000)
      .attr("x", d => newXScale(d[chosenXAxis]));

    return circleLabelsGroup;
  }

  // function used for updating chartGroup (contains both circlesGroup and circleLabeslsGroup) group with new tooltip
  function updateToolTip(chosenXAxis, circlesGroup, circleLabelsGroup) {

    var label;
    var label2 = `New weekly cases: `;

    if (chosenXAxis === "people_fully_vaccinated_per_hundred") {
      label = (`% fully vaccinated: `);
      // label = "People Vaccinated (per 100)";
    }
    else {
      label = "People Fully Vaccinated: ";
    }

    var toolTip = d3.tip()
      .attr("class", "tooltip")
      .offset([80, -60])
      .html(function(d) {
        return (`<b>${d.state}</b><br>${label2} ${d.new_weekly_cases_per_100k}<br> ${label} ${d[chosenXAxis]} `);
      });
  
    chartGroup.call(toolTip);
  
    circlesGroup.on("mouseover", function(data) {
      toolTip.show(data);
    })
      // onmouseout event
      .on("mouseout", function(data, index) {
        toolTip.hide(data);
      });

      circleLabelsGroup.on("mouseover", function(data) {
      toolTip.show(data);
    })
      // onmouseout event
      .on("mouseout", function(data, index) {
        toolTip.hide(data);
      });

  }

  // Retrieve data from the CSV file and execute everything below
  d3.csv("assets/data/state_stats.csv").then(function(stateData, err) {
    if (err) throw err;

    // parse data
    stateData.forEach(function(data) {
      data.people_fully_vaccinated_per_hundred = +data.people_fully_vaccinated_per_hundred;
      data.new_weekly_cases_per_100k = +data.new_weekly_cases_per_100k;
      data.people_fully_vaccinated = +data.people_fully_vaccinated;
          
    });

    // xLinearScale function above csv import
    var xLinearScale = xScale(stateData, chosenXAxis);

    // Create y scale function
    var yLinearScale = d3.scaleLinear()
      .domain([0, d3.max(stateData, d => d.new_weekly_cases_per_100k)])
      .range([height, 0]);

    max_yvalue = d3.max(stateData, d => d.new_weekly_cases_per_100k);
  
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
    var circlesGroup = chartGroup.append("g")
      .selectAll(".stateCircle")
      .data(stateData)
      .enter()
      .append("circle")
      .attr("class", "stateCircle")
      .attr("cx", d => xLinearScale(d[chosenXAxis]))
      .attr("cy", d => yLinearScale(d.new_weekly_cases_per_100k))
      .attr("r", 18);

    // append initial labels
    var circleLabelsGroup = chartGroup.append("g")
    .selectAll(".stateText")
    .data(stateData)
    .enter()
    .append("text")
    .attr("class","stateText")
    .attr("x", d => xLinearScale(d[chosenXAxis]))
    .attr("y", d => yLinearScale(d.new_weekly_cases_per_100k) + 4)
    .text(d => d.state_code); 
  
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
      .text("New COVID-19 Cases this Week (per 100k)");

    // updateToolTip function above csv import
    updateToolTip(chosenXAxis, circlesGroup, circleLabelsGroup);
  
    // // x axis labels event listener
    labelsGroup.selectAll("text")
      .on("click", function() {
        // get value of selection
        var value = d3.select(this).attr("value");
        if (value !== chosenXAxis) {

          // replaces chosenXAxis with value
          chosenXAxis = value;
          
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
          updateToolTip(chosenXAxis, circlesGroup, circleLabelsGroup);
          
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

}; // Close Responsify function
Responsify();

// Event listener for window resize
d3.select(window).on("resize", Responsify);