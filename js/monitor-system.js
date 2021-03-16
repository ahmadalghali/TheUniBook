$(document).ready(function () {

    // let url = "http://localhost:8080"
    let url = "https://theunibook.herokuapp.com"


    let viewsPerPage = document.getElementById("viewsPerPage").getContext('2d')

    let mostActiveUsers = document.getElementById("mostActiveUsers").getContext('2d')


    //let contributorsPerDepartmentChart = document.getElementById("contributorsPerDepartmentChart").getContext('2d')

    // Chart.defaults.global.plugins.labels = {
    //     fontColor: 'white',
    //     fontSize: 24
    // };
    // global styling for cahrts
    // Chart.defaults.global.defaultFontFamily = 'Lato'
    // Chart.defaults.global.defaultFontSize = 18
    // Chart.defaults.global.defaultFontColor = '#777'


    getSystemData()

    async function getSystemData() {
        await fetch(`${url}/mostViewedPages`)
            .then(res => res.json())
            .then(statistics => viewsPerPageChart(statistics));

        // .then(statistics => renderHTML(statistics));

        await fetch(`${url}/mostActiveUsers`)
            .then(res => res.json())
            .then(statistics => mostActiveUsersChart(statistics));
    }


    // function renderCharts(statistics) {

    //     viewsPerPageChart(statistics);
    //     mostActiveUsersChart(statistics);

    // }

    function viewsPerPageChart(stats) {

        let pageNames = []
        let viewCount = []

        for (let page of stats.pages) {
            pageNames.push(page.name)
            viewCount.push(page.views)
        }
        new Chart(viewsPerPage, {
            type: 'horizontalBar', // types of charts: bar, horizontalBar, pie, line, doughnut, radar, polarArea
            data: {
                labels: pageNames,
                datasets: [{
                    label: 'Views',
                    data: viewCount,
                    backgroundColor: [
                        'green',
                        'red',
                        'pink',
                        'yellow',
                        'purple',
                        'orange',
                        'blue'

                    ],
                    hoverBorderWidth: 1,
                    hoverBorderColor: 'black'
                }]
            },
            options: {
                title: {
                    fontSize: 20,
                    display: true,
                    text: 'Number of views per page'
                },
                legend: {
                    display: false
                },
                scales: {
                    xAxes: [{
                        ticks: {
                            beginAtZero: true,
                            precision: 0
                        },
                    }],
                    yAxes: [{
                        ticks: {
                            beginAtZero: true,
                            precision: 0
                        },
                        gridLines: {
                            display: false
                        }
                    }]

                }
            }


        })
    }
    
    function mostActiveUsersChart(stats) {

        let userNames = []
        let scoreCount = []

        for (let name of stats.users) {
            userNames.push(name.email)
            scoreCount.push(name.score)
        }
        new Chart(mostActiveUsers, {
            type: 'horizontalBar', // types of charts: bar, horizontalBar, pie, line, doughnut, radar, polarArea
            data: {
                labels: userNames,
                datasets: [{
                    label: 'Views',
                    data: scoreCount,
                    backgroundColor: [
                        'green',
                        'red',
                        'pink',
                        'yellow',
                        'purple',
                        'orange',
                        'blue'

                    ],
                    hoverBorderWidth: 1,
                    hoverBorderColor: 'black'
                }]
            },
            options: {
                title: {
                    fontSize: 20,
                    display: true,
                    text: 'Most active users'
                },
                legend: {
                    display: false
                },
                scales: {
                    xAxes: [{
                        ticks: {
                            beginAtZero: true,
                            precision: 0
                        },
                    }],
                    yAxes: [{
                        ticks: {
                            beginAtZero: true,
                            precision: 0
                        },
                        gridLines: {
                            display: false
                        }
                    }]

                }
            }


        })
    }
})