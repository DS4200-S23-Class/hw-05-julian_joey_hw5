// Create a Frame
const FRAME_HEIGHT = 400;
const FRAME_WIDTH = 500; 
const MARGINS = {left: 50, right: 50, top: 50, bottom: 50};

const VIS_HEIGHT = FRAME_HEIGHT - MARGINS.top - MARGINS.bottom;
const VIS_WIDTH = FRAME_WIDTH - MARGINS.left - MARGINS.right; 

const FRAME1 = d3.select("#vis1")
                  .append("svg")
                    .attr("height", FRAME_HEIGHT)
                    .attr("width", FRAME_WIDTH)
                    .attr("class", "frame"); 

// read data and create plot
d3.csv("/data/scatter-data.csv").then((data) => {

    console.log(data)

  // find max X
  const MAX_X2 = d3.max(data, (d) => { return parseInt(d.x); });
          // Note: data read from csv is a string, so you need to
          // cast it to a number if needed

      

   // find max Y
  const MAX_Y2 = d3.max(data, (d) => { return parseInt(d.y); });
  
  // Define scale functions that maps our data values 
  // (domain) to pixel values (range)
  const X_SCALE2 = d3.scaleLinear() 
                    .domain([0, 10]) // add some padding  
                    .range([0, VIS_WIDTH]); 

   const Y_SCALE2 = d3.scaleLinear() 
                    .domain([0, 10]) // add some padding  
                    .range([VIS_HEIGHT, 0]); 

  // Use scale to plot our points
  FRAME1.selectAll("points")  
      .data(data) // passed from .then  
      .enter()       
      .append("circle")
        .attr("cx", (d) => { return (X_SCALE2(d.x) + MARGINS.left); }) 
        .attr("cy", (d) => { return (Y_SCALE2(d.y) + MARGINS.bottom); }) 
        .attr("r", 5)
        .attr("class", "point"); 

  d3.selectAll('circle')
    .on('click', function() {
      if (d3.select(this).style("stroke", "none")){
        d3.select(this)
          .style("stroke", "green");
        }
    });
  // Add an axis to the vis  
  FRAME1.append("g") 
        .attr("transform", "translate(" + MARGINS.left + 
              "," + (VIS_HEIGHT + MARGINS.top) + ")") 
        .call(d3.axisBottom(X_SCALE2).ticks(10)) 
          .attr("font-size", '20px');
        
        
          
  FRAME1.append("g") 
        .attr("transform", "translate(" + MARGINS.left + 
              "," + (VIS_HEIGHT - 250) + ")") 
        .call(d3.axisLeft(Y_SCALE2).ticks(10)) 
          .attr("font-size", '20px');

}); 

