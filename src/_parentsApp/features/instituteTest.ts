import ApiHelper from "../../utilities/ApiHelper";

export function CreateNewTest(data: {
    name: string;
    classId: string;
    date:number
  }) {
    return new Promise((resolve, reject) => {
      ApiHelper.post(`/api/v1/instituteTest/create`, {
        name: data.name,
        classId: data.classId,
        date:data.date
      })
        .then((response) => resolve(response))
        .catch((error) => reject(error));
    });
  }

  export function CreateNewBasicTest(data: {
    name: string;
    maxMarks:number;
    classId?: string;
    subjectId?:string;
  }) {
    return new Promise((resolve, reject) => {
      ApiHelper.post(`/api/v1/test/createBasic`, {
        name: data.name,
        batch_id: data.classId,
        subject_id:data.subjectId,
        maxMarks:data.maxMarks
      })
        .then((response) => resolve(response))
        .catch((error) => reject(error));
    });
  }