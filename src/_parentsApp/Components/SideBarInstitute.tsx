import { Text, Box, Flex, Tooltip, Stack, Navbar } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { useEffect, useRef, useState } from "react";
import {
  IconCollapse,
  IconCoursesUnselect,
  IconDoubts1,
  IconExpand,
  IconHome,
  IconHomework,
  IconMyCourses,
  IconResult,
  IconTest2,
} from "../../components/_Icons/CustonIcons";
import {
  ParentAppPage,
  accessedFeaturesForCourseStudents,
} from "../ParentsAppMain";
import { useNavigate } from "react-router-dom";
import { Mixpanel } from "../../utilities/Mixpanel/MixpanelHelper";
import { ParentPageEvents } from "../../utilities/Mixpanel/AnalyticEventParentApp";
import { ShowName2 } from "./TitleBar";
import { userInfo } from "os";

interface SideBar {
  schoolName: string;
  schoolIcon: string;
  selectedTab: ParentAppPage;
  instituteId: string;
  sideBarCollapsed: (is: boolean) => void;
  parentName?: string | null;
  isFixed: boolean;
  userInfo: StudentInfo;
  mainPath: string;
  onShowProfileClick: () => void;
  profilePic: string;
}

export function SidebarInstitute(props: SideBar) {
  const isMd = useMediaQuery(`(max-width: 820px)`);
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [showText, setShowText] = useState<boolean>(true);
  const sidebarRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleTransitionEnd = () => {
      setShowText(!isCollapsed);
    };
    const node = sidebarRef.current;
    if (node) {
      node.addEventListener("transitionend", handleTransitionEnd);
    }
    return () => {
      if (node) {
        node.removeEventListener("transitionend", handleTransitionEnd);
      }
    };
  }, [isCollapsed]);
  useEffect(() => {
    OnCollapseButtonClick();
  }, []);
  const OnCollapseButtonClick = () => {
    if (!isMd) {
      if (!isCollapsed) {
        setShowText(false);
      }
      setIsCollapsed(!isCollapsed);
      props.sideBarCollapsed(!isCollapsed);
    }
  };

  const menuItems = [
    {
      icon: isCollapsed ? (
        <IconExpand col="#4a4a4a" />
      ) : (
        <IconCollapse col="#4a4a4a" />
      ),
      text: isCollapsed ? "Expand" : "Collapse",
      onClick: OnCollapseButtonClick,
      type: ParentAppPage.NULL,
    },
    {
      icon: (
        <IconHome
          col={props.selectedTab === ParentAppPage.HOME ? "#4B65F6" : "#909395"}
          size="30"
          filled={props.selectedTab === ParentAppPage.HOME}
        />
      ),
      text: "Home",
      onClick: () => navigate(`/${props.mainPath}/`),
      type: ParentAppPage.HOME,
    },
    {
      icon: (
        <IconResult
          col={
            props.selectedTab === ParentAppPage.BATCHES ? "#4B65F6" : "#909395"
          }
          size="30"
        />
      ),
      text: "Batches",
      onClick: () => {
        Mixpanel.track(ParentPageEvents.PARENTS_APP_HOME_PAGE_RESULT_CLICKED);
        navigate(`/${props.mainPath}/batches`);
      },
      type: ParentAppPage.BATCHES,
    },
    {
      icon:
        props.selectedTab !== ParentAppPage.COURSES ? (
          <IconCoursesUnselect size="30" col="#909395" />
        ) : (
          <IconMyCourses col="#4B65F6" size="32" />
        ),
      text: "Courses",
      onClick: () => {
        Mixpanel.track(ParentPageEvents.PARENTS_APP_STUDY_NAME_CLICKED);
        navigate(`/${props.mainPath}/courses`);
      },
      type: ParentAppPage.COURSES,
    },
    {
      icon: (
        <IconTest2
          col={props.selectedTab === ParentAppPage.TEST ? "#4B65F6" : "#909395"}
          size="30"
          filled={props.selectedTab === ParentAppPage.TEST}
        />
      ),
      text: "Test",
      onClick: () => {
        Mixpanel.track(ParentPageEvents.PARENT_APP_TEST_SECTION_CLICKED, {
          pageName: props.selectedTab,
        });
        navigate(`/${props.mainPath}/test`);
      },
      type: ParentAppPage.TEST,
    },
    {
      icon: (
        <IconDoubts1
          col={
            props.selectedTab === ParentAppPage.RESULT ? "#4B65F6" : "#909395"
          }
        />
      ),
      text: "Result",
      onClick: () => {
        Mixpanel.track(ParentPageEvents.PARENTS_APP_HOME_PAGE_TEST_CLICKED, {
          pageName: props.selectedTab,
        });
        navigate(`/${props.mainPath}/result`);
      },
      type: ParentAppPage.RESULT,
    },
  ];

  function isSelectedTab(tabText: string, currentTab: ParentAppPage): boolean {
    switch (tabText) {
      case "Home":
        return currentTab === ParentAppPage.HOME;
      case "Batches":
        return currentTab === ParentAppPage.BATCHES;
      case "Test":
        return currentTab === ParentAppPage.TEST;
      case "Courses":
        return currentTab === ParentAppPage.COURSES;
      // case "Enquiry":
      //   return currentTab === ParentAppPage.DOUBTS;
      case "Result":
        return currentTab === ParentAppPage.RESULT;
      default:
        return false;
    }
  }

  return (
    <Navbar
      ref={sidebarRef}
      style={{
        backgroundColor: "white",
        border: "1px solid #E9ECEF",
        boxShadow: "2px 0px 5px 0px rgba(0, 0, 0, 0.1)",
        zIndex: 199,
        transition: "width 0.3s ease",
      }}
      w={isCollapsed ? 75 : 250}
      py={9}
      pl={5}
      h={"100dvh"}
    >
      <Stack h="100%" justify="space-between">
        <Flex pl={16} pb={9} align="center" style={{ marginBottom: "10px" }}>
          <Box style={{ width: "40px", height: "40px", contain: "content" }}>
            <img
              src={props.schoolIcon}
              style={{ width: "100%", height: "100%" }}
              alt="school Icon"
            />
          </Box>
          {showText && (
            <Text
              ml={12}
              style={{
                color: "#373737",
                fontSize: "13px",
                fontWeight: 700,
                lineHeight: "normal",
              }}
            >
              {props.schoolName}
            </Text>
          )}
        </Flex>

        <Stack pl={16} justify="space-between" h="calc(100% - 70px)">
          <Stack spacing={2}>
            {menuItems
              .filter((x) => {
                if (
                  props.userInfo.isUnregistered === false ||
                  accessedFeaturesForCourseStudents.includes(x.type)
                ) {
                  return true;
                }
              })
              .map((item, index) => (
                <Tooltip disabled={!isCollapsed} label={item.text} key={index}>
                  <Flex
                    key={index}
                    align="center"
                    justify="start"
                    pl={4}
                    mr={16}
                    py={8}
                    style={{ cursor: "pointer" }}
                    onClick={item.onClick}
                  >
                    <Flex h={32} w={32} align="center" justify="center">
                      {item.icon}
                    </Flex>

                    {showText && (
                      <Text
                        ml={15}
                        c={
                          isSelectedTab(item.text, props.selectedTab)
                            ? "#3174F3"
                            : "#909395"
                        }
                        fz={16}
                        fw={600}
                      >
                        {item.text}
                      </Text>
                    )}
                  </Flex>
                </Tooltip>
              ))}
          </Stack>
          {props.parentName && (
            <Flex align="center">
              <ShowName2
                name={props.parentName}
                mainPath={props.mainPath}
                onShowProfileClick={props.onShowProfileClick}
                profilePic={props.profilePic}
                instituteName={props.schoolName}
              />
              {!isCollapsed && (
                <Text ml={20} fz={20} fw={600}>
                  {props.userInfo.name}
                </Text>
              )}
            </Flex>
          )}
        </Stack>
      </Stack>
    </Navbar>
  );
}
