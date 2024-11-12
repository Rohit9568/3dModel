import { lazy, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  changeVideoCallActiveStatus,
  getChannelToken,
} from "../features/videoCall/videoCallSlice";
import { RootState } from "../store/ReduxStore";
import { User1 } from "../@types/User";
import { useParams } from "react-router-dom";
import React from "react";

const VideoCallingPage = lazy(() => import("./_New/VideoCallingPage"));


export function VideoCallStartPage() {
  const [videoCallCredentials, setVideoCallCredentials] = useState<{
    channelName: string;
    userId: string;
    token: string;
  } | null>(null);
  const [classId, setClassId] = useState<string>("");
  const [meetingName, setMeetingName] = useState<string>("");
  const user1 = useSelector<RootState, User1 | null>((state) => {
    return state.currentUser.user;
  });
  const { id } = useParams();
  function tokengenerator() {
    if (user1 && id)
      getChannelToken({
        userId: user1?._id,
        meetingId: id,
      })
        .then((x: any) => {
          setVideoCallCredentials(x);
          setClassId(x.classId);
          setMeetingName(x.name);
          changeVideoCallActiveStatus({
            meetingId: id,
            status: true,
          })
            .then((x) => {})
            .catch((e) => {
              console.log(e);
            });
        })
        .catch((e) => {
          console.log(e);
        });
  }

  useEffect(() => {
    tokengenerator();
  }, [user1]);
  return (
    <>
      {videoCallCredentials && id && (
         <React.Suspense fallback={<></>}>
        <VideoCallingPage
          channelName={videoCallCredentials.channelName}
          userId={videoCallCredentials.userId}
          token={videoCallCredentials.token}
          onExit={() => {
            setVideoCallCredentials(null);
            changeVideoCallActiveStatus({
              meetingId: id,
              status: false,
            })
              .then((x) => {
                window.close();
              })
              .catch((e) => {
                console.log(e);
              });
          }}
          meetingId={id}
          batchId={classId}
          meetingName={meetingName}
        />
        </React.Suspense>
      )}
    </>
  );
}
