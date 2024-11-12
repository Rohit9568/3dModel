import {
  Card,
  Center,
  Flex,
  Group,
  SimpleGrid,
  Stack,
  Text,
  useMantineTheme,
} from "@mantine/core";
import { InstituteTheme } from "../../../@types/User";
import { useMediaQuery } from "@mantine/hooks";
import { useEffect, useState } from "react";
import { wrap } from "module";

export function Benefits(props: {
  theme: InstituteTheme;
  instituteName: string;
  benefits: InstituteBenefits[];
  instituteBenefitsTagLine: string;
}) {
  const theme = useMantineTheme();
  const isMd = useMediaQuery(`(max-width: ${theme.breakpoints.md}px)`);
  const isLg = useMediaQuery(`(max-width: ${theme.breakpoints.lg}px)`);
  const isXl = useMediaQuery(`(max-width: ${theme.breakpoints.xl}px)`);

  return (
    <>
      {props.benefits.length > 0 && (
        <Stack align="center">
          <Stack
            id="parent-facilities"
            pt={20}
            pb={50}
            spacing={0}
            px={isMd ? 20 : 50}
            w={isMd ? "100%" : isXl ? "85%" : "75%"}
            justify="center"
          >
            <Text align="left" fw={600} fz={30} ff="Catamaran" c={"#2400FF"}>
              WHY CHOOSE US?
            </Text>
            <Text fz={isMd ? 20 : 40} fw={700}>
              {props.instituteBenefitsTagLine}
            </Text>
            <Center mt={30}>
              <Flex w="100%" wrap="wrap">
                {props.benefits.map((benefit) => {
                  return (
                    <Flex w={isMd ? "50%" : "25%"} my={20} align="center">
                      <img
                        src={benefit.icon}
                        style={{
                          width: "30%",
                        }}
                      />
                      <Text
                        fw={700}
                        fz={isMd ? 16 : 20}
                        ff="Catamaran"
                        px={"5%"}
                      >
                        {benefit.title}
                      </Text>
                    </Flex>
                  );
                })}
              </Flex>
            </Center>
          </Stack>
        </Stack>
      )}
    </>
  );
}
