import {
  Box,
  Button,
  Center,
  Divider,
  Flex,
  Stack,
  Text,
  createStyles,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import {
  IconAdjustments,
  IconAdjustmentsHorizontal,
  IconChevronLeft,
  IconPlus,
  IconUpload,
} from "@tabler/icons";
import ResizeObserver from "rc-resize-observer";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  AutoSizer,
  CellMeasurer,
  CellMeasurerCache,
  List,
} from "react-virtualized";
import {
  DifficultyLevel,
  QuestionParentType,
  QuestionType,
  findQuestionType,
} from "../../../@types/QuestionTypes.d";
import {
  fetchChapterQuestions,
  removeChapterQuestion,
} from "../../../features/UserSubject/chapterDataSlice";
import {
  CaseBasedQuestionCard,
  MCQquestionCard,
  SubjectivequestionCard,
} from "../../../pages/_New/PersonalizedTestQuestions";
import { AppDispatch, RootState } from "../../../store/ReduxStore";
import { chapterQuestions } from "../../../store/chapterQuestionsSlice";
import { chapter } from "../../../store/chapterSlice";
import { CreateQuestions } from "./Modals/CreateQuestions";
import { addQuestionsToChapter } from "../../../features/userChapter/userChapterSlice";
import { WordUploadModal } from "../../../pages/_New/TestModals/WordUpload";
import { FilterModal } from "./Modals/FilterModal";
import { FilterMobileModal } from "./Modals/FilterMobileModal";
import {
  updateCaseBasedQuestion,
  updateObjectiveQuestion,
  updateSubjectiveQuestion,
} from "../../../features/test/QuestionSlice";
import { showNotification } from "@mantine/notifications";
import { UserType } from "../../AdminPage/DashBoard/InstituteBatchesSection";
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

interface TestPageProps {
  chapterId: string;
  userType: UserType;
  onBackClick: () => void;
  setLoadingData: (val: boolean) => void;
}

export default function TestPage2(props: TestPageProps) {
  const { theme } = useStyles();
  const isMd = useMediaQuery(`(max-width: ${theme.breakpoints.md}px)`);
  const [isAddNewQuestion, setIsAddNewQuestion] = useState<boolean>(false);
  const [allVirtualizedQuestions, setAllVirtualizedQuestions] = useState<
    {
      element: any;
      type: QuestionType;
    }[]
  >([]);
  const [isAddFromWordClicked, setIsAddFromWordClicked] =
    useState<boolean>(false);
  const [isFiltersModalOpened, setIsFiltersModalOpened] =
    useState<boolean>(false);
  const [wordFile, setWordFile] = useState<any>(null);

  const [allQuestins, setAllQuestions] = useState<any[]>([]);
  const [filters, setFilters] = useState<{
    questionType: string[];
    difficultyLevel: string[];
  }>({
    questionType: [],
    difficultyLevel: [],
  });
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  useEffect(() => {
    return () => {
      setAllQuestions([]);
    };
  }, []);

  function addQuestions(questions: any[]) {
    setIsAddNewQuestion(false);
    props.setLoadingData(true);
    addQuestionsToChapter({
      chapterId: props.chapterId,
      questions: questions,
    })
      .then((data: any) => {
        console.log(data);
        fetchQuestions();
        props.setLoadingData(false);
      })
      .catch((error) => {
        console.log(error);
        props.setLoadingData(false);
      });
  }

  function fetchQuestions() {
    props.setLoadingData(true);
    fetchChapterQuestions(props.chapterId, filters)
      .then((data: any) => {
        console.log(data);
        setAllQuestions(data);
        props.setLoadingData(false);
      })
      .catch(() => {
        props.setLoadingData(false);
      });
  }

  useEffect(() => {
    fetchQuestions();
  }, [props.chapterId, filters]);

  useEffect(() => {
    setTimeout(() => {
      if (typeof window?.MathJax !== "undefined") {
        window.MathJax.typesetClear();
        window.MathJax.typeset();
      }
    }, 500);
  }, [currentIndex]);

  const cache = useRef(
    new CellMeasurerCache({
      fixedWidth: true,
      defaultHeight: 100,
    })
  );

  useEffect(() => {
    setTimeout(() => {
      if (typeof window?.MathJax !== "undefined") {
        window.MathJax.typesetClear();
        window.MathJax.typeset();
      }
    }, 500);
  }, [allVirtualizedQuestions, cache]);

  const navigate = useNavigate();

  function updatecaseStudyQuestion(question: CASEtypedQuestion) {
    props.setLoadingData(true);
    updateCaseBasedQuestion({
      id: question._id,
      text: question.caseStudyText,
      questions: question.questions,
      difficultyLevel: question.difficultyLevel,
    })
      .then((x) => {
        props.setLoadingData(false);
        showNotification({
          message: "Question Edited",
        });
        setAllQuestions((prev) => {
          return prev.map((y) => {
            if (y._id === question._id) {
              return x;
            }
            return y;
          });
        });
      })
      .catch((e) => {
        props.setLoadingData(false);

        console.log(e);
      });
  }

  function removequestion(question: any) {
    props.setLoadingData(true);
    removeChapterQuestion({
      chapterId: props.chapterId,
      questionId: question._id,
      type: question.type,
    })
      .then((x) => {
        props.setLoadingData(false);

        showNotification({
          message: "Question Deleted",
        });
        setAllQuestions((prev) => {
          return prev.filter((y) => {
            return y._id !== question._id;
          });
        });
      })
      .catch((e) => {
        props.setLoadingData(false);

        console.log(e);
      });
  }

  function updateobjectiveQuestion(question: MCQTypedQuestion) {
    props.setLoadingData(true);

    updateObjectiveQuestion({
      id: question._id,
      text: question.text,
      answers: question.answers,
      difficultyLevel: question.difficultyLevel,
      totalMarks: question.totalMarks,
      negativeMarks: question.totalNegativeMarks,
      explaination: question.explaination,
    })
      .then((x) => {
        props.setLoadingData(false);

        showNotification({
          message: "Question Edited",
        });
        setAllQuestions((prev) => {
          return prev.map((y) => {
            if (y._id === question._id) {
              return x;
            }
            return y;
          });
        });
      })
      .catch((e) => {
        props.setLoadingData(false);

        console.log(e);
      });
  }

  function updatesubjectiveQuestion(question: SUBjectivetypedQuestion) {
    updateSubjectiveQuestion({
      id: question._id,
      text: question.text,
      answer: question.answer,
      difficultyLevel: question.difficultyLevel,
      totalMarks: question.totalMarks,
      negativeMarks: question.totalNegativeMarks,
      explaination: question.explaination,
    })
      .then((x) => {
        showNotification({
          message: "Question Edited",
        });
        setAllQuestions((prev) => {
          return prev.map((y) => {
            if (y._id === question._id) {
              return x;
            }
            return y;
          });
        });
      })
      .catch((e) => {
        console.log(e);
      });
  }

  useEffect(() => {
    const questions: {
      element: any;
      type: any;
    }[] = [];

    const mcqquestions: {
      element: any;
      type: QuestionType | null;
    }[] = allQuestins.map((x: any, index) => {
      const type = findQuestionType(x.type);
      switch (type?.parentType) {
        case QuestionParentType.MCQQ:
          return {
            element: (
              <Box mb={40} w={isMd ? "95%" : "95%"}>
                <MCQquestionCard
                  question={x}
                  key={x._id}
                  index={index + 1}
                  canBeDeleted={!x.fromQuestionBank}
                  onDeleteClick={() => {
                    removequestion(x);
                  }}
                  onEditClick={(question) => {
                    updateobjectiveQuestion(question);
                  }}
                  testType={""}
                  showBottomBar={!x.fromQuestionBank}
                  hideMarks={x.fromQuestionBank}
                />
              </Box>
            ),
            type: type,
          };
        case QuestionParentType.SUBQ:
          return {
            element: (
              <Box mb={40} w={isMd ? "98%" : "95%"}>
                <SubjectivequestionCard
                  index={index + 1}
                  question={x}
                  canBeDeleted={!x.fromQuestionBank}
                  onDeleteClick={() => {
                    removequestion(x);
                  }}
                  onEditClick={(question) => {
                    updatesubjectiveQuestion(question);
                  }}
                  testType={""}
                  questionType={x.type}
                  showBottomBar={!x.fromQuestionBank}
                  hideMarks={x.fromQuestionBank}
                />
              </Box>
            ),
            type: type,
          };
        case QuestionParentType.CASEQ:
          return {
            element: (
              <Box mb={10} w={isMd ? "98%" : "95%"}>
                <CaseBasedQuestionCard
                  index={index + 1}
                  question={x}
                  canBeDeleted={!x.fromQuestionBank}
                  onDeleteClick={() => {
                    removequestion(x);
                  }}
                  onEditClick={(question) => {
                    updatecaseStudyQuestion(question);
                  }}
                  testType={""}
                  showBottomBar={!x.fromQuestionBank}
                  hideMarks={x.fromQuestionBank}
                />
              </Box>
            ),
            type: type,
          };
        default:
          return {
            element: <div>Not Found</div>,
            type: null,
          };
      }
    });
    questions.push(...mcqquestions);
    setAllVirtualizedQuestions(questions);
  }, [allQuestins]);

  function extractQuestionsFromSections(x: any) {
    console.log(x);
    const questions: any[] = [];
    x.forEach((section: any) => {
      section.questions.forEach((question: any) => {
        questions.push({
          ...question,
        });
      });
    });
    addQuestions(questions);
  }
  function calculateFilters() {
    return filters.difficultyLevel.length + filters.questionType.length;
  }

  return (
    <>
      <Stack px={isMd ? 10 : 60} w={"100%"}>
        <Flex align="center">
          <Box
            onClick={() => {
              props.onBackClick();
            }}
            style={{ cursor: "pointer" }}
            mt={8}
          >
            <IconChevronLeft />
          </Box>
          <Text fw={700} fz={20} ml={10}>
            Question Bank
          </Text>
        </Flex>
        <Divider size="md" />
        <Flex
          align={isMd ? "flex-start" : "center"}
          justify="space-between"
          direction={isMd ? "column" : "row"}
          pl={4}
        >
          <Flex
            align="center"
            gap={15}
            justify={isMd ? "space-between" : "center"}
          >
            <Text fz={19} fw={600}>
              All Questions
            </Text>
            <Flex
              style={{
                borderRadius: 7,
                border: "1px solid #B3B3B3",
                cursor: "pointer",
              }}
              align="center"
              px={25}
              py={8}
              onClick={() => {
                setIsFiltersModalOpened(true);
              }}
            >
              {calculateFilters() === 0 && (
                <IconAdjustmentsHorizontal
                  style={{
                    marginRight: 10,
                  }}
                  color="#B3B3B3"
                />
              )}
              {calculateFilters() !== 0 && (
                <Text
                  style={{
                    background: "#4B65F6",
                    borderRadius: 4,
                  }}
                  px={5}
                  py={1}
                  color="white"
                  mr={10}
                >
                  {calculateFilters()}
                </Text>
              )}
              <Text fz={16} color="#B3B3B3">
                Filters
              </Text>
            </Flex>
          </Flex>

          {props.userType == UserType.OTHERS && (
            <Flex mt={isMd ? 20 : 0}>
              <Button
                leftIcon={<IconUpload color="black" size={isMd ? 15 : 20} />}
                variant="outline"
                size={isMd ? "sm" : "md"}
                radius={20}
                style={{
                  border: "1px solid #808080",
                  color: "black",
                }}
                sx={{}}
                mr={20}
                fw={700}
                onClick={() => {
                  setIsAddFromWordClicked(true);
                }}
              >
                Upload doc
              </Button>
              <Button
                leftIcon={<IconPlus color="black" size={isMd ? 15 : 20} />}
                variant="outline"
                size={isMd ? "sm" : "md"}
                radius={20}
                style={{
                  border: "1px solid #808080",
                  color: "black",
                }}
                sx={{}}
                mr={20}
                fw={700}
                onClick={() => {
                  setIsAddNewQuestion(true);
                }}
              >
                Add Question
              </Button>
            </Flex>
          )}
        </Flex>
        <Stack px={5} w="100%">
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
                      setCurrentIndex(index);
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
      </Stack>
      {isAddNewQuestion && (
        <CreateQuestions
          isModalOpened={isAddNewQuestion}
          setisModalOpened={setIsAddNewQuestion}
          onSubmit={(data) => {
            addQuestions(data);
          }}
        />
      )}
      { isAddFromWordClicked && (
        <WordUploadModal
          isOpened={isAddFromWordClicked}
          onClick={(x) => {
            extractQuestionsFromSections(x);
          }}
          setIsOpened={setIsAddFromWordClicked}
          setloading={props.setLoadingData}
          testName={""}
          setWordFile={setWordFile}
          wordFile={wordFile}
        />
      )}
      {isFiltersModalOpened && !isMd && (
        <FilterModal
          onSubmit={(data) => {
            setFilters(data);
          }}
          filters={filters}
          setisModalOpened={setIsFiltersModalOpened}
          isModalOpened={isFiltersModalOpened}
        />
      )}
      { isFiltersModalOpened && isMd && (
        <FilterMobileModal
          onSubmit={(data) => {
            setFilters(data);
          }}
          filters={filters}
          setisModalOpened={setIsFiltersModalOpened}
          isModalOpened={isFiltersModalOpened}
        />
      )
      }
    </>
  );
}
