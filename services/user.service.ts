import { prisma } from "../prisma/client.ts"

export default {
    /**
     * Get all users
     * @returns 
     */
    getAllUsers: async () => {
        return await prisma.user.findMany()
    },

    /**
     * Create a new user
     * @param data 
     * @returns 
     */
    createUser: async (data: {
        email: string,
        password: string
    }) => {
        return await prisma.user.create({ data });
    },

    /**
     * Get user by ID
     * @param id 
     * @returns 
     */
    getUserById: async (id: number) => {
        return await prisma.user.findUnique(
            {
                where: {
                    id: id
                }
            }
        )
    },

    /**
     * 
     * @param email 
     * @returns 
     */
    getUserByEmail: async (email: string) => {
        return await prisma.user.findUnique(
            {
                where: {
                    email: email
                }
            }
        )
    }
}
