import ApiHelper from "../../utilities/ApiHelper";

export function CreateClasswork(data: {
  date: number;
  description: string;
  instituteClassId: string;
  userSubjectId: string;
  uploadImage: string;
}) {
  return new Promise((resolve, reject) => {
    ApiHelper.post(`/api/v1/instituteClasswork/create`, {
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

export function UpdateClasswork(data: {
  description: string;
  id: string;
  uploadPhoto: string | undefined;
}) {
  return new Promise((resolve, reject) => {
    ApiHelper.put(`/api/v1/instituteClasswork/${data.id}`, {
      description: data.description,
      uploadPhoto: data.uploadPhoto,
    })
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}

export function makeAutoClasswork(data: {
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

export function deleteClassworkById(data: { id: string }) {
  return new Promise((resolve, reject) => {
    ApiHelper.delete(`/api/v1/instituteClasswork/delete/${data.id}`)
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}