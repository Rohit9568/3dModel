import { useState, useRef, useEffect } from "react";
import {
  Box,
  Center,
  Divider,
  Flex,
  Menu,
  Navbar,
  Stack,
  Text,
  Tooltip,
} from "@mantine/core";
import {
  IconDoubts,
  IconHome,
  IconResult,
  IconCollapse,
  IconExpand,
  IconListClass,
  IconDiary,
  IconTeach2,
  IconTest2,
  IconVideo,
  IconMyCourses,
  IconDoubts1,
  IconCoursesUnselect,
  IconWebsiteBuilder,
  IconWebsiteBuilderSelected,
} from "../_Icons/CustonIcons";
import { useNavigate } from "react-router-dom";
import ProfilePicture from "../ProfilePic/ProfilePic";
import {
  GetUser,
  LocalStorageKey,
  RemoveValueFromLocalStorage,
} from "../../utilities/LocalstorageUtility";
import { IconTrash } from "@tabler/icons";
import { Mixpanel } from "../../utilities/Mixpanel/MixpanelHelper";
import { TeacherPageEvents } from "../../utilities/Mixpanel/AnalyticeEventTeacherApp";
import { MainPageTabs } from "../../pages/LandingPage";
import ProfilePicture2 from "../ProfilePic/ProfillePic2";
import { LoginUsers } from "../Authentication/Login/Login";
import { useSelector } from "react-redux";
import { RootState } from "../../store/ReduxStore";
import { User1 } from "../../@types/User";
import useFeatureAccess from "../../hooks/useFeatureAccess";

interface ShowNameProps {
  tab: MainPageTabs;
  name: string;
}
export function ShowName(props: ShowNameProps) {
  const navigate = useNavigate();
  const user = useSelector<RootState, User1 | null>((state) => {
    return state.currentUser.user;
  });
  return (
    <Menu
      position="top-start"
      shadow="md"
      onOpen={() => {
        Mixpanel.track(
          TeacherPageEvents.TEACHER_APP_HOME_PAGE_NAME_ICON_CLICKED,
          {
            section: props.tab,
          }
        );
      }}
    >
      <Menu.Target>
        <div style={{ paddingLeft: "6px" }}>
          {user?.logo !== "" && (
            <Center
              style={{
                width: "50px",
                height: "50px",
                borderRadius: "50%",
                border: "1px solid gray",
                cursor: "pointer",
              }}
            >
              <img
                src={user?.logo}
                style={{
                  width: "90%",
                  height: "90%",
                  borderRadius: "50%",
                }}
              />
            </Center>
          )}
          {user?.logo === "" && (
            <ProfilePicture2
              name={props.name}
              size={50}
              profilePic=""
              isInitialFullName={true}
            ></ProfilePicture2>
          )}
        </div>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Item
          color="red"
          icon={<IconTrash size={14} />}
          onClick={() => {
            RemoveValueFromLocalStorage(LocalStorageKey.Token);
            RemoveValueFromLocalStorage(LocalStorageKey.User);
            Mixpanel.track(
              TeacherPageEvents.TEACHER_APP_HOME_PAGE_LOGOUT_SUCCESS,
              {
                section: props.tab,
              }
            );
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

interface TeacherAdminNavBarProps {
  schoolName: string;
  schoolIcon: string;
  selectedTab: MainPageTabs;
  instituteId: string;
  instituteName: string;
  mainPath: string;
  isCollapsed: boolean;
  setIsCollapsed: (cval: boolean) => void;
  isSchool: boolean;
  userRole: string;
}

export function TeacherMainAppNavbar(props: TeacherAdminNavBarProps) {
  const navigate = useNavigate();
  const [showText, setShowText] = useState<boolean>(true);
  const sidebarRef = useRef<HTMLDivElement | null>(null);
  const OnCollapseButtonClick = () => {
    if (!props.isCollapsed) {
      setShowText(false);
    }
    props.setIsCollapsed(!props.isCollapsed);
  };

  const mainPageRoutes = [
    {
      icon: props.isCollapsed ? (
        <IconExpand col="#909395" />
      ) : (
        <IconCollapse col="#909395" />
      ),
      text: props.isCollapsed ? "Expand" : "Collapse",
      path: "",
      action: OnCollapseButtonClick,
    },
    {
      icon: (
        <IconHome
          col={
            props.selectedTab === MainPageTabs.DASHBOARD ? "#4B65F6" : "#909395"
          }
          filled={props.selectedTab === MainPageTabs.DASHBOARD}
          size="30"
        />
      ),
      text: MainPageTabs.DASHBOARD,
      path: `/${props.mainPath}/dashboard`,
      selectedThis: props.selectedTab === MainPageTabs.DASHBOARD,
      action: () => {
        navigate(
          `${props.mainPath}/${MainPageTabs.DASHBOARD.toLowerCase().trim()}`
        );
      },
    },
    {
      icon: (
        <IconTeach2
          col={
            props.selectedTab === MainPageTabs.ALL_SIMULATIONS
              ? "#4B65F6"
              : "#909395"
          }
          size="30"
          filled={props.selectedTab === MainPageTabs.ALL_SIMULATIONS}
        />
      ),
      text: MainPageTabs.ALL_SIMULATIONS,
      path: ``,
      selectedThis: props.selectedTab === MainPageTabs.ALL_SIMULATIONS,
      action: () => {
        navigate(
          `${
            props.mainPath
          }/${MainPageTabs.ALL_SIMULATIONS.toLowerCase().trim()}`
        );
      },
    },
    {
      icon: (
        <IconTest2
          col={props.selectedTab === MainPageTabs.TEST ? "#4B65F6" : "#909395"}
          size="30"
          filled={props.selectedTab === MainPageTabs.TEST}
        />
      ),
      text: MainPageTabs.TEST,
      selectedThis: props.selectedTab === MainPageTabs.TEST,
      path: ``,
      action: () => {
        navigate(`${props.mainPath}/${MainPageTabs.TEST.toLowerCase().trim()}`);
      },
    },
    {
      icon:
        props.selectedTab !== MainPageTabs.MYCOURSES ? (
          <IconCoursesUnselect size="28" col="#909395" />
        ) : (
          <IconMyCourses col="#4B65F6" size="30" />
        ),
      text: MainPageTabs.MYCOURSES,
      path: `/${props.mainPath}/mycourses`,
      action: () => {
        navigate(`${props.mainPath}/${MainPageTabs.MYCOURSES.toLowerCase()}`);
      },
    },
    {
      icon:
        props.selectedTab !== MainPageTabs.WEBSITE_BUILDER ? (
          <IconWebsiteBuilder col="#909395" size="30" />
        ) : (
          <IconWebsiteBuilderSelected size="28" col="#4B65F6" />
        ),
      text: MainPageTabs.WEBSITE_BUILDER,
      path: `/${props.mainPath}/websitebuilder`,
      action: () => {
        navigate(
          `${
            props.mainPath
          }/${MainPageTabs.WEBSITE_BUILDER.toLowerCase().trim()}`
        );
      },
    },
  ];

  useEffect(() => {
    const handleTransitionEnd = () => {
      setShowText(!props.isCollapsed);
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
  }, [props.isCollapsed]);

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
      w={props.isCollapsed ? 75 : 250}
      py={9}
      pl={5}
      h={"100dvh"}
    >
      <Flex direction="column" h="100%" justify="space-between">
        <Box>
          <Flex
            pl={16}
            pb={9}
            align="center"
            onClick={() => {
              navigate("/");
            }}
            style={{ marginBottom: "10px" }}
          >
            <Box style={{ width: "40px", height: "40px", contain: "content" }}>
              <img
                src={props.schoolIcon}
                style={{ width: "100%", height: "100%" }}
                alt="school Icon"
              />
            </Box>

            {showText && (
              <Text
                ml={8}
                style={{
                  color: "#373737",
                  fontSize: "13px",
                  fontStyle: "normal",
                  fontWeight: 700,
                  lineHeight: "normal",
                }}
              >
                {props.schoolName}
              </Text>
            )}
          </Flex>

          <Flex direction="column" pl={16} align="start">
            {mainPageRoutes.map((item, index) => {
              if (
                props.userRole === LoginUsers.ADMINISTRATOR &&
                index !== 1 &&
                index !== 0
              )
                return <></>;
              return (
                <Tooltip
                  disabled={!props.isCollapsed}
                  label={item.text}
                  key={index}
                >
                  <Flex
                    key={index}
                    align="center"
                    justify="start"
                    pl={4}
                    mr={16}
                    py={8}
                    style={{ cursor: "pointer" }}
                    onClick={item.action}
                  >
                    <Flex h={32} w={32} align="center" justify="center">
                      {item.icon}
                    </Flex>
                    {showText && (
                      <Text
                        ml={12}
                        style={{
                          color: item.icon.props.col,
                          fontSize: "16px",
                          fontStyle: "normal",
                          fontWeight: item.selectedThis ? 700 : 500,
                          lineHeight: "normal",
                        }}
                      >
                        {item.text}
                      </Text>
                    )}
                  </Flex>
                </Tooltip>
              );
            })}
          </Flex>
        </Box>
        <Stack>
          <Divider size="xs" />
          <Flex align={"center"}>
            <ShowName tab={props.selectedTab} name={GetUser().name} />
            <Box pl={20}>{showText && GetUser().name}</Box>
          </Flex>
        </Stack>
      </Flex>
    </Navbar>
  );
}
