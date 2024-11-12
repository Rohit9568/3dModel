import { Box, Flex, Select, Stack, Text } from "@mantine/core";
import { useEffect, useState } from "react";
import { fetchFullTestWithResults } from "../../../features/test/TestSlice";
import { useMediaQuery } from "@mantine/hooks";
import { IconLeftArrow } from "../../_Icons/CustonIcons";
import { IconChevronLeft } from "@tabler/icons";
import { TestReport } from "./TestReport";
import { fetchReportFromAnswerSheet } from "../../../features/test/AnswerSheetSlice";
import PdfViewer2 from "../../PdfViewer/Pdfviewer2";
import { PdfViewer } from "../FileUploadBox";

export function InfoCard(props: {
  label: string;
  value: number | string;
  total?: number;
  img: any;
}) {
  const isMd = useMediaQuery(`(max-width: 820px)`);

  return (
    <Flex
      style={{
        boxShadow: "0px 0px 4px 0px #00000040",
        borderRadius: "10px",
        margin: "0.5rem",
      }}
      align="center"
      py={isMd ? 6 : 10}
      px={isMd ? 10 : 25}
    >
      <Box>
      <img src={props.img} alt="icon" style={{height:80}}/>
      </Box>
      <Stack spacing={0} ml={30} justify="center" pt={5}>
        <Text fz={isMd ? 14 : 16} fw={600}>
          {props.label}
        </Text>
        <Text fz={43} fw={600} mt={-5}>
          {props.value}
        </Text>
      </Stack>
    </Flex>
  );
}

export function TeacherSideReports(props: {
  testId: string;
  setIsLoading: (input: boolean) => void;
  onBackClick: () => void;
}) {
  const isMd = useMediaQuery(`(max-width: 820px)`);
  const [answerSheet, setAnswerSheet] = useState<any>();

  const [studentsWithAnswerSheet, setStudentsWithAnswerSheetId] = useState<
    {
      label: string;
      value: string;
    }[]
  >([]);
  const [averageTestReport, setAverageTestReport] = useState<TestReport | null>(
    null
  );
  const [superSections, setSuperSections] = useState<
    {
      name: string;
      sections: any[];
    }[]
  >([]);

  const [test, setTest] = useState<FullTest>()
  const [selectedAnswerSheetId, setSelectedAnswerSheetId] =
    useState<string>("ALL");
  const [selectedReport, setSelectedReport] = useState<TestReport | null>(null);

  const [totalStudents, setTotalStudents] = useState<number>(0);
  const [isTestwithOnlyMarks, setisTestwithOnlyMarks] =
    useState<boolean>(false);

  function getStudentReport(id: string) {
    fetchReportFromAnswerSheet(id)
      .then((x: any) => {
        setSelectedReport(x.fullAnswerSheet.testReportId);
        setAnswerSheet(x.fullAnswerSheet)
      })
      .catch((e) => {
        console.log(e);
      });
  }
  useEffect(() => {
    if (selectedAnswerSheetId === "ALL" && averageTestReport !== null) {
      setSelectedReport(averageTestReport);
    } else if (selectedAnswerSheetId !== "ALL") {
      getStudentReport(selectedAnswerSheetId);
    }
  }, [selectedAnswerSheetId]);
  useEffect(() => {
    fetchFullTestWithResults(props.testId, "REPORT")
      .then((data: any) => {
        setSuperSections(data.superSections);
        setAverageTestReport(data.averageTestReport);
        setTest(data.test)
        setSelectedReport(data.averageTestReport);
        setTotalStudents(data.totalStudents);
        setisTestwithOnlyMarks(data.isTestwithOnlyMarks);
        const value: any = data.studentsWithAnswerSheets.map((student: any) => {
          return {
            label: student.name,
            value: student.answerSheetId,
          };
        });
        console.log(value);
        const arr1 = [
          {
            label: "ALL Students",
            value: "ALL",
          },
          ...value,
        ];
        if (data.isTestwithOnlyMarks) {
          arr1.splice(0, 1);
          setSelectedAnswerSheetId(arr1[0].value);
        }
        setStudentsWithAnswerSheetId(arr1);
      })
      .catch((error) => {
        console.log(error);
        props.setIsLoading(false);
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
            Report
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
      <Stack w={isMd ? "100%" : "90%"}>
        <>
          {isTestwithOnlyMarks === false && selectedAnswerSheetId === "ALL" && (
            <Flex
              w="100%"
              justify="space-between"
              align="center"
              mt={20}
              mb={20}
              direction={isMd ? "column" : "row"}
              wrap="wrap"
            >
              <Box w={isMd ? "100%" : "48%"}>
                <InfoCard
                  label="Total Students"
                  value={totalStudents}
                  img={require("../../../assets/TotalStudentsReport.png")}
                />
              </Box>
              <Box w={isMd ? "100%" : "48%"}>
                <InfoCard
                  label="Total Tests Attempts"
                  value={studentsWithAnswerSheet.length - 1}
                  img={require("../../../assets/TotalTestReport.png")}
                />
              </Box>
              { selectedReport?.accuracy &&
              <Box w={isMd ? "100%" : "48%"}>
                <InfoCard
                  label="Accuracy"
                  value={(selectedReport?.accuracy?.toFixed(2)??0)+"%"}
                  img={require("../../../assets/accuracyIcon.png")}
                />
              </Box>
}
              {/* <Box w={isMd ? "100%" : "48%"}>
                <InfoCard
                  label="Score"
                  value={20}
                  total={40}
                  img={require("../../../assets/TotalTestReport.png")}
                />
              </Box> */}
            </Flex>
          )}
          {selectedReport !== null  && averageTestReport !=null && (
            <TestReport
              superSections={superSections}
              testReport={selectedReport}
              totalNumberOfStudents={studentsWithAnswerSheet.length - 1}
              isSingleReport={selectedAnswerSheetId !== "ALL"}
              isTestwithOnlyMarks={isTestwithOnlyMarks}
              userType="teacher"
              test={test!!} 
              avgTestReport={averageTestReport}
              answerSheet={answerSheet}                 
              />
          )}
        </>
      </Stack>
    </Stack>
  );
}
