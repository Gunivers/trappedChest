import type { NextPage } from 'next'
import React from 'react'
import Datapack from '../components/datapack'
import Layout from '../components/layout'
import { getGlib } from '../lib/datapacks'

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