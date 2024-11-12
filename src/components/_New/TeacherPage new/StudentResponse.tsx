import { Stack, Text } from "@mantine/core";
import { McqResponseCard } from "../TestQuestionsCards/McqResponsCard";
import { SubjectiveQuestionResponseCard } from "../TestQuestionsCards/SubjectiveQuestionResponseCard";
import { useEffect, useState } from "react";
import { CaseResponseCard } from "../TestQuestionsCards/CaseResponseCard";
import { QuestionType } from "../../../@types/QuestionTypes.d";

interface MarksQuestionArray {
  _id: string;
  marks: number;
}
interface StudentResponsesProps {
  test: any;
  answerSheet: any;
  questionMarks: MarksQuestionArray[];
  questions: MarksQuestionArray[];
  onMarksValueChange: (val: number, index: number) => void;
  onCaseBasedQuestionChange: (val: number, index: number) => void;
  onMCQmarksChange: (val: number, index: number) => void;
  onChangemcqbasedMarks: (val: number, index: number) => void;
  onChangecaseBasedMarks: (val: number, index: number) => void;
  caseMarks: any[];
  mcqQuestionMarks: any[];
}
export function StudentResponses(props: StudentResponsesProps) {
  const [questionsMap, setQuestionsMap] = useState(new Map());

  useEffect(() => {
    const updatedMap = new Map(questionsMap);
    props.test.questions.forEach((x: any) => {
      updatedMap.set(x._id, x);
    });

    props.test.subjectiveQuestions.forEach((x: any) => {
      updatedMap.set(x._id, x);
    });

    props.test.casebasedquestions.forEach((x: any) => {
      updatedMap.set(x._id, x);
    });
    setQuestionsMap(updatedMap);
  }, [props.answerSheet]);

  if (props.answerSheet === undefined) return <></>;
  else
    return (
      <>
        {props.test.pdfLink !== null && questionsMap.size !== 0 && (
          <Stack mb={"6rem"}>
            {props.test.sections.map((y: any) => {
              return (
                <Stack>
                  <Text>{y.name}</Text>
                  {y.questions.map((x: any, index: number) => {
                    const question = questionsMap.get(x);
                    switch (question.type) {
                      case QuestionType.McqQues.type:
                        const mcqIndex = props.answerSheet.mcqAnswers.findIndex(
                          (x: any) => {
                            return x.question_id === question._id;
                          }
                        );
                        return (
                          <SubjectiveQuestionResponseCard
                            number={index + 1}
                            question={question.text}
                            answer={question.answer}
                            answerImageUrl={question.answerImageUrl}
                            questionImageUrl={question.questionImageUrl}
                            studentsAnswer={
                              props.answerSheet.mcqAnswers.find((x: any) => {
                                return x.question_id === question._id;
                              }).answerText
                            }
                            maxMarks={question.totalMarks}
                            studentMarks={
                              props.mcqQuestionMarks[mcqIndex]?.marks ?? 0
                            }
                            onMarksChange={(val) => {
                              props.onMCQmarksChange(val, mcqIndex);
                            }}
                            isEdit={true}
                            isAnswerShown={false}
                          />
                        );
                      case QuestionType.LongQues.type:
                        const longIndex =
                          props.answerSheet.subjectiveAnswers.findIndex(
                            (x: any) => {
                              return x.question_id === question._id;
                            }
                          );
                        return (
                          <SubjectiveQuestionResponseCard
                            number={index + 1}
                            question={question.text}
                            answer={question.answer}
                            answerImageUrl={question.answerImageUrl}
                            questionImageUrl={question.questionImageUrl}
                            studentsAnswer={
                              props.answerSheet.subjectiveAnswers.find(
                                (x: any) => {
                                  return x.question_id === question._id;
                                }
                              ).answerText
                            }
                            maxMarks={question.totalMarks}
                            studentMarks={
                              props?.questionMarks[longIndex]?.marks ?? 0
                            }
                            onMarksChange={(val) => {
                              props.onMarksValueChange(val, longIndex);
                            }}
                            isEdit={true}
                            isAnswerShown={false}

                            // questionMarks={props.questionMarks}
                            // onMarksValueChange={(e: any) => {
                            //   props.onMarksValueChange(e, index);
                            // }}
                          />
                        );
                      case QuestionType.ShortQues.type:
                        const shortIndex =
                          props.answerSheet.subjectiveAnswers.findIndex(
                            (x: any) => {
                              return x.question_id === question._id;
                            }
                          );
                        return (
                          <SubjectiveQuestionResponseCard
                            number={index + 1}
                            question={question.text}
                            answer={question.answer}
                            answerImageUrl={question.answerImageUrl}
                            questionImageUrl={question.questionImageUrl}
                            studentsAnswer={
                              props.answerSheet.subjectiveAnswers.find(
                                (x: any) => {
                                  return x.question_id === question._id;
                                }
                              ).answerText
                            }
                            maxMarks={question.totalMarks}
                            studentMarks={
                              props?.questionMarks[shortIndex]?.marks ?? 0
                            }
                            onMarksChange={(val) => {
                              props.onMarksValueChange(val, shortIndex);
                            }}
                            isEdit={true}
                            isAnswerShown={false}

                            // questionMarks={props.questionMarks}
                            // onMarksValueChange={(e: any) => {
                            //   props.onMarksValueChange(e, index);
                            // }}
                          />
                        );
                      case QuestionType.CaseQues.type:
                        const caseIndex =
                          props.answerSheet.caseStudyAnswers.findIndex(
                            (x: any) => {
                              return x.question_id === question._id;
                            }
                          );
                        return (
                          <SubjectiveQuestionResponseCard
                            number={index + 1}
                            question={question.caseStudyText}
                            answer={question.answer}
                            answerImageUrl={question.answerImageUrl}
                            questionImageUrl={question.questionImageUrl}
                            studentsAnswer={
                              props.answerSheet.caseStudyAnswers.find(
                                (x: any) => {
                                  return x.question_id === question._id;
                                }
                              ).answerText
                            }
                            maxMarks={question.totalMarks}
                            studentMarks={
                              props.caseMarks[caseIndex]?.marks ?? 0
                            }
                            onMarksChange={(val) => {
                              props.onCaseBasedQuestionChange(val, caseIndex);
                              // props.onMarksValueChange(val, index);
                            }}
                            isEdit={true}
                            isAnswerShown={false}
                          />
                        );
                    }
                  })}
                </Stack>
              );
            })}
          </Stack>
        )}
        {props.test.pdfLink === null && (
          <Stack mb={"6rem"}>
            {props.test.questions.map((question: any, index: number) => {
              return (
                <>
                  <McqResponseCard
                    number={index + 1}
                    question={question.text}
                    questionImageUrl={question.questionImageUrl}
                    answers={question.answers}
                    answerImageUrl={question.answerImageUrl}
                    markedAnswer={
                      props.answerSheet.mcqAnswers.find((x: any) => {
                        return x.question_id === question._id;
                      }).option
                    }
                    isMarkedCorrect={
                      props.answerSheet.mcqAnswers.find((x: any) => {
                        return x.question_id === question._id;
                      }).isCorrect
                    }
                  />
                </>
              );
            })}
            {props?.questionMarks &&
              props.test.subjectiveQuestions.map(
                (question: any, index: number) => {
                  return (
                    <>
                      <SubjectiveQuestionResponseCard
                        number={index + 1 + props.test.questions.length}
                        question={question.text}
                        answer={question.answer}
                        answerImageUrl={question.answerImageUrl}
                        questionImageUrl={question.questionImageUrl}
                        studentsAnswer={
                          props.answerSheet.subjectiveAnswers.find((x: any) => {
                            return x.question_id === question._id;
                          }).answerText
                        }
                        maxMarks={question.totalMarks}
                        studentMarks={props?.questionMarks[index]?.marks ?? 0}
                        onMarksChange={(val) => {
                          props.onMarksValueChange(val, index);
                        }}
                        isEdit={true}
                        isAnswerShown={true}

                        // questionMarks={props.questionMarks}
                        // onMarksValueChange={(e: any) => {
                        //   props.onMarksValueChange(e, index);
                        // }}
                      />
                    </>
                  );
                }
              )}
            {props.test.casebasedquestions.map((x: any, i: number) => {
              return (
                <>
                  <CaseResponseCard
                    casebasedText={x.caseStudyText}
                    caseBasedQuestion={x}
                    answersheet={props.answerSheet}
                    index={i}
                    number={
                      i +
                      1 +
                      props.test.questions.length +
                      props.test.subjectiveQuestions.length
                    }
                  />
                </>
              );
            })}
          </Stack>
        )}
      </>
    );
}
