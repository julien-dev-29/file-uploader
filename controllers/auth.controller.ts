import { body, validationResult } from "express-validator"
import { NextFunction, Request, Response } from "express";
import bcrypt from 'bcrypt'
import userService from "../services/user.service.ts";

const alphaErr = "must only contain letters.";
const lengthErr = "must be between 1 and 10 characters.";


const validateUser = [
    // Validation du prénom
    body("firstname")
        .notEmpty()
        .withMessage("First name is required")
        .isLength({ min: 2, max: 10 })
        .withMessage(`First name ${lengthErr}`)
        .isAlpha("en-US", { ignore: " -" }) // Autorise les lettres, espaces et tirets
        .withMessage(`First name ${alphaErr}`)
        .trim()
        .escape(), // Échappe les caractères HTML pour éviter les XSS

    // Validation du nom de famille
    body("lastname")
        .notEmpty()
        .withMessage("Last name is required")
        .isLength({ min: 2, max: 10 })
        .withMessage(`Last name ${lengthErr}`)
        .isAlpha("en-US", { ignore: " -" })
        .withMessage(`Last name ${alphaErr}`)
        .trim()
        .escape(),

    // Validation de l'email
    body("email")
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Invalid email format")
        .normalizeEmail() // Normalise l'email (ex: "Test@example.com" → "test@example.com")
        .trim(),

    // Validation du mot de passe
    body("password")
        .notEmpty()
        .withMessage("Password is required")
        .isLength({ min: 8, max: 30 })
        .withMessage("Password must be between 8 and 30 characters")
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/)
        .withMessage("Password must contain at least one uppercase letter, one lowercase letter, and one number")
        .trim()
        .escape(),

    // Validation de la confirmation du mot de passe
    body("confirmPassword")
        .notEmpty()
        .withMessage("You must type a confirmation password")
        .custom((value, { req }) => value === req.body.password)
        .withMessage("The passwords do not match")
        .trim()
        .escape(),
];

const validateSecret = [
    body('secret')
        .exists({ checkFalsy: true })
        .custom((value) => value === process.env.SECRET)
        .withMessage("The secret is incorrect")
]

export default {
    authGet: (req: Request, res: Response) => {
        res.render('auth/login', { title: "Login" })
    },

    registerGet: (req: Request, res: Response) => {
        res.render('auth/register', { title: "Register" })
    },

    registerPost: async (req: Request, res: Response) => {
        let { email, password } = req.body
        password = await bcrypt.hash(password, 10)
        userService.createUser({ email, password })
            .then(() => res.redirect('/login'))
    },

    logout: (req: Request, res: Response, next: NextFunction) => {
        req.logout((err: Error) => {
            if (err) return next(err);
            res.redirect("/");
        });
    }
}