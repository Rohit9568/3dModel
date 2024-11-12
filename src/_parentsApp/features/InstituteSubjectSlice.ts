import ApiHelper from "../../utilities/ApiHelper";

export function UpdateInstituteSubject(data: {
  testId: string;
  maxMarks: number;
  subjectId: string;
}) {
  return new Promise((resolve, reject) => {
    ApiHelper.put(`/api/v1/instituteSubject/${data.subjectId}`, {
      testId: data.testId,
      maxMarks: data.maxMarks,
    })
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}
export function UpdateInstituteSubjectTestMarks(data: {
  testId: string;
  marks: number;
  subjectId: string;
  count:number
}) {
  return new Promise((resolve, reject) => {
    ApiHelper.put(`/api/v1/instituteSubject/addTestTotalMarks/${data.subjectId}`, {
      testId: data.testId,
      marks: data.marks,
      count:data.count
    })
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}
export function GetInstituteSubject(data: { subjectId: string }) {
  return new Promise((resolve, reject) => {
    ApiHelper.get(`/api/v1/instituteSubject/${data.subjectId}`)
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}
export function GetUserChaptersFromInstitute(data: { subjectId: string }) {
  return new Promise((resolve, reject) => {
    ApiHelper.get(`/api/v1/instituteSubject/getUserChapters/${data.subjectId}`)
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}
