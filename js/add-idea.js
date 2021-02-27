$(document).ready(function () {

    let url = "https://theunibook.herokuapp.com"

    let session = JSON.parse(sessionStorage.getItem("session"))



    var title = document.getElementById("title")
    var description = document.getElementById("description")
    var file = document.getElementById("document")
    var categoryDropdown = document.getElementById("categoryDropdown")

    let addIdeaForm = document.getElementById("addIdeaForm")

    populateCategoryDropdown();


    addIdeaForm.addEventListener("submit", submitIdea)



    async function submitIdea(e) {
        e.preventDefault()


        // var addIdeaRequest = {
        //     userId: session.user.id,
        //     title: title.value,
        //     description: description.value,
        //     categoryId: categoryDropdown.value
        // }

        let formData = new FormData();

        formData.append("userId", session.user.id)
        formData.append("title", title.value)
        formData.append("description", description.value)
        formData.append("categoryId", categoryDropdown.value)

        if (file.value != "") {
            formData.append("document", file.files[0])
            console.log(file.files[0])
        }


        // Display the key/value pairs
        for (var pair of formData.entries()) {
            console.log(pair[0] + ', ' + pair[1]);
        }



        // var addIdeaResponse = await post("/ideas", JSON.stringify(addIdeaRequest))

        let addIdeaResponse = await fetch(`${url}/ideas`, {
            method: "post",
            body: formData

        }).then(response => response.json())

        if (addIdeaResponse.message === "added") {

            sessionStorage.setItem("IDEA_ADDED_MESSAGE", true)
            location.href = "home.html"

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


})