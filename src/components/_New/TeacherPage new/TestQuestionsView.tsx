import { Stack, Text } from "@mantine/core";
import {
  CaseBasedQuestion,
  MCQuestionCard,
  QuestionCard,
  TestDeatils,
} from "../ContentTest";
import { useMediaQuery } from "@mantine/hooks";
import { UserTypedQuestions, que, subque } from "../Test/UserTypedQuestions";
import { QuestionType } from "../../../@types/QuestionTypes.d";
import { useEffect, useState } from "react";
import { GetAllInfoForInstitute } from "../../../_parentsApp/features/instituteSlice";
import { GetUser } from "../../../utilities/LocalstorageUtility";

interface TestQuestionsViewProps {
  testDetails: TestDeatils;
  testSubjectiveQuestions: SubjectiveQuestion[];
  testquestions: McqQuestion[];
  caseBasedQuestions: CaseBasedQuestion[];
  allMcqQuestions: McqQuestion[];
  allSubjectiveQuestions: SubjectiveQuestion[];
  typedMCQuestions: que[];
  typedSubjectiveQuestions: subque[];
  deleteTypedSubjectiveQuestion: (input: subque) => void;
  deleteTypedMCQuestion: (input: que) => void;
  deleteSubjectiveQuestion: (input: SubjectiveQuestion) => void;
  deleteMCQuestion: (input: McqQuestion) => void;
  settypedSubjectiveQuestions: (questions: subque[]) => void;
  setTypedMcQuestions: (questions: que[]) => void;
  isCompleted: boolean | undefined;
  setisCompleted: (val: boolean) => void;
  isLoading: boolean;
  selectedClassName: string;
  selectedSubjectName: string;
  setTestDetails: any;
  onAddSubjectiveQuestions: (data: SubjectiveQuestion[]) => void;
  onAddMCQuestions: (data: McqQuestion[]) => void;
}

export const SentenceLoader = (props: {
  sentences: string[];
  duration: number;
  isCompleted: boolean | undefined;
  setisCompleted: (val: boolean) => void;
}) => {
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  // const [currentWord, setCurrentWord] = useState('');
  const currentSentence = props.sentences[currentSentenceIndex];
  const words = currentSentence ? currentSentence.split(" ") : "";
  const intialStage = props.sentences.map((x) => "");
  const [instructions, setInstructions] = useState<string[]>(intialStage);
  useEffect(() => {
    const intervalId = setInterval(() => {
      if (currentWordIndex < words.length) {
        setInstructions((prev) => {
          const prev1 = [...prev];
          prev1[currentSentenceIndex] =
            prev1[currentSentenceIndex] + " " + words[currentWordIndex];
          return prev1;
        });
        window.scrollTo(0, 130);
        // setCurrentWord((prevWord) => prevWord + ' ' + words[currentWordIndex]);
        setCurrentWordIndex(currentWordIndex + 1);
      } else {
        if (currentSentenceIndex < props.sentences.length)
          setCurrentSentenceIndex(currentSentenceIndex + 1);
        else {
          props.setisCompleted(true);
          clearInterval(intervalId);
          return;
        }
        setCurrentWordIndex(0);
        // setCurrentWord('');
      }

      if (currentSentenceIndex === props.sentences.length) {
        props.setisCompleted(true);
        clearInterval(intervalId);
      }
    }, props.duration * 10);

    return () => {
      clearInterval(intervalId);
    };
  }, [
    currentWordIndex,
    currentSentenceIndex,
    props.duration,
    props.sentences,
    words,
  ]);

  return (
    <>
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
    </>
  );
  //  ( <>
  //   {/* instructions.map((x, i) => {
  //     return (
  //       <Text
  //         style={{
  //           fontFamily: "Nunito",
  //           fontWeight: 400,
  //           fontSize: 18,
  //           margin: "3px 0px",
  //         }}
  //       >
  //         {i + 1}. {x}
  //       </Text>
  //     )
  //   }) */}
  //   </>)
};

export function TestQuestionsView(props: TestQuestionsViewProps) {
  const isMd = useMediaQuery(`(max-width: 820px)`);
  const lettering = ["a", "b", "c", "d"];
  const instructions = [];

  const [instituteInfo, setInstituteInfo] = useState<any>(null);
  const user = GetUser();

  useEffect(() => {
    GetAllInfoForInstitute({ id: user.instituteId })
      .then((x: any) => {
        setInstituteInfo(x);
        // instituteName = x.name;
        // instituteLogo = x.schoolIcon;
        // instituteBanner = x.schoolBanner;
        // instituteSubheading = x.schoolSubText;
      })
      .catch((e) => {});
  }, []);
  let lastQuestionNo = 1;
  instructions.push(
    `Marks are indicated against each question. Each question carry equal marks.`
  );
  if (props.testDetails.questionType === QuestionType.AllQues.type) {
    // if (test.questions.length > 0) {
    //   instructions.push(
    //     `Questions From ${lastQuestionNo} to ${
    //       lastQuestionNo + test.questions.length - 1
    //     } are Objective Type Questions.`
    //   );
    //   lastQuestionNo += test.questions.length;
    // }
    // if (shortAnsQuestions.length > 0) {
    //   instructions.push(
    //     `Questions From ${lastQuestionNo} to ${
    //       lastQuestionNo + shortAnsQuestions.length - 1
    //     } are Short Answer Type Questions.`
    //   );
    //   lastQuestionNo += shortAnsQuestions.length;
    // }
    // if (longAnsQuestions.length > 0) {
    //   instructions.push(
    //     `Questions From ${lastQuestionNo} to ${
    //       lastQuestionNo + longAnsQuestions.length - 1
    //     } are Long Answer Type Questions.`
    //   );
    //   lastQuestionNo += longAnsQuestions.length;
    // }

    instructions.push(
      `Ensure that your answers are legible and properly marked.`
    );
  }
  instructions.push(
    `Follow the specified procedure for submitting your answer sheets or online responses.`
  );
  if (props.testDetails.questionType === QuestionType.McqQues.type) {
    instructions.push(
      `Ensure that your answers are legible and properly marked.`
    );
  }
  if (props.testDetails.questionType === QuestionType.LongQues.type) {
    instructions.push(`Ensure that your answers are legible.`);
  }
  if (props.testDetails.questionType === QuestionType.ShortQues.type) {
    instructions.push(`Ensure that your answers are legible.`);
  }

  return (
    <>
      <Stack mt={20} w={isMd ? "100%" : "90%"}>
        {instituteInfo &&
          instituteInfo.subscriptionModelType === "PREMIUM" &&
          instituteInfo && (
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "right",
              }}
            >
              <img width={200} src={instituteInfo.schoolBanner}></img>
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
          {instituteInfo && instituteInfo.schoolIcon !== null && (
            <img width={30} src={instituteInfo.schoolIcon}></img>
          )}
          <span style={{ marginRight: 10, marginLeft: 10 }}>
            {instituteInfo && instituteInfo.name.toUpperCase()}
          </span>
        </p>
        {/* {subHeading !== null && (
            <p
              style={{
                fontSize: 16,
                fontWeight: 400,
                width: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginTop: -25,
                color: "gray",
              }}
            >
              {subHeading}
            </p>
          )} */}
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
            fontSize: 25,
            fontWeight: 700,
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            margin: "5px 0px",
          }}
        >
          {props.selectedClassName}-{props.selectedSubjectName}
        </p>
        <p
          style={{
            fontSize: 25,
            fontWeight: 700,
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            margin: "5px 0px",
          }}
        >
          {props.testDetails.name.toUpperCase()}
        </p>
        <Stack
          style={{
            border: "#4B65F6 solid 2px",
            borderRadius: "12px",
            padding: "10px",
          }}
          px={20}
          pb={10}
          pt={15}
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
              Maximum Marks:{props.testDetails.maxMarks}
            </Text>
          </div>
          <Stack
            style={{
              marginTop: "8px",
              paddingLeft: "2px",
            }}
          >
            <SentenceLoader
              sentences={instructions}
              duration={props.isLoading === false ? 1 : 20}
              isCompleted={props.isCompleted}
              setisCompleted={props.setisCompleted}
            />
          </Stack>
        </Stack>
        <UserTypedQuestions
          questionType={props.testDetails.questionType}
          typedMcQuestions={props.typedMCQuestions}
          typedSubjectiveQuestions={props.typedSubjectiveQuestions}
          settypedSubjectiveQuestions={props.settypedSubjectiveQuestions}
          setTypedMcQuestions={props.setTypedMcQuestions}
          allMcqQuestions={props.allMcqQuestions}
          allSubjectiveQuestions={props.allSubjectiveQuestions}
          onAddMCQuestions={props.onAddMCQuestions}
          onAddSubjectiveQuestions={props.onAddSubjectiveQuestions}
          testDetails={props.testDetails}
        />
        {props.testquestions.map((x, index) => {
          if (x && x.text)
            return (
              <MCQuestionCard
                id={x._id}
                question={x.text}
                questionImageUrl={x.questionImageUrl}
                answers={x.answers}
                answerImageUrl={x.answerImageUrl}
                number={index + 1}
                key={index}
                hideAnswer={false}
                canbedeleted={true}
                deletefunction={() => props.deleteMCQuestion(x)}
                typedMcQuestions={props.typedMCQuestions}
                setTypedMcQuestions={props.setTypedMcQuestions}
                setTestDetails={props.setTestDetails}
                testDetails={props.testDetails}
              />
            );
        })}
        {props.typedMCQuestions.map((x, index) => {
          if (x && x.id.includes("userQ") && x.text)
            return (
              <MCQuestionCard
                id={x.id}
                question={x.text}
                answers={x.answers}
                number={index + 1 + props.testquestions.length}
                canbedeleted={true}
                deletefunction={() => props.deleteTypedMCQuestion(x)}
                key={index}
                hideAnswer={false}
                typedMcQuestions={props.typedMCQuestions}
                setTypedMcQuestions={props.setTypedMcQuestions}
                setTestDetails={props.setTestDetails}
                testDetails={props.testDetails}
              />
            );
        })}
        {props.testSubjectiveQuestions.map((x, index) => {
          return (
            <QuestionCard
              id={x._id}
              question={x.text}
              answer={x.answer}
              number={
                index +
                1 +
                props.testquestions.length +
                props.typedMCQuestions.length
              }
              questionImageUrl={x.questionImageUrl}
              answerImageUrl={x.answerImageUrl}
              key={index}
              hideAnswer={false}
              canbedeleted={true}
              deletefunction={() => props.deleteSubjectiveQuestion(x)}
              testDetails={props.testDetails}
              setTestDetails={props.setTestDetails}
              typedSubjectiveQuestions={props.typedSubjectiveQuestions}
              settypedSubjectiveQuestions={props.settypedSubjectiveQuestions}
            />
          );
        })}
        {props.typedSubjectiveQuestions.map((x, index) => {
          if (x.id.includes("userQ"))
            return (
              <QuestionCard
                question={x.text}
                answer={x.answer}
                number={
                  index +
                  props.testquestions.length +
                  props.testSubjectiveQuestions.length +
                  props.typedMCQuestions.length +
                  1
                }
                canbedeleted={true}
                deletefunction={() => props.deleteTypedSubjectiveQuestion(x)}
                key={index}
                hideAnswer={false}
                id={x.id}
                testDetails={props.testDetails}
                setTestDetails={props.setTestDetails}
                typedSubjectiveQuestions={props.typedSubjectiveQuestions}
                settypedSubjectiveQuestions={props.settypedSubjectiveQuestions}
              />
            );
        })}
        {props.caseBasedQuestions.map((x, index) => {
          return (
            <CaseBasedQuestion
              questions={x.questions}
              caseStudyText={x.text}
              explaination=""
              number={
                index +
                props.testquestions.length +
                props.testSubjectiveQuestions.length +
                props.typedMCQuestions.length +
                1 +
                props.typedSubjectiveQuestions.length
              }
              canbedeleted={true}
              deletefunction={() => {}}
              key={index}
              id={x._id}
              testDetails={props.testDetails}
              setTestDetails={props.setTestDetails}
              questionImageUrl={x.questionImageUrl}
            />
          );
        })}
      </Stack>
    </>
  );
}