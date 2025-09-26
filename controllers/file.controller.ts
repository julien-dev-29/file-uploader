import { Request, Response } from "express";
import fileService from '../services/file.service.ts'
import { validationResult } from "express-validator";

declare global {
    namespace Express {
        interface Request {
            file?: Multer.File; // Ajoute la propriété `file` à l'interface Request
        }
    }
}
export default {
    index: (req: Request, res: Response) => { },
    create: (req: Request, res: Response) => { },
    store: (req: Request, res: Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        if (!req.file) {
            return res.status(400).send('No file uploaded.');
        }
        const { originalname, encoding, mimetype, size, destination, filename, path } = req.file
        const { folderId } = req.body
        const folderIdNum = Number(folderId)
        fileService.create(
            originalname,
            encoding,
            mimetype,
            size,
            destination,
            filename,
            path,
            folderIdNum)
            .then(() => res.redirect('/folders/' + folderIdNum))
    },
    details: (req: Request, res: Response) => {
        const { id, folderId } = req.params
        const idNum = Number(id)
        fileService.findById(idNum)
            .then((file) => {
                res.render('files/details', {
                    page_name: "folders",
                    title: file?.originalname,
                    folderId: folderId,
                    file: file
                })
            })
            .catch(err => res.status(400).send('No file updated.'))
    },
    edit: (req: Request, res: Response) => { },
    update: (req: Request, res: Response) => { },
    delete: (req: Request, res: Response) => {
        fileService.delete(Number(req.params.id))
            .then(() => {
                res.redirect('/folders/' + req.body.folderId)
            })
            .catch(err => res.status(400).send('No file deleted.'))
    },
    download: (req: Request, res: Response) => {
        const { id } = req.params
        fileService.findById(Number(id))
            .then((file) => {
                if (!file) return res.status(400).send('No file founded.')
                res.download(file?.path)
            })
    }
}