import ApiHelper from "../../utilities/ApiHelper";

export function createPaymentRecord(data: {
  studentId: string;
  instituteId: string;
  instititeName: string;
  studentName: string;
  amountPaid: number;
  courseId: string;
  courseName: string;
}) {
  return new Promise((resolve, reject) => {
    ApiHelper.post(`/api/v1/paymentRecord/`, {
      ...data,
    })
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}
