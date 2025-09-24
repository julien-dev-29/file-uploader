import { PrismaClient } from "../generated/prisma";
const prisma = new PrismaClient();

export const userModel = prisma.user; // accès CRUD à la table User
