import { useMediaQuery } from "@mantine/hooks";
import { useEffect, useState } from "react";
import {
  fetchReportFromAnswerSheet,
  submitUpdatedSubjectiveAnswers,
} from "../../../features/test/AnswerSheetSlice";
import { fetchFullTestWithResults } from "../../../features/test/TestSlice";
import { Flex, LoadingOverlay, Select, Stack, Text } from "@mantine/core";
import { IconChevronLeft } from "@tabler/icons";
import { TestResponse } from "./TestResponse";
import {
  QuestionParentType,
  findQuestionType,
} from "../../../@types/QuestionTypes.d";

export function TeacherSideResponses(props: {
  testId: string;
  onBackClick: () => void;
}) {
  const isMd = useMediaQuery(`(max-width: 820px)`);
  const [studentsWithAnswerSheet, setStudentsWithAnswerSheetId] = useState<
    {
      label: string;
      value: string;
    }[]
  >([]);
  const [superSections, setSuperSections] = useState<
    {
      name: string;
      sections: any[];
    }[]
  >([]);
  const [selectedAnswerSheetId, setSelectedAnswerSheetId] = useState<
    string | null
  >(null);
  const [selectedReport, setSelectedReport] = useState<TestReport | null>(null);
  const [subjectiveAnswers, setSubjectiveAnswers] = useState<
    {
      question_id: string;
      marks: number;
    }[]
  >([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const submitClickHandler = async () => {
    setIsLoading(true);
    submitUpdatedSubjectiveAnswers(selectedAnswerSheetId!!, subjectiveAnswers)
      .then((x) => {
        console.log(x);
        setIsLoading(false);
        props.onBackClick();
      })
      .catch((e) => {
        setIsLoading(false);
        console.log(e);
      });
  };

  useEffect(() => {
    if (selectedReport !== null) {
      let subjectiveAnswers: { question_id: string; marks: number }[] = [];
      console.log(selectedReport);
      selectedReport.sectionWiseDetails.forEach((section) => {
        section.questions.forEach((question) => {
          if (question.type === QuestionParentType.SUBQ)
            subjectiveAnswers.push({
              question_id: question.question_id,
              marks: question.marksObtained,
            });
        });
      });
      setSubjectiveAnswers(subjectiveAnswers);
    }
  }, [selectedReport]);

  function subjectiveMarksChange(question_id: string, marks: number) {
    setSubjectiveAnswers(
      subjectiveAnswers.map((answer) => {
        if (answer.question_id === question_id) {
          return {
            question_id: question_id,
            marks: marks,
          };
        }
        return answer;
      })
    );
  }

  function getStudentReport(id: string) {
    fetchReportFromAnswerSheet(id)
      .then((x: any) => {
        setSelectedReport(x.fullAnswerSheet.testReportId);
      })
      .catch((e) => {
        console.log(e);
      });
  }
  useEffect(() => {
    if (selectedAnswerSheetId !== null) getStudentReport(selectedAnswerSheetId);
  }, [selectedAnswerSheetId]);
  useEffect(() => {
    fetchFullTestWithResults(props.testId, "RESPONSE")
      .then((data: any) => {
        console.log(data);
        setSuperSections(data.superSections);
        const value: any = data.studentsWithAnswerSheets.map((student: any) => {
          return {
            label: student.name,
            value: student.answerSheetId,
          };
        });
        setStudentsWithAnswerSheetId([...value]);
        if (value.length > 0) setSelectedAnswerSheetId(value[0].value);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [props.testId]);
  return (
    <>
      <LoadingOverlay visible={isLoading} />
      <Stack w="100%" align="center" mb={80}>
        <Flex justify="space-between" align="center" w="100%">
          <Flex align="center">
            <IconChevronLeft
              onClick={props.onBackClick}
              size={30}
              style={{
                cursor: "pointer",
                marginRight: 10,
              }}
            />
            <Text fz={isMd ? 24 : 36} fw={700}>
              Response
            </Text>
          </Flex>
          <Select
            data={studentsWithAnswerSheet}
            placeholder="Select Student"
            style={{
              width: isMd ? "150px" : "200px",
            }}
            value={selectedAnswerSheetId}
            onChange={(value) => {
              setSelectedAnswerSheetId(value!!);
            }}
          />
        </Flex>
        {selectedReport !== null && (
          <TestResponse // here is teacher response
            superSections={superSections}
            testReport={selectedReport}
            totalNumberOfStudents={studentsWithAnswerSheet.length - 1}
            subjectiveMarksChange={subjectiveMarksChange}
            subjectiveMarks={subjectiveAnswers}
            onSubmitClick={submitClickHandler}
          />
        )}
      </Stack>
    </>
  );
}
