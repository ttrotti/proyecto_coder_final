import nodemailer from 'nodemailer'
import {User} from '../models/User.js'

//EMAILS
const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'montana.hoppe15@ethereal.email',
        pass: 'VKx4Th1ecFQk39tkBX'
    }
});

export const sendMail = async (username, action) => {
    await User.findOne({username: username}, (err, docs) => {
        if(err) {
            console.log(err)
        } else {
            if(action == 'signup') {
                const mailOptions = {
                    from: 'Servidor Node.js',
                    to: `${process.env.ADMIN_MAIL}`,
                    subject: `Nuevo usuario registrado en nuestra web`,
                    html: `<h1>Se registró ${username}.</h1>
                    <ul>
                    <li>Nombre: ${docs.firstName}</li>
                    <li>Apellido: ${docs.lastName}</li>
                    <li>email: ${docs.email}</li>
                    <li>dirección: ${docs.adress}</li>
                    <li>edad: ${docs.age}</li>
                    <li>telefono: ${docs.telephone}</li>
                    </ul>`
                }
                return transporter.sendMail(mailOptions, (err, info) => {
                    if(err) {
                        console.log(err)
                        return err
                    }
                }) 
            } else {
            const mailOptions = {
                from: 'Servidor Node.js',
                to: `${docs.email}`,
                subject: `${action} en nuestra web`
            }
            if(action == 'login') {
                mailOptions.html = `<h1>Hola ${docs.firstName}</h1><br><p>Te logeaste a nuestra app el ${new Date()}</p>`
            }
            else if(action == 'logout') {
                mailOptions.html = `<h1>Hola ${docs.firstName}</h1><br><p>Te deslogeaste a nuestra app el ${new Date()}</p>`
            }
            else if(action == 'orden') {
                mailOptions.html = `<h1>Hola ${docs.firstName}</h1><br><p>Registramos tu compra el ${new Date()}, cuando esté disponible nos pondremos en contacto con vos</p>`
            }
            return transporter.sendMail(mailOptions, (err, info) => {
                if(err) {
                    console.log(err)
                    return err
                }
            })
        }
        }
    });
}