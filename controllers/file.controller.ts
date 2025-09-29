import { Request, Response } from "express";
import fileService from '../services/file.service.ts'
import { v2 as cloudinary } from 'cloudinary'
import { validationResult } from "express-validator";

declare global {
    namespace Express {
        interface Request {
            file?: Multer.File; // Ajoute la propriété `file` à l'interface Request
        }
    }
}

// Configuration
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET ?? "",
    secure: true
});

// Options
const options = {
    use_filename: true,
    unique_filename: false,
    overwrite: true,
};

export default {
    index: (req: Request, res: Response) => { },
    create: (req: Request, res: Response) => { },
    store: async (req: Request, res: Response) => {
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
        try {
            // Upload the image
            const result = await cloudinary.uploader.upload(path, options);
            console.log(result);
            await fileService.create(
                originalname,
                encoding,
                mimetype,
                size,
                destination,
                filename,
                path,
                folderIdNum)
            res.redirect('/folders/' + folderIdNum)
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to upload file.' });
        }

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
            .catch(err => res.status(400).send('No file downloaded.'))
    }
}