import ApiHelper from "../utilities/ApiHelper";

export function SendMessageUsingPhoneNumber(data: {
  studentName: string;
  phoneNumber: string;
  instituteName: string;
}) {
  return new Promise((resolve, reject) => {
    ApiHelper.post(`/api/v1/instituteAdmin/`, {
      studentName: data.studentName,
      phoneNumber: data.phoneNumber,
      instituteName: data.instituteName,
    })
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}

// export function SendDoubt(data: {
//   reply: string;
//   id: string;
//   phoneNumber: string;
//   instituteName: string;
// }) {
//   return new Promise((resolve, reject) => {
//     ApiHelper.put(`/api/v1/doubt/${data.id}`, {
//       reply: data.reply,
//       phoneNumber: data.phoneNumber,
//       instituteName: data.instituteName,
//     })
//       .then((response) => resolve(response))
//       .catch((error) => reject(error));
//   });
// }
