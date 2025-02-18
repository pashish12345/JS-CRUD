let inputItem = document.querySelector('.todo-input')
let addBtn = document.querySelector('.todo-btn')
let todoListContainer = document.querySelector('.todo-list')

/* on page load get local stotage data and send to render function one by one */
document.addEventListener('DOMContentLoaded', function () {
  const ToDoList = getLocalstorageData()
  ToDoList.forEach((el) => renderToDo(el))
})

//reterive data from local storage
function getLocalstorageData() {
  return localStorage.getItem('todolist')
    ? JSON.parse(localStorage.getItem('todolist'))
    : []
}
//save data to local storage
function saveLocalstorageData(updatedToDo) {
  localStorage.setItem('todolist', JSON.stringify(updatedToDo))
}

// render list item 
function renderToDo(todo) {
 
  let li = document.createElement('li')
  li.classList.add('list-item')
  li.setAttribute('data-id', todo.id)
  if (todo.completed) {
    li.classList.add('completed')
  }
  li.innerHTML = `<input type="checkbox" 
  ${todo.completed ? 'checked' : ''}               
   onclick="togglecomplete('${todo.id}')"
   />
    <span> ${todo.title} </span>
    <div class="btncontainer"> 
     <button  class="editbtn" >EDIT</button>
    <button class="deletebtn"  > DELETE</button>
    </div>`

    li.querySelector(".editbtn").addEventListener("click",()=>edithandler(`${todo.id}`))
    li.querySelector(".deletebtn").addEventListener("click",()=>deletehandler(`${todo.id}`))
  todoListContainer.appendChild(li)

  progresshandler()
}

// edit 
function edithandler(id) {
  id= Number(id)
  let currentLi = document.querySelector(`[data-id= "${id}"]`)
  if (currentLi.classList.contains('completed')) {
    alert('no change')
    return
  }
  let currentText = currentLi.querySelector('span').textContent
  inputItem.value = currentText
  let newText = prompt('edit text ', currentText);
  if (newText === null || newText.trim() === '') return // Prevent empty or canceled edits

  currentLi.querySelector('span').textContent = newText
  inputItem.value = ''
  updatedToDo(newText, id)
}

// update 
function updatedToDo(newText, id) {
  let currentToDoList = getLocalstorageData()
  currentToDoList = currentToDoList.map((el) => 
    Number(el.id) === Number(id) ? { ...el, title: newText } : el
  )
  saveLocalstorageData(currentToDoList)
  progresshandler()
}

// add new todo 
addBtn.addEventListener('click', addToDo)
function addToDo(e) {
  e.preventDefault()
  let inputValue = inputItem.value.trim()
  if (inputValue === null || inputValue === '') return

  let obj = {
    title: inputValue,
    completed: false,
    id: new Date().getTime(),
  }
  renderToDo(obj)
  const todolist = getLocalstorageData()
  todolist.push(obj)
  saveLocalstorageData(todolist)
  inputItem.value = ''
}

//delete todo

function deletehandler(id) {
  id = Number(id)
  let currentLi = document.querySelector(`[data-id="${id}"]`)
  if (currentLi.classList.contains('completed')) {
    alert('cannot delete completed task')
    return
  }
  currentLi.remove()
  const todolist = getLocalstorageData()
  let updated = todolist.filter((todo) => Number(todo.id) !== Number(id))
  saveLocalstorageData(updated)
  progresshandler()
}

// toggle checkbox
function togglecomplete(id) {
  id= Number(id)
  let targetLi = document.querySelector(`[data-id="${id}"]`)
  let currentlist = getLocalstorageData()
  targetLi.classList.toggle('completed')
  let updatedList= currentlist.map((el) =>
    Number(el.id) === id ? { ...el, completed: !el.completed } : el
  )
  saveLocalstorageData(updatedList)
  progresshandler()
}

// progress bar 
function progresshandler() {
  let currentToDoList = getLocalstorageData()
  let len = currentToDoList.length
  let completedTask = currentToDoList.filter((el) => el.completed).length
  let percentage = len ? (completedTask / len) * 100 : 0
  document.querySelector('.progressInner').style.width = `${percentage}%`
}
