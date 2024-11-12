import { fetchClassList } from "../../features/classes/classSlice";
import { useState, useEffect, Fragment } from "react";
import { fetchClassAndSubjectList } from "../../features/UserSubject/TeacherSubjectSlice";
import { LoadingOverlay } from "@mantine/core";
import { TeacherSetup } from "../../components/TeacherSetup/TeacherSetup";
import { IsUserLoggedIn } from "../../utilities/AuthUtility";
import { AuthenticationPage } from "../AuthenticationPage/AuthenticationPage";
import { Group } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { cleanString } from "../../utilities/HelperFunctions";

export const AddSubjectPage = () => {
  const navigate = useNavigate();
  const [classes, setClasses] = useState<ClassModelWithSubjects[]>([]);
  const [teacherClasses, setTeacherClasses] = useState<UserClassAndSubjects[]>(
    []
  );
  const [filterClasses, setFilterClasses] = useState<ClassModelWithSubjects[]>(
    []
  );
  const [isLoading, setisLoading] = useState<boolean>(false);

  function fetchClassModelList() {
    setisLoading(true);
    fetchClassList<ClassModelWithSubjects[]>({ includeSubjectMetaData: true })
      .then((data) => {
        let classList = data as ClassModelWithSubjects[];
        setisLoading(false);
        classList = classList.map((x) => {
          const subjects1 = x.subjects.map((y) => {
            const yu = cleanString(y.name);
            return {
              name: yu,
              _id: y._id,
            };
          });
          return {
            name: x.name,
            _id: x._id,
            subjects: subjects1,
            classType: x.classType,
            boardId: x.boardId,
          };
        });
        setClasses(classList);
      })
      .catch((error) => {
        setisLoading(false);
      });
  }
  useEffect(() => {
    fetchClassModelList();
  }, []);

  useEffect(() => {
    const teacherSubjectsMap = new Map<string, boolean>();
    teacherClasses.map((x) => {
      x.subjects.map((y) => {
        teacherSubjectsMap.set(y._id, true);
      });
    });
    const classes1: ClassModelWithSubjects[] = classes.map((x) => {
      const subjects1 = x.subjects.filter((y) => {
        if (teacherSubjectsMap.get(y._id)) {
          return false;
        }
        return true;
      });
      return {
        subjects: subjects1,
        _id: x._id,
        name: x.name,
        classType: x.classType,
        boardId: x.boardId,
      };
    });
    setFilterClasses(classes1);
  }, [teacherClasses, classes]);
  return (
    <Fragment>
      <TeacherSetup
        isSetup={false}
        classes={filterClasses}
        maxClasses={100}
        logout={() => {
          navigate("/");
        }}
      />
      <LoadingOverlay visible={isLoading}></LoadingOverlay>
    </Fragment>
  );
};
