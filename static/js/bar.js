function makeResponsive() {  
  // path to csv
  var path = '/bar'
  // making chart width dependant on page width, height as a constant
  var chartWidth = window.innerWidth * 7/8;
  var chartHeight = 500;
  // Create empty arrays to store the factor values
  var year = [];
  var dance = [];
  var energy = [];
  var valance = [];
  var popularity = [];
  // list for the dropdown
  var cols_list = ['danceability', 'energy', 'valance', 'popularity'];
  // dictionary to retrive lists from based on dropdown
  var col_dict = {
    'year': year,
    'danceability': dance,
    'energy': energy,
    'valance': valance,
    'popularity': popularity
  };
  // defining factors for x and y axes
  var xValue, yValue;
  // functions -------------------------------------------------------------------------
  // response when user chooses from the dropdown
  function factorReact() {
    d3.event.preventDefault();
    // update yvalue based on dropdown chosen text
    yValue = d3.select(this).text();  
    // adding to nav display
    // select the ids
    d3.select('#factor-choice-label').style('display', 'inline-block');
    // select the y-axis element, change style and text
    var factor_text = d3.select('#factor-choice-text');
    factor_text.style('display', 'inline-block');
    factor_text.select('a').text(`${yValue}`);
  };
  // response when user clicks the button
  function triggerChart() {
    d3.event.preventDefault();
    // makes choice alert disappear again
    d3.select('#factor-choice-label').style('display', 'none');
    d3.select('#factor-choice-text').style('display', 'none');
    // calling the funct to make the chart
    buildChart(xValue, yValue);
  };
  // event listener for click on button
  d3.select('#trigger-bar').on('click', triggerChart);
  // dropdown menu append
  function dropdownFill(cols_list) {
    // appending to dropdown
    // defining dropdown variable
    var factor_dropdown = d3.select('#factor-dropdown').select('.dropdown-menu');
    // getting rid of any existing dropdown items
    factor_dropdown.text('');
    // appending factors
    cols_list.forEach(col => {
        factor_dropdown.append('a').attr('class', 'dropdown-item')
            .attr('href', '#').attr('value', `${col}`).text(col).on('click', factorReact);
    });
  };
  // function to choose bar colour based on column
  function varcolor(yValue) {
    switch(yValue) {
      case 'dance':
          return 'rgb(0, 0, 255)';
      case 'energy':
          return 'rgb(60, 179, 113)';
      case 'valance':
          return 'rgb(255, 165, 0)';
      case 'popularity':
          return 'rgb(238, 130, 238)';
      default:
            return 'rgb(0, 0, 255)';
  }};
  // function to build chart
  function buildChart(xValue, yValue) {
    var trace1 = {
      // xValue and yValue are strings -- plug them into the dict to get the actual lists
      x: col_dict[xValue],
      y: col_dict[yValue],
      type: 'bar',
      text: col_dict[yValue].map(String),
      textposition: 'auto',
      hoverinfo: 'none',
      marker: {
        color: varcolor(yValue),
        opacity: 0.6,
        line: {
          color: varcolor(yValue),
          width: 1.5
        }
      }
    };
    var data = [trace1];
    var layout = {
      autosize: false,
      width: chartWidth,
      height: chartHeight,
      title: `${yValue} by year`,
      barmode: 'stack',
      xaxis: {
        tickangle: 0,
        showticklabels: true,
        type: 'category',
        title: `${xValue}`
      },
      yaxis: {title: `${yValue}`}
    };
    Plotly.newPlot('bar', data, layout);
  };
  // reading in the data and calling initial functs --------------------------------------------------------
  d3.json(path).then(function(data) {
   // changing types
   data.forEach(function(d) {
      d.year = +d.year;
      d.dnce = d.dnce;
      d.nrgy = d.nrgy;
      d.val = d.val;
      d.pop = d.pop;
    })
    // Iterate through to extract the data to lists
    data.forEach((x) => {
      // Iterate through each key and value
      Object.entries(x).forEach(([key, value]) => {
      
        // Use the key to determine which array to push the value to
        if (key === "year") {
          year.push(value); 
          // console.log('year');
          // console.log(value);
        }
        else if (key === "dnce") {
          dance.push(value);
          // console.log('dance');
          // console.log(value);
        }
        else if (key === "nrgy") {
          energy.push(value);
          // console.log('energy');
          // console.log(value);
        }
        else if (key === "val") {
          valance.push(value);
          // console.log('val');
          // console.log(value);
        }
        else {
          popularity.push(value);
          // console.log('pop');
          // console.log(value);
        }
       });
    });
    // calling for dropdown fill
    dropdownFill(cols_list);
    // setting start x and y values
    xValue = 'year';
    yValue = 'energy';
    // building the chart off those values
    buildChart(xValue, yValue);
  })
};
makeResponsive();
// event listener for resizing graphs
d3.select(window).on('resize', makeResponsive);