import { Container } from '@mui/material'
import { Box } from '@mui/system'
import type { GetServerSideProps, NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import React from 'react'
import Datapack from '../components/datapack'
import Layout from '../components/layout'
import { getGlib, getReleases } from '../lib/datapacks'
import styles from '../styles/Home.module.css'

const Home: NextPage = (glib) => {
  const [heightViewport, setHeightViewport] = React.useState<Number | null>(null);

  return (
    <>
      <Layout getHeightViewport={setHeightViewport}>
        <Datapack data={glib} minHeight={heightViewport} />
      </Layout>
    </>
  )
}

export default Home

export async function getServerSideProps() {
  const glib: {} | null = await getGlib()
  return {
    props:
      JSON.parse(JSON.stringify(glib))
  }
}