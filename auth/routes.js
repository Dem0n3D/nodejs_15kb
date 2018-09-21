const express = require("express");


const router = new express.Router();


router.route("/register")
    .get(function (req, res) {
        res.render("register.html");
    })
    .post(function (req, res) {
        req.checkBody('login', 'Name should be alphanumeric').isAlphanumeric();
        req.checkBody('login', 'Name can\'t be empty').notEmpty();
        req.checkBody('password', 'Empty password').notEmpty();
        req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

        var errors = req.validationErrors();
        if (errors) {
            res.render('register.html', {title: 'Register', errors: errors, fields: {login: req.body.login}});
        } else {
            res.send("OK");
        }
    });


module.exports = router;
