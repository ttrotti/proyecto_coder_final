import express from 'express';
import passport from 'passport'
import userController from '../controllers/userController.js'
import { upload } from '../lib/multer.js'
import fs from 'fs'

const router = express.Router();

router.get('/login', userController.showLogin)
router.post('/login', passport.authenticate('login') , userController.login);

// app.get('/uploads/:fileName', (req, res) => {
//     let fileName = req.params.fileName.trim();
//     let filePath = path.join(__dirname, `../uploads/${fileName}`);
//     if (fileName.length === 0 || !fs.existsSync(filePath)) {
//         return res
//             .status(404)
//             .json({ success: false, error: { msg: 'No encontrado' } });
//     }
//     res.sendFile(filePath);
// });

router.get('/signup', userController.showSignUp)
router.post('/signup', passport.authenticate('signup'), upload.single('profilePicture'), userController.signup)

router.get('/home', userController.showHome)

router.get('/logout', userController.logout)

export default router;