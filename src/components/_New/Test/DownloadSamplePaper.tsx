import { Box, Flex, Stack, Text } from "@mantine/core";
import { fetchFullTest } from "../../../features/test/TestSlice";
import { htmlToPdf } from "../../../features/htmlToPDf/htmlToPDf";
import ReactDOMServer from "react-dom/server";
import { GetUser } from "../../../utilities/LocalstorageUtility";
import { GetAllInfoForInstitute } from "../../../_parentsApp/features/instituteSlice";
import { Mixpanel } from "../../../utilities/Mixpanel/MixpanelHelper";
import { WebAppEvents } from "../../../utilities/Mixpanel/AnalyticeEventWebApp";
import { User1 } from "../../../@types/User";
import { QuestionParentType, QuestionType, findQuestionType } from "../../../@types/QuestionTypes.d";
import { createNewSectionTypeHtmlFromTestData } from "./NewTeacherTest";
import { FileUpload } from "../../../features/fileUpload/FileUpload";
import useParentCommunication from "../../../hooks/useParentCommunication";


const instituteWithInstructions = [
  "INST-8251030a-c36d-4e2b-a25f-7d6fe9a13734",
  // "INST-61707a41-a53f-4407-8552-c66aa36e1d50",
];
const instituteWithComicFont = [
  "INST-8251030a-c36d-4e2b-a25f-7d6fe9a13734",
  // "INST-61707a41-a53f-4407-8552-c66aa36e1d50",
];
const instituteWithWaterMark = [
  { id: "INST-8251030a-c36d-4e2b-a25f-7d6fe9a13734", waterMarkText: "KCMS" },
  // { id: "INST-61707a41-a53f-4407-8552-c66aa36e1d50", waterMarkText: "KCMS" },
];
const instituteWithBorder = [
  "INST-8251030a-c36d-4e2b-a25f-7d6fe9a13734",
  // "INST-61707a41-a53f-4407-8552-c66aa36e1d50",
];
const inlineFormat = [
  "INST-8251030a-c36d-4e2b-a25f-7d6fe9a13734",
  // "INST-61707a41-a53f-4407-8552-c66aa36e1d50",
];
export function downloadPdf(
  testId: string,
  setIsLoading: (input: boolean) => void,
  user1: User1 | null,
  isReactNativeActive: boolean,
  sendDataToReactnative: (command: number, data: any) => void,
  isSolutions: boolean,
  isBorder: boolean,
  isInstructions: boolean,
  waterMarkText: string | null
) {
  Mixpanel.track(WebAppEvents.TEACHER_APP_TEST_PAGE_DOWNLOAD_BUTTON_CLICKED);
  setIsLoading(true);

  let instituteName: string,
    instituteLogo: string,
    instituteBanner: string | null,
    instituteSubheading: string | null;
  const user = GetUser();
  const subscriptionModelType = user1?.subscriptionModelType;
  GetAllInfoForInstitute({ id: user.instituteId })
    .then((x: any) => {
      instituteName = x.name;
      instituteLogo = x.schoolIcon;
      instituteBanner = x.schoolBanner;
      instituteSubheading = x.schoolSubText;

      fetchFullTest(testId)
        .then((data: any) => {
          if (data.isNewSectionType === true) {
            htmlToPdf({
              html: ReactDOMServer.renderToString(
                createNewSectionTypeHtmlFromTestData(
                  data,
                  instituteName,
                  instituteLogo,
                  instituteSubheading,
                  instituteBanner,
                  subscriptionModelType ?? "FREE",
                  isInstructions,
                  instituteWithComicFont.includes(user.instituteId),
                  inlineFormat.includes(user.instituteId),
                  x.institutePhoneNumber,
                  x.secondInstituteNumber,
                  x.Address,
                  isSolutions
                )
              ),
              showBorder: isBorder,
              showWaterMark: waterMarkText,
            })
              .then((data2: any) => {
                var link = document.createElement("a");
                const newBlob = new Blob([data2], { type: "application/pdf" });
                var file = new File([newBlob], "name");
                link.href = window.URL.createObjectURL(
                  new Blob([data2], { type: "application/pdf" })
                );
                link.download = `${data.name}.pdf`;
                if (isReactNativeActive) {
                  FileUpload({ file })
                    .then((x) => {
                      sendDataToReactnative(1, {
                        url: x.url,
                      });
                    })
                    .catch((e) => {
                      console.log(e);
                    });
                } else link.click();
                link.remove();

                setIsLoading(false);
              })
              .catch((error) => {
                setIsLoading(false);
                console.error("Error:", error);
              });
          }
        })
        .catch((error) => {
          setIsLoading(false);
          console.log(error);
        });
    })
    .catch((e) => {
      console.log(e);
    });
}
