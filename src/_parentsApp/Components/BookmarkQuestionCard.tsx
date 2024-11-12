import React, { useEffect, useState } from "react";
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
  NumberInput,
  Stack,
  Text,
} from "@mantine/core";
import { DisplayHtmlText } from "../../pages/_New/PersonalizedTestQuestions";
import { removeBookarkedQuestion } from "../../features/test/TestSlice";
import { useMediaQuery } from "@mantine/hooks";
import { IconCheck, IconX } from "@tabler/icons";
import {
  QuestionParentType,
  findQuestionType,
} from "../../@types/QuestionTypes.d";

export const McqQuestionCard = (props: {
  index: number;
  bmqId: string;
  question: string;
  answers: { text: string; isCorrect: boolean }[];
  explaination: string;
  studentId: string;
  testId: string;
  testName: string;
  questionId: string;
  bookmarkMarkQuestionId: string;
  onQuestionChange:()=>void;
}) => {
  const [isBookmarked, setIsBookmarked] = useState<boolean>(
   true
  );
  function getIcon(val: boolean) {
    const CheckboxIcon: CheckboxProps["icon"] = ({
      indeterminate,
      ...others
    }) => (val ? <IconCheck {...others} /> : <IconX {...others} />);
    return CheckboxIcon;
  }

  const isMd = useMediaQuery(`(max-width: 820px)`);
  const [isShowAnswer, setIsShowAnswer] = useState<boolean>(false);

  const removeBookmarkQuestion = () => {
    removeBookarkedQuestion({
      bookmarkQuestionId: props.bookmarkMarkQuestionId,
    })
      .then((resp) => {
        props.onQuestionChange();
        setIsBookmarked(false);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  return (
    <Card
      shadow="0px 0px 4px 0px #00000040"
      style={{ borderRadius: "10px" }}
      withBorder
      w="100%"
    >
      <Stack pl="5%">
        <Flex justify={"space-between"} align={"center"}>
          <Flex>
            <Text>{props.testName}</Text>
          </Flex>
          <Flex
            justify="center"
            align="center"
            pr="2rem"
            style={{ cursor: "pointer" }}
            onClick={isBookmarked ? removeBookmarkQuestion : ()=>{}}
          >
            {isBookmarked ? (
              <>
                <Image
                  width={15}
                  src={require("../../assets/bookmarkFilled.png")}
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
                  src={require("../../assets/bookmark.png")}
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
        </Flex>
        <Divider style={{ width: "100%" }} size={1} mt={5} />
        <Grid fw={500} c="#737373">
          <Grid.Col span="content">1.</Grid.Col>
          <Grid.Col span={11}>
            <Stack>
              <Flex
                justify="space-between"
                align="flex-start"
                direction="column"
              >
                <DisplayHtmlText text={props.question} />
              </Flex>
              {props.answers.map(
                (answer: { text: string; isCorrect: boolean }, index) => (
                  <Flex key={index}>
                    <Checkbox
                      radius={50}
                      checked={answer.isCorrect}
                      styles={{
                        input: {
                          backgroundColor: "#D9D9D9",
                          borderColor: "#D9D9D9",
                          "&:checked": {
                            backgroundColor: index === 0 ? "#14FF00" : "red",
                            borderColor: index === 0 ? "#14FF00" : "red",
                          },
                        },
                      }}
                      icon={getIcon(answer.isCorrect)}
                    />
                    <DisplayHtmlText text={answer.text} />
                  </Flex>
                )
              )}
            </Stack>
          </Grid.Col>
        </Grid>
        <Divider size={1} mt={20} />
        <Flex justify={"space-between"}>
          {isShowAnswer ? (
            <DisplayHtmlText text={props.explaination} />
          ) : (
            <Text></Text>
          )}
          <Button
            onClick={() => setIsShowAnswer(!isShowAnswer)}
            color="blue"
            size={isMd ? "sm" : "lg"}
            bg="#4B65F6"
          >
            {isShowAnswer ? "Hide" : "Show"} Answer
          </Button>
        </Flex>
      </Stack>
    </Card>
  );
};

export function SubjectiveQuestionCard(props: {
  index: number;
  bmqId: string;
  question: string;
  answer: string;
  explaination: string;
  studentId: string;
  testId: string;
  testName: string;
  questionId: string;
  onMarkChange: any;
  bookmarkMarkQuestionId: string;
  onQuestionChange:()=>void;
}) {
  const isMd = useMediaQuery(`(max-width: 820px)`);
  const [isShowAnswer, setIsShowAnswer] = useState<boolean>(false);
  const [isBookmarked, setIsBookmarked] = useState<boolean>(
    props.bookmarkMarkQuestionId ? true : false
  );
  const removeBookmarkQuestion = () => {
    removeBookarkedQuestion({
      bookmarkQuestionId: props.bookmarkMarkQuestionId,
    })
      .then((resp) => {
        props.onQuestionChange();
        setIsBookmarked(false);
      })
      .catch((e) => {
        console.log(e);
      });
  };
  return (
    <>
      <Card
        shadow="0px 0px 4px 0px #00000040"
        style={{ borderRadius: "10px" }}
        withBorder
        w={isMd ? "100%" : "100%"}
      >
        <Stack pl="5%">
          <Flex justify={"space-between"} align={"center"}>
            <Flex>
              <Text>{props.testName}</Text>
            </Flex>
            <Flex
              justify="center"
              align="center"
              pr="2rem"
              style={{ cursor: "pointer" }}
              onClick={isBookmarked ? removeBookmarkQuestion : ()=>{}}
            >
              <Image
                height={15}
                onClick={removeBookmarkQuestion}
                src={require("../../assets/bookmarkFilled.png")}
                alt="No"
                style={{ cursor: "pointer" }}
              />
              <DisplayHtmlText text='<span style="font-weight:bold; font-size:12px; color:#4B65F6">BOOKMARKED</span>' />
            </Flex>
          </Flex>
          <Grid fw={500} c={"#737373"}>
            <Grid.Col span={"content"}>{props.index + 1}.</Grid.Col>
            <Grid.Col span={11}>
              <Stack>
                <DisplayHtmlText text={props.question} />
                <Flex>
                  <Text>Ans.</Text>
                  <DisplayHtmlText text={props.answer} />
                </Flex>
              </Stack>
            </Grid.Col>
          </Grid>
          <Divider size={1} mt={20} />
          <Flex justify={"space-between"}>
            {isShowAnswer ? (
              <DisplayHtmlText text={props.explaination} />
            ) : (
              <Text></Text>
            )}
            <Button
              onClick={() => setIsShowAnswer(!isShowAnswer)}
              color="blue"
              size={isMd ? "sm" : "lg"}
              bg="#4B65F6"
            >
              {isShowAnswer ? "Hide" : "Show"} Answer
            </Button>
          </Flex>
        </Stack>
      </Card>
    </>
  );
}

export function CASEReportQuestionCard(props: {
  index: number;
  bmqId: string;
  questionText: string;
  questions: (McqQuestion | SubjectiveQuestion)[];
  explaination: string;
  studentId: string;
  testId: string;
  testName: string;
  questionId: string;
  bookmarkMarkQuestionId: string;
  onQuestionChange:()=>void;
}) {
  const isMd = useMediaQuery(`(max-width: 820px)`);
  const [isBookmarked, setIsBookmarked] = useState<boolean>(
    props.bookmarkMarkQuestionId ? true : false
  );
  const [isShowAnswer, setIsShowAnswer] = useState<boolean>(false);
  const removeBookmarkQuestion = () => {
    removeBookarkedQuestion({
      bookmarkQuestionId: props.bookmarkMarkQuestionId,
    })
      .then((resp) => {
        props.onQuestionChange();
        setIsBookmarked(false);
      })
      .catch((e) => {
        console.log(e);
      });
  };
  return (
    <>
      <Card
        shadow="0px 0px 4px 0px #00000040"
        style={{ borderRadius: "10px" }}
        withBorder
        w={isMd ? "100%" : "100%"}
      >
        <Stack pl={"5%"}>
          <Flex justify={"space-between"} align={"center"}>
            <Flex>
              <Text>{props.testName}</Text>
            </Flex>
            <Flex
              justify="center"
              align="center"
              pr="2rem"
              style={{ cursor: "pointer" }}
              onClick={isBookmarked ? removeBookmarkQuestion : ()=>{}}
            >
              <Image
                height={15}
                onClick={removeBookmarkQuestion}
                src={require("../../assets/bookmarkFilled.png")}
                alt="No"
                style={{ cursor: "pointer" }}
              />
              <DisplayHtmlText text='<span style="font-weight:bold; font-size:12px; color:#4B65F6">BOOKMARKED</span>' />
            </Flex>
          </Flex>
          <Grid fw={500} c={"#737373"}>
            <Grid.Col span={"content"}>{props.index + 1}.</Grid.Col>
            <Grid.Col
              span={11}
              style={{
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <Stack w="100%">
                <DisplayHtmlText text={props.questionText} />
                {props.questions.map((y, i) => {
                  return (
                    <Stack w="100%">
                      <Flex>
                        <Text>{`${i + 1}.`}</Text>
                        <DisplayHtmlText text={y.text} />
                      </Flex>
                      {(findQuestionType(y.type).parentType === QuestionParentType.MCQQ) ? ((y as McqQuestion).answers.map((x, index) => {

                        return (
                          <Group key={index} w="100%">
                            <Checkbox
                              radius={50}
                              checked={
                                x.isCorrect
                              }
                              w="10px"
                            />
                            <DisplayHtmlText text={x.text} />
                          </Group>
                        );
                      })):
                      <>
                      <DisplayHtmlText text={(y as SubjectiveQuestion).answer} />
                      </>}
                    </Stack>
                  );
                })}
              </Stack>
            </Grid.Col>
          </Grid>
          <Divider size={1} mt={20} />
          <Flex justify={"space-between"}>
            {isShowAnswer ? (
              <DisplayHtmlText text={props.explaination} />
            ) : (
              <Text></Text>
            )}
            <Button
              onClick={() => setIsShowAnswer(!isShowAnswer)}
              color="blue"
              size={isMd ? "sm" : "lg"}
              bg="#4B65F6"
            >
              {isShowAnswer ? "Hide" : "Show"} Answer
            </Button>
          </Flex>
        </Stack>
      </Card>
    </>
  );
}
