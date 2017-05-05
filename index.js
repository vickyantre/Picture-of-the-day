var express = require("express");
var app = express();

var multer = require("multer");
const fs = require('fs');
const mkdirp = require('mkdirp');
const sharp = require('sharp');
var path = require('path');
var bodyParser = require('body-parser');

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/pod');

var TodoModel = mongoose.model('Todo', {
    day: Date,
    text: String, 
    day: Date,
    isDone: Boolean 
});
var TodoModelPlan = mongoose.model('TodoPlan', { day: Date, text: String, isDone: Boolean });
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
    var day = new Date(req.query.day);
  day.setHours(3, 0, 0, 0);

    TodoModel.find({day: day}, function (err, todos) {
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
  var day = new Date(req.body.day);
  day.setHours(3, 0, 0, 0);
  var data = req.body;
  data.day = day;

    var newTodoModel = new TodoModel(data);
    newTodoModel.save(function (err) {
       if (err) {
        console.log(err);
      } else {
        res.send(newTodoModel);
      }
    });

});

app.get('/todoPlan', function(req, res) {
  var day = new Date(req.query.day);
  day.setHours(3, 0, 0, 0);

    TodoModelPlan.find({day: day}, function (err, todosP) {
        if (err) return console.error(err);
        res.send(todosP);
    });
});

app.post('/todoPlan/create', function (req,res) {

  var day = new Date(req.body.day);
  day.setHours(3, 0, 0, 0);

  var data = req.body;
  data.day = day;

    var newTodoModelPlan = new TodoModelPlan(data);
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
  var day = new Date(req.body.day);
  day.setHours(3, 0, 0, 0);

  DayNameModel.findOne({ 'day': day }, function (err, record) {
    if (record) {
      record.text = req.body.text; 
      record.attitude = req.body.attitude;    
    } else {
      record = new DayNameModel({
        day: day,
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
  var day = new Date(req.query.day);
  day.setHours(3, 0, 0, 0);

  DayNameModel.findOne({ 'day': day }, function (err, record) {
    var data = {};
    if (record) {
      data = record.toJSON();
    }

    var dayFormatted = [day.getFullYear(), day.getMonth() + 1, day.getDate()].join('-');
    data.mainPhoto = 'photos/' + dayFormatted + "/mainPhoto.jpg";

    res.send(data);
  });
});


// Збереження картинок
var storage = multer.diskStorage({
    destination: function(req, file, cb) {  
        var day = [req.day.getFullYear(), req.day.getMonth() + 1, req.day.getDate()].join('-');
        var destination = './public/photos/' + day;
        mkdirp(destination, function() {
          cb(null, destination);
        });        
    },
    filename: function(req, file, cb) {
        cb(null, file.originalname);
    }
});

var upload = multer({ storage: storage });

app.post('/upload', function(req, res, next) {
    var day = new Date(req.query.day);
    day.setHours(3, 0, 0, 0);

    req.day = day;

    next();
}, upload.single('file'), function (req, res) {
    res.send();
});

// відображення фото в слайдері
app.post('/pictures', function(req, res) {
    var day = new Date(req.query.day);
    day.setHours(3, 0, 0, 0);

    var dayFormatted = [day.getFullYear(), day.getMonth() + 1, day.getDate()].join('-');

    var images;
    fs.readdir(path.join(__dirname, './public/photos/' + dayFormatted + "/"), function(err, files) {
      if (err) {
        res.send([]);
      } else {
        images = files.filter(function (file) {
          if (file == "mainPhoto.jpg"){
            return false;
          } else{
            console.log(file);
            return true;     
          }     
        })
        .map(function(file) {
                return './photos/' + dayFormatted + "/" + file;
            });

            res.send(images);
          }
        });
    
});

// Видалення фото 
app.post('/photo/remove-photo', function(req, res) {

    var day = new Date(req.body.day);
    day.setHours(3, 0, 0, 0);

    var dayFormatted = [day.getFullYear(), day.getMonth() + 1, day.getDate()].join('-');
    var file = req.body.image;

    var pathToFile = './public/photos/' + dayFormatted + "/" + path.parse(file).base;
    fs.unlink(pathToFile, function (err) {
      if (err) {
        console.log(err);
      }

      res.send();
    });
  
});

// Головне фото
app.post('/photo/setMain', function(req, res) {

    var day = new Date(req.body.day);
    day.setHours(3, 0, 0, 0);

    var dayFormatted = [day.getFullYear(), day.getMonth() + 1, day.getDate()].join('-');
    var file = req.body.image;

    var pathToFile = './public/photos/' + dayFormatted + "/" + path.parse(file).base;
    var mainFile = './public/photos/' + dayFormatted + "/mainPhoto.jpg";

    sharp(pathToFile)
      .resize(340, 510)
      .toFile(mainFile, function(err) {
        if (err) {
          console.log(err);
        }
        res.send({
          mainPhoto: 'photos/' + dayFormatted + "/mainPhoto.jpg"
        });
      });
});

