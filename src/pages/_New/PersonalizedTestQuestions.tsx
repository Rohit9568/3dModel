import {
  Box,
  Button,
  Card,
  Center,
  Checkbox,
  Divider,
  Flex,
  NumberInput,
  Radio,
  ScrollArea,
  Select,
  Stack,
  Text,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { IconCheck, IconX } from "@tabler/icons";
import { useEffect, useRef, useState } from "react";
import SunEditor from "suneditor-react";
import "suneditor/dist/css/suneditor.min.css";
import {
  align,
  font,
  fontColor,
  fontSize,
  formatBlock,
  hiliteColor,
  horizontalRule,
  image,
  lineHeight,
  link,
  list,
  paragraphStyle,
  table,
  template,
  textStyle,
} from "suneditor/src/plugins";
import {
  DifficultyLevel,
  DifficultyLevelValues,
  QuestionParentType,
  QuestionType,
  allQuestionTypesValues,
  allQuestionsTypes,
  findQuestionType,
  getColorForDiffuclityType,
} from "../../@types/QuestionTypes.d";
import {
  IconDeleteQuestion,
  IconEditQuestion,
} from "../../components/_Icons/CustonIcons";
import { FileUpload } from "../../features/fileUpload/FileUpload";
import {
  base64StringToBlob,
  extractBase64StringsFromString,
  reduceImageScaleAndAlignLeft2,
} from "../../utilities/HelperFunctions";
import { WebAppEvents } from "../../utilities/Mixpanel/AnalyticeEventWebApp";
import { Mixpanel } from "../../utilities/Mixpanel/MixpanelHelper";
import { Template } from "./PersonalizedTest";
import { DifficultyChip } from "./DifficultyChip";
import { McqQuestion } from "../../_parentsApp/Components/ParentTest/SingleParentTest";
interface MCQCaseBasedQuestionProps {
  data: MCQTypedQuestion;
  onEditClick: (val: MCQTypedQuestion) => void;
  onDeleteClick: () => void;
}

enum SectionTypes {
  MCQ = "Multiple Choice",
  LONG = "Long Answer Type Question",
  SHORT = "Short Answer Type Question",
  CASE = "Case Based Questions",
}
export function MCQCaseBasedQuestion(props: MCQCaseBasedQuestionProps) {
  const values = ["", "", "", ""];
  const [answers, setanswers] = useState<
    {
      isCorrect: boolean;
      text: string;
    }[]
  >(props.data.answers);

  const [answerImages, setanswerImages] = useState<string[]>(
    props.data.answerImageUrl
  );
  const [questionImage, setQuestionImage] = useState<string>(
    props.data.questionImageUrl
  );
  const [questionMark, setQuestionMark] = useState<number>(
    props.data.totalMarks
  );
  const [solutionText, setSolutionText] = useState<string>(
    props.data.explaination
  );
  const [negativeMark, setNegativeMark] = useState<number>(
    props.data.totalNegativeMarks
  );
  useEffect(() => {
    setanswerImages(props.data.answerImageUrl);
  }, [props.data.answerImageUrl]);

  useEffect(() => {
    props.onEditClick({
      ...props.data,
      answers: answers,
    });
  }, [answers]);
  useEffect(() => {
    props.onEditClick({
      ...props.data,
      explaination: solutionText,
    });
  }, [solutionText]);

  const isMd = useMediaQuery(`(max-width: 820px)`);
  return (
    <Stack>
      <Text> Question :</Text>
      <Flex>
        <Flex w="100%">
          <SingleTextFeild
            text={props.data.text}
            setText={(val) => {
              props.onEditClick({
                ...props.data,
                text: val,
                answers: answers,
              });
            }}
            placeHolderText="Type your question"
          />
        </Flex>
        <Flex justify="center" align="center" w="5%" pl={isMd ? 5 : 0}>
          <Flex
            onClick={() => {
              props.onDeleteClick();
            }}
            style={{
              cursor: "pointer",
              // border:"red solid 1px"
            }}
            justify="center"
            align="center"
          >
            <IconX fill="#808080" color="#808080" />
          </Flex>
        </Flex>
      </Flex>
      {answers.map((x, i) => {
        return (
          <MCQOption
            index={i}
            text={x.text}
            isCorrect={x.isCorrect}
            answers={answers}
            setanswers={(val) => {
              answers[i] = val[i];
              setanswers([...answers]);
            }}
            onimageAdd={(val) => {
              setanswerImages((prev) => {
                const prev1 = [...prev];
                prev1[i] = val;
                props.onEditClick({
                  ...props.data,
                  answerImageUrl: prev1,
                });
                return prev1;
              });
            }}
            onDeleteOption={() => {
              setanswerImages((prev) => {
                const prev1 = [...prev];
                prev1.splice(i, 1);
                props.onEditClick({
                  ...props.data,
                  answerImageUrl: prev1,
                });
                return prev1;
              });
            }}
            answerImg={answerImages[i]}
            type={QuestionType.CaseQues.type}
          />
        );
      })}
      <Flex
        align="center"
        style={{
          border: "none",
          borderBottom: "2px solid #CCCCCC",
          // background: "#F7F7F7",
          borderRadius: 0,
          // height: "40px",
        }}
        px={10}
        w="98%"
        py={15}
        onClick={() => {
          setanswers((prev: any) => {
            const prev1 = {
              text: "",
              isCorrect: false,
            };
            prev.push(prev1);
            return prev;
          });
          setanswerImages((prev) => {
            return [...prev, ""];
          });
        }}
      >
        <Radio
          styles={{
            radio: {
              border: "#808080 solid 1px",
              opacity: 0.4,
            },
          }}
          checked={false}
        />
        <Text fz={14} fw={400} color="#CCCCCC" ml={10}>
          Add Option
        </Text>
      </Flex>
      <Text>Solution:</Text>
      <SingleTextFeild
        text={solutionText}
        setText={setSolutionText}
        placeHolderText="Type your question"
      />

      <Flex
        style={{
          order: isMd ? 1 : 1,
        }}
        gap={10}
        align="right"
        w="100%"
      >
        <NumberInput
          value={questionMark}
          onChange={(val) => {
            setQuestionMark(val ?? 0);
            props.onEditClick({
              ...props.data,
              totalMarks: val ?? 0,
            });
          }}
          min={0}
          w={isMd ? "80px" : "auto"}
          label="Max Marks"
        />
        <NumberInput
          value={negativeMark}
          onChange={(val) => {
            setNegativeMark(val ?? 0);
            console.log(val);
            props.onEditClick({
              ...props.data,
              totalNegativeMarks: val ?? 0,
            });
          }}
          min={0}
          w={isMd ? "80px" : "auto"}
          label="Neg Marks"
        />
      </Flex>
    </Stack>
  );
}
interface MCQOptionProps {
  setanswers: (
    data: {
      isCorrect: boolean;
      text: string;
    }[]
  ) => void;
  answers: {
    text: string;
    isCorrect: boolean;
  }[];
  index: number;
  text: string;
  isCorrect: boolean;
  onimageAdd: (val: string) => void;
  onDeleteOption: () => void;
  answerImg: string;
  type: string;
}
function MCQOption(props: MCQOptionProps) {
  const [isfocused, setFocused] = useState<boolean>(false);
  const isMd = useMediaQuery(`(max-width: 820px)`);
  const [isMouseHover, setIsMouseHover] = useState<boolean>(false);

  return (
    <Flex
      align="center"
      justify="space-between"
      onFocus={() => {
        setFocused(true);
      }}
      onBlur={() => {
        setFocused(false);
      }}
    >
      <Flex
        align="center"
        style={{
          border: "none",
          borderBottom: "2px solid black",
          background: "#F7F7F7",
          borderRadius: 0,
          // height: "40px",
        }}
        px={10}
        w="95%"
        justify="space-between"
        // h="80px"
      >
        <Flex align="center" w="100%">
          {props.type !== QuestionType.MultiCorrectQues.type && (
            <Radio
              checked={props.isCorrect}
              onChange={(e) => {
                let prev1 = [...props.answers];

                prev1 = prev1.map((x, index) => {
                  if (props.index === index) {
                    return {
                      isCorrect: true,
                      text: x.text,
                    };
                  }
                  return {
                    isCorrect: false,
                    text: x.text,
                  };
                });
                props.setanswers(prev1);
              }}
            />
          )}
          {props.type === QuestionType.MultiCorrectQues.type && (
            <Checkbox
              checked={props.isCorrect}
              onChange={(e) => {
                let prev1 = [...props.answers];

                prev1 = prev1.map((x, index) => {
                  if (props.index === index) {
                    return {
                      isCorrect: !x.isCorrect,
                      text: x.text,
                    };
                  }
                  return {
                    isCorrect: x.isCorrect,
                    text: x.text,
                  };
                });
                props.setanswers(prev1);
              }}
            />
          )}
          <Stack ml={20} w="100%">
            {props.answerImg && (
              <ShowImage
                url={props.answerImg}
                onDeleteClick={() => {
                  props.onimageAdd("");
                }}
              />
            )}
            <EditorField
              content={props.text}
              setContent={(val) => {
                const updatedAnswers = [...props.answers];
                updatedAnswers[props.index] = {
                  ...updatedAnswers[props.index],
                  text: val,
                };
                console.log(props.index, updatedAnswers);
                props.setanswers(updatedAnswers);
              }}
              placeholderText={`Type your option ${props.index + 1}`}
            />
          </Stack>
        </Flex>
      </Flex>
      <Flex justify="center" align="center" w="5%" pl={isMd ? 10 : 0}>
        <Flex
          onClick={() => {
            const prevCopy = [...props.answers]; // Create a copy of the previous array
            const prevCopy1 = [...props.answers]; // Create a copy of the previous array
            if (
              props.index >= 0 &&
              props.index < prevCopy.length &&
              prevCopy.length > 2
            ) {
              prevCopy.splice(props.index, 1);
              if (prevCopy1[props.index].isCorrect === true) {
                prevCopy[0].isCorrect = true;
              }
            } else {
              console.log("Index out of range, cannot delete element.");
            }
            props.setanswers(prevCopy);
            props.onDeleteOption();
          }}
          style={{
            cursor: "pointer",
            // border:"red solid 1px"
          }}
          justify="center"
          align="center"
        >
          <IconX fill="#808080" color="#808080" />
        </Flex>
      </Flex>
    </Flex>
  );
}

interface GalleryIconProps {
  onimageAdd: (val: string) => void;
}
export const validateFile = (file: File) => {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject("No file selected.");
    }

    const validImageTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/svg+xml",
      "image/bmp",
      "image/tiff",
      "image/x-icon",
      "image/vnd.microsoft.icon",
      "image/vnd.adobe.photoshop",
      "image/heic",
    ];
    if (!validImageTypes.includes(file.type)) {
      reject("Please upload a valid image file.");
    }

    const maxSizeInBytes = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSizeInBytes) {
      reject("File size exceeds 5MB limit.");
    }

    resolve(file);
  });
};

interface SingleTextFieldProps {
  text: string;
  setText: (val: string) => void;
  placeHolderText: string;
}

function EditorField(props: {
  content: string;
  setContent: (val: string) => void;
  placeholderText: string;
}) {
  const [isClick, setisClick] = useState<boolean>(false);

  return (
    <Box>
      <Flex justify="right">
        <Button
          size="xs"
          onClick={() => {
            setisClick(!isClick);
          }}
          variant="subtle"
        >
          Symbols
        </Button>
      </Flex>
      <div>
        <SunEditor
          autoFocus={true}
          lang="en"
          hideToolbar={!isClick}
          setOptions={{
            showPathLabel: false,
            minHeight: "20px",
            maxWidth: "80vw",
            height: "auto",
            width: "100%",
            placeholder: props.placeholderText,
            plugins: [
              align,
              font,
              fontColor,
              fontSize,
              formatBlock,
              hiliteColor,
              horizontalRule,
              lineHeight,
              list,
              paragraphStyle,
              table,
              template,
              textStyle,
              image,
              link,
            ],
            defaultStyle: "font-size: 18px;",
            buttonList: [
              ["undo", "redo"],
              ["formatBlock"],
              ["paragraphStyle"],
              [
                "bold",
                "underline",
                "italic",
                "strike",
                "subscript",
                "superscript",
              ],
              ["fontColor", "hiliteColor"],
              ["removeFormat"],
              "/",
              ["outdent", "indent"],
              ["align", "horizontalRule", "list", "lineHeight"],
              ["image"],
            ],
            formats: ["p", "div", "h1", "h2", "h3", "h4", "h5", "h6"],
            // font: [
            //   "Arial",
            //   "Calibri",
            //   "Comic Sans",
            //   "Courier",
            //   "Garamond",
            //   "Georgia",
            //   "Impact",
            //   "Lucida Console",
            //   "Palatino Linotype",
            //   "Segoe UI",
            //   "Tahoma",
            //   "Times New Roman",
            //   "Trebuchet MS",
            // ],
            imageResizing: true,
          }}
          onChange={(c) => {
            props.setContent(c);
          }}
          setContents={props.content}
        />
      </div>
    </Box>
  );
}

function SingleTextFeild(props: SingleTextFieldProps) {
  return (
    <Flex
      style={{
        border: "none",
        borderBottom: "2px solid black",
        background: "#F7F7F7",
        borderRadius: 0,
      }}
      w="100%"
    >
      <Stack w="100%">
        <EditorField
          content={props.text}
          setContent={props.setText}
          placeholderText={props.placeHolderText}
        />
      </Stack>
    </Flex>
  );
}

export function IntegerInput(props: {
  answerText: string;
  setAnswerText: (val: string) => void;
}) {
  const isMd = useMediaQuery(`(max-width: 820px)`);

  return (
    <Flex align="center">
      <Text fz={isMd ? 14 : 16} fw={600} mr={20}>
        Enter your answer:
      </Text>
      <NumberInput
        value={
          props.answerText.length > 0 ? parseInt(props.answerText) : undefined
        }
        onChange={(val) => {
          if (val) props.setAnswerText(val?.toString() ?? 0);
        }}
        w="100px"
      />
    </Flex>
  );
}

function LabelFeild(props: { text: string }) {
  const isMd = useMediaQuery(`(max-width: 820px)`);

  return (
    <Text fz={isMd ? 14 : 16} fw={600}>
      {props.text}
    </Text>
  );
}
interface AddNewQuestionProps {
  onSubjectiveSubmit: (val: SUBjectivetypedQuestion) => void;
  onMcqSubmit: (val: MCQTypedQuestion) => void;
  onCaseBasedQuestionSubmit: (val: CASEtypedQuestion) => void;
  questionType: QuestionType;
  onDeleteClicked: () => void;
  sectionMarks: number;
  onChangeQuestionType?: (val: string) => void;
  hideMarks: boolean;
  negativeMark: number;
  totalQuestions: number;
}
export function AddNewQuestion(props: AddNewQuestionProps) {
  const [questionType1, setQuestionType1] = useState<string | null>(
    QuestionType.McqQues.type
  );
  const questionType = findQuestionType(questionType1 ?? "MCQ");
  const values = ["", "", "", ""];
  const initialValues = values.map((x, i) => {
    if (i === 0) {
      return {
        isCorrect: true,
        text: x,
      };
    }
    return {
      isCorrect: false,
      text: x,
    };
  });
  const [answers, setanswers] = useState<
    {
      isCorrect: boolean;
      text: string;
    }[]
  >(initialValues);
  const [questionText, setQuestionText] = useState<string>("");
  const [answerText, setAnswerText] = useState<string>("");
  const emptyMcqQuestion: MCQTypedQuestion = {
    text: "",
    answers: initialValues,
    questionImageUrl: "",
    answerImageUrl: values,
    type: "MCQ",
    totalMarks: 0,
    difficultyLevel: "MEDIUM",
    totalNegativeMarks: 0,
    explaination: "",
    _id: "",
    fromQuestionBank: false,
  };

  const emptySubjectiveQuestion: SUBjectivetypedQuestion = {
    text: "",
    questionImageUrl: "",
    type: "INT",
    questionType: "INT",
    answer: "",
    answerImageUrl: "",
    totalMarks: 0,
    difficultyLevel: "MEDIUM",
    totalNegativeMarks: 0,
    explaination: "",
    _id: "",
    fromQuestionBank: false,
  };
  const [questions, setQuestions] = useState<
    (MCQTypedQuestion | SUBjectivetypedQuestion)[]
  >([emptyMcqQuestion]);

  const [answerImages, setanswerImages] = useState<string[]>(values);
  const [questionImage, setQuestionImage] = useState<string>("");
  const [answerImage, setAnswerImage] = useState<string>("");
  const [difficulty, setDifficulty] = useState<DifficultyLevel>(
    DifficultyLevel.MEDIUM
  );
  const [solutionText, setSolutionText] = useState<string>("");

  const isMd = useMediaQuery(`(max-width: 820px)`);
  const [questionMark, setQuestionMark] = useState<number>(props.sectionMarks);
  const [negativeMark, setNegativeMark] = useState<number>(props.negativeMark);
  useEffect(() => {
    if (props.questionType.type === QuestionType.AllQues.type)
      setQuestionType1(QuestionType.McqQues.type);
    else setQuestionType1(props.questionType.type);
  }, [props.questionType]);

  const isValidObjectiveQues =
    questionText.length !== 0 &&
    answers.filter((x) => x.text.length === 0).length === 0;
  const isValidSubjectiveQuestion =
    questionText.trim().length !== 0 && answerText.trim().length !== 0;
  const isValidCaseQues =
    questionText.trim().length !== 0 &&
    questions.every((question) => {
      const isQuestionValid = question.text.trim().length !== 0;
      const areAnswersValid =
        question.type == QuestionType.McqQues.type
          ? (question as MCQTypedQuestion).answers.every(
              (answer) => answer.text.trim().length !== 0
            )
          : (question as SUBjectivetypedQuestion).answer.length > 0;
      return isQuestionValid && areAnswersValid;
    });

  function isValidQuestion() {
    if (questionType.parentType === QuestionParentType.MCQQ) {
      return isValidObjectiveQues && questionMark !== 0;
    } else if (questionType.parentType === QuestionParentType.SUBQ) {
      return isValidSubjectiveQuestion && questionMark !== 0;
    } else {
      return isValidCaseQues && questionMark !== 0;
    }
  }

  return (
    <Card
      py={20}
      px={30}
      // shadow="0px 0px 8px 0px rgba(0, 0, 0, 0.25);"
      style={{ borderRadius: "10px", minHeight: "250px" }}
      withBorder
    >
      <Stack>
        <Flex
          justify="space-between"
          align="center"
          direction={isMd ? "column" : "row"}
        >
          {isMd && props.questionType.type === QuestionType.AllQues.type && (
            <Select
              data={allQuestionTypesValues}
              w="100%"
              value={questionType1}
              onChange={(val) => {
                if (props.onChangeQuestionType && val !== null)
                  props.onChangeQuestionType(val);
                setQuestionType1(val);
              }}
              styles={{
                input: {
                  height: "40px",
                },
              }}
              mb={10}
              zIndex={9999}
            />
          )}
          <Flex
            w={
              isMd || props.questionType.type !== QuestionType.AllQues.type
                ? "100%"
                : "75%"
            }
          >
            <Stack w="100%">
              {questionType1 ===
                QuestionType.linkedComprehensionBasedQuestions.type && (
                <LabelFeild text="Enter your paragraph/Comprehension:" />
              )}
              <SingleTextFeild
                text={questionText}
                setText={setQuestionText}
                placeHolderText={
                  questionType1 ===
                  QuestionType.linkedComprehensionBasedQuestions.type
                    ? "Add Case Based Text"
                    : "Add new Question"
                }
              />
            </Stack>
          </Flex>
          {!isMd && props.questionType.type === QuestionType.AllQues.type && (
            <Select
              data={allQuestionTypesValues}
              w="20%"
              value={questionType1}
              onChange={(val) => {
                if (props.onChangeQuestionType && val !== null)
                  props.onChangeQuestionType(val);
                setQuestionType1(val);
              }}
              styles={{
                input: {
                  height: "40px",
                },
              }}
              withinPortal={true}
            />
          )}
        </Flex>
        {questionType &&
          questionType?.parentType === QuestionParentType.MCQQ && (
            <Stack spacing={5}>
              {answers.map((x, i) => {
                return (
                  <MCQOption
                    index={i}
                    text={x.text}
                    isCorrect={x.isCorrect}
                    answers={answers}
                    setanswers={(newAnswers) => {
                      answers[i] = newAnswers[i];
                      setanswers([...answers]);
                    }}
                    onimageAdd={(val) => {
                      setanswerImages((prev) => {
                        const prev1 = [...prev];
                        prev1[i] = val;
                        return prev1;
                      });
                    }}
                    onDeleteOption={() => {
                      setanswerImages((prev) => {
                        const prev1 = [...prev];
                        prev1.splice(i, 1);
                        return prev1;
                      });
                    }}
                    answerImg={answerImages[i]}
                    type={questionType.type}
                  />
                );
              })}
              <Flex
                align="center"
                style={{
                  border: "none",
                  borderBottom: "2px solid #CCCCCC",
                  // background: "#F7F7F7",
                  borderRadius: 0,
                  // height: "40px",
                }}
                px={10}
                w="98%"
                // h="80px"
                py={15}
                onClick={() => {
                  setanswers((prev) => {
                    const prev1 = {
                      text: "",
                      isCorrect: false,
                    };
                    prev.push(prev1);
                    return prev;
                  });
                  setanswerImages((prev) => {
                    return [...prev, ""];
                  });
                }}
                // mr={20}
              >
                <Radio
                  styles={{
                    radio: {
                      border: "#808080 solid 1px",
                      opacity: 0.4,
                    },
                  }}
                  checked={false}
                />
                <Text fz={14} fw={400} color="#CCCCCC" ml={10}>
                  Add Option
                </Text>
              </Flex>
            </Stack>
          )}
        {questionType &&
          questionType?.parentType === QuestionParentType.SUBQ && (
            <Flex w="100%">
              {questionType.type !== QuestionType.IntegerQues.type && (
                <SingleTextFeild
                  text={answerText}
                  setText={setAnswerText}
                  placeHolderText="Type your answer"
                />
              )}
              {questionType.type === QuestionType.IntegerQues.type && (
                <IntegerInput
                  answerText={answerText}
                  setAnswerText={setAnswerText}
                />
              )}
            </Flex>
          )}
        {questionType &&
          questionType?.parentType === QuestionParentType.CASEQ && (
            <Stack>
              <LabelFeild text="Passage Study Questions:" />
              <Stack>
                {questions.map((x, i) => {
                  if (x.type == QuestionType.McqQues.type) {
                    return (
                      <MCQCaseBasedQuestion
                        data={x as MCQTypedQuestion}
                        onEditClick={(val) => {
                          setQuestions((prev: any) => {
                            const prev1 = [...prev];
                            prev1[i] = val;
                            return prev1;
                          });
                        }}
                        onDeleteClick={() => {
                          if (questions.length > 1)
                            setQuestions((prev: any) => {
                              const prev1 = [...prev];
                              prev1.splice(i, 1);
                              return prev1;
                            });
                        }}
                      />
                    );
                  } else {
                    return (
                      <Stack>
                        <Text> Question{i+1}</Text>
                        <SingleTextFeild
                          text={x.text}
                          setText={(val: string) => {
                            x.text = val;
                            setQuestions([...questions]);
                          }}
                          placeHolderText="Type your question"
                        />
                        {x.type === QuestionType.IntegerQues.type && (
                          <IntegerInput
                            answerText={(x as SUBjectivetypedQuestion).answer}
                            setAnswerText={(answerText: string) => {
                              (x as SUBjectivetypedQuestion).answer =
                                answerText;
                              setQuestions([...questions]);
                            }}
                          />
                        )}
                        {x.type !== QuestionType.IntegerQues.type && (
                          <SingleTextFeild
                            text={(x as SUBjectivetypedQuestion).answer}
                            setText={(answerText: string) => {
                              (x as SUBjectivetypedQuestion).answer =
                                answerText;
                              setQuestions([...questions]);
                            }}
                            placeHolderText="Type your answer"
                          />
                        )}
                      </Stack>
                    );
                  }
                })}
              </Stack>
              <Button
                bg="white"
                color="black"
                size={isMd ? "lg" : "xl"}
                onClick={() => {
                  setQuestions((prev: any) => {
                    return [...prev, emptyMcqQuestion];
                  });
                }}
                style={{
                  color: "black",
                  // border:'black solid 1px',
                  boxShadow: "0px 0px 2px 0px rgba(0, 0, 0, 0.25)",
                  borderRadius: "10px",
                }}
                sx={{
                  "&:hover": {
                    background: "white",
                  },
                }}
                fz={isMd ? 14 : 18}
              >
                Add Multiple Choice Question
              </Button>

              <Button
                bg="white"
                color="black"
                size={isMd ? "lg" : "xl"}
                onClick={() => {
                  setQuestions((prev: any) => {
                    return [...prev, emptySubjectiveQuestion];
                  });
                }}
                style={{
                  color: "black",
                  // border:'black solid 1px',
                  boxShadow: "0px 0px 2px 0px rgba(0, 0, 0, 0.25)",
                  borderRadius: "10px",
                }}
                sx={{
                  "&:hover": {
                    background: "white",
                  },
                }}
                fz={isMd ? 14 : 18}
              >
                Add Integer Type Question
              </Button>
            </Stack>
          )}
        {questionType &&
          questionType?.parentType !== QuestionParentType.CASEQ && (
            <>
              <Text>Solution:</Text>
              <SingleTextFeild
                text={solutionText}
                setText={setSolutionText}
                placeHolderText="Type your solution"
              />
            </>
          )}

        <EditFooter
          questionMark={questionMark}
          negativeMark={negativeMark}
          setquestionMark={setQuestionMark}
          setNegativeMark={setNegativeMark}
          difficulty={difficulty}
          hideMarks={
            props.hideMarks ||
            questionType.parentType === QuestionParentType.CASEQ
          }
          isValidQuestion={isValidQuestion()}
          onClick={async () => {
            if (isValidQuestion()) {
              if (questionType.parentType === QuestionParentType.MCQQ) {
                const text1 = await uploadPhotos(questionText);
                const answers1 = answers;
                for (let i = 0; i < answers.length; i++) {
                  const ans = await uploadPhotos(answers[i].text);
                  answers1[i].text = ans;
                }
                props.onMcqSubmit({
                  text: text1,
                  answers: answers1,
                  _id: `MCQ-${props.totalQuestions}`,
                  questionImageUrl: questionImage,
                  answerImageUrl: answerImages,
                  type: questionType.type,
                  totalMarks: questionMark,
                  difficultyLevel: difficulty,
                  totalNegativeMarks: negativeMark,
                  explaination: solutionText,
                  fromQuestionBank: false,
                });
              } else if (questionType.parentType === QuestionParentType.SUBQ) {
                const text1 = await uploadPhotos(questionText);
                const text2 = await uploadPhotos(answerText);
                props.onSubjectiveSubmit({
                  text: text1,
                  answer: text2,
                  questionType: questionType.type,
                  _id: `SUB-${props.totalQuestions}`,
                  questionImageUrl: questionImage,
                  answerImageUrl: answerImage,
                  type: questionType.type,
                  totalMarks: questionMark,
                  difficultyLevel: difficulty,
                  totalNegativeMarks: negativeMark,
                  explaination: solutionText,
                  fromQuestionBank: false,
                });
              } else if (questionType.parentType === QuestionParentType.CASEQ) {
                const text1 = await uploadPhotos(questionText);
                const mcqTextQ = questions;
                for (let i = 0; i < questions.length; i++) {
                  const text1 = await uploadPhotos(mcqTextQ[i].text);
                  if (questions[i].type == QuestionType.McqQues.type) {
                    const answers2 = (mcqTextQ[i] as MCQTypedQuestion).answers;
                    for (let i = 0; i < answers2.length; i++) {
                      const ans = await uploadPhotos(answers2[i].text);
                      answers2[i].text = ans;
                    }
                    mcqTextQ[i].text = text1;
                    (mcqTextQ[i] as MCQTypedQuestion).answers = answers2;
                  } else {
                    (mcqTextQ[i] as SUBjectivetypedQuestion).answer = (
                      mcqTextQ[i] as SUBjectivetypedQuestion
                    ).answer;
                  }
                }
                props.onCaseBasedQuestionSubmit({
                  caseStudyText: text1,
                  questions: mcqTextQ,
                  _id: `CASE-${props.totalQuestions}`,
                  questionImageUrl: questionImage,
                  type: QuestionType.linkedComprehensionBasedQuestions.type,
                  totalMarks: questionMark,
                  difficultyLevel: difficulty,
                  totalNegativeMarks: negativeMark,
                  explaination: "",
                  fromQuestionBank: false,
                });
              }
            }
          }}
          setDifficulty={setDifficulty}
        />
      </Stack>
    </Card>
  );
}

interface EditAndDeleteSectionProps {
  canBeDeleted: boolean;
  onDeleteClick: () => void;
  onEditClick: () => void;
  questionMark: number;
  hideMarks: boolean;
  negativeMarks: string;
}
export function EditAndDeleteSection(props: EditAndDeleteSectionProps) {
  const isMd = useMediaQuery(`(max-width: 820px)`);
  return (
    <>
      <Divider size="md" color="#E5E7EB" mx={-30} mt={30} />
      <Flex
        justify={isMd ? "space-between" : "center"}
        style={{
          position: "relative",
          width: "100%",
        }}
        align="center"
      >
        <Flex
          style={{
            order: isMd ? 2 : 1,
          }}
        >
          {props.canBeDeleted && (
            <Box
              mr={10}
              style={{
                cursor: "pointer",
              }}
              onClick={() => {
                props.onDeleteClick();
              }}
            >
              <IconDeleteQuestion />
            </Box>
          )}
          <Box
            style={{
              cursor: "pointer",
            }}
            onClick={() => {
              props.onEditClick();
              // props.onDeleteClick();
            }}
          >
            <IconEditQuestion />
          </Box>
        </Flex>
        {!props.hideMarks && (
          <Flex
            style={{
              position: isMd ? "relative" : "absolute",
              right: 0,
              order: isMd ? 1 : 2,
            }}
          >
            <Text fz={isMd ? 14 : 20} fw={600}>
              Marks:{props.questionMark}
              {" |"}
            </Text>
            <Text fz={isMd ? 14 : 20} fw={600}>
              {" "}
              Neg Marks:{props.negativeMarks}
            </Text>
          </Flex>
        )}
      </Flex>
    </>
  );
}

function uploadPhotos(data: string): Promise<string> {
  return new Promise(async (resolve, reject) => {
    try {
      const images = extractBase64StringsFromString(data ?? "");
      let data1 = data;

      for (let i = 0; i < images.length; i++) {
        const blob = base64StringToBlob(images[i], "image.png");

        try {
          const fileUploadData = await FileUpload({ file: blob });
          data1 = data1.replace(images[i], fileUploadData.url);
        } catch (error) {
          reject(error);
          return;
        }
      }

      resolve(data1);
    } catch (error) {
      reject(error);
    }
  });
}

interface SubjectiveQuestionQuestionProps {
  index: number;
  onDeleteClick: () => void;
  onEditClick: (val: SUBjectivetypedQuestion) => void;
  question: SUBjectivetypedQuestion;
  canBeDeleted: boolean;
  testType: string | null;
  questionType: string;
  showBottomBar: boolean;
  hideMarks: boolean;
}

export function SubjectivequestionCard(props: SubjectiveQuestionQuestionProps) {
  const [isEditQuestion, setisEditQuestion] = useState<boolean>(false);
  const [questionText, setQuestionText] = useState<string>(props.question.text);
  const [questionImage, setQuestionImage] = useState<string>(
    props.question.questionImageUrl
  );
  const [answerImage, setAnswerImage] = useState<string>(
    props.question.answerImageUrl
  );
  const [questionMark, setQuestionMark] = useState<number>(
    props.question.totalMarks
  );
  const [negativeMark, setNegativeMark] = useState<number>(
    props.question.totalMarks
  );
  const [answerText, setAnswerText] = useState<string>(props.question.answer);
  const [difficulty, setDifficulty] = useState<DifficultyLevel>(
    DifficultyLevel.MEDIUM
  );
  const [solutionText, setSolutionText] = useState<string>(
    props.question.explaination
  );
  const isMd = useMediaQuery(`(max-width: 820px)`);
  const isValidQuestion =
    questionText.trim().length !== 0 &&
    answerText.trim().length !== 0 &&
    (!props.hideMarks ? questionMark !== 0 : true);
  useEffect(() => {
    setQuestionImage(props.question.questionImageUrl);
  }, [props.question.questionImageUrl]);
  useEffect(() => {
    setAnswerImage(props.question.answerImageUrl);
  }, [props.question.answerImageUrl]);

  useEffect(() => {
    setAnswerText(props.question.answer);
  }, [props.question.answer]);
  useEffect(() => {
    setSolutionText(props.question.explaination);
  }, [props.question.explaination]);

  useEffect(() => {
    setQuestionText(props.question.text);
  }, [props.question.text]);

  useEffect(() => {
    setQuestionMark(props.question.totalMarks);
  }, [props.question.totalMarks]);

  return (
    <>
      <Card
        py={isMd ? 15 : 25}
        px={isMd ? 15 : 30}
        // shadow="0px 0px 8px 0px rgba(0, 0, 0, 0.25)"
        style={{ borderRadius: "10px", position: "relative" }}
        withBorder
      >
        {isEditQuestion === false && (
          <Stack px={isMd ? 15 : 30}>
            {props.question.questionImageUrl && (
              <ShowImage url={props.question.questionImageUrl} />
            )}
            <Flex justify="space-between" align="flex-start">
              <Flex>
                <span
                  style={{
                    fontSize: 16,
                    fontWeight: 600,
                    minWidth: 90,
                  }}
                >{`Question ${props.index}. `}</span>
                <div
                  dangerouslySetInnerHTML={{
                    __html: reduceImageScaleAndAlignLeft2(props.question.text),
                  }}
                ></div>
              </Flex>
              <DifficultyChip
                difficultyLevel={
                  props.question.difficultyLevel as DifficultyLevel
                }
              />
            </Flex>
            <Divider size="sm" color="#000000" mx={-30} />
            {props.question.answerImageUrl && (
              <ShowImage url={props.question.answerImageUrl} />
            )}
            <Flex mt={20}>
              <span
                style={{
                  fontSize: 16,
                  fontWeight: 600,
                }}
              >{`Ans. `}</span>
              <div
                dangerouslySetInnerHTML={{
                  __html: reduceImageScaleAndAlignLeft2(props.question.answer),
                }}
              ></div>
            </Flex>
            {props.question.explaination &&
              props.question.explaination !== "" && (
                <Flex>
                  <span
                    style={{
                      fontSize: 16,
                      fontWeight: 600,
                    }}
                  >{`Solution. `}</span>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: reduceImageScaleAndAlignLeft2(
                        props.question.explaination
                      ),
                    }}
                  ></div>
                </Flex>
              )}
            {props.showBottomBar === true && (
              <EditAndDeleteSection
                canBeDeleted={props.canBeDeleted}
                onEditClick={() => {
                  setisEditQuestion(true);
                  Mixpanel.track(WebAppEvents.CREATE_TEST_EDIT_CLICKED, {
                    testType: props.testType,
                  });
                }}
                onDeleteClick={() => {
                  props.onDeleteClick();
                  Mixpanel.track(WebAppEvents.CREATE_TEST_DELETE_CLICKED, {
                    testType: props.testType,
                  });
                }}
                questionMark={props.question.totalMarks}
                hideMarks={props.hideMarks}
                negativeMarks={props.question.totalNegativeMarks.toString()}
              />
            )}
          </Stack>
        )}
        {isEditQuestion === true && (
          <Stack>
            <SingleTextFeild
              text={questionText}
              setText={setQuestionText}
              placeHolderText="Type your question"
            />
            {props.question.type === QuestionType.IntegerQues.type && (
              <IntegerInput
                answerText={answerText}
                setAnswerText={setAnswerText}
              />
            )}
            {props.question.type !== QuestionType.IntegerQues.type && (
              <SingleTextFeild
                text={answerText}
                setText={setAnswerText}
                placeHolderText="Type your answer"
              />
            )}
            <Text>Solution:</Text>
            <SingleTextFeild
              text={solutionText}
              setText={setSolutionText}
              placeHolderText="Type your question"
            />
            <EditFooter
              questionMark={questionMark}
              setquestionMark={setQuestionMark}
              onClick={async () => {
                const questionData = await uploadPhotos(questionText);
                const answerData = await uploadPhotos(answerText);

                if (isValidQuestion) {
                  const editedQuestion: SUBjectivetypedQuestion = {
                    text: questionData,
                    answer: answerData,
                    _id: props.question._id,
                    questionImageUrl: questionImage,
                    answerImageUrl: answerImage,
                    totalMarks: questionMark,
                    questionType: props.question.type,
                    type: props.question.type,
                    difficultyLevel: difficulty,
                    totalNegativeMarks: props.question.totalNegativeMarks,
                    explaination: "",
                    fromQuestionBank: props.question.fromQuestionBank,
                  };

                  props.onEditClick(editedQuestion);
                  setisEditQuestion(false);
                }
              }}
              isValidQuestion={isValidQuestion}
              difficulty={difficulty}
              setDifficulty={setDifficulty}
              hideMarks={props.hideMarks}
              negativeMark={negativeMark}
              setNegativeMark={setNegativeMark}
            />
          </Stack>
        )}
      </Card>
    </>
  );
}

export function ShowImage(props: { url: string; onDeleteClick?: () => void }) {
  return (
    <>
      {props.url && (
        <Flex align="center">
          <img src={props.url} width="100px" />
          {props.onDeleteClick && (
            <IconX
              size={20}
              onClick={() => {
                if (props.onDeleteClick) props.onDeleteClick();
              }}
              style={{
                cursor: "pointer",
                marginLeft: 10,
              }}
            />
          )}
        </Flex>
      )}
    </>
  );
}

export function DisplayHtmlText(props: { text: string }) {
  return (
    <div
      dangerouslySetInnerHTML={{
        __html: props.text,
      }}
      style={{
        marginLeft: "3px",
        paddingLeft: 5,
        margin: 0,
      }}
    ></div>
  );
}

interface CaseBasedQuestionProps {
  question: CASEtypedQuestion;
  onDeleteClick: () => void;
  onEditClick: (val: CASEtypedQuestion) => void;
  canBeDeleted: boolean;
  testType: string | null;
  index: number;
  showBottomBar: boolean;
  hideMarks: boolean;
}
export function CaseBasedQuestionCard(props: CaseBasedQuestionProps) {
  const [isEditQuestion, setisEditQuestion] = useState<boolean>(false);
  const [questionText, setQuestionText] = useState<string>(
    props.question.caseStudyText
  );
  const [questionImage, setQuestionImage] = useState<string>(
    props.question.questionImageUrl
  );

  const [questions, setQuestions] = useState<
    (MCQTypedQuestion | SUBjectivetypedQuestion)[]
  >(props.question.questions);
  const [questionMark, setQuestionMark] = useState<number>(
    props.question.totalMarks
  );
  const [negativeMark, setNegativeMark] = useState<number>(
    props.question.totalNegativeMarks
  );
  const [difficulty, setDifficulty] = useState<DifficultyLevel>(
    DifficultyLevel.MEDIUM
  );

  const values = ["", "", "", ""];
  const isValidQuestion =
    questionText.length !== 0 &&
    questionText.trim().length !== 0 &&
    questions.every((question) => {
      const isQuestionValid = question.text.trim().length !== 0;
      const areAnswersValid =
        question.type == QuestionType.McqQues.type
          ? (question as MCQTypedQuestion).answers.every(
              (answer) => answer.text.trim().length !== 0
            )
          : (question as SUBjectivetypedQuestion).answer.length > 0;
      return isQuestionValid && areAnswersValid && question.totalMarks !== 0;
    }) &&
    !props.hideMarks
      ? true
      : true;

  const initialValues = values.map((x, i) => {
    if (i === 0) {
      return {
        isCorrect: true,
        text: x,
      };
    }
    return {
      isCorrect: false,
      text: x,
    };
  });

  const emptyMcqQuestion: MCQTypedQuestion = {
    text: "",
    answers: initialValues,
    questionImageUrl: "",
    answerImageUrl: ["", "", "", ""],
    type: "MCQ",
    totalMarks: 0,
    difficultyLevel: "MEDIUM",
    totalNegativeMarks: 0,
    explaination: "",
    _id: "",
    fromQuestionBank: false,
  };
  const emptySubjectiveQuestion: SUBjectivetypedQuestion = {
    text: "",
    questionImageUrl: "",
    type: "INT",
    questionType: "INT",
    answer: "",
    answerImageUrl: "",
    totalMarks: 0,
    difficultyLevel: "MEDIUM",
    totalNegativeMarks: 0,
    explaination: "",
    _id: "",
    fromQuestionBank: false,
  };

  useEffect(() => {
    setQuestionImage(props.question.questionImageUrl);
  }, [props.question.questionImageUrl]);
  useEffect(() => {
    setQuestions(props.question.questions);
  }, [props.question.questions]);

  useEffect(() => {
    setQuestionText(props.question.caseStudyText);
  }, [props.question.caseStudyText]);

  useEffect(() => {
    setQuestionMark(props.question.totalMarks);
  }, [props.question.totalMarks]);

  const isMd = useMediaQuery(`(max-width: 820px)`);

  return (
    <Card
      py={25}
      px={30}
      // shadow="0px 0px 8px 0px rgba(0, 0, 0, 0.25);"
      style={{ borderRadius: "10px", position: "relative" }}
      withBorder
    >
      {isEditQuestion === false && (
        <Stack px={30}>
          <ShowImage url={props.question.questionImageUrl} />
          <Flex justify="space-between" align="flex-start">
            <Flex>
              <span
                style={{
                  fontSize: 16,
                  fontWeight: 600,
                  minWidth: 90,
                }}
              >{`Question ${props.index}. `}</span>
              <div
                dangerouslySetInnerHTML={{
                  __html: reduceImageScaleAndAlignLeft2(
                    props.question.caseStudyText
                  ),
                }}
              ></div>
            </Flex>
            <DifficultyChip
              difficultyLevel={
                props.question.difficultyLevel as DifficultyLevel
              }
            />
          </Flex>

          {props.question.questions.map((mcqQuestion, j) => {
            return (
              <Stack>
                <ShowImage url={mcqQuestion.questionImageUrl} />
                <Flex>
                  <span
                    style={{
                      fontSize: 16,
                      fontWeight: 600,
                    }}
                  >{`${j + 1}.`}</span>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: reduceImageScaleAndAlignLeft2(mcqQuestion.text),
                    }}
                  ></div>
                </Flex>
                <Divider size="sm" color="#000000" mx={-30} />
                {mcqQuestion.type == QuestionType.McqQues.type ? (
                  <>
                    {(mcqQuestion as MCQTypedQuestion).answers.map((y, i) => {
                      return (
                        //change this parent for integer type
                        <Flex align="center">
                          <Radio checked={y.isCorrect} mr={5} />
                          <Stack>
                            <ShowImage url={mcqQuestion.answerImageUrl[i]} />
                            <div
                              dangerouslySetInnerHTML={{
                                __html: reduceImageScaleAndAlignLeft2(y.text),
                              }}
                            ></div>
                          </Stack>
                        </Flex>
                      );
                    })}
                  </>
                ) : (
                  <>
                    <div
                      dangerouslySetInnerHTML={{
                        __html: reduceImageScaleAndAlignLeft2(
                          (mcqQuestion as SUBjectivetypedQuestion).answer
                        ),
                      }}
                    ></div>
                  </>
                )}
                {mcqQuestion.explaination &&
                  mcqQuestion.explaination !== "" && (
                    <Flex>
                      <span
                        style={{
                          fontSize: 16,
                          fontWeight: 600,
                        }}
                      >{`Solution. `}</span>
                      <div
                        dangerouslySetInnerHTML={{
                          __html: reduceImageScaleAndAlignLeft2(
                            mcqQuestion.explaination
                          ),
                        }}
                      ></div>
                    </Flex>
                  )}
                <Flex justify="right">
                  <Text fz={isMd ? 14 : 20} fw={600}>
                    Marks:{mcqQuestion.totalMarks}
                    {" |"}
                  </Text>
                  <Text fz={isMd ? 14 : 20} fw={600}>
                    {" "}
                    Neg Marks:{mcqQuestion.totalNegativeMarks}
                  </Text>
                </Flex>
              </Stack>
            );
          })}
          {props.showBottomBar === true && (
            <EditAndDeleteSection
              canBeDeleted={props.canBeDeleted}
              onEditClick={() => {
                setisEditQuestion(true);
                Mixpanel.track(WebAppEvents.CREATE_TEST_EDIT_CLICKED, {
                  testType: props.testType,
                });
              }}
              onDeleteClick={() => {
                props.onDeleteClick();
                Mixpanel.track(WebAppEvents.CREATE_TEST_DELETE_CLICKED, {
                  testType: props.testType,
                });
              }}
              questionMark={props.question.totalMarks}
              hideMarks={true}
              negativeMarks={props.question.totalNegativeMarks.toString()}
            />
          )}
        </Stack>
      )}
      {isEditQuestion === true && (
        <Stack>
          <LabelFeild text="Enter your paragraph/Comprehension:" />
          <SingleTextFeild
            text={questionText}
            setText={setQuestionText}
            placeHolderText="Type your case based Text"
          />
          <Stack spacing={5}>
            <LabelFeild text="Passage Questions:" />
            {props.question.questionImageUrl && (
              <ShowImage url={props.question.questionImageUrl} />
            )}

            {questions.map((x, i) => {
              return (
                <Stack>
                  <Text>Question: {i + 1}</Text>
                  <SingleTextFeild
                    text={x.text}
                    setText={(val: string) => {
                      x.text = val;
                      setQuestions([...questions]);
                    }}
                    placeHolderText="Type your question"
                  />

                  {x.type == QuestionType.McqQues.type ? (
                    <>
                      <Stack spacing={5}>
                        {(x as MCQTypedQuestion).answers.map(
                          (innerAnswer, i) => {
                            return (
                              <MCQOption
                                index={i}
                                text={innerAnswer.text}
                                isCorrect={innerAnswer.isCorrect}
                                answers={(x as MCQTypedQuestion).answers}
                                //Todo
                                setanswers={(prev) => {
                                  (x as MCQTypedQuestion).answers[i] = prev[i];
                                  setQuestions([...questions]);
                                }}
                                onimageAdd={(val) => {
                                  (x as MCQTypedQuestion).answerImageUrl[i] =
                                    val;
                                  setQuestions([...questions]);
                                }}
                                onDeleteOption={() => {
                                  (x as MCQTypedQuestion).answerImageUrl.splice(
                                    i,
                                    1
                                  );
                                  setQuestions([...questions]);
                                }}
                                answerImg={
                                  (x as MCQTypedQuestion).answerImageUrl[i]
                                }
                                type={props.question.type}
                              />
                            );
                          }
                        )}

                        <Flex
                          align="center"
                          style={{
                            border: "none",
                            borderBottom: "2px solid #CCCCCC",
                            borderRadius: 0,
                          }}
                          px={10}
                          w="98%"
                          py={15}
                          onClick={() => {
                            (x as MCQTypedQuestion).answers.push({
                              text: "",
                              isCorrect: true,
                            });
                            (x as MCQTypedQuestion).answerImageUrl.push("");
                          }}
                        >
                          <Radio
                            styles={{
                              radio: {
                                border: "#808080 solid 1px",
                                opacity: 0.4,
                              },
                            }}
                            checked={false}
                          />
                          <Text fz={14} fw={400} color="#CCCCCC" ml={10}>
                            Add Option
                          </Text>
                        </Flex>
                      </Stack>
                    </>
                  ) : (
                    <>
                      {props.question.type ===
                        QuestionType.IntegerQues.type && (
                        <IntegerInput
                          answerText={(x as SUBjectivetypedQuestion).answer}
                          setAnswerText={(answerText: string) => {
                            (x as SUBjectivetypedQuestion).answer = answerText;
                            setQuestions([...questions]);
                          }}
                        />
                      )}
                      {props.question.type !==
                        QuestionType.IntegerQues.type && (
                        <SingleTextFeild
                          text={(x as SUBjectivetypedQuestion).answer}
                          setText={(answerText: string) => {
                            (x as SUBjectivetypedQuestion).answer = answerText;
                            setQuestions([...questions]);
                          }}
                          placeHolderText="Type your answer"
                        />
                      )}
                    </>
                  )}
                  <Text>Solution:</Text>
                  <SingleTextFeild
                    text={x.explaination}
                    setText={(explaination: string) => {
                      x.explaination = explaination;
                      setQuestions([...questions]);
                    }}
                    placeHolderText="Type your Solution"
                  />
                </Stack>
              );
            })}

            <Button
              bg="white"
              color="black"
              size="xl"
              onClick={() => {
                setQuestions((prev) => {
                  return [...prev, emptyMcqQuestion];
                });
              }}
              style={{
                color: "black",
                boxShadow: "0px 0px 2px 0px rgba(0, 0, 0, 0.25)",
                borderRadius: "10px",
              }}
              sx={{
                "&:hover": {
                  background: "white",
                },
              }}
            >
              Add Multiple Choice Question
            </Button>
            <Button
              bg="white"
              color="black"
              size="xl"
              onClick={() => {
                setQuestions((prev) => {
                  return [...prev, emptySubjectiveQuestion];
                });
              }}
              style={{
                color: "black",
                boxShadow: "0px 0px 2px 0px rgba(0, 0, 0, 0.25)",
                borderRadius: "10px",
              }}
              sx={{
                "&:hover": {
                  background: "white",
                },
              }}
            >
              Add an Integer Type Question
            </Button>
          </Stack>
          <EditFooter
            onClick={async () => {
              if (isValidQuestion) {
                const text1 = await uploadPhotos(questionText);
                const mcqTextQ = questions;
                for (let i = 0; i < questions.length; i++) {
                  if (questions[i].type == QuestionType.McqQues.type) {
                    const text1 = await uploadPhotos(mcqTextQ[i].text);
                    const answers2 = (mcqTextQ[i] as MCQTypedQuestion).answers;
                    for (let i = 0; i < answers2.length; i++) {
                      const ans = await uploadPhotos(answers2[i].text);
                      answers2[i].text = ans;
                    }
                    (mcqTextQ[i] as MCQTypedQuestion).text = text1;
                    (mcqTextQ[i] as MCQTypedQuestion).answers = answers2;
                  }
                }

                props.onEditClick({
                  caseStudyText: text1,
                  questions: mcqTextQ,
                  questionImageUrl: questionImage,
                  totalMarks: questionMark,
                  type: QuestionType.linkedComprehensionBasedQuestions.type,
                  _id: props.question._id,
                  difficultyLevel: difficulty,
                  totalNegativeMarks: negativeMark,
                  explaination: "",
                  fromQuestionBank: props.question.fromQuestionBank,
                });
                setisEditQuestion(false);
              }
            }}
            isValidQuestion={isValidQuestion}
            questionMark={questionMark}
            setquestionMark={setQuestionMark}
            difficulty={difficulty}
            setDifficulty={setDifficulty}
            hideMarks={true}
            negativeMark={negativeMark}
            setNegativeMark={setNegativeMark}
          />
        </Stack>
      )}
    </Card>
  );
}

interface EditFooterProps {
  isValidQuestion: boolean;
  onClick: () => void;
  questionMark: number;
  negativeMark: number;
  setNegativeMark: (val: number) => void;
  setquestionMark: (val: number) => void;
  difficulty: DifficultyLevel;
  setDifficulty: (val: DifficultyLevel) => void;
  hideMarks: boolean;
}

function EditFooter(props: EditFooterProps) {
  const isMd = useMediaQuery(`(max-width: 820px)`);
  return (
    <Flex
      w="100%"
      justify={isMd ? "space-between" : "center"}
      align="end"
      direction={isMd ? "column" : "row"}
      gap={isMd ? 10 : 0}
    >
      <Flex
        align="end"
        style={{
          order: isMd ? 2 : 2,
        }}
        h="100%"
        ml={isMd ? 0 : 10}
      >
        <Select
          data={DifficultyLevelValues}
          value={props.difficulty}
          onChange={(val) => {
            if (val) props.setDifficulty(val as DifficultyLevel);
          }}
          w="100px"
          mr={10}
        />
        <Box
          bg={props.isValidQuestion ? "#3174F3" : "#BDBDBD"}
          // bg="#3174F3"
          w={35}
          h={35}
          style={{ borderRadius: 10, cursor: "pointer", order: isMd ? 2 : 1 }}
          onClick={() => {
            props.onClick();
          }}
        >
          <Center h={"100%"}>
            <IconCheck color="white" stroke={2} />
          </Center>
        </Box>
      </Flex>
      {!props.hideMarks && (
        <Flex
          style={{
            order: isMd ? 1 : 1,
          }}
          gap={10}
          align="center"
        >
          <NumberInput
            value={props.questionMark}
            onChange={(val) => {
              props.setquestionMark(val ?? 0);
            }}
            min={0}
            w={isMd ? "80px" : "auto"}
            label="Max Marks"
          />
          <NumberInput
            value={props.negativeMark}
            onChange={(val) => {
              props.setNegativeMark(val ?? 0);
            }}
            min={0}
            w={isMd ? "80px" : "auto"}
            label="Neg Marks"
          />
        </Flex>
      )}
    </Flex>
  );
}
interface McqQuestionProps {
  index: number;
  question: MCQTypedQuestion;
  onDeleteClick: () => void;
  onEditClick: (val: MCQTypedQuestion) => void;
  canBeDeleted: boolean;
  testType: string | null;
  showBottomBar: boolean;
  hideMarks: boolean;
}

export function MCQquestionCard(props: McqQuestionProps) {
  const [isEditQuestion, setisEditQuestion] = useState<boolean>(false);
  const [questionText, setQuestionText] = useState<string>(props.question.text);
  const [solutionText, setSolutionText] = useState<string>(
    props.question.explaination
  );
  const [questionImage, setQuestionImage] = useState<string>(
    props.question.questionImageUrl
  );
  const [answers, setanswers] = useState<
    {
      isCorrect: boolean;
      text: string;
    }[]
  >(props.question.answers);
  const [answerImages, setanswerImages] = useState<string[]>(
    props.question.answerImageUrl
  );
  const [questionMark, setQuestionMark] = useState<number>(
    props.question.totalMarks
  );
  const [negativeMark, setNegativeMark] = useState<number>(
    props.question.totalNegativeMarks
  );
  const [difficulty, setDifficulty] = useState<DifficultyLevel>(
    DifficultyLevel.MEDIUM
  );
  useEffect(() => {
    setQuestionMark(props.question.totalMarks);
  }, [props.question.totalMarks]);

  useEffect(() => {
    setSolutionText(props.question.explaination);
  }, [props.question.explaination]);

  useEffect(() => {
    setQuestionImage(props.question.questionImageUrl);
  }, [props.question.questionImageUrl]);
  useEffect(() => {
    setanswerImages(props.question.answerImageUrl);
  }, [props.question.answerImageUrl]);

  useEffect(() => {
    setanswers(props.question.answers);
  }, [props.question.answers]);

  useEffect(() => {
    setQuestionText(props.question.text);
  }, [props.question.text]);

  const isMd = useMediaQuery(`(max-width: 820px)`);
  const isValidQuestion =
    questionText.length !== 0 &&
    answers.filter((x) => x.text.length === 0).length === 0 &&
    !props.hideMarks
      ? questionMark !== 0
      : true;

  return (
    <Card
      py={isMd ? 15 : 25}
      px={isMd ? 15 : 30}
      // shadow="0px 0px 8px 0px rgba(0, 0, 0, 0.25);"
      style={{ borderRadius: "10px", position: "relative" }}
      withBorder
    >
      <></>
      {isEditQuestion === false && (
        <Stack px={isMd ? 15 : 30}>
          {props.question.questionImageUrl && (
            <ShowImage url={props.question.questionImageUrl} />
          )}
          <Flex justify="space-between" align="flex-start">
            <Flex>
              <span
                style={{
                  fontSize: 16,
                  fontWeight: 600,
                  minWidth: 90,
                }}
              >{`Question ${props.index}. `}</span>
              <div
                dangerouslySetInnerHTML={{
                  __html: reduceImageScaleAndAlignLeft2(
                    props.question.text.replace("/n", " ")
                  ),
                }}
              ></div>
            </Flex>
            <DifficultyChip
              difficultyLevel={
                (props.question.difficultyLevel ??
                  DifficultyLevel.MEDIUM) as DifficultyLevel
              }
            />
          </Flex>
          <Divider size="sm" color="#000000" mx={-30} />
          {props.question.answers.map((x, i) => {
            return (
              <Flex align="center">
                {props.question.type !== QuestionType.MultiCorrectQues.type && (
                  <Radio checked={x.isCorrect} />
                )}
                {props.question.type === QuestionType.MultiCorrectQues.type && (
                  <Checkbox checked={x.isCorrect} />
                )}
                <Stack ml={20}>
                  {props.question.answerImageUrl &&
                    props.question.answerImageUrl[i] && (
                      <ShowImage url={props.question.answerImageUrl[i]} />
                    )}
                  <div
                    dangerouslySetInnerHTML={{
                      __html: reduceImageScaleAndAlignLeft2(x.text),
                    }}
                  ></div>
                </Stack>
              </Flex>
            );
          })}
          {props.question.explaination &&
            props.question.explaination !== "" && (
              <Flex>
                <span
                  style={{
                    fontSize: 16,
                    fontWeight: 600,
                  }}
                >{`Solution. `}</span>
                <div
                  dangerouslySetInnerHTML={{
                    __html: reduceImageScaleAndAlignLeft2(
                      props.question.explaination.replace("/n", " ")
                    ),
                  }}
                ></div>
              </Flex>
            )}
          <EditAndDeleteSection
            canBeDeleted={props.canBeDeleted}
            onEditClick={() => {
              setisEditQuestion(true);
              Mixpanel.track(WebAppEvents.CREATE_TEST_EDIT_CLICKED, {
                testType: props.testType,
              });
            }}
            onDeleteClick={() => {
              props.onDeleteClick();
              Mixpanel.track(WebAppEvents.CREATE_TEST_DELETE_CLICKED, {
                testType: props.testType,
              });
            }}
            questionMark={props.question.totalMarks}
            hideMarks={props.hideMarks}
            negativeMarks={props.question.totalNegativeMarks.toString()}
          />
        </Stack>
      )}
      {isEditQuestion === true && (
        <Stack>
          <SingleTextFeild
            text={questionText}
            setText={setQuestionText}
            placeHolderText="Type your question"
          />

          <Stack spacing={5}>
            {answers.map((x, i) => {
              return (
                <MCQOption
                  index={i}
                  text={x.text}
                  isCorrect={x.isCorrect}
                  answers={answers}
                  setanswers={(newAnswers) => {
                    answers[i] = newAnswers[i];
                    setanswers([...answers]);
                  }}
                  onimageAdd={(val) => {
                    setanswerImages((prev) => {
                      const prev1 = [...prev];
                      prev1[i] = val;
                      return prev1;
                    });
                  }}
                  onDeleteOption={() => {
                    setanswerImages((prev) => {
                      const prev1 = [...prev];
                      prev1.splice(i, 1);
                      return prev1;
                    });
                  }}
                  answerImg={answerImages[i]}
                  type={props.question.type}
                />
              );
            })}

            <Flex
              align="center"
              style={{
                border: "none",
                borderBottom: "2px solid #CCCCCC",
                borderRadius: 0,
              }}
              px={10}
              w="98%"
              py={15}
              onClick={() => {
                setanswers((prev) => {
                  const prev1 = {
                    text: "",
                    isCorrect: false,
                  };

                  // ...
                  prev.push(prev1);
                  return prev;
                });
                setanswerImages((prev) => {
                  return [...prev, ""];
                });
              }}
            >
              <Radio
                styles={{
                  radio: {
                    border: "#808080 solid 1px",
                    opacity: 0.4,
                  },
                }}
                checked={false}
              />
              <Text fz={14} fw={400} color="#CCCCCC" ml={10}>
                Add Option
              </Text>
            </Flex>
          </Stack>
          <Text>Solution:</Text>
          <SingleTextFeild
            text={solutionText}
            setText={setSolutionText}
            placeHolderText="Type your question"
          />
          <EditFooter
            onClick={async () => {
              if (isValidQuestion) {
                const text1 = await uploadPhotos(questionText);
                const answers1 = answers;
                for (let i = 0; i < answers.length; i++) {
                  const ans = await uploadPhotos(answers[i].text);
                  answers1[i].text = ans;
                }
                // const questionId = ;
                props.onEditClick({
                  text: text1,
                  answers: answers1,
                  answerImageUrl: answerImages,
                  _id: props.question._id,
                  questionImageUrl: questionImage,
                  type: props.question.type,
                  totalMarks: questionMark,
                  difficultyLevel: difficulty,
                  totalNegativeMarks: negativeMark,
                  explaination: solutionText,
                  fromQuestionBank: props.question.fromQuestionBank,
                });
                setisEditQuestion(false);
              }
            }}
            isValidQuestion={isValidQuestion}
            questionMark={questionMark}
            setquestionMark={setQuestionMark}
            difficulty={difficulty}
            setDifficulty={setDifficulty}
            hideMarks={props.hideMarks}
            negativeMark={negativeMark}
            setNegativeMark={setNegativeMark}
          />
        </Stack>
      )}
    </Card>
  );
}
