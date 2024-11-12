import {
  Group,
  Navbar,
  Stack,
  Text,
  createStyles,
  ScrollArea,
  Collapse,
  Box,
  Menu,
  Button,
  Center,
  Flex,
  Tooltip,
  Image,
  Drawer,
} from "@mantine/core";
import { useEffect, useRef, useState } from "react";
import { Tabs, Pages } from "../../pages/_New/Teach";
import { IconChevronDown, IconChevronRight } from "@tabler/icons";
import {
  IconAllSimulationsBlue,
  IconAllSimulationsGrey,
  IconCollapse,
  IconExpand,
  IconIntroduction,
  IconLessonPlan,
  IconMindMap,
  IconNotes,
  IconQuestionBank,
  IconTest,
  IconTopicHeading,
  IconTopics,
  IconWorksheets,
} from "../_Icons/CustonIcons";
import { useNavigate } from "react-router-dom";
import { Logo } from "../Logo";
import { useMediaQuery } from "@mantine/hooks";
import { Mixpanel } from "../../utilities/Mixpanel/MixpanelHelper";
import { WebAppEvents } from "../../utilities/Mixpanel/AnalyticeEventWebApp";
import { GetUser } from "../../utilities/LocalstorageUtility";
import { GetAllInfoForInstitute } from "../../_parentsApp/features/instituteSlice";

const useStyles = createStyles((theme) => ({
  heading: {
    fontSize: 15,
    fontWeight: 500,
    color: "#3174F3",
  },
  subheading: {
    fontSize: 16,
    fontWeight: 500,
    borderRadius: 8,
    "&:hover": {
      background: "rgba(162, 162, 162, 0.2);",
    },
  },
  links: {
    fontSize: 14,
    borderRadius: 8,
    "&:hover": {
      background: "#E7E8E8",
      color: "black",
    },
  },
}));
interface SideBar2Props {
  selectedTopic: string | undefined;
  chapters: ChapterData[];
  currentTab: Tabs;
  currentPage: Pages;
  OnTopicClick: (topicId: string) => void;
  OnChapterClick: (chapterId: string) => void;
  setCurrentTab: (tab: Tabs) => void;
  currentChapter: SingleChapter;
  isOpen: boolean; //for mobile
  setIsOpen: (is: boolean) => void;
  isCollapsed: boolean;
  setIsCollapsed: (is: boolean) => void;
  topicsOpen: boolean;
  setTopicsOpen: (val: boolean) => void;
  onShareClick: () => void;
  setIsIntroductionSelected: (val: boolean) => void;
  isIntroductionSelected: boolean;
  currentSubject: SingleSubject;
  setselectedTopic: (val: SingleTopic | null) => void;
}

export function Sidebar2(props: SideBar2Props) {
  const navigate = useNavigate();
  const user = GetUser();
  const isMd = useMediaQuery(`(max-width: 880px)`);
  const { classes } = useStyles();
  const [showText, setShowText] = useState(!props.isCollapsed);
  const [chapterOpened, setChapterOpened] = useState<boolean>(false);
  const [buttonClicked, setButtonClicked] = useState<boolean>(false);
  const navbarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (props.isCollapsed === true && buttonClicked === true) {
      setChapterOpened(true);
      props.setIsCollapsed(false);
    } else if (props.isCollapsed === false && buttonClicked === true) {
      setChapterOpened(true);
    } else if (buttonClicked === false) {
      setChapterOpened(false);
    }
  }, [buttonClicked]);

  useEffect(() => {
    setChapterOpened(false);
  }, [props.isOpen]);
  useEffect(() => {
    const handleTransitionEnd = () => {
      setShowText(!props.isCollapsed);
    };

    const node = navbarRef.current;
    if (node) {
      node.addEventListener("transitionend", handleTransitionEnd);
    }

    return () => {
      if (node) {
        node.removeEventListener("transitionend", handleTransitionEnd);
      }
    };
  }, [props.isCollapsed]);

  function OnDrawerCollapseForMobile() {
    props.setIsOpen(false);
  }
  function OnCollapseButtonClick() {
    if (isMd) {
      props.setIsOpen(false);
    } else {
      if (!props.isCollapsed) {
        setShowText(false);
      }
      props.setIsCollapsed(!props.isCollapsed);
    }
  }

  useEffect(() => {
    props.setIsCollapsed(false);
    props.setIsOpen(false);
    setShowText(true);
  }, [isMd]);
  function TopicsList(topicListProp: { tab: Tabs | Tabs }) {
    return (
      <>
        <Stack spacing={0}>
          <Flex
            className={classes.subheading}
            justify={"space-between"}
            pt={10}
            pb={5}
            pl={20}
            pr={props.isCollapsed ? 0 : 20}
            c={props.topicsOpen ? "#3174F3" : "#4a4a4a"}
            onClick={() => {
              props.setTopicsOpen(!props.topicsOpen);
            }}
          >
            <Group>
              <Box style={{ width: "23px", height: "23px" }}>
                <IconTopicHeading
                  col={
                    // props.currentTab == topicListProp.tab
                    props.topicsOpen ? "#3174F3" : "#4a4a4a"
                  }
                />
              </Box>
              {showText && <Text mt={1}>Topics</Text>}
            </Group>
            {props.topicsOpen ? <IconChevronRight /> : <IconChevronDown />}
          </Flex>
          <Collapse in={props.topicsOpen}>
            <Stack spacing={5} px={10} mt={10} ml={props.isCollapsed ? 0 : 5}>
              <ScrollArea>
                {props.currentPage === Pages.Teach && (
                  <Tooltip
                    label={"Introduction"}
                    openDelay={600}
                    multiline
                    zIndex={9999}
                  >
                    <Flex
                      justify="flex-start"
                      align="center"
                      direction="row"
                      bg={props.isIntroductionSelected ? "#E4EBF7" : ""}
                      c={props.isIntroductionSelected ? "white" : ""}
                      className={classes.links}
                      onClick={() => {
                        props.setIsIntroductionSelected(true);
                        props.setselectedTopic(null);
                        props.setCurrentTab(Tabs.Topics);
                        if (isMd) {
                          OnCollapseButtonClick();
                        } else if (!isMd) {
                          props.setIsOpen(false);
                        }
                        navigate(
                          `/teach/Teach/${props.currentSubject._id}/${props.currentChapter._id}`
                        );
                        // Mixpanel.track(WebAppEvents.TEACHER_APP_TOPIC_CLICKED, {
                        //   page: props.currentPage,
                        // });
                        // if (props.OnTopicClick != null) {
                        //   if (isMd) {
                        //     OnCollapseButtonClick();
                        //   } else if (!isMd) {
                        //     props.setIsOpen(false);
                        //   }
                        //   props.OnTopicClick(x._id);
                        // }
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
                            props.isIntroductionSelected ? "#3174F3" : "#282929"
                          }
                        />
                      </Center>
                      {showText && (
                        <Text
                          c={
                            props.isIntroductionSelected ? "#3174F3" : "#4a4a4a"
                          }
                        >
                          {"Introduction".length > 11
                            ? "Introduction".substring(0, 12) + ".."
                            : "Introduction"}
                        </Text>
                      )}
                    </Flex>
                  </Tooltip>
                )}

                {props.currentChapter.topics.map((x) => {
                  return (
                    <Tooltip
                      label={x.name}
                      openDelay={600}
                      multiline
                      key={x._id}
                      zIndex={9999999999}
                    >
                      <Flex
                        justify="flex-start"
                        align="center"
                        direction="row"
                        bg={props.selectedTopic === x._id ? "#E4EBF7" : ""}
                        c={props.selectedTopic === x._id ? "white" : ""}
                        className={classes.links}
                        onClick={() => {
                          Mixpanel.track(
                            WebAppEvents.TEACHER_APP_TOPIC_CLICKED,
                            {
                              page: props.currentPage,
                              name:x._id,
                              chapterName:props.currentChapter.name,
                              className:props.currentSubject.className
                            }
                          );
                          if (props.OnTopicClick != null) {
                            if (isMd) {
                              OnCollapseButtonClick();
                            } else if (!isMd) {
                              props.setIsOpen(false);
                            }
                            props.OnTopicClick(x._id);
                          }
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
                              props.selectedTopic === x._id
                                ? "#3174F3"
                                : "#282929"
                            }
                          />
                        </Center>
                        {showText && (
                          <Text
                            c={
                              props.selectedTopic === x._id
                                ? "#3174F3"
                                : "#4a4a4a"
                            }
                          >
                            {x.name.length > 11
                              ? x.name.substring(0, 12) + ".."
                              : x.name}
                          </Text>
                        )}
                      </Flex>
                    </Tooltip>
                  );
                })}
              </ScrollArea>
            </Stack>
          </Collapse>
        </Stack>
      </>
    );
  }
  function SideMenuTab(sideMenuProps: {
    name: string;
    tab: Tabs | Tabs;
    icon: React.ReactElement;
    mixpanelEvent?: () => void;
  }) {
    return (
      <Text
        pl={20}
        py={12}
        className={classes.subheading}
        c={props.currentTab === sideMenuProps.tab ? "#3174F3" : "#282929"}
        onClick={() => {
          props.setTopicsOpen(false);
          props.setCurrentTab(sideMenuProps.tab);
          isMd && OnCollapseButtonClick();
          if (sideMenuProps.mixpanelEvent) {
            sideMenuProps.mixpanelEvent();
          }
        }}
      >
        <Group style={{ display: "flex", alignItems: "center" }}>
          <Box style={{ height: "23px", width: "23px" }}>
            {sideMenuProps.icon}
          </Box>
          {showText && <>{sideMenuProps.name}</>}
        </Group>
      </Text>
    );
  }
  function LearnSideMenu() {
    return (
      <>
        <Stack className={classes.heading} spacing={0}>
          <SideMenuTab
            name="Notes"
            tab={Tabs.Notes}
            icon={
              <IconNotes
                col={props.currentTab === Tabs.Notes ? "#3174F3" : "#282929"}
              />
            }
            mixpanelEvent={() =>
              Mixpanel.track(
                WebAppEvents.TEACHER_APP_LEARN_PAGE_NOTES_SECTION_ACCESSED
              )
            }
          />
          <SideMenuTab
            name="Lesson Plan"
            tab={Tabs.LessonPlan}
            mixpanelEvent={() => {
              Mixpanel.track(
                WebAppEvents.TEACHER_APP_LEARN_PAGE_LESSON_PLAN_CLICKED
              );
            }}
            icon={
              <IconLessonPlan
                col={
                  props.currentTab === Tabs.LessonPlan ? "#3174F3" : "#282929"
                }
              />
            }
          />
          <SideMenuTab
            name="All Simulations"
            tab={Tabs.AllSimulations}
            mixpanelEvent={() => {
              Mixpanel.track(
                WebAppEvents.TEACHER_APP_LEARN_PAGE_ALL_SIMULATIONS_CLICKED
              );
            }}
            icon={
              props.currentTab === Tabs.AllSimulations ? (
                <IconAllSimulationsBlue />
              ) : (
                <IconAllSimulationsGrey />
              )
            }
          />
          <SideMenuTab
            name="Mind Map"
            tab={Tabs.MindMap}
            mixpanelEvent={() => {
              Mixpanel.track(
                WebAppEvents.TEACHER_APP_LEARN_PAGE_MIND_MAPS_CLICKED
              );
            }}
            icon={
              <IconMindMap
                col={props.currentTab === Tabs.MindMap ? "#3174F3" : "#282929"}
              />
            }
          />
          {/* <SideMenuTab
            name="Introduction"
            tab={Tabs.Introduction}
            mixpanelEvent={() => {
              Mixpanel.track(
                WebAppEvents.TEACHER_APP_LEARN_PAGE_INTRODUCTION_CLICKED
              );
            }}
            icon={
              <IconIntroduction
                col={
                  props.currentTab === Tabs.Introduction ? "#3174F3" : "#282929"
                }
              />
            }
          /> */}
          <TopicsList tab={Tabs.Topics} />
        </Stack>
      </>
    );
  }
  function PraticeSideMenu() {
    return (
      <>
        <Stack className={classes.heading} spacing={0} my={-5}>
          <SideMenuTab
            name="WorkSheets"
            tab={Tabs.Worksheets}
            mixpanelEvent={() => {
              Mixpanel.track(
                WebAppEvents.TEACHER_APP_PRACTICE_PAGE_WORKSHEET_SECTION_ACCESSED
              );
            }}
            icon={
              <IconWorksheets
                col={
                  props.currentTab === Tabs.Worksheets ? "#3174F3" : "#282929"
                }
              />
            }
          />
          <TopicsList tab={Tabs.Topics} />
        </Stack>
      </>
    );
  }
  function TestSideMenu() {
    return (
      <>
        <Stack className={classes.heading} spacing={4}>
          <SideMenuTab
            name="Test"
            tab={Tabs.Test}
            icon={
              <IconTest
                col={props.currentTab === Tabs.Test ? "#3174F3" : "#282929"}
              />
            }
          />
          <SideMenuTab
            name="QuestionBank"
            tab={Tabs.QuestionBank}
            icon={
              <IconQuestionBank
                col={
                  props.currentTab === Tabs.QuestionBank ? "#3174F3" : "#282929"
                }
              />
            }
            mixpanelEvent={() => {
              Mixpanel.track(
                WebAppEvents.TEACHER_APP_TEST_PAGE_QUESTION_BANK_CLICKED
              );
            }}
          />
        </Stack>
      </>
    );
  }
  const [instituteInfo, setInstituteInfo] = useState<{
    name: string;
    icon: string;
  } | null>(null);
  function SideBarCommonContent() {
    return (
      <Box w="100%" h="90%">
        {instituteInfo && (
          <Group position="center" mt={15} mb={20}>
            <Image
              height={40}
              width={40}
              onClick={() => {
                navigate("/teach");
                Mixpanel.track(WebAppEvents.TEACHER_APP_VIGNAM_LOGO_CLICKED, {
                  page: props.currentPage,
                });
              }}
              src={instituteInfo.icon}
            />
            {showText && (
              <Text fz={16} ta="center" fw={600}>
                {instituteInfo.name}
              </Text>
            )}
          </Group>
        )}
        <Menu opened={chapterOpened}>
          <Menu.Target>
            <Center mb={10}>
              <Tooltip label={props.currentChapter.name} openDelay={600}>
                <Button
                  styles={(theme) => ({
                    root: {
                      width: "79%",
                    },
                  })}
                  className={classes.heading}
                  variant="outline"
                  fullWidth
                  rightIcon={<IconChevronDown />}
                  fz={16}
                  fw={500}
                  h={45}
                  onClick={() => {
                    setButtonClicked((prev) => !prev);
                    Mixpanel.track(
                      WebAppEvents.TEACHER_APP_CHAPTER_SELECTION_CLICKED,
                      { page: props.currentPage }
                    );
                  }}
                >
                  {props.currentChapter.name}
                </Button>
              </Tooltip>
            </Center>
          </Menu.Target>
          <Menu.Dropdown>
            <ScrollArea h="70vh">
              {props.chapters.map((x) => {
                return (
                  <Menu.Item
                    onClick={() => {
                      setChapterOpened(false);
                      if (props.OnChapterClick != null) {
                        Mixpanel.track(
                          WebAppEvents.TEACHER_APP_NEW_CHAPTER_CLICKED,
                          { page: props.currentPage }
                        );
                        setButtonClicked(false);
                        props.OnChapterClick(x._id);
                      }
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
        <Flex
          pl={20}
          ml={15}
          mr={15}
          py={5}
          className={classes.subheading}
          onClick={OnCollapseButtonClick}
          style={{ cursor: "pointer" /* border:"2px red solid" */ }}
        >
          {props.isCollapsed ? (
            <IconExpand col="black" />
          ) : (
            <IconCollapse col="black" />
          )}

          {showText && (
            <Text ml={15} c={"black"}>
              Collapse
            </Text>
          )}
        </Flex>
        <ScrollArea mt={10} h="72%">
          <Stack
            align="stretch"
            justify=""
            pl={15}
            mr={10}
            spacing={8}
            mb={20}
            style={{ cursor: "pointer" }}
          >
            {props.currentPage === Pages.Teach && <LearnSideMenu />}
            {props.currentPage === Pages.Exercise && <PraticeSideMenu />}
            {props.currentPage === Pages.Test && <TestSideMenu />}
          </Stack>
        </ScrollArea>
      </Box>
    );
  }
  useEffect(() => {
    GetAllInfoForInstitute({ id: user.instituteId })
      .then((x: any) => {
        setInstituteInfo({
          name: x.name,
          icon: x.schoolIcon,
        });
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);
  return (
    <>
      {isMd ? (
        <Drawer
          size={"250px"}
          withCloseButton={false}
          h={"100%"}
          opened={props.isOpen}
          onClose={OnDrawerCollapseForMobile}
          zIndex={198}
        >
          <Navbar
            style={{
              background: "#F8F9FA",
              transition: "width 0.3s ease",
            }}
          >
            <Stack h="100%" w="100%" justify="space-between">
              <SideBarCommonContent />
              <Stack h="10%" align="center" justify="center">
                <Button
                  leftIcon={
                    <>
                      {!props.currentChapter.shared && (
                        <img src={require("../../assets/clock.png")} />
                      )}
                      {props.currentChapter.shared && (
                        <img src={require("../../assets/tick.png")} />
                      )}
                    </>
                  }
                  variant="outline"
                  style={{
                    border: "1px solid #3174F3",
                    color: "#3174F3",
                  }}
                  onClick={props.onShareClick}
                >
                  Share Lesson
                </Button>
              </Stack>
            </Stack>
          </Navbar>
        </Drawer>
      ) : (
        <Navbar
          style={{
            background: "#FFFFFF",
            width: props.isCollapsed ? "100px" : "250px",
            transition: "width 0.3s ease",
            boxShadow: "0px 0px 16px 0px rgba(0, 0, 0, 0.25)",
          }}
          ref={navbarRef}
        >
          <Stack h="100%" w="100%" justify="space-between">
            <SideBarCommonContent />
            <Stack h="10%" align="center" justify="center">
              <Button
                leftIcon={
                  <>
                    {!props.currentChapter.shared && (
                      <img src={require("../../assets/clock.png")} />
                    )}
                    {props.currentChapter.shared && (
                      <img src={require("../../assets/tick.png")} />
                    )}
                  </>
                }
                variant="outline"
                style={{
                  border: "1px solid #3174F3",
                  color: "#3174F3",
                }}
                onClick={props.onShareClick}
              >
                {showText && "Share Lesson"}
              </Button>
            </Stack>
          </Stack>
        </Navbar>
      )}
    </>
  );
}
