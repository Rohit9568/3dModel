import ApiHelper from "../../utilities/ApiHelper";

export function createTest(data: { formObj: any; subjectId: string }) {
  return new Promise((resolve, reject) => {
    ApiHelper.post(`/api/v1/test/create/${data.subjectId}`, data.formObj)
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}

export function createTestwithQuestions(data: { formObj: any }) {
  return new Promise((resolve, reject) => {
    ApiHelper.post(`/api/v1/test/createwithQuestions/null`, data.formObj)
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}
export function editTestQuestions(data: { formObj: any; id: string }) {
  return new Promise((resolve, reject) => {
    ApiHelper.put(`/api/v1/test/editQuestions/${data.id}`, data.formObj)
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}
export function createTestwithPdf(data: { formObj: any }) {
  return new Promise((resolve, reject) => {
    ApiHelper.post(`/api/v1/test/createwithPdf/null`, data.formObj)
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}
export function createCourseTest(data: { formObj: any }) {
  return new Promise((resolve, reject) => {
    ApiHelper.post(`/api/v1/test/courseTest`, data.formObj)
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}
export function crateCopyTest(data: { formObj: any }) {
  return new Promise((resolve, reject) => {
    ApiHelper.post(`/api/v1/test/createCopy`, data.formObj)
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}
export function fetchTests(subId: string) {
  return new Promise((resolve, reject) => {
    ApiHelper.get(`/api/v1/test/subject/${subId}`)
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}
export function fetchFullTest(testId: string) {
  return new Promise((resolve, reject) => {
    ApiHelper.get(`/api/v1/test/${testId}`)
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}
export function fetchAllTests() {
  return new Promise((resolve, reject) => {
    ApiHelper.get(`/api/v1/test/getTestForUser/All`)
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}
export function shareTestToStudents(testId: string) {
  return new Promise((resolve, reject) => {
    ApiHelper.post(`/api/v1/test/shareTest/${testId}`, {})
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}
export function addBatchesToTest(
  testId: string,
  batchIds: string[],
  unsharedBatchIds: string[]
) {
  return new Promise((resolve, reject) => {
    ApiHelper.put(`/api/v1/test/addBatchesToTest/${testId}`, {
      batchIds: batchIds,
      unsharedBatchIds: unsharedBatchIds,
    })
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}
export function fetchFullTestWithResults(
  testId: string,
  type: "REPORT" | "RESPONSE"
) {
  return new Promise((resolve, reject) => {
    ApiHelper.get(`/api/v1/test/getTestWithResults/${testId}?type=${type}`)
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}
export function getTestQuestions(subjectid: string) {
  return new Promise((resolve, reject) => {
    ApiHelper.get(`/api/v1/test/samplePaper/${subjectid}`)
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}

export function createSamplePaperTest(data: {
  formObj: any;
  subjectId: string;
}) {
  return new Promise((resolve, reject) => {
    ApiHelper.post(
      `/api/v1/test/create/samplePaper/${data.subjectId}`,
      data.formObj
    )
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}
export function deleteTest(testId: any) {
  return new Promise((resolve, reject) => {
    ApiHelper.patch(`/api/v1/test/${testId}`)
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}
export function getTestResources(testId: string) {
  return new Promise((resolve, reject) => {
    ApiHelper.get(`/api/v1/test/getTestResources/${testId}`)
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}
export function addTestResources(data: {
  testId: string;
  fileName: string;
  url: string;
}) {
  return new Promise((resolve, reject) => {
    ApiHelper.put(`/api/v1/test/addTestResources/${data.testId}`, {
      fileName: data.fileName,
      url: data.url,
    })
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}
export function removeTestResources(data: {
  testId: string;
  fileName: string;
  url: string;
}) {
  return new Promise((resolve, reject) => {
    ApiHelper.put(`/api/v1/test/removeTestResources/${data.testId}`, {
      fileName: data.fileName,
      url: data.url,
    })
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}

export function addQuestionToBookmark(data: {
  testId: string;
  studentId: string;
  questionId: string;
  questionType:string;
}) {
  return new Promise((resolve, reject) => {
    ApiHelper.post(`/api/v1/question/bookmarkQuestion`, {
      testId: data.testId,
      studentId: data.studentId,
      questionId: data.questionId,
      questionType:data.questionType
    })
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}

export function getAllBookmarkedQuestions(data: {
  studentId: string;
  testId?: string;
}) {
  return new Promise((resolve, reject) => {
    ApiHelper.get(
      `/api/v1/question/bookmarkQuestionsForStudent/${data.studentId}${
        data.testId != "undefined" ? `?testId=${data.testId}` : ``
      }`
    )
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}

export function removeBookarkedQuestion(data: { bookmarkQuestionId: string }) {
  return new Promise((resolve, reject) => {
    ApiHelper.delete(
      `/api/v1/question/bookmarkQuestion/${data.bookmarkQuestionId}`
    )
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}

export function getIsBookmarked(data: { testId: string; studentId: string }) {
  return new Promise((resolve, reject) => {
    ApiHelper.get(
      `/api/v1/question/isbookmark/${data.testId}/${data.studentId}`
    )
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}

//report funtions
export function getComparativeAnalysisData(data: {
  studentId: string;
  testId: string;
}) {
  return new Promise((resolve, reject) => {
    ApiHelper.get(
      `/api/v1/testReport/comparativeAnalysis/${data.testId}?studentId=${data.studentId}`
    )
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}
