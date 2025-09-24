import { userModel } from "../models/user.model.ts";

export default {
    /**
     * Get all users
     * @returns 
     */
    getAllUsers: async () => {
        return await userModel.findMany();
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
        return await userModel.create({ data });
    },

    /**
     * Get user by ID
     * @param id 
     * @returns 
     */
    getUserById: async (id: number) => {
        return await userModel.findUnique(
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
        return await userModel.findUnique(
            {
                where: {
                    email: email
                }
            }
        )
    }
}
