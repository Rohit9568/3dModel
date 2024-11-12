import {
  Box,
  Button,
  Center,
  Flex,
  LoadingOverlay,
  Modal,
  ScrollArea,
  SimpleGrid,
  Stack,
  Text,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { IconClock, IconDotsVertical } from "@tabler/icons";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { fetchReportFromAnswerSheet } from "../../../features/test/AnswerSheetSlice";
import ViewResources from "../../../pages/_New/ViewResources";
import { convertDate, secondsToTime } from "../../../utilities/HelperFunctions";
import { ParentPageEvents } from "../../../utilities/Mixpanel/AnalyticEventParentApp";
import { Mixpanel } from "../../../utilities/Mixpanel/MixpanelHelper";
import { GetAllVignamTestsByClassId } from "../../features/instituteClassSlice";

interface SingleTestCardProps {
  data: VignamTest;
  onTestClick: (viewResult: boolean) => void;
  onViewResourcesClick: () => void;
}
function SingleTestCard(props: SingleTestCardProps) {
  const isMd = useMediaQuery(`(max-width: 820px)`);
  const [isResoucesModalOpened, setIsResourcesModalOpened] =
    useState<boolean>(false);
  const [testReport, setTestReport] = useState<TestReport | null>(null);

  // useEffect(() => {
  //   if (props.data.answerSheet)
  //     fetchReportFromAnswerSheet(props.data.answerSheet._id)
  //       .then((data: any) => {
  //         setTestReport(data.fullAnswerSheet.testReportId);
  //       })
  //       .catch((e) => {
  //         console.log(e);
  //       });
  // }, [props.data]);

  return (
    <>
      <Center>
        <Flex
          w="100%"
          style={{
            borderRadius: "12px",
            borderLeft: "15px solid #FCCB25",
            boxShadow: "0px 4px 12px 0px rgba(0, 0, 0, 0.25)",
            position: "relative",
          }}
          align="center"
        >
          <Stack pl={20} my={20} justify="center" spacing={7} w="100%">
            <Flex justify="space-between">
              <Flex align="center">
                <Text
                  fz={isMd ? 18 : 20}
                  fw={500}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    // justifyContent: 'center',
                  }}
                  //  w="50%"
                >
                  {props.data.name.length > 15
                    ? `${props.data.name}..`
                    : props.data.name}
                </Text>
                {props.data.maxQuestions !== 0 && (
                  <Text fz={isMd ? 10 : 12} color="#898989" fw={400} ml={4}>
                    <span
                      // fz={isMd ? 6 : 10}
                      style={{
                        backgroundColor:
                          props.data.answerSheet === null
                            ? "#FF3F3F"
                            : "#00C808",
                        borderRadius: "5px",
                        display:
                          // props.data.answersheetPdf !== null ||
                          props.data.answerSheet !== null &&
                          props.data.questionType !== "MCQ"
                            ? "none"
                            : "inline",
                        fontSize: isMd ? 12 : 14,
                        padding: "2px 10px",
                        color: "white",
                        marginLeft: 5,
                        // marginTop:0
                      }}
                    >
                      {props.data.answerSheet === null
                        ? "Test Not Taken"
                        : "Report Added"}
                    </span>
                  </Text>
                )}
              </Flex>
              <Flex align="center" justify="right" pr={5} mr={20} w="40%">
                {(props.data.testResources.length !== 0 ||
                  (props.data.isEnableMultipleTestAttempts === true &&
                    props.data.answerSheet)) && (
                  <Box
                    onClick={() => {
                      setIsResourcesModalOpened(true);
                    }}
                  >
                    <IconDotsVertical
                      size={28}
                      style={{
                        marginLeft: "10px",
                        cursor: "pointer",
                      }}
                    />
                  </Box>
                )}
              </Flex>
            </Flex>
            {props.data.maxQuestions !== 0 && (
              <Text
                color="#898989"
                fz={isMd ? 12 : 14}
                fw={500}
              >{`Total Marks:${props.data.maxMarks} | Total Questions:${props.data.maxQuestions}`}</Text>
            )}
            <Flex align="center" justify="space-between" pr={5} mr={20}>
              <Flex align="center">
                {props.data.duration !== null && (
                  <>
                    <IconClock
                      color="#898989"
                      size={18}
                      style={{
                        marginRight: 5,
                      }}
                    />
                    <Text c="#898989" fw={400} fz={isMd ? 12 : 14}>{`${
                      props.data.testScheduleTime
                        ? `Date: ${convertDate(props.data.testScheduleTime)} |`
                        : ""
                    } Duration:${secondsToTime(
                      parseInt(props.data.duration)
                    )}`}</Text>
                  </>
                )}
              </Flex>
              {props.data.isTestwithOnlyMarks &&
                props.data.answerSheet !== null &&
                testReport !== null &&
                testReport.pdfLink !== null &&
                testReport.pdfLink !== "" && (
                  <Button
                    style={{
                      border: "2px solid #4D65F6",
                      color: "#4D65F6",
                      maxWidth: "100%",
                    }}
                    size={isMd ? "xs" : "md"}
                    onClick={() => {
                      props.onTestClick(true);
                      Mixpanel.track(
                        ParentPageEvents.TEST_PAGE_VIEW_REPORT_CLICKED
                      );
                    }}
                    variant="outline"
                  >
                    View Report
                  </Button>
                )}
              {(props.data.maxQuestions !== 0 || props.data.pdfLink !== null) &&
                props.data.isTestwithOnlyMarks === false && (
                  <>
                    {props.data.answerSheet &&
                      props.data.answerSheet.isChecked !== null &&
                      props.data.isEnableMultipleTestAttempts === false && (
                        <Button
                          style={{
                            border: "2px solid #4D65F6",
                            color: "#4D65F6",
                            maxWidth: "100%",
                          }}
                          size={isMd ? "xs" : "md"}
                          onClick={() => {
                            props.onTestClick(true);
                            Mixpanel.track(
                              ParentPageEvents.TEST_PAGE_VIEW_REPORT_CLICKED
                            );
                          }}
                          variant="outline"
                        >
                          View Report
                        </Button>
                      )}
                    {props.data.answerSheet &&
                      props.data.answerSheet.isChecked === null &&
                      props.data.isEnableMultipleTestAttempts === false && (
                        <Button
                          style={{
                            border: "2px solid #4D65F6",
                            color: "#4D65F6",
                            maxWidth: "100%",
                          }}
                          size={isMd ? "xs" : "md"}
                          onClick={() => {
                            props.onTestClick(true);
                            Mixpanel.track(
                              ParentPageEvents.TEST_PAGE_VIEW_RESPONSE_CLICKED
                            );
                          }}
                          variant="outline"
                        >
                          View Response
                        </Button>
                      )}
                    {(props.data.answerSheet === null ||
                      props.data.isEnableMultipleTestAttempts === true) && (
                      <Button
                        style={{
                          background:
                            "linear-gradient(92deg, #4B65F6 0%, #AC2FFF 100%)",
                          maxWidth: "100%",
                        }}
                        styles={{ root: { border: "" } }}
                        size={isMd ? "xs" : "md"}
                        onClick={() => {
                          props.onTestClick(false);
                          Mixpanel.track(
                            ParentPageEvents.TEST_PAGE_TAKE_TEST_CLICKED
                          );
                        }}
                        // w="100%"
                      >
                        Take Test
                      </Button>
                    )}
                  </>
                )}
            </Flex>
          </Stack>
        </Flex>
        <Modal
          opened={isResoucesModalOpened}
          onClose={() => setIsResourcesModalOpened(false)}
          size="md"
          centered
          zIndex={9999}
        >
          <Stack>
            {props.data.isEnableMultipleTestAttempts === true &&
              props.data.answerSheet && (
                <Button
                  onClick={() => {
                    props.onTestClick(true);
                  }}
                  p={"10px"}
                  sx={{ border: "1px solid #4B65F6" }}
                  size="lg"
                  variant="outline"
                  c="#4B65F6"
                  w="100%"
                >
                  {props.data.answerSheet.isChecked !== null
                    ? "View Report"
                    : "View Response"}
                </Button>
              )}
            <Button
              onClick={() => {
                setIsResourcesModalOpened(false);
                props.onViewResourcesClick();
              }}
              p={"10px"}
              sx={{ border: "1px solid #4B65F6" }}
              size="lg"
              variant="outline"
              c="#4B65F6"
              w="100%"
            >
              View Test Resources
            </Button>
          </Stack>
        </Modal>
      </Center>
    </>
  );
}

interface AllTestProps {
  studentData: {
    classId: string;
    className: string;
    studentName: string;
    studentId: string;
    teacherTestAnswers: {
      testId: string;
      answerSheetId: {
        isChecked: boolean | null;
        _id: string;
      };
    }[];
  };
  onTestClick: (
    id: string,
    subjectId: string,
    studentId: string,
    showResult: boolean
  ) => void;
  onStudentChange: (id: string) => void;
}
export function AllTest(props: AllTestProps) {
  const [allTest, setAllTest] = useState<VignamTest[]>([]);
  const [isLoading, setloading] = useState<boolean>(false);
  const [selectedStudentId, setSelectedStudentId] = useState<string>(
    props.studentData.studentId
  );
  const [viewTestResources, setTestResources] = useState<string | null>(null);
  useEffect(() => {
    console.log(allTest);
  }, [allTest]);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const paramValue = queryParams.get("studentId");

  useEffect(() => {
    if (paramValue) setSelectedStudentId(paramValue);
    else setSelectedStudentId(props.studentData.studentId);
  }, [paramValue]);
  const isMd = useMediaQuery(`(max-width: 820px)`);

  useEffect(() => {
    const student = props.studentData;
    if (student) {
      setloading(true);
      GetAllVignamTestsByClassId({ id: student.studentId })
        .then((x: any) => {
          setloading(false);
          const allTest1: any[] = [];
          for (let i = 0; i < x.allTests.length; i++) {
            const y = x.allTests[i];
            const found = (student?.teacherTestAnswers as any).findLast(
              (x:any) =>  x.testId === y._id
            );
            if (found) {
              allTest1.push({
                ...y,
                answerSheet: {
                  ...found.answerSheetId,
                },
              });
            } else {
              allTest1.push({
                ...y,
                answerSheet: null,
              });
            }
          }

          setAllTest(allTest1);
        })
        .catch((e) => {
          setloading(false);
          console.log(e);
        });
    }
  }, [selectedStudentId, props.studentData]);
  return (
    <>
      {viewTestResources === null && (
        <Stack
          style={{
            height: "100vh",
          }}
          spacing={2}
          w="100%"
          px={isMd ? 0 : 20}
        >
          <LoadingOverlay visible={isLoading} />
          <Flex
            h={200}
            w="100%"
            style={{
              borderRadius: "20px",
              position: "relative",
            }}
            my={10}
          >
            <img
              src={require("../../../assets/allTestBackground.png")}
              width={"100%"}
              height={"100%"}
              style={{
                position: "absolute",
                objectPosition: "right",
                objectFit: "cover",
                borderRadius: "20px",
              }}
            />
            <Flex>
              <Stack
                style={{
                  zIndex: 99,
                  color: "white",
                }}
                px={20}
                spacing={1}
                justify="center"
              >
                <Text fz={isMd ? 24 : 36} fw={600}>
                  Interactive{isMd && <br />} Student Testing
                </Text>
                <Text
                  fz={isMd ? 16 : 20}
                  fw={400}
                  style={{
                    opacity: 0.7,
                  }}
                >
                  Measure and Improve Your Performance
                </Text>
              </Stack>
            </Flex>
          </Flex>
          {(!allTest || allTest.length === 0) && (
            <Center h="calc(100% - 200px)" w="100%">
              <img
                src={require("../../../assets/emptyTest.png")}
                height="50%"
                style={{
                  aspectRatio: 0.92,
                }}
              />
            </Center>
          )}
          {allTest && allTest.length !== 0 && (
            <ScrollArea h="calc(100% - 200px)">
              <SimpleGrid
                cols={isMd ? 1 : 2}
                px={isMd ? 6 : 10}
                spacing="xl"
                py={isMd ? 2 : 10}
              >
                {allTest.map((x) => {
                  return (
                    <SingleTestCard
                      data={x}
                      onTestClick={(showResult) => {
                        props.onTestClick(
                          x._id,
                          x.instituteSubjectId,
                          selectedStudentId,
                          showResult
                        );
                      }}
                      onViewResourcesClick={() => {
                        setTestResources(x._id);
                      }}
                    />
                  );
                })}
              </SimpleGrid>
            </ScrollArea>
          )}
        </Stack>
      )}
      {viewTestResources !== null && (
        <ViewResources
          testId={viewTestResources}
          fromTeacherPage={false}
          onbackClick={() => {
            setTestResources(null);
          }}
        />
      )}
    </>
  );
}
