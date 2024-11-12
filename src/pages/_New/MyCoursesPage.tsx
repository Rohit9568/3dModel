import {
  Box,
  Divider,
  Flex,
  Group,
  ScrollArea,
  Stack,
  Text,
} from "@mantine/core";
import { useEffect, useState } from "react";
import { TestScreen } from "../../components/MyCourses/TestScreen";
import { FirstMyCourseScreen } from "../../components/MyCourses/FirstMyCourseScreen";
import { AddNewCourseSection } from "../../components/MyCourses/AddNewCourseScreen";
import { AddNewTestScreen } from "../../components/MyCourses/AddNewTestScreen";
import { SingleCoursePage } from "../../_parentsApp/Components/SingleCoursePage";
import { TopBarTeacher } from "../../components/NavbarTeacher/TopBarTeacher";
import { useMediaQuery } from "@mantine/hooks";
import { useSelector } from "react-redux";
import { RootState } from "../../store/ReduxStore";
import { useLocation, useNavigate } from "react-router-dom";
import { MainPageTabs } from "../LandingPage";

export enum MyCoursesScreen {
  COURSES = "Courses",
  TESTSERIES = "Test Series",
  RECORDED = "Recorded Lectures",
}

enum CoursesScreen {
  ALLCOURSES,
  EDITCOURSE,
  VIEWCOURSE,
  ADDCOURSE,
}
export function MyCoursesPage(props: { onLogout: () => void }) {
  const isMd = useMediaQuery(`(max-width: 820px)`);
  const [currentTab, setCurrentTab] = useState<MyCoursesScreen>(
    MyCoursesScreen.COURSES
  );
  const [currentScreen, setCurrentScreen] = useState<CoursesScreen>(
    CoursesScreen.ALLCOURSES
  );
  const [selectedCourse, setselectedCourse] = useState<Course | null>(null);
  const mainPath = useSelector<RootState, string | null>((state) => {
    return state.mainPathSlice.value;
  });
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const type = queryParams.get("type");

  const instituteDetails = useSelector<RootState, InstituteDetails | null>(
    (state) => {
      return state.instituteDetailsSlice.instituteDetails;
    }
  );

  useEffect(() => {
    if (type === null) setCurrentScreen(CoursesScreen.ALLCOURSES);
  }, [type]);
  return (
    <ScrollArea h="100vh">
      {currentScreen === CoursesScreen.ALLCOURSES && (
        <FirstMyCourseScreen
          selectedScreen={currentTab}
          setSelectedScreen={setCurrentTab}
          onAddNewClicked={() => {
            navigate(
              `${mainPath}/${MainPageTabs.MYCOURSES.toLowerCase()}?type=add`
            );
            setCurrentScreen(CoursesScreen.ADDCOURSE);
            // setIsAddNewClicked(true);
          }}
          onCourseEditClick={(val) => {
            navigate(
              `${mainPath}/${MainPageTabs.MYCOURSES.toLowerCase()}?type=edit`
            );
            setselectedCourse(val);
            setCurrentScreen(CoursesScreen.EDITCOURSE);
          }}
          onCourseClick={(val) => {
            navigate(
              `${mainPath}/${MainPageTabs.MYCOURSES.toLowerCase()}?type=view`
            );
            setCurrentScreen(CoursesScreen.VIEWCOURSE);
            setselectedCourse(val);
          }}
          onLogout={() => {
            props.onLogout();
          }}
        />
      )}
      {currentScreen === CoursesScreen.ADDCOURSE && (
        <AddNewTestScreen
          selectedScreen={currentTab}
          isTestSeries={currentTab === MyCoursesScreen.TESTSERIES}
          course={null}
          isUpdateCourse={false}
          onExit={() => {
            setCurrentScreen(CoursesScreen.ALLCOURSES);
          }}
          isCourseEdit={false}
        />
      )}
      {currentScreen === CoursesScreen.EDITCOURSE && (
        <AddNewTestScreen
          selectedScreen={currentTab}
          isTestSeries={currentTab === MyCoursesScreen.TESTSERIES}
          course={selectedCourse}
          isUpdateCourse={true}
          onExit={() => {
            setCurrentScreen(CoursesScreen.ALLCOURSES);
            setselectedCourse(null);
          }}
          isCourseEdit={true}
        />
      )}
      {currentScreen === CoursesScreen.VIEWCOURSE && selectedCourse && (
        <SingleCoursePage
          courseId={selectedCourse?._id}
          onBackClick={() => {
            setCurrentScreen(CoursesScreen.ALLCOURSES);
            setselectedCourse(null);
          }}
          onTestClick={() => {}}
          teacherTestAnswers={null}
          fromTeacherSide={true}
        />
      )}
    </ScrollArea>
  );
}
