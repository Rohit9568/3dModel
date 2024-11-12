import {
  Button,
  Flex,
  Loader,
  MultiSelect,
  NumberInput,
  Select,
  Stack,
  Text,
} from "@mantine/core";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  DifficultyLevel,
  DifficultyLevelValues,
  QuestionType,
  allDifficultyLevels,
  allQuestionTypesValues,
  findQuestionType,
} from "../../../@types/QuestionTypes.d";
import {
  fetchClassAndSubjectList,
  fetchCurrentSubjectData,
  runMultipleCallsforSubjectData,
} from "../../../features/UserSubject/TeacherSubjectSlice";
import { fetchTestChaptersQuestions } from "../../../features/UserSubject/chapterDataSlice";
import { RootState } from "../../../store/ReduxStore";
import { subjects } from "../../../store/subjectsSlice";
import { Template, TestStep } from "../PersonalizedTest";
const subjectsActions = subjects.actions;

const AIModal = (props: {
  isModalOpened: boolean;
  setsections: (val: React.SetStateAction<TestSection[]>) => void;
  onClose: () => void;
  setTestStep: (val: React.SetStateAction<TestStep>) => void;
  setloading: (val: boolean) => void;
  setSuperSections: (state: React.SetStateAction<SuperSection[]>) => void;
}) => {
  const [chapterList, setChapterList] = useState<
    { value: string; label: string }[]
  >([]);

  const [chapters, setSelectedChapters] = useState<string[]>([]);

  const [selectedChapternames, setselectedChaptersName] = useState<string[]>(
    []
  );
  const [noOfQUstions, setNoofquestions] = useState<number>(0);
  const [eachSectionmaks, seteachQuestionMark] = useState<number>(0);
  const [eachSectionNegativemarks, setEachSectionNegativeMarks] =
    useState<number>(0);
  const [selectedSectionType, setSelectedSectionType] = useState<string>(
    QuestionType.McqQues.type
  );
  const [isLoading, setIsLoading] = useState(false);
  const [selecteddifficultyLevel, setSelecteddifficultyLevel] = useState<
    string[]
  >([DifficultyLevel.MEDIUM]);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [classesWithSubjects, setClassesWithSubjects] = useState<
    {
      value: string;
      label: string;
    }[]
  >([]);

  const userSubjects = useSelector<RootState, UserClassAndSubjects[]>(
    (state) => {
      return state.subjectSlice.userSubjects;
    }
  );
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
  function setQuestionsToSections(
    name: string,
    type: string,
    questions: (
      | SUBjectivetypedQuestion
      | CASEtypedQuestion
      | MCQTypedQuestion
    )[]
  ) {
    const sectionIds: string[] = [];
    props.setsections((prev) => {
      const prev1 = [...prev];
      const findIndex = prev1.findIndex((x) => x.type === type);
      if (findIndex === -1) {
        sectionIds.push(`SEC-${prev1.length + 1}`);
        prev1.push({
          sectionName: name,
          questions: [...questions],
          type: type,
          sectionMarks: eachSectionmaks,
          totalNegativeMarks: eachSectionNegativemarks,
          _id: `SEC-${prev1.length + 1}`,
          isAddNewQuestion: false,
          showOptions: false,
        });
      } else {
        prev1[findIndex].questions.push(...questions);
      }
      return prev1;
    });
    props.setSuperSections((prev) => {
      const prev1 = [...prev];
      prev1.push({ name: name, sections: sectionIds, totalTime: "0" });
      return prev1;
    });
    props.setTestStep(TestStep.EditQuestions);
  }

  function getAIquestions(template: Template) {
    props.setloading(true);
    
    if(selecteddifficultyLevel.indexOf(DifficultyLevel.MEDIUM.toString())==-1){
      selecteddifficultyLevel.push(DifficultyLevel.MEDIUM)
    }

    fetchTestChaptersQuestions(
      chapters,
      [selectedSectionType],
      noOfQUstions,
      selecteddifficultyLevel
    )
      .then((data: any) => {
        console.log(data);
        props.setloading(false);

        const questions: any[] = data.map((x: any) => {
          return {
            ...x,
            totalMarks: x.totalMarks === 0 ? 1 : x.totalMarks,
          };
        });
        setQuestionsToSections(
          findQuestionType(selectedSectionType).name,
          findQuestionType(selectedSectionType).type,
          questions
        );
        props.setTestStep(TestStep.EditQuestions);
      })
      .catch((err) => {
        console.log(err);
        props.setloading(false);
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

  const isButtonDisabled = () => {
    return (
      noOfQUstions === 0 ||
      (chapters.length === 0 &&
        selectedSubjects.length === 0 &&
        selectedSectionType === "" &&
        selecteddifficultyLevel.length === 0)
    );
  };

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
  return (
    <>
      {!isLoading && (
        <Stack>
          <Flex align="center" justify="space-between">
            <Text>Select Subject:</Text>

            <MultiSelect
              placeholder="Select Subject"
              data={classesWithSubjects}
              styles={{
                label: {
                  fontSize: 16,
                  marginBottom: 4,
                },
              }}
              //   w={isMd ? "40vw" : 190}
              value={selectedSubjects}
              onChange={(value) => {
                setSelectedSubjects(value);
              }}
              style={{
                maxWidth: "70%",
              }}
            />
          </Flex>

          <Flex align="center" justify="space-between">
            <Text>Select Question Type:</Text>
            <Select
              value={selectedSectionType}
              data={allQuestionTypesValues}
              onChange={(val) => {
                if (val) setSelectedSectionType(val);
              }}
            />
          </Flex>
          <Flex align="center" justify="space-between">
            <Text>Difficulty Level:</Text>
            <MultiSelect
              value={selecteddifficultyLevel}
              data={DifficultyLevelValues}
              onChange={(val) => {
                if (val) setSelecteddifficultyLevel(val);
              }}
              style={{
                maxWidth: "50%",
              }}
            />
          </Flex>
          <Flex align="center" justify="space-between">
            <Text>No of Questions:</Text>
            <NumberInput
              value={noOfQUstions}
              onChange={(val) => {
                setNoofquestions(val ?? 0);
              }}
              min={1}
            />
          </Flex>

          <MultiSelect
            label="Select Chapter"
            placeholder="Select Chapter"
            data={chapterList}
            value={chapters}
            onChange={(value) => {
              const comonElements = chapterList
                .filter((x) => value.includes(x.value))
                .map((x) => x.label);
              setSelectedChapters(value);
              setselectedChaptersName(comonElements);
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
          <Flex justify="right">
            <Button
              bg="#4B65F6"
              style={{ borderRadius: "24px" }}
              size="lg"
              onClick={() => {
                props.onClose();
                getAIquestions(Template.GenerateUsingAI);
              }}
              sx={{
                "&:hover": {
                  backgroundColor: "#3C51C5",
                },
              }}
              my={10}
              disabled={isButtonDisabled()}
            >
              Generate Questions
            </Button>
          </Flex>
        </Stack>
      )}
      {isLoading && (
        <Flex justify="center">
          <Loader />
        </Flex>
      )}
    </>
  );
};

export default AIModal;
