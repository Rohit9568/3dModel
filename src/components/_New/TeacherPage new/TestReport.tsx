import {
  Box,
  Center,
  Divider,
  Flex,
  Image,
  Progress,
  RingProgress,
  Stack,
  Text,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { IconClock } from "../../_Icons/CustonIcons";
import { formatTime } from "../../../utilities/HelperFunctions";
import { lazy, useEffect, useState } from "react";
import {
  findQuestionType,
  QuestionParentType,
} from "../../../@types/QuestionTypes.d";
import {
  MCQReportQuestionCard,
  SubjectiveQuestionCard,
} from "./ReportQuestionCards";
import { PdfViewer } from "../FileUploadBox";
import { useSelector } from "react-redux";
import { RootState } from "../../../store/ReduxStore";
import SubjectTable from "./SubjectTable";
import {
  getAllBookmarkedQuestions,
  getComparativeAnalysisData,
} from "../../../features/test/TestSlice";
import { InfoCard } from "./TeacherSideReports";
import { DisplayHtmlText } from "../../../pages/_New/PersonalizedTestQuestions";
import React from "react";

const ReportCharts = lazy(() => import('./ReportCharts'));


export function TestReport(props: {
  testReport: TestReport;
  avgTestReport: TestReport;
  test: FullTest;
  superSections: {
    name: string;
    sections: any[]; // checkout sections what contans it?
  }[];
  totalNumberOfStudents: number;
  isSingleReport: boolean;
  isTestwithOnlyMarks: boolean;
  userType: string;
  answerSheet: any;
  testId?: string;
}) {
  const isMd = useMediaQuery("(max-width: 820px)");
  const studentId: string =
    useSelector((state: RootState) => state?.studentSlice?.student?._id) || "";
  const [isCollapse, setIsCollapse] = useState<boolean>(false);
  const [bookmarkedQuestionIds, setBookmarkedQuestionIds] = useState<string[]>(
    []
  );
  const [bmqueIds, setBmqueIds] = useState<any[]>([]);

  const [comparativeAnalysisData, setComparativeAnalysisData] =
    useState<TestComparativeAnalysis>();

  const [subjectTableData, setSubjectTableData] =
    useState<SectionWiseTestAnalysisData[]>();
  const [isCollapseMap, setIsCollapseMap] = useState<Map<string, boolean>>(
    new Map()
  );

  useEffect(() => {
    setTimeout(() => {
      if (typeof window?.MathJax !== "undefined") {
        window.MathJax.typesetClear();
        window.MathJax.typeset();
      }
    }, 500);
  }, [props.superSections]);

  useEffect(() => {
    const newMap = new Map();
    props.superSections.forEach((superSection) => {
      superSection.sections.forEach((section) => {
        newMap.set(section._id, false);
      });
    });
    setIsCollapseMap(newMap);

    getAllBookmarkedQuestions({
      studentId: studentId,
      testId: props.testId || "",
    })
      .then((resp: any) => {
        setBookmarkedQuestionIds(
          resp.map((x: any) => {
            if (x.question === null) {
              return "";
            } else {
              return x.question._id;
            }
          })
        );
        setBmqueIds(resp);
      })
      .catch((e) => {
        console.log(e);
      });
    if (props.testReport) {
      getComparativeAnalysisData({
        studentId: studentId,
        testId: props.testId!!,
      })
        .then((data: any) => {
          setComparativeAnalysisData(data);
          //in out backend super section is section (for teachers lingo)
          const sectionWiseAnalysisData =
            props.testReport.superSectionWiseDetails?.map(
              (superSectionWiseDetails) => {
                const sectionWiseAnalysisData: SectionWiseTestAnalysisData = {
                  sectionName: superSectionWiseDetails.name,
                  marks: superSectionWiseDetails.marksObtained,
                  totalMarks: 0,
                  tableData: [],
                };
                const tableData: QuestionWiseTableData[] = [];
                let totalMarks = 0;
                superSectionWiseDetails.sectionIds.forEach(
                  (sectionId: string) => {
                    props.testReport.sectionWiseDetails
                      ?.find((sectionDetailsObj) => {
                        return sectionDetailsObj._id == sectionId;
                      })!!
                      .questions.forEach((questionDetailsObj, index) => {
                        totalMarks += findQuestionMarksWithQuestionId(
                          questionDetailsObj.question_id
                        );
                        if (props.answerSheet != null) {
                          tableData.push({
                            id: index,
                            color:
                              questionDetailsObj.marksObtained > 0
                                ? "green"
                                : "red",
                            topic:
                              findQuestionAnswerSheetQuestion(
                                questionDetailsObj.question_id
                              )?.chapterName ?? "Mixed Topics",
                            score: questionDetailsObj.marksObtained,
                            percentage:
                              (
                                data as TestComparativeAnalysis
                              )?.questionWiseAnalysisMap.find((qwMap) => {
                                return (
                                  qwMap.questionId ==
                                  questionDetailsObj.question_id
                                );
                              })?.correctPercentage ?? 0,
                            attemptOrder:
                              findQuestionAnswerSheetQuestion(
                                questionDetailsObj.question_id
                              )?.attemptOrder ?? 0,
                          });
                        }
                      });
                  }
                );
                sectionWiseAnalysisData.tableData = tableData;
                sectionWiseAnalysisData.totalMarks = totalMarks;
                return sectionWiseAnalysisData;
              }
            );
          setSubjectTableData(sectionWiseAnalysisData);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [props.testReport, props.answerSheet]);

  const handleOnClickISCollapse = (id: string) => {
    setIsCollapseMap((prevMap) => {
      const newMap = new Map(prevMap);
      if (newMap.has(id)) {
        newMap.set(id, !newMap.get(id));
      }
      return newMap;
    });
  };

  function findQuestionMarksWithQuestionId(questionId: string): number {
    let questionParentType: QuestionParentType =
      props.test.casebasedquestions.findIndex((q) => {
        return (
          q.questions.findIndex((iq) => {
            return iq._id == questionId;
          }) != -1
        );
      }) != -1
        ? QuestionParentType.CASEQ
        : props.test.subjectiveQuestions.findIndex((q) => {
            return q._id == questionId;
          }) != -1
        ? QuestionParentType.SUBQ
        : QuestionParentType.MCQQ;

    if (questionParentType == QuestionParentType.MCQQ) {
      return (
        props.test.questions.find((q) => {
          return q._id == questionId;
        })?.totalMarks ?? 0
      );
    } else if (questionParentType == QuestionParentType.SUBQ) {
      return (
        props.test.subjectiveQuestions.find((q) => {
          return q._id == questionId;
        })?.totalMarks ?? 0
      );
    } else {
      return (
        props.test.casebasedquestions
          .find((q) => {
            return (
              q.questions.findIndex((iq) => {
                return iq._id == questionId;
              }) != -1
            );
          })
          ?.questions.find((iq) => {
            return iq._id == questionId;
          })?.totalMarks ?? 0
      );
    }
  }

  function findQuestionAnswerSheetQuestion(questionId: string): any {
    if (props.answerSheet == null) return null;
    let questionParentType: QuestionParentType =
      props.test.casebasedquestions.findIndex((q) => {
        return (
          q.questions.findIndex((iq) => {
            return iq._id == questionId;
          }) != -1
        );
      }) != -1
        ? QuestionParentType.CASEQ
        : props.test.subjectiveQuestions.findIndex((q) => {
            return q._id == questionId;
          }) != -1
        ? QuestionParentType.SUBQ
        : QuestionParentType.MCQQ;

    if (questionParentType == QuestionParentType.MCQQ) {
      return props.answerSheet.mcqAnswers.find((q: any) => {
        return q.question_id == questionId;
      });
    } else if (questionParentType == QuestionParentType.SUBQ) {
      return props.answerSheet.subjectiveAnswers.find((q: any) => {
        return q.question_id == questionId;
      });
    } else {
      return props.answerSheet.caseStudyAnswers.find((q: any) => {
        return q.question_id == questionId;
      });
    }
  }

  return (
    <>
      {!props.isTestwithOnlyMarks && (
        <Stack w="100%" pb={150}>
          {props.userType == "student" && comparativeAnalysisData != null && (
            <Flex
              w="100%"
              justify="space-between"
              align="center"
              mt={20}
              mb={20}
              direction={isMd ? "column" : "row"}
              wrap="wrap"
            >
              <Box w={isMd ? "100%" : "48%"}>
                <InfoCard
                  label="Your Percentile"
                  value={comparativeAnalysisData!!.studentPercentile.toFixed(2)}
                  img={require("../../../assets/percentileIcon.png")}
                />
              </Box>
              <Box w={isMd ? "100%" : "48%"}>
                <InfoCard
                  label="Your Rank"
                  value={comparativeAnalysisData!!.studentRank}
                  img={require("../../../assets/rankIcon.png")}
                />
              </Box>
              {props.testReport.accuracy != null && (
                <Box w={isMd ? "100%" : "48%"}>
                  <InfoCard
                    label="Accuracy"
                    value={props.testReport.accuracy!!.toFixed(2) + "%"}
                    img={require("../../../assets/accuracyIcon.png")}
                  />
                </Box>
              )}
            </Flex>
          )}
          <Flex
            justify="space-between"
            direction={isMd ? "column" : "row"}
            gap={isMd ? 25 : 0}
          >
            <Stack
              style={{
                boxShadow: "0px 0px 4px 0px #00000040",
                borderRadius: "10px",
              }}
              w={isMd ? "100%" : "48%"}
            >
              {!props.isSingleReport && (
                <Stack spacing={1} ml={isMd ? 15 : 30} mt={10}>
                  <Text fz={16} fw={700}>
                    Average Score
                  </Text>
                  <Text color="#AFAFAF" fz={12} fw={500}>
                    See how well your students did to know how ready they are!
                  </Text>
                </Stack>
              )}
              {props.isSingleReport && (
                <Stack spacing={1} ml={isMd ? 15 : 30} mt={10}>
                  <Text fz={16} fw={700}>
                    Your Score
                  </Text>
                  <Text color="#AFAFAF" fz={12} fw={500}>
                    See how well you have performed in the test!
                  </Text>
                </Stack>
              )}
              <Divider color="#E5E7ED" size="md" />
              <Flex>
                <Flex w="50%" justify="center" align="center">
                  <RingProgress
                    size={isMd ? 120 : 120}
                    rootColor="#3174F34D"
                    thickness={isMd ? 10 : 12}
                    sections={[
                      {
                        value:
                          ((props.testReport.totalMarks < 0
                            ? 0
                            : props.testReport.totalMarks) /
                            props.testReport.maxMarks) *
                          100,
                        color: "#4b65f6",
                      },
                    ]}
                    label={
                      <>
                        <Center>
                          <Stack spacing={0} justify="center" align="center">
                            <Text fz={isMd ? 12 : 14}>Marks</Text>
                            <Text fz={isMd ? 10 : 12} fw={700}>
                              {`${
                                props.testReport.totalMarks
                                  ? props.testReport.totalMarks.toFixed(2)
                                  : 0
                              } /
                            ${props.testReport.maxMarks ?? 1}`}
                            </Text>
                          </Stack>
                        </Center>
                      </>
                    }
                  />
                </Flex>
                <Stack
                  w="50%"
                  justify="center"
                  spacing={5}
                  py={30}
                  align="justify"
                >
                  <Text fz={14} fw={400}>
                    Maximum Marks:
                    {props.testReport.maxMarks}
                  </Text>
                  <Text fz={14} fw={400}>
                    Total Average Score Achieved:
                    {props.testReport.totalMarks
                      ? props.testReport.totalMarks.toFixed(2)
                      : 0}
                  </Text>
                </Stack>
              </Flex>
              <Stack spacing={1} mb={30} mx={30}>
                <Flex justify="space-between">
                  <Text mb={6} fw={700}>
                    Percentage
                  </Text>
                  <Text fw={700}>
                    {`${(
                      ((props.testReport.totalMarks ?? 0) /
                        (props.testReport.maxMarks ?? 1)) *
                      100
                    ).toFixed(2)}%`}
                  </Text>
                </Flex>
                <Progress
                  size={16}
                  w={"100%"}
                  value={
                    ((props.testReport.totalMarks <= 0
                      ? 0
                      : props.testReport.totalMarks) /
                      (props.testReport.maxMarks ?? 1)) *
                    100
                  }
                  color="#4b65f6"
                />
              </Stack>
            </Stack>
            <Stack
              style={{
                boxShadow: "0px 0px 4px 0px #00000040",
                borderRadius: "10px",
              }}
              h="100%"
              spacing={1}
              w={isMd ? "100%" : "48%"}
            >
              {!props.isSingleReport && (
                <Stack spacing={1} ml={isMd ? 15 : 30} mt={10}>
                  <Text fz={16} fw={700}>
                    Average Time Taken
                  </Text>
                  <Text color="#AFAFAF" fz={12} fw={500}>
                    See how long your students take to complete this test!
                  </Text>
                </Stack>
              )}
              {props.isSingleReport && (
                <Stack spacing={1} ml={isMd ? 15 : 30} mt={10}>
                  <Text fz={16} fw={700}>
                    Time Taken
                  </Text>
                  <Text color="#AFAFAF" fz={12} fw={500}>
                    See How long you have taken to complete the test!
                  </Text>
                </Stack>
              )}
              <Divider color="#E5E7ED" size="md" mt={13} />
              <Center w="100%" h="100%">
                <RingProgress
                  size={isMd ? 200 : 200}
                  rootColor="#3174F34D"
                  thickness={isMd ? 10 : 12}
                  sections={[
                    {
                      value:
                        (props.testReport.totalTimeTaken /
                          props.testReport.maxDuration) *
                        100,
                      color: "#4b65f6",
                    },
                  ]}
                  label={
                    <>
                      <Stack
                        align="center"
                        justify="center"
                        py={isMd ? 20 : 0}
                        h="100%"
                      >
                        <IconClock />
                        <Stack spacing={1} justify="center" align="center">
                          <Text fw={600} fz={24}>
                            {formatTime(props.testReport.totalTimeTaken * 1000)}
                          </Text>
                          <Text color="#7E7E7E" fz={18} fw={500} ta="center">
                            Time
                          </Text>
                        </Stack>
                      </Stack>
                    </>
                  }
                />
              </Center>
            </Stack>
          </Flex>
          {/* to be implemented later
          <Stack
            sx={{
              boxShadow: "0px 0px 4px 0px #00000040",
              borderRadius: "10px",
              height: "100%",
              padding: "15px",
            }}
            w={"100%"}
          >
            <Text td="left" fz={19} fw={700}>
              Strong & Weak topics
            </Text>
            <Flex justify={"space-between"}>
              <Text td="left" fz={40} fw={700}>
                5
              </Text>
              <Image
                src={require("../../../assets/Dizziness.png")}
                width={40}
              />
            </Flex>
            <Flex justify={"space-between"}>
              <Text sx={{ color: "#E5E7ED" }} fz={16} fw={500}>
                Topic
              </Text>
              <Text sx={{ color: "#E5E7ED" }} fz={16} fw={500}>
                Strength
              </Text>
            </Flex>
            {strongAndWeakData &&
              strongAndWeakData.map((item, i) => (
                <>
                  <Divider color="#E5E7ED" size={2} />
                  <Flex justify={"space-between"}>
                    <Text fz={14} fw={400}>
                      {item.text}
                    </Text>
                    <Text fz={14} fw={500}>
                      {item.value}
                    </Text>
                  </Flex>
                </>
              ))}
          </Stack>
          */}
          <Stack>
            <Text fz={19} fw={700}>
              Average Section Wise Score
            </Text>
            <Stack>
              {subjectTableData &&
                subjectTableData.length > 0 &&
                subjectTableData.map((item, i) => (
                  <SubjectTable
                    key={i}
                    section={item.sectionName}
                    marks={item.marks}
                    totalMarks={item.totalMarks}
                    data={item.tableData}
                  />
                ))}
                <React.Suspense fallback={<></>}>
              <ReportCharts
                questionWisePerformanceDistribution={
                  props.testReport.questionWisePerformanceDistribution
                }
                questionWiseTimeDistribution={
                  props.testReport.questionWiseTimeDistribution
                }
                accuracy={props.testReport.accuracy}
                testCompartiveAnalysisData={comparativeAnalysisData}
                myMarks={
                  (props.testReport.totalMarks /
                    (props.testReport.maxMarks ?? 1)) *
                  100
                }
              />
              </React.Suspense>
            </Stack>

            <Text fz={24} fw={700}>
              Questions
            </Text>
            {props.testReport.superSectionWiseDetails?.map(
              (superSection, i) => {
                return (
                  <Stack>
                    <Text fz={16} fw={700}>
                      {superSection.name}
                    </Text>
                    {props.testReport.sectionWiseDetails
                      ?.filter((section) => {
                        return (
                          superSection.sectionIds.indexOf(section._id) != -1
                        );
                      })
                      .map((section, j) => {
                        return (
                          <Stack>
                            <Flex
                              justify="space-between"
                              style={{
                                boxShadow: "0px 0px 4px 0px #00000040",
                                borderRadius: "7px",
                              }}
                              py={25}
                              pl={10}
                              px={20}
                            >
                              <Text fz={16} fw={700}>
                                {section.name}
                              </Text>
                              <Flex
                                sx={{ width: "50%" }}
                                align={"center"}
                                justify={"end"}
                                gap={8}
                              >
                                <Text>
                                  Time Taken |{" "}
                                  {formatTime(section.timeTaken * 1000)}
                                </Text>
                                {isCollapseMap.get(section._id) ? (
                                  <Image
                                    src={require("../../../assets/downCollapse.png")}
                                    width={15}
                                    sx={{ cursor: "pointer" }}
                                    onClick={() =>
                                      handleOnClickISCollapse(section._id)
                                    }
                                  />
                                ) : (
                                  <Image
                                    src={require("../../../assets/righcollapse.png")}
                                    width={8}
                                    sx={{ cursor: "pointer" }}
                                    onClick={() =>
                                      handleOnClickISCollapse(section._id)
                                    }
                                  />
                                )}
                              </Flex>
                            </Flex>
                            {isCollapseMap.get(section._id) &&
                              section.questions.map(
                                (question, index: number) => {
                                  let questionParentType: QuestionParentType =
                                    props.test.casebasedquestions.findIndex(
                                      (q) => {
                                        return (
                                          q.questions.findIndex((iq) => {
                                            return (
                                              iq._id == question.question_id
                                            );
                                          }) != -1
                                        );
                                      }
                                    ) != -1
                                      ? findQuestionType(
                                          props.test.casebasedquestions
                                            .find((q) => {
                                              return (
                                                q.questions.findIndex((iq) => {
                                                  return (
                                                    iq._id ==
                                                    question.question_id
                                                  );
                                                }) != -1
                                              );
                                            })!!
                                            .questions.find((iq) => {
                                              return (
                                                iq._id == question.question_id
                                              );
                                            })!!.type
                                        ).parentType
                                      : props.test.subjectiveQuestions.findIndex(
                                          (q) => {
                                            return (
                                              q._id == question.question_id
                                            );
                                          }
                                        ) != -1
                                      ? QuestionParentType.SUBQ
                                      : QuestionParentType.MCQQ;

                                  switch (questionParentType) {
                                    case QuestionParentType.MCQQ:
                                      const detailedQuestion =
                                        question.parentQuestionId != null
                                          ? (props.test.casebasedquestions
                                              .find((innerQuestion) => {
                                                return (
                                                  innerQuestion._id ==
                                                  question.parentQuestionId
                                                );
                                              })
                                              ?.questions.find((q) => {
                                                return (
                                                  q._id == question.question_id
                                                );
                                              })!! as McqQuestion)
                                          : props.test.questions.find(
                                              (innerQuestion) => {
                                                return (
                                                  innerQuestion._id ==
                                                  question.question_id
                                                );
                                              }
                                            )!!;
                                      return (
                                        <Stack>
                                          {((question.parentQuestionId !=
                                            null &&
                                            index == 0) ||
                                            (index > 0 &&
                                              section.questions[index - 1]
                                                .parentQuestionId !=
                                                section.questions[index]
                                                  .parentQuestionId)) && (
                                            <DisplayHtmlText
                                              text={
                                                props.test.casebasedquestions.find(
                                                  (q) => {
                                                    return (
                                                      q.questions.findIndex(
                                                        (iq) => {
                                                          return (
                                                            iq._id ==
                                                            question.question_id
                                                          );
                                                        }
                                                      ) != -1
                                                    );
                                                  }
                                                )?.caseStudyText ?? ""
                                              }
                                            />
                                          )}
                                          <MCQReportQuestionCard
                                            number={index + 1}
                                            question={
                                              detailedQuestion?.text ?? ""
                                            }
                                            answers={
                                              detailedQuestion?.answers ?? []
                                            }
                                            userType={props.userType}
                                            testId={props.testId || ""}
                                            studentId={studentId}
                                            questionId={detailedQuestion._id}
                                            markedCorrect={
                                              props.avgTestReport
                                              .sectionWiseDetails.find((innerSection)=>{
                                                return innerSection._id == section._id
                                              })?.questions.find((innerQuestion)=>{
                                                return innerQuestion.question_id == question.question_id;
                                              })?.markedCorrect ?? 0
                                            }
                                            avgTimeTaken={
                                              props.avgTestReport
                                                .sectionWiseDetails.find((innerSection)=>{
                                                  return innerSection._id == section._id
                                                })?.questions.find((innerQuestion)=>{
                                                  return innerQuestion.question_id == question.question_id;
                                                })?.timeTaken??0
                                            }
                                            markedUnattempted={
                                              props.avgTestReport
                                                .sectionWiseDetails.find((innerSection)=>{
                                                  return innerSection._id == section._id
                                                })?.questions.find((innerQuestion)=>{
                                                  return innerQuestion.question_id == question.question_id;
                                                })?.unattempted ?? 0
                                            }
                                            timeTaken={
                                              question.timeTaken
                                            }
                                            totalNumberOfStudents={
                                              props.totalNumberOfStudents
                                            }
                                            key={index}
                                            markedAnswers={[
                                              parseInt(
                                                findQuestionAnswerSheetQuestion(
                                                  detailedQuestion._id
                                                )?.answerText
                                              ),
                                            ]}
                                            isSingleReport={
                                              props.isSingleReport
                                            }
                                            isCorrect={
                                              props.isSingleReport
                                                ? question.isCorrect
                                                : true
                                            }
                                            explaination={
                                              detailedQuestion?.explaination ??
                                              ""
                                            }
                                          />
                                        </Stack>
                                      );
                                    case QuestionParentType.SUBQ:
                                      const detailedQuestionSub =
                                        question.parentQuestionId != null
                                          ? (props.test.casebasedquestions
                                              .find((innerQuestion) => {
                                                return (
                                                  innerQuestion._id ==
                                                  question.parentQuestionId
                                                );
                                              })
                                              ?.questions.find((q) => {
                                                return (
                                                  q._id == question.question_id
                                                );
                                              })!! as SubjectiveQuestion)
                                          : props.test.subjectiveQuestions.find(
                                              (innerQuestion) => {
                                                return (
                                                  innerQuestion._id ==
                                                  question.question_id
                                                );
                                              }
                                            )!!;
                                      return (
                                        <Stack>
                                          {((question.parentQuestionId !=
                                            null &&
                                            index == 0) ||
                                            (index > 0 &&
                                              section.questions[index - 1]
                                                .parentQuestionId !=
                                                section.questions[index]
                                                  .parentQuestionId)) && (
                                            <DisplayHtmlText
                                              text={
                                                props.test.casebasedquestions.find(
                                                  (q) => {
                                                    return (
                                                      q.questions.findIndex(
                                                        (iq) => {
                                                          return (
                                                            iq._id ==
                                                            question.question_id
                                                          );
                                                        }
                                                      ) != -1
                                                    );
                                                  }
                                                )?.caseStudyText ?? ""
                                              }
                                            />
                                          )}
                                          <SubjectiveQuestionCard
                                            question={
                                              detailedQuestionSub?.text ?? ""
                                            }
                                            answer={
                                              detailedQuestionSub?.answer ?? ""
                                            }
                                            number={index + 1}
                                            markedUnattempted={
                                              props.avgTestReport
                                              .sectionWiseDetails.find((innerSection)=>{
                                                return innerSection._id == section._id
                                              })?.questions[index]?.unattempted ??0
                                            }
                                            markedCorrect={
                                              props.avgTestReport
                                              .sectionWiseDetails.find((innerSection)=>{
                                                return innerSection._id == section._id
                                              })?.questions[index]?.markedCorrect ?? 0
                                            }
                                            totalNumberOfStudents={
                                              props.totalNumberOfStudents
                                            }
                                            timeTaken={
                                              question.timeTaken
                                            }
                                            avgTimeTaken={
                                              props.avgTestReport
                                                .sectionWiseDetails.find((innerSection)=>{
                                                  return innerSection._id == section._id
                                                })?.questions[index]?.timeTaken??0
                                            }
                                            markedAnswers={
                                              findQuestionAnswerSheetQuestion(
                                                detailedQuestionSub._id
                                              )?.answerText ?? ""
                                            }
                                            isSingleReport={
                                              props.isSingleReport
                                            }
                                            marks={0}
                                            maxMarks={
                                              detailedQuestionSub?.totalMarks ??
                                              0
                                            }
                                            negativeMarks={
                                              detailedQuestionSub?.totalNegativeMarks ??
                                              0
                                            }
                                            explaination={
                                              detailedQuestionSub?.explaination ??
                                              ""
                                            }
                                            userType={props.userType}
                                            testId={props.testId || ""}
                                            studentId={studentId}
                                            questionId={detailedQuestionSub._id}
                                          />
                                        </Stack>
                                      );
                                  }
                                }
                              )}
                          </Stack>
                        );
                      })}
                  </Stack>
                );
              }
            )}
          </Stack>
        </Stack>
      )}
      {props.isTestwithOnlyMarks === true && (
        <Stack w="100%" h="100%" style={{ border: "solid red 1px" }}>
          <PdfViewer
            url={props.testReport?.pdfLink}
            showOptions={true}
            showDownloadButton={true}
          />
        </Stack>
      )}
    </>
  );
}
