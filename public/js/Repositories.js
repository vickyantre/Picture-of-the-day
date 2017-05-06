var TodoRepository = {
	push: function (data, cb) {
		$.post('/todo/create', data).then(function (todo) {
			cb(todo);
		});
	},
	remove: function (todo) {
		$.post('/todo/remove?id=' + todo._id);
	},
	findAll: function (day, callback) {
		$.get('/todo?day=' + day).then(function (todosFromServer) {
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
	findAll: function (day, callback) {
		$.get('/todoPlan?day=' + day).then(function (todosFromServer) {
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
	findDate: function (day, callback) {
		$.get('/dayName/find-date?day=' + day).then(function (dateFromServer) {
			callback(dateFromServer);
		}).fail(function (res) {
			if (res.status === 403) {			
				return location.href = '/lending.html';				
			}
			alert("Something went wrong! We'll fix it soon");
		});
	}

};

var PhotoRepository = {
	removePhoto: function (data, callback){
		$.post('/photo/remove-photo', data).then(function(photoFromServer){
			callback(photoFromServer);
		});
	},
	setMainPhoto: function(data, callback){
		$.post("/photo/setMain", data).then(function(photoFromServer){
			callback(photoFromServer);
		});
	}
};