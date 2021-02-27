$(document).ready(function () {

    let url = "https://theunibook.herokuapp.com"

    let currentPage = 1;


    let pagesDiv = document.getElementById("pagesDiv")

    let pageCount;

    let session = JSON.parse(sessionStorage.getItem("session"));

    if (sessionStorage.getItem("IDEA_ADDED_MESSAGE") !== null) {
        toastr.success("Idea added!")

        sessionStorage.removeItem("IDEA_ADDED_MESSAGE")
    }
    // validateUserSession()


    initHomePage()


    function initHomePage() {
        populateCategoryDropdown()
        setUserDetails()
        displayIdeas(currentPage)
    }

    

    function setUserDetails() {

        let user = session.user
        $("#fullname").html(`<h5 style="color: white">${user.firstname} ${user.lastname}</h5>`)
        if (user.role === null) {
            $("#role").html(`Staff`)
        } else {
            $("#role").html(`<h6 style="color: white">${user.role}</h6>`)
        }

        $("#department").html(`<h6 style="color: white">${session.user.department.name}</h6>`)
    }

    async function populateCategoryDropdown() {
        var categoryDropdown = $("#category_dropdown");
        categoryDropdown.empty();
        categoryDropdown.append('<option selected="selected" disabled>Choose Category</option>');

        await fetch(`${url}/categories`).then(response => response.json()).then(categories => {
            let option;

            for (let i = 0; i < categories.length; i++) {
                option = document.createElement('option');
                option.value = categories[i].id;
                option.text = categories[i].category;
                categoryDropdown.append(option);
            }
        })
    }
    async function post(endpoint, data) {

        console.log("Post request sent")

        let response = await fetch(`${url}${endpoint}`, {
            method: "POST",
            headers: { "Content-type": "application/json" },
            body: data
        }).then(response => response.json());

        return response;
    }

    $("#btnLogout").click(() => {

        Swal.fire({
            title: 'Logout',
            text: 'Are you sure?',
            showCancelButton: true,
            confirmButtonText: 'Logout'
        }).then(result => {
            if (result.isConfirmed) {
                sessionStorage.removeItem("session")
                location.href = "/"
            }
        })
    })



    async function getIdeasPaginated(page) {
        // let ideas = await fetch(`${url}/ideas/page=${page}`).then(response => response.json())

        let getIdeasByDepartmentPaginatedResponse = await fetch(`${url}/ideas?departmentId=${session.user.department.id}&page=${page}&categoryId=1`).then(response => response.json())

        pageCount = getIdeasByDepartmentPaginatedResponse.pageCount
        let ideas = getIdeasByDepartmentPaginatedResponse.ideas

        console.log(pageCount)

        return ideas
    }

    function displayPageFooter() {

        pagesDiv.innerHTML = ''

        let overlayDiv = document.createElement('div')
        overlayDiv.className = "pagination-hover-overlay"


        pagesDiv.append(overlayDiv)

        // < div class="pagination-hover-overlay" ></div >

        console.log(parseInt(currentPage) > 1)

        if (parseInt(currentPage) > 1) { // && currentPage <= pageCount
            showPrevArrow()
        }


        // pagesDiv.append(overlayDiv)

        for (let i = 0; i < pageCount; i++) {

            let aPageElement = document.createElement('a')
            aPageElement.className = "pagination-page-number"
            aPageElement.text = i + 1

            pagesDiv.append(aPageElement)
        }



        let pages = Array.from(document.querySelectorAll(".pagination-page-number"));

        pages.forEach(page => {

            if (parseInt(page.text) == currentPage) {
                page.className = "pagination-page-number-selected"
            }

            page.addEventListener("click", () => {
                let pageNumber = page.text
                currentPage = pageNumber
                displayIdeas(currentPage)
            })

        })

        if (currentPage !== pageCount) {
            showNextArrow()
        }

    }

    async function displayIdeas(page) {

        page = parseInt(page)

        if (page < 1 || page > pageCount) {
            console.log(page + " doesnt exist")
            page = 1
        }

        currentPage = page

        let ideas = await getIdeasPaginated(currentPage)

        let ideasContainer = document.getElementById("ideasContainer")


        let htmlString = ''

        console.log(ideas)

        for (let idea of ideas) {

            htmlString += `
            
                 <br>

             <div class="item">
                    <div class="media">
                        <img class="mr-3 img-fluid post-thumb d-none d-md-flex"
                            src="./other/assets/images/default-user-photo.png" alt="image">
                        <div class="media-body">
                            <h3 class="title mb-1"><a href="">${idea.title}</a></h3>
                            <div class="meta mb-1"><span class="date">Published by</span><span class="comment">${idea.authorName}</span></div>
                            <div class="intro">${idea.description}</div><br>
                            <li class="list-inline-item"><a href="#"> <i class="fas fa-file-download fa-lg"></i> </a>
                            </li>
                            <li class="list-inline-item"><a href="#"> <i class="fas fa-thumbs-up fa-lg"></i> </a> </li>
                            <span class="bio mb-3">0</span>

                            &nbsp;&nbsp;<li class="list-inline-item"><a href="#"> <i
                                        class="fas fa-thumbs-down fa-lg"></i> </a> </li><span class="bio mb-3">0</span>

                            &nbsp;&nbsp;<a class="more-link" href="">Read comments &rarr;</a>

                        </div>
                        <!--//media-body-->

                    </div>
                    <!--//media-->
                </div>
                
            <br><hr>
            
            `

            // if ((i + 1) != (ideas.length)) {
            //     htmlString += '<br><hr>'
            // }


        }


        ideasContainer.innerHTML = htmlString
        $(window).scrollTop(0)


        displayPageFooter()


    }


    const showPrevArrow = () => {

        let prevArrow = document.createElement('a')
        prevArrow.className = "pagination-prev"

        let span = document.createElement('span')
        span.className = "icon-pagination icon-pagination-prev"

        let icon = document.createElement('i')
        icon.className = "fas fa-arrow-left fa-lg"

        span.append(icon)

        prevArrow.append(span)

        pagesDiv.append(prevArrow)


        prevArrow.addEventListener("click", () => {
            displayIdeas(currentPage - 1)
        })
    }

    const showNextArrow = () => {
        let nextArrow = document.createElement('a')
        nextArrow.className = "pagination-next"

        let nextSpan = document.createElement('span')
        nextSpan.className = "icon-pagination icon-pagination-next"

        let nexticon = document.createElement('i')
        nexticon.className = "fas fa-arrow-right fa-lg"

        nextSpan.append(nexticon)

        nextArrow.append(nextSpan)

        pagesDiv.append(nextArrow)

        nextArrow.addEventListener("click", () => {
            displayIdeas(currentPage + 1)
        })
    }


    // const applyCSStoPages = () => {

    //     $(document).on('hover', '.pagination-page-number', () => {

    //     })

    // }
})

