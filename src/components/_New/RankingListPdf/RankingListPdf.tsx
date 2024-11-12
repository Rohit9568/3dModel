import { Badge } from "@mantine/core";
import ReactDOMServer from "react-dom/server";
import { GetAllInfoForInstitute } from "../../../_parentsApp/features/instituteSlice";
import { htmlToPdf } from "../../../features/htmlToPDf/htmlToPDf";
import {
  calculatePercentage,
  convertDateToHMS,
  convertMillisecondsToHMS,
} from "../../../utilities/HelperFunctions";
import { FileUpload } from "../../../features/fileUpload/FileUpload";

function createRankPdf(
  instituteName: string,
  instituteLogo: string,
  address: string,
  phoneNumber: string,
  answersheets: any[],
  testName: string,
  maxMarks: number
) {
  return (
    <html>
      <head>
        <style>
          @import
          url('https://fonts.googleapis.com/css2?family=Nunito,wght@0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,300;1,400;1,600;1,800&display=swap');
        </style>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
        <script
          id="MathJax-script"
          defer
          src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-chtml.js"
        ></script>
      </head>
      <body
        style={{
          fontFamily: "Times New Roman",
          whiteSpace: "pre-line",
          margin: "0px 5px",
          // margin: "0px 1px 0px -3px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            padding: "0px 20px",
            // marginTop: -25,
          }}
        >
          <img
            src={instituteLogo}
            width="100px"
            height="100px"
            style={{
              marginRight: "20px",
            }}
          />
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0px",
            }}
          >
            <p
              style={{
                fontSize: "30px",
                fontWeight: 700,
                textAlign: "center",
              }}
            >
              {instituteName.toUpperCase()}
            </p>
            <p
              style={{
                fontSize: "18px",
                marginTop: "-28px",
                textAlign: "center",
                fontWeight: 600,
                color: "black",
              }}
            >
              {address.toUpperCase()}
            </p>
            <p
              style={{
                fontSize: "18px",
                marginTop: "-16px",
                textAlign: "center",
                fontWeight: 600,
                color: "black",
              }}
            >
              Phone No.-{phoneNumber.toUpperCase()}
            </p>
          </div>
        </div>
        <p
          style={{
            fontSize: 26,
            fontWeight: 700,
            textAlign: "center",
          }}
        >
          {testName}
        </p>
        <table
          style={{
            borderCollapse: "collapse",
            width: "100%",
          }}
        >
          <thead>
            <tr>
              <th
                style={{
                  border: "1px solid black",
                  padding: "8px",
                  textAlign: "left",
                  backgroundColor: "#f2f2f2",
                }}
              >
                Rank
              </th>
              <th
                style={{
                  border: "1px solid black",
                  padding: "8px",
                  textAlign: "left",
                  backgroundColor: "#f2f2f2",
                }}
              >
                Student Name
              </th>
              <th
                style={{
                  border: "1px solid black",
                  padding: "8px",
                  textAlign: "left",
                  backgroundColor: "#f2f2f2",
                }}
              >
                Marks Scored
              </th>
              <th
                style={{
                  border: "1px solid black",
                  padding: "8px",
                  textAlign: "left",
                  backgroundColor: "#f2f2f2",
                }}
              >
                Percentage
              </th>
              <th
                style={{
                  border: "1px solid black",
                  padding: "8px",
                  textAlign: "left",
                  backgroundColor: "#f2f2f2",
                }}
              >
                Start Time{" "}
              </th>
              <th
                style={{
                  border: "1px solid black",
                  padding: "8px",
                  textAlign: "left",
                  backgroundColor: "#f2f2f2",
                }}
              >
                Duration
              </th>
            </tr>
          </thead>
          <tbody>
            {answersheets.map((answerSheet, index) => {
              return (
                <tr>
                  <td
                    style={{
                      border: "1px solid black",
                      padding: "8px",
                      textAlign: "left",
                    }}
                  >
                    {index + 1}
                  </td>
                  <td
                    style={{
                      border: "1px solid black",
                      padding: "8px",
                      textAlign: "left",
                    }}
                  >
                    {answerSheet.student_id.name}
                  </td>
                  <td
                    style={{
                      border: "1px solid black",
                      padding: "8px",
                      textAlign: "left",
                    }}
                  >
                    {`${answerSheet.testReportId.totalMarks} / ${maxMarks}`}
                  </td>
                  <td
                    style={{
                      border: "1px solid black",
                      padding: "8px",
                      textAlign: "left",
                    }}
                  >
                    <Badge color="teal">
                      {calculatePercentage(
                        answerSheet.testReportId.totalMarks,
                        maxMarks
                      )}
                      %
                    </Badge>
                  </td>
                  <td
                    style={{
                      border: "1px solid black",
                      padding: "8px",
                      textAlign: "left",
                    }}
                  >
                    {convertDateToHMS(new Date(answerSheet.createdAt))}
                  </td>
                  <td
                    style={{
                      border: "1px solid black",
                      padding: "8px",
                      textAlign: "left",
                    }}
                  >
                    {convertMillisecondsToHMS(
                      answerSheet.testReportId.totalTimeTaken * 1000
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </body>
    </html>
  );
}

export function downloadRankList(
  isLoading: boolean,
  setIsLoading: (val: boolean) => void,
  answersheets: any[],
  instituteId: string,
  testName: string,
  maxMarks: number,
  isReactNativeActive: boolean,
  sendDataToReactnative: (command: number, data: any) => void,
) {
  let name = "";
  let icon = "";
  let address = "";
  let admin1 = null;
  setIsLoading(true);
  GetAllInfoForInstitute({
    id: instituteId,
  })
    .then((x: any) => {
      name = x.name;
      address = x.Address;
      icon = x.schoolIcon;
      admin1 = x.admins[0].name;
      if (admin1 === undefined && admin1 === null) {
        admin1 = x.teachers[0].name;
      }
      htmlToPdf({
        html: ReactDOMServer.renderToString(
          createRankPdf(
            name,
            icon,
            address,
            x.institutePhoneNumber,
            answersheets,
            testName,
            maxMarks
          )
        ),
        showBorder: false,
        showWaterMark: null,
      })
        .then((data2: any) => {
          var link = document.createElement("a");
          link.href = window.URL.createObjectURL(
            new Blob([data2], { type: "application/pdf" })
          );
          link.download = `${"RankingList"}.pdf`;
          const newBlob = new Blob([data2], { type: "application/pdf" });
          var file = new File([newBlob], "name");
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
        .catch((error: any) => {
          setIsLoading(false);
          console.error("Error:", error);
        });
    })
    .catch((e: any) => {
      setIsLoading(false);
      console.log(e);
    });
}
