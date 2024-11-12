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
  Menu,
  MultiSelect,
  NumberInput,
  Radio,
  ScrollArea,
  Select,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
  Textarea,
  Title,
  createStyles,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { Tabs } from "../../pages/_New/Teach";
import { Fragment, useEffect, useState } from "react";
import {
  IconArrowLeft,
  IconCheck,
  IconChevronDown,
  IconChevronRight,
  IconMinus,
} from "@tabler/icons";
import { BackButtonWithCircle, IconEdit } from "../_Icons/CustonIcons";
import { createTest, fetchFullTest } from "../../features/test/TestSlice";
import {
  QuestionParentType,
  QuestionType,
  findQuestionType,
} from "../../@types/QuestionTypes.d";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/ReduxStore";
import { que, subque } from "./Test/UserTypedQuestions";
import {
  createTestMCQQuestions,
  createTestSubjectiveQuestions,
} from "../../features/test/QuestionSlice";
import { Mixpanel } from "../../utilities/Mixpanel/MixpanelHelper";
import { WebAppEvents } from "../../utilities/Mixpanel/AnalyticeEventWebApp";
import { TestReviewQuestions } from "./TeacherPage new/TestReviewQuestions";
import { TestResultAndResponses } from "./TeacherPage new/TestResultsAndResponses";
import { TestInfoCard } from "./TeacherPage new/TestInfoCard";
import { subjects } from "../../store/subjectsSlice";
import { TestResultAndResponses2 } from "./TeacherPage new/TestResultsAndResponses2";
import { User1 } from "../../@types/User";
import { isPremiumModalOpened } from "../../store/premiumModalSlice";
import { PdfViewer } from "./FileUploadBox";
import { DisplayHtmlText } from "../../pages/_New/PersonalizedTestQuestions";
import { isGapMoreThanOneWeek } from "../../utilities/HelperFunctions";
const subjectActions = subjects.actions;
const isPremiumModalOpenedActions = isPremiumModalOpened.actions;

/* #region Enums */
export enum PaperDifficulity {
  Easy = "easy",
  Medium = "medium",
  Hard = "hard",
}
enum TestStep {
  BasicSettings,
  ReviewQuestions,
}
export enum TestScreen {
  Default,
  ViewTest,
  CreateTest,
  ViewReport,
  ViewResponse,
  CreateFinalTest,
  NewScreen,
  RankingList,
  EditTest,
  CopyTest,
  ViewResources,
}

const useStyles = createStyles((theme) => ({
  subheadings: {
    fontSize: 16,
    fontWeight: 500,
  },
  subheadingGrey: {
    fontSize: 16,
    fontWeight: 500,
    color: "#525252",
  },
}));

export interface TestDeatils {
  subject_id: string;
  chapter_ids: string[];
  name: string;
  testDate: Date | null;
  startTime: Date | null;
  endTime: Date | null;
  maxQuestions: number;
  maxMarks: number;
  difficulity: PaperDifficulity;
  questions: string[];
  subjectiveQuestions: string[];
  caseBasedQuestions: string[];
  questionType: string;
  isSamplePaper: boolean;
  duration?: string;
}

interface ContentTestProps {
  currentTab: Tabs;
  tests: TestData[];
  chapters: SingleChapter[];
  topics: SingleTopic[];
}
interface DropDownProps {
  title: string;
  list: any;
  current: any;
  OnSelect: (val: any) => void;
}

export function DropDownMenu(props: DropDownProps) {
  return (
    <Menu shadow="md">
      <Menu.Target>
        <Button variant="outline" rightIcon={<IconChevronDown />}>
          {props.current ? props.current.name : props.title}
        </Button>
      </Menu.Target>
      <Menu.Dropdown>
        <ScrollArea>
          <Box mah={200}>
            {props.list?.map((x: any, index: number) => {
              return (
                <Menu.Item
                  onClick={() => {
                    props.OnSelect(x);
                  }}
                  bg={x === props.current ? "#3174F3" : ""}
                  c={x === props.current ? "white" : ""}
                  sx={{
                    "&:hover": {
                      color: "black",
                    },
                  }}
                  key={index}
                >
                  {x.name}
                </Menu.Item>
              );
            })}
          </Box>
        </ScrollArea>
      </Menu.Dropdown>
    </Menu>
  );
}
function SelectQuestionTypeCard(props: {
  name: string;
  icon: React.ReactElement;
  iconSize?: string;
  OnAddQuestionClick: () => void;
}) {
  const isMd = useMediaQuery(`(max-width: 820px)`);
  return (
    <>
      <Card
        shadow="0px 4px 16px 0px rgba(0, 0, 0, 0.25)"
        radius="md"
        bg={"#F8F8F8"}
        w={isMd ? "100%" : "50%"}
        p={7}
        style={{ cursor: "pointer" }}
        withBorder
        onClick={() => {
          props.OnAddQuestionClick();
        }}
      >
        <Group position="apart">
          <Group>
            <Box w={60} h={60} bg={"#EAF1FC"}>
              <Center w={"100%"} h={"100%"}>
                <Box
                  w={props.iconSize ? props.iconSize : "60%"}
                  h={props.iconSize ? props.iconSize : "60%"}
                >
                  {props.icon}
                </Box>
              </Center>
            </Box>
            <Text fz={isMd ? 16 : 20} fw={500}>
              {props.name}
            </Text>
          </Group>
          <IconChevronRight />
        </Group>
      </Card>
    </>
  );
}
function TextWithLineBreaks(props: { text: string }) {
  const lines = props.text.split("\n");
  return (
    <div>
      {lines.map((line, index) => (
        <Fragment key={index}>
          {index === 0 && (
            <span
              style={{
                fontWeight: 700,
              }}
            >
              Ans.{" "}
            </span>
          )}
          {line}
          {index < lines.length - 1 && <br />}
        </Fragment>
      ))}
    </div>
  );
}

export function MCQCaseBasedQuestion(props: {
  question: McqQuestion;
  settypedCaseBasedQuestions: (questions: CaseBasedQuestion2) => void;
  typedCaseBasedQuestions: CaseBasedQuestion2;
  index: number;
}) {
  const [mcqcorrectans, setmcqcorrectans] = useState<number>(0);
  useEffect(() => {
    const cre1 = props.question.answers.findIndex((x) => x.isCorrect === true);
    if (cre1 !== -1) setmcqcorrectans(cre1);
  }, [props.question]);

  useEffect(() => {
    if (props.typedCaseBasedQuestions) {
      const questions1 = [...props.typedCaseBasedQuestions.questions];
      const question1 = {
        ...props.question,
        answers: props.question.answers.map((x, i) => {
          if (i === mcqcorrectans)
            return {
              text: x.text,
              isCorrect: true,
            };
          else
            return {
              text: x.text,
              isCorrect: false,
            };
        }),
      };
      questions1[props.index] = question1;
      props.settypedCaseBasedQuestions({
        ...props.typedCaseBasedQuestions,
        questions: questions1,
      });
    }
  }, [mcqcorrectans]);

  return (
    <>
      <TextInput
        placeholder="Question"
        onChange={(e) => {
          const questions1 = [...props.typedCaseBasedQuestions.questions];
          questions1[props.index].text = e.target.value;
          if (props.typedCaseBasedQuestions) {
            props.settypedCaseBasedQuestions({
              ...props.typedCaseBasedQuestions,
              questions: questions1,
            });
          }
        }}
        value={props.question.text ? props.question.text : ""}
      ></TextInput>
      <Radio.Group
        value={mcqcorrectans.toString()}
        onChange={(e) => {
          setmcqcorrectans(Number(e));
        }}
      >
        <Stack>
          {props.question.answers !== null &&
            props.question.answers.map((answer, index) => {
              return (
                <Group>
                  <Radio value={index.toString()} />
                  <TextInput
                    placeholder={"Option " + (index + 1)}
                    onChange={(e) => {
                      if (props.typedCaseBasedQuestions !== null) {
                        const questions1 = [
                          ...props.typedCaseBasedQuestions.questions,
                        ];

                        const ans = [...props.question.answers];
                        ans[index].text = e.target.value;
                        const question1 = {
                          ...props.question,
                          answers: ans,
                        };
                        questions1[props.index] = question1;
                        props.settypedCaseBasedQuestions({
                          ...props.typedCaseBasedQuestions,
                          questions: questions1,
                        });
                      }
                    }}
                    value={answer.text}
                  />
                </Group>
              );
            })}
        </Stack>
      </Radio.Group>
    </>
  );
}
export function CaseBasedQuestion(props: {
  id: string;
  questions: (McqQuestion | SubjectiveQuestion)[];
  caseStudyText: string;
  number: number;
  canbedeleted?: boolean;
  explaination: string;
  deletefunction?: () => void;
  testDetails?: TestDeatils;
  setTestDetails?: any;
  settypedCaseBasedQuestions?: (questions: CaseBasedQuestion2[]) => void;
  typedCaseBasedQuestions?: CaseBasedQuestion2[];
  questionImageUrl: string;
  totalMarks?: number;
}) {
  const [isEditQuestion, setIsEditQuestion] = useState<boolean>(false);
  const [typedCaseQuestion, settypedcaseQuestion] =
    useState<CaseBasedQuestion2>({
      _id: props.id,
      questions: props.questions,
      caseStudyText: props.caseStudyText,
      explaination: props.explaination,
    });
  useEffect(() => {
    settypedcaseQuestion({
      _id: props.id,
      caseStudyText: props.caseStudyText,
      explaination: props.explaination,
      questions: props.questions,
    });
  }, [props.questions, props.caseStudyText]);

  return (
    <>
      {isEditQuestion && (
        <Card
          py={5}
          shadow="0px 0px 8px 0px rgba(0, 0, 0, 0.25);"
          style={{ borderRadius: "10px" }}
          withBorder
        >
          <Stack mt={15}>
            <Textarea
              placeholder="Answer"
              value={typedCaseQuestion.caseStudyText}
              onChange={(e) => {
                settypedcaseQuestion({
                  ...typedCaseQuestion,
                  caseStudyText: e.target.value,
                });
              }}
              autosize
              // rows={10}
            ></Textarea>
            {typedCaseQuestion.questions.map((x:McqQuestion| SubjectiveQuestion, i) => {
              { return findQuestionType(x.type).parentType == QuestionParentType.MCQQ ? <>
              <MCQCaseBasedQuestion
                  question={(x as McqQuestion)}
                  typedCaseBasedQuestions={typedCaseQuestion}
                  settypedCaseBasedQuestions={settypedcaseQuestion}
                  index={i}
                />
              </>:
              <>
              </>
              }
            })}
          </Stack>
          <Center h={"100%"}>
            <Group>
              <Box
                bg="#3174F3"
                // bg={isValidQuestion ? "#3174F3" : "#BDBDBD"}
                w={35}
                h={35}
                style={{ borderRadius: 10 }}
                onClick={() => {
                  if (
                    props.settypedCaseBasedQuestions &&
                    props.typedCaseBasedQuestions &&
                    props.setTestDetails &&
                    props.testDetails !== undefined
                  ) {
                    const foundIndex = props.typedCaseBasedQuestions?.findIndex(
                      (x: any) => {
                        return (
                          x._id ===
                          (typedCaseQuestion !== null
                            ? typedCaseQuestion._id
                            : "")
                        );
                      }
                    );

                    if (foundIndex === -1)
                      props.settypedCaseBasedQuestions([
                        ...props.typedCaseBasedQuestions,
                        JSON.parse(JSON.stringify(typedCaseQuestion)),
                      ]);
                    else {
                      const type1 = [...props.typedCaseBasedQuestions];
                      type1[foundIndex] = JSON.parse(
                        JSON.stringify(typedCaseQuestion)
                      );
                      props.settypedCaseBasedQuestions(type1);
                    }
                    if (props.testDetails !== undefined)
                      props.setTestDetails(() => {
                        return {
                          ...props.testDetails,
                          questions: props?.testDetails?.questions.filter(
                            (item) =>
                              item !==
                              (typedCaseQuestion ? typedCaseQuestion._id : "")
                          ),
                        };
                      });
                  }
                  setIsEditQuestion(false);
                }}
              >
                <Center h={"100%"}>
                  <IconCheck color="white" stroke={2} />
                </Center>
              </Box>
            </Group>
          </Center>
        </Card>
      )}
      {!isEditQuestion && (
        <Card
          shadow="0px 0px 8px 0px rgba(0, 0, 0, 0.25);"
          style={{ borderRadius: "10px" }}
          withBorder
        >
          <Flex>
            <Box ml={"5%"} w="100%">
              <Grid fw={500} c={"#737373"}>
                <Grid.Col
                  span={11}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <Stack w="100%">
                    <Flex>
                      <Text>{`${props.number}.`}</Text>
                      <DisplayHtmlText text={props.caseStudyText} />
                    </Flex>
                    {props.questionImageUrl && (
                      <Image src={props.questionImageUrl} width={"30%"}></Image>
                    )}
                    {typedCaseQuestion.questions.map((y:SubjectiveQuestion | McqQuestion, i) => {
                      return (
                        <Stack w="100%">
                          <Flex>
                            <Text>{`${i + 1}.`}</Text>
                            <DisplayHtmlText text={y.text} />
                          </Flex>
                          {props.questionImageUrl && (
                            <Image
                              src={props.questionImageUrl}
                              width={"30%"}
                            ></Image>
                          )}
                          { findQuestionType(y.type).parentType == QuestionParentType.MCQQ ? (y as McqQuestion).answers.map((x, index) => {
                            return (
                              <Group key={index} w="100%">
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
                                  w="10px"
                                />
                                <DisplayHtmlText text={x.text} />
                                {y.answerImageUrl && (
                                  <Image
                                    src={
                                      y.answerImageUrl
                                        ? y.answerImageUrl[index]
                                        : ""
                                    }
                                    width={"30%"}
                                  ></Image>
                                )}
                              </Group>
                            );
                          }):<>
                          <DisplayHtmlText text={(y as SubjectiveQuestion).answer} />
                          </>
                          
                          }
                        </Stack>
                      );
                    })}
                  </Stack>
                  {
                    props.setTestDetails && (
                      <Button
                        variant="subtle"
                        onClick={() => {
                          setIsEditQuestion(true);
                        }}
                      >
                        <Box w="20px" h="20px">
                          <IconEdit />
                        </Box>
                      </Button>
                    )
                  }
                </Grid.Col>
              </Grid>
            </Box>
            <Text>{props.totalMarks}</Text>
          </Flex>
          {props.canbedeleted && (
            <Box w={"100%"} mt={5}>
              <Center>
                <Box
                  bg={"#BDBDBD"}
                  w={35}
                  h={35}
                  style={{ borderRadius: 10 }}
                  onClick={() => {
                    Mixpanel.track(
                      WebAppEvents.TEACHER_APP_TEST_PAGE_EDIT_QUESTIONS_REMOVE_BUTTON_CLICKED
                    );
                    if (props.deletefunction) props.deletefunction();
                  }}
                >
                  <Center h={"100%"}>
                    <IconMinus color="white" stroke={2} />
                  </Center>
                </Box>
              </Center>
            </Box>
          )}
        </Card>
      )}
    </>
  );
}
export function QuestionCard(props: {
  id: string;
  topicName?: string | undefined;
  question: string;
  questionImageUrl?: string;
  answerImageUrl?: string;
  answer: string;
  number: number;
  canbedeleted?: boolean;
  deletefunction?: () => void;
  hideAnswer?: boolean;
  testDetails?: TestDeatils;
  setTestDetails?: any;
  typedSubjectiveQuestions?: subque[];
  settypedSubjectiveQuestions?: (questions: subque[]) => void;
  totalMarks?: number;
}) {
  const [isEditQuestion, setIsEditQuestion] = useState<boolean>(false);
  const [typedSubjectiveQuestion, settypedSubjectiveQuestion] =
    useState<subque>({
      id: props.id,
      text: props.question,
      answer: props.answer,
    });

  useEffect(() => {
    settypedSubjectiveQuestion({
      id: props.id,
      text: props.question,
      answer: props.answer,
    });
  }, [props.question, props.answer]);

  const isValidQuestion =
    typedSubjectiveQuestion.text.length > 0 &&
    typedSubjectiveQuestion.answer.length > 0;
  return (
    <>
      {isEditQuestion && (
        <Card
          py={5}
          shadow="0px 0px 8px 0px rgba(0, 0, 0, 0.25);"
          style={{ borderRadius: "10px" }}
          withBorder
        >
          <Stack mt={15}>
            {/* {props.questionType === QuestionType.AllQues.type && (
              <Select
                data={["MCQ", "Subjective"]}
                value={questionType}
                onChange={(value) => {
                  setQuestionType(value);
                }}
              />
            )} */}

            {/* {questionType === "Subjective" && ( */}
            <>
              <TextInput
                placeholder="Question"
                value={typedSubjectiveQuestion.text}
                onChange={(e) => {
                  settypedSubjectiveQuestion({
                    ...typedSubjectiveQuestion,
                    text: e.target.value,
                  });
                }}
              ></TextInput>
              <Textarea
                placeholder="Answer"
                value={typedSubjectiveQuestion.answer}
                onChange={(e) => {
                  settypedSubjectiveQuestion({
                    ...typedSubjectiveQuestion,
                    answer: e.target.value,
                  });
                }}
                autosize
                // rows={10}
              ></Textarea>
            </>
            {/* )} */}
            <Center h={"100%"}>
              <Group>
                <Box
                  bg={isValidQuestion ? "#3174F3" : "#BDBDBD"}
                  w={35}
                  h={35}
                  style={{ borderRadius: 10 }}
                  onClick={() => {
                    if (!isValidQuestion) return;
                    if (
                      props.settypedSubjectiveQuestions &&
                      props.typedSubjectiveQuestions &&
                      props.setTestDetails &&
                      props.testDetails !== undefined
                    ) {
                      const foundIndex =
                        props?.typedSubjectiveQuestions.findIndex((x: any) => {
                          return x.id === typedSubjectiveQuestion.id;
                        });

                      if (foundIndex === -1)
                        props.settypedSubjectiveQuestions([
                          ...props.typedSubjectiveQuestions,
                          JSON.parse(JSON.stringify(typedSubjectiveQuestion)),
                        ]);
                      else {
                        const type1 = [...props.typedSubjectiveQuestions];
                        type1[foundIndex] = JSON.parse(
                          JSON.stringify(typedSubjectiveQuestion)
                        );
                        props.settypedSubjectiveQuestions(type1);
                      }
                      if (props.testDetails !== undefined)
                        props.setTestDetails(() => {
                          return {
                            ...props.testDetails,
                            questions: props?.testDetails?.questions.filter(
                              (item) => item !== typedSubjectiveQuestion.id
                            ),
                          };
                        });
                    }
                    setIsEditQuestion(false);
                  }}
                >
                  <Center h={"100%"}>
                    <IconCheck color="white" stroke={2} />
                  </Center>
                </Box>
              </Group>
            </Center>
          </Stack>
        </Card>
      )}
      {!isEditQuestion && (
        <Card
          shadow="0px 0px 8px 0px rgba(0, 0, 0, 0.25);"
          style={{ borderRadius: "10px" }}
          withBorder
        >
          {!(props.topicName === null || props.topicName === undefined) && (
            <>
              <Text c={"#6B82BE"} fz={17} fw={500} ml={"2%"}>
                Chapter: {props.topicName}
              </Text>
              <Divider my={20} size={2} c={"#E5E7EB"} w={"100%"} />
            </>
          )}
          <Flex>
            <Box ml={"5%"} w="100%">
              <Grid fw={500} c={"#737373"}>
                <Grid.Col
                  span={11}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <Stack w="100%">
                    <Flex w="100%">
                      <span>{`${props.number}.`}</span>
                      <DisplayHtmlText text={typedSubjectiveQuestion.text} />
                    </Flex>
                    {props.questionImageUrl && (
                      <Image src={props.questionImageUrl} width={"30%"}></Image>
                    )}
                    {!props.hideAnswer && (
                      <Flex>
                        <Text>Ans.</Text>
                        <DisplayHtmlText
                          text={typedSubjectiveQuestion.answer}
                        />
                        {props.answerImageUrl && (
                          <Image
                            src={props.answerImageUrl}
                            width={"30%"}
                          ></Image>
                        )}
                      </Flex>
                    )}
                  </Stack>
                  {props.settypedSubjectiveQuestions &&
                    props.setTestDetails && (
                      <Button
                        variant="subtle"
                        onClick={() => {
                          setIsEditQuestion(true);
                        }}
                      >
                        <Box w="20px" h="20px">
                          <IconEdit />
                        </Box>
                      </Button>
                    )}
                </Grid.Col>
              </Grid>
            </Box>
            <Text>{props.totalMarks}</Text>
          </Flex>
          {props.canbedeleted && (
            <Box w={"100%"} mt={5}>
              <Center>
                <Box
                  bg={"#BDBDBD"}
                  w={35}
                  h={35}
                  style={{ borderRadius: 10 }}
                  onClick={() => {
                    Mixpanel.track(
                      WebAppEvents.TEACHER_APP_TEST_PAGE_EDIT_QUESTIONS_REMOVE_BUTTON_CLICKED
                    );
                    if (props.deletefunction) props.deletefunction();
                  }}
                >
                  <Center h={"100%"}>
                    <IconMinus color="white" stroke={2} />
                  </Center>
                </Box>
              </Center>
            </Box>
          )}
        </Card>
      )}
    </>
  );
}

function removePrefix(inputString: string) {
  return inputString.trim().replace(/^(a\)|b\)|c\)|d\))/, "");
}
export function removePatternAtStart(inputString: string) {
  return inputString.replace(/^\d+(\.|\.?\))\s?/, "");
}
export function MCQuestionCard(props: {
  id: string;
  topicName?: string | undefined;
  question: string;
  questionImageUrl?: string;
  answerImageUrl?: string[];
  answers: { text: string; isCorrect: boolean }[];
  number: number;
  canbedeleted?: boolean;
  deletefunction?: () => void;
  hideAnswer?: boolean;
  typedMcQuestions?: que[];
  setTypedMcQuestions?: (questions: que[]) => void;
  testDetails?: TestDeatils;
  setTestDetails?: any;
  totalMarks?: number;
}) {
  const found = props.answers.find((x) => x.isCorrect === true);
  const [isEditQuestion, setIsEditQuestion] = useState<boolean>(false);
  const [typedquestion, settypedquestion] = useState<que | null>(null);
  const [mcqcorrectans, setmcqcorrectans] = useState<number>(0);

  useEffect(() => {
    const cre1 = props.answers.findIndex((x) => x.isCorrect === true);
    if (cre1 !== -1) setmcqcorrectans(cre1);
  }, [props.answers]);
  useEffect(() => {
    settypedquestion({
      id: props.id,
      text: props.question,
      answers: props.answers,
    });
  }, [props.question, props.answers]);

  useEffect(() => {
    if (typedquestion)
      settypedquestion({
        ...typedquestion,
        answers: typedquestion.answers.map((x, i) => {
          if (i === mcqcorrectans)
            return {
              text: x.text,
              isCorrect: true,
            };
          else
            return {
              text: x.text,
              isCorrect: false,
            };
        }),
      });
  }, [mcqcorrectans]);

  // const [questionType, setQuestionType] = useState<string | null>("");

  let isValidQuestion = true;
  useEffect(() => {
    if (typedquestion)
      isValidQuestion =
        typedquestion !== undefined &&
        typedquestion !== null &&
        typedquestion.text !== undefined &&
        typedquestion.answers
          ? typedquestion?.text.length > 0 &&
            typedquestion?.answers[0]?.text.length > 0 &&
            typedquestion?.answers[1]?.text.length > 0 &&
            typedquestion?.answers[2]?.text.length > 0 &&
            typedquestion?.answers[3]?.text.length > 0
          : false;
  }, [typedquestion]);

  // : typedSubjectiveQuestion.text.length > 0 &&
  //   typedSubjectiveQuestion.answer.length > 0;
  const isMd = useMediaQuery(`(max-width: 820px)`);
  return (
    <>
      {isEditQuestion && (
        <Card
          py={5}
          shadow="0px 0px 8px 0px rgba(0, 0, 0, 0.25);"
          style={{ borderRadius: "10px" }}
          withBorder
        >
          <Flex>
            <Stack mt={15}>
              {/* {props.questionType === QuestionType.AllQues.type && (
              <Select
                data={["MCQ", "Subjective"]}
                value={questionType}
                onChange={(value) => {
                  setQuestionType(value);
                }}
              />
            )} */}
              {/* {questionType === "MCQ" && ( */}
              <>
                <TextInput
                  placeholder="Question"
                  onChange={(e) => {
                    if (typedquestion)
                      settypedquestion({
                        ...typedquestion,
                        text: e.target.value,
                      });
                  }}
                  value={typedquestion ? typedquestion.text : ""}
                ></TextInput>
                <Radio.Group
                  value={mcqcorrectans.toString()}
                  onChange={(e) => {
                    setmcqcorrectans(Number(e));
                  }}
                >
                  <Stack>
                    {typedquestion !== null &&
                      typedquestion.answers.map((answer, index) => {
                        return (
                          <Group>
                            <Radio value={index.toString()} />
                            <TextInput
                              placeholder={"Option " + (index + 1)}
                              onChange={(e) => {
                                if (typedquestion !== null) {
                                  const ans = [...typedquestion.answers];
                                  ans[index].text = e.target.value;
                                  settypedquestion({
                                    ...typedquestion,
                                    answers: ans,
                                  });
                                }
                              }}
                              value={answer.text}
                            />
                          </Group>
                        );
                      })}
                  </Stack>
                </Radio.Group>
              </>
              {/* )} */}
              {/* {questionType === "Subjective" && (
              <>
                <TextInput
                  placeholder="Question"
                  value={typedSubjectiveQuestion.text}
                  onChange={(e) => {
                    settypedSubjectiveQuestion({
                      ...typedSubjectiveQuestion,
                      text: e.target.value,
                    });
                  }}
                ></TextInput>
                <TextInput
                  placeholder="Answer"
                  value={typedSubjectiveQuestion.answer}
                  onChange={(e) => {
                    settypedSubjectiveQuestion({
                      ...typedSubjectiveQuestion,
                      answer: e.target.value,
                    });
                  }}
                ></TextInput>
              </>
            )} */}
              <Center h={"100%"}>
                <Group>
                  <Box
                    bg={isValidQuestion ? "#3174F3" : "#BDBDBD"}
                    w={35}
                    h={35}
                    style={{ borderRadius: 10 }}
                    onClick={() => {
                      if (!isValidQuestion) return;

                      // if (questionType === "MCQ") {
                      // typedquestion.answers.map((answer, index) => {
                      //   answer.isCorrect = index === mcqcorrectans;
                      // });
                      if (
                        props.setTypedMcQuestions &&
                        props.typedMcQuestions &&
                        props.setTestDetails &&
                        props.testDetails !== undefined
                      ) {
                        const foundIndex = props.typedMcQuestions?.findIndex(
                          (x: any) => {
                            return (
                              x.id ===
                              (typedquestion !== null ? typedquestion.id : "")
                            );
                          }
                        );

                        if (foundIndex === -1)
                          props.setTypedMcQuestions([
                            ...props.typedMcQuestions,
                            JSON.parse(JSON.stringify(typedquestion)),
                          ]);
                        else {
                          const type1 = [...props.typedMcQuestions];
                          type1[foundIndex] = JSON.parse(
                            JSON.stringify(typedquestion)
                          );
                          props.setTypedMcQuestions(type1);
                        }
                        if (props.testDetails !== undefined)
                          props.setTestDetails(() => {
                            return {
                              ...props.testDetails,
                              questions: props?.testDetails?.questions.filter(
                                (item) =>
                                  item !==
                                  (typedquestion ? typedquestion.id : "")
                              ),
                            };
                          });
                      }
                      // settypedquestion({
                      //   text: "",
                      //   answers: [
                      //     { text: "", isCorrect: false },
                      //     { text: "", isCorrect: false },
                      //     { text: "", isCorrect: false },
                      //     { text: "", isCorrect: false },
                      //   ],
                      // });
                      // }
                      // else {
                      //   // props.settypedSubjectiveQuestions([
                      //   //   ...props.typedSubjectiveQuestions,
                      //   //   typedSubjectiveQuestion,
                      //   // ]);
                      //   settypedSubjectiveQuestion({
                      //     text: "",
                      //     answer: "",
                      //   });
                      // }
                      setIsEditQuestion(false);
                    }}
                  >
                    <Center h={"100%"}>
                      <IconCheck color="white" stroke={2} />
                    </Center>
                  </Box>
                </Group>
              </Center>
            </Stack>
            <Text>{props.totalMarks}</Text>
          </Flex>
        </Card>
      )}
      {!isEditQuestion && (
        <Card
          shadow="0px 0px 8px 0px rgba(0, 0, 0, 0.25);"
          style={{ borderRadius: "10px" }}
          withBorder
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
          <Flex justify="space-between">
            <Box ml={"5%"} w="100%">
              <Grid fw={500} c={"#737373"}>
                <Grid.Col
                  span={11}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  {typedquestion !== null && (
                    <Stack w="100%">
                      <Flex w="100%">
                        <Text>{`${props.number}.`}</Text>
                        <DisplayHtmlText text={typedquestion.text} />
                      </Flex>

                      {props.questionImageUrl && (
                        <Image
                          src={props.questionImageUrl}
                          width={"30%"}
                        ></Image>
                      )}
                      {!props.hideAnswer &&
                        typedquestion.answers.map((x, index) => {
                          return (
                            <Group key={index} w="100%">
                              {found && (
                                <Checkbox
                                  radius={isMd ? 30 : 50}
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
                                  w="10px"
                                />
                              )}
                              {/* {isLatexString(x.text) && (
                                <>
                                  {!found && (
                                    <>
                                      {index === 0 && "a. "}
                                      {index === 1 && "b. "}
                                      {index === 2 && "c. "}
                                      {index === 3 && "d. "}
                                    </>
                                  )}
                                  {`${x.text}`}
                                </>
                              )}
                              {!isLatexString(x.text) && (
                                <>
                                  {!found && (
                                    <>
                                      {index === 0 && "a. "}
                                      {index === 1 && "b. "}
                                      {index === 2 && "c. "}
                                      {index === 3 && "d. "}
                                    </>
                                  )}
                                  {`${x.text}`}
                                </>
                              )} */}
                              <DisplayHtmlText text={x.text} />
                              {props.answerImageUrl && (
                                <Image
                                  src={
                                    props.answerImageUrl
                                      ? props.answerImageUrl[index]
                                      : ""
                                  }
                                  width={"30%"}
                                ></Image>
                              )}
                            </Group>
                          );
                        })}
                    </Stack>
                  )}
                  {props.setTypedMcQuestions && props.setTestDetails && (
                    <Button
                      variant="subtle"
                      onClick={() => {
                        setIsEditQuestion(true);
                      }}
                    >
                      <Box w="20px" h="20px">
                        <IconEdit />
                      </Box>
                    </Button>
                  )}
                </Grid.Col>
              </Grid>
            </Box>
            <Text>{props.totalMarks}</Text>
          </Flex>
          {props.canbedeleted && (
            <Box w={"100%"} mt={5}>
              <Center>
                <Box
                  bg={"#BDBDBD"}
                  w={35}
                  h={35}
                  style={{ borderRadius: 10 }}
                  onClick={() => {
                    Mixpanel.track(
                      WebAppEvents.TEACHER_APP_TEST_PAGE_EDIT_QUESTIONS_REMOVE_BUTTON_CLICKED
                    );
                    if (props.deletefunction) props.deletefunction();
                  }}
                >
                  <Center h={"100%"}>
                    <IconMinus color="white" stroke={2} />
                  </Center>
                </Box>
              </Center>
            </Box>
          )}
        </Card>
      )}
    </>
  );
}

export function ViewTestBlock(props: {
  test_id: string;
  onBackClick?: () => void;
}) {
  const [testDetails, setTestDetails] = useState<FullTest2>();
  const [isSamplePaper, setIsSamplePaper] = useState<boolean>(false);
  const [questionsMap, setQuestionsMap] = useState(new Map());
  const isMd = useMediaQuery(`(max-width: 820px)`);

  useEffect(() => {
    fetchFullTest(props.test_id)
      .then((data: any) => {
        if (data.isSamplePaper === true) {
          setIsSamplePaper(true);
        }
        const updatedMap = new Map(questionsMap);

        data.questions.forEach((x: any) => {
          updatedMap.set(x._id, x);
        });

        data.casebasedquestions.forEach((x: any) => {
          updatedMap.set(x._id, x);
        });

        data.subjectiveQuestions.forEach((x: any) => {
          updatedMap.set(x._id, x);
        });

        setQuestionsMap(updatedMap);
        if (data.length !== 0) {
          setTestDetails(data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    setTimeout(() => {
      if (typeof window?.MathJax !== "undefined") {
        window.MathJax.typesetClear();
        window.MathJax.typeset();
      }
    }, 500);
  }, [testDetails]);

  return (
    <Box w={isMd ? "100%" : "75%"} mx={20} mb={30}>
      <Flex align={"center"}>
        {isMd && (
          <Box w={40} mr={10} onClick={props.onBackClick}>
            <BackButtonWithCircle />
          </Box>
        )}
        <Title
          order={isMd ? 3 : 1}
          fw={700}
          c={"#454545"}
          style={{
            display: "flex",
            alignContent: "center",
          }}
        >
          {testDetails?.name}
        </Title>
      </Flex>
      <Divider size={2} mb={20} />
      <SimpleGrid cols={2} mb={20}>
        <Card
          p={isMd ? 20 : 40}
          shadow="0px 0px 8px 0px rgba(0, 0, 0, 0.25);"
          style={{ borderRadius: "10px" }}
          withBorder
        >
          <Text c={"#898989"} fw={500}>
            Maximum Marks:{testDetails?.maxMarks}
          </Text>
        </Card>
        <Card
          p={isMd ? 20 : 40}
          shadow="0px 0px 8px 0px rgba(0, 0, 0, 0.25);"
          style={{ borderRadius: "10px" }}
          withBorder
        >
          <Text c={"#898989"} fw={500}>
            Total Questions:{testDetails?.maxQuestions}
          </Text>
        </Card>
      </SimpleGrid>
      {/* {testDetails && testDetails.isSamplePaper === false && (
        <Text c={"#898989"} fw={500} mb={20}>
          (This test has {testDetails?.maxQuestions} questions. Each question
          carries +
          {(
            (testDetails?.maxMarks || 0) / (testDetails?.maxQuestions || 1)
          ).toFixed(2)}{" "}
          marks for correct answer.)
        </Text>
      )} */}

      <Stack>
        {testDetails?.pdfLink && testDetails?.pdfLink !== null && (
          <PdfViewer url={testDetails?.pdfLink} showOptions={true} />
        )}
        {testDetails?.pdfLink === null && isSamplePaper === true && (
          <Stack>
            <Text fz={20} fw={600}>
              MCQ Type Question
            </Text>
            {testDetails?.questions.map((x, index) => {
              return (
                <MCQuestionCard
                  question={x.text}
                  answers={x.answers}
                  number={index + 1}
                  questionImageUrl={x.questionImageUrl}
                  answerImageUrl={x.answerImageUrl}
                  key={index}
                  hideAnswer={false}
                  id={x._id}
                />
              );
            })}
            <Text fz={20} fw={600}>
              Very Short Type Question
            </Text>
            {testDetails?.subjectiveQuestions
              .filter(
                (x) =>
                  x.type === QuestionType.VeryShortQues.type ||
                  x.type === QuestionType.FillQues.type
              )
              .map((x, index) => {
                return (
                  <QuestionCard
                    question={x.text}
                    answer={x.answer}
                    number={index + 1 + testDetails?.questions?.length}
                    questionImageUrl={x.questionImageUrl}
                    answerImageUrl={x.answerImageUrl}
                    key={x._id}
                    hideAnswer={false}
                    id={x._id}
                  />
                );
              })}
            <Text fz={20} fw={600}>
              Short Type Question
            </Text>
            {testDetails?.subjectiveQuestions
              .filter((x) => x.type === "SHORT")
              .map((x, index) => {
                return (
                  <QuestionCard
                    question={x.text}
                    answer={x.answer}
                    number={
                      index +
                      1 +
                      testDetails?.questions?.length +
                      testDetails?.subjectiveQuestions.filter(
                        (x) => x.type === QuestionType.VeryShortQues.type
                      ).length
                    }
                    questionImageUrl={x.questionImageUrl}
                    answerImageUrl={x.answerImageUrl}
                    key={x._id}
                    hideAnswer={false}
                    id={x._id}
                  />
                );
              })}
            <Text fz={20} fw={600}>
              Case Based Type Question
            </Text>
            {testDetails?.casebasedquestions.map((x, i) => {
              return (
                <CaseBasedQuestion
                  questions={x.questions}
                  id={x._id}
                  caseStudyText={x.text}
                  number={
                    i +
                    1 +
                    testDetails?.questions?.length +
                    testDetails.subjectiveQuestions.filter(
                      (x) =>
                        x.type === QuestionType.VeryShortQues.type ||
                        x.type === QuestionType.ShortQues.type
                    ).length
                  }
                  explaination=""
                  questionImageUrl={x.questionImageUrl}
                />
              );
            })}
            <Text fz={20} fw={600}>
              Long Type Question
            </Text>
            {testDetails?.subjectiveQuestions
              .filter((x) => x.type === "LONG")
              .map((x, index) => {
                return (
                  <QuestionCard
                    question={x.text}
                    answer={x.answer}
                    number={
                      index +
                      1 +
                      testDetails?.questions?.length +
                      testDetails?.subjectiveQuestions.filter(
                        (x) =>
                          x.type === QuestionType.VeryShortQues.type ||
                          x.type === QuestionType.ShortQues.type
                      ).length +
                      testDetails?.casebasedquestions.length
                    }
                    questionImageUrl={x.questionImageUrl}
                    answerImageUrl={x.answerImageUrl}
                    key={x._id}
                    hideAnswer={false}
                    id={x._id}
                  />
                );
              })}
          </Stack>
        )}
        {testDetails &&
          isSamplePaper === false &&
          questionsMap !== undefined &&
          testDetails?.pdfLink === null && (
            <>
              {testDetails &&
                testDetails?.superSections.map((superSection: any) => {
                  return (
                    <Stack>
                      <Text>{superSection.name}</Text>
                      {superSection?.sections.map((y: any) => {
                        const section = testDetails.sections.find(
                          (x: any) => x._id === y
                        );
                        if (section)
                          return (
                            <Stack>
                              <Text>{section.name}</Text>
                              {section.questions.map(
                                (x: any, index: number) => {
                                  const question = questionsMap.get(x);
                                  if(!question) return <></>
                                   { switch (
                                    findQuestionType(question.type).parentType
                                  ) {
                                    case QuestionParentType.MCQQ:
                                      return (
                                        <MCQuestionCard
                                          question={question.text}
                                          answers={question.answers}
                                          number={index + 1}
                                          questionImageUrl={
                                            question.questionImageUrl
                                          }
                                          answerImageUrl={
                                            question.answerImageUrl
                                          }
                                          key={index}
                                          hideAnswer={false}
                                          id={question._id}
                                          totalMarks={question.totalMarks}
                                        />
                                      );
                                    case QuestionParentType.SUBQ:
                                      return (
                                        <QuestionCard
                                          question={question.text}
                                          answer={question.answer}
                                          number={index + 1}
                                          questionImageUrl={
                                            question.questionImageUrl
                                          }
                                          answerImageUrl={
                                            question.answerImageUrl
                                          }
                                          key={question._id}
                                          hideAnswer={false}
                                          id={question._id}
                                          totalMarks={question.totalMarks}
                                        />
                                      );
                                    case QuestionParentType.CASEQ:
                                      return (
                                        <CaseBasedQuestion
                                          questions={question.questions}
                                          id={question._id}
                                          caseStudyText={question.caseStudyText}
                                          number={index + 1}
                                          explaination=""
                                          questionImageUrl={
                                            question.questionImageUrl
                                          }
                                          totalMarks={question.totalMarks}
                                        />
                                      );
                                      default: return (<></>)
                                    }
                                    }
                                  }
                              )}
                            </Stack>
                          );
                      })}
                    </Stack>
                  );
                })}
            </>
          )}
        {(testDetails?.isNewSectionType === false ||
          !testDetails?.isNewSectionType) && (
          <>
            {testDetails?.questions.map((x, index) => {
              return (
                <MCQuestionCard
                  question={x.text}
                  answers={x.answers}
                  number={index + 1}
                  questionImageUrl={x.questionImageUrl}
                  answerImageUrl={x.answerImageUrl}
                  key={index}
                  hideAnswer={false}
                  id={x._id}
                />
              );
            })}
            {testDetails?.subjectiveQuestions
              .filter((x) => x.type === "SHORT" || x.type === "FILL")
              .map((x, index) => {
                return (
                  <QuestionCard
                    question={x.text}
                    answer={x.answer}
                    number={index + 1 + testDetails?.questions?.length}
                    questionImageUrl={x.questionImageUrl}
                    answerImageUrl={x.answerImageUrl}
                    key={x._id}
                    hideAnswer={false}
                    id={x._id}
                  />
                );
              })}
            {testDetails?.subjectiveQuestions
              .filter((x) => x.type === "LONG")
              .map((x, index) => {
                return (
                  <QuestionCard
                    question={x.text}
                    answer={x.answer}
                    number={
                      index +
                      1 +
                      testDetails?.questions?.length +
                      testDetails?.subjectiveQuestions.filter(
                        (x) => x.type === "SHORT" || x.type === "FILL"
                      ).length
                    }
                    questionImageUrl={x.questionImageUrl}
                    answerImageUrl={x.answerImageUrl}
                    key={x._id}
                    hideAnswer={false}
                    id={x._id}
                  />
                );
              })}

            {testDetails?.casebasedquestions.map((x, i) => {
              return (
                <CaseBasedQuestion
                  questions={x.questions}
                  id={x._id}
                  caseStudyText={x.text}
                  number={
                    i +
                    1 +
                    testDetails?.questions?.length +
                    testDetails.subjectiveQuestions.length
                  }
                  explaination=""
                  questionImageUrl={x.questionImageUrl}
                />
              );
            })}
          </>
        )}
      </Stack>
    </Box>
  );
}
/* #endregion */

export function ContentTest(props: ContentTestProps) {
  return (
    <>
      {/* {props.currentTab === Tabs.Test && (
        <TestTabContents
          chapters={props.chapters}
          tests={props.tests} //test from current Subject
          subject={}
        />
      )}
      {props.currentTab === Tabs.QuestionBank && <QuestionBank />} */}
    </>
  );
}
