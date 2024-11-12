import ApiHelper from "../../utilities/ApiHelper";

export function createPreTest(userChapterId: string) {
  return new Promise((resolve, reject) => {
    ApiHelper.post(`/api/v1/pretest/create/${userChapterId}`, { data: {} })
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}
