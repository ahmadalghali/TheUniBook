
$(document).ready(function () {

    let url = "https://theunibook.herokuapp.com"

    var addcatbutton = document.getElementById("add_category_button");

    var delcatbutton = document.getElementById("delete_category_button");

    var categorytitlefield = document.getElementById("category_title");

    var categorydropdown = document.getElementById("categoryDropdown");

    let session = JSON.parse(sessionStorage.getItem("session"));

    let deleteCategoryTab = document.getElementById("deleteCategoryTab")

    deleteCategoryTab.addEventListener("click", populateCategoryDropdown)


    addcatbutton.addEventListener("click", (e) => {
        e.preventDefault();

        let categoryName = categorytitlefield.value
        if (categoryName.trim() == "") {
            categorytitlefield.value = ""
            toastr.warning("PLease fill in the field")
            return
        }
        addCategory(categoryName)
    })

    delcatbutton.addEventListener("click", function (e) {
        e.preventDefault()
        let categoryId = categorydropdown.value
        if (categoryId != 0) {

            deleteCategory(categoryId);



        } else {
            toastr.warning("Please select a category")
        }

    })


    populateCategoryDropdown();



    async function deleteCategory(categoryId) {
        let user = session.user
        console.log(user)
        let deleteCategoryResponse = await fetch(`${url}/categories?categoryId=${categoryId}&userId=${user.id}`, { method: "DELETE" }).then(response => response.json())
        if (deleteCategoryResponse.message == "category deleted successfully") {
            toastr.success("Category deleted successfully")
        } else if (deleteCategoryResponse.message == "category cannot be deleted, ideas exist for this category") {
            toastr.warning("Category cannot be deleted, ideas exists for this category")
        } else if (deleteCategoryResponse.message == "user has no authorization for this action") {
            toastr.warning("You have no authorization for this action")
        } else {
            toastr.warning("We apologise something went wrong, please try again later")
        }
        populateCategoryDropdown()
    }

    // {
    //     "deleted-by": "Ahmad Alghali",
    //     "message": "category deleted successfully",
    //     "categoryId": 4
    // }

    async function addCategory(categoryName) {

        var category = await fetch(`${url}/categories?name=${categoryName}`, { method: "POST" }).then(response => response.json())
        categorytitlefield.value = ""
        console.log(category)
        if (category != null) {
            toastr.success(`Category ${category.category} added`)
        } else {
            toastr.error("Failed to add category")
        }

    }


    async function populateCategoryDropdown() {
        var categoryDropdown = $("#categoryDropdown");
        categoryDropdown.empty();
        categoryDropdown.append('<option value="0" >Choose Category</option>');

        await fetch(`${url}/categories`).then(response => response.json()).then(categories => {
            let option;

            for (let i = 0; i < categories.length; i++) {
                option = document.createElement('option');
                option.value = categories[i].id;
                option.text = categories[i].category;
                categoryDropdown.append(option);
            }
        })
    }




})


