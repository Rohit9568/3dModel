import { Carousel } from "@mantine/carousel";
import {
  Box,
  Button,
  Center,
  Container,
  FileInput,
  Flex,
  Menu,
  Modal,
  SimpleGrid,
  Stack,
  Text,
  Tooltip,
  createStyles,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { showNotification } from "@mantine/notifications";
import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { fetchCurrentChapter } from "../../../features/UserSubject/TeacherSubjectSlice";
import {
  AddLessonPlans,
  AddNotes,
  AddWorksheets,
} from "../../../features/UserSubject/chapterDataSlice";
import { FileUpload } from "../../../features/fileUpload/FileUpload";
import { removeChapterWorksheet } from "../../../features/userChapter/userChapterSlice";
import { AppDispatch } from "../../../store/ReduxStore";
import { UpdateType, chapter } from "../../../store/chapterSlice";
import { isLoading } from "../../../store/loadingStateSlice";
import { WebAppEvents } from "../../../utilities/Mixpanel/AnalyticeEventWebApp";
import { Mixpanel } from "../../../utilities/Mixpanel/MixpanelHelper";
import { IconDown, IconThreeDots } from "../../_Icons/CustonIcons";
import { PdfViewer } from "../FileUploadBox";
import { UserType } from "../../AdminPage/DashBoard/InstituteBatchesSection";
const chapterActions = chapter.actions;

const useStyles = createStyles((theme) => ({
  headerSearch2: {
    textAlign: "left",
    borderRadius: 10,
    padding: 10,
    display: "flex",
    width: "100%",
  },
}));
interface FileTypeProps {
  fileName: string;
  fileType: string;
  createdAt: string;
}

interface UploadResourcesProps {
  chapter: SingleChapter;
  userType: UserType;
  setloading: (val: boolean) => void;
  isLoading: boolean;
  setLoadingData: (s: boolean) => void;
}
export default function UploadResources(props: UploadResourcesProps) {
  const { theme } = useStyles();
  const navigate = useNavigate();
  const isLg = useMediaQuery(`(max-width: ${theme.breakpoints.lg}px)`);
  const isMd = useMediaQuery(`(max-width: ${theme.breakpoints.md}px)`);
  const [isModalOpened, setIsModalOpened] = useState(false);
  const [viewFiles, setViewFiles] = useState(true);
  const [file, setFile] = useState<File | null>(null);
  const [currentPdf, setCurrentPdf] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<UpdateType | "ALL">("ALL");

  const fileRef = useRef<any>();
  const [switchPlus, setSwitchPlus] = useState<boolean>(false);

  const [updateType, setUpdate] = useState<UpdateType>();
  const [deleteResourceModalOpen, setDeleteResourcesModalOpen] =
    useState(false);
  const [fileToBeDeletedUrl, setFileToBeDeletedUrl] = useState("");
  const [fileToBeDeletedName, setFileToBeDeletedName] = useState("");

  const dispatch = useDispatch<AppDispatch>();

  const fetchChapter = async (chapter_id: string) => {
    fetchCurrentChapter({ chapter_id: chapter_id })
      .then((data: any) => {
        props?.setLoadingData(false);
        dispatch(chapterActions.setCurrentChapter(data));
      })
      .catch((error: any) => {
        props?.setLoadingData(false);
        console.log(error);
      });
  };

  useEffect(() => {
    setSwitchPlus(false);
  }, [selectedType]);

  function onNoteUpload(name: string, url: string) {
    if (props.chapter._id) {
      AddNotes({ id: props.chapter._id, fileName: name, url })
        .then((x: any) => {
          props.setloading(true);
          props.setLoadingData(true);
          setFile(null);
          setSelectedType(UpdateType.CN);
          dispatch(
            chapterActions.updateCurrentChapter({
              type: UpdateType.CN,
              data: x,
            })
          );
        })
        .catch((e) => {
          props.setloading(false);
          props.setLoadingData(false);
          setFile(null);

          console.log(e);
        });
      Mixpanel.track(
        WebAppEvents.TEACHER_APP_LEARN_PAGE_NOTES_SECTION_FILE_ADDED
      );
    }
  }
  function OnLessonPlanUplaod(name: string, url: string) {
    AddLessonPlans({ id: props.chapter._id, fileName: name, url })
      .then((x: any) => {
        props.setloading(true);
        props.setLoadingData(true);
        setSelectedType(UpdateType.CLP);
        Mixpanel.track(
          WebAppEvents.TEACHER_APP_LEARN_PAGE_LESSON_PLAN_SECTION_FILE_ADDED
        );
        dispatch(
          chapterActions.updateCurrentChapter({
            type: UpdateType.CLP,
            data: x,
          })
        );
        setFile(null);
      })
      .catch((e) => {
        props.setloading(false);
        props.setLoadingData(false);
        setFile(null);

        console.log(e);
      });
  }
  function OnWorksheetUpload(name: string, url: string) {
    if (props.chapter._id) {
      AddWorksheets({ id: props.chapter._id, fileName: name, url })
        .then((x: any) => {
          props.setloading(true);
          props.setLoadingData(true);
          setSelectedType(UpdateType.CW);
          dispatch(
            chapterActions.updateCurrentChapter({
              type: UpdateType.CW,
              data: x,
            })
          );
          setFile(null);
        })
        .catch((e) => {
          props.setloading(false);
          props.setLoadingData(false);
          setFile(null);

          console.log(e);
        });
      Mixpanel.track(
        WebAppEvents.TEACHER_APP_PRACTICE_PAGE_WORKSHEET_SECTION_FILE_ADDED
      );
    }
  }

  const uploadButtonCLickHandler = (type: UpdateType) => {
    if (type === UpdateType.CN) {
      Mixpanel.track(
        WebAppEvents.TEACHER_APP_LEARN_PAGE_NOTES_SECTION_BROWSE_CLICKED
      );
    } else if (type === UpdateType.CLP) {
      Mixpanel.track(
        WebAppEvents.TEACHER_APP_LEARN_PAGE_LESSON_PLAN_SECTION_BROWSE_CLICKED
      );
    } else if (type === UpdateType.CW) {
      Mixpanel.track(
        WebAppEvents.TEACHER_APP_PRACTICE_PAGE_WORKSHEET_SECTION_BROWSE_CLICKED
      );
    }
    fileRef.current.click();
    setUpdate(type);
  };

  useEffect(() => {
    setCurrentPdf(null);
  }, [selectedType]);

  useEffect(() => {
    if (file) {
      setIsModalOpened(false);
      if (file && file.size > 100 * 1024 * 1024) {
        showNotification({
          message: "File size should be less than 100mb",
        });
      } else if (file && file.type === "application/pdf") {
        props.setloading(true);
        props?.setLoadingData(true);
        FileUpload({ file })
          .then((x) => {
            if (updateType === UpdateType.CN) {
              onNoteUpload(file.name, x.url);
            } else if (updateType === UpdateType.CLP) {
              OnLessonPlanUplaod(file.name, x.url);
            } else if (updateType === UpdateType.CW) {
              OnWorksheetUpload(file.name, x.url);
            }
          })
          .catch((e) => {
            console.log(e);
          });
      } else {
        showNotification({
          message: "Please select a PDF file.",
        });
      }
    }
  }, [file]);

  const originalData = props.chapter.chapterLessonPlan.map((x) => {
    return {
      ...x,
      fileType: "LESSON PLAN",
    };
  });

  originalData.push(
    ...props.chapter.chapterNotes.map((x) => {
      return {
        ...x,
        fileType: "NOTES",
      };
    })
  );
  originalData.push(
    ...props.chapter.chapterWorksheets.map((x) => {
      return {
        ...x,
        fileType: "WORKSHEETS",
      };
    })
  );

  const allData = originalData.filter((x) => {
    if (selectedType === "ALL") return x;
    else {
      if (selectedType === UpdateType.CLP && x.fileType === "LESSON PLAN") {
        return x;
      } else if (selectedType === UpdateType.CN && x.fileType === "NOTES") {
        return x;
      } else if (
        selectedType === UpdateType.CW &&
        x.fileType === "WORKSHEETS"
      ) {
        return x;
      }
    }
  });

  const carouselScrollRef = useRef<any>(null);
  useEffect(() => {
    if (carouselScrollRef && carouselScrollRef.current)
      carouselScrollRef.current.scrollTo(0, 0);
  }, [selectedType]);

  return (
    <>
      { originalData.length === 0 && (
        <Center
          style={{
            height: "100%",
            width: "100%",
            // height:"100%",
            // marginTop: "50%",
          }}
        >
          <Stack justify="center" align="center">
            <img
              src={require("../../../assets/EmptyResources.png")}
              height="132px"
              width="132px"
            />
            <Text color="#B5B5B5" fz={15}>
              Your files can be viewed in this section
            </Text>
            { props.userType == UserType.OTHERS && (
              <Button
                size="md"
                bg="#4B65F6"
                onClick={() => {
                  setIsModalOpened(true);
                }}
              >
                Add Resources
              </Button>
            )}
          </Stack>
        </Center>
      )}
      <FileInput
        accept=".pdf"
        ref={fileRef}
        value={file}
        onChange={setFile}
        display="none"
      />
      {originalData.length !== 0 && (
        <div
          style={{
            width: "100%",
            marginBottom: "30px",
          }}
        >
          {viewFiles ? (
            <StyledContainer
              size="lg"
              fluid={isMd}
              w="100%"
              mt={isMd ? 40 : 90}
            >
              <StyledHeader
                py={isMd ? 10 : 30}
                size="lg"
                // fluid={isMd}
                // w="100%"
                // pr={20}
                px={isMd ? 10 : 30}
              >
                <Menu
                  styles={{
                    dropdown: {
                      marginLeft: 15,
                    },
                  }}
                >
                  <Menu.Target>
                    <Button
                      // w={"140px"}
                      radius={8}
                      ta={"left"}
                      variant="subtle"
                      rightIcon={<IconDown />}
                      c="#000000"
                      fw={600}
                      onClick={() => {
                        Mixpanel.track(
                          WebAppEvents.TEACHER_APP_LEARN_PAGE_RESOURCES_SECTION_FILTER_DROPDOWN_CLICKED
                        );
                      }}
                      fz={18}
                    >
                      {selectedType === "ALL" && "All files"}
                      {selectedType === UpdateType.CLP && "Lesson Plan"}
                      {selectedType === UpdateType.CN && "Notes"}
                      {selectedType === UpdateType.CW && "Worksheets"}
                      {/* </span> */}
                    </Button>
                  </Menu.Target>
                  <Menu.Dropdown>
                    <Menu.Item
                      onClick={() => {
                        Mixpanel.track(
                          WebAppEvents.TEACHER_APP_PRACTICE_PAGE_RESOURCES_FILTER_CLICKED,
                          {
                            type: "ALL",
                          }
                        );
                        if (selectedType !== "ALL") setSwitchPlus(true);
                        setSelectedType("ALL");
                      }}
                    >
                      <Text>All Files</Text>
                    </Menu.Item>
                    <Menu.Item
                      onClick={() => {
                        Mixpanel.track(
                          WebAppEvents.TEACHER_APP_PRACTICE_PAGE_RESOURCES_FILTER_CLICKED,
                          {
                            type: "Lesson Plan",
                          }
                        );
                        if (selectedType !== UpdateType.CLP)
                          setSwitchPlus(true);

                        setSelectedType(UpdateType.CLP);
                      }}
                    >
                      <Text>Lesson Plan</Text>
                    </Menu.Item>
                    <Menu.Item
                      onClick={() => {
                        Mixpanel.track(
                          WebAppEvents.TEACHER_APP_PRACTICE_PAGE_RESOURCES_FILTER_CLICKED,
                          {
                            type: "Notes",
                          }
                        );
                        if (selectedType !== UpdateType.CN) setSwitchPlus(true);

                        setSelectedType(UpdateType.CN);
                      }}
                    >
                      <Text>Notes</Text>
                    </Menu.Item>
                    <Menu.Item
                      onClick={() => {
                        Mixpanel.track(
                          WebAppEvents.TEACHER_APP_PRACTICE_PAGE_RESOURCES_FILTER_CLICKED,
                          {
                            type: "Worksheet",
                          }
                        );
                        if (selectedType !== UpdateType.CW) setSwitchPlus(true);

                        setSelectedType(UpdateType.CW);
                      }}
                    >
                      <Text>Worksheet</Text>
                    </Menu.Item>
                  </Menu.Dropdown>
                </Menu>
                { props.userType == UserType.OTHERS && allData.length !== 0 && (
                  <Button
                    bg="#4B65F6"
                    size={isMd ? "xs" : "md"}
                    onClick={() => {
                      Mixpanel.track(
                        WebAppEvents.TEACHER_APP_LEARN_PAGE_ADD_FILES_BUTTON_CLICKED
                      );
                      setIsModalOpened(true);
                    }}
                    sx={{
                      "&:hover": {
                        backgroundColor: "",
                      },
                    }}
                    style={{
                      fontSize: isMd ? 14 : 18,
                      borderRadius: "24px",
                      fontFamily: "Nunito",
                      background: "transparent",
                      color: "black",
                      padding: "9px 14px 9px 14px",
                      border: "1px solid black",
                    }}
                  >
                    Add Files
                  </Button>
                )}
              </StyledHeader>
              {isMd ? (
                <>
                  { props.userType == UserType.OTHERS && allData.length === 0 && (
                    <Center
                      style={{
                        height: "40vh",
                        width: "100%",
                      }}
                    >
                      <Stack justify="center" align="center">
                        <img
                          src={require("../../../assets/EmptyResources.png")}
                          height="120px"
                          width="120px"
                        />

                        <Button
                          size="md"
                          bg="#4B65F6"
                          onClick={() => {
                            setIsModalOpened(true);
                          }}
                        >
                          Add Resources
                        </Button>
                        {/* </Group> */}
                      </Stack>
                    </Center>
                  )}

                  {allData.length > 0 && (
                    <SimpleGrid
                      cols={4}
                      verticalSpacing={"sm"}
                      breakpoints={[
                        { maxWidth: "lg", cols: 3, spacing: "md" },
                        { maxWidth: "md", cols: 2, spacing: "sm" },
                        { maxWidth: "sm", cols: 1, spacing: "sm" },
                      ]}
                      pt={30}
                    >
                      { allData.map((x) => (
                        <div
                          key={x.url}
                          style={{ display: "flex", flexDirection: "row" }}
                        >
                          <Flex
                            justify={"space-between"}
                            px={"lg"}
                            py={"md"}
                            bg={"white"}
                            mx={"sm"}
                            h={"100px"}
                            align={"center"}
                            sx={{
                              borderRadius: "5px",
                              boxShadow: "0px 0px 20px 0px #0000001A",
                              width: "100%",
                            }}
                            onClick={() => {

                              if (x.fileType === "WORKSHEETS") {
                                Mixpanel.track(
                                  WebAppEvents.TEACHER_APP_LEARN_PAGE_FILE_CLICKED,
                                  {
                                    type: "worksheet",
                                  }
                                );
                              } else if (x.fileType === "NOTES") {
                                Mixpanel.track(
                                  WebAppEvents.TEACHER_APP_LEARN_PAGE_FILE_CLICKED,
                                  {
                                    type: "notes",
                                  }
                                );
                              } else if (x.fileType === "LESSON PLAN") {
                                Mixpanel.track(
                                  WebAppEvents.TEACHER_APP_LEARN_PAGE_FILE_CLICKED,
                                  {
                                    type: "lesson plan",
                                  }
                                );
                              }
                              setCurrentPdf(x.url);
                            }}
                          >
                            <Flex gap={"20px"} align={"center"}>
                              {x.fileType === "WORKSHEETS" && (
                                <img
                                  src={require("../../../assets/worksheetType.png")}
                                  alt="Icon"
                                  style={{
                                    width: "40px",
                                    aspectRatio: "1",
                                    height: "40px",
                                  }}
                                />
                              )}
                              {x.fileType === "NOTES" && (
                                <img
                                  src={require("../../../assets/notesType.png")}
                                  alt="Icon"
                                  style={{
                                    width: "40px",
                                    aspectRatio: "1",
                                    height: "40px",
                                  }}
                                />
                              )}
                              {x.fileType === "LESSON PLAN" && (
                                <img
                                  src={require("../../../assets/lessonType.png")}
                                  alt="Icon"
                                  style={{
                                    width: "40px",
                                    aspectRatio: "1",
                                    height: "40px",
                                  }}
                                />
                              )}
                              {/*  */}
                              <Flex direction={"column"} py={20} gap={"xs"}>
                                <span
                                  style={{
                                    fontSize: "8px",
                                    background: `${
                                      x.fileType === "WORKSHEETS"
                                        ? "#FDC00F26"
                                        : x.fileType === "NOTES"
                                        ? "#11BC1826"
                                        : x.fileType === "LESSON PLAN"
                                        ? "#BC11A126"
                                        : ""
                                    }`,
                                    maxWidth: "65px",
                                    padding: "5px",
                                    borderRadius: "5px",
                                    display: "flex",
                                    justifyContent: "center",
                                    border: `1px solid ${
                                      x.fileType === "WORKSHEETS"
                                        ? "#FDC00F"
                                        : x.fileType === "NOTES"
                                        ? "#11BC18"
                                        : x.fileType === "LESSON PLAN"
                                        ? "#BC11A1"
                                        : ""
                                    }`,
                                    color: `${
                                      x.fileType === "WORKSHEETS"
                                        ? "#FDC00F"
                                        : x.fileType === "NOTES"
                                        ? "#11BC18"
                                        : x.fileType === "LESSON PLAN"
                                        ? "#BC11A1"
                                        : ""
                                    }`,
                                    fontWeight: 700,
                                  }}
                                >
                                  {x.fileType.charAt(0).toLocaleUpperCase()}
                                  {x.fileType.slice(1).toLocaleLowerCase()}
                                </span>
                                <div
                                  style={{
                                    display: "flex",
                                    flexDirection: "column",
                                  }}
                                >
                                  <span style={{ fontSize: "14px" }}>
                                    {x.fileName.length > 7
                                      ? `${x.fileName.substring(0, 7)}...`
                                      : x.fileName}
                                  </span>
                                </div>
                              </Flex>
                            </Flex>
                          </Flex>
                          <div
                            style={{
                              position: "relative",
                              // bottom: '100px',
                              right: "55px",
                              zIndex: 3,
                            }}
                          >
                            { props.userType == UserType.OTHERS && <Menu
                              styles={{
                                dropdown: {
                                  marginLeft: 15,
                                },
                              }}
                            >
                              <Menu.Target>
                                <Button
                                  // w={"140px"}
                                  radius={8}
                                  ta={"left"}
                                  variant="subtle"
                                  rightIcon={<IconThreeDots />}
                                  c="#000000"
                                  fw={600}
                                  onClick={(event) => {
                                    event.stopPropagation();
                                  }}
                                  fz={18}
                                  sx={{
                                    ":hover": {
                                      backgroundColor: "transparent",
                                    },
                                  }}
                                ></Button>
                              </Menu.Target>
                              <StyledMenuDropdown className="menu-dropdown">
                                <Menu.Item
                                  onClick={(event) => {
                                    event.stopPropagation();
                                  }}
                                  className="menu-item"
                                >
                                  <Text
                                    onClick={async (event) => {
                                      event.stopPropagation();
                                      setFileToBeDeletedUrl(x.url);
                                      setFileToBeDeletedName(x.fileName);
                                      setDeleteResourcesModalOpen(true);
                                    }}
                                  >
                                    Delete
                                  </Text>
                                </Menu.Item>
                              </StyledMenuDropdown>
                            </Menu>
}
                          </div>
                        </div>
                      ))}
                    </SimpleGrid>
                  )}
                </>
              ) : (
                <Stack>
                  <Flex justify={"center"} align={"center"} w={"100%"} pt={20}>
                    {allData.length !== 0 &&
                      !switchPlus &&
                      !props.isLoading && (
                        <Carousel
                          withIndicators
                          height={isMd ? "30vh" : "40vh"}
                          loop
                          w={"95%"}
                          slideSize={isMd ? "100%" : "10%"}
                          style={{
                            height: "200px",
                          }}
                          align={"start"}
                          styles={{
                            control: {
                              width: 30,
                              height: 30,
                            },
                          }}
                          ref={carouselScrollRef}
                        >
                          <>
                            {allData.map((x, index) => (
                              <Carousel.Slide w={"20%"} key={index} mt={15}>
                                <Flex
                                  justify={"space-between"}
                                  // px={"lg"}
                                  py={"md"}
                                  mx={"sm"}
                                  h={"160px"}
                                  w={"150px"}
                                  align={"center"}
                                  sx={{
                                    borderRadius: "5px",
                                    boxShadow: "0px 0px 20px 0px #0000001A",
                                    flexDirection: "column",
                                    position: "relative",
                                    cursor: "pointer",
                                  }}
                                  onClick={() => {
                                    if (x.fileType === "WORKSHEETS") {
                                      Mixpanel.track(
                                        WebAppEvents.TEACHER_APP_LEARN_PAGE_FILE_CLICKED,
                                        {
                                          type: "worksheet",
                                        }
                                      );
                                    } else if (x.fileType === "NOTES") {
                                      Mixpanel.track(
                                        WebAppEvents.TEACHER_APP_LEARN_PAGE_FILE_CLICKED,
                                        {
                                          type: "notes",
                                        }
                                      );
                                    } else if (x.fileType === "LESSON PLAN") {
                                      Mixpanel.track(
                                        WebAppEvents.TEACHER_APP_LEARN_PAGE_FILE_CLICKED,
                                        {
                                          type: "lesson plan",
                                        }
                                      );
                                    }
                                    setCurrentPdf(x.url);
                                  }}
                                >
                                  <Flex
                                    justify={"center"}
                                    align={"center"}
                                    w={"100%"}
                                    direction={"column"}
                                  >
                                    {x.fileType === "WORKSHEETS" && (
                                      <img
                                        src={require("../../../assets/worksheetType.png")}
                                        alt="Icon"
                                        style={{
                                          width: "50px",
                                          aspectRatio: "1",
                                          height: "50px",
                                        }}
                                      />
                                    )}
                                    {x.fileType === "NOTES" && (
                                      <img
                                        src={require("../../../assets/notesType.png")}
                                        alt="Icon"
                                        style={{
                                          width: "50px",
                                          aspectRatio: "1",
                                          height: "50px",
                                        }}
                                      />
                                    )}
                                    {x.fileType === "LESSON PLAN" && (
                                      <img
                                        src={require("../../../assets/lessonType.png")}
                                        alt="Icon"
                                        style={{
                                          width: "50px",
                                          aspectRatio: "1",
                                          height: "50px",
                                        }}
                                      />
                                    )}
                                    {/*  */}
                                    <Flex
                                      direction={"column"}
                                      py={20}
                                      gap={"xs"}
                                      align={"center"}
                                    >
                                      <span
                                        style={{
                                          fontSize: "8px",
                                          background: `${
                                            x.fileType === "WORKSHEETS"
                                              ? "#FDC00F26"
                                              : x.fileType === "NOTES"
                                              ? "#11BC1826"
                                              : x.fileType === "LESSON PLAN"
                                              ? "#BC11A126"
                                              : ""
                                          }`,
                                          maxWidth: "65px",
                                          // padding: "5px",
                                          padding: "1px 5px",
                                          borderRadius: "5px",
                                          display: "flex",
                                          justifyContent: "center",
                                          border: `1px solid ${
                                            x.fileType === "WORKSHEETS"
                                              ? "#FDC00F"
                                              : x.fileType === "NOTES"
                                              ? "#11BC18"
                                              : x.fileType === "LESSON PLAN"
                                              ? "#BC11A1"
                                              : ""
                                          }`,
                                          color: `${
                                            x.fileType === "WORKSHEETS"
                                              ? "#FDC00F"
                                              : x.fileType === "NOTES"
                                              ? "#11BC18"
                                              : x.fileType === "LESSON PLAN"
                                              ? "#BC11A1"
                                              : ""
                                          }`,
                                          fontWeight: 700,
                                        }}
                                      >
                                        {x.fileType
                                          .charAt(0)
                                          .toLocaleUpperCase()}
                                        {x.fileType
                                          .slice(1)
                                          .toLocaleLowerCase()}
                                      </span>
                                      <div
                                        style={{
                                          display: "flex",
                                          flexDirection: "column",
                                          alignItems: "center",
                                        }}
                                      >
                                        <Tooltip
                                          label={x.fileName}
                                          position="bottom"
                                        >
                                          <span style={{ fontSize: "14px" }}>
                                            {x.fileName.length > 15
                                              ? `${x.fileName.substring(
                                                  0,
                                                  15
                                                )}...`
                                              : x.fileName}
                                          </span>
                                        </Tooltip>
                                      </div>
                                    </Flex>
                                    <div
                                      style={{
                                        position: "relative",
                                        bottom: "145px",
                                        left: "55px",
                                        zIndex: 3,
                                      }}
                                    >
                                      {x.fileType !== "LESSON PLAN" && props.userType == UserType.OTHERS && (
                                        <Menu
                                          styles={{
                                            dropdown: {
                                              marginLeft: 15,
                                            },
                                          }}
                                        >
                                          <Menu.Target>
                                            <Button
                                              // w={"140px"}
                                              radius={8}
                                              ta={"left"}
                                              variant="subtle"
                                              rightIcon={<IconThreeDots />}
                                              c="#000000"
                                              fw={600}
                                              onClick={(event) => {
                                                event.stopPropagation();
                                              }}
                                              fz={18}
                                              sx={{
                                                ":hover": {
                                                  backgroundColor:
                                                    "transparent",
                                                },
                                              }}
                                            ></Button>
                                          </Menu.Target>
                                          {x.fileType !== "LESSON PLAN" && (
                                            <StyledMenuDropdown className="menu-dropdown">
                                              <Menu.Item
                                                onClick={(event) => {
                                                  event.stopPropagation();
                                                }}
                                                className="menu-item"
                                              >
                                                <Text
                                                  onClick={async (event) => {
                                                    event.stopPropagation();
                                                    setFileToBeDeletedUrl(
                                                      x?.url
                                                    );
                                                    setFileToBeDeletedName(
                                                      x?.fileName
                                                    );
                                                    setDeleteResourcesModalOpen(
                                                      true
                                                    );
                                                  }}
                                                >
                                                  Delete
                                                </Text>
                                              </Menu.Item>
                                            </StyledMenuDropdown>
                                          )}
                                        </Menu>
                                      )}
                                    </div>
                                  </Flex>
                                </Flex>
                              </Carousel.Slide>
                            ))}
                          </>
                        </Carousel>
                      )}
                    {allData.length === 0 && (
                      <Center
                        style={{
                          height: "40vh",
                          width: "100%",
                        }}
                      >
                        <Stack justify="center" align="center">
                          <img
                            src={require("../../../assets/EmptyResources.png")}
                            height="120px"
                            width="120px"
                          />

                         { props.userType == UserType.OTHERS && <Button
                            size="md"
                            bg="#4B65F6"
                            onClick={() => {
                              setIsModalOpened(true);
                            }}
                          >
                            Add Resources
                          </Button>
}
                          {/* </Group> */}
                        </Stack>
                      </Center>
                    )}
                  </Flex>
                  {currentPdf && (
                    <Box w={"100%"} mt={30}>
                      <PdfViewer url={currentPdf} showOptions={true} />
                    </Box>
                  )}
                </Stack>
              )}
            </StyledContainer>
          ) : (
            <Flex
              sx={{
                justifyContent: "center",
                flexDirection: "column",
                height: "70vh",
                alignItems: "center",
                gap: "20px",
                width: "100%",
              }}
            >
              <img
                src={require("../../../assets/emptyFolder.png")}
                alt="Empty"
                style={{ height: "170px", width: "290px" }}
              />
              { props.userType == UserType.OTHERS && <Button bg={"#4B65F6"} onClick={() => setIsModalOpened(true)}>
                Add Resources
              </Button>
              }
            </Flex>
          )}
        </div>
      )}
      <Modal
        opened={isModalOpened}
        onClose={() => setIsModalOpened(false)}
        title="Choose file type to add"
        centered
        radius={10}
      >
        <Flex sx={{ flexDirection: "column", gap: "15px" }}>
          <Button
            p={"10px"}
            sx={{ border: "1px solid #4B65F6" }}
            size="lg"
            variant="outline"
            c="#4B65F6"
            onClick={() => {
              uploadButtonCLickHandler(UpdateType.CN);
            }}
          >
            Notes
          </Button>
          <Button
            p={"10px"}
            sx={{ border: "1px solid #4B65F6" }}
            size="lg"
            variant="outline"
            c="#4B65F6"
            onClick={() => {
              uploadButtonCLickHandler(UpdateType.CW);
            }}
          >
            Worksheet
          </Button>
          <Button
            p={"10px"}
            sx={{ border: "1px solid #4B65F6" }}
            size="lg"
            variant="outline"
            c="#4B65F6"
            onClick={() => {
              uploadButtonCLickHandler(UpdateType.CLP);
            }}
          >
            Lesson Plan
          </Button>
        </Flex>
      </Modal>
      <Modal
        opened={currentPdf !== null && isMd}
        onClose={() => {
          setCurrentPdf(null);
        }}
        size="lg"
      >
        {currentPdf !== null && (
          <PdfViewer url={currentPdf} showOptions={true} />
        )}
      </Modal>
      <Modal
        opened={deleteResourceModalOpen}
        onClose={() => setDeleteResourcesModalOpen(false)}
        centered
        title="Delete Resource"
        styles={{
          title: {
            fontWeight: 700,
          },
        }}
      >
        <Content>Are you sure you want to delete this topic?</Content>
        <ButtonContainer>
          <CancelButton
            onClick={() => {
              setDeleteResourcesModalOpen(false);
            }}
            disabled={fileToBeDeletedUrl?.length === 0}
          >
            Cancel
          </CancelButton>
          <SubmitButton
            disabled={fileToBeDeletedName?.length === 0}
            onClick={async () => {
              props?.setLoadingData(true);
              await removeChapterWorksheet(
                props?.chapter?._id,
                fileToBeDeletedName,
                fileToBeDeletedUrl
              );
              setDeleteResourcesModalOpen(false);
              fetchChapter(props?.chapter?._id);
            }}
          >
            Yes
          </SubmitButton>
        </ButtonContainer>
      </Modal>
    </>
  );
}

const StyledContainer = styled(Container)`
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
`;

const StyledHeader = styled(Container)`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const StyledMenuDropdown = styled(Menu.Dropdown)`
  top: 30px !important;
  left: 10px !important;
  background-color: white;
  .menu-item {
    padding: 0 5px;
    &:hover {
      background-color: white;
    }
  }
`;

const Content = styled.div`
  width: 100%;
  margin-bottom: 10px;
`;
const Title = styled.span`
  font-family: "Nunito";
  font-weight: 700;
`;
const ButtonContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
`;

const CancelButton = styled.button`
  border: 0;
  padding: 12px 20px;
  margin: 10px;
  border-radius: 24px;
  color: white;
  font-weight: 400;
  cursor: pointer;
  background-color: #cccccc;
`;
const SubmitButton = styled.button`
  border: 0;
  padding: 12px 20px;
  margin: 10px;
  border-radius: 24px;
  color: white;
  font-weight: 400;
  background-color: #4b65f6;
  cursor: pointer;
`;
