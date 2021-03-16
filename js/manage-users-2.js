// $(document).ready(function () {

let usersTableHeaders = document.getElementById("usersTableHeaders")
let usersTableBody = document.getElementById("usersTableBody")

let url = "https://theunibook.herokuapp.com"
// let url = "http://localhost:8080"


const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
})

populateUsersTable()



async function getUsers(departmentId = null) {
    let users;

    if (departmentId == null) {
        users = await fetch(`${url}/users`).then(res => res.json())
    } else {
        users = await fetch(`${url}/users/department/${departmentId}`).then(res => res.json())
    }
    return users;
}


async function populateUsersTable() {

    let htmlHeaders = `
    <tr class="table100-head">
	    <th class="column1">ID</th>
	    <th class="column2">Firstname</th>
	    <th class="column3">Lastname</th>
	    <th class="column4">Email</th>
	    <th class="column5">Role</th>
	    <th class="column6">Department</th>
	    <th class="column7">Status</th>
	    <th class="column8">Activity</th>
	    <th class="column9">Actions</th>
	</tr>
   `


    let users = await getUsers()

    let htmlString = ''

    for (let user of users) {

        let accountStatus = user.enabled ? "-" : "Suspended"


        let activity = user.hidden ? "Hidden" : "-"

        let btnName = 'Deactivate';
        let btnColor = 'danger';

        if (!user.enabled || user.hidden) {
            btnName = 'Activate'
            btnColor = 'info'

        }

        htmlString += `
            <tr>
								<td class="column1">${user.id}</td>
								<td class="column2">${user.firstname}</td>
								<td class="column3">${user.lastname}</td>
								<td class="column4">${user.email}</td>
								<td class="column5">${user.role}</td>
								<td class="column6">${user.department.name}</td>
								<td class="column7">${accountStatus}</td>
								<td class="column8">${activity}</td>
								<td class="column9"><button type="button" style="width: 100px;"class="btn btn-${btnColor} deactivateBtn" data-user='${JSON.stringify(user)}'>${btnName}</button>
								</td>
							</tr>
            
            `


    }


    usersTableHeaders.innerHTML = htmlHeaders
    usersTableBody.innerHTML = htmlString

    let deactivateBtns = Array.from(document.querySelectorAll(".deactivateBtn"));

    deactivateBtns.forEach(button => {

        button.addEventListener("click", () => {

            let user = JSON.parse(button.dataset.user);
            let fullname = user.firstname + ' ' + user.lastname

            if (user.enabled) {
                showDisablePopup(fullname, user.id);
            } else if (user.hidden) {
                showUnblockAndUnHidePopup(fullname, user.id);
            } else if (!user.enabled && !user.hidden) {
                showEnablePopup(fullname, user.id)
            }
        })


    })

}



function showDisablePopup(fullname, userId) {
    Swal.fire({
        title: fullname,
        text: 'Are you sure you want to disable this account?',
        showDenyButton: true,

        showCancelButton: false,
        denyButtonText: `Disable + Hide Activity`,
        confirmButtonText: `Disable`,
        showConfirmButton: true,
        confirmButtonColor: 'grey',
        customClass: {
            confirmButton: 'order-2',
            denyButton: 'order-1 right-gap',
        }
    }).then((result) => {
        if (result.isDenied) {
            disableAccountAndHideActivity(userId)
        } else if (result.isConfirmed) {
            disableAccount(userId)
        }

    })
}

function showEnablePopup(fullname, userId) {
    Swal.fire({
        title: fullname,
        text: 'Unblock account?',
        showCancelButton: true,
        confirmButtonText: `Unblock`,
        showConfirmButton: true,
    }).then((result) => {
        if (result.isConfirmed) {
            enableUserAccount(userId)
        }
    })
}

function showUnblockAndUnHidePopup(fullname, userId) {
    Swal.fire({
        title: fullname,
        text: 'Unblock account and unhide user activity?',
        showCancelButton: true,
        confirmButtonText: `Unblock`,
        showConfirmButton: true,
    }).then((result) => {
        if (result.isConfirmed) {
            enableAccountAndUnHideActivity(userId)
        }
    })
}

async function enableUserAccount(userId) {
    let response = await fetch(`${url}/users/${userId}/enable`, { method: 'PUT' }).then(response => response.json())
    if (response.message == "user account enabled") {
        await populateUsersTable().then(() => {

            Toast.fire({
                icon: 'success',
                title: 'Suspension has been removed'
            })
        })

    }
}

async function disableAccountAndHideActivity(userId) {
    let response = await fetch(`${url}/users/${userId}/disableAndHideActivity`, { method: 'PUT' }).then(response => response.json())
    if (response.message == "user account disabled and hidden") {
        // grid.forceRender()
        await populateUsersTable().then(() => {
            Toast.fire({
                icon: 'warning',
                title: 'User account suspended, Activity is now hidden'
            })
        })

    }
}

async function enableAccountAndUnHideActivity(userId) {
    let response = await fetch(`${url}/users/${userId}/enableAndUnHideActivity`, { method: 'PUT' }).then(response => response.json())
    if (response.message == "user activity unhidden") {
        await populateUsersTable().then(() => {

            Toast.fire({
                icon: 'success',
                title: 'Suspension has been removed'
            })

        })
    }
}

async function disableAccount(userId) {
    let response = await fetch(`${url}/users/${userId}/disable`, { method: 'PUT' }).then(response => response.json())
    if (response.message == "user account disabled") {
        await populateUsersTable().then(() => {

            Toast.fire({
                icon: 'warning',
                title: 'User account has been suspended'
            })

        })
    }
}

