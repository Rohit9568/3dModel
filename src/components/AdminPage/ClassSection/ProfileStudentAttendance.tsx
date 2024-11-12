import { useEffect, useState } from "react";
import { GetStudentAttendance } from "../../../_parentsApp/features/instituteStudentSlice";
import {
  Select,
  Stack,
  LoadingOverlay,
  Flex,
  Text,
  Divider,
  Center,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { IconChevronDown } from "@tabler/icons";
// import Calendar from 'react-calendar';
import { Calendar } from "react-calendar";
import "react-calendar/dist/Calendar.css";
import styled from "styled-components";
import { AttendanceStatus } from "./AttendanceCard";

const StyledCalendar = styled(Calendar)`
  border-radius: 12px;
  height: 100%;
  font-family: Nunito;
  padding: 2vh;
  box-shadow: 0px 0px 25.71428680419922px 0px rgba(0, 0, 0, 0.1);
  border: 2px solid white;

  .react-calendar__tile--now {
    background-color: #f0f0f0;
  }

  .react-calendar__tile--weekend {
    background-color: #f0f0f0;
  }

  .react-calendar__tile--activeStart,
  .react-calendar__tile--activeEnd {
    background-color: #3174f3;
    color: white;
  }

  .react-calendar__tile {
    font-size: 10px;
    font-weight: 400;
  }
  .react-calendar__month-view__weekdays__weekday {
    font-size: 9px;
    font-weight: 600;
    text-decoration: none !important;
  }

  .react-calendar__navigation {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .react-calendar__navigation__label {
    flex: 3;
    display: flex;
    justify-content: center;
    order: 0;
    flex-wrap: nowrap;
  }

  .react-calendar__navigation__next-button,
  .react-calendar__navigation__prev-button {
    min-width: 14px;
  }
  .react-calendar__navigation__next2-button,
  .react-calendar__navigation__prev2-button {
    display: none;
  }

  .react-calendar__navigation__label {
    order: -1;
    font-size: 15px;
    font-weight: 700;
    flex: 1;
  }
  .present-date {
    background-color: #ecfaef !important;
    border-radius: 100%;
    color: black !important;
  }
  .absent-date {
    background-color: #fce8ee !important;
    border-radius: 100%;
    color: black !important;
  }
  .no-record {
    background-color: #f9f9f9 !important;
    border-radius: 100%;
    color: black !important;
  }
`;

interface StudentAttendanceProps {
  studentData: {
    studentId: string;
  };
}

function ProfileStudentAttendance(props: StudentAttendanceProps) {
  const isMd = useMediaQuery(`(max-width: 500px)`);
  const [studentOptions, setStudentOptions] = useState<
    {
      value: string;
      label: string;
    }[]
  >([]);
  const [attendanceRecords, setAttendanceRecords] = useState<
    StudentAttendanceRecord[]
  >([]);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(
    null
  );
  const [totalPresent, setTotalPresent] = useState<number>(0);
  const [totalAbsent, setTotalAbsent] = useState<number>(0);
  const [isLoading, setIsloading] = useState<boolean>(false);
  const [viewDate, setViewDate] = useState(new Date());

  function getStudentAttendance(studentId: string) {
    setIsloading(true);
    console.log(studentId);
    GetStudentAttendance({
      id: studentId,
    })
      .then((x: any) => {
        console.log(x);
        setAttendanceRecords(x);
        setTotalPresent(x.filter((record: any) => record.isPresent).length);
        setTotalAbsent(x.filter((record: any) => !record.isPresent).length);
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

  const calculateAttendanceTotals = (date: any) => {
    const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
    const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);

    const filteredRecords = attendanceRecords.filter((record) => {
      const recordDate = new Date(record.date);
      return recordDate >= monthStart && recordDate <= monthEnd;
    });

    const totalPresent = filteredRecords.filter(
      (record) =>
        record.status === AttendanceStatus.PRESENT ||
        record.status === AttendanceStatus.ONLINE
    ).length;
    const totalAbsent = filteredRecords.length - totalPresent;

    return { totalPresent, totalAbsent };
  };

  return (
    <>
      <Stack h="100%" spacing={10}>
        <LoadingOverlay visible={isLoading} />
        <Flex>
          <StyledCalendar
            value={null}
            onActiveStartDateChange={({ activeStartDate }) => {
              if (activeStartDate !== null) {
                setViewDate(activeStartDate);
              }
            }}
            tileClassName={({ date }) => {
              const record = attendanceRecords.find(
                (record) =>
                  new Date(record.date).getDate() === date.getDate() &&
                  new Date(record.date).getMonth() === date.getMonth() &&
                  new Date(record.date).getFullYear() === date.getFullYear()
              );
              if (record) {
                return record &&
                  (record.status === AttendanceStatus.PRESENT ||
                    record.status === AttendanceStatus.ONLINE)
                  ? "present-date"
                  : "absent-date";
              } else {
                return "no-record";
              }
            }}
            tileDisabled={({ date, view }) =>
              view === "month" && date.getMonth() !== viewDate.getMonth()
            }
            navigationLabel={({ label, view }) => {
              if (view === "year") {
                return <span style={{ whiteSpace: "nowrap" }}>{label}</span>;
              }
              const { totalPresent, totalAbsent } =
                calculateAttendanceTotals(viewDate);
              return (
                <div
                  style={{
                    display: "flex",
                    justifyContent:
                      totalPresent !== 0 ? "space-between" : "flex-start",
                    alignItems: "center",
                    width: totalPresent !== 0 ? "100%" : "fit-content",
                    paddingRight: "2vh",
                  }}
                >
                  {totalPresent === 0 ? (
                    <span style={{ whiteSpace: "nowrap" }}>{label}</span>
                  ) : (
                    <>
                      <span style={{ whiteSpace: "nowrap" }}>{label}</span>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "5px",
                          whiteSpace: "nowrap",
                        }}
                      >
                        <span
                          style={{
                            fontSize: "0.85rem",
                            fontWeight: "bold",
                            backgroundColor: "#E4EDFE",
                            color: "#3174F3",
                            borderRadius: "8px",
                            padding: "8px",
                          }}
                        >
                          {totalPresent}/{totalAbsent + totalPresent} days
                        </span>
                        <span
                          style={{
                            fontSize: "0.85rem",
                            fontWeight: "bold",
                            backgroundColor: "#E4EDFE",
                            color: "#3174F3",
                            borderRadius: "8px",
                            padding: "8px",
                          }}
                        >
                          {(
                            (totalPresent / (totalAbsent + totalPresent)) *
                            100
                          ).toFixed(1)}
                          %
                        </span>
                      </div>
                    </>
                  )}
                </div>
              );
            }}
          />
        </Flex>
      </Stack>
    </>
  );
}
export default ProfileStudentAttendance;
