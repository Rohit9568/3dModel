import ApiHelper from "../../utilities/ApiHelper";

export function GetOrderData(id: string) {
  return new Promise((resolve, reject) => {
    ApiHelper.get(`/api/v1/payment/${id}`)
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}
export function GetVideoCallOrderData(id: string) {
  return new Promise((resolve, reject) => {
    ApiHelper.get(`/api/v1/payment/videoCall/${id}`)
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}
export function GetCourseFeatureOrderData() {
  return new Promise((resolve, reject) => {
    ApiHelper.get(`/api/v1/payment/courseFeature`)
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}
export function GetCourseOrderData(id: string) {
  return new Promise((resolve, reject) => {
    ApiHelper.get(`/api/v1/payment/course/${id}`)
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}
export function GetDashboardOrderData() {
  return new Promise((resolve, reject) => {
    ApiHelper.get(`/api/v1/payment/dashboardFeature`)
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}
export function GetOnboardingOrderData(data: {
  plan: number;
  classes: number;
}) {
  return new Promise((resolve, reject) => {
    ApiHelper.get(
      `/api/v1/payment/onBoarding?plan=${data.plan}&&classes=${data.classes}`
    )
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}
export function GetTestOrderData() {
  return new Promise((resolve, reject) => {
    ApiHelper.get(`/api/v1/payment/testFeature`)
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}
export function GetSimulationOrderData() {
  return new Promise((resolve, reject) => {
    ApiHelper.get(`/api/v1/payment/simulationFeature`)
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}
export function VerifyPayment(data: {
  orderCreationId: string;
  razorpayPaymentId: string;
  razorpayOrderId: string;
  razorpaySignature: string;
}) {
  return new Promise((resolve, reject) => {
    ApiHelper.post(`/api/v1/payment/verifyPayment`, {
      ...data,
    })
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}
export function VerifyOnBoardingPayment(data: {
  orderCreationId: string;
  razorpayPaymentId: string;
  razorpayOrderId: string;
  razorpaySignature: string;
  maxClasses: number;
  name: string;
  phoneNo: string;
  plan: number;
}) {
  return new Promise((resolve, reject) => {
    ApiHelper.post(`/api/v1/payment/verifyOnBoardingPayment`, {
      ...data,
    })
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}
