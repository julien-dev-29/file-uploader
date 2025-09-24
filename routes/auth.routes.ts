import { Router } from "express";
import passport from 'passport'
import authController from '../controllers/auth.controller.ts'

const router = Router()

router.get('/login', authController.authGet)
router.post('/login', passport.authenticate("local", {
    successRedirect: '/messages',
    failureRedirect: '/login',
    failureMessage: true
}))
router.get('/register', authController.registerGet)
router.post('/register', authController.registerPost)
router.get('/logout', authController.logout)

export default router