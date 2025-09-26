import { Request, Response } from "express";
import { validationResult } from 'express-validator'
import folderService from "../services/folder.service.ts";

declare global {
    namespace Express {
        interface User {
            id: number
            email: string;
        }
    }
}

export default {
    /**
     * 
     * @param req 
     * @param res 
     */
    index: (req: Request, res: Response) => {
        if (typeof req.user?.id !== "number") {
            return res.status(400).send("User ID is required");
        }
        folderService.getAll(req.user.id)
            .then(folders => res.render("folders/index", {
                page_name: "folders",
                title: "Folders",
                folders: folders
            }))
            .catch(err => res
                .status(500)
                .send(err.message))
    },

    /**
     * Render the folder creation form
     * @param req 
     * @param res 
     */
    create: (req: Request, res: Response) => {
        res.render('folders/create', {
            title: "Create"
        })
    },
    /**
     * Store a new folder record
     * @param req 
     * @param res 
     */
    store: (req: Request, res: Response) => {
        if (typeof req.user?.id !== "number") {
            return res.status(400).send("User ID is required");
        }
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return folderService.getAll(req.user.id)
                .then(folders => res.status(400).render("folders/index", {
                    title: "Folders",
                    folders: folders,
                    errors: errors.array()
                }))
                .catch(err => res
                    .status(500)
                    .send(err.message))
        }
        const { name } = req.body
        folderService.create(name, req.user.id)
            .then(() => res.redirect('/folders'))
            .catch(err => res.status(500).send(err.message))
    },

    /**
     * Show folder details
     * @param req 
     * @param res 
     */
    details: (req: Request, res: Response) => {
        const { id } = req.params
        folderService.findById(Number(id))
            .then((folder) => {
                console.log(folder?.files);
                res.render('folders/details', {
                    page_name: "folders",
                    title: folder?.name,
                    folder: folder,
                    files: folder?.files
                })
            })
            .catch(err => res.status(500).send(err.message))
    },

    /**
     * 
     * @param req 
     * @param res 
     */
    edit: (req: Request, res: Response) => {
        folderService.findById(Number(req.params.id))
            .then((folder) => {
                res.render('folders/edit', {
                    page_name: "folders",
                    title: "Editer: " + folder?.name,
                    folder: folder
                })
            })
    },

    /**
     * Update a folder record
     * @param req 
     * @param res 
     */
    update: (req: Request, res: Response) => {
        const { id } = req.params;
        if (!id || isNaN(Number(id))) {
            return res.status(400).send("Invalid folder ID");
        }
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return folderService.findById(Number(id))
                .then(folder => {
                    if (!folder) {
                        return res.status(404).send("Folder not found");
                    }
                    res.status(400).render("folders/edit", {
                        title: folder.name,
                        folder: folder,
                        errors: errors.array()
                    });
                })
                .catch(err => res.status(500).send(err.message));
        }
        folderService.update(Number(id), req.body.name)
            .then((folder) => res.redirect(`/folders/${folder.id}`))
            .catch(err => res.status(500).send(err.message));
    },

    /**
     * Delete a folder record
     * @param req 
     * @param res 
     */
    delete: (req: Request, res: Response) => {
        folderService.delete(Number(req.params.id))
            .then(() => res.redirect('/folders'))
            .catch(err => res.status(500).send(err.message))
    },
}