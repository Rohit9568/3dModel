import { Box, Center, Flex, Menu, Stack, Tabs, Text, Tooltip, useMantineTheme } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import {
  IconDown,
  IconRadiusLeft,
  IconTeachNavbarDownload,
  IconTeachNavbarSearch,
  IconTeachNavbarShare
} from '../_Icons/CustonIcons'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '../../store/ReduxStore'
import { isPremiumModalOpened } from '../../store/premiumModalSlice'
import { IconTrash } from '@tabler/icons'
import { LocalStorageKey, RemoveValueFromLocalStorage } from '../../utilities/LocalstorageUtility'
import { Mixpanel } from '../../utilities/Mixpanel/MixpanelHelper'
import { WebAppEvents } from '../../utilities/Mixpanel/AnalyticeEventWebApp'
import styled from 'styled-components'

const isPremiumModalOpenedActions = isPremiumModalOpened.actions

interface ShowNameProps {
  icon: string
}
export function ShowName(props: ShowNameProps) {
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()
  return (
    <Menu shadow='md' width={200}>
      <Menu.Target>
        <Stack spacing={0}>
          <Box
            h={30}
            w={30}
            style={{
              borderRadius: '50%',
              cursor: 'pointer',
              backgroundColor: 'white'
            }}
          >
            <Center w='100%' h='100%'>
              <img src={props.icon} height={30} width={30} />
            </Center>
          </Box>

          <Flex
            align='center'
            justify='center'
            style={{
              cursor: 'pointer'
            }}
          >
            <Text fz={10}>Me</Text>
            <IconDown height='5' width='10' />
          </Flex>
        </Stack>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Item
          color='black'
          icon={
            <img
              alt='Premium'
              src={'../../../assets/premium.png'}
              style={{ width: '16px', height: '16px' }}
            />
          }
          onClick={() => {
            dispatch(isPremiumModalOpenedActions.setModalValue(true))
            Mixpanel.track(WebAppEvents.VIGNAM_APP_GO_PREMIUM_CLICKED)
          }}
        >
          Go Premium
        </Menu.Item>
        <Menu.Item
          color='red'
          icon={<IconTrash size={14} />}
          onClick={() => {
            RemoveValueFromLocalStorage(LocalStorageKey.Token)
            RemoveValueFromLocalStorage(LocalStorageKey.User)
            Mixpanel.logout()

            navigate('/')
          }}
        >
          Logout
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  )
}

function capitalizeWords(sentence: string) {
  // Split the sentence into an array of words
  const words = sentence.split(' ')

  // Capitalize the first letter of each word and make the rest lowercase
  const capitalizedWords = words.map((word) => {
    const firstLetter = word.charAt(0).toUpperCase()
    const restOfWord = word.slice(1).toLowerCase()
    return firstLetter + restOfWord
  })

  // Join the words back into a sentence
  return capitalizedWords.join(' ')
}

const NavBarContainer = styled.div`
  /* width: 100%; */
  padding-top: 10px;
  display: flex;
  flex-direction: row;
  border-bottom: 2px #cccccc solid;
  height: fit-content;
  align-items: center;
  /* margin-top: 20px; */
  position: sticky;
  top: 0;
  z-index: 3;
  background-color: white;
  /* border: 1px red solid; */
  margin: 0 20px;
`

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  margin-left: auto;
  height: 100%;
  /* width: 400px; */
  /* height: 100px; */
  height: auto;
  /* border: 1px red solid; */
`

const StyledButton = styled.button`
  background-color: transparent;
  margin: 5px 12px;
  border: 0;
  cursor: pointer;
`

interface NavbarProps {
  chapterName: string
  setCurrentTab: (s: string | null) => void
  onShareClick: () => void
  setIsShareLink: (b: boolean) => void
}

export const TeachViewPageNavbar: React.FC<NavbarProps> = ({
  chapterName,
  setCurrentTab,
  onShareClick,
  setIsShareLink
}) => {
  const theme = useMantineTheme()
  const navigate = useNavigate()
  const isMd = useMediaQuery(`(max-width: ${theme.breakpoints.md}px)`)
  const isSm = useMediaQuery(`(max-width: ${theme.breakpoints.sm}px)`)

  return (
    <NavBarContainer>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          flexDirection: 'row',
          marginRight: 'auto',
          justifyContent: 'flex-start'
        }}
      >
        <Box
          w='fit-content'
          // h='100%'
          style={{
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0px 10px'
          }}
          onClick={() => {
            setCurrentTab(null)
          }}
        >
          <IconRadiusLeft />
        </Box>
        <Text fz={!isMd ? 20 : 14} color='#000000' fw={600}>
          Chapter | {!isSm && capitalizeWords(chapterName)}
          {isMd && chapterName.length > 20 && `${capitalizeWords(chapterName).substring(0, 20)}...`}
          {isMd && chapterName.length <= 20 && `${capitalizeWords(chapterName)}`}
        </Text>
      </div>
      <ButtonContainer>
        {/* <StyledButton>
            <IconTeachNavbarSearch />
          </StyledButton> */}
        {/* <Tooltip label="Download Content">
          <StyledButton>
            <IconTeachNavbarDownload />
          </StyledButton>
        </Tooltip> */}
        <Tooltip label="Share">

        <StyledButton
          onClick={() => {
            setIsShareLink(true)
          }}
        >
          <IconTeachNavbarShare />
        </StyledButton>
        </Tooltip>
      </ButtonContainer>
    </NavBarContainer>
  )
}
