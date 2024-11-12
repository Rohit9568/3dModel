import {
  LoadingOverlay,
  Stack,
  Text
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { createPreTest } from "../../features/test/PreTestSlice";
import { chapter } from "../../store/chapterSlice";
const chapterActions = chapter.actions;

interface IntroductionProps {
  topics: { _id: string; name: string }[];
  OnUpdateTestStatus: (testTaken: boolean, isFirstTime: boolean) => void;
  currentChapter: SingleChapter;
  OnTopicClick: (topicId: string) => void;
}

export function Introduction(props: IntroductionProps) {
  const isMd = useMediaQuery(`(max-width: 820px)`);
  const isSm = useMediaQuery(`(max-width: 400px)`);
  const [showWarning, setshowWarning] = useState<boolean>(false);
  const [showTestBanner, setShowTestBanner] = useState<boolean>(false);
  const [previewPreTest, setPreviewPreTest] = useState<boolean>(false);
  const [previewReport, setpreviewReport] = useState<boolean>(false);
  const [isLoading, setisLoading] = useState<boolean>(false);

  const dispatch = useDispatch();
  useEffect(() => {
    if (props.currentChapter.chapterPreTestsStatus.isFirstTime === true) {
      setShowTestBanner(true);
    }
  }, [props.currentChapter]);

  useEffect(() => {
    if (props.currentChapter !== null) {
      setshowWarning(
        (props.currentChapter?.chapterPreTestsStatus?.testTaken === true
          ? false
          : true) ?? true
      );
    }
  }, [props.currentChapter]);

  function createPreTestHere() {
    setisLoading(true);
    createPreTest(props.currentChapter._id)
      .then((data: any) => {
        dispatch(chapterActions.updatePreTest(data.generatedTestId));
        setisLoading(false);
      })
      .catch((err) => {
        setisLoading(false);
        console.log(err);
      });
  }

  return (
    <>
      <LoadingOverlay visible={isLoading} />
      {/* <Stack pl={10}> */}
      {/*    {/* {showWarning && (
          <Flex
            style={{
              borderRadius: "10px",
              backgroundColor: "#FEF7EA",
              maxHeight: "70px",
              border: "3px solid #FFDDA2",
            }}
            align="center"
            justify="space-between"
            px={10}
            h="8vh"
          >
            <Flex align="center">
              <img
                src={require("./../../assets/warning.png")}
                height={39}
                width={39}
              />
              <Stack spacing={1} ml={18}>
                <Text fz="14px" fw={600}>
                  Warning
                </Text>
                <Text fz={isMd ? "8px" : "12px"}>
                  First take the pre test to know the level of your students
                  then teach accordingly.
                </Text>
              </Stack>
            </Flex>
            <IconX
              onClick={() => setshowWarning(false)}
              style={{
                cursor: "pointer",
              }}
            />
          </Flex>
        )} */}
      {/* <Flex
          direction={isMd ? "column" : "row"}
          h="100%"
        > */}
      {/* <Stack
            w={isMd ? "100%" : "20%"} // 100% width for mobile
            style={{
              border: "1px solid rgba(133, 150, 181, 0.35)",
              borderRadius: "10px",
            }}
            pl={14}
          >
            <Text
              color="#03183D"
              fz={isMd ? 18 : 24}
              fw={600}
              mt={isMd ? 3 : 10}
              mb={isMd ? 3 : 15}
            >
              Topics
            </Text>
            <ScrollArea h={isMd ? "16vh" : "100%"} mb={3}>
              {props.topics.map((x, i) => {
                return (
                  <Flex mb={5}
                  key={x._id}
                  >
                    <Text
                      color="#3174F3"
                      fz={16}
                      fw={400}
                      w="10%"
                      onClick={() => props.OnTopicClick(x._id)}
                      style={{
                        cursor: "pointer",
                      }}
                    >
                      {i + 1}.
                    </Text>
                    <Text
                      color="#3174F3"
                      fz={16}
                      fw={400}
                      onClick={() => props.OnTopicClick(x._id)}
                      style={{
                        cursor: "pointer",
                      }}
                      sx={{
                        "&:hover": {
                          textDecoration: "underline",
                        },
                      }}
                    >
                      {x.name}
                    </Text>
                  </Flex>
                );
              })}
            </ScrollArea>
          </Stack>  */}
      <Stack
        w="100%"
        h="100%"
        // ml={isMd ? 0 : 28}
        // mt={isMd ? 10 : 0}
      >
        {/* Introduction section */}
        <Stack spacing={2}>
          <Text
            fz={isMd ? 22 : 30}
            fw={500}
            style={{
              color: "#03183D",
            }}
          >
            Introduction
          </Text>
        </Stack>

        <Text
          style={{
            fontSize: isMd ? "12px" : "16px",
          }}
          fw={400}
          color="#3D3D3D"
          ta={"justify"}
          // px={10}
          pl={30}
          // mt={-30}
        >
          <div
            dangerouslySetInnerHTML={{
              __html: props.currentChapter.introduction ?? "",
            }}
          ></div>
        </Text>
      </Stack>
      {/* </Flex>    */}
      {/* <Flex
          h={isMd ? "10vh" : showWarning ? "16vh" : "16vh"}
          mt={showWarning ? 0 : 30}
          style={{
            borderRadius: 10,
            boxShadow: "0px 0px 13px 0px rgba(0, 0, 0, 0.25)",
          }}
        >
          <Stack
            w={isMd ? "30%" : "20%"}
            ml={isMd ? 12 : 25}
            mt={isMd ? 12 : 25}
            spacing={isMd ? 0 : 1}
          >
            <Text fw={500} fz={isMd ? 10 : 16} color="#3E3E3E">
              Pre-requisite test
            </Text>
            <Text fw={500} fz={isMd ? 8 : 14} color="#909395">
              Duration : 30 min
            </Text>
          </Stack>
          <Box
            style={{
              width: isMd ? "40%" : "50%",
            }}
            ta="center"
            h="100%"
          >
            <img
              src={require("../../assets/prereqimage1.png")}
              style={{
                aspectRatio: 1.5,
                height: "100%",
              }}
            />
          </Box>
          <Flex w={"30%"} align="end" justify="end" mb={10} mr={15}>
            <Flex align="center" justify="space-between">
              <Button
                size={isMd ? "xs" : "md"}
                fz={isMd ? 10 : 15}
                fw={500}
                mr={isMd ? 8 : 20}
                onClick={() => {
                  if (!props.currentChapter.chapterPreTest) {
                    createPreTestHere();
                  }
                  setPreviewPreTest(true);
                }}
              >
                View Test 
              </Button>
              {props.currentChapter.chapterPreTestsStatus.testTaken ===
                true && (
                <Button
                  size={isMd ? "xs" : "md"}
                  fz={isMd ? 10 : 15}
                  fw={500}
                  mr={isMd ? 8 : 20}
                  onClick={()=>{
                    setpreviewReport(true);
                  }}
                >
                  Report
                </Button> 
              )}

              <Flex h="100%">
                <Box
                  w={24}
                  h={24}
                  style={{
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    if (!props.currentChapter.chapterPreTest) {
                      createPreTestHere();
                    }
                    setShowTestBanner(true);
                  }}
                >
                  <IconShare col="#3174F3" />
                </Box>
              </Flex>
            </Flex>
          </Flex>
        </Flex>
        <Modal
          opened={showTestBanner}
          onClose={() => {
            setShowTestBanner(false);
            if (props.currentChapter)
              props.OnUpdateTestStatus(
                props.currentChapter.chapterPreTestsStatus.testTaken,
                false
              );
            else {
              props.OnUpdateTestStatus(false, false);
            }
          }}
          withCloseButton={false}
          padding={0}
          size={isSm ? "xs" : isMd ? "md" : "xl"}
          styles={{
            inner: {
              padding: "0",
            },
          }}
          radius={8}
          centered
        >
          <PreRequisiteModal
            testId={props.currentChapter.chapterPreTest}
            onClose={() => {
              setShowTestBanner(false);
              if (props.currentChapter.chapterPreTest)
                props.OnUpdateTestStatus(
                  props.currentChapter?.chapterPreTestsStatus.testTaken,
                  false
                );
              else {
                props.OnUpdateTestStatus(false, false);
              }
            }}
            onShareClick={() => {
              if (
                props.currentChapter?.chapterPreTestsStatus.testTaken !==
                  true ||
                props.currentChapter.chapterPreTestsStatus.testTaken ===
                  undefined
              ) {
                props.OnUpdateTestStatus(true, false);
              }
            }}
            currentChapterData={props.currentChapter}
            onViewTestClick={() => {
              setPreviewPreTest(true);
            }}
            onReportClick={() => {
              setpreviewReport(true);
            }}
          />
        </Modal>
        {props.currentChapter.chapterPreTest && (
          <>
            <Modal
              onClose={() => setPreviewPreTest(false)}
              opened={previewPreTest}
              size={"60vw"}
            >
              <Center>
                <ViewTestBlock test_id={props.currentChapter.chapterPreTest} />
              </Center>
            </Modal>
            <Modal
              size={"60vw"}
              onClose={() => {
                setpreviewReport(false);
              }}
              opened={previewReport}
            >
              <TestResult
                testId={props.currentChapter.chapterPreTest}
                isPretest={true}
              />
            </Modal>
          </>
        )} */}
      {/* </Stack> */}
    </>
  );
}
