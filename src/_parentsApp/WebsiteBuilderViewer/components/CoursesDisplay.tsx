import {
  Box,
  Button,
  Card,
  Center,
  Flex,
  Image,
  Stack,
  Text,
  useMantineTheme,
} from "@mantine/core";
import { InstituteTheme } from "../../../@types/User";
import { useMediaQuery } from "@mantine/hooks";
import { Carousel, Embla, useAnimationOffsetEffect } from "@mantine/carousel";
import { useRef, useState } from "react";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons";
import { getExpiryStatus } from "../../../components/MyCourses/CoursesScreen";
import { glimpseDescription } from "../../../utilities/HelperFunctions";
import Autoplay from "embla-carousel-autoplay";
export function CoursesDisplay(props: {
  theme: InstituteTheme;
  courses: Course[];
  onClick: (course: Course) => void;
}) {
  const theme = useMantineTheme();
  const autoplay = useRef(Autoplay({ delay: 2000 }));
  const isMd = useMediaQuery(`(max-width: ${theme.breakpoints.md}px)`);
  const isXl = useMediaQuery(`(max-width: ${theme.breakpoints.xl}px)`);

  const [embla, setEmbla] = useState<Embla | null>(null);
  const TRANSITION_DURATION = 200;
  useAnimationOffsetEffect(embla, TRANSITION_DURATION);
  return (
    <>
      {props.courses.length > 0 && (
        <>
          <Stack pb={20} bg={props.theme.backGroundColor} spacing={0}>
            <Text
              fw={600}
              ff="Catamaran"
              fz={30}
              align="center"
              c={"red"}
              mt={40}
            >
              Courses
            </Text>
            <Text fw={700} ff="Catamaran" fz={isMd ? 32 : 40} align="center">
              Go through our extensive
              <br />
              educational content
            </Text>
            <Center pb={20}>
              <Carousel
                // plugins={[autoplay.current]}
                getEmblaApi={setEmbla}
                // draggable={false}
                // speed={1}
                slideSize={isMd ? "60%" : "25%"}
                slideGap={25}
                loop
                align={
                  isMd
                    ? "center"
                    : props.courses.length < 2
                    ? "center"
                    : "start"
                }
                px={isMd ? 20 : 50}
                w={isMd ? "100%" : isXl ? "85%" : "75%"}
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
                    top: "110%",
                  },
                }}
              >
                {props.courses.map((course, i) => {
                  return (
                    <Carousel.Slide
                      onClick={() => {
                        props.onClick(course);
                      }}
                      style={{
                        cursor: "pointer",
                      }}
                    >
                      <Card radius={20} h={"100%"}>
                        <Card.Section>
                          <Image
                            src={course.thumbnail}
                            height={160}
                            alt="Norway"
                          />
                        </Card.Section>
                        <Stack mt={10} spacing={5}>
                          <Text fz={16} fw={500}>
                            {glimpseDescription(course.name, 25)}
                          </Text>
                          <Flex>
                            <Text
                              px={10}
                              bg={"#DCFDFF"}
                              c={"#00C1CD"}
                              style={{ borderRadius: 4 }}
                            >
                              {getExpiryStatus(course.validTill)}
                            </Text>
                          </Flex>
                          <Flex justify="space-between" align="center">
                            {course.isFree && (
                              <Text
                                // c={"#00C1CD"}
                                fz={20}
                                fw={700}
                              >
                                Free
                              </Text>
                            )}
                            {!course.isFree && (
                              <Text fz={20} fw={700}>
                                Rs.{course.price - course.discount}
                              </Text>
                            )}
                            <Button
                              sx={{
                                "&:hover": {
                                  backgroundColor: props.theme.primaryColor,
                                },
                              }}
                              bg={props.theme.primaryColor}
                            >
                              {course.isFree ? "Enroll Now" : "Buy Now"}
                            </Button>
                          </Flex>
                        </Stack>
                      </Card>
                    </Carousel.Slide>
                  );
                })}
              </Carousel>
            </Center>
          </Stack>
        </>
      )}
    </>
  );
}
