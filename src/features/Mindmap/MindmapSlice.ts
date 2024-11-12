import ApiHelper from "../../utilities/ApiHelper";

export function createMindmap(data: { formObj: any; userChapterId: string }) {
  return new Promise((resolve, reject) => {
    ApiHelper.post(`/api/v1/mindmap/create/${data.userChapterId}`, data.formObj)
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}
export function updateMindmap(data: { formObj: any; mindmapId: string }) {
  return new Promise((resolve, reject) => {
    ApiHelper.post(`/api/v1/mindmap/update/${data.mindmapId}`, data.formObj)
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}
export function fetchMindmap(mindmapId: string) {
  return new Promise((resolve, reject) => {
    ApiHelper.get(`/api/v1/mindmap/${mindmapId}`)
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}
