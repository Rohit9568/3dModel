import {
  Box,
  Card,
  Center,
  Grid,
  Group,
  Image,
  LoadingOverlay,
  Text,
  Tooltip,
} from "@mantine/core";
import { FileUploadBox, PdfViewer } from "./FileUploadBox";
import { useState } from "react";
import { Carousel } from "@mantine/carousel";
import {
  IconChevronLeft,
  IconChevronRight,
  IconFileDescription,
} from "@tabler/icons";
import { useMediaQuery } from "@mantine/hooks";
import { Tabs } from "../../pages/_New/Teach";
interface FileUploadCardProps {
  files: { fileName: string; url: string }[] | undefined;
  OnFileDrop: (name: string, url: string) => void;
  notshowImage?: boolean;
  tab: Tabs;
}
export interface ChildRef {
  childDisableShowPdf: () => void;
  tab: Tabs;
}

export function FileUploadAndViewCardForMobile(props: FileUploadCardProps) {
  const [isLoading, setisLoading] = useState<boolean>(false);
  const [showPdf, setShowPdf] = useState<boolean>(false);
  const [currentPdf, setCurrentPdf] = useState<string>();
  return (
    <Box w={"100%"} pl={14}>
      <LoadingOverlay visible={isLoading} />
      <Center>
        <Card
          mb={20}
          w={"100%"}
          bg={"rgba(248, 248, 248, 0.62)"}
          pb={25}
          withBorder
        >
          <Text c={"#3174F3"} fw={600} fz={28} mb={20}>
            Upload Files
          </Text>
          <Group>
            <FileUploadBox
              setisLoading={setisLoading}
              OnSucessfullUpload={(name, url) => props.OnFileDrop(name, url)}
              tab={props.tab}
            />
          </Group>
        </Card>
      </Center>
      <Box w={"92vw"}>
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
                    <IconFileDescription
                      size={75}
                      stroke={1}
                      color={"#737373"}
                    />
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
      </Box>
      {showPdf && (
        <Center mt={30} w={"100%"}>
          <PdfViewer url={currentPdf} 
          showOptions={true}
          
          />
        </Center>
      )}
      {!showPdf && !props.notshowImage && (
        <>
          <Center>
            <Image
              src={require("../../assets/EmptyPdfScreen.png")}
              width={"200px"}
              height={"160px"}
              pb={50}
            />
          </Center>
        </>
      )}
    </Box>
  );
}
export function FileUploadAndViewCardForDesktop(props: FileUploadCardProps) {
  const [isLoading, setisLoading] = useState<boolean>(false);
  const [showPdf, setShowPdf] = useState<boolean>(false);
  const [currentPdf, setCurrentPdf] = useState<string>();
  return (
    <Box w={"100%"}>
      <LoadingOverlay visible={isLoading} />
      <Center>
        <Card
          mb={20}
          w={"100%"}
          bg={"rgba(248, 248, 248, 0.62)"}
          pb={25}
          pl={45}
          withBorder
        >
          <Text c={"#3174F3"} fw={600} fz={28} mb={20}>
            Upload Files
          </Text>
          <Grid w={"100%"} align="center" justify="flex-start" columns={24}>
            <Grid.Col span={10}>
              <Group>
                <FileUploadBox
                  setisLoading={setisLoading}
                  OnSucessfullUpload={(name, url) =>
                    props.OnFileDrop(name, url)
                  }
                  tab={props.tab}
                />
              </Group>
            </Grid.Col>
            <Grid.Col span={14}>
              <Box>
                <Carousel
                  slideSize="33.33%"
                  slideGap={20}
                  loop
                  align={"start"}
                  px={50}
                  nextControlIcon={
                    <IconChevronRight size={75} stroke={1} color="#747474" />
                  }
                  previousControlIcon={
                    <IconChevronLeft size={75} stroke={1} color="#747474" />
                  }
                  styles={{
                    controls: {
                      top: 0,
                      height: "100%",
                      padding: "0px",
                      margin: "0px -10px",
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
                            <IconFileDescription
                              size={75}
                              stroke={1}
                              color={"#737373"}
                            />
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
              </Box>
            </Grid.Col>
          </Grid>
        </Card>
      </Center>
      {showPdf && (
        <Center w={"100%"}>
          <PdfViewer url={currentPdf} 
          showOptions={true}
          
          />
        </Center>
      )}
      {!showPdf && !props.notshowImage && (
        <>
          <Center>
            <Image
              src={require("../../assets/EmptyPdfScreen.png")}
              width={290}
              height={233}
            />
          </Center>
        </>
      )}
    </Box>
  );
}
export function FileUploadAndViewCard(props: FileUploadCardProps) {
  const isMd = useMediaQuery(`(max-width: 820px)`);
  return isMd ? (
    <FileUploadAndViewCardForMobile
      files={props.files}
      OnFileDrop={props.OnFileDrop}
      notshowImage={props.notshowImage}
      tab={props.tab}
    />
  ) : (
    <FileUploadAndViewCardForDesktop
      files={props.files}
      OnFileDrop={props.OnFileDrop}
      notshowImage={props.notshowImage}
      tab={props.tab}
    />
  );
}
