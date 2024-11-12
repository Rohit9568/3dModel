import {
  Paper,
  Title,
  Text,
  Checkbox,
  useMantineTheme,
  Button,
  Flex,
  Image,
} from "@mantine/core";
import { useState } from "react";
import { useMediaQuery } from "@mantine/hooks";

interface QuestionCardProps {
  question: McqQuestion;
  disabled: boolean;
  onLoginClick: () => void;
  index:number
}

interface QuestionOption {
  text: string;
  isCorrect: boolean;
}

export function QuizCard(props: QuestionCardProps) {
  const theme = useMantineTheme();

  const [checkedState, setCheckedState] = useState([
    false,
    false,
    false,
    false,
  ]);

  const [selectedOption, setSelectedOption] = useState<QuestionOption | null>();

  function onCheckboxValueChange(index: number) {
    switch (index) {
      case 0:
        setCheckedState([true, false, false, false]);
        break;
      case 1:
        setCheckedState([false, true, false, false]);
        break;
      case 2:
        setCheckedState([false, false, true, false]);
        break;
      case 3:
        setCheckedState([false, false, false, true]);
        break;
    }
    const option = props.question.answers[index];
    setSelectedOption(option);
  }

  function Overlay() {
    return (
      <div
        style={{
          display: "flex",
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(240, 240, 240, 0.5)",
          zIndex: 1,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Button size="lg" onClick={props.onLoginClick}>
          Login
        </Button>
      </div>
    );
  }

  function GetBackgroundColor(data: { forItem: QuestionOption }) {
    var isOptionSelected = data.forItem.text === selectedOption?.text;
    var backgroundColor = theme.colors.gray[0];
    if (isOptionSelected && selectedOption?.isCorrect) {
      backgroundColor = theme.colors.green[1];
    } else if (isOptionSelected && selectedOption?.isCorrect === false) {
      backgroundColor = theme.colors.red[1];
    }
    return backgroundColor;
  }

  const isMd = useMediaQuery(`(max-width: 820px)`);
  return (
    <div style={{ position: "relative" }}>
      {props.disabled && <Overlay />}
      <Paper
        shadow="sm"
        p="xl"
        radius="sm"
        m="sm"
        style={{
          filter: props.disabled ? "blur(5px)" : "blur(0px)",
        }}
      >
        <Title
          style={{
            marginBottom: 20,
            fontWeight: isMd ? 600 : 700,
            wordBreak: "break-word",
          }}
          order={isMd ? 4 : 3}
        >
          {props.index}.{props.question.text}
        </Title>
        {props.question.questionImageUrl && (
          <Image src={props.question.questionImageUrl} width={"75%"}></Image>
        )}
        {props.question.answers.map((item, index) => (
          <Flex
            gap={"sm"}
            style={{
              borderRadius: 2,
              padding: 10,
              marginBottom: 6,
              backgroundColor: GetBackgroundColor({ forItem: item }),
            }}
            onClick={() => {
              onCheckboxValueChange(index);
            }}
            key={index}
          >
            <Checkbox checked={checkedState[index]} />
            <Text>{item.text}</Text>
            {props.question.answerImageUrl && (
              <Image
                src={props.question.answerImageUrl[index]}
                width={"50%"}
              ></Image>
            )}
          </Flex>
        ))}
      </Paper>
    </div>
  );
}
