import { que, subque } from "../../components/_New/Test/UserTypedQuestions";
import ApiHelper from "../../utilities/ApiHelper";

export function createTestMCQQuestions(data: {
  formObj: {
    questions:
      | {
          text: string;
          answers: { text: string; isCorrect: boolean }[];
        }[]
      | [];
  };
}) {
  return new Promise((resolve, reject) => {
    ApiHelper.post(`/api/v1/question/createtestquestions/`, data.formObj)
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}
export function createCasebasedQuestions(data: {
  formObj: {
    questions:
      | {
          text: string;
          questions: {
            text: string;
            answers: { text: string; isCorrect: boolean }[];
          }[];
        }[]
      | [];
  };
}) {
  return new Promise((resolve, reject) => {
    ApiHelper.post(
      `/api/v1/casebasedQuestion/createtestquestions`,
      data.formObj
    )
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}

export function createTestSubjectiveQuestions(data: {
  formObj: {
    questions: {
      text: string;
      answer: string;
    }[];
    questionType: string;
  };
}) {
  return new Promise((resolve, reject) => {
    ApiHelper.post(
      `/api/v1/subjectivequestion/createtestquestions/`,
      data.formObj
    )
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}
export function createQuestionsusingAI(data: {
  subjectName: string;
  className: string;
  chapterName: string[];
  chapterIds: string[];
  objectiveQuestionNo: number;
  subjectiveQuestionNo: number;
  caseStudyQuestionNo: number;
  questionType: string;
}) {
  return new Promise((resolve, reject) => {
    ApiHelper.post(`/api/v1/question/createQuestionUsingAI`, {
      subjectName: data.subjectName,
      className: data.className,
      chapterName: data.chapterName,
      chapterIds: data.chapterIds,
      objectiveQuestionNo: data.objectiveQuestionNo,
      subjectiveQuestionNo: data.subjectiveQuestionNo,
      questionType: data.questionType,
      casebasedquestionsNo: data.caseStudyQuestionNo,
    })
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}
export function createCaseQuestionsusingAI(data: {
  subjectName: string;
  className: string;
  chapterName: string[];
  chapterIds: string[];
  objectiveQuestionNo: number;
  subjectiveQuestionNo: number;
  questionType: string;
}) {
  return new Promise((resolve, reject) => {
    ApiHelper.post(`/api/v1/question/createQuestionUsingAI`, {
      subjectName: data.subjectName,
      className: data.className,
      chapterName: data.chapterName,
      chapterIds: data.chapterIds,
      objectiveQuestionNo: data.objectiveQuestionNo,
      subjectiveQuestionNo: data.subjectiveQuestionNo,
      questionType: data.questionType,
    })
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}

export function updateSubjectiveQuestion(data: {
  id: string;
  text: string;
  answer: string;
  difficultyLevel: string;
  totalMarks: number;
  negativeMarks: number;
  explaination: string;
}) {
  return new Promise((resolve, reject) => {
    ApiHelper.put(`/api/v1/subjectivequestion/updatequestion/${data.id}`, {
      text: data.text,
      answer: data.answer,
      difficultyLevel: data.difficultyLevel,
      totalMarks: data.totalMarks,
      totalNegativeMarks: data.negativeMarks,
      explaination: data.explaination,
    })
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}
export function updateObjectiveQuestion(data: {
  id: string;
  text: string;
  answers: any[];
  difficultyLevel: string;
  totalMarks: number;
  negativeMarks: number;
  explaination: string;
}) {
  return new Promise((resolve, reject) => {
    ApiHelper.put(`/api/v1/question/updatequestion/${data.id}`, {
      text: data.text,
      answers: data.answers,
      difficultyLevel: data.difficultyLevel,
      totalMarks: data.totalMarks,
      totalNegativeMarks: data.negativeMarks,
      explaination: data.explaination,
    })
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}
export function updateCaseBasedQuestion(data: {
  id: string;
  text: string;
  questions: any[];
  difficultyLevel: string;
}) {
  return new Promise((resolve, reject) => {
    ApiHelper.put(`/api/v1/caseBasedQuestion/updatequestion/${data.id}`, {
      questions: data.questions,
      difficultyLevel: data.difficultyLevel,
      text: data.text,
    })
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}
