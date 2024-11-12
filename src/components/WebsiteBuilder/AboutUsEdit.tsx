import { Carousel, Embla } from "@mantine/carousel";
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
  TextInput,
  Textarea,
  useMantineTheme,
} from "@mantine/core";
import { useMediaQuery, useScrollIntoView } from "@mantine/hooks";
import {
  IconChevronLeft,
  IconChevronRight,
  IconCross,
  IconEdit,
  IconPlus,
  IconX,
} from "@tabler/icons";
import { useEffect, useRef, useState } from "react";
import {
  UpdateInstituteAboutUsDescription,
  UpdateInstituteAboutUsHeading,
  UpdateInstituteAboutUsImages,
  UpdateInstituteAboutUsPoints,
} from "../../features/websiteBuilder/websiteBuilderSlice";
import { EditPics } from "../AdminPage/HomeSection/EditPics";
import { isHEIC } from "../../utilities/HelperFunctions";
import { showNotification } from "@mantine/notifications";
import { FileUpload } from "../../features/fileUpload/FileUpload";
import { probablySupportsClipboardReadText } from "@excalidraw/excalidraw/types/clipboard";
import { Mixpanel } from "../../utilities/Mixpanel/MixpanelHelper";
import { WebAppEvents } from "../../utilities/Mixpanel/AnalyticeEventWebApp";
import SubSections from "./SubSections";
import { instituteDetails } from "../../store/instituteDetailsSlice";

export function AboutUsEdit(props: {
  instituteId: string;
  instituteName: string;
  aboutUs: string;
  aboutUsDetails: { heading: string; points: string[] };
  aboutUsImages: string[];
  setIsLoading: (val: boolean) => void;
  reloadInstituteData: () => void;
  instituteDetail: InstituteWebsiteDisplay;
}) {
  const theme = useMantineTheme();
  const isMd = useMediaQuery(`(max-width: ${theme.breakpoints.md}px)`);
  const [embla, setEmbla] = useState<Embla | null>(null);
  const TRANSITION_DURATION = 200;

  const [isEditPics, setIsEditPics] = useState<boolean>(false);
  const [state, setState] = useState<number>(props.instituteDetail.SubSection.length);
  // console.log(state);
  const [aboutUsHeadingModal, setAboutUsHeadingModal] =
    useState<boolean>(false);
  const [headingModalText, setheadingModalText] = useState<string>(
    props.aboutUsDetails?.heading || props.instituteName
  );
  const [aboutUsDescriptionModal, setAboutUsDescriptionEditModal] =
    useState<boolean>(false);
  const [descriptionModalText, setdescriptionModalText] = useState<string>(
    props.aboutUs
  );
  const handleDelete = () => {
    setState((prevCount) => prevCount - 1);
  };
  const sectionRef = useRef<any>(null); // Specify the type of the ref explicitly

  // Function to scroll to the section
  const scrollToSection = () => {
    if (sectionRef && sectionRef.current) {
      sectionRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };
   useEffect(() => {
    if(state != props.instituteDetail.SubSection.length)
    scrollToSection();
   }, [state]);

  // Scroll to the section when the component mounts
  const componentsArray = Array.from({ length: state }, (_, index) => (
    <SubSections
      ref={sectionRef}
      index={index}
      instituteName={props.instituteDetail.SubSection[index]?.heading || ""}
      Points={props.instituteDetail.SubSection[index]?.points || [""]}
      aboutUs={props.instituteDetail.SubSection[index]?.desc || ""}
      aboutUsDetails={props.aboutUsDetails}
      aboutUsImages={props.instituteDetail.SubSection[index]?.img || []}
      instituteId={props.instituteId}
      subSectionId={props.instituteDetail.SubSection[index]?._id || ""}
      setIsLoading={props.setIsLoading}
      reloadInstituteData={props.reloadInstituteData}
      handleDelete={handleDelete}
    ></SubSections>
  ));
  const [aboutUsPointsModal, setAboutUsModalPoints] = useState<boolean>(false);
  const [aboutUsPoints, setAboutUsPoints] = useState<string[]>(
    props.aboutUsDetails?.points || []
  );
 
  function updateHeading() {
    props.setIsLoading(true);
    UpdateInstituteAboutUsHeading({
      id: props.instituteId,
      heading: headingModalText,
    })
      .then(() => {
        Mixpanel.track(
          WebAppEvents.WEBSITE_BUILDER_ABOUT_US_SUBMIT_BUTTON_CLICKED,
          {
            type: "Heading",
          }
        );
        props.reloadInstituteData();
        props.setIsLoading(false);
      })
      .catch((e) => {
        props.setIsLoading(false);
        console.log(e);
      });
  }

  function updateAboutUs() {
    props.setIsLoading(true);
    UpdateInstituteAboutUsDescription({
      id: props.instituteId,
      text: descriptionModalText,
    })
      .then(() => {
        Mixpanel.track(
          WebAppEvents.WEBSITE_BUILDER_ABOUT_US_SUBMIT_BUTTON_CLICKED,
          {
            type: "Description",
          }
        );
        props.reloadInstituteData();
        props.setIsLoading(false);
      })
      .catch((e) => {
        props.setIsLoading(false);
        console.log(e);
      });
  }

  function updateAboutUsPoints() {
    props.setIsLoading(true);
    UpdateInstituteAboutUsPoints({
      id: props.instituteId,
      points: aboutUsPoints,
    })
      .then(() => {
        Mixpanel.track(
          WebAppEvents.WEBSITE_BUILDER_ABOUT_US_SUBMIT_BUTTON_CLICKED,
          {
            type: "points",
          }
        );
        props.reloadInstituteData();
        props.setIsLoading(false);
      })
      .catch((e) => {
        props.setIsLoading(false);
        console.log(e);
      });
  }

  useEffect(() => {
    if (aboutUsDescriptionModal) setdescriptionModalText(props.aboutUs);
    if (aboutUsHeadingModal)
      setheadingModalText(props.aboutUsDetails?.heading || props.instituteName);
  }, [aboutUsDescriptionModal, aboutUsHeadingModal]);
  //image upload
  const fileRef = useRef<any>();
  const [imageUploadFile, setImageUploadFile] = useState<File | null>(null);
  useEffect(() => {
    if (imageUploadFile !== null) {
      const isError = isHEIC(imageUploadFile);
      const isSizeValid = imageUploadFile.size <= 50 * 1024 * 1024;
      if (isError) {
        showNotification({ message: "File Format not supported" });
      } else if (!isSizeValid) {
        showNotification({
          message: "Maximum Size should be 5mb",
          color: "red",
        });
      } else {
        submitHandler(imageUploadFile);
      }
    }
  }, [imageUploadFile]);
  async function submitHandler(file: File) {
    props.setIsLoading(true);
    await FileUpload({ file })
      .then((data: any) => {
        const newImages = [...props.aboutUsImages, data.url];
        UpdateInstituteAboutUsImages({
          id: props.instituteId,
          imageUrls: newImages,
        })
          .then(() => {
            props.setIsLoading(false);
            props.reloadInstituteData();
            setImageUploadFile(null);
          })
          .catch((err) => {
            props.setIsLoading(false);
            console.log(err);
          });
      })

      .catch((err) => {
        props.setIsLoading(false);
        console.log(err);
      });
  }
 
  return (
    <>
      <Stack>
        <Group>
          <Text fz={isMd ? 28 : 40} fw={700}>
            About Us
          </Text>
          <Button
            variant={"outline"}
            color="dark"
            radius={50}
            onClick={() => {
              setState((prevCount) => prevCount + 1);
             
            }}
          >
            Add section
          </Button>
        </Group>

        <Flex
          w={"100%"}
          p={"3%"}
          fw={500}
          fz={18}
          bg={"white"}
          style={{ border: "2px dashed #BEBEBE", borderRadius: 7 }}
          justify={"space-between"}
          direction={isMd ? "column" : "row"}
          align={"center"}
          gap={20}
        >
          <Box
            w={isMd ? "96%" : "48%"}
            h={"100%"}
            p={20}
            style={{ border: "1px solid #CBCDD7", borderRadius: 8 }}
            mt={isMd ? 20 : 0}
          >
            {props.aboutUsImages.length > 0 && (
              <>
                <Carousel
                  getEmblaApi={setEmbla}
                  slideSize={"95%"}
                  slideGap={10}
                  align={"center"}
                  w={"100%"}
                  px={"5%"}
                  py={"4%"}
                  loop
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
                      "&[data-inactive]": {
                        opacity: 0,
                        cursor: "default",
                      },
                    },
                  }}
                  m={0}
                >
                  {props.aboutUsImages.map((imageUrl, i) => {
                    return (
                      <Carousel.Slide>
                        <Center h={"100%"}>
                          <img
                            src={imageUrl}
                            style={{
                              width: "100%",
                              objectFit: "cover",
                              objectPosition: "center",
                            }}
                          ></img>
                        </Center>
                      </Carousel.Slide>
                    );
                  })}
                </Carousel>

                <Center mt={10}>
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
                      setIsEditPics(true);
                    }}
                  >
                    <Center h={"100%"}>
                      <IconEdit />
                    </Center>
                  </Box>
                  {props.aboutUsImages.length < 3 && (
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
                        fileRef.current.click();
                      }}
                    >
                      <Center h={"100%"}>
                        <IconPlus color="white" />
                      </Center>
                    </Box>
                  )}
                </Center>
              </>
            )}
            {props.aboutUsImages.length === 0 && (
              <Center mih={300}>
                <Stack align="center">
                  <Text>Add Images</Text>
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
                      fileRef.current.click();
                    }}
                  >
                    <Center h={"100%"}>
                      <IconPlus color="white" />
                    </Center>
                  </Box>
                </Stack>
              </Center>
            )}
          </Box>
          <Stack w={isMd ? "96%" : "48%"}>
            <Group>
              <Text>Heading Text</Text>
              <IconEdit
                style={{ cursor: "pointer" }}
                onClick={() => {
                  setAboutUsHeadingModal(true);
                }}
              ></IconEdit>
            </Group>
            <Text
              p={10}
              fz={16}
              fw={500}
              style={{ borderRadius: 8, border: "1px solid #CBCDD7" }}
              h={"100%"}
              mih={40}
              onClick={() => {
                setAboutUsHeadingModal(true);
              }}
            >
              {props.aboutUsDetails?.heading || props.instituteName}
            </Text>
            <Group>
              <Text>Description</Text>
              <IconEdit
                style={{ cursor: "pointer" }}
                onClick={() => {
                  setAboutUsDescriptionEditModal(true);
                }}
              ></IconEdit>
            </Group>
            <Text
              p={15}
              fz={16}
              fw={500}
              style={{ borderRadius: 8, border: "1px solid #CBCDD7" }}
              h={"100%"}
              mih={40}
              onClick={() => {
                setAboutUsDescriptionEditModal(true);
              }}
            >
              {props.aboutUs}
            </Text>
            <Flex>
              <Flex
                gap={10}
                style={{ cursor: "pointer" }}
                onClick={() => setAboutUsModalPoints(true)}
              >
                <Center
                  bg={"#4FDA43"}
                  c={"white"}
                  style={{ borderRadius: "50%" }}
                  w={20}
                  h={20}
                >
                  <IconPlus width={15} />
                </Center>
                <Center h={"100%"}>
                  <Text fz={12} fw={400} c={"#4B65F6"}>
                    Add Points
                  </Text>
                </Center>
              </Flex>
            </Flex>
          </Stack>
        </Flex>
      </Stack>
      <Modal
        opened={aboutUsHeadingModal}
        onClose={() => setAboutUsHeadingModal(false)}
        centered
        zIndex={999}
        title={"Change Heading"}
        styles={{
          title: {
            fontSize: 20,
            fontWeight: 700,
          },
        }}
      >
        <TextInput
          value={headingModalText}
          onChange={(event) => setheadingModalText(event.currentTarget.value)}
        ></TextInput>
        <Group position="right" mt={20}>
          <Button
            variant="outline"
            color="dark"
            fw={700}
            radius={50}
            onClick={() => setAboutUsHeadingModal(false)}
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
              setAboutUsHeadingModal(false);
              updateHeading();
            }}
          >
            Submit
          </Button>
        </Group>
      </Modal>

      <Modal
        opened={aboutUsDescriptionModal}
        onClose={() => setAboutUsDescriptionEditModal(false)}
        centered
        zIndex={999}
        title={"Change About Us"}
        styles={{
          title: {
            fontSize: 20,
            fontWeight: 700,
          },
        }}
      >
        <Textarea
          autosize
          value={descriptionModalText}
          onChange={(event) =>
            setdescriptionModalText(event.currentTarget.value)
          }
        ></Textarea>
        <Group position="right" mt={20}>
          <Button
            variant="outline"
            color="dark"
            fw={700}
            radius={50}
            onClick={() => setAboutUsDescriptionEditModal(false)}
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
              setAboutUsDescriptionEditModal(false);
              updateAboutUs();
            }}
          >
            Submit
          </Button>
        </Group>
      </Modal>
      <Modal
        fullScreen
        zIndex={999}
        opened={isEditPics}
        onClose={() => setIsEditPics(false)}
      >
        <EditPics
          pics={props.aboutUsImages}
          onDeleteClick={(data) => {
            const leftImages = props.aboutUsImages.filter((img) => {
              return !data.includes(img);
            });
            UpdateInstituteAboutUsImages({
              id: props.instituteId,
              imageUrls: leftImages,
            })
              .then((x: any) => {
                setIsEditPics(false);
                props.reloadInstituteData();
              })
              .catch((e) => {
                console.log(e);
              });
          }}
          onBackClick={() => {
            setIsEditPics(false);
          }}
        ></EditPics>
      </Modal>
      <Modal
        opened={aboutUsPointsModal}
        onClose={() => setAboutUsModalPoints(false)}
        centered
        zIndex={999}
        title={"Add Points"}
        styles={{
          title: {
            fontSize: 20,
            fontWeight: 700,
          },
        }}
      >
        <Stack>
          {aboutUsPoints.map((x, index) => {
            return (
              <>
                <Flex align={"center"}>
                  <TextInput
                    value={x}
                    onChange={(event) => {
                      aboutUsPoints[index] = event.currentTarget.value;
                      setAboutUsPoints([...aboutUsPoints]);
                    }}
                  />
                  <IconX
                    onClick={() => {
                      setAboutUsPoints(aboutUsPoints.filter((val) => val != x));
                    }}
                  />
                </Flex>
              </>
            );
          })}
          <Flex>
            <Button
              onClick={() => {
                setAboutUsPoints([...aboutUsPoints, ""]);
              }}
              sx={{
                backgroundColor: "#4B65F6",
                "&:hover": {
                  backgroundColor: "#3C51C5",
                },
              }}
            >
              Add Point
            </Button>
          </Flex>
        </Stack>

        <Group position="right" mt={20}>
          <Button
            variant="outline"
            color="dark"
            fw={700}
            radius={50}
            onClick={() => setAboutUsModalPoints(false)}
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
              setAboutUsModalPoints(false);
              updateAboutUsPoints();
            }}
          >
            Submit
          </Button>
        </Group>
      </Modal>
      <FileInput
        ref={fileRef}
        value={imageUploadFile}
        accept="image/*"
        onChange={(x) => {
          setImageUploadFile(x);
        }}
        style={{ display: "none" }}
      />
      {/* {state>0 && <SubSections
       instituteName={props.instituteName}
       aboutUs={props.aboutUs}
       aboutUsDetails={props.aboutUsDetails}
       aboutUsImages={props.aboutUsImages}
       instituteId={props.instituteId}
       setIsLoading={props.setIsLoading}
       reloadInstituteData={props.reloadInstituteData}
      ></SubSections>} */}
      {state > 0 && componentsArray}
    </>
  );
}
