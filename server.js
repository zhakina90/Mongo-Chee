// Dependencies
var express = require("express");
var exphbs = require('express-handlebars');
// var mongojs = require("mongojs");
var mongoose = require("mongoose");

var PORT = process.env.PORT || 3000;

var axios = require("axios");
var cheerio = require("cheerio");
var path = require("path");

var app = express();
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
console.log('this is __dirname', __dirname);
var db = require("./module");
// console.log(db);

// app.use(express.static(path.join(__dirname, "./public")));
app.use("/public", express.static(path.join(__dirname, 'public')));


// mongoose.connect("mongodb://localhost/userdb", { useNewUrlParser: true });

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/userdb";

mongoose.connect(MONGODB_URI, { useNewUrlParser: true });


// var db = mongojs(databaseUrl, collections);
// db.on("error", function (error) {
//     console.log("Database Error:", error);
// });


app.get("/", function (req, res) {
    res.render('home');
});

app.get("/scraping-articles", function (req, res) {
    // Make a request via axios for the news section of `ycombinator`
    axios.get("https://www.nytimes.com/").then(function (response) {
        // Load the html body from axios into cheerio
        var $ = cheerio.load(response.data);
        // For each element with a "title" class
        $(".css-z49qw6").each(function (i, element) {
            // Save the text and href of each link enclosed in the current element
            var article = $(this).find("article").text().trim();
            // console.log(article);

            // var article = $(element).attr("article").
            var link = $(element).children("a").attr("href");
            if (article && link) {
                // Insert the data in the db
                db.articles.insert({
                    article: article,
                    link: link

                },
                    function (err, inserted) {
                        if (err) {
                            // Log the error if one is encountered during the query
                            console.log(err);
                        }
                        else {
                            // Otherwise, log the inserted data
                            console.log(inserted);
                        }
                    });
            }
        });
    });

    // Send a "Scrape Complete" message to the browser
    res.render("scraped");
});


// Retrieve data from the db
app.get("/all-articles", function (req, res) {
    // Find all results from the collection in the db
    db.Articles.find({}, function (error, found) {
        // Throw any errors to the console
        if (error) {
            console.log(error);
        }
        // If there are no errors, send the data to the browser as json
        else {
            res.json(found);
            console.log(found);

        }
    });
});
// Clear the DB
app.get("/clear", function (req, res) {

    db.notes.remove({}, function (error, resp) {
        // Log any errors to the console
        if (error) {
            console.log(error);
            res.send(error);
        }
        else {

            console.log(resp);
            res.send(resp);
        }
    });
});

app.listen(PORT, function () {
    console.log("App running on port" + PORT);
});
