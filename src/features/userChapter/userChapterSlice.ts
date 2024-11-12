import ApiHelper from "../../utilities/ApiHelper";

export function removeUserTopic(userChapterId: string, userTopicId: string) {
  return new Promise((resolve, reject) => {
    ApiHelper.put(`/api/v1/userChapter/removeUserTopic/${userChapterId}`, {
      userTopicId: userTopicId,
    })
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}
export function addUserTopic(
  userChapterId: string,
  topicId: string | null,
  topicName: string
) {
  return new Promise((resolve, reject) => {
    ApiHelper.post(`/api/v1/userChapter/addNewUserTopic/${userChapterId}`, {
      topicId: topicId,
      topicName: topicName,
    })
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}

export function addQuestionsToChapter(data: { chapterId: string; questions: any[] }) {
  return new Promise((resolve, reject) => {
    ApiHelper.post(`/api/v1/userChapter/addQuestions/${data.chapterId}`, {
      questions: data.questions,
    })
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}

export function fetchSimulationsByUserChapterId(id: string) {
  return new Promise((resolve, reject) => {
    ApiHelper.get(`/api/v1/userChapter/simulations/${id}`)
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}

export function removeChapterWorksheet(
  id: string,
  fileName: string,
  url: string
) {
  return new Promise((resolve, reject) => {
    ApiHelper.post(`/api/v1/userChapter/removeWorksheet/${id}`, {
      fileName,
      url,
    })
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}
