$(document).ready(function () {



    let session = JSON.parse(sessionStorage.getItem("session"))
    setUserDetails()

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