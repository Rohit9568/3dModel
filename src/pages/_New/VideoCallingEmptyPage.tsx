import {
  Box,
  Button,
  Card,
  Center,
  Divider,
  Flex,
  LoadingOverlay,
  Modal,
  ScrollArea,
  Stack,
  Text,
  TextInput,
  useMantineTheme,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { GetVideoCallOrderData } from "../../_parentsApp/features/paymentSlice";
import { showNotification } from "@mantine/notifications";
import { GetVideoAccess } from "../../_parentsApp/features/instituteSlice";
import { useEffect, useState } from "react";
import { displayRazorpay } from "../../utilities/Payment";
import {
  IconAddVideoCall,
  IconCross2,
  IconScheduleMeet,
  IconVideoSchedule,
} from "../../components/_Icons/CustonIcons";
import { DatePicker, TimeInput } from "@mantine/dates";
import { IconCalendar, IconClock } from "@tabler/icons";
import {
  CalenderTimeline,
  add30Days,
} from "../../_parentsApp/Components/ThirtyDaysTimeLine";
import {
  AddVideoCallMeetingToBatch,
  GetAllClassMeetings,
} from "../../_parentsApp/features/instituteClassSlice";
import { format, formatDate, isToday, set } from "date-fns";
import { convertToHyphenSeparated } from "../../utilities/HelperFunctions";
import { GetUser } from "../../utilities/LocalstorageUtility";
import { createVideoCallMeeting } from "../../features/videoCall/videoCallSlice";

function appendParentToBaseUrl(meeting: VideoCallMeeting) {
  const currentUrl = window.location.href;
  const user = GetUser();
  const urlParts = new URL(currentUrl);
  const base = urlParts.origin;
  const modifiedUrl = `${base}/videoCall/${meeting._id}`;
  return modifiedUrl;
}

export function isJoinClassDisabled(scheduleTime: Date): boolean {
  const currentTime = new Date();
  const tenMinutesBeforeMeeting = new Date(
    scheduleTime.getTime() - 10 * 60 * 1000
  );
  const twoHoursAfterMeeting = new Date(
    scheduleTime.getTime() + 2 * 60 * 60 * 1000
  );

  return (
    currentTime < tenMinutesBeforeMeeting || currentTime > twoHoursAfterMeeting
  );
}
function ScheduleVideoCallCard(props: {
  name: string;
  scheduleTime: Date;
  onjoinClassClicked: () => void;
}) {
  const isMd = useMediaQuery(`(max-width: 768px)`);
  return (
    <Stack>
      <Divider
        my="sm"
        label={`${format(props.scheduleTime, "hh:mm")} ${format(
          props.scheduleTime,
          "a"
        )}`}
        labelPosition="left"
        styles={{
          label: {
            fontSize: isMd ? 16 : 18,
            color: "#949494",
          },
        }}
      />
      <Card radius={8} bg={"#F7F7FF"} h={"100%"} p={20}>
        <Flex justify="space-between" align="center" ml={5} mr={5}>
          <Text
            fz={isMd ? 18 : 22}
            fw={500}
            style={{
              wordBreak: "break-word",
            }}
          >
            {props.name}
          </Text>
        </Flex>
        <Flex justify="right">
          <Button
            size={isMd ? "md" : "lg"}
            bg="#4B65F6"
            sx={{
              "&:hover": {
                backgroundColor: "#3C51C5",
              },
            }}
            onClick={() => {
              if (!isJoinClassDisabled(props.scheduleTime))
                props.onjoinClassClicked();
              else {
                showNotification({
                  message: "You can join 10 minutes before the class",
                  color: "red",
                });
              }
            }}
            style={{
              opacity: isJoinClassDisabled(props.scheduleTime) ? 0.5 : 1,
              background: isJoinClassDisabled(props.scheduleTime)
                ? "#D3D3D3"
                : "#4B65F6",
              borderRadius: "30px",
              color: isJoinClassDisabled(props.scheduleTime) ? "#000" : "#fff",
            }}
          >
            Join Class
          </Button>
        </Flex>
      </Card>
    </Stack>
  );
}
function ScheduledClasses(props: { activeClasses: VideoCallMeeting[] }) {
  const datesarray = add30Days();
  const [selectedDate, setselectedDate] = useState<Date>(
    datesarray.find((date) => isToday(date)) || new Date()
  );

  function handleJoinClassClicked(meeting: VideoCallMeeting) {
    window.open(appendParentToBaseUrl(meeting), "_blank");
  }
  const theme = useMantineTheme();
  const isMd = useMediaQuery(`(max-width: ${theme.breakpoints.md}px)`);
  return (
    <Stack w="100%">
      <Stack
        style={{
          boxShadow: isMd ? "none" : "0px 0px 12px 0px #00000040",
          borderRadius: "10px",
        }}
        bg="white"
        px={isMd ? 0 : 20}
        py={isMd ? 0 : 20}
        spacing={6}
      >
        <Text fz={isMd ? 20 : 22} fw={700}>
          Meeting Schedule
        </Text>
        <Stack spacing={0}>
          <Text align="center" color="#4B65F6" fz={isMd ? 16 : 18} fw={700}>
            {format(selectedDate, "do MMMM yyyy")}{" "}
            {selectedDate.toDateString().split(" ")[0]}
          </Text>
          <Text align="center" color="#4A4A4A">
            {
              props.activeClasses.filter(
                (x) =>
                  new Date(x.scheduleTime).getDate() === selectedDate.getDate()
              ).length
            }{" "}
            classes today
          </Text>
        </Stack>
        <CalenderTimeline
          onClick={(date) => {
            setselectedDate(date);
          }}
          selectedDate={selectedDate}
          datesarray={datesarray}
        />
      </Stack>
      <Stack
        style={{
          boxShadow: isMd ? "none" : "0px 0px 12px 0px #00000040",
          borderRadius: "10px",
          minHeight: isMd ? undefined : "30vh",
          maxHeight: isMd ? undefined : "40vh",
          height: isMd ? undefined : "40vh",
        }}
        bg="white"
        px={isMd ? 10 : 20}
        py={isMd ? 10 : 20}
        pb={isMd ? 30 : 0}
      >
        <ScrollArea h={isMd ? undefined : "100%"}>
          {props.activeClasses
            .filter(
              (x) =>
                new Date(x.scheduleTime).getDate() === selectedDate.getDate()
            )
            .map((x) => (
              <ScheduleVideoCallCard
                name={x.title}
                scheduleTime={new Date(x.scheduleTime)}
                onjoinClassClicked={() => {
                  handleJoinClassClicked(x);
                }}
              />
            ))}
          {props.activeClasses.filter(
            (x) => new Date(x.scheduleTime).getDate() === selectedDate.getDate()
          ).length === 0 && (
            <Center h={isMd ? "100%" : "25vh"}>
              <Text fz={20} fw={500} ta="center" color="#949494">
                No Meetings Scheduled
              </Text>
            </Center>
          )}
        </ScrollArea>
      </Stack>
    </Stack>
  );
}

export function VideoCallingEmptyPage(props: {
  hasVideoCallAccess: boolean;
  instituteId: string;
  batchId: string;
}) {
  const theme = useMantineTheme();
  const isMd = useMediaQuery(`(max-width: ${theme.breakpoints.md}px)`);
  const [isLoading, setisLoading] = useState<boolean>(false);
  const [upgradeModal, setUpgradeModal] = useState<boolean>(false);
  const [scheduleModalOpened, setScheduleModalOpened] =
    useState<boolean>(false);
  const [isMdVideoButtonClicked, setisMdVideoButtonClicked] =
    useState<boolean>(false);
  const [meetingDetails, setMeetingDetails] = useState<{
    title: string;
    date: Date;
  }>({
    title: "",
    date: new Date(),
  });
  const [activeVideocalls, setActiveVideoCalls] = useState<VideoCallMeeting[]>(
    []
  );

  function fetchActiveVideoCalls() {
    setisLoading(true);

    GetAllClassMeetings({ id: props.batchId })
      .then((x: any) => {
        setisLoading(false);
        setActiveVideoCalls(x);
      })
      .catch((e) => {
        setisLoading(false);
        console.log(e);
      });
  }

  useEffect(() => {
    fetchActiveVideoCalls();
  }, [props.batchId]);

  function handleSubmit() {
    setScheduleModalOpened(false);
    setisLoading(true);
    AddVideoCallMeetingToBatch({
      title: meetingDetails.title,
      scheduleTime: meetingDetails.date,
      id: props.batchId,
    })
      .then((x) => {
        setisLoading(false);
        showNotification({ message: "success" });
        fetchActiveVideoCalls();
        setMeetingDetails({
          title: "",
          date: new Date(),
        });
      })
      .catch((e) => {
        setisLoading(false);
        showNotification({ message: "Error Occured.Contact Customer Care" });
        console.log(e);
        setMeetingDetails({
          title: "",
          date: new Date(),
        });
      });
  }
  function handlejoinClassClicked(meeting: VideoCallMeeting) {
    window.open(appendParentToBaseUrl(meeting), "_blank");
  }

  function handleGoLive() {
    setisLoading(true);
    AddVideoCallMeetingToBatch({
      title: "Live Class@ " + formatDate(new Date(), "do MMMM yyyy"),
      scheduleTime: new Date(),
      id: props.batchId,
    })
      .then((x: any) => {
        setisLoading(false);
        handlejoinClassClicked(x);
        fetchActiveVideoCalls();
      })
      .catch((e) => {
        setisLoading(false);
        showNotification({ message: "Error Occured.Contact Customer Care" });
        console.log(e);
      });
  }
  return (
    <>
      <LoadingOverlay visible={isLoading} />

      <Flex
        w="100%"
        h={isMd ? "calc(100% - 50px)" : "100%"}
        align="center"
        px={isMd ? 10 : 50}
        justify={
          activeVideocalls.length > 0 && isMd
            ? "start"
            : activeVideocalls.length > 0
            ? "space-between"
            : "center"
        }
        direction={isMd ? "column" : "row"}
        gap={isMd ? 25 : 0}
      >
        {(!isMd || activeVideocalls.length <= 0) && (
          <Stack
            w={isMd ? "100%" : "40%"}
            justify="center"
            align={isMd ? "center" : "left"}
            style={{
              order: isMd ? 2 : 1,
            }}
          >
            <Text fz={isMd ? 24 : 28} fw={700} ta={isMd ? "center" : "left"}>
              Hands on video meeting with screen recording
            </Text>
            <Text fz={isMd ? 16 : 18} fw={400} ta={isMd ? "center" : "left"}>
              Create and share your own customized meet links and record the
              lectures/meeting
            </Text>
            <Flex>
              {props.hasVideoCallAccess && (
                <Flex>
                  <Button
                    size={isMd ? "md" : "lg"}
                    bg="#4B65F6"
                    style={{
                      borderRadius: "12px",
                    }}
                    fz={isMd ? 18 : 22}
                    onClick={() => {
                      handleGoLive();
                    }}
                    sx={{
                      "&:hover": {
                        backgroundColor: "#3C51C5",
                      },
                    }}
                  >
                    Go live
                  </Button>
                  <Button
                    size={isMd ? "md" : "lg"}
                    // bg="#4B65F6"
                    style={{
                      borderRadius: "12px",
                      border: "2px solid #4B65F6",
                      color: "#4B65F6",
                    }}
                    fz={isMd ? 18 : 22}
                    onClick={() => {
                      setScheduleModalOpened(true);
                    }}
                    variant="outline"
                    ml={10}
                  >
                    Schedule Live Class
                  </Button>
                </Flex>
              )}
              {!props.hasVideoCallAccess && (
                <>
                  <Button
                    size={isMd ? "md" : "xl"}
                    bg="#4B65F6"
                    style={{
                      borderRadius: "12px",
                    }}
                    fz={isMd ? 18 : 24}
                    sx={{
                      "&:hover": {
                        backgroundColor: "#3C51C5",
                      },
                    }}
                    onClick={() => {
                      setisLoading(true);
                      GetVideoCallOrderData(props.instituteId)
                        .then((data: any) => {
                          setisLoading(false);
                          displayRazorpay(data.order, () => {
                            setisLoading(true);
                            GetVideoAccess({ id: props.instituteId })
                              .then(() => {
                                showNotification({ message: "success" });
                                window.location.reload();
                                setisLoading(false);
                              })
                              .catch((e) => {
                                showNotification({
                                  message:
                                    "Error Occured.Contact Customer Care",
                                  color: "red",
                                });
                                setisLoading(false);
                                console.log(e);
                              });
                          });
                        })
                        .catch((e) => {
                          console.log(e);
                          setisLoading(false);
                        });
                    }}
                  >
                    Upgrade
                  </Button>
                </>
              )}
            </Flex>
          </Stack>
        )}
        {activeVideocalls.length > 0 && (
          <Stack
            style={{
              width: isMd ? "100%" : "40%",
              order: 2,
              maxWidth: "500px",
            }}
            ml={isMd ? 0 : 10}
            pb={isMd ? 80 : 0}
          >
            <ScheduledClasses activeClasses={activeVideocalls} />
          </Stack>
        )}
        {activeVideocalls.length === 0 && (
          <img
            src={require("../../assets/videoCallempty.png")}
            width={isMd ? "100%" : "60%"}
            style={{
              order: isMd ? 1 : 2,
            }}
          />
        )}
      </Flex>
      {isMd && activeVideocalls.length > 0 && (
        <Button
          style={{
            position: "fixed",
            bottom: 70,
            right: 20,
            zIndex: 99,
            borderRadius: "10px",
          }}
          size="lg"
          bg="#4B65F6"
          leftIcon={<IconAddVideoCall />}
          onClick={() => {
            setisMdVideoButtonClicked(true);
          }}
        >
          New
        </Button>
      )}
      <Modal
        opened={upgradeModal}
        onClose={() => {
          setUpgradeModal(false);
        }}
        padding={0}
        styles={{
          modal: {
            padding: 0,
            borderRadius: "14px",
          },
        }}
        size="auto"
        centered
        p={0}
        m={0}
      >
        <Flex
          w={isMd ? "90vw" : "60vw"}
          // h="80vh"
          // h="60vh"
          style={{
            aspectRatio: isMd ? 0.65 : 1.92,
            position: "relative",
            borderRadius: 32,
            // border: "red solid 1px",
          }}
        >
          <img
            src={require("../../assets/premiumBackground.png")}
            style={{
              width: "100%",
              height: "100%",
            }}
          />
          <Stack
            w="100%"
            h="100%"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
            }}
            spacing={0}
          >
            <Flex
              w="100%"
              justify="space-between"
              align="center"
              px={isMd ? 20 : 30}
              py={10}
            >
              <Text fz={isMd ? 24 : 28} color="white" fw={600}>
                Grow with Vignam
              </Text>
              <Box
                style={{
                  cursor: "pointer",
                }}
                onClick={() => {
                  setUpgradeModal(false);
                }}
              >
                <IconCross2 col="white" />
              </Box>
            </Flex>
            <Flex w="100%" h="100%" direction={isMd ? "column" : "row"}>
              <>
                <Stack
                  h="100%"
                  w={isMd ? "100%" : "40%"}
                  justify="center"
                  pl={isMd ? 0 : 60}
                  spacing={isMd ? 16 : 40}
                  style={{
                    order: isMd ? 2 : 1,
                  }}
                >
                  <Text
                    fz={isMd ? 24 : 32}
                    fw={800}
                    color="white"
                    ta={isMd ? "center" : "left"}
                    w="100%"
                  >
                    Contact our sales team to get Upgraded.
                  </Text>
                  <Text
                    fz={isMd ? 16 : 20}
                    fw={400}
                    color="white"
                    ta={isMd ? "center" : "left"}
                  ></Text>
                  <Flex justify={isMd ? "center" : "left"}>
                    <Button
                      bg="white"
                      style={{
                        borderRadius: "30px",
                        background: "white",
                      }}
                      size={isMd ? "md" : "xl"}
                      px={isMd ? 50 : 90}
                      onClick={() => {
                        setUpgradeModal(false);
                      }}
                    >
                      <Text className="gradient-text" fz={18} fw={700}>
                        Okay
                      </Text>
                    </Button>
                  </Flex>
                </Stack>
                {isMd && (
                  <Stack
                    w="100%"
                    h="70%"
                    justify="center"
                    align="center"
                    style={{
                      order: isMd ? 1 : 2,
                    }}
                    mt={30}
                    // pl={50}
                  >
                    <img
                      src={require("../../assets/premiuimBannerPic2.png")}
                      width="90%"

                      // width="80%"
                    />
                  </Stack>
                )}
                {!isMd && (
                  <Stack
                    w="60%"
                    justify="center"
                    align="center"
                    style={{
                      order: isMd ? 1 : 2,
                    }}
                    // pl={50}
                  >
                    <img
                      src={require("../../assets/premiuimBannerPic2.png")}
                      width="80%"
                    />
                  </Stack>
                )}
              </>
            </Flex>
          </Stack>
        </Flex>
      </Modal>
      <Modal
        opened={scheduleModalOpened}
        onClose={() => {
          setScheduleModalOpened(false);
        }}
        withCloseButton={false}
        styles={{
          modal: {
            padding: 0,
            borderRadius: "14px",
          },
          title: {
            fontSize: 24,
          },
        }}
        centered
        title="Schedule Class"
      >
        <Stack>
          <TextInput
            label="Meeting Title"
            value={meetingDetails.title}
            onChange={(e) => {
              setMeetingDetails({
                ...meetingDetails,
                title: e.currentTarget.value,
              });
            }}
            styles={{
              label: {
                fontSize: 18,
                fontWeight: 500,
                color: "#525252",
              },
            }}
          />
          <DatePicker
            placeholder="Pick date"
            label="Test Date"
            onChange={(val) => {
              if (val)
                setMeetingDetails((prev) => {
                  if (prev.date) {
                    prev.date.setFullYear(val.getFullYear());
                    prev.date.setMonth(val.getMonth());
                    prev.date.setDate(val.getDate());
                    return prev;
                  } else {
                    return {
                      ...prev,
                      date: val,
                    };
                  }
                });
            }}
            styles={{
              label: {
                fontSize: 18,
                fontWeight: 500,
                color: "#525252",
              },
            }}
            value={meetingDetails.date}
            rightSection={<IconCalendar />}
            pr={8}
            minDate={new Date()}
          />
          <TimeInput
            value={meetingDetails.date}
            onChange={(value) => {
              setMeetingDetails((prev) => {
                if (prev) {
                  prev.date.setHours(value.getHours());
                  prev.date.setMinutes(value.getMinutes());
                  return prev;
                } else {
                  return {
                    title: "",
                    date: value,
                  };
                }
              });
            }}
            format="12"
            styles={{
              label: {
                fontSize: 18,
                fontWeight: 500,
                color: "#525252",
              },
            }}
            rightSection={<IconClock />}
            label="Starts At"
            py={10}
            pr={8}
            mt={-20}
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
                setScheduleModalOpened(false);
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
            >
              Schedule
            </Button>
          </Flex>
        </Stack>
      </Modal>
      <Modal
        opened={isMdVideoButtonClicked}
        onClose={() => {
          setisMdVideoButtonClicked(false);
        }}
        styles={{
          modal: {
            bottom: 30,
            position: "absolute",
            width: "85%",
          },
        }}
        closeOnClickOutside={true}
        withCloseButton={false}
      >
        <Flex justify="center" align="center" gap={40}>
          <Stack align="center" spacing={12}>
            <Box
              h={48}
              w={48}
              style={{
                boxShadow: "0px 0px 14px 0px #00000040",
                borderRadius: "50%",
              }}
              onClick={() => {
                handleGoLive();
                setisMdVideoButtonClicked(false);
              }}
            >
              <Center w="100%" h="100%">
                <IconVideoSchedule />
              </Center>
            </Box>
            <Text fz={14}>Go Live Now!</Text>
          </Stack>
          <Stack align="center" spacing={12}>
            <Box
              h={48}
              w={48}
              style={{
                boxShadow: "0px 0px 14px 0px #00000040",
                borderRadius: "50%",
              }}
              onClick={() => {
                setScheduleModalOpened(true);
                setisMdVideoButtonClicked(false);
              }}
            >
              <Center w="100%" h="100%">
                <IconScheduleMeet />
              </Center>
            </Box>
            <Text fz={14}>Schedule Live Class</Text>
          </Stack>
        </Flex>
      </Modal>
    </>
  );
}
