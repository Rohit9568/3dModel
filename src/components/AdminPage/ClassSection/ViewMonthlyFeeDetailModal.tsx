import { useEffect, useState } from "react";
import { getMonthsFromDate } from "./ListClasses";
import { GetAllMonthsDataByClassId } from "../../../_parentsApp/features/instituteClassSlice";
import { Button, Flex, Select, Stack, Text } from "@mantine/core";
import { IconCurrencyRupee } from "@tabler/icons";
import { GetAllStudentsByClassId } from "../../../features/StudentSlice";

interface ViewMonthlyFeeDetailsProps {
  classId: string;
  onClose: () => void;
}

export function ViewMonthlyFeeDetails(props: ViewMonthlyFeeDetailsProps) {
  const today = new Date();
  const monthDate = new Date(today.getFullYear(), today.getMonth(), 2);
  const [
    initialselectedClassMonthFeeData,
    setinitialSelectedClassMonthFeeData,
  ] = useState<FeeData[]>([]);
  const [defaultPrice, setDefaultPrice] = useState<number>(0);
  const [maxFee, setMaxFee] = useState<number>(0);
  const [totalPaidFees, setTotalPaidFees] = useState<number>(0);
  const [selectedClassMonthFeeData, setSelectedClassMonthFeeData] = useState<
    FeeData[]
  >([]);
  const [datesData, setDatesData] = useState<
    {
      value: string;
      label: string;
    }[]
  >([]);
  const [dateValue, setDateValue] = useState<Date | null>(monthDate);
  const [students, setStudents] = useState<StudentsDataWithBatch[]>([]);
  const [paymentRecords, setPaymentRecords] = useState<StudentFeeRecord[]>([]);

  useEffect(() => {
    students.map((x) => {
      setPaymentRecords((prev) => [...prev, ...x.paymentRecords!!]);
    }, []);
  }, [students]);

  function getAllMonthFeeData() {
    GetAllMonthsDataByClassId({ id: props.classId })
      .then((x: any) => {
        setinitialSelectedClassMonthFeeData(x.courseFees);
        setSelectedClassMonthFeeData(x.courseFees);
        setDefaultPrice(x.lastupdatedCourseFee);
        setDatesData(
          getMonthsFromDate(
            x.startFeeMonth ? new Date(x.startFeeMonth) : new Date()
            // new Date("2023-01-01T18:30:00.000+00:00")
          )
        );
      })
      .catch((e) => {
        console.log(e);
      });
  }

  useEffect(() => {
    if (dateValue) {
      const found = selectedClassMonthFeeData.find(
        (x) => new Date(x.monthDate).toUTCString() === dateValue.toUTCString()
      );
      if (found) {
        setMaxFee(found.coursefees);
      } else {
        setMaxFee(defaultPrice);
      }
      let paid = 0;
      paymentRecords.map((x) => {
        if (dateValue.toUTCString() === new Date(x.monthDate).toUTCString()) {
          paid += x.pricePaid;
        }
      });
      setTotalPaidFees(paid);
    }
  }, [dateValue,selectedClassMonthFeeData,paymentRecords]);

  function GetAllStudents(classId: string) {
    GetAllStudentsByClassId({ id: classId })
      .then((response: any) => {
        setStudents(response.students);
      })
      .catch((e) => {
        console.log(e);
      });
  }

  useEffect(() => {
    GetAllStudents(props.classId);
    getAllMonthFeeData();
  }, [props.classId]);

  return (
    <Stack>
      <Select
        data={datesData}
        value={dateValue ? dateValue.toUTCString() : ""}
        onChange={(val) => {
          if (val) {
            const date = new Date(val);
            setDateValue(date);
          }
        }}
      />
      <Flex
      justify="center"
      >
        <IconCurrencyRupee />
        <Text 
        fz={20}
        >
          <span style={{
            fontWeight:700
          }}>{totalPaidFees}</span>
        </Text>
      </Flex>
      <Flex
      justify="end"
      >
        <Button
          onClick={() => {
            props.onClose();
          }}
          sx={{
            color: "#000000",
            border: "1px solid #808080",
          }}
          variant="outline"
        >
          Close
        </Button>
      </Flex>
    </Stack>
  );
}
