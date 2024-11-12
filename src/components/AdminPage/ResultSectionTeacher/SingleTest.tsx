import {
  Box,
  Button,
  Center,
  Divider,
  FileInput,
  Flex,
  Grid,
  Group,
  Loader,
  LoadingOverlay,
  NumberInput,
  ScrollArea,
  Stack,
  Text,
} from "@mantine/core";
import { IconBackArrow } from "../../_Icons/CustonIcons";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import {
  runMultipleApiCallsForStudents,
  runMultipleApiCallsForUpdatingTestReport,
} from "../../../_parentsApp/features/instituteStudentSlice";
import { useMediaQuery } from "@mantine/hooks";
import { showNotification } from "@mantine/notifications";
import { batch } from "react-redux";
import { fetchFullTest } from "../../../features/test/TestSlice";
import { IconFile, IconX } from "@tabler/icons";
import { useFileInput } from "../../../hooks/useFileInput";

interface SingleTestProps {
  testId: string;
  batch: InstituteClass;
  onSubmit: (batchID: string) => void;
  setBatch: (batch: InstituteClass) => void;
}
export function SingleTest(props: SingleTestProps) {
  const navigate = useNavigate();
  const isMd = useMediaQuery(`(max-width: 820px)`);
  const [isError, setIserror] = useState<boolean>(false);
  const [testName, setTestName] = useState<string>();
  const [maxMarks, setMaxMarks] = useState<number>();
  const [selectedStudent, setSelectedStudent] = useState<string>("");
  const [testReports, setTestReports] = useState<TestReport[]>([]);
  const [isDataLoading, setisDataLoading] = useState<boolean>(false);
  const {
    file,
    fileInputRef,
    isLoading,
    url,
    setFile,
    setFileType,
    error,
    setUrl,
    fileName,
  } = useFileInput((progress:number)=>{});

  useEffect(() => {
    setFileType("pdf");
  }, []);

  useEffect(() => {
    if (url) {
      const updatedInputData = [...props.batch.students];
      const studentIndex = updatedInputData.findIndex(
        (x) => x._id === selectedStudent
      );
      updatedInputData[studentIndex].pdfLink = url;
      updatedInputData[studentIndex].pdfFileName = fileName;
      props.batch.students = updatedInputData;
      setUrl(null);
    }
  }, [url, selectedStudent, props.batch.students]);
  useEffect(() => {
    fetchFullTest(props.testId)
      .then((x: any) => {
        setTestName(x.name);
        setMaxMarks(x.maxMarks);
        setTestReports(
          x.answerSheets.map((answersheet: any) => {
            return answersheet.testReportId;
          })
        );
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    if (testReports.length !== 0) {
      const updatedInputData = [...props.batch.students];
      testReports.forEach((testReport) => {
        const studentIndex = props.batch.students.findIndex(
          (x) => x._id === testReport.studentId
        );
        if (studentIndex !== -1) {
          updatedInputData[studentIndex].marks = testReport.totalMarks;
          updatedInputData[studentIndex].pdfLink = testReport.pdfLink;
          updatedInputData[studentIndex].pdfFileName = testReport.pdfFileName;
          updatedInputData[studentIndex].testReportId = testReport._id;
        }
      });
      props.setBatch({
        ...props.batch,
        students: updatedInputData,
      });
    }
    return () => {
      const updatedInputData = [...props.batch.students];
      testReports.forEach((testReport) => {
        const studentIndex = props.batch.students.findIndex(
          (x) => x._id === testReport.studentId
        );
        if (studentIndex !== -1) {
          updatedInputData[studentIndex].marks = 0;
          updatedInputData[studentIndex].pdfLink = "";
          updatedInputData[studentIndex].pdfFileName = "";
        }
      });
      props.setBatch({
        ...props.batch,
        students: updatedInputData,
      });
    };
  }, [testReports]);

  function handleSubmit() {
    const totalStudentswithTestReports = props.batch.students.filter(
      (x) => x.testReportId !== undefined
    );
    const totalStudentswithoutTestReports = props.batch.students.filter(
      (x) => x.testReportId === undefined
    );
    console.log(totalStudentswithTestReports);
    console.log(totalStudentswithoutTestReports);
    if (totalStudentswithoutTestReports.length !== 0) {
      setisDataLoading(true);
      runMultipleApiCallsForStudents({
        testid: props.testId,
        students: totalStudentswithoutTestReports,
        maxMarks: maxMarks!!,
      })
        .then((x) => {
          props.onSubmit(props.batch._id);
          setisDataLoading(false);
          showNotification({
            message: "Test Updated Successfully ✔",
          });
        })
        .catch((e) => {
          setisDataLoading(false);
          console.log(e);
        });
    }
    if (totalStudentswithTestReports.length !== 0) {
      setisDataLoading(true);
      runMultipleApiCallsForUpdatingTestReport({
        students: totalStudentswithTestReports,
      })
        .then((x) => {
          console.log(x);
          setisDataLoading(false);
          props.onSubmit(props.batch._id);
          showNotification({
            message: "Test Updated Successfully ✔",
          });
        })
        .catch((e) => {
          setisDataLoading(false);

          console.log(e);
        });
    }
  }

  return (
    <>
      {maxMarks != null && testName != null && (
        <Stack
          w="100%"
          h="100%"
          style={{
            position: "relative",
          }}
        >
          <Group
            ml={10}
            onClick={() => {
              props.onSubmit("");
            }}
          >
            <Box
              style={{
                backgroundColor: "#F8F8F8",
                borderRadius: "50%",
                width: "40px",
                height: "40px",
              }}
            >
              <Center w="100%" h="100%">
                <Box w="60%" h="50%">
                  <IconBackArrow col="black" />
                </Box>
              </Center>
            </Box>
            <Text color="#595959" fz={23} fw={600}>
              {testName!!}
            </Text>
          </Group>
          <Stack spacing={1} h="90%">
            <Grid
              px={8}
              style={{
                backgroundColor: "#E4EDFD",
              }}
              py={8}
              mb={8}
              align="center"
            >
              <Grid.Col span={!isMd ? 3 : 4}>
                <Text fz={14} fw={500}>
                  Name
                </Text>
              </Grid.Col>
              {!isMd && (
                <Grid.Col span={3}>
                  <Text fz={14} fw={500}>
                    Father's Name
                  </Text>
                </Grid.Col>
              )}
              <Grid.Col span={!isMd ? 3 : 4}>
                <Text fz={14} fw={500}>
                  Phone No
                </Text>
              </Grid.Col>
              <Grid.Col span={!isMd ? 3 : 4}>
                <Text fz={14} fw={500}>
                  Marks Scored
                </Text>
              </Grid.Col>
            </Grid>
            <Stack h="100%">
              {props.batch.students.map((x, index) => {
                return (
                  <Grid px={10} align="center" key={x._id}>
                    <Grid.Col span={!isMd ? 3 : 4}>
                      <Text fz={14} fw={500} color="#7D7D7D">
                        {x.name}
                      </Text>
                    </Grid.Col>
                    {!isMd && (
                      <Grid.Col span={3}>
                        <Text fz={14} fw={500} color="#7D7D7D">
                          {x.parentName}
                        </Text>
                      </Grid.Col>
                    )}
                    <Grid.Col span={!isMd ? 3 : 4}>
                      <Text fz={14} fw={500} color="#7D7D7D">
                        {x.phoneNumber[0]}
                      </Text>
                    </Grid.Col>
                    <Grid.Col span={!isMd ? 3 : 4}>
                      <Flex
                        style={{
                          border: x.isError
                            ? "1px solid red"
                            : "1px solid #D3D3D3",
                          borderRadius: "6px",
                        }}
                        align="center"
                        justify="center"
                        py={5}
                        px={10}
                      >
                        <NumberInput
                          hideControls
                          value={x.marks ?? 0}
                          styles={{
                            input: {
                              border: "none",
                              borderBottom: "1px solid black",
                              borderRadius: "0%",
                              width: "30px",
                              marginBottom: 10,
                              fontSize: 16,
                              padding: 0,
                              margin: 0,
                              textAlign: "center",
                            },
                          }}
                          style={{
                            border: "none",
                          }}
                          min={0}
                          onChange={(changedValue) => {
                            if (changedValue || changedValue === 0) {
                              if (
                                changedValue >= 0 &&
                                changedValue <= maxMarks!!
                              ) {
                                const updatedInputData = [
                                  ...props.batch.students,
                                ];
                                updatedInputData[index].marks = changedValue;
                                updatedInputData[index].isError = false;
                              } else {
                                const updatedInputData = [
                                  ...props.batch.students,
                                ];
                                updatedInputData[index].isError = true;
                              }
                            } else {
                              const updatedInputData = [
                                ...props.batch.students,
                              ];
                              updatedInputData[index].isError = true;
                            }
                          }}
                        />
                        <Text color="#D3D3D3" fz={40} fw={100} mx={5}>
                          /
                        </Text>
                        <Text color="#D3D3D3" fz={20} mr={20}>
                          {" "}
                          {maxMarks!!}
                        </Text>
                        {isLoading === true && selectedStudent === x._id && (
                          <Loader size={10} />
                        )}
                        {x.pdfLink &&
                        x.pdfLink !== "" &&
                        x.pdfFileName &&
                        x.pdfFileName !== "" ? (
                          <Flex
                            style={{
                              border: "black solid 1px",
                              borderRadius: "10px",
                            }}
                            align="center"
                            px={10}
                          >
                            <Text
                              style={{
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                maxWidth: "100px",
                              }}
                            >
                              {x.pdfFileName}
                            </Text>
                            <IconX
                              onClick={() => {
                                const updatedInputData = [
                                  ...props.batch.students,
                                ];
                                updatedInputData[index].pdfLink = "";
                                updatedInputData[index].pdfFileName = "";
                                props.setBatch({
                                  ...props.batch,
                                  students: updatedInputData,
                                });
                              }}
                              style={{
                                cursor: "pointer",
                              }}
                              size={20}
                            />
                          </Flex>
                        ) : (
                          <>
                            <IconFile
                              onClick={() => {
                                fileInputRef.current?.click();
                                if (x) setSelectedStudent(x._id!!);
                              }}
                              style={{
                                cursor: "pointer",
                              }}
                            />
                          </>
                        )}
                      </Flex>
                    </Grid.Col>
                    <Grid.Col span={12}>
                      <Divider w="100%" />
                    </Grid.Col>
                  </Grid>
                );
              })}
            </Stack>
          </Stack>
        </Stack>
      )}
      <Stack
        style={{
          position: "fixed",
          width: "100%",
          bottom: isMd ? 60 : 0,
          left: -10,
          borderTop: "1px solid #B7B7B7",
          borderBottom: "1px solid #B7B7B7",
          background: "#FFF",
          boxShadow: "0px -10px 9px 0px rgba(0, 0, 0, 0.04)",
        }}
        py={10}
        align="center"
        spacing={1}
      >
        {isError && (
          <Text color="red" px={30} ta="center" fz={15}>
            Marks should be greater than 0 and less than {maxMarks!!}
          </Text>
        )}
        <Button
          style={{
            fontSize: 16,
            fontWeight: 500,
          }}
          size="lg"
          disabled={isLoading}
          onClick={() => {
            const found = props.batch.students.find((x) => x.isError === true);
            if (!found) {
              handleSubmit();
            } else {
              setIserror(true);
            }
          }}
        >
          Submit
        </Button>
      </Stack>
      <FileInput
        value={file}
        onChange={setFile}
        ref={fileInputRef}
        display="none"
      />
      <LoadingOverlay
        visible={isDataLoading}
      />
    </>
  );
}
