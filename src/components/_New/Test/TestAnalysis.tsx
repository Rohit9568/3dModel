import { useEffect, useState } from "react";
import { fetchTestResults } from "../../../features/test/AnswerSheetSlice";
import {
  Box,
  Button,
  Card,
  Center,
  Checkbox,
  Divider,
  Flex,
  Grid,
  Group,
  Image,
  LoadingOverlay,
  Modal,
  Progress,
  RingProgress,
  ScrollArea,
  SimpleGrid,
  Stack,
  Text,
} from "@mantine/core";
import { fetchFullTest } from "../../../features/test/TestSlice";
import { useNavigate } from "react-router-dom";
import { Pages, Tabs } from "../../../pages/_New/Teach";
import { useMediaQuery } from "@mantine/hooks";
import { IconX } from "@tabler/icons";
import { Mixpanel } from "../../../utilities/Mixpanel/MixpanelHelper";
import { WebAppEvents } from "../../../utilities/Mixpanel/AnalyticeEventWebApp";
import { DisplayHtmlText } from "../../../pages/_New/PersonalizedTestQuestions";

export interface AnalysedMCQ {
  mcquestion_id: string;
  correct: number;
}
export interface AnalysedTopic {
  topic_id: string;
  name: string;
  remediateText: string;
  correctPercentage: number;
  chapter_id: string;
}
export function MCQuestionCard(props: {
  question: string;
  questionImageUrl: string;
  answerImageUrl: string[];
  answers: { text: string; isCorrect: boolean }[];
  number: number;
  analysis: { correct: number; total: number };
}) {
  const isMd = useMediaQuery(`(max-width: 820px)`);
  return (
    <>
      <Card
        shadow="0px 0px 8px 0px rgba(0, 0, 0, 0.25);"
        style={{ borderRadius: "10px" }}
        withBorder
        w={isMd ? "100%" : "100%"}
        // miw={500}
      >
        <Box ml={"5%"}>
          <Grid fw={500} c={"#737373"}>
            <Grid.Col span={"content"}>{props.number}.</Grid.Col>
            <Grid.Col span={11}>
              <Stack>
                <DisplayHtmlText text={props.question} />
                <Image src={props.questionImageUrl} width={"75%"}></Image>
                {props.answers.map((x, index) => {
                  return (
                    <Flex key={index}>
                      <Checkbox
                        radius={50}
                        checked={x.isCorrect}
                        styles={{
                          input: {
                            backgroundColor: "#D9D9D9",
                            borderColor: "#D9D9D9",
                            "&:checked": {
                              backgroundColor: "#14FF00",
                              borderColor: "#14FF00",
                            },
                          },
                        }}
                      />
                      <DisplayHtmlText text={x.text} />
                      <Image
                        src={props.answerImageUrl[index]}
                        width={"50%"}
                      ></Image>
                    </Flex>
                  );
                })}
              </Stack>
            </Grid.Col>
          </Grid>
        </Box>
        <Divider size={2} mt={20} />
        <Group c="#737373" ml={isMd ? 10 : 90} mt={10} spacing={50}>
          <Text>
            {props.analysis.correct}/{props.analysis.total}
            <br />
            Marked Correct:
          </Text>
          <Text>
            {props.analysis.total - props.analysis.correct}/
            {props.analysis.total}
            <br />
            Marked Wrong:
          </Text>
        </Group>
      </Card>
    </>
  );
}
export function AnalyzedTopicCard(props: {
  name: string;
  remediateText: string;
  percent: number;
  topic_id: string;
  testDetails: FullTest | undefined;
  setcurrentPage?: (page: Pages) => void;
  setcurrentTab?: (tab: Tabs) => void;
  isPreTest?: boolean;
  chapter_id: string;
}) {
  const [modalopened, setmodalopened] = useState<boolean>(false);
  const isMd = useMediaQuery(`(max-width: 820px)`);
  const isSm = useMediaQuery(`(max-width: 400px)`);
  const navigate = useNavigate();
  const found1 = props.testDetails?.chapter_ids.find(
    (x) => x.chapterId === props.chapter_id
  );
  return (
    <>
      <Group w="100%">
        <Card
          shadow="0px 0px 8px 0px rgba(0, 0, 0, 0.25);"
          style={{ borderRadius: "10px" }}
          withBorder
          fw={500}
          w={isMd ? "100%" : props.remediateText.length <= 0 ? "100%" : "72%"}
        >
          <SimpleGrid cols={2}>
            <Text>{props.name}</Text>
            <Group>
              <Progress
                radius="xl"
                color="#4b65f6"
                size={16}
                w={isMd ? "100%" : "60%"}
                value={props.percent}
              />
              <Text>{props.percent.toFixed(2)}%</Text>
            </Group>
          </SimpleGrid>
        </Card>
        {props.remediateText.length > 0 && (
          <Button
            c={"#4B65F6"}
            p={0}
            onClick={() => {
              Mixpanel.track(
                WebAppEvents.TEACHER_APP_TEST_PAGE_REPORT_SECTION_VIEW_REMEDIATION_CLICKED,
                { topic_id: props.topic_id }
              );
              setmodalopened(true);
            }}
            w={isMd ? "100%" : "25%"}
            size="xl"
            fz={16}
            variant="outline"
            style={{ borderColor: "#4B65F6" }}
          >
            View Remediation
          </Button>
        )}
      </Group>
      <Modal
        fw={400}
        opened={modalopened}
        onClose={() => setmodalopened(false)}
        styles={{
          title: {
            margin: "auto",
            textAlign: "center",
            fontSize: 25,
            fontWeight: 600,
            alignContent: "center",
          },
          inner: {
            padding: "0 10px",
          },
        }}
        withCloseButton={false}
        padding={0}
        radius={8}
        size={isMd ? "md" : "xl"}
        centered
      >
        <Stack
          style={{
            position: "relative",
          }}
        >
          <Flex
            style={{
              border: "#FFF solid 2px",
              position: "absolute",
              right: 15,
              top: 10,
              height: isMd ? 20 : 40,
              width: isMd ? 20 : 40,
              borderRadius: 4,
              cursor: "pointer",
            }}
            justify="center"
            align="center"
            onClick={() => setmodalopened(false)}
          >
            <IconX height="70%" width="70%" color="#FFFFFF" />
          </Flex>
          <Flex
            sx={{
              backgroundColor: "#3174F3",
              borderRadius: "8px 8px 0 0",
            }}
            align="center"
            h="100%"
          >
            <Flex w="50%" align="end" justify="center" h="100%">
              <img
                src={require("../../../assets/remediation.png")}
                style={{
                  aspectRatio: 1.5,
                  width: "min(calc(100% * 1.5), 90%)",
                }}
              />
            </Flex>
            <Stack w="50%" py={20} h="100%">
              <Text color="#FFFFFF" fw={600} fz={isMd ? 11 : 20}>
                Remediation
              </Text>
              <Text color="#FFFFFF" fz={isMd ? 8 : 13} fw={500}>
                Unlock your students' potential with our guided remediation.
                Let's strengthen their foundation and ignite a
                love for learning.
              </Text>
            </Stack>
          </Flex>
          <Stack px={30} h={isMd ? "60%" : "50%"}>
            <Text color="#000000" fz={isMd ? 13 : 23} fw={500}>
              Effective Teaching Strategies
            </Text>

            <ScrollArea h="40vh">
              <Stack spacing={10}>
                <Divider color="#C7C7C7" size="sm" />
                {props.remediateText?.split("\n").map((line, index) => (
                  <>
                    <Text
                      key={index}
                      color="#000000"
                      fw={400}
                      fz={isMd ? 12 : 16}
                    >
                      {line}
                    </Text>
                    <Divider color="#C7C7C7" size="sm" />
                  </>
                ))}
              </Stack>
            </ScrollArea>
          </Stack>
          {!props.isPreTest && (
            <Group position="right" pr={10} h="10%" w="100%" pb={10}>
              {found1 && (
                <Button
                  onClick={() => {
                    if (props.isPreTest) return;
                    // props.setcurrentPage?.(Pages.Teach);
                    // props.setcurrentTab?.(Tabs.Topics);

                    navigate(
                      `/teach/${"Teach"}/${props.testDetails?.subject_id}/${
                        found1?._id
                      }/${props.topic_id}`
                    );
                  }}
                  bg="#3174F3"
                  fz={isMd ? 12 : 18}
                  fw={500}
                  size={isMd ? "sm" : "md"}
                >
                  Jump to Topic:{props.name}
                </Button>
              )}
            </Group>
          )}
        </Stack>
      </Modal>
    </>
  );
}
export function TestResult(props: {
  testId: string;
  setcurrentPage?: (page: Pages) => void;
  setcurrentTab?: (tab: Tabs) => void;
  isPretest?: boolean;
}) {
  const isMd = useMediaQuery(`(max-width: 820px)`);
  const [loadingData, setLoadingData] = useState<boolean>(false);
  //fetched Data
  const [testDetails, setTestDetails] = useState<FullTest>();
  const [answerSheets, setAnswerSheets] = useState<AnswerSheet[]>([]);
  //calculated Data
  const [analysedMCQs, setanalysedMCQs] = useState<AnalysedMCQ[]>([]);
  const [analysedTopics, setanalysedTopics] = useState<AnalysedTopic[]>([]);
  const [averageCorrectQuestions, setAverageCorrectQuestions] =
    useState<number>();

  useEffect(() => {
    if (props.testId !== "") {
      setLoadingData(true);
      //fetch question paper
      fetchFullTest(props.testId)
        .then((data: any) => {
          if (data.length !== 0) {
            setTestDetails(data);
          }
        })
        .catch((error) => {
          console.log(error);
        });
      //fetch students answersheets
      fetchTestResults(props.testId)
        .then((data: any) => {
          if (data.length !== 0) {
            setAnswerSheets(data);
          }
        })
        .catch((error) => {
          setLoadingData(false);
          console.log(error);
        });
      setLoadingData(false);
    }
  }, []);

  useEffect(() => {
    analyzeTests();
  }, [answerSheets, testDetails]);

  function analyzeTests() {
    setLoadingData(true);
    const initialdata: AnalysedMCQ[] = [];
    const initialTopicData: {
      topic_id: string;
      name: string;
      remediateText: string;
      numberOfQuestions: number; //no of questions of this topic
      correct: number; //no. of overall correct questions
      chapter_id: string;
    }[] = [];
    testDetails?.questions.map((mcq) => {
      initialdata.push({ mcquestion_id: mcq._id, correct: 0 });
      const found = initialTopicData.find(
        (x) => x.topic_id === mcq.topic_id?._id
      );

      if (found) {
        found.numberOfQuestions += 1;
      } else {
        initialTopicData.push({
          topic_id: mcq.topic_id?._id,
          name: mcq.topic_id?.name,
          remediateText: mcq.topic_id?.remediateText,
          numberOfQuestions: 1,
          correct: 0,
          chapter_id: mcq.topic_id.chapterId,
        });
      }
    });
    //Optimization Dept
    let totalMarks: number = 0;
    answerSheets.map((answerSheet) => {
      let marks: number = 0;
      answerSheet.mcqAnswers.map((mcqanswer) => {
        if (mcqanswer.isCorrect === true) {
          const question = initialdata.find(
            (x) => x.mcquestion_id === mcqanswer.question_id
          );
          if (question) {
            marks += 1;
            question.correct += 1;
            const topic = initialTopicData.find(
              (topic) =>
                topic.topic_id ===
                testDetails?.questions.find(
                  (question) => question._id === mcqanswer.question_id
                )?.topic_id._id
            );
            if (topic) topic.correct += 1;
          }
        }
      });
      totalMarks += marks;
    });

    const averageMarks = totalMarks / answerSheets.length;
    const analyzingTopic: AnalysedTopic[] = [];

    initialTopicData.map((topic) => {
      const percentCorrect =
        (topic.correct / (topic.numberOfQuestions * answerSheets.length)) * 100;
      analyzingTopic.push({
        topic_id: topic.topic_id,
        name: topic.name,
        remediateText: topic.remediateText,
        correctPercentage: percentCorrect,
        chapter_id: topic.chapter_id,
      });
    });
    //Saving Analyzed Data
    setanalysedMCQs(initialdata);
    setAverageCorrectQuestions(averageMarks);
    setanalysedTopics(analyzingTopic);
    setLoadingData(false);
  }
  return (
    <Box mb={60}>
      <LoadingOverlay visible={loadingData} />
      {!(answerSheets.length > 0) && (
        <>
          <Box w="100%" h="100%">
            <Center h={"100%"} w={"100%"}>
              <Stack justify="center" align="center">
                <img
                  src={require("../../../assets/empty result page.gif")}
                  height="140px"
                  width="140px"
                />
                <Text fw={500} fz={20} color="#C9C9C9">
                  No Tests found!
                </Text>
              </Stack>
            </Center>
          </Box>
        </>
      )}
      {
        //might be used in future
        /* {answerSheets.map((answerSheet) => {
      <Text>No. of students Given Test :{answerSheets.length}</Text>
        return (
          <Text>
            {answerSheet.studentName}:
            {answerSheet.mcqAnswers.filter((x) => x.isCorrect === true).length}/
            {answerSheet.mcqAnswers.length}
          </Text>
        );
      })} */
      }
      {answerSheets.length > 0 && (
        <>
          {(testDetails?.questions?.length || 0 > 0) && (
            <Card
              shadow="0px 0px 8px 0px rgba(0, 0, 0, 0.25);"
              style={{ borderRadius: "10px" }}
              w={isMd ? "50%" : "25%"}
              withBorder
            >
              <Card.Section bg={"#1952C0"}>
                <Center p={5}>
                  <Text c={"white"}>Average Score</Text>
                </Center>
              </Card.Section>
              <Card.Section>
                <Center bg={"#3174F3"}>
                  <RingProgress
                    size={200}
                    rootColor="#1952C0"
                    sections={[
                      {
                        value:
                          ((averageCorrectQuestions ?? 0) /
                            (testDetails?.questions?.length ?? 1)) *
                          100,
                        color: "white",
                      },
                    ]}
                    label={
                      <>
                        <Center c={"#A8C6FF"}>
                          <Stack spacing={0}>
                            <Text weight={700} align="center" fz={"1em"}>
                              {(
                                ((averageCorrectQuestions ?? 0) /
                                  (testDetails?.questions?.length ?? 1)) *
                                100
                              ).toFixed(2)}
                              %
                            </Text>
                            <Center>
                              <Text>
                                <Text span c={"white"} fz={"1.2em"}>
                                  {averageCorrectQuestions?.toFixed(2)}
                                </Text>
                                /{testDetails?.questions.length}
                              </Text>
                            </Center>
                          </Stack>
                        </Center>
                      </>
                    }
                  />
                </Center>
              </Card.Section>
            </Card>
          )}

          <Stack mt={30}>
            {analysedTopics.map((topic, index) => {
              return (
                <>
                  <AnalyzedTopicCard
                    name={topic.name}
                    remediateText={topic.remediateText}
                    percent={topic.correctPercentage}
                    testDetails={testDetails}
                    topic_id={topic.topic_id}
                    setcurrentPage={props.setcurrentPage}
                    setcurrentTab={props.setcurrentTab}
                    isPreTest={props.isPretest}
                    key={index}
                    chapter_id={topic.chapter_id}
                  />
                </>
              );
            })}
            {analysedMCQs.map((mcq, index) => {
              const question = testDetails?.questions.find(
                (x) => x._id === mcq.mcquestion_id
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
                      total: answerSheets.length,
                    }}
                    key={index}
                  />
                );
              }
            })}
          </Stack>
        </>
      )}
    </Box>
  );
}
