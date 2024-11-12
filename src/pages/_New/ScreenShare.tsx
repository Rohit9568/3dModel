import { useEffect } from "react";
import AgoraRTC from "agora-rtc-sdk-ng";
import { getChannelToken } from "../../features/videoCall/videoCallSlice";
const APP_ID = "49dfe72a199449a0850c270eea68ef42";

var localTracks1: any = {
  screenVideoTrack: null,
  audioTrack: null,
  screenAudioTrack: null,
};
let screenShareUID: any = "";
export function ScreenShare(props: {
  onExit: () => void;
  meetingId: string;
  setIsScreenShare: (val: boolean) => void;
  setisscreenshareloading: (val: boolean) => void;
}) {
  const client1 = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });

  async function handleScreenShare() {
    const uid = 500;
    screenShareUID = uid;
    getChannelToken({ meetingId: props.meetingId, userId: uid.toString() })
      .then(async (x: any) => {
        let screenTrack;
        await Promise.all([
          AgoraRTC.createScreenVideoTrack(
            {
              encoderConfig: "1080p_1",
            },
            "auto"
          ),
        ])
          .then(async (screenTrack: any) => {
            try {
              await client1.join(APP_ID, x.channelName, x.token, x.userId);
              props.setIsScreenShare(false);
              if (screenTrack instanceof Array) {
                if(screenTrack[0] instanceof Array){
                  localTracks1.screenVideoTrack = screenTrack[0][0];
                  //TODO need to fix this
                  // localTracks1.screenAudioTrack = screenTrack[0][1];
                } else{
                  localTracks1.screenVideoTrack = screenTrack[0];
                }
              } else {
                localTracks1.screenVideoTrack = screenTrack;
              }

              localTracks1.screenVideoTrack.on("track-ended", async () => {
                alert(
                  `Screen-share track ended, stop sharing screen ` +
                    localTracks1.screenVideoTrack.getTrackId()
                );
                screenSHareLeave();
              });

              if (localTracks1.screenAudioTrack == null) {
                await client1.publish([localTracks1.screenVideoTrack]);
              } else {
                await client1.publish([
                  localTracks1.screenVideoTrack,
                  localTracks1.screenAudioTrack,
                ]);
              }
              props.setisscreenshareloading(false);
            } catch (e) {
              console.log(e);
            }
          })
          .catch((e) => {
            props.setisscreenshareloading(false);
            props.setIsScreenShare(true);
            props.onExit();
            console.log("error");
          });
      })
      .catch((e) => {
        props.setisscreenshareloading(false);
        props.onExit();
        console.log(e);
      });
  }
  async function screenSHareLeave() {
    localTracks1.screenVideoTrack && localTracks1.screenVideoTrack.close();
    localTracks1.screenAudioTrack && localTracks1.screenVideoTrack.close();
    await client1.leave();
    props.setIsScreenShare(true);
    props.onExit();
  }

  useEffect(() => {
    handleScreenShare();
    return () => {
      if (localTracks1.screenVideoTrack) {
        screenSHareLeave();
        localTracks1.screenVideoTrack.on("track-ended", async () => {
          alert(
            `Screen-share track ended, stop sharing screen ` +
              localTracks1.screenVideoTrack.getTrackId()
          );
          localTracks1.screenVideoTrack &&
            localTracks1.screenVideoTrack.close();
          localTracks1.screenAudioTrack &&
            localTracks1.screenVideoTrack.close();
          await client1.leave();
          props.onExit();
          props.setIsScreenShare(true);
        });
      }
    };
  }, []);

  return <></>;
}
