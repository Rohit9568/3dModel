import { Box, Center, Flex, Image, Text, useMantineTheme } from "@mantine/core";
import { InstituteTheme } from "../../../@types/User";
import { Carousel, Embla, useAnimationOffsetEffect } from "@mantine/carousel";
import { useMediaQuery } from "@mantine/hooks";
import { useState } from "react";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons";
import { TeamMemberstype } from "../../../components/WebsiteBuilder/OurTeamEdit";

export function Team(props: {
  theme: InstituteTheme;
  teamMembers: TeamMember[];
  teamMembertype: TeamMemberstype;
  title: string;
}) {
  const theme = useMantineTheme();
  const isMd = useMediaQuery(`(max-width: ${theme.breakpoints.md}px)`);
  const isLg = useMediaQuery(`(max-width: ${theme.breakpoints.xl}px)`);
  const isXl = useMediaQuery(`(max-width: ${theme.breakpoints.xl}px)`);

  const [embla, setEmbla] = useState<Embla | null>(null);
  const TRANSITION_DURATION = 200;
  useAnimationOffsetEffect(embla, TRANSITION_DURATION);
  return (
    <>
      {props.teamMembers.length > 0 && (
        <>
          {/* <Text
            fw={600}
            ff="Catamaran"
            fz={30}
            align="center"
            c={"red"}
            mt={40}
          >
            Our Team
          </Text> */}

          <Text
            fw={700}
            ff="Catamaran"
            fz={isMd ? 32 : 40}
            align="center"
            mt={30}
          >
            {props.title}
          </Text>

          <Center pb={20}>
            <Carousel
              getEmblaApi={setEmbla}
              slideSize={isLg ? "100%" : "50%"}
              slideGap={10}
              loop
              align={
                isMd
                  ? "center"
                  : props.teamMembers.length < 2
                  ? "center"
                  : "start"
              }
              px={isMd ? 20 : 40}
              w={isMd ? "100%" : isXl ? "85%" : "75%"}
              my={20}
              withIndicators
              nextControlIcon={
                <Box
                  w={"60%"}
                  h={"100%"}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: "4px",
                  }}
                >
                  <IconChevronRight size={60} stroke={1} color="#747474" />
                </Box>
              }
              previousControlIcon={
                <Box
                  w={"60%"}
                  h={"100%"}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: "4px",
                  }}
                >
                  <IconChevronLeft size={60} stroke={1} color="#747474" />
                </Box>
              }
              styles={{
                controls: {
                  top: 0,
                  height: "100%",
                  padding: "0px",
                  margin: "0px",
                },
                control: {
                  background: "transparent",
                  border: "none",
                  boxShadow: "none",
                  height: "200px",
                  "&[data-inactive]": {
                    opacity: 0,
                    cursor: "default",
                  },
                },
                indicator: {
                  width: 8,
                  height: 8,
                  backgroundColor: "red",
                  "&[data-active]": {},
                },
                indicators: {
                  top: "100%",
                  alignItems: "center",
                },
              }}
            >
              {props.teamMembers.map((teamMember, i) => {
                return (
                  <Carousel.Slide>
                    <Flex
                      p={20}
                      direction={isMd ? "column" : "row"}
                      gap={15}
                      align="center"
                    >
                      <Box h={"100%"}>
                        <img
                          src={teamMember.profileImage}
                          style={{
                            width: 224,
                            height: 224,
                            // borderRadius: "50%",
                            objectFit: "cover",
                          }}
                        ></img>
                        <Center mt={10}>
                          <Text
                            bg={"#E9E9FF"}
                            style={{ borderRadius: "50px" }}
                            c={"#000574"}
                            py={5}
                            px={15}
                            fz={20}
                            fw={700}
                          >
                            {teamMember.desgination}
                          </Text>
                        </Center>
                      </Box>
                      <Box ml={isMd ? 0 : 20}>
                        <Text
                          c={"#000574"}
                          fz={28}
                          fw={800}
                          align={isMd ? "center" : "left"}
                          py={isMd ? 15 : 0}
                        >
                          {teamMember.name}
                        </Text>
                        <Text
                          fz={18}
                          fw={400}
                          c={"#757f95"}
                          align={isMd ? "center" : "left"}
                          style={{ whiteSpace: "pre-line" }}
                        >
                          {teamMember.description}
                        </Text>
                      </Box>
                    </Flex>
                  </Carousel.Slide>
                );
              })}
            </Carousel>
          </Center>
        </>
      )}
    </>
  );
}
