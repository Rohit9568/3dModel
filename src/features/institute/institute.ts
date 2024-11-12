import ApiHelper from "../../utilities/ApiHelper";

export function getinstituteById(id: string) {
  return new Promise((resolve, reject) => {
    ApiHelper.get(`/api/v1/institute/${id}`)
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}
export function updateInstituteDetails(data: {
  instituteId: string;
  email: string;
  password: string | undefined;
  name: string;
  schoolLogo: string;
  instituteName: string;
}) {
  return new Promise((resolve, reject) => {
    ApiHelper.put(
      `/api/v1/institute/updateInstituteDetails/${data.instituteId}`,
      {
        email: data.email,
        password: data.password,
        name: data.name,
        schoolLogo: data.schoolLogo,
        instituteName: data.instituteName,
      }
    )
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}
