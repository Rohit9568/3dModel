import {
  Box,
  Center,
  Divider,
  Flex,
  Progress,
  RingProgress,
  SimpleGrid,
  Stack,
  Text,
} from "@mantine/core";
import { useEffect, useState } from "react";
import { McqResponseCard } from "../TestQuestionsCards/McqResponsCard";
import { AnalysedTopic, AnalyzedTopicCard } from "../Test/TestAnalysis";
import { useMediaQuery } from "@mantine/hooks";
import { IconClock } from "../../_Icons/CustonIcons";
import { formatTime } from "../../../utilities/HelperFunctions";
import { SubjectiveQuestionResponseCard } from "../TestQuestionsCards/SubjectiveQuestionResponseCard";
import { PdfViewer } from "../FileUploadBox";
import { CaseQuestions } from "../../../_parentsApp/Components/ParentTest/SingleParentTest";
import { QuestionType } from "../../../@types/QuestionTypes.d";

interface SingleStudentAnalysis {
  test: any;
  answerSheet: any;
  maxTime: number;
  minTime: number;
  averageTime: number;
  setIsLoading: (input: boolean) => void;
}
export function SingleStudentAnalysis(props: SingleStudentAnalysis) {
  const isMd = useMediaQuery(`(max-width: 820px)`);
  const [analysedTopics, setanalysedTopics] = useState<AnalysedTopic[]>([]);
  const [averageMarks, setAveragemarks] = useState<number>(0);
  const [questionsMap, setQuestionsMap] = useState(new Map());
  useEffect(() => {
    const updatedMap = new Map(questionsMap);
    props.test.questions.forEach((x: any) => {
      updatedMap.set(x._id, x);
    });

    props.test.subjectiveQuestions.forEach((x: any) => {
      updatedMap.set(x._id, x);
    });

    props.test.casebasedquestions.forEach((x: any) => {
      updatedMap.set(x._id, x);
    });
    setQuestionsMap(updatedMap);
  }, [props.test]);
  function analyzeTests(test: any) {
    const questionMark = test.maxMarks / test.maxQuestions;
    props.setIsLoading(true);
    const initialTopicData: {
      topic_id: string;
      name: string;
      remediateText: string;
      marks: number;
      chapter_id: string;
      maxMarks: number;
    }[] = [];
    // test?.questions.map((mcq: any) => {
    //   const found = initialTopicData.find(
    //     (x) => x.topic_id === mcq.topic_id?._id
    //   );
    //   if (found) {
    //     found.maxMarks += questionMark;
    //   } else {
    //     initialTopicData.push({
    //       topic_id: mcq.topic_id?._id,
    //       name: mcq.topic_id?.name,
    //       remediateText: mcq.topic_id?.remediateText,
    //       marks: 0,
    //       maxMarks: questionMark,
    //       chapter_id: mcq.topic_id.chapterId,
    //     });
    //   }
    // });
    // test?.casebasedquestions.map((cbq: any) => {
    //   const found = initialTopicData.find(
    //     (x) => x.topic_id === cbq.topic_id?._id
    //   );
    //   if (found) {
    //     found.maxMarks += questionMark;
    //   } else {
    //     initialTopicData.push({
    //       topic_id: cbq.topic_id?._id,
    //       name: cbq.topic_id?.name,
    //       remediateText: cbq.topic_id?.remediateText,
    //       marks: 0,
    //       maxMarks: questionMark,
    //       chapter_id: cbq.topic_id.chapterId,
    //     });
    //   }
    // });
    // test?.subjectiveQuestions.map((que: any) => {
    //   // initialdata.push({ mcquestion_id: que._id, correct: 0 });
    //   const found = initialTopicData.find(
    //     (x) => x.topic_id === que.topic_id?._id
    //   );
    //   if (found) {
    //     found.maxMarks += questionMark;
    //   } else {
    //     initialTopicData.push({
    //       topic_id: que.topic_id?._id,
    //       name: que.topic_id?.name,
    //       remediateText: que.topic_id?.remediateText,
    //       maxMarks: questionMark,
    //       marks: 0,
    //       chapter_id: que.topic_id.chapterId,
    //     });
    //   }
    // });

    //perquestion
    let marks: number = 0;
    // props.answerSheet.mcqAnswers.map((mcqanswer: any) => {
    //   const topic = initialTopicData.find(
    //     (topic) =>
    //       topic.topic_id ===
    //       test?.questions.find(
    //         (question: any) => question._id === mcqanswer.question_id
    //       )?.topic_id._id
    //   );
    //   if (topic && mcqanswer.isCorrect) {
    //     topic.marks += questionMark;
    //     marks += questionMark;
    //   }
    // });
    // props.answerSheet.subjectiveAnswers.map((que: any) => {
    //   // const question = initialdata.find(
    //   //   (x) => x.mcquestion_id === que.question_id
    //   // );
    //   // if (question) {
    //   marks += que.marks;
    //   const topic = initialTopicData.find(
    //     (topic) =>
    //       topic.topic_id ===
    //       test?.subjectiveQuestions.find(
    //         (question: any) => question._id === que.question_id
    //       )?.topic_id._id
    //   );
    //   if (topic) topic.marks += que.marks;
    //   // }
    // });

    // props.answerSheet.caseStudyAnswers.map((cbq: any) => {
    //   const topic = initialTopicData.find(
    //     (topic) =>
    //       topic.topic_id ===
    //       test?.casebasedquestions.find(
    //         (question: any) => question._id === cbq.question_id
    //       )?.topic_id._id
    //   );
    //   if (topic) {
    //     cbq.isCorrect.map((val: boolean) => {
    //       if (val) {
    //         topic.marks += questionMark / 4;
    //         marks += questionMark / 4;
    //       }
    //     });
    //   }
    // });
    marks += props.answerSheet.mcqMarks + props.answerSheet.subjectiveMarks;
    const analyzingTopic: AnalysedTopic[] = [];

    initialTopicData.map((topic) => {
      const percentCorrect = (topic.marks / topic.maxMarks) * 100;
      analyzingTopic.push({
        topic_id: topic.topic_id,
        name: topic.name,
        remediateText: topic.remediateText,
        correctPercentage: percentCorrect,
        chapter_id: topic.chapter_id,
      });
    });
    setAveragemarks(marks);
    setanalysedTopics(analyzingTopic);
    props.setIsLoading(false);
  }
  useEffect(() => {
    analyzeTests(props.test);
  }, [props.answerSheet]);

  return (
    <>
      <SimpleGrid cols={isMd ? 1 : 2}>
        <Stack
          style={{
            // filter: "drop-shadow(0px 0px 8px rgba(0, 0, 0, 0.25))",
            boxShadow: "0px 0px 8px rgba(0, 0, 0, 0.25)",
            borderRadius: "10px",
          }}

          // spacing={1}
        >
          <Stack spacing={1} ml={30} mt={10}>
            <Text fz={16} fw={400}>
              Score
            </Text>
            <Text fz={12} fw={400} color="#AFAFAF">
              See how well you did to know how ready you are!
            </Text>
          </Stack>
          <Divider color="#E5E7ED" size="md" />
          <Flex>
            <Flex w="50%" justify="center" align="center">
              <RingProgress
                size={isMd ? 120 : 120}
                rootColor="#3174F34D"
                thickness={isMd ? 10 : 12}
                sections={[
                  {
                    value:
                      ((averageMarks ?? 0) / (props.test.maxMarks ?? 1)) * 100,
                    color: "#4b65f6",
                  },
                ]}
                label={
                  <>
                    <Center>
                      <Stack spacing={0} justify="center" align="center">
                        <Text fz={isMd ? 12 : 14}>Marks</Text>
                        <Text fz={isMd ? 10 : 12} fw={700}>
                          {`${averageMarks ? averageMarks.toFixed(2) : 0} /
                          ${props.test?.maxMarks ?? 1}`}
                        </Text>
                      </Stack>
                    </Center>
                  </>
                }
              />
            </Flex>
            <Stack w="50%" justify="center" spacing={5} py={30} align="justify">
              <Text fz={14} fw={400}>
                Maximum Marks:
                {props.test?.maxMarks}
              </Text>
              <Text fz={14} fw={400}>
                Score Achieved:
                {averageMarks ? averageMarks.toFixed(2) : 0}
              </Text>
            </Stack>
          </Flex>
          <Stack spacing={1} mb={30} mx={30}>
            <Flex justify="space-between">
              <Text mb={6} fw={700}>
                Percentage
              </Text>
              <Text fw={700}>
                {`${(((averageMarks ?? 0) / props.test.maxMarks) * 100).toFixed(
                  2
                )}%`}
              </Text>
            </Flex>
            <Progress
              // radius="xl"
              size={16}
              w={"100%"}
              // striped
              value={((averageMarks ?? 0) / props.test.maxMarks) * 100}
              color="#4b65f6"
            />
          </Stack>
        </Stack>
        {props.answerSheet && props.answerSheet.answerPdf === null && (
          <Stack
            style={{
              // filter: "drop-shadow(0px 0px 8px rgba(0, 0, 0, 0.25))",
              boxShadow: "0px 0px 8px rgba(0, 0, 0, 0.25)",
              borderRadius: "10px",
            }}
            h="100%"
            spacing={1}
          >
            <Stack spacing={1} ml={30} mt={10}>
              <Text fz={16} fw={400}>
                Average Time Taken
              </Text>
              <Text fz={12} fw={400} color="#AFAFAF">
                See how long your students take to complete this test!
              </Text>
            </Stack>
            <Divider color="#E5E7ED" size="md" mt={13} />
            <Center w="100%" h="100%">
              <RingProgress
                size={isMd ? 200 : 200}
                rootColor="#3174F34D"
                thickness={isMd ? 10 : 12}
                sections={[
                  {
                    value: (props.answerSheet.timeTaken / props.maxTime) * 100,
                    color:
                      props.answerSheet.timeTaken / props.maxTime >
                      props.averageTime / props.maxTime
                        ? "red"
                        : "green",
                    //"#4b65f6",
                  },
                ]}
                label={
                  <>
                    <Stack
                      align="center"
                      justify="center"
                      py={isMd ? 20 : 0}
                      h="100%"
                    >
                      <IconClock />
                      <Stack spacing={1} justify="center" align="center">
                        <Text fw={600} fz={24}>
                          {formatTime(props.answerSheet.timeTaken)}
                        </Text>
                        <Text color="#7E7E7E" fz={18} fw={500} ta="center">
                          Time
                        </Text>
                      </Stack>
                    </Stack>
                  </>
                }
              />
            </Center>
          </Stack>
        )}
      </SimpleGrid>
      <Stack spacing={1} mt={20}>
        {/* <Text fz={19} fw={500}>
          Strong & Weak Topic
        </Text>
        <Stack>
          {analysedTopics.map((topic, index) => {
            return (
              <>
                {
                  <AnalyzedTopicCard
                    name={topic.name}
                    remediateText={topic.remediateText}
                    percent={topic.correctPercentage}
                    testDetails={props.test}
                    topic_id={topic.topic_id}
                    key={index}
                    chapter_id={topic.chapter_id}
                  />
                }
              </>
            );
          })}
        </Stack> */}
      </Stack>

      {props.answerSheet &&
        props.answerSheet.answerPdf === null &&
        (!props.test.isNewSectionType ||
          props.test.isNewSectionType === false) && (
          <Stack>
            {props.answerSheet &&
              props.answerSheet.answerPdf === null &&
              props.test.questions.map((question: any, index: number) => {
                return (
                  <>
                    <McqResponseCard
                      number={index + 1}
                      question={question.text}
                      answers={question.answers}
                      isMarkedCorrect={
                        props.answerSheet.mcqAnswers.find((x: any) => {
                          return x.question_id === question._id;
                        }).isCorrect
                      }
                      markedAnswer={
                        props.answerSheet.mcqAnswers.find((x: any) => {
                          return x.question_id === question._id;
                        }).option
                      }
                    />
                  </>
                );
              })}
            {props.answerSheet &&
              props.answerSheet.answerPdf === null &&
              props.test.subjectiveQuestions.map(
                (question: any, index: number) => {
                  return (
                    <>
                      <SubjectiveQuestionResponseCard
                        number={index + 1 + props.test.questions.length}
                        question={question.text}
                        answer={question.answer}
                        answerImageUrl={question.answerImageUrl}
                        questionImageUrl={question.questionImageUrl}
                        studentsAnswer={
                          props.answerSheet.subjectiveAnswers.find((x: any) => {
                            return x.question_id === question._id;
                          }).answerText
                        }
                        studentMarks={
                          props.answerSheet.subjectiveAnswers.find((x: any) => {
                            return x.question_id === question._id;
                          }).marks
                        }
                        maxMarks={props.test.maxMarks / props.test.maxQuestions}
                        isEdit={false}
                        isAnswerShown={false}
                      />
                    </>
                  );
                }
              )}
            {props.answerSheet &&
              props.answerSheet.answerPdf === null &&
              props.test.casebasedquestions.map(
                (question: any, index: number) => {
                  return (
                    <>
                      <CaseQuestions
                        question={question}
                        number={index + 1 + (props.test.questions.length ?? 0)}
                        selectedOption={
                          props.answerSheet.caseStudyAnswers.find((x: any) => {
                            return x.question_id === question._id;
                          }).option
                        }
                      />
                    </>
                  );
                }
              )}
          </Stack>
        )}

      {props.answerSheet && props.answerSheet.answerPdf !== null && (
        <Box>
          <Box fz={20} fw={600}>
            Answersheet
          </Box>
          <PdfViewer url={props.answerSheet.answerPdf} showOptions={true} />
        </Box>
      )}
      {props.answerSheet && props.answerSheet.answerPdf === null && (
        <Stack>
          {props.test.pdfLink !== null &&
            questionsMap.size !== 0 &&
            props.test.sections.map((y: any) => {
              return (
                <Stack>
                  <Text>{y.name}</Text>
                  {y.questions.map((x: any, index: number) => {
                    const question = questionsMap.get(x);
                    switch (question.type) {
                      case QuestionType.McqQues.type:
                        return (
                          <SubjectiveQuestionResponseCard
                            number={index + 1}
                            question={question.text}
                            answer={question.answer}
                            answerImageUrl={question.answerImageUrl}
                            questionImageUrl={question.questionImageUrl}
                            studentsAnswer={
                              props.answerSheet.mcqAnswers.find((x: any) => {
                                return x.question_id === question._id;
                              }).answerText
                            }
                            studentMarks={
                              props.answerSheet.mcqAnswers.find((x: any) => {
                                return x.question_id === question._id;
                              }).marks
                            }
                            maxMarks={
                              props.test.maxMarks / props.test.maxQuestions
                            }
                            isEdit={false}
                            isAnswerShown={false}
                          />
                        );
                      case QuestionType.LongQues.type:
                        return (
                          <SubjectiveQuestionResponseCard
                            number={index + 1}
                            question={question.text}
                            answer={question.answer}
                            answerImageUrl={question.answerImageUrl}
                            questionImageUrl={question.questionImageUrl}
                            studentsAnswer={
                              props.answerSheet.subjectiveAnswers.find(
                                (x: any) => {
                                  return x.question_id === question._id;
                                }
                              )?.answerText
                            }
                            studentMarks={
                              props.answerSheet.subjectiveAnswers.find(
                                (x: any) => {
                                  return x.question_id === question._id;
                                }
                              ).marks
                            }
                            maxMarks={
                              props.test.maxMarks / props.test.maxQuestions
                            }
                            isEdit={false}
                            isAnswerShown={false}
                          />
                        );
                      case QuestionType.ShortQues.type:
                        return (
                          <SubjectiveQuestionResponseCard
                            number={index + 1}
                            question={question.text}
                            answer={question.answer}
                            answerImageUrl={question.answerImageUrl}
                            questionImageUrl={question.questionImageUrl}
                            studentsAnswer={
                              props.answerSheet.subjectiveAnswers.find(
                                (x: any) => {
                                  return x.question_id === question._id;
                                }
                              ).answerText
                            }
                            studentMarks={
                              props.answerSheet.subjectiveAnswers.find(
                                (x: any) => {
                                  return x.question_id === question._id;
                                }
                              ).marks
                            }
                            maxMarks={
                              props.test.maxMarks / props.test.maxQuestions
                            }
                            isEdit={false}
                            isAnswerShown={false}
                          />
                        );
                      case QuestionType.CaseQues.type:
                        return (
                          <SubjectiveQuestionResponseCard
                            number={index + 1}
                            question={question.caseStudyText}
                            answer={question.answer}
                            answerImageUrl={question.answerImageUrl}
                            questionImageUrl={question.questionImageUrl}
                            studentsAnswer={
                              props.answerSheet.caseStudyAnswers.find(
                                (x: any) => {
                                  return x.question_id === question._id;
                                }
                              ).answerText
                            }
                            studentMarks={
                              props.answerSheet.caseStudyAnswers.find(
                                (x: any) => {
                                  return x.question_id === question._id;
                                }
                              ).marks
                            }
                            maxMarks={
                              props.test.maxMarks / props.test.maxQuestions
                            }
                            isEdit={false}
                            isAnswerShown={false}
                          />
                        );
                    }
                  })}
                </Stack>
              );
            })}
          {props.test.pdfLink === null &&
            questionsMap.size !== 0 &&
            props.test.sections.map((y: any) => {
              return (
                <Stack>
                  <Text>{y.name}</Text>
                  {y.questions.map((x: any, index: number) => {
                    const question = questionsMap.get(x);
                    switch (question.type) {
                      case QuestionType.McqQues.type:
                        return (
                          <McqResponseCard
                            number={index + 1}
                            question={question.text}
                            answers={question.answers}
                            isMarkedCorrect={
                              props.answerSheet.mcqAnswers.find((x: any) => {
                                return x.question_id === question._id;
                              }).isCorrect
                            }
                            markedAnswer={
                              props.answerSheet.mcqAnswers.find((x: any) => {
                                return x.question_id === question._id;
                              }).option
                            }
                          />
                        );
                      case QuestionType.LongQues.type:
                        return (
                          <SubjectiveQuestionResponseCard
                            number={index + 1}
                            question={question.text}
                            answer={question.answer}
                            answerImageUrl={question.answerImageUrl}
                            questionImageUrl={question.questionImageUrl}
                            studentsAnswer={
                              props.answerSheet.subjectiveAnswers.find(
                                (x: any) => {
                                  return x.question_id === question._id;
                                }
                              ).answerText
                            }
                            studentMarks={
                              props.answerSheet.subjectiveAnswers.find(
                                (x: any) => {
                                  return x.question_id === question._id;
                                }
                              ).marks
                            }
                            maxMarks={
                              props.test.maxMarks / props.test.maxQuestions
                            }
                            isEdit={false}
                            isAnswerShown={true}
                          />
                        );
                      case QuestionType.ShortQues.type:
                        return (
                          <SubjectiveQuestionResponseCard
                            number={index + 1}
                            question={question.text}
                            answer={question.answer}
                            answerImageUrl={question.answerImageUrl}
                            questionImageUrl={question.questionImageUrl}
                            studentsAnswer={
                              props.answerSheet.subjectiveAnswers.find(
                                (x: any) => {
                                  return x.question_id === question._id;
                                }
                              ).answerText
                            }
                            studentMarks={
                              props.answerSheet.subjectiveAnswers.find(
                                (x: any) => {
                                  return x.question_id === question._id;
                                }
                              ).marks
                            }
                            maxMarks={
                              props.test.maxMarks / props.test.maxQuestions
                            }
                            isEdit={false}
                            isAnswerShown={true}
                          />
                        );
                      case QuestionType.CaseQues.type:
                        return (
                          <CaseQuestions
                            question={question}
                            number={
                              index + 1 + (props.test.questions.length ?? 0)
                            }
                            selectedOption={
                              props.answerSheet.caseStudyAnswers.find(
                                (x: any) => {
                                  return x.question_id === question._id;
                                }
                              ).option
                            }
                          />
                        );
                    }
                  })}
                </Stack>
              );
            })}
        </Stack>
      )}
    </>
  );
}
