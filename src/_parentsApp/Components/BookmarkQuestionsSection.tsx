import {
  Box,
  Center,
  Image,
  LoadingOverlay,
  Select,
  Stack,
  Text,
} from "@mantine/core";
import { useEffect, useState } from "react";
import {
  CASEReportQuestionCard,
  McqQuestionCard,
  SubjectiveQuestionCard,
} from "./BookmarkQuestionCard";
import { getAllBookmarkedQuestions } from "../../features/test/TestSlice";
import {
  QuestionParentType,
  findQuestionType,
} from "../../@types/QuestionTypes.d";

interface BookmarkResponse {
  question: McqQuestion | SubjectiveQuestion | CaseBasedQuestion;
  student: string;
  test: {
    _id: string;
    name: string;
  };
  _id: string;
}

const BookmarkQuestionsSection = (props: { studentId: string }) => {
  const [selectTest, setSelectTestMap] = useState<Map<string, string>>(
    new Map([["1", "All Test"]])
  );
  const [response, setResponse] = useState<BookmarkResponse[] | null>([]);
  const [allFilteredQuestions, setAllFilteredQuestions] = useState<
    BookmarkResponse[] | null
  >([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    setTimeout(() => {
      if (typeof window?.MathJax !== "undefined") {
        window.MathJax.typesetClear();
        window.MathJax.typeset();
      }
    }, 500);
  }, [allFilteredQuestions]);

  useEffect(() => {
    fetchBookmarkList();
  }, []);

  function fetchBookmarkList() {
    getAllBookmarkedQuestions({ studentId: props.studentId })
      .then((resp: any) => {
        setIsLoading(false);
        const data = resp
          .filter((innerItem: any) => {
            return (
              innerItem.caseBasedQuestion != null ||
              innerItem.subjectiveQuestion ||
              innerItem.mcqQuestion != null
            );
          })
          .map((item: any) => {
            if (
              findQuestionType(item.questionType).parentType ==
              QuestionParentType.SUBQ
            ) {
              return { ...item, question: item.subjectiveQuestion };
            } else if (
              findQuestionType(item.questionType).parentType ==
              QuestionParentType.CASEQ
            ) {
              return { ...item, question: item.caseBasedQuestion };
            } else {
              return { ...item, question: item.mcqQuestion };
            }
          });
          console.log(data);
        setResponse(data);
        setAllFilteredQuestions(data);
        setSelectTestMap((prev) => {
          const newMap = new Map(prev);
          data.forEach((item: any) => {
            if (!newMap.has(item.testId)) {
              newMap.set(item.test._id, item.test.name);
            }
          });
          return newMap;
        });
      })
      .catch((e) => {
        console.log(e);
        setIsLoading(false);
      });
  }

  const handleSelectChange = (testId: string) => {
    if (testId === "1") {
      setAllFilteredQuestions(response);
      return;
    }
    const result =
      response?.filter((BMQUE) => BMQUE.test._id === testId) || null;
    setAllFilteredQuestions(result);
  };

  return (
    <>
      <LoadingOverlay visible={isLoading} />
      {response && response?.length > 0 && (
        <Select
          label="Select Test"
          placeholder="Select Test"
          data={Array.from(selectTest).map(([id, name]) => ({
            label: name,
            value: id,
          }))}
          onChange={handleSelectChange}
          w={200}
          defaultValue={"1"}
        />
      )}
      <Box
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
        pb={100}
      >
        {response && response?.length > 0 ? (
          <Stack style={{ width: "100%" }}>
            {allFilteredQuestions &&
              allFilteredQuestions.map((bookmarkedQuestionObject, index) => {
                switch (
                  findQuestionType(bookmarkedQuestionObject.question.type)
                    .parentType
                ) {
                  case QuestionParentType.MCQQ:
                    return (
                      <McqQuestionCard
                        index={index + 1}
                        bmqId={bookmarkedQuestionObject._id}
                        question={bookmarkedQuestionObject.question.text}
                        answers={
                          (bookmarkedQuestionObject.question as McqQuestion)
                            .answers
                        }
                        explaination={
                          bookmarkedQuestionObject.question.explaination
                        }
                        studentId={bookmarkedQuestionObject.student}
                        testId={bookmarkedQuestionObject.test._id}
                        testName={bookmarkedQuestionObject.test.name}
                        questionId={bookmarkedQuestionObject.question._id}
                        bookmarkMarkQuestionId={bookmarkedQuestionObject._id}
                        onQuestionChange={() => {
                          fetchBookmarkList();
                        }}
                      />
                    );
                  case QuestionParentType.SUBQ:
                    return (
                      <SubjectiveQuestionCard
                        index={index + 1}
                        bmqId={bookmarkedQuestionObject._id}
                        question={bookmarkedQuestionObject.question.text}
                        answer={
                          (
                            bookmarkedQuestionObject.question as SubjectiveQuestion
                          ).answer
                        }
                        explaination={
                          bookmarkedQuestionObject.question.explaination
                        }
                        studentId={bookmarkedQuestionObject.student}
                        testId={bookmarkedQuestionObject.test._id}
                        testName={bookmarkedQuestionObject.test.name}
                        questionId={bookmarkedQuestionObject.question._id}
                        bookmarkMarkQuestionId={bookmarkedQuestionObject._id}
                        onMarkChange={true}
                        onQuestionChange={() => {
                          fetchBookmarkList();
                        }}
                      />
                    );
                  case QuestionParentType.CASEQ:
                    return (
                      <CASEReportQuestionCard
                        index={index + 1}
                        bmqId={bookmarkedQuestionObject._id}
                        questionText={bookmarkedQuestionObject.question.text}
                        questions={
                          (
                            bookmarkedQuestionObject.question as CaseBasedQuestion
                          ).questions
                        }
                        explaination={
                          bookmarkedQuestionObject.question.explaination
                        }
                        studentId={bookmarkedQuestionObject.student}
                        testId={bookmarkedQuestionObject.test._id}
                        testName={bookmarkedQuestionObject.test.name}
                        questionId={bookmarkedQuestionObject.question._id}
                        bookmarkMarkQuestionId={bookmarkedQuestionObject._id}
                        onQuestionChange={() => {
                          fetchBookmarkList();
                        }}
                      />
                    );
                }
              })}
          </Stack>
        ) : (
          <Box>
            <Center h="80vh">
              <Stack align="center">
                <Box
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "#EEF4FF",
                    padding: "20px",
                    borderRadius: "100%",
                  }}
                >
                  <Image
                    src={require("../../assets/Q&A.png")}
                    width={40}
                    height={40}
                  />
                </Box>
                <Text fz={17} fw={400} style={{ color: "#606060" }}>
                  No Questions Added Yet!
                </Text>
                <Text fz={13} fw={300} style={{ color: "#BABABA" }}>
                  Start taking test today to get valuable analysis.
                </Text>
              </Stack>
            </Center>
          </Box>
        )}
      </Box>
    </>
  );
};

export default BookmarkQuestionsSection;
