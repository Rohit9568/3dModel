import {
  Box,
  Button,
  Center,
  Divider,
  Flex,
  Grid,
  Group,
  LoadingOverlay,
  MultiSelect,
  NumberInput,
  ScrollArea,
  Select,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import {
  IconArrowLeftRhombus,
  IconArrowNarrowLeft,
  IconArrowNarrowRight,
  IconChevronLeft,
  IconChevronRight,
} from "@tabler/icons";
import { useEffect, useState } from "react";
import {
  IconGenerateAI,
  IconLeftArrow,
  IconRightArrow,
  IconT,
  IconUpload,
} from "../../components/_Icons/CustonIcons";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/ReduxStore";
import {
  fetchClassAndSubjectList,
  fetchCurrentSubjectData,
} from "../../features/UserSubject/TeacherSubjectSlice";
import { subjects } from "../../store/subjectsSlice";
import { Mixpanel } from "../../utilities/Mixpanel/MixpanelHelper";
import { WebAppEvents } from "../../utilities/Mixpanel/AnalyticeEventWebApp";
import {
  PaperDifficulity,
  TestDeatils,
  TestScreen,
} from "../../components/_New/ContentTest";
import { QuestionType } from "../../@types/QuestionTypes.d";
import { useMediaQuery } from "@mantine/hooks";
import { PredefinedTestQuestions } from "./PredefinedTestQuestions";
import {
  createSamplePaperTest,
  getTestQuestions,
} from "../../features/test/TestSlice";
const subjectsActions = subjects.actions;
enum TestStep {
  BasicSettings,
  SelectTemplate,
  EditQuestions,
}

interface PersonalizedTestProps {
  testName: string;
  setTestScreen: (val: TestScreen) => void;
}

const QuestionTypes: QuestionType[] = [
  QuestionType.AllQues,
  QuestionType.McqQues,
  QuestionType.LongQues,
  QuestionType.ShortQues,
];

interface SUBjectivetypedQuestion {
  questionImageUrl: string;
  text: string;
  answer: string;
  type: string;
  _id: string;
  answerImageUrl: string;
}
export function PredefinedTest(props: PersonalizedTestProps) {
  const [testStep, setTestStep] = useState<TestStep>(TestStep.BasicSettings);
  const [subjectId, setSubjectId] = useState<string | null>(null);
  const [testChapters, setTestChapters] = useState<string[]>([]);
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedClassName, setSelectedClassName] = useState<string>("");
  const [selectedSubjectName, setSelectedsubjectName] = useState<string>("");
  const [selectedChapternames, setselectedChaptersName] = useState<string[]>(
    []
  );

  const [chapterList, setChapterList] = useState<
    { value: string; label: string }[]
  >([]);
  const [subjectiveQuestion, setSubjectiveQuestion] = useState<
    SUBjectivetypedQuestion[]
  >([]);
  const [caseBasedQuestion, setCaseBasedQuestion] = useState<
    CASEtypedQuestion[]
  >([]);
  const [objectiveQuestion, setObjectiveQuestion] = useState<
    MCQTypedQuestion[]
  >([]);
  const [subjectiveWordQuestion, setSubjectiveWordQuestion] = useState<
    SUBjectivetypedQuestion[]
  >([]);
  const [caseBasedWordQuestion, setCaseBasedWordQuestion] = useState<
    CASEtypedQuestion[]
  >([]);
  const [objectiveWordQuestion, setObjectiveWordQuestion] = useState<
    MCQTypedQuestion[]
  >([]);

  const dispatch = useDispatch<AppDispatch>();
  const userSubjects = useSelector<RootState, UserClassAndSubjects[]>(
    (state) => {
      return state.subjectSlice.userSubjects;
    }
  );

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
    caseBasedQuestions: [],
    questionType: QuestionType.McqQues.type,
    isSamplePaper: false,
  });

  useEffect(() => {
    if (userSubjects.length < 1) fetchList();
  }, []);
  const [isLoading, setisLoading] = useState<boolean>(false);
  function fetchSamplePaperData() {
    if (subjectId) {
      setisLoading(true);
      getTestQuestions(subjectId)
        .then((x: any) => {
          setisLoading(false);
          setSubjectiveWordQuestion([
            ...x.veryshortQuestions,
            ...x.shortQuestions,
            ...x.longQuestions,
          ]);
          setObjectiveWordQuestion([...x.mcqQuestions1]);
          setCaseBasedWordQuestion([...x.caseBasedQuestion1]);
        })
        .catch((e) => {
          setisLoading(false);
          console.log(e);
        });
    }
  }
  function nextClickHandler() {
    if (testStep === TestStep.BasicSettings) {
      setTestStep(TestStep.EditQuestions);
      Mixpanel.track(WebAppEvents.CREATE_TEST_NEXT_BUTTON_CLICKED, {
        type: "Predefined Test",
      });
      fetchSamplePaperData();
    } else if (testStep === TestStep.EditQuestions) {
      Mixpanel.track(WebAppEvents.CREATE_TEST_SAVE_AND_CREATE_TEST_CLICKED, {
        type: "Predefined Test",
      });
      createTest();
    }
  }

  function backClickHanlder() {
    if (testStep === TestStep.BasicSettings) {
      props.setTestScreen(TestScreen.CreateTest);
    } else if (testStep === TestStep.EditQuestions) {
      setTestStep(TestStep.BasicSettings);
    }
  }

  useEffect(() => {
    if (subjectId) {
      setLoading(true);
      fetchCurrentSubjectData({ subject_id: subjectId })
        .then((data: any) => {
          setChapterList(
            data.userChapters.map((chapter: any) => {
              return { value: chapter._id, label: chapter.name };
            })
          );
          setLoading(false);
        })
        .catch((err) => {
          setLoading(false);
          console.log(err);
        });
    }
  }, [subjectId]);

  function fetchList() {
    setLoading(true);
    fetchClassAndSubjectList()
      .then((data: any) => {
        const fetchedData: UserSubjectAPI[] = data;
        const segregatedData: UserClassAndSubjects[] = [];
        fetchedData.forEach((subject) => {
          const subjectEntry = {
            _id: subject._id,
            name: subject.name,
            chaptersCount: subject.chaptersCount,
            subjectId:subject.subjectId
          };
          const found = segregatedData.findIndex(
            (x) => x.classId === subject.classId
          );
          if (found === -1) {
            segregatedData.push({
              classId: subject.classId,
              className: subject.className,
              classSortOrder: subject.classSortOrder,
              subjects: [subjectEntry],
              grade:subject.classgrade

            });
          } else {
            segregatedData[found].subjects.push(subjectEntry);
          }
        });
        dispatch(
          subjectsActions.setUserSubjects(
            segregatedData.sort((a, b) => a.classSortOrder - b.classSortOrder)
          )
        );

        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        console.log(error);
      });
  }

  function createTest() {
    const longQues = subjectiveQuestion.filter(
      (x) => x.type === QuestionType.LongQues.type
    );
    const shortQues = subjectiveQuestion.filter(
      (x) => x.type === QuestionType.ShortQues.type
    );
    const veryShortQues = subjectiveQuestion.filter(
      (x) => x.type === QuestionType.VeryShortQues.type
    );
    const today = new Date(Date.now());

    const finaltest2 = {
      ...testDetails,
      maxQuestions:
        subjectiveQuestion.length +
        objectiveQuestion.length +
        caseBasedQuestion.length,
      subjectiveQuestions: subjectiveQuestion.filter(
        (x) => x._id.length <= 6 || x.type === QuestionType.VeryShortQues.type
      ),
      questions: objectiveQuestion.filter((x) => x._id.length <= 14),
      caseBasedQuestions: caseBasedQuestion.filter((x) => x._id.length <= 14),
      caseBasedQuestionIds1: caseBasedQuestion
        .filter((x) => x._id.length > 14)
        .map((x) => x._id),
      objectiveQuestionIds1: objectiveQuestion
        .filter((x) => x._id.length > 14)
        .map((x) => x._id),
      subjectiveQuestionsIds1: subjectiveQuestion
        .filter(
          (x) => x._id.length > 14 && x.type !== QuestionType.VeryShortQues.type
        )
        .map((x) => x._id),
      date: today.getTime(),
      name: props.testName,
      subject_id: subjectId || "",
      chapter_ids: testChapters,
      questionType: QuestionType.SamplePaper.type,
      veryShortQues,
      shortQues,
      longQues,
      mcqlength: objectiveQuestion.length,
      caseQues: caseBasedQuestion.length,
    };
    if (subjectId) {
      setisLoading(true);
      createSamplePaperTest({
        formObj: finaltest2,
        subjectId: subjectId,
      })
        .then((x) => {
          setisLoading(false);
          props.setTestScreen(TestScreen.Default);
        })
        .catch((e) => {
          setisLoading(false);
          console.log(e);
        });
    }
  }
  const templateTypes = ["Sample Paper"];
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(
    "Sample Paper"
  );
  const isMd = useMediaQuery(`(max-width: 820px)`);

  const samplePaperSubjects = [
    "Mathematics",
    "Physics",
    "Biology",
    "Chemistry",
    "Science",
  ];
  const mainPath = useSelector<RootState, string | null>((state) => {
    return state.mainPathSlice.value;
  });
  return (
    <>
      <LoadingOverlay visible={isLoading} />
      <Stack h={"calc(100% - 80px)"} align="center">
        <ScrollArea w={isMd ? "100%" : "100%"}>
          <Stack spacing={0} mb={50}>
            <Stack px={isMd ? 20 : 70} pt={30}>
              <Text fz={36} fw={700} color="#454545">
                {props.testName}
              </Text>
              <Text fz={20} fw={500} color="#5F5F5F">
                Create Test and track student’s progress.
              </Text>
            </Stack>
            <Stack>
              <Stack px={isMd ? 20 : 70} pt={20} spacing={5}>
                <Group spacing={"xs"} align="center">
                  <Text
                    c={"white"}
                    w={20}
                    h={20}
                    fz={13}
                    bg={
                      testStep === TestStep.BasicSettings
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
                    fw={testStep === TestStep.BasicSettings ? 600 : 400}
                    fz={isMd ? 12 : 16}
                  >
                    Basic Settings
                  </Text>

                  <Divider size={2} c={"#ABABAB"} w={"7%"}></Divider>
                  <Text
                    c={"white"}
                    w={20}
                    h={20}
                    fz={13}
                    bg={
                      testStep === TestStep.EditQuestions
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
              {testStep === TestStep.BasicSettings && (
                <Stack
                  px={isMd ? 20 : 70}
                  style={{
                    width: isMd ? "100%" : "50%",
                  }}
                >
                  <Text fz={19} c={"black"} fw={700}>
                    Test Details
                  </Text>
                  <Flex justify="space-between">
                    <Select
                      label="Class"
                      placeholder="Select Class"
                      data={userSubjects
                        .map((sub) => {
                          return { value: sub.classId, label: sub.className };
                        })
                        .filter((x) => {
                          return (
                            x.label === "Class 10" || x.label === "Class 12"
                          );
                        })}
                      w="45%"
                      styles={{
                        label: {
                          fontSize: 16,
                          marginBottom: 4,
                        },
                      }}
                      onChange={(value) => {
                        const found = userSubjects.find(
                          (x) => x.classId === value
                        );
                        if (found) setSelectedClassName(found?.className);
                        Mixpanel.track(
                          WebAppEvents.TEACHER_APP_TEST_PAGE_CLASS_SELECTED,
                          {
                            class_id: value,
                          }
                        );
                        setSelectedClass(value);
                        setSubjectId(null);
                        setTestChapters([]);
                      }}
                    />
                    <Select
                      label="Subject"
                      placeholder="Select Subject"
                      data={
                        userSubjects
                          .find((x) => x.classId === selectedClass)
                          ?.subjects.map((sub) => {
                            return { value: sub._id, label: sub.name };
                          })
                          .filter((x) =>
                            samplePaperSubjects.includes(x.label)
                          ) ?? []
                      }
                      styles={{
                        label: {
                          fontSize: 16,
                          marginBottom: 4,
                        },
                      }}
                      w="45%"
                      //   w={isMd ? "40vw" : 190}
                      value={subjectId}
                      onChange={(value) => {
                        const found = userSubjects
                          .find((x) => x.classId === selectedClass)
                          ?.subjects.find((sub) => sub._id === value);
                        if (found) setSelectedsubjectName(found?.name);
                        Mixpanel.track(
                          WebAppEvents.TEACHER_APP_TEST_PAGE_SUBJECT_SELECTED,
                          {
                            subject_id: value,
                          }
                        );
                        setSubjectId(value);
                        setTestChapters([]);
                      }}
                    />
                  </Flex>
                  <Select
                    label="Select Template"
                    placeholder="Select Template"
                    data={templateTypes}
                    value={selectedTemplate}
                    // w={isMd ? "40vw" : 190}
                    onChange={setSelectedTemplate}
                  />

                  {/* </Flex> */}
                </Stack>
              )}
              {testStep === TestStep.EditQuestions && (
                <PredefinedTestQuestions
                  objectiveQuestion={objectiveQuestion}
                  subjectiveQuestion={subjectiveQuestion}
                  caseBasedQuestion={caseBasedQuestion}
                  objectiveWordQuestions={objectiveWordQuestion}
                  subjectiveWordQuestions={subjectiveWordQuestion}
                  casebasedWordQuestions={caseBasedWordQuestion}
                  setCaseBasedQuestion={setCaseBasedQuestion}
                  setObjectiveQuestion={setObjectiveQuestion}
                  setSubjectiveQuestion={setSubjectiveQuestion}
                />
              )}
            </Stack>
          </Stack>
        </ScrollArea>
        <Flex
          style={{
            position: "absolute",
            bottom: isMd ? 60 : 0,
            width: "100%",
            height: "80px",
            background: "#F7F7FF",
            borderTop: "1px solid #DEDEE5",
          }}
          align="center"
          justify="center"
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
            px={30}
            fz={18}
            onClick={() => {
              backClickHanlder();
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
            px={30}
            sx={{
              "&:hover": {
                backgroundColor: "#3C51C5",
              },
            }}
            onClick={() => {
              nextClickHandler();
            }}
            disabled={
              testStep === TestStep.BasicSettings
                ? selectedClass === null || subjectId === null
                : testStep === TestStep.EditQuestions
                ? isLoading
                : false
            }
          >
            {testStep === TestStep.BasicSettings ? "Next" : "Save & Create"}
          </Button>
        </Flex>
      </Stack>
    </>
  );
}
