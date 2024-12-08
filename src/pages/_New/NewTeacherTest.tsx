import {
  Box,
  Button,
  Center,
  Flex,
  Grid,
  LoadingOverlay,
  Modal,
  ScrollArea,
  Stack,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { BackButtonWithCircle } from "../../components/_Icons/CustonIcons";
import { TestScreen, ViewTestBlock } from "../../components/_New/ContentTest";
import { EditTest } from "../../components/_New/TeacherPage new/EditTest";
import { TeacherSideReports } from "../../components/_New/TeacherPage new/TeacherSideReports";
import { TeacherSideResponses } from "../../components/_New/TeacherPage new/TeacherSideResponses";
import TestRanking from "../../components/_New/TeacherPage new/TestRanking";
import ViewTeacherTests1 from "../../components/_New/TeacherPage new/ViewTeacherTests1";
import {
  createTestwithQuestions,
  editTestQuestions,
  fetchAllTests,
  fetchFullTest,
} from "../../features/test/TestSlice";
import { RootState } from "../../store/ReduxStore";
import { subjects } from "../../store/subjectsSlice";
import { IsUserLoggedIn } from "../../utilities/AuthUtility";
import { TestListDetails } from "./AllTeacherTests";
import { CreateTestModal, customTemplate } from "./CreateTestModal";
import { PersonalizedTest, TestStep } from "./PersonalizedTest";
import ViewResources from "./ViewResources";
import { NewCreateTest } from "./NewCreateTest";
const subjectsActions = subjects.actions;

export enum TestSettingsModal {
  CreateTest = "Create Test",
  EditTest = "Edit Test",
  CopyTest = "Copy Test",
  NULL = "NULL",
}

export enum TestType {
  Personalized = "Personalized",
  PreDefined = "Predefined",
}

export function NewTeacherTest(props: { onlogout: () => void }) {
  const isMd = useMediaQuery(`(max-width: 820px)`);
  const [allTests, setAllTests] = useState<TestListDetails[] | null>(null);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [viewTestId, setViewTestId] = useState<string>();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const paramValue = queryParams.get("isCreate");
  const [testScreen, setTestScreen] = useState<TestScreen>(TestScreen.Default);
  const [createTestModal, setCreateTestModal] = useState<TestSettingsModal>(
    TestSettingsModal.NULL
  );

  const [testStep, setTestStep] = useState<TestStep>(TestStep.SelectTemplate);

  const mainPath = useSelector<RootState, string | null>((state) => {
    return state.mainPathSlice.value;
  });
  const testId = queryParams.get("testId");
  const navigate = useNavigate();
  const [testData, setTestData] = useState<null | TestBasicSettings>(null);
  const [newTestData, setNewTestData] = useState<null | TestBasicSettings>(
    null
  );
  const [isEditTestSelected, setIsEditTestSelected] = useState<boolean>(false);
  useEffect(() => {
    if (IsUserLoggedIn() === false) {
      navigate("/");
    }
    fetchTests();
  }, []);

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
    if (testScreen === TestScreen.Default) {
      fetchTests();
    }
  }, [testScreen]);

  useEffect(() => {
    if (testId) {
      setTestScreen(TestScreen.ViewTest);
      setViewTestId(testId);
    }
  }, [testId]);


  function closeModal() {
    setCreateTestModal(TestSettingsModal.NULL);
  }
  function createnewTestDialogHandler(data: TestBasicSettings) {
    setTestScreen(TestScreen.CreateFinalTest);
    setNewTestData(data);
    navigate(
      `${mainPath}/test?isCreate=true&&duration=${data.duration}${
        data.selectedTestTemplate !== customTemplate
          ? `&&templateId=${data.selectedTestTemplate}`
          : ""
      }`
    );
    if (data.selectedTestTemplate !== customTemplate) {
      setTestStep(TestStep.EditQuestions);
    } else {
      setTestStep(TestStep.SelectTemplate);
    }
    closeModal();
  }
  function editTestDialogHandler(data: TestBasicSettings) {
    setNewTestData(data);
    setTestScreen(TestScreen.EditTest);
    setIsEditTestSelected(true);
    closeModal();
  }
  function copyTestDialogHandler(data: TestBasicSettings) {
    setNewTestData(data);
    setTestScreen(TestScreen.EditTest);
    setIsEditTestSelected(false);
    closeModal();
  }

  function editTest(finaltest2: any) {
    setLoading(true);
    editTestQuestions({
      formObj: {
        ...finaltest2,
        name: newTestData?.name,
        duration: (newTestData?.duration??0)*60,
        startTime: newTestData?.startTime,
        isEnableMultipleTestAttempts: newTestData?.isEnableMultipleTestAttempts,
      },
      id: viewTestId!!,
    })
      .then((data: any) => {
        setLoading(false);
        fetchTests();
        setTestScreen(TestScreen.NewScreen);
        window.scrollTo(0, 0);
      })
      .catch((error) => {
        setLoading(false);
        console.log(error);
      });
  }
  function copyTest(finaltest2: any) {
    const today = new Date(Date.now());
    setLoading(true);
    createTestwithQuestions({
      formObj: {
        ...finaltest2,
        name: newTestData?.name,
        duration: newTestData?.duration ? newTestData?.duration * 60 : null,
        startTime: newTestData?.startTime,
        isEnableMultipleTestAttempts: newTestData?.isEnableMultipleTestAttempts,
        date: today.getTime(),
      },
    })
      .then((x) => {
        setLoading(false);
        console.log(x);
        setTestScreen(TestScreen.Default);
      })
      .catch((e) => {
        setLoading(false);
        console.log(e);
      });
  }
  useEffect(() => {
    if (
      createTestModal === TestSettingsModal.EditTest ||
      createTestModal === TestSettingsModal.CopyTest
    ) {
      fetchFullTest(viewTestId || "")
        .then((data: any) => {
          setTestData({
            ...data,
            selectedTestTemplate: customTemplate,
            startTime: data.testScheduleTime
              ? new Date(data.testScheduleTime)
              : null,
            duration: parseInt(data.duration)/60,
          });
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [createTestModal]);
  return (
    <>
      <LoadingOverlay visible={isLoading} />
      <Flex justify="center" w="100%">
        <Stack
          w="100%"
          style={{
            alignItems: "center",
          }}
          h="100dvh"
        >
          <Stack
            w="100%"
            style={{
              alignItems: "center",
            }}
            h={isMd ? "calc(100% - 70px)" : "100%"}
            //mt={isMd ? 60 : 0}
          >
            {(testScreen === TestScreen.Default ||
              testScreen === TestScreen.CreateTest ||
              testScreen === TestScreen.NewScreen) && (
              <>
                {allTests && allTests.length !== 0 && (
                  <ScrollArea w={isMd ? "100%" : "100%"}>
                    <ViewTeacherTests1
                      setTestScreen={(val) => {
                        setTestScreen(val);
                      }}
                      allTests={allTests}
                      setAllTests={setAllTests}
                      setViewTestId={setViewTestId}
                      setIsLoading={setLoading}
                      onDeleteTestClicked={() => {
                        fetchTests();
                      }}
                      onEditTestClicked={() => {
                        setCreateTestModal(TestSettingsModal.EditTest);
                      }}
                      onCopyTestClicked={() => {
                        setCreateTestModal(TestSettingsModal.CopyTest);
                      }}
                      onCreateTestClicked={() => {
                        setCreateTestModal(TestSettingsModal.CreateTest);
                      }}
                    />
                  </ScrollArea>
                )}
                {allTests && allTests.length === 0 && (
                  <Center w="100%" h="100%">
                    <Stack>
                      <img src={require("../../assets/emptyTest.png")} />
                      <Button
                        size="md"
                        onClick={() => {
                          setCreateTestModal(TestSettingsModal.CreateTest);
                        }}
                        bg="#4B65F6"
                      >
                        Create Test
                      </Button>
                    </Stack>
                  </Center>
                )}
              </>
            )}
            {testScreen === TestScreen.CreateFinalTest && newTestData && (
              <>
                <PersonalizedTest
                  testName={newTestData.name}
                  setTestScreen={setTestScreen}
                  startTime={
                    newTestData.startTime !== null
                      ? newTestData.startTime
                      : null
                  }
                  onTestCreation={() => {
                    // onModalClose();
                  }}
                  setTestStep={setTestStep}
                  testStep={testStep}
                  isEnableMultipleTestAttempts={
                    newTestData.isEnableMultipleTestAttempts
                  }
                />
              </>
            )}

            {testScreen === TestScreen.RankingList && viewTestId && (
              <>
                <TestRanking
                  testId={viewTestId}
                  onBackClicked={() => {
                    setTestScreen(TestScreen.NewScreen);
                  }}
                />
              </>
            )}
            {testScreen === TestScreen.EditTest && (
              <EditTest
                testId={viewTestId || ""}
                onBackClick={() => {
                  fetchTests();
                  setTestScreen(TestScreen.NewScreen);
                  window.scrollTo(0, 0);
                }}
                setIsLoading={setLoading}
                onTestEdit={(val) => {
                  if (isEditTestSelected) editTest(val);
                  else copyTest(val);
                }}
                titleTxt={isEditTestSelected ? "Edit Test" : "Copy Test"}
                isEditTest={isEditTestSelected}
              />
            )}
            {(testScreen === TestScreen.ViewTest ||
              testScreen === TestScreen.ViewReport ||
              testScreen === TestScreen.ViewResponse ||
              testScreen === TestScreen.ViewResources) && (
              <Stack w={isMd ? "100%" : "90%"} mt={50}>
                {testScreen === TestScreen.ViewTest && (
                  <>
                    <Grid
                      w="100%"
                      // mt={30}
                    >
                      {!isMd && (
                        <Grid.Col span={1}>
                          <Box
                            w={40}
                            onClick={() => {
                              setTestScreen(TestScreen.NewScreen);
                            }}
                          >
                            <BackButtonWithCircle />
                          </Box>
                        </Grid.Col>
                      )}
                      <Box w={isMd ? "100%" : "75%"} mx={20} mb={30}>
                        <ViewTestBlock
                          test_id={viewTestId ?? ""}
                          onBackClick={() => setTestScreen(TestScreen.Default)}
                        />
                      </Box>
                    </Grid>
                  </>
                )}
                {testScreen === TestScreen.ViewReport && (
                  <Grid w="100%" px={isMd ? 30 : 0}>
                    <TeacherSideReports
                      testId={viewTestId || ""}
                      setIsLoading={setLoading}
                      onBackClick={() => {
                        window.scrollTo(0, 0);
                        setTestScreen(TestScreen.Default);
                      }}
                    />
                  </Grid>
                )}
                {testScreen === TestScreen.ViewResponse && viewTestId && (
                  <Grid w="100%" px={isMd ? 30 : 0}>
                    <TeacherSideResponses
                      testId={viewTestId}
                      onBackClick={() => {
                        window.scrollTo(0, 0);
                        setTestScreen(TestScreen.Default);
                      }}
                    />
                  </Grid>
                )}
                {testScreen === TestScreen.ViewResources && (
                  <ViewResources
                    testId={viewTestId || ""}
                    fromTeacherPage={true}
                    onbackClick={() => {
                      setTestScreen(TestScreen.Default);
                      window.scrollTo(0, 0);
                    }}
                  />
                )}
              </Stack>
            )}
          </Stack>
        </Stack>
      </Flex>
      <Modal
        opened={createTestModal !== TestSettingsModal.NULL}
        onClose={() => {
          // onModalClose();zz
          closeModal();
        }}
        centered
        title={createTestModal}
        styles={{
          title: {
            fontSize: 20,
            fontWeight: 700,
          },
        }}
        size={isMd ? "md" : "md"}
      >
        <CreateTestModal
          testScreen={testScreen}
          onSubmitClick={(val) => {
            switch (createTestModal) {
              case TestSettingsModal.CreateTest:
                createnewTestDialogHandler(val);
                break;
              case TestSettingsModal.EditTest:
                editTestDialogHandler(val);
                break;
              case TestSettingsModal.CopyTest:
                copyTestDialogHandler(val);
                break;
            }
          }}
          testData={testData}
          onClose={() => {
            // setCreateTestModal(TestSettingsModal.NULL);
          }}
          setTestData={setTestData}
          btnText={createTestModal}
        />
      </Modal>
    </>
  );
}
