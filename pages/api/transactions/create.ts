import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';

const createTransaction = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'POST') {
        try {
            const { receiverId, amount, source_currency, target_currency, senderId } = req.body;

            if(!receiverId || amount < 1 || !senderId) {
                return res.status(400).json({
                    status: 'failed',
                    error: `Transaction failed`,
                    data: {},
                });
            }
            
            const id = Number(receiverId);
            
            const receiver_account:any = await prisma.account.findFirst({
                where: {
                    userId: id
                }
            });
            
            if (!receiver_account) {
                return res.status(400).json({
                    status: 'failed',
                    error: 'Receiver account not found',
                    data: {},
                });
            }
            if (receiver_account.userId === senderId) {
                return res.status(400).json({
                    status: 'failed',
                    error: 'Sender Is the same as the receiver',
                    data: {},
                });
            }
            const receiver:any = await prisma.user.findUnique({
                where: {
                    id: receiver_account.userId
                }
            });
            const senderAccount:any = await prisma.account.findFirst({
                where: {
                    userId: senderId
                }
            });
            if (!senderAccount) {
                return res.status(400).json({
                    status: 'failed',
                    error: 'Sender Account Not found',
                    data: {},
                });
            } 
            const sender_money_acc = `balance${source_currency}`;
            let rate = 1;
            if (source_currency === target_currency) rate = 1;
            if (source_currency === 'USD' && target_currency === 'NGN') rate = 411.95;
            if (source_currency === 'USD' && target_currency === 'EUR') rate = 0.88;
            if (source_currency === 'NGN' && target_currency === 'USD') rate = 0.0024;
            if (source_currency === 'NGN' && target_currency === 'EUR') rate = 0.0021;
            if (source_currency === 'EUR' && target_currency === 'USD') rate = 1.14;
            if (source_currency === 'EUR' && target_currency === 'NGN') rate = 468.55;

            const receiver_money_acc = `balance${target_currency}`;
            const transaction_amount = amount * rate;
            if (senderAccount[sender_money_acc] < amount) {
                return res.status(400).json({
                    status: 'failed',
                    error: 'Insufficient Balance for this transaction amount',
                    data: {},
                });
            }
            const new_sender_balance = senderAccount[sender_money_acc] - amount;
            const new_receiver_balance = Number.parseInt(receiver_account[receiver_money_acc]) + transaction_amount;
            const transaction = await prisma.transaction.create({
                data: {
                    senderId: senderId,
                    receiverId: receiver.id,
                    sourceCurrency: source_currency,
                    targetCurrency: target_currency,
                    amount: amount,
                    exchangeRate: rate
                }
            })

            if(target_currency === 'USD') {
                await prisma.account.update({
                    where: {
                        id: receiver_account.id
                    },
                    data: {
                        balanceUSD: new_receiver_balance
                    }
                });
            }
            if(target_currency === 'EUR') {
                await prisma.account.update({
                    where: {
                        id: receiver_account.id
                    },
                    data: {
                        balanceEUR: new_receiver_balance
                    }
                });
            }
            if(target_currency === 'NGN') {
                await prisma.account.update({
                    where: {
                        id: receiver_account.id
                    },
                    data: {
                        balanceNGN: new_receiver_balance
                    }
                });
            }
            if (source_currency === 'USD') {
                await prisma.account.update({
                    where: {
                        id: senderAccount.id
                    },
                    data: {
                        balanceUSD: new_sender_balance
                    }
                });
            }
            if (source_currency === 'EUR') {
                await prisma.account.update({
                    where: {
                        id: senderAccount.id
                    },
                    data: {
                        balanceEUR: new_sender_balance
                    }
                });
            }
            if (source_currency === 'NGN') {
                await prisma.account.update({
                    where: {
                        id: senderAccount.id
                    },
                    data: {
                        balanceNGN: new_sender_balance
                    }
                });
            } 
            return res.status(200).json({
                status: 'success',
                message: 'Transaction Succeeded',
                data: transaction
            })
        } catch (error) {
            return res.status(400).json({
                status: 'failed',
                error: 'Transaction failed',
                data: error,
            });
        }
    }
}
export default createTransaction;