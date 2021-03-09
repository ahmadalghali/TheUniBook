

let url = "https://theunibook.herokuapp.com"


getStatistics()

async function getStatistics() {

    await fetch(`${url}/ideas/statistics`).then(res => res.json()).then(stats => renderCharts(stats))
}



function renderCharts(statistics) {
    drawIdeasPerDeptChart(statistics)
}


// Load Charts and the corechart package.
google.charts.load('current', { 'packages': ['corechart'] });

// // Draw the pie chart for Sarah's pizza when Charts is loaded.
// google.charts.setOnLoadCallback(drawContperdeptChart);

// // Draw the pie chart for the Anthony's pizza when Charts is loaded.
// google.charts.setOnLoadCallback(drawIdeasPerDeptChart);

// // Draw the pie chart for Sarah's pizza when Charts is loaded.
// google.charts.setOnLoadCallback(drawChartPie);

// // Draw the pie chart for the Anthony's pizza when Charts is loaded.
// google.charts.setOnLoadCallback(drawChartBar);


// Callback that draws the pie chart for Sarah's pizza.
function drawIdeasPerDeptChart(statistics) {

    // Create the data table for Sarah's pizza.
    var data = new google.visualization.DataTable();
    data.addColumn('string', 'Topping');
    data.addColumn('number', 'Ideas');

    console.log(statistics)
    for (let department of statistics.departments) {
        data.addRow([department.name, department.ideaCount])
    }
    // data.addRows([
    //     ['Computing', 1],
    //     ['Mathematics', 1],
    //     ['Art & Science', 2],
    //     ['Education Health', 2],
    //     ['Engineering', 1],
    //     ['Administration', 4]
    // ]);



    // Set options for Sarah's pie chart.
    var options = {
        title: 'IDEAS PER DEPARTMENT',
        width: 500,
        height: 400
    };

    // Instantiate and draw the chart for Sarah's pizza.
    var chart = new google.visualization.BarChart(document.getElementById('ideasperdept_chart_div'));
    chart.draw(data, options);
}

// Callback that draws the pie chart for Anthony's pizza.
function drawContperdeptChart() {

    // Create the data table for Anthony's pizza.
    var data = new google.visualization.DataTable();
    data.addColumn('string', 'Topping');
    data.addColumn('number', 'Slices');
    data.addRows([
        ['Computing', 1],
        ['Mathematics', 1],
        ['Art & Science', 2],
        ['Education Health', 2],
        ['Engineering', 1],
        ['Administration', 4]
    ]);




    // Set options for Anthony's pie chart.
    var options = {
        title: 'CONTRIBUTORS PER DEPARTMENT',
        width: 500,
        height: 400
    };

    // Instantiate and draw the chart for Anthony's pizza.
    var chart = new google.visualization.PieChart(document.getElementById('contpersept_chart_div'));
    chart.draw(data, options);


}


function drawChartBar() {

    // Create the data table for Sarah's pizza.
    var data = new google.visualization.DataTable();
    data.addColumn('string', 'Topping');
    data.addColumn('number', 'Ideas');
    data.addRows([
        ['Computing', 11],
        ['Mathematics', 21],
        ['Art & Science', 32],
        ['Education Health', 22],
        ['Engineering', 31],
        ['Administration', 44]
    ]);



    // Set options for Sarah's pie chart.
    var options = {
        title: 'IDEAS PER DEPARTMENT',
        width: 500,
        height: 400
    };

    // Instantiate and draw the chart for Sarah's pizza.
    var chart = new google.visualization.BarChart(document.getElementById('bar_chart_div'));
    chart.draw(data, options);
}

// Callback that draws the pie chart for Anthony's pizza.
function drawChartPie() {

    // Create the data table for Anthony's pizza.
    var data = new google.visualization.DataTable();
    data.addColumn('string', 'Topping');
    data.addColumn('number', 'Slices');
    data.addRows([
        ['Computing', 22],
        ['Mathematics', 11],
        ['Art & Science', 2],
        ['Education Health', 2],
        ['Engineering', 1],
        ['Administration', 4]
    ]);




    // Set options for Anthony's pie chart.
    var options = {
        title: 'CONTRIBUTORS PER DEPARTMENT',
        width: 500,
        height: 400
    };

    // Instantiate and draw the chart for Anthony's pizza.
    var chart = new google.visualization.PieChart(document.getElementById('pie_chart_div'));
    chart.draw(data, options);


}