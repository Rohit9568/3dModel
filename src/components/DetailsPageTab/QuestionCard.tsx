import { Paper, Title, Text, Button, Image } from "@mantine/core";
import { Fragment, useState } from "react";
import { useMediaQuery } from "@mantine/hooks";

interface QuestionCardProps {
  question: SubjectiveQuestion;
  disabled: boolean;
  onLoginClick: () => void;
  no: Number;
}
export function QuestionCard(props: QuestionCardProps) {
  const [showAnswer, setshowAnswer] = useState<boolean>(false);
  const isMd = useMediaQuery(`(max-width: 820px)`);
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
            fontSize:18
          }}
          order={isMd ? 4 : 3}
        >
          {`Q${props.no}) ${props.question.text}`}
        </Title>
        {props.question.questionImageUrl && (
          <Image src={props.question.questionImageUrl} width={"75%"}></Image>
        )}
        {!showAnswer && (
          <Button
            onClick={() => {
              setshowAnswer(true);
            }}
            variant="light"
            size="sm"
          >
            Show Answer
          </Button>
        )}
        {showAnswer && (
          <Fragment>
            <pre>{`${props.question.answer}`}</pre>
            {props.question.answerImageUrl && (
              <Image src={props.question.answerImageUrl} width={"75%"}></Image>
            )}
            <Button
              onClick={() => {
                setshowAnswer(false);
              }}
              variant="light"
              size="sm"
            >
              Hide answer
            </Button>
          </Fragment>
        )}
      </Paper>
    </div>
  );
}
