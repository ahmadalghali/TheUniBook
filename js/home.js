$(document).ready(function () {



    let user = JSON.parse(sessionStorage.getItem("user"))
    setUserDetails()

    function setUserDetails() {

        if (user !== null && user !== undefined) {
            console.log(user)
            $("#fullname").html(`${user.firstname} ${user.lastname}`)
            if (user.role === null) {
                $("#role").html(`Staff`)
            } else {
                $("#role").html(`${user.role}`)
            }

            $("#department").html(`${user.departmentId}`)



        } else {
            location.href = "/"
        }
    }


    $("#btnLogout").click(() => {

        Swal.fire({
            title: 'Logout',
            text: 'Are you sure?',
            icon: 'error',
            showCancelButton: true,
            confirmButtonText: 'Logout'
        }).then(result => {
            if (result.isConfirmed) {
                sessionStorage.removeItem("user")
                location.href = "/"
            }
        })
    })

})