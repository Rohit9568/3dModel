import {
  Box,
  Button,
  Flex,
  Modal,
  Paper,
  SimpleGrid,
  Stack,
  Text,
  useMantineTheme,
  Checkbox,
  TextInput,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { showNotification } from "@mantine/notifications";
import { IconDownload } from "@tabler/icons";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { User1 } from "../../../@types/User";
import createTestsSideIcon from "../../../assets/createTestsSideIcon.png";
import { deleteTest } from "../../../features/test/TestSlice";
import { TestListDetails } from "../../../pages/_New/AllTeacherTests";
import { AppDispatch, RootState } from "../../../store/ReduxStore";

import { isPremiumModalOpened } from "../../../store/premiumModalSlice";
import {
  convertToRomanNumerals,
  isGapMoreThanOneWeek,
} from "../../../utilities/HelperFunctions";
import { WebAppEvents } from "../../../utilities/Mixpanel/AnalyticeEventWebApp";
import { Mixpanel } from "../../../utilities/Mixpanel/MixpanelHelper";
import { TestScreen } from "../ContentTest";
import { TestInfoCard } from "./TestInfoCard";
import useParentCommunication from "../../../hooks/useParentCommunication";
import { downloadPdf } from "../Test/DownloadSamplePaper";
import { GetAllClassesForUser } from "../../../_parentsApp/features/instituteUserSlice";
const isPremiumModalOpenedActions = isPremiumModalOpened.actions;

interface CreateTestTitleCardProps {
  numberOfTests: string;
  setTestScreen: (input: TestScreen) => void;
  onCreateTestClicked: () => void;
}

export function CreateTestTitleCard(props: CreateTestTitleCardProps) {
  const theme = useMantineTheme();
  const isSm = useMediaQuery(`(max-width: ${theme.breakpoints.sm}px)`);
  const isMd = useMediaQuery(`(max-width: 820px)`);
  const isLg = useMediaQuery(`(max-width: 990px)`);
  return (
    <Paper
      mt={20}
      style={{
        // width: isSm ? "95vw" : isMd ? "85vw" : isLg ? "80vw" : "70vw",
        // height: isSm ? "160px" : isMd ? "180px" : isLg ? "200px" : "220px",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <Box
        style={{
          width: "100%",
          height: "90%",
          borderRadius: "28px",
          background: "#4B65F6",
        }}
      >
        <SimpleGrid
          cols={2}
          style={{
            display: "flex",
            justifyContent: "space-between",
            height: "100%",
          }}
        >
          {/* First Column */}
          <Box
            my={20}
            ml={isSm ? 14 : isMd ? 16 : isLg ? 18 : 20}
            style={{
              display: "flex",
              justifyContent: "space-around",
              flexDirection: "column",
            }}
          >
            <Text
              fz={isSm ? 16 : isMd ? 20 : isLg ? 25 : 30}
              fw={isMd ? 700 : 700}
              c={"#FFF"}
            >
              Elevate Your Teaching
            </Text>

            <Text mb={30} mt={3} fz={isMd ? 14 : 18} c={"#FFF"}>
              Create and Share Tests with Your Students
            </Text>
            <Button
              w={140}
              variant="outline"
              style={{ borderColor: "#FFF" }}
              c={"#FFF"}
              onClick={() => {
                props.onCreateTestClicked();
              }}
            >
              Create Test
            </Button>
          </Box>

          {/* Second Column */}
          <Flex align={"center"}>
            <img
              src={createTestsSideIcon}
              alt="Create Test Icon"
              style={{ width: "100%" }}
            />
          </Flex>
        </SimpleGrid>
      </Box>
      <Box
        style={{
          width: isMd ? "87%" : "95%",
          height: isMd ? "7%" : "8%",
          borderRadius: " 0 0 28px 28px",
          background: "#3174F3",
          opacity: "0.3",
          justifyItems: "center",
        }}
      ></Box>
    </Paper>
  );
}

interface ViewTeacherTestsProps {
  setTestScreen: (input: TestScreen) => void;
  allTests: TestListDetails[];
  setAllTests: (input: TestListDetails[]) => void;
  setViewTestId: (input: string) => void;
  setIsLoading: (input: boolean) => void;
  onDeleteTestClicked: () => void;
  onEditTestClicked: () => void;
  onCopyTestClicked: () => void;
  onCreateTestClicked: () => void;
}

enum TestDownloadOptions {
  INSTRUCTIONS = "Instructions",
  BORDER = "Border",
  SOLUTIONS = "Solutions",
  WATERMARK = "Watermark",
}

const ViewTeacherTests1 = (props: ViewTeacherTestsProps) => {
  const theme = useMantineTheme();
  const isSm = useMediaQuery(`(max-width: 700px)`);
  const isMd = useMediaQuery(`(max-width: 820px)`);
  const isLg = useMediaQuery(`(max-width: 990px)`);
  const user = useSelector<RootState, User1 | null>((state) => {
    return state.currentUser.user;
  });
  const dispatch = useDispatch<AppDispatch>();

  const [waterMarkText, setWatermarkText] = useState<string | null>(
    user?.instituteName ?? ""
  );

  const [values, setValues] = useState<string[]>([]);
  const { sendDataToReactnative, isReactNativeActive } =
    useParentCommunication();

  const [isDownloadTestClicked, setisDownloadTestClicked] = useState<
    null | any
  >(null);
  const [allClasses, setClasses] = useState<
    {
      label: string;
      value: string;
    }[]
  >([]);

  function changeShareTestUI(testId: string, value: boolean) {
    props.setAllTests(
      props.allTests.map((x) => {
        if (x._id === testId)
          return { ...x, isShared: value, sharedPreviously: true };
        else return x;
      })
    );
  }
  function changeSelectedbatches(testId: string, value: string[]) {
    props.setAllTests(
      props.allTests.map((x) => {
        if (x._id === testId) return { ...x, sharedBatches: value };
        else return x;
      })
    );
  }
  function handleDeleteClick(test: TestListDetails) {
    deleteTest(test._id)
      .then((data) => {
        showNotification({
          message: "Test Deleted",
          autoClose: 1000,
          color: "green",
        });
        props.onDeleteTestClicked();
      })
      .catch((error) => {
        console.log("Delete Test Error:", error);
      });
  }

  function handleDownloadTestClick(test: TestListDetails) {
    downloadPdf(
      test._id,
      props.setIsLoading,
      user,
      isReactNativeActive(),
      sendDataToReactnative,
      values.includes(TestDownloadOptions.SOLUTIONS),
      values.includes(TestDownloadOptions.BORDER),
      values.includes(TestDownloadOptions.INSTRUCTIONS),
      values.includes(TestDownloadOptions.WATERMARK) && waterMarkText !== ""
        ? waterMarkText
        : null
    );
  }
  useEffect(() => {
    GetAllClassesForUser()
      .then((x: any) => {
        console.log(x);
        setClasses(
          x.map((y: any) => {
            return {
              label: y.name,
              value: y._id,
            };
          })
        );
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);

  return (
    <>
      <Stack w="100%" mb={30} mih="110vh">
        <Stack
          style={{
            width: "100%",
            // border: "red solid 1px",
          }}
          px={30}
        >
          <CreateTestTitleCard
            numberOfTests="10"
            setTestScreen={props.setTestScreen}
            onCreateTestClicked={() => {
              // props.setTestScreen(TestScreen.CreateTest);
              Mixpanel.track(
                WebAppEvents.TEACHER_APP_TEST_PAGE_CREATE_TEST_CLICKED,
                {
                  pagelocation: "outside",
                }
              );
              if (
                user?.subscriptionModelType === "PREMIUM" ||
                (user?.testRecords && user.testRecords.length < 5) ||
                (user?.testRecords && isGapMoreThanOneWeek(user.testRecords))
              ) {
                props.onCreateTestClicked()
              } else {
                Mixpanel.track(
                  WebAppEvents.VIGNAM_APP_PREMIUM_FEATURE_ACCESSED,
                  {
                    feature_name: "test_creation",
                    current_page: "Test Page",
                  }
                );
                dispatch(isPremiumModalOpenedActions.setModalValue(true));
              }
            }}
          />
        </Stack>
        <SimpleGrid cols={isSm ? 1 : 2} spacing="xl" px={30}>
          {props.allTests
            .filter((x) => !x.isDeleted)
            .map((x) => (
              <TestInfoCard
                key={x._id}
                test={x}
                changeShareTestUI={changeShareTestUI}
                setViewTestId={props.setViewTestId}
                setTestScreen={props.setTestScreen}
                setIsLoading={props.setIsLoading}
                pagelocation="outer"
                onDeleteTest={() => {
                  handleDeleteClick(x);
                }}
                onEditTestClick={() => {
                  props.onEditTestClicked();
                }}
                onCopyTestClick={() => {
                  props.onCopyTestClicked();
                }}
                onTestDownloadClick={() => {
                  setisDownloadTestClicked(x);
                }}
                allClasses={allClasses}
                changeSelectedbatches={changeSelectedbatches}
              />
            ))}
        </SimpleGrid>
      </Stack>

      <Modal
        opened={isDownloadTestClicked !== null}
        onClose={() => {
          setisDownloadTestClicked(null);
        }}
        centered
        title="Download test with:"
        styles={{
          title: {
            fontSize: "20px",
            fontWeight: "bold",
          },
        }}
      >
        <Checkbox.Group
          value={values}
          onChange={(val) => {
            setValues(val);
          }}
          size="md"
        >
          <SimpleGrid cols={2}>
            <Checkbox
              label={TestDownloadOptions.BORDER}
              value={TestDownloadOptions.BORDER}
            ></Checkbox>
            <Checkbox
              label={TestDownloadOptions.INSTRUCTIONS}
              value={TestDownloadOptions.INSTRUCTIONS}
            ></Checkbox>
            <Checkbox
              label={TestDownloadOptions.SOLUTIONS}
              value={TestDownloadOptions.SOLUTIONS}
            ></Checkbox>
            <Checkbox
              label={TestDownloadOptions.WATERMARK}
              value={TestDownloadOptions.WATERMARK}
            ></Checkbox>
            {values.includes(TestDownloadOptions.WATERMARK) && (
              <Stack>
                <TextInput
                  label="Enter Watermark Text:"
                  type="text"
                  value={waterMarkText ?? ""}
                  onChange={(e) => {
                    setWatermarkText(e.target.value);
                  }}
                />
              </Stack>
            )}
          </SimpleGrid>
        </Checkbox.Group>
        <Flex justify="right">
          <Button
            onClick={() => {
              setisDownloadTestClicked(null);
              handleDownloadTestClick(isDownloadTestClicked);
            }}
            disabled={
              values.includes(TestDownloadOptions.WATERMARK) &&
              (waterMarkText === "" || waterMarkText === null)
            }
            leftIcon={<IconDownload />}
            bg="#4B65F6"
            sx={{
              "&:hover": {
                backgroundColor: "#3C51C5",
              },
            }}
            mt={30}
          >
            Download Test
          </Button>
        </Flex>
      </Modal>
    </>
  );
};

export default ViewTeacherTests1;
