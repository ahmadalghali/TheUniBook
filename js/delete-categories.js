$(document).ready(function () {

    let url = "https://theunibook.herokuapp.com"
    
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
    
    })