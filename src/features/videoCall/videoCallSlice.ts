import ApiHelper from "../../utilities/ApiHelper";

export function getChannelToken(data: { userId: string; meetingId: string }) {
  return new Promise((resolve, reject) => {
    ApiHelper.get(`/api/v1/videoCall/${data.meetingId}?userId=${data.userId}`)
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}
export function createVideoCallMeeting(data: { classId: string }) {
  return new Promise((resolve, reject) => {
    ApiHelper.post(`/api/v1/videoCall/`, {
      classId: data.classId,
    })
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}
export function changeVideoCallActiveStatus(data: {
  meetingId: string;
  status: boolean;
}) {
  return new Promise((resolve, reject) => {
    ApiHelper.put(`/api/v1/videoCall/changeActiveStatus/${data.meetingId}`, {
      value: data.status,
    })
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}
