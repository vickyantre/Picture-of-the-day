
var inputDayName = document.querySelector("#dayName");
var date = document.querySelector("#date");
var select = document.querySelector("#selectHow");

var currentDate = new Date();

if (location.hash.length > 0) {
	currentDate = new Date(location.hash.slice(1));
}

window.onhashchange = function () {
	currentDate = new Date(location.hash.slice(1));
	renderCurrentDay();
	renderTodosP();
	renderTodos();
};

currentDate.setHours(3, 0, 0, 0);

$("#dayName").change(function(e){
        dayNameRepository.updateDate({
            text: inputDayName.value,
            attitude: select.value,
            day: currentDate
        }, function () {          
       });
});

function renderCurrentDay() {
	dayNameRepository.findDate(currentDate, function (dateFromServer) {
		inputDayName.value = dateFromServer.text|| '';
		date.innerText = currentDate.getDate() + "." + (currentDate.getMonth()+1)  + "." + currentDate.getFullYear();
		select.value = dateFromServer.attitude || "best";
	});
}

renderCurrentDay();

$("#selectHow").change(function(e){
        dayNameRepository.updateDate({
            attitude: select.value,
            text: inputDayName.value,    
            day: currentDate,        
        }, function () {          
    });
});




