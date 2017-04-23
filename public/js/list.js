var inputText = document.querySelector("#todoText");
var todosList = document.querySelector("#todoList");
var today = new Date();

$("#todoText").keypress(function(e){
    if (e.keyCode == 13) {
        TodoRepository.push({
            text: inputText.value,
            day: new Date() ,
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
var todosListP = document.querySelector("#todoListPlan");

$("#todoTextPlan").keypress(function(e){
    if (e.keyCode == 13) {
        TodoPlanRepository.push({
            text: inputTextP.value,
            isDone: false,
        }, function (todoCreatedOnTheServer) {          
            renderTodosP();
        });
        inputTextP.value = "";
    }
});

function renderTodosP(){ 
    TodoPlanRepository.findAll(function (todosP) {
        todosListP.innerHTML = "";

        var activeTodos = todosP.filter(function (todo) {
            return !todo.isDone;
        });

        var doneTodos = todosP.filter(function (todo) {
            return todo.isDone;
        });

        var renderTodo = function(todo){            
         var todoElementTemplateP = document.querySelector("div#hollowPlan li").cloneNode(true);         
         todosListP.appendChild(todoElementTemplateP);

         if (todo.isDone) {
            todoElementTemplateP.classList.add('todo-done');
            todoElementTemplateP.querySelector("input").checked = true;
         }


        todoElementTemplateP.querySelector("input").onchange = function(e){
            todo.isDone = e.path[0].checked;
            TodoPlanRepository.update(todo, {isDone: todo.isDone}, function () {            
                renderTodosP();                
            });
        };

        todoElementTemplateP.querySelector("[data-text]").innerText = todo.text;

        todoElementTemplateP.querySelector(".todo-remove").onclick = function(e) {
            TodoPlanRepository.remove(todo);
            renderTodosP();
        };

        todoElementTemplateP.querySelector(".edit").onclick = function(e) {
            TodoPlanRepository.remove(todo);
            inputTextP.value = todo.text;
            inputTextP.focus();
            renderTodosP();
        };

    };

        activeTodos.forEach(renderTodo); 
        doneTodos.forEach(renderTodo);

});
}


renderTodosP();