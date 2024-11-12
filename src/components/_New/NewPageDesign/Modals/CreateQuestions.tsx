import {
  Button,
  Card,
  Divider,
  Flex,
  Modal,
  ScrollArea,
  Stack,
  Text,
} from "@mantine/core";
import { useEffect, useState } from "react";
import {
  AddNewQuestion,
  CaseBasedQuestionCard,
  MCQquestionCard,
  SubjectivequestionCard,
} from "../../../../pages/_New/PersonalizedTestQuestions";
import {
  QuestionParentType,
  QuestionType,
  findQuestionType,
} from "../../../../@types/QuestionTypes.d";
import { IconPlusQuestions } from "../../../_Icons/CustonIcons";
import { showNotification } from "@mantine/notifications";

interface AddNewQuestionProps {
  isModalOpened: boolean;
  setisModalOpened: (val: boolean) => void;
  onSubmit: (data: any) => void;
}
export function CreateQuestions(props: AddNewQuestionProps) {
  const [questions, setquestions] = useState<any[]>([]);
  const [isAddQuestion, setIsAddQuestion] = useState<boolean>(true);
  const [selectedQuestionType, setSelectedQuestionType] =
    useState<string>("MCQ");

  function handleAddQuestion(val: any) {
    console.log(val);
    console.log(selectedQuestionType);
    setquestions([...questions, { ...val, type: selectedQuestionType }]);
    setIsAddQuestion(false);
    setSelectedQuestionType("MCQ");
  }

  useEffect(() => {
    setTimeout(() => {
      if (typeof window?.MathJax !== "undefined") {
        window.MathJax.typesetClear();
        window.MathJax.typeset();
      }
    }, 500);
  }, [questions]);

  function handleSubmit() {
    props.onSubmit(questions);
  }

  return (
    <Modal
      opened={props.isModalOpened}
      onClose={() => props.setisModalOpened(false)}
      title={
        <Stack spacing={5}>
          <Text fz={20} fw={700}>
            Create Questions
          </Text>
          <Text fz={14} c="#808080">
            No of questions:{questions.length}
          </Text>
        </Stack>
      }
      p={0}
      size="xl"
      styles={{
        modal: {
          padding: 0,
        },
      }}
      withinPortal={false}
    >
      <ScrollArea h="65vh">
        <Stack>
          <Divider color="#808080" />
          {questions.map((question, index) => {
            console.log(question);
            switch (findQuestionType(question.type).parentType) {
              case QuestionParentType.MCQQ:
                return (
                  <MCQquestionCard
                    question={question}
                    key={question._id}
                    index={index + 1}
                    canBeDeleted={true}
                    onDeleteClick={() => {
                      setquestions((prev) => {
                        return prev.filter((x) => x._id !== question._id);
                      });
                    }}
                    onEditClick={(val) => {
                      setquestions((prev) => {
                        return prev.map((x) => {
                          if (x._id === question._id) {
                            return val;
                          }
                          return x;
                        });
                      });
                    }}
                    testType={""}
                    showBottomBar={true}
                    hideMarks={false}
                  />
                );
              case QuestionParentType.SUBQ:
                return (
                  <SubjectivequestionCard
                    index={index + 1}
                    question={question}
                    canBeDeleted={true}
                    onDeleteClick={() => {
                      setquestions((prev) => {
                        return prev.filter((x) => x._id !== question._id);
                      });
                    }}
                    onEditClick={(val) => {
                      setquestions((prev) => {
                        return prev.map((x) => {
                          if (x._id === question._id) {
                            return val;
                          }
                          return x;
                        });
                      });
                    }}
                    testType={""}
                    questionType={question.type.type}
                    showBottomBar={true}
                    hideMarks={false}
                  />
                );
              case QuestionParentType.CASEQ:
                return (
                  <CaseBasedQuestionCard
                    index={index + 1}
                    question={question}
                    canBeDeleted={true}
                    onDeleteClick={() => {
                      setquestions((prev) => {
                        return prev.filter((x) => x._id !== question._id);
                      });
                    }}
                    onEditClick={(val) => {
                      setquestions((prev) => {
                        return prev.map((x) => {
                          if (x._id === question._id) {
                            return val;
                          }
                          return x;
                        });
                      });
                    }}
                    testType={""}
                    hideMarks={false}
                    showBottomBar={true}
                  />
                );

              default:
                <></>;
            }
          })}
          {isAddQuestion && (
            <AddNewQuestion
              onSubjectiveSubmit={handleAddQuestion}
              onCaseBasedQuestionSubmit={handleAddQuestion}
              onMcqSubmit={handleAddQuestion}
              onDeleteClicked={() => {
                setIsAddQuestion(false);
              }}
              sectionMarks={1}
              questionType={QuestionType.AllQues}
              onChangeQuestionType={(val) => {
                console.log(val);
                setSelectedQuestionType(val);
              }}
              hideMarks={
                findQuestionType(selectedQuestionType).parentType ===
                QuestionParentType.CASEQ
                  ? true
                  : false
              }
              negativeMark={1}
              totalQuestions={questions.length}
            />
          )}
          {!isAddQuestion && (
            <Card
              style={{
                borderRadius: "10px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              py={10}
              onClick={() => {
                setIsAddQuestion(true);
              }}
              withBorder
            >
              <IconPlusQuestions />
            </Card>
          )}
        </Stack>
      </ScrollArea>
      <Flex justify="flex-end" mt={10}>
        <Button
          onClick={() => {
            props.setisModalOpened(false);
          }}
          variant="outline"
          ml={5}
          style={{
            border: "#808080 1px solid",
            color: "#000000",
          }}
          size="lg"
          radius={25}
          px={50}
          mr={15}
        >
          Cancel
        </Button>
        <Button
          onClick={() => {
            if (isAddQuestion) {
              showNotification({
                message: "Please add the question first",
              });
            } else props.onSubmit(questions);
          }}
          color="white"
          radius={25}
          ml={5}
          size="lg"
          bg="#4B65F6"
          px={50}
          disabled={questions.length === 0}
        >
          Save
        </Button>
      </Flex>
    </Modal>
  );
}
