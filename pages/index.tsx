import type { GetServerSideProps, NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import Datapack from '../components/datapack'
import { getGlib, getReleases } from '../lib/datapacks'
import styles from '../styles/Home.module.css'

const Home: NextPage = (glib) => {
  // console.log(glib)
  // console.log('knkjk')

  // console.log(typeof glib.releases)

  // for (let [key, value] of Object.entries(glib.releases)){
  //   console.log(key, value)
  // }

  // glib.releases.map((canal) => console.log(canal))

  return (
    <>
       <Head>
        <title>Glib Manager</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
      <section>
        <h2>glib</h2>
        <Datapack data={glib}/>
      </section>
      </main>
    </>
  )
}

export default Home

export async function getStaticProps() {
  const glib: {}|null = await getGlib()
  return {
    props: 
      JSON.parse(JSON.stringify(glib))
  }
}