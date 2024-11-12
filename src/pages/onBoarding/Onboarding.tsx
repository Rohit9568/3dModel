import { LoadingOverlay } from "@mantine/core";
import { Fragment, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { User1 } from "../../@types/User";
import { GetOnboardingOrderData } from "../../_parentsApp/features/paymentSlice";
import { TeacherSetup } from "../../components/TeacherSetup/TeacherSetup";
import { fetchClassList } from "../../features/classes/classSlice";
import { getinstituteById } from "../../features/institute/institute";
import { RootState } from "../../store/ReduxStore";
import { cleanString } from "../../utilities/HelperFunctions";
import {
  GetUserToken,
  LocalStorageKey,
  SaveValueToLocalStorage,
} from "../../utilities/LocalstorageUtility";
import { WebAppEvents } from "../../utilities/Mixpanel/AnalyticeEventWebApp";
import { Mixpanel } from "../../utilities/Mixpanel/MixpanelHelper";
import { displayOnBoardingRazorPay } from "../../utilities/Payment";
import { InstituteSetup } from "./InstituteSetup";

export const OnBoarding = () => {
  const navigate = useNavigate();
  const [classes, setClasses] = useState<ClassModelWithSubjects[]>([]);
  const [isLoading, setisLoading] = useState<boolean>(false);
  const [teacherClasses, setTeacherClasses] = useState<UserClassAndSubjects[]>(
    []
  );
  const [filterClasses, setFilterClasses] = useState<ClassModelWithSubjects[]>(
    []
  );
  const [instituteSetupMOdal, setInstituteSetupModal] =
    useState<boolean>(false);
  const user = useSelector<RootState, User1 | null>((state) => {
    return state.currentUser.user;
  });
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const noofclasses = queryParams.get("classes");
  const plan = queryParams.get("plan");
  const name = queryParams.get("name");
  const phoneNo = queryParams.get("phoneNo");
  const token = GetUserToken();
  const [maxClasses, setMaxClasses] = useState<number>(0);

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

  function loginUser(x: any) {
    SaveValueToLocalStorage(
      LocalStorageKey.User,
      JSON.stringify({
        _id: x.user._id,
        email: x.user.email,
        name: x.user.name,
        role: x.user.role,
        homeworkToken: x.user.homeworkshareToken,
        instituteId: x.instituteId,
        phone: x.user.phoneNo,
        instituteName: x.instituteName,
        userSubjects: x.user.userSubjects,
      })
    );
    SaveValueToLocalStorage(LocalStorageKey.Token, x.token);
    SaveValueToLocalStorage(LocalStorageKey.UserType, x.user.role);
  }

  function onBoardingHanlder() {
    setisLoading(true);
    if (noofclasses && name && phoneNo && plan) {
      GetOnboardingOrderData({
        plan: parseInt(plan),
        classes: parseInt(noofclasses),
      })
        .then((data: any) => {
          setisLoading(false);
          displayOnBoardingRazorPay(
            {
              ...data.order,
              name: name,
              phoneNumber: phoneNo,
              maxClasses: parseInt(noofclasses),
              plan: parseInt(plan),
            },
            (x) => {
              Mixpanel.track(WebAppEvents.NEW_USER_ID_CREATED, {
                name: name,
                phoneNumber: phoneNo,
                maxClasses: parseInt(noofclasses),
                plan: parseInt(plan),
              });
              setisLoading(true);
              loginUser(x);

              window.location.href = "/";
            }
          );
        })
        .catch((e) => {
          console.log(e);
          setisLoading(false);
        });
    } else {
      window.location.href = "/";
    }
  }
  useEffect(() => {
    if (user) {
      if (user && user._id === "") {
        onBoardingHanlder();
      } else {
        if (user.userSubjects.length === 0) {
          getinstituteById(user.instituteId)
            .then((x: any) => {
              if (x.isSetup === false) {
                setInstituteSetupModal(true);
              } else {
                fetchClassModelList();
              }
            })
            .catch((e) => {
              console.log(e);
            });
        }
      }
    }
  }, [user]);

  useEffect(() => {
    if (token) {
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
    }
  }, [teacherClasses, classes]);

  return (
    <Fragment>
      <TeacherSetup
        isSetup={false}
        classes={filterClasses}
        maxClasses={maxClasses + 1}
        logout={() => {
          window.location.href = "/";
        }}
      />
      <LoadingOverlay visible={isLoading}></LoadingOverlay>
      {instituteSetupMOdal && user && (
        <InstituteSetup
          onClose={(x) => {
            setInstituteSetupModal(false);
            loginUser(x);
            setMaxClasses(x.maxClasses);
            fetchClassModelList();
          }}
          opened={instituteSetupMOdal}
          userId={user?._id}
        />
      )}
    </Fragment>
  );
};
