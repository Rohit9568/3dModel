import {
  Box,
  Button,
  Card,
  Center,
  Divider,
  FileInput,
  Flex,
  Radio,
  Select,
  Stack,
  Text,
  TextInput,
  Textarea,
} from "@mantine/core";
import { IconCheck, IconPhoto, IconPlus, IconX } from "@tabler/icons";
import { useEffect, useRef, useState } from "react";
import {
  IconDeleteQuestion,
  IconEditQuestion,
  IconPlusQuestions,
} from "../../components/_Icons/CustonIcons";
import { FileUpload } from "../../features/fileUpload/FileUpload";
import { useMediaQuery } from "@mantine/hooks";
import {
  CaseBasedQuestionCard,
  MCQquestionCard,
  SubjectivequestionCard,
} from "./PersonalizedTestQuestions";

export interface MCQCaseTypedQuestion {
  text: string;
  questionImageUrl: string;
  answers: {
    text: string;
    isCorrect: boolean;
  }[];
  answerImageUrl: string[];
}

export interface MCQTypedQuestion {
  questionImageUrl: string;
  text: string;
  answers: {
    text: string;
    isCorrect: boolean;
  }[];
  _id: string;
  answerImageUrl: string[];
}

export interface CASEtypedQuestion {
  questionImageUrl: string;
  questions: (MCQCaseTypedQuestion | SUBjectivetypedQuestion)[];
  caseStudyText: string;
  _id: string;
}

export interface SUBjectivetypedQuestion {
  questionImageUrl: string;
  text: string;
  answer: string;
  type: string;
  _id: string;
  answerImageUrl: string;
}

interface MCQCaseBasedQuestionProps {
  data: MCQCaseTypedQuestion;
  onEditClick: (val: MCQCaseTypedQuestion) => void;
  onDeleteClick: () => void;
}

interface PersonalizedTestQuestionsProps {
  subjectiveWordQuestions: SUBjectivetypedQuestion[];
  casebasedWordQuestions: CASEtypedQuestion[];
  objectiveWordQuestions: MCQTypedQuestion[];
  subjectiveQuestion: SUBjectivetypedQuestion[];
  caseBasedQuestion: CASEtypedQuestion[];
  objectiveQuestion: MCQTypedQuestion[];
  setCaseBasedQuestion: (val: any) => void;
  setObjectiveQuestion: (val: any) => void;
  setSubjectiveQuestion: (val: any) => void;
}
export function PredefinedTestQuestions(props: PersonalizedTestQuestionsProps) {
  useEffect(() => {
    props.setCaseBasedQuestion(props.casebasedWordQuestions);
  }, [props.casebasedWordQuestions]);
  useEffect(() => {
    props.setObjectiveQuestion(props.objectiveWordQuestions);
  }, [props.objectiveWordQuestions]);
  useEffect(() => {
    props.setSubjectiveQuestion(props.subjectiveWordQuestions);
  }, [props.subjectiveWordQuestions]);
  useEffect(() => {
    setTimeout(() => {
      if (typeof window?.MathJax !== "undefined") {
        window.MathJax.typesetClear();
        window.MathJax.typeset();
      }
    }, 500);
  }, [
    props.subjectiveWordQuestions,
    props.objectiveWordQuestions,
    props.casebasedWordQuestions,
    props.subjectiveQuestion,
    props.caseBasedQuestion,
    props.objectiveQuestion,
  ]);
  const [addQuestion, setAddQuestion] = useState<boolean>(false);
  const isMd = useMediaQuery(`(max-width: 820px)`);
  return (
    // <Stack px={isMd ? 20 : 70} spacing={20} mb={50}>
    //   {props.objectiveQuestion.length !== 0 && (
    //     <Stack spacing={20}>
    //       <Card
    //         style={{
    //           boxShadow: "0px 0px 4px 0px rgba(0, 0, 0, 0.25)",
    //           background: "white",
    //           borderRadius: "10px",
    //         }}
    //       >
    //         <Text fz={20} fw={600}>
    //           Section A(mcq type)
    //         </Text>
    //       </Card>
    //       {props.objectiveQuestion.map((x, i) => {
    //         return (
    //           <MCQquestionCard
    //             index={i + 1}
    //             _id={x._id}
    //             text={x.text}
    //             answers={x.answers}
    //             onDeleteClick={() => {
    //               props.setObjectiveQuestion((prev: any) => {
    //                 const prev1 = [...prev];
    //                 prev1.splice(i, 1);
    //                 return prev1;
    //               });
    //             }}
    //             onEditClick={(val) => {
    //               props.setObjectiveQuestion((prev: any) => {
    //                 const prev1 = [...prev];
    //                 prev1[i].answers = val.answers;
    //                 prev1[i].text = val.text;
    //                 prev1[i].answerImageUrl = val.answerImageUrl;
    //                 prev1[i]._id = val._id;
    //                 prev1[i].questionImageUrl = val.questionImage;
    //                 return prev1;
    //               });
    //             }}
    //             answerImageUrl={x.answerImageUrl}
    //             questionImageUrl={x.questionImageUrl}
    //             canBeDeleted={false}
    //             testType="Sample Paper"
    //           />
    //         );
    //       })}
    //     </Stack>
    //   )}
    //   <Card
    //     style={{
    //       boxShadow: "0px 0px 4px 0px rgba(0, 0, 0, 0.25)",
    //       background: "white",
    //       borderRadius: "10px",
    //     }}
    //   >
    //     <Text fz={20} fw={600}>
    //       Section B(very short type)
    //     </Text>
    //   </Card>
    //   {props.subjectiveQuestion.length !== 0 && (
    //     <Stack spacing={20}>
    //       {props.subjectiveQuestion
    //         .filter((x) => x.type === QuestionType.VeryShortQues.type)
    //         .map((x, i) => {
    //           return (
    //             <SubjectivequestionCard
    //               index={i + 1 + props.objectiveQuestion.length}
    //               _id={x._id}
    //               text={x.text}
    //               answer={x.answer}
    //               questionImage={x.questionImageUrl}
    //               answerImage={x.answerImageUrl}
    //               onDeleteClick={() => {
    //                 props.setSubjectiveQuestion((prev: any) => {
    //                   const prev1 = [...prev];
    //                   prev1.splice(i, 1);
    //                   return prev1;
    //                 });
    //               }}
    //               onEditClick={(val) => {
    //                 props.setSubjectiveQuestion((prev: any) => {
    //                   const prev1 = [...prev];
    //                   prev1[i].answer = val.answer;
    //                   prev1[i].text = val.text;
    //                   prev1[i]._id = val._id;
    //                   return prev1;
    //                 });
    //               }}
    //               canBeDeleted={false}
    //               testType="Sample Paper"
    //             />
    //           );
    //         })}
    //     </Stack>
    //   )}
    //   <Card
    //     style={{
    //       boxShadow: "0px 0px 4px 0px rgba(0, 0, 0, 0.25)",
    //       background: "white",
    //       borderRadius: "10px",
    //     }}
    //   >
    //     <Text fz={20} fw={600}>
    //       Section C(short type)
    //     </Text>
    //   </Card>
    //   {props.subjectiveQuestion.length !== 0 && (
    //     <Stack spacing={20}>
    //       {props.subjectiveQuestion
    //         .filter((x) => x.type === QuestionType.ShortQues.type)
    //         .map((x, i) => {
    //           return (
    //             <SubjectivequestionCard
    //               index={
    //                 i +
    //                 1 +
    //                 props.objectiveQuestion.length +
    //                 props.subjectiveQuestion.filter(
    //                   (x) => x.type === QuestionType.VeryShortQues.type
    //                 ).length
    //               }
    //               _id={x._id}
    //               text={x.text}
    //               answer={x.answer}
    //               questionImage={x.questionImageUrl}
    //               answerImage={x.answerImageUrl}
    //               onDeleteClick={() => {
    //                 props.setSubjectiveQuestion((prev: any) => {
    //                   const prev1 = [...prev];
    //                   prev1.splice(i, 1);
    //                   return prev1;
    //                 });
    //               }}
    //               onEditClick={(val) => {
    //                 props.setSubjectiveQuestion((prev: any) => {
    //                   const prev1 = [...prev];
    //                   prev1[i].answer = val.answer;
    //                   prev1[i].text = val.text;
    //                   prev1[i]._id = val._id;
    //                   return prev1;
    //                 });
    //               }}
    //               canBeDeleted={false}
    //               testType="Sample Paper"
    //             />
    //           );
    //         })}
    //     </Stack>
    //   )}
    //   <Card
    //     style={{
    //       boxShadow: "0px 0px 4px 0px rgba(0, 0, 0, 0.25)",
    //       background: "white",
    //       borderRadius: "10px",
    //     }}
    //   >
    //     <Text fz={20} fw={600}>
    //       Section D(long type)
    //     </Text>
    //   </Card>
    //   {props.subjectiveQuestion.length !== 0 && (
    //     <Stack spacing={20}>
    //       {props.subjectiveQuestion
    //         .filter((x) => x.type === QuestionType.LongQues.type)
    //         .map((x, i) => {
    //           return (
    //             <SubjectivequestionCard
    //               index={
    //                 i +
    //                 1 +
    //                 props.objectiveQuestion.length +
    //                 props.subjectiveQuestion.filter(
    //                   (x) =>
    //                     x.type === QuestionType.VeryShortQues.type ||
    //                     x.type === QuestionType.ShortQues.type
    //                 ).length
    //               }
    //               _id={x._id}
    //               text={x.text}
    //               answer={x.answer}
    //               questionImage={x.questionImageUrl}
    //               answerImage={x.answerImageUrl}
    //               onDeleteClick={() => {
    //                 props.setSubjectiveQuestion((prev: any) => {
    //                   const prev1 = [...prev];
    //                   prev1.splice(i, 1);
    //                   return prev1;
    //                 });
    //               }}
    //               onEditClick={(val) => {
    //                 props.setSubjectiveQuestion((prev: any) => {
    //                   const prev1 = [...prev];
    //                   prev1[i].answer = val.answer;
    //                   prev1[i].text = val.text;
    //                   prev1[i]._id = val._id;
    //                   return prev1;
    //                 });
    //               }}
    //               canBeDeleted={false}
    //               testType="Sample Paper"
    //             />
    //           );
    //         })}
    //     </Stack>
    //   )}
    //   {props.caseBasedQuestion.length !== 0 && (
    //     <>
    //       <Card
    //         style={{
    //           boxShadow: "0px 0px 4px 0px rgba(0, 0, 0, 0.25)",
    //           background: "white",
    //           borderRadius: "10px",
    //         }}
    //       >
    //         <Text fz={20} fw={600}>
    //           Section E(Case Study Type)
    //         </Text>
    //       </Card>
    //       <Stack>
    //         {props.caseBasedQuestion.map((x, i) => {
    //           return (
    //             <CaseBasedQuestionCard
    //               index={
    //                 i +
    //                 1 +
    //                 props.objectiveQuestion.length +
    //                 props.subjectiveQuestion.length
    //               }
    //               _id={x._id}
    //               text={x.caseStudyText}
    //               questions={x.questions}
    //               onDeleteClick={() => {
    //                 props.setCaseBasedQuestion((prev: any) => {
    //                   const prev1 = [...prev];
    //                   prev1.splice(i, 1);
    //                   return prev1;
    //                 });
    //               }}
    //               onEditClick={(val) => {
    //                 props.setCaseBasedQuestion((prev: any) => {
    //                   const prev1 = [...prev];
    //                   prev1[i].questions = val.questions;
    //                   prev1[i].casebasedText = val.text;
    //                   prev1[i]._id = val._id;
    //                   return prev1;
    //                 });
    //               }}
    //               questionImageUrl={x.questionImageUrl}
    //               canBeDeleted={false}
    //               testType={QuestionType.CaseQues.type}
    //             />
    //           );
    //         })}
    //       </Stack>
    //     </>
    //   )}
    // </Stack>
    <></>
  );
}
