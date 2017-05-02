
var inputDayName = document.querySelector("#dayName");
var date = document.querySelector("#date");
var select = document.querySelector("#selectHow")

$("#dayName").change(function(e){
        dayNameRepository.updateDate({
            text: inputDayName.value,
            attitude: select.value,
        }, function () {          
        });
});


dayNameRepository.findDate(function (dateFromServer) {
	inputDayName.value = dateFromServer.text|| '';
	var day = new Date(dateFromServer.day);
	date.innerText = day.getDate() + "." + (day.getMonth()+1)  + "." + day.getFullYear();
	select.value = dateFromServer.attitude || "best";
});

$("#selectHow").change(function(e){
        dayNameRepository.updateDate({
            attitude: select.value,
            text: inputDayName.value,            
        }, function () {          
    });
});




