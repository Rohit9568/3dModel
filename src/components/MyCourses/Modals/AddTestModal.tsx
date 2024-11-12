import {
  Box,
  Button,
  Checkbox,
  Flex,
  Grid,
  LoadingOverlay,
  Menu,
  MultiSelect,
  NumberInput,
  ScrollArea,
  Select,
  SimpleGrid,
  Stack,
  Text,
} from "@mantine/core";
import { useEffect, useState } from "react";
import { TestListDetails } from "../../../pages/_New/AllTeacherTests";
import {
  crateCopyTest,
  createCourseTest,
  fetchAllTests,
} from "../../../features/test/TestSlice";
import { useMediaQuery } from "@mantine/hooks";
import {
  IconBook,
  IconNotes,
  IconRadiusLeft,
} from "../../_Icons/CustonIcons";
import {
  IconDotsVertical,
  IconDownload,
} from "@tabler/icons";
import { downloadPdf } from "../../_New/Test/DownloadSamplePaper";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../store/ReduxStore";
import { User1 } from "../../../@types/User";
import {
  PaperDifficulity,
  TestDeatils,
  ViewTestBlock,
} from "../../_New/ContentTest";
import { QuestionType } from "../../../@types/QuestionTypes.d";
import {
  fetchClassAndSubjectList,
  fetchCurrentSubjectData,
} from "../../../features/UserSubject/TeacherSubjectSlice";
import { QuestionTypes } from "../../../pages/_New/PersonalizedTest";
import { subjects } from "../../../store/subjectsSlice";
import { convertToRomanNumerals } from "../../../utilities/HelperFunctions";
import useParentCommunication from "../../../hooks/useParentCommunication";
const subjectsActions = subjects.actions;

interface TestInfoCardProps {
  test: TestListDetails;
  className?: string;
  subjectName?: string;
  onClick: () => void;
}
export function TestInfoCard(props: TestInfoCardProps) {
  const isMd = useMediaQuery(`(max-width: 820px)`);
  const [isLoading, setLoading] = useState<boolean>(false);
  const { sendDataToReactnative, isReactNativeActive } =
    useParentCommunication();
  const menuContents = (
    <Box mx={0} w={"100%"} pb={20}>
      <Flex mx={10} px={10} mt={10} direction="column" gap="10px" pb={10}>
        <Flex
          align="center"
          gap="8px"
          onClick={() =>
            downloadPdf(
              props.test._id,
              setLoading,
              user,
              isReactNativeActive(),
              sendDataToReactnative,
              false,
              false,
              false,
              null
            )
          }
        >
          <IconDownload />
          <Text>Download</Text>
        </Flex>
        <Flex
          align="center"
          gap="8px"
          onClick={(e) => {
            props.onClick();
          }}
        >
          <IconNotes />
          <Text>View Test</Text>
        </Flex>
      </Flex>
    </Box>
  );
  const user = useSelector<RootState, User1 | null>((state) => {
    return state.currentUser.user;
  });

  return (
    <>
      <LoadingOverlay visible={isLoading} />
      <Box
        style={{
          width: "100%",
          borderRadius: "12px 12px 12px 12px",
          borderLeft: "15px solid #FCCB25",
        }}
        sx={{
          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Flex
          justify="space-between"
          align="center"
          w="100%"
          px={20}
          mt={20}
          mb={15}
        >
          <Stack spacing={2}>
            {/* First Row */}
            <Flex style={{ alignItems: "center" }}>
              <IconBook col="#3174F3" />
              <Text
                fz={isMd ? 10 : 12}
                fw={400}
                c={"#898989"}
                style={{ marginLeft: "4px" }}
              >
                {props.className || props.test.className}(
                {props.subjectName || props.test.subjectName})
              </Text>
              <Box
                style={{
                  background: props.test.isShared ? "#00c808" : "#FF3F3F",
                  borderRadius: "5px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  padding: "2px 10px",
                  marginLeft: 5,
                }}
              >
                <Text fz={isMd ? 8 : 10} fw={700} c={"#FFF"}>
                  {props.test.isShared ? "Shared" : "Not Shared"}
                </Text>
              </Box>
            </Flex>

            {/* Second Row */}

            <Text fz={isMd ? 18 : 20} fw={500}>
              {props.test.name}
            </Text>

            <Flex align={"center"}>
              <Text w={"100%"} fz={isMd ? 11 : 12} fw={500} c={"#898989"}>
                Total Marks: {props.test.maxMarks} | Total Questions:{" "}
                {props.test.maxQuestions}
              </Text>
              <Flex></Flex>
            </Flex>
          </Stack>
          <Stack align="center">
            <Checkbox
              value={props.test._id}
              styles={{
                input: {
                  border: "black solid 1px",
                  "&:checked": {
                    border: "#1FEFFC solid 1px",
                    background: "#1FEFFC",
                  },

                  cursor: "pointer",
                },
              }}
              size="lg"
            />
            <Flex style={{ width: "60px", justifyContent: "space-evenly" }}>
              <Menu width={isMd ? 150 : 200}>
                <Menu.Target>
                  <Box
                    style={{ cursor: "pointer" }}
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                  >
                    <IconDotsVertical />
                  </Box>
                </Menu.Target>
                <Menu.Dropdown px={0}>
                  <Menu.Item
                    onClick={() =>
                      downloadPdf(
                        props.test._id,
                        setLoading,
                        user,
                        isReactNativeActive(),
                        sendDataToReactnative,
                        false,
                        false,
                        false,
                        null
                      )
                    }
                  >
                    <Flex align="center" gap="8px">
                      <IconDownload />
                      <Text>Download</Text>
                    </Flex>
                  </Menu.Item>
                  <Menu.Item
                    onClick={(e) => {
                      e.stopPropagation();
                      props.onClick();
                    }}
                  >
                    <Flex align="center" gap="8px">
                      <IconNotes />
                      <Text>View Test</Text>
                    </Flex>
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            </Flex>
          </Stack>
        </Flex>
      </Box>
    </>
  );
}

export function AddTestModal(props: {
  addTestHandler: (test: any) => void;
  onCancelClick: () => void;
}) {
  const [allTests, setAllTests] = useState<TestListDetails[] | null>(null);
  const isMd = useMediaQuery(`(max-width: 820px)`);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedTests, setSelectedTests] = useState<string[]>([]);
  const [chapterList, setChapterList] = useState<
    { value: string; label: string }[]
  >([]);
  const [testChapters, setTestChapters] = useState<string[]>([]);
  const [testDetails, setTestDetails] = useState<TestDeatils>({
    subject_id: "",
    chapter_ids: [],
    name: "",
    testDate: null,
    startTime: null,
    endTime: null,
    maxQuestions: 0,
    maxMarks: 0,
    difficulity: PaperDifficulity.Medium,
    questions: [],
    subjectiveQuestions: [],
    questionType: QuestionType.McqQues.type,
    isSamplePaper: false,
    caseBasedQuestions: [],
  });
  const [noOfTests, setNoofTests] = useState<number>(0);

  const userSubjects = useSelector<RootState, UserClassAndSubjects[]>(
    (state) => {
      return state.subjectSlice.userSubjects;
    }
  );
  const today = new Date(Date.now());


  function createCopy() {
    crateCopyTest({
      formObj: {
        tests: selectedTests,
        date: today.getTime(),
      },
    })
      .then((x) => {
        props.addTestHandler(x);
      })
      .catch((e) => {
        console.log(e);
      });
  }


  function fetchTests() {
    setLoading(true);
    fetchAllTests()
      .then((data: any) => {
        setLoading(false);
        setAllTests(data.tests);
      })
      .catch((error) => {
        setLoading(false);
        console.log(error);
      });
  }
  useEffect(() => {
    fetchTests();
  }, []);

  function isValidTest() {
      return selectedTests.length > 0;
  }

  const [viewTest, setViewTest] = useState<string | null>(null);
  return (
    <>
      <Stack
        h={viewTest ? "80vh" : "70vh"}
        style={{
          position: "relative",
        }}
        w={isMd ? "85vw" : viewTest ? "60vw" : "30vw"}
      >
        <ScrollArea h={viewTest ? "70vh" : "calc(70vh - 70px)"}>
          {(
            <>
              {viewTest === null && (
                <>
                  <SimpleGrid cols={1} mt={10} mb={10} w="100%">
                    {allTests?.map((x) => {
                      return (
                        <>
                          <Checkbox.Group
                            value={selectedTests}
                            onChange={setSelectedTests}
                            size="lg"
                            onClick={() => {
                              setSelectedTests((prev) => {
                                const foundIndex = prev.findIndex(
                                  (y) => y === x._id
                                );
                                if (foundIndex !== -1) {
                                  const prev1 = [...prev];
                                  prev1.splice(foundIndex, 1);
                                  return prev1;
                                } else {
                                  const prev1 = [...prev];
                                  prev1.push(x._id);
                                  return prev1;
                                }
                              });
                            }}
                          >
                            <TestInfoCard
                              test={x}
                              onClick={() => {
                                setViewTest(x._id);
                              }}
                            />
                          </Checkbox.Group>
                        </>
                      );
                    })}
                  </SimpleGrid>
                  <Flex
                    justify="center"
                    style={{
                      position: "fixed",
                      background: "white",
                      bottom: 0,
                      left: 0,
                      boxShadow: "0px 0px 32px 0px rgba(0, 0, 0, 0.25)",
                    }}
                    w="100%"
                    py={20}
                  >
                    <Button
                      variant="outline"
                      style={{
                        border: "1px solid #808080",
                        borderRadius: "24px",
                        color: "#000",
                      }}
                      mr={10}
                      size="lg"
                      onClick={() => {
                        props.onCancelClick();
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      bg="#4B65F6"
                      style={{ borderRadius: "24px" }}
                      size="lg"
                      onClick={createCopy}
                      disabled={!isValidTest()}
                      sx={{
                        "&:hover": {
                          backgroundColor: "#3C51C5",
                        },
                      }}
                    >
                      Add to course
                    </Button>
                  </Flex>
                </>
              )}
              {viewTest !== null && (
                <Grid
                  w="100%"
                  // mt={30}
                >
                  {!isMd && (
                    <Grid.Col span={1} pl={30} pt={20}>
                      <Box
                        onClick={() => {
                          setViewTest(null);
                        }}
                        style={{
                          cursor: "pointer",
                        }}
                      >
                        <IconRadiusLeft />
                      </Box>
                    </Grid.Col>
                  )}
                  <Grid.Col
                    span={isMd ? 12 : 10}
                  >
                    <Box w="100%" mx={isMd ? 5 : 20} mb={isMd ? 5 : 30}>
                      <ViewTestBlock
                        test_id={viewTest}
                        onBackClick={() => {
                          setViewTest(null);
                        }}
                      />
                    </Box>
                  </Grid.Col>
                </Grid>
              )}
            </>
          )}
        </ScrollArea>
      </Stack>
    </>
  );
}
