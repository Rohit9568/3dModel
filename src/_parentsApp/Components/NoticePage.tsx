import { useEffect, useState } from "react";
import {
  Box,
  Text,
  Stack,
  Flex,
  Modal,
  Grid,
  ScrollArea,
  Center,
} from "@mantine/core";
import { IconBackArrow } from "../../components/_Icons/CustonIcons";
import { PdfViewer } from "../../components/_New/FileUploadBox";
import { useMediaQuery } from "@mantine/hooks";
import { Mixpanel } from "../../utilities/Mixpanel/MixpanelHelper";
import { ParentPageEvents } from "../../utilities/Mixpanel/AnalyticEventParentApp";

interface NoticePageProps {
  onBack: () => void;
  notice: Notice;
}

const NoticePage = (props: NoticePageProps) => {
  const [images, setImages] = useState<
    {
      imageLink: string;
      aspectRatio: number;
    }[]
  >([]);
  const [currentPdf, setCurrentPdf] = useState<string | null>(null);
  const isMd = useMediaQuery(`(max-width: 820px)`);
  const pdfs = props.notice.attachedFiles.filter(
    (x) => x.mimetype === "application/pdf"
  );
  useEffect(() => {
    const imgs = props.notice.attachedFiles.filter(
      (x) => x.mimetype !== "application/pdf"
    );
    if (imgs) {
      Promise.all(
        imgs.map((imgObj) => {
          if (imgObj && imgObj.url !== null) {
            return new Promise((resolve, reject) => {
              const img = new Image();
              img.src = imgObj.url;
              img.onload = function () {
                const aspectRatio = img.width / img.height;
                resolve({
                  imageLink: imgObj.url,
                  aspectRatio: aspectRatio,
                });
              };
              img.onerror = reject;
            });
          }
        })
      )
        .then((loadedImages: any) => {
          const filteredImages = loadedImages.filter(
            (img: any) => img !== undefined
          );
          setImages(filteredImages);
        })
        .catch((error) => {
          console.error("Error loading images:", error);
        });
    }
  }, [props.notice]);

  return (
    <Box h="100%">
      <Grid>
        <Grid.Col span={2}>
          <Box
            style={{
              backgroundColor: "#F8F8F8",
              borderRadius: "50%",
              width: "40px",
              height: "40px",
            }}
            onClick={props.onBack}
          >
            <Center w="100%" h="100%">
              <Box w="60%" h="50%">
                <IconBackArrow col="black" />
              </Box>
            </Center>
          </Box>
        </Grid.Col>
        <Grid.Col span={8}>
          <Text
            style={{
              color: "#303030",
              textAlign: "center",
              fontFamily: "Poppins",
              fontSize: "24px",
              fontWeight: "700",
              textDecorationLine: "underline",
            }}
          >
            {props.notice.heading}
          </Text>
        </Grid.Col>
      </Grid>
      <ScrollArea h={isMd ? "95%" : "90%"}>
        <Text
          style={{
            marginTop: "5%",
            marginLeft: "10%",
            marginRight: "10%",
            color: "#595959",
            fontFamily: "Poppins",
            fontSize: "15px",
            fontWeight: 600,
            textAlign: "justify",
          }}
        >
          <div dangerouslySetInnerHTML={{ __html: props.notice.Description }} />
        </Text>

        <Stack>
          {images.map((x) => {
            return (
              <Box ta="center" key={x.imageLink}>
                <img
                  src={x.imageLink}
                  style={{
                    width: isMd ? "70%" : "30%",
                    aspectRatio: x.aspectRatio,
                    textAlign: "center",
                  }}
                  alt={x.imageLink}
                />
              </Box>
            );
          })}
          {pdfs.map((x) => {
            return (
              <Flex
                style={{
                  border: "#3174F3 solid 1px",
                  borderRadius: "10px",
                }}
                pl={20}
                py={10}
                mx={10}
                justify="space-between"
                align="center"
                onClick={() => {
                  Mixpanel.track(
                    ParentPageEvents.PARENTS_APP_HOME_PAGE_DOCUMENT_CLICKED
                  );
                  setCurrentPdf(x.url);
                }}
                key={x.id}
              >
                <Text>{x.name}</Text>
                <Text
                  mr={10}
                  color="#3174F3"
                  style={{
                    cursor: "pointer",
                  }}
                >
                  View
                </Text>
              </Flex>
            );
          })}
        </Stack>
      </ScrollArea>
      <Modal
        size={isMd ? "100vw" : "70vw"}
        opened={currentPdf !== null}
        onClose={() => {
          setCurrentPdf(null);
        }}
        centered
        withCloseButton={false}
        style={{ zIndex: 9999 }}
      >
        {currentPdf !== null && (
          <Box w="100%" h={isMd ? "70vh" : "85vh"}>
            <PdfViewer url={currentPdf} showOptions={true} />
          </Box>
        )}
      </Modal>
    </Box>
  );
};

export default NoticePage;
