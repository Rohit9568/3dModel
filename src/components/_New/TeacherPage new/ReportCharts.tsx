import { Box, Flex, Group, Stack, Text } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import React, { useEffect, useState } from "react";
import ChartDataLabels from "chartjs-plugin-datalabels";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  ChartOptions,
  LineController,
  PointElement,
  LineElement
} from "chart.js";
import * as Chart from "chart.js";
import { Bar, Line, Pie} from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels,
  LineController,
  PointElement,
  LineElement
);

function ReportCharts(props: {
  questionWisePerformanceDistribution?: QuestionWisePerformanceDistribution;
  questionWiseTimeDistribution?: QuestionWiseTimeDistribution;
  accuracy?:number;
  testCompartiveAnalysisData?:TestComparativeAnalysis;
  myMarks:number
}) {

  return (
    <>
      <Stack>
        {props.questionWisePerformanceDistribution && (
          <PerformanceDistribution
            questionWisePerformanceDistribution={
              props.questionWisePerformanceDistribution
            }
          />
        )}
        {props.questionWiseTimeDistribution && props.accuracy && (
          <TimeManagement
            questionWiseTimeDistribution={props.questionWiseTimeDistribution}
            accuracy={props.accuracy}
            toppersAccuracy={props.testCompartiveAnalysisData?.toppersAccuracy??props.accuracy}
          />
        )}
        {props.testCompartiveAnalysisData && (
          <Stack>
            <MarksDistribution marksDistributionData={props.testCompartiveAnalysisData.marksDistribution} myMarks={props.myMarks} />
            {/* <PercentileDistribution /> */}
          </Stack>
        )}
      </Stack>
    </>
  );
}

export default ReportCharts;

export const PerformanceDistribution = (props: {
  questionWisePerformanceDistribution: QuestionWisePerformanceDistribution;
}) => {
  const isMd = useMediaQuery("(max-width:820px)");
  const data = {
    labels: ["Attempted", "Correct", "Incorrect", "Skipped"],
    datasets: [
      {
        data: [
          props.questionWisePerformanceDistribution.attempted,
          props.questionWisePerformanceDistribution.correct,
          props.questionWisePerformanceDistribution.inCorrect,
          props.questionWisePerformanceDistribution.skipped,
        ],
        backgroundColor: ["#dab6fc", "#b6fcd5", "#fcbdb6", "#b6e8fc"],
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      datalabels: {
        display: false,
      },
    },
    scales: {
      y: {
        border: { dash: [4, 4] },
        grid: {
          color: "#aaa",
          tickColor: "#fff",
          tickBorderDash: [2, 3],
          tickLength: 2,
          tickWidth: 2,
          offset: true,
          drawTicks: true,
          drawOnChartArea: true,
        },
        beginAtZero: true,
      },
      x: {
        display: true,
        ticks: {
          display: false,
        },
      },
    },
  };

  return (
    <>
      <Stack
        sx={{
          boxShadow: "0px 0px 4px 0px #00000040",
          borderRadius: "10px",
          height: "100%",
        }}
        w={"100%"}
        p={24}
      >
        <Flex
          justify={"space-between"}
          direction={isMd ? "column" : "row"}
        >
          <Text fw={700} fz="md">
            Performance Distribution
          </Text>
          <Group position={isMd ? "left" : "right"}>
            <Flex gap={3} align="center">
              <Box
                sx={{
                  width: "15px",
                  height: "15px",
                  borderRadius: "2px",
                  backgroundColor: "#dab6fc",
                }}
              ></Box>
              <Text fw={500} fz="xs">
                Attempted
              </Text>
            </Flex>
            <Flex gap={3} align="center">
              <Box
                sx={{
                  width: "15px",
                  height: "15px",
                  borderRadius: "2px",
                  backgroundColor: "#b6fcd5",
                }}
              ></Box>
              <Text fw={500} fz="xs">
                Correct
              </Text>
            </Flex>
            <Flex gap={3} align="center">
              <Box
                sx={{
                  width: "15px",
                  height: "15px",
                  borderRadius: "2px",
                  backgroundColor: "#fcbdb6",
                }}
              ></Box>
              <Text fw={500} fz="xs">
                Incorrect
              </Text>
            </Flex>
            <Flex gap={3} align="center">
              <Box
                sx={{
                  width: "15px",
                  height: "15px",
                  borderRadius: "2px",
                  backgroundColor: "#b6e8fc",
                }}
              ></Box>
              <Text fw={500} fz="xs">
                Skipped
              </Text>
            </Flex>
          </Group>
        </Flex>
        <Box>
          <Bar options={options} data={data} />
        </Box>
      </Stack>
    </>
  );
};

export const TimeManagement = (props: {
  questionWiseTimeDistribution: QuestionWiseTimeDistribution;
  accuracy:number,
  toppersAccuracy?:number
}) => {
  const isMd = useMediaQuery("(max-width:820px)");
  const pieData = {
    labels: ["Correct Questions", "Incorrect Questions", "Skipped Questions"],
    datasets: [
      {
        label: "Time Taken",
        data: [
          props.questionWiseTimeDistribution.correct.toFixed(2),
          props.questionWiseTimeDistribution.inCorrect.toFixed(2),
          props.questionWiseTimeDistribution.skipped.toFixed(2),
        ],
        backgroundColor: [
          "rgba(183, 255, 183, 1)",
          "rgba(255, 212, 183, 1)",
          "rgba(183, 241, 255, 1)",
        ],
        borderColor: [
          "rgba(183, 255, 183, 1)",
          "rgba(255, 212, 183, 1)",
          "rgba(183, 241, 255, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const pieOptions: ChartOptions<"pie"> = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true,
      },
      datalabels: {
        color: "black",
        formatter: (value, context) => {
          return value + "sec";
        },
        anchor: "center",
        align: "center",
      },
    },
  };

  const barData = {
    labels: ["Your Accuracy", "Topper's Accuracy"],
    datasets: [
      {
        data: [props.accuracy, props.toppersAccuracy??props.accuracy],
        backgroundColor: ["#93A3FA", "#93A3FA"],
      },
    ],
  };

  const barOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      datalabels: {
        display: false,
      },
    },
    scales: {
      y: {
        border: { dash: [3, 3] },
        grid: {
          color: "#aaa",
          tickColor: "#fff",
          borderDash: [3, 3],
          tickLength: 8,
          tickWidth: 2,
          drawTicks: true,
          drawOnChartArea: true,
          drawBorder: true,
        },
        ticks: {
          stepSize: 8,
          max: 32,
          min: 1,
        },
        beginAtZero: true,
      },
      x: {
        display: true,
        ticks: {
          display: false,
        },
      },
    },
  };

  return (
    <>
      <Flex
        justify={"space-between"}
        align={"center"}
        direction={isMd ? "column" : "row"}
        sx={{
          boxShadow: "0px 0px 4px 0px #00000040",
          borderRadius: "10px",
          height: "100%",
          padding: "0.5rem",
        }}
        w={"100%"}
      >
        <Stack w={isMd ? "100%" : "50%"} align="center">
          <Box sx={{ width: "100%" }}>
            <Text
              ta="left"
              fw={700}
              fz="md"
              sx={{ marginTop: "0.5rem", marginLeft: "0.5rem" }}
            >
              Time Management
            </Text>
          </Box>
          <Flex w={isMd ? "100%" : "50%"} justify={"center"} align={"center"}>
            <Pie options={pieOptions} data={pieData} />
          </Flex>
          <Group position="center" sx={{ padding: "0.5rem" }}>
            <Flex gap={3} align="center">
              <Box
                sx={{
                  width: "15px",
                  height: "15px",
                  borderRadius: "2px",
                  backgroundColor: "#B7FFB7",
                }}
              ></Box>
              <Text fw={500} fz="xs">
                Correct
              </Text>
            </Flex>
            <Flex gap={3} align="center">
              <Box
                sx={{
                  width: "15px",
                  height: "15px",
                  borderRadius: "2px",
                  backgroundColor: "#FFD4B7",
                }}
              ></Box>
              <Text fw={500} fz="xs">
                Incorrect
              </Text>
            </Flex>
            <Flex gap={3} align="center">
              <Box
                sx={{
                  width: "15px",
                  height: "15px",
                  borderRadius: "2px",
                  backgroundColor: "#B7F1FF",
                }}
              ></Box>
              <Text fw={500} fz="xs">
                Skipped
              </Text>
            </Flex>
          </Group>
        </Stack>
        <Flex
          w={isMd ? "100%" : "50%"}
          align="center"
          justify={"center"}
          sx={{ paddingRight: "1rem" }}
        >
          <Bar options={barOptions} data={barData} />
        </Flex>
      </Flex>
    </>
  );
};

export const MarksDistribution = (props:{
  marksDistributionData:number[]
  myMarks:number
}) => {
  const labelData = props.marksDistributionData;

  const data = {
    labels: [
      "0-20",
      "20-40",
      "40-60",
      "60-70",
      "80-100"
    ],
    datasets: [
      {
        label: "My score",
        data: labelData,
        backgroundColor: "red",
        borderColor: "rgba(53, 162, 235, 1)",
        borderWidth: 2,
        pointBackgroundColor: function (context: any) {
          const value = context.index;
          return value === (props.myMarks/20) ? "red" : "rgba(53, 162, 235, 1)";
        },
        pointBorderColor: function (context: any) {
          const value = context.index;
          return value === (props.myMarks/20) ? "red" : "rgba(53, 162, 235, 1)";
        },
        pointRadius: 5,
        pointHoverRadius: 7,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        labels: {
          generateLabels: function (ChartJS: any) {
            const original =
              Chart.defaults.plugins.legend.labels.generateLabels;
            const labels = original(ChartJS);
            return labels;
          },
        },
      },
      title: {
        display: false,
      },
      tooltip: {
        enabled: false,
      },
      datalabels: {
        display: false,
      },
    },
    scales: {
      y: {
        border: { dash: [4, 4] },
        grid: {
          color: "#aaa",
          tickColor: "#fff",
          tickLength: 20,
          tickWidth: 2,
          drawTicks: true,
          drawOnChartArea: true,
        },
        ticks: {
          maxTicksLimit: 7,
          stepSize: 20,
          max: 100,
          min: 0,
        },
        beginAtZero: true,
        title: {
          display: true,
          text: "Percentage of students",
        },
      },
      x: {
        title: {
          display: true,
          text: "Marks (%)",
        },
        border: { dash: [4, 4] },
        grid: {
          color: "#aaa",
          tickColor: "#fff",
          tickBorderDash: [2, 3],
          tickWidth: 2,
          drawTicks: true,
          drawOnChartArea: true,
        },
        beginAtZero: true,
      },
    },
  };

  return (
    <>
      <Stack
        sx={{
          boxShadow: "0px 0px 4px 0px #00000040",
          borderRadius: "10px",
          height: "100%",
        }}
        w={"100%"}
      >
        <Text
          fw={700}
          fz="md"
          sx={{ marginTop: "0.5rem", marginLeft: "0.5rem" }}
        >
          Marks Distribution
        </Text>
        <Box>
          <Line options={options} data={data} />
        </Box>
      </Stack>
    </>
  );
};

export const PercentileDistribution = () => {
  const [myPercentile, setPercentile] = useState<number>(55);
  const labelData = [30, 42, 65, 82, 100];
  let insertIndex = labelData.findIndex((value) => value > myPercentile);
  labelData.splice(insertIndex, 0, myPercentile);

  const data = {
    labels: ["0", "3", "9", "12"],
    datasets: [
      {
        label: "My Percentile",
        data: labelData,
        backgroundColor: "rgba(53, 162, 235, 0.5)",
        borderColor: "rgba(53, 162, 235, 1)",
        borderWidth: 2,
        pointBackgroundColor: function (context: any) {
          const value = context.raw;
          return value === myPercentile ? "red" : "rgba(53, 162, 235, 1)";
        },
        pointBorderColor: function (context: any) {
          const value = context.raw;
          return value === myPercentile ? "red" : "rgba(53, 162, 235, 1)";
        },
        pointRadius: 5,
        pointHoverRadius: 7,
      },
    ],
  };

  return (
    <>
      <Stack
        sx={{
          boxShadow: "0px 0px 4px 0px #00000040",
          borderRadius: "10px",
          height: "100%",
        }}
        w={"100%"}
      >
        <Text
          fw={700}
          fz="md"
          sx={{ marginTop: "0.5rem", marginLeft: "0.5rem" }}
        >
          Percentile Distribution
        </Text>
        <Box>
          <Line data={data} />
        </Box>
      </Stack>
    </>
  );
};
