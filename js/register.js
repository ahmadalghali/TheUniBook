
$(document).ready(function () {

    
    let url = "https://theunibook.herokuapp.com"


    let passwordField = document.querySelector("#password_field")
    let confirmPasswordField = document.querySelector("#confirm_password_field")
    let registerForm = document.getElementById("registerForm")

    let departmentDropdown = $('#departmentDropdown')


    populateDepartmentDropdown();



    registerForm.addEventListener("submit", register())


    async function populateDepartmentDropdown(){
        departmentDropdown.empty();
        departmentDropdown.append('<option selected="selected" disabled>Choose Department</option>');
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


        if (departmentDropdown[0].selectedIndex === 0) {
            toastr.error("Please choose a department")
            return;
        }
        
        console.log("departmentDropdown.selectedIndex " + departmentDropdown.selectedIndex)

        let formData = new FormData(registerForm)

        formData.append("departmentId", departmentDropdown[0].selectedIndex)

        for (let key of formData.keys()){
            console.log(key, formData.get(key))
        }

        var formDataArray = $("#registerForm").serializeArray();

        let formDataObject = objectifyForm(formDataArray)

        delete formDataObject.confirmPassword

        let registerResponse = await post("/register", JSON.stringify(formDataObject))

        console.log("registerResponse.message: " + registerResponse.message)

        if (registerResponse.message == "registered") {

            if (sessionStorage.getItem("successful registeration") !== null) {
                sessionStorage.removeItem("successful registeration")
            }

            sessionStorage.setItem("successful registeration", true)
            location.href = "/"


        } else if (registerResponse.message == "user exists") {
            console.log("user exists")
            toastr.warning("user exists")
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

        let response = await fetch(`${url}${endpoint}`, {
            method: "POST",
            headers: { "Content-type": "application/json" },
            body: data
        }).then(response => response.json());

        return response;
    }

    
})



