import React from "react";
import { InstituteTheme } from "../../../@types/User";
import { Box, Flex, Text, useMantineTheme } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";

export const TopBanner = (props: {
  theme: InstituteTheme;
  phoneNo: string;
}) => {
  const theme = useMantineTheme();
  const isMd = useMediaQuery(`(max-width: ${theme.breakpoints.md}px)`);
  return (
    <Flex
      id="parent-topBanner"
      style={{ backgroundColor: props.theme.primaryColor }}
    >
      <Flex
        h={40}
        w={isMd ? "105%" : "85%"}
        justify={"center"}
        align={"flex-end"}
        p={isMd ? 14 : 10}
        direction={"column"}
        style={{
          fontSize: isMd ? "12.9px" : "15px",
        }}
      >
        <Text color="white" fw={"bold"}>
          Take your first step toward bright future Call: +91{props.phoneNo}{" "}
        </Text>
      </Flex>
    </Flex>
  );
};
