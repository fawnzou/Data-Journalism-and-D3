

// Set up SVG frame
var svgWidth = 900;
var svgHeight = 720;

var Margin ={
  top:40,
  right:40,
  bottom:120,
  left:120
};

var width = svgWidth - Margin.left - Margin.right;
var height = svgHeight -Margin.top - Margin.bottom;

//  Create an SVG wrapper

var svg = d3.select("#scatter")
            .append("svg")
            .attr("width",svgWidth)
            .attr("height",svgHeight);

var chartGroup = svg.append("g")
                    .attr("transform",`translate(${Margin.left}, ${Margin.top})`);


 // Initial Params
var chosenXAxis = "poverty";
var chosenYAxis = "obesity";

// function used for updating x-scale var upon click on axis label
function xScale(HealthData, chosenXAxis) {
  // create scales
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(HealthData, d => d[chosenXAxis])-1,
      d3.max(HealthData, d => d[chosenXAxis])+1
    ])
    .range([0, width]);

  return xLinearScale ;
}

// function used for updating y-scale var upon click on axis label
function yScale(HealthData, chosenYAxis) {
    // create scales
   var yLinearScale = d3.scaleLinear()
      .domain([d3.min(HealthData, d => d[chosenYAxis])-1,
        d3.max(HealthData, d => d[chosenYAxis])+1
      ])
      .range([height,0]);
  
    return yLinearScale ;
  }

// function used for updating xAxis var upon click on axis label
function renderXAxes(newXScale, xAxis) {
  var bottomAxis = d3.axisBottom(newXScale);

  xAxis.transition()
    .duration(1000)
    .call(bottomAxis); 

  return xAxis;
}

// function used for updating yAxis var upon click on axis label
function renderYAxes(newYScale, yAxis) {
    var leftAxis = d3.axisLeft(newYScale);
  
    yAxis.transition()
      .duration(1000)
      .call(leftAxis); 
  
    return yAxis;
  }


// function used for updating circles group with a transition to
// new circles
function renderCircles(circlesGroup, newXScale, chosenXaxis, newYScale, chosenYaxis) {

  circlesGroup.transition()
    .duration(1000)
    .attr("cx", d => newXScale(d[chosenXAxis]))
    .attr("cy", d => newYScale(d[chosenYaxis]));

  return circlesGroup;
}


// function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup) {
  if (chosenXAxis === "poverty") {
    var xlabel = "In Poverty (%)";
  }

  if (chosenXAxis === "age") {
    var xlabel = "Age(Median)";
  }

  if (chosenXAxis === "income") {
    var xlabel = "Household Income (Median)";
  }

  if (chosenYAxis === "obesity") {
    var ylabel = "Obese(%)";
  }

  if (chosenYAxis === "smokes") {
    var ylabel = "Smokes(%) ";
  }

  if (chosenYAxis === "Lacks Healthcare(%)") {
    var ylabel = "Lacks Healthcare(%)";
  }

  var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([-8, -60])
    .html(function(d) {
      return (`${d.state}<br>${xlabel}: ${d[chosenXAxis]}%<br>${ylabel}: ${d[chosenYAxis]}%`);
    });

 
  circlesGroup.call(toolTip);

  circlesGroup.on("mouseover", toolTip.show)
              .on("mouseout", toolTip.hind);   
  return circlesGroup;
}

// Function uesd for adding state name in each circle
function addStatename( HealthData, circlesGroup, newXScale, chosenXaxis, newYScale, chosenYaxis) {
  
HealthData.forEach(function(data) {
  circlesGroup.append("text")
     .attr("transform",`translate(${Margin.left}, ${Margin.top})`)
     .attr("x", newXScale(data.chosenXaxis))
     .attr("y", newYScale(data.chosenYaxis)+4)  
     .text(data.abbr)
     .attr("text-anchor","middle")
     .attr("font-size", "14px")
     .attr("font-weight","500")
     .attr("stroke", "black")
     .attr("fill", "black")
    //  .on("mouseover", tool_tip.show)   
    //  .on("mouseout", tool_tip.hide); 
     return circlesGroup;
});
}


// Functon used for adding xAxis gridlines
 function addXAxisgrid(newXScale) {
  var bottomAxis = d3.axisBottom(newXScale)
  var xgrid =  svg.append("g")
   .attr("class", "grid")
   .attr("transform", `translate(${Margin.left}, ${height+Margin.top})`)
   .attr("stroker","lightgrey")
   .attr("stroke-opacity","0.2")
   .call(bottomAxis.tickSize(-height)
        .tickFormat(""))
  return xgrid;
 }

 // Functon used for adding yAxis gridlines
 function addYAxisgrid(newYScale) {
  var leftAxis =  d3.axisLeft(newYScale);
  var ygrid =  svg.append("g")
   .attr("class", "grid")
   .attr("transform", `translate(${Margin.left}, ${height+Margin.top})`)
   .attr("stroker","lightgrey")
   .attr("stroke-opacity","0.2")
   .call(leftAxis.tickSize(-height)
        .tickFormat(""))
  return ygrid;
 }



// Retrieve data from the CSV file and execute everything below
d3.csv("assets/data/data.csv").then(function(HealthData) {
  console.log(HealthData);
  // Parse Data as numbers
  HealthData.forEach(function(data) {
    data.age = parseFloat(data.age);
    data.ageMoe = parseFloat(data.ageMoe);
    data.healthcare = parseFloat(data.healthcare);
    data.healthcareHigh = parseFloat(data.healthcareHigh);
    data.healthcareLow = parseFloat(data.healthcareLow);
    data.income = parseInt(data.income);
    data.incomeMoe = parseInt(data.incomeMoe);
    data.obesity = parseFloat(data.obesity);
    data.obesityHigh = parseFloat(data.obesityHigh);
    data.obesityLow = parseFloat(data.obesityLow);
    data.poverty = parseFloat(data.poverty);
    data.povertyMoe = parseFloat(data.povertyMoe);
    data.smokes = parseFloat(data.smokes);
    data.smokesHigh = parseFloat(data.smokesHigh);   
    data.smokesLow = parseFloat(data.smokesLow);         
});


  // xLinearScale function above csv import
  var xLinearScale = xScale(HealthData, chosenXAxis);

  // Create y scale function
  var yLinearScale = yScale(HealthData, chosenYAxis);
    

  // Create initial axis functions
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  // append x axis
  var xAxis = chartGroup.append("g")
    .classed("x-axis", true)
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  // append y axis
  chartGroup.append("g")
    .call(leftAxis);

  // append initial circles
  var circlesGroup = chartGroup.selectAll("circle")
    .data(HealthData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d[chosenXAxis]))
    .attr("cy", d => yLinearScale(d[chosenYAxis]))
    .attr("r", 18)

    // Add initial state name in each circle
    HealthData.forEach(function(data) {
      svg.append("text")
         .attr("transform",`translate(${Margin.left}, ${Margin.top})`)
         .attr("x", xLinearScale(data[chosenXAxis]))
         .attr("y", yLinearScale(data[chosenYAxis])+4)  
         .text(data[abbr])
         .attr("text-anchor","middle")
         .attr("font-size", "14px")
         .attr("font-weight","500")
         .attr("stroke", "black")
         .attr("fill", "black")       
    });
   
    
    
    
   
  // Create 3 xaxis labels
  var labelsGroup = chartGroup.append("g")
    .attr("transform", `translate(${width/2}, ${height + 20})`);

  var xLabel1 = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 10)
    .attr("value", "poverty") // value to grab for event listener
    .classed("active", true)
    .text("In Poverty (%)");
  
  var xLabel2 = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 30)
    .attr("value", "age") // value to grab for event listener
    .classed("inactive", true)
    .text("Age(Median)");

  var xLabel3 = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 50)
    .attr("value", "income") // value to grab for event listener
    .classed("inactive", true)
    .text("Household Income (Median)");

  // Create 3 yaxis labels
  var yLabel1 = svg.append("text")
    .attr("transform","rotate(-90)")
    .attr("x", -svgHeight/2 + Margin.top/2)
    .attr("y", Margin.left*0.3)
    .attr("font-size", "18px")
    .attr("font-weight","600")
    .style("text-anchor","middle")
    .classed("active", true)
    .text("Obese(%)");

  var yLabel2 = svg.append("text")
    .attr("transform","rotate(-90)")
    .attr("x", -svgHeight/2 + Margin.top/2)
    .attr("y", Margin.left*0.5)
    .attr("font-size", "18px")
    .attr("font-weight","600")
    .style("text-anchor","middle")
    .classed("inactive", true)
    .text("Smokes(%)");

  var yLabel3 = svg.append("text")
    .attr("transform","rotate(-90)")
    .attr("x", -svgHeight/2 + Margin.top/2)
    .attr("y", Margin.left*0.7)
    .attr("font-size", "18px")
    .attr("font-weight","600")
    .style("text-anchor","middle")
    .classed("inactive", true)
    .text("Lacks Healthcare(%)");



 
  // // updateToolTip function above csv import
  // var circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);
  //   // x axis labels event listener
  //    labelsGroup.selectAll("text").on("click", function() {
  //     // get value of selection
  //       var value = d3.select(this).attr("value");
  //     if (value === "age" ) {
  //       chosenXAxis = value;
  //       // functions here found above csv import
  //       // updates x scale for new data
  //       xLinearScale = xScale(HealthData, chosenXAxis);
  //       yLinearScale = xScale(HealthData, chosenYAxis);


  //     }

  //

   //         //     x: In Poverty (%)             poverty
  //               //     Age(Median)                   age
  //               //     Household Income (Median)     income
                 
  //               //    y: Obese(%)                    obesity
  //               //     Smokes(%)                     smokes
  //               //     Lacks Healthcare(%)           healthcare  

  //       // functions here found above csv import
  //       // updates x scale for new data
  //       xLinearScale = xScale(HealthData, chosenXAxis);
  //       yLinearScale = xScale(HealthData, chosenYAxis);

  //       // updates x axis with transition
  //       xAxis = renderAxes(xLinearScale, xAxis);

  //       // updates circles with new x values
  //       circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis);

  //       // updates tooltips with new info
  //       circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

  //       // changes classes to change bold text
  //       if (chosenXAxis === "num_albums") {
  //         albumsLabel
  //           .classed("active", true)
  //           .classed("inactive", false);
  //         hairLengthLabel
  //           .classed("active", false)
  //           .classed("inactive", true);
  //       }
  //       else {
  //         albumsLabel
  //           .classed("active", false)
  //           .classed("inactive", true);
  //         hairLengthLabel
  //           .classed("active", true)
  //           .classed("inactive", false);
  //       }
  //     }
    });


// svg.append("g")
//    .attr("class", "grid")
//    .attr("transform", `translate(${Margin.left}, ${height+Margin.top})`)
//    .attr("stroker","lightgrey")
//    .attr("stroke-opacity","0.2")
//    .call(bottomAxis.tickSize(-height)
//         .tickFormat(""))

// // add the y gridlines
//  chartGroup.append("g")  
// .attr("class", "grid")
// .attr("stroker","lightgrey")
// .attr("stroke-opacity","0.2")
// .call(leftAxis.tickSize(-width)
//      .tickFormat(""))