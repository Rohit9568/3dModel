import {
  Badge,
  Box,
  Center,
  Flex,
  LoadingOverlay,
  Stack,
  Table,
  Text,
  createStyles,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { IconChevronLeft } from "@tabler/icons";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { User1 } from "../../../@types/User";
import { fetchTestResults } from "../../../features/test/AnswerSheetSlice";
import { fetchFullTest } from "../../../features/test/TestSlice";
import { RootState } from "../../../store/ReduxStore";
import {
  calculatePercentage,
  convertDateToHMS,
  convertMillisecondsToHMS,
} from "../../../utilities/HelperFunctions";
import { IconDownload } from "../../_Icons/CustonIcons";
import { TestDeatils } from "../ContentTest";
import { downloadRankList } from "../RankingListPdf/RankingListPdf";
import useParentCommunication from "../../../hooks/useParentCommunication";

interface TestRankingProps {
  testId: string;
  onBackClicked: () => void;
}

const useStyles = createStyles((theme) => ({
  tahead: {
    fontSize: theme.breakpoints.md ? 16 : 25,
  },
  tadata: {
    fontSize: theme.breakpoints.md ? 16 : 25,
  },
}));
const TestRanking = (props: TestRankingProps) => {
  const [answerSheets, setAnswerSheets] = useState<any[]>([]);
  const [test, setTest] = useState<TestDeatils>();
  const { sendDataToReactnative, isReactNativeActive } =
  useParentCommunication();

  const { classes } = useStyles();

  const sortedAnswerSheets = answerSheets
    .filter(
      (answerSheet) =>
        answerSheet.isChecked !== null && answerSheet.isChecked !== false
    )
    .sort((a, b) => {
      const totalMarksComparison =
        b.testReportId.totalMarks - a.testReportId.totalMarks;
      if (totalMarksComparison === 0) {
        const timeTakenComparison =
          a.testReportId.totalTimeTaken - b.testReportId.totalTimeTaken;
        return timeTakenComparison;
      }
      return totalMarksComparison;
    });

  useEffect(() => {
    const fetchAnswerSheets = async () => {
      fetchTestResults(props.testId)
        .then((answerSheetsResponse: any) => {
          setAnswerSheets(answerSheetsResponse);
        })
        .catch((error) => {
          console.log(error);
        });
    };
    fetchAnswerSheets();
  }, [props.testId]);

  useEffect(() => {
    fetchFullTest(props.testId)
      .then((testResponse: any) => {
        setTest(testResponse);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [props.testId]);

  const isMd = useMediaQuery(`(max-width: 820px)`);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const user = useSelector<RootState, User1 | null>((state) => {
    return state.currentUser.user;
  });
  return (
    <>
      <Stack w="100%" pb={72} fz={isMd ? 16 : 20}>
        <Flex justify="space-between" align="center" w="100%" px={20} py={20}>
          <Flex align="center">
            <IconChevronLeft
              onClick={props.onBackClicked}
              style={{ cursor: "pointer" }}
            />
            {test && (
              <Text size="xl" weight={700} fz={isMd ? 16 : 24}>
                Test Ranking({test.name})
              </Text>
            )}
          </Flex>
          <Box
            w={isMd ? 30 : 40}
            h={isMd ? 30 : 40}
            onClick={() => {
              if (user?.instituteId && test?.name)
                downloadRankList(
                  isLoading,
                  setIsLoading,
                  sortedAnswerSheets,
                  user?.instituteId,
                  test?.name,
                  test.maxMarks,
                  isReactNativeActive(),
                  sendDataToReactnative
                );
            }}
            style={{
              cursor: "pointer",
            }}
            display={sortedAnswerSheets.length === 0 ? "none" : "block"}
          >
            <IconDownload size={isMd ? "32" : "42"} />
          </Box>
        </Flex>
        {sortedAnswerSheets.length === 0 && (
          <Center
            w="100%"
            h="60vh"
            display={sortedAnswerSheets.length === 0 ? "block" : "none"}
          >
            <Stack justify="center" align="center">
              <img
                src={require("../../../assets/empty result page.gif")}
                height="140px"
                width="140px"
              />
              <Text fw={500} fz={20} color="#C9C9C9">
                No AnswerSheet Found
              </Text>
            </Stack>
          </Center>
        )}
        {sortedAnswerSheets.length > 0 && (
          <Flex
            px={isMd ? 10 : 30}
            display={sortedAnswerSheets.length === 0 ? "none" : "block"}
          >
            <Table withBorder withColumnBorders>
              <thead
                style={{
                  fontSize: isMd ? 16 : 20,
                }}
              >
                <tr>
                  <th
                    style={{
                      fontSize: isMd ? 16 : 18,
                      padding: "10px 3px",
                      textAlign: "center",
                    }}
                  >
                    Rank
                  </th>
                  <th
                    style={{
                      fontSize: isMd ? 16 : 18,
                      padding: "10px 3px",
                      textAlign: "center",
                    }}
                  >
                    Student Name
                  </th>
                  <th
                    style={{
                      fontSize: isMd ? 16 : 18,
                      padding: "10px 3px",
                      textAlign: "center",
                    }}
                  >
                    Marks Scored
                  </th>
                  <th
                    style={{
                      fontSize: isMd ? 16 : 18,
                      padding: "10px 3px",
                      textAlign: "center",
                    }}
                  >
                    {isMd ? "%age" : "Percentage"}
                  </th>
                  {!isMd && (
                    <th
                      style={{
                        fontSize: isMd ? 16 : 18,
                        padding: "10px 3px",
                        textAlign: "center",
                      }}
                    >
                      Start Time
                    </th>
                  )}
                  <th
                    style={{
                      fontSize: isMd ? 16 : 18,
                      padding: "10px 3px",
                      textAlign: "center",
                    }}
                  >
                    Duration
                  </th>
                </tr>
              </thead>
              <tbody
                style={{
                  fontSize: isMd ? 16 : 20,
                }}
              >
                {sortedAnswerSheets.map((answerSheet, index) => (
                  <tr
                    key={answerSheet._id}
                    style={{
                      fontSize: isMd ? 16 : 20,
                    }}
                  >
                    <td
                      style={{
                        fontSize: isMd ? 14 : 16,
                      }}
                    >
                      {index + 1}.
                    </td>
                    <td
                      style={{
                        fontSize: isMd ? 14 : 16,
                      }}
                    >
                      {answerSheet.student_id.name}
                    </td>
                    <td
                      style={{
                        fontSize: isMd ? 14 : 16,
                      }}
                    >
                      {answerSheet.testReportId.totalMarks.toFixed(2)}
                    </td>
                    <td
                      style={{
                        fontSize: isMd ? 14 : 16,
                      }}
                    >
                      <Badge
                        color={
                          parseInt(
                            calculatePercentage(
                              answerSheet.testReportId.totalMarks,
                              test?.maxMarks ?? 1
                            )
                          ) >= 33
                            ? `teal`
                            : "red"
                        }
                      >
                        {calculatePercentage(
                          answerSheet.testReportId.totalMarks,
                          test?.maxMarks ?? 1
                        )}
                        %
                      </Badge>
                    </td>
                    {!isMd && (
                      <td
                        style={{
                          fontSize: isMd ? 14 : 16,
                        }}
                      >
                        {convertDateToHMS(new Date(answerSheet.createdAt))}
                      </td>
                    )}
                    <td
                      style={{
                        fontSize: isMd ? 14 : 16,
                      }}
                    >
                      {convertMillisecondsToHMS(
                        answerSheet.testReportId.totalTimeTaken * 1000
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Flex>
        )}
      </Stack>
      <LoadingOverlay visible={isLoading} />
    </>
  );
};

export default TestRanking;
