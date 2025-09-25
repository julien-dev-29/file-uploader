import { Router } from "express";
import { body } from 'express-validator'
import folderController from "../controllers/folder.controller.ts";
import { isAuth } from "../middlewares/auth.middleware.ts";

const router = Router()

const validateFolder = [
    body('name')
        .notEmpty()
        .withMessage('Folder Name is required')
        .isLength({ min: 2, max: 30 })
        .withMessage('Folder Name must contains between 2 and 30 characters')
        .trim()
        .escape(),
]

router.get('/', isAuth, folderController.index)
router.get('/create', isAuth, folderController.create)
router.post('/create', isAuth, validateFolder, folderController.store)
router.get('/:id', isAuth, folderController.details)
router.get('/:id/edit', isAuth, folderController.edit)
router.put('/:id', isAuth, validateFolder, folderController.update)
router.delete('/:id', isAuth, folderController.delete)

export default router