google.charts.load('current', {
    'packages': ['corechart']
});
google.charts.setOnLoadCallback(drawChart);

function drawChart() {

    renderGlobalStatistic();
    render30DayStatistic();    
}

function render30DayStatistic() {
    dayNameRepository.find30DayStatistic(function(res) {
        renderStatisticChart('thirty-days-chart', res, "For last 30 days");       
    });
}

function renderStatisticChart(id, res, title) {
     var data = [
            ['Attitude', 'Days']
        ];

        var resByDay = {};

        res.forEach(function(item) {
            resByDay[item._id] = item.count;
        });
        data.push(['best days', resByDay.best || 0]);
        data.push(['great days', resByDay.great || 0]);
        data.push(['normal days', resByDay.normal || 0]);
        data.push(['awful days', resByDay.awful || 0]);


        var _data = google.visualization.arrayToDataTable(data);

        var options = {
            legend: {
                position: 'none'
            },
            title: null,
            'chartArea': {'width': '100%', 'height': '80%'},
            colors: ['#18bc9c', '#28e8c2', 'lightgrey', '#ffcb78']
        };

        var chart = new google.visualization.PieChart(document.getElementById(id));

        chart.draw(_data, options);
}


function renderGlobalStatistic() {
    dayNameRepository.findStatistic(function(res) {
        renderStatisticChart('piechart', res, "For all time");
    });
}
