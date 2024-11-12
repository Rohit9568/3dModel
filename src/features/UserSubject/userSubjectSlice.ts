import ApiHelper from "../../utilities/ApiHelper";

export function shareUserSubject(id: string) {
  return new Promise((resolve, reject) => {
    ApiHelper.put(`/api/v1/userSubject/shareUserSubject/${id}`, {
      userTopicId: id,
    })
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}
export function GetUsersubjectById(id: string) {
  return new Promise((resolve, reject) => {
    ApiHelper.get(`/api/v1/userSubject/${id}`, {
      userTopicId: id,
    })
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}

export function UpdateUserSubjectTestMarks(data: {
  testId: string;
  marks: number;
  subjectId: string;
  count: number;
}) {
  return new Promise((resolve, reject) => {
    ApiHelper.put(`/api/v1/userSubject/addTestMarks/${data.subjectId}`, {
      testId: data.testId,
      marks: data.marks,
      count: data.count,
    })
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}

export function UpdateUserSubject(data: {
  testId: string;
  maxMarks: number;
  subjectId: string;
  classId: string;
}) {
  return new Promise((resolve, reject) => {
    ApiHelper.put(`/api/v1/userSubject/${data.subjectId}`, {
      testId: data.testId,
      maxMarks: data.maxMarks,
      classId: data.classId,
    })
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}
