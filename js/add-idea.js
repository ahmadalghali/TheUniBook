$(document).ready(function () {

    let url = "https://theunibook.herokuapp.com"

    validateUserSession()


    function validateUserSession() {
        let session = JSON.parse(sessionStorage.getItem("session"))

        if (session !== null && session !== undefined) {
            setUserDetails()
        } else {
            location.href = "/"
        }
    }



    var title = document.getElementById("title")
    var description = document.getElementById("description")
    var file = document.getElementById("document")
    var categoryDropdown = document.getElementById("categoryDropdown")
    var btnSubmit = document.getElementById("btnSubmit")

    let addIdeaForm = document.getElementById("addIdeaForm")

    populateCategoryDropdown();


    addIdeaForm.addEventListener("submit", submitIdea)



    async function submitIdea(e) {
        e.preventDefault()

        var addIdeaRequest = {
            userId: 115,
            title: title.value,
            description: description.value,
            categoryId: categoryDropdown.value, 
            documentPath: null
        }


        var addIdeaResponse = await post("/ideas", JSON.stringify(addIdeaRequest))

        if (addIdeaResponse.message === "added") {
            console.log(addIdeaResponse);
        }
        else {
            console.log(addIdeaResponse);
        }

    }

    async function populateCategoryDropdown() {
        var categoryDropdown = $("#categoryDropdown");
        categoryDropdown.empty();
        categoryDropdown.append('<option value="" >Choose Category</option>');

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