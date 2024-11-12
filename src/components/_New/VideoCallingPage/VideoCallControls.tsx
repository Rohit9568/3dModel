import {
  Box,
  Center,
  Flex,
  Group,
  Modal,
  Stack,
  Text,
  Tooltip,
  useMantineTheme,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import {
  IconArrowsMaximize,
  IconChevronDown,
  IconChevronUp,
  IconDotsVertical,
  IconLayoutBoard,
  IconMicrophone,
  IconMicrophoneOff,
  IconScreenShare,
  IconScreenShareOff,
  IconShare,
  IconVideo,
  IconVideoOff,
} from "@tabler/icons";
import { useState } from "react";
import { VideoCallButtons } from "../../../pages/_New/VideoCallingPage";
import {
  IconCallEnd,
  IconPeople,
  IconRecord,
  IconRecordStop,
  IconWhiteBoard,
} from "../../_Icons/CustonIcons";
import { formatTimewithSecondsFormatting } from "../../../utilities/HelperFunctions";

export enum VideoCallUserType {
  STUDENT,
  TEACHER,
}
interface VideoCallControlsInterface {
  toggleMic: () => void;
  isMicOn: boolean;
  isVideo: boolean;
  toggleCamera: () => void;
  leaveAndRemoveLocalStream: () => void;
  userType: VideoCallUserType;
  whiteBoardClick?: () => void;
  handleStartRecording?: () => void;
  handleStopRecording?: () => void;
  isRecording?: boolean;
  recordedTime?: number;
  isScreenShare?: boolean;
  setscreenshareloading?: (val: boolean) => void;
  screenShareLoading?: boolean;
  setTriggerScreenShare?: (val: boolean) => void;
  setisShareLink?: (val: boolean) => void;
  isShareLink?: boolean;
  onShowPeopleClick?: () => void;
  onFullScreenClick?: (val: boolean) => void;
  isFullScreen?: boolean;
  isWhiteBoardOn?:boolean;
}
export function VideoCallControls(props: VideoCallControlsInterface) {
  const theme = useMantineTheme();
  const isMd = useMediaQuery(`(max-width: ${theme.breakpoints.md}px)`);
  const [showControls, setShowControls] = useState<boolean>(true);
  return (
    <>
      <Group
        style={{
          position: isMd ? "fixed" : "absolute",
          bottom: 10,
          left: 0,
          letterSpacing: 0,
          transition: "ease-in-out height 500ms",
          zIndex: 999999,
          minHeight: "30px",
        }}
        position={isMd ? "center" : "center"}
        spacing={20}
        w={!isMd ? "calc(100% - 400px)" : "100%"}
        px={10}
      >
        <Flex
          style={{
            position: "absolute",
            top: -30,
            left: 10,
            zIndex: 9999,
            cursor: "pointer",
          }}
          onClick={() => {
            setShowControls(!showControls);
          }}
          align="center"
        >
          <Tooltip label={showControls ? "Hide Controls" : "Show Controls"}>
            <Center
              w={32}
              h={32}
              style={{
                backgroundColor: "#FFF",
                borderRadius: "50%",
                boxShadow: "0 0 10px rgba(0, 0, 0, 0.3)",
                cursor: "pointer",
              }}
            >
              {showControls ? <IconChevronDown /> : <IconChevronUp />}
            </Center>
          </Tooltip>
        </Flex>
        {showControls && (
          <Flex
            columnGap={24}
            style={{
              border: "1.5px solid #D8D8D8",
              borderRadius: "20px",
              backgroundColor: "#FCFCFC",
            }}
            w="100%"
            justify="center"
            py={12}
          >
            {props.userType === VideoCallUserType.TEACHER && !isMd && (
              <Stack spacing={5}>
                <Tooltip label="Share Link" zIndex={99999}>
                  <Box
                    bg="#FFF"
                    style={{
                      borderRadius: "50%",
                      boxShadow: "0 0 10px rgba(0, 0, 0, 0.3)",
                      color: "black",
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      props.setisShareLink!!(true);
                    }}
                    color="black"
                    h={48}
                    w={48}
                  >
                    <Center w="100%" h="100%">
                      <IconShare color="black" />
                    </Center>
                  </Box>
                </Tooltip>
                <Text fz={14}>Share</Text>
              </Stack>
            )}
            {props.userType === VideoCallUserType.TEACHER && (
              <VideoCallButtons
                onStateIcon={<IconLayoutBoard color="black" />}
                offStateIcon={<IconLayoutBoard color="white" />}
                btnState={!props.isWhiteBoardOn??true}
                text="White Board"
                onClick={() => {
                  if(props.whiteBoardClick)
                  props.whiteBoardClick()
                }}
              />
            )}
            <VideoCallButtons
              onStateIcon={<IconMicrophone color="black" />}
              offStateIcon={<IconMicrophoneOff color="white" />}
              btnState={props.isMicOn}
              text="Mic"
              onClick={() => {
                props.toggleMic();
              }}
            />
            {props.userType === VideoCallUserType.TEACHER && !isMd && (
              <Stack align="center" spacing={5} justify="center">
                <Tooltip label={"Record"} zIndex={99999}>
                  <Stack
                    onClick={() => {
                      props.isRecording
                        ? props.handleStopRecording!!()
                        : props.handleStartRecording!!();
                    }}
                  >
                    {props.isRecording && (
                      <Box
                        h={48}
                        // w={48}
                        style={{
                          backgroundColor: "white",
                          boxShadow: "0 0 10px rgba(0, 0, 0, 0.3)",
                          borderRadius: "20px",
                          cursor: "pointer",
                        }}
                        p={5}
                        px={10}
                      >
                        <Center h="100%" w="100%">
                          <Flex align="center">
                            <IconRecordStop />
                            <Box>
                              {formatTimewithSecondsFormatting(
                                props.recordedTime!!
                              )}
                            </Box>
                          </Flex>
                        </Center>
                      </Box>
                    )}
                    {!props.isRecording && (
                      <Box
                        h={48}
                        w={48}
                        style={{
                          backgroundColor: "white",
                          boxShadow: "0 0 10px rgba(0, 0, 0, 0.3)",
                          borderRadius: "50%",
                          cursor: "pointer",
                        }}
                      >
                        <Center h="100%" w="100%">
                          <IconRecord />
                        </Center>
                      </Box>
                    )}
                  </Stack>
                </Tooltip>
                <Text fz={14}>Record</Text>
              </Stack>
            )}
            <VideoCallButtons
              onStateIcon={<IconVideo color="black" />}
              offStateIcon={<IconVideoOff color="white" />}
              btnState={props.isVideo}
              text="Video"
              onClick={() => {
                props.toggleCamera();
              }}
            />
            <Stack align="center" spacing={5} justify="center">
              <Tooltip label="End Call" zIndex={99999}>
                <Box
                  h={48}
                  w={48}
                  style={{
                    backgroundColor: "#FF3636",
                    boxShadow: "0 0 10px rgba(0, 0, 0, 0.3)",
                    borderRadius: "50%",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    props.leaveAndRemoveLocalStream();
                  }}
                >
                  <Center h="100%" w="100%">
                    <IconCallEnd />
                  </Center>
                </Box>
              </Tooltip>
              <Text fz={14}>End</Text>
            </Stack>
            {props.userType === VideoCallUserType.TEACHER && !isMd && (
              <VideoCallButtons
                onStateIcon={
                  <IconScreenShare
                    color={props.screenShareLoading ? "gray" : "black"}
                  />
                }
                offStateIcon={<IconScreenShareOff color="white" />}
                btnState={props.isScreenShare!!}
                text="Share Screen"
                onClick={() => {
                  if (!props.screenShareLoading) {
                    if (props.isScreenShare === true) {
                      props.setscreenshareloading!!(true);
                      props.setTriggerScreenShare!!(true);
                    } else {
                      props.setTriggerScreenShare!!(false);
                    }
                  }
                }}
              />
            )}
            {props.userType === VideoCallUserType.TEACHER && isMd && (
              <VideoCallButtons
                btnState={true}
                offStateIcon={<IconPeople />}
                onStateIcon={<IconPeople />}
                text="People"
                onClick={() => {
                  props.onShowPeopleClick!!();
                }}
              />
            )}
            {props.userType === VideoCallUserType.STUDENT && (
              <VideoCallButtons
                btnState={!props.isFullScreen!!}
                offStateIcon={<IconArrowsMaximize />}
                onStateIcon={<IconArrowsMaximize />}
                text="Full Screen"
                onClick={() => {
                  props.onFullScreenClick!!(!props.isFullScreen!!);
                }}
              />
            )}
          </Flex>
        )}
      </Group>
    </>
  );
}
