const taskSearch = document.querySelector('#task-search')
const optionsNewList = document.querySelector('.options__newlist')
const mainContainer = document.querySelector('main')
const tasksHeader = document.querySelector('.tasks__header')
const tasksContainer = document.querySelector('.tasks__container')
const newTaskContainer = document.querySelector('.new-task-container')
const infoTaskContainer = document.querySelector('.info-task-container')
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
const infoTaskTitle = document.querySelector('#info-task-title')
const infoTaskDescription = document.querySelector('#info-task-description')
const infoTaskAccept = document.querySelector('#info-task-accept')

let selectedFilter = document.querySelector('#option-tasks')
let selectedList = document.querySelector('.options__list')
const data = loadLocalStorageData()
const dataHTML = { lists: [selectedList], tasks: [] }
createDataHTML()

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

function storeList(list) {
  data.lists.push(list)
  storeLocalStorageData()
}

function createDataHTML() {
  data.lists.forEach(createListHTML)
  data.tasks.forEach(createTaskHTML)
  updateFilteredTasks()
}

function createTaskHTML(task) {
  const div = document.createElement('div')
  div.classList.add('task')
  div.style.color = task.color
  div.innerHTML += `<label class="checkbox-label"><input type="checkbox" ${task.completed ? 'checked' : ''}><span class="checkbox-completed"></span></label>`
  div.innerHTML += `<span class="task__title${task.completed ? ' task__title--completed' : ''}${task.important ? ' task__title--important' : ''}">${task.title}</span>`
  div.innerHTML += `<label class="checkbox-label"><input type="checkbox" ${task.important ? 'checked' : ''}><span class="checkbox-important"></span></label>`
  div.innerHTML += '<span class="task__delete"></span>'
  tasksContainer.appendChild(div)
  dataHTML.tasks.push(div)
}

function createListHTML(list) {
  if (list === 'Default') return
  const div = document.createElement('div')
  div.classList.add('options__list')
  div.textContent = list
  div.innerHTML += '<span class="list__delete"></span>'
  optionsNewList.value = ''
  optionsNewList.before(div)
  dataHTML.lists.push(div)

  const option = document.createElement('option')
  option.value = list
  option.textContent = list
  newTaskList.appendChild(option)
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
  task.list = newTaskList.value
  storeTask(task)
  createTaskHTML(task)
  hideNewTaskDiv()
}

function newList(e) {
  if (e.key !== 'Enter') return
  const list = e.target.value
  if (list.length < 3 || list.length > 25) return
  if (data.lists.includes(list)) return
  storeList(list)
  createListHTML(list)
}

function showNewTaskDiv() {
  newTaskTitleWarning.classList.add('hidden')
  newTaskDescriptionWarning.classList.add('hidden')
  newTaskContainer.style.transition = 'none'
  newTaskContainer.style.top = '-100%'
  requestAnimationFrame(() => {
    newTaskContainer.style.transition = 'top 1s'
    newTaskContainer.style.top = '0'
  })
}

function hideNewTaskDiv() {
  newTaskContainer.style.top = '200%'
}

function showInfoTaskDiv() {
  infoTaskContainer.style.transition = 'none'
  infoTaskContainer.style.top = '-100%'
  requestAnimationFrame(() => {
    infoTaskContainer.style.transition = 'top 1s'
    infoTaskContainer.style.top = '0'
  })
}

function hideInfoTaskDiv() {
  infoTaskContainer.style.top = '200%'
}

function generalClickHandler(e) {
  const target = e.target
  const parent = target.parentElement
  if (parent.classList.contains('options')) optionsClickHandler(target)
  if (target.classList.contains('list__delete')) listDelete(parent)
  if (target.classList.contains('checkbox-completed')) taskCompleted(target)
  if (target.classList.contains('checkbox-important')) taskImportant(target)
  if (target.classList.contains('tasks__new-task')) showNewTaskDiv()
  if (target.classList.contains('task')) taskInfo(target)
  if (target.classList.contains('task__delete')) taskDelete(parent)
  else if (parent.classList.contains('task')) taskInfo(parent)
}

function listDelete(list) {
  console.log(list)
}

function taskDelete(task) {
  const index = dataHTML.tasks.indexOf(task)
  data.tasks.splice(index, 1)
  dataHTML.tasks.splice(index, 1)
  storeLocalStorageData()
  tasksContainer.removeChild(task)
}

function taskInfo(target) {
  const task = data.tasks[dataHTML.tasks.indexOf(target)]
  infoTaskTitle.textContent = 'Title: ' + task.title
  infoTaskDescription.textContent = 'Description: ' + task.description
  showInfoTaskDiv()
}

function optionsClickHandler(target) {
  if (target.id === 'option-tasks') optionTasks(target)
  if (target.id === 'option-important') optionImportant(target)
  if (target.id === 'option-completed') optionCompleted(target)
  if (target.classList.contains('options__list')) optionList(target)
}

function optionFilter(task) {
  const temp = data.tasks[dataHTML.tasks.indexOf(task)]
  if (selectedFilter.id === 'option-tasks') return !temp.completed
  if (selectedFilter.id === 'option-important') return !temp.completed && temp.important
  if (selectedFilter.id === 'option-completed') return temp.completed
}

function searchFilter(task) {
  const filter = taskSearch.value.toLowerCase()
  return data.tasks[dataHTML.tasks.indexOf(task)].title.toLowerCase().indexOf(filter) > -1
}

function listFilter(task) {
  const taskList = data.tasks[dataHTML.tasks.indexOf(task)].list
  const list = selectedList.textContent
  return taskList === list
}

function updateFilteredTasks() {
  for (const task of tasksContainer.children) {
    if (optionFilter(task) && searchFilter(task) && listFilter(task)) task.classList.remove('hidden')
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

function optionList(target) {
  selectedList.classList.remove('options__option--selected')
  selectedList = target
  selectedList.classList.add('options__option--selected')
  updateFilteredTasks()
}

function searchTask() {
  updateFilteredTasks()
}

function taskCompleted(target) {
  const taskHTML = target.parentElement.parentElement
  data.tasks[dataHTML.tasks.indexOf(taskHTML)].completed = !data.tasks[dataHTML.tasks.indexOf(taskHTML)].completed
  storeLocalStorageData()
  taskHTML.children[1].classList.toggle('task__title--completed')
  setTimeout(updateFilteredTasks, 800)
}

function taskImportant(target) {
  const taskHTML = target.parentElement.parentElement
  data.tasks[dataHTML.tasks.indexOf(taskHTML)].important = !data.tasks[dataHTML.tasks.indexOf(taskHTML)].important
  storeLocalStorageData()
  taskHTML.children[1].classList.toggle('task__title--important')
  setTimeout(updateFilteredTasks, 800)
}

function newTaskColorChange(e) {
  e.target.style.background = e.target.value
}

function newTaskContainerClick(e) {
  if (e.target.classList.contains('new-task-container'))
    hideNewTaskDiv()
}

function infoTaskContainerClick(e) {
  if (e.target.classList.contains('info-task-container'))
    hideInfoTaskDiv()
}

// Event listeners
taskSearch.addEventListener('input', searchTask)
optionsNewList.addEventListener('keydown', newList)
mainContainer.addEventListener('click', generalClickHandler)
newTaskColor.addEventListener('change', newTaskColorChange)
newTaskCancel.addEventListener('click', hideNewTaskDiv)
newTaskAccept.addEventListener('click', newTask)
newTaskContainer.addEventListener('click', newTaskContainerClick)
infoTaskAccept.addEventListener('click', hideInfoTaskDiv)
infoTaskContainer.addEventListener('click', infoTaskContainerClick)