import {
  Box,
  Button,
  Checkbox,
  Divider,
  Flex,
  Grid,
  Image,
  NumberInput,
  Radio,
  ScrollArea,
  Stack,
  Text,
  Textarea,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { DisplayHtmlText } from "../../../pages/_New/PersonalizedTestQuestions";
import Keypad from "./Keypad";
import { useEffect, useState } from "react";
import { QuestionType } from "../../../@types/QuestionTypes.d";
import { bool } from "aws-sdk/clients/signer";

export function StudentTestQuestionPanel(props: {
  currentQuestion: McqQuestion | SubjectiveQuestion;
  currentQuestionIndex: number;
  studentAnswerSheet: StudentTestAnswerSheet;
  onMarkForReviewClicked: () => void;
  onClearResponseClicked: () => void;
  onSaveAndNextClicked: (
    answer: string | number | number[] | null,
    timeSpentThisTime: number
  ) => void;
  entryTime:number;
  setEntryTime:(x:number)=>void;
}) {
  const [currentQuestionAnswer, setCurrentQuestionAnswer] = useState<
    string | number | number[] | null
  >(null);

  useEffect(() => {
    console.log("Hello")
    setCurrentQuestionAnswer(Date.now()+"no answer yet")
    props.setEntryTime(Date.now())
    props.studentAnswerSheet.questions.forEach(
      (question: StudentTestAnsweredQuestions) => {
        if (question.questionId == props.currentQuestion._id) {
          setCurrentQuestionAnswer(question.studentAnswer);
        }
      }
    );
  }, [props.currentQuestion]);


  const isMd = useMediaQuery(`(max-width: 548px)`);

  return (
    <>
    { props.currentQuestion && <Stack h={isMd?"75%":"90%"} spacing={8} w={"100%"}>
      <Grid h={"90%"}>
        {props.currentQuestion.parentQuestionId && (
          <Grid.Col span={6} ml={16} h={"100%"}>
             <ScrollArea h={"100%"}>
                <DisplayHtmlText
                  text={props.currentQuestion.parentQuestionText ?? ""}
                />
                </ScrollArea>
          </Grid.Col>
        )}
        <Grid.Col span={ props.currentQuestion.parentQuestionId?5:12} style={{ borderLeft: "solid black 1px" }} h={"100%"}>
        <ScrollArea h={"100%"}>
        <Stack pl={16}>
            <Stack>
              <Flex fz={18} fw={500}>
                <Text>Q{`${props.currentQuestionIndex + 1}. `}</Text>
                <DisplayHtmlText text={props.currentQuestion.text ?? ""} />
              </Flex>
            </Stack>
            {/* return ui on the basis of question type */}
            {(() => {
              if (props.currentQuestion.type == QuestionType.McqQues.type) {
                return (
                  <>
                    {(props.currentQuestion as McqQuestion).answers.map(
                      (answer, index) => {
                        return (
                          <Flex>
                            <Radio
                              checked={index == currentQuestionAnswer}
                              onChange={(event) => {
                                if (event.currentTarget.checked) {
                                  setCurrentQuestionAnswer(index);
                                }
                              }}
                              style={{
                                cursor: "pointer",
                              }}
                            />
                            <Text fz={16} fw={500} ml={12}>
                              <DisplayHtmlText text={answer.text} />
                            </Text>
                          </Flex>
                        );
                      }
                    )}
                  </>
                );
              } else if (
                props.currentQuestion.type == QuestionType.MultiCorrectQues.type
              ) {
                {
                  (props.currentQuestion as McqQuestion).answers.map(
                    (answer, index) => {
                      return (
                        <>
                          <Flex>
                            <Checkbox
                              checked={true}
                              onChange={(event) => {
                                if (event.currentTarget.checked) {
                                  (currentQuestionAnswer as number[]).push(
                                    index
                                  );
                                } else {
                                  const index = (
                                    currentQuestionAnswer as number[]
                                  ).indexOf(5);
                                  if (index > -1) {
                                    (currentQuestionAnswer as number[]).splice(
                                      index,
                                      1
                                    );
                                  }
                                }
                                setCurrentQuestionAnswer([
                                  ...(currentQuestionAnswer as number[]),
                                ]);
                              }}
                              style={{
                                cursor: "pointer",
                              }}
                            />
                            <Text fz={16} fw={500} ml={12}>
                              <DisplayHtmlText text={answer.text} />
                            </Text>
                          </Flex>
                        </>
                      );
                    }
                  );
                }
              } else if (
                props.currentQuestion.type == QuestionType.IntegerQues.type && !isMd
              ) {
                return (
                  <>
                      <Keypad
                        defaultInput={currentQuestionAnswer?.toString() ?? ""}
                        onKeyPress={function (val: any): {} {
                          setCurrentQuestionAnswer(val);
                          return "";
                        }}
                      />
                  </>
                );
              } else {
                return (
                  <>
                    <Textarea
                      placeholder="Your Answer!"
                      value={currentQuestionAnswer?.toString()??""}
                      onChange={(event) => {
                        if (
                          event.currentTarget.value &&
                          event.currentTarget.value != ""
                        ) {
                          setCurrentQuestionAnswer(event.currentTarget.value);
                        }
                      }}
                      rows={10}
                    />
                  </>
                );
              }
            })()}
          </Stack>
          </ScrollArea>
        </Grid.Col>
      </Grid>

      <Divider h={"2%"}size={2} />
      <Flex h={"8%"}justify={"space-between"}>
        <Box>
          <Button
            onClick={() => {
              setCurrentQuestionAnswer(null);
              props.onClearResponseClicked();
            }}
            style={{
              border: "1px solid #808080",
              color: "black",
              backgroundColor: "white",
              cursor: "pointer",
            }}
          >
            Clear Response
          </Button>
          <Button
            ml={isMd ? 1 : 20}
            mt={isMd ? 10 : 0}
            onClick={() => {
              props.onMarkForReviewClicked();
              props.onSaveAndNextClicked(
                currentQuestionAnswer,
                (Date.now() - props.entryTime) / 1000
              );
            }}
            style={{
              border: "1px solid #808080",
              color: "black",
              backgroundColor: "white",
              cursor: "pointer",
            }}
          >
            Mark for Review
          </Button>
        </Box>
        <Box>
          <Button
            onClick={() => {
              props.onSaveAndNextClicked(
                currentQuestionAnswer,
                (Date.now() - props.entryTime) / 1000
              );
            }}
            style={{ border: "1px solid #808080", cursor: "pointer" }}
          >
            Save & Next
          </Button>
        </Box>
      </Flex>

    </Stack>
          }
          </>
  );
}
