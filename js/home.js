$(document).ready(function () {

    let user = JSON.parse(localStorage.getItem("user"))


    console.log(user)
    greetUser(user)


    

    function greetUser(user) {
        $(document.body).append(`<h1>Welcome ${user.firstname}</h1>`)
    }

})