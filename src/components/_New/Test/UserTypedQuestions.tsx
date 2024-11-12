import {
  Box,
  Button,
  Card,
  Center,
  Checkbox,
  Flex,
  Group,
  Modal,
  Radio,
  ScrollArea,
  Select,
  Stack,
  Text,
  TextInput,
  Textarea,
} from "@mantine/core";
import { IconCheck, IconMinus, IconSquareRoundedPlus } from "@tabler/icons";
import { useEffect, useState } from "react";
import { QuestionType } from "../../../@types/QuestionTypes.d";
import { Mixpanel } from "../../../utilities/Mixpanel/MixpanelHelper";
import { WebAppEvents } from "../../../utilities/Mixpanel/AnalyticeEventWebApp";
import { AutoSizer, CellMeasurer, List } from "react-virtualized";
import { MCQuestionCard, QuestionCard } from "../QuestionBank";
interface UserTypedQuestionsProps {
  questionType: string;
  typedMcQuestions: que[];
  typedSubjectiveQuestions: subque[];
  settypedSubjectiveQuestions: (questions: subque[]) => void;
  setTypedMcQuestions: (questions: que[]) => void;
  allMcqQuestions: McqQuestion[];
  allSubjectiveQuestions: SubjectiveQuestion[];
  onAddSubjectiveQuestions: (data: SubjectiveQuestion[]) => void;
  onAddMCQuestions: (data: McqQuestion[]) => void;
  testDetails: any;
}
export interface subque {
  id: string;
  text: string;
  answer: string;
}

export interface que {
  id: string;
  text: string;
  answers: { text: string; isCorrect: boolean }[];
}
export function UserTypedQuestions(props: UserTypedQuestionsProps) {
  const [isaddingQuestion, setisAddingQuestion] = useState(false);
  const [isAddFromQuestionBank, setisAddFromQuestionBank] = useState(false);
  const [typedquestion, settypedquestion] = useState<que>({
    id: `userQ-${props.typedMcQuestions.length}`,
    text: "",
    answers: [
      { text: "", isCorrect: false },
      { text: "", isCorrect: false },
      { text: "", isCorrect: false },
      { text: "", isCorrect: false },
    ],
  });
  const [mcqcorrectans, setmcqcorrectans] = useState<number>(0);
  const [typedSubjectiveQuestion, settypedSubjectiveQuestion] =
    useState<subque>({
      id: `userQ-${props.typedMcQuestions.length}`,
      text: "",
      answer: "",
    });
  const [questionType, setQuestionType] = useState<string | null>("");
  const isValidQuestion =
    questionType === "MCQ"
      ? typedquestion.text.length > 0 &&
        typedquestion.answers[0].text.length > 0 &&
        typedquestion.answers[1].text.length > 0 &&
        typedquestion.answers[2].text.length > 0 &&
        typedquestion.answers[3].text.length > 0
      : typedSubjectiveQuestion.text.length > 0 &&
        typedSubjectiveQuestion.answer.length > 0;

  useEffect(() => {
    if (props.questionType === QuestionType.AllQues.type) {
      setQuestionType("MCQ");
    } else {
      if (props.questionType === QuestionType.McqQues.type)
        setQuestionType("MCQ");
      else setQuestionType("Subjective");
    }
  }, []);
  const [value, setValue] = useState<string[]>([]);
  const [value1, setValue1] = useState<string[]>([]);
  const [showOptions, setShowOptions] = useState<boolean>(false);
  return (
    <>
      {!showOptions && !isaddingQuestion && (
        <Card
          py={5}
          shadow="0px 0px 8px 0px rgba(0, 0, 0, 0.25);"
          style={{ borderRadius: "10px" }}
          withBorder
          onClick={() => {
            if (
              props.allSubjectiveQuestions.length === 0 &&
              props.allMcqQuestions.length === 0
            ) {
              setisAddingQuestion(true);
            } else setShowOptions(true);
            // setisAddingQuestion(true);
            // Mixpanel.track(
            //   WebAppEvents.TEACHER_APP_TEST_PAGE_EDIT_QUESTIONS_ADD_BUTTON_CLICKED
            // );
          }}
        >
          <Center h={"100%"}>
            <IconSquareRoundedPlus color="#BDBDBD" size={35} />
          </Center>
        </Card>
      )}
      {showOptions && (
        <Card
          py={10}
          shadow="0px 0px 8px 0px rgba(0, 0, 0, 0.25);"
          style={{ borderRadius: "10px" }}
          withBorder
          // onClick={() => {
          //   setShowOptions(false)
          //   setisAddingQuestion(true);
          //   Mixpanel.track(
          //     WebAppEvents.TEACHER_APP_TEST_PAGE_EDIT_QUESTIONS_ADD_BUTTON_CLICKED
          //   );
          // }}
        >
          <Center h={"100%"}>
            <Stack>
              <Button
                onClick={() => {
                  setisAddingQuestion(true);
                  setShowOptions(false);
                }}
                variant="outline"
                style={{
                  border: "gray 1px solid",
                }}
                color="gray"
              >
                Create New Question
              </Button>
              <Button
                onClick={() => {
                  setisAddFromQuestionBank(true);
                  setShowOptions(false);
                }}
                variant="outline"
                style={{
                  border: "gray 1px solid",
                }}
                color="gray"
              >
                Add Question From Question Bank
              </Button>
            </Stack>
          </Center>
        </Card>
      )}
      {isaddingQuestion && !showOptions && (
        <Card
          py={5}
          shadow="0px 0px 8px 0px rgba(0, 0, 0, 0.25);"
          style={{ borderRadius: "10px" }}
          withBorder
        >
          <Stack mt={15}>
            {props.questionType === QuestionType.AllQues.type && (
              <Select
                data={["MCQ", "Subjective"]}
                value={questionType}
                onChange={(value) => {
                  setQuestionType(value);
                }}
              />
            )}
            {questionType === "MCQ" && (
              <>
                <TextInput
                  placeholder="Question"
                  onChange={(e) => {
                    settypedquestion({
                      ...typedquestion,
                      text: e.target.value,
                    });
                  }}
                ></TextInput>
                <Radio.Group
                  value={mcqcorrectans.toString()}
                  onChange={(e) => {
                    setmcqcorrectans(Number(e));
                  }}
                >
                  <Stack>
                    {typedquestion.answers.map((answer, index) => {
                      return (
                        <Group key={index}>
                          <Radio value={index.toString()} />
                          <TextInput
                            placeholder={"Option " + (index + 1)}
                            onChange={(e) => {
                              const ans = [...typedquestion.answers];
                              ans[index].text = e.target.value;
                              settypedquestion({
                                ...typedquestion,
                                answers: ans,
                              });
                            }}
                          />
                        </Group>
                      );
                    })}
                  </Stack>
                </Radio.Group>
              </>
            )}
            {questionType === "Subjective" && (
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
                ></Textarea>
              </>
            )}
            <Center h={"100%"}>
              <Group>
                <Box
                  bg={"#BDBDBD"}
                  w={35}
                  h={35}
                  style={{ borderRadius: 10 }}
                  onClick={() => {
                    setisAddingQuestion(false);
                  }}
                >
                  <Center h={"100%"}>
                    <IconMinus color="white" stroke={2} />
                  </Center>
                </Box>
                <Box
                  bg={isValidQuestion ? "#3174F3" : "#BDBDBD"}
                  w={35}
                  h={35}
                  style={{ borderRadius: 10 }}
                  onClick={() => {
                    if (!isValidQuestion) return;

                    if (questionType === "MCQ") {
                      typedquestion.answers.map((answer, index) => {
                        answer.isCorrect = index === mcqcorrectans;
                      });
                      props.setTypedMcQuestions([
                        ...props.typedMcQuestions,
                        JSON.parse(JSON.stringify(typedquestion)),
                      ]);
                      settypedquestion({
                        id: `userQ-${props.typedMcQuestions.length}`,
                        text: "",
                        answers: [
                          { text: "", isCorrect: false },
                          { text: "", isCorrect: false },
                          { text: "", isCorrect: false },
                          { text: "", isCorrect: false },
                        ],
                      });
                    } else {
                      props.settypedSubjectiveQuestions([
                        ...props.typedSubjectiveQuestions,
                        typedSubjectiveQuestion,
                      ]);
                      settypedSubjectiveQuestion({
                        text: "",
                        answer: "",
                        id: `userQ-${props.typedMcQuestions.length}`,
                      });
                    }
                    setisAddingQuestion(false);
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
      <Modal
        opened={isAddFromQuestionBank}
        onClose={() => {
          setisAddFromQuestionBank(false);
        }}
        size="auto"
        title="Question Bank"
        styles={{
          title: {
            fontSize: 25,
            fontWeight: 600,
          },
        }}
        // withCloseButton={false}
      >
        <>
          <ScrollArea w="60vw" h="70vh">
            <Stack
              h="75vh"
              // cols={1}
              // verticalSpacing={"sm"}
              // breakpoints={[
              //   { maxWidth: "lg", cols: 3, spacing: "md" },
              //   { maxWidth: "md", cols: 2, spacing: "sm" },
              //   { maxWidth: "sm", cols: 1, spacing: "sm" },
              // ]}
              px={5}

              // mt={70}
            >
              <div
                style={{
                  width: "100%",
                  height: "calc(100vh - 200px)",
                }}
              >
                {/* <AutoSizer>
              {(props) => (
                <>
                  <List
                    width={props.width}
                    height={props.height}
                    rowHeight={cache.current.rowHeight}
                    deferredMeasurementCache={cache.current}
                    rowCount={allVirtualizedQuestions.length ?? 0}
                    rowRenderer={({ key, index, style, parent }) => {
                      const x = allVirtualizedQuestions[index];
                      return (
                        <CellMeasurer
                          key={key}
                          cache={cache.current}
                          parent={parent}
                          rowIndex={index}
                          columnIndex={0}
                        >
                          {({ measure }) => (
                            <div style={style}>
                              <ResizeObserver onResize={measure}>
                                {x.element}
                              </ResizeObserver>
                            </div>
                          )}
                        </CellMeasurer>
                      );
                    }}
                  />
                </>
              )}
            </AutoSizer> */}
                <div>
                  <Checkbox.Group value={value} onChange={setValue}>
                    {props.allMcqQuestions.map((x, index) => {
                      return (
                        <Flex
                          w="100%"
                          align="center"
                          onClick={() => {
                            if (value.includes(x._id)) {
                              setValue((prev) => {
                                return prev.filter((y) => y !== x._id);
                              });
                            } else {
                              setValue((prev) => {
                                return [...prev, x._id];
                              });
                            }
                          }}
                          style={{
                            cursor: "pointer",
                          }}
                        >
                          <Checkbox
                            value={x._id}
                            w="5%"
                            // style={{
                            //   border:'red solid 1px'
                            // }}
                            ta="center"
                            pl={10}
                          />

                          <Box w="90%">
                            <MCQuestionCard
                              topicName={undefined}
                              question={x.text}
                              questionImageUrl={x.questionImageUrl}
                              answers={x.answers}
                              answerImageUrl={x.answerImageUrl}
                              number={index + 1}
                              explaination={""}
                              key={index}
                              onhoverColor={true}
                              isSelected={value.includes(x._id)}
                            />
                          </Box>
                        </Flex>
                      );
                    })}
                  </Checkbox.Group>
                  <Checkbox.Group value={value1} onChange={setValue1}>
                    {props.testDetails.questionType !== "ALL" &&
                      props.allSubjectiveQuestions.map((x, index) => {
                        return (
                          <Flex
                            w="100%"
                            align="center"
                            onClick={() => {
                              if (value1.includes(x._id)) {
                                setValue1((prev) => {
                                  return prev.filter((y) => y !== x._id);
                                });
                              } else {
                                setValue1((prev) => {
                                  return [...prev, x._id];
                                });
                              }
                            }}
                            style={{
                              cursor: "pointer",
                            }}
                          >
                            <Checkbox
                              value={x._id}
                              w="5%"
                              // style={{
                              //   border:'red solid 1px'
                              // }}
                              ta="center"
                              pl={10}
                            />
                            <Box w="90%">
                              <QuestionCard
                                topicName={undefined}
                                question={x.text}
                                questionImageUrl={x.questionImageUrl}
                                answer={x.answer}
                                answerImageUrl={x.answerImageUrl}
                                number={
                                  index + 1 + props?.allMcqQuestions?.length
                                }
                                explaination={""}
                                key={index}
                                onhoverColor={true}
                                isSelected={value1.includes(x._id)}
                              />
                            </Box>
                          </Flex>
                        );
                      })}
                    {props.testDetails.questionType === "ALL" && (
                      <Stack>
                        <Text fz={20} fw={600}>Long Answer Type Questions</Text>
                        {props.allSubjectiveQuestions.filter(x=>x.type==="LONG").map((x, index) => {
                          return (
                            <Flex
                              w="100%"
                              align="center"
                              onClick={() => {
                                if (value1.includes(x._id)) {
                                  setValue1((prev) => {
                                    return prev.filter((y) => y !== x._id);
                                  });
                                } else {
                                  setValue1((prev) => {
                                    return [...prev, x._id];
                                  });
                                }
                              }}
                              style={{
                                cursor: "pointer",
                              }}
                            >
                              <Checkbox
                                value={x._id}
                                w="5%"
                                // style={{
                                //   border:'red solid 1px'
                                // }}
                                ta="center"
                                pl={10}
                              />
                              <Box w="90%">
                                <QuestionCard
                                  topicName={undefined}
                                  question={x.text}
                                  questionImageUrl={x.questionImageUrl}
                                  answer={x.answer}
                                  answerImageUrl={x.answerImageUrl}
                                  number={
                                    index + 1 + props?.allMcqQuestions?.length
                                  }
                                  explaination={""}
                                  key={index}
                                  onhoverColor={true}
                                  isSelected={value1.includes(x._id)}
                                />
                              </Box>
                            </Flex>
                          );
                        })}
                        <Text fz={20} fw={600}>Short Answer Type Questions</Text>
                        {props.allSubjectiveQuestions.filter((x)=>x.type===("SHORT" || "FILL")).map((x, index) => {
                          return (
                            <Flex
                              w="100%"
                              align="center"
                              onClick={() => {
                                if (value1.includes(x._id)) {
                                  setValue1((prev) => {
                                    return prev.filter((y) => y !== x._id);
                                  });
                                } else {
                                  setValue1((prev) => {
                                    return [...prev, x._id];
                                  });
                                }
                              }}
                              style={{
                                cursor: "pointer",
                              }}
                            >
                              <Checkbox
                                value={x._id}
                                w="5%"
                                // style={{
                                //   border:'red solid 1px'
                                // }}
                                ta="center"
                                pl={10}
                              />
                              <Box w="90%">
                                <QuestionCard
                                  topicName={undefined}
                                  question={x.text}
                                  questionImageUrl={x.questionImageUrl}
                                  answer={x.answer}
                                  answerImageUrl={x.answerImageUrl}
                                  number={
                                    index + 1 + props?.allMcqQuestions?.length +props.allSubjectiveQuestions.filter(x=>x.type==="LONG").length
                                  }
                                  explaination={""}
                                  key={index}
                                  onhoverColor={true}
                                  isSelected={value1.includes(x._id)}
                                />
                              </Box>
                            </Flex>
                          );
                        })}
                      </Stack>
                    )}
                  </Checkbox.Group>
                </div>
              </div>
            </Stack>
          </ScrollArea>
          <Flex
            w="100%"
            justify="center"
            align="center"
          >
            <Button
              size="lg"
              onClick={() => {
                const mcqQuestions = props.allMcqQuestions.filter((x) => {
                  return value.includes(x._id);
                });
                props.onAddMCQuestions(mcqQuestions);

                const subjectiveQiuestions =
                  props.allSubjectiveQuestions.filter((x) => {
                    return value1.includes(x._id);
                  });
                props.onAddSubjectiveQuestions(subjectiveQiuestions);
                setisAddFromQuestionBank(false);
                setValue([]);
                setValue1([]);
              }}
              style={{
                backgroundColor: "#4B65F6",
              }}
            >
              Submit
            </Button>
          </Flex>
        </>
      </Modal>
    </>
  );
}
