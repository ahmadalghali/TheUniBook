$(document).ready(function () {

    // let url = "http://localhost:8080"
    let url = "https://theunibook.herokuapp.com"


    // let totalNumOfCommentsField = document.getElementById("totalNumOfCommentsField")
    // let numOfAnonymousIdeasField = document.getElementById("numOfAnonymousIdeasField")
    // let numOfIdeasWithNoCommentsField = document.getElementById("numOfIdeasWithNoCommentsField")




    getStatistics()

    async function getStatistics() {
        await fetch(`${url}/ideas/statistics`)
            .then(res => res.json())
            .then(statistics => renderHTML(statistics));

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
            let percentage = (department.ideaCount / totalIdeaCount) * 100

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
})