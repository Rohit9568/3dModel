import {
  Box,
  Button,
  Center,
  Chip,
  Divider,
  Flex,
  Group,
  Loader,
  Menu,
  Select,
  Stack,
  Tabs,
  Text,
  Tooltip,
  useMantineTheme,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import {
  BackButtonWithCircle,
  IconBackArrow,
  IconDown,
  IconRadiusLeft,
  IconShareCustom,
  IconTeach2,
  IconTeachNavbarDownload,
  IconTeachNavbarSearch,
  IconTeachNavbarShare,
  IconTest2,
} from "../../_Icons/CustonIcons";
import { useNavigate } from "react-router-dom";
import { Pages } from "./ModifiedOptionsSim";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../store/ReduxStore";
import { User1 } from "../../../@types/User";
import { useEffect, useState } from "react";
import { isPremiumModalOpened } from "../../../store/premiumModalSlice";
import {
  IconArrowsDown,
  IconChevronDown,
  IconChevronLeft,
  IconTrash,
} from "@tabler/icons";
import {
  LocalStorageKey,
  RemoveValueFromLocalStorage,
} from "../../../utilities/LocalstorageUtility";
import { Mixpanel } from "../../../utilities/Mixpanel/MixpanelHelper";
import { SerachBarWeb } from "../../NavbarTeacher/SearchBarWeb";
import { WebAppEvents } from "../../../utilities/Mixpanel/AnalyticeEventWebApp";
import styled from "styled-components";
import { TeachTabs } from "./ModifiedOptionsSim";
import { Teach } from "../../../pages/_New/Teach";
import { htmlToPdf } from "../../../features/htmlToPDf/htmlToPDf";
import ReactDOMServer from "react-dom/server";
import getCombinedHTMLFromTopics from "../../SideUserBar/GetCombinedHTML";

const isPremiumModalOpenedActions = isPremiumModalOpened.actions;

interface ShowNameProps {
  icon: string;
}
export function ShowName(props: ShowNameProps) {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  return (
    <Menu shadow="md" width={200}>
      <Menu.Target>
        <Stack spacing={0}>
          <Box
            h={30}
            w={30}
            style={{
              borderRadius: "50%",
              cursor: "pointer",
              backgroundColor: "white",
            }}
          >
            <Center w="100%" h="100%">
              <img src={props.icon} height={30} width={30} />
            </Center>
          </Box>

          <Flex
            align="center"
            justify="center"
            style={{
              cursor: "pointer",
            }}
          >
            <Text fz={10}>Me</Text>
            <IconDown height="5" width="10" />
          </Flex>
        </Stack>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Item
          color="black"
          icon={
            <img
              alt="Premium"
              src={"../../../assets/premium.png"}
              style={{ width: "16px", height: "16px" }}
            />
          }
          onClick={() => {
            dispatch(isPremiumModalOpenedActions.setModalValue(true));
            Mixpanel.track(WebAppEvents.VIGNAM_APP_GO_PREMIUM_CLICKED);
          }}
        >
          Go Premium
        </Menu.Item>
        <Menu.Item
          color="red"
          icon={<IconTrash size={14} />}
          onClick={() => {
            RemoveValueFromLocalStorage(LocalStorageKey.Token);
            RemoveValueFromLocalStorage(LocalStorageKey.User);
            Mixpanel.logout();

            navigate("/");
          }}
        >
          Logout
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}

interface NavbarProps {
  currentPage: Pages;
  onPageChange: (page: Pages) => void;
  selectedSubject: SingleSubject;
  selectedChapter: SingleChapter;
  chapterChangeHandler: (id: string) => void;
  onShareClick: () => void;
  currentTab: string | null;
  setIsShareLink: (b: boolean) => void;
  setCurrentTab: (a: any) => void;
}

function capitalizeWords(sentence: string) {
  // Split the sentence into an array of words
  const words = sentence.split(" ");

  // Capitalize the first letter of each word and make the rest lowercase
  const capitalizedWords = words.map((word) => {
    const firstLetter = word.charAt(0).toUpperCase();
    const restOfWord = word.slice(1).toLowerCase();
    return firstLetter + restOfWord;
  });

  // Join the words back into a sentence
  return capitalizedWords.join(" ");
}

const NavBarContainer = styled.div`
  padding-top: 10px;
  display: flex;
  flex-direction: column;
  height: fit-content;
  align-items: center;
  position: sticky;
  width: 100%;
  top: 0;
  padding: 10px 20px 0 20px;
  z-index: 3;
  background-color: white;
  @media (max-width: 480px) {
    padding: 10px 20px 0 0;
  }
`;

const Desktopview = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  /* justify-content: space-between; */
  justify-content: center;
  align-items: flex-end;
  border-bottom: 2px #cccccc solid;
  /* border: 1px red solid; */
  @media (max-width: 1300px) {
    border-bottom: 0px;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  margin-left: auto;
  height: 100%;
  /* width: 400px; */
  /* height: 100px; */
  height: auto;
  align-self: center;
  /* border: 1px red solid; */
`;
const StyledListDesktop = styled.div`
  height: 100% !important;
  justify-self: center;
  display: flex;
  justify-content: center;
  align-content: center;
  @media (max-width: 1300px) {
    display: none;
  }
`;
const StyledListMobile = styled.div`
  border-bottom: 0px;
  margin-top: 5px;
  justify-self: center;
  align-self: flex-start;
  width: 100%;
  border-bottom: 2px #cccccc solid;
  @media (min-width: 1301px) {
    display: none;
  }
  @media (max-width: 480px) {
    margin-left: 10px;
  }
`;
const StyledButton = styled.button`
  background-color: transparent;
  margin: 5px 12px;
  border: 0;
  cursor: pointer;
  &:disabled {
    cursor: not-allowed;
  }
`;

interface TabsProps {
  isactive: boolean;
}

const StyledTab = styled.button<TabsProps>`
  background-color: transparent;
  border: 0px;
  font-family: "Nunito";
  font-size: 14px;
  font-weight: 700;
  padding: 0 10px 10px 10px;
  font-size: 14px;
  font-family: "Nunito";
  color: ${({ isactive }) => (isactive ? "black" : "#cccccc")} !important;
  border-bottom: ${({ isactive }) =>
    isactive ? "3px #4B65F6 solid" : "0"} !important;
  cursor: pointer;
`;
export function Navbar(props: NavbarProps) {
  const theme = useMantineTheme();
  const navigate = useNavigate();
  const isMd = useMediaQuery(`(max-width: ${theme.breakpoints.md}px)`);
  const isSm = useMediaQuery(`(max-width: ${theme.breakpoints.sm}px)`);
  const user = useSelector<RootState, User1 | null>((state) => {
    return state.currentUser.user;
  });
  const dispatch = useDispatch<AppDispatch>();
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownloadClick = () => {
    const topics = props?.selectedChapter?.topics;
    let bodyContentHTML = topics.reduce((acc, topic) => {
      acc +=
        `<h1>${topic.name}</h1>` +
        /<body.*?>([\s\S]*)<\/body>/.exec(topic.theory); // Combine name and theory
      return acc;
    }, "");
    setIsDownloading(true);
    htmlToPdf({
      html: ReactDOMServer.renderToString(
        getCombinedHTMLFromTopics(props?.selectedChapter?.topics)
      ),
      showBorder: false,
      showWaterMark: null,
    })
      .then((data2: any) => {
        var link = document.createElement("a");
        link.href = window.URL.createObjectURL(
          new Blob([data2], { type: "application/pdf" })
        );

        link.download = `${data2.name}.pdf`;
        link.click();
        link.remove();
        setIsDownloading(false);
      })
      .catch((error) => {
        setIsDownloading(false);
        console.error("Error:", error);
      });
  };

  const allChaptersData = props.selectedSubject.userChapters.map((x) => {
    return {
      value: x._id,
      label: x.name,
    };
  });

  const mainPath = useSelector<RootState, string | null>((state) => {
    return state.mainPathSlice.value;
  });

  return (
    <NavBarContainer>
      <Desktopview>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            flexDirection: "row",
            marginRight: "auto",
            justifyContent: "flex-start",
            paddingBottom: "5px",
          }}
        >
          <Box
            w="fit-content"
            // h='100%'
            style={{
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0px 10px",
            }}
            onClick={() => {
              navigate(
                `${mainPath}/teach/chapterSelect/${props.selectedSubject._id}`
              );
            }}
          >
            <IconRadiusLeft />
          </Box>
          <Text
            fz={20}
            // w={isMd ? '90%' : '70%'}
            // pl={10}
            // mr={10}
            color="#000000"
            fw={600}
          >
            {/* {!isSm ? capitalizeWords('Chapter | ' + props.selectedChapter.name) : props.selectedChapter.name.length > 20 ? capitalizeWords(props.selectedChapter.name).substring(0, 20)... : ${capitalizeWords(props.selectedChapter.name)}} */}
            {!isSm ? (
              capitalizeWords("Chapter | " + props.selectedChapter.name)
            ) : props.selectedChapter.name.length ? (
              <>
                {capitalizeWords(props.selectedChapter.name).substring(0, 20) +
                  "..."}
              </>
            ) : (
              <>{capitalizeWords(props.selectedChapter.name)}</>
            )}
          </Text>
          {!isMd && (
            <Text
              onClick={() => {
                props.onShareClick();
              }}
              bg={props.selectedChapter.shared ? "green" : "red"}
              px={8}
              py={2}
              ml={4}
              color="white"
              style={{
                borderRadius: "3px",
                cursor: "pointer",
              }}
              fz={12}
            >
              {props.selectedChapter.shared ? "Shared" : "Not Shared"}
            </Text>
          )}
        </div>
        <StyledListDesktop color="blue">
          <StyledTab
            className="styled-tab"
            value={TeachTabs.teach}
            isactive={props.currentTab === TeachTabs.teach}
            onClick={() => {
              props?.setCurrentTab(TeachTabs.teach);
            }}
          >
            Teach
          </StyledTab>
          <StyledTab
            className="styled-tab"
            value={TeachTabs.resources}
            isactive={props.currentTab === TeachTabs.resources}
            onClick={() => {
              props?.setCurrentTab(TeachTabs.resources);
            }}
          >
            Resources
          </StyledTab>
          <StyledTab
            className="styled-tab"
            value={TeachTabs.mindmap}
            isactive={props.currentTab === TeachTabs.mindmap}
            onClick={() => {
              props?.setCurrentTab(TeachTabs.mindmap);
            }}
          >
            Mind-map
          </StyledTab>
        </StyledListDesktop>
        <ButtonContainer>
          {/* <StyledButton>
            <IconTeachNavbarSearch />
          </StyledButton> */}
          {/* <Tooltip label='Download Content'>
            <StyledButton onClick={handleDownloadClick} disabled={isDownloading}>
              {isDownloading ? <Loader color='gray' width={'32px'} height={'41px'}/>: <IconTeachNavbarDownload />}
            </StyledButton>
          </Tooltip> */}
          <Tooltip label="Share">
            <StyledButton
              onClick={() => {
                props?.setIsShareLink(true);
              }}
            >
              <IconTeachNavbarShare />
            </StyledButton>
          </Tooltip>
        </ButtonContainer>
      </Desktopview>
      <StyledListMobile>
        <StyledTab
          className="styled-tab"
          value={TeachTabs.teach}
          isactive={props.currentTab === TeachTabs.teach}
          onClick={() => {
            props?.setCurrentTab(TeachTabs.teach);
          }}
        >
          {TeachTabs.teach}
        </StyledTab>
        <StyledTab
          className="styled-tab"
          value={TeachTabs.resources}
          isactive={props.currentTab === TeachTabs.resources}
          onClick={() => {
            props?.setCurrentTab(TeachTabs.resources);
          }}
        >
          {TeachTabs.resources}
        </StyledTab>
        <StyledTab
          className="styled-tab"
          value={TeachTabs.mindmap}
          isactive={props.currentTab === TeachTabs.mindmap}
          onClick={() => {
            props?.setCurrentTab(TeachTabs.mindmap);
          }}
        >
          {TeachTabs.mindmap}
        </StyledTab>
      </StyledListMobile>
    </NavBarContainer>
  );
}

//##Note: To be deleted before merging
{
  /* chapter and back button start */
}
{
  /* <Flex
w={isMd ? "100%" : "40%"}
align="center"
justify={isMd ? "space-between" : "left"}
style={{
  display: 'none'
}}
>
<Flex align="center" style={{border: '1px red solid'}}>
  <div
    style={{
      display: "flex",
      alignItems: "center",
      // maxWidth: "50%",
      gap: "20px",
    }}
  >
    <Box
      w="100%"
      h="100%"
      style={{
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        margin: "0px 10px",
      }}
      onClick={() => {
        if (props.currentTab) {
          navigate(
            `${mainPath}/teach/study/${props.selectedSubject._id}/${props.selectedChapter._id}`
          );
        } else {
          navigate(
            `${mainPath}/teach/chapterSelect/${props.selectedSubject._id}`
          );
        }
      }}
    >
      <IconRadiusLeft />
    </Box>
  </div> */
}

{
  /* Chapter start */
}
// <Text
//   fz={18}
//   // w={isMd ? "80%" : "70%"}
//   // style={{
//   //   border:'red solid 1px'
//   // }}
//   pl={10}
//   mr={10}
//   color="#666666"
//   fw={600}
// >
//   Chapter | {!isMd && capitalizeWords(props.selectedChapter.name)}
//   {isMd &&
//     props.selectedChapter.name.length > 20 &&
//     `${capitalizeWords(props.selectedChapter.name).substring(
//       0,
//       20
//     )}...`}
//   {isMd &&
//     props.selectedChapter.name.length <= 20 &&
//     `${capitalizeWords(props.selectedChapter.name)}`}
// </Text>
{
  /* Chapter end */
}
// </Flex>
{
  /* share icon show in small screen end */
}
// {!isMd && !props.selectedChapter.shared && (
//   <Flex
//     bg="#FF3F3F"
//     onClick={() => {
//       props.onShareClick();
//     }}
//     sx={{
//       "&:hover": {
//         backgroundColor: "none",
//       },
//       cursor: "pointer",
//       borderRadius: "3px",
//     }}
//     w="120px"
//     align="center"
//     px={10}
//     py={2}
//     justify="space-between"
//   >
//     <Text color="white" fz={13}>
//       Click To Share
//     </Text>
//     <Flex
//       w={10}
//       h={10}
//       align="center"
//       justify="center"
//       // ml={5}
//     >
//       <IconShareCustom col="white" />
//     </Flex>
//   </Flex>
// )}
{
  /* share icon show in small screen end */
}
{
  /* Shared icon start */
}
{
  /* {!isMd && props.selectedChapter.shared && (
  <Flex
    bg="#00C808"
    onClick={() => {
      props.onShareClick();
    }}
    sx={{
      "&:hover": {
        backgroundColor: "none",
      },
      cursor: "pointer",
      borderRadius: "3px",
    }}
    align="center"
    px={10}
    justify="space-between"
  >
    <Text color="white" fz={14}>
      Shared
    </Text>
  </Flex>
)} */
}
{
  /* Shared icon end */
}

// {isMd && (
//   <Center
//     w="40px"
//     h="40px"
//     style={{
//       // border:'#595959 solid 2px',
//       borderRadius: "50%",
//       cursor: "pointer",
//     }}
//     ml={5}
//     onClick={props.onShareClick}
//   >
//     <Box w="20px" h="20px">
//       <IconShareCustom col="black" />
//     </Box>
//   </Center>
// )}
// </Flex>
{
  /* chapter and back button end */
}
{
  /* search bar start */
}
// {!isMd && false && (
// <Flex w="60%" justify="right" align="center">
//   <SerachBarWeb
//     width="60%"
//     chapterName={props.selectedChapter.name}
//     subjectName={props.selectedSubject.name}
//     className={props.selectedSubject.className}
//     page="chapter inside page"
//   />
//   {/* {icon start} */}
//   <div
//     style={{
//       display: "flex",
//       height: "60px",
//       //   border:'red solid 1px',
//       alignItems: "center",
//       marginLeft: "20px",
//     }}
//   >
//     {/* {!isMd ? (
//       <>
//         <Group mx={10} mr={15}>
//           <ShowName icon={user.schoolIcon} />
//         </Group>
//       </>
//     ) : (
//       ""
//     )} */}
//   </div>
// </Flex>
// )}
