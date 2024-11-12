import ApiHelper from "../../utilities/ApiHelper";

export function getAllTemplates() {
  return new Promise((resolve, reject) => {
    ApiHelper.get(`/api/v1/template/all`)
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}

export function generateSectionsByTemplateId(id: string) {
  return new Promise((resolve, reject) => {
    ApiHelper.get(`/api/v1/template/generateSections/${id}`)
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}
