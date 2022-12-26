const express = require('express');
const User = require('../models/user');
const passport = require('passport');
const authenticate = require('../authenticate');

const router = express.Router();

/* GET users listing. */
router.get('/', function (req, res, next) {
    res.send('respond with a resource');
});

router.post('/signup', (req, res) => {
    User.register(
        new User({username: req.body.username}),
        req.body.password,
        err => {
            if (err) {
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                res.json({err: err});
            } else {
                passport.authenticate('local')(req, res, () => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json({success: true, status: 'Registration Successful'});
                });
            }
        }
    )
});

router.post('/login', passport.authenticate('local'), (req, res) => {
    // Login Successful, send a response
    const token = authenticate.getToken({_id: req.user.id});
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json({success: true, token, status: "You are successfully logged in!"});
});

router.get('/logout', (req, res, next) => {
    if (req.session) {
        // A session exists. Delete it
        req.session.destroy();
        res.clearCookie('session-id'); // Clear the cookie
        res.redirect('/'); // Redirect to main
    } else {
        // The session does not exist, logging out without being logged in
        const err = new Error('You are not logged in!');
        err.status = 401;
        return next(err);
    }
})

module.exports = router;
