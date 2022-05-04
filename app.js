const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const port = 3000;

const app = express();

mongoose.connect("mongodb://localhost:27017/wikiDB");

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');

// mongo db
const articleSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'field cannot be empty!']
    },
    content: {
        type: String,
        required: [true, 'content is required!']
    }
})/* schema */

const Article = mongoose.model('article', articleSchema); /*  articles model */

app.route('/articles')
    .get(
        function (req, res) {
            res.send('Home Screen for wiki App!');
            Article.find({}, function (err, results) {
                if (!err) {
                    res.send(results);
                } else {
                    res.send(err);
                }
            })
        }
    )
    .post(function (req, res) {
        const newArticle = new Article({
            title: req.body.title,
            content: req.body.content,
        });
        newArticle.save(function (err) {
            if (!err) {
                res.send('successfully added a new article');
            } else {
                res.send(err);
            }
        })
    })
    .deleteMany(function (err, res) {
        if (!err) {
            res.send('successfully deleted all articles')
        } else {
            res.send(err);
        }
    });

app.route('/articles/:title')
    .get(function (req, res) {
        const title = req.params.title;
        Article.findOne({ title: title }, function (err, articles) {
            if (!err) {
                res.send(articles);
            } else {
                res.send(err);
            }
        });
    })
    .put(function (req, res) {
        Article.update(
            { title: title },
            {overwrite: true},
            { title: req.body.title, content: req.body.content },
            function (err) {
                if (!err) {
                    res.send('successfully updated');
                } else {
                    res.send('failed to update!!!');
                }
            })
    }
    )
    .patch(function(req, res){
        Article.update(
            {title: title},
            {$set: req.body},
            function(err,results){
                if(!err){
                    res.send('successfully updated the content and title...');
                }
        })
    })
    .delete(function(req,res){

        Article.deleteOne({title: title},function(err){
            if(!err)
            {
            res.send('successfully deleted!')
        }
        })
    })





app.listen(port, function () {
    console.log('Server is running on port ', port);
})

