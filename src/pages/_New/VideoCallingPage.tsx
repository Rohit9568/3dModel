import {
  Box,
  Button,
  Center,
  Flex,
  LoadingOverlay,
  Modal,
  Stack,
  Text,
  TextInput,
  Tooltip,
  useMantineTheme,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { showNotification } from "@mantine/notifications";
import {
  IconBrandFacebook,
  IconBrandWhatsapp,
  IconMail,
  IconMessage2,
} from "@tabler/icons";
import AgoraRTC, {
} from "agora-rtc-sdk-ng";
import { lazy, useEffect, useRef, useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import {
  EmailShareButton,
  FacebookShareButton,
  WhatsappShareButton,
} from "react-share";
import RecordRTC from "recordrtc";
import { AddRecordingsToBatch } from "../../_parentsApp/features/instituteClassSlice";
import { VideoCallGroups } from "../../components/_New/VideoCallingPage/VideoCallGroups";
import { LargeFileUploadFrontend } from "../../features/fileUpload/FileUpload";
import {
  blobToFile,
  convertToHyphenSeparated,
} from "../../utilities/HelperFunctions";
import { GetUser } from "../../utilities/LocalstorageUtility";
import { ScreenShare } from "./ScreenShare";
import { Icon } from "./Teach";
import {
  VideoCallControls,
  VideoCallUserType,
} from "../../components/_New/VideoCallingPage/VideoCallControls";
import React from "react";

const WhiteBoard = lazy(() => import('../../components/TeachPage/Whiteboard'));


interface VideoCallButtonsProps {
  onStateIcon: any;
  offStateIcon: any;
  btnState: boolean;
  text: string;
  onClick: () => void;
}
export function VideoCallButtons(props: VideoCallButtonsProps) {
  const theme = useMantineTheme();
  return (
    <Stack align="center" spacing={5} justify="center">
      <Tooltip label={props.text} zIndex={99999}>
        <Box
          h={48}
          w={48}
          style={{
            backgroundColor: props.btnState ? "white" : "#4B65F6",
            boxShadow: "0 0 10px rgba(0, 0, 0, 0.3)",
            borderRadius: "50%",
            cursor: "pointer",
          }}
          onClick={props.onClick}
        >
          <Center h="100%" w="100%">
            {props.btnState ? props.onStateIcon : props.offStateIcon}
          </Center>
        </Box>
      </Tooltip>
      <Text fz={14}>{props.text}</Text>
    </Stack>
  );
}


let rtcInfoObject: AgoraRtcUserInfo = {
  uid:"",
  audioTrack: null,
  videoTrack: null,
  localAudioTrack:null,
  localVideoTrack:null,
  client: AgoraRTC.createClient({ mode: "rtc", codec: "vp8" }),
  _audio_muted_:false
};

let userUID: any = "";
let combinedStream: any;
 function VideoCallingPage(props: {
  channelName: string;
  token: string;
  userId: string;
  onExit: () => void;
  meetingId: string;
  batchId: string;
  meetingName: string;
}) {
  const theme = useMantineTheme();
  const isMd = useMediaQuery(`(max-width: ${theme.breakpoints.md}px)`);
  const [isVideo, setIsVideo] = useState<boolean>(true);
  const [isMicOn, setIsMicOn] = useState<boolean>(true);
  const [isWhiteBoardOn, setIsWhiteboardOn] = useState<boolean>(true);
  const [isScreenShare, setIsScreenShare] = useState<boolean>(true);
  const [users, setUsers] = useState<AgoraRtcUserInfo[]
 >([]);
  const [changedUser, setChangedUser] = useState<any>(null);
  const [recordedTime, setRecordedTime] = useState<number>(0);

  let toggleMic = async () => {
    if (rtcInfoObject.localAudioTrack == null) {
      showNotification({
        message: "Please Give Audio Control from Browser Settings",
      });
      return;
    }

    if (rtcInfoObject.localAudioTrack.muted) {
      await rtcInfoObject.localAudioTrack.setMuted(false);
      setIsMicOn(true);
    } else {
      await rtcInfoObject.localAudioTrack.setMuted(true);
      setIsMicOn(false);
    }
  };

  let toggleCamera = async () => {
    if (rtcInfoObject.localVideoTrack == null) {
      showNotification({
        message: "Please Give Video Control from Browser Settings",
      });
      return;
    }
    if (rtcInfoObject.localVideoTrack.enabled) {
      rtcInfoObject.localVideoTrack.setEnabled(false);
      rtcInfoObject.localVideoTrack.stop();
      setIsVideo(false);
    } else {
      rtcInfoObject.localVideoTrack.setEnabled(true);
      rtcInfoObject.localVideoTrack.play(`user-${userUID}`);
      setChangedUser(userUID);
      setIsVideo(true);
    }
  };

  let handleUserPublishedMedia = async (user: AgoraRtcUserInfo, mediaType: any) => {
    setChangedUser(user.uid);
    await rtcInfoObject.client.subscribe(user, mediaType);
    setUsers((prev: any) => {
      const findIndex = prev.findIndex((x: any) => x.uid === user.uid);
      if (findIndex === -1) return [...prev, user];
      return [...prev];
    });

    if (mediaType === "video") {
      setChangedUser(user.uid);
      if (user.uid.toString() !== "500") {
        user.videoTrack.play(`user-${user.uid}`);
      }
    }
    if (mediaType === "audio") {
      user.audioTrack.play();
    }
  };

  let handleUserUnpublishedMedia = async (user: AgoraRtcUserInfo, mediaType: any) => {
    setChangedUser(user.uid);
    setUsers((prev: any) => {
      const findIndex = prev.findIndex((x: any) => x.uid === user.uid);
      if (findIndex === -1) return [...prev, user];
      return [...prev];
    });
  };

  let handleUserEntered = async (user: AgoraRtcUserInfo) => {
    if (user.uid !== "500") {
      showNotification({
        message: "Somebody entered the class",
      });
      setChangedUser(user.uid);
      setUsers((prev: any) => {
        const findIndex = prev.findIndex((x: any) => x.uid === user.uid);
        if (findIndex === -1) return [...prev, user];
        return prev;
      });
    }
  };

  let handleUserLeft = async (user: any) => {
    setUsers((prev) => {
      return prev.filter((x) => x.uid !== user.uid);
    });
    setChangedUser(user);
  };

  let leaveAndRemoveLocalStream = async () => {
    rtcInfoObject.audioTrack?.stop();
    rtcInfoObject.audioTrack?.close();
    rtcInfoObject.videoTrack?.stop();
    rtcInfoObject.videoTrack?.close();
    rtcInfoObject.localVideoTrack?.stop();
    rtcInfoObject.localVideoTrack?.close();
    rtcInfoObject.localAudioTrack?.stop();
    rtcInfoObject.localAudioTrack?.close();    
    await rtcInfoObject.client.leave();
    props.onExit();
  };

  let joinAndDisplayLocalStream = async () => {
    rtcInfoObject.client.on("user-published", handleUserPublishedMedia);
    rtcInfoObject.client.on("user-unpublished", handleUserUnpublishedMedia);
    rtcInfoObject.client.on("user-left", handleUserLeft);
    rtcInfoObject.client.on("user-joined", handleUserEntered);

    let UID = await rtcInfoObject.client.join(
      process.env.REACT_APP_AGORA_APP_ID??"",
      props.channelName,
      props.token,
      props.userId
    );

    try {
      rtcInfoObject.localAudioTrack =
        await AgoraRTC.createMicrophoneAudioTrack();
    } catch (err) {
      setIsMicOn(false);
    }

    try {
      rtcInfoObject.localVideoTrack = await AgoraRTC.createCameraVideoTrack();
    } catch (err) {
      setIsVideo(false);
    }

    userUID = UID;
    rtcInfoObject.uid =UID;

    setUsers((prev: any) => {
      return [...prev, rtcInfoObject];
    });
    if (
      rtcInfoObject.localAudioTrack != null &&
      rtcInfoObject.localVideoTrack != null
    ) {
      await rtcInfoObject.client.publish([
        rtcInfoObject.localAudioTrack,
        rtcInfoObject.localVideoTrack,
      ]);
    } else if (rtcInfoObject.localAudioTrack != null) {
      await rtcInfoObject.client.publish([rtcInfoObject.localAudioTrack]);
    } else if (rtcInfoObject.localVideoTrack != null) {
      await rtcInfoObject.client.publish([rtcInfoObject.localVideoTrack]);
    } else {
    }
    setChangedUser(UID);
  };

  function leavemeeting(e: any) {
    e.preventDefault();
    leaveAndRemoveLocalStream();
  }
  useEffect(() => {
    joinAndDisplayLocalStream();
    window.addEventListener("beforeunload", leavemeeting);

    return () => {
      leaveAndRemoveLocalStream();
      window.removeEventListener("beforeunload", leavemeeting);
    };
  }, []);
  const [isShareLink, setisShareLink] = useState<boolean>(false);
  function appendParentToBaseUrl() {
    const currentUrl = window.location.href;
    const user = GetUser();
    const urlParts = new URL(currentUrl);
    const base = urlParts.origin;

    const modifiedUrl = `${base}/${convertToHyphenSeparated(
      user.instituteName
    )}/${user.instituteId}/home/videocall?meetingId=${props.meetingId}`;
    return modifiedUrl;
  }

  const [isRecording, setIsRecording] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState<File | null>(null);
  const [isLoading, setIsloading] = useState<boolean>(false);
  const mediaRecorderRef = useRef<any>(null);
  let abortController = new AbortController();


  const handleStartRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true, // Request system audio
      });
      const audioStream = await navigator.mediaDevices.getUserMedia({
        audio: true, // Request microphone audio
      });
      const videoTrack = stream.getVideoTracks()[0];
      videoTrack.onended = () => {
        handleStopRecording();
      };
      const combinedStream = new MediaStream([
        ...stream.getVideoTracks(),
        ...audioStream.getAudioTracks(),
      ]);
      const recorder = new RecordRTC(combinedStream, {
        type: "video",
        mimeType: "video/webm",
      });
      recorder.startRecording();

      mediaRecorderRef.current = recorder;
      setIsRecording(true);
    } catch (err) {
      console.error("Error starting recording:", err);
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef && mediaRecorderRef.current) {
      mediaRecorderRef.current.stopRecording(() => {
        const blob = mediaRecorderRef.current.getBlob();
        const fileName = `${props.meetingId}_screen-recording_${Date.now()}`
        const file = blobToFile(blob, fileName);
        setRecordedBlob(file);
        setIsloading(true);
        LargeFileUploadFrontend({ file: file},(progress:number)=>{})
          .then((x) => {
            AddRecordingsToBatch({
              url: x.url.Location,
              name: props.meetingName,
              id: props.batchId,
            })
              .then((x) => {
                setIsloading(false);
                showNotification({
                  message: "Recording saved successfully",
                });
                mediaRecorderRef.current = null;
              })
              .catch((e) => {
                setIsloading(false);
                mediaRecorderRef.current = null;
                console.log(e);
              });
          })
          .catch((e) => {
            console.log(e);
          });
        setIsRecording(false);
        if (combinedStream) {
          const tracks = combinedStream.getTracks();
          tracks.forEach((track: any) => {
            track.stop();
          });
        }
      });
    }
  };


  const modifiedURL = appendParentToBaseUrl();
  const sendMessage = (url: string) => {
    const messageText = encodeURIComponent(url);
    const messageUrl = `sms:?body=${messageText}`;
    window.open(messageUrl);
  };

  const [triggerScreenShare, setTriggerScreenShare] = useState<boolean>(false);
  const [screenShareLoading, setscreenshareloading] = useState<boolean>(false);
  const [showContributers, setShowContributers] = useState<boolean>(false);
  const [showWhiteboard,setShowWhiteboard] = useState<boolean>(false);

  useEffect(() => {
    if (isRecording) {
      const interval = setInterval(() => {
        setRecordedTime((prev) => prev + 1);
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setRecordedTime(0);
    }
  }, [isRecording, recordedTime]);
  return (
    <>
      <LoadingOverlay visible={isLoading} zIndex={9999999} />
     { users && <Box
        h="100%"
        w="100%"
        style={{
          position: "relative",
        }}
      >
        <VideoCallGroups
          users={users}
          changedUser={changedUser}
          setchangeduser={() => {
            setChangedUser(null);
          }}
          showContributers={showContributers}
          onBackClick={() => {
            setShowContributers(false);
          }}
          onShareLink={() => {
            setisShareLink(true);
          }}
          usertype={VideoCallUserType.TEACHER}
        />
        <VideoCallControls
        whiteBoardClick={()=>{
          setShowWhiteboard(!showWhiteboard);
        }}
          handleStartRecording={handleStartRecording}
          handleStopRecording={handleStopRecording}
          isRecording={isRecording}
          recordedTime={recordedTime}
          isScreenShare={isScreenShare}
          setscreenshareloading={setscreenshareloading}
          screenShareLoading={screenShareLoading}
          setTriggerScreenShare={setTriggerScreenShare}
          setisShareLink={setisShareLink}
          isShareLink={isShareLink}
          isMicOn={isMicOn}
          isVideo={isVideo}
          isWhiteBoardOn={showWhiteboard}
          toggleMic={toggleMic}
          toggleCamera={toggleCamera}
          leaveAndRemoveLocalStream={leaveAndRemoveLocalStream}
          userType={VideoCallUserType.TEACHER}
          onShowPeopleClick={() => {
            setShowContributers(!showContributers);
          }}
        />
      </Box>
}
      {triggerScreenShare && (
        <ScreenShare
          onExit={() => {
            setscreenshareloading(false);
            setTriggerScreenShare(false);
          }}
          meetingId={props.meetingId}
          setIsScreenShare={setIsScreenShare}
          setisscreenshareloading={setscreenshareloading}
        />
      )}
      <Modal
        opened={isShareLink}
        onClose={() => {
          setisShareLink(false);
        }}
        title="Share the live class link with students"
        centered
        zIndex={9999999}
      >
        <Stack>
          <Flex>
            <FacebookShareButton url={modifiedURL}>
              <Icon
                name="Facebook"
                icon={<IconBrandFacebook color="white" />}
                onClick={() => {}}
                color="#1776F1"
              />
            </FacebookShareButton>

            <WhatsappShareButton url={modifiedURL}>
              <Icon
                name="Whatsapp"
                icon={<IconBrandWhatsapp color="white" />}
                onClick={() => {}}
                color="#43C553"
              />
            </WhatsappShareButton>

            <EmailShareButton url={modifiedURL}>
              <Icon
                name="Email"
                icon={<IconMail color="white" />}
                onClick={() => {}}
                color="#E0534A"
              />
            </EmailShareButton>
            <Icon
              name="Message"
              icon={<IconMessage2 color="white" />}
              onClick={() => {
                sendMessage(modifiedURL);
              }}
              color="#0859C5"
            />
          </Flex>
          <Flex justify="space-between" align="center">
            <TextInput
              style={{
                marginRight: "5px",
                height: "40px",
                width: "95%",
              }}
              value={modifiedURL}
            ></TextInput>
            <CopyToClipboard text={modifiedURL}>
              <Button
                bg="#3174F3"
                style={{
                  borderRadius: "20px",
                }}
              >
                Copy
              </Button>
            </CopyToClipboard>
          </Flex>
        </Stack>
      </Modal>
      <Modal opened={showWhiteboard} 
      size="100%"
      zIndex={9999}
      onClose={ () => {
        setShowWhiteboard(false)
      }
      }> 
      { showWhiteboard &&
       <React.Suspense fallback={<></>}>
                 <WhiteBoard/>;
             </React.Suspense>
}
      </Modal>
    </>
  );
}
export default VideoCallingPage
