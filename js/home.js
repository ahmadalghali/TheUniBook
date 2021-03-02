$(document).ready(function () {

    // let url = "http://localhost:8080"
    let url = "https://theunibook.herokuapp.com"


    let currentPage = 1;



    let pagesDiv = document.getElementById("pagesDiv")
    let categoryDropdown = document.getElementById("category_dropdown");


    let pageCount;

    let session = JSON.parse(sessionStorage.getItem("session"));

    if (sessionStorage.getItem("IDEA_ADDED_MESSAGE") !== null) {
        toastr.success("Idea added!")

        sessionStorage.removeItem("IDEA_ADDED_MESSAGE")
    }
    // validateUserSession()


    initHomePage()

    document.getElementById('category_dropdown').onchange = function () {
        displayIdeas(currentPage);
    }

    function initHomePage() {
        console.log
        setUserDetails()
        populateCategoryDropdown()
        displayIdeas(currentPage)
    }



    function setCurrentPage(page) {
        if (page < 1 || page > pageCount) {
            console.log(page + " doesnt exist");
            page = 1;
        }

        currentPage = page;
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
        categoryDropdown.append('<option value="0" selected="selected" >All ideas</option>');

        await fetch(`${url}/categories`).then(response => response.json()).then(categories => {

            console.log(categories)
            let option;

            for (let i = 0; i < categories.length; i++) {
                option = document.createElement('option');

                option.value = categories[i].id;
                option.text = categories[i].category;
                categoryDropdown.append(option);
            }
        })
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



    async function getIdeas(page, categoryId = null, sortBy = null) {
        let ideas;
        let getIdeasResponse;

        if (categoryId != null) {
            getIdeasResponse = await fetch(`${url}/ideas?departmentId=${session.user.department.id}&page=${page}&categoryId=${categoryId}`).then(response => response.json())
        } else {
            getIdeasResponse = await fetch(`${url}/ideas?departmentId=${session.user.department.id}&page=${page}`).then(response => response.json())
        }
        pageCount = getIdeasResponse.pageCount
        ideas = getIdeasResponse.ideas

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

        applyPaginationStyling()

    }


    function renderIdeasHTML(ideas) {
        let ideasContainer = document.getElementById("ideasContainer")


        let htmlString = ''

        if (ideas.length == 0) {
            htmlString = "<h1 style='color: grey; margin-left: 30%;'>No ideas, yet.</h6>"
        }
        console.log(ideas)

        for (let idea of ideas) {

            if (idea.documentPath != null) {

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
                            <li class="list-inline-item"><a href="${url}/ideas/downloadFile?documentPath=${idea.documentPath}" > <i class="fas fa-file-download fa-lg"></i> </a>
                            </li>
                            <li class="list-inline-item"><a href="#"> <i class="fas fa-thumbs-up fa-lg"></i> </a> </li>
                            <span class="bio mb-3">0</span>

                            &nbsp;&nbsp;<li class="list-inline-item"><a href="#"> <i
                                        class="fas fa-thumbs-down fa-lg"></i> </a> </li><span class="bio mb-3">0</span>

                            &nbsp;&nbsp;<a style="cursor: pointer;" class="more-link idea-read-comments-link" data-ideaid="${idea.id}">Read comments &rarr;</a>

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
                        <img class="mr-3 img-fluid post-thumb d-none d-md-flex"
                            src="./other/assets/images/default-user-photo.png" alt="image">
                        <div class="media-body">
                            <h3 class="title mb-1"><a href="">${idea.title}</a></h3>
                            <div class="meta mb-1"><span class="date">Published by</span><span class="comment">${idea.authorName}</span></div>
                            <div class="intro">${idea.description}</div><br>
                            <li class="list-inline-item"><a href="#"> <i class="fas fa-thumbs-up fa-lg"></i> </a> </li>
                            <span class="bio mb-3">0</span>

                            &nbsp;&nbsp;<li class="list-inline-item"><a href="#"> <i
                                        class="fas fa-thumbs-down fa-lg"></i> </a> </li><span class="bio mb-3">0</span>

                            &nbsp;&nbsp;<a style="cursor: pointer;" class="more-link idea-read-comments-link" data-ideaid="${idea.id}">Read comments &rarr;</a>

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

        displayPageFooter()



    }



    async function displayIdeas(page) {
        setCurrentPage(page)

        let ideas;

        let selectedCategory = categoryDropdown.options[categoryDropdown.selectedIndex].value;

        console.log("category id = " + selectedCategory)

        if (selectedCategory != 0) {
            ideas = await getIdeas(currentPage, selectedCategory)
        } else {
            ideas = await getIdeas(currentPage)
        }


        renderIdeasHTML(ideas)
    }



    function initReadCommentLinks() {
        let ideaReadCommentsLinks = Array.from(document.querySelectorAll(".idea-read-comments-link"));

        ideaReadCommentsLinks.forEach(readCommentsLink => {

            console.log("dataset for link " + readCommentsLink.dataset.ideaid)
            readCommentsLink.addEventListener("click", () => {

                sessionStorage.setItem("IDEA_ID_READ_COMMENTS", readCommentsLink.dataset.ideaid)
                location.href = "comments-2.html"

            })

        })
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






})














        // if (selectedCategory != "0") {
        //     // ideas = await sortIdeas(currentPage)

        //     ideas = await getIdeas(currentPage, selectedCategory)



        //     let htmlString = ''

        //     if (ideas.length == 0) {
        //         htmlString = "<h1 style='color: grey; margin-left: 30%;'>No ideas, yet.</h6>"
        //     }
        //     console.log(ideas)

        //     for (let idea of ideas) {

        //         htmlString += `

        //              <br>

        //          <div class="item idea">
        //                 <div class="media">
        //                     <img class="mr-3 img-fluid post-thumb d-none d-md-flex"
        //                         src="./other/assets/images/default-user-photo.png" alt="image">
        //                     <div class="media-body">
        //                         <h3 class="title mb-1"><a>${idea.title}</a></h3>
        //                         <div class="meta mb-1"><span class="date">Published by</span><span class="comment">${idea.authorName}</span></div>
        //                         <div class="intro">${idea.description}</div><br>
        //                         <li class="list-inline-item"><a href="#"> <i class="fas fa-file-download fa-lg"></i> </a>
        //                         </li>
        //                         <li class="list-inline-item"><a href="#"> <i class="fas fa-thumbs-up fa-lg"></i> </a> </li>
        //                         <span class="bio mb-3">0</span>

        //                         &nbsp;&nbsp;<li class="list-inline-item"><a href="#"> <i
        //                                     class="fas fa-thumbs-down fa-lg"></i> </a> </li><span class="bio mb-3">0</span>

        //                         &nbsp;&nbsp;<button class="more-link idea-read-comments-link" data-ideaId="${idea.id}">Read comments &rarr;</button>

        //                     </div>
        //                     <!--//media-body-->

        //                 </div>
        //                 <!--//media-->
        //             </div>

        //         <br><hr>

        //         `




        //     }

        //     initReadCommentLinks()


        //     ideasContainer.innerHTML = htmlString
        //     $(window).scrollTop(0)


        //     displayPageFooter()
        // } else {
        //     ideas = await getIdeasPaginated(currentPage)

        //     let ideasContainer = document.getElementById("ideasContainer")

        //     let htmlString = ''
        //     console.log(ideas)

        //     if (ideas.length == 0) {
        //         htmlString = "<h1 style='color: grey; margin-left: 30%;'>No ideas, yet.</h6>"

        //     }

        //     else {

        //         for (let idea of ideas) {
        //             console.log(idea)

        //             if (idea.documentPath != null) {

        //                 htmlString += `

        //          <br>

        //      <div class="item">
        //             <div class="media">
        //                 <img class="mr-3 img-fluid post-thumb d-none d-md-flex"
        //                     src="./other/assets/images/default-user-photo.png" alt="image">
        //                 <div class="media-body">
        //                     <h3 class="title mb-1"><a href="">${idea.title}</a></h3>
        //                     <div class="meta mb-1"><span class="date">Published by</span><span class="comment">${idea.authorName}</span></div>
        //                     <div class="intro">${idea.description}</div><br>
        //                     <li class="list-inline-item"><a href="${url}/ideas/downloadFile?documentPath=${idea.documentPath}" > <i class="fas fa-file-download fa-lg"></i> </a>
        //                     </li>
        //                     <li class="list-inline-item"><a href="#"> <i class="fas fa-thumbs-up fa-lg"></i> </a> </li>
        //                     <span class="bio mb-3">0</span>

        //                     &nbsp;&nbsp;<li class="list-inline-item"><a href="#"> <i
        //                                 class="fas fa-thumbs-down fa-lg"></i> </a> </li><span class="bio mb-3">0</span>

        //                     &nbsp;&nbsp;<a class="more-link" href="">Read comments &rarr;</a>

        //                 </div>
        //                 <!--//media-body-->

        //             </div>
        //             <!--//media-->
        //         </div>

        //     <br><hr>

        //     `
        //             } else {

        //                 htmlString += `

        //          <br>

        //      <div class="item">
        //             <div class="media">
        //                 <img class="mr-3 img-fluid post-thumb d-none d-md-flex"
        //                     src="./other/assets/images/default-user-photo.png" alt="image">
        //                 <div class="media-body">
        //                     <h3 class="title mb-1"><a href="">${idea.title}</a></h3>
        //                     <div class="meta mb-1"><span class="date">Published by</span><span class="comment">${idea.authorName}</span></div>
        //                     <div class="intro">${idea.description}</div><br>
        //                     <li class="list-inline-item"><a href="#"> <i class="fas fa-thumbs-up fa-lg"></i> </a> </li>
        //                     <span class="bio mb-3">0</span>

        //                     &nbsp;&nbsp;<li class="list-inline-item"><a href="#"> <i
        //                                 class="fas fa-thumbs-down fa-lg"></i> </a> </li><span class="bio mb-3">0</span>

        //                     &nbsp;&nbsp;<a class="more-link" href="">Read comments &rarr;</a>

        //                 </div>
        //                 <!--//media-body-->

        //             </div>
        //             <!--//media-->
        //         </div>

        //     <br><hr>

        //     `
        //             }

        //             ideasContainer.innerHTML = htmlString
        //             $(window).scrollTop(0)

        //             console.log(idea.documentPath)

        //             // if ((i + 1) != (ideas.length)) {
        //             //     htmlString += '<br><hr>'
        //             // }


        //         }

        //         ideasContainer.innerHTML = htmlString
        //         $(window).scrollTop(0)
        //         // displayPageFooter()
        //     }

        //     ideasContainer.innerHTML = htmlString
        //     // $(window).scrollTop(0)
        //     displayPageFooter()

        // }