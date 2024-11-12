import { Carousel, Embla, useAnimationOffsetEffect } from "@mantine/carousel";
import {
  Box,
  Button,
  Center,
  Divider,
  Flex,
  Modal,
  ScrollArea,
  SimpleGrid,
  Stack,
  Text,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { showNotification } from "@mantine/notifications";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { QuestionType } from "../../../@types/QuestionTypes.d";
import { RootState } from "../../../store/ReduxStore";
import { formatTimewithSecondsFormatting } from "../../../utilities/HelperFunctions";
import { StudentTestQuestionPanel } from "./StudentTestPanel";
import { useNavigate } from "react-router-dom";
import { InstructionsPointsPage } from "./SingleParentTest";
import ShowAllQuestions from "./ShowAllQuestions";
import { CalculatorModal } from "./CalculatorModal";
import React from "react";
import { CountDown } from "./Countdown";

enum QuestionStatus {
  MARKFORREVIEW,
  ANSWERED,
  NOTANSWERED,
  NOTVISITED,
  MARKFORREVIEWANSWERED,
}

function getQuestionStatusImage(status: QuestionStatus) {
  switch (status) {
    case QuestionStatus.ANSWERED:
      return require("../../../assets/Rectangle 3737.png");
    case QuestionStatus.NOTANSWERED:
      return require("../../../assets/Rectangle 3736.png");
    case QuestionStatus.NOTVISITED:
      return require("../../../assets/Rectangle 3735.png");
    case QuestionStatus.MARKFORREVIEW:
      return require("../../../assets/Ellipse 847.png");
    case QuestionStatus.MARKFORREVIEWANSWERED:
      return require("../../../assets/Group 40815.png");
  }
}
export function FillAnswersPage(props: {
  testDetails: FullTest;
  onNextButtonClick: (studentTestAnswerSheet: StudentTestAnswerSheet) => void;
  isNav: (val: boolean) => void;
}) {
  const isMd = useMediaQuery(`(max-width: 968px)`);

  const [currentTestScenario, setCurrentTestScenario] = useState<{
    superSectionIndex: number;
    sectionIndex: number;
    questionIndex: number;
    childQuestionIndex: number;
  }>({
    superSectionIndex: 0,
    sectionIndex: 0,
    questionIndex: 0,
    childQuestionIndex: 0,
  });

  const [currentQuestion, setCurrentQuestion] = useState<
    McqQuestion | SubjectiveQuestion
  >();

  const [currentAttemptOrder, setCurrentAttemptOrder] = useState<number>(0);

  const [entryTime, setEntryTime] = useState<number>(Date.now());


  const [studentTestAnswerSheet, setStudentTestAnswerSheet] =
    useState<StudentTestAnswerSheet>();

  //Run as soon as you enter the component

  useEffect(() => {
    const studentTestAnsweredQuestions: StudentTestAnsweredQuestions[] = [];

    props.testDetails.superSections.forEach((superSection) => {
      //search super section then section and then add questions according to order
      superSection.sections.forEach((sectionId) => {
        props.testDetails.sections
          .find((section: TestSectionWithQuestionsIds) => {
            return section._id == sectionId;
          })
          ?.questions.forEach((questionId: string) => {
            let question: McqQuestion | SubjectiveQuestion | CaseBasedQuestion;
            if (
              props.testDetails.questions.findIndex((question) => {
                return question._id == questionId;
              }) != -1
            ) {
              question = props.testDetails.questions.find((question) => {
                return question._id == questionId;
              })!!;
              studentTestAnsweredQuestions.push({
                questionId: question._id,
                questionType: question.type,
                sectionId: sectionId,
                sectionName: props.testDetails.sections.find(
                  (section: TestSectionWithQuestionsIds) => {
                    return section.questions.indexOf(question._id) != -1;
                  }
                )!!.name,
                superSectionId: superSection._id,
                superSectionName: superSection.name,
                questionIndex: studentTestAnsweredQuestions.length,
                timeSpent: 0,
                studentAnswer: null,
                correctAnswer: question.answers.findIndex((answer: any) => {
                  return answer.isCorrect == true;
                }),
                status: QuestionStatus.NOTVISITED,
                marks: question.totalMarks,
                negativeMarks: question.totalNegativeMarks,
                attemptOrder: -1,
              });
            } else if (
              props.testDetails.subjectiveQuestions.findIndex((question) => {
                return question._id == questionId;
              }) != -1
            ) {
              question = props.testDetails.subjectiveQuestions.find(
                (question) => {
                  return question._id == questionId;
                }
              )!!;
              studentTestAnsweredQuestions.push({
                questionId: question._id,
                questionType: question.type,
                sectionId: sectionId,
                sectionName: props.testDetails.sections.find(
                  (section: TestSectionWithQuestionsIds) => {
                    return section.questions.indexOf(question._id) != -1;
                  }
                )!!.name,
                superSectionId: superSection._id,
                superSectionName: superSection.name,
                questionIndex: studentTestAnsweredQuestions.length,
                timeSpent: 0,
                studentAnswer: null,
                correctAnswer: question.answer,
                status: QuestionStatus.NOTVISITED,
                marks: question.totalMarks,
                negativeMarks: question.totalNegativeMarks,
                attemptOrder: -1,
              });
            } else if (
              props.testDetails.casebasedquestions.findIndex((question) => {
                return question._id == questionId;
              }) != -1
            ) {
              question = props.testDetails.casebasedquestions.find(
                (question) => {
                  return question._id == questionId;
                }
              )!!;
              question.questions.forEach(
                (childQuestion: McqQuestion | SubjectiveQuestion) => {
                  studentTestAnsweredQuestions.push({
                    questionId: childQuestion._id,
                    questionType: childQuestion.type,
                    sectionId: sectionId,
                    sectionName: props.testDetails.sections.find(
                      (section: TestSectionWithQuestionsIds) => {
                        return section.questions.indexOf(question._id) != -1;
                      }
                    )!!.name,
                    superSectionId: superSection._id,
                    superSectionName: superSection.name,
                    questionIndex: studentTestAnsweredQuestions.length,
                    correctAnswer:
                      childQuestion.type == QuestionType.McqQues.type
                        ? (childQuestion as McqQuestion).answers.findIndex(
                            (answer: any) => {
                              return answer.isCorrect == true;
                            }
                          )
                        : (childQuestion as SubjectiveQuestion).answer,
                    timeSpent: 0,
                    studentAnswer: null,
                    status: QuestionStatus.NOTVISITED,
                    parentQuestionId: question._id,
                    marks: childQuestion.totalMarks,
                    negativeMarks: childQuestion.totalNegativeMarks,
                    attemptOrder: -1,
                  });
                }
              );
            }
          });
      });
    });

    setStudentTestAnswerSheet({
      timeTakenToSubmit: 0,
      questions: studentTestAnsweredQuestions,
    });

    onTestScenarioUpdated(currentTestScenario);
    if (props.testDetails.isNextSuperSectionClickablebeforeTime) {
      setTimer([parseInt(props.testDetails.duration)]);
    } else {
      setTimer([
        parseInt(
          props.testDetails.superSections[currentTestScenario.superSectionIndex]
            .totalTime
        ),
      ]);
    }
  }, []);

  useEffect(() => {
    onTestScenarioUpdated(currentTestScenario);
  }, [currentTestScenario]);

  useEffect(() => {
    studentTestAnswerSheet?.questions.forEach((q) => {
      if (
        q.questionId == currentQuestion?._id &&
        q.attemptOrder == -1 &&
        currentAttemptOrder < studentTestAnswerSheet.questions.length
      ) {
        q.attemptOrder = currentAttemptOrder + 1;
        setCurrentAttemptOrder(currentAttemptOrder + 1);
      }
    });
  }, [currentQuestion]);

  function onTestScenarioUpdated(currentTestScenario: {
    superSectionIndex: number;
    sectionIndex: number;
    questionIndex: number;
    childQuestionIndex: number;
  }) {
    const currentSectionId =
      props.testDetails.superSections[currentTestScenario.superSectionIndex]
        .sections[currentTestScenario.sectionIndex];

    props.testDetails.sections.forEach(
      (section: TestSectionWithQuestionsIds) => {
        if (section._id == currentSectionId) {
          const currentQuestionId =
            section.questions[currentTestScenario.questionIndex];
          //In future convert it into single questions
          props.testDetails.questions.forEach((question: McqQuestion) => {
            if (question._id == currentQuestionId) {
              setCurrentQuestion(question);
            }
          });
          props.testDetails.subjectiveQuestions.forEach(
            (question: SubjectiveQuestion) => {
              if (question._id == currentQuestionId) {
                setCurrentQuestion(question);
              }
            }
          );
          props.testDetails.casebasedquestions.forEach(
            (question: CaseBasedQuestion) => {
              if (question._id == currentQuestionId) {
                question.questions[
                  currentTestScenario.childQuestionIndex
                ].parentQuestionId = currentQuestionId;
                question.questions[
                  currentTestScenario.childQuestionIndex
                ].parentQuestionText = question.caseStudyText;
                setCurrentQuestion(
                  question.questions[currentTestScenario.childQuestionIndex]
                );
              }
            }
          );
        }
      }
    );
  }

  const onSaveAndNextButtonClick = () => {
    const modifiedCurrentScenario = {
      superSectionIndex: currentTestScenario.superSectionIndex,
      sectionIndex: currentTestScenario.sectionIndex,
      questionIndex: currentTestScenario.questionIndex,
      childQuestionIndex: currentTestScenario.childQuestionIndex,
    };
    let exitFunction = false;
    if (currentQuestion?.parentQuestionId) {
      props.testDetails.casebasedquestions.forEach(
        (question: CaseBasedQuestion) => {
          if (
            question._id == currentQuestion.parentQuestionId &&
            question.questions.length >
              modifiedCurrentScenario.childQuestionIndex + 1
          ) {
            exitFunction = true;
            modifiedCurrentScenario.childQuestionIndex++;
            setCurrentTestScenario(modifiedCurrentScenario);
            return;
          }
        }
      );
    }
    if (exitFunction) return;

    const currentSection = props.testDetails.sections.find(
      (section: TestSectionWithQuestionsIds) => {
        return (
          props.testDetails.superSections[
            modifiedCurrentScenario.superSectionIndex
          ].sections.indexOf(section._id) != -1
        );
      }
    );

    if (
      (currentSection?.questions.length ?? 0) >
      currentTestScenario.questionIndex + 1
    ) {
      modifiedCurrentScenario.questionIndex++;
      modifiedCurrentScenario.childQuestionIndex = 0;
      setCurrentTestScenario(modifiedCurrentScenario);
    } else if (
      props.testDetails.superSections[currentTestScenario.superSectionIndex]
        .sections.length >
      currentTestScenario.sectionIndex + 1
    ) {
      modifiedCurrentScenario.sectionIndex++;
      modifiedCurrentScenario.questionIndex = 0;
      modifiedCurrentScenario.childQuestionIndex = 0;
      setCurrentTestScenario(modifiedCurrentScenario);
    } else if (
      props.testDetails.superSections.length >
      currentTestScenario.superSectionIndex + 1
    ) {
      if (props.testDetails.isNextSuperSectionClickablebeforeTime == true) {
        modifiedCurrentScenario.superSectionIndex++;
        modifiedCurrentScenario.sectionIndex = 0;
        modifiedCurrentScenario.questionIndex = 0;
        modifiedCurrentScenario.childQuestionIndex = 0;
      } else {
        showNotification({
          message: "You can't change the section before the time is over",
        });
      }
      setCurrentTestScenario(modifiedCurrentScenario);
    } else {
      setCurrentTestScenario(modifiedCurrentScenario);
    }
  };

  function jumpToQuestion(questionId: string) {
    const modifiedCurrentScenario = {
      superSectionIndex: currentTestScenario.superSectionIndex,
      sectionIndex: currentTestScenario.sectionIndex,
      questionIndex: currentTestScenario.questionIndex,
      childQuestionIndex: currentTestScenario.childQuestionIndex,
    };

    const questionToJump = studentTestAnswerSheet?.questions.find(
      (question: StudentTestAnsweredQuestions) => {
        if (question.questionId == questionId) return question;
      }
    );
    if (questionToJump!!.parentQuestionId) {
      props.testDetails.sections.forEach((section) => {
        if (
          section.questions.indexOf(questionToJump!!.parentQuestionId!!) != -1
        ) {
          modifiedCurrentScenario.childQuestionIndex =
            props.testDetails.casebasedquestions
              .find((question) => {
                return questionToJump!!.parentQuestionId!! == question._id;
              })!!
              .questions.findIndex((childQuestion) => {
                return childQuestion._id == questionToJump!!.questionId!!;
              });

          modifiedCurrentScenario.questionIndex = section.questions.indexOf(
            questionToJump!!.parentQuestionId ?? ""
          );

          //setting section index
          props.testDetails.superSections.forEach((superSection) => {
            if (superSection.sections.indexOf(section._id) != -1) {
              modifiedCurrentScenario.sectionIndex =
                superSection.sections.indexOf(section._id);
            }
          });

          //setting section index
          modifiedCurrentScenario.superSectionIndex =
            props.testDetails.superSections.findIndex((superSection) => {
              return superSection.sections.indexOf(section._id) != -1;
            });
        }
      });
    } else if (questionToJump != null) {
      props.testDetails.sections.forEach((section) => {
        if (section.questions.indexOf(questionToJump!!.questionId) != -1) {
          //setting question index
          modifiedCurrentScenario.childQuestionIndex = 0;
          modifiedCurrentScenario.questionIndex = section.questions.indexOf(
            questionToJump!!.questionId
          );

          //setting section index
          props.testDetails.superSections.forEach((superSection) => {
            if (superSection.sections.indexOf(section._id) != -1) {
              modifiedCurrentScenario.sectionIndex =
                superSection.sections.indexOf(section._id);
            }
          });

          //setting super section index
          modifiedCurrentScenario.superSectionIndex =
            props.testDetails.superSections.findIndex((superSection) => {
              return superSection.sections.indexOf(section._id) != -1;
            });
        }
      });
    }
    const questionFromStudentAnswerSheetArray: StudentTestAnsweredQuestions | undefined =
      studentTestAnswerSheet?.questions.find((iq) => {
        return iq.questionId == currentQuestion?._id;
      });
      if(questionFromStudentAnswerSheetArray)
      questionFromStudentAnswerSheetArray!!.timeSpent+=((Date.now()- entryTime)/1000);

      if(questionFromStudentAnswerSheetArray && questionFromStudentAnswerSheetArray.status == QuestionStatus.NOTVISITED){
        questionFromStudentAnswerSheetArray.status = QuestionStatus.NOTANSWERED
      }

    setCurrentTestScenario(modifiedCurrentScenario);
  }

  function getCurrentSuperSectionQuestions(): (
    | McqQuestion
    | SubjectiveQuestion
    | CaseBasedQuestion
  )[] {
    const superSectionQuestionsArray: (
      | McqQuestion
      | SubjectiveQuestion
      | CaseBasedQuestion
    )[] = [];

    props.testDetails.sections
      .filter((section: TestSectionWithQuestionsIds) => {
        return (
          props.testDetails.superSections[
            currentTestScenario.superSectionIndex
          ].sections.indexOf(section._id) != -1
        );
      })
      .forEach((section: TestSectionWithQuestionsIds) => {
        section.questions.forEach((questionId: string) => {
          if (
            props.testDetails.questions.find((question: McqQuestion) => {
              return question._id == questionId;
            }) != null
          ) {
            superSectionQuestionsArray.push(
              props.testDetails.questions.find((question: McqQuestion) => {
                return question._id == questionId;
              })!!
            );
          } else if (
            props.testDetails.subjectiveQuestions.find(
              (question: SubjectiveQuestion) => {
                return question._id == questionId;
              }
            ) != null
          ) {
            superSectionQuestionsArray.push(
              props.testDetails.subjectiveQuestions.find(
                (question: SubjectiveQuestion) => {
                  return question._id == questionId;
                }
              )!!
            );
          } else if (
            props.testDetails.casebasedquestions.find(
              (question: CaseBasedQuestion) => {
                return question._id == questionId;
              }
            ) != null
          ) {
            superSectionQuestionsArray.push(
              props.testDetails.casebasedquestions.find(
                (question: CaseBasedQuestion) => {
                  return question._id == questionId;
                }
              )!!
            );
          }
        });
      });

    return superSectionQuestionsArray;
  }

  const [embla, setEmbla] = useState<Embla | null>(null);
  const [isSubmitTestClicked, setIsSubmitTestClicked] =
    useState<boolean>(false);
  const TRANSITION_DURATION = 200;
  useAnimationOffsetEffect(embla, TRANSITION_DURATION);
  const [isInstructionsModalOpen, setIsInstructionsModalOpen] =
    useState<boolean>(false);
  const [isQuestionModalOpen, setIsQuestionModalOpen] =
    useState<boolean>(false);
  const [isCalculatorModalOpen, setIsCalculatorModalOpen] =
    useState<boolean>(false);

  const navigate = useNavigate();
  function handleRefreshState(e: any) {
    e.preventDefault();
    window.confirm("Are you sure you want to leave this page?");
    navigate(1);
  }
  useEffect(() => {
    window.addEventListener("beforeunload", handleRefreshState);
    window.addEventListener("popstate", handleRefreshState);
    props.isNav(false);
    return () => {
      window.removeEventListener("beforeunload", handleRefreshState);
      window.removeEventListener("popstate", handleRefreshState);
      props.isNav(true);
    };
  }, []);

  useEffect(() => {
    setTimeout(() => {
      if (typeof window?.MathJax !== "undefined") {
        window.MathJax.typesetClear();
        window.MathJax.typeset();
      }
    }, 500);
  }, [props.testDetails]);

  const instituteDetails = useSelector<RootState, InstituteDetails | null>(
    (state) => state.instituteDetailsSlice.instituteDetails
  );

  useEffect(() => {
    setTimeout(() => {
      if (typeof window?.MathJax !== "undefined") {
        window.MathJax.typesetClear();
        window.MathJax.typeset();
      }
    }, 500);
  }, [props.testDetails, currentQuestion]);

  const [timer, setTimer] = useState<number[]>();

  return (
    <>
      <Stack h={"100%"} spacing={0}>

      {!isMd && ( <Box h={"8%"}>
        
            <Flex w="100%" align="center" py={5} bg="#F4F6FE">
              <img
                src={instituteDetails?.iconUrl}
                alt="logo"
                style={{ height: "50px" }}
              />
              <Text fz={20} fw={700} ml={10}>
                {instituteDetails?.name}
              </Text>

              <Text fz={16} fw={500} ml={32}>
                Test Name - {props.testDetails.name}
              </Text>
            </Flex>
        </Box>
        )}

        <Flex
          justify={isMd ? "center" : "space-between"}
          direction={isMd ? "column" : "row"}
          h={isMd?"100%":"92%"}
        >
          {/* Questions Diplay Panel */}
          <Stack w={isMd ?"100%":"77%"} spacing={4}  h={isMd?"75%":"100%"} >
            <SimpleGrid cols={isMd?1:2} h={"5%"} w={"100%"}>
              <Flex style={{ cursor: "pointer" }} align={"center"}>
                <Text fz={16} fw={700}>
                  Section
                </Text>
                <img
                  src={require("../../../assets/instructions.png")}
                  style={{ marginLeft: "10px" }}
                  alt=""
                  onClick={() => {
                    setIsInstructionsModalOpen(true);
                  }}
                />
                <Text
                  color="blue"
                  ml={4}
                  onClick={() => {
                    setIsInstructionsModalOpen(true);
                  }}
                >
                  Instructions
                </Text>

                <img
                  src={require("../../../assets/questions.png")}
                  style={{ marginLeft: "10px" }}
                  alt=""
                  onClick={() => {
                    setIsQuestionModalOpen(true);
                  }}
                />

                <Text
                  color="#20AF2E"
                  style={{ cursor: "pointer" }}
                  ml={4}
                  onClick={() => {
                    setIsQuestionModalOpen(true);
                  }}
                >
                  Questions
                </Text>
                <img
                  src={require("../../../assets/calculator.png")}
                  width={15}
                  style={{ marginLeft: "15px" }}
                  alt=""
                  onClick={() => {
                    setIsCalculatorModalOpen(true);
                  }}
                />
                <Text
                  color="#CD8F31"
                  ml={4}
                  onClick={() => {
                    setIsCalculatorModalOpen(true);
                  }}
                >
                  Calculator
                </Text>
              </Flex>
              {timer != null && (
                <CountDown
                  duration={timer}
                  onTimerFinished={() => {

                    studentTestAnswerSheet?.questions.forEach((iq) => {
                       if(iq.questionId == currentQuestion?._id){
                        iq.timeSpent += (Date.now()-entryTime)/1000
                       }
                    });

                    if (
                      props.testDetails.isNextSuperSectionClickablebeforeTime
                    ) {
                      showNotification({
                        message: "Time Over For The Test",
                      });
                      props.onNextButtonClick(studentTestAnswerSheet!!);
                    } else {
                      if (
                        currentTestScenario.superSectionIndex + 1 >=
                        props.testDetails.superSections.length
                      ) {
                        showNotification({
                          message: "Time Over For The Test",
                        });
                        props.onNextButtonClick(studentTestAnswerSheet!!);
                      } else {
                        showNotification({
                          message: "Time Over For The Section",
                        });
                        const modifiedCurrentScenario = {
                          superSectionIndex:
                            currentTestScenario.superSectionIndex,
                          sectionIndex: currentTestScenario.sectionIndex,
                          questionIndex: currentTestScenario.questionIndex,
                          childQuestionIndex:
                            currentTestScenario.childQuestionIndex,
                        };
                        modifiedCurrentScenario.superSectionIndex++;
                        modifiedCurrentScenario.sectionIndex = 0;
                        modifiedCurrentScenario.questionIndex = 0;
                        modifiedCurrentScenario.childQuestionIndex = 0;
                        setTimer([
                          parseInt(
                            props.testDetails.superSections[
                              modifiedCurrentScenario.superSectionIndex
                            ].totalTime
                          ),
                        ]);
                        setCurrentTestScenario(modifiedCurrentScenario);
                      }
                    }
                  }}
                />
              )}
              <Modal
                opened={isQuestionModalOpen}
                onClose={() => {
                  setIsQuestionModalOpen(false);
                }}
                title="Questions"
                styles={{
                  title: {
                    fontSize: "20px",
                    fontWeight: 600,
                  },
                }}
                size="xl"
              >
                <ShowAllQuestions
                  allFilteredQuestions={getCurrentSuperSectionQuestions()}
                />
              </Modal>
              <Modal
                size={300}
                top={0}
                left={0}
                opened={isCalculatorModalOpen}
                onClose={() => {
                  setIsCalculatorModalOpen(false);
                }}
                title="Calculator"
                overlayOpacity={0}
                styles={{
                  modal: {
                    marginTop: "3rem",
                    top: "0%",
                    right: "28%",
                  },
                  title: {
                    fontSize: "20px",
                    fontWeight: 600,
                  },
                }}
              >
                <CalculatorModal />
              </Modal>
            </SimpleGrid>
            <Divider h={"5%"} size={2} />
              {props.testDetails && props.testDetails.pdfLink === null && (
                <Stack mb={12} h={isMd?"80%":"90%"}  >
                  {props.testDetails.superSections.length > 0 && (
                    <Flex h={isMd?"10%":"5%"} ml={isMd ? 8 : 10} mt={isMd?0:-7} gap={10}>
                      {props.testDetails.superSections.map(
                        (superSection, i) => {
                          return (
                            <Text
                              key={superSection._id}
                              fz={14}
                              fw={700}
                              p={8}
                              bg={
                                currentTestScenario.superSectionIndex === i
                                  ? "#4E85C5"
                                  : "rgba(78, 133, 197, 0.5)"
                              }
                              color={"white"}
                              onClick={() => {
                                if (
                                  props.testDetails
                                    .isNextSuperSectionClickablebeforeTime ===
                                  true
                                ) {
                                  const modifiedCurrentScenario = {
                                    superSectionIndex:
                                      currentTestScenario.superSectionIndex,
                                    sectionIndex:
                                      currentTestScenario.sectionIndex,
                                    questionIndex:
                                      currentTestScenario.questionIndex,
                                    childQuestionIndex:
                                      currentTestScenario.childQuestionIndex,
                                  };
                                  modifiedCurrentScenario.childQuestionIndex = 0;
                                  modifiedCurrentScenario.questionIndex = 0;
                                  modifiedCurrentScenario.sectionIndex = 0;
                                  modifiedCurrentScenario.superSectionIndex = i;
                                  setCurrentTestScenario(
                                    modifiedCurrentScenario
                                  );
                                } else {
                                  if (
                                    currentTestScenario.superSectionIndex === i
                                  )
                                    return;
                                  else {
                                    showNotification({
                                      message: "You can't change the section",
                                    });
                                  }
                                }
                              }}
                              style={{ cursor: "pointer", zIndex: 99 }}
                            >
                              {superSection.name}
                            </Text>
                          );
                        }
                      )}
                    </Flex>
                  )}
                  <Divider h={"5%"} size={2} mt={-12} />
                  {currentQuestion && (
                    <StudentTestQuestionPanel
                    currentQuestion={currentQuestion}
                    currentQuestionIndex={(studentTestAnswerSheet?.questions.findIndex(
                      (question) => {
                        return question.questionId == currentQuestion._id;
                      }
                    ) ?? -1) -
                      (studentTestAnswerSheet?.questions.findIndex((iq) => {
                        return (
                          iq.superSectionId ==
                          props.testDetails.superSections[currentTestScenario.superSectionIndex]._id
                        );
                      }) ?? -1)
                    }
                    studentAnswerSheet={studentTestAnswerSheet!!}
                    onMarkForReviewClicked={() => {
                      const testAnswerQuestion = studentTestAnswerSheet?.questions.find(
                        (question: StudentTestAnsweredQuestions) => {
                          return question.questionId == currentQuestion._id;
                        }
                      );
                      if (testAnswerQuestion?.studentAnswer != null) {
                        testAnswerQuestion.status =
                          QuestionStatus.MARKFORREVIEWANSWERED;
                        testAnswerQuestion.studentAnswer = null;
                      } else {
                        testAnswerQuestion!!.status =
                          QuestionStatus.MARKFORREVIEW;
                      }
                      setStudentTestAnswerSheet(
                        Object.assign({}, studentTestAnswerSheet)
                      );
                    } }
                    onClearResponseClicked={() => {
                      const testAnswerQuestion = studentTestAnswerSheet?.questions.find(
                        (question: StudentTestAnsweredQuestions) => {
                          return question.questionId == currentQuestion._id;
                        }
                      );
                      if (testAnswerQuestion) {
                        testAnswerQuestion.studentAnswer = null;
                        testAnswerQuestion.status = QuestionStatus.NOTVISITED;
                      }
                      setStudentTestAnswerSheet(
                        Object.assign({}, studentTestAnswerSheet)
                      );
                    } }
                    onSaveAndNextClicked={(
                      answer: string | number | number[] | null,
                      timeSpentThisTime: number
                    ) => {
                      const testAnswerQuestion = studentTestAnswerSheet?.questions.find(
                        (question: StudentTestAnsweredQuestions) => {
                          return question.questionId == currentQuestion._id;
                        }
                      );
                      if (answer != null) {
                        if (testAnswerQuestion) {
                          testAnswerQuestion.studentAnswer = answer;
                          testAnswerQuestion.status =
                            testAnswerQuestion.status ==
                              QuestionStatus.MARKFORREVIEW ||
                              testAnswerQuestion.status ==
                              QuestionStatus.MARKFORREVIEWANSWERED
                              ? QuestionStatus.MARKFORREVIEWANSWERED
                              : QuestionStatus.ANSWERED;
                          testAnswerQuestion.timeSpent += timeSpentThisTime;
                        }
                      } else {
                        if (testAnswerQuestion)
                          testAnswerQuestion.status =
                            testAnswerQuestion.status ==
                              QuestionStatus.MARKFORREVIEW
                              ? QuestionStatus.MARKFORREVIEW
                              : QuestionStatus.NOTANSWERED;
                      }
                      onSaveAndNextButtonClick();
                    } }
                    
                    entryTime={entryTime} setEntryTime={setEntryTime}
                                  />
                  )}
                </Stack>
              )}
          </Stack>

          {/* Questions numbering and status panel */}
          <Stack
            mt={isMd ? 10 : 0}pt={isMd ? 20 : 0}
            ml={isMd ? 0 : 10}
            style={{
              border: "1px solid #000000",
            }}
            w={isMd ?"100%":"22%"}
            h={isMd?"25%":"100%"}
          >
            <ScrollArea h="100%">
              <Flex ml={20} mt={15}>
                <Flex>
                  <img
                    src={require("../../../assets/questionstatus3.png")}
                    height="32px"
                    width="32px"
                    alt="Question status 1"
                  />
                  <Text mt={6} fz={10} fw={400} ml={5}>
                    Answered
                  </Text>
                </Flex>
                <Flex ml={20}>
                  <img
                    src={require("../../../assets/questionstatus2.png")}
                    height="32px"
                    width="32px"
                    alt="Question status 2"
                  />
                  <Text mt={6} fz={10} fw={400} ml={5}>
                    Not Answered
                  </Text>
                </Flex>
              </Flex>
              <Flex ml={20} mt={15}>
                <Flex>
                  <img
                    src={require("../../../assets/questionstatus1.png")}
                    height="32px"
                    width="32px"
                    alt="Question status 3"
                  />
                  <Text mt={6} fz={10} fw={400} ml={5}>
                    Not Visited
                  </Text>
                </Flex>
                <Flex ml={20}>
                  <img
                    src={require("../../../assets/questionstatus4.png")}
                    height="32px"
                    width="32px"
                    alt="Question status 4"
                  />
                  <Text mt={6} fz={10} fw={400} ml={5}>
                    Marked for Review
                  </Text>
                </Flex>
              </Flex>
              <Flex ml={20} mt={15} mb={10}>
                <Flex>
                  <img
                    src={require("../../../assets/questionstatus5.png")}
                    height="32px"
                    width="32px"
                    alt="Question status 5"
                  />
                  <Text mt={6} fz={10} fw={400} ml={5}>
                    Answered & Marked for Review (will be considered for
                    evaluation)
                  </Text>
                </Flex>
              </Flex>
              {currentTestScenario &&
                studentTestAnswerSheet?.questions
                  .filter((question) => {
                    return (
                      props.testDetails.superSections[
                        currentTestScenario.superSectionIndex
                      ].sections.indexOf(question.sectionId) != -1
                    );
                  })
                  .map((question, i) => {
                    if (i % 4 === 0) {
                      const groupQuestions =
                        studentTestAnswerSheet?.questions
                          .filter((question) => {
                            return (
                              props.testDetails.superSections[
                                currentTestScenario.superSectionIndex
                              ].sections.indexOf(question.sectionId) != -1
                            );
                          })
                          .slice(i, i + 4) ?? [];
                      return (
                        <Flex ml={15} mt={15} key={i}>
                          {groupQuestions.map((question, j) => (
                            <Center>
                              <Text
                                key={j}
                                ml={10}
                                mb={10}
                                onClick={() => {
                                  jumpToQuestion(question.questionId);
                                }}
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  cursor: "pointer",
                                }}
                              >
                                <div style={{ position: "relative" }}>
                                  <img
                                    src={getQuestionStatusImage(
                                      question.status
                                    )}
                                    height="48px"
                                    width="48px"
                                    alt={question.status.toString()}
                                    style={{
                                      margin: "auto",
                                      verticalAlign: "middle",
                                      display: "block",
                                    }}
                                  />
                                  <span
                                    style={{
                                      position: "absolute",
                                      top: "50%",
                                      left: "50%",
                                      transform: "translate(-50%, -50%)",
                                      fontWeight: "bold",
                                      color: "white",
                                    }}
                                  >
                                    {question.questionIndex -
                                      studentTestAnswerSheet?.questions.findIndex(
                                        (iq) => {
                                          return (
                                            iq.superSectionId ==
                                            question.superSectionId
                                          );
                                        }
                                      ) +
                                      1}
                                  </span>
                                </div>
                              </Text>
                            </Center>
                          ))}
                        </Flex>
                      );
                    }
                    return null;
                  })}
              <Divider size={"sm"} style={{ border: "1px solid #000000" }} />
              <Flex
                justify={"flex-end"}
                style={{
                  bottom: isMd ? 60 : 0,
                  width: "100%",
                  height: "80px",
                }}
                py={10}
              >
                <Button
                  onClick={() => {
                    setIsSubmitTestClicked(true);
                  }}
                  style={{
                    backgroundColor: "#38AAE9",
                  }}
                  mt={20}
                  mr={10}
                >
                  Submit
                </Button>
              </Flex>
            </ScrollArea>
          </Stack>
        </Flex>
      </Stack>

      <Modal
        opened={isInstructionsModalOpen}
        onClose={() => {
          setIsInstructionsModalOpen(false);
        }}
        title="Instructions"
        styles={{
          title: {
            fontSize: "20px",
            fontWeight: 600,
          },
        }}
        centered
      >
        <InstructionsPointsPage testDetails={props.testDetails} />
      </Modal>

      <Modal
        opened={isSubmitTestClicked}
        onClose={() => {
          setIsSubmitTestClicked(false);
        }}
        title="Submit Test"
        styles={{
          title: {
            fontSize: "20px",
            fontWeight: 600,
          },
        }}
        centered
      >
        <Text fz={20}>Are You sure want to submit the test?</Text>
        <Flex justify="right" w="100%">
          <Button
            onClick={() => {
              setIsSubmitTestClicked(false);
              studentTestAnswerSheet?.questions.forEach((iq) => {
                if(iq.questionId == currentQuestion?._id){
                 iq.timeSpent += (Date.now()-entryTime)/1000
                }
             });
              props.onNextButtonClick(studentTestAnswerSheet!!);
            }}
            mt={10}
            bg="#3174F3"
            size="md"
          >
            Submit
          </Button>
        </Flex>
      </Modal>
    </>
  );
}
