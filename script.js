let allFilter = document.querySelectorAll(".filter");
let TC = document.querySelector(".ticket-container");
let modalVisible = false;

function loadTickets(color) {
    let allTasks = localStorage.getItem("allTasks");
    if (allTasks != null) {
        allTasks = JSON.parse(allTasks);

        if(color){
            allTasks = allTasks.filter(function(data){
                return data.priority == color;
            })
        }

        for (let i = 0; i < allTasks.length; i++) {

            let ticket = document.createElement("div");
            ticket.classList.add("ticket");

            ticket.innerHTML = `<div class="ticket-color ticket-color-${allTasks[i].priority}"></div>
            <div class="ticket-id">#${allTasks[i].ticketId}</div>
            <div class="task">${allTasks[i].task}</div>`;

            TC.appendChild(ticket);

            ticket.addEventListener("click", function (e) {
                if (e.currentTarget.classList.contains("active")) {
                    e.currentTarget.classList.remove("active");
                } else {
                    e.currentTarget.classList.add("active");
                }
            });
        }
    }
}

loadTickets();

for (let i = 0; i < allFilter.length; i++) {
    allFilter[i].addEventListener("click", filterHandler);
}

function filterHandler(e) {
    TC.innerHTML = "";
    if (e.currentTarget.classList.contains("active")) {
        e.currentTarget.classList.remove("active");
        loadTickets();
    } else {
        let activeFilter = document.querySelector(".filter.active");
        if (activeFilter) {
            activeFilter.classList.remove("active");
        }
        e.currentTarget.classList.add("active");
        let ticketPriority = e.currentTarget.children[0].classList[0].split("-")[0];
        loadTickets(ticketPriority);
    }
}

let addBtn = document.querySelector(".add");
let deleteBtn = document.querySelector(".delete");

deleteBtn.addEventListener("click", removeTicket);

function removeTicket(e) {
    let selectedTickets = document.querySelectorAll(".ticket.active");
    let allTasks = JSON.parse(localStorage.getItem("allTasks"));

    for (let i = 0; i < selectedTickets.length; i++) {
        selectedTickets[i].remove();
        let ticketID = selectedTickets[i].querySelector(".ticket-id").innerText;
        allTasks = allTasks.filter(function (data) {
            return (("#" + data.ticketId) != ticketID);
        });
    }

    localStorage.setItem("allTasks", JSON.stringify(allTasks));
}

addBtn.addEventListener("click", showModal);

let selectedPriority;

function showModal(e) {
    if (!modalVisible) {
        let biggerModal = document.createElement("div");
        biggerModal.classList.add("bigger-modal");
        biggerModal.innerHTML =
            `<div class="modal">
            <div class="close">
                <img src="https://img.icons8.com/ios-glyphs/27/000000/macos-close.png"/>
            </div>
            <div class="task-to-be-added" data-typed = "false" contenteditable = "true">Enter you task here</div>
            <div class="modal-priority-list">
                <div class="modal-pink-filter modal-filter active"></div>
                <div class="modal-blue-filter modal-filter"></div>
                <div class="modal-green-filter modal-filter"></div>
                <div class="modal-yellow-filter modal-filter"></div>
            </div>
            </div>`;
        TC.append(biggerModal);

        // let modal = `<div class="modal">
        //     <div class="task-to-be-added" data-typed = "false" contenteditable>Enter you task here</div>
        //     <div class="modal-priority-list">
        //         <div class="modal-pink-filter modal-filter active"></div>
        //         <div class="modal-blue-filter modal-filter"></div>
        //         <div class="modal-green-filter modal-filter"></div>
        //         <div class="modal-yellow-filter modal-filter"></div>
        //     </div>
        // </div>`;
        // TC.innerHTML = TC.innerHTML + modal;
        selectedPriority = "pink"; //by default

        let taskModal = document.querySelector(".task-to-be-added");
        taskModal.addEventListener("click", function (e) {
            if (e.currentTarget.getAttribute("data-typed") == "false") {
                e.currentTarget.innerText = "";
                e.currentTarget.setAttribute("data-typed", "true");
            }
        });
        modalVisible = true;

        taskModal.addEventListener("keypress", addTicket.bind(this, taskModal));
        let modalFilter = document.querySelectorAll(".modal-filter");

        for (let i = 0; i < modalFilter.length; i++) {
            modalFilter[i].addEventListener("click", selectPriority.bind(this, taskModal));
        }

        document.querySelector(".close").addEventListener("click", function(){
            biggerModal.remove();
            modalVisible = false;
        })
    }
}

function selectPriority(taskModal, e) {
    let activeFilter = document.querySelector(".modal-filter.active");
    activeFilter.classList.remove("active");
    selectedPriority = e.currentTarget.classList[0].split("-")[1];
    e.currentTarget.classList.add("active");
    taskModal.click();
    taskModal.focus();
}

function addTicket(taskModal, e) {
    if (e.key == "Enter" && e.shiftKey == false && taskModal.innerText.trim() != "") {

        let task = taskModal.innerText;
        let id = uid();

        // let ticket = document.createElement("div");

        // ticket.classList.add("ticket");

        // ticket.innerHTML = `<div class="ticket-color ticket-color-${selectedPriority}"></div>
        //     <div class="ticket-id">#${id}</div>
        //     <div class="task">${task}</div>`;

        document.querySelector(".modal").remove();
        modalVisible = false;

        // TC.appendChild(ticket);
        // ticket.addEventListener("click", function (e) {

        //     if (e.currentTarget.classList.contains("active")) {
        //         e.currentTarget.classList.remove("active");
        //     } else {
        //         e.currentTarget.classList.add("active");
        //     }
        // });

        let allTasks = localStorage.getItem("allTasks");
        if (allTasks == null) {
            let data = [{ "ticketId": id, "task": task, "priority": selectedPriority }];
            localStorage.setItem("allTasks", JSON.stringify(data));
        } else {
            let data = JSON.parse(allTasks);
            data.push({ "ticketId": id, "task": task, "priority": selectedPriority });
            localStorage.setItem("allTasks", JSON.stringify(data));
        }

        let activeFilter = document.querySelector(".filter.active");
        TC.innerHTML = "";
        if(activeFilter){
            let priority = activeFilter.children[0].classList[0].split("-")[0];
            loadTickets(priority);
        }else{
            loadTickets();
        }

    } else if (e.key == "Enter" && e.shiftKey == false) {
        e.preventDefault();
        alert("Error! you have not typed anything in task.");
    }

}

let info;
$(".info-btn").mouseover(function(){
    info=$(`<div class="info">
    <h2><u>Features:</u></h2>
	<ul>
		<li><b>Add Tasks:</b>Tasks can be added with the Add-button. Click '+' Icon.</li>
		<br />
		<li><b>Delete Tasks:</b>Tasks can be deleted with the delete-button. Click '-' Icon.</li>
		<br />
		<li>
			<b>Delete All Tasks:</b> Click Button present in the top
			right corner.
		</li>
		<br />
		<li><b>View All Tasks:</b> Double click any color in the Toolbar.</li>
		<br />
		<li>
			<b>View Color specific Tasks:</b> Click that specific
			color in the Toolbar.
		</li>
		<br />		
		<li>
			<b>Setting Color of a Task:</b>
			After pressing '+' Icon, Enter description, then select the color for your task from the color palette.
		</li>
		<br />
        <li>
			<b>Each task is gnerated with a unique ID</b>
		</li>	
		<p>
			<b><i>*Don't worry! Your data will be stored for the next time you visit..</b>
		<i></i></p>
	</ul>
    </div>`)
    $(".ticket-container").append(info);
});
$(".info-btn").mouseout(function(){
  info.remove();
})

$(".deleteTicket").click(function(e){
    let ticketDelete = $(".ticket");
    for(let i = 0; i < ticketDelete.length; i++){
        $(ticketDelete[i]).addClass("active");
    }
    removeTicket();
});

// function filterHandler(e) {
//     let span = e.currentTarget.children[0];
//     // console.log(span);
//     let style = window.getComputedStyle(span).backgroundColor;
//     // console.log(style);
//     TC.style.backgroundColor = style;
// }

// function filterHandler1(e) {
//     let filterColor = e.currentTarget.children[0].classList[0].split("-")[0];
//     TC.style.backgroundColor = filterColor;
// }