import { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import prisma from '../../../lib/prisma';
import { encode_token } from '../../../helpers/auth_helper';
import cryptoRandomString from 'crypto-random-string';

const signUp = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    try {
      const { name, email, password } = req.body;
      const userExists = await prisma.user.findUnique({
        where: {
          email
        },
      });
      console.log(userExists);
      
      if (userExists) {
        return res.status(400).json({
          status: false,
          error: 'User account found',
          data: {},
        });
      }

      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(password, salt);

      const user:any = await prisma.user.create({
        data: {
          name,
          email,
          password: hash,
        },
      });
      console.log(user);
      
      const account = await prisma.account.create({
          data: {
            userId : user.id,
            routingNo: cryptoRandomString({length: 10, type: 'base64'})
          }
      });

      console.log("account", account);
      
      await prisma.transaction.create({
        data: { receiverId: user.id, amount: 1000 },
      });
    
      const token = encode_token(user);
      console.log("token", token);
      
      delete user.password;

      res.status(200).json({
        status: true,
        message: 'User registration succeeded',
        token,
        data: user
      });
    } catch (error) {
      return res.status(400).json({
        status: false,
        error: 'Action failed ',
        data: error,
      });
    }
  }
};
export default signUp;