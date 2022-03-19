// if there is text in the alert, change alert box to visible and change to appropriate colour
// reduce spacing between elements to make room for alert
window.onload = (event) => {
    // div of alert
    hitDiv = d3.select('#hitDiv');
    // text of alert
    hitText = hitDiv.select('#hitAlert').node().textContent;
    // div of project info box
    infoBox = d3.select('.infoBox');
    if (hitText.substr(-19) == 'likely to be a hit!') {
        console.log('its a hit');
        // make alert visible
        hitDiv.classed('invisible', false);
        // make it green
        hitDiv.classed('alert-success', true);
        hitDiv.classed('alert-danger', false);
        // adjust spacing
        infoBox.classed('topBuffer', false);
        infoBox.classed('topEdit', true);
    } else if (hitText.substr(-23) == 'likely to not be a hit!') {
        console.log('not a hit');
        // make alert visible
        hitDiv.classed('invisible', false);
        // make it red
        hitDiv.classed('alert-success', false);
        hitDiv.classed('alert-danger', true);
        // adjust spacing
        infoBox.classed('topBuffer', false);
        infoBox.classed('topEdit', true);
    } else {
        console.log('no song is chosen yet');
        // keep it invisible
        hitDiv.classed('invisible', true);
    } ;
};
// when alert is dismissed, adjust spacing again
$('#hitDiv').on('closed.bs.alert', function (event) {
    infoBox.style('margin-top', '87px');
  })