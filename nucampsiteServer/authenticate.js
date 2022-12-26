const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('./models/user');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const jwt = require('jsonwebtoken');

const config = require('./config.js');

// Using session based authentication
exports.local = passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

exports.getToken = user => {
    return jwt.sign(user, config.secretKey, {expiresIn: 3600}); // Expires in one hour
};

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken(); // Server expects a token to be set
opts.secretOrKey = config.secretKey;

// Export the JWT strategy
exports.jwtPassport = passport.use(
    new JwtStrategy(
        // Options
        opts,
        // Verify callback function
        (jwt_payload, done) => {
            console.log('JWT Payload:', jwt_payload);
            User.findOne({_id: jwt_payload._id}, (err, user) => {
                if (err) {
                    return done(err, false);
                } else if (user) {
                    return done(null, user);
                } else {
                    return done(null); // No error, but no user was found
                    // This could be a place to ask about creating a new user
                }
            })
        }
    )
);


exports.verifyUser = passport.authenticate('jwt', {session:false});
exports.verifyAdmin = (req, res, next) => {
    if (req.user.admin) {
        // User is an admin, continue to next middleware
        return next();
    } else {
        // User is not an Admin..
        const err = new Error("You are not authorized to perform this operation!");
        res.statusCode = 403;
        return next(err);
    }
}