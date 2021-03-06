$(document).ready(function () {

    let url = "https://theunibook.herokuapp.com"
    // let url = "http://localhost:8080"


    let ideaTitle = document.getElementById("ideaTitle")
    let ideaAuthor = document.getElementById("ideaAuthor")
    let ideaDescription = document.getElementById("ideaDescription")

    let commentsTextArea = document.getElementById("commentsTextArea")

    let btnPostComment = document.getElementById("btnPostComment")

    let commentCount = document.getElementById("commentCount")


    let ideaId = sessionStorage.getItem("IDEA_ID_READ_COMMENTS")

    btnPostComment.addEventListener("click", postComment)



    initPage()

    async function getIdea() {
        let idea = await fetch(`${url}/ideas/${ideaId}`).then(response => response.json())
        return idea
    }

    function initPage() {
        displayIdea()
        displayComments()
        incrementIdeaViews(ideaId)

    }

    async function postComment() {
        let commentMessage = commentsTextArea.value.trim()

        if (commentMessage.length > 500) {
            toastr.warning("Comment has exceeded character limit of 500.")
            return
        }
        if (commentMessage.length < 1) {

            return
        }

        let comment = {
            description: commentMessage,
            ideaId: ideaId,
            authorId: session.user.id
        }

        let postCommentResponse = await post(`/comments`, JSON.stringify(comment))

        if (postCommentResponse.message == "comment saved") {
            displayComments()
            toastr.info("Thanks for commenting")
            commentsTextArea.value = ''

            post(`/comments/email`, JSON.stringify(comment))

        } else {
            toastr.error("We apologise, Something went wrong, comment could not be posted.")
        }
        commentsTextArea.value = ''

    }

    async function incrementIdeaViews(ideaId) {
        await fetch(`${url}/ideas/${ideaId}/incrementViews`, { method: "PUT" })
    }
    async function displayComments() {
        let comments = await fetch(`${url}/comments?ideaId=${ideaId}`).then(response => response.json())

        renderCommentsHTML(comments)


    }



    function renderCommentsHTML(comments) {
        let commentsContainer = document.getElementById("commentsContainer")


        let htmlString = ''

        if (comments.length == 0) {
            htmlString = "<h3 style='color: grey; margin-left: 30%;'>Be the first to comment!</h3>"
        }

        for (let comment of comments) {

            htmlString += `
                <div class="item comment">
                    <div class="media">


                        <div class="media-body">
                            <div class="meta mb-1"><span class="comment"><b>${comment.authorName}</b></span></div>
                            <br>
                            <div class="intro"><b>${comment.description}</b></div>
                        </div>

                    </div>
                </div>
            <br>
                <hr><br>
            `
        }

        commentsContainer.innerHTML = htmlString
        commentCount.innerText = comments.length
    }


    async function displayIdea() {
        let idea = await getIdea()
        ideaTitle.innerHTML = idea.title
        ideaAuthor.innerHTML = idea.authorName
        ideaDescription.innerHTML = idea.description
    }



    async function post(endpoint, data) {

        let response = await fetch(`${url}${endpoint}`, {
            method: "POST",
            headers: { "Content-type": "application/json" },
            body: data
        }).then(response => response.json());

        return response;
    }

})