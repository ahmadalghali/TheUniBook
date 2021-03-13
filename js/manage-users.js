import { Grid, h } from "https://unpkg.com/gridjs/dist/gridjs.production.es.min.js";
$(document).ready(function () {

    let usersTable = document.getElementById("usersTable")

    let url = "https://theunibook.herokuapp.com"
    // let url = "http://localhost:8080"

    let grid;

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

    // const updateTable = () => getUsers().then(users => populateUsersTable(users))
    // // const updateTable = () => getUsers().then(users => populateTabulator(users))

    // updateTable()




    // async function getUsers(departmentId = null) {
    //     let users;

    //     if (departmentId == null) {
    //         users = await fetch(`${url}/users`).then(res => res.json())
    //     } else {
    //         users = await fetch(`${url}/users/department/${departmentId}`).then(res => res.json())
    //     }
    //     return users;
    // }

    function populateUsersTable() {
        // let columns = []

        // for (let key in users[0]) {
        //     const columnCapitalized = key.charAt(0).toUpperCase() + key.slice(1)
        //     columns.push(columnCapitalized)
        // }


        grid = new gridjs.Grid({
            // columns: columns,
            search: true,
            sort: true,
            server: {
                url: `${url}/users`,
                then: data => data.map(user => [user.id, user.firstname, user.lastname, user.email, user.role, user.department.name, user.enabled ? "" : "Suspended", user.hidden ? "Hidden" : ""])
            },
            columns: [{
                name: "Id",
            }, {
                name: "Firstname",
            },
            {
                name: "Surname",
            },
            {
                name: "Email",
            },
            {
                name: "Role",
            },
            {
                name: "Department",
            },
            {
                name: "Account Status",
            },
            {
                name: "Activity",
            },
            {
                name: 'Actions',
                formatter: (cell, row, data) => {
                    return h('button', {
                        className: 'btn btn-info',
                        // onClick: () => alert(`Editing "${row.cells[0].data}" "${row.cells[1].data}"`)
                        onClick: () => {
                            let fullname = `${row.cells[1].data} ${row.cells[2].data}`
                            let enabled = row.cells[6].data == "" ? true : false
                            let hidden = row.cells[7].data == "" ? false : true

                            let userId = row.cells[0].data

                            if (enabled) {
                                showDisablePopup(fullname, userId);
                            } else if (hidden) {
                                showUnblockAndUnHidePopup(fullname, userId);
                            } else if (!enabled && !hidden) {
                                showEnablePopup(fullname, userId)
                            }


                            // Swal.fire({
                            //     title: 'Disable account',
                            //     text: 'Are you sure you want to disable this account?',
                            //     showCancelButton: true,
                            //     confirmButtonText: 'Disable',
                            //     showDenybutton: true
                            // }).then(result => {
                            //     if (result.isConfirmed) {
                            //         // sessionStorage.removeItem("session")
                            //         // location.href = "/"
                            //     }
                            // })
                        }
                        //swal.fire(`Editing "${row.cells[0].data}" "${row.cells[1].data}"`)

                    }, 'Deactivate');
                }
            },
            ],


            data: [
                // ["John", "john@example.com", "(353) 01 222 3333"],
                // ["Mark", "mark@gmail.com", "(01) 22 888 4444"],
                // ["Eoin", "eoin@gmail.com", "0097 22 654 00033"],
                // ["Sarah", "sarahcdd@gmail.com", "+322 876 1233"],
                // ["Afshin", "afshin@mail.com", "(353) 22 87 8356"]
            ],
            style: {
                // td: {
                //     border: '1px solid #ccc'
                // },
                table: {
                    'font-size': '18px',
                }
            }
        }).render(usersTable);

    }



    function showDisablePopup(fullname, userId) {
        Swal.fire({
            title: fullname,
            text: 'Are you sure you want to disable this account?',
            showDenyButton: true,
            // input: 'checkbox',
            // inputValue: 0,
            // inputPlaceholder: 'Hide user posts/activity',
            showCancelButton: false,
            denyButtonText: `Disable + Hide Activity`,
            confirmButtonText: `Disable`,
            showConfirmButton: true,
            confirmButtonColor: 'grey',
            // denyButtonText: `Disable + Hide Activity`,
            customClass: {
                // cancelButton: 'order-2',
                confirmButton: 'order-2',
                denyButton: 'order-1 right-gap',
            }
        }).then((result) => {
            if (result.isDenied) {
                disableAccountAndHideActivity(userId)
                // Swal.fire(`disabled and hid posts for user ${userId}`)
            } else if (result.isConfirmed) {
                disableAccount(userId)
                // Swal.fire('disabled')
            }
            // if (result.isConfirmed) {
            //     Swal.fire('Saved!', '', 'success')
            // } else if (result.isDenied) {
            //     Swal.fire('Changes are not saved', '', 'info')
            // }
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
            grid.forceRender()
            // toastr.success("Suspension has been removed")
            Toast.fire({
                icon: 'success',
                title: 'Suspension has been removed'
            })
        }
    }

    async function disableAccountAndHideActivity(userId) {
        let response = await fetch(`${url}/users/${userId}/disableAndHideActivity`, { method: 'PUT' }).then(response => response.json())
        if (response.message == "user account disabled and hidden") {
            grid.forceRender()
            // toastr.success("User account suspended, Activity is now hidden")
            Toast.fire({
                icon: 'warning',
                title: 'User account suspended, Activity is now hidden'
            })
        }
    }

    async function enableAccountAndUnHideActivity(userId) {
        let response = await fetch(`${url}/users/${userId}/enableAndUnHideActivity`, { method: 'PUT' }).then(response => response.json())
        if (response.message == "user activity unhidden") {
            grid.forceRender()
            // toastr.success("Suspension has been removed")
            Toast.fire({
                icon: 'success',
                title: 'Suspension has been removed'
            })
        }
    }

    async function disableAccount(userId) {
        let response = await fetch(`${url}/users/${userId}/disable`, { method: 'PUT' }).then(response => response.json())
        if (response.message == "user account disabled") {
            grid.forceRender()
            // toastr.success("User account has been suspended")
            Toast.fire({
                icon: 'warning',
                title: 'User account has been suspended'
            })
        }
    }










})