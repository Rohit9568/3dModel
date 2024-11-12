import { Box, Flex, Footer, Stack, Text } from "@mantine/core";
import {
  IconCoursesUnselect,
  IconDiary,
  IconDoubts,
  IconDoubts1,
  IconHome,
  IconLibrary,
  IconListClass,
  IconMyCourses,
  IconResult,
  IconTeach2,
  IconTest2,
  IconTest3,
  IconVideo,
  IconWebsiteBuilder,
  IconWebsiteBuilderSelected,
} from "../_Icons/CustonIcons";
import { useNavigate } from "react-router-dom";
import { Mixpanel } from "../../utilities/Mixpanel/MixpanelHelper";
import { TeacherPageEvents } from "../../utilities/Mixpanel/AnalyticeEventTeacherApp";
import { MainPageTabs } from "../../pages/LandingPage";
import { LoginUsers } from "../Authentication/Login/Login";
import useFeatureAccess from "../../hooks/useFeatureAccess";

interface TeacherAdminPageProps {
  selectedTab: MainPageTabs;
  instituteId: string;
  instituteName: string;
  mainPath: string;
  isSchool: boolean;
  userRole: string;
}
export function TeacherMainAppFooter(props: TeacherAdminPageProps) {
  const navigate = useNavigate();

  const mainPageRoutes = [
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
        navigate(`${props.mainPath}/${MainPageTabs.DASHBOARD.toLowerCase().trim()}`);
      },
    },
    {
      icon: (
        <IconTeach2
          col={props.selectedTab === MainPageTabs.ALL_SIMULATIONS ? "#4B65F6" : "#909395"}
          size="30"
          filled={props.selectedTab === MainPageTabs.ALL_SIMULATIONS}
        />
      ),
      text: "Simulations",
      path: ``,
      selectedThis: props.selectedTab === MainPageTabs.ALL_SIMULATIONS,
      action: () => {
        navigate(`${props.mainPath}/${MainPageTabs.ALL_SIMULATIONS.toLowerCase().trim()}`);
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
      text: "Courses",
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
      text: "Website",
      path: `/${props.mainPath}/websitebuilder`,
      action: () => {
        navigate(`${props.mainPath}/${MainPageTabs.WEBSITE_BUILDER.toLowerCase().trim()}`);
      },
    }
  ];
  return (
    <Footer height={60} w="100%">
      <Flex
        style={{
          bottom: 0,
          display: "fixed",
          boxShadow: "0px -5px 5px 0px rgba(0, 0, 0, 0.1)",
          zIndex: 0,
          backgroundColor: "#ffffff",
          height: "100%",
          width: "100%",
        }}
        w="100%"
        justify="space-around"
        py={5}
      >
        {mainPageRoutes.map((x, index) => {
          if (props.isSchool && (index === 4 || index === 3)) return <></>;
          if (props.userRole === LoginUsers.ADMINISTRATOR && index !== 0)
            return <></>;
          return (
            <Stack
              spacing={0}
              justify="center"
              align="center"
              onClick={() => {
                //   navigate(
                //     `/${props.instituteName}/${props.instituteId}/teacheradmin/`
                //   );
                x.action();
                //   props.setTabClicked(true);
              }}
            >
              <Box h={32} w={32}>
                {x.icon}
              </Box>
              <Text color={x.icon.props.col} fz={12} fw={500}>
                {x.text}
              </Text>
            </Stack>
          );
        })}
      </Flex>
    </Footer>
  );
}
