
var inputDayName = document.querySelector("#dayName");

$("#dayName").change(function(e){
        dayNameRepository.updateDate({
            text: inputDayName.value,
        }, function () {          
        });
});


dayNameRepository.findDate(function (dateFromServer) {
	inputDayName.value = dateFromServer.text;
});

