import {
  Box,
  Button,
  Center,
  Flex,
  Stack,
  Text,
  useMantineTheme,
} from "@mantine/core";
import { InstituteTheme } from "../../../@types/User";
import { useMediaQuery } from "@mantine/hooks";
import { Carousel, Embla, useAnimationOffsetEffect } from "@mantine/carousel";
import { useState } from "react";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons";
import { glimpseDescription } from "../../../utilities/HelperFunctions";

export function Testimonials(props: {
  theme: InstituteTheme;
  testimonials: InstituteTestimonial[];
}) {
  const theme = useMantineTheme();
  const isMd = useMediaQuery(`(max-width: ${theme.breakpoints.md}px)`);
  const isXl = useMediaQuery(`(max-width: ${theme.breakpoints.xl}px)`);

  const [embla, setEmbla] = useState<Embla | null>(null);
  const TRANSITION_DURATION = 200;
  useAnimationOffsetEffect(embla, TRANSITION_DURATION);
  return (
    <>
      {props.testimonials.length > 0 && (
        <>
          <Stack pb={20}>
            <Text
              fw={600}
              ff="Catamaran"
              fz={30}
              align="center"
              c={"red"}
              mt={40}
            >
              Testimonials
            </Text>
            <Text fw={700} ff="Catamaran" fz={isMd ? 32 : 40} align="center">
              What Our Client Say's
            </Text>
            <Text fw={700} ff="Catamaran" fz={isMd ? 32 : 40} align="center">
              About Us
            </Text>
            <Center pb={20}>
              <Carousel
                getEmblaApi={setEmbla}
                slideSize={isMd ? "95%" : "33.3%"}
                slideGap={10}
                loop
                align={
                  isMd
                    ? "center"
                    : props.testimonials.length < 2
                    ? "center"
                    : "start"
                }
                px={isMd ? 20 : 50}
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
                  },
                  indicators: {
                    top: "110%",
                  },
                }}
              >
                {props.testimonials.map((testimonial, i) => {
                  const date = new Date(testimonial.createdAt);
                  const day = String(date.getDate()).padStart(2, "0");
                  const month = String(date.getMonth() + 1).padStart(2, "0");
                  const year = date.getFullYear();
                  const formattedDate = `${day}.${month}.${year}`;
                  return (
                    <Carousel.Slide>
                      <Flex
                        mih={isXl ? 200 : 150}
                        p={20}
                        h={"100%"}
                        direction={"column"}
                        justify="space-between"
                        align="flex-start"
                        style={{
                          border: "1px solid #E9E9E9",
                          borderRadius: 10,
                          backgroundColor: props.theme.backGroundColor,
                        }}
                      >
                        <Text fw={900} fz={18} ff={"Inter"} c={"#6F1DF4"}>
                          {testimonial.personName}
                        </Text>
                        <Text fw={500} fz={18} ff={"Inter"}>
                          {glimpseDescription(testimonial.text, 80)}
                        </Text>
                        <Text
                          align="right"
                          w={"100%"}
                          ff={"Inter"}
                          c="#3C3C4380"
                        >
                          {formattedDate}
                        </Text>
                      </Flex>
                    </Carousel.Slide>
                  );
                })}
              </Carousel>
            </Center>
          </Stack>
        </>
      )}
    </>
  );
}
