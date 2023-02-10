let todos = []
let selectedTask = null

showTodo()
registerEvents()

function showTodo(filter = 'all') { // filter pending, or completed. set to all as default
    const taskBox = document.querySelector(".task-box")
    let todoElements = ""

    todos.forEach((todo, index) => {
        if (filter === 'all' || filter === todo.status) {
            return todoElements += todoElement(todo, index)
        }
    })

    taskBox.innerHTML = todoElements ? todoElements : noTaskElement()
}

function todoElement(todo, index) {
    const checked = todo.status === "completed" ? "checked" : "" // see for explanation https://www.w3schools.com/tags/att_input_checked.asp
    return `
        <li class="task">
            <label for="todo-status-${index}">
                <input 
                    onclick="updateStatus(${index})"
                    type="checkbox"
                    id="todo-status-${index}"
                    ${checked}
                />
                <p class="${checked}">${todo.name}</p> <!-- Add text-decoration line through if todo is already completed. See style.css line 165 -->
            </label>
            <div class="settings">
                <i onclick="editTask('${todo?.name}', ${index})" class="fa-regular fa-pen-to-square update-task"></i>
                <i onclick="deleteTask(${index})" class="fa-solid fa-delete-left delete-task"></i>
            </div>
        </li>
    `
}

function noTaskElement() {
    return `<div class="no-task">You don't have any task here</div>`
}

function updateStatus(index) {
    const selectedTask = todos[index]
    selectedTask.status = selectedTask.status === 'completed' ? 'pending' : 'completed' // reverse the status. if status is completed update to pending and vice versa
    showTodo(getActiveFilter())
}

function editTask(todoName, index) {
    selectedTask = index
    taskInputElement().value = todoName
    taskInputElement().focus() // see https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/focus
}

function deleteTask(index) {
    todos.splice(index, 1)
    showTodo(getActiveFilter())
}

function getActiveFilter() {
    return document.querySelector("span.active").id
}

function taskInputElement() {
    return document.querySelector(".task-input input")
}

function registerEvents() {
    taskInputElement().addEventListener("keyup", (e) => {
        let taskInputValue = taskInputElement().value.trim()
        if (e.key === "Enter" && taskInputValue) {
            if (selectedTask === null) { // if index is less than 0, create new task/todo
                let taskInfo = {name: taskInputValue, status: "pending"}
                todos.push(taskInfo)
            } else { // update selected task/todo
                todos[selectedTask].name = taskInputValue
                selectedTask = null
            }
            taskInputElement().value = ""
            showTodo(getActiveFilter())
        }
    })

    document.querySelector(".clear-btn").addEventListener("click", () => {
        selectedTask = null
        todos = []
        showTodo()
    })

    document.querySelectorAll(".filters span").forEach((btn) => { // loop thru each filters
        btn.addEventListener("click", () => {
            document.querySelector("span.active").classList.remove("active") // https://developer.mozilla.org/en-US/docs/Web/API/Element/classList
            btn.classList.add("active")
            showTodo(btn.id)
        })
    })
}
