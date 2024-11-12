import {
  Button,
  Center,
  Divider,
  Flex,
  Group,
  Image,
  LoadingOverlay,
  Modal,
  Stack,
  Text,
} from "@mantine/core";
import { IconChevronDown, IconChevronLeft, IconChevronUp } from "@tabler/icons";
import { useEffect, useState } from "react";
import { IconBook, IconDownload } from "../../components/_Icons/CustonIcons";
import { useMediaQuery } from "@mantine/hooks";
import { getCourseById } from "../../features/course/courseSlice";
import { useSelector } from "react-redux";
import { RootState } from "../../store/ReduxStore";
import { useNavigate } from "react-router-dom";
import { convertToEmbedLink } from "../../utilities/HelperFunctions";
import { isValidYouTubeLink } from "../../components/WebsiteBuilder/FooterEdit";
import useParentCommunication from "../../hooks/useParentCommunication";
import { PdfViewer } from "../../components/_New/FileUploadBox";
import { CourseContentList } from "./CourseContentList";

export enum CourseItems {
  LECTURES = "Lectures",
  NOTES = "Notes",
  TESTSERIES = "Test Series",
}

export function SingleTestCard(props: {
  test: any;
  onTestClick: () => void;
  isTestDisabled: boolean;
  viewTest: boolean;
  //   onRenameClick: (val: string) => void;
  //   onDeleteClick: () => void;
}) {
  const isMd = useMediaQuery(`(max-width: 820px)`);
  const mainPath = useSelector<RootState, string | null>((state) => {
    return state.mainPathSlice.value;
  });
  const navigate = useNavigate();
  return (
    <Flex
      style={{
        border: "1px solid #CDCEE3",
        background: "#F7F7FF",
        borderRadius: "11px",
      }}
      px={15}
      py={15}
      justify="space-between"
      align="center"
    >
      <Flex>
        <Stack justify="center">
          <img src={require("../../assets/testcard.png")} />
        </Stack>
        <Stack spacing={2} ml={20}>
          {/* First Row */}
          <Flex style={{ alignItems: "center" }}>
            <IconBook col="#3174F3" />
            <Text
              fz={isMd ? 10 : 12}
              fw={400}
              c={"#898989"}
              style={{ marginLeft: "4px" }}
            >
              {props.test.subject_id.subjectId.classId.name}(
              {props.test.subject_id.subjectId.name})
            </Text>
          </Flex>

          <Text fz={isMd ? 18 : 20} fw={500}>
            {/* {props.test.name} */}
            {props.test.name}
          </Text>

          <Flex align={"center"}>
            <Text w={"100%"} fz={isMd ? 11 : 12} fw={500} c={"#898989"}>
              Total Marks: {props.test.maxMarks} | Total Questions:{" "}
              {props.test.maxQuestions}
            </Text>
            <Flex>
              <Flex
                style={{ width: "60px", justifyContent: "space-evenly" }}
              ></Flex>
            </Flex>
          </Flex>
        </Stack>
      </Flex>
      {!props.isTestDisabled && (
        <Flex align="center" justify="right" pr={5} mr={20} w="40%">
          {props.test.answerSheet &&
            props.test.answerSheet.isChecked !== null && (
              // props.data.answersheetPdf===null &&
              <Button
                style={{
                  border: "2px solid #4D65F6",
                  // borderImage:'linear-gradient(to right, #4B65F6, #AC2FFF)',
                  color: "#4D65F6",
                  maxWidth: "100%",
                }}
                size={isMd ? "xs" : "md"}
                onClick={() => {
                  props.onTestClick();
                  // Mixpanel.track(ParentPageEvents.TEST_PAGE_VIEW_REPORT_CLICKED);
                }}
                variant="outline"
                // w="100%"
                // w="100%"
              >
                View Report
              </Button>
            )}
          {props.test.answerSheet &&
            props.test.answerSheet.isChecked === null && (
              <Button
                style={{
                  border: "2px solid #4D65F6",
                  color: "#4D65F6",
                  maxWidth: "100%",
                }}
                size={isMd ? "xs" : "md"}
                onClick={() => {
                  props.onTestClick();
                  // Mixpanel.track(
                  //   ParentPageEvents.TEST_PAGE_VIEW_RESPONSE_CLICKED
                  // );
                }}
                variant="outline"
                // w="100%"
              >
                View Response
              </Button>
            )}
          {props.test.answerSheet === null && (
            <Button
              style={{
                background: "linear-gradient(92deg, #4B65F6 0%, #AC2FFF 100%)",
                maxWidth: "100%",
              }}
              styles={{ root: { border: "" } }}
              size={isMd ? "xs" : "md"}
              onClick={() => {
                props.onTestClick();
                // Mixpanel.track(ParentPageEvents.TEST_PAGE_TAKE_TEST_CLICKED);
              }}
              // w="100%"
            >
              Take Test
            </Button>
          )}
        </Flex>
      )}
      {props.viewTest && (
        <Button
          variant="outline"
          onClick={() => {
            navigate(`${mainPath}/test?testId=${props.test._id}`);
          }}
          style={{
            border: "1px solid #3174F3",
            color: "#3174F3",
          }}
        >
          View Test
        </Button>
      )}
    </Flex>
  );
}
export function SingleHeading(props: {
  title: string;
  isSelected: boolean;
  onClick: () => void;
}) {
  const isMd = useMediaQuery(`(max-width: 820px)`);
  return (
    <Stack
      spacing={3}
      onClick={props.onClick}
      style={{
        cursor: "pointer",
      }}
    >
      <Text
        style={{
          borderBottom: props.isSelected ? "#4B65F6 3px solid" : "",
          opacity: props.isSelected ? 1 : 0.3,
          zIndex: 999,
        }}
        pb={5}
        fz={isMd ? 14 : 16}
        fw={700}
      >
        {props.title}
      </Text>
    </Stack>
  );
}

export function LectureListItem(props: {
  itemNo: number;
  title: string;
  duration: number;
  selected: boolean;
  onClick: () => void;
  url: string;
  description: string;
}) {
  const [duration, setDuration] = useState<string>("");
  const [showDescription, setShowdescription] = useState<boolean>(false);

  useEffect(() => {
    getVideoDuration();
  }, []);
  function getVideoDuration() {
    const videoURL = props.url;
    const video = document.createElement("video");

    video.src = videoURL;
    video.onloadedmetadata = function () {
      URL.revokeObjectURL(video.src);
      const duration = video.duration;
      const formattedDuration = formatDuration(duration);
      setDuration(formattedDuration);
    };
    video.onerror = function () {
      // return "Error: Unable to fetch video metadata.";
    };
    video.preload = "metadata";
  }
  function formatDuration(duration: number) {
    const hours = Math.floor(duration / 3600);
    const minutes = Math.floor((duration % 3600) / 60);
    const seconds = Math.floor(duration % 60);

    if (hours > 0) {
      return `${hours}:${String(minutes).padStart(2, "0")}:${String(
        seconds
      ).padStart(2, "0")}`;
    } else {
      return `${minutes}:${String(seconds).padStart(2, "0")}`;
    }
  }

  return (
    <Stack
      pl={35}
      style={{
        backgroundColor: props.selected ? "#EDF0FF" : "white",
        cursor: "pointer",
        // border: "red solid 1px",
      }}
      spacing={0}
      onClick={props.onClick}
      pb={10}
    >
      <Flex gap={20} justify="space-between" align="center" pr={20}>
        <Flex align="center" gap={20}>
          <Text>{`${props.itemNo}.  `}</Text>
          <Stack spacing={0} py={10}>
            <Text fz={18} fw={props.selected ? 700 : 400}>
              {props.title}
            </Text>
            <Text fz={14} fw={400} color="#8F919B">
              {`${duration}`}
            </Text>
          </Stack>
        </Flex>

        {!showDescription && (
          <IconChevronDown
            onClick={(e) => {
              e.stopPropagation();
              setShowdescription(true);
            }}
          />
        )}
        {showDescription && (
          <IconChevronUp
            onClick={(e) => {
              e.stopPropagation();
              setShowdescription(false);
            }}
          />
        )}
      </Flex>
      <Group pl={35} mt={-10}>
        {showDescription && <Text fz={14}>{props.description}</Text>}
      </Group>
    </Stack>
  );
}

export function NotesListItem(props: {
  fileName: string;
  onClick: () => void;
}) {
  return (
    <Flex
      onClick={props.onClick}
      px={30}
      justify="space-between"
      w="100%"
      align="center"
      style={{
        cursor: "pointer",
      }}
    >
      <Flex gap={10}>
        <img src={require("../../assets/filelogo.png")} />
        <Text fz={16} fw={400}>
          {props.fileName}
        </Text>
      </Flex>
      {/* <Box h={30} w={30}> */}
      <Button
        variant="outline"
        style={{
          border: "1px solid #808080",
          borderRadius: "30px",
          color: "#000",
        }}
      >
        View
      </Button>
      {/* </Box> */}
    </Flex>
  );
}
export function SingleCoursePage(props: {
  courseId: string;
  teacherTestAnswers: any;
  onTestClick: (val: string, isChecked: boolean) => void;
  onBackClick: () => void;
  fromTeacherSide: boolean;
}) {
  const [course, setCourse] = useState<Course | null>(null);
  const [allTests, setAllTests] = useState<any[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<CourseVideo | null>(null);
  const [isLoading, setisLoading] = useState<boolean>(false);
  const isMd = useMediaQuery(`(max-width: 820px)`);
  const { sendDataToReactnative } = useParentCommunication();
  const [showPdf, setShowPdf] = useState<null | {
    url: string;
    name: string;
  }>(null);

  const handleDownload = (fileUrl: string, name: string) => {
    const link = document.createElement("a");
    link.href = fileUrl;
    link.setAttribute("download", "");
    document.body.appendChild(link);
    //@ts-ignore
    if (window.ReactNativeWebView)
      sendDataToReactnative(1, {
        url: fileUrl,
        name,
      });
    else link.click();
    document.body.removeChild(link);
  };
  useEffect(() => {
    setisLoading(true);
    getCourseById(props.courseId)
      .then((x: any) => {
        setisLoading(false);
        setCourse(x);
      })
      .catch((e) => {
        setisLoading(false);
        console.log(e);
      });
  }, [props.courseId]);
  useEffect(() => {
    if (course) {
      if (course.videos.length > 0) {
        setSelectedVideo(course.videos[0]);
      } else {
      }
    }
  }, [course]);

  const preventContextMenu = (event: any) => {
    event.preventDefault();
  };

  const mainPath = useSelector<RootState, string | null>((state) => {
    return state.mainPathSlice.value;
  });

  const navigate = useNavigate();

  return (
    <>
      <LoadingOverlay visible={isLoading} />
      {course !== null && (
        <>
          <Flex
            style={{
              position: "fixed",
              top: 0,
              background: "#FFF",
              zIndex: 999,
              borderBottom: props.fromTeacherSide ? "2px solid #E9ECEF" : "",
            }}
            onClick={() => {
              props.onBackClick();
            }}
            w="100%"
            color="white"
            px={20}
            py={15}
          >
            <IconChevronLeft
              style={{
                cursor: "pointer",
              }}
            />
            <Text
              pl={20}
              fz={18}
              style={{
                cursor: "pointer",
              }}
            >
              Home
            </Text>
          </Flex>

          <Flex
            direction={isMd ? "column" : "row"}
            justify="flex-start"
            align="flex-start"
            style={{
              marginTop: props.fromTeacherSide ? "60px" : "0px",
            }}
          >
            <Flex
              direction={"column"}
              w={isMd ? "100%" : "50%"}
              h={isMd ? "100%" : "100vh"}
              style={{ borderRight: "2px solid #E9ECEF" }}
            >
              <Flex px={!isMd ? 20 : 0} direction={"column"}>
                {selectedVideo !== null && (
                  <Flex
                    justify="flex-start"
                    align="flex-start"
                    mx={!isMd ? -20 : 0}
                    mt={!isMd ? -11 : -10}
                    py={!isMd ? 10 : 0}
                  >
                    <>
                      {!isValidYouTubeLink(selectedVideo.url) && (
                        <video
                          src={selectedVideo?.url}
                          style={{
                            margin: "auto",
                            width: "100%",
                            height: isMd ? "auto" : "50vh",
                          }}
                          controls
                          controlsList="nodownload"
                        />
                      )}
                      {isValidYouTubeLink(selectedVideo.url) && (
                        <iframe
                          style={{
                            aspectRatio: 16 / 9,
                            margin: "auto",
                            width: isMd ? "100%" : "auto",
                            height: isMd ? "auto" : "50vh",
                          }}
                          onContextMenu={preventContextMenu}
                          allow="fullscreen"
                          src={convertToEmbedLink(selectedVideo.url)}
                          allowFullScreen
                        ></iframe>
                      )}
                    </>
                  </Flex>
                )}

                {selectedVideo == null && course != null && (
                  <Flex
                    justify="flex-start"
                    mx={!isMd ? -20 : 0}
                    mt={!isMd ? -11 : -10}
                    py={!isMd ? 10 : 0}
                  >
                    <Image
                      src={course.thumbnail}
                      width={"100%"}
                      style={{
                        margin: "auto",
                      }}
                    />
                  </Flex>
                )}
              </Flex>

              <Stack spacing={5} px={10} py={10} mx={20}>
                <Text fz={isMd ? 24 : 28} fw={500} color="Nunito">
                  {course.name}
                </Text>
                <Flex justify="space-between">
                  <Text
                    color="#A8A8A8"
                    fz={isMd ? 16 : 18}
                    fw={400}
                    style={{
                      transition: "1000 all ease-in-out",
                    }}
                    w="90%"
                  >
                    {course.description}
                  </Text>
                </Flex>
              </Stack>
            </Flex>

            <Stack spacing={0} h={"100%"} w={isMd ? "100%" : "50%"}>
              <Text
                color="#000000"
                bg={"#F9F9F9"}
                p={18}
                mb={4}
                fw={700}
                fz={isMd ? 18 : 20}
              >
                Course content
              </Text>
              <CourseContentList
                course={course}
                onViewVideoClicked={(courseVideo: CourseVideo) => {
                  setSelectedVideo(courseVideo);
                }}
                onViewNotesClicked={(courseFile: CourseFile) => {
                  setShowPdf({ url: courseFile.url, name: courseFile.name });
                }}
                onViewOrTakeTestClicked={(testData, isChecked) => {
                  if (props.fromTeacherSide != true) {
                    props.onTestClick(testData._id, isChecked);
                  } else {
                    navigate(`${mainPath}/test?testId=${testData._id}`);
                  }
                }}
                studentGivenTests={props.teacherTestAnswers}
              />
            </Stack>
          </Flex>

          <Modal
            title={showPdf ? showPdf.name : ""}
            size="xl"
            opened={showPdf !== null}
            onClose={() => setShowPdf(null)}
            styles={{
              title: {
                fontSize: 18,
                fontWeight: 600,
              },
            }}
            zIndex={9999}
          >
            <PdfViewer url={showPdf?.url ?? ""} showOptions={false} />
          </Modal>
        </>
      )}
    </>
  ); /* Rectangle 3626 */
}
