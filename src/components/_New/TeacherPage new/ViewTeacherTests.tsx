import React, { useEffect, useState } from "react";
import {
  Text,
  Paper,
  Box,
  SimpleGrid,
  useMantineTheme,
  Flex,
  Button,
  Stack,
} from "@mantine/core";
import createTestsSideIcon from "../../../assets/createTestsSideIcon.png";
import { useMediaQuery } from "@mantine/hooks";
import { TestInfoCard } from "./TestInfoCard";
import { TestScreen } from "../ContentTest";
import { TestListDetails } from "../../../pages/_New/AllTeacherTests";
import { GetUser } from "../../../utilities/LocalstorageUtility";
import { GetAllInfoForInstitute } from "../../../_parentsApp/features/instituteSlice";
import { Logo } from "../../Logo";
import { Mixpanel } from "../../../utilities/Mixpanel/MixpanelHelper";
import { WebAppEvents } from "../../../utilities/Mixpanel/AnalyticeEventWebApp";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../store/ReduxStore";
import { isGapMoreThanOneWeek } from "../../../utilities/HelperFunctions";
import { User1 } from "../../../@types/User";
import { isPremiumModalOpened } from "../../../store/premiumModalSlice";
const isPremiumModalOpenedActions = isPremiumModalOpened.actions;

interface CreateTestTitleCardProps {
  numberOfTests: string;
  setTestScreen: (input: TestScreen) => void;
  onCreateTestClicked: () => void;
}

export function CreateTestTitleCard(props: CreateTestTitleCardProps) {
  const theme = useMantineTheme();
  const isSm = useMediaQuery(`(max-width: ${theme.breakpoints.sm}px)`);
  const isMd = useMediaQuery(`(max-width: 820px)`);
  const isLg = useMediaQuery(`(max-width: 990px)`);

  return (
    <Paper
      mt={20}
      style={{
        // width: isSm ? "95vw" : isMd ? "85vw" : isLg ? "80vw" : "70vw",
        // height: isSm ? "160px" : isMd ? "180px" : isLg ? "200px" : "220px",
        width: "100%",

        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <Box
        style={{
          width: "100%",
          height: "90%",
          borderRadius: "28px",
          background: "#4B65F6",
        }}
      >
        <SimpleGrid
          cols={2}
          style={{
            display: "flex",
            justifyContent: "space-between",
            height: "100%",
          }}
        >
          {/* First Column */}
          <Box
            my={20}
            ml={isSm ? 14 : isMd ? 16 : isLg ? 18 : 20}
            style={{
              display: "flex",
              justifyContent: "space-around",
              flexDirection: "column",
            }}
          >
            <Text
              fz={isSm ? 16 : isMd ? 20 : isLg ? 25 : 30}
              fw={isMd ? 700 : 700}
              c={"#FFF"}
            >
              Elevate Your Teaching
            </Text>

            <Text mb={30} mt={3} fz={isMd ? 14 : 18} c={"#FFF"}>
              Create and Share Tests with Your Students
            </Text>
            <Button
              w={140}
              variant="outline"
              style={{ borderColor: "#FFF" }}
              c={"#FFF"}
              onClick={() => {
                props.onCreateTestClicked();
              }}
            >
              Create Test
            </Button>
          </Box>

          {/* Second Column */}
          <Flex align={"center"}>
            <img
              src={createTestsSideIcon}
              alt="Create Test Icon"
              style={{ width: "100%" }}
            />
          </Flex>
        </SimpleGrid>
      </Box>
      <Box
        style={{
          width: isMd ? "87%" : "95%",
          height: isMd ? "7%" : "8%",
          borderRadius: " 0 0 28px 28px",
          background: "#3174F3",
          opacity: "0.3",
          justifyItems: "center",
        }}
      ></Box>
    </Paper>
  );
}

interface ViewTeacherTestsProps {
  setTestScreen: (input: TestScreen) => void;
  allTests: TestListDetails[];
  setAllTests: (input: TestListDetails[]) => void;
  setViewTestId: (input: string) => void;
  setIsLoading: (input: boolean) => void;
}
