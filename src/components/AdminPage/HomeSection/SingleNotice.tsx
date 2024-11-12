import {
  Box,
  Button,
  Center,
  Flex,
  Grid,
  Group,
  Modal,
  ScrollArea,
  Stack,
  Text,
} from "@mantine/core";
import { useEffect, useState } from "react";
import { UpdateNotice } from "../../../_parentsApp/features/noticeSlice";
import { IconBackArrow, IconTrash } from "../../_Icons/CustonIcons";
import { NoticeEditor } from "./NoticeEditor";
import { PdfViewer } from "../../_New/FileUploadBox";
import { useNavigate } from "react-router-dom";
import { useMediaQuery } from "@mantine/hooks";
import { showNotification } from "@mantine/notifications";

interface SingleNoticeProps {
  instituteId: any;
  instituteName: any;
  notice: Notice;
  onUpdateNotice: (data: Notice | "DELETED", id: string) => void;
  setdeleteWarning: (val: string | null) => void;
  onBackClick: () => void;
}

export function SingleNotice(props: SingleNoticeProps) {
  const [isEditClicked, setIsEditClicked] = useState<boolean>(false);
  const [currentPdf, setCurrentPdf] = useState<string | null>(null);
  const isMd = useMediaQuery(`(max-width: 820px)`);
  const [images, setImages] = useState<
    {
      imageLink: string;
      aspectRatio: number;
    }[]
  >([]);

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
    <Stack
      w="100%"
      h={isMd ? "100%" : "100vh"}
      style={{
        position: "relative",
      }}
      pt={40}
      pl={20}
    >
      <Grid w={"100%"}>
        <Grid.Col span={2}>
          <Box
            onClick={() => {
              props.onBackClick();
            }}
            style={{
              backgroundColor: "#F8F8F8",
              borderRadius: "50%",
              width: "40px",
              height: "40px",
              cursor: "pointer",
            }}
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
              fontWeight: "600",
              textDecoration: "underline",
              wordWrap: "break-word",
            }}
          >
            {`"${props.notice.heading}"`}
          </Text>
        </Grid.Col>
      </Grid>
      <Stack w="100%" px={15} h="100%">
        <ScrollArea h="80%" w="100%">
          <Text fz={15} fw={600} color="#595959" mt={5} h="100%">
            {" "}
            <div
              dangerouslySetInnerHTML={{ __html: props.notice.Description }}
            />
          </Text>
          <Stack>
            {images.map((x, i) => {
              return (
                <Box w="100%" ta="center" key={i}>
                  <img
                    src={x.imageLink}
                    style={{
                      width: isMd ? "70%" : "30%",
                      aspectRatio: x.aspectRatio,
                    }}
                  />
                </Box>
              );
            })}
            {pdfs.map((x, i) => {
              return (
                <Flex
                  key={i}
                  style={{
                    border: "#3174F3 solid 1px",
                    borderRadius: "10px",
                  }}
                  pl={20}
                  py={10}
                  onClick={() => {
                    setCurrentPdf(x.url);
                  }}
                  justify="space-between"
                  align="center"
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
      </Stack>
      {isMd ? (
        <Group
          style={{
            position: "fixed",
            width: "100%",
            height: "70px",
            bottom: 60,
            left: 0,
            borderTop: "1px solid #B7B7B7",
            borderBottom: "1px solid #B7B7B7",
            background: "#FFF",
            boxShadow: "0px -10px 9px 0px rgba(0, 0, 0, 0.04)",
          }}
          position="center"
          py={10}
        >
          <Box
            style={{
              border: "#F00 solid 1px",
              borderRadius: "8px",
              height: "100%",
              width: "50px",
            }}
            onClick={() => {
              props.setdeleteWarning(props.notice._id);
            }}
          >
            <Center h="100%" w="100%">
              <IconTrash col="#F00" />
            </Center>
          </Box>
          <Button
            style={{
              backgroundColor: "#3174F3",
              width: "50%",
              fontSize: 16,
              fontWeight: 500,
              zIndex: 999,
              cursor: "pointer",
            }}
            size="lg"
            onClick={() => {
              setIsEditClicked(true);
            }}
          >
            Edit Notice
          </Button>
        </Group>
      ) : (
        <Group
          style={{
            position: "absolute",
            width: "100%",
            bottom: 0,
            right: 0,
            background: "#F8F8F8",
            boxShadow: "0px -10px 9px 0px rgba(0, 0, 0, 0.04)",
          }}
          position="center"
          py={10}
        >
          <Box
            style={{
              border: "#F00 solid 1px",
              borderRadius: "8px",
              height: "100%",
              width: "50px",
            }}
            onClick={() => {
              props.setdeleteWarning(props.notice._id);
            }}
          >
            <Center h="100%" w="100%">
              <IconTrash col="#F00" />
            </Center>
          </Box>
          <Button
            style={{
              backgroundColor: "#3174F3",
              width: "50%",
              fontSize: 16,
              fontWeight: 500,
              zIndex: 999,
            }}
            size="lg"
            onClick={() => {
              setIsEditClicked(true);
            }}
          >
            Edit Notice
          </Button>
        </Group>
      )}
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
            <PdfViewer url={currentPdf} 
            showOptions={true}
            />
          </Box>
        )}
      </Modal>
      <Modal
        opened={isEditClicked}
        onClose={() => setIsEditClicked(false)}
        title="Add Notice"
        style={{ zIndex: 9999 }}
        styles={{
          title: {
            fontSize: 18,
            fontWeight: 500,
          },
        }}
        centered
      >
        <NoticeEditor
          intialHeading={props.notice.heading}
          intialDescription={props.notice.Description}
          onSubmit={(heading, desc, attachedFiles) => {
            showNotification({
              message: "Notice Successfully Edited",
            });
            UpdateNotice({
              heading: heading,
              description: desc,
              id: props.notice._id,
              attachedFiles,
            })
              .then((x: any) => {
                props.onUpdateNotice(x, props.notice._id);
              })
              .catch((e) => {
                console.log(e);
              });
            setIsEditClicked(false);
          }}
          fileName={[]}
          attachedFiles={props.notice.attachedFiles}
        />
      </Modal>
    </Stack>
  );
}
