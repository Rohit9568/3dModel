import ApiHelper from "../../utilities/ApiHelper";
export function GetAllClassesForUser() {
  return new Promise((resolve, reject) => {
    ApiHelper.get(`/api/v1/user/getInstituteClasses`)
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}
export function GetAllClassesAndSubjectsForUser() {
  return new Promise((resolve, reject) => {
    ApiHelper.get(`/api/v1/user/getUserInstituteClassesAndSubjects`)
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}
export function GetClassesAndHomeworks() {
  return new Promise((resolve, reject) => {
    ApiHelper.get(`/api/v1/user/getClassesAndHomeworks`)
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}
