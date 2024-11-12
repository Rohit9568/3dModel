import { showNotification } from "@mantine/notifications";
import {
  VerifyOnBoardingPayment,
  VerifyPayment,
} from "../_parentsApp/features/paymentSlice";
import { loadScript } from "./HelperFunctions";

export async function displayRazorpay(
  optionData: {
    amount: number;
    currency: string;
    id: string;
  },
  afterPaymentFunction: () => void
) {
  const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js");

  if (!res) {
    alert("Razorpay SDK failed to load. Are you online?");
    return;
  }

  const options = {
    key: process.env.REACT_APP_RAZORPAY_KEY_ID,
    currency: optionData.currency,
    amount: optionData.amount,
    order_id: optionData.id,
    name: "Payment",
    description: "Thank you.",
    image:
      "https://vignam-content-images.s3.amazonaws.com/2023-08-17T11-55-12-035Z.png",
    handler: async function (response: any) {
      const successData = {
        orderCreationId: optionData.id,
        razorpayPaymentId: response.razorpay_payment_id,
        razorpayOrderId: response.razorpay_order_id,
        razorpaySignature: response.razorpay_signature,
      };
      VerifyPayment(successData)
        .then(() => {
          afterPaymentFunction();
        })
        .catch((e) => {
          showNotification({ message: "Failed", color: "red" });
          console.log(e);
        });
    },
    prefill: {
      email: "",
      phone_number: "",
    },
  };
  //@ts-ignore
  const paymentObject = new window.Razorpay(options);
  paymentObject.open();
}
export async function displayOnBoardingRazorPay(
  optionData: {
    amount: number;
    currency: string;
    id: string;
    name: string;
    phoneNumber: string;
    maxClasses: number;
    plan: number;
  },
  afterPaymentFunction: (x: any) => void
) {
  const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js");

  if (!res) {
    alert("Razorpay SDK failed to load. Are you online?");
    return;
  }

  const options = {
    key: process.env.REACT_APP_RAZORPAY_KEY_ID,
    currency: optionData.currency,
    amount: optionData.amount,
    order_id: optionData.id,
    name: "Payment",
    description: "Thank you.",
    image:
      "https://vignam-content-images.s3.amazonaws.com/2023-08-17T11-55-12-035Z.png",
    handler: async function (response: any) {
      const successData = {
        orderCreationId: optionData.id,
        razorpayPaymentId: response.razorpay_payment_id,
        razorpayOrderId: response.razorpay_order_id,
        razorpaySignature: response.razorpay_signature,
        phoneNo: optionData.phoneNumber,
        name: optionData.name,
        maxClasses: optionData.maxClasses,
        plan: optionData.plan,
      };
      VerifyOnBoardingPayment(successData)
        .then((x) => {
          afterPaymentFunction(x);
        })
        .catch((e) => {
          showNotification({ message: "Failed", color: "red" });
          console.log(e);
        });
    },
    modal: {
      ondismiss: function () {
        window.location.reload();
      },
    },
    prefill: {
      email: "",
      phone_number: "",
    },
  };
  //@ts-ignore
  const paymentObject = new window.Razorpay(options);
  paymentObject.open();
}
