import { Box, Flex, Stack, Text } from "@mantine/core";
import {
  IconCourses,
  IconCoursesUnselect,
  IconDoubts,
  IconDoubts1,
  IconHome,
  IconHomework,
  IconMyCourses,
  IconResult,
  IconStudy,
  IconTestParent,
} from "../../components/_Icons/CustonIcons";
import {
  ParentAppPage,
  accessedFeaturesForCourseStudents,
} from "../ParentsAppMain";
import { useNavigate } from "react-router-dom";
import { Mixpanel } from "../../utilities/Mixpanel/MixpanelHelper";
import { ParentPageEvents } from "../../utilities/Mixpanel/AnalyticEventParentApp";

interface AdminFooterProps {
  selectedTab: ParentAppPage;
  instituteId: string;
  instituteName: string;
  mainPath: string;
  userInfo: StudentInfo;
}
export function ParentFooter(props: AdminFooterProps) {
  const navigate = useNavigate();
  return (
    <Flex
      style={{
        position: "fixed",
        bottom: 0,
        boxShadow: "0px -5px 5px 0px rgba(0, 0, 0, 0.1)",
        zIndex: 999,
        backgroundColor: "#ffffff",
      }}
      w="100%"
      justify="space-around"
      py={5}
    >
      <Stack
        spacing={0}
        justify="center"
        align="center"
        onClick={() => {
          navigate(`/${props.mainPath}/`);
        }}
      >
        <Box h={32} w={32}>
          <IconHome
            col={props.selectedTab === ParentAppPage.HOME ? "#3174F3" : "black"}
          />
        </Box>
        <Text
          color={props.selectedTab === ParentAppPage.HOME ? "#3174F3" : "black"}
          fz={12}
          fw={500}
        >
          Home
        </Text>
      </Stack>
      {(props.userInfo.isUnregistered === false ||
        accessedFeaturesForCourseStudents.includes(ParentAppPage.BATCHES)) && (
        <Stack
          spacing={0}
          justify="center"
          align="center"
          onClick={() => {
            navigate(`/${props.mainPath}/batches`);
          }}
        >
          <Box h={32} w={32}>
            <IconResult
              col={
                props.selectedTab === ParentAppPage.BATCHES
                  ? "#3174F3"
                  : "black"
              }
            />
          </Box>
          <Text
            color={
              props.selectedTab === ParentAppPage.BATCHES ? "#3174F3" : "black"
            }
            fz={12}
            fw={500}
          >
            Batches
          </Text>
        </Stack>
      )}
      <Stack
        spacing={0}
        justify="center"
        align="center"
        onClick={() => {
          Mixpanel.track(ParentPageEvents.PARENTS_APP_STUDY_NAME_CLICKED);
          navigate(`/${props.mainPath}/courses`);
        }}
      >
        <Box h={32} w={32}>
          {props.selectedTab !== ParentAppPage.COURSES ? (
            <IconCoursesUnselect size="30" col="#909395" />
          ) : (
            <IconMyCourses col="#4B65F6" size="32" />
          )}
        </Box>
        <Text
          color={
            props.selectedTab === ParentAppPage.COURSES ? "#3174F3" : "black"
          }
          fz={12}
          fw={500}
        >
          Courses
        </Text>
      </Stack>

      {(props.userInfo.isUnregistered === false ||
        accessedFeaturesForCourseStudents.includes(ParentAppPage.BATCHES)) && (
        <Stack
          spacing={0}
          justify="center"
          align="center"
          onClick={() => {
            Mixpanel.track(ParentPageEvents.PARENT_APP_TEST_SECTION_CLICKED, {
              pageName: props.selectedTab,
            });
            navigate(`/${props.mainPath}/test`);
          }}
        >
          <Box h={32} w={32}>
            <IconTestParent
              col={
                props.selectedTab === ParentAppPage.TEST ? "#3174F3" : "black"
              }
            />
          </Box>
          <Text
            color={
              props.selectedTab === ParentAppPage.TEST ? "#3174F3" : "black"
            }
            fz={12}
            fw={500}
          >
            Test
          </Text>
        </Stack>
      )}
      {
        <Stack
          spacing={0}
          justify="center"
          align="center"
          onClick={() => {
            Mixpanel.track(ParentPageEvents.PARENT_APP_TEST_SECTION_CLICKED, {
              pageName: props.selectedTab,
            });
            navigate(`/${props.mainPath}/result`);
          }}
        >
          <Box h={32} w={32}>
            <IconDoubts1
              col={
                props.selectedTab === ParentAppPage.RESULT ? "#3174F3" : "black"
              }
            />
          </Box>
          <Text
            color={
              props.selectedTab === ParentAppPage.RESULT ? "#3174F3" : "black"
            }
            fz={12}
            fw={500}
          >
            Result
          </Text>
        </Stack>
      }
    </Flex>
  );
}
