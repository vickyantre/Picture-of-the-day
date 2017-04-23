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