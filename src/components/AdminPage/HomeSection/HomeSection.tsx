import {
  Box,
  Button,
  Center,
  FileInput,
  Flex,
  Group,
  LoadingOverlay,
  Modal,
  ScrollArea,
  SimpleGrid,
  Stack,
  Text,
} from "@mantine/core";
import { IconEdit, IconTrash } from "../../_Icons/CustonIcons";
import { IconPlus } from "@tabler/icons";
import { useEffect, useRef, useState } from "react";

import { AddNotice } from "../../../_parentsApp/features/noticeSlice";
import { Carousel } from "@mantine/carousel";
import Autoplay from "embla-carousel-autoplay";
import { AddSchoolPhoto } from "../../../_parentsApp/features/instituteSlice";
import { useNavigate } from "react-router-dom";
import { NoticeEditor } from "./NoticeEditor";
import { useMediaQuery } from "@mantine/hooks";
import { Mixpanel } from "../../../utilities/Mixpanel/MixpanelHelper";
import { AdminPageEvents } from "../../../utilities/Mixpanel/AnalyticEventAdminApp";
import { showNotification } from "@mantine/notifications";
import { FileUpload } from "../../../features/fileUpload/FileUpload";
import { getMediaType, glimpseDescription, isDateOlderThan7Days, isHEIC } from "../../../utilities/HelperFunctions";

interface HomeSectionProps {
  photos: string[];
  notices: Notice[];
  instituteId: string;
  onAddNotice: (data: Notice) => void;
  onUpdateSchoolPhotos: (data: string[]) => void;
  tabClicked: boolean;
  setTabClicked: (val: boolean) => void;
  instituteName: string;
  setdeleteWarning: (val: string | null) => void;
  sideBarIsCollapsed: boolean;
  onEditClick:()=>void
  onNoticeClick:(data:string)=>void
}



export function HomeSection(props: HomeSectionProps) {
  const isMd = useMediaQuery(`(max-width: 500px)`);
  const isLg = useMediaQuery(`(max-width: 1000px)`);
  const [isAddNoticeClicked, setIsAddNoticeClicked] = useState<boolean>(false);
  const [value, setValue] = useState<File | null>(null);
  const autoplay = useRef(Autoplay({ delay: 2000 }));
  const viewport = useRef<HTMLDivElement>(null);
  const [isError, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const carouselRef = useRef<any>(null);

  const scrollToTop = () => {
    if (viewport.current)
      viewport.current.scrollTo({ top: 0, behavior: "smooth" });
  };

  async function submitHandler(file: File) {
    Mixpanel.track(AdminPageEvents.ADMIN_APP_HOME_PAGE_ADD_ICON_CLICKED);
    setIsLoading(true);
    await FileUpload({ file })
      .then((data: any) => {
        AddSchoolPhoto({ imgUrl: data.url, id: props.instituteId })
          .then((x: any) => {
            showNotification({
              message: "Image Added Successfully ✔",
            });
            Mixpanel.track(
              AdminPageEvents.ADMIN_APP_HOME_PAGE_IMAGE_UPLOAD_SUCCESS
            );
            props.onUpdateSchoolPhotos(x.schoolPhotos);
            setIsLoading(false);
          })
          .catch((e) => {
            console.log(e);
          });
      })
      .catch((err) => {
        console.log(err);
      });
  }
  useEffect(() => {
    const timer = setTimeout(() => {
      window.dispatchEvent(new Event("resize"));
    }, 310);

    return () => clearTimeout(timer);
  }, [props.sideBarIsCollapsed]);
  useEffect(() => {
    if (value !== null) {
      const isError = isHEIC(value);
      const isSizeValid = value.size <= 5 * 1024 * 1024;
      if (isError) {
        setError("File Format not supported");
      } 
      else if(!isSizeValid){
        setError("Maximum Size should be 5mb");
      }
      else {
        setError(null);
        submitHandler(value);
      }
    }
  }, [value]);

  useEffect(() => {
    scrollToTop();
  }, [props.notices]);

  
  return (
    <Stack h="100%">
      <LoadingOverlay
        visible={isLoading}
      />
      <Box
        w="100%"
        style={{
          border: props.photos.length === 0 ? "#BEBEBE dashed 2px" : "none",
          borderRadius: "7px",
          position: "relative",
          minHeight: "40%",
        }}
      >
        <Flex
          justify="center"
        >
        {props.photos.length !== 0 && !isLoading && isMd &&(
          <Carousel
            // mx="auto"
            withIndicators
            height={isMd ? "30vh" : "40vh"}
            loop
            plugins={[autoplay.current]}
            onMouseEnter={autoplay.current.stop}
            onMouseLeave={autoplay.current.reset}
            onClick={autoplay.current.stop}
            w={"90%"}
            ref={carouselRef}
            style={{
              minHeight:'25vh',
            }}
            slideSize={isMd?"100%":"50%"}

          >
            {props.photos.map((url, index) => {
              const mediaType = getMediaType(url);
              return (
                <Carousel.Slide key={index}
               
                >
                  {mediaType === "image" && (
                    <Center
                    h="100%"
                    w="100%"
                    >
                    <img
                      src={url}
                      alt={`Slide ${index + 1}`}
                      style={{
                        // width: isMd?"auto":"auto",
                        // maxWidth:'100%',
                        maxWidth:'100%',
                    maxHeight:'100%',
                    height: isMd?"auto":"auto",
                    borderRadius: "16px",
                    objectFit: "cover",
                    objectPosition:'center',
                    textAlign:'center',
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
        {props.photos.length !== 0 && !isLoading && !isMd &&(
          <Carousel
            // mx="auto"
            withIndicators
            height={isMd ? "30vh" : "40vh"}
            loop
            plugins={[autoplay.current]}
            onMouseEnter={autoplay.current.stop}
            onMouseLeave={autoplay.current.reset}
            onClick={autoplay.current.stop}
            w={"90%"}
            ref={carouselRef}
            style={{
              minHeight:'25vh',
            }}
            slideSize={isMd?"100%":"50%"}

          >
            {props.photos.map((url, index) => {
              const mediaType = getMediaType(url);
              return (
                <Carousel.Slide key={index}
                w={"100%"}
                >
                  {mediaType === "image" && (
                    <Center
                    h="100%"
                    w="100%"
                    >
                    <img
                      src={url}
                      alt={`Slide ${index + 1}`}
                      style={{
                        maxWidth:'100%',
                        maxHeight:'100%',
                        height: isMd?"auto":"auto",
                        borderRadius: "16px",
                        objectFit: "cover",
                        objectPosition:'center',
                        textAlign:'center',
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
        </Flex>
        <Flex
          w={"100%"}
          justify={"center"}
          gap={"lg"}
          style={{
            position: props.photos.length===0?"absolute":"unset",
            bottom: props.photos.length===0?-30:0
          }}
        >
          <Box
            style={{
              borderRadius: "50%",
              filter: "drop-shadow(0px 0px 8px rgba(0, 0, 0, 0.25))",
              width: "54px",
              height: "54px",
              backgroundColor: "#F8F8F8",
            }}
          >
            <Center
              h="100%"
              w="100%"
              onClick={() => {
                Mixpanel.track(
                  AdminPageEvents.ADMIN_APP_HOME_PAGE_EDIT_ICON_CLICKED
                );
                props.onEditClick();
              }}
              style={{
                cursor: "pointer",
              }}
            >
              <Box h={21} w={21}>
                <IconEdit />
              </Box>
            </Center>
          </Box>
          <label
            htmlFor="fileInput"
            style={{
              display: "block",
              borderRadius: "50%",
              width: "54px",
              height: "54px",
              backgroundColor: "#F8F8F8",
              cursor: "pointer",
              filter: "drop-shadow(0px 0px 8px rgba(0, 0, 0, 0.25))",
            }}
          >
            <Center h="100%" w="100%">
              <IconPlus />
            </Center>
          </label>

          <FileInput
            id="fileInput"
            value={value}
            onChange={(x) => {
              setValue(x);
            }}
            style={{ display: "none" }}
          />
        </Flex>
      </Box>
      <Group position="apart" ml={20} mt={60}>
        <Button
          fz={18}
          fw={500}
          size="lg"
          style={{
            backgroundColor: "#3174F3",
            borderRadius: "10px",
          }}
          onClick={() => {
            Mixpanel.track(
              AdminPageEvents.ADMIN_APP_HOME_PAGE_ADD_NOTICE_BUTTON_CLICKED
            );
            setIsAddNoticeClicked(true);
          }}
        >
          Add Notice
        </Button>
        {isError && (
          <Text w="50%" color="red">
            {isError}
          </Text>
        )}
      </Group>
      <ScrollArea h="45vh" viewportRef={viewport}>
        <SimpleGrid cols={isMd ? 1 : isLg ? 2 : 3} w="100%" px={2} my={10}>
          {isMd
            ? props.notices.map((x) => {
                return (
                  <Flex
                    style={{
                      boxShadow: "0px 0px 4px 0px rgba(0, 0, 0, 0.25)",
                      borderRadius: "10px",
                    }}
                    h="65px"
                    justify="space-between"
                    align="center"
                    key={x._id}
                  >
                    <Flex
                      py={15}
                      px={10}
                      justify="space-between"
                      align="center"
                      w="80%"
                      onClick={() => {
                        Mixpanel.track(
                          AdminPageEvents.ADMIN_APP_HOME_PAGE_NOTICE_CLICKED
                        );
                        props.onNoticeClick(x._id)
                      }}
                      style={{
                        cursor: "pointer",
                        overflowWrap: "break-word",
                      }}
                    >
                      <Text
                        fz={13}
                        fw={600}
                      >
                        {`"${x.heading}"`}
                      </Text>
                      {!isDateOlderThan7Days(x.createdAt) && (
                        <img src={require("../../../assets/newSolid.png")} 
                          alt="New Notice"
                        />
                      )}
                    </Flex>
                    <Box
                      style={{
                        height: "100%",
                        width: "20%",
                        backgroundColor: "#F1F1F1",
                        borderRadius: "0px 10px 10px 0px",
                        cursor: "pointer",
                      }}
                      onClick={() => [props.setdeleteWarning(x._id)]}
                    >
                      <Center h="100%" w="100%">
                        <IconTrash />
                      </Center>
                    </Box>
                  </Flex>
                );
              })
            : props.notices.map((x) => {
                return (
                  <Flex
                    style={{
                      boxShadow: "0px 0px 4px 0px rgba(0, 0, 0, 0.25)",
                      borderRadius: "10px",
                      cursor: "pointer",
                    }}
                    mx={5}
                    justify="space-between"
                    align="flex-start"
                    direction={"column"}
                    px={16}
                    py={16}
                    onClick={() => {
                      Mixpanel.track(
                        AdminPageEvents.ADMIN_APP_HOME_PAGE_NOTICE_CLICKED
                      );
                      props.onNoticeClick(x._id)
                    }}
                    key={x._id}
                  >
                    <Text fz={13} fw={600}>
                      {`"${x.heading}"`}
                    </Text>
                    <Text mt={15} fz={12}>
                      <div>{glimpseDescription(x.Description)}</div>
                    </Text>
                    <Flex
                      pt={10}
                      w={"100%"}
                      gap={"xs"}
                      justify={"space-between"}
                    >
                      <Flex gap={"xs"}>
                        <Button
                          variant="outline"
                          style={{ borderRadius: "24px", width: "100px" }}
                        >
                          <Text fz={10} fw={500}>
                            View Notice
                          </Text>
                        </Button>
                        <Box
                          style={{
                            height: "32px",
                            width: "32px",
                            backgroundColor: "red",
                            borderRadius: "50%",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyItems: "center",
                          }}
                          onClick={() => {
                            Mixpanel.track(
                              AdminPageEvents.ADMIN_APP_HOME_PAGE_DELETE_ICON_CLICK
                            );
                            props.setdeleteWarning(x._id);
                          }}
                        >
                          <Center h="80%" w="100%">
                            <IconTrash col="white" size="18" />
                          </Center>
                        </Box>
                      </Flex>
                      {!isDateOlderThan7Days(x.createdAt) && (
                        <img src={require("../../../assets/newSolid.png")} 
                          alt="New Notice"
                        />
                      )}
                    </Flex>
                  </Flex>
                );
              })}
        </SimpleGrid>
      </ScrollArea>
      <Modal
        opened={isAddNoticeClicked}
        onClose={() => {
          setIsAddNoticeClicked(false);
          Mixpanel.track(
            AdminPageEvents.ADMIN_APP_HOME_PAGE_CANCEL_BUTTON_CLICKED
          );
        }}
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
          intialDescription=""
          intialHeading=""
          onSubmit={(head, desc, attachedFiles) => {
            Mixpanel.track(
              AdminPageEvents.ADMIN_APP_HOME_PAGE_SUBMIT_BUTTON_CLICKED
            );
            AddNotice({
              heading: head,
              description: desc,
              instituteId: props.instituteId,
              attachedFiles,
            })
              .then((x: any) => {
                showNotification({
                  message: "New Notice Added ✔",
                });
                Mixpanel.track(
                  AdminPageEvents.ADMIN_APP_HOME_PAGE_NOTICE_CREATED_SUCCESS
                );
                props.onAddNotice(x);
              })
              .catch((e) => {
                console.log(e);
              });
            setIsAddNoticeClicked(false);
          }}
          fileName={[]}
          attachedFiles={[]}
        />
      </Modal>
    </Stack>
  );
}
