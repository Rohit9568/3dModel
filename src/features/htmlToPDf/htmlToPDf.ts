import axios from "axios";
import { GetUserToken } from "../../utilities/LocalstorageUtility";

export async function htmlToPdf(params: {
  html: string;
  showWaterMark: string | null;
  showBorder: boolean;
}) {
  const response = await axios.post("/api/v1/convertPDf/    ", params, {
    responseType: "blob",
    headers: {
      Accept: "application/pdf",
      authorization: GetUserToken(),
    },
  });
  const status = response.status;
  if (status == 200) {
    const responseData = response.data;
    return responseData;
  }
  return [];
}
