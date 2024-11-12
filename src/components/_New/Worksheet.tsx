import {
  Box,
  Button,
  Center,
  Flex,
  Group,
  LoadingOverlay,
  Modal,
  Stack,
  Text,
} from "@mantine/core";
import { FileUploadAndViewCard } from "./FileUplaodCard";
import { useSelector } from "react-redux";
import { RootState } from "../../store/ReduxStore";
import { fetchTestChapterQuestions } from "../../features/UserSubject/chapterDataSlice";
import { getRandomElementsFromArray } from "../../utilities/HelperFunctions";
import { Document, Page, View, PDFDownloadLink } from "@react-pdf/renderer";
import { Fragment, useEffect, useState } from "react";
import { Tabs } from "../../pages/_New/Teach";
import { useMediaQuery } from "@mantine/hooks";
import { IconDownlaod } from "../_Icons/CustonIcons";
import { GetUser } from "../../utilities/LocalstorageUtility";
import { GetAllInfoForInstitute } from "../../_parentsApp/features/instituteSlice";
import { htmlToPdf } from "../../features/htmlToPDf/htmlToPDf";
import ReactDOMServer from "react-dom/server";
import { PdfViewer } from "./FileUploadBox";

function createHtmlFromTestData(
  institueName: string,
  chapterName: string,
  instituteLogo: string,
  subjectiveQuestions: SubjectiveQuestion[],
  mcqQuestions: McqQuestion[]
) {
  const lettering = ["a", "b", "c", "d"];

  return (
    <>
      <html>
        <head>
          <style>
            @import
            url('https://fonts.googleapis.com/css2?family=Poppins&display=swap');
          </style>
        </head>
        <body style={{ fontFamily: "Poppins, sans-serif" }}>
          <Stack>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <img style={{ width: 25 }} src={instituteLogo} />
              <Text
                style={{
                  fontWeight: 600,
                }}
              >
                {institueName}
              </Text>
            </div>
            <Text
              style={{
                fontWeight: "bold",
                fontSize: 20,
                textAlign: "center",
                margin: "20px 0",
              }}
            >
              {chapterName}
              {"\n"}
              Worksheet
            </Text>
            {mcqQuestions.map((question: any, index: number) => {
              return (
                <Fragment key={index}>
                  <div style={{ marginBottom: 10 }}>
                    <Text
                      style={{
                        margin: 5,
                      }}
                    >
                      {index + 1}.{question.text}
                    </Text>
                    {question.questionImageUrl &&
                      question.questionImageUrl !== "" && (
                        <img
                          style={{ width: 200 }}
                          src={
                            question.questionImageUrl
                              ? question.questionImageUrl
                              : ""
                          }
                        />
                      )}
                    {question.answers.map((x: any, index: number) => {
                      return (
                        <Fragment key={index}>
                          <Text
                            style={{
                              marginLeft: 10,
                            }}
                          >
                            {String.fromCharCode(65 + index).toLowerCase()}.{" "}
                            {x.text}
                          </Text>
                          {question.answerImageUrl?.length > 0 &&
                            question.answerImageUrl[index] !== "" && (
                              <>
                                <img
                                  style={{ width: 100 }}
                                  src={
                                    question.answerImageUrl
                                      ? question.answerImageUrl[index]
                                      : ""
                                  }
                                ></img>
                              </>
                            )}
                        </Fragment>
                      );
                    })}
                  </div>
                </Fragment>
              );
            })}
            {subjectiveQuestions.map((x: any, index: number) => {
              return (
                <Fragment key={index}>
                  <Text
                    style={{
                      margin: 5,
                      marginBottom: 10,
                    }}
                  >
                    {index + 1 + mcqQuestions.length}.{x.text}
                  </Text>
                  {x.questionImageUrl && x.questionImageUrl !== "" && (
                    <img
                      src={x.questionImageUrl ? x.questionImageUrl : ""}
                    ></img>
                  )}
                </Fragment>
              );
            })}
          </Stack>
        </body>
      </html>
    </>
  );
}
//render
// function GeneratedPdf(props: {
//   subjectiveQuestions: SubjectiveQuestion[];
//   mcqQuestions: McqQuestion[];
//   chapterName: string;
// }) {
//   const [instituteName, setinstituteName] = useState<string>("");
//   const [instituteLogo, setinstituteLogo] = useState<string>("");
//   useEffect(() => {
//     const user = GetUser();
//     GetAllInfoForInstitute({ id: user.instituteId })
//       .then((x: any) => {
//         setinstituteName(x.name);
//         setinstituteLogo(x.schoolIcon);
//       })
//       .catch((e) => {
//         console.log(e);
//       });
//   }, []);
//   return (
//     // <>

//     // <PDFViewer style={{ height: "80vh", width: "70vw" }}>
//     <Document>
//       <Page size="A4" style={{ color: "black", padding: 50 }}>
//         <View fixed style={{ position: "absolute", right: 10, top: 10 }}>
//           <Text>
//             {instituteName}
//             <Image style={{ width: 25 }} src={instituteLogo} />
//           </Text>
//         </View>
//         <View
//           style={{
//             fontSize: 15,
//           }}
//         >
//           <Text
//             style={{
//               fontWeight: "bold",
//               fontSize: 20,
//               textAlign: "center",
//             }}
//           >
//             {props.chapterName}
//             {"\n"}
//             Worksheet
//           </Text>
//         </View>
//       </Page>
//     </Document>
//     //   </PDFViewer>
//     //   ;
//     // </>
//   );
// }

export function Worksheet(props: {
  files: { fileName: string; url: string }[] | undefined;
  OnFileDrop: (name: string, url: string) => void;
  tab: Tabs;
}) {
  const currentChapter = useSelector<RootState, SingleChapter>((state) => {
    return state.chapterSlice.currentChapter;
  });
  const currentSubject = useSelector<RootState, SingleSubject>((state) => {
    return state.subjectSlice.currentSubject;
  });
  const [viewGeneratedPdf, setViewGeneratedPdf] = useState<boolean>(false);
  //const [viewGeneratedPdf, setViewGeneratedPdf] = useState<boolean>(false);
  const [mcqQuestions, setMCQQuestions] = useState<McqQuestion[] | null>([]);
  const [subjectiveQuestions, setSubjectiveQuestions] = useState<
    SubjectiveQuestion[] | null
  >(null);
  const isMd = useMediaQuery(`(max-width: 800px)`);
  const [isLoading, setIsloading] = useState<boolean>(false);
  const [modalOpened, setmodalOpened] = useState<boolean>(false);
  const [downloadModel, setDownloadModel] = useState<boolean>(false);
  const [instituteName, setinstituteName] = useState<string>("");
  const [instituteLogo, setinstituteLogo] = useState<string>("");
  const [pdfLink, setPdfLink] = useState<any>(null);
  useEffect(() => {
    const user = GetUser();
    GetAllInfoForInstitute({ id: user.instituteId })
      .then((x: any) => {
        setinstituteName(x.name);
        setinstituteLogo(x.schoolIcon);
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);
  useEffect(() => {
    setViewGeneratedPdf(false);
    generateWorksheet(1);
  }, [currentChapter]);

  useEffect(() => {
    if (subjectiveQuestions && mcqQuestions)
      htmlToPdf({
        html: ReactDOMServer.renderToString(
          createHtmlFromTestData(
            instituteName,
            currentChapter.name,
            instituteLogo,
            subjectiveQuestions ?? [],
            mcqQuestions ?? []
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

          // link.download = `${"worksheet"}.pdf`;
          // link.click();
          // link.remove();
          setPdfLink(link.href);
          setIsloading(false);
        })
        .catch((error) => {
          console.log(error);
          setIsloading(false);
          console.error("Error:", error);
        });
  }, [subjectiveQuestions, mcqQuestions]);
  function generateWorksheet(type: number) {
    setIsloading(true);
    fetchTestChapterQuestions(currentChapter._id)
      .then((data: any) => {
        setIsloading(false);
        const questions = data;
        if (type === 1) {
          const pickedQuestions: any = getRandomElementsFromArray(
            questions?.mcqQuestions,
            5
          );
          setMCQQuestions(pickedQuestions);
          const filterequestions = questions?.subjectiveQuestions.filter(
            (x: any) => x.type === "FILL"
          );
          const fib2: any = getRandomElementsFromArray(filterequestions, 5);
          setSubjectiveQuestions(fib2);
        } else if (type === 2) {
          const filterequestions = questions?.subjectiveQuestions.filter(
            (x: any) => x.type === "SHORT" || x.type === "LONG"
          );
          const shuffledque: any = getRandomElementsFromArray(
            filterequestions,
            10
          );
          setSubjectiveQuestions(shuffledque);
          setMCQQuestions([]);
        }
        setViewGeneratedPdf(true);
      })
      .catch((err) => {
        setIsloading(false);
        console.log(err);
      });
  }
  return (
    <>
      <Modal
        onClose={() => setmodalOpened(false)}
        opened={modalOpened}
        centered
      >
        <Stack>
          <Button
            onClick={() => {
              setmodalOpened(false);
              if (isMd) setDownloadModel(true);
              generateWorksheet(2);
            }}
          >
            Subjective
          </Button>

          <Button
            onClick={() => {
              setmodalOpened(false);
              if (isMd) setDownloadModel(true);
              generateWorksheet(1);
            }}
          >
            Objective
          </Button>
        </Stack>
      </Modal>
      <Modal
        title="Your worksheet is ready!"
        opened={downloadModel}
        onClose={() => {
          setDownloadModel(false);
        }}
        centered
        size="md"
        styles={{
          title: {
            color: "#000",
            fontSize: 18,
            fontWeight: 500,
          },
        }}
      >
        <Stack align="center" justify="center">
          <img
            src={require("../../assets/worksheet.png")}
            height="176px"
            width="150px"
            // style={{
            //   aspectRatio:0.85
            // }}
          />
          <PDFDownloadLink
            document={pdfLink}
            fileName="Worksheet.pdf"
            style={{
              textDecoration: "none",
            }}
          >
            {({ blob, url, loading, error }) =>
              loading ? (
                <Text>Loading Document...</Text>
              ) : (
                <Group position="center">
                  <Button
                    leftIcon={<IconDownlaod />}
                    bg="#3174F3"
                    size="md"
                    style={{
                      fontSize: 16,
                      fontWeight: 500,
                    }}
                  >
                    Download Worksheet
                  </Button>
                </Group>
              )
            }
          </PDFDownloadLink>
        </Stack>
        <LoadingOverlay visible={isLoading}>
          <h2>Your Worksheet is on the way</h2>
          <div
            style={{
              minHeight: "200px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <h2>Your Worksheet is on the way</h2>
          </div>
        </LoadingOverlay>
      </Modal>
      {/* <LoadingOverlay visible={isLoading} /> */}
      <Button
        variant="outline"
        onClick={() => {
          setmodalOpened(true);
        }}
        mb={20}
        mx={20}
      >
        Generate New Worksheet
      </Button>
      <FileUploadAndViewCard
        files={props.files}
        OnFileDrop={props.OnFileDrop}
        notshowImage={true}
        tab={props.tab}
      />
      {/* <Center mt={60}> */}
      {/* <Stack> */}
      {pdfLink && (
        <Box
          w="100%"
          h="100%"
          // style={{
          //   border: "red solid 1px",
          // }}
        >
          <PdfViewer url={pdfLink} 
          showOptions={true}
          />
        </Box>
      )}
      {/* </Stack> */}
      {/* </Center> */}
    </>
  );
}
