$(document).ready(function () {

    let loginButton = document.getElementById("btnLogin")
    let emailField = document.getElementById("emailField")
    let passwordField = document.getElementById("passwordField")


    if (localStorage.getItem("successful registeration") !== null) {
        showAlert("success"," Registered successfully")

        localStorage.removeItem("successful registeration")
    }

    loginButton.addEventListener("click", (e) => {
        e.preventDefault()

        let email = emailField.value
        let password = passwordField.value


        login(email, password)




    })


    async function login(email, password) {
        // if (isEmpty(email) || isEmpty(password)) {
        //     alert("Please fill in Both email and password fields.")
        //     return;
        // }

        let credentials = {
            email: `${email}`,
            password: `${password}`
        }

        // let errorMessage = document.createElement("p");
        // errorMessage.style.color = "red";
        // errorMessage.innerHTML = "";

        let loginResponse = await fetch("http://localhost:8080/login", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials)
        }).then(response => response.json());

        if (loginResponse.message == "logged in") {

            console.log("logged in")
            localStorage.setItem("user", JSON.stringify(loginResponse.user))
            location.href = "home.html"

        } else {
            console.log("bad credentials")
            showAlert("danger", "Bad credentials")
        }

    }


    function showAlert(type, message, duration = 5000) {
        let alert = document.createElement("div")
        alert.classList = `alert alert-${type} alert-dismissible fade show`
        alert.innerHTML = `<a href="#" class="close" data-dismiss="alert"></a>
        <b>${message}<b>`

        $(document.body).prepend(alert);
        setTimeout(() => {
            $(alert).fadeOut();
        }, duration);
    }

})