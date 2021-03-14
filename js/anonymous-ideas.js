$(document).ready(function () {

    // let url = "http://localhost:8080"
    let url = "https://theunibook.herokuapp.com"

    let session = JSON.parse(sessionStorage.getItem("session"))

    const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 5000,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
    })

    displayIdeas()



    async function displayIdeas() {
        let response = await getIdeas()

        if (response.authorized) {
            renderIdeasHTML(response)
        } else {
            Toast.fire({
                icon: 'error',
                title: 'You are unauthorized for this access'
            })
        }
    }


    async function getIdeas() {
        let getIdeasResponse = await fetch(`${url}/ideas/anonymous?email=${session.user.email}&password=${session.user.password}`).then(response => response.json())

        return getIdeasResponse

    }





    async function renderIdeasHTML(getIdeasResponse) {

        let anonymousIdeasContainer = document.getElementById("anonymousIdeasContainer")

        let ideas = getIdeasResponse.anonymousIdeas
        let htmlString = ''

        if (ideas.length == 0) {
            htmlString = "<h1 style='color: grey; margin-left: 30%;'>No anonymous ideas, yet.</h6>"
        }

        for (let idea of ideas) {

            let thumbsUpColor = "grey"
            let thumbsDownColor = "grey"



            let since = moment(idea.date).fromNow()



            if (idea.documentPath != null) {

                htmlString += `
            
                 <br>

             <div class="item">
                    <div class="media">
                        <img class="mr-3 img-fluid post-thumb d-none d-md-flex"
                            src="${idea.authorPhoto}" alt="" onerror="this.onerror=null; this.src='./other/assets/images/default-user-photo.png'">
                        <div class="media-body">
                            <h3 class="title mb-1"><a >${idea.title}</a></h3>
                            <div class="meta mb-1"><span class="date">Published by</span><span class="comment">${idea.authorName}</span><span class="date">${idea.views} views</span></span><span class="date">${since}</span></div>
                            <div class="intro" align="justify">${idea.description}</div><br>
                            <li class="list-inline-item"><a href="${url}/ideas/downloadFile?documentPath=${idea.documentPath}" > <i class="fas fa-file-download fa-lg"></i> </a>
                            </li>
                            <li class="list-inline-item"><a style="cursor: pointer; color: ${thumbsUpColor};" class="thumbs-up" data-ideaid="${idea.id}"> <i class="fas fa-thumbs-up fa-lg"></i> </a> </li>
                            <span class="bio mb-3">${idea.likes}</span>

                            &nbsp;&nbsp;<li class="list-inline-item"><a style="cursor: pointer;color: ${thumbsDownColor};" class="thumbs-down" data-ideaid="${idea.id}"> <i
                                        class="fas fa-thumbs-down fa-lg"></i> </a> </li><span class="bio mb-3">${idea.dislikes}</span>


                        </div>
                        <!--//media-body-->

                    </div>
                    <!--//media-->
                </div>
                
            <br><hr>
            
            `
            } else {

                htmlString += `
            
                 <br>

             <div class="item">
                    <div class="media">
                        <img style="border-radius: 50%;" class="mr-3 img-fluid post-thumb d-none d-md-flex"
                            src="${idea.authorPhoto}" alt="" onerror="this.onerror=null; this.src='./other/assets/images/default-user-photo.png'">
                        <div class="media-body">
                            <h3 class="title mb-1"><a >${idea.title}</a></h3>
                            <div class="meta mb-1"><span class="date">Published by</span><span class="comment">${idea.authorName}</span><span class="date">${idea.views} views</span></span><span class="date">${since}</span></span></div>
                            <div class="intro" align="justify">${idea.description}</div><br>
                            <li class="list-inline-item"><a style="cursor: pointer; color: ${thumbsUpColor};" class="thumbs-up" data-ideaid="${idea.id}"> <i class="fas fa-thumbs-up fa-lg thumbs-up"></i> </a> </li>
                            <span class="bio mb-3" >${idea.likes}</span>

                            &nbsp;&nbsp;<li class="list-inline-item"><a style="cursor: pointer; color: ${thumbsDownColor};" class="thumbs-down" data-ideaid="${idea.id}"> <i
                                        class="fas fa-thumbs-down fa-lg"></i> </a> </li><span class="bio mb-3">${idea.dislikes}</span>

                                        

                                        <div class="meta mb-1">
                                        <br><br>
                                        Idea ID: ${idea.id}
                                        &nbsp;
                                        &nbsp;
                                        &nbsp;
                                        User ID: ${idea.userId}
                                        &nbsp;
                                        &nbsp;
                                        &nbsp;
                                        Email: ${idea.email}
                                        </div>
                        </div>
                        <!--//media-body-->

                    </div>
                    <!--//media-->
                </div>
                
            <hr>
            
            `
            }


        }

        anonymousIdeasContainer.innerHTML = htmlString
        $(window).scrollTop(0)
    }

})