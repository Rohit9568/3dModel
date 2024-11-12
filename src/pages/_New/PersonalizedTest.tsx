import {
  Box,
  Button,
  Center,
  Divider,
  FileInput,
  Flex,
  Group,
  LoadingOverlay,
  Modal,
  ScrollArea,
  Stack,
  Text,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import {
  IconArrowNarrowLeft,
  IconArrowNarrowRight,
  IconChevronRight,
} from "@tabler/icons";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import {
  DifficultyLevel,
  QuestionParentType,
  QuestionType,
  findQuestionType,
} from "../../@types/QuestionTypes.d";
import {
  IconGenerateAI,
  IconT,
  IconUpload,
  IconWord,
} from "../../components/_Icons/CustonIcons";
import {
  PaperDifficulity,
  TestDeatils,
  TestScreen,
} from "../../components/_New/ContentTest";
import { fetchClassAndSubjectList } from "../../features/UserSubject/TeacherSubjectSlice";
import {
  createTestwithPdf,
  createTestwithQuestions,
} from "../../features/test/TestSlice";
import { useFileInput } from "../../hooks/useFileInput";
import { AppDispatch, RootState } from "../../store/ReduxStore";
import { subjects } from "../../store/subjectsSlice";
import { WebAppEvents } from "../../utilities/Mixpanel/AnalyticeEventWebApp";
import { Mixpanel } from "../../utilities/Mixpanel/MixpanelHelper";
import { NewTypeQuestion } from "./NewTypeQuestion";
import { PdfTypeQuestionTest } from "./PdfTypeQuestionTest";
import AIModal from "./TestModals/AIModal";
import { WordUploadModal } from "./TestModals/WordUpload";
import { generateSectionsByTemplateId } from "../../features/template/templateSlice";
import { showNotification } from "@mantine/notifications";
import { customTemplate } from "./CreateTestModal";
import { UploadHtml } from "../../features/fileUpload/FileUpload";

export enum TestStep {
  SelectTemplate = "selecteTemplate",
  EditQuestions = "edit",
  PdfEditQuestions = "pdfEdit",
}

interface PersonalizedTestProps {
  testName: string;
  setTestScreen: (val: TestScreen) => void;
  startTime: Date | null;
  onTestCreation: () => void;
  testStep: TestStep;
  setTestStep: (val: React.SetStateAction<TestStep>) => void;
  isEnableMultipleTestAttempts: boolean;
}

export const QuestionTypes: QuestionType[] = [
  QuestionType.AllQues,
  QuestionType.McqQues,
  QuestionType.LongQues,
  QuestionType.ShortQues,
  QuestionType.CaseQues,
];

export enum Template {
  GenerateUsingAI = "GenerateUsingAI",
  GenerateUsingWord = "GenerateUsingWord",
  UserTyped = "UserTyped",
  GenerateUsingTemplate = "fromTemplate",
}
export function PersonalizedTest(props: PersonalizedTestProps) {
  const [isloading, setLoading] = useState<boolean>(false);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const duration = queryParams.get("duration");
  const templateId = queryParams.get("templateId");
  const dispatch = useDispatch<AppDispatch>();
  const [testDetails, setTestDetails] = useState<TestDeatils>({
    subject_id: "",
    chapter_ids: [],
    name: "",
    testDate: null,
    startTime: null,
    endTime: null,
    maxQuestions: 0,
    maxMarks: 0,
    difficulity: PaperDifficulity.Medium,
    questions: [],
    subjectiveQuestions: [],
    questionType: QuestionType.McqQues.type,
    isSamplePaper: false,
    caseBasedQuestions: [],
  });
  const [subjectiveQuestion, setSubjectiveQuestion] = useState<
    SUBjectivetypedQuestion[]
  >([]);
  const [caseBasedQuestion, setCaseBasedQuestion] = useState<
    CASEtypedQuestion[]
  >([]);
  const [objectiveQuestion, setObjectiveQuestion] = useState<
    MCQTypedQuestion[]
  >([]);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(
    null
  );
  const [wordFile, setWordFile] = useState<File | null>(null);
  const [superSections, setSuperSections] = useState<
    {
      name: string;
      sections: string[];
      totalTime: string;
    }[]
  >([]);

  const [
    isNextSuperSectionClickablebeforeTime,
    setIsNextSuperSectionClickablebeforeTime,
  ] = useState<boolean>(true);
  const { file, fileInputRef, isLoading, url, setFile, setFileType, error } =
    useFileInput((progress: number) => {});
  useEffect(() => {
    setFileType("pdf");
  }, []);

  useEffect(() => {
    if (error === true) {
      props.setTestStep(TestStep.SelectTemplate);
    }
  }, [error]);

  useEffect(() => {
    if (templateId !== customTemplate && templateId !== null) {
      setLoading(true);
      generateSectionsByTemplateId(templateId)
        .then((x: any) => {
          setLoading(false);
          setSelectedTemplate(Template.GenerateUsingTemplate);
          setSections(
            x.sections.map((section: any) => {
              return {
                ...section,
                showOptions: section.questions.length !== 0 ? false : true,
                isAddNewQuestion: section.questions.length !== 0 ? false : true,
              };
            })
          );
          setSuperSections(x.superSections);
          setIsNextSuperSectionClickablebeforeTime(
            x.isNextSuperSectionClickablebeforeTime
          );
        })
        .catch((e) => {
          console.log(e);
          setLoading(false);
        });
    }
  }, [templateId]);

  function createTest() {
    const today = new Date(Date.now());
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
      x.questions.map((y) => {
        console.log(y);
        totalMarks += y.totalMarks;
      });
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
      caseBasedQuestionIds1: [],
      objectiveQuestionIds1: [],
      subjectiveQuestionsIds1: [],
      date: today.getTime(),
      name: props.testName,
      sections: sections1,
      testScheduleTime: props.startTime,
      duration: duration ? parseInt(duration) * 60 : null,
      isNextSuperSectionClickablebeforeTime:
        isNextSuperSectionClickablebeforeTime,
      superSections: superSections,
      isEnableMultipleTestAttempts: props.isEnableMultipleTestAttempts,
    };
    setLoading(true);
    console.log(finaltest2);
    createTestwithQuestions({
      formObj: finaltest2,
    })
      .then((x) => {
        setLoading(false);
        console.log(x);
        props.onTestCreation();
        props.setTestScreen(TestScreen.Default);
      })
      .catch((e) => {
        setLoading(false);
        console.log(e);
      });
  }
  function createPdfTest() {
    const today = new Date(Date.now());
    let totalMarks = 0;
    const sections2: TestSection[] = [];
    const objectivePdfQuestions: any = [];
    const subjectivePdfQuestions: any = [];
    const casePdfQuestions: any = [];
    for (let i = 0; i < pdfSections.length; i++) {
      totalMarks += pdfSections[i].questionNo * pdfSections[i].totalMarks;
      const allSectionQuestions = [];
      switch (pdfSections[i].type.type) {
        case QuestionType.McqQues.type:
          for (let j = 0; j < pdfSections[i].questionNo; j++) {
            const question: MCQTypedQuestion = {
              text: "",
              answers: [],
              _id: `MCQW-${i + j}`,
              answerImageUrl: [],
              questionImageUrl: "",
              totalMarks: pdfSections[i].totalMarks,
              type: QuestionType.McqQues.type,
              difficultyLevel: DifficultyLevel.MEDIUM,
              totalNegativeMarks: pdfSections[i].negativeMarks,
              explaination: "",
              fromQuestionBank: false,
            };
            allSectionQuestions.push(question);
            objectivePdfQuestions.push(question);
          }
          sections2.push({
            sectionName: pdfSections[i].sectionName,
            questions: allSectionQuestions,
            type: QuestionType.McqQues.type,
            sectionMarks: pdfSections[i].totalMarks,
            totalNegativeMarks: pdfSections[i].negativeMarks,
            _id: `SEC-${pdfSections.length + 1}`,
            isAddNewQuestion: false,
            showOptions: true,
          });
          break;
        case QuestionType.ShortQues.type:
          for (let j = 0; j < pdfSections[i].questionNo; j++) {
            const question: SUBjectivetypedQuestion = {
              text: "",
              answer: "",
              _id: `SSUBW-${i + j}`,
              questionType: QuestionType.ShortQues.type,
              answerImageUrl: "",
              questionImageUrl: "",
              totalMarks: pdfSections[i].totalMarks,
              type: QuestionType.ShortQues.type,
              difficultyLevel: DifficultyLevel.MEDIUM,
              totalNegativeMarks: pdfSections[i].negativeMarks,
              explaination: "",
              fromQuestionBank: false,
            };
            allSectionQuestions.push(question);
            subjectivePdfQuestions.push(question);
          }
          sections2.push({
            sectionName: pdfSections[i].sectionName,
            questions: allSectionQuestions,
            type: QuestionType.ShortQues.type,
            sectionMarks: pdfSections[i].totalMarks,
            totalNegativeMarks: pdfSections[i].negativeMarks,
            _id: `SEC-${pdfSections.length + 1}`,
            isAddNewQuestion: false,
            showOptions: true,
          });
          break;
        case QuestionType.LongQues.type:
          for (let j = 0; j < pdfSections[i].questionNo; j++) {
            const question: SUBjectivetypedQuestion = {
              text: "",
              answer: "",
              _id: `LSUBW-${i + j}`,
              questionType: QuestionType.LongQues.type,
              answerImageUrl: "",
              questionImageUrl: "",
              totalMarks: pdfSections[i].totalMarks,
              type: QuestionType.LongQues.type,
              difficultyLevel: DifficultyLevel.MEDIUM,
              totalNegativeMarks: pdfSections[i].negativeMarks,
              explaination: "",
              fromQuestionBank: false,
            };
            allSectionQuestions.push(question);
            subjectivePdfQuestions.push(question);
          }
          sections2.push({
            sectionName: pdfSections[i].sectionName,
            questions: allSectionQuestions,
            type: QuestionType.LongQues.type,
            sectionMarks: pdfSections[i].totalMarks,
            totalNegativeMarks: pdfSections[i].negativeMarks,
            _id: `SEC-${pdfSections.length + 1}`,
            isAddNewQuestion: false,
            showOptions: true,
          });
          break;
        case QuestionType.CaseQues.type:
          for (let j = 0; j < pdfSections[i].questionNo; j++) {
            const question: CASEtypedQuestion = {
              caseStudyText: "",
              questions: [],
              _id: `CASEW-${i + j}`,
              questionImageUrl: "",
              totalMarks: pdfSections[i].totalMarks,
              type: QuestionType.CaseQues.type,
              difficultyLevel: DifficultyLevel.MEDIUM,
              totalNegativeMarks: pdfSections[i].negativeMarks,
              explaination: "",
              fromQuestionBank: false,
            };
            allSectionQuestions.push(question);
            casePdfQuestions.push(question);
          }
          sections2.push({
            sectionName: pdfSections[i].sectionName,
            questions: allSectionQuestions,
            type: QuestionType.CaseQues.type,
            sectionMarks: pdfSections[i].totalMarks,
            totalNegativeMarks: pdfSections[i].negativeMarks,
            _id: `SEC-${pdfSections.length + 1}`,
            isAddNewQuestion: false,
            showOptions: true,
          });
          break;
      }
    }
    const sections1 = sections2.map((x) => {
      return {
        name: x.sectionName,
        questions: x.questions.map((x) => x._id),
        marksperquestion: x.sectionMarks,
      };
    });
    const finaltest2 = {
      ...testDetails,
      maxMarks: totalMarks,
      maxQuestions:
        subjectivePdfQuestions.length +
        objectivePdfQuestions.length +
        casePdfQuestions.length,
      subjectiveQuestions: subjectivePdfQuestions.filter(
        (x: any) => x._id.length <= 14
      ),
      questions: objectivePdfQuestions.filter((x: any) => x._id.length <= 14),
      caseBasedQuestions: casePdfQuestions.filter(
        (x: any) => x._id.length <= 14
      ),
      caseBasedQuestionIds1: caseBasedQuestion
        .filter((x) => x._id.length > 14)
        .map((x) => x._id),
      objectiveQuestionIds1: objectiveQuestion
        .filter((x) => x._id.length > 14)
        .map((x) => x._id),
      subjectiveQuestionsIds1: subjectiveQuestion
        .filter((x) => x._id.length > 14)
        .map((x) => x._id),
      date: today.getTime(),
      name: props.testName,
      chapter_ids: [],
      sections: sections1,
      pdfLink: url,
      testScheduleTime: props.startTime,
      duration: duration ? parseInt(duration) * 60 : null,
      superSections: superSections,
    };
    setLoading(true);
    createTestwithPdf({
      formObj: finaltest2,
    })
      .then((x) => {
        setLoading(false);
        props.onTestCreation();
        props.setTestScreen(TestScreen.Default);
      })
      .catch((e) => {
        setLoading(false);
        console.log(e);
      });
  }
  function nextClickHandler() {
    if (
      props.testStep === TestStep.EditQuestions ||
      props.testStep === TestStep.SelectTemplate
    ) {
      Mixpanel.track(WebAppEvents.CREATE_TEST_SAVE_AND_CREATE_TEST_CLICKED, {
        type: "Personlaized Test",
      });
      if (
        !sections.find((x) => {
          return x.isAddNewQuestion === true;
        })
      )
        createTest();
      else {
        showNotification({
          message: "You need to complete all the sections before proceeding",
        });
      }
    } else if (props.testStep === TestStep.PdfEditQuestions) {
      createPdfTest();
    }
  }

  useEffect(() => {
    if (file !== null) props.setTestStep(TestStep.PdfEditQuestions);
  }, [file]);

  function backHandler() {
    if (props.testStep === TestStep.SelectTemplate || templateId !== null) {
      props.setTestScreen(TestScreen.CreateTest);
    } else if (
      props.testStep === TestStep.EditQuestions ||
      props.testStep === TestStep.PdfEditQuestions
    ) {
      setSections([]);
      props.setTestStep(TestStep.SelectTemplate);
      setFile(null);
      setSuperSections([]);
      setPdfSections([]);
      Mixpanel.track(WebAppEvents.CREATE_TEST_BACK_BUTTON_CLICKED);
    }
  }

  useEffect(() => {
    if (props.testStep === TestStep.EditQuestions) {
      scrollAreaREf.current.scrollTo(0, 0);
      window.scrollTo(0, 0);
    }
  }, [props.testStep]);

  const isMd = useMediaQuery(`(max-width: 820px)`);
  const scrollAreaREf = useRef<any>(null);
  const [sections, setSections] = useState<TestSection[]>([]);
  const [pdfSections, setPdfSections] = useState<TestPdfSection[]>([]);
  const [isAddFromWordClicked, setIsAddFromWordClicked] =
    useState<boolean>(false);
  useEffect(() => {
    setTimeout(() => {
      if (typeof window?.MathJax !== "undefined") {
        window.MathJax.typesetClear();
        window.MathJax.typeset();
      }
    }, 500);
  }, [sections]);

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

  function scrollToId(ref: React.RefObject<any>, id: string) {
    const element = document.getElementById(id);
    if (element && ref.current) {
      const { top } = element.getBoundingClientRect();
      ref.current.scrollTo({ top, behavior: "smooth" });
    }
  }

  const [isGeneratewithAiQuestion, setisGeneratewithAiQuestion] =
    useState<boolean>(false);

    const [htmlFile, setHtmlFile] = useState<File | null>(null);
    const [solutionFile, setSolutionFile] = useState<File | null>(null);
    const [isHtmlFile, setIsHtmlFile] = useState<boolean>(false);
    const [htmlFiles, setHtmlFiles] = useState<File[]>([]);

    const instituteDetails = useSelector<RootState, InstituteDetails | null>(
      (state) => {
        return state.instituteDetailsSlice.instituteDetails;
      }
    );

    function uploadHtmlHandler() {
      console.log(htmlFile);
      if (htmlFile) {
        setLoading(true);
        UploadHtml({ file: htmlFile, files: htmlFiles })
          .then((x: any) => {
            setLoading(false);
            const section1: TestSection[] = x.sections.map((section: any, i: number) => {
              const questions = section.questions.map((y: any) => {
                return {
                  ...y,fromTeacher:true,totalNegativeMarks:0
                };
              });

              return {
                ...section,
                questions: questions,
                _id: `SEC-${i}`,
                isAddNewQuestion: false,
                showOptions: false
                          };

            });
            setSections(section1);
            setSuperSections([
              {
                name: "MAIN",
                sections: section1.map((x) => x._id),
                totalTime: "0",
              },
            ]);
            props.setTestStep(TestStep.EditQuestions);

          })
          .catch((e) => {
            setLoading(false);
            console.log(e);
          });
      }
    }


  return (
    <>
      <LoadingOverlay visible={isloading || isLoading} zIndex={999} />

      <Stack
        style={{
          width: "100%",
          height: "100%",
        }}
      >
        <Stack
          h={"100%"}
          align="center"
          style={{
            position: "relative",
          }}
        >
          <ScrollArea
            h={isMd ? "calc(100%)" : "100%"}
            style={{
              background:
                props.testStep === TestStep.EditQuestions ||
                props.testStep === TestStep.PdfEditQuestions
                  ? "#F7F7FF"
                  : "white",
            }}
            ref={scrollAreaREf}
            w="100%"
          >
            <Stack spacing={0} mb={50}>
              <Stack
                px={isMd ? 20 : 70}
                pt={30}
                style={{
                  background: "white",
                }}
              >
                <Text fz={36} fw={700} color="#454545">
                  {props.testName}
                </Text>
                <Text fz={20} fw={500} color="#5F5F5F">
                  Create Test and track student’s progress.
                </Text>
              </Stack>
              <Stack spacing={0}>
                <Stack
                  style={{
                    background: "white",
                  }}
                >
                  <Stack
                    px={isMd ? 20 : 70}
                    pt={20}
                    spacing={5}
                    style={{
                      background: "white",
                    }}
                  >
                    <Group spacing={isMd ? 4 : "xs"} align="center">
                      <Text
                        c={"white"}
                        w={20}
                        h={20}
                        fz={13}
                        bg={
                          props.testStep === TestStep.SelectTemplate
                            ? "#3174F3"
                            : "#BABABA"
                        }
                        p={5}
                        style={{
                          display: "inline-flex",
                          borderRadius: "50%",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        1
                      </Text>
                      <Text
                        fw={
                          props.testStep === TestStep.SelectTemplate ? 600 : 400
                        }
                        fz={isMd ? 12 : 16}
                      >
                        Select Template
                      </Text>
                      <Divider
                        size={2}
                        c={"#ABABAB"}
                        w={isMd ? "4%" : "7%"}
                      ></Divider>
                      <Text
                        c={"white"}
                        w={20}
                        h={20}
                        fz={13}
                        bg={
                          props.testStep === TestStep.EditQuestions ||
                          props.testStep === TestStep.PdfEditQuestions
                            ? "#3174F3"
                            : "#BABABA"
                        }
                        p={5}
                        style={{
                          display: "inline-flex",
                          borderRadius: "50%",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        2
                      </Text>
                      <Text fz={isMd ? 12 : 16}>Edit Questions</Text>
                    </Group>
                  </Stack>
                  <Divider c={"#ABABAB"} size={2} mt={20} />
                </Stack>
                {props.testStep === TestStep.SelectTemplate && (
                  <Stack px={isMd ? 20 : 70} pt={20} pb={10}>
                    <Flex
                      align="center"
                      style={{
                        boxShadow: "0px 0px 4px 0px rgba(0, 0, 0, 0.25)",
                        background: "#FFF",
                        borderRadius: "10px",
                        width: isMd ? "100%" : "60%",
                        cursor: "pointer",
                      }}
                      py={10}
                      justify="space-between"
                      px={10}
                      onClick={() => {
                        setisGeneratewithAiQuestion(true);
                        setSelectedTemplate(Template.GenerateUsingAI);
                        Mixpanel.track(
                          WebAppEvents.CREATE_TEST_GENERATE_WITH_AI_SELECTED
                        );
                      }}
                    >
                      <Flex align="center">
                        <Box
                          w={isMd ? "36px" : "60px"}
                          h={isMd ? "36px" : "60px"}
                          style={{
                            border: "1px solid #4B65F6",
                          }}
                        >
                          <Center w="100%" h="100%">
                            <IconGenerateAI />
                          </Center>
                        </Box>
                        <Text
                          color="#000"
                          fz={isMd ? 17 : 23}
                          fw={600}
                          ml="20px"
                        >
                          Generate from Question Bank
                        </Text>
                      </Flex>
                      <IconChevronRight size={30} />
                    </Flex>
                    {/* )} */}
                    <Flex
                      align="center"
                      style={{
                        boxShadow: "0px 0px 4px 0px rgba(0, 0, 0, 0.25)",
                        background: "#FFF",
                        borderRadius: "10px",
                        width: isMd ? "100%" : "60%",
                        cursor: "pointer",
                      }}
                      py={10}
                      justify="space-between"
                      px={10}
                      onClick={() => {
                        Mixpanel.track(
                          WebAppEvents.CREATE_TEST_TYPE_YOUR_QUESTION_SELECTED
                        );
                        setSelectedTemplate(Template.UserTyped);
                        props.setTestStep(TestStep.EditQuestions);
                      }}
                    >
                      <Flex align="center">
                        <Box
                          w={isMd ? "36px" : "60px"}
                          h={isMd ? "36px" : "60px"}
                          style={{
                            border: "1px solid #4B65F6",
                          }}
                        >
                          <Center w="100%" h="100%">
                            <IconT col="#4B65F6" />
                          </Center>
                        </Box>
                        <Text
                          color="#000"
                          fz={isMd ? 17 : 23}
                          fw={600}
                          ml="20px"
                        >
                          Type your question
                        </Text>
                      </Flex>
                      <IconChevronRight size={30} />
                    </Flex>
                    <Stack
                      style={{
                        boxShadow: "0px 0px 4px 0px rgba(0, 0, 0, 0.25)",
                        background: "#FFF",
                        borderRadius: "10px",
                        width: isMd ? "100%" : "60%",
                        cursor: "pointer",
                      }}
                      pb={10}
                    >
                      <Flex
                        py={10}
                        justify="space-between"
                        px={10}
                        align="center"
                        onClick={() => {
                          setIsAddFromWordClicked(true);
                          setSelectedTemplate(Template.GenerateUsingWord);
                        }}
                        style={{
                          cursor: "pointer",
                        }}
                      >
                        <Flex align="center">
                          <Box
                            w={isMd ? "36px" : "60px"}
                            h={isMd ? "36px" : "60px"}
                          >
                            <Center w="100%" h="100%">
                              {/* <Box w="60%" h="60%"> */}
                              <IconWord />
                              {/* </Box> */}
                            </Center>
                          </Box>
                          <Text
                            color="#000"
                            fz={isMd ? 17 : 23}
                            fw={600}
                            ml="20px"
                          >
                            Upload File
                          </Text>
                        </Flex>
                        <IconChevronRight size={30} />
                      </Flex>
                    </Stack>

                    { instituteDetails?._id =="INST-a7b39310-4554-4f8f-8836-85158f2c55c5" &&
                    <Stack
                      style={{
                        boxShadow: "0px 0px 4px 0px rgba(0, 0, 0, 0.25)",
                        background: "#FFF",
                        borderRadius: "10px",
                        width: isMd ? "100%" : "60%",
                        cursor: "pointer",
                      }}
                      pb={10}
                    >
                      <Flex
                        py={10}
                        justify="space-between"
                        px={10}
                        align="center"
                        onClick={() => {
                          setIsHtmlFile(true)
                        }}
                        style={{
                          cursor: "pointer",
                        }}
                      >
                        <Flex align="center">
                          <Box
                            w={isMd ? "36px" : "60px"}
                            h={isMd ? "36px" : "60px"}
                            style={{
                              border: "1px solid #4B65F6",
                            }}
                          >
                            <Center w="100%" h="100%">
                              <Box w="60%" h="60%">
                                <IconUpload col="#4B65F6" />
                              </Box>
                            </Center>
                          </Box>
                          <Text
                            color="#000"
                            fz={isMd ? 17 : 23}
                            fw={600}
                            ml="20px"
                          >
                            Upload Html File
                          </Text>
                        </Flex>
                        <IconChevronRight size={30} />
                      </Flex>
                    </Stack>
}
                  </Stack>
                )}
                {props.testStep === TestStep.EditQuestions &&
                  selectedTemplate && (
                    <Stack
                      px={isMd ? 20 : 70}
                      pt={20}
                      pb={10}
                      style={{
                        backgroundColor: "#F7F7FF",
                        minHeight: "100%",
                      }}
                    >
                      <NewTypeQuestion
                        sections={sections}
                        setsections={setSections}
                        isWord={wordFile !== null}
                        selectedTemplate={selectedTemplate}
                        superSections={superSections}
                        setSuperSections={setSuperSections}
                        setisNexClickAble={() => {
                          setIsNextSuperSectionClickablebeforeTime(false);
                        }}
                      />
                    </Stack>
                  )}
                {props.testStep === TestStep.PdfEditQuestions &&
                  url !== null &&
                  file !== null && (
                    <Stack
                      px={isMd ? 20 : 70}
                      pt={20}
                      pb={10}
                      style={{
                        backgroundColor: "#F7F7FF",
                        minHeight: "100%",
                      }}
                    >
                      <PdfTypeQuestionTest
                        sections={pdfSections}
                        setsections={setPdfSections}
                        pdfLink={url ?? ""}
                        scrollToId={(id) => {
                          scrollToId(scrollAreaREf, id);
                        }}
                      />
                    </Stack>
                  )}
              </Stack>
            </Stack>
          </ScrollArea>
          <Flex
            style={{
              position: isMd ? "fixed" : "sticky",
              bottom: isMd ? 60 : 0,
              width: "100%",
              height: "80px",
              background:
                props.testStep === TestStep.EditQuestions ? "white" : "#F7F7FF",
              borderTop: "1px solid #DEDEE5",
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
              px={props.testStep === TestStep.EditQuestions && isMd ? 20 : 30}
              fz={18}
              onClick={backHandler}
            >
              Back
            </Button>
            {(props.testStep === TestStep.EditQuestions ||
              props.testStep === TestStep.PdfEditQuestions ||
              props.testStep === TestStep.SelectTemplate) && (
              <Button
                size="lg"
                bg="#4B65F6"
                fz={18}
                rightIcon={<IconArrowNarrowRight color="white" size={30} />}
                style={{
                  color: "white",
                }}
                px={props.testStep === TestStep.EditQuestions && isMd ? 20 : 30}
                sx={{
                  "&:hover": {
                    backgroundColor: "#3C51C5",
                  },
                }}
                onClick={() => {
                  nextClickHandler();
                }}
              >
                {props.testStep === TestStep.EditQuestions ||
                props.testStep === TestStep.PdfEditQuestions ||
                props.testStep === TestStep.SelectTemplate
                  ? `${
                      props.testStep === TestStep.SelectTemplate
                        ? "Skip"
                        : "Save"
                    } & Create Test`
                  : "Next"}
              </Button>
            )}
          </Flex>
        </Stack>
        <WordUploadModal
          isOpened={isAddFromWordClicked}
          onClick={(x, negativeMarks) => {
            props.setTestStep(TestStep.EditQuestions);
            const section1: TestSection[] = x.map((section: any, i: number) => {
              const questions = section.questions.map((y: any) => {
                return {
                  ...y,fromTeacher:true,
                };
              });
              return {
                ...section,
                questions: questions,
                _id: `SEC-${i}`,
                isAddNewQuestion: false,
                showOptions: false,
              };
            });
            setSections(section1);
            setSuperSections([
              {
                name: "MAIN",
                sections: section1.map((x) => x._id),
                totalTime: "0",
              },
            ]);
          }}
          setIsOpened={setIsAddFromWordClicked}
          setloading={setLoading}
          testName={props.testName}
          setWordFile={setWordFile}
          wordFile={wordFile}
        />
        <Modal
          opened={isGeneratewithAiQuestion}
          onClose={() => {
            setisGeneratewithAiQuestion(false);
          }}
          centered
          title="Generate From Question Bank"
        >
          <AIModal
            isModalOpened={isGeneratewithAiQuestion}
            onClose={() => {
              setisGeneratewithAiQuestion(false);
            }}
            setsections={setSections}
            setTestStep={props.setTestStep}
            setloading={setLoading}
            setSuperSections={setSuperSections}
          />
        </Modal>

        <Modal
        opened={isHtmlFile}
        onClose={() => {
          setIsHtmlFile(false);
        }}
        centered
        title="Upload Html File"
        styles={{
          title: {
            fontSize: 20,
            fontweight: 800,
          },
        }}
      >
        <Stack>
          <FileInput
            value={htmlFile}
            onChange={setHtmlFile}
            title="Upload Html File"
            label="Add File"
            accept=".html,.htm"
          />
          <FileInput
            multiple
            value={htmlFiles}
            onChange={setHtmlFiles}
            title="Upload Images"
            label="Add Images"
            accept="image/*"
          />
          {/* <FileInput value={solutionFile} onChange={setSolutionFile} /> */}
          <Button
            bg="#4B65F6"
            style={{ borderRadius: "24px" }}
            size="lg"
            onClick={() => {
              uploadHtmlHandler();
              setSelectedTemplate(Template.GenerateUsingWord);
              setIsHtmlFile(false);
            }}
            sx={{
              "&:hover": {
                backgroundColor: "#3C51C5",
              },
            }}
            my={10}
            disabled={htmlFile === null || htmlFiles.length < 1}
          >
            Upload File
          </Button>
        </Stack>
      </Modal>
        <FileInput
          value={file}
          onChange={setFile}
          ref={fileInputRef}
          display="none"
        />
      </Stack>
    </>
  );
}
