$(document).ready(function () {

    let url = "https://theunibook.herokuapp.com"

    let loginButton = document.getElementById("btnLogin")
    let emailField = document.getElementById("emailField")
    let passwordField = document.getElementById("passwordField")
    let loginForm = document.getElementById("loginForm")

    
    loginForm.addEventListener("submit", (e) => {
        e.preventDefault()
        // let email = emailField.value
        // let password = passwordField.value

        login()
    })

    if (sessionStorage.getItem("successful registeration") !== null) {
        toastr.success("Registered successfully")

        sessionStorage.removeItem("successful registeration")
    }



    // loginButton.addEventListener("click", (e) => {
    //     e.preventDefault()

    //     let formData = new FormData(loginForm)

    //     for (let key of formData.keys()) {
    //         console.log(key, formData.get(key))
    //     }

    //     let email = emailField.value
    //     let password = passwordField.value


    //     login(email, password)
    // })


    async function login() {
        // if (isEmpty(email) || isEmpty(password)) {
        //     // alert("Please fill in Both email and password fields.")
        //     return;
        // }


        var formDataArray = $("#loginForm").serializeArray();
        let formDataObject = objectifyForm(formDataArray)
        console.log(formDataObject)

        // let credentials = {
        //     email: `${email}`,
        //     password: `${password}`
        // }

        // let errorMessage = document.createElement("p");
        // errorMessage.style.color = "red";
        // errorMessage.innerHTML = "";

        let loginResponse = await post("/login", JSON.stringify(formDataObject) )

        console.log(loginResponse)
        if (loginResponse.message == "logged in") {

            sessionStorage.setItem("user", JSON.stringify(loginResponse.user))
            location.href = "home.html"

        } else {
            console.log("bad credentials")
            toastr.error("Bad Credentials")
            // showAlert("danger", "Bad credentials")
        }

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


    function objectifyForm(formArray) {
        //serialize data function
        var returnArray = {};
        for (var i = 0; i < formArray.length; i++) {
            returnArray[formArray[i]['name']] = formArray[i]['value'];
        }
        return returnArray;
    }


})