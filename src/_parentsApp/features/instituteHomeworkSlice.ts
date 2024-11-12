import ApiHelper from "../../utilities/ApiHelper";

export function UpdateHomework(data: {
  description: string;
  id: string;
  uploadPhoto?: string;
}) {
  return new Promise((resolve, reject) => {
    ApiHelper.put(`/api/v1/instituteHomework/${data.id}`, {
      description: data.description,
      uploadPhoto: data.uploadPhoto,
    })
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}
export function CreateHomework(data: {
  date: number;
  description: string;
  instituteClassId: string;
  userSubjectId: string;
  uploadImage?: string;
}) {
  return new Promise((resolve, reject) => {
    ApiHelper.post(`/api/v1/instituteHomework/create`, {
      date: data.date,
      description: data.description,
      instituteClassId: data.instituteClassId,
      userSubjectId: data.userSubjectId,
      uploadPhoto: data.uploadImage,
    })
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}

export function makeAutoHomework(data: {
  chapterName: string;
  topicName: string;
}) {
  return new Promise((resolve, reject) => {
    ApiHelper.post(`/api/v1/makeHomeworkauto`, {
      chapterName: data.chapterName,
      topicName: data.topicName,
    })
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}

export function deleteHomeworkById(data: { id: string }) {
  return new Promise((resolve, reject) => {
    ApiHelper.delete(`/api/v1/instituteHomework/delete/${data.id}`)
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}
