import {
  Button,
  Center,
  Flex,
  SimpleGrid,
  Stack,
  Text,
  useMantineTheme,
} from "@mantine/core";
import { IconPlus } from "@tabler/icons";
import { useState } from "react";
import { SingleCourseCard } from "./CoursesScreen";
import { useMediaQuery } from "@mantine/hooks";
import { Mixpanel } from "../../utilities/Mixpanel/MixpanelHelper";
import { WebAppEvents } from "../../utilities/Mixpanel/AnalyticeEventWebApp";

export function TestScreen(props: {
  onAddNewClicked: () => void;
  testSeries: Course[] | null;
  onEditClick: (course: Course) => void;
  onDeleteClick: (course: Course) => void;
  onCourseClick: (course: Course) => void;
}) {
  const theme = useMantineTheme();
  const isLg = useMediaQuery(`(max-width: ${theme.breakpoints.lg}px)`);
  const isMd = useMediaQuery(`(max-width: ${theme.breakpoints.md}px)`);
  const isXl = useMediaQuery(`(max-width: ${theme.breakpoints.xl}px)`);
  let test1 = [...(props?.testSeries ?? [])];

  return (
    <>
      {props.testSeries && props.testSeries.length <= 0 && (
        <Center w="100%" h="calc(100vh - 250px)">
          <Stack justify="center" align="center">
            <Text ta="center" fz={24} fw={700} ff="Nunito">
              Create your first Test Series
            </Text>
            <Text ta="center" fz={22} fw={400}>
              Try making a test series and<br></br> share it with your students.
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
                Add Test Series
              </Button>
            </Flex>
          </Stack>
        </Center>
      )}
      {props.testSeries && props.testSeries.length > 0 && (
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
                    src={require("../../assets/emptyTestSeries.png")}
                    height={72}
                    width={72}
                  />
                  <Button
                    leftIcon={<IconPlus />}
                    bg="#4B65F6"
                    radius={8}
                    onClick={props.onAddNewClicked}
                    size="sm"
                  >
                    New Test Series
                  </Button>
                </Stack>
              </Center>
            </Stack>
          )}
          <SimpleGrid
            cols={isMd ? 2 : isXl ? 4 : 4}
            spacing={isMd ? 20 : isLg ? 30 : 30}
            // h="100%"
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
                      src={require("../../assets/emptyTestSeries.png")}
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
                      New Test Series
                    </Button>
                  </Stack>
                </Center>
              </Stack>
            )}
            {test1.reverse().map((x) => {
              return (
                <SingleCourseCard
                  name={x.name}
                  months={x.validTill}
                  price={x.price}
                  image={x.thumbnail}
                  onEditClick={() => {
                    Mixpanel.track(
                      WebAppEvents.TEST_SERIES_EDIT_BUTTON_CLICKED
                    );
                    props.onEditClick(x);
                  }}
                  onDeleteClick={() => {
                    Mixpanel.track(
                      WebAppEvents.TEST_SERIES_DELETE_BUTTON_CLICKED
                    );
                    props.onDeleteClick(x);
                  }}
                  onCourseClick={() => {
                    Mixpanel.track(WebAppEvents.TEST_SERIES_VIEW_CLICKED);
                    props.onCourseClick(x);
                  }}
                  isFree={x.isFree}
                />
              );
            })}
          </SimpleGrid>
        </Stack>
      )}
    </>
  );
}
