import { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  LinearScale,
  CategoryScale,
  BarElement,
  PointElement,
  LineElement,
  Legend,
  Tooltip,
  LineController,
  BarController,
} from "chart.js";
import { Chart } from "react-chartjs-2";
import {
  Box,
  Center,
  Flex,
  Group,
  ScrollArea,
  Select,
  SimpleGrid,
  Stack,
  Text,
} from "@mantine/core";
import { GetStudentUserSubjectWiseResults } from "../features/instituteStudentSlice";
import { useMediaQuery } from "@mantine/hooks";
import {
  calculateRatioFromValue,
  formatDateFromNumberFormat,
  getColorForPercentage,
} from "../../utilities/HelperFunctions";
import { lineColors } from "../../utilities/PreDefinedData";
import {
  GetAllTestByStudentIdAndClassId,
  GetAllTestsByClassId,
} from "../features/instituteClassSlice";
import { IconRightArrow } from "../../components/_Icons/CustonIcons";

ChartJS.register(
  LinearScale,
  CategoryScale,
  BarElement,
  PointElement,
  LineElement,
  Legend,
  Tooltip,
  LineController,
  BarController
);

interface SingleClassResultProps {
  studentData: {
    studentId: string;
    batchId: string;
    batchName: string;
    studentName: string;
  };
  showTestCards: boolean;
  onResultArrowClicked: () => void;
}

export function ShowStudentResults(props: SingleClassResultProps) {
  
  const isMd = useMediaQuery(`(max-width: 500px)`);
  const isLg = useMediaQuery(`(max-width: 1000px)`);

  const [allTests, setAlltests] = useState<
    {
      testName: string;
      testId: string;
      testSubjectId: string;
      maxMarks: number;
      marks: number;
      subjectId?: string;
    }[]
  >([]);
  const [allTestChartData, setAllTestChartData] = useState<any>(null);

  const [isAddResultSelected, setIsAddResultSelected] =
    useState<boolean>(false);

  function fetchAllTests() {
    let labels: {
      testId: string;
      testSubjectId: string;
      testName: string;
      marks: number;
      maxMarks: number;
      count: number;
      date: number;
    }[] = [];

    GetAllTestByStudentIdAndClassId({
      classId: props.studentData.batchId,
      studentId: props.studentData.studentId,
    })
      .then((x: any) => {
        let datasets: any[] = [];
        const dataPointData = x.map((item: any) => {
          const test = item;
          const percentage = Math.round((test.marks / test.maxMarks) * 1000) / 10;
          labels.push({
            testId: test._id,
            testSubjectId: test.subject_id ?? "",
            marks: Math.round((test.marks / test.maxMarks) * 1000) / 10,
            testName: test.name,
            maxMarks: test.maxMarks,
            count: 0,
            date: test.date,
          });
          return percentage;
        });
        datasets.push({
          type: "bar" as const,
          label: "Marks",
          backgroundColor: "#DDEDFD",
          fill: true,
          data: dataPointData,
          spanGaps: true,
        });
        setAlltests(labels);
        setAllTestChartData({
          labels: labels.map((x) => {
            return x.testName;
          }),
          datasets: datasets,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  useEffect(() => {
    fetchAllTests();
  }, [props.studentData.batchId]);

  return (
    <Stack
      w={"100%"}
      h={"100%"}
      px={20}
      py={24}
      style={{ borderRadius: "10px", boxShadow: "0px 0px 30px 0px #0000001A" }}
    >
      <Flex justify={"space-between"}>
        <Text fz={24} fw={700}>
          Test Wise Results
        </Text>
      </Flex>
      {allTests.length === 0 && (
        <Box w="100%" h="100%">
          <Center h={"100%"} w={"100%"}>
            <Stack justify="center" align="center">
              <img
                src={require("../../assets/empty result page.gif")}
                height="140px"
                width="140px"
                alt="Empty Result"
              />
              <Text fw={500} fz={20} color="#C9C9C9">
                No Tests found!
              </Text>
            </Stack>
          </Center>
        </Box>
      )}

      {allTestChartData !== null && allTests.length !== 0 && (
        <Flex
          h={isMd ? "250px" : isLg ? "230px" : "300px"}
          w={"100%"}
          py={10}
          px={2}
          sx={{ overflowX: "auto" }}
        >
          <Box
            sx={{
              display: "inline-block",
              minWidth: isMd ? "300px" : "100%",
              backgroundColor: "#F9F9F9",
              height: "100%",
            }}
          >
            <Chart
              type="bar"
              data={allTestChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                borderColor: "#3976D2",
                elements: {
                  bar: {
                    borderWidth: 2,
                  },
                },
                scales: {
                  y: {
                    offset: false,
                    ticks: {
                      callback: (value: any) => {
                        return value + "%";
                      },
                      stepSize: 10,
                    },
                    title: {
                      display: true,
                      text: "Results",
                    },
                    beginAtZero: true,
                    max: 100,
                    min: 0,
                  },
                  x: {
                    offset: true,
                    title: {
                      display: true,
                      text: "Tests",
                    },
                  },
                },
              }}
            />
          </Box>
        </Flex>
      )}

      {props.showTestCards && (
        <ScrollArea h={isMd ? "50%" : "38%"}>
          <SimpleGrid cols={isMd ? 1 : 2}>
            {allTests.map((x) => {
              return (
                <Flex
                  justify="space-between"
                  style={{
                    background: "#F9F9F9",
                    borderRadius: "6px",
                  }}
                  w={"100%"}
                  mx={10}
                  my={5}
                  h={50}
                  key={x.testId}
                >
                  <Group>
                    <Box
                      style={{
                        backgroundColor: `${getColorForPercentage(
                          (x.marks / x.maxMarks) * 100
                        )}`,
                        borderRadius: "10px 0px 0px 10px",
                        width: "8px",
                        height: "100%",
                      }}
                    ></Box>
                    <Text>{x.testName}</Text>
                  </Group>

                  <Stack spacing={1} my={7} mr={10} justify="center">
                    <Text fz={12} fw={500} ta="right" color="#3174F3">
                      Avg. Marks: {x.marks}/{x.maxMarks}
                    </Text>
                  </Stack>
                </Flex>
              );
            })}
          </SimpleGrid>
        </ScrollArea>
      )}
    </Stack>
  );
}
export default ShowStudentResults
