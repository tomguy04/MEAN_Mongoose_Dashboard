// Require the Express Module
var express = require('express');
// Create an Express App
var app = express();
// Require body-parser (to receive post data from clients)

var mongoose = require('mongoose');
// This is how we connect to the mongodb database using mongoose -- "basic_mongoose" is the name of
//   our db in mongodb -- this should match the name of the db you are going to use for your project.
mongoose.connect('mongodb://localhost/mongoose_dashboard');
//Let's go ahead and make our first Schema that we will use to model Users. 
//Let's say that each user will have a name that is a string and an age that is a number. 
//The code to create a Schema is pretty simple as below

var AnimalSchema = new mongoose.Schema({
    name:String,
    color: String
})
mongoose.model('Animal',AnimalSchema); //we are settting this Schema in our Models as 'User. //User is the DB.  So you can do User.find{}
//Set the mongoose.model to the "User" variable so that we can run model-like methods on it to make all of the CRUD operations easier.
var Cat = mongoose.model('Animal'); //We are retrieving the Schema from out Models, named User. 

var bodyParser = require('body-parser');
// Integrate body-parser with our App
app.use(bodyParser.urlencoded({ extended: true }));
// Require path
var path = require('path');
// Setting our Static Folder Directory
app.use(express.static(path.join(__dirname, './static')));
// Use native promises
mongoose.Promise = global.Promise;
// Setting our Views Folder Directory
app.set('views', path.join(__dirname, './views'));
// Setting our View Engine set to EJS
app.set('view engine', 'ejs');
// Routes
// Root Request
app.get('/', function(req, res) {
    Cat.find({},function(err,theCats){
        if (err){
            console.log('there is an error in findings the Cats');
        }else{
            res.render('index',{cats:theCats});
        }
    }
)})
    
  

app.get('/cats/new', function(req, res) {
    res.render('makeCat');
})

app.post('/cats',function(req,res){
    console.log('POST DATA', req.body);
    var cat1 = new Cat({name:req.body.name, color:req.body.color});
        //try to save this quote to the db.
    cat1.save(function(err){
        if(err){
            console.log('error in saving the cat to the db!');
        }else{
            console.log('add the cat to the db!!')
            res.redirect('/');
        }
    })
})

app.get('/cats/:id',function(req,res){
    //Cat.find({'_id':id});
    Cat.find({'_id': req.params.id},function(err,theCat){
        if (err){
            console.log(`error while finding a cat with id ${req.params.id}`);
        }else{
            console.log(`got that cat! ${theCat}`);
            res.render('catProfile',{cat:theCat});
        }
    });
})
 

// Add User Request 
// app.post('/users', function(req, res) {
//     console.log("POST DATA", req.body);
//     // create a new User with the name and age corresponding to those from req.body
//     var user = new User({name: req.body.name, age: req.body.age});
//     // try to save that new user to the database (this method that actually inserts into the db) and run a callback
//     // function with an error (if any) from the operation.
//     user.save(function(err){
//         //if there is an error console.log that something went wrong!
//         if(err){
//             console.log('something went wrong');
//         } else//else console.log we did well and then redirect to the root route.
//             {
//                 console.log('successfully added a user!');
//                 res.redirect('/');
//             }
//         })
//     })
    

// Setting our Server to Listen on Port: 8000
app.listen(8000, function() {
    console.log("listening on port 8000");
})
