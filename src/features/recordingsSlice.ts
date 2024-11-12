import ApiHelper from "../utilities/ApiHelper";

export function deleteRecording(data: {
_id:string
  }) {
    return new Promise((resolve, reject) => {
      ApiHelper.delete(`/api/v1/courseVideo/${data._id}`)
        .then((response) => resolve(response))
        .catch((error) => reject(error));
    });
  }