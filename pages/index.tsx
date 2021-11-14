import { Container } from '@mui/material'
import type { GetServerSideProps, NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import Datapack from '../components/datapack'
import { getGlib, getReleases } from '../lib/datapacks'
import styles from '../styles/Home.module.css'

const Home: NextPage = (glib) => {
  return (
    <>
      <Datapack data={glib}/>
    </>
  )
}

export default Home

export async function getServerSideProps() {
  const glib: {}|null = await getGlib()
  return {
    props: 
      JSON.parse(JSON.stringify(glib))
  }
}