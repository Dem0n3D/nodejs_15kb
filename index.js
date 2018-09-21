const express = require("express");
const nunjucks = require('nunjucks');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');

const auth_router = require("./auth/routes");


const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(expressValidator());

nunjucks.configure('views', {
    autoescape: true,
    express: app
});


app.use("/auth", auth_router);

app.get("/", function (req, res, next) {
    res.send("Hello world!");
});


app.listen(4000, function () {
    console.log('Example app listening on port 4000!');
});
