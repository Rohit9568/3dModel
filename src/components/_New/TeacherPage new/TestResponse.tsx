import { Button, Flex, Stack, Text } from "@mantine/core";
import {
  QuestionParentType,
  findQuestionType,
} from "../../../@types/QuestionTypes.d";
import {
  CASEReportQuestionCard,
  MCQReportQuestionCard,
  SubjectiveQuestionCard,
} from "./ReportQuestionCards";
import { useMediaQuery } from "@mantine/hooks";

export function TestResponse(props: {
  testReport: TestReport;
  superSections: {
    name: string;
    sections: any[];
  }[];
  totalNumberOfStudents: number;
  subjectiveMarksChange: (question_id: string, marks: number) => void;
  subjectiveMarks: { question_id: string; marks: number }[];
  onSubmitClick?: () => void;
}) {
  const isMd = useMediaQuery(`(max-width: 820px)`);
  let count = -1;
  return (
    <Stack w="100%" pb={isMd ? 60 : 0}>
      <Text fz={24} fw={700}>
        Questions
      </Text>
      {props.superSections.map((superSection, i) => {
        return (
          <Stack>
            {props.superSections.length > 1 && (
              <Text fz={16} fw={700}>
                {superSection.name}
              </Text>
            )}
            {superSection.sections.map((section, j) => {
              count++;
              return (
                <Stack>
                  <Flex justify="space-between" py={25} pl={10} px={20}>
                    <Text fz={16} fw={700}>
                      {section.name}
                    </Text>
                  </Flex>
                  {section.questions.map((question: any, index: number) => {
                    switch (findQuestionType(question.type).parentType) {
                      case QuestionParentType.MCQQ:
                        return (
                          <MCQReportQuestionCard
                            number={index + 1}
                            question={question?.text} //This may be response
                            answers={question.answers}
                            markedCorrect={
                              props.testReport.sectionWiseDetails[count]
                                .questions[index].markedCorrect
                            }
                            markedUnattempted={
                              props.testReport.sectionWiseDetails[count]
                                .questions[index].unattempted
                            }
                            timeTaken={
                              props.testReport.sectionWiseDetails[count]
                                .questions[index].timeTaken
                            }
                            avgTimeTaken={0}
                            totalNumberOfStudents={props.totalNumberOfStudents}
                            key={index}
                            markedAnswers={
                              props.testReport.sectionWiseDetails[count]
                                .questions[index].options
                            }
                            isSingleReport={true}
                            isCorrect={
                              props.testReport.sectionWiseDetails[count]
                                .questions[index].isCorrect
                            }
                            explaination={question.explaination}
                          />
                        );
                      case QuestionParentType.SUBQ:
                        return (
                          <SubjectiveQuestionCard
                            question={question.text}
                            answer={question.answer}
                            number={index + 1}
                            markedUnattempted={
                              props.testReport.sectionWiseDetails[count]
                                .questions[index].unattempted
                            }
                            markedCorrect={
                              props.testReport.sectionWiseDetails[count]
                                .questions[index].markedCorrect
                            }
                            totalNumberOfStudents={props.totalNumberOfStudents}
                            timeTaken={
                              props.testReport.sectionWiseDetails[count]
                                .questions[index].timeTaken
                            }
                            avgTimeTaken={0}
                            markedAnswers={
                              props.testReport.sectionWiseDetails[count]
                                .questions[index].answerText
                            }
                            isSingleReport={true}
                            marks={
                              props.subjectiveMarks.find(
                                (x) => x.question_id === question._id
                              )?.marks || 0
                            }
                            maxMarks={question.totalMarks}
                            negativeMarks={question.totalNegativeMarks}
                            onMarkChange={
                              props.onSubmitClick
                                ? (val) => {
                                    props.subjectiveMarksChange(
                                      question._id,
                                      val
                                    );
                                  }
                                : undefined
                            }
                            explaination={question.explaination}
                          />
                        );
                      case QuestionParentType.CASEQ:
                        return (
                          <CASEReportQuestionCard
                            id={question.id}
                            questions={question.questions}
                            caseStudyText={question.caseStudyText}
                            number={index + 1}
                            markedUnattempted={
                              props.testReport.sectionWiseDetails[count]
                                .questions[index].unattempted
                            }
                            markedCorrect={
                              props.testReport.sectionWiseDetails[count]
                                .questions[index].markedCorrect
                            }
                            totalNumberOfStudents={props.totalNumberOfStudents}
                            timeTaken={
                              props.testReport.sectionWiseDetails[count]
                                .questions[index].timeTaken
                            }
                            avgTimeTaken={0}
                            markedAnswers={
                              props.testReport.sectionWiseDetails[count]
                                .questions[index].options
                            }
                            isSingleReport={true}
                            isCorrect={
                              props.testReport.sectionWiseDetails[count]
                                .questions[index].isCorrect
                            }
                            explaination={question.explaination}
                          />
                        );
                    }
                  })}
                </Stack>
              );
            })}
          </Stack>
        );
      })}
      {props.onSubmitClick && (
        <Flex
          style={{
            position: "fixed",
            bottom: isMd ? 60 : 0,
            border: "1px solid #e0e0e0",
            left: 0,
          }}
          w="100%"
          justify="center"
          bg="white"
          py={10}
        >
          <Button
            size="lg"
            px={100}
            bg="blue"
            onClick={() => {
              if (props.onSubmitClick) props.onSubmitClick();
            }}
          >
            Submit
          </Button>
        </Flex>
      )}
    </Stack>
  );
}
