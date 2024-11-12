import {
  Box,
  Button,
  Center,
  Flex,
  Group,
  LoadingOverlay,
  NumberInput,
  Select,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { useEffect, useState } from "react";
import { PdfViewer } from "../FileUploadBox";
import { StudentResponses } from "./StudentResponse";
import { BackButtonWithCircle } from "../../_Icons/CustonIcons";
import { useMediaQuery } from "@mantine/hooks";
import { WebAppEvents } from "../../../utilities/Mixpanel/AnalyticeEventWebApp";
import { Mixpanel } from "../../../utilities/Mixpanel/MixpanelHelper";
import { IconArrowNarrowRight, IconCaretRight } from "@tabler/icons";
import { submitUpdatedAnswers } from "../../../features/test/AnswerSheetSlice";
import { QuestionType } from "../../../@types/QuestionTypes.d";
import { fetchFullTest } from "../../../features/test/TestSlice";
import { findIndex } from "@excalidraw/excalidraw/types/utils";
interface TestResponses {
  test: any;
  onBackClick: () => void;
}
export interface MarksQuestionArray {
  _id: string;
  marks: number;
}

function Pdfinputmarks(props: {
  type: string;
  index: number;
  questionId: string;
  test: any;
  answerSheet: any;
  handleMarksChange: (val: number, index: number) => void;
  handlemcqbasedMarks: (val: number, index: number) => void;
  handlecaseBasedMarks: (val: number, index: number) => void;
  totalMarks: number;
}) {
  function findIndex() {
    let index = 0;
    if (
      props.type === QuestionType.LongQues.type ||
      props.type === QuestionType.ShortQues.type
    ) {
      index = props.answerSheet.subjectiveAnswers.findIndex((x: any) => {
        return x.question_id === props.questionId;
      });
    } else if (props.type === QuestionType.CaseQues.type) {
      index = props.answerSheet.caseStudyAnswers.findIndex((x: any) => {
        return x.question_id === props.questionId;
      });
    } else if (props.type === QuestionType.McqQues.type) {
      index = props.answerSheet.mcqAnswers.findIndex((x: any) => {
        return x.question_id === props.questionId;
      });
    }
    return index;
  }

  const getMarks = () => {
    if (
      props.type === QuestionType.LongQues.type ||
      props.type === QuestionType.ShortQues.type
    ) {
      return props.answerSheet.subjectiveAnswers[findIndex()].marks;
    } else if (props.type === QuestionType.CaseQues.type) {
      return props.answerSheet.caseStudyAnswers[findIndex()].marks;
    } else if (props.type === QuestionType.McqQues.type) {
      return props.answerSheet.mcqAnswers[findIndex()].marks;
    } else {
      return 0;
    }
  };

  return (
    <div
      style={{
        width: "100%",
        height: "100px",
        display: "flex",
        padding: "0 40px",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <span>Q.{props.index + 1}</span>
      <div
        style={{
          padding: "8px",
          display: "flex",
          justifyContent: "space-evenly",
          alignItems: "center",
          gap: "5px",
          border: "1px solid #d3d3d3",
          height: "56px",
          width: "150px",
          borderRadius: "6px",
          marginLeft: "10px",
        }}
      >
        <NumberInput
          value={getMarks()}
          precision={2}
          onChange={(e) => {
            if (e) {
              if (
                props.type === QuestionType.LongQues.type ||
                props.type === QuestionType.ShortQues.type
              )
                props.handleMarksChange(e, findIndex());
              if (props.type === QuestionType.McqQues.type)
                props.handlemcqbasedMarks(e, findIndex());
              if (props.type === QuestionType.CaseQues.type)
                props.handlecaseBasedMarks(e, findIndex());
            }
          }}
          min={0.0}
          max={Number(props.totalMarks)}
          style={{
            width: "70px",
          }}
          hideControls
        />
        <span
          style={{
            fontSize: "40px",
            fontWeight: "200",
          }}
        >
          /
        </span>
        <span>{props.totalMarks}</span>
      </div>
    </div>
  );
}
export function TestResponses(props: TestResponses) {
  const [answerSheet, setAnswerSheet] = useState<any>();
  const isMd = useMediaQuery(`(max-width: 1200px)`);
  const isSm = useMediaQuery(`(max-width: 820px)`);
  const [viewPdf, setViewPdf] = useState(true);
  const [questionMarks, setQuestionMarks] = useState<MarksQuestionArray[]>([]);
  const [mcqQuestions, setMcqQuestions] = useState<
    {
      isCorrect: boolean;
      option: number;
      question_id: string;
      marks: number;
    }[]
  >([]);

  const [mcqMarkQuestions, setMcqMarkQuestions] = useState<
    {
      isCorrect: boolean;
      option: number;
      question_id: string;
      marks: number;
    }[]
  >([]);
  const [caseMarkQuestions, setCaseMarkQuestions] = useState<
    {
      isCorrect: boolean;
      option: number;
      question_id: string;
      marks: number;
    }[]
  >([]);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [questionsMap, setQuestionsMap] = useState(new Map());
  const [test, setTest] = useState<any>();

  useEffect(() => {
    if (props.test !== undefined && props.test !== null) {
      fetchFullTest(props.test._id)
        .then((data: any) => {
          setTest(data);
        })
        .catch((error: any) => {
          console.log(error);
        });
    }
  }, [props.test]);

  useEffect(() => {
    if (test !== undefined && test !== null) {
      const updatedMap = new Map(questionsMap);
      test.questions.forEach((x: any) => {
        updatedMap.set(x._id, x);
      });

      test.subjectiveQuestions.forEach((x: any) => {
        updatedMap.set(x._id, x);
      });

      test.casebasedquestions.forEach((x: any) => {
        updatedMap.set(x._id, x);
      });
      setQuestionsMap(updatedMap);
    }
  }, [test]);

  function displayResponse(responseId: string | null) {
    if (responseId === null) {
      setAnswerSheet(undefined);
    }
    if (props.test.answerSheets.some((obj: any) => obj._id === responseId)) {
      setAnswerSheet(
        props.test.answerSheets.find((x: any) => {
          return x._id === responseId;
        })
      );
    } else {
      setAnswerSheet(undefined);
    }
  }
  const bodyData = {
    questions: [
      { _id: "1", marks: 10 },
      { _id: "2", marks: 15 },
    ],
  };
  const handleMarksChange = (val: number, index: number) => {
    const updatedQuestionMarks = [...questionMarks];

    updatedQuestionMarks[index] = {
      ...updatedQuestionMarks[index],
      marks: val,
    };

    setQuestionMarks(updatedQuestionMarks);
    // }
  };
  const handleMCQMarkChange = (val: number, index: number) => {
    const updatedQuestionMarks = [...mcqMarkQuestions];

    updatedQuestionMarks[index] = {
      ...updatedQuestionMarks[index],
      marks: val,
    };

    setMcqMarkQuestions(updatedQuestionMarks);
    // }
  };
  const handleCaseMarkChange = (val: number, index: number) => {
    const updatedQuestionMarks = [...caseMarkQuestions];

    updatedQuestionMarks[index] = {
      ...updatedQuestionMarks[index],
      marks: val,
    };
    setCaseMarkQuestions(updatedQuestionMarks);
    // }
  };

  const submitClickHandler = async () => {
    setIsLoading(true);
    if (questionMarks) {
      try {
        const updatedQuestionMarksARRAY = questionMarks.map(
          ({ _id, marks }) => ({ _id, marks })
        );

        const updatedBodyData = updatedQuestionMarksARRAY;

        submitUpdatedAnswers(
          updatedBodyData,
          answerSheet._id,
          mcqQuestions,
          mcqMarkQuestions,
          caseMarkQuestions,
          props.test.pdfLink ?? null
        )
          .then((x) => {
            setIsLoading(false);
            props.onBackClick();
          })
          .catch((e) => {
            setIsLoading(false);
            console.log(e);
            props.onBackClick();
          });
      } catch (err) {
        console.log(err);
      }
    }
  };

  useEffect(() => {
    setQuestionMarks(
      answerSheet?.subjectiveAnswers.map((x: any) => {
        return {
          _id: x.question_id,
          marks: x.marks,
          editMode: false,
        };
      })
    );
    if (answerSheet) {
      setMcqQuestions(answerSheet?.mcqAnswers);
      setMcqMarkQuestions(answerSheet?.mcqAnswers);
      setCaseMarkQuestions(answerSheet?.caseStudyAnswers);
    }
  }, [answerSheet]);
  useEffect(() => {
    if (props.test) {
      if (props.test.answerSheets.length > 0) {
        setAnswerSheet(props.test.answerSheets[0]);
      }
    }
  }, [props.test]);

  const [studentValue, setStudentValue] = useState("");

  useEffect(() => {
    if (
      props.test &&
      props.test.answerSheets &&
      props.test.answerSheets.length > 0
    ) {
      setStudentValue(props.test.answerSheets[0]?._id);
    }
  }, [props.test]);
  if (props.test === undefined || props.test === null) {
    return <></>;
  } else
    return (
      <>
        {!(props.test.answerSheets.length > 0) && (
          <>
            <Box
              w={isMd ? 30 : 40}
              mt={10}
              mr={5}
              onClick={props.onBackClick}
              style={{
                cursor: "pointer",
              }}
            >
              <BackButtonWithCircle />
            </Box>

            <Box w="100%" h="50vh">
              <Center h={"100%"} w={"100%"}>
                <Stack justify="center" align="center">
                  <img
                    src={require("../../../assets/empty result page.gif")}
                    height="140px"
                    width="140px"
                  />
                  <Text fw={500} fz={20} color="#C9C9C9">
                    No Responses found!
                  </Text>
                </Stack>
              </Center>
            </Box>
          </>
        )}
        {props.test.answerSheets.length > 0 && (
          <Stack w="100%">
            <Flex align="center" w="100%">
              <Center
                miw={40}
                mr={10}
                onClick={() => {
                  if (viewPdf === true) {
                    props.onBackClick();
                  } else {
                    setViewPdf(true);
                  }
                }}
                style={{
                  cursor: "pointer",
                }}
              >
                <BackButtonWithCircle />
              </Center>
              {/* )} */}
              <Title
                w={"90%"}
                order={isMd ? 3 : 1}
                fw={700}
                c={"#454545"}
                style={{
                  display: "flex",
                  alignContent: "center",
                }}
              >
                Responses
              </Title>
              <Select
                //label="Students"
                placeholder="SelectStudent"
                value={studentValue}
                data={[
                  ...props.test?.answerSheets.map((x: any) => {
                    return {
                      value: x._id,
                      label: x.student_id.name,
                    };
                  }),
                ]}
                w={isMd ? 180 : 250}
                onChange={(value) => {
                  Mixpanel.track(
                    WebAppEvents.TEACHER_APP_TEST_PAGE_RESPONSE_SECTION_STUDENT_SELECTED
                  );
                  displayResponse(value);
                  if (value) setStudentValue(value);
                }}
                styles={{
                  item: {
                    "&[data-selected]": {
                      "&, &:hover": {
                        backgroundColor: "#4B65F6",
                        color: "white",
                      },
                    },
                  },
                  input: {
                    "&:focus": {
                      borderColor: "#4B65F6",
                    },
                  },
                }}
              />
            </Flex>
            {answerSheet && !answerSheet.answerPdf && (
              <>
                <LoadingOverlay visible={isLoading} />
                <StudentResponses
                  test={props.test}
                  answerSheet={answerSheet}
                  questionMarks={questionMarks}
                  questions={questionMarks}
                  onChangecaseBasedMarks={handleCaseMarkChange}
                  onChangemcqbasedMarks={handleMarksChange}
                  onMarksValueChange={handleMarksChange}
                  onCaseBasedQuestionChange={handleCaseMarkChange}
                  onMCQmarksChange={handleMCQMarkChange}
                  caseMarks={caseMarkQuestions}
                  mcqQuestionMarks={mcqMarkQuestions}
                />
                {(props.test.subjectiveQuestions.length !== 0 ||
                  props.test.pdfLink) && (
                  <div
                    style={{
                      position: "fixed",
                      bottom: "0",
                      left: "0",
                      width: "100%",
                      height: "80px",
                      display: "flex",
                      justifyContent: "center",
                      background: "#E4F1FF",
                      zIndex: "5",
                      alignItems: "center",
                    }}
                  >
                    <Button
                      sx={{
                        width: "250px",
                        height: "50px",
                        backgroundColor: "#4b65f6",
                        fontSize: "18px",
                      }}
                      onClick={submitClickHandler}
                    >
                      Submit{" "}
                      <IconArrowNarrowRight style={{ marginLeft: "10px" }} />
                    </Button>
                  </div>
                )}
              </>
            )}
            {answerSheet && answerSheet.answerPdf && isMd ? (
              <>
                {viewPdf ? (
                  <>
                    {answerSheet && answerSheet.answerPdf && (
                      <PdfViewer
                        url={answerSheet.answerPdf}
                        showOptions={true}
                      />
                    )}

                    {/* <div style={{ width: "100%", backgroundColor: "blue" }}> */}

                    {/* </div> */}
                  </>
                ) : (
                  <Stack
                    pl={10}
                    style={{
                      // border: "red solid 1px",
                      height: "calc(100vh - 180px)",
                      // position: "fixed",
                      right: 0,
                      // overflowY: "auto",
                      width: "100%",
                      // marginTop: "45px",
                    }}
                  >
                    {props.test.sections.map((y: any) => {
                      return (
                        <Stack>
                          <Text>{y.name}</Text>
                          {y.questions.map((x: any, index: number) => {
                            const question = questionsMap.get(x);
                            return (
                              <Pdfinputmarks
                                type={question.type}
                                index={index}
                                questionId={question._id}
                                test={test}
                                answerSheet={answerSheet}
                                handleMarksChange={handleMarksChange}
                                handlemcqbasedMarks={handleMCQMarkChange}
                                handlecaseBasedMarks={handleCaseMarkChange}
                                totalMarks={question.totalMarks}
                              />
                            );
                          })}
                        </Stack>
                      );
                    })}
                  </Stack>
                )}
                <div
                  style={{
                    position: "fixed",
                    width: "100%",
                    boxShadow: "0px -10px 9px 0px #0000000A",
                    bottom: "60px",
                    left: "0",
                    height: "60px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    background: "white",
                    zIndex: "5",
                    // border: "red solid 1px",
                  }}
                >
                  {/* {!props.test.isSamplePaper && ( */}
                  <Button
                    sx={{
                      width: "90%",
                      height: "50px",
                      background: "#4b65f6",
                      fontSize: "18px",
                    }}
                    style={{}}
                    onClick={() => setViewPdf((prev) => !prev)}
                  >
                    {viewPdf ? "Update Marks" : "Back to PDF"}
                  </Button>
                  {/* )} */}
                </div>
              </>
            ) : (
              <>
                {answerSheet &&
                  answerSheet.answerPdf &&
                  questionsMap.size !== 0 && (
                    <>
                      <Flex>
                        <Flex h={"100%"} w="calc(100% - 200px)">
                          <PdfViewer
                            url={answerSheet.answerPdf}
                            showOptions={true}
                          />
                        </Flex>
                        <Stack
                          pl={10}
                          style={{
                            // border: "red solid 1px",
                            height: "calc(100vh - 180px)",
                            position: "fixed",
                            right: 0,
                            overflowY: "auto",
                          }}
                        >
                          {props.test.sections.map((y: any) => {
                            return (
                              <Stack>
                                <Text>{y.name}</Text>
                                {y.questions.map((x: any, index: number) => {
                                  const question = questionsMap.get(x);
                                  return (
                                    <Pdfinputmarks
                                      type={question.type}
                                      index={index}
                                      questionId={question._id}
                                      test={test}
                                      answerSheet={answerSheet}
                                      handleMarksChange={handleMarksChange}
                                      handlemcqbasedMarks={handleMCQMarkChange}
                                      handlecaseBasedMarks={
                                        handleCaseMarkChange
                                      }
                                      totalMarks={question.totalMarks}
                                    />
                                  );
                                })}
                              </Stack>
                            );
                          })}
                        </Stack>
                      </Flex>
                      <div
                        style={{
                          position: "fixed",
                          width: "100%",
                          zIndex: "5",

                          bottom: "0",
                          left: "0",
                          height: "60px",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          background: "white",
                          boxShadow: "0px -10px 9px 0px #0000000A",
                        }}
                      >
                        <Button
                          sx={{
                            height: "50px",
                            background: "#4b65f6",
                            fontSize: "18px",
                            width: "30%",
                          }}
                          style={{}}
                          onClick={submitClickHandler}
                        >
                          Submit
                        </Button>
                      </div>
                    </>
                  )}
              </>
            )}
          </Stack>
        )}
      </>
    );
}
