import { Box, Center, Flex, Stack, Text } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { useEffect, useState } from "react";
import { IconBackArrow } from "../../../components/_Icons/CustonIcons";
import {
  QuestionParentType,
  QuestionType,
  findQuestionType,
} from "../../../@types/QuestionTypes.d";
import { CaseQuestions, McqQuestion, QuestionCard } from "./SingleParentTest";
import { PdfViewer } from "../../../components/_New/FileUploadBox";
import { fetchReportFromAnswerSheet } from "../../../features/test/AnswerSheetSlice";
import { fetchFullTestWithResults } from "../../../features/test/TestSlice";
import { TestResponse } from "../../../components/_New/TeacherPage new/TestResponse";
import { IconChevronLeft } from "@tabler/icons";

export function ShowAnswersPage(props: {
  answerSheet: any;
  onBackClick: () => void;
  testId: string;
}) {
  const [selectedReport, setSelectedReport] = useState<TestReport | null>(null);
  const [superSections, setSuperSections] = useState<
    {
      name: string;
      sections: any[];
    }[]
  >([]);
  const isMd = useMediaQuery(`(max-width: 820px)`);
  const [subjectiveAnswers, setSubjectiveAnswers] = useState<
    {
      question_id: string;
      marks: number;
    }[]
  >([]);

  useEffect(() => {
    if (selectedReport !== null) {
      let subjectiveAnswers: { question_id: string; marks: number }[] = [];
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
    getStudentReport(props.answerSheet._id);
  }, [props.answerSheet]);
  useEffect(() => {
    fetchFullTestWithResults(props.testId, "RESPONSE")
      .then((data: any) => {
        console.log(data);
        setSuperSections(data.superSections);
        // setAverageTestReport(data.averageTestReport);
        // setTotalStudents(data.totalStudents);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [props.testId]);
  return (
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
      </Flex>
      {selectedReport !== null && (
        <TestResponse
          superSections={superSections}
          testReport={selectedReport}
          totalNumberOfStudents={0}
          subjectiveMarks={subjectiveAnswers}
          subjectiveMarksChange={() => {}}
        />
      )}
    </Stack>
  );
}
