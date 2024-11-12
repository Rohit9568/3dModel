import ApiHelper from "../../utilities/ApiHelper";
import { arrayToQueryString } from "../../utilities/HelperFunctions";

export function AddNotes(data: { id: string; url: string; fileName: string }) {
  return new Promise((resolve, reject) => {
    ApiHelper.post(`/api/v1/userChapter/addChapterNotes/${data.id}`, {
      url: data.url,
      fileName: data.fileName,
    })
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}
export function AddLessonPlans(data: {
  id: string;
  url: string;
  fileName: string;
}) {
  return new Promise((resolve, reject) => {
    ApiHelper.post(`/api/v1/userChapter/addChapterLessonPlan/${data.id}`, {
      url: data.url,
      fileName: data.fileName,
    })
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}
export function AddWorksheets(data: {
  id: string;
  url: string;
  fileName: string;
}) {
  return new Promise((resolve, reject) => {
    ApiHelper.post(`/api/v1/userChapter/addChapterWorksheets/${data.id}`, {
      url: data.url,
      fileName: data.fileName,
    })
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}
export function UpdateTestStatus(data: { formObj: any }) {
  return new Promise((resolve, reject) => {
    ApiHelper.put(
      `/api/v1/userChapter/updatechapterPreTestsStatus/${data.formObj.chapter_id}`,
      data.formObj
    )
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}
export function UpdateShareStatus(data: {
  chapterId: string;
  subjectId: string;
  batches: string[];
}) {
  return new Promise((resolve, reject) => {
    ApiHelper.put(`/api/v1/userChapter/updateSharedStatus/${data.chapterId}`, {
      subjectId: data.subjectId,
      batches: data.batches,
    })
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}
export function Addbatches(data: { chapterId: string; batches: string[] }) {
  return new Promise((resolve, reject) => {
    ApiHelper.put(`/api/v1/userChapter/addbatches/${data.chapterId}`, {
      batches: data.batches,
    })
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}

export function FetchAllChapterData(subId: string) {
  return new Promise((resolve, reject) => {
    ApiHelper.get(`/api/v1/user/getAllChaptersUser/${subId}`)
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}
export function fetchChapterDetails(chapterId: string) {
  return new Promise((resolve, reject) => {
    ApiHelper.get(`/api/v1/chapter/${chapterId}`)
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}
export function fetchChapterQuestions(
  chapterId: string,
  filters: {
    questionType: string[];
    difficultyLevel: string[];
  }
) {
  const questionTypeFilter = arrayToQueryString(
    "questionType",
    filters.questionType
  );
  const difficultyLevelFilter = arrayToQueryString(
    "difficultyLevel",
    filters.difficultyLevel
  );

  return new Promise((resolve, reject) => {
    ApiHelper.get(
      `/api/v1/userChapter/getPracticeQuestions/${chapterId}?${questionTypeFilter}&&${difficultyLevelFilter}`
    )
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}
export function fetchTestChapterQuestions(chapterId: string) {
  return new Promise((resolve, reject) => {
    ApiHelper.get(`/api/v1/userChapter/getTestQuestions/${chapterId}`)
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}
export function removeChapterQuestion(data: {
  chapterId: string;
  questionId: string;
  type: string;
}) {
  return new Promise((resolve, reject) => {
    ApiHelper.put(`/api/v1/userChapter/deleteQuestion/${data.chapterId}`, {
      questionId: data.questionId,
      type: data.type,
    })
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}
export function fetchTestChaptersQuestions(
  chapterIds: string[],
  questionType: string[],
  noofQuestions: number | null,
  difficultyLevel: string[] | undefined
) {
  const query = arrayToQueryString("chapterId", chapterIds);
  const type = arrayToQueryString("type", questionType);
  const difficultyLevelQuery = difficultyLevel
    ? arrayToQueryString("difficultyLevel", difficultyLevel)
    : undefined;
  return new Promise((resolve, reject) => {
    ApiHelper.get(
      `/api/v1/userChapter/type/getTestQuestions?${query}&&${type}&&noofQuestions=${noofQuestions}&&${difficultyLevelQuery}`
    )
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}
export function AddSimulationstoUserTopic(data: {
  formObj: any;
  id: string;
  chapterId: string;
}) {
  return new Promise((resolve, reject) => {
    ApiHelper.post(`/api/v1/userTopic/addSimulations/${data.id}`, {
      simulations: data.formObj,
      chapterId: data.chapterId,
    })
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}
export function AddTheorytoUserTopic(data: {
  id: string;
  chapterId: string;
  theory: string;
}) {
  return new Promise((resolve, reject) => {
    ApiHelper.post(`/api/v1/userTopic/addTheory/${data.id}`, {
      theory: data.theory,
      chapterId: data.chapterId,
    })
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}
export function AddVideotoUserTopic(data: {
  id: string;
  chapterId: string;
  videoUrl: any;
}) {
  return new Promise((resolve, reject) => {
    ApiHelper.post(`/api/v1/userTopic/addVideo/${data.id}`, {
      videoUrl: data.videoUrl,
      chapterId: data.chapterId,
    })
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}
export function AddSubjectiveQuestiontoUserTopic(data: {
  questionbody: any;
  id: string;
  chapterId: string;
}) {
  return new Promise((resolve, reject) => {
    ApiHelper.post(`/api/v1/userTopic/addSubjectiveQuestion/${data.id}`, {
      formbody: data.questionbody,
      chapterId: data.chapterId,
    })
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}
export function AddMcqQuestiontoUserTopic(data: {
  questionbody: any;
  id: string;
  chapterId: string;
}) {
  return new Promise((resolve, reject) => {
    ApiHelper.post(`/api/v1/userTopic/addmcqQuestion/${data.id}`, {
      formbody: data.questionbody,
      chapterId: data.chapterId,
    })
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}

export function AddNewVideoLink(data: {
  chapterId: any;
  name: string;
  description: string;
  url: string;
}) {
  return new Promise((resolve, reject) => {
    ApiHelper.put(`/api/v1/userChapter/addNewVideoLink/${data.chapterId}`, {
      name: data.name,
      description: data.description,
      url: data.url,
    })
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}
export function removeVideoLink(data: { chapterId: string; videoId: string }) {
  return new Promise((resolve, reject) => {
    ApiHelper.post(`/api/v1/userChapter/removeVideoLink/${data.chapterId}`, {
      videoId: data?.videoId,
    })
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}
