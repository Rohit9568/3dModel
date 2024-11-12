import {
  Box,
  Button,
  Center,
  Flex,
  Group,
  Modal,
  ScrollArea,
  SimpleGrid,
  Stack,
  Text,
  Tooltip,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { IconEdit, IconPlus, IconTrash } from "@tabler/icons";
import {
  BarController,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Tooltip as ChartTooltip,
  Legend,
  LineController,
  LineElement,
  LinearScale,
  PointElement,
} from "chart.js";
import { useEffect, useState } from "react";
import { Chart } from "react-chartjs-2";
import { GetAllTestsByClassId } from "../../../_parentsApp/features/instituteClassSlice";
import { getColorForPercentage } from "../../../utilities/HelperFunctions";
import { lineColors } from "../../../utilities/PreDefinedData";
import { AddTestModal } from "./AddTestModal";
import { IconDelete } from "../../_Icons/CustonIcons";
import { showNotification } from "@mantine/notifications";
import { deleteTest } from "../../../features/test/TestSlice";
ChartJS.register(
  LinearScale,
  CategoryScale,
  BarElement,
  PointElement,
  LineElement,
  Legend,
  ChartTooltip,
  LineController,
  BarController
);

interface SingleClassResultProps {
  teacherSubjectIds: string[] | null;
  classId: string;
  instituteId: string;
  setSelectedClassId?: (val: string | null) => void;
  setTestId: (val: string) => void;
}
export function SingleClassResult(props: SingleClassResultProps) {
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
      isTestwithOnlyMarks: boolean;
    }[]
  >([]);
  const [allTestChartData, setAllTestChartData] = useState<any>(null);

  const [isAddResultSelected, setIsAddResultSelected] =
    useState<boolean>(false);

  function handleDeleteClick(testId: string) {
    deleteTest(testId)
      .then((data) => {
        showNotification({
          message: "Test Deleted",
          autoClose: 1000,
          color: "green",
        });
        fetchAllTests();
      })
      .catch((error) => {
        console.log("Delete Test Error:", error);
      });
  }

  function fetchAllTests() {
    let labels: {
      testId: string;
      testSubjectId: string;
      testName: string;
      marks: number;
      maxMarks: number;
      count: number;
      date: number;
      isTestwithOnlyMarks: boolean;
    }[] = [];

    GetAllTestsByClassId({ id: props.classId })
      .then((x: any) => {
        let datasets: any[] = [];
        const dataPointData = x.map((item: any) => {
          const test = item.test;
          const percentage = test.averageMarksPercentage ?? 0;
          labels.push({
            testId: test._id,
            testSubjectId: test.subject_id ?? "",
            marks: (percentage * test.maxMarks) / 100,
            testName: test.name,
            maxMarks: test.maxMarks,
            count: 0,
            date: test.date,
            isTestwithOnlyMarks: test.isTestwithOnlyMarks,
          });
          return percentage;
        });
        console.log(dataPointData);
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
  }, []);

  const [showWarning, setShowWarning] = useState<string | null>(null);
  return (
    <Box h="90dvh">
      <Group position="apart" mx={10} mt={20}>
        <Group position="left">
          <Text color="#595959" fz={23} fw={600}>
            Result
          </Text>
          <Tooltip label="Add Result">
            <Box
              style={{
                borderRadius: "50%",
                backgroundColor: "#3174F3",
                cursor: "pointer",
              }}
              onClick={() => {
                setIsAddResultSelected(true);
              }}
              h="22px"
              w="25px"
              ml={-10}
            >
              <Center w="100%" h="100%">
                <IconPlus color="white" height="80%" width="80%" />
              </Center>
            </Box>
          </Tooltip>
        </Group>
      </Group>

      {allTests.length === 0 && (
        <Box w="100%" h="100%">
          <Center h={"100%"} w={"100%"}>
            <Stack justify="center" align="center">
              <img
                src={require("../../../assets/empty result page.gif")}
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
        >
          <Chart
            type="bar"
            data={allTestChartData}
            style={{
              width: "200px",
              backgroundColor: "#F9F9F9",
              marginLeft: "10px",
              marginRight: "10px",
              paddingTop: "20px",
              paddingBottom: "20px",
              paddingRight: "10px",
              height: "50%",
            }}
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
                  // ticks: {
                  //   callback: (value: string) => {
                  //     return value + "%";
                  //   },
                  //   stepSize: 10,
                  // },
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
        </Flex>
      )}

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
                <Flex align="center" gap={5} mr={10}>
                  <Text fz={12} fw={500} ta="right" color="#3174F3">
                    Avg. Marks: {x.marks.toFixed(2)}/{x.maxMarks}
                  </Text>
                  <IconEdit
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      if (x.isTestwithOnlyMarks) {
                        props.setTestId(x.testId);
                      } else {
                        showNotification({
                          message: "Can't Edit this test",
                          autoClose: 1000,
                          color: "red",
                        });
                      }
                    }}
                  />
                  <IconTrash
                    style={{
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      if (x.isTestwithOnlyMarks) {
                        setShowWarning(x.testId);
                      } else {
                        showNotification({
                          message: "Can't Delete this test",
                          autoClose: 1000,
                          color: "red",
                        });
                      }
                    }}
                    color="red"
                  />
                </Flex>
              </Flex>
            );
          })}
        </SimpleGrid>
      </ScrollArea>
      <Modal
        style={{ zIndex: 9999 }}
        opened={isAddResultSelected}
        onClose={() => {
          setIsAddResultSelected(false);
        }}
        title="Add Result"
        centered
      >
        <AddTestModal
          instituteId={props.instituteId}
          classId={props.classId}
          onClose={() => {
            setIsAddResultSelected(false);
          }}
          onTestCreated={props.setTestId}
        />
      </Modal>
      <Modal
        opened={showWarning !== null}
        onClose={() => {
          setShowWarning(null);
        }}
        centered
        style={{ zIndex: 9999999 }}
        title="Delete Result"
      >
        <Text fw={500} fz={20} align="center">
          Are you sure you want to delete this Test?
        </Text>
        <Group position="center" mt={20}>
          <Button
            variant="outline"
            color="dark"
            fw={700}
            radius={50}
            onClick={() => {
              setShowWarning(null);
            }}
          >
            Cancel
          </Button>
          <Button
            fw={700}
            radius={50}
            style={{ background: "red " }}
            onClick={() => {
              if (showWarning) handleDeleteClick(showWarning);
              setShowWarning(null);
            }}
          >
            Delete
          </Button>
        </Group>
      </Modal>
    </Box>
  );
}
export default SingleClassResult
