import { Modal } from '@mantine/core'
import React, { useState } from 'react'
import styled from 'styled-components'

interface TeachInteractProps {
  selectedSubject: SingleSubject
  selectedChapter: SingleChapter
  selectedTopic: SingleTopic | null
  chapterChangeHandler: (id: string) => void
  topicChangeHandler: (id: string) => void
  currentTab: string | null
  viewportRef: any
  setloadingData: (val: boolean) => void
  isLoading: boolean
}

const Container = styled.div`
  display: flex;
  flex-direction: row;
  flex: 2;
  margin-top: 20px;
  flex-grow: 1;
  min-height: 95vh;
  @media (max-width: 1280px) {
    display: none;
  }
  width: 100%;
  overflow: hidden;
`
const ContainerMobile = styled.div`
  display: flex;
  flex-direction: row;
  flex: 3;
  margin-top: 20px;
  min-height: 100vh;
  width: 100%;
  overflow-y: scroll;
  /* flex-grow: 1; */
  width: 100%;
  @media (min-width: 1280px) {
    display: none;
  }
`
const ContentContainer = styled.div`
  overflow: hidden;
  overflow-y: scroll;
  // Hide scrollbar for Chrome, Safari and Opera
  &::-webkit-slider-thumb {
    display: none;
  }
  &::-webkit-slider-runnable-track {
    display: none;
  }

  // Hide scrollbar for IE, Edge, and Firefox
  -ms-overflow-style: none; // IE and Edge
  scrollbar-width: none; // Firefox
`

const ToggleButton = styled.button`
  position: fixed;
  bottom: 100px;
  right: 0;
  z-index: 10;
  background-color: transparent;
  border: 0;
  @media (max-width: 1280) {
    display: none;
  }
`
const TeachInteract: React.FC<TeachInteractProps> = (props) => {
  const [showTopicInfo, setShowTopicInfo] = useState(true)
  const toggleView = () => setShowTopicInfo(!showTopicInfo)
  return (
    <>
      {/* <Container className='teachinteract'>
        <ContentContainer>
          
        </ContentContainer>
        <Whiteboard></Whiteboard>
      </Container> */}
      {/* <ContainerMobile>
        {showTopicInfo ? (
          <></>
        ) : (
          // <Whiteboard />
        )}
        <ToggleButton onClick={toggleView}>
          <svg
            width='69'
            height='81'
            viewBox='0 0 69 81'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
          >
            <g filter='url(#filter0_d_8_1070)'>
              <rect
                x='22.3125'
                y='18.6411'
                width='158.502'
                height='36.3588'
                rx='4'
                fill={showTopicInfo ? 'gray' : '#4B65F6'}
              />
              <path
                d='M52.5858 27.9836C53.097 27.4821 53.7844 27.2009 54.5005 27.2002C55.2166 27.1994 55.9046 27.4793 56.4168 27.9797C56.9291 28.4802 57.2249 29.1614 57.2409 29.8773C57.2568 30.5933 56.9917 31.287 56.5023 31.8098L51.9518 36.5774C51.6644 36.8785 51.295 37.0889 50.8894 37.1824L47.6114 37.9386C47.4984 37.9647 47.3807 37.9627 47.2686 37.9328C47.1565 37.903 47.0534 37.8461 46.9684 37.7672C46.8834 37.6882 46.819 37.5897 46.7808 37.4801C46.7427 37.3706 46.732 37.2533 46.7496 37.1387L47.2467 33.9061C47.3156 33.4582 47.5255 33.0438 47.8461 32.7233L52.5858 27.9836ZM55.6177 29.1886C55.5095 29.0264 55.3667 28.8903 55.1996 28.79C55.0324 28.6897 54.8451 28.6277 54.6511 28.6086C54.4571 28.5894 54.2613 28.6135 54.0777 28.6791C53.8942 28.7447 53.7275 28.8502 53.5896 28.988L48.8505 33.7272C48.7436 33.834 48.6735 33.9721 48.6505 34.1215L48.3125 36.3195L50.5701 35.7985C50.7053 35.7673 50.8283 35.6972 50.924 35.5968L55.4746 30.8293C55.6812 30.6127 55.808 30.3322 55.834 30.034C55.86 29.7358 55.7837 29.4377 55.6177 29.1886ZM48.8414 29.7192H38.3615C37.7965 29.7192 37.2546 29.9436 36.8551 30.3432C36.4556 30.7427 36.2311 31.2846 36.2311 31.8496V34.6515C36.8049 34.2271 37.4275 33.7914 38.0536 33.4221C38.816 32.9722 39.642 32.5842 40.4317 32.4637C41.2526 32.3387 42.1053 32.4989 42.7354 33.2341C43.0325 33.5806 43.2052 33.9641 43.2592 34.3731C43.312 34.7731 43.2455 35.1548 43.1313 35.4991C42.9268 36.1161 42.5218 36.7308 42.1815 37.2477L42.1133 37.3506C41.7258 37.9408 41.4338 38.4107 41.3225 38.8293C41.2714 39.0225 41.2685 39.1719 41.2981 39.2958C41.3259 39.4151 41.3946 39.5594 41.5622 39.7275C41.7912 39.9559 41.9929 40.0371 42.1644 40.0593C42.3462 40.0832 42.5615 40.0491 42.8177 39.9389C43.3535 39.7088 43.9017 39.2236 44.3925 38.7328C44.5257 38.5996 44.7064 38.5247 44.8947 38.5247C45.0831 38.5247 45.2638 38.5996 45.3969 38.7328C45.5301 38.866 45.605 39.0466 45.605 39.235C45.605 39.4233 45.5301 39.604 45.3969 39.7372C44.9033 40.2314 44.188 40.8961 43.3785 41.2438C42.9626 41.4222 42.4854 41.5335 41.9798 41.4676C41.4634 41.4 40.9822 41.1557 40.5578 40.7314C40.2277 40.4007 40.0107 40.0292 39.9153 39.6196C39.8204 39.2151 39.8551 38.8225 39.9499 38.4646C40.1317 37.7829 40.5675 37.1165 40.9265 36.5706L40.9464 36.5404C41.3304 35.9564 41.6395 35.4855 41.7832 35.052C41.8514 34.8458 41.8679 34.6867 41.8514 34.5589C41.8355 34.4396 41.7866 34.3089 41.6571 34.1584C41.435 33.8988 41.1339 33.7931 40.6459 33.8675C40.1261 33.947 39.4869 34.2254 38.7757 34.6447C38.0752 35.0583 37.3599 35.5758 36.6924 36.0803C36.5373 36.1973 36.3828 36.3155 36.2311 36.4319V42.9277C36.2311 43.4927 36.4556 44.0346 36.8551 44.4341C37.2546 44.8336 37.7965 45.0581 38.3615 45.0581H53.9844C54.5495 45.0581 55.0913 44.8336 55.4909 44.4341C55.8904 44.0346 56.1148 43.4927 56.1148 42.9277V34.2726L57.5351 32.7841V42.9277C57.5351 43.8694 57.161 44.7725 56.4951 45.4384C55.8293 46.1042 54.9261 46.4783 53.9844 46.4783H38.3615C37.4198 46.4783 36.5167 46.1042 35.8508 45.4384C35.1849 44.7725 34.8109 43.8694 34.8109 42.9277V31.8496C34.8109 30.9079 35.1849 30.0048 35.8508 29.3389C36.5167 28.673 37.4198 28.2989 38.3615 28.2989H50.2616L48.8414 29.7192Z'
                fill='white'
              />
            </g>
            <defs>
              <filter
                id='filter0_d_8_1070'
                x='0.3125'
                y='0.641113'
                width='202.502'
                height='80.3588'
                filterUnits='userSpaceOnUse'
                color-interpolation-filters='sRGB'
              >
                <feFlood flood-opacity='0' result='BackgroundImageFix' />
                <feColorMatrix
                  in='SourceAlpha'
                  type='matrix'
                  values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0'
                  result='hardAlpha'
                />
                <feOffset dy='4' />
                <feGaussianBlur stdDeviation='11' />
                <feComposite in2='hardAlpha' operator='out' />
                <feColorMatrix type='matrix' values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0' />
                <feBlend
                  mode='normal'
                  in2='BackgroundImageFix'
                  result='effect1_dropShadow_8_1070'
                />
                <feBlend
                  mode='normal'
                  in='SourceGraphic'
                  in2='effect1_dropShadow_8_1070'
                  result='shape'
                />
              </filter>
            </defs>
          </svg>
        </ToggleButton>
      </ContainerMobile> */}
    </>
  )
}

export default TeachInteract
