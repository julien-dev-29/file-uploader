import { prisma } from "../prisma/client.ts"

export default {
    /**
     * Get all file records
     * @returns 
     */
    getAll: async (
        userId: number
    ) => await prisma.file.findMany(),

    /**
     * Find a file record by its ID
     * @param id 
     * @returns 
     */
    findById: async (
        id: number
    ) => await prisma.file.findUnique({
        where: { id: id }
    }),

    /**
     * Create a new file record
     * @param data 
     * @returns 
     */
    create: async (
        originalname: string,
        encoding: string,
        mimetype: string,
        size: number,
        destination: string,
        filename: string,
        path: string,
        folderId: number
    ) => await prisma.file.create({
        data: {
            originalname: originalname,
            encoding: encoding,
            mimetype: mimetype,
            size: size,
            destination: destination,
            filename: filename,
            path: path,
            folderId: folderId
        }
    }),

    /**
     * Update a file record
     * @param id 
     * @param name 
     * @param size 
     * @param uploadTime 
     * @param url 
     * @returns 
     */
    // update: async (
    //     id: number,
    //     name: string,
    //     size: number,
    //     uploadTime: number,
    //     url: string
    // ) => await prisma.file.update({
    //     where: { id: id },
    //     data: {
    //         name: name,
    //         size: size,
    //         uploadTime: uploadTime,
    //         url: url
    //     }
    // }),

    /**
     * Delete a file record
     * @param id 
     * @returns 
     */
    delete: async (
        id: number
    ) => await prisma.file.delete({
        where: { id: id }
    }),
}