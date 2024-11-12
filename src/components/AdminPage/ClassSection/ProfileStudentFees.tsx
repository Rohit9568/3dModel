import { useEffect, useState } from "react";
import { GetPaymentRecordsById } from "../../../_parentsApp/features/instituteStudentSlice";
import {
  Select,
  Stack,
  LoadingOverlay,
  Flex,
  Grid,
  Divider,
  Text,
  Center,
  SimpleGrid,
  Box
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { useNavigate } from "react-router-dom";

interface StudentFeesProps {
    studentData: {
        studentId: string;
    };
    batchId:string;
}

function ProfileStudentFees(props: StudentFeesProps) {
  const isMd = useMediaQuery(`(max-width: 500px)`);
  const [studentOptions, setStudentOptions] = useState<
    {
      value: string;
      label: string;
    }[]
  >([]);
  const [feesRecords, setFeesRecords] = useState<StudentFeeRecord[]>([]);
  const [isLoading, setIsloading] = useState<boolean>(false);
  const navigate = useNavigate();


  useEffect(() => {
    setIsloading(true);
    GetPaymentRecordsById({
      id: props.studentData.studentId,
      batchId:props.batchId
    })
      .then((x: any) => {
        setFeesRecords(x.paymentRecords);
        console.log(x)
        setIsloading(false);
      })
      .catch((e) => {
        console.log(e);
        setIsloading(false);
      });
    
  }, []);


  const truncatedStudentOptions = studentOptions.map((option) => {
    const labelLength = option.label.replace(/\s/g, "").length;
    const truncatedLabel =
      labelLength > 10 ? `${option.label.slice(0, 10)}...` : option.label;
    return {
      ...option,
      labelLength,
      label: truncatedLabel,
    };
  });

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

  console.log(groupedRecords)
  return (
    <>
   <Stack h="100%" spacing={10}>
        <LoadingOverlay visible={isLoading} />
        <div
            style={{
            height: '100%',
            overflow: "hidden",
            transition: "height 0.3s ease-in-out",
            border: '2px solid #FFFFFF',
            borderRadius: '1.5vh',
            backgroundColor: 'white',
            paddingBottom: '2vh',
            boxShadow: '0px 0px 25.71428680419922px 0px rgba(0, 0, 0, 0.1)', 
            }}
        >
            <Flex
            align="center"
            justify="space-between"
            px={15}
            my={10}
            >
            <Text fz={15} fw={700} m={5} mt={10}>
                Fee Records
            </Text>
            </Flex>
            {feesRecords.length === 0 ? (
            <Center h="30vh" w="100%">
                <Stack justify="center" align="center">
                <img
                    src={require("../../../assets/empty.png")}
                    style={{
                    width: "100px",
                    }}
                />
                <Text>Your fee can be viewed in this section</Text>
                </Stack>
            </Center>
            ) : (
                <Box style={{ maxHeight: "28vh", overflowY: "auto", overflowX: 'hidden'}}>
                    <style>
                        {`
                        ::-webkit-scrollbar {
                            width: 6px;
                        }

                        ::-webkit-scrollbar-track {
                            background: white;
                        }

                        ::-webkit-scrollbar-thumb {
                            background: #CACACA;
                            border-radius: 10px;
                        }
                        `}
                    </style>                    
                    {Object.entries(groupedRecords).map(([monthName, records]) => (
                    <Stack key={monthName} mt={16}>
                        <Flex align="center" justify='flex-start'>
                        <Text fz={12} fw={400} px={15}>
                            {monthName}
                        </Text>
                        </Flex>
                        <Box>
                        <Grid>
                            {records.map(({ date, month, installment, amount }) => (
                            <Grid.Col key={`${month}-${date}-${installment}`} span={12}>
                                <Grid px={15}>
                                <Grid.Col span={2}>
                                    <Text fz={12} fw={400} style={{ marginBottom: "-10px" }}>
                                    {`${month}`}
                                    </Text>
                                    <Text fz={20} fw={400} style={{ marginTop: "-10px" }}>
                                    {`${date}`}
                                    </Text>
                                </Grid.Col>
                                <Grid.Col span={7}>
                                    <Text fz={18} fw={400}>{`Installment${installment}`}</Text>
                                </Grid.Col>
                                <Grid.Col span={2} mt={4} style={{ whiteSpace: "nowrap" }}>
                                    <Text fz={18} fw={700} color="#3174F3">{`₹ ${amount}`}</Text>
                                </Grid.Col>
                                </Grid>
                            </Grid.Col>
                            ))}
                        </Grid>
                        </Box>
                    </Stack>
                    ))}
            </Box>
            
            )}
        </div>
    </Stack>

    </>
  );
}
export default ProfileStudentFees;
