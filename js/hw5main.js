// Create a Frame
const FRAME_HEIGHT = 400;
const FRAME_WIDTH = 500; 
const MARGINS = {left: 50, right: 50, top: 50, bottom: 50};

// Create height and width variables
const VIS_HEIGHT = FRAME_HEIGHT - MARGINS.top - MARGINS.bottom;
const VIS_WIDTH = FRAME_WIDTH - MARGINS.left - MARGINS.right; 

// Create Frame 1
const FRAME1 = d3.select("#vis1")
                  .append("svg")
                    .attr("height", FRAME_HEIGHT)
                    .attr("width", FRAME_WIDTH)
                    .attr("class", "frame"); 

// Define scale functions that maps our data values 
// (domain) to pixel values (range)
const X_SCALE2 = d3.scaleLinear() 
                    .domain([0, 10]) // add some padding  
                    .range([0, VIS_WIDTH]); 

const Y_SCALE2 = d3.scaleLinear() 
                    .domain([0, 10]) // add some padding  
                    .range([VIS_HEIGHT, 0]); 
// read data and create plot
d3.csv("/data/scatter-data.csv").then((data) => {

  // Use scale to plot our points
  FRAME1.selectAll("points")  
      .data(data) // passed from .then  
      .enter()       
      .append("circle")
        .attr("cx", (d) => { return (X_SCALE2(d.x) + MARGINS.left); }) 
        .attr("cy", (d) => { return (Y_SCALE2(d.y) + MARGINS.bottom); }) 
        .attr("r", 10)
        .attr("counter", 1)
        .attr("class", "point"); 

  // Create function to add border
  d3.selectAll('circle')
    .on('click', function() {
      // if border does exist, remove border
      if ((d3.select(this).attr("counter") % 2) == 0) {
        d3.select(this)
          .style("stroke", "none");
      }
      // if border does not exist, create border
      else {
        d3.select(this)
          .style("stroke", "green")
          .style("stroke-width", "6");
      }
      // add text to right column of page, increment counter by 1
      d3.select(this).attr("counter", (d) => { return (parseInt(d3.select(this).attr("counter")) + 1); });

      var text = "(" + ((d3.select(this).attr("cx") - MARGINS.left) / 40) + "," + (10 - ((d3.select(this).attr("cy") - MARGINS.bottom) / 30))+ ")";
      document.getElementById("lastPoint").textContent = text;
    });

  // Add an x axis to the vis  
  FRAME1.append("g") 
        .attr("transform", "translate(" + MARGINS.left + 
              "," + (VIS_HEIGHT + MARGINS.top) + ")") 
        .call(d3.axisBottom(X_SCALE2).ticks(10)) 
          .attr("font-size", '10px');
  
  // add y axis to the vis
  FRAME1.append("g") 
        .attr("transform", "translate(" + MARGINS.left + 
              "," + (VIS_HEIGHT - 250) + ")") 
        .call(d3.axisLeft(Y_SCALE2).ticks(10)) 
          .attr("font-size", '10px');

}); 

// PLOT POINTS

function plotPoints() {
  
  // Get x and y values
  var x = document.getElementById("xDropdown").value;
  var y = document.getElementById("yDropdown").value;
  const userData = [(x, y)]

  // Plot point, create attributes
  FRAME1.selectAll("points")  
      .data(userData)
      .enter()      
      .append("circle")
        .attr("cx", (d) => { return (X_SCALE2(x) + MARGINS.left); })
        .attr("cy", (d) => { return (Y_SCALE2(y) + MARGINS.bottom); })
        .attr("r", 10)
        .attr("counter", 1)
        .attr("fill", "cyan")
        .attr("class", "point");

  // Create get border/delete border function
d3.selectAll('circle')
    .on('click', function() {
      // if border exists delete border
      if ((d3.select(this).attr("counter") % 2) == 0) {
        d3.select(this)
          .style("stroke", "none");
      }
      // if border does not exist create border
      else {
        d3.select(this)
          .style("stroke", "green")
          .style("stroke-width", "6");
      }

      // add text to right column of page, increment counter by 1
      d3.select(this).attr("counter", (d) => { return (parseInt(d3.select(this).attr("counter")) + 1); });
      var text = "(" + String((d3.select(this).attr("cx") - MARGINS.left) / 40) + "," + String(10 - (d3.select(this).attr("cy") - MARGINS.bottom) / 30)+ ")";
      document.getElementById("lastPoint").textContent = text;
    });
  };


// BAR PLOT
const FRAME2 = d3.select("#vis2")
                  .append("svg")
                    .attr("height", FRAME_HEIGHT)
                    .attr("width", FRAME_WIDTH)
                    .attr("class", "frame");


function build_interactive_barplot() {
                  
  d3.csv("/data/bar-data.csv").then((data) => {

    console.log(data) 

    const X_SCALE2 = d3.scaleBand() 
                      .domain(data.map(d => d.category)) // add some padding  
                      .range([0, VIS_WIDTH]);
    

    const Y_SCALE2 = d3.scaleLinear() 
                      .domain([0, 100]) // add some padding  
                      .range([VIS_HEIGHT, 0]);
      

    // Use scale to plot our bars
    FRAME2.selectAll(".bar")  
        .data(data) // passed from .then
        .enter()         
        .append("rect")
          .attr("class", "bar")
          .attr("x", (d) => { return (X_SCALE2(d.category) + 60); })
          .attr("y", (d) => { return (Y_SCALE2(d.amount) + MARGINS.bottom); })
          .attr("width", 40)
          .attr("height", d => VIS_HEIGHT - Y_SCALE2(d.amount));

        
    FRAME2.append("g") 
        .attr("transform", "translate(" + MARGINS.left + 
              "," + (VIS_HEIGHT + MARGINS.top) + ")") 
        .call(d3.axisBottom(X_SCALE2).ticks(7)) 
          .attr("font-size", '10px');

    FRAME2.append("g") 
        .attr("transform", "translate(" + MARGINS.left + 
              "," + (VIS_HEIGHT - 250) + ")") 
        .call(d3.axisLeft(Y_SCALE2).ticks(10)) 
          .attr("font-size", '10px');

    // Create tooltip
    const TOOLTIP = d3.select("#vis2")
              .append("div")
                .attr("class", "tooltip")
                .style("opacity", 1); 

    // Define event handler functions for tooltips
    function handleMouseover(event, d) {
      // on mouseover, make opaque 
        TOOLTIP.style("opacity", 1); 
    }

    function handleMousemove(event, d) {
      // position the tooltip and fill in information 
      TOOLTIP.html("Name: " + d.category + "<br>Value: " + d.amount)
              .style("left", (event.pageX + 10) + "px") //add offset
                                                            // from mouse
              .style("top", (event.pageY - 50) + "px"); 
    }
  
    function handleMouseleave(event, d) {
      // on mouseleave, make transparant again 
      TOOLTIP.style("opacity", 0); 
    } 

    // Add event listeners
    FRAME2.selectAll(".bar")
          .on("mouseover", handleMouseover) //add event listeners
          .on("mousemove", handleMousemove)
          .on("mouseleave", handleMouseleave);    

  });
}

build_interactive_barplot();
