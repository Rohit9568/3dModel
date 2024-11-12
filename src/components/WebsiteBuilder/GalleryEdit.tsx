import { Carousel } from "@mantine/carousel";
import {
  Box,
  Button,
  Center,
  FileInput,
  Flex,
  Group,
  Modal,
  Stack,
  Text,
  Textarea,
  useMantineTheme,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import Autoplay from "embla-carousel-autoplay";
import { useEffect, useRef, useState } from "react";
import { getMediaType, isHEIC } from "../../utilities/HelperFunctions";
import { IconEdit, IconPlus, IconTrash } from "@tabler/icons";
import { FileUpload } from "../../features/fileUpload/FileUpload";
import {
  AddGallerySection,
  AddSchoolPhoto,
  DeleteGallerySection,
  DeleteGallerySectionImages,
  DeleteSchoolPhotos,
  UpdateGallerySection,
  UpdateGallerySectionData,
} from "../../_parentsApp/features/instituteSlice";
import { showNotification } from "@mantine/notifications";
import { EditPics } from "../AdminPage/HomeSection/EditPics";
import { Mixpanel } from "../../utilities/Mixpanel/MixpanelHelper";
import { WebAppEvents } from "../../utilities/Mixpanel/AnalyticeEventWebApp";
export function GalleryEdit(props: {
  instituteId: string;
  setIsLoading: (val: boolean) => void;
  reloadInstituteData: () => void;
  gallerySections: GallerySection[];
}) {
  const theme = useMantineTheme();
  const isMd = useMediaQuery(`(max-width: ${theme.breakpoints.md}px)`);
  const carouselRef = useRef<any>(null);
  const [value, setValue] = useState<File | null>(null);
  const [isEditPics, setIsEditPics] = useState<string[] | null>(null);
  const [selectedGalery, setSelectedGallery] = useState<string>("");
  const [isAddGallerySection, setisaddgallerySection] =
    useState<boolean>(false);
  const [isEditGallerySection, setisEditgallerySection] =
    useState<boolean>(false);
  const [isDeleteGallerySection, setisDeleteSection] = useState<boolean>(false);
  const autoplay = useRef(Autoplay({ delay: 2000 }));
  const fileRef = useRef<any>();
  async function submitHandler(file: File) {
    props.setIsLoading(true);
    await FileUpload({ file })
      .then((data: any) => {
        UpdateGallerySection({
          id: selectedGalery,
          images: data.url,
        })
          .then((x) => {
            props.reloadInstituteData();
            props.setIsLoading(false);
          })
          .catch((e) => {
            props.setIsLoading(false);

            console.log(e);
          });
      })
      .catch((err) => {
        console.log(err);
      });
  }
  async function addGalerySection() {
    props.setIsLoading(true);
    AddGallerySection({
      id: props.instituteId,
      name: gallerySection.title,
      description: gallerySection.description,
    })
      .then((x) => {
        props.reloadInstituteData();
        props.setIsLoading(false);
      })
      .catch((e) => {
        console.log(e);
        props.setIsLoading(false);
      });
  }
  async function editGalerySection() {
    props.setIsLoading(true);
    UpdateGallerySectionData({
      id: selectedGalery,
      name: gallerySection.title,
      description: gallerySection.description,
    })
      .then((x) => {
        props.reloadInstituteData();
        props.setIsLoading(false);
      })
      .catch((e) => {
        console.log(e);
        props.setIsLoading(false);
      });
  }
  async function deleteGallerySection() {
    props.setIsLoading(true);
    DeleteGallerySection({
      gallerySectionId: selectedGalery,
      id: props.instituteId,
    })
      .then((x) => {
        props.reloadInstituteData();
        props.setIsLoading(false);
      })
      .catch((e) => {
        console.log(e);
        props.setIsLoading(false);
      });
  }

  async function deleteGallerySectionImages(imgs: string[]) {
    setIsEditPics(null);
    props.setIsLoading(true);
    DeleteGallerySectionImages({ id: selectedGalery, images: imgs })
      .then((x) => {
        props.reloadInstituteData();
        props.setIsLoading(false);
      })
      .catch((e) => {
        console.log(e);
        props.setIsLoading(false);
      });
  }
  useEffect(() => {
    if (value !== null) {
      const isError = isHEIC(value);
      const isSizeValid = value.size <= 50 * 1024 * 1024;
      if (isError) {
        showNotification({ message: "File Format not supported" });
      } else if (!isSizeValid) {
        showNotification({
          message: "Maximum Size should be 5mb",
          color: "red",
        });
      } else {
        submitHandler(value);
      }
    }
  }, [value]);

  const [gallerySection, setgallerysection] = useState<{
    title: string;
    description: string;
  }>({
    title: "",
    description: "",
  });

  return (
    <>
      <Stack>
        <Flex align="center">
          <Text fz={isMd ? 28 : 40} fw={700}>
            Gallery
          </Text>
          <Button
            variant={"outline"}
            color="dark"
            radius={50}
            onClick={() => {
              setgallerysection({
                title: "",
                description: "",
              });
              setisaddgallerySection(true);
            }}
            ml={10}
          >
            Add Section
          </Button>
        </Flex>
        {props.gallerySections.map((x) => {
          return (
            <Stack>
              <Flex
                justify="space-between"
                style={{
                  border: "dashed 1px black",
                  borderRadius: "5px",
                }}
                align="start"
                px={10}
                py={10}
              >
                <Stack>
                  <Text fz={20} fw={600}>
                    {x.name}
                  </Text>
                  <Text fz={16} fw={500}>
                    {x.description}
                  </Text>
                </Stack>
                <Flex>
                  <Box
                    style={{
                      border: "1px solid black",
                      borderRadius: "50%",
                      cursor: "pointer",
                    }}
                    mx={20}
                    w={48}
                    h={48}
                    onClick={() => {
                      setisEditgallerySection(true);
                      setgallerysection({
                        title: x.name,
                        description: x.description,
                      });
                      setSelectedGallery(x._id);
                    }}
                  >
                    <Center h={"100%"}>
                      <IconEdit />
                    </Center>
                  </Box>
                  <Box
                    style={{
                      border: "1px solid black",
                      borderRadius: "50%",
                      cursor: "pointer",
                    }}
                    mx={20}
                    w={48}
                    h={48}
                    onClick={() => {
                      setisDeleteSection(true);
                      setSelectedGallery(x._id);
                    }}
                  >
                    <Center h={"100%"}>
                      <IconTrash />
                    </Center>
                  </Box>
                </Flex>
              </Flex>
              <Flex
                w={"100%"}
                bg={"white"}
                style={{ border: "2px dashed #BEBEBE", borderRadius: 7 }}
                direction={"column"}
              >
                {x.resources.length !== 0 && (
                  <>
                    <Center p={25}>
                      {x.resources.length !== 0 && isMd && (
                        <Carousel
                          // mx="auto"
                          withIndicators
                          height={isMd ? "30vh" : "40vh"}
                          loop
                          // plugins={[autoplay.current]}
                          // onMouseEnter={autoplay.current.stop}
                          // onMouseLeave={autoplay.current.reset}
                          // onClick={autoplay.current.stop}
                          w={"90%"}
                          ref={carouselRef}
                          style={{
                            minHeight: "25vh",
                          }}
                          slideSize={isMd ? "100%" : "50%"}
                        >
                          {x.resources.map((url, index) => {
                            const mediaType = getMediaType(url);
                            return (
                              <Carousel.Slide key={index}>
                                {mediaType === "image" && (
                                  <Center h="100%" w="100%">
                                    <img
                                      src={url}
                                      alt={`Slide ${index + 1}`}
                                      style={{
                                        // width: isMd?"auto":"auto",
                                        // maxWidth:'100%',
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
                      {x.resources.length !== 0 && !isMd && (
                        <Carousel
                          // mx="auto"
                          withIndicators
                          height={isMd ? "30vh" : "40vh"}
                          loop
                          // plugins={[autoplay.current]}
                          // onMouseEnter={autoplay.current.stop}
                          // onMouseLeave={autoplay.current.reset}
                          // onClick={autoplay.current.stop}
                          w={"90%"}
                          ref={carouselRef}
                          style={{
                            minHeight: "25vh",
                          }}
                          slideSize={isMd ? "100%" : "50%"}
                        >
                          {x.resources.map((url, index) => {
                            const mediaType = getMediaType(url);
                            return (
                              <Carousel.Slide key={index} w={"100%"}>
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
                    </Center>
                    <Flex
                      w={"100%"}
                      justify={"center"}
                      gap={"lg"}
                      align={"center"}
                      pt={20}
                      pb={30}
                    >
                      <Box
                        style={{
                          border: "1px solid black",
                          borderRadius: "50%",
                          cursor: "pointer",
                        }}
                        mx={20}
                        w={48}
                        h={48}
                        onClick={() => {
                          setSelectedGallery(x._id);
                          setIsEditPics(x.resources);
                        }}
                      >
                        <Center h={"100%"}>
                          <IconEdit />
                        </Center>
                      </Box>
                      <Box
                        style={{
                          borderRadius: "50%",
                          cursor: "pointer",
                        }}
                        mx={20}
                        w={48}
                        h={48}
                        bg={"#4B65F6"}
                        onClick={() => {
                          setSelectedGallery(x._id);
                          fileRef.current.click();
                        }}
                      >
                        <Center h={"100%"}>
                          <IconPlus color="white" />
                        </Center>
                      </Box>
                    </Flex>
                  </>
                )}
                {x.resources.length === 0 && (
                  <>
                    <Center h={"100%"} mih={isMd ? 200 : 400}>
                      <Stack p={20} align="center">
                        <Text align="center" fz={isMd ? 18 : 24} fw={500}>
                          Add snippets of moments that are
                          <br /> captured at your institute.
                        </Text>
                        <Flex>
                          <Button
                            style={{ background: "#4B65F6" }}
                            onClick={() => {
                              fileRef.current.click();
                              setSelectedGallery(x._id);
                            }}
                          >
                            <Center h={"100%"}>Add Image</Center>
                          </Button>
                        </Flex>
                      </Stack>
                    </Center>
                  </>
                )}
              </Flex>
            </Stack>
          );
        })}
      </Stack>
      <FileInput
        id="fileInput"
        ref={fileRef}
        value={value}
        accept="image/*,video/*"
        onChange={(x) => {
          setValue(x);
        }}
        style={{ display: "none" }}
      />
      <Modal
        fullScreen
        zIndex={999}
        opened={isEditPics !== null}
        onClose={() => setIsEditPics(null)}
        styles={{
          close: {
            marginRight: 20,
            marginTop: 10,
            transform: "scale(2)",
            "&:active": {
              transform: "scale(2)",
            },
          },
        }}
      >
        {isEditPics !== null && (
          <EditPics
            instituteId={props.instituteId}
            pics={isEditPics}
            onDeleteClick={(data) => {
              deleteGallerySectionImages(data);
            }}
            onBackClick={() => {
              setIsEditPics(null);
            }}
          ></EditPics>
        )}
      </Modal>
      <Modal
        opened={isAddGallerySection || isEditGallerySection}
        onClose={() => {
          setisaddgallerySection(false);
          setisEditgallerySection(false);
        }}
        centered
      >
        <Text>Title</Text>
        <Textarea
          value={gallerySection.title}
          autosize
          onChange={(event) =>
            setgallerysection({
              ...gallerySection,
              title: event.currentTarget.value,
            })
          }
        />
        <Text>Description</Text>
        <Textarea
          value={gallerySection.description}
          autosize
          onChange={(event) =>
            setgallerysection({
              ...gallerySection,
              description: event.currentTarget.value,
            })
          }
        />
        <Group position="right" mt={20}>
          <Button
            variant="outline"
            color="dark"
            fw={700}
            radius={50}
            onClick={() => setisaddgallerySection(false)}
          >
            Cancel
          </Button>
          <Button
            fw={700}
            radius={50}
            sx={{
              backgroundColor: "#4B65F6",
              "&:hover": {
                backgroundColor: "#3C51C5",
              },
            }}
            onClick={() => {
              if (isEditGallerySection) {
                editGalerySection();
              } else {
                addGalerySection();
              }
              setisaddgallerySection(false);
              setisEditgallerySection(false);
            }}
          >
            Submit
          </Button>
        </Group>
      </Modal>
      <Modal
        opened={isDeleteGallerySection}
        onClose={() => setisDeleteSection(false)}
        centered
        zIndex={999}
        styles={{
          title: {
            fontSize: 20,
            fontWeight: 700,
          },
        }}
      >
        <Text fw={500} fz={20} align="center">
          Are you sure you want to delete this gallery Section?
        </Text>
        <Group position="center" mt={20}>
          <Button
            variant="outline"
            color="dark"
            fw={700}
            radius={50}
            onClick={() => {
              setisDeleteSection(false);
            }}
          >
            Cancel
          </Button>
          <Button
            fw={700}
            radius={50}
            style={{ background: "red " }}
            onClick={() => {
              setisDeleteSection(false);
              deleteGallerySection();
            }}
          >
            Delete
          </Button>
        </Group>
      </Modal>
    </>
  );
}
