import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { SubjectSelect } from "./SubjectSelect";
import { ChapterSelect } from "./ChapterSelect";
import {
  Box,
  Button,
  Center,
  Collapse,
  Drawer,
  Flex,
  Group,
  Menu,
  Navbar,
  ScrollArea,
  Stack,
  Text,
  Tooltip,
} from "@mantine/core";
import { ChapterPage } from "./ChapterPage";
import { StudyPageTabs } from "../ParentsAppMain";
import { convertToHyphenSeparated } from "../../utilities/HelperFunctions";
import {
  fetchCurrentChapter,
  fetchCurrentSharedSubjectData,
} from "../../features/UserSubject/TeacherSubjectSlice";
import { IconChevronDown, IconChevronRight, IconMovie } from "@tabler/icons";
import { useMediaQuery } from "@mantine/hooks";
import {
  IconAllSimulationsBlue,
  IconAllSimulationsGrey,
  IconCollapse,
  IconNotes,
  IconTopicHeading,
  IconTopics,
  IconWorksheets,
} from "../../components/_Icons/CustonIcons";
import { useSelector } from "react-redux";
import { RootState } from "../../store/ReduxStore";

function SideMenuTab(sideMenuProps: {
  name: string;
  tab?: StudyPageTabs;
  icon: React.ReactElement;
  currentTab: StudyPageTabs;
  onClick: () => void;
  // mixpanelEvent?: () => void;
}) {
  return (
    <Text
      pl={20}
      py={12}
      style={{
        fontSize: 16,
        fontWeight: 500,
        borderRadius: 8,
        cursor: "pointer",
      }}
      c={sideMenuProps.currentTab === sideMenuProps.tab ? "#3174F3" : "#282929"}
      onClick={() => {
        sideMenuProps.onClick();
        //   setTopicOpened(false);
        //   props.setCurrentTab(sideMenuProps.tab);
        //   isMd && OnCollapseButtonClick();
        //   if (sideMenuProps.mixpanelEvent) {
        //     sideMenuProps.mixpanelEvent();
        //   }
      }}
    >
      <Group style={{ display: "flex", alignItems: "center" }}>
        <Box style={{ height: "23px", width: "23px" }}>
          {sideMenuProps.icon}
        </Box>
        {sideMenuProps.name}
      </Group>
    </Text>
  );
}

function NavbarForTopicPage(props: {
  instituteDetails: InstituteDetails | null;
  chapterOpened: boolean;
  currentChapter: SingleChapter | null;
  currentSubject: SingleSubject | null;
  setchapterOpened: (data: any) => void;
  onChapterChangeClick: (data: string) => void;
  currentTab: StudyPageTabs;
  setCurrentTab: (val: any) => void;
  setIsDrawerOpen: (val: boolean) => void;
  changetabHandler: (val: StudyPageTabs) => void;
  selectedTopic: SingleTopic | null;
  topicOpened: boolean;
  setTopicOpened: (val: boolean) => void;
  isintroductionSelected: boolean;
  setIsIntroductionSelected: (val: boolean) => void;
  setSelectedTopic: (val: SingleTopic | null) => void;
}) {
  const isMd = useMediaQuery(`(max-width: 820px)`);

  return (
    <Stack
      spacing={4}
      style={{
        border: "1px solid #E9ECEF",
        boxShadow: "0px 0px 16px #00000040",
        height: "100%",
      }}
    >
      <Flex
        pl={16}
        pb={9}
        align="center"
        style={{ marginBottom: "10px", borderBottom: "3px #E9ECEF solid" }}
      >
        <Box style={{ width: "40px", height: "50px", contain: "content" }}>
          <img
            src={props.instituteDetails?.iconUrl}
            style={{ width: "100%", height: "100%" }}
            alt="school Icon"
          />
        </Box>

        <Text
          ml={12}
          style={{
            color: "#373737",
            fontFamily: "Poppins",
            fontSize: "13px",
            fontStyle: "normal",
            fontWeight: 700,
            lineHeight: "normal",
          }}
        >
          {props.instituteDetails?.name}
        </Text>
      </Flex>
      <Menu opened={props.chapterOpened}>
        <Menu.Target>
          <Center mb={10}>
            <Tooltip label={props.currentChapter?.name} openDelay={600}>
              <Button
                styles={(theme) => ({
                  root: {
                    width: "79%",
                  },
                })}
                style={{
                  fontSize: 15,
                  fontWeight: 500,
                  color: "#3174F3",
                }}
                variant="outline"
                fullWidth
                rightIcon={<IconChevronDown />}
                fz={16}
                fw={500}
                h={45}
                onClick={() => {
                  // setButtonClicked((prev) => !prev);
                  props.setchapterOpened((prev: any) => !prev);
                  // Mixpanel.track(
                  //   WebAppEvents.TEACHER_APP_CHAPTER_SELECTION_CLICKED,
                  //   { page: props.currentPage }
                  // );
                }}
              >
                {props.currentChapter?.name}
              </Button>
            </Tooltip>
          </Center>
        </Menu.Target>
        <Menu.Dropdown>
          <ScrollArea h="70vh">
            {props.currentSubject?.userChapters.map((x) => {
              return (
                <Menu.Item
                  onClick={() => {
                    props.setchapterOpened(false);
                    props.onChapterChangeClick(x._id);
                  }}
                  key={x._id}
                  w="200px"
                >
                  {x.name}
                </Menu.Item>
              );
            })}
          </ScrollArea>
        </Menu.Dropdown>
      </Menu>
      {isMd && (
        <SideMenuTab
          name="Collapse"
          icon={<IconCollapse col="#282929" />}
          currentTab={props.currentTab}
          onClick={() => {
            props.setIsDrawerOpen(false);
          }}
        />
      )}

      <SideMenuTab
        name="Notes"
        tab={StudyPageTabs.Notes}
        icon={
          <IconNotes
            col={
              props.currentTab === StudyPageTabs.Notes ? "#3174F3" : "#282929"
            }
          />
        }
        currentTab={props.currentTab}
        onClick={() => {
          props.changetabHandler(StudyPageTabs.Notes);
        }}
      />
      <SideMenuTab
        name="Worksheets"
        tab={StudyPageTabs.Worksheets}
        icon={
          <IconWorksheets
            col={
              props.currentTab === StudyPageTabs.Worksheets
                ? "#3174F3"
                : "#282929"
            }
          />
        }
        currentTab={props.currentTab}
        onClick={() => {
          props.changetabHandler(StudyPageTabs.Worksheets);
        }}
      />
      {props.currentChapter && props.currentChapter?.videos?.length > 0 && (
        <SideMenuTab
          name="Videos"
          tab={StudyPageTabs.Videos}
          icon={
            <IconMovie
              color={
                props.currentTab === StudyPageTabs.Videos
                  ? "#3174F3"
                  : "#282929"
              }
            />
          }
          currentTab={props.currentTab}
          onClick={() => {
            props.changetabHandler(StudyPageTabs.Videos);
          }}
        />
      )}
      {props.instituteDetails &&
        props.instituteDetails.featureAccess.simualtionAccess === true && (
          <SideMenuTab
            name="Simulations"
            tab={StudyPageTabs.Simulaitons}
            icon={
              <>
                {props.currentTab === StudyPageTabs.Simulaitons ? (
                  <IconAllSimulationsBlue />
                ) : (
                  <IconAllSimulationsGrey />
                )}
              </>
            }
            currentTab={props.currentTab}
            onClick={() => {
              props.changetabHandler(StudyPageTabs.Simulaitons);
            }}
          />
        )}
      <Stack spacing={0}>
        <Flex
          sx={{
            fontSize: 16,
            fontWeight: 500,
            borderRadius: 8,
            "&:hover": {
              background: "rgba(162, 162, 162, 0.2);",
            },
          }}
          justify={"space-between"}
          pt={10}
          pb={5}
          pl={20}
          c={props.topicOpened ? "#3174F3" : "#4a4a4a"}
          onClick={() => {
            props.setCurrentTab(StudyPageTabs.Null);
            props.setTopicOpened(!props.topicOpened);
          }}
        >
          <Group>
            <Box style={{ width: "23px", height: "23px" }}>
              <IconTopicHeading
                col={
                  // props.currentTab == topicListProp.tab
                  props.topicOpened ? "#3174F3" : "#4a4a4a"
                }
              />
            </Box>
            {<Text mt={1}>Topics</Text>}
          </Group>
          {props.topicOpened ? <IconChevronRight /> : <IconChevronDown />}
        </Flex>
        <Collapse in={props.topicOpened}>
          <Stack
            spacing={5}
            px={10}
            mt={10}
            //   ml={props.isCollapsed ? 0 : 5}
          >
            <Tooltip
              label={"Introduction"}
              openDelay={600}
              multiline
              // key={x._id}
            >
              <Flex
                justify="flex-start"
                align="center"
                direction="row"
                bg={props.isintroductionSelected ? "#E4EBF7" : ""}
                c={props.isintroductionSelected ? "white" : ""}
                sx={{
                  fontSize: 14,
                  borderRadius: 8,
                  "&:hover": {
                    background: "#E7E8E8",
                    color: "black",
                  },
                  cursor: "pointer",
                }}
                onClick={() => {
                  props.setIsIntroductionSelected(true);
                  props.setSelectedTopic(null);
                  props.setIsDrawerOpen(false);
                  props.setCurrentTab(StudyPageTabs.Topic);
                }}
              >
                <Center
                  my={5}
                  mx={10}
                  style={{ borderRadius: "4px" }}
                  w={28}
                  h={28}
                >
                  <IconTopics
                    col={props.isintroductionSelected ? "#3174F3" : "#282929"}
                  />
                </Center>

                <Text c={props.isintroductionSelected ? "#3174F3" : "#4a4a4a"}>
                  Introduction
                </Text>
              </Flex>
            </Tooltip>
            {props.currentChapter &&
              props.currentChapter.topics.map((x) => {
                return (
                  <Tooltip label={x.name} openDelay={600} multiline key={x._id}>
                    <Flex
                      justify="flex-start"
                      align="center"
                      direction="row"
                      bg={props.selectedTopic?._id === x._id ? "#E4EBF7" : ""}
                      c={props.selectedTopic?._id === x._id ? "white" : ""}
                      sx={{
                        fontSize: 14,
                        borderRadius: 8,
                        "&:hover": {
                          background: "#E7E8E8",
                          color: "black",
                        },
                        cursor: "pointer",
                      }}
                      onClick={() => {
                        props.setSelectedTopic(x);
                        props.setCurrentTab(StudyPageTabs.Topic);
                        props.setIsDrawerOpen(false);
                        props.setIsIntroductionSelected(false);
                      }}
                    >
                      <Center
                        my={5}
                        mx={10}
                        style={{ borderRadius: "4px" }}
                        w={28}
                        h={28}
                      >
                        <IconTopics
                          col={
                            props.selectedTopic?._id === x._id
                              ? "#3174F3"
                              : "#282929"
                          }
                        />
                      </Center>

                      <Text
                        c={
                          props.selectedTopic?._id === x._id
                            ? "#3174F3"
                            : "#4a4a4a"
                        }
                      >
                        {x.name.length > 11
                          ? x.name.substring(0, 12) + ".."
                          : x.name}
                      </Text>
                    </Flex>
                  </Tooltip>
                );
              })}
          </Stack>
        </Collapse>
      </Stack>
    </Stack>
    // </Drawer>
  );
}
interface StudyPageProps {
  studentData: {
    studentId: string;
    className: string;
    studentName: string;
    classId: string;
  }[];
  isDrawerOpen: boolean;
  setIsDrawerOpen: (data: boolean) => void;
  scrollAreaREf: any;
  isTopicPageAccessed: boolean;
  setIsTopicAccessed: (val: boolean) => void;
  setNavbar: (val: any) => void;
  mainPath: string;
}
export function StudyPage(props: StudyPageProps) {
  const navigate = useNavigate();
  const params = useParams();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const isMd = useMediaQuery(`(max-width: 820px)`);
  const entrycomp = params.entryComponent;

  const [currentChapter, setChapterData] = useState<SingleChapter | null>(null);
  const [chapterOpened, setChapterOpened] = useState<boolean>(false);
  const [topicOpened, setTopicOpened] = useState<boolean>(false);
  const [selectedTopic, setSelectedTopic] = useState<SingleTopic | null>(null);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(
    null
  );
  const [isIntroductionSelected, setIsIntroductionSelected] =
    useState<boolean>(false);
  const [loadingData, setLoadingData] = useState<boolean>(false);
  const [selectedChapterId, setSelectedChapterId] = useState<string | null>(
    null
  );
  const [currentSubject, setCurrentSubject] = useState<SingleSubject | null>(
    null
  );
  const instituteDetails = useSelector<RootState, InstituteDetails | null>(
    (state) => state.instituteDetailsSlice.instituteDetails
  );
  const [currentTab, setCurrentTab] = useState<StudyPageTabs>(
    StudyPageTabs.Worksheets
  );

  const courseId = queryParams.get("courseId");

  function onChapterChangeClick(data: string) {
    if (instituteDetails?._id && instituteDetails.name)
      navigate(`/${props.mainPath}/study/${selectedSubjectId}/${data}`);
  }

  function onTopicChangeClick(data: string) {
    const found = currentChapter?.topics.find((x) => x._id === data);
    if (found) {
      setSelectedTopic(found);
      setCurrentTab(StudyPageTabs.Topic);
      setTopicOpened(true);
    }
  }
  useEffect(() => {
    if (selectedChapterId) {
      setLoadingData(true);
      fetchCurrentChapter({ chapter_id: selectedChapterId })
        .then((data: any) => {
          setLoadingData(false);
          setChapterData(data);
          setCurrentTab(StudyPageTabs.Topic);
          setIsIntroductionSelected(true);
          setTopicOpened(true);
          setSelectedTopic(null);
        })
        .catch((error) => {
          setLoadingData(false);
          console.log(error);
        });
    }
  }, [selectedChapterId]);
  useEffect(() => {
    if (params.subComponent) setSelectedSubjectId(params.subComponent);
    else setSelectedSubjectId(null);
    if (params.chapterId) setSelectedChapterId(params.chapterId);
    else setSelectedChapterId(null);
  }, [params]);

  useEffect(() => {
    setChapterOpened(false);
  }, [props.isDrawerOpen]);

  function onDrawerCollapse() {
    props.setIsDrawerOpen(false);
  }

  useEffect(() => {
    props.scrollAreaREf.current.scrollTo(0, 0);
    window.scrollTo(0, 0);
  }, [courseId]);

  useEffect(() => {
    if (params.subComponent) setSelectedSubjectId(params.subComponent);
    else {
      setSelectedSubjectId(null);
    }
    if (params.chapterId) setSelectedChapterId(params.chapterId);
    else {
      setSelectedChapterId(null);
    }
  }, [params]);

  function changetabHandler(tab: StudyPageTabs) {
    setTopicOpened(false);
    props.setIsDrawerOpen(false);
    setIsIntroductionSelected(false);
    setCurrentTab(tab);
  }

  useEffect(() => {
    if (selectedSubjectId) {
      setLoadingData(true);
      fetchCurrentSharedSubjectData({ subject_id: selectedSubjectId })
        .then((data: any) => {
          setLoadingData(false);
          setCurrentSubject(data);
        })
        .catch((err) => {
          setLoadingData(false);
          console.log(err);
        });
    }
  }, [selectedSubjectId]);


  useEffect(() => {
    if (isMd && props.isTopicPageAccessed) {
      props.setNavbar(
        <Drawer
          size={"250px"}
          withCloseButton={false}
          h="100%"
          opened={props.isDrawerOpen}
          onClose={onDrawerCollapse}
        >
          <Navbar w={250}>
            <NavbarForTopicPage
              instituteDetails={instituteDetails}
              chapterOpened={chapterOpened}
              currentChapter={currentChapter}
              currentSubject={currentSubject}
              setchapterOpened={setChapterOpened}
              onChapterChangeClick={onChapterChangeClick}
              currentTab={currentTab}
              setCurrentTab={setCurrentTab}
              setIsDrawerOpen={props.setIsDrawerOpen}
              changetabHandler={changetabHandler}
              selectedTopic={selectedTopic}
              topicOpened={topicOpened}
              setTopicOpened={setTopicOpened}
              isintroductionSelected={isIntroductionSelected}
              setIsIntroductionSelected={setIsIntroductionSelected}
              setSelectedTopic={setSelectedTopic}
            />
          </Navbar>
        </Drawer>
      );
    } else if (!isMd && props.isTopicPageAccessed) {
      props.setNavbar(
        <Navbar w={250}>
          <NavbarForTopicPage
            instituteDetails={instituteDetails}
            chapterOpened={chapterOpened}
            currentChapter={currentChapter}
            currentSubject={currentSubject}
            setchapterOpened={setChapterOpened}
            onChapterChangeClick={onChapterChangeClick}
            currentTab={currentTab}
            setCurrentTab={setCurrentTab}
            setIsDrawerOpen={props.setIsDrawerOpen}
            changetabHandler={changetabHandler}
            selectedTopic={selectedTopic}
            topicOpened={topicOpened}
            setTopicOpened={setTopicOpened}
            isintroductionSelected={isIntroductionSelected}
            setIsIntroductionSelected={setIsIntroductionSelected}
            setSelectedTopic={setSelectedTopic}
          />
        </Navbar>
      );
    }
  }, [
    props.isTopicPageAccessed,
    isMd,
    currentTab,
    isIntroductionSelected,
    props.isDrawerOpen,
    currentChapter,
    chapterOpened,
    setChapterData,
    selectedTopic,
  ]);
  return (
    <>
      {selectedSubjectId === "offline" && selectedChapterId === null && (
        <SubjectSelect
          studentData={props.studentData}
          onSubjectClick={(data) => {
            navigate(`/${props.mainPath}/study/${data}`);
          }}
          onBackClick={() => {
            navigate(`/${props.mainPath}/courses`);
          }}
        />
      )}
      {selectedSubjectId !== null &&
        selectedChapterId === null &&
        entrycomp === "study" && (
          <ChapterSelect
            subjectId={selectedSubjectId}
            onChapterClick={(data) => {
              navigate(`/${props.mainPath}/study/${selectedSubjectId}/${data}`);
            }}
          />
        )}
      {selectedSubjectId !== null &&
        selectedChapterId !== null &&
        entrycomp === "study" &&
        instituteDetails && (
          <ChapterPage
            chapterId={selectedChapterId}
            subjectId={selectedSubjectId}
            setisTopicPageAccessed={props.setIsTopicAccessed}
            isDrawerOpen={props.isDrawerOpen}
            setIsDrawerOpen={props.setIsDrawerOpen}
            onChapterChangeClick={(data) => {
              navigate(`/${props.mainPath}/study/${selectedSubjectId}/${data}`);
            }}
            currentChapter={currentChapter}
            currentTab={currentTab}
            selectedTopic={selectedTopic}
            onTopicChangeClick={onTopicChangeClick}
            isIntroductionSelected={isIntroductionSelected}
            instituteName={instituteDetails.name}
            icon={instituteDetails?.iconUrl}
          />
        )}
    </>
  );
}
