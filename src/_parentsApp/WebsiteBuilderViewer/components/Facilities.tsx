import {
  Card,
  Center,
  Group,
  SimpleGrid,
  Stack,
  Text,
  useMantineTheme,
} from "@mantine/core";
import { InstituteTheme } from "../../../@types/User";
import { useMediaQuery } from "@mantine/hooks";
import { useEffect, useState } from "react";

export function Facilities(props: {
  theme: InstituteTheme;
  instituteName: string;
  facilities: InstituteFacilities[];
}) {
  const theme = useMantineTheme();
  const isMd = useMediaQuery(`(max-width: ${theme.breakpoints.md}px)`);
  const isLg = useMediaQuery(`(max-width: ${theme.breakpoints.lg}px)`);
  const isXl = useMediaQuery(`(max-width: ${theme.breakpoints.xl}px)`);

  return (
    <>
      {props.facilities.length > 0 && (
        <Stack
          id="parent-facilities"
          bg={props.theme.backGroundColor}
          pt={20}
          pb={50}
          spacing={0}
        >
          <Text align="center" fw={600} fz={30} ff="Catamaran" c={"red"}>
            Our Facilities
          </Text>
          <Text
            align="center"
            fw={700}
            fz={isMd ? 32 : 40}
            ff="Catamaran"
            px={"2%"}
          >
            {props.instituteName} Facilities
          </Text>
          <Center mt={30}>
            <SimpleGrid
              cols={isMd ? 1 : isLg ? 2 : 3}
              w={isMd ? "85%" : isXl ? "85%" : "70%"}
              spacing={25}
              verticalSpacing={25}
            >
              {props.facilities.map((facility) => {
                return (
                  <Card
                    maw={370}
                    mah={350}
                    style={{
                      borderRadius: 20,
                      boxShadow: "0px 2px 8px 0px rgba(99, 99, 99, 0.20)",
                    }}
                  >
                    <Group w={"100%"}>
                      <Center w={"100%"}>
                        <img src={facility.icon}></img>
                      </Center>
                    </Group>
                    <Text align="center" fw={800} fz={22} my={20}>
                      {facility.name}
                    </Text>
                    <Text
                      align="center"
                      fw={400}
                      fz={16}
                      c="#757F95"
                      ff="Roboto"
                    >
                      {facility.description}
                    </Text>
                  </Card>
                );
              })}
            </SimpleGrid>
          </Center>
        </Stack>
      )}
    </>
  );
}
