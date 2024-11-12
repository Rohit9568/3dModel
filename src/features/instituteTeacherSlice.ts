import ApiHelper from "../utilities/ApiHelper";

export function CreateTeacher(data: {
  name: string;
  phoneNumber: string;
  instituteId: string;
  classIds: string[];
  subjectIds: string[];
}) {
  return new Promise((resolve, reject) => {
    ApiHelper.post(`/api/v1/auth/CreateTeacher`, {
      name: data.name,
      phoneNumber: data.phoneNumber,
      instituteId: data.instituteId,
      classIds: data.classIds,
      subjectIds: data.subjectIds
    })
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}
