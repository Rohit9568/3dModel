import { Carousel } from "@mantine/carousel";
import { Box, Center, Divider, Text, useMantineTheme } from "@mantine/core";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons";
import { useEffect, useState } from "react";
import { format, isToday } from "date-fns";
import { useMediaQuery } from "@mantine/hooks";

export function add30Days() {
  const currentDate = new Date();
  const datesArray = [];

  for (let i = 0; i < 31; i++) {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + i);
    datesArray.push(newDate);
  }
  return datesArray;
}
export function CalenderTimeline(props: {
  onClick: (date: Date) => void;
  selectedDate: Date;
  datesarray: Date[];
}) {
  const [thirtyDates, setThirtyDates] = useState<Date[]>([]);
  useEffect(() => {
    setThirtyDates(props.datesarray);
  }, []);
  const theme = useMantineTheme();
  const isMd = useMediaQuery(`(max-width: ${theme.breakpoints.md}px)`);
  return (
    <Carousel
      getEmblaApi={() => {}}
      slideGap={10}
      align={"start"}
      w={"100%"}
      py={"4%"}
      loop
      nextControlIcon={
        <Box
          w={"45%"}
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: "4px",
            marginTop: isMd ? "-180px" : "-220px",
          }}
        >
          <IconChevronRight size={60} stroke={1} color="#747474" />
        </Box>
      }
      previousControlIcon={
        <Box
          w={"45%"}
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: "4px",
            marginTop: isMd ? "-180px" : "-220px",
          }}
        >
          <IconChevronLeft size={60} stroke={1} color="#747474" />
        </Box>
      }
      styles={{
        root: {
          maxWidth: "100%",
          margin: 0,
        },
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
      m={0}
      slideSize={isMd ? "20px" : "50px"}
    >
      {thirtyDates.map((date) => (
        <Carousel.Slide>
          <Box
            key={date.getTime()}
            onClick={() => {
              props.onClick(date);
            }}
            m={5}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Box
              style={{
                borderRadius: "48%",
                width: "48px",
                height: "74px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor:
                  props.selectedDate.getTime() === date.getTime()
                    ? "#4B65F6"
                    : "#f0f0f0",
                cursor: "pointer",
              }}
            >
              <Text
                fz={16}
                fw={700}
                style={{
                  color:
                    props.selectedDate.getTime() === date.getTime()
                      ? "#FFFFFF"
                      : "#949494",
                }}
              >
                {format(date, "EE").charAt(0)}
              </Text>
              <Text
                fz={16}
                fw={700}
                style={{
                  color:
                    props.selectedDate.getTime() === date.getTime()
                      ? "#FFFFFF"
                      : "#949494",
                }}
              >
                {format(date, "dd")}
              </Text>
            </Box>
          </Box>
        </Carousel.Slide>
      ))}
      <Carousel.Slide
        style={{
          width: "30px",
        }}
      >
        <Center
          style={{
            height: "100%",
          }}
        >
          <Divider color="#4B65F6" size="md" orientation="vertical" />
        </Center>
      </Carousel.Slide>
    </Carousel>
  );
}
