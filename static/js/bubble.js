// dictionary to hold user choices, with preset arbitrary choices set in for initial display
// needs to be defined outside the function so the values don't reset upon page reload
var click_dict = {'year': 2011, 'x': 'bpm', 'y': 'nrgy'};
function makeResponsive() {
    // making chart width dependant on page width, height as a constant
    var chartWidth = window.innerWidth * 5/6;
    var chartHeight = 700;

    // dict to change abbreviations to full words
    var label_dict = {
        bpm: 'Beats Per Minute',
        nrgy: 'Energy',
        live: 'Liveness',
        dnce: 'Danceability',
        dB: 'Decibels',
        val: 'Valence',
        dur: 'Duration',
        acous: 'Acoustic-ness',
        spch: 'Speechiness',
        pop: 'Popularity'
    };

    // event handling
    function yearReact() {
        d3.event.preventDefault();
        var chosen_year = d3.select(this).text();   
        // adding to alert display
        // select the div
        d3.select('#choice-alert').style('display', 'inline-block');
        // select the year element, update style and text
        var year_li = d3.select('#year-display')
        year_li.style('display', 'inline-block');
        year_li.text(`Year: ${chosen_year}`);
        // adding to dict for user choices
        click_dict['year'] = chosen_year;
    };

    function xReact() {
        d3.event.preventDefault();
        // get the value of the chosen 'col' (since the text is different), save it to the click_dict, for calling to the data
        var chosen_x = d3.select(this).node().getAttribute('value');   
        // adding to alert display
        // select the div
        d3.select('#choice-alert').style('display', 'inline-block');
        // select the x-axis element, change style and text
        var x_li = d3.select('#x-display')
        x_li.style('display', 'inline-block');
        x_li.text(`X-Axis: ${label_dict[chosen_x]}`);
        // adding to dict for user choices
        click_dict['x'] = chosen_x;
    };

    function yReact() {
        d3.event.preventDefault();
        // get the value of the chosen 'col' (since the text is different), save it to the click_dict, for calling to the data
        var chosen_y = d3.select(this).node().getAttribute('value');   
        // adding to alert display
        // select the div
        d3.select('#choice-alert').style('display', 'inline-block');
        // select the y-axis element, change style and text
        var y_li = d3.select('#y-display')
        y_li.style('display', 'inline-block');
        y_li.text(`Y-Axis: ${label_dict[chosen_y]}`);
        // adding to dict for user choices
        click_dict['y'] = chosen_y;
    };

    function triggerChart() {
        d3.event.preventDefault();
        // console.log('trigger chart triggered');
        // makes choice alert disappear again
        d3.select('#choice-alert').style('display', 'none');
        // setting up variables for entering into buildChart
        var new_year = click_dict['year'];
        var new_x = click_dict['x'];
        var new_y = click_dict['y'];
        var data = click_dict['data'];
        // calling the funct
        buildChart(new_year, new_x, new_y, data);
    };

    // event listener for click on button
    d3.select('#trigger-bubble').on('click', triggerChart);

    // funct to fill dropdowns
    function dropdownFill(year_data, columns) {
        // subsetting the col names
        var cols_for_dd = columns.slice(6, columns.length - 1);
        
        // appending to dropdowns
        // defining dropdown variables
        var year_dropdown = d3.select('#year-dropdown').select('.dropdown-menu');
        var x_dropdown = d3.select('#x-axis-dropdown').select('.dropdown-menu');
        var y_dropdown = d3.select('#y-axis-dropdown').select('.dropdown-menu');

        // getting rid of any existing dropdown items
        year_dropdown.text('');
        x_dropdown.text('');
        y_dropdown.text('');

        // appending years
        year_data.forEach(year => {
            year_dropdown.append('a').attr('class', 'dropdown-item')
                .attr('href', '#').attr('value', `${year}`).text(year).on('click', yearReact);
        });
        // appending same data to both x and y dropdowns
        cols_for_dd.forEach(col => {
            x_dropdown.append('a').attr('class', 'dropdown-item')
                .attr('href', '#').attr('value', `${col}`).text(label_dict[col]).on('click', xReact);
            y_dropdown.append('a').attr('class', 'dropdown-item')
                .attr('href', '#').attr('value', `${col}`).text(label_dict[col]).on('click', yReact);
        });

    };
    function buildChart(year, x_choice, y_choice, data) {
        // clearing any previous charts
        d3.select('#bubble').empty()
        // filtering data based on year choice
        var data_year_filter = data.filter(function(d) {
            return d.year == year;
        });  
        // other graph factors
        var genre_nums = data_year_filter.map(d => d.genre_num);
        var genre = data_year_filter.map(d => d.genre);
        var pop = data_year_filter.map(d => d.pop);
        
        // deriving x_axis and y_axis
        var x_axis = data_year_filter.map(d => d[x_choice]);
        var y_axis = data_year_filter.map(d => d[y_choice]);

        // determining tickspacing
        var xtick, ytick;

        if (x_choice == 'dur') {
            xtick = 10;
        } else if (x_choice == 'dB') {
            xtick = 1;
        } else if (x_choice == 'spch') {
            xtick = 3;
        } else { xtick = 5; };

        if (y_choice == 'dur') {
            ytick = 10;
        } else if (y_choice == 'dB') {
            ytick = 1;
        } else if (y_choice == 'spch') {
            ytick = 3;
        } else { ytick = 5; }

        // creating the plot: colour is determined by genre, size is determined by popularity
        var traceA = {
            type: 'scatter',
            mode: 'markers',
            showlegend: true,
            x: x_axis,
            y: y_axis,
            text: data_year_filter.map(function(d) {
                return `Track Name: ${d.title}<br>Artist: ${d.artist}<br>Track Genre: ${d.genre}<br>Track Subgenre: ${d.subgenre}`
            }),
            marker: {
                color: genre_nums,
                colorscale: 'Rainbow',
                cmin: d3.min(genre_nums),
                cmax: d3.max(genre_nums),
                size: data_year_filter.map(function(d) {
                    if (d.pop == 0) {
                        // makes sure the song with the popularity of '0' shows up
                        return 6;
                    } else {return d.pop;}
                }),
                sizeref: 2,
                sizemode: 'radius'
            },
            transforms: [{ type: "groupby", groups: genre }],
            hovertemplate:
                `<b>%{text}</b><br>%{yaxis.title.text}: %{y}<br>%{xaxis.title.text}: %{x}<br><extra></extra>`
        };
        
        var data = [traceA];
        
        var layout = {
            autosize: false,
            width: chartWidth,
            height: chartHeight,
            title: `${label_dict[x_choice]} vs. ${label_dict[y_choice]} in ${year}`,
            hovermode: 'closest',
            legend: {orientation: 'v', x: 0.87, y: 0.05},
            xaxis: {
                title: `${label_dict[x_choice]}`,
                autotick: false,
                ticks: 'outside',
                tick0: 0,
                dtick: xtick,
                ticklen: 8,
                tickwidth: 2,
                tickcolor: '#000',
                zeroline: false
            },
            yaxis: {
                title: `${label_dict[y_choice]}`,
                autotick: false,
                ticks: 'outside',
                tick0: 0,
                dtick: ytick,
                ticklen: 8,
                tickwidth: 2,
                tickcolor: '#000',
                zeroline: false
            }
        };
        // make responsive to page size
        var config = {responsive: true}
        // appending to html page
        Plotly.newPlot('bubble', data, layout, config);
    };

    // var path = 'static/data/data_cleaned.csv'
    // var path = "{{ url_for('home', filename='sunbubblevalues') }}";
    var path = '/sunburstbubble'

    d3.json(path).then(function(data) {
        // changing types
        data.forEach(function(d) {
            d.genre_num = +d.genre_num;
            d.bpm = +d.bpm;
            d.nrgy = +d.nrgy;
            d.dnce = +d.dnce;
            d.dB = +d.dB;
            d.live = +d.live;
            d.val = +d.val;
            d.dur = +d.dur;
            d.acous = +d.acous;
            d.spch = +d.spch;
            d.pop = +d.pop;
        });

        // sending data to the dict
        click_dict['data'] = data;
        
        // sending to dropdown fill funct
        // getting the col names
        var columns = data[603].columns;
        // making a unique list (set) of the years in the dataset
        var year_data = [...new Set(data.map(d => d.year))];
        dropdownFill(year_data, columns);

        // using dict to set first initial display
        var year = click_dict['year'];
        var x_choice = click_dict['x'];
        var y_choice = click_dict['y'];
        buildChart(year, x_choice, y_choice, data);
    })
    
};
makeResponsive();
// event listener for resizing graphs
d3.select(window).on('resize', makeResponsive);