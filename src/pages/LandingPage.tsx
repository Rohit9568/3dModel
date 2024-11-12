import {
  AppShell,
  Box,
  Button,
  Header,
  LoadingOverlay,
  Navbar,
  ScrollArea,
  Stack,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { TeacherMainAppNavbar } from "../components/TeacherMainApp/TeacherMainAppNavbar";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { convertToHyphenSeparated } from "../utilities/HelperFunctions";
import {
  GetAllInfoForInstitute,
  GetCourseAccess,
  GetDashboardAccess,
  GetSimulationAccess,
  GetTestAccess,
} from "../_parentsApp/features/instituteSlice";
import { NewTeacherTest } from "./_New/NewTeacherTest";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store/ReduxStore";
import { mainPath } from "../store/mainPath.slice";
import { TeacherMainAppFooter } from "../components/TeacherMainApp/TeacherMainAppFooter";
import { MyCoursesPage } from "./_New/MyCoursesPage";
import { getChannelToken } from "../features/videoCall/videoCallSlice";
import { User1 } from "../@types/User";
import { CoursesEmptyPage } from "./_New/CoursesEmptyPage";
import {
  GetCourseFeatureOrderData,
  GetDashboardOrderData,
  GetSimulationOrderData,
  GetTestOrderData,
} from "../_parentsApp/features/paymentSlice";
import { displayRazorpay } from "../utilities/Payment";
import { showNotification } from "@mantine/notifications";
import useParentCommunication from "../hooks/useParentCommunication";
import useFeatureAccess from "../hooks/useFeatureAccess";
import { DashBoardStaff } from "../components/AdminPage/DashBoard/DashBoardStaff/DashBoardStaff";
import { Allsimulations } from "./AllSimulations/AllSimulations";
import { WebsiteBuilder } from "../components/WebsiteBuilder/WebsiteBuilder";
import TitleBar from "../_parentsApp/Components/TitleBar";
// import { AppShell, Box, Header, LoadingOverlay } from "@mantine/core";
const maiPathActions = mainPath.actions;

export enum MainPageTabs {
  DASHBOARD = "Dashboard",
  TEST = "Test",
  TAKECLASS = "Take Class",
  MYCOURSES = "My Courses",
  DOUBTS = "Doubts",
  RESULT = "Result",
  DIARY = "Diary",
  ALL_SIMULATIONS = "All Simulations",
  WEBSITE_BUILDER = "Website Builder",
}

function findEnumValue(value: string): MainPageTabs | undefined {
  for (const key in MainPageTabs) {
    if (
      MainPageTabs[key as keyof typeof MainPageTabs].toLowerCase().trim() ===
      value
    ) {
      return MainPageTabs[key as keyof typeof MainPageTabs];
    }
  }
  return undefined;
}

export function LandingPage() {
  const isMd = useMediaQuery(`(max-width: 820px)`);
  const params = useParams();
  const [selectedTab, setSelectedTab] = useState<MainPageTabs>(
    MainPageTabs.DASHBOARD
  );
  const instituteId = params.id;
  const navbarSelectedItem = params.navbarId;
  const { isReactNativeActive } = useParentCommunication();

  useEffect(() => {
    if (navbarSelectedItem) {
      const value1: any = findEnumValue(navbarSelectedItem);
      setSelectedTab(value1);
      if (value1 === "Dashboard") {
        loadInstituteInformation();
      }
    }
  }, [navbarSelectedItem]);

  const [instituteInfo, setInstituteInfo] =
    useState<InstituteWebsiteDisplay | null>(null);
  const [isLoading, setisLoading] = useState<boolean>(false);
  const mainPath1 = useSelector<RootState, string | null>((state) => {
    return state.mainPathSlice.value;
  });
  const dispatch = useDispatch<AppDispatch>();
  function loadInstituteInformation() {
    if (instituteId) {
      setisLoading(true);
      GetAllInfoForInstitute({ id: instituteId })
        .then((x: any) => {
          setisLoading(false);
          setInstituteInfo(x);
          const mainPath = `/${x.name}/${instituteId}/teach1`;
          dispatch(maiPathActions.setMainPathValue(mainPath));
        })
        .catch((e) => {
          setisLoading(false);
          console.log(e);
        });
    }
  }
  useEffect(() => {
    loadInstituteInformation();
  }, [instituteId]);

  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const user1 = useSelector<RootState, User1 | null>((state) => {
    return state.currentUser.user;
  });

  function courseUpgradehandler() {
    if (instituteId) {
      setisLoading(true);
      GetCourseFeatureOrderData()
        .then((data: any) => {
          setisLoading(false);
          displayRazorpay(data.order, () => {
            setisLoading(true);
            GetCourseAccess({ id: instituteId })
              .then(() => {
                showNotification({ message: "success" });
                loadInstituteInformation();
                setisLoading(false);
              })
              .catch((e) => {
                showNotification({
                  message: "Error Occured.Contact Customer Care",
                  color: "red",
                });
                setisLoading(false);
                console.log(e);
              });
          });
        })
        .catch((e) => {
          console.log(e);
          setisLoading(false);
        });
    }
  }
  function testUpgradehandler() {
    if (instituteId) {
      setisLoading(true);
      GetTestOrderData()
        .then((data: any) => {
          setisLoading(false);
          displayRazorpay(data.order, () => {
            setisLoading(true);
            GetTestAccess({ id: instituteId })
              .then(() => {
                showNotification({ message: "success" });
                loadInstituteInformation();
                setisLoading(false);
              })
              .catch((e) => {
                showNotification({
                  message: "Error Occured.Contact Customer Care",
                  color: "red",
                });
                setisLoading(false);
                console.log(e);
              });
          });
        })
        .catch((e) => {
          console.log(e);
          setisLoading(false);
        });
    }
  }
  function simulationUpgrade() {
    if (instituteId) {
      setisLoading(true);
      GetSimulationOrderData()
        .then((data: any) => {
          setisLoading(false);
          displayRazorpay(data.order, () => {
            setisLoading(true);
            GetSimulationAccess({ id: instituteId })
              .then(() => {
                showNotification({ message: "success" });
                loadInstituteInformation();
                setisLoading(false);
              })
              .catch((e) => {
                showNotification({
                  message: "Error Occured.Contact Customer Care",
                  color: "red",
                });
                setisLoading(false);
                console.log(e);
              });
          });
        })
        .catch((e) => {
          console.log(e);
          setisLoading(false);
        });
    }
  }
  function dashboardUpgradehandler() {
    if (instituteId) {
      setisLoading(true);
      GetDashboardOrderData()
        .then((data: any) => {
          setisLoading(false);
          displayRazorpay(data.order, () => {
            setisLoading(true);
            GetDashboardAccess({ id: instituteId })
              .then(() => {
                showNotification({ message: "success" });
                loadInstituteInformation();
                setisLoading(false);
              })
              .catch((e) => {
                showNotification({
                  message: "Error Occured.Contact Customer Care",
                  color: "red",
                });
                setisLoading(false);
                console.log(e);
              });
          });
        })
        .catch((e) => {
          console.log(e);
          setisLoading(false);
        });
    }
  }

  useEffect(() => {
    if (navbarSelectedItem === MainPageTabs.TAKECLASS.toLowerCase().trim())
      document.body.style.overflow = "hidden";
    else document.body.style.overflow = "visible";
    return () => {
      document.body.style.overflow = "visible";
    };
  }, [navbarSelectedItem]);

  const navigate = useNavigate();
  const {
    isFeatureValid,
    UserFeature,
    isFeatureValidwithNotification,
    shownotification,
  } = useFeatureAccess();

  function teacherLogout() {
    if (isReactNativeActive() && instituteInfo) {
      navigate(`/${instituteInfo.name}/${instituteInfo._id}/parent`);
    } else {
      navigate("/");
    }
  }
  if (instituteInfo && instituteId && mainPath1)
    return (
      <AppShell
        styles={{
          main: {
            width: "75vw",
          },
        }}
        navbar={
          isMd ? (
            <></>
          ) : (
            <TeacherMainAppNavbar
              selectedTab={selectedTab}
              instituteId={instituteId}
              instituteName={convertToHyphenSeparated(
                instituteInfo?.name ?? ""
              )}
              mainPath={mainPath1}
              schoolIcon={instituteInfo?.schoolIcon}
              schoolName={instituteInfo.name}
              isCollapsed={isCollapsed}
              setIsCollapsed={setIsCollapsed}
              isSchool={instituteInfo.isSchool}
              userRole={user1?.role ?? ""}
            />
          )
        }
        header={
          <>
            {isMd && instituteInfo != null && (
              <Header height={60}>
                <TitleBar
                  schoolName={instituteInfo?.name}
                  schoolIcon={instituteInfo?.schoolIcon}
                  isTeacher={false}
                  isParent={true}
                  instituteId={instituteId}
                  name={user1?.name}
                  onLogout={() => {
                    navigate("/");
                  }}
                  mainPath={""}
                  showDoubts={false}
                  profilePic=""
                />
              </Header>
            )}
          </>
        }
        footer={
          isMd ? (
            <TeacherMainAppFooter
              selectedTab={selectedTab}
              instituteId={instituteId}
              instituteName={convertToHyphenSeparated(instituteInfo?.name)}
              mainPath={mainPath1}
              isSchool={instituteInfo.isSchool}
              userRole={user1?.role ?? ""}
            />
          ) : (
            <></>
          )
        }
        padding={0}
      >
        <LoadingOverlay visible={isLoading} />
        <Box
          ml={isMd ? 0 : isCollapsed ? 75 : 250}
          w={isMd ? "100%" : `calc(100% - ${isCollapsed ? "75px" : "250px"})`}
          h={"100%"}
          style={{
            position: "relative",
            transition: "margin ease-in-out 250ms",
          }}
        >
          <Box id="your-scroll-area-id" w={"100%"} h={"100%"}>
            {navbarSelectedItem ===
              MainPageTabs.DASHBOARD.toLowerCase().trim() && (
              <>
                {instituteInfo.featureAccess.dashboardFeature === true && (
                  <DashBoardStaff instituteId={instituteInfo._id} />
                )}
                {instituteInfo.featureAccess.dashboardFeature === false && (
                  <CoursesEmptyPage
                    instituteId={instituteInfo._id}
                    heading={"Manage, Collect, and Showcase with Ease"}
                    subheading={
                      "Experience Seamless Management and Empower Your Institution's Growth"
                    }
                    img={require("../assets/upgradedashboard.png")}
                    onClick={() => {
                      dashboardUpgradehandler();
                    }}
                    onLogout={teacherLogout}
                  />
                )}
              </>
            )}
            {navbarSelectedItem ===
              MainPageTabs.ALL_SIMULATIONS.toLowerCase().trim() && (
              <>
                {instituteInfo.featureAccess.simualtionAccess &&
                  isFeatureValid(UserFeature.SIMULATIONS) === true && (
                    <Allsimulations />
                  )}
                {(instituteInfo.featureAccess.simualtionAccess === false ||
                  isFeatureValid(UserFeature.SIMULATIONS) === false) && (
                  <CoursesEmptyPage
                    instituteId={instituteInfo._id}
                    heading={
                      "Enhance Your Teaching Through Interactive Simulations"
                    }
                    subheading={
                      "Create, Share, and Explore Personalized Simulations Online and Offline. Upgrade to Premium for Advanced Features and Detailed Insights."
                    }
                    img={require("../assets/simulationPremium.png")}
                    onClick={() => {
                      if (
                        instituteInfo.featureAccess.simualtionAccess === false
                      ) {
                        simulationUpgrade();
                      } else {
                        shownotification();
                      }
                    }}
                    onLogout={teacherLogout}
                  />
                )}
              </>
            )}
            {navbarSelectedItem ===
              MainPageTabs.WEBSITE_BUILDER.toLowerCase().trim() && (
              <WebsiteBuilder
                setSelectedSection={(val) => {}}
                setIsLoading={setisLoading}
                instituteDetails={instituteInfo}
                reloadInstituteData={() => {
                  loadInstituteInformation();
                }}
                setSelectedNotice={() => {}}
              />
            )}

            {navbarSelectedItem === MainPageTabs.TEST.toLowerCase().trim() && (
              <>
                {instituteInfo.featureAccess.testFeatureService &&
                  isFeatureValid(UserFeature.TESTINGPLATFORM) === true && (
                    <NewTeacherTest onlogout={teacherLogout} />
                  )}
                {(instituteInfo.featureAccess.testFeatureService === false ||
                  isFeatureValid(UserFeature.TESTINGPLATFORM) === false) && (
                  <CoursesEmptyPage
                    instituteId={instituteInfo._id}
                    heading={"Empower Your Testing Experience"}
                    subheading={
                      "Create, Share, and Analyze Personalized Tests Online and Offline. Upgrade to Premium for Enhanced Features and Comprehensive Reports."
                    }
                    img={require("../assets/upgradeTest.png")}
                    onClick={() => {
                      if (
                        instituteInfo.featureAccess.testFeatureService === false
                      ) {
                        testUpgradehandler();
                      } else {
                        shownotification();
                      }
                    }}
                    onLogout={teacherLogout}
                  />
                )}
              </>
            )}
            {navbarSelectedItem ===
              MainPageTabs.MYCOURSES.toLowerCase().trim() && (
              <>
                {instituteInfo.featureAccess.course === true &&
                  isFeatureValid(UserFeature.ONLINECOURSES) === true && (
                    <MyCoursesPage onLogout={teacherLogout} />
                  )}
                {(instituteInfo.featureAccess.course === false ||
                  isFeatureValid(UserFeature.ONLINECOURSES) === false) && (
                  <CoursesEmptyPage
                    instituteId={instituteInfo._id}
                    heading={
                      "Empowering Users: Introducing Course Creation Functionality"
                    }
                    subheading={"Create and share your own customized courses"}
                    img={require("../assets/emptycoursePage.png")}
                    onClick={() => {
                      if (instituteInfo.featureAccess.course === false) {
                        courseUpgradehandler();
                      } else {
                        shownotification();
                      }
                    }}
                    onLogout={teacherLogout}
                  />
                )}
              </>
            )}
          </Box>
        </Box>
      </AppShell>
    );
  else return <></>;
}
