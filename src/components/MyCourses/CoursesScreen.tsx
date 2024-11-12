import {
  Box,
  Button,
  Center,
  Flex,
  Grid,
  Menu,
  SimpleGrid,
  Stack,
  Text,
  useMantineTheme,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { IconDotsVertical, IconPlus } from "@tabler/icons";
import { useEffect, useState } from "react";
import { Mixpanel } from "../../utilities/Mixpanel/MixpanelHelper";
import { WebAppEvents } from "../../utilities/Mixpanel/AnalyticeEventWebApp";

export function getExpiryStatus(expiryDate: Date | null) {
  if (expiryDate === null) return "Lifetime";
  const today = new Date();
  const expDate = new Date(expiryDate);

  const timeDifference = expDate.getTime() - today.getTime();
  const secondsInADay = 24 * 60 * 60 * 1000;
  const daysRemaining = Math.floor(timeDifference / secondsInADay);

  if (daysRemaining >= 365) {
    const years = Math.floor(daysRemaining / 365);
    return years === 1 ? `${years} year ` : `${years} years `;
  } else if (daysRemaining >= 30) {
    const months = Math.floor(daysRemaining / 30);
    return months === 1 ? `${months} month ` : `${months} months `;
  } else if (daysRemaining >= 1) {
    return daysRemaining === 1
      ? `${daysRemaining} day `
      : `${daysRemaining} days `;
  } else {
    return "Expired";
  }
}

interface SingleCourseCardProps {
  name: string;
  image: string;
  months: Date;
  price: number;
  onEditClick: () => void;
  onDeleteClick: () => void;
  onCourseClick: () => void;
  isFree: boolean;
}
export function SingleCourseCard(props: SingleCourseCardProps) {
  const theme = useMantineTheme();
  const isLg = useMediaQuery(`(max-width: ${theme.breakpoints.lg}px)`);
  const isMd = useMediaQuery(`(max-width: ${theme.breakpoints.md}px)`);
  const isXl = useMediaQuery(`(max-width: ${theme.breakpoints.xl}px)`);
  const lastDateString = getExpiryStatus(props.months);
  return (
    <Stack
      style={{
        border: "1px solid #E9E9E9",
        borderRadius: "20px",
        background: "#F7F7FF",
        cursor: "pointer",
      }}
      spacing={10}
      onClick={() => {
        props.onCourseClick();
      }}
    >
      <img
        src={props.image}
        height={isMd ? 150 : isLg ? 150 : 200}
        width="100%"
        style={{
          border: "1px solid #E9E9E9",
          borderRadius: "20px 20px 0px 0px",
        }}
      />
      <Stack px={10} py={5} spacing={8} mb={5}>
        <Flex justify="space-between">
          <Text fz={16} fw={500} ff="Nunito">
            {props.name}
          </Text>

          <Menu position="bottom">
            <Menu.Target
            >
              <Button
                variant="subtle"
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                <IconDotsVertical
                  style={{
                    cursor: "pointer",
                  }}
                  color="black"
                />
              </Button>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item
                onClick={(e) => {
                  e.stopPropagation();
                  props.onEditClick();
                }}
              >
                Edit
              </Menu.Item>
              <Menu.Item
                onClick={(e) => {
                  e.stopPropagation();
                  props.onDeleteClick();
                }}
              >
                Delete
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Flex>
        <Flex ml={-3}>
          <Text
            color="#00C1CD"
            px={10}
            py={8}
            style={{
              background: "#DCFDFF",
              borderRadius: "4px",
            }}
          >
            {lastDateString}
          </Text>
        </Flex>

        <Text color="#000" fz={20} fw={700}>
          {props.isFree ? "Free" : `Rs.${props.price}`}
        </Text>
      </Stack>
    </Stack>
  );
}

export function CoursesScreen(props: {
  onAddNewClicked: () => void;
  courses: Course[] | null;
  onEditCourseClick: (course: Course) => void;
  onDeleteCourseClick: (course: Course) => void;
  onCourseClick: (course: Course) => void;
}) {
  const theme = useMantineTheme();
  const isLg = useMediaQuery(`(max-width: ${theme.breakpoints.lg}px)`);
  const isXl = useMediaQuery(`(max-width: ${theme.breakpoints.xl}px)`);
  const isMd = useMediaQuery(`(max-width: ${theme.breakpoints.md}px)`);

  let courses1 = [...(props?.courses ?? [])];
  return (
    <>
      {props.courses && props.courses.length <= 0 && (
        <Center w="100%" h="calc(100vh - 250px)">
          <Stack justify="center" align="center">
            <Text ta="center" fz={24} fw={700} ff="Nunito">
              Create your first course
            </Text>
            <Text ta="center" fz={22} fw={400}>
              Try making a test video and <br></br>add it to a course.
            </Text>
            <Flex justify="center">
              <Button
                color="white"
                bg="#4B65F6"
                style={{
                  borderRadius: "24px",
                }}
                sx={{
                  "&:hover": {
                    backgroundColor: "#3C51C5",
                  },
                }}
                onClick={props.onAddNewClicked}
              >
                Add Course
              </Button>
            </Flex>
          </Stack>
        </Center>
      )}
      {props.courses && props.courses.length > 0 && (
        <Stack>
          {isMd && (
            <Stack
              style={{
                border: "1px solid #E9E9E9",
                borderRadius: "20px",
                background: "#F7F7FF",
              }}
              w="100%"
              py={40}
            >
              <Center w="100%" h="100%">
                <Stack align="center">
                  <img
                    src={require("../../assets/emptyCourse.png")}
                    height={72}
                    width={72}
                  />
                  <Button
                    leftIcon={<IconPlus />}
                    bg="#4B65F6"
                    radius={8}
                    onClick={props.onAddNewClicked}
                    size="sm"
                    sx={{
                      "&:hover": {
                        backgroundColor: "#3C51C5",
                      },
                    }}
                  >
                    Add New Course
                  </Button>
                </Stack>
              </Center>
            </Stack>
          )}
          <SimpleGrid
            cols={isMd ? 2 : isXl ? 4 : 4}
            // h="100%"
            spacing={isMd ? 20 : isLg ? 30 : 30}
          >
            {!isMd && (
              <Stack
                style={{
                  border: "1px solid #E9E9E9",
                  borderRadius: "20px",
                  background: "#F7F7FF",
                }}
              >
                <Center w="100%" h="100%">
                  <Stack align="center">
                    <img
                      src={require("../../assets/emptyCourse.png")}
                      height={72}
                      width={72}
                    />
                    <Button
                      leftIcon={<IconPlus />}
                      bg="#4B65F6"
                      radius={8}
                      onClick={props.onAddNewClicked}
                      sx={{
                        "&:hover": {
                          backgroundColor: "#3C51C5",
                        },
                      }}
                    >
                      Add New Course
                    </Button>
                  </Stack>
                </Center>
              </Stack>
            )}

            {courses1.reverse().map((x) => {
              return (
                <SingleCourseCard
                  name={x.name}
                  months={x.validTill}
                  price={x.price}
                  image={x.thumbnail}
                  isFree={x.isFree}
                  onEditClick={() => {
                    Mixpanel.track(WebAppEvents.COURSE_EDIT_BUTTON_CLICKED);
                    props.onEditCourseClick(x);
                  }}
                  onDeleteClick={() => {
                    Mixpanel.track(WebAppEvents.COURSE_DELETE_BUTTON_CLICKED);
                    props.onDeleteCourseClick(x);
                  }}
                  onCourseClick={() => {
                    Mixpanel.track(WebAppEvents.COURSE_VIEW_CLICKED);
                    props.onCourseClick(x);
                  }}
                />
              );
            })}
          </SimpleGrid>
        </Stack>
      )}
    </>
  );
}
