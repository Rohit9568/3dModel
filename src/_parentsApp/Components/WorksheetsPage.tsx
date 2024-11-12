import { Carousel } from "@mantine/carousel";
import { Box, Center, Image, Stack, Text, Tooltip } from "@mantine/core";
import {
  IconChevronLeft,
  IconChevronRight,
  IconFileDescription,
} from "@tabler/icons";
import { useState } from "react";
import { PdfViewer } from "../../components/_New/FileUploadBox";

interface WorksheetPageProps {
  files: { fileName: string; url: string }[] | undefined;
}
export function WorksheetPage(props: WorksheetPageProps) {
  const [showPdf, setShowPdf] = useState<boolean>(false);
  const [currentPdf, setCurrentPdf] = useState<string>();
  return (
    <Stack w={"85vw"}>
      <Carousel
        slideSize="20%"
        slideGap={5}
        loop
        align={"start"}
        px={50}
        nextControlIcon={
          <Box
            bg={"#EAEAEA"}
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
            bg={"#EAEAEA"}
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
        }}
      >
        {props.files &&
          props.files.map((x, i) => {
            const col = x.url === currentPdf ? "#3174F3" : "black";
            return (
              <Carousel.Slide
                onClick={() => {
                  setCurrentPdf(x.url);
                  setShowPdf(true);
                }}
                style={{ cursor: "pointer" }}
                key={i}
              >
                <Center
                  h={150}
                  p={5}
                  style={{
                    border: `1px solid ${col}`,
                    borderRadius: "4px",
                  }}
                  bg={"white"}
                >
                  <IconFileDescription size={75} stroke={1} color={"#737373"} />
                </Center>
                <Tooltip label={x.fileName}>
                  <Box
                    mt={4}
                    bg="white"
                    p={4}
                    style={{
                      border: `1px solid ${col}`,
                      borderRadius: "4px",
                    }}
                  >
                    <Text
                      fw={500}
                      h={25}
                      c={col}
                      style={{
                        overflow: "hidden",
                      }}
                    >
                      <Center>{x.fileName}</Center>
                    </Text>
                  </Box>
                </Tooltip>
              </Carousel.Slide>
            );
          })}
      </Carousel>
      {showPdf && (
        <Center w={"100%"}>
          <PdfViewer url={currentPdf} showOptions={false} />
        </Center>
      )}
      {!showPdf && (
        <>
          <Center w="100%" h="100%">
            <Image
              src={require("../../assets/EmptyPdfScreen.png")}
              width={290}
              height={233}
            />
          </Center>
        </>
      )}
    </Stack>
  );
}
