import {
  Box,
  Center,
  Divider,
  Flex,
  Progress,
  RingProgress,
  Select,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import {
  AnalysedMCQ,
  AnalysedTopic,
  AnalyzedTopicCard,
  MCQuestionCard,
} from "../Test/TestAnalysis";
import { SingleStudentAnalysis } from "./SingleStudentAnalysis";
import { IconArrowLeft } from "@tabler/icons";
import { useEffect, useState } from "react";
import { BackButtonWithCircle, IconClock } from "../../_Icons/CustonIcons";
import { Mixpanel } from "../../../utilities/Mixpanel/MixpanelHelper";
import { WebAppEvents } from "../../../utilities/Mixpanel/AnalyticeEventWebApp";
import { formatTime } from "../../../utilities/HelperFunctions";
import { CaseBasedQuestion, QuestionCard } from "../ContentTest";
import { CaseQuestions } from "../../../_parentsApp/Components/ParentTest/SingleParentTest";
import { PdfViewer } from "../FileUploadBox";

interface AnalyzedResultProps {
  test: any;
  setIsLoading: (input: boolean) => void;
  onBackClick: () => void;
}
export function AnalyzedResult(props: AnalyzedResultProps) {
  const isMd = useMediaQuery(`(max-width: 820px)`);
  const [currentId, setcurrentId] = useState<string | null>("ALL");
  const [analysedMCQs, setanalysedMCQs] = useState<AnalysedMCQ[]>([]);
  const [analysedTopics, setanalysedTopics] = useState<AnalysedTopic[]>([]);
  const [averageMarks, setAverageMarks] = useState<number>();
  const [averageTime, setAverageTime] = useState<number>(0);
  const [maxTime, setMaxTime] = useState<number>(0);
  const [minTime, setMinTime] = useState<number>(0);
  const [currentStudentANswerSheet, setCurrentStudentAnswersheet] =
    useState<any>();

  useEffect(() => {
    const singlestudentAnswerSheet = props.test?.answerSheets.find((x: any) => {
      return x._id === currentId;
    });
    setCurrentStudentAnswersheet(singlestudentAnswerSheet);
  }, [currentId]);
  useEffect(() => {
    setTimeout(() => {
      if (typeof window?.MathJax !== "undefined") {
        window.MathJax.typesetClear();
        window.MathJax.typeset();
      }
    }, 500);
  }, [currentStudentANswerSheet, props.test]);
  function analyzeTests(test: any) {
    props.setIsLoading(true);
    const initialdata: AnalysedMCQ[] = [];
    const initialTopicData: {
      topic_id: string;
      name: string;
      remediateText: string;
      marks: number;
      chapter_id: string;
      maxMarks: number;
    }[] = [];

    const questionMark = test.maxMarks / test.maxQuestions;
    test?.questions.map((mcq: any) => {
      initialdata.push({ mcquestion_id: mcq._id, correct: 0 });
      const found = initialTopicData.find(
        (x) => x.topic_id === mcq.topic_id?._id
      );
      if (found) {
        found.maxMarks += questionMark;
      } else {
        initialTopicData.push({
          topic_id: mcq.topic_id?._id,
          name: mcq.topic_id?.name,
          remediateText: mcq.topic_id?.remediateText,
          marks: 0,
          maxMarks: questionMark,
          chapter_id: mcq.topic_id.chapterId,
        });
      }
    });
    test?.subjectiveQuestions.map((que: any) => {
      const found = initialTopicData.find(
        (x) => x.topic_id === que.topic_id?._id
      );
      if (found) {
        found.maxMarks += questionMark;
      } else {
        initialTopicData.push({
          topic_id: que.topic_id?._id,
          name: que.topic_id?.name,
          remediateText: que.topic_id?.remediateText,
          maxMarks: questionMark,
          marks: 0,
          chapter_id: que.topic_id.chapterId,
        });
      }
    });
    test?.casebasedquestions.map((cbq: any) => {
      const found = initialTopicData.find(
        (x) => x.topic_id === cbq.topic_id?._id
      );
      if (found) {
        found.maxMarks += questionMark;
      } else {
        if (cbq.topic_id)
          initialTopicData.push({
            topic_id: cbq.topic_id?._id,
            name: cbq.topic_id?.name,
            remediateText: cbq.topic_id?.remediateText,
            marks: 0,
            maxMarks: questionMark,
            chapter_id: cbq.topic_id.chapterId,
          });
      }
    });
    //perquestion
    let totalMarks: number = 0;
    let totalTime = 0;
    let maxTime = 0;
    let minTime = test.answerSheets[0]?.timeTaken;
    test.answerSheets.map((answerSheet: any) => {
      let marks: number = 0;
      answerSheet.mcqAnswers.map((mcqanswer: any) => {
        if (mcqanswer.isCorrect === true) {
          const question = initialdata.find(
            (x) => x.mcquestion_id === mcqanswer.question_id
          );
          if (question) {
            marks += questionMark;
            question.correct += 1;
          }
        }
      });
      answerSheet.subjectiveAnswers.map((que: any) => {
        const question = initialdata.find(
          (x) => x.mcquestion_id === que.question_id
        );
        if (question) {
          marks += que.marks;
          question.correct += 1;
          // const topic = initialTopicData.find(
          //   (topic) =>
          //     topic.topic_id ===
          //     test?.subjectiveQuestions.find(
          //       (question: any) => question._id === que.question_id
          //     )?.topic_id._id
          // );

          // if (topic) topic.marks += que.marks;
        }
      });
      answerSheet.caseStudyAnswers.map((caseanswer: any) => {
        let caseQuestionMark = 0;
        caseanswer.isCorrect.map((val: boolean) => {
          if (val) {
            caseQuestionMark += questionMark / caseanswer.isCorrect.length;
          }
        });
        marks += caseQuestionMark;
      });
      // totalMarks += marks;
      totalMarks += answerSheet.subjectiveMarks + answerSheet.mcqMarks;
      //Calc time
      if (!answerSheet.answerPdf) {
        totalTime = totalTime + answerSheet.timeTaken;
        maxTime =
          maxTime > answerSheet.timeTaken ? maxTime : answerSheet.timeTaken;
        minTime =
          minTime < answerSheet.timeTaken ? minTime : answerSheet.timeTaken;
      }
    });
    const answerSheets = test.answerSheets.filter(
      (x: any) => x.answerPdf === null
    );
    if (answerSheets.length === 0) setAverageTime(0);
    else setAverageTime(totalTime / answerSheets.length);
    setMaxTime(maxTime);
    setMinTime(minTime);

    const averageMarks = totalMarks / test.answerSheets.length;
    const analyzingTopic: AnalysedTopic[] = [];

    initialTopicData.map((topic) => {
      const percentCorrect =
        (topic.marks / (topic.maxMarks * test.answerSheets.length)) * 100;
      analyzingTopic.push({
        topic_id: topic.topic_id,
        name: topic.name,
        remediateText: topic.remediateText,
        correctPercentage: percentCorrect,
        chapter_id: topic.chapter_id,
      });
    });
    setanalysedMCQs(initialdata);
    setAverageMarks(averageMarks);
    setanalysedTopics(analyzingTopic);
    props.setIsLoading(false);
  }
  useEffect(() => {
    analyzeTests(props.test);
  }, []);

  return (
    <>
      {!(props.test.answerSheets.length > 0) && (
        <>
          {isMd && (
            <Box w={30} mt={10} mr={5} onClick={props.onBackClick}>
              <BackButtonWithCircle />
            </Box>
          )}
          <Box w="100%" h="50vh">
            <Center h={"100%"} w={"100%"}>
              <Stack justify="center" align="center">
                <img
                  src={require("../../../assets/empty result page.gif")}
                  height="140px"
                  width="140px"
                />
                <Text fw={500} fz={20} color="#C9C9C9">
                  No Results found!
                </Text>
              </Stack>
            </Center>
          </Box>
        </>
      )}
      {props.test.answerSheets.length > 0 && (
        <>
          <Flex align="center">
            {isMd && (
              <Center
                miw={40}
                mr={10}
                onClick={() => {
                  props.onBackClick();
                }}
                style={{
                  cursor: "pointer",
                }}
              >
                <BackButtonWithCircle />
              </Center>
            )}
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
              Report
            </Title>
            {props.test && (
              <Select
                // label="Students"
                placeholder="SelectStudent"
                value={currentId}
                data={[
                  { value: "ALL", label: "All Students" },
                  ...props.test?.answerSheets.map((x: any) => {
                    return {
                      value: x._id,
                      label: x.student_id.name,
                    };
                  }),
                ]}
                w={isMd ? 200 : 250}
                onChange={(value) => {
                  // setcurrentId("ALL")
                  Mixpanel.track(
                    WebAppEvents.TEACHER_APP_TEST_PAGE_REPORT_SECTION_STUDENT_SELECTED
                  );
                  setcurrentId(value);
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
            )}
          </Flex>
          {currentId === "ALL" && (
            <>
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
                        Average Score
                      </Text>
                      {/* <Text fz={12} fw={400} color="#AFAFAF">
                        See how well you did to know how ready you are!
                      </Text> */}
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
                                ((averageMarks ?? 0) /
                                  (props.test?.maxMarks ?? 1)) *
                                100,
                              color: "#4b65f6",
                            },
                          ]}
                          label={
                            <>
                              <Center>
                                <Stack
                                  spacing={0}
                                  justify="center"
                                  align="center"
                                >
                                  <Text fz={isMd ? 12 : 14}>Marks</Text>
                                  <Text fz={isMd ? 10 : 12} fw={700}>
                                    {`${
                                      averageMarks ? averageMarks.toFixed(2) : 0
                                    } /
                          ${props.test?.maxMarks ?? 1}`}
                                  </Text>
                                </Stack>
                              </Center>
                            </>
                          }
                        />
                      </Flex>
                      <Stack
                        w="50%"
                        justify="center"
                        spacing={5}
                        py={30}
                        align="justify"
                      >
                        <Text fz={14} fw={400}>
                          Maximum Marks:
                          {props.test?.maxMarks}
                        </Text>
                        <Text fz={14} fw={400}>
                          Total Average Score Achieved:
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
                          {`${(
                            ((averageMarks ?? 0) /
                              (props.test?.maxMarks ?? 1)) *
                            100
                          ).toFixed(2)}%`}
                        </Text>
                      </Flex>
                      <Progress
                        // radius="xl"
                        size={16}
                        w={"100%"}
                        // striped
                        value={
                          ((averageMarks ?? 0) / (props.test?.maxMarks ?? 1)) *
                          100
                        }
                        color="#4b65f6"
                      />
                    </Stack>
                  </Stack>
                  {averageTime !== 0 && (
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
                        {/* <Text fz={12} fw={400} color="#AFAFAF">
                          See how long your students take to complete this test!
                        </Text> */}
                      </Stack>
                      <Divider color="#E5E7ED" size="md" mt={13} />
                      <Center w="100%" h="100%">
                        <RingProgress
                          size={isMd ? 200 : 200}
                          rootColor="#3174F34D"
                          thickness={isMd ? 10 : 12}
                          sections={[
                            {
                              value: (averageTime / maxTime) * 100,
                              color: "#4b65f6",
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
                                <Stack
                                  spacing={1}
                                  justify="center"
                                  align="center"
                                >
                                  <Text fw={600} fz={24}>
                                    {formatTime(averageTime)}
                                  </Text>
                                  <Text
                                    color="#7E7E7E"
                                    fz={18}
                                    fw={500}
                                    ta="center"
                                  >
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
              </>
              <Stack spacing={1} my={20}>
                <Stack>
                  {/* {analysedTopics.map((topic, index) => {
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
                  })} */}
                  {props.test.pdfLink === null && (
                    <>
                      {analysedMCQs.map((mcq, index) => {
                        const question = props.test?.questions.find(
                          (x: any) => x._id === mcq.mcquestion_id
                        );
                        if (question) {
                          return (
                            <MCQuestionCard
                              number={index + 1}
                              question={question?.text}
                              questionImageUrl={question.questionImageUrl}
                              answers={question.answers}
                              answerImageUrl={question.answerImageUrl}
                              analysis={{
                                correct: mcq.correct,
                                total: props.test.answerSheets.length,
                              }}
                              key={index}
                            />
                          );
                        }
                      })}
                      {props.test.subjectiveQuestions.map(
                        (x: any, index: any) => {
                          return (
                            <QuestionCard
                              id={x._id}
                              question={x.text}
                              answer={x.answer}
                              number={index + 1 + analysedMCQs.length}
                              questionImageUrl={x.questionImageUrl}
                              answerImageUrl={x.answerImageUrl}
                              key={x._id}
                              hideAnswer={false}
                            />
                          );
                        }
                      )}
                      {props.test.casebasedquestions.map(
                        (x: any, index: any) => {
                          return (
                            <CaseBasedQuestion
                              questions={x.questions}
                              id={x._id}
                              caseStudyText={x.caseStudyText}
                              number={
                                index +
                                1 +
                                props.test.questions?.length +
                                props.test.subjectiveQuestions.length
                              }
                              explaination=""
                              questionImageUrl={x.questionImageUrl}
                            />
                            // <QuestionCard
                            //   id={x._id}
                            //   question={x.text}
                            //   answer={x.answer}
                            //   number={index + 1 + analysedMCQs.length}
                            //   questionImageUrl={x.questionImageUrl}
                            //   answerImageUrl={x.answerImageUrl}
                            //   key={x._id}
                            //   hideAnswer={false}
                            // />
                          );
                        }
                      )}
                    </>
                  )}
                  {props.test.pdfLink !== null && (
                    <>
                      <PdfViewer url={props.test.pdfLink} showOptions={true} />
                    </>
                  )}
                </Stack>
              </Stack>
            </>
          )}
          {currentId !== "ALL" && currentStudentANswerSheet && (
            <>
              <SingleStudentAnalysis
                test={props.test}
                answerSheet={currentStudentANswerSheet}
                setIsLoading={props.setIsLoading}
                maxTime={maxTime}
                averageTime={averageTime}
                minTime={minTime}
              />
            </>
          )}
        </>
      )}
    </>
  );
}
