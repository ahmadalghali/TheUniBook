$(document).ready(function () {

    let url = "https://theunibook.herokuapp.com"
    // let url = "http://localhost:8080"


    let loginButton = document.getElementById("btnLogin")
    let emailField = document.getElementById("emailField")
    document.getElementById("passwordField")
    let loginForm = document.getElementById("loginForm")
    let btnSendEmail = document.getElementById("btnSendEmail")

    btnSendEmail.addEventListener("click", sendEmail)

    loginForm.addEventListener("submit", (e) => {
        e.preventDefault()

        login()
    })

    if (sessionStorage.getItem("successful registeration") !== null) {
        toastr.success("Registered successfully")

        sessionStorage.removeItem("successful registeration")
    }


    async function sendEmail() {
        let modalEmail = document.getElementById("modalEmailField").value
        console.log(modalEmail)
        if (modalEmail.trim() == "") {
            toastr.warning("Please fill in the email field")
            return;
        }

        let changePasswordResponse = await fetch(`${url}/forgottenPassword?email=${modalEmail}`, { method: "POST" }).then(response => response.json())
        if (changePasswordResponse.message == "email sent") {
            toastr.success("Email sent")
        }
        else {
            toastr.error("Incorrect email")
        }
    }

    async function login() {



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

        let loginResponse = await post("/login", JSON.stringify(formDataObject))

        console.log(loginResponse)
        if (loginResponse.message == "logged in") {

            sessionStorage.setItem("session", JSON.stringify(loginResponse))
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