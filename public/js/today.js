var inputDayName = document.querySelector("#dayName");
var date = document.querySelector("#date");
var select = document.querySelector("#selectHow");

var currentDate = new Date();

if (location.hash.length > 0) {
    currentDate = new Date(location.hash.slice(1));
}

window.onhashchange = function() {
    currentDate = new Date(location.hash.slice(1));
    renderCurrentDay();
    renderTodosP();
    renderTodos();
    renderPicture();
};

currentDate.setHours(3, 0, 0, 0);

$("#dayName").change(function(e) {
    dayNameRepository.updateDate({
        text: inputDayName.value,
        attitude: select.value,
        day: currentDate
    }, function() {});
});

function renderCurrentDay() {
    dayNameRepository.findDate(currentDate, function(dateFromServer) {
        inputDayName.value = dateFromServer.text || '';
        date.innerText = currentDate.getDate() + "." + (currentDate.getMonth() + 1) + "." + currentDate.getFullYear();
        select.value = dateFromServer.attitude || "best";
    });
}

renderCurrentDay();

$("#selectHow").change(function(e) {
    dayNameRepository.updateDate({
        attitude: select.value,
        text: inputDayName.value,
        day: currentDate,
    }, function() {});
});

$('#uploadForm').submit(function(e) {
    e.preventDefault();

    var photos = $('#carousel-example-generic .item').length;

    if (photos >= 10) {
        $("#moreThat10").removeClass("display-none");
        setTimeout(function() {
            $("#moreThat10").addClass("display-none");
        }, 5000);
        return;

    }

    var data = new FormData(jQuery('#uploadForm')[0]);

    $.ajax({
        url: "/upload?day=" + currentDate,
        method: "POST",
        cache: false,
        contentType: false,
        processData: false,
        data: data
    }).then(function(res) {
        // $("#placeForPictures").html("");
        renderPicture();
    });

    return false;
});


$('#file').change(function() {
    $('#uploadForm').submit();
});

function renderBestDays() {
    dayNameRepository.findBestDays(function(days) {
        days.forEach(function(day) {
            var bestDay = $("#BestDaysTemplate > a").clone();
            var currentDate = new Date(day.day);

            bestDay.find(".panel-title").text(currentDate.getDate() + "." + (currentDate.getMonth() + 1) + "." + currentDate.getFullYear());
            bestDay.find(".panel-body").text(day.text);
            bestDay.attr("href", "today.html#" + currentDate.getFullYear() + "-" + (currentDate.getMonth() + 1) + "-" + currentDate.getDate());

            $("#placeForBestDays").append(bestDay);
        });
    });
}

renderBestDays();
