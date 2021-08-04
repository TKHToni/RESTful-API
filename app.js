//---------------------Reqs---------------------------------------------------//

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");

//---------------------Calling reqs-------------------------------------------//

const app = express();
app.use(express.static("public"));

app.use(bodyParser.urlencoded({extended: true}));

app.set("view engine", "ejs");

app.listen(3000, function(){
  console.log("Server started on port 3000");
});

//---------------------Mongoose and mongodb-----------------------------------//

mongoose.connect('mongodb://localhost:27017/wikiDB', {useNewUrlParser: true, useUnifiedTopology: true});

//--------------------Declaring Schemas and collections-----------------------//

//articles
const articleSchema = new mongoose.Schema({
  title: String,
  content: String
});

const Article = mongoose.model("Article", articleSchema);

//--------------------Routes---------------------------------------------------//

app.get("/articles", function(req, res){

  Article.find({}, function(err, result){
    if (!err) {
      res.send(result);
    } else {
      res.send(err);
    }
  });

});


app.post("/articles", function(req, res){
  console.log(req.body.title);
  console.log(req.body.content);

  const newArticle = new Article({
    title: req.body.title,
    content: req.body.content
  });

  newArticle.save(function(err){

    if (!err) {
      res.send("Successfully added a new article.");
    } else {
      res.send(err);
    }

  });
});

app.route("/articles/:articleTitle")
  .get(function(req, res){

    Article.find({title: req.params.articleTitle}, function(err, result){
      if (result) {
        res.send(result);
      } else {
        res.send("No articles matching that title were found");
      }
    });

  });

app.route("/articles")
  .delete(function(req, res){

    Article.deleteMany({}, function(err){
      if (!err) {
        res.send("Deleted all articles successfully");
      } else {
        res.semd(err);
      }
    });

  });
