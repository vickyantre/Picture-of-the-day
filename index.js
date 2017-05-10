var express = require("express");
var app = express();

var multer = require("multer");
const fs = require('fs');
const mkdirp = require('mkdirp');
const sharp = require('sharp');
const crypto = require('crypto');
var path = require('path');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var RedisStore = require('connect-redis')(session);

var mongoose = require('mongoose');
var random = require('mongoose-simple-random');
mongoose.connect('mongodb://localhost/pod');

var TodoModel = mongoose.model('Todo', {
    day: Date,
    text: String,
    day: Date,
    user_id: mongoose.Schema.Types.ObjectId,
    isDone: Boolean
});
var TodoModelPlan = mongoose.model('TodoPlan', {
    day: Date,
    text: String,
    user_id: mongoose.Schema.Types.ObjectId,
    isDone: Boolean
});


var DayNameSchema = new mongoose.Schema({
    text: String,
    day: Date,
    user_id: mongoose.Schema.Types.ObjectId,
    attitude: String
});
DayNameSchema.plugin(random);

var DayNameModel = mongoose.model('dayName', DayNameSchema);

var UserSchema = new mongoose.Schema({
    email: String,
    hashed_password: String,
    salt: String
});

UserSchema.methods.authenticate = function(plainText) {
    return this.encryptPassword(plainText) === this.hashed_password;
};
UserSchema.methods.makeSalt = function(plainText) {
    return Math.round((new Date().valueOf() * Math.random())) + '';
};
UserSchema.methods.encryptPassword = function(password) {
    return crypto.createHmac('sha1', this.salt).update(password).digest('hex');
};
UserSchema.methods.encryptPassword = function(password) {
    return crypto.createHmac('sha1', this.salt).update(password).digest('hex');
};

UserSchema.virtual('password')
    .set(function(password) {
        this._password = password;
        this.salt = this.makeSalt();
        this.hashed_password = this.encryptPassword(password);
    });
var UserModel = mongoose.model('User', UserSchema);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({ secret: 'as**21LLD blue tabby point t', store: new RedisStore() }));
app.use(cookieParser());

app.use('/', express.static(path.join(__dirname, 'public')));

app.get('/about', function(req, res) {
    res.send("This is about page !");
});

function loadUser(req, res, next) {
    if (req.session.user_id) {
        UserModel.findById({ _id: req.session.user_id }, function(err, user) {
            if (user) {
                req.currentUser = user;
                next();
            } else {
                res.status(403).send();
            }
        });
    } else {
        res.status(403).send();
    }
}


app.get('/todo', loadUser, function(req, res) {
    var day = new Date(req.query.day);
    day.setHours(3, 0, 0, 0);

    TodoModel.find({ day: day, user_id: req.currentUser._id }, function(err, todos) {
        if (err) return console.error(err);
        res.send(todos);
    });
});

app.post('/todo/remove', loadUser, function(req, res) {
    TodoModel.remove({ _id: req.query.id, user_id: req.currentUser._id }, function(err) {
        if (err) return console.error(err);
        res.send();
    });
});

app.post('/todo/create', loadUser, function(req, res) {
    var day = new Date(req.body.day);
    day.setHours(3, 0, 0, 0);
    var data = req.body;
    data.day = day;

    var newTodoModel = new TodoModel(data);
    newTodoModel.user_id = req.currentUser._id;
    newTodoModel.save(function(err) {
        if (err) {
            console.log(err);
        } else {
            res.send(newTodoModel);
        }
    });

});

app.get('/todoPlan', loadUser, function(req, res) {
    var day = new Date(req.query.day);
    day.setHours(3, 0, 0, 0);

    TodoModelPlan.find({ day: day, user_id: req.currentUser._id }, function(err, todosP) {
        if (err) return console.error(err);
        res.send(todosP);
    });
});

app.post('/todoPlan/create', loadUser, function(req, res) {

    var day = new Date(req.body.day);
    day.setHours(3, 0, 0, 0);

    var data = req.body;
    data.day = day;

    var newTodoModelPlan = new TodoModelPlan(data);
    newTodoModelPlan.user_id = req.currentUser._id;
    newTodoModelPlan.save(function(err) {
        if (err) {
            console.log(err);
        } else {
            res.send(newTodoModelPlan);
        }
    });
});

app.post('/todoPlan/update', loadUser, function(req, res) {
    TodoModelPlan.update({ _id: req.query.id, user_id: req.currentUser._id }, { $set: req.body }, function() {
        res.send();
    });
});

app.post('/todoPlan/remove', loadUser, function(req, res) {
    TodoModelPlan.remove({ _id: req.query.id, user_id: req.currentUser._id }, function(err) {
        if (err) return console.error(err);
        res.send();
    });
});

app.listen(3000, function() {
    console.log("Server is working on http://localhost:3000/");
});

app.post('/dayName/update-date', loadUser, function(req, res) {
    var day = new Date(req.body.day);
    day.setHours(3, 0, 0, 0);

    DayNameModel.findOne({ 'day': day, user_id: req.currentUser._id }, function(err, record) {
        if (record) {
            record.text = req.body.text;
            record.attitude = req.body.attitude;
        } else {
            record = new DayNameModel({
                day: day,
                user_id: req.currentUser._id,
                text: req.body.text,
                attitude: req.body.attitude,
            });
        }
        record.save(function() {
            res.send(record);
        });
    });
});

app.get('/dayName/find-by-month', loadUser, function(req, res) {
    var startOfMonth = new Date(req.query.month);
    startOfMonth.setDate(1);
    var endOfMonth = new Date(startOfMonth.getFullYear(), startOfMonth.getMonth() + 1, 1);

    DayNameModel.find({ 'day': { $gte: startOfMonth, $lt: endOfMonth }, user_id: req.currentUser._id }, function(err, days) {
        if (err) {
            console.log(err);
        }
        res.send(days);
    });
});

app.get('/dayName/find-best-days', loadUser, function(req, res) {

    DayNameModel.findRandom({ 'attitude': 'best', user_id: req.currentUser._id }, {}, {limit: 5}, function (err, days) {
        if (err) {
                console.log(err);
            }
            res.send(days);
        });
      

});

app.get('/dayName/find-date', loadUser, function(req, res) {
    var day = new Date(req.query.day);
    day.setHours(3, 0, 0, 0);

    DayNameModel.findOne({ 'day': day, user_id: req.currentUser._id }, function(err, record) {
        res.send(record);
    });
});

app.get('/dayName/statistic', loadUser, function(req, res) {
    var match = {user_id: req.currentUser._id };

    DayNameModel.aggregate([
        {
            $match: match
        },
        {
            $group: {
                _id: '$attitude',
                count: {$sum: 1}
            }
        }
    ], function (err, result) {
        if (err) {
           console.error(err);
       }
        
            res.send(result);
    });
});

app.get('/dayName/30-day-statistic', loadUser, function(req, res) {
    var startDate = new Date();
    startDate.setHours(3, 0, 0, 0);
    startDate.setDate(startDate.getDate() - 30);

    var match = {
        user_id: req.currentUser._id,
        day: {
            "$gte": startDate,
        }
    };

    DayNameModel.aggregate([
        {
            $match: match
        },
        {
            $group: {
                _id: '$attitude',
                count: {$sum: 1}
            }
        }
    ], function (err, result) {
        if (err) {
           console.error(err);
       }
        
            res.send(result);
    });
});


// Збереження картинок
var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        var destination = './public/' + getPhotoDir(req.currentUser, req.day);
        mkdirp(destination, function() {
            cb(null, destination);
        });
    },
    filename: function(req, file, cb) {
        cb(null, file.originalname);
    }
});

var upload = multer({ storage: storage });

app.post('/upload', loadUser, function(req, res, next) {
    var day = new Date(req.query.day);


    req.day = day;

    next();
}, upload.single('file'), function(req, res) {
    var day = req.day;

    var thumbPath = path.parse(req.file.path);
    thumbPath.base = thumbPath.name + '_thumb.jpg';

    sharp(req.file.path)
        .resize(900, 900)
        .max()
        .toFile(path.format(thumbPath), function(err) {
            if (err) {
                console.log(err);
            }
            fs.unlink(req.file.path, function() {
                var photoDir = getPhotoDir(req.currentUser, day);
                fs.readdir(path.join(__dirname, './public/' + photoDir + "/"), function(err, files) {
                    if (files.length == 1) {
                        var file = files[0];

                        var pathToFile = photoDir + "/" + path.parse(file).base;
                        setMainPhoto(pathToFile, function(mainPhoto) {
                            res.send({ mainPhoto: mainPhoto });
                        });
                    } else {
                        res.send();
                    }
                });
            });
        });


});

// відображення фото в слайдері
app.post('/pictures', loadUser, function(req, res) {
    var day = new Date(req.query.day);
    var photoDir = getPhotoDir(req.currentUser, day);

    var images;
    fs.readdir(path.join(__dirname, './public/' + photoDir + "/"), function(err, files) {
        var mainPhoto;
        var images = [];
        if (!err) {
            files.forEach(function(file) {
                if (file === 'mainPhoto.jpg') {
                    mainPhoto = '.' + photoDir + "/" + file;
                } else {
                    images.push(photoDir + "/" + file);
                }
            });
        }
        res.send({
            mainPhoto: mainPhoto,
            images: images
        });
    });

});

// Видалення фото 
app.post('/photo/remove-photo', loadUser, function(req, res) {

    var day = new Date(req.body.day);
    var photoDir = getPhotoDir(req.currentUser, day);

    var file = req.body.image;

    var pathToFile = './public/' + photoDir + "/" + path.parse(file).base;
    fs.unlink(pathToFile, function(err) {
        if (err) {
            console.log(err);
        }

        res.send();
    });

});

// Головне фото
app.post('/photo/setMain', loadUser, function(req, res) {

    var day = new Date(req.body.day);


    var photoDir = getPhotoDir(req.currentUser, day);

    var file = req.body.image;

    var pathToFile = photoDir + "/" + path.parse(file).base;
    setMainPhoto(pathToFile, function(mainPhoto) {
        res.send({ mainPhoto: mainPhoto });
    });
});

app.post('/sessions/create', function(req, res) {
    UserModel.findOne({ email: req.body.email }, function(err, user) {
        if (user) {
            if (user.authenticate(req.body.password)) {
                req.session.user_id = user._id;
                res.send({ success: true });
            } else {
                res.send({ success: false });
            }
        } else {
            res.send({ success: false });
        }

    });
});

app.post('/sessions/destroy', function(req, res) {
   delete req.session.user_id;
   res.send(); 
});

app.post('/users/create', function(req, res) {
    UserModel.findOne({ email: req.body.email }, function(err, user) {
        if (user) {
            res.send({ success: false });
            return;
        }

        user = new UserModel();
        user.email = req.body.email;
        user.password = req.body.password;
        user.save(function(err) {
            req.session.user_id = user._id;
            res.send({ success: true });
        });
    });
});


function getPhotoDir(user, day) {
    day.setHours(3, 0, 0, 0);

    var dayFormatted = [day.getFullYear(), day.getMonth() + 1, day.getDate()].join('-');

    return "/photos/" + user._id + "/" + dayFormatted;
}

function setMainPhoto(pathToFile, cb) {
    var mainFile = path.dirname(pathToFile) + "/mainPhoto.jpg";

    sharp('./public' + pathToFile)
        .resize(340, 510)
        .toFile('./public' + mainFile, function(err) {
            if (err) {
                console.log(err);
            }
            cb(mainFile);
        });
}
