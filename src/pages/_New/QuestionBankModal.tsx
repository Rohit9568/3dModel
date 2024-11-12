import {
  Box,
  Button,
  Checkbox,
  Flex,
  LoadingOverlay,
  Modal,
  MultiSelect,
  NumberInput,
  Select,
  Stack,
  Text,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  DifficultyLevel,
  DifficultyLevelValues,
  QuestionParentType,
  QuestionType,
  findQuestionType,
} from "../../@types/QuestionTypes.d";
import {
  fetchClassAndSubjectList,
  fetchCurrentSubjectData,
  runMultipleCallsforSubjectData,
} from "../../features/UserSubject/TeacherSubjectSlice";
import { fetchTestChaptersQuestions } from "../../features/UserSubject/chapterDataSlice";
import { RootState } from "../../store/ReduxStore";
import {
  CaseBasedQuestionCard,
  MCQquestionCard,
  SubjectivequestionCard,
} from "./PersonalizedTestQuestions";
import { subjects } from "../../store/subjectsSlice";
import {
  AutoSizer,
  CellMeasurer,
  CellMeasurerCache,
  List,
} from "react-virtualized";
import ResizeObserver from "rc-resize-observer";
import { ScheduleToggle } from "../../components/utils/ScheduleToggle";
import AIModal from "./TestModals/AIModal";
const subjectsActions = subjects.actions;

export function QuestionBankModal(props: {
  type: string;
  setLoadingData: (val: boolean) => void;
  isOpened: boolean;
  setOpened: (val: boolean) => void;
  onSubmitClick: (val: any) => void;
}) {
  const [value, setValue] = useState<any[]>([]);
  const [chapters, setChapters] = useState<string[]>([]);
  const [isModalOpened, setIsModalOpened] = useState<boolean>(false);
  const [allQuestions, setAllQuestions] = useState<any[]>([]);
  const userSubjects = useSelector<RootState, UserClassAndSubjects[]>(
    (state) => {
      return state.subjectSlice.userSubjects;
    }
  );
  const [classesWithSubjects, setClassesWithSubjects] = useState<
    {
      value: string;
      label: string;
    }[]
  >([]);
  const [allVirtualizedQuestions, setAllVirtualizedQuestions] = useState<any[]>(
    []
  );
  const [chapterList, setChapterList] = useState<
    { value: string; label: string }[]
  >([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isManualSelection, setIsManualSelection] = useState<boolean>(false);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [selecteddifficultyLevel, setSelecteddifficultyLevel] = useState<
    string[]
  >([DifficultyLevel.MEDIUM]);
  const [noOfQUstions, setNoofquestions] = useState<number>(0);

  useEffect(() => {
    const allsubs: {
      value: string;
      label: string;
    }[] = [];
    if (userSubjects.length > 0) {
      userSubjects.map((class1) => {
        class1.subjects.map((sub) => {
          allsubs.push({
            value: sub._id,
            label: `${class1.className} ${sub.name}`,
          });
        });
      });
    }
    setClassesWithSubjects(allsubs);
  }, [userSubjects]);

  const isMd = useMediaQuery("min-width: 768px");
  function fetchQuestions() {
    setIsLoading(true);
    fetchTestChaptersQuestions(chapters, [props.type], null, undefined)
      .then((data: any) => {
        console.log(data);
        setAllQuestions(data);
        setIsModalOpened(true);
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
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
    }[] = allQuestions.map((x: any, index) => {
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
                  canBeDeleted={false}
                  onDeleteClick={() => {}}
                  onEditClick={(question) => {}}
                  testType={""}
                  showBottomBar={false}
                  hideMarks={true}
                />
              </Box>
            ),
            type: type,
            question: x,
          };
        case QuestionParentType.SUBQ:
          return {
            element: (
              <Box mb={40} w={isMd ? "98%" : "95%"}>
                <SubjectivequestionCard
                  index={index + 1}
                  question={x}
                  canBeDeleted={false}
                  onDeleteClick={() => {}}
                  onEditClick={(question) => {}}
                  testType={""}
                  questionType={x.type}
                  showBottomBar={false}
                  hideMarks={true}
                />
              </Box>
            ),
            type: type,
            question: x,
          };
        case QuestionParentType.CASEQ:
          return {
            element: (
              <Box mb={10} w={isMd ? "98%" : "95%"}>
                <CaseBasedQuestionCard
                  index={index + 1}
                  question={x}
                  canBeDeleted={false}
                  onDeleteClick={() => {}}
                  onEditClick={(question) => {}}
                  testType={""}
                  showBottomBar={false}
                  hideMarks={true}
                />
              </Box>
            ),
            type: type,
            question: x,
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
  }, [allQuestions]);

  const dispatch = useDispatch();

  function fetchList() {
    // setLoading(true);
    fetchClassAndSubjectList()
      .then((data: any) => {
        const fetchedData: UserSubjectAPI[] = data;
        const segregatedData: UserClassAndSubjects[] = [];
        fetchedData.forEach((subject) => {
          const subjectEntry = {
            _id: subject._id,
            name: subject.name,
            chaptersCount: subject.chaptersCount,
            subjectId: subject.subjectId,
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
              grade: subject.classgrade,
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

        setIsLoading(false);
      })
      .catch((error) => {
        setIsLoading(false);
        console.log(error);
      });
  }

  useEffect(() => {
    if (userSubjects.length < 1) fetchList();
  }, []);
  const cache = useRef(
    new CellMeasurerCache({
      fixedWidth: true,
      defaultHeight: 100,
    })
  );
  function getAIquestions() {
    props.setLoadingData(true);
    fetchTestChaptersQuestions(
      chapters,
      [props.type],
      noOfQUstions,
      selecteddifficultyLevel
    )
      .then((data: any) => {
        console.log(data);
        props.setLoadingData(false);

        const questions: any[] = data.map((x: any) => {
          return {
            ...x,
            totalMarks: x.totalMarks === 0 ? 1 : x.totalMarks,
          };
        });
        props.onSubmitClick(questions);
      })
      .catch((err) => {
        console.log(err);
        props.setLoadingData(false);
      });
  }

  useEffect(() => {
    if (selectedSubjects.length > 0) {
      runMultipleCallsforSubjectData({ subjects: selectedSubjects })
        .then((x) => {
          console.log(x);
          const chapters1: { value: string; label: string }[] = [];
          x.map((y: any) => {
            y.userChapters.map((z: any) => {
              chapters1.push({ value: z._id, label: z.name });
            });
          });
          setChapterList(chapters1);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      setChapterList([]);
    }
  }, [selectedSubjects]);
  return (
    <>
      <LoadingOverlay visible={isLoading} />
      <Modal
        opened={props.isOpened && !isModalOpened}
        onClose={() => {
          props.setOpened(false);
        }}
        centered
        title="Select Questions"
      >
        <Stack>
          <ScheduleToggle
            isFirstEnabled={isManualSelection}
            setisFirstEnabled={setIsManualSelection}
            firstLabel="Manual Selection"
            secondLabel="Auto Selection"
          />
          <MultiSelect
            placeholder="Select Subject"
            data={classesWithSubjects}
            styles={{
              label: {
                fontSize: 16,
                marginBottom: 4,
              },
            }}
            value={selectedSubjects}
            onChange={(value) => {
              setSelectedSubjects(value);
            }}
            style={{
              maxWidth: "100%",
            }}
            label="Select Subject:"
          />
          <MultiSelect
            label="Select Chapters:"
            placeholder="Select Chapters"
            data={chapterList}
            value={chapters}
            onChange={(value) => {
              setChapters(value);
            }}
            styles={{
              label: {
                fontSize: 16,
                marginBottom: 4,
              },
              input: {
                overflowY: "scroll",
                maxHeight: "100px",
                maxWidth: "100%",
              },
              rightSection: {
                display: "none",
              },
            }}
            mt={5}
          />
          {!isManualSelection && (
            <Stack>
              <NumberInput
                value={noOfQUstions}
                onChange={(val) => {
                  setNoofquestions(val ?? 0);
                }}
                styles={{
                  label: {
                    fontSize: 16,
                    marginBottom: 4,
                  },
                }}
                label="No of Questions:"
                min={1}
              />
              <MultiSelect
                value={selecteddifficultyLevel}
                data={DifficultyLevelValues}
                onChange={(val) => {
                  if (val) setSelecteddifficultyLevel(val);
                }}
                style={{
                  maxWidth: "50%",
                }}
                styles={{
                  label: {
                    fontSize: 16,
                    marginBottom: 4,
                  },
                }}
                label="Select Difficulty Level:"
              />
            </Stack>
          )}
          <Flex justify="right">
            <Button
              bg="#4B65F6"
              style={{ borderRadius: "24px" }}
              size="lg"
              onClick={() => {
                if (!isManualSelection) getAIquestions();
                else {
                  fetchQuestions();
                }
              }}
              sx={{
                "&:hover": {
                  backgroundColor: "#3C51C5",
                },
              }}
              my={10}
              disabled={chapters.length === 0}
            >
              Generate Questions
            </Button>
          </Flex>
        </Stack>
      </Modal>
      <Modal
        opened={isModalOpened}
        onClose={() => {
          setIsModalOpened(false);
        }}
        size="xl"
        title="Question Bank"
        styles={{
          title: {
            fontSize: 25,
            fontWeight: 600,
          },
        }}
        centered
      >
        <Stack
          style={{
            height: "calc(100vh - 250px)",
          }}
        >
          <Checkbox.Group value={value} onChange={setValue}>
            <Stack px={5} w="100%">
              <div
                style={{
                  width: "100%",
                  height: "calc(100vh - 300px)",
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
                                    <Flex
                                      w="100%"
                                      align="center"
                                      onClick={() => {
                                        if (value.includes(x.question._id)) {
                                          setValue((prev) => {
                                            return prev.filter(
                                              (y) => y !== x.question._id
                                            );
                                          });
                                        } else {
                                          setValue((prev) => {
                                            return [...prev, x.question._id];
                                          });
                                        }
                                      }}
                                      style={{
                                        cursor: "pointer",
                                      }}
                                      justify="space-between"
                                    >
                                      <Checkbox
                                        value={x.question._id}
                                        w="5%"
                                        ta="center"
                                        pl={10}
                                      />
                                      {x.element}
                                    </Flex>
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
          </Checkbox.Group>
          <Flex
            justify="center"
            mt={10}
            style={{
              position: "fixed",
              right: 0,
              bottom: 0,
            }}
            py={10}
            pr={5}
          >
            <Button
              size="md"
              onClick={() => {
                const selectedQuestions = allQuestions.filter((x) =>
                  value.includes(x._id)
                );
                props.onSubmitClick(selectedQuestions);
              }}
              bg="#3174F3"
              disabled={value.length === 0}
            >
              Add Selected Questions
            </Button>
          </Flex>
        </Stack>
      </Modal>
    </>
  );
}
