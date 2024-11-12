import { Carousel } from "@mantine/carousel";
import {
  Box,
  Button,
  Center,
  Divider,
  Flex,
  Grid,
  Modal,
  SimpleGrid,
  Stack,
  Text,
  useMantineTheme,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import {
  IconChevronLeft,
  IconMicrophone,
  IconMicrophoneOff,
  IconShare,
} from "@tabler/icons";
import { useEffect, useState } from "react";
import { fetchStudentInfoById } from "../../../features/StudentSlice";
import { getUserById } from "../../../features/user/userSlice";
import ProfilePicture2 from "../../ProfilePic/ProfillePic2";
import { VideoCallUserType } from "./VideoCallControls";
import { toProperCase } from "../../../utilities/HelperFunctions";
import { MainUserModal } from "./MainUserModal";

function SingleContributer(props: { index: number; user: any }) {
  const [userName, setUsername] = useState<string>("");
  const [profilePic, setProfilePic] = useState<string>("");
  useEffect(() => {
    if (props.user && props.user.uid.includes("ISTU")) {
      fetchStudentInfoById({ id: props.user.uid })
        .then((x: any) => {
          setUsername(x.name);
          setProfilePic(x.profilePic);
        })
        .catch((e) => {
          console.log(e);
        });
    }
  }, [props.user]);
  return (
    <Flex align="center" px={20} py={20}>
      <Text mr={10}>{props.index}.</Text>
      <ProfilePicture2
        name={userName}
        size={50}
        profilePic={profilePic}
        isInitialFullName={true}
      />
      <Stack spacing={0} ml={20}>
        <Text>{toProperCase(userName.toLowerCase())}</Text>
        <Text fw={400} fz={12}>
          Student
        </Text>
      </Stack>
    </Flex>
  );
}
function VideoSingleCard1(props: {
  user: AgoraRtcUserInfo;
  isMuted:boolean;
  onClick: (val: any) => void;
}) {
  const [userName, setUsername] = useState<string>("");
  const [profilePic, setProfilePic] = useState<string>("");
  useEffect(() => {
    if (props.user && props.user.localVideoTrack)
      props.user.localVideoTrack.play(`user-${props.user.uid}`);
    else if (props.user && props.user.videoTrack)
      props.user.videoTrack.play(`user-${props.user.uid}`);
    
    if (props.user && props.user.uid.includes("ISTU")) {
      fetchStudentInfoById({ id: props.user.uid })
        .then((x: any) => {
          setUsername(x.name);
          setProfilePic(x.profilePic);
        })
        .catch((e) => {
          console.log(e);
        });
    } else if (
      !props.user.uid.includes("ISTU") &&
      props.user.uid.toString() !== "500"
    ) {
      getUserById(props.user.uid)
        .then((x: any) => {
          setUsername(x.name);
          setProfilePic("");
        })
        .catch((e) => {
          console.log(e);
        });
    }
  }, [props.user]);

  const theme = useMantineTheme();
  const isMd = useMediaQuery(`(max-width: ${theme.breakpoints.md}px)`);
  return (
    <Box
      style={{
        position: "relative",
        maxHeight: isMd ? "30vh" : "25vh",
        background: "#F7F7FF",
        zIndex: -999,
      }}
      w="100%"
    >
      <Box
        style={{
          aspectRatio: 1.3,
          maxHeight: isMd ? "30vh" : "25vh",
        }}
        w="100%"
        id={`user-${props.user.uid}`}
      ></Box>
      <Stack
        w="100%"
        h="100%"
        style={{
          position: "absolute",
          top: 0,
        }}
        justify="end"
        align="end"
      >
        <Box m={8}>
          { (props.isMuted!=true) ?
           <IconMicrophone />
           :
           <IconMicrophoneOff/>
           }
          </Box>
        <Center
          w="100%"
          h="100%"
          style={{
            zIndex: -99,
          }}
        >
          <ProfilePicture2
            name={userName}
            size={50}
            isInitialFullName={true}
            profilePic={profilePic}
          />
        </Center>
        <Text
          px={10}
          style={{
            backgroundColor: "#181818",
            color: "white",
            zIndex: 99999,
          }}
          fz={12}
        >
          {toProperCase(userName.toLowerCase())}
        </Text>
      </Stack>
    </Box>
  );
}

export function VideoCallGroups(props: {
  users: AgoraRtcUserInfo[];
  changedUser: any;
  setchangeduser: () => void;
  showContributers: boolean;
  onBackClick?: () => void;
  onShareLink?: () => void;
  isFullScreen?: boolean;
  setisFullScreen?: (val: boolean) => void;
  usertype: VideoCallUserType;
}) {
  const [mainUser, setMainUser] = useState<AgoraRtcUserInfo | null>(null);
  const [aspectRatio, setaspectRatio] = useState<number>(4 / 3);
  const [isHover, setIshover] = useState<boolean>(false);
  const [userName, setUsername] = useState<string>("");
  const theme = useMantineTheme();
  const isMd = useMediaQuery(`(max-width: ${theme.breakpoints.md}px)`);

  useEffect(() => {
    if (props.changedUser) {
      const user1 = props.users.find((x) => x.uid.toString() === "500");
      const user2 = props.users.find(
        (x) => !x.uid.includes("ISTU") && x.uid.toString() !== "500"
      );
      if (user1) {
        setMainUser(user1);
        setaspectRatio(16 / 9);
        if(!props.isFullScreen){
        user1.videoTrack?.play("main-1");
        }
      } else if (user2) {
        setMainUser(user2);
        setaspectRatio(4 / 3);
        if(!props.isFullScreen){
        if (user2 && user2.localVideoTrack)
          user2.localVideoTrack.play("main-1");
        else if (user2 && user2.videoTrack) user2.videoTrack.play("main-1");
}
      }
      props.setchangeduser();
    }
  }, [props.changedUser]);

  useEffect(() => {
    if (
      mainUser &&
      !mainUser.uid.includes("ISTU") &&
      mainUser.uid.toString() !== "500"
    ) {
      getUserById(mainUser.uid)
        .then((x: any) => {
          setUsername(x.name);
        })
        .catch((e) => {
          console.log(e);
        });
    }
  }, [mainUser]);


  return (
    <>
      <Flex p={0} m={0}>
        {(!isMd || (!props.showContributers && isMd)) && (
          <Stack
            h="100%"
            px={20}
            w={isMd ? "100%" : "calc(100% - 400px)"}
            pt={20}
          >
            <Stack h="100%" justify="center">
              {mainUser && (
                <>
                  {props.users.slice(0, props.users.length).filter((x) => {
                    if (x.uid === mainUser.uid) {
                      return false;
                    }
                    return true;
                  }).length > 0 && (
                    //for indv user small cards
                    <Carousel
                      slideSize={isMd ? "100%" : "25%"}
                      slideGap={10}
                      align={
                        props.users.slice(0, props.users.length).filter((x) => {
                          if (x.uid === mainUser.uid) {
                            return false;
                          }
                          return true;
                        }).length < 3
                          ? "center"
                          : "start"
                      }
                      loop
                    >
                      {props.users
                        .slice(0, props.users.length)
                        .filter((x) => {
                          if (x.uid === mainUser.uid) {
                            return false;
                          }
                          return true;
                        })
                        .map((x) => {
                          return (
                            <Carousel.Slide>
                              <VideoSingleCard1
                                user={x}
                                isMuted ={x._audio_muted_}
                                onClick={(user1) => {}}
                              />
                            </Carousel.Slide>
                          );
                        })}
                    </Carousel>
                  )}
                </>
              )}
              <Stack
                style={{
                  position: "relative",
                  alignItems: "center",
                }}
                h={isMd ? "50vh" : props.users.length === 1 ? "90vh" : "70vh"}
                w="100%"
                align="center"
                justify="center"
              >
                <Box
                  id="main-1"
                  style={{
                    aspectRatio: aspectRatio,
                    width: `min(calc(${
                      isMd ? "50vh" : "70vh"
                    } * ${aspectRatio}), 100%)`,
                    height: "auto",
                    position: "relative",
                  }}
                  onMouseEnter={() => {
                    setIshover(true);
                  }}
                  onMouseLeave={() => {
                    setIshover(false);
                  }}
                >
                  <Text
                    px={10}
                    py={2}
                    style={{
                      backgroundColor: "#181818",
                      color: "white",
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      zIndex: 9999,
                      width: "100%",
                    }}
                    fz={16}
                  >
                    {toProperCase(userName.toLowerCase())}
                  </Text>
                </Box>
                <Stack
                  w="100%"
                  h="100%"
                  style={{
                    position: "absolute",
                    aspectRatio: aspectRatio,
                    width: `min(calc(${
                      isMd ? "50vh" : "70vh"
                    } * ${aspectRatio}), 100%)`,
                    height: "auto",
                  }}
                  justify="end"
                >
                  <Center
                    w="100%"
                    h="100%"
                    style={{
                      zIndex: -99,
                      backgroundColor: "white",
                    }}
                  >
                    <ProfilePicture2
                      name={userName}
                      size={80}
                      profilePic=""
                      isInitialFullName={true}
                    />
                  </Center>
                </Stack>
              </Stack>
            </Stack>
          </Stack>
        )}

        {(!isMd || (props.showContributers && isMd)) && (
          <Stack
            w={isMd ? "100%" : "400px"}
            h="100vh"
            style={{
              border: "1.5px solid #D8D8D8",
            }}
            p={20}
          >
            <Flex justify="space-between">
              <Flex>
                {isMd && (
                  <IconChevronLeft
                    size={30}
                    onClick={() => {
                      if (props.onBackClick) props.onBackClick();
                    }}
                  />
                )}
                <Text fz={24} fw={400} ml={15}>
                  People
                </Text>
              </Flex>
              {props.usertype === VideoCallUserType.TEACHER && (
                <Button
                  leftIcon={<IconShare color="black" />}
                  bg="white"
                  color="black"
                  style={{
                    boxShadow: "0px 0px 30px 0px #0000001A",
                    color: "black",
                  }}
                  sx={{
                    "&:hover": {
                      backgroundColor: "white",
                    },
                  }}
                  onClick={() => {
                    if (props.onShareLink) props.onShareLink();
                  }}
                >
                  Share Link
                </Button>
              )}
            </Flex>
            <Stack
              style={{
                border: "1px solid #D3D3D3",
                borderRadius: "10px",
              }}
              bg="#F5F5F5"
              spacing={0}
            >
              <Text px={20} py={20} fz={18} fw={500}>
                Contributers
              </Text>
              <Divider size="md" color="#D3D3D3" />
              <Flex align="center" px={20} py={20}>
                <Text mr={10}>1.</Text>
                <ProfilePicture2
                  name={userName}
                  size={50}
                  profilePic=""
                  isInitialFullName={true}
                />
                <Stack spacing={0} ml={20}>
                  <Text>{toProperCase(userName.toLowerCase())}</Text>
                  <Text fw={400} fz={12}>
                    Teacher
                  </Text>
                </Stack>
              </Flex>
            </Stack>
            <Stack
              style={{
                border: "1px solid #D3D3D3",
                borderRadius: "10px",
              }}
              bg="#F5F5F5"
            >
              {props.users
                .filter((x) => {
                  return x.uid.includes("ISTU") && x.uid.toString() !== "500";
                })
                .map((user, i) => {
                  return <SingleContributer index={i + 1} user={user} />;
                })}
            </Stack>
          </Stack>
        )}
      </Flex>
      <Modal
        opened={props.isFullScreen!!}
        onClose={() => {
          if (props.setisFullScreen) {
            props.setisFullScreen(false);
          }
        }}
        fullScreen
        zIndex={99999}
        withCloseButton={false}
        m={0}
        padding={0}
        p={0}
      >
        <MainUserModal
          aspectRatio={aspectRatio}
          userName={userName}
          user={mainUser}
          onCloseClick={() => {
            const user1 = props.users.find((x) => x.uid.toString() === "500");
            const user2 = props.users.find(
              (x) => !x.uid.includes("ISTU") && x.uid.toString() !== "500"
            );
            if (user1) {
              setMainUser(user1);
              setaspectRatio(16 / 9);
              user1.videoTrack?.play("main-1");
            } else if (user2) {
              setMainUser(user2);
              setaspectRatio(4 / 3);
              if (user2 && user2.localVideoTrack)
                user2.localVideoTrack.play("main-1");
              else if (user2 && user2.videoTrack)
                user2.videoTrack.play("main-1");
            }
            if (props.setisFullScreen) props.setisFullScreen(false);
          }}
        />
      </Modal>
    </>
  );
}
