import { useEffect, useState } from "react";
import { GetPaymentRecordsById } from "../../_parentsApp/features/instituteStudentSlice";
import {
  Select,
  Stack,
  LoadingOverlay,
  Flex,
  Grid,
  Divider,
  Text,
  Center,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import styled from "styled-components";

interface StudentFeesProps {
  studentData: {
    classId: string;
    className: string;
    studentName: string;
    studentId: string;
    phoneNumber: string;
  };
  parentName: string | null;
}

function StudentSideAllFeeView(props: StudentFeesProps) {

  const [feesRecords, setFeesRecords] = useState<StudentFeeRecord[]>([]);
  const [isLoading, setIsloading] = useState<boolean>(false);
  const [isWrappedAbout, setIsWrappedAbout] = useState<boolean>(true);
  const [isWrappedFee, setIsWrappedFee] = useState<boolean>(true);
  useEffect(() => {
    setIsloading(true);
    GetPaymentRecordsById({
      id: props.studentData.studentId,
      batchId:"",
    })
      .then((x: any) => {
        setFeesRecords(x.paymentRecords);
        setIsloading(false);
      })
      .catch((e) => {
        console.log(e);
        setIsloading(false);
      });
  }, []);

  const groupedRecords: {
    [key: string]: {
      date: string;
      month: string;
      installment: string;
      amount: number;
    }[];
  } = feesRecords.reduce((acc, record) => {
    const date = new Date(record.createdAt).toLocaleDateString("en-IN");
    const day = new Date(record.createdAt).getDate();
    const installment = parseInt(record.receiptNo.split("-")[1]) + 1;
    const monthShort = new Date(record.createdAt).toLocaleString("default", {
      month: "short",
    });
    const monthLong = new Date(record.createdAt).toLocaleString("default", {
      month: "long",
    });
    const key = `${monthLong}`;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push({
      date: `${day}`,
      month: `${monthShort}`,
      installment: `${installment}`,
      amount: record.pricePaid,
    });
    return acc;
  }, {} as { [key: string]: { date: string; month: string; installment: string; amount: number }[] });
  return (
    <>
      <Stack h="100%" spacing={10}>
        <LoadingOverlay visible={isLoading} />
        <Divider color="#F4F4F4" size="md" mt={6} />
        <Flex
          align="center"
          justify="space-between"
          onClick={() => setIsWrappedAbout(!isWrappedAbout)}
          px={20}
        >
          <Text fz={17} fw={400}>
            About
          </Text>
          <img
            src={require("../../assets/wrapbutton.png")}
            alt="back"
            style={{
              width: "7px",
              cursor: "pointer",
              transform: !isWrappedAbout ? "rotate(90deg)" : "rotate(0deg)",
            }}
          />
        </Flex>
        <div
          style={{
            height: isWrappedAbout ? "auto" : 0,
            overflow: "hidden",
            transition: "height 0.3s ease-in-out",
          }}
        >
          <Divider color="#F4F4F4" size="md" />
          <Grid ml={10} mt={5} style={{ whiteSpace: "nowrap" }}>
            <Grid.Col span={4}>
              <Text fz={15} fw={400}>
                Student Name:
              </Text>
            </Grid.Col>
            <Grid.Col span={8}>
              <Text fz={15} fw={700}>
                {
                  props.studentData.studentName
                }
              </Text>
            </Grid.Col>
            <Grid.Col span={4}>
              <Text fz={15} fw={400}>
                Father Name:
              </Text>
            </Grid.Col>
            <Grid.Col span={8}>
              <Text fz={15} fw={700}>
                {
                  props.parentName
                }
              </Text>
            </Grid.Col>
            <Grid.Col span={4}>
              <Text fz={15} fw={400}>
                Phone Number:
              </Text>
            </Grid.Col>
            <Grid.Col span={8}>
              <Text fz={15} fw={700}>
                {
                  props.studentData.phoneNumber
                }
              </Text>
            </Grid.Col>
          </Grid>
        </div>
        <Divider color="#F4F4F4" size="md" />

        { (
            <>
              <Flex
                align="center"
                justify="space-between"
                onClick={() => setIsWrappedFee(!isWrappedFee)}
                px={20}
              >
                <Text fz={17} fw={400}>
                  Fee Records
                </Text>
                {feesRecords.length !== 0 ? (
                  <img
                    src={require("../../assets/wrapbutton.png")}
                    alt="back"
                    style={{
                      width: "7px",
                      cursor: "pointer",
                      transform: !isWrappedFee
                        ? "rotate(90deg)"
                        : "rotate(0deg)",
                    }}
                  />
                ) : null}
              </Flex>
              <Divider color="#F4F4F4" size="md" />
              <div
                style={{
                  height: isWrappedFee ? "auto" : 0,
                  overflow: "hidden",
                  transition: "height 0.3s ease-in-out",
                }}
              >
                {feesRecords.length === 0 ? (
                  <Center h="30vh" w="100%">
                    <Stack justify="center" align="center">
                      <img
                        src={require("../../assets/nofees.png")}
                        style={{
                          width: "100px",
                        }}
                      />
                      <Text>Your fee can be viewed in this section</Text>
                    </Stack>
                  </Center>
                ) : (
                  Object.entries(groupedRecords).map(([monthName, records]) => (
                    <Stack key={monthName} mt={10}>
                      <Flex align="center" justify="space-between" px={20}>
                        <Text fz={15} fw={400}>
                          {monthName}
                        </Text>
                      </Flex>
                      <Grid>
                        {records.map(({ date, month, installment, amount }) => (
                          <Grid.Col
                            key={`${month}-${date}-${installment}`}
                            span={12}
                          >
                            <Grid
                              px={15}
                            >
                              <Grid.Col span={2}>
                                <Text
                                  fz={14}
                                  fw={400}
                                  style={{ marginBottom: "-10px" }}
                                >{`${month}`}</Text>
                                <Text
                                  fz={22}
                                  fw={400}
                                  style={{ marginTop: "-10px" }}
                                >{`${date}`}</Text>
                              </Grid.Col>
                              <Grid.Col span={8}>
                                <Text
                                  fz={22}
                                  fw={400}
                                >{`Installment${installment}`}</Text>
                              </Grid.Col>
                              <Grid.Col
                                span={1}
                                mt={4}
                                style={{
                                  whiteSpace: "nowrap",
                                  marginLeft: "-10px",
                                }}
                              >
                                <Text
                                  fz={18}
                                  fw={400}
                                  color="#3174F3"
                                >{`₹ ${amount}`}</Text>
                              </Grid.Col>
                            </Grid>
                          </Grid.Col>
                        ))}
                      </Grid>


                    </Stack>
                  ))
                )}
              </div>
            </>
          )}
      </Stack>
    </>
  );
}
export default StudentSideAllFeeView;
