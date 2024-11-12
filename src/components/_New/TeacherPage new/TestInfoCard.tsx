import {
  Box,
  Button,
  Divider,
  Drawer,
  Flex,
  Group,
  LoadingOverlay,
  Menu,
  Modal,
  MultiSelect,
  ScrollArea,
  Select,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
  useMantineTheme,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { showNotification } from "@mantine/notifications";
import {
  IconBrandFacebook,
  IconBrandWhatsapp,
  IconClipboardList,
  IconClock,
  IconCopy,
  IconDotsVertical,
  IconDownload,
  IconFileAnalytics,
  IconMail,
  IconMessage2,
  IconNotes,
  IconPencil,
  IconShare,
} from "@tabler/icons";
import { useEffect, useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { useDispatch, useSelector } from "react-redux";
import {
  EmailShareButton,
  FacebookShareButton,
  WhatsappShareButton,
} from "react-share";
import { User1 } from "../../../@types/User";
import {
  addBatchesToTest,
  shareTestToStudents,
} from "../../../features/test/TestSlice";
import { TestListDetails } from "../../../pages/_New/AllTeacherTests";
import { Icon } from "../../../pages/_New/Teach";
import { AppDispatch, RootState } from "../../../store/ReduxStore";
import { isPremiumModalOpened } from "../../../store/premiumModalSlice";
import {
  convertDate,
  convertToHyphenSeparated,
  secondsToTime,
} from "../../../utilities/HelperFunctions";
import { GetUser } from "../../../utilities/LocalstorageUtility";
import { WebAppEvents } from "../../../utilities/Mixpanel/AnalyticeEventWebApp";
import { Mixpanel } from "../../../utilities/Mixpanel/MixpanelHelper";
import {
  IconBook,
  IconClipBoard,
  IconDelete,
  IconRank,
  IconShareCustom,
  IconTestResources,
  IconUploadResources,
  IconViewResponse,
} from "../../_Icons/CustonIcons";
import { TestScreen } from "../ContentTest";
import { GetAllClassesForUser } from "../../../_parentsApp/features/instituteUserSlice";
const isPremiumModalOpenedActions = isPremiumModalOpened.actions;

const sendMessage = (url: string) => {
  const messageText = encodeURIComponent(url);
  const messageUrl = `sms:?body=${messageText}`; // You can use other URL schemes for different messaging apps
  window.open(messageUrl);
};
function appendParentToBaseUrl() {
  const currentUrl = window.location.href;
  const user = GetUser();
  const urlParts = new URL(currentUrl);
  const base = urlParts.origin;

  const modifiedUrl = `${base}/${convertToHyphenSeparated(
    user.instituteName
  )}/${user.instituteId}/home`;
  return modifiedUrl;
}

interface ViewTestInfoCardProps {
  isShared: boolean;
  isDeleted: boolean;
  className: string;
  subject: string;
  totalQuestions: number;
  totalMarks: number;
  testName: string;
}

export function ViewTestInfoCard(props: ViewTestInfoCardProps) {
  const isSm = useMediaQuery(`(max-width: 700px)`);
  const isMd = useMediaQuery(`(max-width: 820px)`);
  const isLg = useMediaQuery(`(max-width: 990px)`);

  return (
    <Box
      style={{
        width: isSm ? "340px" : isMd ? "360px" : isLg ? "410px" : "470px",
        maxHeight: "130px",
        borderRadius: "4px 12px 12px 4px",
        overflow: "hidden",
        boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
        border:"solid red 1px"
      }}
    >
      <Flex style={{ height: "100%" }}>
        {/* First Column */}
        <Box
          style={{
            flexBasis: "3%",
            backgroundColor: "#FCCB25",
            height: "100%",
          }}
        ></Box>

        {/* Second Column */}
        <Flex
          direction="column"
          style={{
            flexBasis: "65%",
            padding: "16px",
            justifyContent: "space-between",
          }}
        >
          {/* First Row */}
          <Flex style={{ alignItems: "center" }}>
            <IconBook col="#3174F3" />
            <Text fz={9} fw={400} c={"#898989"} style={{ marginLeft: "4px" }}>
              {props.className}({props.subject})
            </Text>
          </Flex>

          {/* Second Row */}
          <SimpleGrid
            cols={2}
            style={{
              display: "flex",
              alignItems: "center",
              gap: isSm ? "10px" : isMd ? "12px" : isLg ? "14px" : "16px",
            }}
          >
            <Text fz={isSm ? 14 : isMd ? 17 : isLg ? 20 : 22} fw={500}>
              {props.testName}
            </Text>
            <Box
              style={{
                background: props.isShared ? "red" : "green",
                borderRadius: "3px",
                height: "20%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                padding: "8px",
              }}
            >
              <Text fz={isSm ? 5 : isMd ? 6 : isLg ? 7 : 8} fw={700} c={"#FFF"}>
                {props.isShared ? "Report Not Added" : "Report Added"}
              </Text>
            </Box>
          </SimpleGrid>

          {/* Third Row */}
          <Text
            fz={isSm ? 8 : isMd ? 10 : isLg ? 11 : 12}
            fw={400}
            c={"#898989"}
          >
            Total Marks: {props.totalMarks} | Total Questions:{" "}
            {props.totalQuestions}
          </Text>
        </Flex>

        {/* Third Column */}
        <Flex
          direction="column"
          style={{
            flexBasis: "32%",
            justifyContent: "flex-end",
            alignItems: "center",
            paddingBottom: "16px",
          }}
        >
          <Button
            fz={isSm ? 10 : isMd ? 13 : isLg ? 14 : 16}
            style={{
              width: isSm ? "90px" : isMd ? "100px" : isLg ? "114px" : "124px",
              padding: isMd ? "8px 8px" : "10px 10px",
            }}
            variant={props.isShared ? "filled" : "outline"}
          >
            {props.isShared ? "Take Test" : "View Report"}
          </Button>
        </Flex>
      </Flex>
    </Box>
  );
}

interface TestInfoCardProps {
  test: TestListDetails;
  className?: string;
  subjectName?: string;
  changeShareTestUI: (input: string, value: boolean) => void;
  setViewTestId: (input: string) => void;
  setTestScreen: (input: TestScreen) => void;
  setIsLoading: (input: boolean) => void;
  pagelocation: "inner" | "outer";
  onDeleteTest?: () => void;
  onTestDownloadClick?: () => void;
  onEditTestClick?: () => void;
  onCopyTestClick?: () => void;
  onViewResoucesClick?: () => void;
  allClasses: {
    label: string;
    value: string;
  }[];
  changeSelectedbatches: (input: string, sharedBatchIds: string[]) => void;
}

export function TestInfoCard(props: TestInfoCardProps) {
  const theme = useMantineTheme();
  const isSm = useMediaQuery(`(max-width: 700px)`);
  const isMd = useMediaQuery(`(max-width: 820px)`);
  const isLg = useMediaQuery(`(max-width: 990px)`);
  const [isShareLink, setIsShareLink] = useState<boolean>(false);
  const [drawerOpened, setDrawerOpened] = useState(false);

  const menuContents = (
    <Box mx={0} w={"100%"} pb={20}>
      <Flex mx={10} mt={20} px={10} style={{ alignItems: "center" }}>
        <IconClipBoard />
        <Text ml={5} fz={20} fw={600}>
          {props.test.name}
        </Text>
        <Box
          style={{
            background: props.test.isShared ? "green" : "red",
            borderRadius: "3px",
            marginLeft: "8px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "4px 8px",
          }}
        >
          <Text fz={12} fw={700} c={"#FFF"}>
            {props.test.isShared ? "Shared" : "Not Shared"}
          </Text>
        </Box>
      </Flex>
      <Divider />
      <Flex mx={10} px={10} mt={10} direction="column" gap="18px" pb={10}>
        <Flex
          align="center"
          gap="8px"
          onClick={() => {
            setDrawerOpened(false);
            if (!props.test.sharedPreviously) setTestShareWarning(true);
            else {
              if (!props.test.isShared) shareTest(props.test._id);
              else setIsShareLink(true);
            }
          }}
        >
          <IconShare />
          <Text>Share</Text>
        </Flex>
        {!props.test.pdfLink && props.test.maxQuestions !== 0 && (
          <Flex
            align="center"
            gap="8px"
            onClick={() => {
              setDrawerOpened(false);
              if (props.onTestDownloadClick) props.onTestDownloadClick();
            }}
          >
            <IconDownload />
            <Text>Download</Text>
          </Flex>
        )}
        {(props.test.maxQuestions !== 0 || props.test.pdfLink === null) && (
          <Flex
            align="center"
            gap="8px"
            onClick={() => viewTest(props.test._id)}
          >
            <IconNotes />
            <Text>View Test</Text>
          </Flex>
        )}
        {!props.test.sharedPreviously &&
          props.test.maxQuestions !== 0 &&
          props.test.pdfLink === null && (
            <Flex
              align="center"
              gap="8px"
              onClick={() => {
                if (props.onEditTestClick) {
                  props.setViewTestId(props.test._id);
                  props.onEditTestClick();
                }
              }}
            >
              <IconPencil />
              <Text>Edit</Text>
            </Flex>
          )}
        {props.test.maxQuestions !== 0 && (
          <Flex
            align="center"
            gap="8px"
            onClick={() => {
              if (props.onCopyTestClick) {
                props.setViewTestId(props.test._id);
                props.onCopyTestClick();
              }
            }}
          >
            <IconCopy />
            <Text>Duplicate</Text>
          </Flex>
        )}

        {props.test.maxQuestions !== 0 && (
          <Flex
            align="center"
            gap="8px"
            onClick={() => {
              props.setTestScreen(TestScreen.RankingList);
              props.setViewTestId(props.test._id);
            }}
          >
            <IconRank />
            <Text>View Rank List</Text>
          </Flex>
        )}

        {props.test.isReportAvailable && (
          <Flex
            align="center"
            gap="8px"
            onClick={() => viewReport(props.test._id)}
          >
            <IconFileAnalytics />
            <Text>View Report</Text>
          </Flex>
        )}
        <Flex
          align="center"
          gap="8px"
          onClick={() => {
            props.setViewTestId(props.test._id);
            props.setTestScreen(TestScreen.ViewResources);
          }}
        >
          <IconUploadResources />
          <Text>Upload Material</Text>
        </Flex>
        {props.test.maxQuestions !== 0 && props.test.isResponseAvailable && (
          <Flex
            align="center"
            gap="8px"
            onClick={() => viewResponse(props.test._id)}
          >
            <IconViewResponse />
            <Text>View Responses</Text>
          </Flex>
        )}
        <Flex
          align="center"
          gap="8px"
          onClick={() => {
            setisDeleteSection(true);
          }}
        >
          <IconDelete />
          <Text>Delete</Text>
        </Flex>
      </Flex>
    </Box>
  );
  const user = useSelector<RootState, User1 | null>((state) => {
    return state.currentUser.user;
  });
  const modifiedURL = appendParentToBaseUrl();
  const [isLoading, setLoading] = useState<boolean>(false);
  function shareTest(testId: string) {
    Mixpanel.track(WebAppEvents.TEACHER_APP_TEST_PAGE_SHARE_BUTTON_CLICKED, {
      pagelocation: props.pagelocation,
    });
    setLoading(true);
    shareTestToStudents(testId)
      .then((data: any) => {
        setLoading(false);
        props.changeShareTestUI(testId, data.isShared);
        if (data.isShared) {
          showNotification({
            message: "Test Shared",
            autoClose: 1000,
            color: "green",
          });
          setIsShareLink(true);
        }
      })
      .catch((error) => {
        setLoading(false);
        console.log(error);
      });
  }
  function viewTest(testId: string) {
    Mixpanel.track(WebAppEvents.TEACHER_APP_TEST_PAGE_VIEW_TEST_CLICKED, {
      pagelocation: props.pagelocation,
    });
    props.setViewTestId(testId);
    props.setTestScreen(TestScreen.ViewTest);
  }
  const dispatch = useDispatch<AppDispatch>();
  function viewReport(testId: string) {
    Mixpanel.track(WebAppEvents.TEACHER_APP_TEST_PAGE_VIEW_REPORT_CLICKED, {
      pagelocation: props.pagelocation,
    });
    if (user?.subscriptionModelType === "PREMIUM") {
      props.setViewTestId(testId);
      props.setTestScreen(TestScreen.ViewReport);
    } else {
      Mixpanel.track(WebAppEvents.VIGNAM_APP_PREMIUM_FEATURE_ACCESSED, {
        feature_name: "test_creation",
        current_page: "Test Page",
      });
      dispatch(isPremiumModalOpenedActions.setModalValue(true));
    }
  }
  function viewResponse(testId: string) {
    Mixpanel.track(WebAppEvents.TEACHER_APP_TEST_PAGE_VIEW_RESPONSES_CLICKED, {
      pagelocation: props.pagelocation,
    });

    props.setViewTestId(testId);
    props.setTestScreen(TestScreen.ViewResponse);
  }
  const values = ["Shared", "Not Shared"];

  const [shareValue, setShareValue] = useState<string>(
    props.test.isShared ? values[0] : values[1]
  );
  useEffect(() => {
    setShareValue(props.test.isShared ? values[0] : values[1]);
    setSelectedClasses(props.test.sharedBatches || []);
  }, [props.test]);
  const [isDeleteGallerySection, setisDeleteSection] = useState<boolean>(false);
  const [testsharewarning, setTestShareWarning] = useState<boolean>(false);
  const [selectedClasses, setSelectedClasses] = useState<string[]>([]);

  function changeSharedBatches(val: string[]) {
    const unsharedBatchIds = props.test.sharedBatches.filter(
      (item) => !val.includes(item)
    );
    props.setIsLoading(true);
    addBatchesToTest(props.test._id, val, unsharedBatchIds)
      .then((data: any) => {
        console.log(data);
        props.setIsLoading(false);
        props.changeSelectedbatches(props.test._id, val);
      })
      .catch((error) => {
        props.setIsLoading(false);
        console.log(error);
      });
  }
  return (
    <>
      <Box
        style={{
          width: "100%",
          borderRadius: "12px 12px 12px 12px",
          borderLeft: "15px solid #FCCB25",
          minHeight: "120px",
        }}
        sx={{
          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
          /* "&:hover": {
            borderLeft: "1px solid #FCCB25",
            boxShadow: "0px 4px 24px rgba(0, 0, 0, 0.3)",
          }, */
        }}
      >
        <Stack px={20} mt={20} mb={15} spacing={2}>
          {/* First Row */}

          {/* Second Row */}
          <Flex align="center">
            <Text fz={isMd ? 18 : 20} fw={500}>
              {props.test.name}
            </Text>

            <Text
              fz={isMd ? 8 : 10}
              fw={700}
              c={"#FFF"}
              style={{
                background: props.test.isShared ? "#00c808" : "#FF3F3F",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                padding: "2px 10px",
                marginLeft: 5,
                // height: "25px",
                borderRadius: "5px",
              }}
            >
              {props.test.isShared ? "Shared" : "Not Shared"}
            </Text>
          </Flex>
          {props.test.maxQuestions !== 0 && (
            <Text w={"100%"} fz={isMd ? 12 : 14} fw={500} c={"#898989"}>
              Total Marks: {props.test.maxMarks} | Total Questions:{" "}
              {props.test.maxQuestions}
            </Text>
          )}
          <Flex align={"center"} justify="space-between">
            <Flex align="center">
              {props.test.duration !== null && (
                <>
                  <IconClock
                    color="#898989"
                    size={isMd ? 14 : 18}
                    style={{
                      marginRight: isMd ? 3 : 5,
                    }}
                  />
                  <Text c="#898989" fw={400} fz={isMd ? 12 : 14}>{`${
                    props.test.testScheduleTime
                      ? `Date: ${convertDate(props.test.testScheduleTime)} |`
                      : ""
                  } Duration:${secondsToTime(
                    parseInt(props.test.duration)
                  )}`}</Text>
                </>
              )}
            </Flex>

            <Flex>
              <Flex style={{ width: "60px", justifyContent: "space-evenly" }}>
                <Box
                  mt={2}
                  w={18}
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    if (!props.test.sharedPreviously) setTestShareWarning(true);
                    else {
                      if (!props.test.isShared) shareTest(props.test._id);
                      else setIsShareLink(true);
                    }
                  }}
                  //style={{ border: "1px red solid" }}
                >
                  <IconShareCustom col="black" />
                </Box>
                {isMd ? (
                  <>
                    <Box
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        Mixpanel.track(
                          WebAppEvents.TEACHER_APP_TEST_PAGE_OPTIONS_BUTTON_CLICKED,
                          {
                            pagelocation: props.pagelocation,
                          }
                        );
                        setDrawerOpened(true);
                      }}
                    >
                      <IconDotsVertical />
                    </Box>
                    <Drawer
                      opened={drawerOpened}
                      withCloseButton={false}
                      onClose={() => setDrawerOpened(false)}
                      position="bottom"
                      size="auto"
                      styles={{
                        drawer: {
                          backgroundColor: "#F4F9FE",
                          borderRadius: "25px 25px 0px 0px",
                        },
                      }}
                    >
                      {menuContents}
                    </Drawer>
                  </>
                ) : (
                  <Menu width={200} position="bottom">
                    <Menu.Target>
                      <Box
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                          Mixpanel.track(
                            WebAppEvents.TEACHER_APP_TEST_PAGE_OPTIONS_BUTTON_CLICKED,
                            {
                              pagelocation: props.pagelocation,
                            }
                          );
                        }}
                      >
                        <IconDotsVertical />
                      </Box>
                    </Menu.Target>
                    <Menu.Dropdown px={0}>
                      <Flex align="center" mt={7} mb={10} gap="8px" px={13}>
                        <IconClipboardList />
                        <Text>{props.test.name}</Text>
                      </Flex>
                      <Divider mb={10} w={"100%"} size={3} color={"#E7EFFF"} />
                      <Menu.Item
                        onClick={() => {
                          if (!props.test.sharedPreviously)
                            setTestShareWarning(true);
                          else {
                            if (!props.test.isShared) shareTest(props.test._id);
                            else setIsShareLink(true);
                          }
                        }}
                      >
                        <Flex align="center" gap="8px">
                          <IconShare />
                          <Text>Share</Text>
                        </Flex>
                      </Menu.Item>
                      {(props.test.maxQuestions !== 0 ||
                        props.test.pdfLink !== null) && (
                        <Menu.Item onClick={() => viewTest(props.test._id)}>
                          <Flex align="center" gap="8px">
                            <IconNotes />
                            <Text>View Test</Text>
                          </Flex>
                        </Menu.Item>
                      )}
                      {!props.test.sharedPreviously &&
                        props.test.maxQuestions !== 0 &&
                        props.test.pdfLink === null && (
                          <Menu.Item
                            onClick={() => {
                              if (props.onEditTestClick) {
                                props.setViewTestId(props.test._id);
                                props.onEditTestClick();
                              }
                            }}
                          >
                            <Flex align="center" gap="8px">
                              <IconPencil />
                              <Text>Edit</Text>
                            </Flex>
                          </Menu.Item>
                        )}
                      {props.test.maxQuestions !== 0 && (
                        <Menu.Item
                          onClick={() => {
                            if (props.onCopyTestClick) {
                              props.setViewTestId(props.test._id);
                              props.onCopyTestClick();
                            }
                          }}
                        >
                          <Flex align="center" gap="8px">
                            <IconCopy />
                            <Text>Duplicate</Text>
                          </Flex>
                        </Menu.Item>
                      )}
                      {!props.test.pdfLink && props.test.maxQuestions !== 0 && (
                        <Menu.Item
                          onClick={() => {
                            if (props.onTestDownloadClick)
                              props.onTestDownloadClick();
                          }}
                        >
                          <Flex align="center" gap="8px">
                            <IconDownload />
                            <Text>Download</Text>
                          </Flex>
                        </Menu.Item>
                      )}

                      {props.test.maxQuestions !== 0 && (
                        <Menu.Item
                          onClick={() => {
                            props.setViewTestId(props.test._id);
                            props.setTestScreen(TestScreen.RankingList);
                          }}
                        >
                          <Flex align="center" gap="8px">
                            <IconRank />
                            <Text>View Rank List</Text>
                          </Flex>
                        </Menu.Item>
                      )}
                      <Menu.Item
                        onClick={() => {
                          props.setViewTestId(props.test._id);
                          props.setTestScreen(TestScreen.ViewResources);
                        }}
                      >
                        <Flex align="center" gap="8px">
                          <IconUploadResources />
                          <Text>Upload Material</Text>
                        </Flex>
                      </Menu.Item>
                      {props.test.isReportAvailable && (
                        <Menu.Item onClick={() => viewReport(props.test._id)}>
                          <Flex align="center" gap="8px">
                            <IconFileAnalytics />
                            <Text>View Report</Text>
                          </Flex>
                        </Menu.Item>
                      )}
                      {props.test.maxQuestions !== 0 &&
                        props.test.isResponseAvailable && (
                          <Menu.Item
                            onClick={() => viewResponse(props.test._id)}
                          >
                            <Flex align="center" gap="8px">
                              <IconViewResponse />
                              <Text>View Responses</Text>
                            </Flex>
                          </Menu.Item>
                        )}
                      <Menu.Item
                        onClick={() => {
                          setisDeleteSection(true);
                        }}
                      >
                        <Flex align="center" gap="8px">
                          <IconDelete />
                          <Text>Delete</Text>
                        </Flex>
                      </Menu.Item>
                    </Menu.Dropdown>
                  </Menu>
                )}
              </Flex>
            </Flex>
          </Flex>
        </Stack>
      </Box>
      <Modal
        opened={isShareLink}
        onClose={() => {
          setIsShareLink(false);
        }}
        title="Share the Test with Students"
        centered
      >
        <LoadingOverlay visible={isLoading} />

        <Stack>
          <Flex align="center">
            <Text mr={20}>Batches to Share with:</Text>
            <MultiSelect
              value={selectedClasses}
              data={props.allClasses}
              onChange={(val) => {
                changeSharedBatches(val);
                setSelectedClasses(val);
              }}
            />
          </Flex>
          <Flex align="center" justify="space-between">
            <Text mr={20}>Status:</Text>
            <Select
              value={shareValue}
              data={values}
              onChange={(e) => {
                shareTest(props.test._id);
              }}
              // w="50%"
            />
          </Flex>
          <Flex>
            <FacebookShareButton url={modifiedURL}>
              <Icon
                name="Facebook"
                icon={<IconBrandFacebook color="white" />}
                onClick={() => {}}
                color="#1776F1"
              />
            </FacebookShareButton>

            <WhatsappShareButton url={modifiedURL}>
              <Icon
                name="Whatsapp"
                icon={<IconBrandWhatsapp color="white" />}
                onClick={() => {}}
                color="#43C553"
              />
            </WhatsappShareButton>

            <EmailShareButton url={modifiedURL}>
              <Icon
                name="Email"
                icon={<IconMail color="white" />}
                onClick={() => {}}
                color="#E0534A"
              />
            </EmailShareButton>
            <Icon
              name="Message"
              icon={<IconMessage2 color="white" />}
              onClick={() => {
                sendMessage(modifiedURL);
              }}
              color="#0859C5"
            />
          </Flex>
          <Flex justify="space-between" align="center">
            <TextInput
              style={{
                // border: "gray solid 1px",
                marginRight: "5px",
                // borderRadius: "10px",
                // padding: "7px",
                height: "40px",
                width: "95%",
              }}
              value={modifiedURL}
            ></TextInput>
            <CopyToClipboard text={modifiedURL}>
              <Button
                // variant="outline"
                bg="#3174F3"
                style={{
                  borderRadius: "20px",
                }}
              >
                Copy
              </Button>
            </CopyToClipboard>
          </Flex>
        </Stack>
      </Modal>
      <Modal
        opened={testsharewarning}
        onClose={() => setTestShareWarning(false)}
        centered
        zIndex={999}
        styles={{
          title: {
            fontSize: 20,
            fontWeight: 700,
          },
        }}
      >
        <Text fw={500} fz={20} align="center">
          You will not be able to edit the test once you have shared it.
        </Text>
        <Group position="center" mt={20}>
          <Button
            fw={700}
            radius={50}
            style={{ background: "red" }}
            onClick={() => {
              setTestShareWarning(false);
              shareTest(props.test._id);
            }}
            size="md"
          >
            Ok
          </Button>
        </Group>
      </Modal>
      <Modal
        opened={isDeleteGallerySection}
        onClose={() => setisDeleteSection(false)}
        centered
        zIndex={999}
        styles={{
          title: {
            fontSize: 20,
            fontWeight: 700,
          },
        }}
      >
        <Text fw={500} fz={20} align="center">
          Are you sure you want to delete this Test?
        </Text>
        <Group position="center" mt={20}>
          <Button
            variant="outline"
            color="dark"
            fw={700}
            radius={50}
            onClick={() => {
              setisDeleteSection(false);
            }}
          >
            Cancel
          </Button>
          <Button
            fw={700}
            radius={50}
            style={{ background: "red " }}
            onClick={() => {
              if (props.onDeleteTest) {
                props.onDeleteTest();
              }
              setisDeleteSection(false);
            }}
          >
            Delete
          </Button>
        </Group>
      </Modal>
    </>
  );
}
