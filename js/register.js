
$(document).ready(function () {

    
    let url = "https://theunibook.herokuapp.com"


    let passwordField = document.querySelector("#password_field")
    let confirmPasswordField = document.querySelector("#confirm_password_field")
    let registerForm = document.getElementById("registerForm")

    let departmentDropdown = $('#departmentDropdown')


    populateDepartmentDropdown();



    registerForm.addEventListener("submit", register)


    async function populateDepartmentDropdown(){
        departmentDropdown.empty();
        departmentDropdown.append('<option selected="true" disabled>Choose Department</option>');
        departmentDropdown.prop('selectedIndex', 0);


        fetch(`${url}/departments`).then(res => res.json()).then( departments => {
            let option;

            for (let i = 0; i < departments.length; i++) {
                option = document.createElement('option');
                option.value = departments[i].id;
                option.text = departments[i].name;
                departmentDropdown.append(option);
            }  
        })


    }

    async function register(e) {
        e.preventDefault()

        let password = passwordField.value
        let confirmPassword = confirmPasswordField.value


        if (confirmPassword !== password) {
            toastr.error("Passwords do not match")
            confirmPasswordField.value = ""
            passwordField.value = ""
            return
        }

        let formData = new FormData(registerForm)

        for (let key of formData.keys()){
            console.log(key, formData.get(key))
        }

        var formDataArray = $("#registerForm").serializeArray();

        let formDataObject = objectifyForm(formDataArray)

        delete formDataObject.confirmPassword

        // for (var pair of formDataArray.entries()) {
        //     console.log(pair[0] + ', ' + pair[1]);
        // }

        console.log(formDataArray)

        console.log(formDataObject)


        let registerResponse = await post("/register", JSON.stringify(formDataObject))


        console.log("registerResponse.message: " + registerResponse.message)




        if (registerResponse.message == "registered") {
            console.log("registered")

            if (sessionStorage.getItem("successful registeration") !== null) {
                sessionStorage.removeItem("successful registeration")
            }

            sessionStorage.setItem("successful registeration", true)
            location.href = "/"


        } else if (registerResponse.message == "user exists") {
            console.log("user exists")
            toastr.warning("user exists")
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
            headers: { "Content-type": "application/json" },
            body: data
        }).then(response => response.json());

        return response;
    }




    // function validateForm() {
    //     var departmentDropdown = document.getElementById("department_dropdown");

    //     if (departmentDropdown.selectedIndex === 0) {
    //         alert("Please choose a department")
    //         return;
    //     }
    //     console.log("checkbox checked is ", form.agree.checked);
    //     if (!form.agree.checked) {
    //         document.getElementById('agree_chk_error').style.visibility = 'visible';
    //         return false;
    //     }
    //     else {
    //         document.getElementById('agree_chk_error').style.visibility = 'hidden';
    //         return true;
    //     }



})



