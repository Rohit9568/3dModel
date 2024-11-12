import { useSelector } from "react-redux";
import { RootState } from "../../store/ReduxStore";
import { useEffect, useState } from "react";
import { fetchTestChapterQuestions } from "../../features/UserSubject/chapterDataSlice";
import { chapterQuestions } from "../../store/chapterQuestionsSlice";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Card,
  Checkbox,
  Divider,
  Flex,
  Grid,
  Group,
  Image,
  Radio,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import { IconChevronDown, IconChevronUp } from "@tabler/icons";
import { TestDeatils } from "./ContentTest";
import { reduceImageScaleAndAlignLeft2 } from "../../utilities/HelperFunctions";
const chapterQuestionsActions = chapterQuestions.actions;

export function QuestionCard(props: {
  topicName?: string | undefined;
  question: string;
  questionImageUrl: string;
  answerImageUrl: string;
  answer: string;
  number: number;
  explaination: string;
  onhoverColor?: boolean;
  isSelected?: boolean;
}) {
  const [explainationopened, explainationhandlers] = useDisclosure(false);
  useEffect(() => {
    setTimeout(() => {
      if (typeof window?.MathJax !== "undefined") {
        window.MathJax.typesetClear();
        window.MathJax.typeset();
      }
    }, 500);
  }, [props.question]);
  return (
    <>
      <Card
        shadow="0px 0px 8px 0px rgba(0, 0, 0, 0.25);"
        style={{ borderRadius: "10px", marginBottom: "20px" }}
        withBorder
        sx={
          props.onhoverColor && props.onhoverColor === true
            ? {
                "&:hover": {
                  boxShadow: "0px 0px 8px 0px rgba(0, 0, 0, 0.5);",
                },
              }
            : {}
        }
        w="100%"
        // shadow={props.isSelected && props.isSelected===true?"0px 0px 8px 0px rgba(0, 0, 0, 0.5)":"0px 0px 8px 0px rgba(0, 0, 0, 0.25)"}
      >
        {!(props.topicName === null || props.topicName === undefined) && (
          <>
            <Text c={"#6B82BE"} fz={17} fw={500} ml={"2%"}>
              Chapter: {props.topicName}
            </Text>
            <Divider my={20} size={2} c={"#E5E7EB"} w={"100%"} />
          </>
        )}
        <Box ml={"5%"}>
          {/* <Grid fw={500} c={"#737373"}>
            {/* <Grid.Col span={1} style={{ textAlign: "right" }}> */}

          {/* </Grid.Col> */}
          {/* <Grid.Col span={12}> */}
          <Text>
            <span
              style={{
                fontWeight: 700,
              }}
            >
              {props.number}
            </span>
            .{" "}
            <div
              dangerouslySetInnerHTML={{
                __html: reduceImageScaleAndAlignLeft2(props.question),
              }}
            ></div>
          </Text>
          {props.questionImageUrl && (
            <img src={props.questionImageUrl} width={"75%"} />
          )}
          {/* </Grid.Col>
          </Grid> */}
          <Grid fw={500} c={"#737373"}>
            {/* <Grid.Col span={1} style={{ textAlign: "right" }}>
              
            </Grid.Col> */}
            <Grid.Col span={12}>
              <Text>
                <span
                  style={{
                    fontWeight: 700,
                  }}
                >
                  {"Ans. "}
                </span>
                <div
                  dangerouslySetInnerHTML={{
                    __html: reduceImageScaleAndAlignLeft2(props.answer),
                  }}
                ></div>
              </Text>
              {props.answerImageUrl && (
                <img src={props.answerImageUrl} width={"75%"} />
              )}
            </Grid.Col>
          </Grid>
        </Box>
        {props.explaination?.length > 0 && (
          <>
            <Card.Section>
              <Divider mt={20} mb={10} />
            </Card.Section>
            <Button onClick={() => explainationhandlers.toggle()}>
              {explainationopened ? "Hide Explaination" : "Show Explaination"}
            </Button>
            <Box ml={"5%"} mt={20}>
              {explainationopened && (
                <Text fw={500} c={"#737373"}>
                  {props.explaination}
                </Text>
              )}
            </Box>
          </>
        )}
      </Card>
    </>
  );
}
export function MCQuestionCard(props: {
  topicName?: string | undefined;
  question: string;
  questionImageUrl: string;
  answers: { text: string; isCorrect: boolean }[];
  answerImageUrl: string[];
  number: number;
  explaination: string;
  onhoverColor?: boolean;
  isSelected?: boolean;
}) {
  const found = props.answers.find((x) => x.isCorrect === true);
  const [explainationopened, explainationhandlers] = useDisclosure(false);
  useEffect(() => {
    setTimeout(() => {
      if (typeof window?.MathJax !== "undefined") {
        window.MathJax.typesetClear();
        window.MathJax.typeset();
      }
    }, 500);
  }, [props.question]);

  return (
    <>
      <Card
        shadow={"0px 0px 8px 0px rgba(0, 0, 0, 0.25)"}
        style={{ borderRadius: "10px", marginBottom: "30px" }}
        withBorder
        sx={
          props.onhoverColor && props.onhoverColor === true
            ? {
                "&:hover": {
                  boxShadow: "0px 0px 8px 0px rgba(0, 0, 0, 0.5);",
                },
              }
            : {}
        }
      >
        {!(props.topicName === null || props.topicName === undefined) && (
          <>
            {" "}
            <Text c={"#6B82BE"} fz={17} fw={500} ml={"2%"}>
              Chapter: {props.topicName}
            </Text>
            <Divider my={20} size={2} c={"#E5E7EB"} w={"100%"} />
          </>
        )}
        <Box ml={"5%"}>
          <Flex fw={500} c={"#737373"}>
            {/* <Grid.Col span={11}> */}
            <Stack>
              <Text>
                {" "}
                <span
                  style={{
                    fontWeight: 600,
                  }}
                >{`${props.number}. `}</span>
                <div
                  dangerouslySetInnerHTML={{
                    __html: reduceImageScaleAndAlignLeft2(props.question),
                  }}
                ></div>
              </Text>
              {props.questionImageUrl && (
                <Image src={props.questionImageUrl} width={"75%"}></Image>
              )}
              {props.answers.map((x, index) => {
                return (
                  <Flex key={index} align="center">
                    <Radio checked={x.isCorrect} mr={5} />
                    <div
                      dangerouslySetInnerHTML={{
                        __html: reduceImageScaleAndAlignLeft2(x.text),
                      }}
                    ></div>
                    {props.answerImageUrl && (
                      <Image
                        src={props.answerImageUrl[index]}
                        width={"50%"}
                      ></Image>
                    )}
                  </Flex>
                );
              })}
            </Stack>
            {/* </Grid.Col> */}
          </Flex>
        </Box>
        {props.explaination?.length > 0 && (
          <>
            <Card.Section>
              <Divider mt={20} mb={10} />
            </Card.Section>
            <Button onClick={() => explainationhandlers.toggle()}>
              {explainationopened ? "Hide Explaination" : "Show Explaination"}
              {explainationopened ? <IconChevronUp /> : <IconChevronDown />}
            </Button>
            <Box ml={"5%"} mt={20}>
              {explainationopened && (
                <Text fw={500} c={"#737373"}>
                  {props.explaination}
                </Text>
              )}
            </Box>
          </>
        )}
      </Card>
    </>
  );
}

export function CaseBasedQuestionViewCard(props: {
  id: string;
  questions: any[];
  caseStudyText: string;
  number: number;
  explaination: string;
  questionImageUrl: string;
  onhoverColor?: boolean;
}) {
  useEffect(() => {
    setTimeout(() => {
      if (typeof window?.MathJax !== "undefined") {
        window.MathJax.typesetClear();
        window.MathJax.typeset();
      }
    }, 500);
  }, [props.questions]);
  return (
    <>
      <Card
        shadow="0px 0px 8px 0px rgba(0, 0, 0, 0.25);"
        style={{ borderRadius: "10px" }}
        withBorder
        sx={
          props.onhoverColor && props.onhoverColor === true
            ? {
                "&:hover": {
                  boxShadow: "0px 0px 8px 0px rgba(0, 0, 0, 0.5);",
                },
              }
            : {}
        }
      >
        <Box ml={"5%"}>
          <Grid fw={500} c={"#737373"}>
            <Grid.Col
              span={11}
              style={{
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <Stack w="100%">
                <Text>{`${props.number}.${props.caseStudyText}`}</Text>
                {props.questionImageUrl && (
                  <Image src={props.questionImageUrl} width={"30%"}></Image>
                )}
                {props.questions.map((y, i) => {
                  return (
                    <Box ml={"5%"}>
                      <Flex fw={500} c={"#737373"}>
                        {/* <Grid.Col span={11}> */}
                        <Stack>
                          <Text>
                            {" "}
                            <span
                              style={{
                                fontWeight: 600,
                              }}
                            >{`${i + 1}. `}</span>
                            {y.text}
                          </Text>
                          {props.questionImageUrl && (
                            <Image
                              src={props.questionImageUrl}
                              width={"75%"}
                            ></Image>
                          )}
                          {y.answers.map((x: any, index: any) => {
                            return (
                              <Flex key={index} align="center">
                                <Radio checked={x.isCorrect} mr={5} />
                                <Text /* w={"90%"} */>{x.text}</Text>
                                {x.answerImageUrl && (
                                  <Image
                                    src={x.answerImageUrl[index]}
                                    width={"50%"}
                                  ></Image>
                                )}
                              </Flex>
                            );
                          })}
                        </Stack>
                        {/* </Grid.Col> */}
                      </Flex>
                    </Box>
                  );
                })}
              </Stack>
            </Grid.Col>
          </Grid>
        </Box>
      </Card>
    </>
  );
}

export function QuestionBank() {
  const isMd = useMediaQuery(`(max-width: 820px)`);
  const [questions, setQuestions] = useState<any>();
  const navigate = useNavigate();
  const currentChapter = useSelector<RootState, SingleChapter>((state) => {
    return state.chapterSlice.currentChapter;
  });
  useEffect(() => {
    fetchTestChapterQuestions(currentChapter._id)
      .then((data: any) => {
        setQuestions(data);
      })
      .catch((error) => {
        navigate("/");
      });
  }, [currentChapter]);

  return (
    <>
      <Stack mb={50}>
        <Title c={"#454545"} order={1} fw={500}>
          Question Bank
        </Title>
        <Text c={"#5F5F5F"} fw={500} fz={15}>
          Explore an extensive question library with a wide range of topics and
          difficulty levels.
        </Text>
        <Stack w={isMd ? "100%" : "60%"}>
          {questions?.mcqQuestions?.map((x: any, index: any) => {
            return (
              <MCQuestionCard
                topicName={undefined}
                question={x.text}
                questionImageUrl={x.questionImageUrl}
                answers={x.answers}
                answerImageUrl={x.answerImageUrl}
                number={index + 1}
                explaination={x.explaination}
                key={index}
              />
            );
          })}
          {questions?.subjectiveQuestions?.map((x: any, index: any) => {
            return (
              <QuestionCard
                topicName={undefined}
                question={x.text}
                questionImageUrl={x.questionImageUrl}
                answer={x.answer}
                answerImageUrl={x.answerImageUrl}
                number={index + 1 + questions?.mcqQuestions?.length}
                explaination={x.explaination}
                key={index}
              />
            );
          })}
        </Stack>
      </Stack>
    </>
  );
}
