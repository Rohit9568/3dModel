import {
  Container,
  Stack,
  Text,
  Flex,
  Button,
  createStyles,
  Modal,
  LoadingOverlay,
  TextInput,
  Card,
  SimpleGrid,
  Center,
} from "@mantine/core";
import { Mixpanel } from "../../utilities/Mixpanel/MixpanelHelper";
import { useState } from "react";
import { CanvasDrawVideo } from "./CanvasDrawVideo";
import { AddVideotoUserTopic } from "../../features/UserSubject/chapterDataSlice";
import { useSelector } from "react-redux";
import { RootState } from "../../store/ReduxStore";
import { useMediaQuery } from "@mantine/hooks";
import { WebAppEvents } from "../../utilities/Mixpanel/AnalyticeEventWebApp";
import { convertToEmbedLink, getVideoId } from "../../utilities/HelperFunctions";

const useStyles = createStyles((theme) => ({
  videoCard: {
    boxShadow: "0px 0px 25px 0px rgba(0, 0, 0, 0.3)",
    borderRadius: 12,
    width: 360,
    height: 210,
    background: "#F5F5F5",
    cursor: "pointer",
  },
}));

interface VideoPageProps {
  topic?: SingleTopic;
  onUpdateTopic: (id: string, data: SingleTopic) => void;
  isAnimatedVideos: boolean;
  videos: string[];
}
export function VideoPage(props: VideoPageProps) {
  const { classes } = useStyles();
  const [showEdit, setShowEdit] = useState<boolean>(false);
  const [loadingData, setLoadingData] = useState<boolean>(false);
  const [showVideo, setShowVideo] = useState<string>("");
  const chapterId = useSelector<RootState, string | null>((state) => {
    return state.currentSelectionSlice.chapterId;
  });
  const isMd = useMediaQuery(`(max-width: 820px)`);

  async function formHandler(event: any) {
    event.preventDefault();
    setShowEdit(false);
    const formData = new FormData(event.target);
    const formDataObj = Object.fromEntries(formData.entries());
    setLoadingData(true);
    if (props.topic && props.topic._id && chapterId) {
      await AddVideotoUserTopic({
        id: props.topic?._id,
        chapterId: chapterId,
        videoUrl: formDataObj["videoUrl"],
      })
        .then((data: any) => {
          setLoadingData(false);
          props.onUpdateTopic(props.topic?._id ?? "", data);
        })
        .catch((error) => {
          setLoadingData(false);
          console.log(error);
        });
    }
  }

  return (
    <Container size={"xl"} style={{ padding: 0 }} mb={100}>
      <SimpleGrid
        cols={3}
        verticalSpacing={35}
        breakpoints={[
          { maxWidth: "lg", cols: 3, spacing: "md" },
          { maxWidth: "md", cols: 2, spacing: "sm" },
          { maxWidth: "sm", cols: 1, spacing: "sm" },
        ]}
      >
        {!props.isAnimatedVideos && (
          <Card
            className={classes.videoCard}
            style={{
              position: "relative",
              width: "min(calc(100vh * (16/9)), 100%)",
              height: "auto",
              aspectRatio: "16/9",
              alignContent: "center",
            }}
            onClick={() => {
              Mixpanel.track(
                WebAppEvents.TEACHER_APP_LEARN_PAGE_ADD_VIDEOS_CLICKED
              );
              setShowEdit(true);
            }}
          >
            <Center h="100%">
              <Stack align="center" spacing={5}>
                <Text c="#767676" fw={700} fz={40}>
                  +
                </Text>
                <Text c={"#3174F3"} fw={600} fz={20}>
                  Add Video
                </Text>
              </Stack>
            </Center>
          </Card>
        )}

        {props.isAnimatedVideos &&
        props.videos &&
          props.videos?.map((x) => {
            return (
              <>
                <Card
                  className={classes.videoCard}
                  p={0}
                  onClick={() => {
                    if (!props.isAnimatedVideos)
                      setShowVideo(convertToEmbedLink(x));
                    else setShowVideo(x);
                  }}
                  key={x}
                >
                  <img
                    src={`https://i.ytimg.com/vi/${getVideoId(
                      x
                    )}/hqdefault.jpg`}
                    style={{
                      height: "100%",
                      width: "100%",
                    }}
                    alt="videoThumbnail"
                  />
                </Card>
              </>
            );
          })}
        {!props.isAnimatedVideos &&
        props.videos &&
          props.videos.map((x) => {
            return (
              <Card
                className={classes.videoCard}
                p={0}
                onClick={() => {
                  setShowVideo(convertToEmbedLink(x));
                }}
                style={{
                  position: "relative",
                  width: "min(calc(100vh * (16/9)), 100%)",
                  height: "auto",
                  aspectRatio: "16/9",
                  alignContent: "center",
                }}
                key={x}
              >
                <img
                  src={`https://i.ytimg.com/vi/${getVideoId(x)}/hqdefault.jpg`}
                  style={{
                    height: "100%",
                    width: "100%",
                  }}
                  alt="videoThumbnail"
                />
              </Card>
            );
          })}
      </SimpleGrid>
      <Modal
        size={"lg"}
        opened={showEdit}
        onClose={() => setShowEdit(false)}
        style={{ padding: 0 }}
        withCloseButton={false}
        centered
      >
        <Flex p={10} direction="column">
          <Text fw={500} fz={20} mb={10}>
            Add Youtube Video Link:
          </Text>
          <form onSubmit={formHandler}>
            <TextInput
              name="videoUrl"
              onChange={() =>
                Mixpanel.track(
                  WebAppEvents.TEACHER_APP_LEARN_PAGE_VIDEOS_DIALOG_BOX_LINK_ADDED
                )
              }
            />
            <Button
              type="submit"
              onClick={() =>
                Mixpanel.track(
                  WebAppEvents.TEACHER_APP_LEARN_PAGE_VIDEOS_DIALOG_BOX_SUBMIT_CLICKED
                )
              }
              mt={15}
            >
              Submit
            </Button>
          </form>
        </Flex>
      </Modal>
      <Modal
        size={isMd ? "100vw" : "70vw"}
        opened={showVideo !== ""}
        onClose={() => setShowVideo("")}
        style={{ padding: 0 }}
        withCloseButton={false}
        centered={isMd}
      >
        <CanvasDrawVideo videoLink={showVideo} />
      </Modal>
      <LoadingOverlay visible={loadingData}></LoadingOverlay>
    </Container>
  );
}
