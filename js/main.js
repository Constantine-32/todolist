const taskSearch = document.querySelector('#task-search')
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

let selectedFilter = document.querySelector('#option-tasks')

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
  div.style.color = task.color
  div.innerHTML += `<label class="checkbox-label"><input type="checkbox" ${task.completed ? 'checked' : ''}><span class="checkbox-completed"></span></label>`
  div.innerHTML += `<span class="task__title${task.completed ? ' task__title--completed' : ''}">${task.title}</span>`
  div.innerHTML += `<label class="checkbox-label"><input type="checkbox" ${task.important ? 'checked' : ''}><span class="checkbox-important"></span></label>`
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
  const target = e.target
  const parent = target.parentElement
  if (parent.classList.contains('options')) optionsClickHandler(target)
  if (target.classList.contains('checkbox-completed')) taskCompleted(target)
  if (target.classList.contains('checkbox-important')) taskImportant(target)
  if (target.classList.contains('tasks__new-task')) showNewTaskDiv()
}

function optionsClickHandler(target) {
  if (target.id === 'option-tasks') optionTasks(target)
  if (target.id === 'option-important') optionImportant(target)
  if (target.id === 'option-completed') optionCompleted(target)
}

function optionFilter(task) {
  if (selectedFilter.id === 'option-tasks') return true
  if (selectedFilter.id === 'option-important') return data.tasks[task.id].important
  if (selectedFilter.id === 'option-completed') return data.tasks[task.id].completed
}

function searchFilter(task) {
  const filter = taskSearch.value.toLowerCase()
  return data.tasks[task.id].title.toLowerCase().indexOf(filter) > -1
}

function updateFilteredTasks() {
  for (const task of tasksContainer.children) {
    if (optionFilter(task) && searchFilter(task)) task.classList.remove('hidden')
    else task.classList.add('hidden')
  }
}

function optionTasks(target) {
  selectedFilter.classList.remove('options__option--selected')
  selectedFilter = target
  selectedFilter.classList.add('options__option--selected')
  tasksHeader.textContent = 'Tasks'
  updateFilteredTasks()
}

function optionImportant(target) {
  selectedFilter.classList.remove('options__option--selected')
  selectedFilter = target
  selectedFilter.classList.add('options__option--selected')
  tasksHeader.textContent = 'Important'
  updateFilteredTasks()
}

function optionCompleted(target) {
  selectedFilter.classList.remove('options__option--selected')
  selectedFilter = target
  selectedFilter.classList.add('options__option--selected')
  tasksHeader.textContent = 'Completed'
  updateFilteredTasks()
}

function searchTask() {
  updateFilteredTasks()
}

function taskCompleted(target) {
  const taskHTML = target.parentElement.parentElement
  data.tasks[taskHTML.id].completed = !data.tasks[taskHTML.id].completed
  storeLocalStorageData()
  taskHTML.children[1].classList.toggle('task__title--completed')
}

function taskImportant(target) {
  const taskHTML = target.parentElement.parentElement
  data.tasks[taskHTML.id].important = !data.tasks[taskHTML.id].important
  storeLocalStorageData()
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