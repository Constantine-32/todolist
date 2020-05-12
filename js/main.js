const mainContainer = document.querySelector('main')

const tasksContainer = document.querySelector('.tasks__container')

const newTaskDiv = document.querySelector('.new-task')
const newTaskTitle = document.querySelector('#new-task-title')
const newTaskTitleWarning = document.querySelector('#new-task-title-warning')
const newTaskDescription = document.querySelector('#new-task-description')
const newTaskDescriptionWarning = document.querySelector('#new-task-description-warning')
const newTaskCompleted = document.querySelector('#new-task-completed')
const newTaskImportant = document.querySelector('#new-task-important')
const newTaskColor = document.querySelector('#new-task-color')
const newTaskList = document.querySelector('#new-task-list')
const newTaskAccept = document.querySelector('#new-task-accept')
const newTaskCancel = document.querySelector('#new-task-cancel')

const tasks = loadTasks()
createTasksHTML()

// Functions
function loadTasks() {
  const data = localStorage.getItem('qNPXpg7Q-tasks')
  return data ? JSON.parse(data) : []
}

function storeTasks(task) {
  if (task) tasks.push(task)
  localStorage.setItem('qNPXpg7Q-tasks', JSON.stringify(tasks))
}

function createTasksHTML() {
  tasks.forEach((task, index) => {
    createTaskHTML(task, index)
  })
}

function createTaskHTML(task, id) {
  const div = document.createElement('div')
  div.id = id
  div.classList.add('task')
  div.innerHTML += `<div class="task__done"><input type="checkbox" ${task.completed ? 'checked' : ''}>`
  div.innerHTML += `</div><div class="task__text">${task.title}</div>`
  div.innerHTML += `<div class="task__important"><input type="checkbox" ${task.important ? 'checked' : ''}> Important</div>`
  tasksContainer.appendChild(div)
}

function showNewTaskDiv() {
  newTaskTitleWarning.classList.add('hidden')
  newTaskDescriptionWarning.classList.add('hidden')
  newTaskDiv.style.transition = 'none'
  newTaskDiv.style.top = '-50%'
  requestAnimationFrame(() => {
    newTaskDiv.style.transition = 'top 1s'
    newTaskDiv.style.top = '50%'
  })
}

function hideNewTaskDiv() {
  newTaskDiv.style.top = '150%'
}

function newTask() {
  newTaskTitleWarning.classList.add('hidden')
  newTaskDescriptionWarning.classList.add('hidden')
  const task = {}
  task.title = newTaskTitle.value
  if (!task.title || task.title.length < 3 || task.title.length > 50) {
    newTaskTitleWarning.classList.remove('hidden')
    return
  }
  task.description = newTaskDescription.value
  if (!task.description) {
    newTaskDescriptionWarning.classList.remove('hidden')
    return
  }
  task.completed = newTaskCompleted.checked
  task.important = newTaskImportant.checked
  task.color = newTaskColor.value
  task.listID = newTaskList.value
  storeTasks(task)
  createTaskHTML(task)
  hideNewTaskDiv()
}

function generalClickHandler(e) {
  const classList = e.target.parentElement.classList
  if (classList.contains('options')) optionsClickHandler(e)
  if (classList.contains('task')) taskClickHandler(e)
  if (e.target.classList.contains('tasks__new-task')) showNewTaskDiv()
}

function optionsClickHandler(e) {
  console.log(e.target.id)
}

function taskClickHandler(e) {
  console.log(e.target.parentElement.id)
}

function newTaskColorChange(e) {
  e.target.style.background = e.target.value
}

// Event listeners
mainContainer.addEventListener('click', generalClickHandler)
newTaskColor.addEventListener('change', newTaskColorChange)
newTaskCancel.addEventListener('click', hideNewTaskDiv)
newTaskAccept.addEventListener('click', newTask)