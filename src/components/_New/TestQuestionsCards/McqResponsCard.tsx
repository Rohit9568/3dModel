import {
  Box,
  Button,
  Card,
  Checkbox,
  CheckboxProps,
  Divider,
  Flex,
  Grid,
  Group,
  Image,
  Stack,
  Text,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { IconCross } from "../../_Icons/CustonIcons";
import {
  IconAlarm,
  IconBiohazard,
  IconCheck,
  IconTicTac,
  IconX,
} from "@tabler/icons";
import { useState } from "react";
import { DisplayHtmlText } from "../../../pages/_New/PersonalizedTestQuestions";

interface McqResponseCardProps {
  question: string;
  questionImageUrl?: string;
  answerImageUrl?: string[];
  answers: { text: string; isCorrect: boolean }[];
  markedAnswer: number;
  isMarkedCorrect: boolean;
  number: number;
}
export function McqResponseCard(props: McqResponseCardProps) {
  const [showAnswer, setShowAnswer] = useState<boolean>(false);
  const isMd = useMediaQuery(`(max-width: 820px)`);
  const checkboxIcon: CheckboxProps["icon"] = ({ className }) =>
    props.isMarkedCorrect ? (
      <IconCheck className={className} stroke={5} />
    ) : (
      <IconX className={className} stroke={5} />
    );

  return (
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
          <Stack>
            <DisplayHtmlText text={props.question} />
            {props.questionImageUrl && (
              <Image src={props.questionImageUrl} width={"75%"}></Image>
            )}
            {props.answers.map((x, index) => {
              return (
                <Group key={index}>
                  <Checkbox
                    radius={50}
                    checked={index === props.markedAnswer - 1}
                    icon={checkboxIcon}
                    styles={{
                      input: {
                        backgroundColor: "#D9D9D9",
                        borderColor: "#D9D9D9",
                        "&:checked": {
                          backgroundColor: props.isMarkedCorrect
                            ? "#14FF00"
                            : "red",
                          borderColor: props.isMarkedCorrect
                            ? "#14FF00"
                            : "red",
                        },
                      },
                    }}
                  />
                  <DisplayHtmlText text={x.text} />
                  {props.answerImageUrl && (
                    <Image
                      src={
                        props.answerImageUrl ? props.answerImageUrl[index] : ""
                      }
                      width={"50%"}
                    ></Image>
                  )}
                </Group>
              );
            })}
          </Stack>
        </Grid.Col>
      </Grid>
      <Card.Section my={10}>
        <Divider></Divider>
      </Card.Section>
      <Flex justify={"flex-end"}>
        <Button
          c={"#4B65F6"}
          variant="outline"
          style={{ borderColor: "#4B65F6" }}
          onClick={() => {
            setShowAnswer(!showAnswer);
          }}
        >
          {showAnswer ? "Hide Answer" : "Show Answer"}
        </Button>
      </Flex>
      {showAnswer && (
        <>
          <Box ml={20}>
            {props.answers.map((x, index) => {
              if (x.isCorrect) {
                return (
                  <>
                    <DisplayHtmlText text={x.text} />
                    {props.answerImageUrl && (
                      <Image
                        src={props.answerImageUrl[index]}
                        width={"75%"}
                      ></Image>
                    )}
                  </>
                );
              }
            })}
          </Box>
        </>
      )}
    </Card>
  );
}
