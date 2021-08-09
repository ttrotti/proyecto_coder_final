import {User} from '../models/User.js'
import logger from '../lib/logger.js';
import path from 'path';
import { sendMail } from '../lib/mailer.js'
const __dirname = path.resolve();

// CONTROLLER

class userController {
    async login(req, res) {
        const username = req.body.username;
        if(!username) {

        }
        req.session.password = req.body.password
        req.session.username = username
        sendMail(username, 'login')
        res.json()
    }

    async showLogin(req, res) {
        if(req.session.username) return
        res.sendFile(path.join(__dirname, './public/login.html'))
    }

    async signup(req, res) {
        const username = req.user.username;
        sendMail(username, 'signup')
        const newUser = await User.findOne({username: username}, {_id: 0, password: 0, __v: 0})
        if(!newUser) {
            return res.json({
                error: "Algo salió mal"
            })
        } else {
            logger.info(`Usuario ${username} creado con éxito`)
            return res.json(newUser)
        }
    }

    showSignUp(req, res) {
        res.sendFile(path.join(__dirname, './public/signup.html'))
    }

    showHome(req, res) {
        return res.sendFile(path.join(__dirname, './public/home.html'))
    }

    logout(req, res) {
        const username = req.session.username;
        sendMail(username, 'logout')
        req.session.destroy();
        return res.json(`${username} just logged out`)
    }
}

export default new userController();