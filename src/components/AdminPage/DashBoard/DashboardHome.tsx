import {
  Box,
  Button,
  Card,
  Center,
  Flex,
  Group,
  Image,
  Modal,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
  useMantineTheme,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { GetUser } from "../../../utilities/LocalstorageUtility";
import {
  IconArrowRight,
  IconBrandFacebook,
  IconBrandWhatsapp,
  IconChevronLeft,
  IconChevronRight,
  IconMail,
  IconMessage2,
  IconPlus,
  IconShare,
} from "@tabler/icons";
import { DashBoardSection } from "./DashBoard";
import {
  DashBoardCardsCarousel,
  DashboardCards,
  DashboardStaffCard,
} from "./DashBoardCards";
import { useEffect, useState } from "react";


import { TopBarTeacher } from "../../NavbarTeacher/TopBarTeacher";
import { LoginUsers } from "../../Authentication/Login/Login";
import { showNotification } from "@mantine/notifications";
import useFeatureAccess from "../../../hooks/useFeatureAccess";

function ClassIcon(props: { col: string; classNumber: string }) {
  return (
    <Box w={56} h={56} miw={56} pos={"relative"}>
      <Box
        pos={"absolute"}
        top={0}
        w={"100%"}
        h={"100%"}
        bg={props.col}
        opacity={0.1}
        style={{ borderRadius: "50%" }}
      ></Box>
      <Center h={"100%"}>
        <Stack
          spacing={0}
          align="center"
          justify="center"
          style={{ lineHeight: 0 }}
        >
          <Text fw={400} fz={22} p={0}>
            {props.classNumber}
          </Text>
          <Text fw={400} fz={10} style={{ lineHeight: 0 }} pb={10}>
            class
          </Text>
        </Stack>
      </Center>
      <Box
        pos={"absolute"}
        bottom={-7}
        w={14}
        h={14}
        left={"calc(50% - 7px)"}
        bg={props.col}
        style={{ borderRadius: "50%" }}
      ></Box>
    </Box>
  );
}

function extractValueFromClassName(
  inputString: string
): number | string | null {
  const match = inputString.match(/\bClass\s*(\d{1,2})/i);

  if (match) {
    return parseInt(match[1], 10);
  }

  for (let i = 0; i < inputString.length; i++) {
    let char = inputString[i];
    if (!isNaN(parseInt(char, 10))) {
      return parseInt(char, 10);
    } else if (char.match(/[a-zA-Z]/)) {
      return char.toUpperCase();
    }
  }

  return null; // Return null if no digit or alphabet is found
}
function getLastUpdatedText(updatedDate: string) {
  var currentDate = new Date();
  var timeDifference = currentDate.getTime() - new Date(updatedDate).getTime();
  var secondsDifference = timeDifference / 1000;
  if (secondsDifference < 60 * 60) {
    var minutesDifference = Math.floor(secondsDifference / 60);
    return `updated ${minutesDifference} min. ago`;
  } else if (secondsDifference < 24 * 60 * 60) {
    var hoursDifference = Math.floor(secondsDifference / (60 * 60));
    return `updated ${hoursDifference} hours ago`;
  } else {
    var daysDifference = Math.floor(secondsDifference / (24 * 60 * 60));
    return `updated ${daysDifference} days ago`;
  }
}
function getNotificationTextFromDailyNotification(
  noti: InstituteNotifications
) {
  switch (noti.type) {
    case "TEST":
      return "Test created successfully.";
      break;
    case "STUDENTADDED":
      return "Student Added successfully.";
      break;
    case "NOTES":
      return "Notes uploaded successfully.";
      break;
    case "WORKSHEET":
      return "Worksheet uploaded successfully.";
      break;
    case "LESSONPLAN":
      return "Lesson Plan uploaded successfully";
      break;
  }
}
function isDateWithinLast7Days(inputDate: string) {
  var currentDate = new Date();

  var sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(currentDate.getDate() - 7);

  var inputDateTime = new Date(inputDate);
  return inputDateTime >= sevenDaysAgo;
}
export function DashBoardHome(props: {
  instituteDetails: InstituteWebsiteDisplay;
  setSelectedSection: (val: DashBoardSection) => void;
  dashboardCounts: {
    teachers: number;
    students: number;
    sharedTests: number;
    notesUploaded: number;
    monthRevenue: number;
    lastMonthTrends: number;
  };
  classes: InstituteClass[];
  setOpenedAddDiary: (val: boolean) => void;
  setOpenedAddStudent: (val: boolean) => void;
  setdiaryNotificationClassId: (val: string | null) => void;
  mainPath: string;
  userRole: string | undefined;
  setIsShareLink: (val: boolean) => void;
  featureAccess: AppFeaturesAccess;
  onLogout: () => void;
}) {
  const theme = useMantineTheme();
  const isMd = useMediaQuery(`(max-width: ${theme.breakpoints.md}px)`);

  const [homeWorkNotification, setHomeWorkNotification] = useState<
    InstituteNotifications[]
  >([]);
  const [dailyNotification, setDailyNotification] = useState<
    InstituteNotifications[]
  >([]);
  const [notesUploadedinLastWeek, setNotesUploadedInLastWeek] =
    useState<number>(0);
  const [testsSharedinLastWeek, setTestsSharedInLastWeek] = useState<number>(0);
  useEffect(() => {
    const filteredNotification = props.instituteDetails.notifications.filter(
      (x) => {
        if (x.type === "CLASSWORK" || x.type === "HOMEWORK") {
          return x;
        }
      }
    );
    const filteredDailyNotifications =
      props.instituteDetails.notifications.filter((x) => {
        if (
          x.type === "TEST" ||
          x.type === "STUDENTADDED" ||
          x.type === "NOTES" ||
          x.type === "WORKSHEET" ||
          x.type === "LESSONPLAN"
        ) {
          return x;
        }
      });

    setDailyNotification(filteredDailyNotifications);
    setHomeWorkNotification(filteredNotification);
    let tempnotes = 0;
    let temptests = 0;
    props.instituteDetails.notifications.map((x) => {
      if (x.type === "NOTES") {
        if (isDateWithinLast7Days(x.createdAt)) {
          tempnotes++;
        }
      } else if (x.type === "TESTSHARED") {
        if (isDateWithinLast7Days(x.createdAt)) {
          temptests++;
        }
      }
    });
    setNotesUploadedInLastWeek(tempnotes);
    setTestsSharedInLastWeek(temptests);
  }, [props.instituteDetails]);

  function showAuthMessage() {
    showNotification({
      message: "Only admins have access to this feature.",
      color: "red",
    });
  }

  const { isFeatureValidwithNotification, UserFeature } = useFeatureAccess();
  return (
    <>
      {isMd && (
        <Box h={70}>
          <TopBarTeacher
            disableSearch={true}
            onLogout={props.onLogout}
          ></TopBarTeacher>
        </Box>
      )}
      <Box w={"100%"} bg={"#f7f7ff"} pb={60} mih={"100vh"} pt={isMd ? 10 : 30}>
        <Center>
          <Stack maw={"1000px"} w={isMd ? "90%" : "90%"} spacing={25}>
            <Flex direction={"column"}>
              <Text fz={isMd ? 32 : 28} fw={700}>
                Dashboard
              </Text>
              <Text fz={14} fw={400}>
                Hi {GetUser().name}. Welcome to {props.instituteDetails.name}{" "}
                DashBoard
              </Text>
            </Flex>
            <Flex
              direction={isMd ? "column" : "row"}
              justify={"space-between"}
              mah={isMd ? "100%" : 275}
            >
              <Box w={isMd ? "100%" : "50%"}>
                {isMd ? (
                  <>
                    <Box mx={"-5%"}>
                      <DashBoardCardsCarousel
                        dashboardCounts={props.dashboardCounts}
                        setSelectedSection={props.setSelectedSection}
                        setOpenedAddStudent={props.setOpenedAddStudent}
                        notesUploadedinLastWeek={notesUploadedinLastWeek}
                        testsSharedinLastWeek={testsSharedinLastWeek}
                        mainPath={props.mainPath}
                        userRole={props.userRole}
                        onAuthClick={() => {
                          showAuthMessage();
                        }}
                        featureAccess={props.featureAccess}
                      />
                    </Box>
                  </>
                ) : (
                  <>
                    <SimpleGrid
                      cols={1}
                      w={"100%"}
                      spacing={20}
                      verticalSpacing={20}
                    >
                      <DashboardStaffCard
                        dashboardCounts={props.dashboardCounts}
                        setSelectedSection={props.setSelectedSection}
                      />
                    </SimpleGrid>
                    <Box py={20}>
                      <SimpleGrid
                        cols={2}
                        w={"100%"}
                        h={"100%"}
                        spacing={20}
                        verticalSpacing={20}
                      >
                        <DashboardCards
                          dashboardCounts={props.dashboardCounts}
                          setSelectedSection={props.setSelectedSection}
                          setOpenedAddStudent={props.setOpenedAddStudent}
                          notesUploadedinLastWeek={notesUploadedinLastWeek}
                          testsSharedinLastWeek={testsSharedinLastWeek}
                          mainPath={props.mainPath}
                          userRole={props.userRole}
                          onAuthClick={() => {
                            showAuthMessage();
                          }}
                          featureAccess={props.featureAccess}
                        />
                      </SimpleGrid>
                    </Box>
                  </>
                )}
              </Box>
              <Flex
                w={isMd ? "100%" : "48%"}
                bg={"white"}
                mah={isMd ? "100%" : 275}
                p={30}
                style={{
                  borderRadius: 10,
                  boxShadow: "0px 0px 30px 0px rgba(0, 0, 0, 0.10)",
                }}
                justify={"space-between"}
                direction={isMd ? "column" : "row"}
              >
                <Stack
                  w={isMd ? "100%" : "50%"}
                  miw={"58%"}
                  justify="space-between"
                  style={{ order: isMd ? 1 : 0 }}
                  spacing={isMd ? 20 : 0}
                >
                  <Text
                    fz={isMd ? 18 : 22}
                    fw={700}
                    align={isMd ? "center" : "left"}
                  >
                    Outshine your competition with your own Website!
                  </Text>
                  <Text fz={14} fw={400} align={isMd ? "center" : "left"}>
                    Create your own customized website in few clicks.
                  </Text>
                  <Group position={isMd ? "center" : "left"}>
                    <Button
                      sx={{
                        backgroundColor: "#4B65F6",
                        "&:hover": {
                          backgroundColor: "#3C51C5",
                        },
                      }}
                      onClick={() => {
                        // if (
                        //   props.userRole === LoginUsers.ADMIN ||
                        //   props.userRole == LoginUsers.TEACHERADMIN
                        // ) {
                        //   props.setSelectedSection(DashBoardSection.BUILDER);
                        // } else {
                        //   showAuthMessage();
                        // }
                        if (
                          isFeatureValidwithNotification(
                            UserFeature.WEBSITEBUILDER
                          )
                        ) {
                          props.setSelectedSection(DashBoardSection.BUILDER);
                        }
                      }}
                    >
                      Ok! Take me there
                    </Button>
                    <IconShare
                      fill="black"
                      onClick={() => {
                        if (props.userRole !== LoginUsers.ADMINISTRATOR) {
                          props.setIsShareLink(true);
                        } else {
                          showAuthMessage();
                        }
                      }}
                      style={{ cursor: "pointer" }}
                    />
                  </Group>
                </Stack>
                <Center
                  w={isMd ? "100%" : "47%"}
                  h={"100%"}
                  style={{ order: isMd ? 0 : 1 }}
                  p={10}
                >
                  <Image
                    width={"100%"}
                    fit="cover"
                    src={require("../../../assets/websitecreationpanelimage.png")}
                  ></Image>
                </Center>
              </Flex>
            </Flex>

            <Flex
              direction={isMd ? "column" : "row"}
              justify={"space-between"}
              gap={20}
            >
              <Card
                w={isMd ? "100%" : "65%"}
                shadow="0px 0px 30px 0px rgba(0, 0, 0, 0.10)"
                mih={"100%"}
              >
                <></>
              </Card>
              <Stack w={isMd ? "100%" : "35%"}>
                <Flex
                  bg={"white"}
                  h={"100%"}
                  direction={"column"}
                  style={{
                    borderRadius: 10,
                    boxShadow: "0px 0px 30px 0px rgba(0, 0, 0, 0.10)",
                  }}
                  p={20}
                >
                  <Stack>
                    <Group position="apart">
                      <Flex gap={20}>
                        <Text fz={18} fw={700}>
                          Diary
                        </Text>
                        <Center>
                          <IconArrowRight
                            style={{ cursor: "pointer" }}
                            onClick={() => {
                              // if (props.userRole !== LoginUsers.ADMINISTRATOR) {
                              //   props.setSelectedSection(
                              //     DashBoardSection.HOMEWORK
                              //   );
                              // } else {
                              //   showAuthMessage();
                              // }
                              if (
                                isFeatureValidwithNotification(
                                  UserFeature.DAILYDIARY
                                )
                              ) {
                                props.setSelectedSection(
                                  DashBoardSection.HOMEWORK
                                );
                              }
                            }}
                          />
                        </Center>
                      </Flex>

                      {homeWorkNotification.length > 1 && (
                        <Text fw={300} fz={10} color="#909395">
                          {getLastUpdatedText(
                            homeWorkNotification[
                              homeWorkNotification.length - 1
                            ].createdAt
                          )}
                        </Text>
                      )}
                    </Group>
                    {homeWorkNotification.length < 1 && (
                      <Center>
                        <Text fz={14} fw={400} align="center">
                          No Updates!
                        </Text>
                      </Center>
                    )}
                    <Flex
                      direction={"row"}
                      justify={"space-around"}
                      align={"center"}
                      gap={20}
                      onClick={() => {
                        props.setdiaryNotificationClassId(
                          props.classes.find(
                            (x) =>
                              x.name ===
                              homeWorkNotification[
                                homeWorkNotification.length - 1
                              ].className
                          )?._id || null
                        );
                        props.setOpenedAddDiary(true);
                        props.setSelectedSection(DashBoardSection.HOMEWORK);
                      }}
                    >
                      {homeWorkNotification.length > 0 && (
                        <>
                          <ClassIcon
                            classNumber={
                              extractValueFromClassName(
                                homeWorkNotification[
                                  homeWorkNotification.length - 1
                                ].className
                              )?.toString() || ""
                            }
                            col="#4B65F6"
                          />

                          <Text fz={14} fw={400}>
                            {homeWorkNotification[
                              homeWorkNotification.length - 1
                            ].type === "HOMEWORK"
                              ? "Homework "
                              : "Classwork "}
                            successfully uploaded.
                          </Text>
                        </>
                      )}
                    </Flex>
                    <Center>
                      <Button
                        variant="outline"
                        leftIcon={<IconPlus />}
                        radius={50}
                        color="indigo"
                        onClick={() => {
                          // if (props.userRole !== LoginUsers.ADMINISTRATOR) {
                          //   props.setOpenedAddDiary(true);
                          //   props.setSelectedSection(DashBoardSection.HOMEWORK);
                          // } else {
                          //   showAuthMessage();
                          // }
                          if (
                            isFeatureValidwithNotification(
                              UserFeature.DAILYDIARY
                            )
                          ) {
                            props.setOpenedAddDiary(true);
                            props.setSelectedSection(DashBoardSection.HOMEWORK);
                          }
                        }}
                      >
                        Diary
                      </Button>
                    </Center>
                  </Stack>
                </Flex>
                <Flex
                  bg={"white"}
                  h={"100%"}
                  direction={"column"}
                  style={{
                    borderRadius: 10,
                    boxShadow: "0px 0px 30px 0px rgba(0, 0, 0, 0.10)",
                  }}
                  p={20}
                >
                  <Stack>
                    <Group position="apart">
                      <Text fz={18} fw={700}>
                        Daily Activity
                      </Text>
                      {dailyNotification.length > 0 && (
                        <Text fw={300} fz={10} color="#909395">
                          {getLastUpdatedText(
                            dailyNotification[dailyNotification.length - 1]
                              .createdAt
                          )}
                        </Text>
                      )}
                    </Group>
                    {dailyNotification.length < 1 && (
                      <Center>
                        <Text fz={14} fw={400} align="center">
                          No Updates!
                        </Text>
                      </Center>
                    )}
                    {dailyNotification.length > 0 && (
                      <Flex direction={"row"} align={"center"} gap={20}>
                        <>
                          <ClassIcon
                            classNumber={
                              extractValueFromClassName(
                                dailyNotification[dailyNotification.length - 1]
                                  .className
                              )?.toString() || ""
                            }
                            col="#4B65F6"
                          />
                          <Text fz={14} fw={400}>
                            {getNotificationTextFromDailyNotification(
                              dailyNotification[dailyNotification.length - 1]
                            )}
                          </Text>
                        </>
                      </Flex>
                    )}
                    {dailyNotification.length > 1 && (
                      <Flex direction={"row"} align={"center"} gap={20}>
                        <ClassIcon
                          classNumber={
                            extractValueFromClassName(
                              dailyNotification[dailyNotification.length - 2]
                                .className
                            )?.toString() || ""
                          }
                          col="#4B65F6"
                        />
                        <Text fz={14} fw={400}>
                          {getNotificationTextFromDailyNotification(
                            dailyNotification[dailyNotification.length - 2]
                          )}
                        </Text>
                      </Flex>
                    )}
                  </Stack>
                </Flex>
              </Stack>
            </Flex>
          </Stack>
        </Center>
      </Box>
    </>
  );
}
