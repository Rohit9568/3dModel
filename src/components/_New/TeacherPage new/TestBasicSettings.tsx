import {
  Button,
  Flex,
  Grid,
  Group,
  MultiSelect,
  NumberInput,
  Select,
  Stack,
  Text,
  TextInput,
  createStyles,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { DropDownMenu, TestDeatils } from "../ContentTest";
import { Mixpanel } from "../../../utilities/Mixpanel/MixpanelHelper";
import { WebAppEvents } from "../../../utilities/Mixpanel/AnalyticeEventWebApp";
import { QuestionType } from "../../../@types/QuestionTypes.d";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../store/ReduxStore";
import { useEffect, useState } from "react";
import { fetchClassList } from "../../../features/classes/classSlice";
import {
  fetchClassAndSubjectList,
  fetchCurrentSubjectData,
} from "../../../features/UserSubject/TeacherSubjectSlice";
import { subjects } from "../../../store/subjectsSlice";
import { cleanString } from "../../../utilities/HelperFunctions";
const subjectsActions = subjects.actions;
const useStyles = createStyles((theme) => ({
  subheadings: {
    fontSize: 16,
    fontWeight: 500,
  },
  subheadingGrey: {
    fontSize: 16,
    fontWeight: 500,
    color: "#525252",
  },
}));
interface TestBasicSettingsProps {
  setIsLoading: (input: boolean) => void;
  testDetails: TestDeatils;
  setTestDetails: any;
  subjectId: string | null;
  setSubjectId: (input: string | null) => void;
  testChapters: string[];
  setTestChapters: (input: string[]) => void;
  onNextClick: () => void;
  setSelectedClass: (val: string | null) => void;
  selectedClass: string | null;
  setselectedClassName: (val: string) => void;
  setselectedSubjectName: (val: string) => void;
  setselectedChaptersName: (val: string[]) => void;
  cbsePaperSelected: boolean;
  setCbsePaperSelected: (val: boolean) => void;
}

const samplePaperSubjects = [
  "Mathematics",
  "Physics",
  "Biology",
  "Chemistry",
  "Science",
];

export function TestBasicSettings(props: TestBasicSettingsProps) {
  const isMd = useMediaQuery(`(max-width: 820px)`);
  const dispatch = useDispatch<AppDispatch>();
  const [chapterList, setChapterList] = useState<
    { value: string; label: string }[]
  >([]);

  const QuestionTypes: QuestionType[] = [
    QuestionType.AllQues,
    QuestionType.McqQues,
    QuestionType.LongQues,
    QuestionType.ShortQues,
    QuestionType.CaseStudyQues,
  ];
  const { classes } = useStyles();
  const userSubjects = useSelector<RootState, UserClassAndSubjects[]>(
    (state) => {
      return state.subjectSlice.userSubjects;
    }
  );
  useEffect(() => {
    if (userSubjects.length < 1) fetchList();
  }, []);
  function fetchList() {
    props.setIsLoading(true);
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

        props.setIsLoading(false);
      })
      .catch((error) => {
        props.setIsLoading(false);
        console.log(error);
      });
  }
  useEffect(() => {
    if (props.subjectId) {
      props.setIsLoading(true);
      fetchCurrentSubjectData({ subject_id: props.subjectId })
        .then((data: any) => {
          setChapterList(
            data.userChapters.map((chapter: any) => {
              return { value: chapter._id, label: chapter.name };
            })
          );
          props.setIsLoading(false);
        })
        .catch((err) => {
          props.setIsLoading(false);
          console.log(err);
        });
    }
  }, [props.subjectId]);

  const paperTypes = [
    {
      value: "CBSE",
      label: "CBSE Board Sample Paper",
    },
    {
      value: "CUSTOM",
      label: "Custom Test",
    },
  ];

  useEffect(() => {
    props.setSelectedClass(null);
  }, [props.cbsePaperSelected]);

  return (
    <>
      <Stack className={classes.subheadingGrey} mt={15} spacing={15}>
        <Text fz={19} c={"black"} mb={-10} fw={700}>
          Test Details
        </Text>
        <Select
          label="Select Template"
          placeholder="Select Template"
          data={paperTypes}
          value={
            props.cbsePaperSelected === false
              ? paperTypes[1].value
              : paperTypes[0].value
          }
          w={isMd ? "40vw" : 190}
          onChange={(value) => {
            if (value && value === "CBSE") props.setCbsePaperSelected(true);
            else props.setCbsePaperSelected(false);
          }}
        />
        <Flex direction={isMd ? "column" : "row"}>
          <Flex>
            <Select
              label="Class"
              placeholder="Select Class"
              value={props.selectedClass}
              data={
                props.cbsePaperSelected === false
                  ? userSubjects.map((sub) => {
                      return { value: sub.classId, label: sub.className };
                    })
                  : userSubjects
                      .map((sub) => {
                        return { value: sub.classId, label: sub.className };
                      })
                      .filter((x) => {
                        return x.label === "Class 10" || x.label === "Class 12";
                      })
              }
              w={isMd ? "40vw" : 190}
              onChange={(value) => {
                const found = userSubjects.find((x) => x.classId === value);
                if (found) props.setselectedClassName(found?.className);
                Mixpanel.track(
                  WebAppEvents.TEACHER_APP_TEST_PAGE_CLASS_SELECTED,
                  {
                    class_id: value,
                  }
                );
                props.setSelectedClass(value);
                props.setSubjectId(null);
                props.setTestChapters([]);
              }}
            />
            <Select
              label="Subject"
              placeholder="Select Subject"
              data={
                props.cbsePaperSelected === false
                  ? userSubjects
                      .find((x) => x.classId === props.selectedClass)
                      ?.subjects.map((sub) => {
                        return { value: sub._id, label: sub.name };
                      }) ?? []
                  : userSubjects
                      .find((x) => x.classId === props.selectedClass)
                      ?.subjects.map((sub) => {
                        return { value: sub._id, label: sub.name };
                      })
                      .filter((x) => samplePaperSubjects.includes(x.label)) ??
                    []
              }
              w={isMd ? "40vw" : 190}
              value={props.subjectId}
              onChange={(value) => {
                const found = userSubjects
                  .find((x) => x.classId === props.selectedClass)
                  ?.subjects.find((sub) => sub._id === value);
                if (found) props.setselectedSubjectName(found?.name);
                Mixpanel.track(
                  WebAppEvents.TEACHER_APP_TEST_PAGE_SUBJECT_SELECTED,
                  {
                    subject_id: value,
                  }
                );
                props.setSubjectId(value);
                props.setTestChapters([]);
              }}
              mx={props.cbsePaperSelected === false ? 10 : 10}
            />
          </Flex>
          {!props.cbsePaperSelected && (
            <MultiSelect
              label="Select Chapter"
              placeholder="Select Chapter"
              data={chapterList}
              value={props.testChapters}
              onChange={(value) => {
                Mixpanel.track(
                  WebAppEvents.TEACHER_APP_TEST_PAGE_CHAPTERS_SELECTED
                );
                // props.setTestChapter(value);
                const comonElements = chapterList
                  .filter((x) => value.includes(x.value))
                  .map((x) => x.label);
                props.setTestChapters(value);
                props.setselectedChaptersName(comonElements);
              }}
              w={isMd ? "84vw" : 350}
              styles={{
                input: {
                  overflowY: "scroll",
                  maxHeight: "100px",
                },
                rightSection: {
                  display: "none",
                },
              }}
              // mt={5}
            />
          )}
        </Flex>
        {!props.cbsePaperSelected && (
          <Select
            label="Select Question Type"
            placeholder="Select Question Type"
            data={QuestionTypes.map((val) => {
              return val.type;
            })}
            value={props.testDetails.questionType}
            w={isMd ? "84vw" : 350}
            onChange={(x) => {
              Mixpanel.track(
                WebAppEvents.TEACHER_APP_TEST_PAGE_QUESTIONS_SELECTED
              );
              props.setTestDetails({
                ...props.testDetails,
                questionType: x || "MCQ",
              });
            }}
          />
        )}
        <Grid>
          <Grid.Col span={isMd ? 5 : 2}>{<Text>Test Name</Text>}</Grid.Col>
          <Grid.Col span={isMd ? 7 : 3}>
            {
              <TextInput
                placeholder="Test Name"
                value={props.testDetails.name}
                onChange={(e) => {
                  Mixpanel.track(
                    WebAppEvents.TEACHER_APP_TEST_PAGE_BASIC_SETTINGS_TEST_NAME_TYPED
                  );
                  props.setTestDetails({
                    ...props.testDetails,
                    name: e.target.value,
                  });
                }}
              ></TextInput>
            }
          </Grid.Col>
        </Grid>
        {!props.cbsePaperSelected && (
          <>
            <Grid>
              <Grid.Col span={isMd ? 5 : 2}>
                {<Text>Max. Questions</Text>}
              </Grid.Col>
              <Grid.Col span={isMd ? 7 : 3}>
                {
                  <NumberInput
                    placeholder="Max. Questions"
                    value={props.testDetails.maxQuestions}
                    onChange={(e) => {
                      Mixpanel.track(
                        WebAppEvents.TEACHER_APP_TEST_PAGE_BASIC_SETTINGS_QUESTION_NUMBER_SELECTED
                      );
                      props.setTestDetails({
                        ...props.testDetails,
                        maxQuestions: e ? e : 0,
                      });
                    }}
                  />
                }
              </Grid.Col>
            </Grid>
            <Grid>
              <Grid.Col span={isMd ? 5 : 2}>{<Text>Max. Marks</Text>}</Grid.Col>
              <Grid.Col span={isMd ? 7 : 3}>
                {
                  <NumberInput
                    placeholder="Max. Marks"
                    value={props.testDetails.maxMarks}
                    onChange={(e) => {
                      Mixpanel.track(
                        WebAppEvents.TEACHER_APP_TEST_PAGE_BASIC_SETTINGS_MAXIMUM_MARKS_SELECTED
                      );
                      props.setTestDetails({
                        ...props.testDetails,
                        maxMarks: e ? e : 0,
                      });
                    }}
                  />
                }
              </Grid.Col>
            </Grid>
          </>
        )}
      </Stack>
    </>
  );
}
