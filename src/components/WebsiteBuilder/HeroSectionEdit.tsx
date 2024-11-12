import {
  Box,
  Button,
  Center,
  FileInput,
  Flex,
  Group,
  Image,
  Modal,
  Select,
  Stack,
  Text,
  TextInput,
  useMantineTheme,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import {
  IconChevronLeft,
  IconChevronRight,
  IconEdit,
  IconPlus,
} from "@tabler/icons";
import {
  UpdateInstituteHeroHeading,
  UpdateInstituteHeroImage,
  UpdateInstituteLayout,
  UpdateInstituteAlignment,
} from "../../features/websiteBuilder/websiteBuilderSlice";
import { useEffect, useRef, useState } from "react";
import { isHEIC } from "../../utilities/HelperFunctions";
import { showNotification } from "@mantine/notifications";
import { FileUpload } from "../../features/fileUpload/FileUpload";
import { Carousel } from "@mantine/carousel";
import { EditPics } from "../AdminPage/HomeSection/EditPics";
import { Mixpanel } from "../../utilities/Mixpanel/MixpanelHelper";
import { WebsiteBuilder } from "./WebsiteBuilder";
import { WebAppEvents } from "../../utilities/Mixpanel/AnalyticeEventWebApp";
import Left from "../../_parentsApp/Assets/left.png";
import Right from "../../_parentsApp/Assets/right.png";
import Cen from "../../_parentsApp/Assets/center.png";
import LeftImage from "../../_parentsApp/Assets/Left_image.png";
import RightImage from "../../_parentsApp/Assets/rightImage.png";
import { Alignment, LevelFormat } from "docx";

export function HeroSectionEdit(props: {
  Layout:string,
  Alignment:string,
  heroImage: string[];
  heading: string;
  instituteId: string;
  setIsLoading: (val: boolean) => void;
  reloadInstituteData: () => void;
}) {
  const theme = useMantineTheme();
  const isMd = useMediaQuery(`(max-width: ${theme.breakpoints.md}px)`);
  const fileRef = useRef<any>();

  const [headingModal, setheadingModal] = useState<boolean>(false);
  const [layoutModal, setLayoutModal] = useState<boolean>(false);
  const [headingModalText, setheadingModalText] = useState<string>(
    props.heading
  );
  const [Layout, setLayout] = useState<string>(props.Layout);
  const [align, setAlign] = useState<string>(props.Alignment);


  const [imageUploadFile, setImageUploadFile] = useState<File | null>(null);
  const [isEditPics, setIsEditPics] = useState<boolean>(false);
  const handleLayoutChange = (selectedValue: any) => {
    if (selectedValue !== null) {
      setLayout(selectedValue);
    }
  };
  const handleAlignChange = (selectedValue: any) => {
    if (selectedValue !== null) {
      setAlign(selectedValue);
    }
  };

  function updateHeading(heading: string) {
    props.setIsLoading(true);
    UpdateInstituteHeroHeading({ id: props.instituteId, heading: heading })
      .then(() => {
        Mixpanel.track(WebAppEvents.WEBSITE_BUILDER_HERO_SUBMIT_BUTTON_CLICKED);
        props.reloadInstituteData();
        props.setIsLoading(false);
      })
      .catch((e) => {
        console.log(e);
      });
  }
  function updateLayout(layout: string) {
    props.setIsLoading(true);
    UpdateInstituteLayout({ id: props.instituteId, layout: layout })
      .then((d) => {
        Mixpanel.track(WebAppEvents.WEBSITE_BUILDER_HERO_SUBMIT_BUTTON_CLICKED);
        props.reloadInstituteData();
        props.setIsLoading(false);
      })
      .catch((e) => {
        // props.setIsLoading(false)
        console.log(e);
      });
  }
  function updateAlignment(align: string) {
    props.setIsLoading(true);
    UpdateInstituteAlignment({ id: props.instituteId, align: align })
      .then((d) => {
        console.log(d);
        Mixpanel.track(WebAppEvents.WEBSITE_BUILDER_HERO_SUBMIT_BUTTON_CLICKED);
        props.reloadInstituteData();
        props.setIsLoading(false);
      })
      .catch((e) => {
        props.setIsLoading(false);
        console.log(e);
      });
  }
  async function submitHandler(file: File) {
    Mixpanel.track(WebAppEvents.WEBSITE_BUILDER_IMAGE_ADDED, {
      section: "Hero",
    });
    props.setIsLoading(true);
    await FileUpload({ file })
      .then((data: any) => {
        const newImages = [...props.heroImage, data.url];
        UpdateInstituteHeroImage({
          id: props.instituteId,
          imageUrl: newImages,
        })
          .then(() => {
            props.setIsLoading(false);
            props.reloadInstituteData();
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
  useEffect(() => {
    if (imageUploadFile !== null) {
      const isError = isHEIC(imageUploadFile);
      const isSizeValid = imageUploadFile.size <= 5 * 1024 * 1024;
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
  useEffect(() => {
    if (headingModal) setheadingModalText(props.heading);
  }, [headingModal]);
  return (
    <>
      <Stack>
        <Group>
          <Text fz={isMd ? 28 : 40} fw={700}>
            Hero Section
          </Text>
          <Button
            variant={"outline"}
            color="dark"
            radius={50}
            onClick={() => setLayoutModal(true)}
          >
            Change layout
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
        >
          <Stack w={isMd ? "96%" : "48%"}>
            <Group>
              <Text>Heading Text</Text>
              <IconEdit
                onClick={() => {
                  setheadingModal(true);
                }}
                style={{ cursor: "pointer" }}
              ></IconEdit>
            </Group>
            <Text
              p={15}
              fz={isMd ? 34 : 48}
              fw={900}
              style={{ borderRadius: 8, border: "1px solid #CBCDD7" }}
              h={"100%"}
              onClick={() => {
                setheadingModal(true);
              }}
            >
              {props.heading}
            </Text>
          </Stack>
          <Box
            w={isMd ? "96%" : "48%"}
            h={"100%"}
            p={20}
            style={{ border: "1px solid #CBCDD7", borderRadius: 8 }}
            mt={isMd ? 20 : 0}
          >
            <Carousel
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
              {props.heroImage.map((imageUrl, i) => {
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
              {props.heroImage.length === 0 && (
                <Carousel.Slide>
                  <Center h={"100%"}>
                    <img
                      src={
                        "https://vignam-content-images.s3.amazonaws.com/2024-01-01T20-16-16-971Z.jpg"
                      }
                      style={{
                        width: "100%",
                        objectFit: "cover",
                        objectPosition: "center",
                      }}
                    ></img>
                  </Center>
                </Carousel.Slide>
              )}
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
            </Center>
          </Box>
        </Flex>
      </Stack>
      <FileInput
        ref={fileRef}
        value={imageUploadFile}
        accept="image/*"
        onChange={(x) => {
          setImageUploadFile(x);
        }}
        style={{ display: "none" }}
      />
      <Modal
        opened={headingModal}
        onClose={() => setheadingModal(false)}
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
            onClick={() => setheadingModal(false)}
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
              setheadingModal(false);
              updateHeading(headingModalText);
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
          pics={props.heroImage}
          onDeleteClick={(data) => {
            const leftImages = props.heroImage.filter((img) => {
              return !data.includes(img);
            });
            UpdateInstituteHeroImage({
              id: props.instituteId,
              imageUrl: leftImages,
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
      
        title="Change Layout"
        zIndex={999}
        opened={layoutModal}
        centered
        onClose={() => setLayoutModal(false)}
        styles={{
          title: { fontSize: 20,fontWeight:700 }, // Adjust the font size as needed
        }}
      >
        <Stack w={"full"}>
          <Select
            label="Select Layout"
            placeholder="Pick value"
            data={["Half Image and Half text", "Image Background"]}
            value={Layout}
            onChange={handleLayoutChange}
            styles={{
              label: { fontSize: 14,fontWeight:400 }, // Adjust the font size as needed
            }}
          />
          {Layout === "Image Background" && (
            <Select
              label="Select Alignment"
              placeholder="Select layout"
              data={["Center", "Left", "Right"]}
              value={align}
              onChange={handleAlignChange}
              styles={{
                label: { fontSize: 14,fontWeight:400 }, // Adjust the font size as needed
              }}
            />
          )}
          {Layout === "Half Image and Half text" && (
            <Select
              label="Select Alignment"
              placeholder="Pick value"
             
              data={["Left", "Right"]}
              value={align}
              onChange={handleAlignChange}
            />
          )}
          <Text style={{fontSize:14}}>Layout Preview</Text>
          {Layout === "Image Background" && align === "Center" && (
            <img src={RightImage} alt="" />
          )}
          {Layout === "Image Background" && align === "Left" && (
            <img src={Cen} alt="" />
          )}
          {Layout === "Image Background" && align === "Right" && (
            <img src={LeftImage} alt="" />
          )}
          {Layout === "Half Image and Half text" && align === "Right" && (
            <img src={Right} alt="" />
          )}
          {Layout === "Half Image and Half text" && align === "Left" && (
            <img src={Left} alt="" />
          )}

          <Text c="gray">
            Note - Alignment will not vary in case of mobile screen. it is set
            to center align with mobile
          </Text>
          <Group position="right" mt={20}>
          <Button
            variant="outline"
            color="dark"
            fw={700}
            radius={50}
            onClick={() => setLayoutModal(false)}
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
              updateLayout(Layout);
              updateAlignment(align);
              setLayoutModal(false); // Close the modal after updating layout
            }}
          >
            Submit
          </Button>
        </Group>
        
        </Stack>
      </Modal>
    </>
  );
}
