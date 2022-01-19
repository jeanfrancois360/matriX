import { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import prisma from '../../../lib/prisma';
import { encode_token } from '../../../helpers/auth_helper';

const signIn = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    try {
      const { email, password } = req.body;
        console.log(req.body);
        
      const userExists:any = await prisma.user.findUnique({
        where: {
          email,
        },
      });

      console.log("EXISTS", userExists);
      
      const verifyPassword = await bcrypt.compareSync(
        password,
        userExists.password,
      );

      if (!userExists || !verifyPassword) {
        return res.status(401).json({
          status: 'failed',
          error: 'Unauthorized',
          data: {},
        });
      }

      const account = await prisma.account.findFirst({
          where: {
              userId: userExists.id
          }
      });
      const token = encode_token(userExists);

      delete userExists.password;

      res.status(200).json({
        status: 'ok',
        message: 'Signin success',
        token,
        data: {
            userExists,
            account
        }
      });
    } catch (error) {
      return res.status(400).json({
        status: 'failed',
        error: 'Invalid credentials',
        data: error,
      });
    }
  }
};

export default signIn;