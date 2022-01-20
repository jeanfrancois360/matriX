import { useEffect, useState } from 'react'
import Header from '../../components/navbar'
import * as Yup from 'yup'
import axios from 'axios';
import { Formik, useFormik } from 'formik'
import { CircularProgress } from '@mui/material';
import Router from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import ErrorMessage from '../../components/messages/ErrorMessage';
import styles from '../../styles/Home.module.css';

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
    const [isProcessing, setIsProcessing] = useState(false);
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

  // Send money validations
  const sendMoneyValidationSchema = Yup.object().shape({
    receiverId: Yup.string().required().label("Receiver"),
    target_currency: Yup.string().required().label("Target currency"),
    source_currency: Yup.string().required().label("Source currency"),
    amount: Yup.number().required().label("Amount"),
  });

    const handleSendMoney = async (values:object) => {
        setIsProcessing(true);
            const res = await axios.post('/api/transactions/create', { ...values }, { headers : { 'Authorization' : `Bearer ${token}` }});
            setIsProcessing(false);
            alert('Transaction Successful')
            Router.push('/transactions');
            console.log("New transaction: ", res);
    }
    return (
        <>
        <Head>
        <title>MatriX - Create transaction</title>
        <link rel="shortcut icon" href="/images/wisex-favicon.png" />
      </Head>
            <Header />
            {isLoading ? 
            <div className='flex flex-col items-center content-center pt-12'>
                <CircularProgress className={styles.pageLoaderStyle}/> 
            </div>
            :

                <div className='flex flex-col items-center gap-16 p-24 w-full'>
                    <div className='flex w-full items-center justify-between content-end bg-white p-5 rounded-2xl'>
                    <p className='text-slate-900 font-bold'>Send money</p>
                    <Link href="/transactions">
                        <a className='px-8 py-3 bg-slate-900 text-white rounded-full hover:text-emerald-400'>View Transactions</a>
                    </Link>
                </div>
                <Formik
                initialValues={{
                receiverId: "",
                target_currency: '',
                source_currency: '',
                amount: "",
                }}
                onSubmit={handleSendMoney}
                validationSchema={sendMoneyValidationSchema}
              >
                {({
                  values,
                  handleChange,
                  handleSubmit,
                  touched,
                  handleBlur,
                  errors,
                }) => (
                    <form action="POST" onSubmit={handleSubmit} className='flex flex-col gap-8 bg-white shadow-md p-8 mb-4 rounded'>
                        <div className='flex gap-6'>
                            <div className='mb-4 w-full'>
                                <label htmlFor="receiverId" className='block text-gray-500 text-sm font-bold mb-2'>Receiver</label>
                                <select name='receiverId' onChange={handleChange("receiverId")} onBlur={handleBlur("receiverId")} className="form-select appearance-none block w-full px-3 py-3 px-6 text-base font-normal text-gray-700 bg-white bg-clip-padding bg-no-repeat border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" aria-label="Default select example">
                                    <option defaultValue={''}>Select Receiver</option>
                                    {users.length && users.map((user) => (
                                        <option key={user['id']} value={user['id']}>{user['name']}</option>
                                    ))}
                                </select>
                                {touched.receiverId && errors.receiverId && <ErrorMessage
                                            text={errors.receiverId}
                                        />}
                            </div>
                            <div className='mb-4 w-full'>
                                <label htmlFor="s_currency" className='block text-gray-500 text-sm font-bold mb-2'>Source currency</label>
                                <select name='source_currency' onChange={handleChange("source_currency")} onBlur={handleBlur("source_currency")} className="form-select appearance-none block w-full px-3 py-3 px-6 text-base font-normal text-gray-700 bg-white bg-clip-padding bg-no-repeat border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" aria-label="Default select example">
                                    <option selected>choose source currency</option>
                                    <option value="USD">USD</option>
                                    <option value="NGN">NGN</option>
                                    <option value="EUR">EUR</option>
                                </select>
                                {touched.source_currency && errors.source_currency && <ErrorMessage
                                            text={errors.source_currency}
                                        />}
                            </div>
                           
                        </div>
                        <div className='flex gap-6 mb-4'>
                             <div className='mb-4 w-full'>
                                <label htmlFor="t_currency" className='block text-gray-500 text-sm font-bold mb-2'>Target currency</label>
                                <select name='target_currency' onChange={handleChange("target_currency")} onBlur={handleBlur("target_currency")} className="form-select appearance-none block w-full px-3 py-3 px-6 text-base font-normal text-gray-700 bg-white bg-clip-padding bg-no-repeat border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" aria-label="Default select example">
                                    <option selected>choose target currency</option>
                                    <option value="USD">USD</option>
                                    <option value="NGN">NGN</option>
                                    <option value="EUR">EUR</option>
                                </select>
                                {touched.target_currency && errors.target_currency && <ErrorMessage
                                            text={errors.target_currency}
                                        />}
                            </div>
                            <div className='mb-4 w-full'>
                                <label htmlFor="amount" className='block text-gray-500 text-sm font-bold mb-2'>Amount</label>
                                <input type="number" min="0" value={values.amount} name='amount' onChange={handleChange("amount")} onBlur={handleBlur("amount")} placeholder='Enter amount' className='shadow appearance-none border rounded w-full py-3 px-6 text-gray-700 focus:shadow-outline' />
                                {touched.amount && errors.amount && <ErrorMessage
                                            text={errors.amount}
                                        /> }
                            </div>
                        </div>
                        <div className='flex items-center justify-center'>
                            <button className="bg-slate-900 my-4 mx-0 px-6 py-3 w-40 text-emerald-400 rounded-full hover:text-white">
                   {isProcessing ? <CircularProgress className={styles.loaderStyle} /> : 'Send money'}
                  </button>
                           
                        </div>
                   </form>
                )}
              </Formik>
                </div>
            }
        </>
    )
}

export default Create
