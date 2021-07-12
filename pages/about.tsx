import React from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { GetStaticProps, GetStaticPaths, GetServerSideProps, } from 'next'

export default () => {
  return (
    <>
    <h5>About</h5>
    <Link href="/">Back</Link>
    </>
  )
}