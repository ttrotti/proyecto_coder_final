import express from 'express';
import cors from 'cors'
import logger from './lib/logger.js'
import cookieParser from 'cookie-parser';
import session from 'express-session';
import MongoStore from 'connect-mongo'
import path from 'path';
const __dirname = path.resolve();

import productRouter from './routers/prodRouter.js'
import cartRouter from './routers/cartRouter.js'
import userRouter from './routers/userRouter.js'

import bCrypt from 'bcrypt'
import passport from 'passport'
import passportLocal from 'passport-local'
import { User } from './models/User.js'

import dotenv from 'dotenv';
dotenv.config()

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser(process.env.COOKIESECRET))
app.use(session({
    store: MongoStore.create({  
        mongoUrl: `${process.env.MONGO_URI}`, 
        ttl: 600
    }),
    secret: process.env.SESSIONSECRET,
    resave: false,
    saveUninitialized: false,
}))
app.use(passport.initialize());
app.use(passport.session())
app.use(cors());

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
                    logger.info('User not found with username '+username);
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
                        logger.warn('User already exists'));
                } else {
                    let newUser = new User();
                    newUser.username = username;
                    newUser.password = createHash(password);
                    newUser.email = req.body.email;
                    newUser.firstName = req.body.firstName;
                    newUser.lastName = req.body.lastName;
                    newUser.age = req.body.age;
                    newUser.adress = req.body.adress;
                    newUser.telephone = req.body.telephone;

                    newUser.save(function(err){
                        if(err){
                            logger.error('Error in Saving user: '+err);
                            return done(err)
                        }
                        logger.info('User registration succesful');
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

// ROUTES 
app.use(express.static(path.join(__dirname, 'public')));
app.use('/api/carrito', cartRouter);
app.use('/api/productos', productRouter);
app.use('/', userRouter);

const PORT = 8080;
app.listen(PORT, () => {
    logger.info(`Servidor escuchando en el puerto ${PORT}`)
});

app.on('error', err => logger.error("Error message:" + err))