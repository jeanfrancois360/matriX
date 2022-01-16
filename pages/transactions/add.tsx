import Head from 'next/head';
import React from 'react'

export const add = () => {
    return (
    <>
        <Head>
          <title>WiseX-add-transaction</title> 
          <link rel="shortcut icon" href="/images/wisex-favicon.png" />
        </Head>
        <div>
            Add new transaction.
        </div>
        </>
    )
}

export default add;