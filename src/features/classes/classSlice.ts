import ApiHelper from "../../utilities/ApiHelper";

export function fetchClassList<T>(params: { includeSubjectMetaData: boolean }) {
  return new Promise((resolve, reject) => {
    ApiHelper.get<T>(`/api/v1/class/`, {
      params: {
        includeSubjectMetaData: params.includeSubjectMetaData,
      },
    })
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}

export function GetAllTeachersByClassId(data: { id: string }) {
  return new Promise((resolve, reject) => {
    ApiHelper.get(`/api/v1/instituteClass/getAllInstituteTeachers/${data.id}`)
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}

export function insertNewAttendance(data: {
  date: Date;
  instituteClassId: string;
  attendance: any;
}) {
  return new Promise((resolve, reject) => {
    ApiHelper.post(
      `/api/v1/instituteClass/insertAttendance/${data.instituteClassId}`,
      {
        date: data.date,
        attendance: data.attendance,
      }
    )
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}

export function createInstituteClass(data: {
  name: string;
  instituteId: string;
  subjectNames: string[];
}) {
  return new Promise((resolve, reject) => {
    ApiHelper.post(`/api/v1/instituteClass/create`, {
      ...data,
    })
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}
