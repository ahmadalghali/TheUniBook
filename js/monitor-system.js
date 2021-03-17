$(document).ready(function () {

    // let url = "http://localhost:8080"
    let url = "https://theunibook.herokuapp.com"


    let viewsPerPage = document.getElementById("viewsPerPage").getContext('2d')
    let usersTableHeaders = document.getElementById("usersTableHeaders")
    let usersTableBody = document.getElementById("usersTableBody")
    let browserTableHeaders = document.getElementById("browserTableHeaders")
    let browserTableBody = document.getElementById("browserTableBody")

    getSystemData()

    async function getSystemData() {
        await fetch(`${url}/mostViewedPages`)
            .then(res => res.json())
            .then(statistics => viewsPerPageChart(statistics));

        populateUsersTable()
        populateBrowsersTable()

    }

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

    async function populateUsersTable() {

        let htmlHeaders = `
        <tr class="table100-head">
            <th class="column1">Firstname</th>
            <th class="column2">Lastname</th>
            <th class="column3">Email</th>
            <th class="column4">Department</th>
            <th class="column5">Score</th>
        </tr>
       `

        let htmlString = ''

        let users = await fetch(`${url}/mostActiveUsers`).then(res => res.json())


        for (let user of users) {

            htmlString += `
                <tr>
                    <td class="column1">${user.firstname}</td>
                    <td class="column2">${user.lastname}</td>
                    <td class="column3">${user.email}</td>
                    <td class="column4">${user.department.name}</td>
                    <td class="column5">${user.score}</td>
                </tr>                
                `
        }

        usersTableHeaders.innerHTML = htmlHeaders
        usersTableBody.innerHTML = htmlString

    }

    async function populateBrowsersTable() {

        let htmlHeaders = `
        <tr class="table100-head">
            <th class="column1">Browser name</th>
            <th class="column2">Times used by users</th>
        </tr>
       `

        let htmlString = ''

        let browsers = await fetch(`${url}/mostUsedBrowser`).then(res => res.json())

        console.log(browsers)
        for (let browser of browsers) {

            htmlString += `
                <tr>
                    <td class="column1">${browser.name}</td>
                    <td class="column2">${browser.times_used}</td>
                </tr>                
                `
        }

        browserTableHeaders.innerHTML = htmlHeaders
        browserTableBody.innerHTML = htmlString

    }
})