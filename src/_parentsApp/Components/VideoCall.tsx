import { Box, useMantineTheme } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import AgoraRTC from "agora-rtc-sdk-ng";
import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import {
  VideoCallControls,
  VideoCallUserType,
} from "../../components/_New/VideoCallingPage/VideoCallControls";
import { VideoCallGroups } from "../../components/_New/VideoCallingPage/VideoCallGroups";
import { getChannelToken } from "../../features/videoCall/videoCallSlice";
import { showNotification } from "@mantine/notifications";


let userUID: any = "";
let rtcInfoObject: AgoraRtcUserInfo = {
  uid:"",
  localAudioTrack: null,
  localVideoTrack: null,
  audioTrack:null,
  videoTrack:null,
  client: AgoraRTC.createClient({ mode: "rtc", codec: "vp8" }),
  _audio_muted_:false
};


 function VideoCall(props: {
  studentId: string;
  studentName: string;
  onClose: () => void;
}) {
  const params = useParams();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const meetingId = queryParams.get("meetingId");
  const theme = useMantineTheme();
  const isMd = useMediaQuery(`(max-width: ${theme.breakpoints.md}px)`);
  const [isVideo, setIsVideo] = useState<boolean>(true);
  const [isMicOn, setIsMicOn] = useState<boolean>(true);
  const [users, setUsers] = useState<AgoraRtcUserInfo[]>([]);
  const [changedUser, setChangedUser] = useState<string|null>(null);
  const [isFullScreen, setIsFullScreen] = useState<boolean>(false);

  
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

  let handleUserPublishedMedia = async (user: AgoraRtcUserInfo, mediaType: any) => {

    await rtcInfoObject.client.subscribe(user, mediaType);
    setUsers((prev: any) => {
      const findIndex = prev.findIndex((x: any) => x.uid === user.uid);
      if (findIndex === -1) return [...prev, user];
      return [...prev];
    });
    setChangedUser(user.uid);

    if (mediaType === "video") {
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

  let handleUserLeft = async (user: any) => {
    setChangedUser(user.uid);
    if (!user.uid.includes("ISTU") && user.uid.toString() !== "500") {
      leaveAndRemoveLocalStream();
      props.onClose();
    }
    setUsers((prev) => {
      const prev1 = [...prev];
      return prev1.filter((x) => x.uid !== user.uid);
    });
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
    props.onClose();
  };

  let joinAndDisplayLocalStream = async () => {
    rtcInfoObject.client.on("user-published", handleUserPublishedMedia);
    rtcInfoObject.client.on("user-unpublished", handleUserUnpublishedMedia);
    rtcInfoObject.client.on("user-left", handleUserLeft);
    rtcInfoObject.client.on("user-joined", handleUserEntered);


    if (meetingId)
      getChannelToken({
        userId: props.studentId,
        meetingId: meetingId,
      })
        .then(async (x: any) => {
          let UID = await rtcInfoObject.client.join(
            process.env.REACT_APP_AGORA_APP_ID??"",
            x.channelName,
            x.token,
            props.studentId
          );
          userUID = UID;
          rtcInfoObject.uid = UID

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
          }

          setChangedUser(UID);
        })
        .catch((e) => {
          console.log(e);
        });
  };

  useEffect(() => {
    joinAndDisplayLocalStream();
    return () => {
      leaveAndRemoveLocalStream();
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "visible";
    };
  }, []);

  return (
    <>
      { users.length !== 0 && (
        <Box
          h="100vh"
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
            showContributers={false}
            usertype={VideoCallUserType.STUDENT}
            isFullScreen={isFullScreen}
            setisFullScreen={setIsFullScreen}
          />
          <VideoCallControls
            isMicOn={isMicOn}
            isVideo={isVideo}
            toggleMic={toggleMic}
            toggleCamera={toggleCamera}
            leaveAndRemoveLocalStream={leaveAndRemoveLocalStream}
            userType={VideoCallUserType.STUDENT}
            onFullScreenClick={(val) => {
              setIsFullScreen(val);
            }}
            isFullScreen={isFullScreen}
          />
        </Box>
      )}
    </>
  );
}
export default VideoCall
