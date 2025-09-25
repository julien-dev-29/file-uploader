import { Router } from "express";
import fileController from "../controllers/file.controller.ts";
import { isAuth } from "../middlewares/auth.middleware.ts";
import multer from "multer";
import { body, check } from "express-validator";

const router = Router()

const validateFile = [
    check('file')
        .custom((value, { req }) => {
            if (!req.file) {
                throw new Error('No file uploaded');
            }
            if (req.file.size > 5 * 1024 * 1024) { // 5MB limit
                throw new Error('File size exceeds 5MB');
            }
            if (!['image/jpeg', 'image/png', 'application/pdf'].includes(req.file.mimetype)) {
                throw new Error('Invalid file type. Only JPEG, PNG, and PDF are allowed.');
            }
            if (req.file.originalname.length > 100) {
                throw new Error('File name is too long. Maximum 100 characters allowed.');
            }
            return true;
        })
]

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});

const upload = multer({ storage });

router.get('/', isAuth, fileController.index)
router.get('/create', isAuth, fileController.create)
router.post('/create', isAuth, validateFile, upload.single('file'), fileController.store)
router.get('/:id/download', isAuth, fileController.download)
router.get('/:id/edit', isAuth, fileController.edit)
router.get('/:folderId/:id', isAuth, fileController.details)
router.put('/:id', isAuth, fileController.update)
router.delete('/:id', isAuth, fileController.delete)

export default router