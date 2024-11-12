import {
  Button,
  Card,
  Checkbox,
  CheckboxProps,
  Divider,
  Flex,
  Grid,
  Group,
  Image,
  Notification,
  NumberInput,
  Stack,
  Text,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { IconCheck, IconX } from "@tabler/icons";
import { useEffect, useState } from "react";
import { DisplayHtmlText } from "../../../pages/_New/PersonalizedTestQuestions";
import { formatTime } from "../../../utilities/HelperFunctions";
import {
  addQuestionToBookmark,
  removeBookarkedQuestion,
} from "../../../features/test/TestSlice";
import {
  QuestionParentType,
  QuestionType,
  findQuestionType,
} from "../../../@types/QuestionTypes.d";
const lettering = ["a", "b", "c", "d", "e", "f", "g", "h"];

function getIcon(val: boolean) {
  const CheckboxIcon: CheckboxProps["icon"] = ({ indeterminate, ...others }) =>
    val ? <IconCheck {...others} /> : <IconX {...others} />;
  return CheckboxIcon;
}

function BottomBar(props: {
  markedCorrect: number;
  markedUnattempted: number;
  totalNumberOfStudents: number;
  timeTaken: number;
  answersComponent: JSX.Element;
  isSingleReport: boolean;
  avgTimeTaken:number,
  isShowAnswer:boolean,
  setIsShowAnswer:(showAnswer:boolean)=>void
}) {
  const isMd = useMediaQuery(`(max-width: 820px)`);
  useEffect(() => {
    setTimeout(() => {
      if (typeof window?.MathJax !== "undefined") {
        window.MathJax.typesetClear();
        window.MathJax.typeset();
      }
    }, 500);
  }, [props.isShowAnswer]);
  return (
    <Stack w="100%" mx={-10}>
      <Divider size={2} mt={20} />
      <Flex
        justify={!props.isSingleReport ? "space-between" : "right"}
        align="end"
        direction={isMd ? "column" : "row"}
        gap={isMd ? 15 : 0}
        w="100%"
      >
        <Flex
          c="#737373"
          mt={10}
          px={10}
          w="100%"
          fz={isMd ? 14 : 16}
          justify={isMd ? "space-between" : "left"}
          gap={isMd ? 0 : 20}
        >
          {!props.isSingleReport ? (
            <>
              <Text>
                {props.markedCorrect}/{props.totalNumberOfStudents}
                <br />
                Marked Correct
              </Text>
              <Text>
                {props.markedUnattempted}/{props.totalNumberOfStudents}
                <br />
                Unattempted
              </Text>

              <Text>
                {formatTime(props.timeTaken * 1000)}
                <br />
                Average Time
              </Text>
            </>
          ) : (
            <>
                <Text>
                  {formatTime(props.timeTaken * 1000)}
                  <br />
                   Your Time
                </Text>
                <Text>
                {formatTime(props.avgTimeTaken * 1000)}
                <br />
                Average Time
              </Text>

            </>
          )}
        </Flex>
        {props.isSingleReport && (
          <Button
            onClick={() => props.setIsShowAnswer(!props.isShowAnswer)}
            color="blue"
            size={isMd ? "sm" : "lg"}
            bg="#4B65F6"
          >
            {props.isShowAnswer ? "Hide" : "Show"} Answer
          </Button>
        )}
      </Flex>
      {props.isShowAnswer && props.isSingleReport && props.answersComponent}
    </Stack>
  );
}

export function MCQReportQuestionCard(props: {
  question: string;
  answers: { text: string; isCorrect: boolean }[];
  number: number;
  markedUnattempted: number;
  markedCorrect: number;
  totalNumberOfStudents: number;
  timeTaken: number;
  avgTimeTaken: number;
  markedAnswers: number[];
  isSingleReport: boolean;
  isCorrect: boolean;
  explaination: string;
  userType?: string;
  studentId?: string;
  testId?: string;
  questionId?: string;
  isBookmarked?: boolean;
  bookmarkMarkQuestionId?: string;
}) {
  const isMd = useMediaQuery(`(max-width: 820px)`);
  const [isBookmarked, setIsBookmarked] = useState<boolean>(
    props.bookmarkMarkQuestionId ? true : false
  );
  const [bookmarkQuestionId, setBookmarkQuestionId] = useState<string | null>(
    props.bookmarkMarkQuestionId || ""
  );

  const showNotification = () => {
    return (
      <Notification color="lime" title="Bookmark">
        Question Bookmarked Successfully
      </Notification>
    );
  };

  const addToBookmark = () => {
    addQuestionToBookmark({
      studentId: props.studentId || "",
      testId: props.testId || "",
      questionId: props.questionId || "",
      questionType: QuestionType.McqQues.type,
    })
      .then((resp: any) => {
        setIsBookmarked(!isBookmarked);
        setBookmarkQuestionId(resp._id);
        showNotification();
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const removeToBookmark = () => {
    if (bookmarkQuestionId != null) {
      removeBookarkedQuestion({ bookmarkQuestionId: bookmarkQuestionId })
        .then((resp: any) => {
          setIsBookmarked(!isBookmarked);
          setBookmarkQuestionId("");
        })
        .catch((e) => {
          console.log(e);
        });
    }
  };
  const [isShowAnswer, setIsShowAnswer] = useState<boolean>(false);

  return (
    <>
      <Card
        shadow="0px 0px 4px 0px #00000040"
        style={{ borderRadius: "10px" }}
        withBorder
        w={isMd ? "100%" : "100%"}
      >
        <Stack pl="5%">
          {props.userType === "student" && (
            <Flex
              justify={"flex-end"}
              align={"center"}
              style={{ cursor: "pointer" }}
              onClick={isBookmarked ? removeToBookmark : addToBookmark}
            >
              {isBookmarked ? (
                <>
                  <Image
                    width={15}
                    src={require("../../../assets/bookmarkFilled.png")}
                    alt="No"
                  />
                  <DisplayHtmlText
                    text={
                      '<span style="font-weight:bold; font-size:12px; color:#4B65F6 ">BOOKMARKED</span>'
                    }
                  />
                </>
              ) : (
                <>
                  <Image
                    width={15}
                    src={require("../../../assets/bookmark.png")}
                    alt="No"
                  />
                  <DisplayHtmlText
                    text={
                      '<span style="font-weight:bold; font-size:12px; color:#4B65F6 ">BOOKMARK</span>'
                    }
                  />
                </>
              )}
            </Flex>
          )}
          <Grid fw={500} c={"#737373"}>
            <Grid.Col span={"content"}>{props.number}.</Grid.Col>
            <Grid.Col span={11}>
              <Stack>
                <Flex
                  justify="space-between"
                  align="flex-start"
                  direction="column"
                >
                  <DisplayHtmlText text={props.question} />
                </Flex>
                {props.answers.map((x, index) => {
                  return (
                    <Flex key={index}>
                      <Checkbox
                        radius={50}
                        checked={(x.isCorrect && (isShowAnswer || !props.isSingleReport)) || props.markedAnswers.includes(index)}
                        styles={{
                          input: {
                            backgroundColor: "#D9D9D9",
                            borderColor: "#D9D9D9",
                            "&:checked": {
                              backgroundColor: x.isCorrect ? "#14FF00" : "red",
                              borderColor: x.isCorrect ? "#14FF00" : "red",
                            },
                          },
                        }}
                        icon={getIcon(x.isCorrect)}
                      />
                      <DisplayHtmlText text={x.text} />
                    </Flex>
                  );
                })}
              </Stack>
            </Grid.Col>
          </Grid>
          <BottomBar
            isSingleReport={props.isSingleReport}
            markedCorrect={props.markedCorrect}
            markedUnattempted={props.markedUnattempted}
            totalNumberOfStudents={props.totalNumberOfStudents}
            timeTaken={props.timeTaken}
            avgTimeTaken={props.avgTimeTaken}
            answersComponent={
              <Stack>
                {props.answers
                  .map((x, index) => {
                    if (x.isCorrect === true)
                      return (
                        <Flex>
                          <Text>
                            {lettering[index]}
                            {")"}{" "}
                          </Text>
                          <DisplayHtmlText text={x.text} />
                        </Flex>
                      );
                    else return null;
                  })
                  .filter((x) => x !== null)}
                <DisplayHtmlText text={props.explaination} />
              </Stack>
            }
            isShowAnswer = {isShowAnswer}
            setIsShowAnswer={setIsShowAnswer}
          />
        </Stack>
      </Card>
    </>
  );
}

export function SubjectiveQuestionCard(props: {
  question: string;
  answer: string;
  number: number;
  markedUnattempted: number;
  markedCorrect: number;
  totalNumberOfStudents: number;
  timeTaken: number;
  avgTimeTaken:number;
  markedAnswers: string;
  isSingleReport: boolean;
  marks: number;
  maxMarks: number;
  negativeMarks: number;
  onMarkChange?: (val: number) => void | undefined;
  explaination: string;
  userType?: string;
  studentId?: string;
  testId?: string;
  questionId?: string;
  isBookmarked?: boolean;
  bookmark?: any[];
}) {
  const isMd = useMediaQuery(`(max-width: 820px)`);
  const [isBookmarked, setIsBookmarked] = useState<boolean>(false);
  useEffect(() => {
    console.log(props.isBookmarked, props.questionId);
  }, []);

  const showNotification = () => {
    return (
      <Notification color="lime" title="Bookmark">
        Question Bookmarked Successfully
      </Notification>
    );
  };

  const addToBookmark = () => {
    addQuestionToBookmark({
      studentId: props.studentId || "",
      testId: props.testId || "",
      questionId: props.questionId || "",
      questionType: QuestionType.ShortQues.type,
    })
      .then((resp) => {
        setIsBookmarked(true);
        showNotification();
      })
      .catch((e) => {
        console.log(e);
      });
  };
  const [isShowAnswer, setIsShowAnswer] = useState<boolean>(false);
  useEffect(()=>{
    console.log(props);
  },[])

  return (
    <>
      <Card
        shadow="0px 0px 4px 0px #00000040"
        style={{ borderRadius: "10px" }}
        withBorder
        w={isMd ? "100%" : "100%"}
      >
        <Stack pl="5%">
          {props.userType === "student" && (
            <Flex
              justify={"flex-end"}
              align={"center"}
              style={{ cursor: "pointer" }}
              onClick={addToBookmark}
            >
              {isBookmarked ? (
                <>
                  <Image
                    width={15}
                    src={require("../../../assets/bookmarkFilled.png")}
                    alt="No"
                  />
                  <DisplayHtmlText
                    text={
                      '<span style="font-weight:bold; font-size:12px; color:#4B65F6 ">BOOKMARKED</span>'
                    }
                  />
                </>
              ) : (
                <>
                  <Image
                    width={15}
                    src={require("../../../assets/bookmark.png")}
                    alt="No"
                  />
                  <DisplayHtmlText
                    text={
                      '<span style="font-weight:bold; font-size:12px; color:#4B65F6 ">BOOKMARK</span>'
                    }
                  />
                </>
              )}
            </Flex>
          )}
          <Grid fw={500} c={"#737373"}>
            <Grid.Col span={"content"}>{props.number}.</Grid.Col>
            <Grid.Col span={11}>
              <Stack>
                <DisplayHtmlText text={props.question} />
                <Flex>
                  <Text>Ans.</Text>
                  <DisplayHtmlText text={props.markedAnswers} />
                </Flex>
              </Stack>
            </Grid.Col>
          </Grid>
          {props.onMarkChange && (
            <Flex justify="right" align="center" mr={10} gap={10}>
              <Text fz={isMd ? 16 : 20} fw={500}>
                Update Marks:
              </Text>
              <Flex
                align="center"
                style={{
                  border: "1px solid #D9D9D9",
                  borderRadius: "5px",
                }}
                py={5}
                px={10}
              >
                <NumberInput
                  value={props.marks}
                  precision={2}
                  onChange={(e) => {
                    if (
                      e !== undefined &&
                      e <= props.maxMarks &&
                      e >= props.negativeMarks
                    ) {
                      console.log(e);
                      if (props.onMarkChange) props.onMarkChange(e);
                    }
                  }}
                  min={props.negativeMarks}
                  max={Number(props.maxMarks.toPrecision(2))}
                  style={{
                    width: isMd ? 50 : "55px",
                  }}
                  styles={{
                    input: {
                      fontSize: isMd ? 13 : 16,
                    },
                  }}
                  hideControls
                />

                <span
                  style={{
                    fontSize: isMd ? 30 : "40px",
                    fontWeight: "200",
                  }}
                >
                  /
                </span>
                <span
                  style={{
                    fontSize: isMd ? 13 : 16,
                  }}
                >
                  {props.maxMarks.toPrecision(2)}
                </span>
              </Flex>
            </Flex>
          )}
          <BottomBar
            isSingleReport={props.isSingleReport}
            markedCorrect={props.markedCorrect}
            markedUnattempted={props.markedUnattempted}
            totalNumberOfStudents={props.totalNumberOfStudents}
            timeTaken={props.timeTaken}
            avgTimeTaken={props.avgTimeTaken}
            answersComponent={
              <Stack>
                {
                  <Flex>
                    <DisplayHtmlText text={props.answer} />
                    <DisplayHtmlText text={props.explaination} />
                  </Flex>
                }
              </Stack>
            }
            isShowAnswer ={isShowAnswer}
            setIsShowAnswer={setIsShowAnswer}
          />
        </Stack>
      </Card>
    </>
  );
}

export function CASEReportQuestionCard(props: {
  id: string;
  questions: (McqQuestion | SubjectiveQuestion)[];
  caseStudyText: string;
  number: number;
  markedUnattempted: number;
  markedCorrect: number;
  totalNumberOfStudents: number;
  timeTaken: number;
  avgTimeTaken:number;
  markedAnswers: (number | string) [];
  isSingleReport: boolean;
  isCorrect: boolean;
  explaination: string;
  userType?: string;
  studentId?: string;
  testId?: string;
  questionId?: string;
  isBookmarked?: boolean;
  bookmark?: any[];
}) {
  const isMd = useMediaQuery(`(max-width: 820px)`);
  const [isBookmarked, setIsBookmarked] = useState<boolean>(
    props.isBookmarked || false
  );

  const showNotification = () => {
    return (
      <Notification color="lime" title="Bookmark">
        Question Bookmarked Successfully
      </Notification>
    );
  };

  const addToBookmark = () => {
    addQuestionToBookmark({
      studentId: props.studentId || "",
      testId: props.testId || "",
      questionId: props.questionId || "",
      questionType: QuestionType.linkedComprehensionBasedQuestions.type,
    })
      .then((resp) => {
        setIsBookmarked(true);
        showNotification();
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const [isShowAnswer, setIsShowAnswer] = useState<boolean>(false);

  return (
    <>
      <Card
        shadow="0px 0px 4px 0px #00000040"
        style={{ borderRadius: "10px" }}
        withBorder
        w={isMd ? "100%" : "100%"}
      >
        <Stack pl={"5%"}>
          {props.userType === "student" && (
            <Flex
              justify={"flex-end"}
              align={"center"}
              style={{ cursor: "pointer" }}
              onClick={addToBookmark}
            >
              {isBookmarked ? (
                <>
                  <Image
                    width={15}
                    src={require("../../../assets/bookmarkFilled.png")}
                    alt="No"
                  />
                  <DisplayHtmlText
                    text={
                      '<span style="font-weight:bold; font-size:12px; color:#4B65F6 ">BOOKMARKED</span>'
                    }
                  />
                </>
              ) : (
                <>
                  <Image
                    width={15}
                    src={require("../../../assets/bookmark.png")}
                    alt="No"
                  />
                  <DisplayHtmlText
                    text={
                      '<span style="font-weight:bold; font-size:12px; color:#4B65F6 ">BOOKMARK</span>'
                    }
                  />
                </>
              )}
            </Flex>
          )}
          <Grid fw={500} c={"#737373"}>
            <Grid.Col span={"content"}>{props.number}.</Grid.Col>
            <Grid.Col
              span={11}
              style={{
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <Stack w="100%">
                <DisplayHtmlText text={props.caseStudyText} />
                {props.questions.map((y, i) => {
                  return (
                    <Stack w="100%">
                      <Flex>
                        <Text>{`${i + 1}.`}</Text>
                        <DisplayHtmlText text={y.text} />
                      </Flex>
                      {findQuestionType(y.type).parentType ===
                      QuestionParentType.MCQQ ? (
                        (y as McqQuestion).answers.map((x, index) => {
                          return (
                            <Group key={index} w="100%">
                              <Checkbox
                                radius={50}
                                checked={(x.isCorrect && (isShowAnswer || !props.isSingleReport)) || props.markedAnswers.includes(index)}
                                styles={{
                                  input: {
                                    backgroundColor: "#D9D9D9",
                                    borderColor: "#D9D9D9",
                                    "&:checked": {
                                      backgroundColor: x.isCorrect ? "#14FF00" : "red",
                                      borderColor: x.isCorrect ? "#14FF00" : "red",
                                    },
                                  },
                                }}
                                icon={getIcon(x.isCorrect)}
                                w="10px"
                              />
                              <DisplayHtmlText text={x.text} />
                            </Group>
                          );
                        })
                      ) : (
                        <>
                          <DisplayHtmlText
                            text={props.markedAnswers[i]?props.markedAnswers[i].toString(): ""}
                          />
                        </>
                      )}
                    </Stack>
                  );
                })}
              </Stack>
            </Grid.Col>
          </Grid>
          <BottomBar
            markedCorrect={props.markedCorrect}
            markedUnattempted={props.markedUnattempted}
            totalNumberOfStudents={props.totalNumberOfStudents}
            timeTaken={props.timeTaken}
            avgTimeTaken={props.avgTimeTaken}
            isSingleReport={props.isSingleReport}
            answersComponent={
              <Stack>
                {props.questions.map((y, i) => {
                  return (
                    <Stack>
                      {findQuestionType(y.type).parentType ===
                      QuestionParentType.MCQQ ? (
                        (y as McqQuestion).answers
                          .map((x, index) => {
                            if (x.isCorrect === true)
                              return (
                                <Flex>
                                  <Text>
                                    {i + 1}. {lettering[index]}
                                    {")"}
                                  </Text>

                                  <DisplayHtmlText text={x.text} />
                                </Flex>
                              );
                            return null;
                          })
                          .filter((x) => {
                            return x !== null;
                          })
                      ) : (
                        <></>
                      )}
                      <DisplayHtmlText text={y.explaination} />
                    </Stack>
                  );
                })}
              </Stack>
            }
            isShowAnswer ={isShowAnswer}
            setIsShowAnswer={setIsShowAnswer}
          />
        </Stack>
      </Card>
    </>
  );
}
