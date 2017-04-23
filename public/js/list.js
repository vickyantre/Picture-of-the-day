var inputText = document.querySelector("#todoText");
var todoIndexValue = 0;
var todosList = document.querySelector("#todoList");

$("#todoText").keypress(function(e){
    if (e.keyCode == 13) {
        todoIndexValue++;
        TodoRepository.push({
            text: inputText.value
        }, function (todoCreatedOnTheServer) {          
            renderTodos();
        });
        inputText.value = "";
    }
});

function renderTodos() {
        TodoRepository.findAll(function (todos) {
            todosList.innerHTML = "";

            todos.forEach(function(todo, index){            
            var todoElementTemplate = document.querySelector("div#hollow li").cloneNode(true);
            todoElementTemplate.setAttribute('todo-index', index);
            todoElementTemplate.querySelector("span").innerText = todo.text;
            todosList.appendChild(todoElementTemplate);

            todoElementTemplate.querySelector(".todo-remove").onclick = function(e) {
                TodoRepository.remove(todo);
                renderTodos();
            };
            todoElementTemplate.querySelector(".edit").onclick = function(e) {
                TodoRepository.remove(todo);
                inputText.value = todo.text;
                inputText.focus();
                renderTodos();
            };
        });
    });
}


renderTodos();


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

        todoElementTemplateP.querySelector("[data-text]").innerText = todo.text;

        todoElementTemplateP.querySelector(".todo-remove").onclick = function(e) {
            todosP.splice(index, 1);
            updateLocalStorageP();
            renderTodosP();
        };

        todoElementTemplateP.querySelector(".edit").onclick = function(e) {
            todosP.splice(index, 1);
            inputTextP.value = todo.text;
            inputTextP.focus();
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