$(document).ready(function () {

    let url = "https://theunibook.herokuapp.com"

    let session = JSON.parse(sessionStorage.getItem("session"));

    // validateUserSession()
    populateCategoryDropdown()

    if (sessionStorage.getItem("IDEA_ADDED_MESSAGE") !== null) {
        toastr.success("Idea added!")

        sessionStorage.removeItem("IDEA_ADDED_MESSAGE")
    }

    displayIdeas()

    // function validateUserSession() {
    //     // let session = JSON.parse(sessionStorage.getItem("session"))
    //     session = JSON.parse(sessionStorage.getItem("session"))

    //     if (session !== null && session !== undefined) {
    setUserDetails()
    //     } else {
    //         location.href = "/"
    //     }
    // }

    function setUserDetails() {

        let user = session.user
        $("#fullname").html(`${user.firstname} ${user.lastname}`)
        if (user.role === null) {
            $("#role").html(`Staff`)
        } else {
            $("#role").html(`${user.role}`)
        }

        $("#department").html(`${session.department.name}`)
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



    async function getIdeas() {
        let ideas = await fetch(`${url}/ideas`).then(response => response.json())

        return ideas
    }

    async function displayIdeas() {

        let ideas = await getIdeas()

        let ideasContainer = document.getElementById("ideasContainer")


        let htmlString = ''


        for (let idea of ideas) {

            htmlString += `
            
                 <br>

             <div class="item">
                    <div class="media">
                        <img class="mr-3 img-fluid post-thumb d-none d-md-flex"
                            src="./other/assets/images/default-user-photo.png" alt="image">
                        <div class="media-body">
                            <h3 class="title mb-1"><a href="">${idea.title}</a></h3>
                            <div class="meta mb-1"><span class="date">Published by</span><span class="comment">${idea.userId}</span></div>
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


        // htmlString += '</div> <br>'

        ideasContainer.innerHTML = htmlString

    }


})