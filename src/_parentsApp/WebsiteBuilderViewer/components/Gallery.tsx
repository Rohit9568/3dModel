import {
  Box,
  Center,
  Divider,
  Flex,
  Image,
  Modal,
  ScrollArea,
  SimpleGrid,
  Stack,
  Text,
  useMantineTheme,
} from "@mantine/core";
import { InstituteTheme } from "../../../@types/User";
import { useMediaQuery } from "@mantine/hooks";
import { Carousel, Embla, useAnimationOffsetEffect } from "@mantine/carousel";
import { useEffect, useState } from "react";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons";
import { getMediaType } from "../../../utilities/HelperFunctions";

export function Gallery(props: {
  theme: InstituteTheme;
  gallerySections: GallerySection[];
}) {
  const theme = useMantineTheme();
  const isMd = useMediaQuery(`(max-width: ${theme.breakpoints.md}px)`);
  const isLg = useMediaQuery(`(max-width: ${theme.breakpoints.lg}px)`);
  const isXl = useMediaQuery(`(max-width: ${theme.breakpoints.xl}px)`);

  const [photoChunks, setPhotoChuck] = useState<string[][]>([]);
  const [chunkSize, setChunkSize] = useState<number>(6);
  const [selectedGallerySection, setselectedGallerySection] =
    useState<GallerySection>(props.gallerySections[0]);
  const [embla, setEmbla] = useState<Embla | null>(null);
  const TRANSITION_DURATION = 200;
  useAnimationOffsetEffect(embla, TRANSITION_DURATION);
  const [showSlide, setSlideShow] = useState<{
    gallerySection: GallerySection;
    index: number;
  } | null>(null);
  useEffect(() => {
    let pc = [];
    for (
      let i = 0;
      i < selectedGallerySection.resources.length;
      i += chunkSize
    ) {
      const chunk = selectedGallerySection.resources.slice(i, i + chunkSize);
      pc.push(chunk);
    }
    if (pc.length === 0) {
      pc.push([
        "https://vignam-content-images.s3.amazonaws.com/2024-01-01T20-16-16-971Z.jpg",
      ]);
    }
    setPhotoChuck(pc);
  }, [selectedGallerySection, chunkSize]);
  useEffect(() => {
    if (isMd) setChunkSize(1);
    else setChunkSize(6);
  }, [isMd]);
  return (
    <>
      <Stack
        id="parent-gallery"
        bg={props.theme.backGroundColor}
        pt={20}
        pb={50}
        spacing={0}
        align="center"
      >
        <Text align="center" fw={600} fz={30} ff="Catamaran" c={"red"}>
          Gallery
        </Text>

        <ScrollArea w="100%" pb={20}>
          <Flex w="100%" justify="center" align="end">
            {props.gallerySections.map((x) => {
              return (
                <Stack
                  mx={isMd ? 12 : 15}
                  spacing={isMd ? 1 : 2}
                  onClick={() => {
                    setselectedGallerySection(x);
                  }}
                  style={{
                    cursor: "pointer",
                  }}
                >
                  <Text
                    align="center"
                    // fw={}
                    fz={isMd ? 20 : 40}
                    ff="Catamaran"
                    color={
                      selectedGallerySection._id === x._id ? "black" : "gray"
                    }
                    fw={800}
                  >
                    {x.name}
                  </Text>
                  {selectedGallerySection._id === x._id && (
                    <Divider
                      color={props.theme.primaryColor}
                      size="lg"
                    ></Divider>
                  )}
                </Stack>
              );
            })}
          </Flex>
        </ScrollArea>
        <Flex w={isXl ? "90%" : "75%"} px={isMd ? 20 : 50}>
          <Text fz={isMd ? 16 : 20} px={isMd ? 13 : 20}>
            {selectedGallerySection.description}
          </Text>
        </Flex>
        <Center mt={30}>
          <Carousel
            slideSize={"100%"}
            slideGap={10}
            loop
            align={isMd ? "center" : "start"}
            px={isMd ? 20 : 50}
            w={isXl ? "90%" : "75%"}
            getEmblaApi={setEmbla}
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
                top: isMd ? "110%" : "101%",
              },
            }}
            style={{
              flexDirection: "column",
              display: "flex",
            }}
          >
            {photoChunks.map((x: any) => {
              return (
                <>
                  <Carousel.Slide>
                    <Center>
                      <SimpleGrid cols={isMd ? 1 : isLg ? 2 : 3}>
                        {x.map((url: string) => {
                          const mediaType = getMediaType(url);
                          return (
                            <Center
                              w="100%"
                              mah={300}
                              onClick={() => {
                                setSlideShow({
                                  gallerySection: selectedGallerySection,
                                  index:
                                    selectedGallerySection.resources.indexOf(
                                      url
                                    ),
                                });
                              }}
                              style={{
                                cursor: "pointer",
                              }}
                            >
                              {mediaType === "image" && (
                                <img
                                  src={url}
                                  style={{
                                    maxWidth: "100%",
                                    maxHeight: "100%",
                                    borderRadius: "16px",
                                    objectFit: "cover",
                                    objectPosition: "center",
                                    textAlign: "center",
                                  }}
                                />
                              )}
                              {mediaType === "video" && (
                                <div
                                  style={{
                                    borderRadius: "16px",
                                    overflow: "hidden",
                                    width: "100%",
                                    height: "100%",
                                  }}
                                >
                                  <video
                                    width="100%"
                                    height="100%"
                                    loop
                                    style={{
                                      objectFit: "cover",
                                    }}
                                  >
                                    <source src={url} type="video/mp4" />
                                  </video>
                                </div>
                              )}
                            </Center>
                          );
                        })}
                      </SimpleGrid>
                    </Center>
                  </Carousel.Slide>
                </>
              );
            })}
          </Carousel>
        </Center>
      </Stack>
      <Modal
        opened={showSlide !== null}
        onClose={() => setSlideShow(null)}
        size="xl"
        centered
      >
        <Stack>
          {showSlide !== null && (
            <Carousel
              slideSize={"100%"}
              slideGap={10}
              loop
              align={isMd ? "center" : "start"}
              px={isMd ? 20 : 50}
              w="100%"
              my={20}
              withIndicators
              getEmblaApi={setEmbla}
              initialSlide={showSlide.index}
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
                  top: isMd ? "110%" : "101%",
                },
              }}
              style={{
                flexDirection: "column",
                display: "flex",
              }}
            >
              {showSlide.gallerySection.resources.map((url, index) => {
                const mediaType = getMediaType(url);
                return (
                  <Carousel.Slide key={index}>
                    {mediaType === "image" && (
                      <Center h="100%" w="100%">
                        <img
                          src={url}
                          alt={`Slide ${index + 1}`}
                          style={{
                            maxWidth: "100%",
                            maxHeight: "100%",
                            height: isMd ? "auto" : "auto",
                            borderRadius: "16px",
                            objectFit: "cover",
                            objectPosition: "center",
                            textAlign: "center",
                          }}
                        />
                      </Center>
                    )}
                    {mediaType === "video" && (
                      <div
                        style={{
                          borderRadius: "16px",
                          overflow: "hidden",
                          width: "100%",
                          height: "100%",
                        }}
                      >
                        <video
                          width="100%"
                          height="100%"
                          autoPlay
                          muted
                          loop
                          style={{
                            objectFit: "cover",
                          }}
                        >
                          <source src={url} type="video/mp4" />
                        </video>
                      </div>
                    )}
                  </Carousel.Slide>
                );
              })}
            </Carousel>
          )}
        </Stack>
      </Modal>
    </>
  );
}
