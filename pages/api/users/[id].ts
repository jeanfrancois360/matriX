import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';

const getUsers = async (req:NextApiRequest, res:NextApiResponse) => {
    
    const { id } = req.query;
    
    try {
        const results = await prisma.user.findMany();
        const users = results.filter((user:any) => user.id !== Number(id));
        
        return res.status(200).json({
            status: true,
            message: 'Users found',
            data: users
        });
    } catch (error) {
        return res.status(400).json({
            status: "failed",
            message: "Can't get users",
            data: error
        });
    }
}
export default getUsers;