import {
  Button,
  Card,
  Center,
  Flex,
  Modal,
  MultiSelect,
  NumberInput,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { IconPlus } from "@tabler/icons";
import { useEffect, useState } from "react";
import {
  QuestionParentType,
  QuestionType,
  allQuestionTypesValues,
  findQuestionType,
} from "../../@types/QuestionTypes.d";
import { IconPlusQuestions } from "../../components/_Icons/CustonIcons";
import { WebAppEvents } from "../../utilities/Mixpanel/AnalyticeEventWebApp";
import { Mixpanel } from "../../utilities/Mixpanel/MixpanelHelper";
import { Template } from "./PersonalizedTest";
import {
  AddNewQuestion,
  CaseBasedQuestionCard,
  MCQquestionCard,
  SubjectivequestionCard,
} from "./PersonalizedTestQuestions";
import { QuestionBankModal } from "./QuestionBankModal";

enum SectionTypes {
  MCQ = "Multiple Choice",
  LONG = "Long Answer Type Question",
  SHORT = "Short Answer Type Question",
  CASE = "Case Based Questions",
}

interface SingleSectionProps {
  index: number;
  type: QuestionType;
  sectionName: string;
  questions: (SUBjectivetypedQuestion | CASEtypedQuestion | MCQTypedQuestion)[];
  onAddQuestions: (
    val: SUBjectivetypedQuestion[] | CASEtypedQuestion[] | MCQTypedQuestion[]
  ) => void;
  onDeleteQuestion: (
    val: SUBjectivetypedQuestion | CASEtypedQuestion | MCQTypedQuestion
  ) => void;
  onEditQuestion: (
    val: SUBjectivetypedQuestion | CASEtypedQuestion | MCQTypedQuestion
  ) => void;
  ondeleteSection: () => void;
  onSectionMarksChange: (val: number) => void;
  sectionNumbers: number;
  negativeMark: number;
  isWord: boolean;
  selectedTemplate: Template;
  totalQuestions: number;
  setisaddNewQuestions: (val: boolean) => void;
  isAddNewQuestion: boolean;
  showOptions: boolean;
  setshowOptions: (val: boolean) => void;
}

function SingleSection(props: SingleSectionProps) {
  const [isAddFromQuestionBank, setisAddFromQuestionBank] = useState(false);
  const isMd = useMediaQuery(`(max-width: 820px)`);
  function addQuestions(val: any) {
    props.onAddQuestions(val);
  }

  return (
    <>
      <Card
        py={25}
        px={30}
        shadow="0px 0px 8px 0px rgba(0, 0, 0, 0.25);"
        style={{ borderRadius: "10px" }}
        withBorder
      >
        <Stack>
          <Flex justify="space-between" align="center">
            <Text fz={isMd ? 16 : 20} fw={700}>
              Section {props.index}. {props.sectionName}
            </Text>
            {!props.isWord && (
              <Text fz={isMd ? 16 : 20}>
                {isMd ? "QMark" : "Marks Per Question"}:{props.sectionNumbers}
              </Text>
            )}
          </Flex>

          <Stack>
            {props.questions.map((x, i) => {
              switch (findQuestionType(x.type).parentType) {
                case QuestionParentType.MCQQ:
                  return (
                    <MCQquestionCard
                      canBeDeleted={true}
                      index={i + 1}
                      onDeleteClick={() => {
                        if (props.questions.length === 1)
                          props.ondeleteSection();
                        else props.onDeleteQuestion(x);
                      }}
                      onEditClick={(val) => {
                        props.onEditQuestion(val);
                      }}
                      question={x as MCQTypedQuestion}
                      testType={"New"}
                      showBottomBar={!x.fromQuestionBank}
                      hideMarks={false}
                    />
                  );
                case QuestionParentType.SUBQ:
                  return (
                    <SubjectivequestionCard
                      canBeDeleted={true}
                      index={i + 1}
                      onDeleteClick={() => {
                        if (props.questions.length === 1)
                          props.ondeleteSection();
                        else props.onDeleteQuestion(x);
                      }}
                      onEditClick={(val) => {
                        props.onEditQuestion(val);
                      }}
                      testType={"New"}
                      questionType={QuestionType.LongQues.type}
                      question={x as SUBjectivetypedQuestion}
                      showBottomBar={!x.fromQuestionBank}
                      hideMarks={false}
                    />
                  );
                case QuestionParentType.CASEQ:
                  return (
                    <CaseBasedQuestionCard
                      canBeDeleted={true}
                      index={i + 1}
                      onDeleteClick={() => {
                        if (props.questions.length === 1)
                          props.ondeleteSection();
                        else props.onDeleteQuestion(x);
                      }}
                      onEditClick={(val) => {
                        props.onEditQuestion(val);
                      }}
                      testType={"New"}
                      question={x as CASEtypedQuestion}
                      showBottomBar={!x.fromQuestionBank}
                      hideMarks={false}
                    />
                  );
              }
            })}
            {!props.isAddNewQuestion && !props.showOptions && (
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
                  props.setshowOptions(true);
                  props.setisaddNewQuestions(true);
                }}
                withBorder
              >
                <IconPlusQuestions />
              </Card>
            )}
            {props.isAddNewQuestion && props.showOptions && (
              <Card
                py={10}
                shadow="0px 0px 8px 0px rgba(0, 0, 0, 0.25);"
                style={{ borderRadius: "10px" }}
                withBorder
              >
                <Center h={"100%"}>
                  <Stack>
                    <Button
                      onClick={() => {
                        props.setshowOptions(false);
                        props.setisaddNewQuestions(true);
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
                        Mixpanel.track(
                          WebAppEvents.CREATE_TEST_ADD_FROM_QUESTION_BANK_CLICKED
                        );
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
          </Stack>

          {props.isAddNewQuestion && !props.showOptions && (
            <>
              <AddNewQuestion
                onSubjectiveSubmit={(val) => {
                  props.setisaddNewQuestions(false);
                  props.onAddQuestions([val]);
                }}
                onMcqSubmit={(val) => {
                  props.setisaddNewQuestions(false);
                  props.onAddQuestions([val]);
                }}
                onCaseBasedQuestionSubmit={(val) => {
                  props.setisaddNewQuestions(false);
                  props.onAddQuestions([val]);
                }}
                onDeleteClicked={() => {
                  if (props.questions.length > 0) {
                    props.setisaddNewQuestions(false);
                  } else {
                    props.ondeleteSection();
                  }
                }}
                sectionMarks={props.sectionNumbers}
                questionType={props.type}
                hideMarks={false}
                negativeMark={props.negativeMark ?? 0}
                totalQuestions={props.totalQuestions}
              />
            </>
          )}
          {isAddFromQuestionBank && (
            <QuestionBankModal
              type={props.type.type}
              isOpened={isAddFromQuestionBank}
              setOpened={setisAddFromQuestionBank}
              onSubmitClick={(val) => {
                addQuestions(
                  val.map((x: any) => {
                    return {
                      ...x,
                      totalMarks: props.sectionNumbers,
                    };
                  })
                );
                props.setshowOptions(false);
                setisAddFromQuestionBank(false);
                props.setisaddNewQuestions(false);
              }}
            />
          )}
        </Stack>
      </Card>
    </>
  );
}

interface NewTypeQuestionProps {
  sections: TestSection[];
  setsections: (state: React.SetStateAction<TestSection[]>) => void;
  isWord: boolean;
  selectedTemplate: Template;
  superSections: SuperSection[];
  setSuperSections: (state: React.SetStateAction<SuperSection[]>) => void;
  setisNexClickAble: (val: boolean) => void;
}
export function NewTypeQuestion(props: NewTypeQuestionProps) {
  useEffect(() => {
    setTimeout(() => {
      if (typeof window?.MathJax !== "undefined") {
        window.MathJax.typesetClear();
        window.MathJax.typeset();
      }
    }, 500);
  }, [props.sections]);
  const isMd = useMediaQuery(`(max-width: 820px)`);
  const [isAddNewSection, setIsAddNewSection] = useState<boolean>(false);
  const [sectionType, setSectionType] = useState<string[]>([
    QuestionType.McqQues.type,
  ]);
  const [superSectionName, setSuperSectionName] = useState<string>("");
  const [superSectionTime, setSuperSectionTime] = useState<string>("");
  const [totalQuestions, setTotalQuestions] = useState<number>(0);
  useEffect(() => {
    setTotalQuestions(
      props.sections.map((x) => x.questions.length).reduce((a, b) => a + b, 0)
    );
  }, [props.sections]);
  const [sectionMarks, setSectionMarks] = useState<number>(4);
  const [sectionNegativeMarks, setSectionNegativeMarks] = useState<number>(0);
  return (
    <>
      <Stack
        style={{
          position: "relative",
        }}
      >
        {props.superSections.length === 0 && (
          <Stack w="100%" h="50vh">
            <Center w="100%" h="100%">
              <Stack spacing={20} align="center">
                <img
                  src={require("../../assets/emptyTest2.png")}
                  width="50%"
                  style={{
                    margin: "0 auto",
                  }}
                />
                <Flex justify="center">
                  <Button
                    leftIcon={<IconPlus />}
                    color="black"
                    bg="white"
                    style={{
                      boxShadow: "0px 0px 4px 0px rgba(0, 0, 0, 0.25)",
                      borderRadius: "10px",
                      background: "#FFF",
                      color: "black",
                    }}
                    size="md"
                    onClick={() => {
                      setIsAddNewSection(true);
                    }}
                  >
                    Add Section
                  </Button>
                </Flex>
              </Stack>
            </Center>
          </Stack>
        )}
        {props.superSections.length > 0 &&
          props.superSections[0].sections.length > 0 &&
          props.superSections.map((superSection) => {
            return (
              <Stack>
                <Flex justify="space-between">
                  <Text fz={23} fw={700}>
                    {superSection.name}
                  </Text>
                  {superSection.totalTime !== "" &&
                    superSection.totalTime !== "0" && (
                      <Text fz={23} fw={700}>
                        {parseInt(superSection.totalTime)/60} min
                      </Text>
                    )}
                </Flex>
                {/* )} */}
                <Stack
                  style={{
                    position: "relative",
                  }}
                >
                  {superSection.sections.map((x, i) => {
                    const section = props.sections.find((y) => y._id === x);
                    if (section)
                      return (
                        <SingleSection
                          questions={section.questions}
                          sectionName={section.sectionName}
                          sectionNumbers={section.sectionMarks}
                          negativeMark={section.totalNegativeMarks}
                          type={findQuestionType(section.type) as QuestionType}
                          ondeleteSection={() => {
                            props.setsections((prev) => {
                              const prev1 = [...prev];
                              const foundIndex = prev1.findIndex((sec) => {
                                return sec._id === section._id;
                              });
                              prev1.splice(foundIndex, 1);
                              return prev1;
                            });
                            props.setSuperSections((prev) => {
                              const prev1 = [...prev];
                              const foundIndex = prev1.findIndex((sec) => {
                                return sec.sections.includes(section._id);
                              });
                              prev1[foundIndex].sections = prev1[
                                foundIndex
                              ].sections.filter((x) => x !== section._id);
                              if (prev1[foundIndex].sections.length === 0) {
                                prev1.splice(foundIndex, 1);
                                return prev1;
                              } else return prev1;
                            });
                          }}
                          onAddQuestions={(val) => {
                            props.setsections((prev) => {
                              const prev1 = [...prev];
                              const foundIndex = prev1.findIndex(
                                (x) => x._id === section._id
                              );
                              prev1[foundIndex].questions.push(...val);
                              return prev1;
                            });
                          }}
                          index={i + 1}
                          onDeleteQuestion={(val) => {
                            props.setsections((prev) => {
                              const prev1 = [...prev];
                              const foundIndex = prev1.findIndex(
                                (x) => x._id === section._id
                              );
                              const prev2 = prev1[foundIndex].questions.filter(
                                (x) => x._id !== val._id
                              );
                              prev1[foundIndex].questions = prev2;
                              return prev1;
                            });
                          }}
                          onEditQuestion={(val) => {
                            props.setsections((prev) => {
                              const prev1 = [...prev];
                              const foundIndex = prev1.findIndex(
                                (x) => x._id === section._id
                              );
                              const prev2 = prev1[foundIndex].questions.map(
                                (x) => {
                                  if (x._id === val._id) return val;
                                  return x;
                                }
                              );
                              prev1[foundIndex].questions = prev2;
                              return prev1;
                            });
                          }}
                          onSectionMarksChange={(val) => {
                            props.setsections((prev) => {
                              const prev1 = [...prev];
                              const foundIndex = prev1.findIndex(
                                (x) => x._id === section._id
                              );
                              const changeValue = parseInt(
                                (
                                  val / prev1[foundIndex].questions.length
                                ).toFixed(2)
                              );
                              const quesitons = prev1[foundIndex].questions.map(
                                (x) => {
                                  return {
                                    ...x,
                                    totalMarks: changeValue,
                                  };
                                }
                              );
                              prev1[foundIndex].questions = quesitons;
                              return prev1;
                            });
                          }}
                          isWord={props.isWord}
                          selectedTemplate={props.selectedTemplate}
                          totalQuestions={totalQuestions}
                          setisaddNewQuestions={(val) => {
                            props.setsections((prev) => {
                              const prev1 = [...prev];
                              const foundIndex = prev1.findIndex(
                                (x) => x._id === section._id
                              );
                              prev1[foundIndex].isAddNewQuestion = val;
                              return prev1;
                            });
                          }}
                          isAddNewQuestion={section.isAddNewQuestion}
                          showOptions={section.showOptions}
                          setshowOptions={(val) => {
                            props.setsections((prev) => {
                              const prev1 = [...prev];
                              const foundIndex = prev1.findIndex(
                                (x) => x._id === section._id
                              );
                              prev1[foundIndex].showOptions = val;
                              return prev1;
                            });
                          }}
                        />
                      );
                  })}
                </Stack>
              </Stack>
            );
          })}
        {props.superSections.length !== 0 && (
          <>
            <Card
              style={{
                //   border: "red solid 1px",
                position: "absolute",
                height: "60px",
                bottom: -10,
                width: "100%",
                border: "2px dashed black",
                borderRadius: "10px",
              }}
              withBorder
            >
              <></>
            </Card>
            <Button
              variant="white"
              size="md"
              mx={20}
              mt={20}
              onClick={() => {
                setIsAddNewSection(true);
              }}
              color="black"
            >
              <Text color="black" mr={20} fz={isMd ? 16 : 20}>
                Add New Section
              </Text>
              <IconPlusQuestions />
            </Button>
          </>
        )}
      </Stack>
      <Modal
        opened={isAddNewSection}
        onClose={() => {
          setIsAddNewSection(false);
        }}
        centered
      >
        <Stack>
          <Flex align="center" justify="space-between">
            <Text>Section Name:</Text>
            <TextInput
              placeholder="Section Name"
              onChange={(e) => {
                if (e) {
                  setSuperSectionName(e.currentTarget.value);
                }
              }}
              value={superSectionName}
            />
          </Flex>
          {/* <Flex align="center" justify="space-between">
            <Text>Section Time:</Text>
            <NumberInput
              value={
                superSectionTime !== "" ? parseInt(superSectionTime) : undefined
              }
              onChange={(val) => {
                if (val) setSuperSectionTime(val.toString());
              }}
            />
          </Flex> */}
          <Flex align="center" justify="space-between">
            <Text>Question Type:</Text>
            <MultiSelect
              data={allQuestionTypesValues}
              value={sectionType}
              onChange={(val) => {
                if (val) {
                  setSectionType(val);
                }
              }}
              style={{
                maxWidth: "50%",
              }}
            />
          </Flex>
          <Flex align="center" justify="space-between">
            <Text>Each Question Marks:</Text>
            <NumberInput
              value={sectionMarks}
              onChange={(val) => {
                if (val) setSectionMarks(val);
              }}
            />
          </Flex>
          <Flex align="center" justify="space-between">
            <Text>Negative Marks:</Text>
            <NumberInput
              value={sectionNegativeMarks}
              onChange={(val) => {
                if (val !== undefined) setSectionNegativeMarks(val);
              }}
              min={0}
            />
          </Flex>
          <Flex justify="right">
            <Button
              onClick={() => {
                const sectionIds: string[] = [];
                sectionType.map((x) => {
                  const found = findQuestionType(x);

                  if (found) {
                    props.setsections((prev) => {
                      sectionIds.push(`SEC-${prev.length + 1}`);
                      return [
                        ...prev,
                        {
                          questions: [],
                          sectionName: found.name,
                          type: found.type,
                          sectionMarks: sectionMarks,
                          _id: `SEC-${prev.length + 1}`,
                          isAddNewQuestion: true,
                          showOptions: true,
                          totalNegativeMarks: sectionNegativeMarks,
                        },
                      ];
                    });
                  }
                });
                if (superSectionTime !== "") {
                  props.setisNexClickAble(true);
                }
                props.setSuperSections((prev) => {
                  return [
                    ...prev,
                    {
                      name: superSectionName,
                      sections: sectionIds,
                      totalTime: "0",
                    },
                  ];
                });
                setIsAddNewSection(false);
              }}
              bg="#3174F3"
            >
              Submit
            </Button>
          </Flex>
        </Stack>
      </Modal>
    </>
  );
}
