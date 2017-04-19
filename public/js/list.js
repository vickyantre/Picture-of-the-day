var inputText = document.querySelector("#todoText");
var todoIndexValue = 0;
var todosList = document.querySelector("#todoList");

todos = [];

$("#todoText").keypress(function(e){
    if (e.keyCode == 13) {
        todoIndexValue++;
        todos.push({
            text: inputText.value,
            isDone: false,
            index: todoIndexValue
        });
        inputText.value = "";
        renderTodos();
        updateLocalStorage();
    }
});

function renderTodos(){

        todosList.innerHTML = "";

        todos.forEach(function(todo, index){            
        var todoElementTemplate = document.querySelector("div#hollow li").cloneNode(true);
        todoElementTemplate.setAttribute('todo-index', index);
        todoElementTemplate.querySelector("span").innerText = todo.text;
        todosList.appendChild(todoElementTemplate);

        todoElementTemplate.querySelector("button").onclick = function(e) {
            var li = e.path[1];
            var todoIndex = li.getAttribute("todo-index");
            todos.splice(todoIndex, 1);
            updateLocalStorage();
            renderTodos();
        };
    });

        updateLocalStorage();
}


function updateLocalStorage(){
    localStorage.setItem("todos", JSON.stringify(todos));
}


function init(){
    var localStorageTodos = localStorage.todos;
    if (localStorageTodos != undefined){
      todos = JSON.parse(localStorageTodos);  
    }
    renderTodos(); 
}

init();










var inputTextP = document.querySelector("#todoTextPlan");
var todoIndexValueP = 0;
var todosListP = document.querySelector("#todoListPlan");

todosP = [];

$("#todoTextPlan").keypress(function(e){
    if (e.keyCode == 13) {
        todoIndexValueP++;
        todosP.push({
            text: inputTextP.value,
            isDone: false,
            index: todoIndexValueP
        });
        inputTextP.value = "";
        renderTodosP();
        updateLocalStorageP();
    }
});

function renderTodosP(){    
        todosListP.innerHTML = "";

        var activeTodos = todosP.filter(function (todo) {
            return !todo.isDone;
        });

        var doneTodos = todosP.filter(function (todo) {
            return todo.isDone;
        });

        var renderTodo = function(todo, index){            
         var todoElementTemplateP = document.querySelector("div#hollowPlan li").cloneNode(true);         
         todosListP.appendChild(todoElementTemplateP);
         todoElementTemplateP.setAttribute('todo-index', index);

         if (todo.isDone) {
            todoElementTemplateP.classList.add('todo-done');
            todoElementTemplateP.querySelector("input").checked = true;
         }


        todoElementTemplateP.querySelector("input").onchange = function(e){
            todo.isDone = e.path[0].checked;
            updateLocalStorageP();
            renderTodosP();
        };

        todoElementTemplateP.querySelector("span").innerText = todo.text;

        todoElementTemplateP.querySelector("button").onclick = function(e) {
            var li = e.path[1];
            var todoIndex = li.getAttribute("todo-index");
            todosP.splice(todoIndex, 1);
            updateLocalStorageP();
            renderTodosP();
        };

    };

        activeTodos.forEach(renderTodo); 
        doneTodos.forEach(renderTodo);

        updateLocalStorageP();
}


function updateLocalStorageP(){
    localStorage.setItem("todosP", JSON.stringify(todosP));
}


function initP(){
    var localStorageTodosP = localStorage.todosP;
    if (localStorageTodosP != undefined){
      todosP = JSON.parse(localStorageTodosP);  
    }
    renderTodosP(); 
}

initP();