/*d3.csv("grimg/grimreaperdata.csv").then((data) => {
    console.log(data);
})*/

//use switch for choosing different charts

var thetextheader = d3.select("#textheader");
var thetextcontent = d3.select("#textcontent");


var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 100,
  right: 40,
  bottom: 50,
  left: 60
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg = d3
  .select("#selectedimage")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append an SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Initial Params
var chosenXAxis = "Population";
thetextheader.text("Population vs Death by Flu/Pneumonia");
thetextcontent.text("A strong correlation between state populatin and death rate from influenza and pneumonia was not found.  Some of the most populous states had relatively low death rates while some states with low populations had some of the highest death rates.  Future studies might compare death rate with hospital beds per state or healthcare providers per state as a potential comparator. ");

// function used for updating x-scale var upon click on axis label
function xScale(grData, chosenXAxis) {
  // create scales
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(grData, d => d[chosenXAxis]) * 0.6,
      d3.max(grData, d => d[chosenXAxis]) * 1.1
    ])
    .range([0, width]);

  return xLinearScale;

}

// function used for updating xAxis var upon click on axis label
function renderAxes(newXScale, xAxis) {
  var bottomAxis = d3.axisBottom(newXScale);

  xAxis.transition()
    .duration(1000)
    .call(bottomAxis);
    //thetextheader.text("");

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

// function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis, circlesGroup) {

  var label;

  if (chosenXAxis === "Population") {
    label = "State Population: ";
  }
  else if (chosenXAxis === "% People with no Degree") {
    label = "Population without Degree (%): ";
  }
  else if (chosenXAxis === "% People in Poverty") {
    label = "Population in Poverty (%): ";
  }
  //else if (chosenXAxis === "Average Temperature") {
  //  label = "Average Temperature (F): ";
  //}
  else if (chosenXAxis === "Median Age") {
    label = "Median Age: ";
  }
  else if (chosenXAxis === "AvgVaxRate") {
    label = "Flu Vaccination Rate: ";
  }
  else if (chosenXAxis === "Median Household Income") {
    label = "Median Household Income ($): ";
  }
  else if (chosenXAxis === "Deaths from pneumonia and influenza") {
    label = "Number of Pneumo/Flu Deaths: ";
  }
  //else {
  //  label = "Number of Total Deaths: ";
  //}

  var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([80, 80])
    .html(function(d) {
      return (`<u>${d['State']}</u><br>${label} ${Math.round(d[chosenXAxis] * 100)/100}<br>Death Rate: ${Math.round(d['Death Rate'] * 100)/100}%`);
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
d3.csv("grimg/grimreaperdata.csv").then(function(grData, err) {
  if (err) throw err;

  // parse data
  grData.forEach(function(data) {
    data['All Deaths'] = +data['All Deaths'];
    data['State'] = data['State'];
    data['rank'] = +data['rank'];
    data['% People in Poverty'] = +data['% People in Poverty'];
    data['% People with no Degree'] = +data['% People with no Degree'];
    data['Average Temperature'] = +data['Average Temperature'];
    data['AvgVaxRate'] = +data['AvgVaxRate'];
    data['Death Rate'] = +data['Death Rate'];
    data['Deaths from pneumonia and influenza'] = +data['Deaths from pneumonia and influenza'];
    data['Median Age'] = +data['Median Age'];
    data['Median Household Income'] = +data['Median Household Income'];
    data['Population'] = +data['Population'];
    console.log(data);

  });

  // xLinearScale function above csv import
  var xLinearScale = xScale(grData, chosenXAxis);

  // Create y scale function
  var yLinearScale = d3.scaleLinear()
    .domain([0.2, (d3.max(grData, d => d['Death Rate'])) + 0.1])
    .range([height, 0]);

console.log(xLinearScale);

  // Create initial axis functions
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  // append x axis
  var xAxis = chartGroup.append("g")
    .classed("x-axis", true)
    //.attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  // append y axis
  chartGroup.append("g")
    .classed("y-axis", true)
    .call(leftAxis);

  
  let opacity = "0.5"
  //if (d => d[chosenXAxis] = 0) {
  //  opacity = "1"};

  // append initial circles
  var circlesGroup = chartGroup.selectAll("circle")
    .data(grData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d[chosenXAxis]))
    .attr("cy", d => yLinearScale(d['Death Rate']))
    .attr("r", 10)
    .attr("fill", "red")
    .attr("opacity", opacity);

  // Create group for two x-axis labels
  var labelsGroup = chartGroup.append("g")
    //.attr("transform", `translate(${width / 2}, ${height + 20})`);
    .attr("transform", `translate(${width / 2}, -60)`);

  var populationLabel = labelsGroup.append("text")
    .attr("x", -350)
    .attr("y", 10)
    .attr("value", "Population") // value to grab for event listener
    .classed("active", true)
    .text("State Population");

  var ageLabel = labelsGroup.append("text")
    .attr("x", -130)
    .attr("y", 10)
    .attr("value", "Median Age") // value to grab for event listener
    .classed("inactive", true)
    .text("Median Age");

  var povertyLabel = labelsGroup.append("text")
    .attr("x", 110)
    .attr("y", 10)
    .attr("value", "% People in Poverty") // value to grab for event listener
    .classed("inactive", true)
    .text("Population in Poverty (%)");

  var incomeLabel = labelsGroup.append("text")
    .attr("x", 350)
    .attr("y", 10)
    .attr("value", "Median Household Income") // value to grab for event listener
    .classed("inactive", true)
    .text("Median HH Income");

  /*var tempLabel = labelsGroup.append("text")
    .attr("x", 350)
    .attr("y", 10)
    .attr("value", "Average Temperature") // value to grab for event listener
    .classed("inactive", true)
    .text("Average Temperature (F)");*/

  var degreeLabel = labelsGroup.append("text")
    .attr("x", -190)
    .attr("y", 40)
    .attr("value", "% People with no Degree") // value to grab for event listener
    .classed("inactive", true)
    .text("No Degree by 25 (%)");

  /*var alldeathLabel = labelsGroup.append("text")
    .attr("x", -30)
    .attr("y", 40)
    .attr("value", "All Deaths") // value to grab for event listener
    .classed("inactive", true)
    .text("Overall Death Count");*/

  var vaxrateLabel = labelsGroup.append("text")
    .attr("x", 200)
    .attr("y", 40)
    .attr("value", "AvgVaxRate") // value to grab for event listener
    .classed("inactive", true)
    .text("Average Influenza Vaccination Rate (%)");

  // append y axis
  chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x", -180 )
    .attr("dy", "1em")
    .classed("y-axis active", true)
    .text("10 Year Flu/Pneumo Death Rate");

  // updateToolTip function above csv import
  var circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

  // x axis labels event listener
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
        xLinearScale = xScale(grData, chosenXAxis);

        // updates x axis with transition
        xAxis = renderAxes(xLinearScale, xAxis);

        // updates circles with new x values
        circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis);

        // updates tooltips with new info
        circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

        // changes classes to change bold text
        if (chosenXAxis === "Median Age") {
          ageLabel
            .classed("active", true)
            .classed("inactive", false);
          populationLabel
            .classed("active", false)
            .classed("inactive", true);
          povertyLabel
            .classed("active", false)
            .classed("inactive", true);
          incomeLabel
            .classed("active", false)
            .classed("inactive", true);
          
          degreeLabel
            .classed("active", false)
            .classed("inactive", true);
          vaxrateLabel
            .classed("active", false)
            .classed("inactive", true);
          thetextheader.text("Median Age vs Death by Flu/Pneumonia");
          thetextcontent.text("When considering the median age for each state, there appeared to be a noticable trend.  As the median age of the state increased, so did the death rate from influenza and pneumonia.  When considering that the elderly population is more likely to be hospitalized because of these respiratory illnesses, the findings in this study align with our intuitions.");
        }
        else if (chosenXAxis === "% People in Poverty") {
            ageLabel
            .classed("inactive", true)
            .classed("active", false);
          populationLabel
            .classed("active", false)
            .classed("inactive", true);
          povertyLabel
            .classed("inactive", false)
            .classed("active", true);
          incomeLabel
            .classed("active", false)
            .classed("inactive", true);
          
          degreeLabel
            .classed("active", false)
            .classed("inactive", true);
          
          vaxrateLabel
            .classed("active", false)
            .classed("inactive", true);
            thetextheader.text("Poverty Rate vs Death by Flu/Pneumonia");
            thetextcontent.text("When considering the poverty rates for each state, there appeared to be an observable weak correlation.  As the percentage of people in poverty for the state increased, so did the death rate from influenza and pneumonia.  When considering the cost of healthcare in the US and the fact that many Americans have tochoose between putting food on the table and seeking medical care, the findings in this study should not come as a surprise.");
        }
        else if (chosenXAxis === "Population") {
            ageLabel
            .classed("inactive", true)
            .classed("active", false);
          populationLabel
            .classed("inactive", false)
            .classed("active", true);
          povertyLabel
            .classed("active", false)
            .classed("inactive", true);
          incomeLabel
            .classed("active", false)
            .classed("inactive", true);
          degreeLabel
            .classed("active", false)
            .classed("inactive", true);
          vaxrateLabel
            .classed("active", false)
            .classed("inactive", true);
            
          thetextheader.text("Population vs Death by Flu/Pneumonia");
          thetextcontent.text("A strong correlation between state populatin and death rate from influenza and pneumonia was not found.  Some of the most populous states had relatively low death rates while some states with low populations had some of the highest death rates.  Future studies might compare death rate with hospital beds per state or healthcare providers per state as a potential comparator.");
        }
        else if (chosenXAxis === "Median Household Income") {
            ageLabel
            .classed("inactive", true)
            .classed("active", false);
          populationLabel
            .classed("active", false)
            .classed("inactive", true);
          povertyLabel
            .classed("active", false)
            .classed("inactive", true);
          incomeLabel
            .classed("inactive", false)
            .classed("active", true);
          degreeLabel
            .classed("active", false)
            .classed("inactive", true);
          vaxrateLabel
            .classed("active", false)
            .classed("inactive", true);
            thetextheader.text("Median Household Income vs Death by Flu/Pneumonia");
            thetextcontent.text("When comparing the death rate from influenza and pneumonia with the median household income for each state there does seem to be an inverse relationship.  As the household incomes increased, the rates of death tended to decrease.  This may be indicative of a mismatch in the availability and/or affordability of health insurance and healthcare.");
        }
        
        else if (chosenXAxis === "% People with no Degree") {
            ageLabel
            .classed("inactive", true)
            .classed("active", false);
          populationLabel
            .classed("active", false)
            .classed("inactive", true);
          povertyLabel
            .classed("active", false)
            .classed("inactive", true);
          incomeLabel
            .classed("active", false)
            .classed("inactive", true);
          degreeLabel
            .classed("inactive", false)
            .classed("active", true);
          vaxrateLabel
            .classed("active", false)
            .classed("inactive", true);
            thetextheader.text("Education Level vs Death by Flu/Pneumonia");
            thetextcontent.text("When considering the percentage of a state's population with no high school degree by age 25, there appeared to be a weak correlation.  As the education level increased, the rate of death by influenza and pneumonia decreased.  More insights may be available when considering different levels of education in this context.");
        }
        
        else {
            ageLabel
            .classed("inactive", true)
            .classed("active", false);
          populationLabel
            .classed("active", false)
            .classed("inactive", true);
          povertyLabel
            .classed("active", false)
            .classed("inactive", true);
          incomeLabel
            .classed("active", false)
            .classed("inactive", true);
          degreeLabel
            .classed("active", false)
            .classed("inactive", true);
          vaxrateLabel
            .classed("inactive", false)
            .classed("active", true);
            thetextheader.text("Vaccination Rate vs Death by Flu/Pneumonia");
            thetextcontent.text("When comparing the rate of influenza vaccination to the rate of death by influenza and pneumonia, there appears to be a trend in the data.  As the rate of vaccination for influenza increased among US states, so did the 10 year death rate.  While this result was unexpected, it may be explained by the fact that a large majority of the deaths reported by the CDC were caused by pneumonia, not influenza.  A more meaningful comparison would include vaccination rates for pneumonia as well.");
        }

      }
    });
}).catch(function(error) {
  console.log(error);
});
