import {
  Card,
  Container,
  Divider,
  Modal,
  SimpleGrid,
  Stack,
  Text,
} from "@mantine/core";
import {
  convertToEmbedLink,
  getVideoId,
  isHTML,
  reduceImageScaleAndAlignLeft,
} from "../../utilities/HelperFunctions";
import { marked } from "marked";
import { useMediaQuery } from "@mantine/hooks";
import { useState } from "react";

interface TopicPageProps {
  topicName: string;
  topic: string;
  videos: string[];
}
export function TopicPage(props: TopicPageProps) {
  const [showVideo, setShowVideo] = useState<string>("");
  const markdownText = `${props.topic ?? ""}`;
  const htmlText = marked(markdownText);
  const tempElement = document.createElement("div");
  tempElement.innerHTML = htmlText;
  const images = tempElement.querySelectorAll("img");
  images.forEach((image) => {
    image.setAttribute("width", "300");
    image.setAttribute("height", "250");
  });
  const modifiedHtml = tempElement.innerHTML;
  const isMd = useMediaQuery(`(max-width: 500px)`);

  const preventContextMenu = (event: any) => {
    event.preventDefault();
  };
  return (
    <Stack>
      <Text color="#000" fz={24} fw={500}>
        {props.topicName}
      </Text>
      {isHTML(props.topic ?? "") && isMd && (
        <Text>
          <div
            dangerouslySetInnerHTML={{
              __html: reduceImageScaleAndAlignLeft(props.topic) ?? "",
            }}
          />
        </Text>
      )}
      {isHTML(props.topic ?? "") && !isMd && (
        <Text>
          <div
            dangerouslySetInnerHTML={{
              __html: props.topic ?? "",
            }}
          />
        </Text>
      )}

      {!isHTML(props.topic ?? "") && (
        <div dangerouslySetInnerHTML={{ __html: modifiedHtml }} />
      )}
      <Divider size="sm" />
      {props?.videos?.length !== 0 && (
        <Text color="#3174F3" fz={30} fw={600}>
          Videos
        </Text>
      )}
      <SimpleGrid
        cols={3}
        verticalSpacing={35}
        breakpoints={[
          { maxWidth: "lg", cols: 3, spacing: "md" },
          { maxWidth: "md", cols: 2, spacing: "sm" },
          { maxWidth: "sm", cols: 2, spacing: "sm" },
        ]}
      >
        {props?.videos?.map((x) => {
          return (
            <>
              <Card
                p={0}
                onClick={() => {
                  // if (!props.isAnimatedVideos)
                  setShowVideo(convertToEmbedLink(x));
                  // else setShowVideo(x);
                }}
                key={x}
              >
                <img
                  src={`https://i.ytimg.com/vi/${getVideoId(x)}/hqdefault.jpg`}
                  style={{
                    //   height: "100%",
                    width: "100%",
                  }}
                  alt="videoThumbnail"
                />
              </Card>
            </>
          );
        })}
      </SimpleGrid>
      <Modal
        size={isMd ? "100vw" : "70vw"}
        opened={showVideo !== ""}
        onClose={() => setShowVideo("")}
        style={{ padding: 0 }}
        withCloseButton={false}
        centered={isMd}
      >
        <Container size={"xl"}>
          <div
            style={{
              width: "100%",
              paddingTop: "56.25%",
            }}
          >
            <iframe
              style={{
                position: "absolute",
                top: "0",
                left: "0",
                bottom: "0",
                right: "0",
                width: "100%",
                height: "100%",
              }}
              onContextMenu={preventContextMenu}
              allow="autoplay"
              src={showVideo}
              allowFullScreen={true}
            ></iframe>
          </div>
        </Container>
      </Modal>
    </Stack>
  );
}
