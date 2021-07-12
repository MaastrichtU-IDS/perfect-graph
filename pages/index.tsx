import React from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { GetStaticProps, GetStaticPaths, GetServerSideProps, } from 'next'

export default function Home() {
  return (
    <div >
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Link href="/about">About</Link>
      
    </div>
  )
}
