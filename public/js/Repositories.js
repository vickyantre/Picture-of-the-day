var TodoRepository = {
	push: function (data, cb) {
		$.post('/todo/create', data).then(function (todo) {
			cb(todo);
		});
	},
	remove: function (todo) {
		$.post('/todo/remove?id=' + todo._id);
	},
	findAll: function (callback) {
		$.get('/todo').then(function (todosFromServer) {
			callback(todosFromServer);
		});
	}
};

var TodoPlanRepository = {
	push: function (data, cb) {
		$.post('/todoPlan/create', data).then(function (todo) {
			cb(todo);
		});
	},
	update: function (todo, data, cb) {
		$.post('/todoPlan/update?id=' + todo._id, data).then(function (todo) {
			cb(todo);
		});
	},
	remove: function (todo) {
		$.post('/todoPlan/remove?id=' + todo._id);
	},
	findAll: function (callback) {
		$.get('/todoPlan').then(function (todosFromServer) {
			callback(todosFromServer);
		});
	}
};

var dayNameRepository = {
	updateDate: function (data,cb){
		$.post("dayName/update-date/", data).then(function(dayName){
			cb(dayName);
		});
	},
	findDate: function (callback) {
		$.get('/dayName/find-date').then(function (dateFromServer) {
			callback(dateFromServer);
		});
	}

};