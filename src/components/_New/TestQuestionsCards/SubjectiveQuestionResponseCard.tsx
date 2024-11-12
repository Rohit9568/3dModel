import {
  Box,
  Button,
  Card,
  Divider,
  Flex,
  Grid,
  Image,
  NumberInput,
  Text,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { IconCheck, IconEditCircle } from "@tabler/icons";
import { useState } from "react";
import { EditIcon } from "../../_Icons/CustonIcons";
import { DisplayHtmlText } from "../../../pages/_New/PersonalizedTestQuestions";

interface SubjectiveQuestionResponseCardProps {
  question: string;
  questionImageUrl?: string;
  answerImageUrl?: string;
  answer: string;
  number: number;
  studentsAnswer: string;
  studentMarks: number;
  maxMarks: number;
  isEdit: boolean;
  onMarksChange?: (val: number) => void;
  isAnswerShown: boolean;
}

export function SubjectiveQuestionResponseCard(
  props: SubjectiveQuestionResponseCardProps
) {
  const [showAnswer, setShowAnswer] = useState<boolean>(false);
  const isMd = useMediaQuery(`(max-width: 820px)`);

  return (
    <>
      <Card
        shadow="0px 0px 8px 0px rgba(0, 0, 0, 0.25);"
        style={{ borderRadius: "10px" }}
        withBorder
      >
        <Grid fw={500} c={"#737373"}>
          <Grid.Col span={isMd ? 2 : 1}>
            <Text align="end">{props.number}.</Text>
          </Grid.Col>
          <Grid.Col span={isMd ? 10 : 11}>
            <DisplayHtmlText text={props.question} />
            {props.questionImageUrl && (
              <Image src={props.questionImageUrl} width={"75%"}></Image>
            )}
          </Grid.Col>
        </Grid>
        <Grid fw={500} c={"#737373"}>
          <Grid.Col span={isMd ? 2 : 1}>
            <Text align="end">Ans.</Text>
          </Grid.Col>
          <Grid.Col span={isMd ? 10 : 11}>
            <Text>{props.studentsAnswer}</Text>
          </Grid.Col>
        </Grid>

        <Card.Section mb={10} mt={10}>
          <Divider></Divider>
        </Card.Section>
        <Flex
          justify={props.isEdit ? "space-between" : "right"}
          align={"center"}
          p={"sm"}
        >
          {props.isEdit && (
            <div
              style={{
                display: "flex",
                justifyContent: "left",
                // justifyContent: "space-around",
                alignItems: "center",
                maxHeight: "45px",
                // border:"red solid 1px"
              }}
            >
              <p
                style={{
                  fontSize: "14px",
                }}
              >
                Update Marks:
              </p>
              <div
                style={{
                  padding: "8px",
                  display: "flex",
                  justifyContent: "space-evenly",
                  alignItems: "center",
                  gap: "5px",
                  border: "1px solid #d3d3d3",
                  height: isMd ? "40px" : "56px",
                  // width: isMd?"70px":"110px",
                  borderRadius: "6px",
                }}
              >
                <NumberInput
                  value={props.studentMarks}
                  precision={2}
                  onChange={(e) => {
                    if (e !== undefined && e <= props.maxMarks && e >= 0) {
                      console.log(e);
                      if (props.onMarksChange) props.onMarksChange(e);
                    }
                  }}
                  min={0}
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
              </div>
            </div>
          )}

          {props.isAnswerShown && (
            <Button
              c={"#4B65F6"}
              variant="outline"
              style={{ borderColor: "#4B65F6" }}
              onClick={() => {
                setShowAnswer(!showAnswer);
              }}
              ml={10}
            >
              {showAnswer ? "Hide Answer" : "Show Answer"}
            </Button>
          )}
        </Flex>

        {showAnswer && (
          <>
            <Box ml={10}>
              <Text>{props.answer}</Text>
              {props.answerImageUrl && (
                <Image src={props.answerImageUrl} width={"75%"}></Image>
              )}
            </Box>
          </>
        )}
      </Card>
    </>
  );
}
