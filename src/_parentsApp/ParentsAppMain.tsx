import {
  AppShell,
  Box,
  Center,
  Flex,
  Footer,
  Header,
  LoadingOverlay,
  ScrollArea,
  Select,
  Stack,
  Text,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { showNotification } from "@mantine/notifications";
import { Fragment, lazy, useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import useParentCommunication from "../hooks/useParentCommunication";
import { AppDispatch } from "../store/ReduxStore";
import { instituteDetails } from "../store/instituteDetailsSlice";
import { convertToHyphenSeparated } from "../utilities/HelperFunctions";
import {
  GetValueFromLocalStorage,
  LocalStorageKey,
  RemoveValueFromLocalStorage,
  SaveValueToLocalStorage,
} from "../utilities/LocalstorageUtility";
import { ParentPageEvents } from "../utilities/Mixpanel/AnalyticEventParentApp";
import { Mixpanel } from "../utilities/Mixpanel/MixpanelHelper";
import NoticePage from "./Components/NoticePage";
import { ParentFooter } from "./Components/ParentFooter";
import { AllTest } from "./Components/ParentTest/AllTest";
import { SingleTest } from "./Components/ParentTest/SingleParentTest";
import { SidebarInstitute } from "./Components/SideBarInstitute";
import TitleBar from "./Components/TitleBar";
import { InstituteWebsite } from "./WebsiteBuilderViewer/InstituteWebsite";
import { SingleCourseBuy } from "./WebsiteBuilderViewer/components/SingleCourseBuy";
import { GetAllInfoForInstitute } from "./features/instituteSlice";
import {
  GetStudentUserInfo,
  StudentAuthorization,
} from "./features/instituteStudentSlice";
import { StudentBatchesSection } from "./Components/StudentBatchesSection";
import { MobileHomePage } from "./InstituteMobileApp/MobileHomePage";
import studentSlice, { currentLoginStudent } from "../store/studentSlice";
import { Courses } from "./Components/Courses";
import ParentLoginPage2 from "./Components/ParentLogin2";
import ParentLoginPage from "./Components/ParentLoginPage";
import { StudentProfile } from "./Components/StudentProfile";
import ShowResultToStudent from "./Components/ShowResultToStudent";
import React from "react";
const instituteDetailsActions = instituteDetails.actions;
const currentLoginStudentActions = currentLoginStudent.actions;

const VideoCall = lazy(() => import("./Components/VideoCall"));

export enum ParentAppPage {
  HOME = "home",
  BATCHES = "batches",
  RESULT = "result",
  HOMEWORK = "homework",
  TEST = "test",
  NOTICE = "notice",
  VIDEOCALL = "videocall",
  COURSES = "courses",
  BUYCOURSE = "buyCourse",
  NULL = "null",
  STUDY = "study",
  SHOWPROFILE = "showProfile",
}

export const accessedFeaturesForCourseStudents = [
  ParentAppPage.HOME,
  ParentAppPage.COURSES,
  ParentAppPage.NULL,
];

export enum StudyPageTabs {
  Notes = "Notes",
  Worksheets = "WorkSheets",
  Topic = "Topics",
  Simulaitons = "Simulations",
  Videos = "Videos",
  Null = "null",
}
export function ParentsAppMain() {
  const params = useParams();
  const navigate = useNavigate();
  const [notices, setNotices] = useState<Notice[]>([]);
  const [instituteWebsiteInfo, setinstituteWebsiteInfo] =
    useState<InstituteWebsiteDisplay | null>(null);
  const [isOnlinePaymentEnabled, setOnlinePaymentEnabled] =
    useState<boolean>(true);
  const [paymentDetailsImageUrl, setPaymentDetailsImageUrl] =
    useState<string>();
  const [photos, setPhotos] = useState<string[]>([]);
  const instituteId = params.id;
  const instituteName = params.Institutename;
  const [userInfo, setUserInfo] = useState<StudentInfo | null | undefined>(
    undefined
  );
  const [error, setError] = useState<string | null>(null);
  const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);
  const [sideBarCollapsed, setSideBarCollapsed] = useState<boolean>(false);
  const [isTopicPageAccessed, setIsTopicPageAccessed] =
    useState<boolean>(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);

  const [loadingData, setLoadingData] = useState<boolean>(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  const [testId, setTestId] = useState<string | null>(null);

  useEffect(() => {
    Mixpanel.track(ParentPageEvents.PARENTS_APP_ACCESSED);
  }, []);
  const isMd = useMediaQuery(`(max-width: 820px)`);
  const widthValue = !isTopicPageAccessed
    ? "100%"
    : isMd
    ? "100%"
    : sideBarCollapsed
    ? "calc(100% - 100px)"
    : "calc(100% - 250px)";
  const heightValue = isMd ? "calc(100dvh - 120px)" : "calc(100dvh - 60px)";
  const [testSumbittion, setTestSumbission] = useState<boolean>(false);
  const { sendDataToReactnative } = useParentCommunication();

  useEffect(() => {
    const token = GetValueFromLocalStorage(LocalStorageKey.Token);
    const type = GetValueFromLocalStorage(LocalStorageKey.UserType);
    if (token && instituteId && instituteId !== "" && !type && instituteName) {
      GetStudentUserInfo({ instituteId })
        .then((x: any) => {
          setUserInfo(x[0]);
          dispatch(
            currentLoginStudent.actions.setCurrentLoginStudentDetails({
              _id: x[0]._id,
              name: x[0].name,
              parentName: x[0].parentName,
              phoneNumber: x[0].phoneNumber,
              profilePic: x[0].profilePic,
            })
          );
          const data = {
            phoneNo: x[0].phoneNumber,
            instituteId,
          };
          sendDataToReactnative(2, data);
          setTestSumbission(false);
          Mixpanel.registerParentFromLocalStorage(x, instituteName);
          Mixpanel.track(
            ParentPageEvents.PARENTS_APP_RESULT_PAGE_LOGIN_SUCCESS
          );
        })
        .catch((e) => {
          console.log(e);
          setUserInfo(null);
          RemoveValueFromLocalStorage(LocalStorageKey.Token);
        });
    } else if (instituteId !== "") {
      setUserInfo(null);
    }
  }, [instituteWebsiteInfo, testSumbittion]);

  useEffect(() => {
    if (
      params.entryComponent &&
      Object.values(ParentAppPage).includes(
        params.entryComponent as ParentAppPage
      )
    ) {
      if (params.entryComponent === ParentAppPage.TEST) {
        setSelected(ParentAppPage.TEST);
        if (params.subComponent) {
          setTestId(params.subComponent);
        } else setTestId(null);
      } else if (params.entryComponent === ParentAppPage.RESULT) {
        setSelected(ParentAppPage.RESULT);
      } else if (params.entryComponent === ParentAppPage.NOTICE) {
        setSelected(ParentAppPage.HOME);
        if (params.subComponent) {
          if (notices.length !== 0) {
            const found = notices.find((x) => x._id === params.subComponent);
            if (found) {
              setSelectedNotice(found);
            } else {
              setSelectedNotice(null);
            }
          }
        } else {
          setSelectedNotice(null);
        }
      } else if (params.entryComponent === ParentAppPage.BUYCOURSE) {
        setSelected(ParentAppPage.HOME);
      } else if (params.entryComponent === ParentAppPage.VIDEOCALL) {
        setSelected(ParentAppPage.COURSES);
        setisvideoCall(true);
      } else if (params.entryComponent === ParentAppPage.STUDY) {
        setSelected(ParentAppPage.COURSES);
      } else if (params.entryComponent === ParentAppPage.BATCHES) {
        setSelected(ParentAppPage.BATCHES);
      } else {
        setSelected(params.entryComponent as ParentAppPage);
        setisvideoCall(false);
      }
    } else {
      setSelected(ParentAppPage.HOME);
      setSelectedNotice(null);
      setSelectedCourse(null);
    }
  }, [params, notices]);

  function changeFavicon(newFaviconURL: string) {
    const head = document.head || document.getElementsByTagName("head")[0];
    const existingFavicon = document.querySelector('link[rel="icon"]');
    const favicon: any = existingFavicon || document.createElement("link");

    favicon.rel = "icon";
    favicon.href = newFaviconURL;

    if (!existingFavicon) {
      head.appendChild(favicon);
    } else if (existingFavicon instanceof Element) {
      head.replaceChild(favicon, existingFavicon);
    }
  }
  function changeTitle(name: string) {
    document.title = name;
  }

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (params.id) {
      GetAllInfoForInstitute({ id: params.id })
        .then((x: any) => {
          setinstituteWebsiteInfo(x);
          setOnlinePaymentEnabled(x.featureAccess.isOnlinePaymentEnabled);
          setPaymentDetailsImageUrl(x.paymentDetailsImageUrl);

          dispatch(
            instituteDetailsActions.setDetails({
              name: x.name,
              iconUrl: x.schoolIcon,
              _id: x._id,
              secondPhoneNumber: x.secondInstituteNumber,
              address: x.Address,
              phoneNumber: x.institutePhoneNumber,
              featureAccess: x.featureAccess,
              paymentDetailsImageUrl: x.paymentDetailsImageUrl,
            })
          );

          setNotices(x.notices);
          setPhotos(x.schoolPhotos);
          changeTitle(x.name);
          changeFavicon(x.schoolIcon);
        })
        .catch((e) => {
          console.log(e);
        });
    }
  }, [params]);

  const [selected, setSelected] = useState(ParentAppPage.HOME);
  const [isVideoCall, setisvideoCall] = useState<boolean>(false);
  const [navbar, setNavbar] = useState<any>(<></>);
  const [isShowNav, setIsShowNav] = useState<boolean>(true);
  const scrollAreaRef = useRef<any>(null);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const courseId = queryParams.get("courseId");
  const meetingId = queryParams.get("meetingId");

  const updateNav1 = (val: boolean) => {
    setIsShowNav(val);
  };

  useEffect(() => {
    if (userInfo && instituteWebsiteInfo && !isTopicPageAccessed && !isMd)
      setNavbar(
        <SidebarInstitute
          userInfo={userInfo}
          selectedTab={selected}
          instituteId={instituteWebsiteInfo._id}
          schoolName={instituteWebsiteInfo?.name}
          schoolIcon={instituteWebsiteInfo?.schoolIcon}
          sideBarCollapsed={setIsCollapsed}
          parentName={userInfo === null ? null : userInfo.parentName}
          isFixed={
            selected === ParentAppPage.HOME &&
            !selectedNotice &&
            !selectedCourse
          }
          mainPath={mainPath}
          onShowProfileClick={() => {
            navigate(`/${mainPath}/showProfile`);
          }}
          profilePic={userInfo === null ? "" : userInfo.profilePic}
        />
      );
  }, [userInfo, instituteWebsiteInfo, isTopicPageAccessed, isMd]);

  const handleSubmit = async (phoneNo: string, password?: string | null) => {
    try {
      StudentAuthorization({ phoneNo, instituteId, password })
        .then((x: any) => {
          SaveValueToLocalStorage(LocalStorageKey.Token, x.token);
          RemoveValueFromLocalStorage(LocalStorageKey.User);
          RemoveValueFromLocalStorage(LocalStorageKey.UserType);
          window.location.reload();
        })
        .catch((e) => {
          console.log(e);
          showNotification({
            message: `The phone number ${
              password !== null ? "or password" : ""
            } entered is incorrect. Please try again.`,
          });
        });
    } catch (error) {
      console.log(error);
      setError("The phone number entered is incorrect. Please try again.");
      console.error(error);
    }
  };
  const mainPath = `${convertToHyphenSeparated(
    instituteWebsiteInfo?.name ?? ""
  )}/${instituteId}/home`;

  const [isCollapsed, setIsCollapsed] = useState<boolean>(true);

  useEffect(() => {
    if (isVideoCall && userInfo === null) {
      navigate(
        `/${instituteName}/${instituteId}/parent?meetingId=${meetingId}`
      );
    }
  }, [isVideoCall]);

  return (
    <>
      {!isVideoCall && (
        <AppShell
          styles={{
            main: {
              width: "75vw",
              height: "50vw",
            },
          }}
          padding={0}
          header={
            <>
              {isMd &&
                instituteWebsiteInfo != null &&
                userInfo !== null &&
                userInfo !== undefined &&
                instituteId && (
                  <Header height={60}>
                    <TitleBar
                      schoolName={instituteWebsiteInfo?.name}
                      schoolIcon={instituteWebsiteInfo?.schoolIcon}
                      isTeacher={false}
                      isParent={true}
                      instituteId={instituteId}
                      isTopicpageAccessed={isTopicPageAccessed}
                      setisDrawerOpen={setIsDrawerOpen}
                      selectedTab={selected}
                      name={userInfo.parentName}
                      onLogout={() => {
                        navigate("/");
                      }}
                      mainPath={mainPath}
                      showDoubts={false}
                      onShowProfileClick={() => {
                        navigate(`/${mainPath}/showProfile`);
                      }}
                      profilePic={userInfo.profilePic}
                    />
                  </Header>
                )}
            </>
          }
          footer={
            <>
              {userInfo !== null && instituteId && userInfo !== undefined && (
                <>
                  {isMd ? (
                    <Footer height={60} w="100%">
                      <ParentFooter
                        selectedTab={selected}
                        instituteId={instituteId}
                        instituteName={convertToHyphenSeparated(
                          instituteWebsiteInfo?.name ?? ""
                        )}
                        mainPath={mainPath}
                        userInfo={userInfo}
                      ></ParentFooter>
                    </Footer>
                  ) : (
                    <></>
                  )}
                </>
              )}
            </>
          }
          navbar={<>{!isMd && isShowNav ? navbar : <></>}</>}
        >
          <LoadingOverlay visible={loadingData} />
          {instituteWebsiteInfo && userInfo !== undefined && (
            <Box
              ml={isMd || !isShowNav ? 0 : isCollapsed ? 75 : 250}
              w={
                isMd || !isShowNav
                  ? "100%"
                  : `calc(100% - ${isCollapsed ? "75px" : "250px"})`
              }
              h={"100%"}
              style={{
                position: "relative",
                transition: "margin ease-in-out 250ms",
              }}
            >
              <Box id="your-scroll-area-id" w={"100%"} h={"100%"}>
                {selected === ParentAppPage.HOME &&
                  !selectedNotice &&
                  !selectedCourse &&
                  userInfo !== undefined &&
                  (userInfo == null ? (
                    <Box
                      style={{
                        marginLeft: isMd ? "0px" : "-75px",
                      }}
                    >
                      <InstituteWebsite
                        instituteDetails={instituteWebsiteInfo}
                        loggedIn={!(userInfo === null)}
                        onLoginSubmit={handleSubmit}
                        error={error}
                        setSelectedCourse={(val) => {
                          setSelectedCourse(val);
                          navigate(`/${mainPath}/buyCourse`);
                        }}
                        courses={instituteWebsiteInfo!!.instituteCourses}
                        onCoursesPageClick={() => {
                          navigate(`/${mainPath}/courses`);
                        }}
                        mainPath={mainPath}
                      />
                    </Box>
                  ) : (
                    <MobileHomePage
                      courses={instituteWebsiteInfo!!.instituteCourses}
                      onClick={(val) => {
                        if (
                          userInfo?.myCourses === null ||
                          !userInfo?.myCourses.find((x) => x._id === val._id)
                        ) {
                          setSelectedCourse(val);
                          navigate(`/${mainPath}/buyCourse`);
                        } else {
                          navigate(`/${mainPath}/courses`);
                        }
                      }}
                      courses1={instituteWebsiteInfo!!.instituteCourses}
                      instituteDetails={instituteWebsiteInfo!!}
                      loggedIn={true}
                      parentName={userInfo!!.parentName}
                      mainPath={mainPath}
                      batches={userInfo!!.batches}
                      studentData={{
                        studentId: userInfo!!._id,
                        teacherTestAnswers: userInfo!!.teacherTestAnswers,
                      }}
                    />
                  ))}
                {selected === ParentAppPage.HOME &&
                  !selectedNotice &&
                  instituteWebsiteInfo &&
                  selectedCourse && (
                    <SingleCourseBuy
                      onBackclick={() => {
                        setSelectedCourse(null);
                      }}
                      selectedCourse={selectedCourse}
                      institute={{
                        _id: instituteId ?? "",
                        name: instituteWebsiteInfo.name,
                        isOnlinePaymentEnabled: isOnlinePaymentEnabled,
                        paymentDetailsImageUrl: paymentDetailsImageUrl ?? "",
                      }}
                      courses={userInfo ? userInfo.myCourses : null}
                      setUserInfo={setUserInfo}
                      onCoursesClick={() => {
                        navigate(`/${mainPath}/courses`);
                      }}
                      userInfo={userInfo}
                      theme={instituteWebsiteInfo.theme}
                      mainPath={mainPath}
                    />
                  )}
                {selected === ParentAppPage.HOME && selectedNotice && (
                  <ScrollArea
                    h={heightValue}
                    w={widthValue}
                    style={{
                      marginLeft: !isTopicPageAccessed
                        ? 0
                        : isMd
                        ? "0px"
                        : sideBarCollapsed
                        ? "250px"
                        : "250px",
                    }}
                    ref={scrollAreaRef}
                  >
                    <Box p={10} h={heightValue}>
                      {selected === ParentAppPage.HOME &&
                        selectedNotice &&
                        instituteWebsiteInfo?.name && (
                          <NoticePage
                            notice={selectedNotice!!}
                            onBack={() => {
                              Mixpanel.track(
                                ParentPageEvents.PARENTS_APP_NOTICE_PAGE_BACK_ICON_CLICKED
                              );
                              navigate(`/${mainPath}`);
                            }}
                          />
                        )}
                    </Box>
                  </ScrollArea>
                )}
                {userInfo != null && selected === ParentAppPage.BATCHES && (
                  <StudentBatchesSection
                    batches={userInfo.batches}
                    instituteId={userInfo.instituteId}
                  />
                )}
                {selected === ParentAppPage.COURSES &&
                  userInfo != null &&
                  instituteWebsiteInfo != null && (
                    <Courses
                      mainPath={mainPath}
                      myCourses={[
                        ...userInfo!!.myCourses,
                        ...userInfo!!.batchCourses,
                      ]}
                      studentId={userInfo!!._id}
                      teacherTestAnswers={userInfo!!.teacherTestAnswers}
                      onTestClick={(val, courseId, isChecked) => {
                        navigate(
                          `/${mainPath}/test/${val}?studentId=${
                            userInfo!!._id
                          }&&courseId=${courseId}&&viewResult=${isChecked}`
                        );
                      }}
                      studentData={{
                        studentId: userInfo!!._id!!,
                        studentName: userInfo!!.name,
                      }}
                      scrollAreaREf={scrollAreaRef}
                      setisTopicPageAccessed={setIsTopicPageAccessed}
                      isDrawerOpen={isDrawerOpen}
                      setisDrawerOpen={setIsDrawerOpen}
                      userInfo={userInfo!!}
                      setNavbar={setNavbar}
                      isTopicPageAccessed={isTopicPageAccessed}
                    />
                  )}
                {selected === ParentAppPage.TEST &&
                  userInfo &&
                  testId === null &&
                  userInfo.batches.length > 0 && (
                    <AllTest
                      studentData={{
                        classId: userInfo.batches[0]._id,
                        className: userInfo!!.batches[0].name,
                        studentName: userInfo!!.name,
                        studentId: userInfo!!._id,
                        teacherTestAnswers: userInfo!!.teacherTestAnswers,
                      }}
                      onTestClick={(
                        id: string,
                        subjectId: string,
                        studentId,
                        showResult
                      ) => {
                        navigate(
                          `/${mainPath}/test/${id}?subjectId=${subjectId}&&studentId=${studentId}&&viewResult=${showResult}`
                        );
                      }}
                      onStudentChange={(studntId) => {
                        navigate(`/${mainPath}/test?studentId=${studntId}`);
                      }}
                    />
                  )}
                {selected === ParentAppPage.SHOWPROFILE && userInfo && (
                  <StudentProfile
                    studentId={userInfo._id}
                    onBack={() => {
                      navigate(-1);
                    }}
                  />
                )}
                {selected === ParentAppPage.TEST &&
                  instituteWebsiteInfo?.name &&
                  testId !== null && (
                    <SingleTest
                      onBackClick={(studentId) => {
                        setTestId(null);
                        if (!courseId)
                          navigate(`/${mainPath}/test?studentId=${studentId}`);
                        else {
                          navigate(`/${mainPath}/courses/${courseId}`);
                        }
                      }}
                      testId={testId}
                      onOkaybuttonClick={(studentId) => {
                        setTestSumbission(true);
                        if (!courseId)
                          navigate(`/${mainPath}/test?studentId=${studentId}`);
                        else {
                          navigate(`/${mainPath}/courses/${courseId}`);
                        }
                      }}
                      isNav={updateNav1}
                    />
                  )}

                {selected === ParentAppPage.RESULT && (
                  <ShowResultToStudent userInfo={userInfo} />
                )}
              </Box>
            </Box>
          )}
        </AppShell>
      )}
      {userInfo !== undefined &&
        userInfo !== null &&
        instituteId &&
        isVideoCall && (
          <React.Suspense fallback={<></>}>
            <VideoCall
              studentId={userInfo?._id ?? ""}
              studentName={userInfo?.name ?? ""}
              onClose={() => {
                setisvideoCall(false);
                navigate(`/${mainPath}`);
              }}
            />
          </React.Suspense>
        )}
    </>
  );
}
