$(document).ready(function () {

    let url = "https://theunibook.herokuapp.com"

    let session = JSON.parse(sessionStorage.getItem("session"))
    setUserDetails()
    populateCategoryDropdown()

    function setUserDetails() {

        if (session !== null && session !== undefined) {
            console.log(session)
            let user = session.user
            $("#fullname").html(`${user.firstname} ${user.lastname}`)
            if (user.role === null) {
                $("#role").html(`Staff`)
            } else {
                $("#role").html(`${user.role}`)
            }

            $("#department").html(`${session.department.name}`)



        } else {
            location.href = "/"
        }
    }

    async function populateCategoryDropdown(){
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

})