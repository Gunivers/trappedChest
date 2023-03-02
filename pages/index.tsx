import { Box, Button, Container, Typography } from '@mui/material';
import type { NextPage } from 'next'
import Link from 'next/link';
import Image from 'next/image'
import React from 'react'
import Layout from '../components/layout'

const Home: NextPage = (glib) => {
  const [heightViewport, setHeightViewport] = React.useState<Number | null>(null);

  return (
    <>
      <Layout getHeightViewport={setHeightViewport}>

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', m: 10, flexDirection: { xs: 'column', md: 'row' } }} >
          <Image src={'/logo.png'} width={'200%'} height={'200%'} />
          <Box sx={{ display: 'flex', flexDirection: 'column' }} >
            <Typography variant={'h1'} sx={{ textDecoration: 'underline' }} >Trapped Chest®</Typography>
            <Typography variant={'subtitle1'} sx={{ alignSelf: 'end', pr: 1 }}> easily design vanilla minecraft gui</Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', m: 10 }} >
          <Button href="/gui" variant='outlined' size={'large'} >Try the generator</Button>
        </Box>
      </Layout>
    </>
  )
}

export default Home