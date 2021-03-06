const app = Vue.createApp({
    data() {
        return {
            title: "hi",
            authorName: "Max",
            description: "lorem"
        }
    },
    methods: {
        async postComment() {
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

        },

        displayComments() {

        },

        async getIdea() {
            let idea = await fetch(`${url}/ideas/${ideaId}`).then(response => response.json())
            return idea
        },

        async post(endpoint, data) {

            let response = await fetch(`${url}${endpoint}`, {
                method: "POST",
                headers: { "Content-type": "application/json" },
                body: data
            }).then(response => response.json());

            return response;
        }
    }
})


app.mount('#app')