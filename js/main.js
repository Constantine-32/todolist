const taskSearch = document.querySelector('#task-search')
const optionsContainer = document.querySelector('.options')
const optionsNewList = document.querySelector('.options__newlist')
const mainContainer = document.querySelector('main')
const tasksHeader = document.querySelector('.tasks__header')
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

const data = loadLocalStorageData()
createTasksHTML()

// Functions
function loadLocalStorageData() {
  const data = localStorage.getItem('todolist-qNPXpg7Q')
  return data ? JSON.parse(data) : {lists: ['Default'], tasks: []}
}

function storeLocalStorageData() {
  localStorage.setItem('todolist-qNPXpg7Q', JSON.stringify(data))
}

function storeTask(task) {
  data.tasks.push(task)
  storeLocalStorageData()
}

function createTasksHTML() {
  data.tasks.forEach(createTaskHTML)
}

function createTaskHTML(task, id) {
  const div = document.createElement('div')
  div.id = id
  div.classList.add('task')
  const colors = task.color.split(' ')
  div.style.background = colors[0]
  if (colors[0] === '#111111') {
    div.style.borderBottom = '2px solid #333'
  } else {
    div.style.border = '2px solid ' + colors[1]
  }
  div.innerHTML += `<div class="task__done"><input type="checkbox" ${task.completed ? 'checked' : ''}>`
  div.innerHTML += `</div><div class="task__text">${task.title}</div>`
  div.innerHTML += `<div class="task__important"><input type="checkbox" ${task.important ? 'checked' : ''}></div>`
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
  storeTask(task)
  createTaskHTML(task, data.tasks.indexOf(task))
  hideNewTaskDiv()
}

function generalClickHandler(e) {
  const classList = e.target.parentElement.classList
  if (classList.contains('options')) optionsClickHandler(e)
  if (classList.contains('task')) taskClickHandler(e)
  if (e.target.classList.contains('tasks__new-task')) showNewTaskDiv()
}

function optionsClickHandler(e) {
  const id = e.target.id
  if (id === 'option-tasks') optionTasks()
  if (id === 'option-important') optionImportant()
  if (id === 'option-completed') optionCompleted()
}

function optionTasks() {
  tasksHeader.textContent = 'Tasks'
  for (const task of tasksContainer.children) {
    task.classList.remove('hidden')
  }
}

function optionImportant() {
  tasksHeader.textContent = 'Important'
  for (const task of tasksContainer.children) {
    data.tasks[task.id].important ? task.classList.remove('hidden') : task.classList.add('hidden')
  }
}

function optionCompleted() {
  tasksHeader.textContent = 'Completed'
  for (const task of tasksContainer.children) {
    data.tasks[task.id].completed ? task.classList.remove('hidden') : task.classList.add('hidden')
  }
}

function searchTask(e) {
  const filter = e.target.value.toLowerCase()
  for (const task of tasksContainer.children) {
    data.tasks[task.id].title.toLowerCase().indexOf(filter) > -1 ? task.classList.remove('hidden') : task.classList.add('hidden')
  }
}

function taskClickHandler(e) {
  console.log(e.target.parentElement.id)
}

function newTaskColorChange(e) {
  e.target.style.background = e.target.value.split(' ')[0]
}

function addNewList(e) {
  if (e.key === 'Enter') {
    const list = e.target.value
    if (list.length < 3 || list.length > 20) return

    const div = document.createElement('div')
    div.id = 'list-' + list
    div.classList.add('options__option')
    div.textContent = list
    e.target.value = ''

    e.target.before(div)
  }
}

// Event listeners
taskSearch.addEventListener('input', searchTask)
optionsNewList.addEventListener('keydown', addNewList)
mainContainer.addEventListener('click', generalClickHandler)
newTaskColor.addEventListener('change', newTaskColorChange)
newTaskCancel.addEventListener('click', hideNewTaskDiv)
newTaskAccept.addEventListener('click', newTask)