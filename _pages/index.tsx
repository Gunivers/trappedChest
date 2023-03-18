import { Box, Button, Container, Divider, MobileStepper, Paper, Typography } from '@mui/material';
import type { NextPage } from 'next'
import Link from 'next/link';
import Image from 'next/image'
import React from 'react'
import Layout from '../components/layout'
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';

import SwipeableViews from 'react-swipeable-views';
import { autoPlay } from 'react-swipeable-views-utils';

const AutoPlaySwipeableViews = autoPlay(SwipeableViews);

const Home: NextPage = (glib) => {
  const [heightViewport, setHeightViewport] = React.useState<Number | null>(null);

  const [activeStep, setActiveStep] = React.useState(0);
  const nbCarousel = 3;
  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1 == nbCarousel ? 0 : prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1 == -1 ? nbCarousel - 1 : prevActiveStep - 1);
  };

  const handleStepChange = (step: number) => {
    setActiveStep(step);
  };

  return (
    <>
      <Layout getHeightViewport={setHeightViewport}>

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', m: 10, flexDirection: { xs: 'column', md: 'row' } }} >
          <Image src={'/logo.png'} width={'200'} height={'200'} alt={'logo'}/>
          <Box sx={{ display: 'flex', flexDirection: 'column' }} >
            <Typography variant={'h1'} sx={{ textDecoration: 'underline' }} >Trapped Chest</Typography>
            <Typography variant={'subtitle1'} sx={{ alignSelf: 'end', pr: 1 }}> easily design vanilla minecraft gui</Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', m: 4, flexDirection: 'column' }}>
          <Button href="/gui" variant='outlined' size={'large'} >Try the generator</Button>

          <Box sx={{ m: 5, display: 'block', width: '100%' }} >
            <Divider />
          </Box>

          <Box sx={{ mt: 3 }}>

            <Box>
              <AutoPlaySwipeableViews
                axis={'x'}
                index={activeStep}
                onChangeIndex={handleStepChange}
                interval={7000}
                containerStyle={{ width: '100vh' }}
                animateHeight
              >
                <Paper sx={{ p: 2, width: 'auto', display: 'flex', flexDirection: 'column', textAlign: 'center' }}>
                  Trapped Chest is a tool that let you design your own plugin like GUI in vanilla Minecraft.
                  <Box sx={{ m: 2 }}>
                    <Image src="/images/home/generator.png" width='800' height='400' alt={'image of the generator'}/>
                  </Box>
                </Paper>

                <Paper sx={{ p: 2, width: 'auto', display: 'flex', flexDirection: 'column', textAlign: 'center' }}>
                  Then it&apos;s generate a datapack you can use everywhere in Minecraft without any mod or plugin.
                  <Box sx={{ m: 2 }}>
                    <Image src="/images/home/ingame.png" width='850' height='400' alt={'image of the ingame output'}/>
                  </Box>
                </Paper>

                <Paper sx={{ p: 2, width: 'auto', display: 'flex', flexDirection: 'column', textAlign: 'center' }}>
                  It is design to make your coding life better for letting you concentrate on other more important things.
                  <Box sx={{ m: 2 }}>
                    <Image src="/images/home/code.png" width='1100' height='400' alt={'image de code minecraft'}/>
                  </Box>
                </Paper>
              </AutoPlaySwipeableViews>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <MobileStepper
                variant="dots"
                steps={nbCarousel}
                position="static"
                activeStep={activeStep}
                sx={{ maxWidth: 400, flexGrow: 1 }}
                nextButton={
                  <Button size="small" onClick={handleNext}>
                    Next
                    <KeyboardArrowRight />
                  </Button>
                }
                backButton={
                  <Button size="small" onClick={handleBack}>
                    <KeyboardArrowLeft />
                    Back
                  </Button>
                }
              />
            </Box>
          </Box>

          <Box sx={{p: 2, display: 'flex', flexDirection: 'row', flexAlign: 'center' }}>
            <Paper>
              <Button variant={'contained'} sx={{ width: '100%' }} href={'/gui'} >Try it now !</Button>
            </Paper>
            <Typography sx={{alignSelf: 'center', mx: 2}} >or</Typography>
            <Button variant={'outlined'}>read the doc soon</Button>
          </Box>

        </Box>
      </Layout>
    </>
  )
}

export default Home