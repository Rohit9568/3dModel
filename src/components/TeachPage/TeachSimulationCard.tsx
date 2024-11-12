import { useDisclosure, useMediaQuery } from '@mantine/hooks'
import React, { useState } from 'react'
import { SideBarItems } from '../../@types/SideBar.d'
import { useDispatch } from 'react-redux'
import { Box, Button, useMantineTheme } from '@mantine/core'
import { useStyles } from '../Simulations/Simulations'
import { ParentPageEvents } from '../../utilities/Mixpanel/AnalyticEventParentApp'
import { WebAppEvents } from '../../utilities/Mixpanel/AnalyticeEventWebApp'
import { Mixpanel } from '../../utilities/Mixpanel/MixpanelHelper'
import styled from 'styled-components'

interface IProps {
  _id: string
  name: string
  lgNo?: number
  imageUrl: string | undefined
  simulationTags: string[]
  setShowAuthModal: (val: boolean) => void
  setSimualtionId: (val: string) => void
  setPlaySimulation: (val: string) => void
  paramValue: string | null
  userSubscriptionType: string
  isSimulationPremium: boolean
  setModalSimulation: (
    val: {
      name: string
      _id: string
      isSimulationPremium: boolean
      videoUrl: string
    } | null
  ) => void
  videoUrl: string
  showInfo: boolean
  simulationClickHandler?: (name: string, _id: string) => void
}

const TeachSimulationCard: React.FC<IProps> = (props) => {
  const { classes } = useStyles()
  const [modalHover, setModalHover] = useState(false)
  const [hovered, setHovered] = useState(false)
  const handleMouseEnter = () => {
    setHovered(true)
  }
  const handleMouseLeave = () => {
    setHovered(false)
  }

  const theme = useMantineTheme()
  const isMd = useMediaQuery(`(max-width: ${theme.breakpoints.md}px)`)

  const handleSetModalSimulation = (e: any) => {
    props.setModalSimulation({
      name: props.name,
      _id: props._id,
      isSimulationPremium: props.isSimulationPremium,
      videoUrl: props.videoUrl
    })
    if (props.paramValue && props.paramValue === 'parent') {
      Mixpanel.track(ParentPageEvents.PARENT_APP_SIMULATION_PAGE_SIMULATION_CLICKED, {
        simulationName: props.name,
        id: props._id
      })
    } else
      Mixpanel.track(WebAppEvents.TEACHER_APP_SIMULATION_PAGE_SIMULATION_CLICKED, {
        simulationName: props.name,
        id: props._id
      })
  }

  const handleOpenSimulation = () => {
    props.setModalSimulation({
      name: props.name,
      _id: props._id,
      isSimulationPremium: props.isSimulationPremium,
      videoUrl: props.videoUrl
    })
  }

  const handleOnButtonCLick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation()

    if (props.userSubscriptionType === 'FREE') {
      if (props.isSimulationPremium === undefined || props.isSimulationPremium) {
        Mixpanel.track(WebAppEvents.VIGNAM_APP_PREMIUM_FEATURE_ACCESSED, {
          feature_name: 'premium_simulation_accessed',
          current_page: 'all_simulations_page'
        })
        // dispatch(isPremiumModalOpenedActions.setModalValue(true));
      } else {
        props.setPlaySimulation(props._id)
        if (props.simulationClickHandler) {
          props.simulationClickHandler(props.name, props._id)
        }
      }
    } else if (props.userSubscriptionType !== 'FREE') {
      if (props.isSimulationPremium === undefined || props.isSimulationPremium) {
        props.setPlaySimulation(props._id)
        if (props.simulationClickHandler) {
          props.simulationClickHandler(props.name, props._id)
        }
      } else {
        props.setPlaySimulation(props._id)
        if (props.simulationClickHandler) {
          props.simulationClickHandler(props.name, props._id)
        }
      }
    }
    if (props.paramValue && props.paramValue === 'parent') {
      Mixpanel.track(ParentPageEvents.PARENT_APP_SIMULATION_PAGE_SIMULATION_CLICKED, {
        simulationName: props.name,
        id: props._id
      })
    } else
      Mixpanel.track(WebAppEvents.TEACHER_APP_SIMULATION_PAGE_SIMULATION_CLICKED, {
        simulationName: props.name,
        id: props._id
      })
  }

  const handleNameClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation()
    if (props.userSubscriptionType === 'FREE') {
      if (props.isSimulationPremium === undefined || props.isSimulationPremium) {
        Mixpanel.track(WebAppEvents.VIGNAM_APP_PREMIUM_FEATURE_ACCESSED, {
          feature_name: 'premium_simulation_accessed',
          current_page: 'all_simulations_page'
        })
        // dispatch(
        //   isPremiumModalOpenedActions.setModalValue(true)
        // );
      } else {
        props.setPlaySimulation(props._id)
      }
    } else if (props.userSubscriptionType !== 'FREE') {
      if (props.isSimulationPremium === undefined || props.isSimulationPremium) {
        props.setPlaySimulation(props._id)
      } else {
        props.setPlaySimulation(props._id)
      }
    }
    if (props.paramValue && props.paramValue === 'parent') {
      Mixpanel.track(ParentPageEvents.PARENT_APP_SIMULATION_PAGE_SIMULATION_CLICKED, {
        simulationName: props.name,
        id: props._id
      })
    } else
      Mixpanel.track(WebAppEvents.TEACHER_APP_SIMULATION_PAGE_SIMULATION_CLICKED, {
        simulationName: props.name,
        id: props._id
      })
  }

  return (
    <Box
      style={{
        cursor: 'pointer',
        height: '100%',
        width: '100%',
        marginTop: '0'
      }}
      onClick={handleOpenSimulation}
      className='herethis'
    >
      <div
        className=''
        style={{
          border: '1px solid black',
          borderRadius: '12px',
          height: '100%',
          width: '100%',
          backgroundColor: 'white'
        }}
      >
        <img
          src={props.imageUrl}
          alt='Props'
          style={{
            width: '100%',
            aspectRatio: '16/6',
            cursor: 'pointer',
            // aspectRatio: 1.8,
            borderRadius: '12px 12px 0 0'
            // height: matches ? "170px" : "102px",
          }}
          onClick={handleSetModalSimulation}
          className='simulation-img'
        />

        <Button
          variant='light'
          size='xl'
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          style={{
            position: 'absolute',
            top: '35%',
            left: '50%',
            width: '50px',
            height: '50px',
            transform: 'translate(-50%, -50%)',
            padding: '10px',
            border: '3px solid white',
            borderColor: 'white',
            borderRadius: '50%',
            cursor: 'pointer',
            fontSize: '18px',
            transition: 'background-color 0.3s',
            opacity: hovered ? 0.8 : 1,
            backgroundColor: hovered ? 'lightgrey' : 'transparent'
          }}
          onClick={handleOnButtonCLick}
        >
          <img
            src={require('../../assets/playBtn.png')}
            alt='Play'
            style={{ width: '18px', height: '18px' }}
          />
        </Button>

        <div style={{ marginBottom: '5px', padding: '2px' }}>
          <div
            style={{
              width: '100%',
              padding: '0',
              wordWrap: 'break-word'
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  flexDirection: 'column',
                  paddingLeft: '5px'
                }}
              >
                <span
                  className={classes.title}
                  style={{
                    fontSize: '16px',
                    fontFamily: 'Nunito',
                    fontWeight: '700',
                    cursor: 'pointer',
                    marginBottom: '1px'
                  }}
                  onClick={handleNameClick}
                >
                  {isMd ? (
                    props.name.length > 15 ? (
                      <>{props.name.slice(0, 15)}...</>
                    ) : (
                      <>{props.name}</>
                    )
                  ) : (
                    <>{props.name}</>
                  )}
                </span>
                <div
                  style={{
                    display: 'flex',
                    // alignSelf: 'flex-end',
                    gap: '7px',
                    // alignItems: 'center',
                    color: '#707070',
                    // // position: "absolute",
                    // left: '10px',
                    // marginTop: '-15px',
                    // overflow: 'hidden',
                    width: '100%'
                    // overflowWrap: 'break-word'
                  }}
                >
                  {props.simulationTags.slice(0, isMd ? 2 : 2).map((tag, index) => (
                    <React.Fragment key={index}>
                      {index !== 0 && (
                        <span
                          style={{
                            height: '4px',
                            width: '4px',
                            backgroundColor: '#707070',
                            borderRadius: '3px',
                            marginTop: 'auto',
                            marginBottom: 'auto'
                          }}
                        ></span>
                      )}
                      <p style={{ fontSize: '12px', margin: '0' }} className='simu-tag'>
                        {isMd ? (
                          tag.length > 17 ? (
                            <>{tag.slice(0, 17)}...</>
                          ) : (
                            <>{tag}</>
                          )
                        ) : (
                          <>{tag.split(' ')[0]}</>
                        )}
                      </p>
                      {isMd ? <br></br> : <></>}
                    </React.Fragment>
                  ))}
                </div>
              </div>
              {props.showInfo === true && (
                <img
                  alt='Info'
                  src={require(`../../assets/infoBtn${modalHover ? '2' : ''}.png`)}
                  onClick={() => {
                    props.setModalSimulation({
                      name: props.name,
                      _id: props._id,
                      isSimulationPremium: props.isSimulationPremium,
                      videoUrl: props.videoUrl
                    })
                  }}
                  style={{
                    cursor: 'pointer',
                    width: '30px',
                    marginTop: '-20px'
                  }}
                  onMouseEnter={() => setModalHover(true)}
                  onMouseLeave={() => setModalHover(false)}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </Box>
  )
}

export default TeachSimulationCard

const TextInfoContainer = styled.div``
