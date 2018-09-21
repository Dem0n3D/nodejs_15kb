const express = require("express");
const bcrypt = require('bcryptjs');

const {User} = require("./models");


const router = new express.Router();


router.route("/register")
    .get(function (req, res) {
        if (req.session.user_id) {
            res.redirect("/");
            return;
        }

        res.render("register.html");
    })
    .post(async function (req, res) {
        const u = await User.findOne({login: req.body.login});

        req.checkBody('login', 'Name should be alphanumeric').isAlphanumeric();
        req.checkBody('login', 'Login can\'t be empty').notEmpty();
        req.checkBody('login', 'Name already used').custom(value => u === null);
        req.checkBody('password', 'Empty password').notEmpty();
        req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

        var errors = req.validationErrors();
        if (errors) {
            res.render('register.html', {title: 'Register', errors: errors, fields: {login: req.body.login}});
        } else {
            try {
                const user = new User({
                    login: req.body.login,
                    password: await bcrypt.hash(req.body.password, await bcrypt.genSalt())
                });
                await user.save();
                res.redirect("/");
            } catch (e) {
                console.log(e);
            }
        }
    });


router.route("/login")
    .get(function (req, res) {
        if (req.session.user_id) {
            res.redirect("/");
            return;
        }

        res.render("login.html");
    })
    .post(async function (req, res) {
        const user = await User.findOne({login: req.body.login});

        if (user && await bcrypt.compare(req.body.password, user.password)) {
            req.session.user_id = user._id;
            res.redirect("/");
        } else {
            res.render("login.html", {errors: [{msg: "Incorrect login or password"}]});
        }
    });


module.exports = router;
