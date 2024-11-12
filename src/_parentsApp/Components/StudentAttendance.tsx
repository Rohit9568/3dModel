import { useEffect, useState } from "react";
import { GetStudentAttendance } from "../../_parentsApp/features/instituteStudentSlice";
import {
  Stack,
  Flex,
  Text,
  Divider,
  Center,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";

interface StudentAttendanceProps {
  studentData: {
    classId: string;
    className: string;
    studentName: string;
    studentId: string;
  };
}

function StudentAttendance(props: StudentAttendanceProps) {
  const isMd = useMediaQuery(`(max-width: 500px)`);

  const [attendanceRecords, setAttendanceRecords] = useState<
    StudentAttendanceRecord[]
  >([]);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(
    null
  );
  const [isLoading, setIsloading] = useState<boolean>(false);

  function getStudentAttendance(studentId: string) {
    setIsloading(true);
    GetStudentAttendance({
      id: studentId,
    })
      .then((x: any) => {
        console.log(x);
        setAttendanceRecords(x);
        setIsloading(false);
      })
      .catch((e) => {
        console.log(e);
        setIsloading(false);
      });
  }

  useEffect(() => {
      setSelectedStudentId(props.studentData.studentId);
  }, [props.studentData]);


  useEffect(() => {
    if (selectedStudentId) {
      getStudentAttendance(selectedStudentId);
    }
  }, [selectedStudentId]);

  return (
      <Stack h="100%" spacing={10}>
     
         
              <Flex align="center" justify="space-between" px={20}>
                <Flex direction="column" px={10}>
                  <Text fz={17} fw={700}>
                    Date
                  </Text>
                </Flex>
                <Flex direction="column">
                  <Text fz={17} fw={700} mr={20}>
                    Attendance
                  </Text>
                </Flex>
              </Flex>
              <Divider color="#F4F4F4" size="md" />
              {attendanceRecords.length === 0 ? (
                <Center h="30vh" w="100%">
                  <Stack justify="center" align="center">
                    <img
                      src={require("../../assets/noattendance.png")}
                      style={{
                        width: "100px",
                      }}
                    />
                    <Text>Your attendance can be viewed in this section</Text>
                  </Stack>
                </Center>
              ) : (
                attendanceRecords.map((record, index) => (
                  <>
                    <Flex
                      align="center"
                      justify="space-between"
                      px={20}
                      key={record._id}
                    >
                      <Flex direction="column" style={{ flex: 1 }}>
                        <Text fz={15} fw={400} ml={8}>
                          {`${new Date(record.date).getDate()}-${
                            new Date(record.date).getMonth() + 1
                          }-${new Date(record.date).getFullYear()}`}
                        </Text>
                      </Flex>
                      <Flex direction="column" px={20}>
                        <Flex align="center">
                          <Text fz={15} fw={400} c="#7D7D7D">
                            {record.status}
                          </Text>
                        </Flex>
                      </Flex>
                    </Flex>
                    <Divider color="#F4F4F4" size="md" />
                  </>
                ))
              )}
      </Stack>
  );
}
export default StudentAttendance;
