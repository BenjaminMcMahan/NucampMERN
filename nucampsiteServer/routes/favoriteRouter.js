const Favorite = require('../models/favorite');
const Campsite = require('../models/campsite');
const authenticate = require('../authenticate');
const cors = require('./cors');
const express = require("express");

const favoriteRouter = express.Router();
favoriteRouter.route('/')
    .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
    .get(cors.cors, authenticate.verifyUser, (req, res, next) => {
        Favorite.find({user: req.user._id})
            .populate('user')
            .populate('campsites')
            .then(favorite => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favorite);
            })
            .catch(err => next(err));

    })
    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Favorite.findOne({user: req.user._id})
            .then(favorite => {
                if (favorite) {
                    // Favorite already exists for this user
                    req.body.forEach(favItem => {
                        // Iterate through the provided array. Push any
                        if (!favorite.campsites.includes(favItem._id)) {
                            favorite.campsites.push(favItem._id);
                        }
                    });
                    favorite.save()
                        .then(favorite => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(favorite);
                        })
                        .catch(err => next(err));
                } else {
                    // Favorite does not exist for this user, create it
                    Favorite.create({
                        user: req.user._id,
                        campsites: req.body // No need to iterate to see if campsites exist because it's a new doc
                    })
                        .then(favorite => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(favorite);
                        })
                        .catch(err => next(err));
                }
            })
            .catch(err => next(err));
    })
    .put(cors.corsWithOptions, authenticate.verifyUser, (req, res) => {
        res.statusCode = 403;
        res.end(`POST operation not supported on /favorites/${req.params.campsiteId}`);
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Favorite.findOneAndDelete({user: req.user._id})
            .then(favorite => {
                if (favorite) {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(favorite);
                } else {
                    // Status code...? Assuming implicit 200
                    res.setHeader('Content-Type', 'text/plain');
                    res.end('You do not have any favorites to delete');
                }
            })
            .catch(err => next(err));
    });
favoriteRouter.route('/:campsiteId')
    .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
    .get(cors.cors, authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.end(`POST operation not supported on /favorites/${req.params.campsiteId}`);
    })
    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        // Let's see if the campsite even exists first..
        // And we're getting into nested conditional hell here. Refactoring needed
        Campsite.findById(req.params.campsiteId)
            .then(campsite => {
                if (!campsite) {
                    res.statusCode = 404;
                    res.setHeader('Content-Type', 'text/plain');
                    res.end('That campsite could not be found');
                } else {
                    Favorite.findOne({user: req.user._id})
                        .then(favorite => {
                            if (!favorite) {
                                /*
                                 No existing Favorite document, let's build one..
                                 Iterating over an empty Favorite.campsites array to see if a Campsite already exists
                                 seems very unnecessary here.
                                 */
                                Favorite.create({
                                    user: req.user._id,
                                    campsites: [req.params.campsiteId] // Array with the passed campsiteId
                                })
                                    .then(favorite => {
                                        res.statusCode = 200;
                                        res.setHeader('Content-Type', 'application/json');
                                        res.json(favorite);
                                    })
                                    .catch(err => next(err));
                            } else {
                                // Existing Favorite document, push the given ID if it does not exist
                                if (!favorite.campsites.includes(req.params.campsiteId)) {
                                    favorite.campsites.push(req.params.campsiteId);
                                    favorite.save()
                                        .then(favorite => {
                                            res.setHeader('Content-Type', 'application/json');
                                            res.json(favorite);
                                        })
                                        .catch(err => next(err));
                                } else {
                                    res.setHeader('Content-Type', 'text/plain');
                                    res.end('That campsite is already in the list of favorites!"');
                                }
                            }
                        })
                        .catch(err => next(err));
                }
            })
            .catch(err => next(err));
    })
    .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.end(`POST operation not supported on /favorites/${req.params.campsiteId}`);
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Favorite.findOne({user: req.user._id})
            .then(favorite => {
                if (favorite) {
                    favorite.campsites.splice(favorite.campsites.indexOf(req.params.campsiteId), 1);
                    favorite.save()
                        .then(favorite => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(favorite);
                        })
                        .catch(err => next(err));
                } else {
                    res.statusCode = 404; // why not..
                    res.setHeader('Content-Type', 'text/plain');
                    res.end('There are no favorites to delete');
                }
            });
    });

module.exports = favoriteRouter;