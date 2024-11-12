import { IconCurrencyRupee } from "@tabler/icons";
import { htmlToPdf } from "../../features/htmlToPDf/htmlToPDf";
import ReactDOMServer from "react-dom/server";
import { GetAllInfoForInstitute } from "../../_parentsApp/features/instituteSlice";
import { formatDate, getMonthName } from "../../utilities/HelperFunctions";
import { FileUpload } from "../../features/fileUpload/FileUpload";
function numberToWords(number: number) {
  const words = [
    "",
    "one",
    "two",
    "three",
    "four",
    "five",
    "six",
    "seven",
    "eight",
    "nine",
  ];
  const teens = [
    "",
    "eleven",
    "twelve",
    "thirteen",
    "fourteen",
    "fifteen",
    "sixteen",
    "seventeen",
    "eighteen",
    "nineteen",
  ];
  const tens = [
    "",
    "ten",
    "twenty",
    "thirty",
    "forty",
    "fifty",
    "sixty",
    "seventy",
    "eighty",
    "ninety",
  ];

  function convertTwoDigitNumber(num: number) {
    if (num < 10) {
      return words[num];
    } else if (num >= 11 && num <= 19) {
      return teens[num - 10];
    } else {
      const digitOne = Math.floor(num / 10);
      const digitTwo = num % 10;
      return tens[digitOne] + (digitTwo !== 0 ? " " + words[digitTwo] : "");
    }
  }

  function convertThreeDigitNumber(num: number) {
    const digitHundred = Math.floor(num / 100);
    const remainingTwoDigits = num % 100;

    if (digitHundred !== 0) {
      return (
        words[digitHundred] +
        " hundred" +
        (remainingTwoDigits !== 0
          ? " and " + convertTwoDigitNumber(remainingTwoDigits)
          : "")
      );
    } else {
      return convertTwoDigitNumber(remainingTwoDigits);
    }
  }

  function convertNumberWithThousands(num: number) {
    const digitThousand = Math.floor(num / 1000);
    const remainingThreeDigits = num % 1000;

    if (digitThousand !== 0) {
      return (
        convertThreeDigitNumber(digitThousand) +
        " thousand" +
        (remainingThreeDigits !== 0
          ? " " + convertThreeDigitNumber(remainingThreeDigits)
          : "")
      );
    } else {
      return convertThreeDigitNumber(remainingThreeDigits);
    }
  }

  if (number < 0) {
    return "Please enter a non-negative number";
  } else if (number >= 100000) {
    return "Please enter a number less than 100000";
  } else {
    return convertNumberWithThousands(number);
  }
}

function createReceiptPdf(
  receiptNo: string,
  studentName: string,
  date: Date,
  parentName: string,
  totalPrice: number,
  studentPaymentRecords: StudentFeeRecord[],
  balance: number,
  name: string,
  address: string,
  icon: string,
  className: string,
  phoneNumber: string,
  teacherName: string,
  secondPhoneNumber: string
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
            flexDirection: "column",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              padding: 20,
            }}
          >
            <img
              src={icon}
              width="150px"
              height="140px"
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
                {name.toUpperCase()}
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
                Phone No.-
                {phoneNumber.toUpperCase()}, {secondPhoneNumber.toUpperCase()}
              </p>
            </div>
          </div>
          <p
            style={{
              height: "1px",
              backgroundColor: "gray",
              width: "100%",
              marginBottom: -10,
            }}
          ></p>
          <p
            style={{
              textAlign: "center",
              fontSize: 27,
              fontWeight: 700,
              //   marginTop: "-10px",
            }}
          >
            FEE RECEIPT
          </p>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              border: "black solid 1px",
              padding: "6px 12px",
              margin: 0,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                width: "100%",
              }}
            >
              <p
                style={{
                  fontSize: "22px",
                  padding: 0,
                  margin: 0,
                  width: "36%",
                }}
              >
                Receipt No:
              </p>
              <span
                style={{
                  // position: "absolute",
                  bottom: "0px",
                  paddingLeft: 10,
                  margin: 0,
                  padding: 0,
                  fontSize: 16,
                  fontWeight: 700,
                }}
              >
                {receiptNo.toUpperCase()}
              </span>
            </div>
            <p
              style={{
                fontSize: "22px",
                padding: 0,
                margin: 0,
              }}
            >
              Month:
              <span
                style={{
                  // position: "absolute",
                  bottom: "0px",
                  paddingLeft: 10,
                  margin: 0,
                  padding: 0,
                  fontSize: 16,
                  fontWeight: 700,
                }}
              >
                {getMonthName(date)}
              </span>
            </p>
            {/* <div
              style={{
                // borderBottom: "2px solid black",
                width: "150px",
                // marginBottom: "25px",
                position: "relative",
                padding: 0,
              }}
            >
              <p
                style={{
                  position: "absolute",
                  bottom: "0px",
                  paddingLeft: 10,
                  margin: 0,
                  fontSize: 16,
                }}
              >
                {date}
              </p>
            </div> */}
          </div>
          <div
            style={{
              display: "flex",
              // alignItems: "end",
              border: "black solid 1px",
              padding: "6px 12px",
              margin: 0,
              alignContent: "center",
              //   justifyContent: "right",
            }}
          >
            <p
              style={{
                fontSize: "20px",
                width: "30%",
                padding: 0,
                margin: 0,
              }}
            >
              Student Name:
            </p>
            <div
              style={{
                // position: "relative",
                width: "70%",
                padding: 0,
                margin: 0,
                paddingTop: 5,
              }}
            >
              <p
                style={{
                  // position: "absolute",
                  paddingLeft: 10,
                  fontSize: 16,
                  padding: 0,
                  margin: 0,
                  fontWeight: 700,
                }}
              >
                {studentName}
              </p>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              // alignItems: "center",
              border: "black solid 1px",
              padding: "6px 12px",
              margin: 0,
              //   justifyContent: "right",
            }}
          >
            <p
              style={{
                fontSize: "20px",
                width: "30%",
                padding: 0,
                margin: 0,
              }}
            >
              Parent Name:
            </p>
            <div
              style={{
                // borderBottom: "2px solid black",
                // marginBottom: "26px",
                position: "relative",
                padding: 0,
                margin: 0,
                width: "70%",
              }}
            >
              <p
                style={{
                  position: "absolute",
                  bottom: "0px",
                  // paddingLeft: 10,
                  margin: 0,
                  fontSize: 16,
                  padding: 0,
                  marginTop: -5,
                  fontWeight: 700,
                }}
              >
                {parentName}
              </p>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              padding: "6px 12px",
              margin: 0,
              border: "black solid 1px",
              alignItems: "center",
            }}
          >
            <p
              style={{
                fontSize: "20px",
                width: "30%",
                padding: 0,
                margin: 0,
              }}
            >
              Batch:
            </p>

            <p
              style={{
                // position: "absolute",
                // bottom: "0px",
                // paddingLeft: 10,
                fontSize: 16,
                padding: 5,
                margin: 0,
                width: "70%",
                fontWeight: 700,
              }}
            >
              {className}
            </p>
            {/* </div> */}
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "end",
              // marginTop: -20,
              border: "black solid 1px",
              padding: "6px 12px",
            }}
          >
            <p
              style={{
                fontSize: "20px",
                width: "35%",
              }}
            >
              {`Total Amount Paid{in words}:`}
            </p>
            <div
              style={{
                marginBottom: "26px",
                position: "relative",
                padding: 0,
                width: "65%",
              }}
            >
              <p
                style={{
                  // position: "absolute",
                  bottom: "0px",
                  paddingLeft: 10,
                  margin: 0,
                  fontSize: 16,
                  paddingTop: -15,
                  fontWeight: 700,
                }}
              >
                {`${numberToWords(totalPrice).toUpperCase()} RUPEES ONLY`}
              </p>
            </div>
          </div>
          <div
            style={{
              border: "black solid 1px",
              // marginTop: "15px",
            }}
          >
            <div
              style={{
                borderBottom: "1px solid black",
                display: "flex",
              }}
            >
              <span
                style={{
                  width: "70%",
                  padding: "10px 0px 10px 10px",
                  fontSize: "22px",
                  textDecoration: "italic",
                }}
              >
                INSTALLMENTS:
              </span>
              <span
                style={{
                  width: "30%",
                  borderLeft: "1px solid black",
                  padding: "10px 0px 10px 10px",
                  fontSize: "22px",
                }}
              >
                RUPEES
              </span>
            </div>
            {studentPaymentRecords.map((x, i) => {
              return (
                <>
                  <div
                    style={{
                      borderBottom: "1px solid black",
                      display: "flex",
                    }}
                  >
                    <span
                      style={{
                        width: "70%",
                        padding: "10px 0px 10px 10px",
                        fontSize: "18px",
                      }}
                    >{`Tution Fee - Installment ${i + 1}, paid on: ${formatDate(
                      new Date(x.createdAt)
                    )}`}</span>

                    <div
                      style={{
                        width: "30%",
                        display: "flex",
                        alignItems: "center",
                        borderLeft: "1px solid black",
                        padding: "10px 0px 10px 10px",
                        fontSize: "20px",
                      }}
                    >
                      <IconCurrencyRupee />
                      {x.pricePaid}
                    </div>
                  </div>
                </>
              );
            })}
            <div
              style={{
                display: "flex",
              }}
            >
              <span
                style={{
                  width: "70%",
                  padding: "10px 0px 10px 10px",
                  fontSize: "20px",
                  fontWeight: 700,
                }}
              >
                Total Amount Paid
              </span>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  borderLeft: "1px solid black",
                  width: "30%",
                  padding: "10px 0px 10px 10px",
                  fontSize: "20px",
                  fontWeight: 700,
                }}
              >
                <IconCurrencyRupee />
                {totalPrice}
              </div>
            </div>
          </div>

          {/* <div
            style={{
              display: "flex",
              justifyContent: "right",
              marginTop: "30px",
            }}
          >
            <p
              style={{
                fontSize: "22px",
              }}
            >
              Pending Amount:
            </p>
            <div
              style={{
                borderBottom: "2px solid black",
                width: "150px",
                marginBottom: "24px",
                position: "relative",
                padding: 0,
              }}
            >
              <p
                style={{
                  position: "absolute",
                  bottom: "0px",
                  paddingLeft: 10,
                  margin: 0,
                  fontSize: 22,
                  display: "flex",
                }}
              >
                <IconCurrencyRupee />
                {balance}
              </p>
            </div>
          </div> */}
          <div
            style={{
              display: "flex",
              justifyContent: "right",
              marginTop: "85px",
              flexDirection: "column",
              alignItems: "end",
            }}
          >
            <p
              style={{
                fontSize: "22px",
                paddingRight: "20px",
              }}
            >
              Authorized Signature
            </p>
          </div>
        </div>
      </body>
    </html>
  );
}

export function downloadreceipt(
  isLoading: boolean,
  setIsLoading: (val: boolean) => void,
  receiptNo: string,
  studentName: string,
  date: Date,
  parentName: string,
  totalPrice: number,
  studentFeeRecords: StudentFeeRecord[],
  balance: number,
  instituteId: string,
  className: string,
  isReactNativeActive: boolean,
  sendDataToReactnative: (commandType: number, values: any) => void
) {
  let name = "";
  let icon = "";
  let address = "";
  let secondPhoneNumber = "";
  let admin1 = null;
  setIsLoading(true);
  GetAllInfoForInstitute({
    id: instituteId,
  })
    .then((x: any) => {
      name = x.name;
      address = x.Address;
      icon = x.schoolIcon;
      secondPhoneNumber = x.secondInstituteNumber;
      admin1 = x.admins[0].name;
      if (admin1 === undefined && admin1 === null) {
        admin1 = x.teachers[0].name;
      }
      htmlToPdf({
        html: ReactDOMServer.renderToString(
          createReceiptPdf(
            receiptNo,
            studentName,
            date,
            parentName,
            totalPrice,
            studentFeeRecords,
            balance,
            name,
            address,
            icon,
            className,
            x.institutePhoneNumber,
            admin1,
            x.secondInstituteNumber
          )
        ),
        showBorder: true,
        showWaterMark: null,
      })
        .then((data2: any) => {
          var link = document.createElement("a");
          link.href = window.URL.createObjectURL(
            new Blob([data2], { type: "application/pdf" })
          );
          const newBlob = new Blob([data2], { type: "application/pdf" });
          var file = new File([newBlob], "name");
          link.download = `${"Receipt"}.pdf`;

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
    })
    .catch((e) => {
      setIsLoading(false);
      console.log(e);
    });
}
