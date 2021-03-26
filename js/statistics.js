$(document).ready(function () {

    // let url = "http://localhost:8080"
    let url = "https://theunibook.herokuapp.com"

    let numOfIdeasPerDepartmentChart = document.getElementById("numOfIdeasPerDepartmentChart").getContext('2d')

    let percentageOfIdeasPerDepartmentChart = document.getElementById("percentageOfIdeasPerDepartmentChart").getContext('2d')

    let contributorsPerDepartmentChart = document.getElementById("contributorsPerDepartmentChart").getContext('2d')

    let session = JSON.parse(sessionStorage.getItem("session"));

    // Chart.defaults.global.plugins.labels = {
    //     fontColor: 'white',
    //     fontSize: 24
    // };
    // global styling for cahrts
    // Chart.defaults.global.defaultFontFamily = 'Lato'
    // Chart.defaults.global.defaultFontSize = 18
    // Chart.defaults.global.defaultFontColor = '#777'


    setUserDetails()
    getStatistics()

    async function getStatistics() {
        await fetch(`${url}/ideas/statistics?email=${session.user.email}&password=${session.user.password}`)
            .then(res => res.json())
            .then(res => {
                console.log(res)
            })
        // .then(statistics => renderCharts(statistics));

        // .then(statistics => renderHTML(statistics));

    }


    function renderCharts(statistics) {

        drawIdeasPerDeptChart(statistics);
        drawPercentageIdeasPerDeptChart(statistics);
        drawContributorsPerDeptChart(statistics);
        displayExceptionReports(statistics);

    }

    function displayExceptionReports(statistics) {
        let numOfIdeasWithoutComment = document.getElementById("ideas-without-comment-count")
        let anonymousIdeas = document.getElementById("anonymousIdeas")
        let totalComments = document.getElementById("totalComments")

        numOfIdeasWithoutComment.innerHTML = `<span class="value">${statistics.numOfIdeasWithNoComments}</span>`
        anonymousIdeas.innerHTML = `<span class="value">${statistics.numOfAnonymousIdeas}</span>`
        totalComments.innerHTML = `<span class="value">${statistics.totalNumOfComments}</span>`
    }


    function drawIdeasPerDeptChart(stats) {

        let departmentNames = []
        let numOfIdeas = []

        for (let department of stats.departments) {
            departmentNames.push(department.name)
            numOfIdeas.push(department.ideaCount)
        }
        new Chart(numOfIdeasPerDepartmentChart, {
            type: 'horizontalBar', // types of charts: bar, horizontalBar, pie, line, doughnut, radar, polarArea
            data: {
                labels: departmentNames,
                datasets: [{
                    label: 'Ideas',
                    data: numOfIdeas,
                    backgroundColor: [
                        // 'green',
                        // 'red',
                        // 'pink',
                        // 'yellow',
                        // 'purple',
                        // 'orange',
                        // 'blue'
                        //shades of green
                        // '#03571a',
                        // '#0c852d',
                        // '#1db546',
                        // '#37e666',      
                        // '#0ee84a',
                        // '#7afa9d',
                        // '#a3f7ba',
                        //shades of green


                        //shades of blue
                        '#0e476e',
                        '#156fad',
                        '#1e8dd9',
                        '#2ba9ff',
                        '#69c2ff',
                        '#9cd7ff',
                        '#c7e8ff',
                        //shades of blue


                        //diff colors
                        // '#c45252',
                        // '#b481d4',
                        // '#919ded',
                        // '#aef2e1',
                        // '#f0f59d',
                        // '#f5c795',
                        // '#95f595',
                        //diff colors



                    ],
                    hoverBorderWidth: 1,
                    hoverBorderColor: 'black'
                }]
            },
            options: {
                title: {
                    fontSize: 20,
                    display: true,
                    text: 'No. of Ideas Per Department'
                },
                legend: {
                    display: false
                },
                scales: {
                    // ticks: {
                    //     beginAtZero: true,
                    //     precision: 0
                    // }
                    xAxes: [{
                        ticks: {
                            beginAtZero: true,
                            precision: 0
                        },
                        // gridLines: {
                        //     display: false
                        // }
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

    function drawPercentageIdeasPerDeptChart(stats) {

        let departmentNames = []
        let percentages = []

        // let percentage = 0;
        // if (totalIdeaCount != 0) {
        //     percentage = (department.ideaCount / totalIdeaCount) * 100
        // }
        let totalIdeaCount = 0;
        for (let department of stats.departments) {
            totalIdeaCount += department.ideaCount
        }

        for (let department of stats.departments) {
            departmentNames.push(department.name)
            let percentage = 0;
            if (totalIdeaCount != 0) {
                percentage = (department.ideaCount / totalIdeaCount) * 100

            }
            percentages.push(percentage)
        }

        new Chart(percentageOfIdeasPerDepartmentChart, {
            type: 'pie', // types of charts: bar, horizontalBar, pie, line, doughnut, radar, polarArea
            data: {
                labels: departmentNames,
                datasets: [{
                    data: percentages,
                    backgroundColor: [
                        // 'green',
                        // 'red',
                        // 'pink',
                        // 'yellow',
                        // 'purple',
                        // 'orange',
                        // 'blue'

                        '#c45252',
                        '#b481d4',
                        '#919ded',
                        '#aef2e1',
                        '#f0f59d',
                        '#f5c795',
                        '#95f595',

                    ],
                    hoverBorderWidth: 1,
                    hoverBorderColor: 'black'
                }]
            },
            options: {

                title: {
                    fontSize: 20,
                    display: true,
                    text: '% of Ideas Per Department'
                },
                legend: {
                    position: 'right',
                    // display: false
                },
                scales: {

                    // ticks: {
                    //     beginAtZero: true,
                    //     precision: 0
                    // }
                    // xAxes: [{
                    //     ticks: {
                    //         beginAtZero: true,
                    //         precision: 0
                    //     }
                    // }],
                    // yAxes: [{
                    //     ticks: {
                    //         beginAtZero: true,
                    //         precision: 0
                    //     }
                    // }]

                },
                tooltips: {
                    callbacks: {
                        label: function (tooltipItem, data) {
                            return data['labels'][tooltipItem['index']] + ': ' + data['datasets'][0]['data'][tooltipItem['index']] + '%';
                        }
                    }
                },
                plugins: {
                    labels: {
                        fontColor: 'white',
                        fontSize: 18
                    }
                }

            }


        })
    }

    function drawContributorsPerDeptChart(stats) {

        let departmentNames = []
        let numOfContributors = []

        for (let department of stats.departments) {
            departmentNames.push(department.name)
            numOfContributors.push(department.contributors)
        }
        new Chart(contributorsPerDepartmentChart, {
            type: 'horizontalBar', // types of charts: bar, horizontalBar, pie, line, doughnut, radar, polarArea
            data: {
                labels: departmentNames,
                datasets: [{
                    label: 'Contributors',
                    data: numOfContributors,
                    backgroundColor: [
                        // 'green',
                        // 'red',
                        // 'pink',
                        // 'yellow',
                        // 'purple',
                        // 'orange',
                        // 'blue'

                        //shades of green
                        '#03571a',
                        '#0c852d',
                        '#1db546',
                        '#37e666',
                        '#0ee84a',
                        '#7afa9d',
                        '#a3f7ba',
                        //shades of green

                    ],
                    hoverBorderWidth: 1,
                    hoverBorderColor: 'black'
                }]
            },
            options: {
                //     responsive: false,
                // maintainAspectRatio: false,

                title: {
                    fontSize: 20,
                    display: true,
                    text: 'No. of Contributors Per Department'
                },
                legend: {
                    display: false
                },
                scales: {
                    // ticks: {
                    //     beginAtZero: true,
                    //     precision: 0
                    // }
                    xAxes: [{
                        ticks: {
                            beginAtZero: true,
                            precision: 0
                        },
                        // gridLines: {
                        //     display: false
                        // }

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

                },
                plugins: {
                    labels: {
                        precision: 0
                    }
                }

            }


        })
    }

    function renderHTML(statistics) {
        console.log(statistics)

        let ideasPerDepartmentContainer = document.getElementById("ideas-per-department-container")
        let contributorsPerDepartmentContainer = document.getElementById("contributors-per-department-container")
        let percentageIdeasPerDepartmentContainer = document.getElementById("percentage-ideas-per-department-container")


        let numOfIdeasWithoutComment = document.getElementById("ideas-without-comment-count")
        let anonymousIdeas = document.getElementById("anonymousIdeas")
        let totalComments = document.getElementById("totalComments")

        let ideasPerDepartmenthtmlString = ''
        let contributorsPerDepartmenthtmlString = ''
        let percentageIdeasPerDepartmentContainerHtmlString = ''

        let totalIdeaCount = 0;
        for (let department of statistics.departments) {
            totalIdeaCount += department.ideaCount
        }


        for (let department of statistics.departments) {
            ideasPerDepartmenthtmlString += `
            <h4>${department.name}: <span class="value">${department.ideaCount}</span></h4>
            `

            contributorsPerDepartmenthtmlString += `
            <h4>${department.name}: <span class="value">${department.contributors}</span></h4>
            `
            let percentage = 0;
            if (totalIdeaCount != 0) {
                percentage = (department.ideaCount / totalIdeaCount) * 100
            }

            // percentageIdeasPerDepartmentContainerHtmlString += `
            // <div class="bar cf" data-percent="${percentage}%"><span class="label">${department.name}</span></div>
            // `

            percentageIdeasPerDepartmentContainerHtmlString += `
            <h4>${department.name}: <span class="value">${percentage}%</span></h4>
            `

        }

        ideasPerDepartmentContainer.innerHTML += ideasPerDepartmenthtmlString
        contributorsPerDepartmentContainer.innerHTML += contributorsPerDepartmenthtmlString
        percentageIdeasPerDepartmentContainer.innerHTML += percentageIdeasPerDepartmentContainerHtmlString

        numOfIdeasWithoutComment.innerHTML = `<span class="value">${statistics.numOfIdeasWithNoComments}</span>`
        anonymousIdeas.innerHTML = `<span class="value">${statistics.numOfAnonymousIdeas}</span>`
        totalComments.innerHTML = `<span class="value">${statistics.totalNumOfComments}</span>`



    }

    async function setUserDetails() {

        let user = session.user
        let privilegesList = document.getElementById("privilegesList")

        if (!user.enabled || user.hidden) {
            document.getElementById("addIdeaDiv").innerHTML = `<p>You're currently suspended</p>`
        }

        if (user.role == "MANAGER") {

            privilegesList.innerHTML += `

            <li class="list-inline-item"><a href="modify-category.html" id="addCategoryView"> <i
                                        class="fas fa-pen-square fa-lg"></i></a>
                            </li>
                            <span class="bio mb-3"><b>Modify Categories</b></span>
                            <br><br>

                             <li class="list-inline-item"><a href="manage-users-2.html" id="addManageUsersView"> <i
                                        class="fas fa-users fa-lg"></i></a>
                            </li>
                            <span class="bio mb-3"><b>Manage Users</b></span>
                            <br><br>

            `
        }

        if (user.profileImageUrl != null) {
            $("#userPhoto").attr("src", user.profileImageUrl);
        }

        $("#fullname").html(`<h5 style="color: white">${user.firstname} ${user.lastname}</h5>`)
        if (user.role === null) {
            $("#role").html(`Staff`)
        } else {
            $("#role").html(`<h6 style="color: white">${user.role}</h6>`)
        }

        $("#department").html(`<h6 style="color: white">${session.user.department.name}</h6>`)
        if (user.lastLogin == null) {
            $("#last_login").text("Welcome to the Unibook!");
        }
        else if (user.lastLogin != null) {
            $("#last_login").html(`<label>Last online: ${user.lastLogin}<label>`)

        }
    }

})