import React from "react";
import { Text, Paper, Box, SimpleGrid, useMantineTheme } from "@mantine/core";
import ViewTestBackgroundImage from "../../../assets/viewTestBackground.png";
import { useMediaQuery } from "@mantine/hooks";
import { ViewTestInfoCard } from "./TestInfoCard";
interface ViewTestTitleCardProps {
  numberOfTests: string;
}

export function ViewTestTitleCard(props: ViewTestTitleCardProps) {
  const theme = useMantineTheme();
  const isSm = useMediaQuery(`(max-width: ${theme.breakpoints.sm}px)`);
  const isMd = useMediaQuery(`(max-width: 820px)`);
  const isLg = useMediaQuery(`(max-width: 990px)`);
  return (
    <Paper
      mt={20}
      style={{
        backgroundImage: `url(${ViewTestBackgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        borderRadius: "16px",
        maxHeight: "200px",
        padding: "16px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        width: isSm ? "95vw" : isMd ? "85vw" : isLg ? "80vw" : "70vw",
        position: "relative",
      }}
    >
      <Box
        style={{
          position: "absolute",
          top: "0",
          right: "0",
          width: "120px",
          height: "120px",
          borderRadius: "0 0 0 100% ",
          backgroundColor: "#fff",
          opacity: "0.3",
        }}
      ></Box>
      <Box
        style={{
          position: "absolute",
          top: "0",
          right: "0",
          width: "150px",
          height: "150px",
          borderRadius: "0 0 0 100% ",
          backgroundColor: "#fff",
          opacity: "0.2",
        }}
      ></Box>
      <Box
        style={{
          position: "absolute",
          top: "5%",
          right: "1%",
          width: "40px",
          height: "40px",
          borderRadius: "50%",
          backgroundColor: "#ff0000",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text fz={24} fw={700} c={"#FFF"}>
          {props.numberOfTests}
        </Text>
      </Box>

      <Text
        mt={30}
        style={{ textAlign: "left", color: "#fff" }}
        size="xl"
        weight={700}
      >
        Ai Generated Testing Platform
      </Text>
      <Text mb={30} style={{ textAlign: "left", color: "#fff" }} size="md">
        Sample Text for description!
      </Text>
    </Paper>
  );
}

interface ViewTestsProps {}

const ViewTests = (props: ViewTestsProps) => {
  const theme = useMantineTheme();
  const isSm = useMediaQuery(`(max-width: ${theme.breakpoints.sm}px)`);
  const isMd = useMediaQuery(`(max-width: 600px)`);
  return (
    <>
      <ViewTestTitleCard numberOfTests="10" />
      <SimpleGrid cols={isMd ? 1 : 2}>
        <ViewTestInfoCard
          isShared={true}
          isDeleted={false}
          className="class 1"
          subject="English"
          totalMarks={10}
          totalQuestions={12}
          testName="new test"
        />
        <ViewTestInfoCard
          isShared={false}
          isDeleted={false}
          className="class 2"
          subject="Maths"
          totalMarks={50}
          totalQuestions={82}
          testName="english test"
        />
        <ViewTestInfoCard
          isShared={false}
          isDeleted={false}
          className="class 1"
          subject="GK"
          totalMarks={18}
          totalQuestions={14}
          testName="maths test"
        />
      </SimpleGrid>
    </>
  );
};

export default ViewTests;
