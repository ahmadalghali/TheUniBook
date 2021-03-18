$(document).ready(function () {

    let url = "http://localhost:8080"
    // let url = "https://theunibook.herokuapp.com"


    const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
    })

    let currentPage = 1;
    let pagesDiv = document.getElementById("pagesDiv")
    let categoryDropdown = document.getElementById("category_dropdown");
    let filterDropdown = document.getElementById("filter_dropdown");
    let closureDateButton = document.getElementById('closureDateButton');
    let pageCount;

    let session = JSON.parse(sessionStorage.getItem("session"));

    if (sessionStorage.getItem("IDEA_ADDED_MESSAGE") !== null) {
        toastr.success("Idea added!")

        sessionStorage.removeItem("IDEA_ADDED_MESSAGE")
    }

    initHomePage()

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

    // document.getElementById("addIdeaView").addEventListener("click", addIdeaView)

    // document.getElementById("addPasswordChangeView").addEventListener("click", addPasswordChangeView)

    // closureDateButton.addEventListener("click", setClosureDate)
    closureDateButton.addEventListener("click", setClosureDate)


    document.getElementById('category_dropdown').onchange = function () {
        displayIdeas(currentPage);
    }

    document.getElementById('filter_dropdown').onchange = function () {
        displayIdeas(currentPage);
    }

    function setClosureDate() {

        console.log("clicked")

        let closureDate = document.getElementById('closureDatePicker').value

        if (closureDate == "") {
            return;
        }
        Swal.fire({
            title: 'Closure Date',
            text: `Set Closure Date to '${closureDate}' ?`,


            showConfirmButton: true,
            confirmButtonText: 'Confirm',
            showCancelButton: true,
            customClass: {
                confirmButton: 'order-2',
                cancelButton: 'order-1 right-gap',
            }
        }).then(async result => {
            if (result.isConfirmed) {

                let response = await fetch(`${url}/ideas/setClosureDate?email=${session.user.email}&password=${session.user.password}&closureDate=${closureDate}`, { method: "POST" })
                    .then(res => res.text())

                if (response == "Successfully Saved") {
                    setDateStuff().then(() => {
                        Toast.fire({
                            icon: 'success',
                            title: 'Successfully Set Closure Date'
                        })
                    })


                } else if (response == "unauthorised access") {
                    Toast.fire({
                        icon: 'error',
                        title: 'You don\'t have access for this action'
                    })
                } else if (response == "date is before closure date") {
                    Toast.fire({
                        icon: 'warning',
                        title: 'Invalid Date'
                    })
                }
                console.log(response)
            }
        })
    }

    function initHomePage() {
        setDateStuff()
        setUserDetails()
        populateCategoryDropdown()
        displayIdeas(currentPage)
    }

    async function setDateStuff() {
        closureDatePicker.min = new Date().toISOString().split("T")[0];
        closureDatePicker.value = new Date(await getClosureDate()).toISOString().split("T")[0];
        let currentClosureDateField = document.getElementById("currentClosureDate")


        let currentClosureDate = await getClosureDate()

        let formattedDate = new Date(currentClosureDate)


        currentClosureDateField.innerText = formattedDate.getDate() + "/"
            + (formattedDate.getMonth() + 1) + "/"
            + formattedDate.getFullYear()


    }

    function emailInactiveStaff() {
        fetch(`${url}/encourageStaff?departmentId=${session.user.department.id}`, { method: "post" })
        console.log("emails sent")
        toastr.success("Email sent successfully")
    }

    function setCurrentPage(page) {
        if (page < 1 || page > pageCount) {
            console.log(page + " doesnt exist");
            page = 1;
        }

        currentPage = page;
    }

    async function setUserDetails() {

        let user = session.user
        let privilegesList = document.getElementById("privilegesList")

        if (!user.enabled || user.hidden) {
            document.getElementById("addIdeaDiv").innerHTML = `<p>You're currently suspended</p>`
        }

        if (user.role == "MANAGER") {
            // let modifyCategoriesPage = document.createElement("a")
            // modifyCategoriesPage.href = `modify-category.html`
            // modifyCategoriesPage.text = "Modify Categories"
            // modifyCategoriesPage.style = "color: white;"


            // privilegesList.append(modifyCategoriesPage) 

            // privilegesList.innerHTML += `<a href="modify-category.html" style="color: white;"><b>Modify Categories</b></a>`

            privilegesList.innerHTML += `

            <li class="list-inline-item"><a  href="${url}/ideas/downloadAllIdeas" > <i class="fas fa-file-download fa-lg"></i></a>
                            </li>
                            <span class="bio mb-3"><b>Download All Ideas</b></span>
                            <br><br>

                            <li class="list-inline-item"><a  href="${url}/ideas/downloadAllDocuments" > <i class="fas fa-file-download fa-lg"></i></a>
                            </li>
                            <span class="bio mb-3"><b>Download All Documents</b></span>
                            <br><br>


            <li class="list-inline-item"><a href="modify-category.html" id="addCategoryView"> <i
                                        class="fas fa-pen-square fa-lg"></i></a>
                            </li>
                            <span class="bio mb-3"><b>Modify Categories</b></span>
                            <br><br>


                            <li class="list-inline-item"><a href="new_statistics.html" id="addStatisticsView"> <i
                                        class="fas fa-chart-bar fa-lg"></i></a>
                            </li>
                            <span class="bio mb-3"><b>View Statistics</b></span>
                            <br><br>

                             <li class="list-inline-item"><a href="manage-users-2.html" id="addManageUsersView"> <i
                                        class="fas fa-users fa-lg"></i></a>
                            </li>
                            <span class="bio mb-3"><b>Manage Users</b></span>
                            <br><br>

            `
            document.getElementById("addCategoryView").addEventListener("click", addCategoryView)
            document.getElementById("addStatisticsView").addEventListener("click", addStatisticsView)
            document.getElementById("addManageUsersView").addEventListener("click", addManageUsersView)


        }
        if (user.role == "COORDINATOR") {

            privilegesList.innerHTML += `

            <li class="list-inline-item"><a  title="Send an email to all staff with little to no engagement"  id="btnEmailStaff"> <i  style="color: #4e93e0; cursor: pointer;" class="fas fa-envelope fa-lg"></i></a>
                            </li>
                            <span class="bio mb-3"><b>Email inactive staff: <span id="inactiveStaffCount">61</span> &nbsp;</b><i style="color: white;" class="fas fa-user fa-lg"></i></span>
                            <br>

            `

            getInactiveStaffCount()

            document.getElementById("btnEmailStaff").addEventListener("click", emailInactiveStaff)


        }

        if (user.role == "ADMINISTRATOR") {

            //    <li class="list-inline-item"><a href="set-closure-date.html"> <i class="fas fa-eye-slash fa-lg"></i></a>
            //                             </li>
            //                             <span class="bio mb-3"><b>Set Closure Date</b></span>
            //                             <br><br></br>

            privilegesList.innerHTML += `
            <li class="list-inline-item"><a href="anonymous-ideas.html"> <i class="fas fa-eye-slash fa-lg"></i></a>
                            </li>
                            <span class="bio mb-3"><b>Anonymous Ideas</b></span>
                            <br><br>

                         

            <li class="list-inline-item"><a href="monitor-system.html"> <i class="fas fa-info-circle fa-lg"></i></a>
                            </li>
                            <span class="bio mb-3"><b>Additional information</b></span>
                            <br>

            `

            document.getElementById("closureDateDiv").hidden = false
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

    async function getInactiveStaffCount() {

        let inactiveStaffCount = 0
        inactiveStaffCount = await fetch(`${url}/inactiveStaffCount?departmentId=${session.user.department.id}`).then(res => res.json())

        document.getElementById("inactiveStaffCount").innerHTML = inactiveStaffCount

    }

    async function getClosureDate() {
        let closureDate = await fetch(`${url}//ideas/closureDate`).then(res => res.text())
        return closureDate
    }

    async function getRandomPhoto() {
        const { results } = await fetch('https://randomuser.me/api/?gender=male').then(res => res.json())
        let randomPhoto = results[0].picture.large
        return randomPhoto
    }

    async function populateCategoryDropdown() {
        var categoryDropdown = $("#category_dropdown");
        categoryDropdown.empty();
        categoryDropdown.append('<option value="any" selected="selected" >All ideas</option>');

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

    async function getIdeas(page, categoryId, sortBy) {
        let ideas;
        let getIdeasResponse;

        getIdeasResponse = await fetch(`${url}/ideas?departmentId=${session.user.department.id}&page=${page}&loggedInUser=${session.user.id}&categoryId=${categoryId}&sortBy=${sortBy}`).then(response => response.json())

        pageCount = getIdeasResponse.pageCount
        ideas = getIdeasResponse.ideas

        return getIdeasResponse

    }

    function displayPageFooter() {

        pagesDiv.innerHTML = ''

        let overlayDiv = document.createElement('div')
        overlayDiv.className = "pagination-hover-overlay"


        pagesDiv.append(overlayDiv)

        // < div class="pagination-hover-overlay" ></div >

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

        applyPaginationStyling()

    }

    async function renderIdeasHTML(getIdeasResponse) {

        console.log(getIdeasResponse)
        let ideasContainer = document.getElementById("ideasContainer")

        let ideas = getIdeasResponse.ideas
        let userLikedIdeasList = getIdeasResponse.likedIdeasByUser
        let userDislikedIdeasList = getIdeasResponse.dislikedIdeasByUser
        let reportedIdeasByUser = getIdeasResponse.reportedIdeasByUser

        let htmlString = ''

        if (ideas.length == 0) {
            htmlString = "<h1 style='color: grey; margin-left: 30%;'>No ideas, yet.</h6>"
        }

        for (let idea of ideas) {

            let thumbsUpColor = "grey"
            let thumbsDownColor = "grey"
            let flagColor = "grey"

            if (userLikedIdeasList.includes(idea.id)) {
                thumbsUpColor = "green"
            }

            if (userDislikedIdeasList.includes(idea.id)) {
                thumbsDownColor = "red"
            }

            if (reportedIdeasByUser.includes(idea.id)) {
                flagColor = "#ba1818"
            }

            let since = moment(idea.date).fromNow()


            // const { results } = await fetch('https://randomuser.me/api/?gender=male').then(res => res.json())
            let randomPhoto = await getRandomPhoto()
            // console.log(results)

            if (idea.documentPath != null) {

                htmlString += `
            
                 <br>

             <div class="item">
                    <div class="media">
                        <img class="mr-3 img-fluid post-thumb d-none d-md-flex"
                            src="${idea.authorPhoto}" alt="" onerror="this.onerror=null; this.src='./other/assets/images/default-user-photo.png'">
                        <div class="media-body">
                            <h3 class="title mb-1">${idea.title}</h3>
                            <div class="meta mb-1"><span class="date">Published by</span><span class="comment">${idea.authorName}</span><span class="date">${idea.views} views</span></span><span class="date">${since}</span></div>
                            <div class="intro" align="justify">${idea.description}</div><br>
                            <li class="list-inline-item"><a href="${url}/ideas/downloadFile?documentPath=${idea.documentPath}" > <i class="fas fa-file-download fa-lg"></i> </a>
                            </li>
                            <li class="list-inline-item"><a style="cursor: pointer; color: ${thumbsUpColor};" class="thumbs-up" data-ideaid="${idea.id}"> <i class="fas fa-thumbs-up fa-lg"></i> </a> </li>
                            <span class="bio mb-3">${idea.likes}</span>

                            &nbsp;&nbsp;<li class="list-inline-item"><a style="cursor: pointer;color: ${thumbsDownColor};" class="thumbs-down" data-ideaid="${idea.id}"> <i
                                        class="fas fa-thumbs-down fa-lg"></i> </a> </li><span class="bio mb-3">${idea.dislikes}</span>

                            &nbsp;&nbsp;<li class="list-inline-item"><a style="cursor: pointer; color: ${flagColor};" class="report-flag" data-ideaid="${idea.id}"> <i
                                        class="fas fa-flag fa-lg"></i> </a> </li>

                            &nbsp;&nbsp;<a style="cursor: pointer; color: grey;" class="more-link idea-read-comments-link" data-ideaid="${idea.id}">Read comments &nbsp; <i class="fas fa-comment" ></i> ${idea.commentCount}</a>

                        </div>
                        <!--//media-body-->

                    </div>
                    <!--//media-->
                </div>
                
            <br><hr>
            
            `
            } else {

                htmlString += `
            
                 <br>

             <div class="item">
                    <div class="media">
                        <img style="border-radius: 50%;" class="mr-3 img-fluid post-thumb d-none d-md-flex"
                            src="${idea.authorPhoto}" alt="" onerror="this.onerror=null; this.src='./other/assets/images/default-user-photo.png'">
                        <div class="media-body">
                            <h3 class="title mb-1">${idea.title}</h3>
                            <div class="meta mb-1"><span class="date">Published by</span><span class="comment">${idea.authorName}</span><span class="date">${idea.views} views</span></span><span class="date">${since}</span></span></div>
                            <div class="intro" align="justify">${idea.description}</div><br>
                            <li class="list-inline-item"><a style="cursor: pointer; color: ${thumbsUpColor};" class="thumbs-up" data-ideaid="${idea.id}"> <i class="fas fa-thumbs-up fa-lg thumbs-up"></i> </a> </li>
                            <span class="bio mb-3" >${idea.likes}</span>

                            &nbsp;&nbsp;<li class="list-inline-item"><a style="cursor: pointer; color: ${thumbsDownColor};" class="thumbs-down" data-ideaid="${idea.id}"> <i
                                        class="fas fa-thumbs-down fa-lg"></i> </a> </li><span class="bio mb-3">${idea.dislikes}</span>

                            &nbsp;&nbsp;<li class="list-inline-item"><a style="cursor: pointer; color: ${flagColor};" class="report-flag" data-ideaid="${idea.id}"> <i
                                        class="fas fa-flag fa-lg"></i> </a> </li>

                            &nbsp;&nbsp;<a style="cursor: pointer; color: grey;" class="more-link idea-read-comments-link" data-ideaid="${idea.id}">Read comments &nbsp; <i class="fas fa-comment" ></i> ${idea.commentCount}</a>

                        </div>
                        <!--//media-body-->

                    </div>
                    <!--//media-->
                </div>
                
            <br><hr>
            
            `
            }


        }

        ideasContainer.innerHTML = htmlString
        $(window).scrollTop(0)

        initReadCommentLinks()
        addEventListenersToVote()
        displayPageFooter()



    }

    async function displayIdeas(page) {
        setCurrentPage(page)

        let ideas;

        let selectedCategory = categoryDropdown.options[categoryDropdown.selectedIndex].value;
        let selectedFilter = filterDropdown.options[filterDropdown.selectedIndex].value;

        // if (selectedCategory != 0) {
        // } 
        ideas = await getIdeas(currentPage, selectedCategory, selectedFilter)

        // if(selectedFilter == ){
        //     ideas = await getIdeas(currentPage, selectedFilter)
        // }
        // else {
        //     ideas = await getIdeas(currentPage)
        // }
        // console.log(ideas)

        renderIdeasHTML(ideas)
    }

    async function Like(ideaId) {
        await fetch(`${url}/ideas/like?ideaId=${ideaId}&userId=${session.user.id}`, { method: "POST" }).then(response => response.json())
        displayIdeas(currentPage)
    }
    async function Dislike(ideaId) {
        await fetch(`${url}/ideas/dislike?ideaId=${ideaId}&userId=${session.user.id}`, { method: "POST" }).then(response => response.json())
        displayIdeas(currentPage)
    }
    async function reportIdea(ideaId, reason) {

        let response = await fetch(`${url}/reportIdea?ideaId=${ideaId}&userId=${session.user.id}&reportId=${reason}`, { method: "POST" }).then(response => response.json())

        if (response.message == "idea has been reported") {
            Toast.fire({
                icon: 'info',
                title: 'Thank you for reporting the idea'
            })
        }
        if (response.message == "Idea report has been updated") {
            Toast.fire({
                icon: 'info',
                title: 'Idea report has been changed'
            })
        }
        if (response.message == "Report has been removed") {
            Toast.fire({
                icon: 'info',
                title: 'Report has been removed'
            })
        }

        displayIdeas(currentPage)
    }

    async function addEventListenersToVote() {
        let thumbsUpButtons = Array.from(document.querySelectorAll(".thumbs-up"));
        let thumbsDownButtons = Array.from(document.querySelectorAll(".thumbs-down"));
        let flagButtons = Array.from(document.querySelectorAll(".report-flag"));

        thumbsUpButtons.forEach(thumbsUpButton => {

            thumbsUpButton.addEventListener("click", () => {
                let ideaId = thumbsUpButton.dataset.ideaid;
                Like(ideaId);
                thumbsUpButton.style.color = "green"
            })

        })

        thumbsDownButtons.forEach(thumbsDownButton => {

            thumbsDownButton.addEventListener("click", () => {
                let ideaId = thumbsDownButton.dataset.ideaid;
                Dislike(ideaId);
            })

        })

        flagButtons.forEach(flagButton => {

            flagButton.addEventListener("click", () => {
                let ideaId = flagButton.dataset.ideaid;

                displayReportPopup(ideaId)
            })

        })

    }

    async function displayReportPopup(ideaId) {
        let options = {
            '1': 'Spam',
            '2': 'Harassment',
            '3': 'Swearing',
            '4': 'Explicit content',
            '5': 'Remove report',
        }

        const { value: reason } = await Swal.fire({
            title: 'Select a reason',
            input: 'radio',
            inputOptions: options,
            inputValidator: (value) => {
                if (!value) {
                    return 'You need to choose something!'
                }
            }
        })


        if (reason) {
            reportIdea(ideaId, reason)
        }
    }

    function initReadCommentLinks() {
        let ideaReadCommentsLinks = Array.from(document.querySelectorAll(".idea-read-comments-link"));

        ideaReadCommentsLinks.forEach(readCommentsLink => {

            readCommentsLink.addEventListener("click", () => {

                sessionStorage.setItem("IDEA_ID_READ_COMMENTS", readCommentsLink.dataset.ideaid)
                addCommentsView();
                location.href = "comments.html"


            })

        })
    }

    function showPrevArrow() {

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

    function showNextArrow() {
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

    async function post(endpoint, data) {

        console.log("Post request sent")

        let response = await fetch(`${url}${endpoint}`, {
            method: "POST",
            headers: { "Content-type": "application/json" },
            body: data
        }).then(response => response.json());

        return response;
    }

    function applyPaginationStyling() {

        let paginationLeftPos = "20px";
        let paginationOpacity = 0;
        let checkPaginationClick = 0;

        $(".pagination-page-number").click(function () {
            $(".pagination-page-number").removeClass("active");
            $(this).addClass("active");
            paginationLeftPos = $(this).prop("offsetLeft") + "px";
            paginationOpacity = 1;
            checkPaginationClick = 1;

            $(".pagination-hover-overlay").css({
                left: paginationLeftPos,
                backgroundColor: "#00178a",
                opacity: paginationOpacity
            });

            $(this).css({
                color: "#fff"
            });

        });

        $(".pagination-page-number").hover(
            function () {
                paginationOpacity = 1;
                $(".pagination-hover-overlay").css({
                    backgroundColor: "#4e93e0",
                    left: $(this).prop("offsetLeft") + "px",
                    opacity: paginationOpacity
                });


                $(".pagination-page-number.active").css({
                    color: "#333d45"
                });


                $(this).css({
                    color: "#fff"
                });

            },
            function () {
                if (checkPaginationClick) {
                    paginationOpacity = 1;
                } else {
                    paginationOpacity = 0;
                }

                $(".pagination-hover-overlay").css({
                    backgroundColor: "#2c3dc3",
                    opacity: paginationOpacity,
                    left: paginationLeftPos
                });


                $(this).css({
                    color: "#333d45"
                });


                $(".pagination-page-number.active").css({
                    color: "#fff"
                });

            });
    }

    async function addIdeaView() {
        await fetch(`${url}/addPageView?pageId=4`, { method: "post" })
    }
    async function testBrowser() {
        let response = await fetch(`${url}/checkBrowser`).then(res => res.json())
        console.log(response)
    }
    async function addPasswordChangeView() {
        await fetch(`${url}/addPageView?pageId=6`, { method: "post" })
    }
    async function addCategoryView() {
        await fetch(`${url}/addPageView?pageId=8`, { method: "post" })
    }
    async function addStatisticsView() {
        await fetch(`${url}/addPageView?pageId=9`, { method: "post" })
    }
    async function addManageUsersView() {
        await fetch(`${url}/addPageView?pageId=7`, { method: "post" })
    }
    async function addCommentsView() {
        await fetch(`${url}/addPageView?pageId=5`, { method: "post" })
    }

})
