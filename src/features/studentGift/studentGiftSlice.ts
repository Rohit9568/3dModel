import ApiHelper from "../../utilities/ApiHelper";

export function UpdateStudentGiftIsRedeemedStatus(data: { id: string }) {
  return new Promise((resolve, reject) => {
    ApiHelper.put(`/api/v1/studentGift/changeConfirmedStatus/${data.id}`, {})
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}
