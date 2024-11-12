import { Flex, LoadingOverlay, useMantineTheme } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { GetAllSubjectsByClassId } from "../../_parentsApp/features/instituteClassSlice";
import { UserType } from "../../components/AdminPage/DashBoard/InstituteBatchesSection";
import SelectClass from "../../components/_New/TeacherPage new/ClassSelection";
import { fetchSharedSubjectsData } from "../../features/UserSubject/TeacherSubjectSlice";
import { AppDispatch } from "../../store/ReduxStore";
import { subjects } from "../../store/subjectsSlice";
import { WebAppEvents } from "../../utilities/Mixpanel/AnalyticeEventWebApp";
import { Mixpanel } from "../../utilities/Mixpanel/MixpanelHelper";
import { ChapterSelect } from "../_New/ChapterSelect";
const subjectsActions = subjects.actions;

export const BatchWiseStudyMaterialPage = (props: {
  batchId: string;
  userType: UserType;
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [isEmpty, setisEmpty] = useState<boolean>(false);
  const theme = useMantineTheme();

  const [userClassAndSubjects, setUserSubjects] = useState<
    UserClassAndSubjects[]
  >([]);

  const isMd = useMediaQuery(`(max-width: ${theme.breakpoints.md}px)`);

  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    fetchList();
    Mixpanel.track(WebAppEvents.TEACHER_APP_HOME_PAGE_ACCESSED);
  }, []);

  function fetchList() {
    setLoading(true);
    const apiCallSlice =
      props.userType == UserType.OTHERS
        ? GetAllSubjectsByClassId({ id: props.batchId })
        : fetchSharedSubjectsData({
            classId: props.batchId,
          });

    apiCallSlice
      .then((data: any) => {
        const fetchedData: UserSubjectAPI[] =
          props.userType == UserType.OTHERS
            ? data.subjects.map((sSubject: any) => {
                return sSubject.data;
              })
            : data;
        if (data.length === 0) setisEmpty(true);
        else {
          console.log(data);
          const segregatedData: UserClassAndSubjects[] = [];
          fetchedData.forEach((subject) => {
            const subjectEntry = {
              _id: subject._id,
              name: subject.name,
              chaptersCount: subject.chaptersCount,
              subjectId: subject.subjectId,
            };
            const found = segregatedData.findIndex(
              (x) => x.classId === subject.classId
            );
            console.log(found);
            if (found === -1) {
              segregatedData.push({
                classId: subject.classId,
                className: subject.className,
                classSortOrder: subject.classSortOrder,
                subjects: [subjectEntry],
                grade: subject.classgrade,
                boardId: subject.boardId,
                boardName: subject.boardName,
              });
            } else {
              segregatedData[found].subjects.push(subjectEntry);
            }
          });
          setUserSubjects(
            segregatedData.sort((a, b) => a.classSortOrder - b.classSortOrder)
          );
        }
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        console.log(error);
      });
  }

  const [currentSubject, setCurrentSubject] = useState<UserSubject | null>();

  return (
    <Flex w="100%" mb={30}>
      <LoadingOverlay visible={loading}></LoadingOverlay>
      {currentSubject == null ? (
        <SelectClass
          userClassesSubjects={userClassAndSubjects}
          onSubjectClicked={(currentSubject: UserSubject) => {
            setCurrentSubject(currentSubject);
          }}
        />
      ) : (
        <ChapterSelect
          subject={currentSubject}
          classId={props.batchId}
          userType={props.userType}
          onBackClick={() => {
            setCurrentSubject(null);
          }}
        />
      )}
    </Flex>
  );
};
