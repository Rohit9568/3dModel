import ApiHelper from "../../utilities/ApiHelper";
interface Question {
  _id: string;
  marks: number;
}

interface Body {
  questions: Question[];
}
export function createAnswerSheet(data: {
  formObj: {
    studentId: string;
    testId: string;
    studentTestAnswerSheet: StudentTestAnswerSheet;
  };
}) {
  return new Promise((resolve, reject) => {
    ApiHelper.post(`/api/v1/answersheet/create`, data.formObj)
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}
export function createCourseAnswerSheet(data: { formObj: any }) {
  return new Promise((resolve, reject) => {
    ApiHelper.post(`/api/v1/answersheet/createCourseAnswerSheet`, data.formObj)
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}
export function createAnswerSheetPDF(data: {
  studentId: string;
  testId: string;
  pdfLink: string;
}) {
  return new Promise((resolve, reject) => {
    ApiHelper.post(`/api/v1/answerpdf/create`, {
      studentId: data.studentId,
      testId: data.testId,
      pdfLink: data.pdfLink,
    })
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}
export function fetchTestResults(testId: string) {
  return new Promise((resolve, reject) => {
    ApiHelper.get(`/api/v1/answersheet/${testId}`)
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}
export function fetchSingleAnswerSheet(ansersheetId: string) {
  return new Promise((resolve, reject) => {
    ApiHelper.get(`/api/v1/answersheet/singleSheet/${ansersheetId}`)
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}

export function fetchReportFromAnswerSheet(ansersheetId: string) {
  return new Promise((resolve, reject) => {
    ApiHelper.get(`/api/v1/answersheet/getTestReport/${ansersheetId}`)
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}

export function submitUpdatedAnswers(
  data: any,
  id: string,
  mcqQuestions: any,
  mcqMarkQuestions: any,
  casebasedMarkQuestions: any,
  isPdf: any
) {
  // /api/v1/answersheet/:id

  return new Promise((resolve, reject) => {
    ApiHelper.put(`/api/v1/answersheet/${id}`, {
      questions: data,
      mcqQuestions: mcqQuestions,
      mcqMarkQuestions,
      casebasedMarkQuestions,
      isPdf,
    })
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}
export function submitUpdatedSubjectiveAnswers(
  id: string,
  subjectiveAnswers: any
) {
  return new Promise((resolve, reject) => {
    ApiHelper.put(`/api/v1/answersheet/updateSubjectiveAnswers/${id}`, {
      subjectiveAnswers: subjectiveAnswers,
    })
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}
