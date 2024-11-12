import ApiHelper from "../../utilities/ApiHelper";

export function AddNotice(data: {
  heading: string;
  description: string;
  instituteId: string;
  attachedFiles:AttachFileModel[]
}) {
  return new Promise((resolve, reject) => {
    ApiHelper.post(`/api/v1/notice/`, {
      heading: data.heading,
      description: data.description,
      instituteId: data.instituteId,
      attachedFiles:data.attachedFiles
    })
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}
export function UpdateNotice(data: {
  id: string;
  heading: string;
  description: string;
  attachedFiles:AttachFileModel[];
}) {
  return new Promise((resolve, reject) => {
    ApiHelper.put(`/api/v1/notice/${data.id}`, {
      heading: data.heading,
      description: data.description,
      attachedFiles:data.attachedFiles
    })
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}
export function GetNotice(data: { id: string }) {
  return new Promise((resolve, reject) => {
    ApiHelper.get(`/api/v1/notice/${data.id}`)
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}
export function DeleteNotice(data: { id: string }) {
  return new Promise((resolve, reject) => {
    ApiHelper.delete(`/api/v1/notice/${data.id}`)
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}
