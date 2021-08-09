import multer from 'multer'
import path from 'path'

export const upload = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, path.join(__dirname, `../uploads`));
        },
        filename: (req, file, cb) => {
            const filename = path.extname(file.originalname);
            cb(null, filename);
        },
    }),
});
