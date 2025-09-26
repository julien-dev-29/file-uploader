import { NextFunction, Request, Response } from "express"

export const isAuth = (req: Request, res: Response, next: NextFunction) => {
    if (req.isAuthenticated()) {
        next()
    } else {
        res.status(401).redirect('/login')
    }
}
