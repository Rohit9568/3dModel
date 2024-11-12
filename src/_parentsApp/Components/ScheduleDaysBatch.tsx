import React, { useEffect, useState } from "react";
import { Text, Center, Box, Flex, SimpleGrid, Stack } from "@mantine/core";
import { format, isToday } from "date-fns";
import { Carousel } from "@mantine/carousel";
import { useMediaQuery } from "@mantine/hooks";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons";
import { ScheduledBatchesCards } from "../../components/AdminPage/DashBoard/DashBoardCards";
import { GetInstitiuteAndUsersInfo } from "../features/instituteSlice";
import { useSelector } from "react-redux";
import { RootState } from "../../store/ReduxStore";
import { GetAllVignamTestsByClassId } from "../features/instituteClassSlice";
import { ScheduleTest } from "./ScheduleTest";
import { GetUsersubjectById } from "../../features/UserSubject/userSubjectSlice";
import { ScheduleMeeting } from "./ScheduleMeeting";
import { useNavigate } from "react-router-dom";
import { GetAllMeetings } from "../features/instituteStudentSlice";

function add30Days() {
  const currentDate = new Date();
  const datesArray = [];

  for (let i = 0; i < 31; i++) {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + i);
    datesArray.push(newDate);
  }
  return datesArray;
}

function ScheduleDaysBatch(props: {
  batches: any[];
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
  mainPath: string;
}) {
  const datesarray = add30Days();
  const [selectedStudentId, setSelectedStudentId] = useState<string>(
    props.studentData.studentId
  );
  const [tests, setTests] = useState<VignamTest[]>([]);
  const [selectedTests, setSelectedTests] = useState<VignamTest[]>([]);
  const [allMeetings, setAllMeetings] = useState<
    VideoCallMeetingWithBatchName[]
  >([]);
  const [selectedMeetings, setSelectedMeetings] = useState<
    VideoCallMeetingWithBatchName[]
  >([]);
  const [loading, setLoading] = useState<boolean>(true);
  const instituteDetails = useSelector<RootState, InstituteDetails | null>(
    (state) => {
      return state.instituteDetailsSlice.instituteDetails;
    }
  );

  const [thiryDates, setThirtyDates] = useState<Date[]>([]);
  const isMd = useMediaQuery(`(max-width: 548px)`);
  const [batchesLength, setBatchesLength] = useState(0);
  const [batches, setBatches] = useState<
    | {
        _id: string;
        name: string;
        days: number[];
        subjects: { _id: string; name: string }[];
        firstThreeTeachers: { _id: string; name: string }[];
        batchTime: string;
        teachersLength: number;
      }[]
    | null
  >([]);
  const [selectedDate, setSelectedDate] = useState<Date>(
    datesarray.find((date) => isToday(date)) || new Date()
  );
  const handleClick = (currentDate: Date) => {
    setSelectedDate(currentDate);
  };

  useEffect(() => {
    console.log(tests);
    if (tests.length > 0) {
      setSelectedTests(
        tests.filter((x) => {
          return (
            x.testScheduleTime &&
            new Date(x.testScheduleTime).getFullYear() ===
              selectedDate.getFullYear() &&
            new Date(x.testScheduleTime).getMonth() ===
              selectedDate.getMonth() &&
            new Date(x.testScheduleTime).getDate() === selectedDate.getDate()
          );
        })
      );
    }
  }, [tests, selectedDate]);

  useEffect(() => {
    setSelectedMeetings(
      allMeetings.filter((x) => {
        return (
          x.scheduleTime &&
          new Date(x.scheduleTime).getFullYear() ===
            selectedDate.getFullYear() &&
          new Date(x.scheduleTime).getMonth() === selectedDate.getMonth() &&
          new Date(x.scheduleTime).getDate() === selectedDate.getDate()
        );
      })
    );
  }, [allMeetings, selectedDate]);

  useEffect(() => {
    const student = props.studentData;
    if (student) {
      GetAllVignamTestsByClassId({ id: student.studentId })
        .then((x: any) => {
          const allTest1: VignamTest[] = x.allTests.map((y: any) => {
            const found = student?.teacherTestAnswers.find(
              (x) => x.testId === y._id
            );
            if (found) {
              return {
                ...y,
                answerSheet: found.answerSheetId,
              };
            } else {
              return {
                ...y,
                answerSheet: null,
              };
            }
          });
          setTests(allTest1);
        })
        .catch((e) => {
          console.log(e);
        });
    }
  }, [selectedStudentId, props.studentData]);

  useEffect(() => {
    GetAllMeetings({
      id: selectedStudentId,
    })
      .then((x: any) => {
        setAllMeetings(x);
      })
      .catch((e) => {
        console.log(e);
      });
  }, [selectedStudentId]);

  useEffect(() => {
    const batches = props.batches.filter((batch) => {
      return (
        batch.batchScheduleDays.length > 0 &&
        batch.batchScheduleDays[selectedDate.getDay()] !== null
      );
    });

    setBatches(
      batches.length > 0
        ? batches
            .map((batch) => {
              return {
                ...batch,
                batchTime: batch.batchScheduleDays[selectedDate.getDay()]!!,
              };
            })
            .filter((x) => x.batchTime && x.batchTime !== null)
        : []
    );
    setBatchesLength(batches.length);
  }, [selectedDate]);

  useEffect(() => {
    setThirtyDates(datesarray);
  }, []);

  const filteredTests = selectedTests.filter((test) => {
    return test.testScheduleTime !== null;
  });

  const navigate = useNavigate();

  return (
    <>
      <Flex justify="space-between" align="center">
        <Text ml={20} fz={18} fw={700}>
          Batch Schedule
        </Text>
      </Flex>
      <Box>
        <Center mt={10}>
          <Center mt={10}>
            <Flex direction="column" align="center">
              <Text fz={14} fw={700} color="#4B65F6">
                {format(selectedDate, " dd MMMM yyyy, EEEE")}
              </Text>
              <Text fz={13} fw={400}>
                {batchesLength} classes today
              </Text>
            </Flex>
          </Center>
        </Center>
        <Flex mt={5}>
          <Carousel
            getEmblaApi={() => {}}
            slideGap={10}
            align={"center"}
            w={"100%"}
            py={"4%"}
            loop
            nextControlIcon={
              <Box
                w={"45%"}
                h={"100%"}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: "4px",
                  marginTop: "-20vh",
                }}
              >
                <IconChevronRight size={60} stroke={1} color="#747474" />
              </Box>
            }
            previousControlIcon={
              <Box
                w={"45%"}
                h={"100%"}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: "4px",
                  marginTop: "-20vh",
                }}
              >
                <IconChevronLeft size={60} stroke={1} color="#747474" />
              </Box>
            }
            styles={{
              root: {
                maxWidth: "100%",
                margin: 0,
              },
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
            m={0}
            slideSize="50px"
          >
            {thiryDates.map((date) => (
              <Carousel.Slide>
                <Box
                  key={date.getTime()}
                  onClick={() => handleClick(date)}
                  m={5}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <Box
                    style={{
                      borderRadius: "48%",
                      width: "48px",
                      height: "74px",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                      backgroundColor:
                        selectedDate.getTime() === date.getTime()
                          ? "#4B65F6"
                          : "#f0f0f0",
                      cursor: "pointer",
                    }}
                  >
                    <Text
                      fz={16}
                      fw={700}
                      style={{
                        color:
                          selectedDate.getTime() === date.getTime()
                            ? "#FFFFFF"
                            : "#949494",
                      }}
                    >
                      {format(date, "EE").charAt(0)}
                    </Text>
                    <Text
                      fz={16}
                      fw={700}
                      style={{
                        color:
                          selectedDate.getTime() === date.getTime()
                            ? "#FFFFFF"
                            : "#949494",
                      }}
                    >
                      {format(date, "dd")}
                    </Text>
                  </Box>
                </Box>
              </Carousel.Slide>
            ))}
            <Carousel.Slide
              style={{
                width: "30px",
              }}
            >
              <Center
                style={{
                  height: "100%",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    backgroundColor: "#4B65F6",
                    width: "3px",
                  }}
                ></div>
              </Center>
            </Carousel.Slide>
          </Carousel>
        </Flex>
        <Stack justify={"space-between"} m={20}>
          {selectedMeetings.length > 0 && (
            <Text fz={16} mb={-20} fw={600}>
              Scheduled Meetings:
            </Text>
          )}
          {selectedMeetings.map((meeting) => {
            return (
              <ScheduleMeeting
                meeting={meeting}
                onjoinMeeting={(meeting) => {
                  navigate(
                    `/${props.mainPath}/videocall?meetingId=${meeting._id}`
                  );
                }}
              />
            );
          })}
          {batches && batches.length > 0 && (
            <Stack w={"100%"}>
              <Text fz={16} fw={600}>
                Scheduled Classes:
              </Text>

              <ScheduledBatchesCards
                batches={
                  batches
                    ? batches
                        .filter((item) => {
                          return item.batchTime && item.batchTime != null;
                        })
                        .map((batch) => {
                          return {
                            id: batch._id,
                            name: batch.name,
                            days: batch.days,
                            batchTime: new Date(batch.batchTime),
                            subjects:
                              batch.subjects?.map((subject) => ({
                                id: subject._id,
                                name: subject.name,
                              })) ?? [],
                            teachers: batch.firstThreeTeachers.map(
                              (teacher) => ({
                                id: teacher._id,
                                name: teacher.name,
                              })
                            ),
                            teachersLength: batch.teachersLength,
                          };
                        })
                    : []
                }
              />
            </Stack>
          )}
          {filteredTests.length > 0 && (
            <Text fz={16} mb={-20} fw={600}>
              Scheduled Tests:
            </Text>
          )}
          {filteredTests.map((test) => {
            return <ScheduleTest onClick={() => {}} test={test} />;
          })}
        </Stack>
      </Box>
    </>
  );
}

export default ScheduleDaysBatch;
