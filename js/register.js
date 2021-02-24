





$(document).ready(function(){


let passwordField = document.querySelector("#password")
let confirmPasswordField = document.querySelector("#confirmPassword")
let registerationForm = document.getElementById("registerationForm")



registerationForm.addEventListener("submit", (e)=> {
    e.preventDefault()
    register()
})

async function register() {


    let password = passwordField.value
    let confirmPassword = confirmPasswordField.value

   
    if (confirmPassword !== password) {
        alert("Passwords do not match")
        confirmPasswordField.value = ""
        passwordField.value = ""
        return
    }



    var formDataArray = $("#registerationForm").serializeArray();

    let formDataObject = objectifyForm(formDataArray)

    delete formDataObject.confirmPassword
    
    console.log(formDataObject)


    let registerResponse = await post("/register", JSON.stringify(formDataObject))


    console.log("registerResponse.message: " + registerResponse.message)




    if (registerResponse.message == "registered") {
        console.log("registered")

        if (localStorage.getItem("successful registeration") !== null) {
            localStorage.removeItem("successful registeration")
        }
        
        localStorage.setItem("successful registeration", true)
        location.href="login.html"


    } else if (registerResponse.message == "user exists") {
        console.log("user exists")
        showAlert("warning", `User exists, <a href="login.html" class"alert-link" > Sign in</a >`, 10000)
        // alert.classList = "alert alert-warning alert-dismissible"
        // alert.innerHTML = `<a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>
        // <b>User exists, <a href="login.html" class"alert-link">Sign in</a><b>`
    } else {
        console.log("request failed")
    }

}

    function objectifyForm(formArray) {
        //serialize data function
        var returnArray = {};
        for (var i = 0; i < formArray.length; i++) {
            returnArray[formArray[i]['name']] = formArray[i]['value'];
        }
        return returnArray;
    }

async function post(endpoint, data) {

    console.log("Post request sent")

    let response = await fetch(`http://localhost:8080${endpoint}`, {
        method: "POST",
        headers:{"Content-type": "application/json"},
        body: data
    }).then(response => response.json());

    return response;
}




function showAlert(type, message, duration = 5000){
    let alert = document.createElement("div")
    alert.classList = `alert alert-${type} alert-dismissible fade show`
    alert.innerHTML = `<a href="#" class="close" data-dismiss="alert"></a>
        <b>${message}<b>`

    $("#mainPage").prepend(alert);
    setTimeout(() => {
        $(alert).fadeOut();
    }, duration);
}




    function validateForm() {
        var departmentDropdown = document.getElementById("department_dropdown");

        if (departmentDropdown.selectedIndex === 0) {
            alert("Please choose a department")
            return;
        }
        console.log("checkbox checked is ", form.agree.checked);
        if (!form.agree.checked) {
            document.getElementById('agree_chk_error').style.visibility = 'visible';
            return false;
        }
        else {
            document.getElementById('agree_chk_error').style.visibility = 'hidden';
            return true;
        }



})



