import express from 'express';
import passport from 'passport'
import userController from '../controllers/userController.js'

const router = express.Router();

router.post('/login', passport.authenticate('login') , userController.login)

router.post('/signup', passport.authenticate('signup'), userController.signup)

router.get('/logout', userController.logout)

export default router;