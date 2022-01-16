import Head from 'next/head';
import React from 'react'

export const index = () => {
    return (
        <>
        <Head>
          <title>WiseX-transactions</title> 
          <link rel="shortcut icon" href="/images/wisex-favicon.png" />
        </Head>
        <div>
            View all transactions.
        </div>
        </>
    )
}

export default index;