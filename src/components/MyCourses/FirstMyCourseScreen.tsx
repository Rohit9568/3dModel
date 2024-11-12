import {
  Box,
  Button,
  Divider,
  Group,
  LoadingOverlay,
  Modal,
  Stack,
  Text,
  useMantineTheme,
} from "@mantine/core";
import { MyCoursesScreen } from "../../pages/_New/MyCoursesPage";
import { CoursesScreen } from "./CoursesScreen";
import { TestScreen } from "./TestScreen";
import { useEffect, useState } from "react";
import {
  deleteCourse,
  getAllInstituteCoursesAndTestSeries,
} from "../../features/course/courseSlice";
import { useMediaQuery } from "@mantine/hooks";
import { Mixpanel } from "../../utilities/Mixpanel/MixpanelHelper";
import { WebAppEvents } from "../../utilities/Mixpanel/AnalyticeEventWebApp";
import { TopBarTeacher } from "../NavbarTeacher/TopBarTeacher";
import { useSelector } from "react-redux/es/hooks/useSelector";
import { RootState } from "../../store/ReduxStore";

function ScreenText(props: {
  text: string;
  selectedText: boolean;
  onClick: () => void;
}) {
  return (
    <Stack
      spacing={0}
      onClick={() => {
        props.onClick();
      }}
      style={{
        cursor: "pointer",
      }}
    >
      <Text
        color={"#000"}
        fz={14}
        fw={700}
        ff="Nunito"
        mb={10}
        style={{
          opacity: props.selectedText ? 1 : 0.3,
        }}
      >
        {props.text}
      </Text>
      {props.selectedText && <Divider size="lg" color="#4B65F6" />}
    </Stack>
  );
}
export function FirstMyCourseScreen(props: {
  selectedScreen: MyCoursesScreen;
  setSelectedScreen: (val: MyCoursesScreen) => void;
  onAddNewClicked: () => void;
  onCourseEditClick: (course: Course) => void;
  onCourseClick: (course: Course) => void;
  onLogout: () => void;
}) {
  const [courses, setCourses] = useState<Course[] | null>(null);
  const [testSeries, settestSeries] = useState<Course[] | null>(null);
  const [isLoading, setLoading] = useState<boolean>(false);
  const theme = useMantineTheme();
  const isMd = useMediaQuery(`(max-width: ${theme.breakpoints.md}px)`);
  const instituteDetails = useSelector<RootState, InstituteDetails | null>(
    (state) => state.instituteDetailsSlice.instituteDetails
  );

  function GetCourses() {
    setLoading(true);
    getAllInstituteCoursesAndTestSeries(instituteDetails?._id!!)
      .then((x: any) => {
        console.log(x);
        const courses = x.filter(
          (x: any) =>
            x.files.length !== 0 || x.videos.length || x.folders.length !== 0
        );
        const testSeries = x.filter(
          (x: any) =>
            x.files.length === 0 &&
            x.videos.length === 0 &&
            x.folders.length === 0
        );
        setCourses(courses);
        setLoading(false);
        settestSeries(testSeries);
      })
      .catch((e) => {
        setLoading(false);
        console.log(e);
      });
  }

  function DeleteCourse(id: string) {
    setShowWarning(null);
    deleteCourse(id,instituteDetails?._id!!)
      .then((x) => {
        GetCourses();
      })
      .catch((e) => {
        console.log(e);
      });
  }
  useEffect(() => {
    GetCourses();
  }, []);
  const [showWarning, setShowWarning] = useState<{
    name: string;
    _id: string;
  } | null>(null);
  return (
    <>
      <Stack px={isMd ? 20 : 30} py={isMd ? 10 : 20} mb={isMd ? 40 : 0}>
        <LoadingOverlay visible={isLoading} />
        <Stack spacing={3}>
          <Text
            style={{
              fontFamily: "Nunito",
            }}
            fz={32}
            fw={700}
          >
            My Courses ({(testSeries?.length ?? 0) + (courses?.length ?? 0)})
          </Text>
          <Text
            color="#000"
            fz={14}
            style={{
              fontFamily: "Nunito",
              opacity: 0.5,
            }}
            fw={400}
          >
            Add/View courses of your brand
          </Text>
        </Stack>
        <Group spacing={20} align="center">
          <ScreenText
            text={MyCoursesScreen.COURSES}
            selectedText={props.selectedScreen === MyCoursesScreen.COURSES}
            onClick={() => {
              props.setSelectedScreen(MyCoursesScreen.COURSES);
            }}
          />
          <ScreenText
            text={MyCoursesScreen.TESTSERIES}
            selectedText={props.selectedScreen === MyCoursesScreen.TESTSERIES}
            onClick={() => {
              props.setSelectedScreen(MyCoursesScreen.TESTSERIES);
            }}
          />
        </Group>
        <Divider
          size="sm"
          color="#000"
          style={{
            opacity: 0.2,
          }}
          mt={-17}
        />
        {props.selectedScreen === MyCoursesScreen.COURSES && (
          <CoursesScreen
            onAddNewClicked={() => {
              Mixpanel.track(WebAppEvents.ADD_NEW_COURSE_BUTTON_CLICKED);
              props.onAddNewClicked();
            }}
            courses={courses}
            onEditCourseClick={(course) => {
              props.onCourseEditClick(course);
            }}
            onDeleteCourseClick={(course) => {
              setShowWarning({
                _id: course._id,
                name: course.name,
              });
            }}
            onCourseClick={(course) => {
              props.onCourseClick(course);
            }}
          />
        )}
        {props.selectedScreen === MyCoursesScreen.TESTSERIES && (
          <TestScreen
            onAddNewClicked={() => {
              Mixpanel.track(WebAppEvents.ADD_NEW_TEST_SERIES_BUTTON_CLICKED);
              props.onAddNewClicked();
            }}
            testSeries={testSeries}
            onEditClick={(course) => {
              props.onCourseEditClick(course);
            }}
            onDeleteClick={(course) => {
              setShowWarning({
                _id: course._id,
                name: course.name,
              });
            }}
            onCourseClick={(course) => {
              props.onCourseClick(course);
            }}
          />
        )}
      </Stack>
      <Modal
        opened={showWarning !== null}
        onClose={() => {
          setShowWarning(null);
        }}
        centered
        style={{ zIndex: 9999999 }}
        title="Delete Course"
      >
        <Stack>
          <Text>{`Are you sure you want to delete ${showWarning?.name}?`}</Text>
          <Group>
            <Button
              color="#909395"
              fz={16}
              fw={500}
              style={{
                border: "#909395 solid 1px",
                color: "#909395",
              }}
              variant="outline"
              size="lg"
              w="47%"
              onClick={() => {
                setShowWarning(null);
              }}
            >
              Cancel
            </Button>
            <Button
              style={{
                backgroundColor: "#FF0000",
                color: "white",
              }}
              size="lg"
              w="47%"
              fz={16}
              fw={500}
              onClick={() => {
                if (showWarning !== null) DeleteCourse(showWarning._id);
              }}
            >
              Yes,Delete it
            </Button>
          </Group>
        </Stack>
      </Modal>
    </>
  );
}
