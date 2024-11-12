import ApiHelper from "../../utilities/ApiHelper";
interface TeacherOnboardingProps {
  subjectIds: string[];
  userId: string;
  instituteId?: string;
}
interface EnquireModalData {
  instituteName?: string;
  name: string;
  phoneNo: string;
}
//new
export function createTeacherSubject(data: { _ids: string[] }) {
  return new Promise((resolve, reject) => {
    ApiHelper.post(`/api/v1/userSubject`, {
      subjectIds: data._ids,
    })
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}

export function fetchClassAndSubjectList() {
  return new Promise((resolve, reject) => {
    ApiHelper.get<UserSubjectAPI>(`/api/v1/user/getUserSubjects`)
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}

export function fetchCurrentSubjectData(data: { subject_id: string }) {
  return new Promise((resolve, reject) => {
    ApiHelper.get(`/api/v1/userSubject/${data.subject_id}`)
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}
export async function runMultipleCallsforSubjectData(data: {
  subjects: string[];
}) {
  const promises = data.subjects.map((x) => {
    return ApiHelper.get(`/api/v1/userSubject/${x}`);
  });
  try {
    const results = await Promise.all(promises);
    return results;
  } catch (error) {
    throw error;
  }
}
export function fetchCurrentSharedSubjectData(data: { subject_id: string }) {
  return new Promise((resolve, reject) => {
    ApiHelper.get(`/api/v1/userSubject/getSharedChapter/${data.subject_id}`)
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}

export function fetchSharedSubjectsData(data: { classId: string }) {
  return new Promise((resolve, reject) => {
    ApiHelper.get(`/api/v1/instituteClass/getAllSharedSubjects/${data.classId}`)
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}
export function fetchCurrentChapter(data: { chapter_id: string }) {
  return new Promise((resolve, reject) => {
    ApiHelper.get(`/api/v1/userChapter/${data.chapter_id}`)
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}

export function fetchSimulationsByUserId(data: { topic_id: string }) {
  return new Promise((resolve, reject) => {
    ApiHelper.get(`/api/v1/userTopic/simulations/${data.topic_id}`)
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}

export function teacherOnboarding(data: TeacherOnboardingProps) {
  return new Promise((resolve, reject) => {
    ApiHelper.post("/api/v1/institute/onboarding", data)
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}

export function onboardingSolutions(data: EnquireModalData) {
  return new Promise((resolve, reject) => {
    ApiHelper.post("/api/v1/institute/onboarding/user", data)
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}
