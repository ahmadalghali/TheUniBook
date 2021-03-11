$(document).ready(function () {
    
    //let url = "https://theunibook.herokuapp.com"
    let url = "http://localhost:8080"

    let changePasswordForm = document.getElementById("changePasswordForm")
    let session = JSON.parse(sessionStorage.getItem("session"));
    changePasswordForm.addEventListener("submit", changePassword)

    async function changePassword(e){
        e.preventDefault();

        let oldPassword = document.getElementById("old_password")
        let newPassword = document.getElementById("new_password")
        let confirmPassword = document.getElementById("confirm_password")
        let changePasswordResponse = await fetch(`${url}/changePassword?oldPassword=${oldPassword.value}&newPassword=${newPassword.value}&confirmPassword=${confirmPassword.value}&userId=${session.user.id}`, { method: "POST" }).then(response => response.json())
        
        if(newPassword.value != confirmPassword.value){
            toastr.error("Passwords do not match")
        }
        else if(changePasswordResponse.message == "New password cannot be the same as old password"){
            toastr.error(changePasswordResponse.message)
        }

        else if(changePasswordResponse.message == "Password not changed")
        {
            toastr.error("Incorrect old password")
        }
        else{
                
            toastr.success("Password changed successfully")
        }
    }

})