$(document).ready(function () {


    let user = JSON.parse(sessionStorage.getItem("user"))

    if (user !== null && user !== undefined){
            console.log(user)
        greetUser(user)
    }else{
        location.href = "/"
    }



    

    function greetUser(user) {
        $(document.body).append(`<h1>Welcome ${user.email}</h1>`)
    }

})