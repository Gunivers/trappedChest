import { Button } from '@mui/material';
import type { NextPage } from 'next'
import Link from 'next/link';
import React from 'react'
import Layout from '../components/layout'

const Home: NextPage = (glib) => {
  const [heightViewport, setHeightViewport] = React.useState<Number | null>(null);

  return (
    <>
      <Layout getHeightViewport={setHeightViewport}>
        <Button href="/gui" variant='contained' sx={{m: 10}} >gui</Button>
      </Layout>
    </>
  )
}

export default Home