import { prisma } from "../prisma/client.ts"

export default {
    /**
     * 
     * @returns 
     */
    getAll: async (
        userId: number
    ) => await prisma.folder.findMany({
        where: {
            userId: userId
        },
        include: {
            files: true
        }
    }),

    /**
     * 
     * @param id 
     * @returns 
     */
    findById: async (
        id: number
    ) => await prisma.folder.findUnique({
        where: { id: id },
        include: {
            files: true
        }
    }),

    /**
     * 
     * @param data 
     * @returns 
     */
    create: async (
        name: string,
        userId: number
    ) => await prisma.folder.create({
        data: {
            name: name,
            userId: userId
        }
    }),

    /**
     * 
     * @param id 
     * @returns 
     */
    delete: async (
        id: number
    ) => await prisma.folder.delete({
        where: {
            id: id
        }
    }),

    /**
     * 
     * @param id 
     * @param name 
     * @returns 
     */
    update: async (
        id: number,
        name: string
    ) => await prisma.folder.update({
        where: {
            id: id
        },
        data: {
            name: name
        },
        include: {
            files: true
        }
    })
}