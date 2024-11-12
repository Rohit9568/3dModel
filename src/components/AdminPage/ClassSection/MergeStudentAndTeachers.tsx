import {
  Badge,
  Box,
  Button,
  Center,
  Divider,
  Flex,
  Group,
  LoadingOverlay,
  Menu,
  Modal,
  ScrollArea,
  Stack,
  Table,
  Text,
} from "@mantine/core";
import { IconMessage } from "@tabler/icons";
import { lazy, useEffect, useState } from "react";
import { IconBackArrow, IconThreeDots } from "../../_Icons/CustonIcons";

import { useMediaQuery } from "@mantine/hooks";
import { showNotification } from "@mantine/notifications";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { User1 } from "../../../@types/User";
import ShowHomework from "../../../_parentsApp/Components/ShowHomework";
import StudentAttendance from "../../../_parentsApp/Components/StudentAttendance";
import StudentSideAllFeeView from "../../../_parentsApp/Components/StudentFess";
import {
  GetAllSubjectsByClassId,
  GetBatchById,
} from "../../../_parentsApp/features/instituteClassSlice";
import { CreateHomework } from "../../../_parentsApp/features/instituteHomeworkSlice";
import {
  GetAllInstituteStudents,
  getAllUnregisteredStudents,
} from "../../../_parentsApp/features/instituteSlice";
import {
  AddCourseToMultipleStudent,
  AddCourseToStudent,
  AddExistingStudentsInBatch,
  DeleteStudent,
  GetStudentInfoById,
  MoveUnregisteredStudentIntoBatch,
  RemoveStudentFromBatch,
  UpdateStudent,
  UpdateStudentActiveStatus,
} from "../../../_parentsApp/features/instituteStudentSlice";
import { CreateStudent } from "../../../features/StudentSlice";
import { GetAllTeachersByClassId } from "../../../features/classes/classSlice";
import {
  deleteNewStudentFromInstitute,
  deleteStudentFromCourse,
  getCourseById,
} from "../../../features/course/courseSlice";
import { FileUpload } from "../../../features/fileUpload/FileUpload";
import useFeatureAccess from "../../../hooks/useFeatureAccess";
import { BatchWiseStudyMaterialPage } from "../../../pages/TeachersPage/BatchWiseStudyMaterialPage";
import { VideoCallingEmptyPage } from "../../../pages/_New/VideoCallingEmptyPage";
import { RootState } from "../../../store/ReduxStore";
import { FeeStatus, getColor } from "../../../utilities/FeeUtils";
import { AdminPageEvents } from "../../../utilities/Mixpanel/AnalyticEventAdminApp";
import { TeacherPageEvents } from "../../../utilities/Mixpanel/AnalyticeEventTeacherApp";
import { Mixpanel } from "../../../utilities/Mixpanel/MixpanelHelper";
import { downloadreceipt } from "../../FeeReceiptPdf/FeeReceiptPdf";
import { EmptyListView } from "../../_New/EmptyListView";
import { BatchDetailsPage } from "../DashBoard/DashBoardStaff/BatchDetailsPage";
import { UserType } from "../DashBoard/InstituteBatchesSection";
import { AddExistingStudentsModal } from "../DashBoard/Models/AddExistingStudentsModal";
import { AddNewStudentModal } from "../DashBoard/Models/AddNewStudentModal";
import { AddStudentModal } from "../DashBoard/Models/AddStudentModal";
import { BatchSelectModal } from "../DashBoard/Models/BatchSelectModal";
import {
  HomeworkTeacher,
  ResponseForImage,
} from "../HomeSection/HomeworkTeacher";
import { SingleTest } from "../ResultSectionTeacher/SingleTest";
import { AttendanceStatus } from "./AttendanceCard";
import { LeaderBoard } from "./LeaderBoard";
import { TakeAttendanceView } from "./TakeAttendanceView";
import { UpdateStudentProfile } from "./UpdateStudentProfile";
import { ViewFeeDetailsModal } from "./ViewFeeDetailModal";
import { Recordings } from "./Recordings";
import { sendMessage } from "../../../utilities/HelperFunctions";
import useParentCommunication from "../../../hooks/useParentCommunication";
import React from "react";

interface TeachersData {
  email: string;
  name: string;
  phoneNo: string;
  _id: string;
}

interface ListStudentAndTeachersProps {
  classId: string;
  instituteId: string;
  onBackClick: (val: string) => void;
  openedFromAdminPage: boolean;
  isCourseStudentSelected: boolean;
  userType: UserType;
  isFeepayment?: boolean;
  openAddStudent?: boolean;
  openTeacher?: boolean;
  className?: string;
  resetData: () => void;
  isreceiptFeature?: boolean;
  hidePhoneNumbers?: boolean;
  hideTeacherPhoneNumber?: boolean;
  batchList: InstituteClass[];
  onEditBatchClicked?: (batchId: string) => void;
}

const MergeStudentAndTeachers = (props: ListStudentAndTeachersProps) => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const paramValue = queryParams.get("type");
  const [facultyType, setFacultyType] = useState<"STU" | "TEA" | "ALL" | null>(
    null
  );
  const [teachers, setTeachers] = useState<TeachersData[]>([]);
  const [isTeacher, setIsTeacher] = useState<boolean>(false);
  const [showWarning, setShowWarning] = useState<{
    name: string;
    _id: string;
  } | null>(null);
  const isMd = useMediaQuery(`(max-width: 500px)`);
  const [showCreateForm, setShowCreateForm] = useState<boolean>(
    props.openAddStudent || false
  );

  const user = useSelector<RootState, User1 | null>((state) => {
    return state.currentUser.user;
  });

  const [studentAttendance, setStudentAttendance] = useState<
    { studentId?: string; status: AttendanceStatus }[]
  >([]);
  const [attendanceDate, setAttendanceDate] = useState<Date | null>(
    new Date(Date.now())
  );
  const [selectedDateAttendance, setselectedDateAttendance] = useState<
    | {
        studentId: string;
        status: AttendanceStatus | null;
      }[]
    | null
  >(null);
  const [isSelectedDateToday, setIsSelectedDateToday] = useState<boolean>(true);
  const [selectedStudent, setSelectedStudent] =
    useState<StudentsDataWithBatch | null>(null);

  const [className, setClassName] = useState<string>("");
  const [viewFeeDetailsModal, setViewFeeDetailsModal] =
    useState<StudentsDataWithBatch | null>(null);
  const [viewStudentCredentialsModal, setViewStudentCredentialsModal] =
    useState<StudentsDataWithBatch | null>(null);
  const [startDate, setStartDate] = useState<string | null>(null);
  const uniqueTeachers = Array.from(new Set(teachers.map((t) => t._id))).map(
    (id) => teachers.find((t) => t._id === id)
  );
  const [isLoading, setisLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [isClasswork, setisClasswordModal] = useState<boolean>(false);
  const [subjects, setsubjects] = useState<
    {
      label: string;
      value: string;
    }[]
  >([]);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>("");
  const [addStudentModalOpen, setAddStudentModalOpen] =
    useState<boolean>(false);
  const [addFromExistingStudentModalOpen, setAddFromExistingStudentModalOpen] =
    useState<boolean>(false);
  const [addNewStudentModalOpen, setAddNewStudentModalOpen] =
    useState<boolean>(false);

  const [preSelectedStudentId, setPreSelectedStudentId] = useState<string>();

  const [instituteStudents, setInstituteStudents] = useState<
    StudentsDataWithBatch[]
  >([]);

  const [isAttendanceMode, setIsAttendanceMode] = useState<boolean>(false);

  const [unregisteredStudent, setUnregisteredStudent] =
    useState<StudentsDataWithBatch | null>();

  const user1 = useSelector<RootState, User1 | null>((state) => {
    return state.currentUser.user;
  });

  const currentStudent = useSelector<RootState, StudentsDataWithBatch | null>(
    (state) => {
      return state.studentSlice.student;
    }
  );

  const [videoCallCrediantils, setVideoCallCredentials] = useState<{
    channelName: string;
    userId: string;
    token: string;
  } | null>(null);
  const [selectedTestId, setSelectedTestId] = useState<string | null>(null);

  const [batch, setBatch] = useState<InstituteClass>();

  useEffect(() => {
    setSelectedStudent(null);
    setIsAttendanceMode(false);
  }, [activeTab]);

  function initializeBatch() {
    fetchStudents();
    setisLoading(true)
    if (props.classId.startsWith("ICLS")) {
      GetBatchById({ id: props.classId })
        .then((x: any) => {
          setisLoading(false);
          x.totalAssignedTestsNumber = x.sharedTests.length;
          x.studentsLength = x.students.length;
          x.totalTeachers = x.teachers.length;
          setClassName(x.name);
          setBatch(x);
          setisLoading(false)
        })
        .catch((error) => {
          setisLoading(false);
        });

      GetAllSubjectsByClassId({ id: props.classId })
        .then((x: any) => {
          setisLoading(false);
          setsubjects(
            x.subjects.map((y: any) => ({ label: y.name, value: y._id }))
          );
          if (x.subjects.length > 0) setSelectedSubjectId(x.subjects[0]._id);
        })
        .catch((e) => {
          setisLoading(false);
          console.log(e);
        });
    }
  }
  useEffect(() => {
    initializeBatch();
  }, []);

  async function addHomeworkhandler(description: string, uploadPhoto?: File) {
    setisLoading(true);

    const today = new Date(Date.now());
    today.setHours(0, 0, 0, 0);

    if (uploadPhoto) {
      const response = (await FileUpload({
        file: uploadPhoto,
      })) as ResponseForImage;
      if (response.url) {
        CreateHomework({
          date: today.getTime(),
          description,
          instituteClassId: props.classId,
          userSubjectId: selectedSubjectId,
          uploadImage: response.url,
        })
          .then((x: any) => {
            showNotification({
              message: "Added Update",
            });
            setisLoading(false);
          })
          .catch((e) => {
            console.log(e);
            setisLoading(false);
          });
      }
    } else {
      CreateHomework({
        date: today.getTime(),
        description,
        instituteClassId: props.classId,
        userSubjectId: selectedSubjectId,
        uploadImage: "",
      })
        .then((x: any) => {
          setisLoading(false);
        })
        .catch((e) => {
          console.log(e);
          setisLoading(false);
        });
    }
  }

  const handleTabChange = (tab: any) => {
    setActiveTab(tab);
    setIsTeacher(tab === "teachers");
  };

  useEffect(() => {
    if (paramValue === "student") {
      setFacultyType("STU");
    } else if (paramValue === "teacher") {
      setFacultyType("TEA");
    } else if (paramValue === null) {
      setFacultyType("ALL");
    }
  }, [paramValue]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  useEffect(() => {
    setisLoading(true);
    if (UserType.OTHERS == props.userType && props.classId.startsWith("ICLS")) {
      GetAllTeachersByClassId({ id: props.classId })
        .then((response: any) => {
          setisLoading(false);
          setTeachers(response.teachers);
        })
        .catch((error) => {
          setisLoading(false);

          console.error("Error fetching classes:", error);
        });
    }
  }, [props.classId, showCreateForm, facultyType]);

  useEffect(() => {}, [selectedDateAttendance]);

  const handleAddClick = () => {
    setAddStudentModalOpen(true);
  };

  function deleteHandler(id: string) {
    setisLoading(true);
    if (props.classId.startsWith("ICLS"))
      RemoveStudentFromBatch({ id, classId: props.classId })
        .then((x) => {
          props.resetData();
          initializeBatch();
          setShowWarning(null);
          setisLoading(false);
        })
        .catch((e) => {
          setShowWarning(null);
          setisLoading(false);
          console.log(e);
        });
    else if (props.classId.startsWith("UNRST")) {
      deleteNewStudentFromInstitute(props.instituteId, id)
        .then((x) => {
          props.resetData();
          initializeBatch();
          setShowWarning(null);
          setisLoading(false);
        })
        .catch((e) => {
          console.log(e);
          setShowWarning(null);
          setisLoading(false);
        });
    } else {
      deleteStudentFromCourse(props.classId, id)
        .then((x) => {
          props.resetData();
          initializeBatch();
          setShowWarning(null);
          setisLoading(false);
        })
        .catch((e) => {
          console.log(e);
          setShowWarning(null);
          setisLoading(false);
        });
    }
  }

  function editHandler(
    id: string,
    phoneNumbers: string[],
    parentName: string,
    name: string,
    dateBirth: string,
    address: string
  ) {
    setisLoading(true);
    UpdateStudent({ id, phoneNumbers, parentName, name, dateBirth, address })
      .then((x: any) => {
        initializeBatch();
        setSelectedStudent(x);
        setisLoading(false);
      })
      .catch((e) => {
        setSelectedStudent(null);
        setisLoading(false);
        console.log(e);
      });
  }

  function fetchStudents() {
    if (props.userType == UserType.OTHERS) {
      if (props.classId.startsWith("ICLS")) {
        GetAllInstituteStudents({ id: props.instituteId })
          .then((x: any) => {
            setisLoading(false);
            setInstituteStudents(x);
          })
          .catch((error) => {
            setisLoading(false);
            console.log(error);
          });
      } else if (props.classId === "UNRST") {
        setActiveTab("students");
        getAllUnregisteredStudents({ id: props.instituteId })
          .then((x: any) => {
            setInstituteStudents(x);
            setisLoading(false);
            setClassName("Unregistered Students");
          })
          .catch((e) => {
            setisLoading(false);
            console.log(e);
          });
      } else {
        setActiveTab("students");
        getCourseById(props.classId)
          .then((x: any) => {
            setisLoading(false);
            setClassName(x.name);
            setInstituteStudents(x.students);
          })
          .catch((e) => {
            console.log(e);
            setisLoading(false);
          });
      }
    }
  }
  const { isFeatureValidwithNotification, UserFeature, isFeatureValid } =
    useFeatureAccess();
  const { sendDataToReactnative, isReactNativeActive } =
    useParentCommunication();
  function downloadFeeReceiptHandler(student: StudentsDataWithBatch) {
    let totalPricePaid = 0;
    let totalPrice = 0;
    let myMap = new Map();

    setisLoading(true);
    GetStudentInfoById({ id: student._id!! })
      .then((student1: any) => {
        console.log(student1.paymentRecords);
        student1.paymentRecords.map((x: any) => {
          totalPricePaid += x.pricePaid;
          if (!myMap.has(x.courseFeeDate._id)) {
            myMap.set(x.courseFeeDate._id, true);
            totalPrice += x.courseFeeDate.coursefees;
          }
        });
        setisLoading(false);
        downloadreceipt(
          isLoading,
          setisLoading,
          `C-${student1.instituteId.receiptCount}`,
          student.name,
          new Date(),
          student.parentName,
          totalPricePaid,
          student1.paymentRecords,
          totalPrice - totalPricePaid,
          props.instituteId,
          className,
          isReactNativeActive(),
          sendDataToReactnative
        );
      })
      .catch((e) => {
        setisLoading(false);
        console.log(e);
      });
  }

  function getStatus(totalFees: number, totalPaidFees: number) {
    if (totalFees == 0) return FeeStatus.NA;
    if (totalPaidFees >= totalFees) {
      return FeeStatus.FULL;
    } else if (totalPaidFees === 0) {
      return FeeStatus.UNPAID;
    }
    return FeeStatus.PARTIAL;
  }

  function updateStudentActiveStatus(id: string) {
    UpdateStudentActiveStatus({
      studentId: id,
    })
      .then((x) => {
        initializeBatch();
        showNotification({ message: "Student status updated successfully" });
      })
      .catch((e) => {
        console.log(e);
      });
  }

  const teacherSideTabs = [
    "Overview",
    "Students",
    "Teachers",
    "Study Material",
    "Assignment",
    "Results",
    "Live Classes",
    "Leaderboard",
    "Recordings",
  ];

  const studentSideTabs = [
    "Overview",
    "Study Material",
    "Assignment",
    "Attendance",
    "Fees Status",
    "Leaderboard",
    "Recordings",
  ];

  const onlineAndUnregisteredStudentsTabs = ["Students"];

  function processString(inputString: string) {
    // Remove leading and trailing spaces
    let trimmedString = inputString.trim();

    // Extract the first word
    let words = trimmedString.split(/\s+/);
    let firstWord = words[0];

    // Remove special symbols
    let cleanedWord = firstWord.replace(/[^\w\s]/gi, "");

    return cleanedWord;
  }


  const SingleClassResult = lazy(() => import('../ResultSectionTeacher/SingleClassResult'));


  return (
    <>
      <Box w={"100%"} mih={"100vh"} pb={60} pt={isMd ? 10 : 20} bg="white">
        <Center>
          <Stack w={isMd ? "95%" : "95%"} spacing={5}>
            <Flex
              align="center"
              justify={isMd ? "flex-start" : "space-between"}
              direction={isMd ? "column" : "row"}
              w={"100%"}
            >
              <Flex w="100%">
                <Box
                  onClick={() => {
                    if (facultyType) props.onBackClick(facultyType);
                    if (!props.openedFromAdminPage) {
                      Mixpanel.track(
                        TeacherPageEvents.TEACHERS_APP_STUDENTS_PAGE_BACK_ICON_CLICK
                      );
                    } else if (props.openedFromAdminPage) {
                      if (facultyType === "TEA") {
                        Mixpanel.track(
                          AdminPageEvents.ADMIN_APP_TEACHERS_PAGE_BACK_ICON_CLICK
                        );
                      } else if (facultyType === "STU") {
                        Mixpanel.track(
                          AdminPageEvents.ADMIN_APP_STUDENTS_PAGE_BACK_ICON_CLICK
                        );
                      }
                    }
                  }}
                  mr={10}
                  style={{
                    backgroundColor: "#F8F8F8",
                    borderRadius: "50%",
                    width: "40px",
                    height: "40px",
                    cursor: "pointer",
                  }}
                >
                  <Center w="100%" h="100%">
                    <Box w="60%" h="50%">
                      <IconBackArrow col="black" />
                    </Box>
                  </Center>
                </Box>
                <Flex align={"center"}>
                  <Text fw={600} fz={24}>
                    {className}
                  </Text>
                </Flex>
              </Flex>
            </Flex>
            {
              batch !=null && <ScrollArea type="hover" w={"100%"}>
                <Flex mt={20}>
                  {(props.userType == UserType.OTHERS
                    ? props.classId.startsWith("ICLS")
                      ? teacherSideTabs
                      : onlineAndUnregisteredStudentsTabs
                    : studentSideTabs
                  ).map((item) => {
                    return (
                      <Text
                        onClick={() => handleTabChange(item.toLowerCase())}
                        mr={isMd ? 14 : 20}
                        color={
                          activeTab === item.toLowerCase()
                            ? "#000000"
                            : "#B3B3B3"
                        }
                        fw={700}
                        style={{ cursor: "pointer" }}
                        size={16}
                        w={120}
                        align="center"
                      >
                        {item}
                        {activeTab === item.toLowerCase() && (
                          <hr color="#4B65F6"></hr>
                        )}
                      </Text>
                    );
                  })}
                </Flex>
              </ScrollArea>
            }
            <Divider mt={-13}></Divider>

            {batch != null && activeTab === "overview" && (
              <Flex mt={24}>
                <BatchDetailsPage
                  batch={batch!!}
                  userType={props.userType}
                  onEditBatchClick={(batchId: string) => {
                    props.onEditBatchClicked?.(batchId);
                  }}
                  moveToSelectedTab={(tab: string) => {
                    setActiveTab(tab);
                  }}
                />
              </Flex>
            )}

            {batch != null &&
            activeTab === "students" &&
            selectedStudent == null ? (
              batch!!.students.length > 0 ? (
                isAttendanceMode ? (
                  <>
                    <TakeAttendanceView
                      students={batch!!.students}
                      batchId={batch!!._id}
                      onBackClicked={() => {
                        setIsAttendanceMode(false);
                      }}
                      subjects={subjects}
                      addHomework={(
                        description: string,
                        uploadPhoto?: File
                      ) => {
                        addHomeworkhandler(description, uploadPhoto);
                      }}
                    />
                  </>
                ) : (
                  <Stack mt={16}>
                    <Flex gap={{ base: "sm", sm: "lg" }}>
                      <Button
                        variant="default"
                        radius="xl"
                        fw={700}
                        fs="16px"
                        style={{ border: "1px #808080 solid" }}
                        onClick={() => {
                          setAddStudentModalOpen(true);
                        }}
                      >
                        + Add Student
                      </Button>

                      <Button
                        variant="default"
                        radius="xl"
                        fw={700}
                        fs="16px"
                        style={{ border: "1px #808080 solid" }}
                        onClick={() => {
                          setIsAttendanceMode(true);
                        }}
                      >
                        Attendance
                      </Button>

                      <Menu position="bottom">
                        <Menu.Target>
                          <Button
                            variant="default"
                            radius="xl"
                            fw={700}
                            fs="16px"
                            style={{ border: "1px #808080 solid" }}
                          >
                            Sort
                          </Button>
                        </Menu.Target>
                        <Menu.Dropdown
                          style={{
                            position: "absolute",
                          }}
                        >
                          <Menu.Item
                            onClick={() => {
                              batch.students = batch!!.students.sort((a, b) =>
                                a.name.localeCompare(b.name)
                              );
                              setBatch({ ...batch });
                            }}
                          >
                            A-Z
                          </Menu.Item>
                          <Menu.Item
                            onClick={() => {
                              batch.students = batch!!.students.sort((a, b) =>
                                b.name.localeCompare(a.name)
                              );
                              setBatch({ ...batch });
                            }}
                          >
                            Z-A
                          </Menu.Item>
                        </Menu.Dropdown>
                      </Menu>
                    </Flex>

                    <Table
                      mt={8}
                      verticalSpacing="md"
                      horizontalSpacing="xl"
                      fontSize={16}
                    >
                      <thead style={{ background: "#E4EDFD" }}>
                        <tr>
                          <th>Name</th>
                          {!isMd ? <th>Parent's Name</th> : <></>}
                          <th>Phone Number</th>
                          {!isMd ? <th>Fee Status</th> : <></>}
                          {!isMd ? <th>Message</th> : <></>}
                          <th></th>
                        </tr>
                      </thead>
                      <tbody>
                        {batch!!.students.map((item, index) => {
                          return (
                            <tr
                              style={
                                item.isInActive
                                  ? { backgroundColor: "#FAFCFF" }
                                  : {}
                              }
                            >
                              <td
                                style={{
                                  color: item.isInActive
                                    ? "#bebebe"
                                    : "#7D7D7D",
                                  fontWeight: 500,
                                }}
                              >
                                {item.name}
                              </td>
                              {!isMd ? (
                                <td
                                  style={{
                                    color: item.isInActive
                                      ? "#bebebe"
                                      : "#7D7D7D",
                                    fontWeight: 500,
                                  }}
                                >
                                  {item.parentName}
                                </td>
                              ) : (
                                <></>
                              )}
                              <td
                                style={{
                                  color: item.isInActive
                                    ? "#bebebe"
                                    : "#7D7D7D",
                                  fontWeight: 500,
                                }}
                              >
                                {item.phoneNumber[0]}
                              </td>
                              {!isMd ? (
                                <td>
                                  {" "}
                                  <Badge
                                    c={
                                      getColor(
                                        getStatus(
                                          item.totalFees ?? 0,
                                          item.totalPaidFees ?? 0
                                        )
                                      )?.color
                                    }
                                    bg={
                                      getColor(
                                        getStatus(
                                          item.totalFees ?? 0,
                                          item.totalPaidFees ?? 0
                                        )
                                      )?.backgroundColor
                                    }
                                    size="lg"
                                    radius="xs"
                                  >
                                    {getStatus(
                                      item.totalFees ?? 0,
                                      item.totalPaidFees ?? 0
                                    )}
                                  </Badge>
                                </td>
                              ) : (
                                <></>
                              )}
                              {!isMd ? (
                                <td>
                                  <a
                                    href={`sms:${item.phoneNumber[0]}?body=Hello!, `}
                                  >
                                    <div>
                                      <IconMessage
                                        cursor="pointer"
                                        color="#7D7D7D"
                                      />
                                    </div>
                                  </a>
                                </td>
                              ) : (
                                <></>
                              )}
                              <td style={{ cursor: "pointer" }}>
                                <Menu>
                                  <Menu.Target>
                                    <Button variant="default" bg="#FFFFFF">
                                      <IconThreeDots />
                                    </Button>
                                  </Menu.Target>
                                  <Menu.Dropdown>
                                    <Menu.Item
                                      onClick={() => {
                                        setSelectedStudent(item);
                                      }}
                                    >
                                      {" "}
                                      View Profile
                                    </Menu.Item>
                                    <Menu.Item
                                      onClick={() => {
                                        updateStudentActiveStatus(item._id!!);
                                      }}
                                    >
                                      Make Student{" "}
                                      {item.isInActive ? "Active" : "Inactive"}
                                    </Menu.Item>
                                    {(item.totalFees ?? 0) > 0 && (
                                      <>
                                        <Menu.Item
                                          onClick={() => {
                                            setViewFeeDetailsModal(item);
                                          }}
                                        >
                                          View Fee Details
                                        </Menu.Item>
                                        <Menu.Item
                                          onClick={() => {
                                            downloadFeeReceiptHandler(item);
                                          }}
                                        >
                                          Download Receipt
                                        </Menu.Item>
                                      </>
                                    )}
                                    {isMd && (
                                      <>
                                        <Menu.Item>
                                          <a
                                            href={`sms:${item.phoneNumber[0]}?body=Hello!, `}
                                            style={{color:"black"}}
                                          >
                                            <div>Send Message </div>
                                          </a>
                                        </Menu.Item>
                                      </>
                                    )}
                                    <Menu.Item
                                      onClick={() => {
                                        setShowWarning({
                                          _id: item._id!!,
                                          name: item.name,
                                        });
                                      }}
                                    >
                                      Delete Student
                                    </Menu.Item>
                                  </Menu.Dropdown>
                                </Menu>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </Table>
                  </Stack>
                )
              ) : (
                <>
                  <EmptyListView
                    emptyImage={require("./../../../assets/emptypageclass.png")}
                    emptyMessage={"No Students Added Yet"}
                    showButton={true}
                    btnText="+ Add Students"
                    onAddButtonClick={() => {
                      handleAddClick();
                    }}
                  />
                </>
              )
            ) : (
              <></>
            )}
            {selectedStudent != null && (
              <UpdateStudentProfile
                name={selectedStudent.name}
                parentName={selectedStudent.parentName}
                phoneNumber={selectedStudent.phoneNumber}
                dateBirth={selectedStudent.dateOfBirth ?? ""}
                address={selectedStudent.address ?? ""}
                onBack={() => {
                  setSelectedStudent(null);
                }}
                studentData={{
                  studentId: selectedStudent._id!!,
                  studentName: selectedStudent.name,
                  profilePic: selectedStudent.profilePic!!,
                }}
                instituteId={props.instituteId}
                instituteClassId={props.classId}
                openedFromAdminPage={props.openedFromAdminPage}
                isStudentAdd={false}
                onSubmitclick={(
                  name: any,
                  phoneNumbers: any,
                  parentName: any,
                  dateBirth: any,
                  address: any
                ) => {
                  editHandler(
                    selectedStudent._id!!,
                    phoneNumbers,
                    parentName,
                    name,
                    dateBirth,
                    address
                  );
                }}
              />
            )}

            {!props.classId.startsWith("ICLS") && (
              <Stack mt={16}>
                {!props.classId.startsWith("UNRST") && (
                  <Button
                    variant="default"
                    radius="xl"
                    w={200}
                    fw={700}
                    fs="16px"
                    style={{ border: "1px #808080 solid" }}
                    onClick={() => {
                      setAddStudentModalOpen(true);
                    }}
                  >
                    + Add Student
                  </Button>
                )}
                <Table
                  mt={8}
                  verticalSpacing="md"
                  horizontalSpacing="xl"
                  fontSize={16}
                >
                  <thead style={{ background: "#E4EDFD" }}>
                    <tr>
                      <th>Name</th>
                      <th>Phone Number</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {instituteStudents.map((item, index) => {
                      return (
                        <tr>
                          <td style={{ color: "#7D7D7D", fontWeight: 500 }}>
                            {item.name}
                          </td>
                          <td style={{ color: "#7D7D7D", fontWeight: 500 }}>
                            {item.phoneNumber[0]}
                          </td>
                          <td style={{ cursor: "pointer" }}>
                            <Menu>
                              <Menu.Target>
                                <Button bg="#FFFFFF">
                                  <IconThreeDots />
                                </Button>
                              </Menu.Target>
                              <Menu.Dropdown>
                                {props.classId.startsWith("UNRST") && (
                                  <Menu.Item
                                    onClick={() => {
                                      console.log(item);
                                      setUnregisteredStudent(item);
                                    }}
                                  >
                                    Move to Batch
                                  </Menu.Item>
                                )}
                                <Menu.Item
                                  onClick={() => {
                                    setShowWarning({
                                      _id: item._id!!,
                                      name: item.name,
                                    });
                                  }}
                                >
                                  Delete Student
                                </Menu.Item>
                              </Menu.Dropdown>
                            </Menu>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              </Stack>
            )}

            {batch!=null && activeTab === "teachers" &&
              (batch!!.teachers.length != 0 ? (
                <Table
                  mt={8}
                  verticalSpacing="md"
                  horizontalSpacing="xl"
                  fontSize={16}
                >
                  <thead style={{ background: "#E4EDFD" }}>
                    <tr>
                      <th>Name</th>
                      <th>Phone Number</th>
                      <th>Message</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {batch!!.teachers.map((item, index) => {
                      return (
                        <tr>
                          <td style={{ color: "#7D7D7D", fontWeight: 500 }}>
                            {item.name}
                          </td>
                          <td style={{ color: "#7D7D7D", fontWeight: 500 }}>
                            {item.phoneNo}
                          </td>
                          <td>
                            <a href={`sms:+91${item.phoneNo}?body=Hello!,`}>
                              <div>
                                <IconMessage cursor="pointer" color="#7D7D7D" />
                              </div>
                            </a>
                          </td>
                          <td></td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              ) : (
                <>
                  <EmptyListView
                    emptyImage={require("./../../../assets/emptypageclass.png")}
                    emptyMessage={"No Teachers Added Yet"}
                    showButton={false}
                  />{" "}
                </>
              ))}

            {activeTab === "study material" && (
              <Flex mt={24}>
                {
                  <BatchWiseStudyMaterialPage
                    batchId={props.classId}
                    userType={props.userType}
                  />
                }
              </Flex>
            )}

            {activeTab === "live classes" && (
              <Center h={"84vh"}>
                {
                  <VideoCallingEmptyPage
                    hasVideoCallAccess={isFeatureValid(UserFeature.LIVECLASSES)}
                    instituteId={props.instituteId}
                    batchId={props.classId}
                  />
                }
              </Center>
            )}

            {activeTab === "results" &&
              (selectedTestId == null ? (
                <React.Suspense fallback={<></>}>
                <SingleClassResult
                  classId={props.classId}
                  teacherSubjectIds={null}
                  instituteId={props.instituteId}
                  setTestId={(testId: string) => {
                    setSelectedTestId(testId);
                  }}
                />
                </React.Suspense>
              ) : (
                <SingleTest
                  testId={selectedTestId}
                  batch={batch!!}
                  onSubmit={(id) => {
                    setSelectedTestId(null);
                  }}
                  setBatch={setBatch}
                />
              ))}

            {activeTab === "assignment" && (
              <Flex mt={24} w={"100%"}>
                {props.userType == UserType.OTHERS ? (
                  <HomeworkTeacher
                    batchId={props.classId}
                    batch={batch!!}
                    onLastDateChange={(val: number) => {}}
                    onBackClick={() => {}}
                  />
                ) : (
                  <ShowHomework
                    studentData={{
                      studentId: currentStudent!!._id!!,
                      studentName: currentStudent!!.name,
                      className: batch!!.name,
                      classId: batch!!._id,
                    }}
                  />
                )}
              </Flex>
            )}
            {activeTab === "attendance" && (
              <StudentAttendance
                studentData={{
                  classId: batch!!._id,
                  className: batch!!.name,
                  studentName: currentStudent!!.name,
                  studentId: currentStudent!!._id!!,
                }}
              />
            )}
            {activeTab === "fees status" && (
              <StudentSideAllFeeView
                studentData={{
                  classId: batch!!._id,
                  className: batch!!.name,
                  studentName: currentStudent!!.name,
                  studentId: currentStudent!!._id!!,
                  phoneNumber: currentStudent!!.phoneNumber[0] ?? "",
                }}
                parentName={currentStudent?.parentName!!}
              />
            )}
            {activeTab === "leaderboard" && (
              <LeaderBoard
                students={batch?.students!!}
                studentId={
                  currentStudent && currentStudent._id
                    ? currentStudent._id
                    : null
                }
                userType={props.userType}
              />
            )}
            {activeTab === "recordings" && (
              <Recordings batchId={props.classId} userType={props.userType} />
            )}
          </Stack>
        </Center>
      </Box>

      <Modal
        opened={showWarning !== null}
        onClose={() => {
          setShowWarning(null);
        }}
        centered
        style={{ zIndex: 9999999 }}
        title="Delete Student"
      >
        <Stack>
          <Text>{`Are you sure you want to delete ${showWarning?.name}?`}</Text>
          <Group>
            <Button
              color="#909395"
              fz={16}
              fw={500}
              style={{
                border: "#909395 solid 1px",
                color: "#909395",
              }}
              variant="outline"
              size="lg"
              w="47%"
              onClick={() => {
                setShowWarning(null);
              }}
            >
              Cancel
            </Button>
            <Button
              style={{
                backgroundColor: "#FF0000",
                color: "white",
              }}
              size="lg"
              w="47%"
              fz={16}
              fw={500}
              onClick={() => {
                if (showWarning !== null) deleteHandler(showWarning._id);
              }}
            >
              Yes,Delete it
            </Button>
          </Group>
        </Stack>
      </Modal>
      <LoadingOverlay visible={isLoading} />
      <Modal
        opened={viewFeeDetailsModal !== null}
        onClose={() => {
          setViewFeeDetailsModal(null);
        }}
        title="View Fee Details"
        centered
        styles={{
          title: {
            fontSize: 23,
            fontweight: 1000,
          },
        }}
      >
        {viewFeeDetailsModal !== null && (
          <ViewFeeDetailsModal
            onClose={() => {
              setViewFeeDetailsModal(null);
            }}
            selectedStudent={viewFeeDetailsModal}
            classId={props.classId}
            instituteId={props.instituteId}
            className={className}
            onSubmit={() => {
              fetchStudents();
              props.resetData();
            }}
          />
        )}
      </Modal>
      <Modal
        opened={viewStudentCredentialsModal !== null}
        onClose={() => {
          setViewStudentCredentialsModal(null);
        }}
        title="Student Credentials"
        centered
      >
        <Stack>
          <Text>Student Name: {viewStudentCredentialsModal?.name}</Text>
          <Text>
            Student Phone Number: {viewStudentCredentialsModal?.phoneNumber[0]}
          </Text>
          <Text>
            Unique Password: {viewStudentCredentialsModal?.uniqueRoll}
          </Text>
        </Stack>
      </Modal>

      {addStudentModalOpen && (
        <AddStudentModal
          isOpen={addStudentModalOpen}
          setIsOpen={setAddStudentModalOpen}
          onNextButtonClicked={(selectedItemIndex: number) => {
            if (selectedItemIndex == 0) {
              setAddNewStudentModalOpen(true);
            } else if (selectedItemIndex == 1) {
              setAddFromExistingStudentModalOpen(true);
            }
          }}
        />
      )}

      {addFromExistingStudentModalOpen && (
        <AddExistingStudentsModal
          isOpen={addFromExistingStudentModalOpen}
          setIsOpen={setAddFromExistingStudentModalOpen}
          studentList={instituteStudents.filter((student) => {
            return (
              batch?.students.findIndex((batchStudent) => {
                return batchStudent._id == student._id;
              }) == -1
            );
          })}
          onAddStudentsClicked={(selectedStudents: StudentsDataWithBatch[]) => {
            if (props.classId.startsWith("CRS")) {
              AddCourseToMultipleStudent({
                studentIds: selectedStudents.map((student) => {
                  return student._id!!;
                }),
                courseId: props.classId,
              })
                .then((x) => {
                  props.resetData();
                  initializeBatch();
                  setisLoading(false);
                })
                .catch((e) => {
                  setisLoading(false);
                  console.log(e);
                });
            } else {
              AddExistingStudentsInBatch({
                studentIds: selectedStudents.map((student) => {
                  return student._id!!;
                }),
                batchId: props.classId,
              })
                .then((x: any) => {
                  setAddFromExistingStudentModalOpen(false);
                  props.resetData();
                  initializeBatch();
                })
                .catch((error) => {});
            }
          }}
          preSelectedStudentId={preSelectedStudentId}
        />
      )}

      {addNewStudentModalOpen && (
        <AddNewStudentModal
          isOpen={addNewStudentModalOpen}
          setIsOpen={setAddNewStudentModalOpen}
          onNextButtonClicked={(studentToCreate: StudentsDataWithBatch) => {
            studentToCreate.instituteId = props.instituteId;
            studentToCreate.batchId = batch?._id;
            CreateStudent(studentToCreate)
              .then((x: any) => {
                setAddNewStudentModalOpen(false);
                if (props.classId.startsWith("CRS")) {
                  AddCourseToStudent({
                    studentId: x._id,
                    courseId: props.classId,
                  })
                    .then((x) => {
                      props.resetData();
                      initializeBatch();
                      setisLoading(false);
                    })
                    .catch((e) => {
                      setisLoading(false);
                      console.log(e);
                    });
                } else {
                  props.resetData();
                  initializeBatch();
                }
              })
              .catch((err) => {
                console.log(err.response.data.message);
                showNotification({
                  message: err.response.data.message,
                });
                if (err.response.data.status == 413) {
                  setPreSelectedStudentId(err.response.data.studentId);
                  setAddNewStudentModalOpen(false);
                  setAddFromExistingStudentModalOpen(true);
                }
              });
          }}
        />
      )}

      {unregisteredStudent != null && (
        <BatchSelectModal
          isOpen={unregisteredStudent != null}
          setIsOpen={(val: boolean) => {
            if (!val) {
              setUnregisteredStudent(null);
            }
          }}
          batchList={props.batchList}
          onBatchSelected={(selectedBatchIds: InstituteClass[]) => {
            setisLoading(true);
            MoveUnregisteredStudentIntoBatch({
              studentId: unregisteredStudent._id!!,
              batchIds: selectedBatchIds.map((item) => {
                return item._id;
              }),
            })
              .then((x: any) => {
                setUnregisteredStudent(null);
                props.resetData();
                initializeBatch();
                setisLoading(false);
              })
              .catch((err) => {
                showNotification({
                  message: "Error In Moving Student To Batch",
                });
                setisLoading(false);
              });
          }}
        />
      )}
    </>
  );
};

export default MergeStudentAndTeachers;
