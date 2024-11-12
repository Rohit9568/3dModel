import { Stack } from '@mantine/core'
import { Carousel } from '@mantine/carousel'
import React, { useState } from 'react'
import styled from 'styled-components'
import { SimulationCard } from '../Simulations/Simulations'
import { ISimulation } from '../_New/NewPageDesign/ModifiedOptionsSim'
import TeachSimulationCard from './TeachSimulationCard'

interface SimulationCarouselProps {
  simulations: ISimulation[]
  simulationClickHandler: (name: string, _id: string) => void
  setModalSimulation: (
    val: {
      name: string
      _id: string
      isSimulationPremium: boolean
      videoUrl: string
    } | null
  ) => void
}

const SimulationsCarousel: React.FC<SimulationCarouselProps> = ({
  simulations,
  simulationClickHandler,
  setModalSimulation
}) => {
  const [simulation, setSimulation] = useState<ISimulation>()

  const handleSlideChange = (currentIndex: number) => {
    const currentSimulation = simulations[currentIndex]
    setSimulation(currentSimulation)
  }

  return (
    <Container>
      {simulations?.length !== 0 ? (
        <StyledCarousel
          loop
          sx={{
            '&:[data-inactive]': {
              opacity: 100,
              cursor: 'default'
            }
          }}
          onSlideChange={handleSlideChange}
        >
          {simulations?.map((x) => {
            return (
              <Carousel.Slide
                onChange={() => {
                  setSimulation(x)
                }}
                key={x?._id}
              >
                <Stack
                  align='center'
                  style={{
                    borderRadius: '4px',
                    position: 'relative'
                  }}
                  h='100%'
                  w='100%'
                  pt={10}
                >
                  <SlideContainer>
                    <TeachSimulationCard
                      _id={x?._id}
                      name={x?.name}
                      imageUrl={x?.thumbnailImageUrl}
                      simulationTags={x?.simulationTags || ['']}
                      setShowAuthModal={() => {}}
                      setSimualtionId={() => {}}
                      //@ts-ignore
                      setPlaySimulation={() => {}}
                      paramValue={null}
                      userSubscriptionType={'PREMIUM'}
                      isSimulationPremium={true}
                      setModalSimulation={setModalSimulation}
                      videoUrl={x?.videoUrl}
                      showInfo={true}
                      simulationClickHandler={simulationClickHandler}
                    />
                  </SlideContainer>
                </Stack>
              </Carousel.Slide>
            )
          })}
        </StyledCarousel>
      ) : <></>}
    </Container>
  )
}

export default SimulationsCarousel

const Container = styled.div`
  /* flex: 1; */
  width: 80%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`
const StyledCarousel = styled(Carousel)`
  cursor: pointer;
  .mantine-Stack-root {
    padding: 0;
    div {
      margin-top: 0;
    }
  }
  .mantine-Carousel-viewport {
    height: 100% !important;
  }
  max-width: 441px;
  @media (max-width: 1550px) {
    max-width: 341px;
  }
  @media (max-width: 1300px) {
    max-width: 250px;
  }
  @media (max-width: 1100px) {
    max-width: 441px;
  }
  @media (max-width: 1000px) {
    max-width: 339px;
  }
  @media (max-width: 850px) {
    max-width: 320px;
  }
  @media (max-width: 650px) {
    max-width: 300px;
  }
  @media (max-width: 550px) {
    max-width: 250px;
  }
  @media (max-width: 450px) {
    max-width: 200px;
  }
  @media (max-width: 350px) {
    max-width: 190px;
  }
  @media (max-width: 300px) {
    max-width: 160px;
  }
`

const SlideContainer = styled.div`
  width: 80%;
  height: 100%;
  flex: 0 0 auto;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  /* margin: 5px 20px 5px 20px; */
  @media (max-width: 1000px) {
    width: 100%;
    padding-right: 0;
  }
  
  max-width: 440px;
  /* @media (max-width: 1550px) {
    max-width: 330px;
  }
  @media (max-width: 1300px) {
    max-width: 200px;
  }
  @media (max-width: 1000px) {
    max-width: 500px;
  }
  @media (max-width: 480px) {
    max-width: 250px;
  }
  @media (max-width: 480px) {
    max-width: 130px;
  } */
`
