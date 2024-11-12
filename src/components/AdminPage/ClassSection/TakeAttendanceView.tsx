import {
  Box,
  Button,
  Center,
  Flex,
  LoadingOverlay,
  Modal,
  ScrollArea,
  Select,
  SimpleGrid,
  Stack,
  Text,
} from "@mantine/core";
import {
  AttendanceCard,
  AttendanceStatus,
  SavedAttendanceCard,
} from "./AttendanceCard";
import { DatePicker } from "@mantine/dates";
import { IconCalendar } from "@tabler/icons";
import { useEffect, useState } from "react";
import { insertNewAttendance } from "../../../features/classes/classSlice";
import { showNotification } from "@mantine/notifications";
import { IconBackArrow } from "../../_Icons/CustonIcons";
import { AddHomeworkModal } from "../HomeSection/AddHomeworkModal";

interface TakeAttendanceViewProps {
  students: StudentsDataWithBatch[];
  batchId: string;
  onBackClicked: () => void;
  subjects: {
    label: string;
    value: string;
  }[];
  addHomework: (description: string, uploadPhoto?: File) => void;
}

export function TakeAttendanceView(props: TakeAttendanceViewProps) {
  const [attendanceDate, setAttendanceDate] = useState<Date | null>();
  const [todaysDate, setTodaysDate] = useState<Date>();
  const [attendanceNotTakenForTheDay, setAttendanceNotTakenForTheDay] =
    useState<boolean>(true);
  const [currentDateStudentAttendanceRecords, setCurrentDateAttendanceRecords] =
    useState<StudentAttendanceRecord[]>([]);

  const [openHomeWorkModal, setOpenHomeWorkModal] = useState<boolean>(false);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>();

  useEffect(() => {
    var todayDate = new Date(Date.now());
    todayDate.setHours(6, 0, 0, 0);
    setTodaysDate(todayDate);
    setAttendanceDate(todayDate);
    if (props.subjects.length > 0) {
      setSelectedSubjectId(props.subjects[0].value);
    }
  }, []);

  function findAttendanceRecordByDate(
    attendanceRecords: StudentAttendanceRecord[]
  ): StudentAttendanceRecord | null {
    for (let i = 0; i < attendanceRecords.length; i++) {
      var attDateObject = new Date(attendanceRecords[i].date);
      attDateObject.setHours(6, 0, 0, 0);
      attendanceRecords[i].date = attDateObject;
      if (attDateObject.toDateString() == attendanceDate?.toDateString()) {
        return attendanceRecords[i];
      }
    }
    return null;
  }

  useEffect(() => {
    if (!attendanceDate) return;
    const currentDateStudentAttendanceRecords = [];
    for (let i = 0; i < props.students.length; i++) {
      const item = props.students[i];
      var attRec = findAttendanceRecordByDate(item.attendance!!);
      setAttendanceNotTakenForTheDay(true);
      if (attRec != null) {
        setAttendanceNotTakenForTheDay(false);
        attRec!!.studentId = item._id;
        currentDateStudentAttendanceRecords.push(attRec);
      } else if (attendanceDate.toDateString() == todaysDate?.toDateString()) {
        setAttendanceNotTakenForTheDay(false);
        attRec = {
          studentId: item._id,
          _id: "",
          status: AttendanceStatus.PRESENT,
          date: attendanceDate!!,
        };
        item.attendance?.push(attRec);
        currentDateStudentAttendanceRecords.push(attRec);
      }
    }
    setCurrentDateAttendanceRecords(currentDateStudentAttendanceRecords);
  }, [attendanceDate]);

  function submitAttendance() {
    insertNewAttendance({
      attendance: currentDateStudentAttendanceRecords,
      date: currentDateStudentAttendanceRecords[0].date!,
      instituteClassId: props.batchId,
    })
      .then(() => {
        showNotification({ message: "Attendance recorded successfully" });
      })
      .catch((e) => {});
    if (props.subjects.length > 0) {
      setOpenHomeWorkModal(true);
    }
  }

  return (
    <>
      <Stack w={"100%"} mt={16}>
        <Flex align={"center"}>
          <Box
            w="24px"
            h="24px"
            onClick={() => props.onBackClicked()}
            style={{ cursor: "pointer" }}
          >
            <IconBackArrow col="black" />
          </Box>
          <Text ml={24} fw={600} fz={24}>
            View/Take Attendance
          </Text>
        </Flex>
        <DatePicker
          inputFormat="DD/MM/YY"
          rightSection={<IconCalendar stroke={1} />}
          value={attendanceDate}
          onChange={(date: Date | null) => {
            date?.setHours(0, 0, 0, 0);
            setAttendanceDate(date);
          }}
          clearable={false}
          maxDate={new Date(Date.now())}
          radius={50}
          styles={{
            rightSection: {
              marginRight: 10,
            },
          }}
          w={200}
        />
      </Stack>
      {props.students.length === 0 && (
        <Center h="65dvh" w="100%">
          <Stack align="center" justify="center">
            <Box
              style={{
                backgroundColor: "#EEF4FF",
                borderRadius: "50%",
                height: 148,
                width: 148,
              }}
            >
              <Center h="100%">
                <img
                  src={require("./../../../assets/emptypageclass.png")}
                  width="50%"
                  height="50%"
                />
              </Center>
            </Box>
            <Text color="#A4A4A4" fw={500}>
              No student added yet!
            </Text>
          </Stack>
        </Center>
      )}
      {currentDateStudentAttendanceRecords.length > 0 &&
        props.students.length !== 0 && (
          <>
            <SimpleGrid
              style={{
                backgroundColor: "#E4EDFD",
                height: "40px",
                alignContent: "center",
              }}
              mt={20}
              fw={450}
              fz={13}
              cols={3}
            >
              <Text ml={10}>Name</Text>
              <Text>Phone Number</Text>
              <Center>
                <Text>
                  {" "}
                  {attendanceDate == todaysDate
                    ? "Mark Attendance"
                    : "Attendance"}
                </Text>
              </Center>
            </SimpleGrid>
            <ScrollArea h={"50dvh"} mt={8} pb={20}>
              {props.students.map((student, index) => {
                return (
                  <>
                    {attendanceDate?.toDateString() ==
                    todaysDate?.toDateString() ? (
                      <AttendanceCard
                        name={student.name}
                        phone={student.phoneNumber[0]}
                        status={
                          AttendanceStatus[
                            findAttendanceRecordByDate(student.attendance!!)
                              ?.status as keyof typeof AttendanceStatus
                          ]
                        }
                        setSingleAttendance={(val: AttendanceStatus) => {
                          currentDateStudentAttendanceRecords[index].status =
                            val.toString();
                          setCurrentDateAttendanceRecords([
                            ...currentDateStudentAttendanceRecords,
                          ]);
                        }}
                        hidePhoneNumbers={false}
                      />
                    ) : (
                      <SavedAttendanceCard
                        studentId={student._id!!}
                        name={student.name}
                        phone={student.phoneNumber[0]}
                        date={attendanceDate!!}
                        submitHandler={() => {}}
                        status={
                          AttendanceStatus[
                            findAttendanceRecordByDate(student.attendance!!)
                              ?.status as keyof typeof AttendanceStatus
                          ]
                        }
                      />
                    )}
                  </>
                );
              })}
            </ScrollArea>
            {attendanceDate?.toDateString() == todaysDate?.toDateString() && (
              <Center>
                <Button
                  onClick={() => {
                    submitAttendance();
                  }}
                  style={{ backgroundColor: "#4B65F6" }}
                  px={100}
                >
                  Submit
                </Button>
              </Center>
            )}
          </>
        )}

      {currentDateStudentAttendanceRecords.length == 0 && (
        <Center h="65dvh" w="100%">
          <Stack align="center" justify="center">
            <Text color="#A4A4A4" fw={500}>
              No Attendance was recorded for this day!
            </Text>
          </Stack>
        </Center>
      )}
      {openHomeWorkModal && (
        <Modal
          onClose={() => {
            setOpenHomeWorkModal(false);
          }}
          opened={openHomeWorkModal}
        >
          <Select
            data={props.subjects}
            label="Add any notice/update with the Attedance"
            value={selectedSubjectId}
            onChange={(value) => {
              if (value) setSelectedSubjectId(value);
            }}
          />
          <AddHomeworkModal
            onSubmitClick={(description: string, uploadPhoto?: File) => {
              props.addHomework(description, uploadPhoto);
              setOpenHomeWorkModal(false);
            }}
          />
        </Modal>
      )}
    </>
  );
}
