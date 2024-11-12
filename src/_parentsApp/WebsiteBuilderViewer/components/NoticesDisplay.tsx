import {
  Box,
  Button,
  Card,
  Center,
  Flex,
  Stack,
  Text,
  useMantineTheme,
} from "@mantine/core";
import { InstituteTheme } from "../../../@types/User";
import { Carousel, Embla, useAnimationOffsetEffect } from "@mantine/carousel";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons";
import { glimpseDescription } from "../../../utilities/HelperFunctions";
import { useMediaQuery } from "@mantine/hooks";
import { Mixpanel } from "../../../utilities/Mixpanel/MixpanelHelper";
import { ParentPageEvents } from "../../../utilities/Mixpanel/AnalyticEventParentApp";
import { useNavigate } from "react-router";
import { useState } from "react";
import { mainPath } from "../../../store/mainPath.slice";

export function NoticesDisplay(props: {
  theme: InstituteTheme;
  notices: Notice[];
  instituteName: string;
  instituteId: string;
  loggedIn: boolean;
  mainPath: string;
}) {
  const theme = useMantineTheme();
  const isMd = useMediaQuery(`(max-width: ${theme.breakpoints.md}px)`);
  const isXl = useMediaQuery(`(max-width: ${theme.breakpoints.xl}px)`);

  const navigate = useNavigate();

  const [embla, setEmbla] = useState<Embla | null>(null);

  const TRANSITION_DURATION = 200;
  useAnimationOffsetEffect(embla, TRANSITION_DURATION);
  return (
    <>
      {props.notices.length > 0 &&
        (props.loggedIn ||
          props.instituteId ===
            "INST-80b15ee3-88cc-4157-8363-eada9f3fa465") && (
          <Stack bg={"white"}>
            <Text
              fw={600}
              ff="Catamaran"
              fz={30}
              align="center"
              c={"red"}
              mt={20}
            >
              Notices
            </Text>
            <Text fw={700} ff="Catamaran" fz={isMd ? 32 : 40} align="center">
              Latest Updates
            </Text>
            <Center w={"100%"} pb={40}>
              <Carousel
                getEmblaApi={setEmbla}
                slideSize={isMd ? "95%" : "33.33333%"}
                slideGap={10}
                loop
                align={
                  isMd
                    ? "center"
                    : props.notices.length < 2
                    ? "center"
                    : "start"
                }
                w={isMd ? "100%" : isXl ? "85%" : "78%"}
                my={20}
                px={isMd ? 20 : 50}
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
                    opacity: isMd ? 0 : 1,
                    "&[data-inactive]": {
                      opacity: 0,
                      cursor: "default",
                    },
                  },
                  indicator: {
                    width: 8,
                    height: 8,
                    backgroundColor: "red",
                  },
                  indicators: {
                    top: "110%",
                  },
                }}
              >
                {props.notices.map((notice, i) => {
                  return (
                    <Carousel.Slide>
                      <Flex
                        h={isXl ? 200 : 150}
                        p={20}
                        direction={"column"}
                        justify="space-between"
                        align="flex-start"
                        style={{
                          border: "1px solid #E9E9E9",
                          borderRadius: 10,
                          backgroundColor: props.theme.backGroundColor,
                        }}
                      >
                        <Text fw={600} fz={16}>
                          {notice.heading}
                        </Text>
                        <Text>
                          {glimpseDescription(notice.Description, 55)}
                        </Text>
                        <Button
                          variant="outline"
                          style={{ borderRadius: "24px" }}
                          fz={16}
                          fw={700}
                          color="dark"
                          onClick={() => {
                            Mixpanel.track(
                              ParentPageEvents.PARENTS_APP_HOME_PAGE_NOTICE_CLICKED,
                              { notice_id: notice._id }
                            );
                            navigate(`/${props.mainPath}/notice/${notice._id}`);
                          }}
                        >
                          View Notice
                        </Button>
                      </Flex>
                    </Carousel.Slide>
                  );
                })}
              </Carousel>
            </Center>
          </Stack>
        )}
    </>
  );
}
