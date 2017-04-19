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

        todos.forEach(function(todo){            
        var todoElementTemplate = document.querySelector("div#hollow li").cloneNode(true);
        todoElementTemplate.querySelector("span").innerText = todo.text;
        todosList.appendChild(todoElementTemplate);

        todoElementTemplate.querySelector("button").onclick = function(e) {
            var li = e.path[1];
            todosList.removeChild(li);
        }
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

        todosP.forEach(function(todo){            
         var todoElementTemplateP = document.querySelector("div#hollowPlan li").cloneNode(true);


        todoElementTemplateP.querySelector("input").onchange = function(e){
            var li = e.path[1];

            if(e.path[0].checked) {
                li.classList.add("todo-done");
                $(li).parent().append($(li));
                todo.isDone = true;
            } else {
                li.classList.remove("todo-done");
                $(li).parent().prepend($(li));
                todo.isDone = false;
            }
            updateLocalStorageP();
        };

        todoElementTemplateP.querySelector("span").innerText = todo.text;
        todosListP.appendChild(todoElementTemplateP);

        todoElementTemplateP.querySelector("button").onclick = function(e) {
            var li = e.path[1];
            todosListP.removeChild(li);
        }

    });

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