// flip the project info box on click
$("#box-proj-info").flip({
    axis: 'y',
    trigger: 'click'
  });

// flip the terms box on hover
$("#box-terms").flip({
    axis: 'y',
    trigger: 'hover'
  });

// cause 'click me' text to appear/disappear on mouseover/mouseout on project info box
d3.select('#box-proj-info').on('mouseover', function() {
  d3.select('#hidden-text').style('display', 'inline-block');
}).on('mouseout', function() {
  d3.select('#hidden-text').style('display', 'none');
});