import React from "react";
import { Box, Flex, Text, useMantineTheme } from "@mantine/core";
import { InstituteTheme } from "../../../@types/User";
import { useMediaQuery } from "@mantine/hooks";

export const Banner = (props: { theme: InstituteTheme; phoneNo: string }) => {
  const theme = useMantineTheme();
  const isMd = useMediaQuery(`(max-width: ${theme.breakpoints.md}px)`);
  return (
    <>
      {/* <Flex style = {{ backgroundColor: props.theme.backGroundColor}} pt={20}>

    </Flex> */}
      <Flex
        style={{
          fontSize: isMd ? 20 : 26,
          backgroundColor: props.theme.primaryColor,
        }}
        h={100}
        justify={"center"}
        align={"center"}
        direction={"column"}
      >
        <Text color="white" fw={"bold"}>
          Take your first step toward bright future
        </Text>
        <Text color="white" fw={"bold"}>
          Call: +91{props.phoneNo}
        </Text>
      </Flex>
    </>
  );
};
