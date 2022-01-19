import { useEffect, useState } from 'react'
import Header from '../../components/navbar'
import * as Yup from 'yup'
import axios from 'axios';
import { useFormik } from 'formik'
import { CircularProgress } from '@mui/material';
import Router from 'next/router';
import Head from 'next/head';

interface Transaction {
    receiverId: number,
    sourceCurrency: string,
    targetCurrency: string,
    amount: number,
    senderId: number
}
function Create(props:any) {
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isTransactionProcessing, setIsTransactionProcessing] = useState(false);
    const [senderId, setSenderId] = useState(-1)
    const [token, setToken] = useState('');

    useEffect(() => {
        if (!localStorage.getItem('token')) {
           Router.push("/")
        }
        else{
          console.log("You are logged in!")
        }
    }, []);

    useEffect(() => {
        setIsLoading(true);
        const id = localStorage.getItem('id');
        const token = localStorage.getItem('token');
        setToken(String(token))
        setSenderId(Number(id));
        // console.log(user)
        const getUsers = async () => {
            const results = await axios.get(`/api/users/${id}`, { headers: { 'Authorization' : `Bearer ${token}` } });
            console.log("GET USERS", results.data);

            if (results.status) {
                const users_ = results.data.data;
                setUsers(users_)
            } else {
                alert("Error")
            }
            setIsLoading(false)
        }
        getUsers();
    }, []);
    const { handleSubmit, handleChange, values, touched, errors, handleBlur } = useFormik({
        initialValues: {
            receiverId: -1,
            target_currency: '',
            source_currency: '',
            amount: 0.0,
        },
        validationSchema: Yup.object({
            receiverId: Yup.string().required(),
            target_currency: Yup.string().required(),
            source_currency: Yup.string().required(),
            amount: Yup.number().required(),
        }),
        onSubmit: async ({ receiverId, source_currency, target_currency, amount }) => {
            setIsTransactionProcessing(true);
            const result = await axios.post('/api/transactions/create', { receiverId, source_currency, target_currency, amount, senderId }, { headers : { 'Authorization' : `Bearer ${token}` }});

            const { data } = result.data;
            setIsTransactionProcessing(false);
            alert('Transaction Successful')
            Router.push('/transactions');
            console.log(data);
        }
    });
    return (
        <>
        <Head>
        <title>MatriX - Create transaction</title>
        <link rel="shortcut icon" href="/images/wisex-favicon.png" />
      </Head>
            <Header />
            {isLoading ? 
            <div className='flex flex-col items-center content-center pt-12'>
                <CircularProgress /> 
            </div>
            :

                <div className='flex flex-col items-center gap-16 p-24'>
                    <p className='text-center font-bold text-xl'>Fill out this form to send money</p>
                    <form onSubmit={handleSubmit} className='flex flex-col gap-8 bg-white shadow-md p-8 mb-4 rounded'>
                        <div className='flex gap-6'>
                            <div className='mb-4 w-full'>
                                <label htmlFor="receiverId" className='block text-gray-500 text-sm font-bold mb-2'>Receiver</label>
                                <select name='receiverId' onChange={handleChange} onBlur={handleBlur} className="form-select appearance-none block w-full px-3 py-3 px-6 text-base font-normal text-gray-700 bg-white bg-clip-padding bg-no-repeat border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" aria-label="Default select example">
                                    <option defaultValue={''}>Select Receiver</option>
                                    {users.length && users.map((user) => (
                                        <option key={user['id']} value={user['id']}>{user['name']}</option>
                                    ))}
                                </select>
                                {touched.receiverId && errors.receiverId ? <span className='text-red-700'>{errors.receiverId}</span> : ''}
                            </div>
                            <div className='mb-4 w-full'>
                                <label htmlFor="t_currency" className='block text-gray-500 text-sm font-bold mb-2'>Target currency</label>
                                <select name='target_currency' onChange={handleChange} onBlur={handleBlur} className="form-select appearance-none block w-full px-3 py-3 px-6 text-base font-normal text-gray-700 bg-white bg-clip-padding bg-no-repeat border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" aria-label="Default select example">
                                    <option selected>choose target currency</option>
                                    <option value="USD">USD</option>
                                    <option value="NGN">NGN</option>
                                    <option value="EUR">EUR</option>
                                </select>
                                {touched.target_currency && errors.target_currency ? <span className='text-red-700'>{errors.target_currency}</span> : ''}
                            </div>
                        </div>
                        <div className='flex gap-6 mb-4'>
                            <div className='mb-4 w-full'>
                                <label htmlFor="s_currency" className='block text-gray-500 text-sm font-bold mb-2'>Source currency</label>
                                <select name='source_currency' onChange={handleChange} onBlur={handleBlur} className="form-select appearance-none block w-full px-3 py-3 px-6 text-base font-normal text-gray-700 bg-white bg-clip-padding bg-no-repeat border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" aria-label="Default select example">
                                    <option selected>choose source currency</option>
                                    <option value="USD">USD</option>
                                    <option value="NGN">NGN</option>
                                    <option value="EUR">EUR</option>
                                </select>
                                {touched.source_currency && errors.source_currency ? <span className='text-red-700'>{errors.source_currency}</span> : ''}
                            </div>
                            <div className='mb-4 w-full'>
                                <label htmlFor="amount" className='block text-gray-500 text-sm font-bold mb-2'>Amount</label>
                                <input type="number" value={values.amount} name='amount' onChange={handleChange} onBlur={handleBlur} placeholder='Enter amount' className='shadow appearance-none border rounded w-full py-3 px-6 text-gray-700 focus:shadow-outline' />
                                {touched.amount && errors.amount ? <span className='text-red-700'>{errors.amount}</span> : ''}
                            </div>
                        </div>
                        <div className='flex items-center justify-between'>
                            {
                                <button type="submit" className='inline-flex justify-center text-white font-bold hover:text-blue-400 bg-slate-700 hover:bg-slate-900 py-2 px-4 rounded'>{ isTransactionProcessing ? <CircularProgress /> : 'PROCEED' }</button>
                            }
                        </div>
                    </form>
                </div>
            }
        </>
    )
}

export default Create
