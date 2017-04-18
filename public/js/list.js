var inputText = document.querySelector("#todoText");
var todosList = document.querySelector("#todoList");
var todosLeft = document.querySelector("#todosLeft");
var clearCompleted = document.querySelector("#clearCompleted");
var markAllComplited = document.querySelector("#markAllComplited")
var todoIndexValue = 0;

var showAll = document.querySelector("#showAll");
var showActive = document.querySelector("#showActive");
var showCompleted = document.querySelector("#showCompleted");

var globalTodoFilter = null;

var todos = [];

// inputText.onkeypress = function(e) {
$("#todoText").keypress(function(e){
    if (e.keyCode == 13) {
        todoIndexValue++;
        todos.push({
            text: inputText.value,
            isDone: false,
            index: todoIndexValue
        });
        updateLocalStorage();
        inputText.value = "";
        renderTodos();
        countActiveTodos();
    }
});



function changeTodoStatus(todo,liClass, todoState){
            var li = document.querySelector("li[todo-index='" + todo.index + "']");
            var checkbox = li.querySelector("input");

            todo.isDone = todoState;
            checkbox.checked = todoState;
            li.setAttribute("class", "list-group-item " + liClass);
            updateLocalStorage();
}



function renderTodos(todoFilter) {
    globalTodoFilter = todoFilter;

    var filteredTodos = todos;
    todosList.innerHTML = "";

    if (todos.length == 0) {
        todosList.innerHTML = "";
        return;
    }

    if (todoFilter != null) {
        todosList.innerHTML = "";
        filteredTodos = filteredTodos.filter(function(todo) {
            return todo.isDone == todoFilter;
        });
    }

    filteredTodos.forEach(function(todo) {
        var todoElementTemplate = document.querySelector("div#hollow li").cloneNode(true);

        todoElementTemplate.querySelector("span").innerText = todo.text;
        todoElementTemplate.setAttribute("todo-index", todo.index)
        
        if(todo.isDone == true){
            todoElementTemplate.setAttribute("class", "list-group-item todo-done")
            todoElementTemplate.querySelector("input").checked= true;
        }

        todoElementTemplate.querySelector("input").onchange = function(e) {
            var li = e.path[1];
            var todoIndex = li.getAttribute("todo-index");
            var todo = todos.filter(function(todo) {
                return todo.index == todoIndex;
            });

            todo = todos.indexOf(todo[0]);
            todo = todos[todo];

            if(e.path[0].checked) {
                li.setAttribute("class"," list-group-item todo-done");
                todo.isDone = true;
            } else {
                li.setAttribute("class","list-group-item");
                todo.isDone = false;
            }
            countActiveTodos();
            showClearCompleted();
            showMarkAllButton();
            updateLocalStorage();
        }
        todoElementTemplate.querySelector("button").onclick = function(e) {
            var li = e.path[1];
            var todoIndex = li.getAttribute("todo-index");
            todos.splice(todoIndex, 1);

            todosList.removeChild(li);
            // renderTodos();
            countActiveTodos();
            showClearCompleted();
            showMarkAllButton()
            updateLocalStorage();
        }
        todosList.appendChild(todoElementTemplate);
    });
}


function countActiveTodos() {
    var activeTodos = todos.filter(function(todo){
        return todo.isDone == false;
    });
}

function updateLocalStorage(){
    localStorage.setItem("todos", JSON.stringify(todos));
}


function init(){
    var localStorageTodos = localStorage.todos;
    if (localStorageTodos != undefined){
      todos = JSON.parse(localStorageTodos);  
    }
    
    renderTodos(null);
    countActiveTodos(); 
}

init();