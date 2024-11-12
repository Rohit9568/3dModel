import {
  Button,
  Flex,
  LoadingOverlay,
  Modal,
  ScrollArea,
  Stack,
  Image,
  Text,
  useMantineTheme,
} from "@mantine/core";
import {
  IconArrowRight,
  IconChevronLeft,
  IconCurrencyRupee,
} from "@tabler/icons";
import { useEffect, useState } from "react";
import {
  AddCourseToStudent,
  GetStudentUserInfo,
} from "../../features/instituteStudentSlice";
import {
  GetValueFromLocalStorage,
  LocalStorageKey,
} from "../../../utilities/LocalstorageUtility";
import { Mixpanel } from "../../../utilities/Mixpanel/MixpanelHelper";
import ParentLoginPage2 from "../../Components/ParentLogin2";
import { useMediaQuery } from "@mantine/hooks";
import { GetCourseOrderData } from "../../features/paymentSlice";
import { displayRazorpay } from "../../../utilities/Payment";
import { createPaymentRecord } from "../../../features/payment/paymentRecordSlice";
import { CourseItems } from "../../Components/SingleCoursePage";
import { getCourseById } from "../../../features/course/courseSlice";
import { InstituteTheme } from "../../../@types/User";
import { WebAppEvents } from "../../../utilities/Mixpanel/AnalyticeEventWebApp";
import ModalWithImage from "../../../utilities/ModalWithImage";
import { CourseContentList } from "../../Components/CourseContentList";
import { useNavigate } from "react-router-dom";
// import { userInfo } from "os";

export function SingleCourseBuy(props: {
  onBackclick: () => void;
  selectedCourse: Course;
  institute: {
    _id: string;
    name: string;
    isOnlinePaymentEnabled: boolean;
    paymentDetailsImageUrl: string;
  };
  courses: Course[] | null;
  setUserInfo: (val: any) => void;
  onCoursesClick: () => void;
  userInfo: StudentInfo | null;
  theme: InstituteTheme;
  mainPath: string;
}) {
  const [isLoading, setisloading] = useState<boolean>(false);
  const [course, setCourse] = useState<Course | null>(null);
  const [showOfflinePaymentModal, setShowOfflinePaymentModal] =
    useState<boolean>(false);
  const navigate = useNavigate();

  function handleShowingOfOfflinePaymentModal(isOpen: boolean) {
    setShowOfflinePaymentModal(isOpen);
  }

  useEffect(() => {
    getCourseById(props.selectedCourse._id)
      .then((x: any) => {
        setCourse(x);
      })
      .catch((e) => {
        console.log(e);
      });
  }, [props.selectedCourse]);

  function addCourseToStudent(id: string, courseId: string) {
    AddCourseToStudent({
      studentId: id,
      courseId: courseId,
    })
      .then((x) => {
        console.log(x);
        setisloading(false);
        window.location.href = `/${props.mainPath}/courses`;
      })
      .catch((e) => {
        setisloading(false);
        console.log(e);
      });
  }

  function handleCourseSubmit(
    id: string,
    name: string,
    isOnlinePaymentEnabled: boolean,
    courses?: Course[]
  ) {
    if (courses?.find((x) => x._id === props.selectedCourse._id)) {
      props.onCoursesClick();
    } else {
      setisloading(true);
      if (!props.selectedCourse.isFree) {
        GetCourseOrderData(props.selectedCourse._id)
          .then((data: any) => {
            setisloading(false);
            if (isOnlinePaymentEnabled == null || isOnlinePaymentEnabled) {
              displayRazorpay(data.order, () => {
                Mixpanel.track(WebAppEvents.INSTITUTE_WEBSITE_COURSES_BOUGHT, {
                  courseName: props.selectedCourse.name,
                  instituteId: props.institute._id,
                  instituteName: props.institute.name,
                  studentName: name,
                });
                setisloading(true);
                createPaymentRecord({
                  studentId: id,
                  studentName: name,
                  instituteId: props.institute._id,
                  instititeName: props.institute.name,
                  amountPaid: data.order.amount / 100,
                  courseId: props.selectedCourse._id,
                  courseName: props.selectedCourse.name,
                })
                  .then((x) => {
                    addCourseToStudent(id, props.selectedCourse._id);
                  })
                  .catch((e) => {
                    setisloading(false);
                    console.log(e);
                  });
              });
            } else {
              setShowOfflinePaymentModal(true);
            }
          })
          .catch((e) => {
            setisloading(false);
            console.log(e);
          });
      } else {
        addCourseToStudent(id, props.selectedCourse._id);
      }
    }
  }

  function handleBuyNowClicked() {
    Mixpanel.track(WebAppEvents.INSTITUTE_WEBSITE_COURSES_BUY_NOW_CLICKED);
    const token: string | null = GetValueFromLocalStorage(
      LocalStorageKey.Token
    );
    if (token) {
      GetStudentUserInfo({
        instituteId: props.institute._id,
      })
        .then((x: any) => {
          if (x.length > 0) {
            handleCourseSubmit(
              x[0]._id,
              x[0].name,
              props.institute.isOnlinePaymentEnabled,
              x[0].myCourses
            );
          }
        })
        .catch((e) => {
          console.log(e);
        });
    } else {
      navigate(`/${props.institute.name}/${props.institute._id}/parent`);
    }
  }
  const theme = useMantineTheme();
  const isMd = useMediaQuery(`(max-width: ${theme.breakpoints.md}px)`);
  const [selectedItem, setSelectedItem] = useState<CourseItems>(
    CourseItems.LECTURES
  );
  useEffect(() => {
    if (course) {
      if (course.videos.length > 0) {
        setSelectedItem(CourseItems.LECTURES);
      } else if (course.files.length > 0) setSelectedItem(CourseItems.NOTES);
      else if (course.tests.length > 0) setSelectedItem(CourseItems.TESTSERIES);
    }
  }, [course]);
  const coursePrice = course
    ? course.price -
      course.discount +
      (props.institute.isOnlinePaymentEnabled == false
        ? 0
        : (5 / 100) * (course.price - course.discount))
    : 0;
  return (
    <>
      <LoadingOverlay visible={isLoading} />
      {course !== null && (
        <Stack
          spacing={0}
          style={{
            position: "relative",
          }}
          h={isMd && props.userInfo ? "calc(100dvh - 60px)" : "100dvh"}
        >
          <ScrollArea h="100dvh">
            <Flex
              style={{
                position: "fixed",
                top: 0,
                background: "#FFF",
                boxShadow: "0px 7px 14.4px -10px rgba(0, 0, 0, 0.40)",
                zIndex: 999,
              }}
              onClick={() => {
                props.onBackclick();
              }}
              w="100%"
              color="white"
              px={20}
              py={15}
            >
              <IconChevronLeft
                style={{
                  cursor: "pointer",
                }}
              />
              <Text
                pl={20}
                fz={18}
                style={{
                  cursor: "pointer",
                }}
              >
                Home
              </Text>
            </Flex>

            <Flex
              direction={isMd ? "column" : "row"}
              justify="flex-start"
              style={{
                marginTop: "60px",
              }}
            >
              <Flex
                direction={"column"}
                w={isMd ? "100%" : "50%"}
                h={isMd ? "100%" : "100vh"}
                style={{ borderRight: "2px solid #E9ECEF" }}
              >
                <Flex justify={"center"}>
                  <Flex w={isMd ? "100%" : "80%"}>
                    <Image src={course.thumbnail} fit="fill" />
                  </Flex>
                </Flex>

                <Stack spacing={5} px={10} py={10} mx={20}>
                  <Text fz={isMd ? 24 : 28} fw={500} color="Nunito">
                    {course.name}
                  </Text>
                  <Flex justify="space-between">
                    <Text
                      color="#A8A8A8"
                      fz={isMd ? 16 : 18}
                      fw={400}
                      style={{
                        transition: "1000 all ease-in-out",
                      }}
                      w="90%"
                    >
                      {course.description}
                    </Text>
                  </Flex>
                </Stack>
              </Flex>

              <Stack spacing={0} h={"100%"} w={isMd ? "100%" : "50%"}>
                <Text
                  color="#000000"
                  bg={"#F9F9F9"}
                  p={18}
                  mb={4}
                  fw={700}
                  fz={isMd ? 18 : 20}
                >
                  Course content
                </Text>
                <CourseContentList
                  course={course}
                  onViewVideoClicked={(courseVideo: CourseVideo) => {
                    handleBuyNowClicked();
                  }}
                  onViewNotesClicked={(courseFile: CourseFile) => {
                    handleBuyNowClicked();
                  }}
                  onViewOrTakeTestClicked={(testData: TestData) => {
                    handleBuyNowClicked();
                  }}
                  studentGivenTests={null}
                />
              </Stack>
            </Flex>

            <Flex
              style={{
                position: "absolute",
                bottom: 0,
                background: "white",
                zIndex: 999,
                borderTop: "2px solid #E9ECEF",
              }}
              py={5}
              justify="space-between"
              align="center"
              w="100%"
              px={25}
            >
              <Stack spacing={0}>
                {!course.isFree && (
                  <>
                    <Text>You Pay</Text>
                    <Flex direction={isMd ? "column" : "row"}>
                      <Flex>
                        <IconCurrencyRupee
                          style={{
                            marginTop: 10,
                          }}
                          size={isMd ? 25 : 30}
                        />
                        <Text color="#000" fz={isMd ? 30 : 37} fw={500}>
                          {Math.floor(coursePrice)}
                        </Text>
                      </Flex>
                      <Stack
                        justify={isMd ? "center" : "end "}
                        mb={isMd ? 0 : 12}
                      >
                        {props.institute.isOnlinePaymentEnabled && (
                          <Text fz={isMd ? 12 : 14} color="gray">
                            (5% platform fee)
                          </Text>
                        )}
                      </Stack>
                    </Flex>
                  </>
                )}
              </Stack>

              <Button
                size="lg"
                rightIcon={<IconArrowRight />}
                bg={props.theme.primaryColor}
                style={{
                  borderRadius: "8px",
                }}
                px={40}
                onClick={handleBuyNowClicked}
                sx={{
                  "&:hover": {
                    backgroundColor: props.theme.primaryColor,
                  },
                }}
              >
                {props.selectedCourse.isFree ? "Enroll Now" : "Buy Now"}
              </Button>
            </Flex>
          </ScrollArea>
        </Stack>
      )}

      <ModalWithImage
        imgUrl={props.institute.paymentDetailsImageUrl}
        paymentAmount={Math.floor(coursePrice) + ""}
        isOpen={showOfflinePaymentModal}
        handleModalClose={handleShowingOfOfflinePaymentModal}
      />
    </>
  );
}
