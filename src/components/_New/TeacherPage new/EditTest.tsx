import { useEffect, useState } from "react";
import { NewTypeQuestion } from "../../../pages/_New/NewTypeQuestion";
import {
  QuestionParentType,
  QuestionType,
  findQuestionType,
} from "../../../@types/QuestionTypes.d";
import { Template } from "../../../pages/_New/PersonalizedTest";
import { Box, Button, Flex, Stack, Text } from "@mantine/core";
import {
  editTestQuestions,
  fetchFullTest,
} from "../../../features/test/TestSlice";
import { IconLeftArrow } from "../../_Icons/CustonIcons";
import {
  IconArrowNarrowLeft,
  IconArrowNarrowRight,
  IconChevronLeft,
} from "@tabler/icons";
import { useMediaQuery } from "@mantine/hooks";
import { showNotification } from "@mantine/notifications";
import { shuffleArray } from "../../../utilities/HelperFunctions";

const arr1 = [
  {
    type: QuestionType.McqQues.type,
    questiontype: QuestionType.McqQues,
  },
  {
    type: QuestionType.CaseQues.type,
    questiontype: QuestionType.CaseQues,
  },
  {
    type: QuestionType.ShortQues.type,
    questiontype: QuestionType.ShortQues,
  },
  {
    type: QuestionType.LongQues.type,
    questiontype: QuestionType.LongQues,
  },
];

export function EditTest(props: {
  testId: string;
  onBackClick: () => void;
  setIsLoading: (x: boolean) => void;
  onTestEdit: (finaltest2: any, testId: string) => void;
  titleTxt: string;
  isEditTest: boolean;
}) {
  const [sections, setSections] = useState<TestSection[]>([]);
  const [subjectiveQuestion, setSubjectiveQuestion] = useState<
    SUBjectivetypedQuestion[]
  >([]);
  const [caseBasedQuestion, setCaseBasedQuestion] = useState<
    CASEtypedQuestion[]
  >([]);
  const [objectiveQuestion, setObjectiveQuestion] = useState<
    MCQTypedQuestion[]
  >([]);
  const [superSections, setSuperSections] = useState<SuperSection[]>([]);

  const [questionsMap, setQuestionsMap] = useState(new Map());
  const [testDetails, setTestDetails] = useState<FullTest | null>(null);
  const [
    isNextSuperSectionClickablebeforeTime,
    setIsNextSuperSectionClickablebeforeTime,
  ] = useState<boolean>(true);
  useEffect(() => {
    setObjectiveQuestion([]);
    setSubjectiveQuestion([]);
    setCaseBasedQuestion([]);
    for (let i = 0; i < sections.length; i++) {
      sections[i].questions.map((x) => {
        switch (findQuestionType(x.type).parentType) {
          case QuestionParentType.MCQQ:
            setObjectiveQuestion((prev) => {
              const prev2 = [...prev];
              prev2.push(x as MCQTypedQuestion);
              return prev2;
            });
            break;
          case QuestionParentType.SUBQ:
            setSubjectiveQuestion((prev) => {
              const prev2 = [...prev];
              prev2.push(x as SUBjectivetypedQuestion);
              return prev2;
            });
            break;
          case QuestionParentType.CASEQ:
            setCaseBasedQuestion((prev) => {
              const prev2 = [...prev];
              prev2.push(x as CASEtypedQuestion);
              return prev2;
            });
            break;
          default:
            break;
        }
      });
    }
  }, [sections]);

  useEffect(() => {
    props.setIsLoading(true);
    fetchFullTest(props.testId)
      .then((data: any) => {
        props.setIsLoading(false);
        const updatedMap = new Map(questionsMap);

        data.questions.forEach((x: any) => {
          updatedMap.set(x._id, x);
        });

        data.casebasedquestions.forEach((x: any) => {
          updatedMap.set(x._id, x);
        });

        data.subjectiveQuestions.forEach((x: any) => {
          updatedMap.set(x._id, x);
        });

        setQuestionsMap(updatedMap);
        if (data.length !== 0) {
          setTestDetails(data);
        }
      })
      .catch((error) => {
        props.setIsLoading(false);
        console.log(error);
      });
  }, [props.testId]);
  const isMd = useMediaQuery(`(max-width: 820px)`);
  useEffect(() => {
    const sections1: TestSection[] = [];
    console.log(testDetails);
    testDetails?.sections.map((x) => {
      const questions1 = x.questions.map((y) => {
        return questionsMap.get(y);
      });

      sections1.push({
        sectionName: x.name,
        questions: !props.isEditTest ? shuffleArray(questions1) : questions1,
        type: questionsMap.get(x.questions[0]).type,
        sectionMarks: x.marksperquestion,
        _id: x._id,
        totalNegativeMarks: x.negativeMarks,
        isAddNewQuestion: false,
        showOptions: false,
      });
    });
    setSections(sections1);
    setSuperSections(testDetails?.superSections || []);
    if (testDetails)
      setIsNextSuperSectionClickablebeforeTime(
        testDetails?.isNextSuperSectionClickablebeforeTime
      );
  }, [testDetails]);

  function editTest() {
    const sections1 = sections.map((x) => {
      return {
        name: x.sectionName,
        questions: x.questions.map((x) => x._id),
        marksperquestion: x.sectionMarks,
        _id: x._id,
        totalNegativeMarks: x.totalNegativeMarks,
      };
    });
    let totalMarks = 0;
    subjectiveQuestion.map((x) => {
      totalMarks += x.totalMarks;
    });
    objectiveQuestion.map((x) => {
      totalMarks += x.totalMarks;
    });
    caseBasedQuestion.map((x) => {
      x.questions.map((q)=>{
        totalMarks += q.totalMarks;
      })
    });
    const finaltest2 = {
      ...testDetails,
      maxMarks: totalMarks,
      maxQuestions:
        subjectiveQuestion.length +
        objectiveQuestion.length +
        caseBasedQuestion.length,
      subjectiveQuestions: subjectiveQuestion,
      questions: objectiveQuestion,
      caseBasedQuestions: caseBasedQuestion,
      sections: sections1,
      superSections: superSections,
      isNextSuperSectionClickablebeforeTime:
        isNextSuperSectionClickablebeforeTime,
    };
    console.log(finaltest2);
    props.onTestEdit(finaltest2, props.testId);
  }

  return (
    <>
      {testDetails !== null && (
        <Stack w="100%" justify="center" align="center">
          <Stack w="90%" pb={50} pt={20}>
            <Flex align="center">
              <IconChevronLeft
                onClick={props.onBackClick}
                size="30px"
                style={{
                  cursor: "pointer",
                  color: "black",
                  marginRight: "10px",
                }}
              />
              <Text fz={20} fw={700}>
                {props.titleTxt}
              </Text>
            </Flex>
            {sections.length > 0 && (
              <NewTypeQuestion
                sections={sections}
                setsections={setSections}
                isWord={false}
                selectedTemplate={Template.UserTyped}
                superSections={superSections}
                setSuperSections={setSuperSections}
                setisNexClickAble={() => {
                  setIsNextSuperSectionClickablebeforeTime(false);
                }}
              />
            )}
          </Stack>
          <Flex
            style={{
              position: isMd ? "fixed" : "sticky",
              bottom: isMd ? 60 : 0,
              width: "100%",
              height: "80px",
              background: "#F7F7FF",
              //   testStep === TestStep.EditQuestions ? "white" : "#F7F7FF",
              borderTop: "1px solid #DEDEE5",
              zIndex: 99,
            }}
            align="center"
            justify="center"
            py={10}
          >
            <Button
              leftIcon={<IconArrowNarrowLeft color="black" size={30} />}
              size="lg"
              variant="outline"
              style={{
                border: "1px solid #808080",
                color: "#000000",
              }}
              mr={20}
              px={isMd ? 20 : 30}
              fz={18}
              onClick={() => {
                props.onBackClick();
              }}
            >
              Back
            </Button>

            <Button
              size="lg"
              bg="#4B65F6"
              fz={18}
              rightIcon={<IconArrowNarrowRight color="white" size={30} />}
              style={{
                color: "white",
              }}
              px={isMd ? 20 : 30}
              sx={{
                "&:hover": {
                  backgroundColor: "#3C51C5",
                },
              }}
              onClick={() => {
                if (
                  !sections.find((x) => {
                    return x.isAddNewQuestion === true;
                  })
                )
                  editTest();
                else {
                  showNotification({
                    message:
                      "You need to submit all the sections before proceeding",
                  });
                }
              }}
            >
              Save & Create Test
            </Button>
          </Flex>
        </Stack>
      )}
    </>
  );
}
