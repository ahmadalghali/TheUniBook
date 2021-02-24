function validateForm(form) {
    var password = document.getElementById("password_field").value;
    var confirmPassword = document.getElementById("confirm_password_field").value;
    var selectedOption = document.getElementById("default_option").selected;
    var selectedCategory = document.getElementById("default_category").selected;

    if (password != confirmPassword) {
        alert("Passwords are not matching!")
        return false;
    }
    if (selectedOption) {
        alert("You haven't selected a department!")
        return false;
    }
    if (selectedCategory) {
        alert("You haven't selected a category!")
        return false;
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



}