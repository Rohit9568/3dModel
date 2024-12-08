import {
  Box,
  Button,
  Card,
  Center,
  Checkbox,
  CheckboxProps,
  Divider,
  FileInput,
  Flex,
  Group,
  Image,
  LoadingOverlay,
  ScrollArea,
  Stack,
  Table,
  Text,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { IconCheck, IconX } from "@tabler/icons";
import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { QuestionType } from "../../../@types/QuestionTypes.d";
import {
  IconBackArrow,
  IconRight,
  IconRightArrow,
  IconT,
  IconUpload2,
} from "../../../components/_Icons/CustonIcons";
import { PdfViewer } from "../../../components/_New/FileUploadBox";
import { fetchStudentInfoById } from "../../../features/StudentSlice";
import { FileUpload } from "../../../features/fileUpload/FileUpload";
import {
  createAnswerSheet,
  createCourseAnswerSheet,
  fetchSingleAnswerSheet,
} from "../../../features/test/AnswerSheetSlice";
import { fetchFullTest } from "../../../features/test/TestSlice";
import { DisplayHtmlText } from "../../../pages/_New/PersonalizedTestQuestions";
import { ParentPageEvents } from "../../../utilities/Mixpanel/AnalyticEventParentApp";
import { Mixpanel } from "../../../utilities/Mixpanel/MixpanelHelper";
import { FillAnswersPage } from "./FillAnswersPage";
import { ResultPage } from "./ResultPage";
import { ShowAnswersPage } from "./ShowAnswersPage";

enum StudentTestScreens {
  UploadScreen,
  AnswerScreen,
  UploadedScreen,
}
interface McqQuestionProps {
  question: string;
  questionImageUrl: string;
  answerImageUrl: string[];
  answers: { text: string; isCorrect: boolean }[];
  number: number;
  selectedOption: number;
}

function CaseBasedMCQ(props: {
  answers: { text: string; isCorrect: boolean }[];
  question: string;
  number: number;
  selectedOption: number;
}) {
  const isMd = useMediaQuery(`(max-width: 820px)`);
  const [showAnswer, setShowAnswer] = useState<boolean>(false);
  const answerIndex = props.answers.findIndex((x) => x.isCorrect === true);
  const answer = props.answers[answerIndex];
  const checkboxIcon: CheckboxProps["icon"] = ({ className }) =>
    props.selectedOption === answerIndex ? (
      <IconCheck className={className} stroke={5} />
    ) : (
      <IconX className={className} stroke={5} />
    );
  return (
    <Stack>
      <Flex>
        <Text>{`${props.number}.`}</Text>
        <DisplayHtmlText text={props.question} />
      </Flex>
      {props.answers.map((x, index) => {
        return (
          <Flex key={index}>
            <Checkbox
              radius={50}
              checked={props.selectedOption === index}
              styles={{
                input: {
                  backgroundColor: "#D9D9D9",
                  borderColor: "#D9D9D9",
                  "&:checked": {
                    backgroundColor:
                      props.selectedOption === answerIndex ? "#14FF00" : "red",
                    borderColor:
                      props.selectedOption === answerIndex ? "#14FF00" : "red",
                  },
                },
              }}
              icon={checkboxIcon}
              mr={10}
            />
            <DisplayHtmlText text={x.text} />
          </Flex>
        );
      })}
      <Divider size="xs" mt={20} />
      {isMd && (
        <Flex w="100%">
          <Button
            style={{
              border: "#4B65F6 1px solid",
              color: "#4B65F6",
            }}
            onClick={() => {
              setShowAnswer((prev) => !prev);
            }}
            my={10}
            w="100%"
            variant="outline"
          >
            {showAnswer ? "Hide" : "Show"} Answer
          </Button>
        </Flex>
      )}

      {!isMd && (
        <Flex justify="right">
          <Button
            style={{
              border: "#4B65F6 1px solid",
              color: "#4B65F6",
            }}
            onClick={() => {
              setShowAnswer((prev) => !prev);
            }}
            size="lg"
            my={10}
            px={40}
            variant="outline"
          >
            {showAnswer ? "Hide" : "Show"} Answer
          </Button>
        </Flex>
      )}
      {showAnswer && (
        <>
          <Text fw={600} color="#737373">
            Answer:
            <DisplayHtmlText text={answer?.text} />
          </Text>
        </>
      )}
    </Stack>
  );
}
interface CaseQuestionsProps {
  question: CaseBasedQuestion2;
  number: number;
  selectedOption: number[];
}
export function CaseQuestions(props: CaseQuestionsProps) {
  const isMd = useMediaQuery(`(max-width: 820px)`);

  return (
    <Stack spacing={3} w={isMd ? "100%" : "100%"}>
      <Card
        shadow="0px 0px 8px 0px rgba(0, 0, 0, 0.25);"
        style={{ borderRadius: "10px" }}
        withBorder
        pl={20}
        pt={20}
      >
        <Stack
          // spacing={4}
          spacing={4}
        >
          <Flex>
            <Text>{`${props.number}.`}</Text>
            <DisplayHtmlText text={props.question.caseStudyText} />
          </Flex>
          <Stack spacing={7} ml={20} mt={10}>
            {props.question.questions.map((y, i) => {
              return (
                <CaseBasedMCQ
                  question={y.text}
                  number={i + 1}
                  answers={(y as McqQuestion | null)?.answers??[]}
                  selectedOption={props.selectedOption[i]}
                />
              );
            })}
          </Stack>
        </Stack>
      </Card>
    </Stack>
  );
}
export function McqQuestion(props: McqQuestionProps) {
  const isMd = useMediaQuery(`(max-width: 820px)`);
  const [showAnswer, setShowAnswer] = useState<boolean>(false);
  const answerIndex = props.answers.findIndex((x) => x.isCorrect === true);
  const answer = props.answers[answerIndex];
  const checkboxIcon: CheckboxProps["icon"] = ({ className }) =>
    props.selectedOption - 1 === answerIndex ? (
      <IconCheck className={className} stroke={5} />
    ) : (
      <IconX className={className} stroke={5} />
    );

  return (
    <Stack spacing={3} w={isMd ? "100%" : "100%"}>
      <Card
        shadow="0px 0px 8px 0px rgba(0, 0, 0, 0.25);"
        style={{ borderRadius: "10px" }}
        withBorder
        pl={20}
        pt={20}
      >
        <Stack
          // spacing={4}
          spacing={4}
        >
          <Flex>
            <Text>{`${props.number}.`}</Text>
            <DisplayHtmlText text={props.question} />
          </Flex>
          {props.questionImageUrl && (
            <Image src={props.questionImageUrl} width={"40%"}></Image>
          )}
          <Stack spacing={7} ml={20} mt={10}>
            {props.answers.map((x, index) => {
              return (
                <Flex key={index}>
                  <Checkbox
                    radius={50}
                    checked={props.selectedOption - 1 === index}
                    styles={{
                      input: {
                        backgroundColor: "#D9D9D9",
                        borderColor: "#D9D9D9",
                        "&:checked": {
                          backgroundColor:
                            props.selectedOption - 1 === answerIndex
                              ? "#14FF00"
                              : "red",
                          borderColor:
                            props.selectedOption - 1 === answerIndex
                              ? "#14FF00"
                              : "red",
                        },
                      },
                    }}
                    icon={checkboxIcon}
                    mr={10}
                  />
                  <Text>
                    <DisplayHtmlText text={x.text} />
                  </Text>
                  {props.answerImageUrl && props.answerImageUrl[index] && (
                    <Image
                      src={props.answerImageUrl[index]}
                      width={"40%"}
                    ></Image>
                  )}
                </Flex>
              );
            })}
          </Stack>
        </Stack>
        <Divider size="xs" mt={20} />
        {isMd && (
          <Flex w="100%">
            <Button
              style={{
                border: "#4B65F6 1px solid",
                color: "#4B65F6",
              }}
              onClick={() => {
                setShowAnswer((prev) => !prev);
              }}
              my={10}
              w="100%"
              variant="outline"
            >
              {showAnswer ? "Hide" : "Show"} Answer
            </Button>
          </Flex>
        )}

        {!isMd && (
          <Flex justify="right">
            <Button
              style={{
                border: "#4B65F6 1px solid",
                color: "#4B65F6",
              }}
              onClick={() => {
                setShowAnswer((prev) => !prev);
              }}
              size="lg"
              my={10}
              px={40}
              variant="outline"
            >
              {showAnswer ? "Hide" : "Show"} Answer
            </Button>
          </Flex>
        )}
        {showAnswer && (
          <>
            <Flex>
              <Text fw={600} color="#737373">
                Answer:
              </Text>
              <DisplayHtmlText text={answer?.text} />
            </Flex>
            <Image
              src={props.answerImageUrl[answerIndex]}
              width={"40%"}
            ></Image>
          </>
        )}
      </Card>
    </Stack>
  );
}

export function InstructionsPointsPage(props: {
  testDetails: FullTest | undefined;
}) {
  return (
    <Stack>
      <Stack>
        <Text fw={700} fz={18}>
          General Instructions:
        </Text>
        {props.testDetails?.instructions.map((x, i) => {
          return (
            <Stack>
              <Text fw={600} fz={16}>{`${i + 1}.  ${x.heading}`}</Text>
              {x.points.length > 0 && (
                <Stack ml={10}>
                  {x.points.map((point) => {
                    return (
                      <Flex>
                        <Text fw={600} fz={16}>
                          {point}
                        </Text>
                      </Flex>
                    );
                  })}
                </Stack>
              )}
            </Stack>
          );
        })}
      </Stack>
      <Center mb={200}>
        <Flex>
          <Center>
            <Table highlightOnHover withBorder withColumnBorders>
              <thead>
                <tr>
                  <th>
                    <Center>Sr No</Center>
                  </th>
                  <th>
                    <Center>Question Status</Center>
                  </th>
                  <th>
                    <Center>Meaning</Center>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <Center>1</Center>
                  </td>
                  <td>
                    <Center>
                      <Image
                        src={require("../../../assets/questionstatus1.png")}
                        height={"48px"}
                        width={"48px"}
                        alt="Question status 1"
                      />
                    </Center>
                  </td>
                  <td>Not visited the question</td>
                </tr>
                <tr>
                  <td>
                    <Center>2</Center>
                  </td>
                  <td>
                    <Center>
                      <Image
                        src={require("../../../assets/questionstatus2.png")}
                        height={"48px"}
                        width={"48px"}
                        alt="Question status 2"
                      />
                    </Center>
                  </td>
                  <td>Visited the question but not answered the same</td>
                </tr>
                <tr>
                  <td>
                    <Center>3</Center>
                  </td>
                  <td>
                    <Center>
                      <Image
                        src={require("../../../assets/questionstatus3.png")}
                        height={"48px"}
                        width={"48px"}
                        alt="Question status 3"
                      />
                    </Center>
                  </td>
                  <td>
                    {" "}
                    <Text fz={14} fw={400}></Text> Answered the question but
                    have not marked for review
                  </td>
                </tr>
                <tr>
                  <td>
                    <Center>4</Center>
                  </td>
                  <td>
                    <Center>
                      <Image
                        src={require("../../../assets/questionstatus4.png")}
                        height={"48px"}
                        width={"48px"}
                        alt="Question status 4"
                      />
                    </Center>
                  </td>
                  <td>Not answered the question but have marked for review</td>
                </tr>
                <tr>
                  <td>
                    <Center>5</Center>
                  </td>
                  <td>
                    <Center>
                      <Image
                        src={require("../../../assets/questionstatus5.png")}
                        height={"48px"}
                        width={"48px"}
                        alt="Question status 5"
                      />
                    </Center>
                  </td>
                  <td>Answered the question as well as marked for review</td>
                </tr>
              </tbody>
            </Table>
          </Center>
        </Flex>
      </Center>
    </Stack>
  );
}

function InstructionPageTest(props: {
  testDetails: FullTest | undefined;
  onBackClick: () => void;
  changeScreen: () => void;
  isNav: (val: boolean) => void;
}) {
  const isMd = useMediaQuery(`(max-width: 968px)`);
  const [isChecked, setIsChecked] = useState(false);

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsChecked(e.target.checked);
  };

  useEffect(() => {
    props.isNav(false);
    return () => {
      props.isNav(true);
    };
  }, []);
  return (
    <Stack w={isMd ? "100%" : "90%"}>
      <InstructionsPointsPage testDetails={props.testDetails} />
      <Box
        style={{
          position: "fixed",
          bottom: isMd ? 60 : 0,
          left: 0,
          right: 0,
          backgroundColor: "#f8f9fa",
          padding: "10px",
          borderTop: "1px solid #ccc",
          boxShadow: "0 0 32px 0 rgba(0, 0, 0, 0.25)",
        }}
      >
        <Flex ml={10} mt={2}>
          <Checkbox mt={5} onChange={handleCheckboxChange} />
          <Text fz={isMd ? 14 : 18} fw={700} ml={10}>
            I hereby declare that I am not in possession of, wearing, or
            carrying any prohibited gadgets such as mobile phones, Bluetooth
            devices, or any prohibited materials into the Examination Hall,
            which in this case refers to the virtual testing environment
            provided by the testing platform app.
          </Text>
        </Flex>
        <Divider color="#E6E6E6" mt={5} size="md" />
        <Button
          disabled={!isChecked}
          onClick={() => {
            props.changeScreen();
          }}
          m={10}
          size="md"
          style={{
            float: "right",
            backgroundColor: isChecked ? "#4B65F6" : "",
            color: "white",
          }}
        >
          Next &rarr;
        </Button>
      </Box>
    </Stack>
  );
}

interface SubmittedScreenProps {
  onFirstPage: () => void;
}
function SubmittedScreen(props: SubmittedScreenProps) {
  return (
    <Stack h="100%" w="100%">
      <Center h="100%" w="100%">
        <Stack align="center" spacing={7}>
          <Box
            style={{
              backgroundColor: "#14FF00",
              borderRadius: "50%",
            }}
            h="70px"
            w="70px"
          >
            <Center w="100%" h="100%">
              <IconRight />
            </Center>
          </Box>
          <Text fz={16} fw={500} color="#14FF00">
            Test Submitted Successfully!
          </Text>
          <Text fz={12} color="#CBCBCB" fw={500} w="70%" ta="center">
            Click okay button to close the tab
          </Text>
          <Button
            size="md"
            style={{
              backgroundColor: "#4B65F6",
            }}
            onClick={() => {
              props.onFirstPage();
            }}
          >
            Okay
          </Button>
        </Stack>
      </Center>
    </Stack>
  );
}

interface QuestionCardProps {
  question: string;
  questionImageUrl: string;
  number: number;
  answer: string;
  originalAnswer: string;
  isShowAnswer: boolean;
}

export function QuestionCard(props: QuestionCardProps) {
  const [showAnswer, setShowAnswer] = useState<boolean>(false);
  const isMd = useMediaQuery(`(max-width: 820px)`);

  return (
    <Stack>
      <Card
        shadow="0px 0px 8px 0px rgba(0, 0, 0, 0.25);"
        style={{ borderRadius: "10px" }}
        withBorder
      >
        <Stack
        // spacing={}
        >
          <Flex>
            <Text>{`${props.number}.`}</Text>
            <DisplayHtmlText text={props.question} />
          </Flex>
          {props.questionImageUrl && (
            <Image src={props.questionImageUrl} width={"40%"}></Image>
          )}
          <ScrollArea
            style={{
              maxHeight: "60px",
            }}
          >
            <Flex>
              <Text>{`Your Response:`}</Text>
              <DisplayHtmlText text={props.answer} />
            </Flex>
          </ScrollArea>
        </Stack>
        <Divider size="xs" mt={20} />
        {props.isShowAnswer && (
          <Stack spacing={5}>
            {isMd && (
              <Button
                style={{
                  border: "#4B65F6 1px solid",
                  color: "#4B65F6",
                }}
                onClick={() => {
                  setShowAnswer((prev) => !prev);
                }}
                my={10}
                variant="outline"
              >
                {showAnswer ? "Hide" : "Show"} Answer
              </Button>
            )}
            {!isMd && (
              <Flex justify="right">
                <Button
                  style={{
                    border: "#4B65F6 1px solid",
                    color: "#4B65F6",
                  }}
                  onClick={() => {
                    setShowAnswer((prev) => !prev);
                  }}
                  size="lg"
                  my={10}
                  px={40}
                  variant="outline"
                >
                  {showAnswer ? "Hide" : "Show"} Answer
                </Button>
              </Flex>
            )}
            {showAnswer && (
              <Flex>
                <Text fw={600}>Answer:</Text>
                <DisplayHtmlText text={props.originalAnswer} />
              </Flex>
            )}
          </Stack>
        )}
      </Card>
    </Stack>
  );
}

interface SingletestProps {
  onBackClick: (val: string) => void;
  testId: string;
  onOkaybuttonClick: (val: string) => void;
  isNav: (val: boolean) => void;
}
export function SingleTest(props: SingletestProps) {
  const [test, setTest] = useState<FullTest | null>(null);
  const [isLoading, setisLoading] = useState<boolean>(false);
  const [currentScreen, setCurrentScreen] = useState<StudentTestScreens>(
    StudentTestScreens.UploadScreen
  );
  const [mcqAnswers, setmcqAnswers] = useState<MCQTestAnswer[]>([]);
  const [subjectiveAnswers, setsubjectiveAnswers] = useState<
    SubjectiveTestAnswer[]
  >([]);
  const [caseStudyAnswers, setCaseStudyAnswers] = useState<CasestudyAnswers[]>(
    []
  );
  const [answerSheet, setAnswerSheet] = useState<any | null | undefined>(
    undefined
  );
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const subjectId = queryParams.get("subjectId");
  const studentId = queryParams.get("studentId");
  const viewResult = queryParams.get("viewResult") === "true";
  function backButtonHandler() {
    props.onBackClick(studentId!!);
  }

  useEffect(() => {
    setisLoading(true);
    fetchFullTest(props.testId)
      .then((x: any) => {
        setisLoading(false);
        setTest(x);
      })
      .catch((e) => {
        setisLoading(false);
        console.log(e);
      });
  }, [props.testId]);

  useEffect(() => {
    setisLoading(true);
    if (studentId) {
      fetchStudentInfoById({ id: studentId })
        .then((x: any) => {
          const found = x.teacherTestAnswers.findLast(
            (x: any) => x.testId === props.testId
          );
          if (found) {
            fetchSingleAnswerSheet(found.answerSheetId)
              .then((data: any) => {
                setisLoading(false);
                setAnswerSheet(data);
              })
              .catch((e) => {
                setisLoading(false);
                console.log(e);
              });
          } else {
            setisLoading(false);
            setAnswerSheet(null);
          }
        })
        .catch((e) => {
          setisLoading(false);
          console.log(e);
        });
    }
  }, [studentId]);

  function onTestSubmitClick(temp: any) {
    setisLoading(true);
    createAnswerSheet({ formObj: temp })
      .then((x) => {
        console.log(x);
        setisLoading(false);
      })
      .catch((e) => {
        setisLoading(false);
        console.log(e);
      });
  }
  useEffect(() => {
    const ans: MCQTestAnswer[] = [];
    test?.questions.map((x) => {
      ans.push({
        question_id: x._id,
        options: [],
        answerText: "",
        isCorrect: false,
      });
    });
    setmcqAnswers(ans);

    const subans: SubjectiveTestAnswer[] = [];
    test?.subjectiveQuestions.map((x) => {
      subans.push({ question_id: x._id, answerText: " " });
    });
    setsubjectiveAnswers(subans);

    const caseans: CasestudyAnswers[] = [];

    test?.casebasedquestions.map((x) => {
      const isCorrectArray = x.questions.map((y) => {
        return false;
      });
      const optionArray = x.questions.map((y) => {
        return -1;
      });
    });
    setCaseStudyAnswers(caseans);
  }, [test]);

  const isMd = useMediaQuery(`(max-width: 968px)`);

  return (
    <>
      <Box
        style={{
          padding: 6,
        }}
        h="100%"
        w="100%"
      >
        {currentScreen !== StudentTestScreens.UploadedScreen && (
          <Box h ={"100%"}>
            <LoadingOverlay visible={isLoading} />
            {viewResult === false && (
              <>
                {currentScreen === StudentTestScreens.UploadScreen &&
                  test !== null && (
                    <InstructionPageTest
                      onBackClick={backButtonHandler}
                      changeScreen={() => {
                        setCurrentScreen(StudentTestScreens.AnswerScreen);
                      }}
                      testDetails={test}
                      isNav={props.isNav}
                    />
                  )}
                {currentScreen === StudentTestScreens.AnswerScreen &&
                  test !== null &&
                  test !== undefined && (
                    <Box h={"100%"}>
                    <FillAnswersPage
                      testDetails={test}
                      onNextButtonClick={(studentAnswerSheet:StudentTestAnswerSheet) => {
                        const temp = {
                          studentId: studentId,
                          testId: props.testId,
                          studentTestAnswerSheet: studentAnswerSheet
                        };
                        Mixpanel.track(
                          ParentPageEvents.TEST_PAGE_START_TEST_SUBMIT_BUTTON_CLICKED
                        );
                        temp.studentTestAnswerSheet.questions.forEach((innerQuestion)=>{
                          if(!innerQuestion.superSectionName || !(innerQuestion.superSectionName.length>0)){
                            innerQuestion.superSectionName = "Main"
                          }
                        })
                        onTestSubmitClick(temp);
                        setCurrentScreen(StudentTestScreens.UploadedScreen);
                      }}
                      isNav={props.isNav}
                    />
                    </Box>
                  )}
              </>
            )}
            {answerSheet !== null &&
              answerSheet !== undefined &&
              answerSheet.isChecked === true &&
              test !== null &&
              viewResult === true && (
                <ResultPage
                  testId={props.testId}
                  answerSheetId={answerSheet._id}
                  onBackClick={backButtonHandler}
                />
              )}
            {answerSheet !== null &&
              answerSheet !== undefined &&
              answerSheet.answerPdf === null &&
              answerSheet.isChecked === null &&
              test &&
              viewResult === true && (
                <ShowAnswersPage
                  answerSheet={answerSheet}
                  onBackClick={backButtonHandler}
                  testId={props.testId}
                />
              )}
            {answerSheet && answerSheet.answerPdf !== null && answerSheet.answerPdf.trim() !="" && (
              <Stack>
                {answerSheet.isChecked !== true && (
                  <Flex
                    pl={10}
                    align={isMd ? "center" : "left"}
                    style={{
                      position: "relative",
                      display: "flex",
                      alignItems: "center",
                    }}
                    h="50px"
                  >
                    <Box
                      w="40px"
                      h="40px"
                      style={{
                        borderRadius: "50%",
                        border: "#BDBDBD 2px solid",
                        cursor: "pointer",
                        position: "absolute",
                        left: 10,
                      }}
                      onClick={() => {
                        backButtonHandler();
                      }}
                      // ml={10}
                    >
                      <Center w="100%" h="100%" p={5}>
                        <Box w="100%" h="100%">
                          <IconBackArrow col="#BDBDBD" />
                        </Box>
                      </Center>
                    </Box>
                    <Text
                      color="#454545"
                      fz={isMd ? 24 : 36}
                      w="100%"
                      ta={isMd ? "center" : "left"}
                      fw={700}
                      ml={isMd ? 0 : 50}
                    >
                      AnswerSheet
                    </Text>
                  </Flex>
                )}
                <Box w="100%" mt={20}>
                  <PdfViewer url={answerSheet.answerPdf} showOptions={true} showDownloadButton={true} />
                </Box>
              </Stack>
            )}
          </Box>
        )}
        {currentScreen === StudentTestScreens.UploadedScreen && (
          <SubmittedScreen
            onFirstPage={() => {
              props.onOkaybuttonClick(studentId ?? "");
            }}
          />
        )}
      </Box>
      <LoadingOverlay visible={isLoading} />
    </>
  );
}
