import nodemailer from 'nodemailer'
import {User} from '../models/User.js'
import logger from '../lib/logger.js';

// //EMAILS
// const transporter = nodemailer.createTransport({
//     host: 'smtp.ethereal.email',
//     port: 587,
//     auth: {
//         user: 'cordell36@ethereal.email',
//         pass: 'vz4PfkfHY5zQqtWeVm'
//     }
// });

// const gmailTransporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//         user: process.env.GMAIL_USER,
//         pass: process.env.GMAIL_PASS
//     }
// })

// const sendEmail = async (username, action) => {
//     await User.findOne({username: username}, (err, docs) => {
//         if(err) {
//             console.log(err)
//         } else {
//             const mailOptions = {
//                 from: 'Servidor Node.js',
//                 to: `${docs.email}`,
//                 subject: `${action} a nuestra web`,
//                 html: `<h1>Hola ${docs.firstName}</h1><br><p>Te logeaste a nuestra app el ${new Date()}</p>`
//             }
//             transporter.sendMail(mailOptions, (err, info) => {
//                 if(err) {
//                     console.log(err)
//                     return err
//                 }
//             }) 
//             gmailTransporter.sendMail(mailOptions, (err, info) => {
//                 if(err) {
//                     console.log(err)
//                     return err
//                 }
//             }) 
//         }
//     });
// }

// CONTROLLER

class userController {
    async login(req, res) {
        const username = req.body.username;
        if(!username) {

        }
        req.session.password = req.body.password
        req.session.username = username

        sendEmail(username, 'Log In')
    }

    async signup(req, res) {
        const username = req.user.username;
        if(!username) {
            return res.json({
                error: "Debes agregar un nombre de usuario"
            })
        }
        req.session.password = req.user.password
        req.session.username = username
        req.session.email = req.user.email
        // sendEmail(username, 'Sign Up')
        const newUser = await User.findOne({username: username}, {_id: 0, password: 0, __v: 0})
        if(!newUser) {
            return res.json({
                error: "Algo salió mal"
            })
        }
        res.json(newUser)
    }

    logout(req, res) {
        const username = req.session.username;
        req.session.destroy();
        sendEmail(username, 'Log Out')
    }
}

export default new userController();