import { NextFunction, Request, Response } from "express"

export const isAuth = (req: Request, res: Response, next: NextFunction) => {
    if (req.isAuthenticated()) {
        next()
    } else {
        res.status(401).json({ msg: "You are not authorized to view this ressource" })
    }
}
