import { Carousel, Embla, useAnimationOffsetEffect } from "@mantine/carousel";
import {
  Box,
  Button,
  Card,
  Center,
  Divider,
  Flex,
  Grid,
  SimpleGrid,
  Stack,
  Text,
  useMantineTheme,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons";
import { useEffect, useState } from "react";
import { getExpiryStatus } from "../../components/MyCourses/CoursesScreen";
import { glimpseDescription } from "../../utilities/HelperFunctions";
import { SchoolBanner } from "./utils/SchoolBanner";
import { SchoolBanner2 } from "./utils/SchoolBanner2";
import { NoticesDisplay } from "../WebsiteBuilderViewer/components/NoticesDisplay";
import { InstituteTheme } from "../../@types/User";
import { WebAppEvents } from "../../utilities/Mixpanel/AnalyticeEventWebApp";
import { Mixpanel } from "../../utilities/Mixpanel/MixpanelHelper";
import { ViewAllCourses } from "./ViewAllCourses";
import ScheduleDaysBatch from "../Components/ScheduleDaysBatch";

export function SingleCourseCard(props: { course: Course }) {
  return (
    <Card
      radius={20}
      h={"100%"}
      style={{
        boxShadow: "0px 6px 8px 0px #00000026",
      }}
    >
      <Card.Section
        style={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        <img src={props.course.thumbnail} height={160} alt="Norway" />
      </Card.Section>
      <Stack mt={10} spacing={5}>
        <Text fz={16} fw={500}>
          {glimpseDescription(props.course.name, 25)}
        </Text>
        <Flex>
          <Text
            px={10}
            bg={"#DCFDFF"}
            c={"#00C1CD"}
            style={{ borderRadius: 4 }}
          >
            {getExpiryStatus(props.course.validTill)}
          </Text>
        </Flex>
        <Flex justify="space-between" align="center">
          {props.course.isFree && (
            <Text
              fz={20}
              fw={700}
            >
              Free
            </Text>
          )}
          {!props.course.isFree && (
            <Text fz={20} fw={700}>
              Rs.{props.course.price - props.course.discount}
            </Text>
          )}
        </Flex>
        <Button
          sx={{
            "&:hover": {
              backgroundColor: "#4B65F6",
            },
          }}
          bg={"#4B65F6"}
        >
          {props.course.isFree ? "Enroll Now" : "Buy Now"}
        </Button>
      </Stack>
    </Card>
  );
}
export function MobileHomePage(props: {
  courses: Course[] | null;
  onClick: (course: Course) => void;
  courses1: Course[];
  instituteDetails: InstituteWebsiteDisplay;
  loggedIn: boolean;
  parentName: string | null;
  mainPath: string;
  batches: string[];
  studentData: {
    studentId: string;
    teacherTestAnswers: {
      testId: string;
      answerSheetId: {
        isChecked: boolean | null;
        _id: string;
      };
    }[];
  };
}) {
  const theme = useMantineTheme();

  const [embla, setEmbla] = useState<Embla | null>(null);
  const isMd = useMediaQuery(`(max-width: ${theme.breakpoints.md}px)`);
  const isXl = useMediaQuery(`(max-width: ${theme.breakpoints.xl}px)`);
  const TRANSITION_DURATION = 200;
  useAnimationOffsetEffect(embla, TRANSITION_DURATION);
  const customTheme: InstituteTheme = props.instituteDetails.theme;
  const [viewAllCourses, setViewAllCourses] = useState<boolean>(false);
  const [showCarousel, setShowCarousel] = useState<boolean>(false);
  useEffect(() => {
    setShowCarousel(true);
  }, [props.instituteDetails]);

  return (
    <Stack h={"100vh"} w={"100%"}>
      {!viewAllCourses && (
        <Stack bg={"#F5F5F5"}>
          {showCarousel && (
            <Carousel
              getEmblaApi={setEmbla}
              slideSize={"100%"}
              loop
              align={"center"}
              w={"100%"}
              mb={20}
              withIndicators
              nextControlIcon={
                <Box
                  w={"60%"}
                  h={"100%"}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: "4px",
                  }}
                >
                  <IconChevronRight size={60} stroke={1} color="white" />
                </Box>
              }
              previousControlIcon={
                <Box
                  w={"60%"}
                  h={"100%"}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: "4px",
                  }}
                >
                  <IconChevronLeft size={60} stroke={1} color="white" />
                </Box>
              }
              styles={{
                controls: {
                  top: 0,
                  height: "100%",
                  padding: "0px",
                  margin: "0px",
                },
                control: {
                  background: "transparent",
                  border: "none",
                  boxShadow: "none",
                  height: "200px",
                  "&[data-inactive]": {
                    opacity: 0,
                    cursor: "default",
                  },
                },
                indicator: {
                  width: 8,
                  height: 8,
                  backgroundColor: "red",
                },
                indicators: {
                  top: "105%",
                },
              }}
            >
              <Carousel.Slide>
                <SchoolBanner instituteDetails={props.instituteDetails} />
              </Carousel.Slide>
            </Carousel>
          )}
          <Divider color="#F4F4F4" size="md" />

          <SimpleGrid w={"100%"} cols={isMd ? 1 : 2}>
            <NoticesDisplay
              theme={customTheme}
              notices={props.instituteDetails.notices}
              instituteName={props.instituteDetails.name}
              instituteId={props.instituteDetails._id}
              loggedIn={props.loggedIn}
              mainPath={props.mainPath}
            />
            <Stack px={32} py={18} bg={"white"}>
              <Flex align="center" justify="space-between">
                <Text fz={20} fw={700}>
                  Online courses
                </Text>
                {props.courses1.length !== 0 && (
                  <Text
                    style={{
                      color: "#4B65F6",
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      setViewAllCourses(true);
                    }}
                  >
                    View All
                  </Text>
                )}
              </Flex>
              <Carousel
                getEmblaApi={setEmbla}
                slideSize={isMd ? "80%" : "25%"}
                slideGap={25}
                loop
                align={
                  isMd
                    ? "center"
                    : props.courses1.length < 2
                    ? "center"
                    : "start"
                }
                w={"100%"}
                my={20}
                withIndicators
                nextControlIcon={
                  <Box
                    w={"60%"}
                    h={"100%"}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      borderRadius: "4px",
                    }}
                  >
                    <IconChevronRight size={60} stroke={1} color="#747474" />
                  </Box>
                }
                previousControlIcon={
                  <Box
                    w={"60%"}
                    h={"100%"}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      borderRadius: "4px",
                    }}
                  >
                    <IconChevronLeft size={60} stroke={1} color="#747474" />
                  </Box>
                }
                styles={{
                  controls: {
                    top: 0,
                    height: "100%",
                    padding: "0px",
                    margin: "0px",
                  },
                  control: {
                    background: "transparent",
                    border: "none",
                    boxShadow: "none",
                    height: "200px",
                    "&[data-inactive]": {
                      opacity: 0,
                      cursor: "default",
                    },
                  },
                  indicator: {
                    width: 8,
                    height: 8,
                    backgroundColor: "red",
                  },
                  indicators: {
                    top: "100%",
                  },
                }}
              >
                {props.courses1.length === 0 && (
                  <Center h="30vh" w="100%">
                    <Stack justify="center" align="center">
                      <img
                        src={require("../../assets/emptyCourses2.png")}
                        style={{
                          width: "100px",
                        }}
                      />
                      <Text>No courses available</Text>
                    </Stack>
                  </Center>
                )}
                {props.courses1.map((course, i) => {
                  return (
                    <Carousel.Slide
                      onClick={() => {
                        props.onClick(course);
                      }}
                      style={{
                        cursor: "pointer",
                        width: "80vw",
                      }}
                      py={10}
                    >
                      <SingleCourseCard course={course} />
                    </Carousel.Slide>
                  );
                })}
              </Carousel>
            </Stack>
          </SimpleGrid>

          <Stack mt={20} px={20} py={18} bg={"white"}>
            <ScheduleDaysBatch
              batches={props.batches}
              studentData={props.studentData}
              mainPath={props.mainPath}
            />
          </Stack>
          <Flex gap={20} px={36} mb={40} mt={20} py={28} bg={"white"}>
            <img
              src={require("../../assets/instagrampic.png")}
              alt="instagram"
              style={{
                width: "70px",
                cursor: "pointer",
              }}
              onClick={() => {
                window.open(props.instituteDetails.instagramLink, "_blank");
                Mixpanel.track(
                  WebAppEvents.INSTITUTE_WEBSITE_FOOTER_ITEM_CLICKED,
                  {
                    value: "instagram",
                  }
                );
              }}
            />
            <img
              src={require("../../assets/youtubepic.png")}
              alt="youtube"
              style={{
                width: "70px",
                cursor: "pointer",
              }}
              onClick={() => {
                window.open(props.instituteDetails.youtubeLink, "_blank");
                Mixpanel.track(
                  WebAppEvents.INSTITUTE_WEBSITE_FOOTER_ITEM_CLICKED,
                  {
                    value: "youtube",
                  }
                );
              }}
            />
            <img
              src={require("../../assets/facebookpic.png")}
              alt="facebook"
              style={{
                width: "70px",
                cursor: "pointer",
              }}
              onClick={() => {
                Mixpanel.track(
                  WebAppEvents.INSTITUTE_WEBSITE_FOOTER_ITEM_CLICKED,
                  {
                    value: "facebook",
                  }
                );
                window.open(props.instituteDetails.facebookLink, "_blank");
              }}
            />
          </Flex>
        </Stack>
      )}
      {viewAllCourses && (
        <ViewAllCourses
          courses={props.courses1}
          onCourseClick={(courseId) => {
            props.onClick(courseId);
          }}
          onBackClick={() => {
            setViewAllCourses(false);
          }}
        />
      )}
    </Stack>
  );
}
