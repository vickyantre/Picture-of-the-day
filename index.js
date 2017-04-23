var express = require("express");
var app = express();

var path = require('path');
var bodyParser = require('body-parser');

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/pod');

var TodoModel = mongoose.model('Todo', { text: String, isDone: Boolean });

// var kitty = new Cat({ name: 'Alisa' });
// kitty.save(function (err) {
//   if (err) {
//     console.log(err);
//   } else {
//     console.log('meow');
//   }
// });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))

app.use('/', express.static(path.join(__dirname, 'public')))

app.get('/about', function(req, res) {
    res.send("This is about page !");
});

app.get('/todo', function(req, res) {
    TodoModel.find(function (err, todos) {
        if (err) return console.error(err);
        res.send(todos);
    });
});

app.post('/todo/remove', function(req, res) {
    TodoModel.remove({_id: req.query.id}, function (err) {
      if (err) return console.error(err);
      res.send();
    });
});

app.post('/todo/create', function(req, res) {
    var newTodoModel = new TodoModel(req.body);
    newTodoModel.save(function (err) {
       if (err) {
        console.log(err);
      } else {
        res.send(newTodoModel);
      }
    });

});

app.listen(3000, function() {
    console.log("Server is working on http://localhost:3000/");
});