import axios from 'axios';
import Link from 'next/link';
import React, { useEffect, useState } from 'react'
import Header from '../../components/navbar';
import Image from 'next/image'
import Head from 'next/head';
import Moment from 'react-moment';
import { useRouter } from 'next/router'

function Index(props:any) {
    const Router = useRouter()
    const [data, setData] = useState([]);
    const [userId, setuserId] = useState(-1);
    const [balances, setBalances] = useState({balanceUSD: '', balanceNGN: '', balanceEUR: ''})
    
    useEffect(() => {
        if (!localStorage.getItem('token')) {
              Router.push("/")
        }
        else{
          console.log("You are logged in!")
        }
    }, []);
    useEffect(() => {
        const user_id = localStorage.getItem('id');
        const token = localStorage.getItem('token');
        setuserId(Number(user_id))
        const acc_id = localStorage.getItem('account_no');
        const getAccountData = async (acc_id: number) => {
            try {
                const account = await axios.get(`/api/accounts/${acc_id}`, { headers:{ 'Authorization' : `Bearer ${token}` } });
                setBalances(account.data.data)
                console.log("DATA: ", account.data.data)
            }catch (error){
              console.error(error)
            }
        }
        const getTransactions = async (user_id: number) => {
            try{ 
                const transactions = await axios.get(`/api/transactions/${user_id}`, { headers: { 'Authorization' : `Bearer ${token}` } });
                setData(transactions.data.data);
            }catch (error){
              console.error(error)
            }
        }
        getAccountData(Number(acc_id));
        getTransactions(Number(user_id));
    }, []);
    return (
        <>
         <Head>
        <title>MatriX - View transaction</title>
        <link rel="shortcut icon" href="/images/wisex-favicon.png" />
      </Head>
            <Header />
            <div className='flex flex-col gap-8 p-24'>
                <div className='flex flex-row gap-24 space-around'>
                    <div className='flex gap-4 bg-slate-900 p-4 rounded-xl'>
                        <Image src={'/images/flags/usa.png'} width={60} height={60} />
                        <div className='flex flex-col justify-around'>
                            <p className='font-bold text-white'>USD Balance</p>
                            <p className="text-emerald-400 font-semibold">{balances.balanceUSD != null ? balances.balanceUSD: '0'}</p>
                        </div>
                    </div>
                    <div className='flex gap-4 bg-slate-900 p-4 rounded-xl'>
                        <Image src={'/images/flags/nigeria.png'} width={60} height={60} />
                        <div className='flex flex-col justify-around'>
                            <p className='font-bold text-white'>NGN Balance</p>
                            <p className="text-emerald-400 font-semibold">{balances.balanceNGN != null ? balances.balanceNGN: '0'}</p>
                        </div>
                    </div>
                    <div className='flex gap-4 bg-slate-900 p-4 rounded-xl'>
                        <Image src={'/images/flags/eur.png'} width={60} height={60} />
                        <div className='flex flex-col justify-around'>
                            <p className='font-bold text-white'>EUR Balance</p>
                            <p className="text-emerald-400 font-semibold">{balances.balanceEUR != null ? balances.balanceEUR: '0'}</p>
                        </div>
                    </div>
                </div>

                <div className='flex items-center justify-between content-end bg-white p-5 rounded-2xl'>
                    <p className='text-slate-900 font-bold'>All Transactions</p>
                    <Link href="/transactions/create">
                        <a className='px-8 py-3 bg-slate-900 text-white rounded-full hover:text-emerald-400'>New Transaction</a>
                    </Link>
                </div>
                <table className='min-w-full divide-y divide-gray-200'>
                    <thead className='bg-slate-900 text-emerald-400'>
                        <tr>
                            <th className='px-6 py-3 text-left text-xs font-medium text-emerald-400 uppercase tracking-wider'>No</th>
                            <th className='px-6 py-3 text-left text-xs font-medium text-emerald-400 uppercase tracking-wider'>FROM</th>
                            <th className='px-6 py-3 text-left text-xs font-medium text-emerald-400 uppercase tracking-wider'>TO</th>
                            <th className='px-6 py-3 text-left text-xs font-medium text-emerald-400 uppercase tracking-wider'>VALUE</th>
                            <th className='px-6 py-3 text-left text-xs font-medium text-emerald-400 uppercase tracking-wider'>CURRENCY</th>
                            <th className='px-6 py-3 text-left text-xs font-medium text-emerald-400 uppercase tracking-wider'>CREATED AT</th>
                            <th className='px-6 py-3 text-left text-xs font-medium text-emerald-400 uppercase tracking-wider'>UPDATED AT</th>
                        </tr>
                    </thead>
                    <tbody className='bg-white divide-y divide-gray-200'>
                        {data.length && data.map((transaction, index) => (
                            <tr key={transaction['id']}>
                                <td className='px-6 py-4 whitespace-nowrap'>{index + 1}</td>
                                <td className='px-6 py-4 whitespace-nowrap'>{(transaction['senderId'] && transaction['senderId'] !== undefined) ? transaction['senderId'] === userId ? 'You' : transaction['sender']['name'] : "This app"}</td>
                                <td className='px-6 py-4 whitespace-nowrap'>{transaction['receiverId'] === userId ? 'You' : transaction['receiver']['name']}</td>
                                <td className={(transaction['receiverId'] === userId ? 'px-6 py-4 whitespace-nowrap text-emerald-500' : 'px-6 py-4 whitespace-nowrap text-red-400')}>{transaction['receiverId'] === userId ? '+' : '-'} {transaction['amount']}</td>
                                <td className='px-6 py-4 whitespace-nowrap'>{transaction['sourceCurrency']}</td>
                                <td className='px-6 py-4 whitespace-nowrap'><Moment format='ddd, MMM Do YYYY'>{transaction['createdAt']}</Moment></td>
                                <td className='px-6 py-4 whitespace-nowrap'><Moment format='ddd, MMM Do YYYY'>{transaction['updatedAt']}</Moment></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    )
}

export default Index
