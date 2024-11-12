import {
  Box,
  Button,
  Center,
  Flex,
  Grid,
  Group,
  LoadingOverlay,
  Modal,
  Select,
  SimpleGrid,
  Stack,
  Text,
} from "@mantine/core";
import { IconEdit } from "@tabler/icons";
import { useEffect, useState } from "react";
import { UpdateStudentAttendance } from "../../../_parentsApp/features/instituteStudentSlice";

export enum AttendanceStatus {
  PRESENT = "PRESENT",
  ABSENT = "ABSENT",
  LATE = "LATE",
  ONLINE = "ONLINE",

}

const attendanceData = [
  AttendanceStatus.PRESENT,
  AttendanceStatus.ABSENT,
  AttendanceStatus.LATE,
  AttendanceStatus.ONLINE,
];
export function AttendanceCard(props: {
  name: string;
  phone: string;
  status: AttendanceStatus;
  setSingleAttendance: (val: AttendanceStatus) => void;
  hidePhoneNumbers: boolean;
}) {

  useEffect(()=>{
    console.log(props.status);
  })

  return (
    <>
      <Box
        style={{
          width: "100%",
          minHeight: "60px",
          borderBottom: "2px #D3D3D3 solid",
        }}
      >
        <SimpleGrid mt={10} fw={500} fz={13} c={"#7D7D7D"} cols={3}>
          <Flex align={"center"}>
            <Text>{props.name}</Text>
          </Flex>
          {!props.hidePhoneNumbers && (
            <Flex align={"center"}>
              <Text>{props.phone}</Text>
            </Flex>
          )}
          <Center>
            <Select
              data={attendanceData}
              onChange={(val) => {
                if (val) {
                  props.setSingleAttendance(val as AttendanceStatus);
                }
              }}
              value={props.status}
            />
          </Center>
        </SimpleGrid>
      </Box>
    </>
  );
}
export function SavedAttendanceCard(props: {
  studentId: string;
  name: string;
  phone: string;
  status: AttendanceStatus;
  date: Date | null;
  submitHandler: () => void;
}) {

  return (
    <>
      <Box
        style={{
          width: "100%",
          minHeight: "60px",
          borderBottom: "2px #D3D3D3 solid",
        }}
      >
        <SimpleGrid mt={10} fw={500} fz={13} c={"#7D7D7D"} cols={3}>
          <Text>{props.name}</Text>
          <Text>{props.phone}</Text>
          <Center>
            { props.status !== null && (
              <Box
                h={40}
                w={40}
                style={{
                  borderRadius: "50%",
                }}
                mr={5}
              >
                <Center h={"100%"}>{props.status}</Center>
              </Box>
            )}
          </Center>
        </SimpleGrid>
      </Box>
    </>
  );
}
