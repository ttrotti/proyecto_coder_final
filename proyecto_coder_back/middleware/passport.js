import bCrypt from 'bcrypt'
import passport from 'passport'
import passportLocal from 'passport-local'
import User from '../models/User.js'

// PASSPORT
const LocalStrategy = passportLocal.Strategy

const isValidPassword = function(user, password) {
    return bCrypt.compareSync(password, user.password)
}

const createHash = function(password){
    return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null)
}

passport.use('login', new LocalStrategy({
        passReqToCallback: true
    },
    function(req, username, password, done) {
        User.findOne({ 'username': username },
            function(err, user) {
                if(err)
                    return done(err);
                if(!user) {
                    logger.trace('User not found with username '+username);
                    return done(null, false,
                        logger.error('error:', 'User not found.'));
            }

                if(!isValidPassword(user, password)){
                    logger.warn('Invalid Password');
                    return done(null, false,
                        logger.error('error:', 'Invalid Password'));
                }

                return done(null, user)
            }
        )
    }
));

passport.use('signup', new LocalStrategy({
    passReqToCallback: true
    },
    function(req, username, password, done) {
        const findOrCreateUser = function() {
            User.findOne({'username': username}, function(err, user) {
                if(err){
                    logger.error('Error in SignUp: '+err);
                    return done(err)
                }
                if(user) {
                    return done(null, false, 
                        logger.warn('message', 'User already exists'));
                } else {
                    let newUser = new User();
                    newUser.username = username;
                    newUser.password = createHash(password);
                    newUser.email = req.body.email;
                    newUser.firstName = req.body.firstName;
                    newUser.lastName = req.body.lastName;

                    newUser.save(function(err){
                        if(err){
                            logger.error('Error in Saving user: '+err);
                            return done(err)
                        }
                        logger.trace('User registration succesful');
                        return done(null, newUser)
                    });
                }
            });
        }
        process.nextTick(findOrCreateUser);
    }
));

passport.serializeUser(function(user, done) {
    done(null, user._id);
})

passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        done(err, user)
    })
})