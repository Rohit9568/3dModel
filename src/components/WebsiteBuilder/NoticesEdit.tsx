import { Carousel, Embla } from "@mantine/carousel";
import {
  Box,
  Button,
  Center,
  Flex,
  Group,
  Modal,
  Stack,
  Text,
  useMantineTheme,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { IconChevronLeft, IconChevronRight, IconTrash } from "@tabler/icons";
import { useState } from "react";
import { glimpseDescription } from "../../utilities/HelperFunctions";
import { NoticeEditor } from "../AdminPage/HomeSection/NoticeEditor";
import { Mixpanel } from "../../utilities/Mixpanel/MixpanelHelper";
import { AdminPageEvents } from "../../utilities/Mixpanel/AnalyticEventAdminApp";
import {
  AddNotice,
  DeleteNotice,
} from "../../_parentsApp/features/noticeSlice";
import { showNotification } from "@mantine/notifications";
import { DashBoardSection } from "../AdminPage/DashBoard/DashBoard";

export function NoticesEdit(props: {
  notices: Notice[];
  instituteId: string;
  setIsLoading: (val: boolean) => void;
  reloadInstituteData: () => void;
  setSelectedNotice: (val: Notice) => void;
  setSelectedSection: (val: DashBoardSection) => void;
}) {
  const theme = useMantineTheme();
  const isMd = useMediaQuery(`(max-width: ${theme.breakpoints.md}px)`);

  const [noticeModal, setNoticeModal] = useState<boolean>(false);
  const [deleteModal, setDeleteModal] = useState<boolean>(false);
  const [seleteNoticeId, setDeleteNoticeId] = useState<string | null>(null);
  const [embla, setEmbla] = useState<Embla | null>(null);
  const TRANSITION_DURATION = 200;
  function deleteNotice(noticeId: string) {
    props.setIsLoading(true);
    DeleteNotice({
      id: noticeId,
    })
      .then(() => {
        props.reloadInstituteData();
        props.setIsLoading(false);
      })
      .catch((e) => {
        props.setIsLoading(false);
        console.log(e);
      });
  }
  return (
    <>
      <Stack w={"100%"}>
        <Group>
          <Text fz={isMd ? 28 : 40} fw={700}>
            Notices
          </Text>
          <Button
            variant={"outline"}
            color="dark"
            radius={50}
            onClick={() => setNoticeModal(true)}
          >
            Add Notice
          </Button>
        </Group>
        <Flex
          w={"100%"}
          bg={"white"}
          style={{ border: "2px dashed #BEBEBE", borderRadius: 7 }}
        >
          <Center w={"100%"}>
            {props.notices.length !== 0 && (
              <Carousel
                getEmblaApi={setEmbla}
                slideSize={isMd ? "95%" : "33.33333%"}
                slideGap={10}
                align={
                  isMd
                    ? "center"
                    : props.notices.length < 2
                    ? "center"
                    : "start"
                }
                w={"100%"}
                px={"5%"}
                py={"4%"}
                loop
                nextControlIcon={
                  <Box
                    w={"60%"}
                    h={"100%"}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      borderRadius: "4px",
                    }}
                  >
                    <IconChevronRight size={60} stroke={1} color="#747474" />
                  </Box>
                }
                previousControlIcon={
                  <Box
                    w={"60%"}
                    h={"100%"}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      borderRadius: "4px",
                    }}
                  >
                    <IconChevronLeft size={60} stroke={1} color="#747474" />
                  </Box>
                }
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
                    background: "transparent",
                    border: "none",
                    boxShadow: "none",
                    height: "200px",
                    opacity: isMd ? 0 : 1,
                    "&[data-inactive]": {
                      opacity: 0,
                      cursor: "default",
                    },
                  },
                  indicator: {
                    width: 8,
                    height: 8,
                    backgroundColor: "red",
                  },
                  indicators: {
                    top: "110%",
                  },
                }}
                m={0}
              >
                {props.notices.map((notice, i) => {
                  return (
                    <Carousel.Slide
                      style={{
                        height: 214,
                        maxWidth: 370,
                      }}
                    >
                      <Flex
                        p={20}
                        maw={371}
                        h={214}
                        direction={"column"}
                        justify="space-between"
                        align="flex-start"
                        style={{
                          border: "1px solid #E9E9E9",
                          borderRadius: 10,
                        }}
                      >
                        <Flex gap={10} justify={"center"}>
                          <Text fw={600} fz={16}>
                            {notice.heading}
                          </Text>
                          <Center>
                            <IconTrash
                              color="#ff0000"
                              onClick={() => {
                                setDeleteNoticeId(notice._id);
                                setDeleteModal(true);
                              }}
                              style={{ cursor: "pointer" }}
                            />
                          </Center>
                        </Flex>
                        <Text>
                          {glimpseDescription(notice.Description, 20)}
                        </Text>
                        <Button
                          variant="outline"
                          style={{ borderRadius: "24px" }}
                          fz={16}
                          fw={700}
                          color="dark"
                          onClick={() => {
                            props.setSelectedNotice(notice);
                            props.setSelectedSection(DashBoardSection.NOTICE);
                          }}
                        >
                          View Notice
                        </Button>
                      </Flex>
                    </Carousel.Slide>
                  );
                })}
              </Carousel>
            )}
            {props.notices.length === 0 && (
              <Stack align="center" my={20}>
                <Box
                  w={110}
                  h={110}
                  bg="#F7F7FF"
                  style={{ borderRadius: "50%" }}
                >
                  <Center h={"100%"} p={"25%"}>
                    <img src={require("../../assets/emptyNotices.png")}></img>
                  </Center>
                </Box>
                <Text fz={18} fw={500}>
                  Notices not added yet!
                </Text>
                <Button
                  style={{ background: "#4B65F6" }}
                  onClick={() => {
                    setNoticeModal(true);
                  }}
                >
                  Add Notice
                </Button>
              </Stack>
            )}
          </Center>
        </Flex>
      </Stack>
      <Modal
        opened={noticeModal}
        onClose={() => {
          setNoticeModal(false);
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
            props.setIsLoading(true);
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
                props.reloadInstituteData();
                embla?.scrollTo(0);
              })
              .catch((e) => {
                console.log(e);
              });
            setNoticeModal(false);
            props.setIsLoading(false);
          }}
          fileName={[]}
          attachedFiles={[]}
        />
      </Modal>
      <Modal
        opened={deleteModal}
        onClose={() => setDeleteModal(false)}
        centered
        zIndex={999}
        styles={{
          title: {
            fontSize: 20,
            fontWeight: 700,
          },
        }}
      >
        <Text fw={500} fz={20} align="center">
          Are you sure you want to delete this notice?
        </Text>
        <Group position="center" mt={20}>
          <Button
            variant="outline"
            color="dark"
            fw={700}
            radius={50}
            onClick={() => {
              setDeleteModal(false);
              setDeleteNoticeId(null);
            }}
          >
            Cancel
          </Button>
          <Button
            fw={700}
            radius={50}
            style={{ background: "red " }}
            onClick={() => {
              setDeleteModal(false);
              if (seleteNoticeId) deleteNotice(seleteNoticeId);
            }}
          >
            Delete
          </Button>
        </Group>
      </Modal>
    </>
  );
}
