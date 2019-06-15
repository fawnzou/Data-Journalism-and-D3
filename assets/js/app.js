
// Set up SVG frame
var svgWidth = 800;
var svgHeight = 640;

var Margin ={
  top:40,
  right:40,
  bottom:100,
  left:100
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


// Import data from the csv file
d3.csv("assets/data/data.csv").then(function(HealthData) {
    console.log(HealthData);
    // Step 1: Parse Data as numbers
    // ==============================
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
  
  
  //  Create xaxis scales
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(HealthData, d => d.poverty)-1, d3.max(HealthData, d => d.poverty)+1])
    .range([0, width]);  
  

  //  Create yaxis  scales
  var yLinearScale = d3.scaleLinear()
    .domain([d3.min(HealthData, d => d.obesity)-1, d3.max(HealthData, d => d.obesity)+1])
    .range([height,0]);


  //  Create  xaxis
  var bottomAxis = d3.axisBottom(xLinearScale);  
              
  
  //  Create yaxis
  var leftAxis = d3.axisLeft(yLinearScale);
 
 
   // append xaxis 
   var xAxis = svg.append("g")    
    .attr("transform", `translate(${Margin.left}, ${height+Margin.top})`)
    .classed("x-axis", true)
    .call(bottomAxis);

   // append  yaxis
  var yAxis = chartGroup.append("g")        
             .classed("y-axis", true)
             .call(leftAxis);

//  Create x axis label
svg.append("text")
    .attr("x", svgWidth/2+ Margin.left/2)
    .attr("y", svgHeight -  Margin.bottom/1.5)
    .attr("font-size", "18px")
    .attr("font-weight","600")
    .style("text-anchor","middle")
    .text("In Poverty(%)");

//  Create y axis label
svg.append("text")
    .attr("transform","rotate(-90)")
    .attr("x", -svgHeight/2 + Margin.top/2)
    .attr("y", Margin.left*0.7)
    .attr("font-size", "18px")
    .attr("font-weight","600")
    .style("text-anchor","middle")
    .text("Obese(%)");


// add the x gridlines
svg.append("g")
   .attr("class", "grid")
   .attr("transform", `translate(${Margin.left}, ${height+Margin.top})`)
   .attr("stroker","lightgrey")
   .attr("stroke-opacity","0.2")
   .call(bottomAxis.tickSize(-height)
        .tickFormat(""))

// add the y gridlines
 chartGroup.append("g")  
.attr("class", "grid")
.attr("stroker","lightgrey")
.attr("stroke-opacity","0.2")
.call(leftAxis.tickSize(-width)
     .tickFormat(""))



// setup the tooltip
var tool_tip = d3.tip()
  .attr("class", "tooltip")
  .offset([-8, 0])
  .html(function(d) { return `${d.state}<br>In Poverty: ${d.poverty}%<br>Obese: ${d.obesity}%`; });

svg.call(tool_tip);

// append initial circles and tooltip
var circles = chartGroup.selectAll("circle")
  .data(HealthData)
  .enter()
  .append("circle")
  .attr("cx", d => xLinearScale(d.poverty))
  .attr("cy", d => yLinearScale(d.obesity))
  .attr("r", 18)
  .attr("fill", "lightblue")
  .attr("opacity", ".5")
  .attr("stroke-width", "1")
  .attr("stroke", "black")
  .on("mouseover", tool_tip.show)
  .on("mouseout", tool_tip.hide);   

// Append text labels in each circle
var selection = chartGroup.selectAll("text")
  .data(HealthData);

HealthData.forEach(function(data) {
  svg.append("text")
     .attr("transform",`translate(${Margin.left}, ${Margin.top})`)
     .attr("x", xLinearScale(data.poverty))
     .attr("y", yLinearScale(data.obesity)+4)  
     .text(data.abbr)
     .attr("text-anchor","middle")
     .attr("font-size", "14px")
     .attr("font-weight","500")
     .attr("stroke", "black")
     .attr("fill", "black")
     .on("mouseover", tool_tip.show)   
     .on("mouseout", tool_tip.hide); 
});

 });




