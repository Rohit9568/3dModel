import { Box, Flex, Stack, Text } from "@mantine/core";
import { useEffect, useState } from "react";
import { TestReport } from "../../../components/_New/TeacherPage new/TestReport";
import { fetchReportFromAnswerSheet } from "../../../features/test/AnswerSheetSlice";
import {
  fetchFullTestWithResults,
  getComparativeAnalysisData,
} from "../../../features/test/TestSlice";
import { IconChevronLeft } from "@tabler/icons";
import { useMediaQuery } from "@mantine/hooks";
import { InfoCard } from "../../../components/_New/TeacherPage new/TeacherSideReports";
import { useSelector } from "react-redux";
import { RootState } from "../../../store/ReduxStore";

interface ResultPageProps {
  answerSheetId: string;
  testId: string;
  onBackClick: () => void;
}

export function ResultPage(props: ResultPageProps) {
  const [superSections, setSuperSections] = useState<
    {
      name: string;
      sections: any[];
    }[]
  >([]);
  const isMd = useMediaQuery(`(max-width: 820px)`);

  const [selectedReport, setSelectedReport] = useState<TestReport | null>(null);
  const [avgReport, setAvgReport] = useState<TestReport | null>(null);


  const [test, setTest] = useState<FullTest>();
  const [answerSheet, setAnswerSheet] = useState<any>();


  const [isTestwithOnlyMarks, setisTestwithOnlyMarks] =
    useState<boolean>(false);

  function getStudentReport(id: string) {
    fetchReportFromAnswerSheet(id)
      .then((x: any) => {
        setSelectedReport({
          ...x.fullAnswerSheet.testReportId,
          maxMarks: x.fullAnswerSheet.test_id.maxMarks,
          maxDuration: x.fullAnswerSheet.test_id.duration,
        });
        setAvgReport(x.avgTestReport);
        setAnswerSheet(x.fullAnswerSheet)
      })
      .catch((e) => {
        console.log(e);
      });
  }

  useEffect(() => {
    getStudentReport(props.answerSheetId);
  }, [props.answerSheetId]);

  useEffect(() => {
    fetchFullTestWithResults(props.testId, "REPORT")
      .then((data: any) => {
        setTest(data.test);
        setSuperSections(data.superSections);
        setisTestwithOnlyMarks(data.isTestwithOnlyMarks);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [props.testId]);

  return (
    <Stack w="100%" align="center">
      <Stack w={isMd ? "100%" : "80%"} align="center">
        <Flex align="center" w="100%">
          <IconChevronLeft
            onClick={() => {
              props.onBackClick();
            }}
            size={30}
            style={{ cursor: "pointer", marginRight: 10 }}
          />
          <Text fz={isMd ? 20 : 30} fw={600}>
            Report
          </Text>
        </Flex>

        {selectedReport !== null && avgReport !=null &&
          (superSections.length > 0 || isTestwithOnlyMarks) && (
            <TestReport
              superSections={superSections}
              testReport={selectedReport}
              totalNumberOfStudents={1}
              isSingleReport={true}
              isTestwithOnlyMarks={isTestwithOnlyMarks}
              test={test!!}
              userType="student"
              testId={props.testId}
              answerSheet={answerSheet}
              avgTestReport={avgReport}
            />
          )}
      </Stack>
    </Stack>
  );
}
