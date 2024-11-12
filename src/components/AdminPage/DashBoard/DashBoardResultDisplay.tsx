import { Box, Center, Flex, Select, Stack, Text } from "@mantine/core";
import { IconArrowBack, IconArrowForward, IconArrowMoveRight, IconArrowsMove, IconArrowsRightDown, IconChevronDown, IconPointer } from "@tabler/icons";
import { useEffect, useState } from "react";
import { GetAllSubjectsByClassId, GetAllTestsByClassId } from "../../../_parentsApp/features/instituteClassSlice";
import { lineColors } from "../../../utilities/PreDefinedData";
import { useMediaQuery } from "@mantine/hooks";
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


import { IconRight, IconRightArrow } from "../../_Icons/CustonIcons";

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

export function DashBoardResultDisplay(props: {
  batchId:string;
  onResultArrowClicked:()=>void;
}) {
  const isMd = useMediaQuery(`(max-width: 500px)`);

  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);

  const [allTests, setAlltests] = useState<
    {
      testName: string;
      testId: string;
      maxMarks: number;
      marks: number;
    }[]
  >([]);
  const [allTestChartData, setAllTestChartData] = useState<any>(null);


  function fetchAllTests() {
    let labels: {
      testId: string;
      testSubjectId:string;
      testName: string;
      marks: number;
      maxMarks: number;
      count: number;
      date: number;
    }[] = [];

    GetAllTestsByClassId({ id: props.batchId })
      .then((x: any) => {
        let datasets: any[] = [];
       const dataPointData = x.map((item: any) => {
          const test = item.test;
          const percentage = test.averageMarksPercentage ?? 0;
          labels.push({
            testId: test._id,
            testSubjectId:test.subject_id??"",
            marks: (percentage * test.maxMarks) / 100,
            testName: test.name,
            maxMarks: test.maxMarks,
            count: 0,
            date: test.date,
          });
          return percentage
        })
        datasets.push({
          type: "bar" as const,
          label:"Marks",
          backgroundColor:"#DDEDFD",
          fill: true,
          data:dataPointData,
          spanGaps: true,
        })
        setAlltests(labels);
        setAllTestChartData({
          labels: labels.map((x) => {
            return x.testName;
          }),
          datasets: datasets,
        });

      })
      .catch((err:any) => {
        console.log(err);
      });

  }

  useEffect(() => {
    fetchAllTests();
  }, []);


  return (
    <>
      <Stack w={"100%"} bg={"#F7F7FF"} h={"100%"} px={20} py={24} style={{borderRadius:"10px"}}>
        <Flex justify={"space-between"}>
          <Text fw={700} fz={18}>
            Result
          </Text>
          <Box w={8} h={8} onClick={()=>{
            props.onResultArrowClicked();
          }}
          style={{cursor:"pointer"}}
          >
          <IconRightArrow/>
          </Box>
        </Flex>
        { 
        allTests.length === 0  && (
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
        )
        }
 {
      allTestChartData !== null  &&
        allTests.length !== 0 && (
          <Flex
            h={isMd ? "250px" : "300px"}
            w={"100%"}
            py={10}
            px={2}
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
          </Flex>
        )}
      </Stack>
    </>
  );
}
 export default DashBoardResultDisplay
