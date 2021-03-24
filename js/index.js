$(document).ready(function () {

    let url = "https://theunibook.herokuapp.com"
    //let url = "http://localhost:8080"


    let loginForm = document.getElementById("loginForm")
    let btnSendEmail = document.getElementById("btnSendEmail")

    btnSendEmail.addEventListener("click", sendEmail)

    displayDataCollectionPopup();


    loginForm.addEventListener("submit", (e) => {
        e.preventDefault()

        login()
    })

    if (sessionStorage.getItem("successful registeration") !== null) {
        toastr.success("Registered successfully")

        sessionStorage.removeItem("successful registeration")
    }

    function displayDataCollectionPopup() {
        Swal.fire({
            toast: true,
            position: 'bottom-end',
            // title: "Data Collection",
            text: `By using our service you agree to our Data Collection Policy`,
            showConfirmButton: true,
            confirmButtonColor: '#ffa600',
            confirmButtonText: 'I Accept',
            background: "#e0e0e0",



        })
    }

    function getBrowserName() {
        var result = bowser.getParser(window.navigator.userAgent);

        let browserName = result.parsedResult.browser.name

        return browserName
    }

    function addBrowser() {
        fetch(`${url}/browser?browserName=${getBrowserName()}`, { method: "POST" })
    }

    async function sendEmail() {
        let modalEmailField = document.getElementById("modalEmailField")
        let email = modalEmailField.value

        if (email.trim() == "") {
            modalEmailField.value = "";
            return;
        }

        let changePasswordResponse = await fetch(`${url}/forgottenPassword?email=${email}`, { method: "POST" }).then(response => response.json())

        if (changePasswordResponse.message == "email sent") {
            $('#forgotPasswordModal').modal('hide');

            console.log(changePasswordResponse)
            toastr.success("Email sent")
            modalEmailField.value = "";
        }
        else {
            toastr.error("Incorrect email")
            modalEmailField.value = "";
        }
    }

    async function login() {


        var formDataArray = $("#loginForm").serializeArray();
        let formDataObject = objectifyForm(formDataArray)
        console.log(formDataObject)


        let loginResponse = await post("/login", JSON.stringify(formDataObject))

        console.log(loginResponse)
        if (loginResponse.message == "logged in") {
            addBrowser();
            sessionStorage.setItem("session", JSON.stringify(loginResponse))

            document.getElementById("email_field").value = "";
            location.href = "home.html"

        } else {
            toastr.error("Bad Credentials")
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