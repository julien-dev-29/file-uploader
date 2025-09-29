import { Router } from "express";
import passport from 'passport'
import { body, validationResult } from "express-validator";
import authController from '../controllers/auth.controller.ts'

const validateRegister = [
    body('email')
        .escape()
        .isEmpty().withMessage('Email is required')
        .isEmail().withMessage('Not a valid email'),
    body('password')
        .isEmpty().withMessage('Password is required')
]

const router = Router()

router.get('/login', authController.authGet)
router.post('/login', passport.authenticate("local", {
    successRedirect: '/folders',
    failureRedirect: '/login',
    failureMessage: true
}))
router.get('/register', authController.registerGet)
router.post('/register', validateRegister, authController.registerPost)
router.get('/logout', authController.logout)

export default router