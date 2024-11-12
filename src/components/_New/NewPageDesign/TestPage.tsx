import {
  Button,
  Center,
  Container,
  Flex,
  Menu,
  Modal,
  Radio,
  Stack,
  Text,
  TextInput,
  createStyles,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { showNotification } from "@mantine/notifications";
import ResizeObserver from "rc-resize-observer";
import { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  AutoSizer,
  CellMeasurer,
  CellMeasurerCache,
  List,
} from "react-virtualized";
import { QuestionType } from "../../../@types/QuestionTypes.d";
import {
  AddMcqQuestiontoUserTopic,
  AddSubjectiveQuestiontoUserTopic,
  fetchChapterQuestions,
} from "../../../features/UserSubject/chapterDataSlice";
import { CanvasDraw } from "../../../pages/DetailsPages/CanvasDraw";
import { ContentSimulation } from "../../../pages/SimulationPage/ContentSimulation";
import { AppDispatch, RootState } from "../../../store/ReduxStore";
import { chapterQuestions } from "../../../store/chapterQuestionsSlice";
import { chapter } from "../../../store/chapterSlice";
import { WebAppEvents } from "../../../utilities/Mixpanel/AnalyticeEventWebApp";
import { Mixpanel } from "../../../utilities/Mixpanel/MixpanelHelper";
import { QuestionCard } from "../../DetailsPageTab/QuestionCard";
import { QuizCard } from "../../DetailsPageTab/QuizCard";
import { IconDown } from "../../_Icons/CustonIcons";
const chapterQuestionsActions = chapterQuestions.actions;
const chapterActions = chapter.actions;

const useStyles = createStyles(() => ({
  headerSearch2: {
    textAlign: "left",
    borderRadius: 10,
    padding: 10,
    display: "flex",
    width: "100%",
  },
}));

const options = [1, 2, 3, 4];
interface Option {
  text: string;
  isCorrect: boolean;
}

interface AddSubjectiveQuestionProps {
  // topic: SingleTopicQuestions;
  setLoadingData: (val: boolean) => void;
  onUpdateTopic: (id: string, data: SingleTopicQuestions) => void;
  setSelectedAddType: (data: QuestionType | null) => void;
  currentChapter: SingleChapter;
  currentChapterQuestions: SingleTopicQuestions;
  selectedQuestionType: QuestionType;
}

export const AddSubjectiveQuestion = (props: AddSubjectiveQuestionProps) => {
  const [questionText, setQuestionText] = useState<string>("");
  const [answerText, setAnswerText] = useState<string>("");

  const isSubmitDisabled =
    questionText.trim() === "" || answerText.trim() === "";

  async function formHandler(event: any) {
    event.preventDefault();
    props.setSelectedAddType(null);
    const formData = new FormData(event.target);
    const formDataObj: any = Object.fromEntries(formData.entries());
    const questionbody = {
      ...formDataObj,
      sortOrder: props.currentChapterQuestions.subjectiveQuestions.length + 1,
      type: props.selectedQuestionType.type,
    };
    props.setLoadingData(true);
    await AddSubjectiveQuestiontoUserTopic({
      id: props.currentChapter.topics[0]._id,
      questionbody: questionbody,
      chapterId: props.currentChapter._id,
    })
      .then((data: any) => {
        props.setLoadingData(false);
        props.onUpdateTopic(props.currentChapter.topics[0]._id, data);
      })
      .catch((error) => {
        props.setLoadingData(false);
        console.log(error);
      });
  }

  return (
    <Flex p={10} direction="column">
      <Text fz={20} fw={700} mb={10}>
        Add Question:
      </Text>
      <form onSubmit={formHandler}>
        <TextInput
          mb={10}
          placeholder="Question"
          name="text"
          onChange={(e) => setQuestionText(e.target.value)}
        />
        <textarea
          style={{
            height: "50vh",
            width: "100%",
            outline: "none",
          }}
          placeholder="Answer"
          name="answer"
          onChange={(e) => setAnswerText(e.target.value)}
        />
        <Button
          onClick={() => {
            showNotification({ message: "Successfully Added Question" });
            Mixpanel.track(
              WebAppEvents.TEACHER_APP_PRACTICE_PAGE_SUBMIT_CLICKED,
              {
                type: props.selectedQuestionType.name,
              }
            );
          }}
          type="submit"
          my={15}
          disabled={isSubmitDisabled}
          w={"100%"}
        >
          Submit
        </Button>
      </form>
    </Flex>
  );
};
interface AddQuizQuestionProps {
  // topic: SingleTopicQuestions;
  setLoadingData: (val: boolean) => void;
  onUpdateTopic: (id: string, data: SingleTopicQuestions) => void;
  setSelectedAddType: (data: QuestionType | null) => void;
  currentChapter: SingleChapter;
  currentChapterQuestions: SingleTopicQuestions;
}
export function AddQuizQuestion(props: AddQuizQuestionProps) {
  const [value, setValue] = useState<string>("");
  const [isFormValid, setIsFormValid] = useState<boolean>(false);
  const [questionText, setQuestionText] = useState<string>("");
  const [optionsText, setOptionsText] = useState<string[]>(["", "", "", ""]);

  useEffect(() => {
    const allOptionsFilled = optionsText.every((option) => option !== "");
    setIsFormValid(allOptionsFilled && questionText !== "" && value !== "");
  }, [questionText, optionsText, value]);

  async function formHandler(event: any) {
    event.preventDefault();
    props.setSelectedAddType(null);

    const formData = new FormData(event.target);
    const formDataObj: any = Object.fromEntries(formData.entries());
    const answers: Option[] = [];
    for (let i = 0; i < 4; i++) {
      const isCorrect1: boolean = formDataObj["correctOption"] == i + 1;
      answers.push({
        text: formDataObj[`option${i}`],
        isCorrect: isCorrect1,
      });
    }
    const questionbody = {
      text: formDataObj.text,
      topicId: props.currentChapter.topics[0]._id,
      answers: answers,
      sortOrder: props.currentChapterQuestions.mcqQuestions.length,
    };
    props.setLoadingData(true);
    await AddMcqQuestiontoUserTopic({
      id: props.currentChapter.topics[0]._id,
      questionbody: questionbody,
      chapterId: props.currentChapter._id,
    })
      .then((data: any) => {
        props.setLoadingData(false);
        props.onUpdateTopic(props.currentChapter.topics[0]._id, data);
      })
      .catch((error) => {
        props.setLoadingData(false);
        console.log(error);
      });
  }
  return (
    <Flex p={10} direction="column">
      <Text fw={400} fz={18} mb={10}>
        Add Question:
      </Text>
      <form onSubmit={formHandler}>
        <TextInput
          placeholder="Question"
          mb={10}
          name="text"
          onChange={(e) => setQuestionText(e.target.value)}
        />
        <Radio.Group
          value={value}
          orientation="vertical"
          onChange={setValue}
          name="correctOption"
          withAsterisk
        >
          {options.map((x, i) => {
            return (
              <Flex
                align="center"
                justify="space-around"
                style={{
                  width: "100%",
                }}
                key={i}
              >
                <Radio value={`${x}`} />
                <TextInput
                  style={{
                    width: "90%",
                  }}
                  placeholder={`Option ${x}`}
                  name={`option${i}`}
                  onChange={(e) => {
                    const newOptions = [...optionsText];
                    newOptions[i] = e.target.value;
                    setOptionsText(newOptions);
                  }}
                />
              </Flex>
            );
          })}
        </Radio.Group>
        <Button
          onClick={() => {
            showNotification({ message: "Successfully Added Question" });
            Mixpanel.track(
              WebAppEvents.TEACHER_APP_PRACTICE_PAGE_SUBMIT_CLICKED,
              {
                type: QuestionType.McqQues.name,
              }
            );
          }}
          type="submit"
          mt={20}
          disabled={!isFormValid}
          w={"100%"}
        >
          Submit
        </Button>
      </form>
    </Flex>
  );
}

interface TestPageProps {
  chapter: SingleChapter;
  setLoadingData: (val: boolean) => void;
}
export default function TestPage(props: TestPageProps) {
  const { theme } = useStyles();
  const dispatch = useDispatch<AppDispatch>();
  const isMd = useMediaQuery(`(max-width: ${theme.breakpoints.md}px)`);
  const [selectedAddType, setSelectedAddType] = useState<QuestionType | null>(
    null
  );
  const [currentQuestions, setCurrentQuestions] =
    useState<SingleTopicQuestions | null>(null);
  const [selectedType, setSelectedType] = useState<QuestionType>(
    QuestionType.AllQues
  );
  const [isPlaySimulation, setIsPlaySimulation] = useState<boolean>(false);

  const currentChapterQuestions = useSelector<
    RootState,
    SingleChapterQuestions
  >((state) => {
    return state.chapterQuestionsSlice.currentChapterQuestions;
  });

  const [allVirtualizedQuestions, setAllVirtualizedQuestions] = useState<
    {
      element: any;
      type: QuestionType;
    }[]
  >([]);
  const memoizedCurrentChapterQuestions = useMemo(
    () => currentChapterQuestions,
    [currentChapterQuestions]
  );

  useEffect(() => {
    const allQuestions: {
      _id: string;
      mcqQuestions: McqQuestion[];
      subjectiveQuestions: SubjectiveQuestion[];
    } = {
      _id: "",
      mcqQuestions: [],
      subjectiveQuestions: [],
    };

    memoizedCurrentChapterQuestions.topics.map((x) => {
      allQuestions.mcqQuestions = allQuestions.mcqQuestions.concat(
        x.mcqQuestions
      );
      allQuestions.subjectiveQuestions =
        allQuestions.subjectiveQuestions.concat(x.subjectiveQuestions);
    });

    setCurrentQuestions(allQuestions);
  }, [memoizedCurrentChapterQuestions]);

  async function topicQuestionsUpdate(id: string, data: SingleTopicQuestions) {
    if (selectedType !== QuestionType.AllQues && selectedAddType !== null) {
      setSelectedType(selectedAddType);
    }
    dispatch(chapterQuestionsActions.setTopicUpdate({ id, topic: data }));
    dispatch(
      chapterActions.updateTopicwithNewId({ oldId: id, newId: data._id })
    );
  }
  const cache = useRef(
    new CellMeasurerCache({
      fixedWidth: true,
      defaultHeight: 100,
    })
  );
  const filteredQuestions = currentQuestions?.subjectiveQuestions.filter(
    (x) => {
      if (selectedType !== QuestionType.McqQues) {
        if (selectedType === QuestionType.AllQues) return x;
        if ((x.type as unknown) === selectedType.type) {
          return x;
        }
      }
    }
  );

  useEffect(() => {
    const questions: {
      element: any;
      type: any;
    }[] = [];
    if (
      currentQuestions &&
      (selectedType === QuestionType.McqQues ||
        selectedType === QuestionType.AllQues)
    ) {
      const mcqquestions: {
        element: any;
        type: QuestionType;
      }[] = currentQuestions.mcqQuestions.map((x: any, index) => {
        return {
          element: (
            <QuizCard
              question={x}
              disabled={false}
              onLoginClick={() => {}}
              key={x._id}
              index={index + 1}
            />
          ),
          type: QuestionType.McqQues,
        };
      });
      questions.push(...mcqquestions);
    }
    if (filteredQuestions) {
      const subjectiveQuestions: {
        element: any;
        type: QuestionType;
      }[] = filteredQuestions.map((x: any, index) => {
        return {
          element: (
            <QuestionCard
              no={
                currentQuestions &&
                (selectedType === QuestionType.McqQues ||
                  selectedType === QuestionType.AllQues)
                  ? currentQuestions.mcqQuestions.length + 1 + index
                  : index + 1
              }
              question={x}
              disabled={false}
              onLoginClick={() => {}}
              key={x._id}
            />
          ),
          type: QuestionType.LongQues,
        };
      });
      questions.push(...subjectiveQuestions);
    }
    setAllVirtualizedQuestions(questions);
  }, [filteredQuestions, currentQuestions, selectedType]);

  return (
    <div
      style={{
        width: "100%",
        paddingBottom: 10,
        marginTop: "20px",
      }}
      // pb={50}
    >
      <Container size="md" fluid={isMd} w="100%">
        <div
          style={{
            width: "100%",
            // border:'red solid 1px',
          }}
        >
          <Container
            py={isMd ? 10 : 30}
            style={{
              position: "sticky",
              top: isMd ? "0px" : "10px",
              zIndex: 9,
              background: "white",
              // border:'red solid 1px',
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              // width:'100%'
            }}
            size="md"
            fluid={isMd}
            w="100%"
          >
            <Menu
              shadow="md"
              width={"200px"}
              styles={{
                dropdown: {
                  marginLeft: 20,
                },
              }}
            >
              <Menu.Target>
                {/* <> */}
                <Button
                  // w={"140px"}
                  // radius={8}
                  ta={"left"}
                  variant="subtle"
                  // sx={{
                  //   display: "flex",
                  //   justifyContent: "space-between",
                  //   alignItems: "center",
                  //   background: "transparent",

                  //   position: "relative",
                  // }}
                  // ml={"-20px"}
                  // rightIcon={}
                  c="#000000"
                  fw={600}
                  fz={18}
                  // l={<IconDown />}
                  rightIcon={<IconDown />}
                  onClick={() => {
                    Mixpanel.track(
                      WebAppEvents.TEACHER_APP_LEARN_PAGE_TEST_SECTION_FILTER_DROPDOWN_CLICKED
                    );
                  }}
                >
                  {/* <span style={{ color: "black", fontSize: "18px" }}> */}
                  {selectedType.name}
                  {/* </span> */}
                </Button>
                {/* </> */}
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Item>
                  <Text
                    color={selectedType === QuestionType.AllQues ? "blue" : ""}
                    onClick={() => {
                      Mixpanel.track(
                        WebAppEvents.TEACHER_APP_PRACTICE_PAGE_QUESTION_FILTER_CLICKED,
                        { questionType: QuestionType.AllQues.name }
                      );
                      setSelectedType(QuestionType.AllQues);
                    }}
                  >
                    All Questions
                  </Text>
                </Menu.Item>
                <Menu.Item
                  color={selectedType === QuestionType.McqQues ? "blue" : ""}
                  onClick={() => {
                    Mixpanel.track(
                      WebAppEvents.TEACHER_APP_PRACTICE_PAGE_QUESTION_FILTER_CLICKED,
                      { questionType: QuestionType.McqQues.name }
                    );
                    setSelectedType(QuestionType.McqQues);
                  }}
                >
                  Multiple Choice Questions
                </Menu.Item>
                <Menu.Item
                  color={selectedType === QuestionType.ShortQues ? "blue" : ""}
                  onClick={() => {
                    Mixpanel.track(
                      WebAppEvents.TEACHER_APP_PRACTICE_PAGE_QUESTION_FILTER_CLICKED,
                      { questionType: QuestionType.ShortQues.name }
                    );
                    setSelectedType(QuestionType.ShortQues);
                  }}
                >
                  Short Answer Type
                </Menu.Item>
                <Menu.Item
                  color={selectedType === QuestionType.LongQues ? "blue" : ""}
                  onClick={() => {
                    Mixpanel.track(
                      WebAppEvents.TEACHER_APP_PRACTICE_PAGE_QUESTION_FILTER_CLICKED,
                      { questionType: QuestionType.LongQues.name }
                    );
                    setSelectedType(QuestionType.LongQues);
                  }}
                >
                  Long Answer Type
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
            {selectedAddType === null && (
              <Menu
                // offset={50}
                styles={{
                  dropdown: {
                    marginRight: 20,
                  },
                }}
              >
                <Menu.Target>
                  <Button
                    size={isMd ? "xs" : "md"}
                    bg="#4B65F6"
                    sx={{
                      "&:hover": {
                        backgroundColor: "#3C51C5",
                      },
                    }}
                    onClick={() => {
                      Mixpanel.track(
                        WebAppEvents.TEACHER_APP_PRACTICE_PAGE_ADD_QUESTION_CLICKED
                      );
                    }}
                    mr={20}
                  >
                    Add Questions
                  </Button>
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Item
                    onClick={() => {
                      setSelectedAddType(QuestionType.McqQues);
                      Mixpanel.track(
                        WebAppEvents.TEACHER_APP_PRACTICE_PAGE_QUESTION_TYPE_SELECTED,
                        { questionType: QuestionType.McqQues.name }
                      );
                    }}
                  >
                    {QuestionType.McqQues.name}{" "}
                  </Menu.Item>
                  <Menu.Item
                    onClick={() => {
                      setSelectedAddType(QuestionType.ShortQues);
                      Mixpanel.track(
                        WebAppEvents.TEACHER_APP_PRACTICE_PAGE_QUESTION_TYPE_SELECTED,
                        { questionType: QuestionType.ShortQues.name }
                      );
                    }}
                  >
                    {QuestionType.ShortQues.name}{" "}
                  </Menu.Item>
                  <Menu.Item
                    onClick={() => {
                      setSelectedAddType(QuestionType.LongQues);
                      Mixpanel.track(
                        WebAppEvents.TEACHER_APP_PRACTICE_PAGE_QUESTION_TYPE_SELECTED,
                        { questionType: QuestionType.LongQues.name }
                      );
                    }}
                  >
                    {QuestionType.LongQues.name}{" "}
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            )}
          </Container>
          <Stack
            px={5}

            // mt={70}
          >
            <div
              style={{
                width: "100%",
                height: "calc(100vh - 200px)",
              }}
            >
              <AutoSizer>
                {(props) => (
                  <>
                    <List
                      width={props.width}
                      height={props.height}
                      rowHeight={cache.current.rowHeight}
                      deferredMeasurementCache={cache.current}
                      rowCount={allVirtualizedQuestions.length ?? 0}
                      rowRenderer={({ key, index, style, parent }) => {
                        const x = allVirtualizedQuestions[index];
                        return (
                          <CellMeasurer
                            key={key}
                            cache={cache.current}
                            parent={parent}
                            rowIndex={index}
                            columnIndex={0}
                          >
                            {({ measure }) => (
                              <div style={style}>
                                <ResizeObserver onResize={measure}>
                                  {x.element}
                                </ResizeObserver>
                              </div>
                            )}
                          </CellMeasurer>
                        );
                      }}
                    />
                  </>
                )}
              </AutoSizer>
            </div>
          </Stack>
        </div>
      </Container>
      <Modal
        opened={selectedAddType !== null}
        onClose={() => {
          setSelectedAddType(null);
        }}
      >
        {selectedAddType === QuestionType.McqQues &&
          props.chapter &&
          currentQuestions && (
            <AddQuizQuestion
              onUpdateTopic={topicQuestionsUpdate}
              setLoadingData={props.setLoadingData}
              setSelectedAddType={setSelectedAddType}
              currentChapter={props.chapter}
              currentChapterQuestions={currentQuestions}
            />
          )}
        {selectedAddType !== QuestionType.McqQues &&
          props.chapter &&
          currentQuestions &&
          selectedAddType !== null && (
            <AddSubjectiveQuestion
              onUpdateTopic={topicQuestionsUpdate}
              setLoadingData={props.setLoadingData}
              setSelectedAddType={setSelectedAddType}
              currentChapter={props.chapter}
              currentChapterQuestions={currentQuestions}
              selectedQuestionType={selectedAddType}
            />
          )}
      </Modal>
      <Modal
        opened={isPlaySimulation}
        onClose={() => {
          // setPlaySimulation(null);
          // navigate("/allsimualtions");
        }}
        withCloseButton={false}
        closeOnClickOutside={false}
        // lockScroll
        styles={{
          inner: {
            padding: 0,
            margin: 0,
            // border:'blue solid 1px'
          },
          root: {
            padding: 0,
            margin: 0,
            // border:'violet solid 1px'
          },
          modal: {
            // border:'violet solid 1px',
            padding: 0,
            margin: 0,
          },
        }}
        // size="xl"
        size="auto"
        m={0}
        padding={0}
        lockScroll
        // centered
        fullScreen
      >
        <CanvasDraw
          onCloseClick={() => {
            Mixpanel.track(
              WebAppEvents.TEACHER_APP_LEARN_PAGE_CLOSE_SIMULATION_CLICKED
            );
            // navigate.
            setIsPlaySimulation(false);
            // navigate(-1);
          }}
          simulation={{
            name: "Mega Simulation",
            _id: "",
          }}
        >
          <Center
            style={{
              height: "100%",
              width: "100%",
              // border:'red solid 1px'
            }}
          >
            <ContentSimulation
              simulationId={""}
              chapterId={props.chapter._id}
            />
          </Center>
        </CanvasDraw>
      </Modal>
    </div>
  );
}
