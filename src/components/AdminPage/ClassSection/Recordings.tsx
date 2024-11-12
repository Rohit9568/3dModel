import { useEffect, useState } from "react";
import { GetAllRecordings } from "../../../_parentsApp/features/instituteClassSlice";
import {
  Button,
  Flex,
  Group,
  LoadingOverlay,
  Menu,
  Modal,
  Select,
  SimpleGrid,
  Stack,
  Text,
  useMantineTheme,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { IconDotsVertical, IconPlus } from "@tabler/icons";
import { format } from "date-fns";
import { GetAllCoursesForInstitute } from "../../../_parentsApp/features/instituteSlice";
import { useSelector } from "react-redux";
import { RootState } from "../../../store/ReduxStore";
import { addVideoToCourse } from "../../../features/course/courseSlice";
import { showNotification } from "@mantine/notifications";
import { UserType } from "../DashBoard/InstituteBatchesSection";
import { IconThreeDots } from "../../_Icons/CustonIcons";
import { deleteRecording } from "../../../features/recordingsSlice";

function VideoCard(props: {
  video: CourseVideo;
  onVideoPlayClicked: () => void;
  addVideoToCourse: () => void;
  onDeleteVideoClicked:()=>void;
  showOptions: boolean;
}) {
  return (
    <Stack
      style={{
        boxShadow: "0px 0px 16px 0px #00000040",
        borderRadius: "20px",
        cursor: "pointer",
      }}
      spacing={0}
      m={20}
    >
      <img
        src={require("../../../assets/emptyvideoImage.jpg")}
        style={{
          width: "100%",
          borderTopLeftRadius: "20px",
          borderTopRightRadius: "20px",
        }}
        alt="video"
        onClick={props.onVideoPlayClicked}
      />
      <Flex justify="space-between" w="100%" align="center" py={20} px={20}>
        <Text
          fz={16}
          fw={700}
          w="100%"
          style={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {props.video.name}-
          {format(new Date(props.video.createdAt), "dd MMMM yyyy")}
        </Text>
        {props.showOptions && (
          <>
            <Menu>
              <Menu.Target>
                <Button  compact variant="subtle" c={"gray"}>
                  <IconDotsVertical style={{cursor:"pointer"}}/>
                  </Button>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Item
                  onClick={() => {
                    props.addVideoToCourse();
                  }}
                >
                  Add to Course
                </Menu.Item>

                <Menu.Item
                  onClick={() => {
                    props.onDeleteVideoClicked();
                  }}
                >
                  Delete
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </>
        )}
      </Flex>
    </Stack>
  );
}
export function Recordings(props: { batchId: string; userType: UserType }) {
  const [allRecordings, setAllRecordings] = useState<CourseVideo[]>([]);
  const [playVideo, setPlayVideo] = useState<CourseVideo | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<CourseVideo | null>(null);
  const [allCourses, setAllCourses] = useState<
    {
      label: string;
      value: string;
    }[]
  >([]);
  const [selectedCourse, setSelectedCourse] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showDeleteWarning, setShowDeleteWarning] = useState<boolean>(false);
  const [selectedDeletedVideoId, setSelectedDeletedVideoId] = useState<string | null>();

  const theme = useMantineTheme();
  const isMd = useMediaQuery(`(max-width: ${theme.breakpoints.md}px)`);
  const instituteDetails = useSelector<RootState, InstituteDetails | null>(
    (state) => state.instituteDetailsSlice.instituteDetails
  );
  useEffect(() => {
    fetchRecordingsData()
  }, []);

  function fetchRecordingsData(){
    GetAllRecordings({ id: props.batchId })
    .then((response: any) => {
      setAllRecordings(response);
    })
    .catch((error) => {
      console.error(error);
    });
  }

  useEffect(() => {
    GetAllCoursesForInstitute({
      id: instituteDetails?._id ?? "",
    })
      .then((x: any) => {
        setAllCourses(x);
      })
      .catch((e) => {
        console.log(e);
      });
  }, [instituteDetails]);

  function handleSubmit() {
    setIsLoading(true);
    addVideoToCourse({
      courseId: selectedCourse,
      videoId: selectedVideo?._id!!,
    })
      .then((x) => {
        setIsLoading(false);
        showNotification({
          message: `Video Added to ${
            allCourses.find((x) => x.value === selectedCourse)?.label
          }`,
        });
        setSelectedVideo(null);
      })
      .catch((e) => {
        setIsLoading(false);
        console.log(e);
      });
  }

  function handleRecordingDelete(_id:string) {
    setIsLoading(true);
    deleteRecording({
      _id:_id
    })
      .then((x) => {
        setIsLoading(false);
        showNotification({
          message: `Recording Deleted`,
        });
        setSelectedDeletedVideoId(null)
        setShowDeleteWarning(true);
        fetchRecordingsData()
      })
      .catch((e) => {
        setSelectedDeletedVideoId(null)
        setIsLoading(false);
        console.log(e);
      });
  }
  return (
    <>
      <LoadingOverlay visible={isLoading} />
      <SimpleGrid cols={isMd ? 1 : 4} mt={10}>
        {allRecordings.map((video) => (
          <VideoCard
            video={video}
            onVideoPlayClicked={() => setPlayVideo(video)}
            addVideoToCourse={() => {
              setSelectedVideo(video);
            }}
            onDeleteVideoClicked={()=>{
              setShowDeleteWarning(true);
              setSelectedDeletedVideoId(video._id)
            }}
            showOptions={props.userType !== UserType.STUDENT}
          />
        ))}
      </SimpleGrid>
      <Modal
        opened={playVideo !== null}
        onClose={() => setPlayVideo(null)}
        title={playVideo?.name}
        centered
        size="xl"
        styles={{
          title: {
            fontWeight: 700,
            fontSize: 20,
          },
        }}
      >
        <video
          src={playVideo?.url}
          controls
          style={{
            width: "100%",
          }}
          controlsList={props.userType === UserType.STUDENT ? "nodownload" : ""}
        ></video>
      </Modal>
      <Modal
        opened={selectedVideo !== null}
        onClose={() => setSelectedVideo(null)}
        title="Add To Course"
        centered
      >
        <Stack>
          <Select
            value={selectedCourse}
            data={allCourses}
            onChange={(val) => {
              if (val) setSelectedCourse(val);
            }}
            placeholder="Select Course"
          />
          <Flex justify="right">
            <Button
              variant="outline"
              style={{
                border: "1px solid #808080",
                borderRadius: "30px",
                color: "#000",
              }}
              size={isMd ? "sm" : "lg"}
              mr={10}
              onClick={() => {
                setSelectedVideo(null);
              }}
            >
              Cancel
            </Button>
            <Button
              bg="#4B65F6"
              size={isMd ? "sm" : "lg"}
              style={{
                border: "1px solid #808080",
                borderRadius: "30px",
              }}
              sx={{
                "&:hover": {
                  background: "#4B65F6",
                },
                "&:disabled": {
                  opacity: 0.3,
                  background: "#4B65F6",
                },
              }}
              onClick={() => {
                handleSubmit();
              }}
              leftIcon={<IconPlus />}
              disabled={selectedCourse.trim().length < 1}
            >
              Add Video
            </Button>
          </Flex>
        </Stack>
      </Modal>
      <Modal
        opened={showDeleteWarning}
        onClose={() => {
          setShowDeleteWarning(false);
        }}
        centered
        style={{ zIndex: 9999999 }}
        title="Delete Recroding"
      >
        <Stack>
          <Text>{`Are you sure you want to delete this recording?`}</Text>
          <Group>
            <Button
              color="#909395"
              fz={16}
              fw={500}
              style={{
                border: "#909395 solid 1px",
                color: "#909395",
              }}
              variant="outline"
              size="lg"
              w="47%"
              onClick={() => {
                setShowDeleteWarning(false);
              }}
            >
              Cancel
            </Button>
            <Button
              style={{
                backgroundColor: "#FF0000",
                color: "white",
              }}
              size="lg"
              w="47%"
              fz={16}
              fw={500}
              onClick={() => {
                if(selectedDeletedVideoId)
                handleRecordingDelete(selectedDeletedVideoId)
              }}
            >
              Yes,Delete it
            </Button>
          </Group>
        </Stack>
      </Modal>
    </>
  );
}
