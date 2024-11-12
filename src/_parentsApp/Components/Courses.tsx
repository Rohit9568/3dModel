import {
  Box,
  Center,
  Flex,
  SimpleGrid,
  Stack,
  Text,
  useMantineTheme,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { useNavigate, useParams } from "react-router-dom";
import { SingleCoursePage } from "./SingleCoursePage";
import { Mixpanel } from "../../utilities/Mixpanel/MixpanelHelper";
import { WebAppEvents } from "../../utilities/Mixpanel/AnalyticeEventWebApp";
import { RootState } from "../../store/ReduxStore";
import { useSelector } from "react-redux";

function SingleCourseCard(props: {
  name: string;
  className: string;
  subjectName: string;
  thumbnail: string;
  onClick: () => void;
}) {
  const theme = useMantineTheme();
  const isMd = useMediaQuery(`(max-width: ${theme.breakpoints.md}px)`);
  return (
    <Stack
      style={{
        border: "1px solid #E9E9E9",
        borderRadius: "20px",
        background: "#FFFFFF",
        cursor: "pointer",
      }}
      spacing={10}
      onClick={() => {
        props.onClick();
      }}
      h={isMd ? 200 : 250}
      w={isMd ? 200 : 250}
    >
      <img
        src={props.thumbnail}
        height={isMd ? 150 : 200}
        width={isMd ? 200 : 250}
      />
      <Stack spacing={0} ml={8}>
        <Text fw={500} fz={isMd ? 18 : 24}>
          {props.name}
        </Text>
        <Text
          fw={400}
          fz={isMd ? 14 : 18}
          style={{
            opacity: 0.4,
          }}
        >
          {props.className},{props.subjectName}
        </Text>
      </Stack>
    </Stack>
  );
}
export function Courses(props: {
  mainPath: string;
  myCourses: Course[];
  teacherTestAnswers: any;
  userInfo: StudentInfo;
  studentId: string;
  onTestClick: (val: string, courseId: string, isChecked: boolean) => void;
  studentData: {
    studentId: string;
    studentName: string;
  };
  setisTopicPageAccessed: (val: boolean) => void;
  isDrawerOpen: boolean;
  setisDrawerOpen: (val: boolean) => void;
  scrollAreaREf: any;
  isTopicPageAccessed: boolean;
  setNavbar: (val: any) => void;
}) {
  const theme = useMantineTheme();
  const params = useParams();
  const isMd = useMediaQuery(`(max-width: ${theme.breakpoints.md}px)`);
  const navigate = useNavigate();
  const courseId = params.subComponent;
  const instituteDetails = useSelector<RootState, InstituteDetails | null>(
    (state) => state.instituteDetailsSlice.instituteDetails
  );

  return (
    <>
      <>
        {courseId === undefined && (
          <Stack
            pt={isMd ? 8 : 36}
            px={isMd ? 32 : 60}
            w={"100%"}
            h={"100vh"}
            bg={"#F7F7FF"}
          >
            {props.myCourses.length > 0 && (
              <Text fw={700} size={32}>
                Courses
              </Text>
            )}
            <SimpleGrid cols={isMd ? 1 : 4}>
              {props.myCourses.length !== 0 && (
                <>
                  {props.myCourses.map((x: any) => {
                    return (
                      <SingleCourseCard
                        name={x.name}
                        className={x.classId?.name ?? ""}
                        subjectName={x.subjectId?.subjectId?.name ?? ""}
                        thumbnail={x.thumbnail}
                        onClick={() => {
                          Mixpanel.track(
                            WebAppEvents.PARENT_APP_COURSE_ACCESSED,
                            {
                              courseName: x.name,
                            }
                          );
                          navigate(`/${props.mainPath}/courses/${x._id}`);
                        }}
                      />
                    );
                  })}
                </>
              )}
            </SimpleGrid>
            {props.myCourses.length === 0 && (
              <>
                <Center w={"100%"} h={"100%"}>
                  <Stack align="center" justify="center">
                    <img
                      src={require("../../assets/emptyCourses2.png")}
                      style={{
                        width: "50%",
                      }}
                    />
                    <Text fz={18}>No Courses Found!</Text>
                  </Stack>
                </Center>
              </>
            )}
          </Stack>
        )}
        {courseId !== undefined && (
          <Box
            ml={-10}
            style={{
              position: "relative",
            }}
          >
            <SingleCoursePage
              courseId={courseId}
              teacherTestAnswers={props.teacherTestAnswers}
              onTestClick={(val, isChecked) => {
                props.onTestClick(val, courseId, isChecked);
              }}
              onBackClick={() => {
                navigate(`/${props.mainPath}/courses`);
              }}
              fromTeacherSide={false}
            />
          </Box>
        )}
      </>
    </>
  );
}
