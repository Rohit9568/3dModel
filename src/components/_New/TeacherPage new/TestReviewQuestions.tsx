import { useEffect, useState } from "react";
import { TestDeatils } from "../ContentTest";
import { TestQuestionsView } from "./TestQuestionsView";
import {
  Box,
  Button,
  Center,
  LoadingOverlay,
  Overlay,
  Stack,
  Text,
} from "@mantine/core";
import { que, subque } from "../Test/UserTypedQuestions";
import { createQuestionsusingAI } from "../../../features/test/QuestionSlice";
import { useMediaQuery } from "@mantine/hooks";

interface TestReviewQUestionsProps {
  setIsLoading: (input: boolean) => void;
  chapterIds: string[];
  testDetails: TestDeatils;
  setTestDetails: any;
  setTestQuestions: (input: McqQuestion[]) => void;
  setcasebasedQuestions: (input: CaseBasedQuestion[]) => void;
  setTestSubjectiveQuestions: (input: SubjectiveQuestion[]) => void;
  testSubjectiveQuestions: SubjectiveQuestion[];
  testquestions: McqQuestion[];
  caseBasedQuestions: CaseBasedQuestion[];
  onNextClick: () => void;
  typedMCQuestions: que[];
  typedSubjectiveQuestions: subque[];
  deleteTypedSubjectiveQuestion: (input: subque) => void;
  deleteTypedMCQuestion: (input: que) => void;
  deleteSubjectiveQuestion: (input: SubjectiveQuestion) => void;
  deleteMCQuestion: (input: McqQuestion) => void;
  settypedSubjectiveQuestions: (questions: subque[]) => void;
  setTypedMcQuestions: (questions: que[]) => void;
  dontShowButton?: boolean;
  selectedChapternames: string[];
  selectedClassName: string;
  selectedSubjectName: string;
}
export function TestReviewQuestions(props: TestReviewQUestionsProps) {
  const [isLoading, setisLoading] = useState<boolean | null>(null);
  const [allMcqQuestions, setAllMcqQuestions] = useState<McqQuestion[]>([]);
  const [allSubjectiveQuestions, setAllSUbjectiveQuestions] = useState<
    SubjectiveQuestion[]
  >([]);

  useEffect(() => {
    setAllMcqQuestions((prev) => {
      const prev1 = [...prev];
      return prev1.filter((x) => {
        if (props.testquestions.includes(x)) {
          return false;
        } else {
          return true;
        }
      });
    });
  }, [props.testquestions]);
  useEffect(() => {
    setAllSUbjectiveQuestions((prev) => {
      const prev1 = [...prev];
      return prev1.filter((x) => {
        if (props.testSubjectiveQuestions.includes(x)) {
          return false;
        } else {
          return true;
        }
      });
    });
  }, [props.testSubjectiveQuestions]);
  // function createQuestions() {
  //   if (props.chapterIds.length !== 0) {
  //     var questions;
  //     fetchTestChaptersQuestions(props.chapterIds)
  //       .then((data: any) => {
  //         questions = data;
  //         if (
  //           props.testDetails.questionType === QuestionType.CaseStudyQues.type
  //         ) {
  //           setisLoading(true);
  //           createQuestionsusingAI({
  //             chapterName: props.selectedChapternames,
  //             subjectName: props.selectedSubjectName,
  //             className: props.selectedClassName,
  //             chapterIds: props.chapterIds,
  //             objectiveQuestionNo: 0,
  //             subjectiveQuestionNo: 0,
  //             caseStudyQuestionNo: props.testDetails.maxQuestions,
  //             questionType: "CASEQ",
  //           })
  //             .then((x: any) => {
  //               setisLoading(false);
  //               const filtered = x.caseBasedQuestions.filter(
  //                 (y: any) => y.caseStudyText !== ""
  //               );
  //               const filtered2 = filtered.slice(
  //                 0,
  //                 props.testDetails.maxQuestions
  //               );
  //               props.setcasebasedQuestions(filtered2);
  //               const questions = filtered2.map((y: any) => y._id);
  //               props.setTestDetails((prev: any) => {
  //                 return {
  //                   ...prev,
  //                   caseBasedQuestions: questions,
  //                 };
  //               });
  //             })
  //             .catch((e) => {
  //               setisLoading(false);
  //               console.log(e);
  //             });
  //         } else if (
  //           props.testDetails.questionType === QuestionType.AllQues.type
  //         ) {
  //           if (
  //             questions?.mcqQuestions.length < 30 ||
  //             questions?.subjectiveQuestions.length < 30
  //           ) {
  //             setisLoading(true);
  //             const startTime = new Date().getTime();
  //             createQuestionsusingAI({
  //               chapterName: props.selectedChapternames,
  //               subjectName: props.selectedSubjectName,
  //               className: props.selectedClassName,
  //               chapterIds: props.chapterIds,
  //               objectiveQuestionNo: Math.floor(
  //                 props.testDetails.maxQuestions / 2
  //               ),
  //               subjectiveQuestionNo: Math.floor(
  //                 props.testDetails.maxQuestions / 2
  //               ),
  //               questionType: "ALL",
  //               caseStudyQuestionNo: 0,
  //             })
  //               .then((x: any) => {
  //                 const endTime = new Date().getTime();
  //                 const time = endTime - startTime;
  //                 setisLoading(false);
  //                 const filtered = x.mcqQuestions.filter(
  //                   (y: any) => y.text !== ""
  //                 );
  //                 const filtered2 = filtered.slice(
  //                   0,
  //                   Math.floor(props.testDetails.maxQuestions / 2)
  //                 );

  //                 const filtered3 = x.subjectiveQuestions.filter(
  //                   (y: any) => y.text !== ""
  //                 );
  //                 const filtered4 = filtered3.slice(
  //                   0,
  //                   Math.floor(props.testDetails.maxQuestions / 2)
  //                 );
  //                 props.setTestQuestions(filtered2);
  //                 props.setTestSubjectiveQuestions(filtered4);
  //                 const questions = filtered2.map((y: any) => y._id);
  //                 const subjectiveQ = filtered4.map((y: any) => y._id);
  //                 props.setTestDetails((prev: any) => {
  //                   return {
  //                     ...prev,
  //                     questions: questions,
  //                     subjectiveQuestions: subjectiveQ,
  //                   };
  //                 });
  //               })
  //               .catch((e) => {
  //                 setisLoading(false);
  //                 console.log(e);
  //               });
  //           } else {
  //             setisLoading(false);
  //             setAllMcqQuestions(questions?.mcqQuestions);
  //             const pickedQuestions: any = getRandomElementsFromArray(
  //               questions?.mcqQuestions,
  //               Math.floor(props.testDetails.maxQuestions / 2)
  //             );
  //             props.setTestQuestions(pickedQuestions);
  //             const ids = pickedQuestions.map((x: McqQuestion) => {
  //               return x._id;
  //             });
  //             setAllSUbjectiveQuestions(questions?.subjectiveQuestions);
  //             const pickedSubjectiveQuestions: any = getRandomElementsFromArray(
  //               questions?.subjectiveQuestions,
  //               props.testDetails.maxQuestions - pickedQuestions.length
  //             );
  //             props.setTestSubjectiveQuestions(pickedSubjectiveQuestions);
  //             const ids2 = pickedSubjectiveQuestions.map(
  //               (x: SubjectiveQuestion) => {
  //                 return x._id;
  //               }
  //             );
  //             props.setTestDetails((prev: any) => {
  //               return {
  //                 ...prev,
  //                 subjectiveQuestions: ids2,
  //                 questions: ids,
  //               };
  //             });
  //           }
  //         } else if (
  //           props.testDetails.questionType === QuestionType.McqQues.type
  //         ) {
  //           if (questions?.mcqQuestions.length < 30) {
  //             const startTime = new Date().getTime();

  //             setisLoading(true);
  //             createQuestionsusingAI({
  //               chapterName: props.selectedChapternames,
  //               subjectName: props.selectedSubjectName,
  //               className: props.selectedClassName,
  //               chapterIds: props.chapterIds,
  //               objectiveQuestionNo: props.testDetails.maxQuestions,
  //               subjectiveQuestionNo: 0,
  //               questionType: "MCQ",
  //               caseStudyQuestionNo: 0,
  //             })
  //               .then((x: any) => {
  //                 const endTime = new Date().getTime();
  //                 const time = endTime - startTime;
  //                 setisLoading(false);
  //                 const filtered = x.mcqQuestions.filter(
  //                   (y: any) => y.text !== ""
  //                 );
  //                 const filtered2 = filtered.slice(
  //                   0,
  //                   props.testDetails.maxQuestions
  //                 );

  //                 props.setTestQuestions(filtered2);
  //                 const questions = filtered2.map((y: any) => y._id);
  //                 props.setTestDetails((prev: any) => {
  //                   return {
  //                     ...prev,
  //                     questions: questions,
  //                   };
  //                 });
  //               })
  //               .catch((e) => {
  //                 setisLoading(false);
  //                 console.log(e);
  //               });
  //           } else {
  //             setisLoading(false);
  //             const pickedQuestions: any = getRandomElementsFromArray(
  //               questions?.mcqQuestions,
  //               props.testDetails.maxQuestions
  //             );
  //             setAllMcqQuestions(questions?.mcqQuestions);
  //             props.setTestQuestions(pickedQuestions);
  //             const ids = pickedQuestions.map((x: McqQuestion) => {
  //               return x._id;
  //             });
  //             props.setTestDetails((prev: any) => {
  //               return {
  //                 ...prev,
  //                 questions: ids,
  //               };
  //             });
  //           }
  //         } else {
  //           if (questions?.subjectiveQuestions.length < 30) {
  //             setisLoading(true);
  //             const startTime = new Date().getTime();
  //             createQuestionsusingAI({
  //               chapterName: props.selectedChapternames,
  //               subjectName: props.selectedSubjectName,
  //               className: props.selectedClassName,
  //               chapterIds: props.chapterIds,
  //               objectiveQuestionNo: 0,
  //               subjectiveQuestionNo: props.testDetails.maxQuestions,
  //               questionType: props.testDetails.questionType,
  //               caseStudyQuestionNo: 0,
  //             })
  //               .then((x: any) => {
  //                 const endTime = new Date().getTime();
  //                 const time = endTime - startTime;
  //                 setisLoading(false);
  //                 const filtered = x.subjectiveQuestions.filter(
  //                   (y: any) => y.text !== ""
  //                 );
  //                 const filtered2 = filtered.slice(
  //                   0,
  //                   props.testDetails.maxQuestions
  //                 );
  //                 props.setTestSubjectiveQuestions(filtered2);
  //                 const questions = filtered2.map((y: any) => y._id);
  //                 props.setTestDetails((prev: any) => {
  //                   return {
  //                     ...prev,
  //                     subjectiveQuestions: questions,
  //                   };
  //                 });
  //               })
  //               .catch((e) => {
  //                 setisLoading(false);
  //                 console.log(e);
  //               });
  //           } else {
  //             setisLoading(false);
  //             const filterequestions = questions?.subjectiveQuestions.filter(
  //               (x: any) => x.type === props.testDetails.questionType
  //             );
  //             setAllSUbjectiveQuestions(filterequestions);
  //             const pickedQuestions: any = getRandomElementsFromArray(
  //               filterequestions,
  //               props.testDetails.maxQuestions
  //             );
  //             props.setTestSubjectiveQuestions(pickedQuestions);
  //             const ids = pickedQuestions.map((x: SubjectiveQuestion) => {
  //               return x._id;
  //             });
  //             props.setTestDetails((prev: any) => {
  //               return {
  //                 ...prev,
  //                 subjectiveQuestions: ids,
  //               };
  //             });
  //           }
  //           props.setIsLoading(false);
  //         }
  //       })
  //       .catch((err) => {
  //         props.setIsLoading(false);
  //         console.log(err);
  //       });
  //   }
  // }

  function AddSubjectiveQuestion(questions: SubjectiveQuestion[]) {
    props.setTestSubjectiveQuestions([
      ...props.testSubjectiveQuestions,
      ...questions,
    ]);
    const ids = questions.map((x: SubjectiveQuestion) => {
      return x._id;
    });
    props.setTestDetails((prev: any) => {
      return {
        ...prev,
        subjectiveQuestions: [...prev.subjectiveQuestions, ...ids],
      };
    });
  }
  function AddObjectiveQuestion(questions: McqQuestion[]) {
    props.setTestQuestions([...props.testquestions, ...questions]);
    const ids = questions.map((x: McqQuestion) => {
      return x._id;
    });
    props.setTestDetails((prev: any) => {
      return {
        ...prev,
        questions: [...prev.questions, ...ids],
      };
    });
  }
  // useEffect(() => {
  //   createQuestions();
  // }, []);
  const [isCompleted, setCompleted] = useState<boolean>();
  useEffect(() => {
    if (isLoading && isCompleted === true) {
      window.scrollTo(0, 0);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "visible";
    }
  }, [isLoading, isCompleted]);
  useEffect(() => {
    if (isLoading) {
      // window.scrollTo(0, document.body.scrollHeight);
      window.scrollTo(0, 0);
      setCompleted(false);
    }
  }, [isLoading]);
  const isMd = useMediaQuery(`(max-width: 820px)`);

  return (
    <>
      {isLoading && isCompleted === true && (
        <Overlay
          color="#fff"
          w="100vw"
          h="100vh"
          zIndex={999999999999}
          opacity={1}
        >
          <Box w="100vw" h="100vh">
            <Center w="100%" h="100%">
              <Stack spacing={0} align="center">
                <img
                  src={require("../../../assets/loadingques.gif")}
                  style={{
                    zIndex: 999999,
                  }}
                  width={isMd ? "50%" : "80%"}
                />
                <Text color="black" fw={600} fz={22}>
                  Generating Questions...
                </Text>
              </Stack>
            </Center>
          </Box>
        </Overlay>
      )}
      {isLoading !== null && (
        <TestQuestionsView
          testSubjectiveQuestions={props.testSubjectiveQuestions}
          testquestions={props.testquestions}
          caseBasedQuestions={props.caseBasedQuestions}
          typedMCQuestions={props.typedMCQuestions}
          typedSubjectiveQuestions={props.typedSubjectiveQuestions}
          deleteTypedMCQuestion={props.deleteTypedMCQuestion}
          deleteTypedSubjectiveQuestion={props.deleteTypedSubjectiveQuestion}
          setTypedMcQuestions={props.setTypedMcQuestions}
          deleteMCQuestion={props.deleteMCQuestion}
          deleteSubjectiveQuestion={props.deleteSubjectiveQuestion}
          settypedSubjectiveQuestions={props.settypedSubjectiveQuestions}
          testDetails={props.testDetails}
          isCompleted={isCompleted}
          setisCompleted={setCompleted}
          isLoading={isLoading}
          selectedClassName={props.selectedClassName}
          selectedSubjectName={props.selectedSubjectName}
          setTestDetails={props.setTestDetails}
          allMcqQuestions={allMcqQuestions}
          allSubjectiveQuestions={allSubjectiveQuestions}
          onAddMCQuestions={AddObjectiveQuestion}
          onAddSubjectiveQuestions={AddSubjectiveQuestion}
        />
      )}
    </>
  );
}
