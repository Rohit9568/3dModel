import ApiHelper from "../utilities/ApiHelper";

export function fetchStudentInfoById(params: { id: string }) {
  return new Promise((resolve, reject) => {
    ApiHelper.get(`/api/v1/instituteStudent/student/${params.id}`)
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}
export function GetAllStudentsByClassId(data: { id: string }) {
  return new Promise((resolve, reject) => {
    ApiHelper.get(`/api/v1/instituteClass/getAllInstituteStudents/${data.id}`)
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}
export function CreateStudent(data:StudentsDataWithBatch) {
  return new Promise((resolve, reject) => {
    ApiHelper.post(`/api/v1/instituteStudent/create`, {
      name: data.name,
      phoneNumber: data.phoneNumber,
      instituteId: data.instituteId,
      instituteBatchId: data.batchId,
      parentName: data.parentName,
      dateOfBirth: data.dateOfBirth,
      address:data.address
    })
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}
