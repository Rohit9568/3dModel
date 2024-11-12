import ApiHelper from "../../utilities/ApiHelper";

export function getUserDetails() {
  return new Promise((resolve, reject) => {
    ApiHelper.get(`/api/v1/user/getuser`)
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}

export function getUserById(id: string) {
  return new Promise((resolve, reject) => {
    ApiHelper.get(`/api/v1/user/${id}`)
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}
export function getAutoGenPassword(id: string) {
  return new Promise((resolve, reject) => {
    ApiHelper.get(`/api/v1/user/getAutoGenPassword/${id}`)
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}
export function updateUserDetails(data: {
  id: string;
  name: string;
  email: string;
  batches: string[];
  phoneNo: string;
  role: string;
  featureAccess: UserFeatureAccess;
  removedbatches: string[];
}) {
  return new Promise((resolve, reject) => {
    ApiHelper.put(`/api/v1/user/editProfile/${data.id}`, {
      name: data.name,
      email: data.email,
      phoneNo: data.phoneNo,
      role: data.role,
      featureAccess: data.featureAccess,
      batches: data.batches,
      removedbatches: data.removedbatches,
    })
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}
