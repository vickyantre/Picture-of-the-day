var express = require("express");
var app = express();

var path = require('path');
var bodyParser = require('body-parser');

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/pod');

var TodoModel = mongoose.model('Todo', { 
    text: String, 
    day: Date,
    isDone: Boolean 
});
var TodoModelPlan = mongoose.model('TodoPlan', { text: String, isDone: Boolean });
var DayNameModel = mongoose.model('dayName', { text: String, day: Date, attitude: String});

// var kitty = new Cat({ name: 'Alisa' });
// kitty.save(function (err) {
//   if (err) {
//     console.log(err);
//   } else {
//     console.log('meow');
//   }
// });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/', express.static(path.join(__dirname, 'public')));

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

app.get('/todoPlan', function(req, res) {
    TodoModelPlan.find(function (err, todosP) {
        if (err) return console.error(err);
        res.send(todosP);
    });
});

app.post('/todoPlan/create', function (req,res){
    var newTodoModelPlan = new TodoModelPlan(req.body);
    newTodoModelPlan.save(function (err) {
       if (err) {
        console.log(err);
      } else {
        res.send(newTodoModelPlan);
      }
    });
});

app.post('/todoPlan/update', function (req,res){
    TodoModelPlan.update({ _id: req.query.id }, { $set: req.body}, function () {
        res.send();
    });
});

app.post('/todoPlan/remove', function(req, res) {
    TodoModelPlan.remove({_id: req.query.id}, function (err) {
      if (err) return console.error(err);
      res.send();
    });
});

app.listen(3000, function() {
    console.log("Server is working on http://localhost:3000/");
});

app.post('/dayName/update-date', function (req,res){
  var now = new Date();
  now.setHours(3, 0, 0, 0);

  DayNameModel.findOne({ 'day': now }, function (err, record) {
    if (record) {
      record.text = req.body.text; 
      record.attitude = req.body.attitude;    
    } else {
      record = new DayNameModel({
        day: now,
        text: req.body.text,
        attitude: req.body.attitude,
      });
    }
     record.save(function () {
        res.send(record);
      });
  });
});

app.get('/dayName/find-date', function (req,res){
  var now = new Date();
  now.setHours(3, 0, 0, 0);

  DayNameModel.findOne({ 'day': now }, function (err, record) {
    res.send(record);
  });
});