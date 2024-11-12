import { Box, Stack, Text } from "@mantine/core";
import {
  QuestionParentType,
  QuestionType,
  findQuestionType,
} from "../../../@types/QuestionTypes.d";
import { useEffect } from "react";
import { DisplayHtmlText } from "../../../pages/_New/PersonalizedTestQuestions";

export function createNewSectionTypeHtmlFromTestData(
  test: FullTest,
  name: string,
  iconUrl: string,
  subHeading: string | null,
  banner: string | null,
  subscriptionModelType: string,
  showInstructions: boolean,
  comicSanFont: boolean,
  inlineContent: boolean,
  phoneNumber: string,
  secondPhoneNumber: string,
  address: string,
  isSolutions: boolean
) {
  const lettering = ["a", "b", "c", "d", "e"];
  const instructions = [];

  const myMap: Map<
    string,
    CaseBasedQuestion | McqQuestion | SubjectiveQuestion
  > = new Map();
  test.questions.map((x) => {
    myMap.set(x._id, x);
  });
  test.casebasedquestions.map((x) => {
    myMap.set(x._id, x);
  });
  test.subjectiveQuestions.map((x) => {
    myMap.set(x._id, x);
  });
  instructions.push(
    `The Test paper has ${test.maxQuestions} questions in total.`
  );
  instructions.push(`Marks are indicated against each question.`);
  let count = 0;
  for (let i = 0; i < test.sections.length; i++) {
    let section = test.sections[i];
    instructions.push(
      `Questions from ${i + 1 + count} to ${
        count + i + section.questions.length
      } are ${section.name} questions`
    );
    count += section.questions.length;
  }

  instructions.push(
    `Follow the specified procedure for submitting your answer sheets or online responses.`
  );
  return (
    <>
      <html>
        <head>
          <style>
            @import
            url('https://fonts.googleapis.com/css2?family=Nunito:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,300;1,400;1,600;1,800&display=swap');
          </style>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link
            rel="preconnect"
            href="https://fonts.gstatic.com"
            crossOrigin=""
          />
          {comicSanFont && (
            <>
              <link
                href="https://fonts.googleapis.com/css2?family=Comic+Neue:ital,wght@0,400;1,700&display=swap"
                rel="stylesheet"
              />

              <link
                href="https://fonts.googleapis.com/css2?family=Courgette&display=swap"
                rel="stylesheet"
              ></link>
            </>
          )}

          <script
            id="MathJax-script"
            defer
            src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-chtml.js"
          ></script>
        </head>
        <body
          style={{
            fontFamily: comicSanFont
              ? "Comic Neue, sans-serif"
              : "Nunito, sans-serif",
            whiteSpace: "pre-line",
          }}
        >
          {!inlineContent && (
            <>
              {subscriptionModelType === "PREMIUM" && banner !== null && (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "right",
                  }}
                >
                  <img width={200} src={banner}></img>
                </div>
              )}
              <p
                style={{
                  marginTop: 10,
                  fontWeight: 700,
                  fontSize: 30,
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {banner === null && <img width={60} src={iconUrl}></img>}
                <span
                  style={{
                    marginRight: 10,
                    marginLeft: 10,
                    borderBottom: "1px solid black",
                    marginBottom: 0,
                  }}
                >
                  {name.toUpperCase()}
                </span>
              </p>
              {subHeading !== null && (
                <p
                  style={{
                    fontSize: 16,
                    fontWeight: 400,
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    marginTop: -35,
                    color: "gray",
                  }}
                >
                  {subHeading}
                </p>
              )}
              {address !== null && address.length !== 0 && (
                <p
                  style={{
                    fontSize: "18px",
                    marginTop: "-8px",
                    textAlign: "center",
                    fontWeight: 600,
                    color: "black",
                  }}
                >
                  {address.toUpperCase()}
                </p>
              )}
              {phoneNumber !== null && phoneNumber.length !== 0 && (
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
              )}
              {/* {subscriptionModelType !== "PREMIUM" && (
              <p
                style={{
                  fontSize: 16,
                  fontWeight: 400,
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: -25,
                  color: "blue",
                }}
              >
                Contact us at: www.vignam.in
              </p>
            )} */}

              <p
                style={{
                  fontSize: 22,
                  fontWeight: 700,
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  margin: "5px 0px",
                }}
              >
                {test.name.toUpperCase()}
              </p>
            </>
          )}
          {inlineContent && (
            <div
              style={{
                marginTop: "-17px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <p
                    style={{
                      fontSize: 25,
                      fontWeight: 800,
                      borderBottom: "2px solid black",
                    }}
                  >
                    {name.toUpperCase()}
                  </p>
                  {subHeading !== null && (
                    <span
                      style={{
                        marginTop: "-20px",
                        fontSize: 20,
                        fontFamily: "Courgette, cursive",
                      }}
                    >
                      {subHeading}
                    </span>
                  )}
                </div>

                <p
                  style={{
                    fontSize: 16,
                    fontWeight: 600,
                  }}
                >
                  {test.name.toUpperCase()}
                </p>
              </div>
              <div
                style={{
                  background: "black",
                  height: "1px",
                  width: "100%",
                  margin: "10px 0px",
                }}
              ></div>
            </div>
          )}
          {showInstructions && (
            <Stack
              style={{
                border: "#4B65F6 solid 2px",
                borderRadius: "12px",
                padding: "10px",
              }}
              px={20}
              pb={10}
              pt={15}
              mt={20}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                }}
              >
                <Text
                  style={{
                    width: "50%",
                    fontSize: 21,
                    fontWeight: 700,
                  }}
                >
                  General Instructions:
                </Text>
                <Text
                  style={{
                    width: "50%",
                    fontSize: 21,
                    fontWeight: 700,
                    textAlign: "right",
                  }}
                >
                  Maximum Marks:{test.maxMarks}
                </Text>
              </div>
              <Stack
                style={{
                  marginTop: "8px",
                  paddingLeft: "2px",
                }}
              >
                {instructions.map((x, i) => {
                  return (
                    <Text
                      style={{
                        fontFamily: "Nunito",
                        fontWeight: 400,
                        fontSize: 18,
                        margin: "3px 0px",
                      }}
                    >
                      {i + 1}. {x}
                    </Text>
                  );
                })}
              </Stack>
            </Stack>
          )}
          {!showInstructions && (
            <Text
              style={{
                width: "100%",
                fontSize: 21,
                fontWeight: 700,
                textAlign: "right",
                marginBottom: "-20px",
              }}
            >
              Maximum Marks:{test.maxMarks}
            </Text>
          )}

          <Box
            style={{
              marginLeft: 20,
              marginRight: 30,
              marginTop: inlineContent ? 20 : 50,
            }}
          >
            {test.sections.map((x, i) => {
              return (
                <Stack>
                  <Text
                    style={{
                      textAlign: "center",
                      marginBottom: 30,
                      fontSize: 22,
                      fontWeight: 700,
                    }}
                  >
                    {x.name}
                  </Text>
                  {x.questions.map((y, index) => {
                    const question: any = myMap.get(y);
                    switch (findQuestionType(question.type).parentType) {
                      case QuestionParentType.MCQQ:
                        return (
                          <div
                            style={{
                              display: "flex",
                              margin: "10px 0px",
                            }}
                          >
                            <Box
                              style={{
                                marginBottom: 20,
                                width: "95%",
                              }}
                            >
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "start",
                                  flexWrap: "wrap",
                                  // border:"red solid 1px"
                                }}
                              >
                                <span
                                  style={
                                    {
                                      //  border:"red solid 1px"
                                    }
                                  }
                                >
                                  {index + 1 + i}.
                                </span>
                                <DisplayHtmlText text={question.text} />
                              </div>

                              <div
                                style={{
                                  display: "flex",
                                  flexWrap: "wrap",
                                  justifyContent: "space-between",
                                }}
                              >
                                {question.answers.map(
                                  (answer: any, index: number) => (
                                    <div
                                      key={index}
                                      style={{
                                        margin: "5px 0px",
                                        display: "flex",
                                        flexWrap: "wrap",
                                      }}
                                    >
                                      <div
                                        style={{
                                          marginLeft: 10,
                                          display: "flex",
                                        }}
                                      >
                                        <span>
                                          {lettering[index]}
                                          {") "}
                                        </span>
                                        <DisplayHtmlText text={answer.text} />
                                      </div>
                                    </div>
                                  )
                                )}
                              </div>
                              <div>
                                {isSolutions && (
                                  <div
                                    style={{
                                      display: "flex",
                                      flexWrap: "wrap",
                                    }}
                                  >
                                    <p
                                      style={{
                                        margin: 0,
                                        padding: 0,
                                      }}
                                    >
                                      Answer:
                                    </p>
                                    <DisplayHtmlText
                                      text={
                                        question.answers.find((x: any) => {
                                          return x.isCorrect === true;
                                        }).text
                                      }
                                    />
                                  </div>
                                )}
                              </div>
                            </Box>
                            <p
                              style={{
                                width: "5%",
                                marginTop: 0,
                              }}
                            >
                              {question.totalMarks.toFixed(2)}
                            </p>
                          </div>
                        );
                      case QuestionParentType.SUBQ:
                        return (
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              marginBottom: 20,
                              gap: 0,
                            }}
                          >
                            <div
                              style={{
                                display: "flex",
                              }}
                            >
                              <Box
                                style={{
                                  marginBottom: 20,
                                  width: "95%",
                                  display: "flex",
                                }}
                              >
                                <div
                                  style={{
                                    display: "flex",
                                  }}
                                >
                                  <span>{index + 1 + i}.</span>
                                  <DisplayHtmlText text={question.text} />
                                </div>
                              </Box>
                              <p
                                style={{
                                  width: "5%",
                                  marginTop: 0,
                                }}
                              >
                                {question.totalMarks.toFixed(2)}
                              </p>
                            </div>
                            <div
                              style={{
                                marginTop: -20,
                              }}
                            >
                              {isSolutions && (
                                <div
                                  style={{
                                    display: "flex",
                                    flexWrap: "wrap",
                                  }}
                                >
                                  <p
                                    style={{
                                      margin: 0,
                                      padding: 0,
                                    }}
                                  >
                                    Answer:
                                  </p>
                                  <DisplayHtmlText text={question.answer} />
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      case QuestionParentType.CASEQ:
                        return (
                          <>
                            <div
                              style={{
                                display: "flex",
                              }}
                            >
                              <Box
                                style={{
                                  marginBottom: 20,
                                  width: "95%",
                                }}
                              >
                                <div
                                  style={{
                                    display: "flex",
                                  }}
                                >
                                  <span>{index + 1 + i}.</span>
                                  <DisplayHtmlText
                                    text={question.caseStudyText}
                                  />
                                </div>

                                {question.questions.map(
                                  (question1: any, i: any) => {
                                    return (
                                      <div
                                        style={{
                                          display: "flex",
                                          flexDirection: "column",
                                          marginBottom: 20,
                                          gap: 0,
                                        }}
                                      >
                                        <div
                                          style={{
                                            display: "flex",
                                            margin: "10px 0px",
                                          }}
                                        >
                                          <Box
                                            style={{
                                              marginBottom: 20,
                                              width: "95%",
                                            }}
                                          >
                                            {question1.questionImageUrl && (
                                              <img
                                                src={question1.questionImageUrl}
                                                width={"25%"}
                                              ></img>
                                            )}
                                            <div
                                              style={{
                                                display: "flex",
                                              }}
                                            >
                                              <span>{i + 1}.</span>
                                              <DisplayHtmlText
                                                text={question1.text}
                                              />
                                            </div>
                                            <div
                                              style={{
                                                display: "flex",
                                                flexWrap: "wrap",
                                                justifyContent: "space-between",
                                              }}
                                            >
                                              {question1.answers.map(
                                                (
                                                  answer: any,
                                                  index: number
                                                ) => {
                                                  return (
                                                    <div
                                                      key={index}
                                                      style={{
                                                        margin: "5px 0px",
                                                        display: "flex",
                                                        flexWrap: "wrap",
                                                      }}
                                                    >
                                                      <div
                                                        style={{
                                                          marginLeft: 10,
                                                          display: "flex",
                                                        }}
                                                      >
                                                        <span>
                                                          {" "}
                                                          {lettering[index]}.
                                                          {") "}
                                                        </span>
                                                        <DisplayHtmlText
                                                          text={answer.text}
                                                        />
                                                      </div>
                                                    </div>
                                                  );
                                                }
                                              )}
                                            </div>
                                          </Box>
                                        </div>
                                        {isSolutions && (
                                          <div
                                            style={{
                                              display: "flex",
                                              flexWrap: "wrap",
                                              marginTop: -20,
                                            }}
                                          >
                                            <p
                                              style={{
                                                margin: 0,
                                                padding: 0,
                                              }}
                                            >
                                              Answer:
                                            </p>
                                            <DisplayHtmlText
                                              text={
                                                question1.answers.find(
                                                  (x: any) => {
                                                    return x.isCorrect === true;
                                                  }
                                                ).text
                                              }
                                            />
                                          </div>
                                        )}
                                      </div>
                                    );
                                  }
                                )}
                              </Box>
                              <p
                                style={{
                                  width: "5%",
                                  marginTop: 0,
                                }}
                              >
                                {question.totalMarks.toFixed(2)}
                              </p>
                            </div>
                          </>
                        );
                    }
                  })}
                </Stack>
              );
            })}
          </Box>
        </body>
      </html>
    </>
  );
}
