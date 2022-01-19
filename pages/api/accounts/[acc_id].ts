import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';
const getUserTransactions = async(req:NextApiRequest, res:NextApiResponse) => {
    if(req.method === 'GET'){
        try {
            const  { acc_id } = req.query;
    
            const account = await prisma.account.findUnique({
                where : {
                    id: Number(acc_id)
                },
            });
            
            return res.status(200).json({
                status: 'success',
                message: 'user account data',
                data: account
            });
        } catch(error) {
            return res.status(400).json({
                status: 'failed',
                error: 'Getting account data failed',
                data: error,
            });
        }
    }
}

export default getUserTransactions;