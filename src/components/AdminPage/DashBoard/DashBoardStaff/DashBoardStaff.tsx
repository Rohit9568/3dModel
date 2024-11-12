import {
  Box,
  Center,
  Flex,
  SimpleGrid,
  LoadingOverlay,
  Stack,
  Text,
  Modal,
  Button,
  Group,
  Grid,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { InstituteDetailsCards, SingleBatchCard } from "../DashBoardCards";
import { InstituteProfile } from "./InstituteProfile";
import {
  AddNewbatch,
  DeleteBatchFromInstitute,
  GetAllSubjectsForInstitute,
  GetInstitiuteAndUsersInfo,
  getAllUnregisteredStudents,
} from "../../../../_parentsApp/features/instituteSlice";
import { useEffect, useState } from "react";
import MergeStudentAndTeachers from "../../ClassSection/MergeStudentAndTeachers";
import { getAllInstituteCoursesAndTestSeries } from "../../../../features/course/courseSlice";
import AddBatchModal from "../Models/AddBatchModel";
import { InstituteBatchesSection, UserType } from "../InstituteBatchesSection";
import {
  GetAllCoursesByBatchId,
  GetAllSubjectsByClassId,
  RenameInstituteClass,
  UpdateInstituteClass,
} from "../../../../_parentsApp/features/instituteClassSlice";
import { EditCourseFeeModal } from "../Models/EditCourseFeeModal";
import { useSelector } from "react-redux";
import { RootState } from "../../../../store/ReduxStore";
import { User1 } from "../../../../@types/User";

export function DashBoardStaff(props: { instituteId: string }) {
  const [instituteInfo, setInstituteInfo] = useState<any>(null);
  const isMd = useMediaQuery(`(max-width: 968px)`);
  const [loading, setLoading] = useState(true);
  const [batchId, setBatchId] = useState<String>("");

  const [unregisteredStudents, setUnregisteredStudents] = useState<
    StudentInfo[]
  >([]);
  const [instituteCourses, setInstituteCourses] = useState<
    CoursewithStudentsData[]
  >([]);
  const [subjects, setSubjects] = useState([]);

  const [isAddBatchModalOpen, setIsAddBatchModalOpen] = useState(false);
  const [editBatchData, setEditBatchData] = useState<{
    _id: string;
    batchName: string;
    selectedSubjects: string[];
    selectedCourses: string[];
    days: (Date | null)[];
  } | null>(null);
  const [showWarning, setShowWarning] = useState<{
    name: string;
    _id: string;
  } | null>(null);
  const [deleteModal, setDeleteModal] = useState<boolean>(false);
  const [deleteBatchId, setDeleteBatchId] = useState<string | null>(null);
  const [isCourseFeesEdit, setisCourseFeesEdit] =
    useState<InstituteClass | null>(null);

  const user1 = useSelector<RootState, User1 | null>((state) => {
    return state.currentUser.user;
  });

  function getInstituteInfo() {
    setLoading(true);
    GetInstitiuteAndUsersInfo({ id: props.instituteId })
      .then((response: any) => {
        setInstituteInfo(response);
        console.log(response);

        getAllUnregisteredStudents({ id: props.instituteId })
          .then((x: any) => {
            setUnregisteredStudents(x);
          })
          .catch((e) => {
            console.log(e);
          });

        GetAllSubjectsForInstitute({ id: props.instituteId })
          .then((response: any) => {
            console.log(response);
            setSubjects(response);
            setLoading(false);
          })
          .catch((error: any) => {
            console.error("Error fetching institute info:", error);
            setLoading(false);
          });

        getAllInstituteCoursesAndTestSeries(props.instituteId)
          .then((response: any) => {
            setInstituteCourses(response);
            setLoading(false);
          })
          .catch((error: any) => {
            console.error("Error fetching institute Courses:", error);
            setLoading(false);
          });

        setLoading(false);
      })
      .catch((error: any) => {
        console.log(error);
        setLoading(false);
      });
  }

  useEffect(() => {
    getInstituteInfo();
  }, []);

  function editBatchName(id: string, name: string) {
    RenameInstituteClass({
      id: id,
      nameValue: name,
    })
      .then((x) => {
        getInstituteInfo();
      })
      .catch((e) => {
        console.log(e);
      });
  }

  function deleteBatch(deleteBatchId: string) {
    console.log(deleteBatchId);
    setEditBatchData(null);
    DeleteBatchFromInstitute({
      id: props.instituteId,
      batchId: deleteBatchId,
    })
      .then((x) => {
        getInstituteInfo();
      })
      .catch((e) => {
        console.log(e);
      });
  }

  const toggleAddBatchModal = () => {
    setEditBatchData(null);
    setIsAddBatchModalOpen((prev) => !prev);
  };

  const isLg = useMediaQuery(`(max-width: 1024px)`);

  function addbatch(
    name: string,
    subjects: string[],
    courses: string[],
    days: (Date | null)[]
  ) {
    setEditBatchData(null);
    AddNewbatch({
      id: props.instituteId,
      name: name,
      subjects: subjects,
      courses: courses,
      days: days,
    })
      .then((x) => {
        getInstituteInfo();
        console.log(x);
      })
      .catch((e) => {
        console.log(e);
      });
  }
  function updatebatch(
    classId: string,
    name: string,
    subjects: string[],
    courses: string[],
    days: (Date | null)[]
  ) {
    setEditBatchData(null);
    UpdateInstituteClass({
      id: classId,
      name: name,
      subjects: subjects,
      courses: courses,
      days: days,
    })
      .then((x: any) => {
        getInstituteInfo();
        if (batchId != null) {
          setBatchId(new String(batchId));
        }
      })
      .catch((e) => {});
  }

  const handleEditBatch = (batchId: string) => {
    GetAllSubjectsByClassId({
      id: batchId,
    })
      .then((response: any) => {
        GetAllCoursesByBatchId({ id: batchId })
          .then((batchesResponse: any) => {
            setEditBatchData({
              _id: batchId,
              batchName: response.name,
              selectedSubjects: response.subjects.map((x: any) => x._id),
              selectedCourses: batchesResponse.batchCourses.map(
                (x: any) => x._id
              ),
              days: response.batchScheduleDays.map((item: string) => {
                return item != null ? new Date(item) : item;
              }),
            });
            setIsAddBatchModalOpen(true);
          })
          .catch((error: any) => {
            console.error("Error fetching courses:", error);
          });
      })
      .catch((error: any) => {
        console.error("Error fetching subjects:", error);
      });
  };

  return (
    <Center w={"100%"} mih={"100vh"} bg="#F7F7FF">
      <LoadingOverlay visible={loading} zIndex={1002} pos={"fixed"} />
      {instituteInfo != null && batchId == "" && (
        <Stack
          w={"100%"}
          px={isMd ? 24 : 84}
          spacing={20}
          pt={isMd ? 10 : 20}
          pb={60}
        >
          <Flex
            w={"100%"}
            direction="row"
            align="center"
            justify="space-between"
          >
            <Flex mt={5}>
              <Text fz={isMd ? 28 : 32} fw={700}>
                Institute Details
              </Text>
            </Flex>
          </Flex>

          <Text fz={isMd ? 14 : 18} fw={400} mt={-18} color="#7C7C80">
            Hi {user1?.name}, Welcome to {instituteInfo.name} Dashboard
          </Text>

          <Grid mt={24} w={"100%"}>
            {!isMd && (
              <Grid.Col span={1} mr={44}>
                <img
                  src={instituteInfo?.schoolIcon || ""}
                  height="90px"
                  width="90px"
                />
              </Grid.Col>
            )}
            <Grid.Col span={isMd ? 12 : 10}>
              <SimpleGrid
                cols={isMd ? 2 : 4}
                spacing={isMd ? 15 : 40}
                verticalSpacing={20}
              >
                <InstituteDetailsCards
                  noOfBatches={instituteInfo?.noOfBatches || 0}
                  monthyRevenue={instituteInfo?.revenue || 0}
                  noOfStudents={instituteInfo?.noOfStudents || 0}
                  nofOfTeachers={instituteInfo?.noOfTeachers || 0}
                />
              </SimpleGrid>
            </Grid.Col>
          </Grid>

          <InstituteProfile
            users={(instituteInfo?.users || []).map((user: any) => ({
              id: user?._id || "",
              name: user?.name || "",
              role: user?.role || "",
            }))}
            onreloadData={() => {
              getInstituteInfo();
            }}
          />
          <Flex align={"center"}>
            <Text w={"100%"} fz={18} fw={700}>
              Batches
            </Text>
            {isMd && (
              <Button
                onClick={toggleAddBatchModal}
                size="sm"
                variant="default"
                ml={16}
                fw={700}
                style={{
                  fontSize: "16px",
                  borderRadius: "24px",
                  borderColor: "##808080",
                  borderWidth: "1px",
                }}
              >
                + Add Batch
              </Button>
            )}
          </Flex>
          {
            <SimpleGrid
              cols={isMd ? 1 : isLg ? 2 : 4}
              w={"100%"}
              spacing={20}
              verticalSpacing={20}
            >
              <InstituteBatchesSection
                batches={(instituteInfo?.batches || []).map((batch: any) => ({
                  id: batch?._id || "",
                  name: batch?.name || "",
                  subjects: batch?.subjects || [],
                  noOfTeachers: batch?.noOfTeachers || 0,
                  noOfStudents: batch?.noOfStudents || 0,
                  firstThreeStudents: batch?.firstThreeStudents || [],
                  firstThreeTeachers: batch?.firstThreeTeachers || [],
                }))}
                userType={UserType.OTHERS}
                setDeleteBatchId={setDeleteBatchId}
                setDeleteModal={setDeleteModal}
                onEditBatchName={(id, val) => {
                  editBatchName(id, val);
                }}
                onbatchCardClick={(val) => {
                  setBatchId(val);
                }}
                onEditCourseFees={(val) => {
                  setisCourseFeesEdit(val);
                }}
                onAddBatchButtonClick={toggleAddBatchModal}
                onEditBatchButtonClick={function (batchId: string): void {
                  handleEditBatch(batchId);
                }}
              />
            </SimpleGrid>
          }

          {unregisteredStudents && unregisteredStudents.length > 0 && (
            <Box
              pb={20}
              pt={isMd ? 2 : 5}
              style={{ borderRadius: "10px" }}
              mt={2}
            >
              <Flex mt={20} ml={10}>
                <Text fz={18} fw={700}>
                  Unregistered Students
                </Text>
              </Flex>
              <Flex mt={20} ml={10} w="200px">
                <SingleBatchCard
                  id="UNRST"
                  name={`Unregistered Students`}
                  firstThreeStudents={unregisteredStudents.map((x) => x.name)}
                  noOfStudents={unregisteredStudents.length}
                  onbatchCardClick={() => {
                    setBatchId("UNRST");
                  }}
                  userType={UserType.OTHERS}
                  onEditBatchName={function (val: string): void {}}
                  onEditCourseFees={function (): void {}}
                  subjects={[]}
                  noOfTeachers={0}
                  firstThreeTeachers={[]}
                  hasNextButton={false}
                  onEditBatchButtonClick={function (): void {
                    throw new Error("Function not implemented.");
                  }}
                  setDeleteBatchId={function (batchId: string): void {
                    throw new Error("Function not implemented.");
                  }}
                  setDeleteModal={function (val: boolean): void {
                    throw new Error("Function not implemented.");
                  }}
                />
              </Flex>
            </Box>
          )}
          {instituteCourses && instituteCourses.length !== 0 && (
            <Box
              pb={20}
              pt={isMd ? 2 : 5}
              style={{ borderRadius: "10px" }}
              mt={2}
            >
              <Flex mt={20} ml={10}>
                <Text fz={18} fw={700}>
                  Online Courses
                </Text>
              </Flex>
              <SimpleGrid
                cols={isMd ? 1 : isLg ? 2 : 4}
                w={"100%"}
                spacing={20}
                verticalSpacing={20}
                mt={20}
              >
                {instituteCourses.map((course) => {
                  return (
                    <SingleBatchCard
                      id={course._id}
                      name={course.name}
                      onbatchCardClick={() => {
                        setBatchId(course._id);
                      }}
                      firstThreeStudents={course.students.map((x) => x.name)}
                      noOfStudents={course.students.length}
                      onEditBatchName={function (val: string): void {}}
                      onEditCourseFees={function (): void {}}
                      subjects={[]}
                      noOfTeachers={0}
                      firstThreeTeachers={[]}
                      hasNextButton={false}
                      userType={UserType.OTHERS}
                      onEditBatchButtonClick={function (): void {
                        throw new Error("Function not implemented.");
                      }}
                      setDeleteBatchId={function (batchId: string): void {
                        throw new Error("Function not implemented.");
                      }}
                      setDeleteModal={function (val: boolean): void {
                        throw new Error("Function not implemented.");
                      }}
                    />
                  );
                })}
              </SimpleGrid>
            </Box>
          )}
        </Stack>
      )}
      {batchId != "" && (
        <MergeStudentAndTeachers
          classId={batchId.toString()}
          instituteId={props.instituteId}
          onBackClick={(val) => {
            setBatchId("");
          }}
          openedFromAdminPage={false}
          isCourseStudentSelected={false}
          isFeepayment={instituteInfo.featureAccess.feeManagementService}
          resetData={() => {
            getInstituteInfo();
          }}
          isreceiptFeature={instituteInfo.featureAccess.feeReceiptAccess}
          hidePhoneNumbers={instituteInfo.featureAccess.hideStudentPhoneNumbers}
          userType={UserType.OTHERS}
          batchList={instituteInfo.batches}
          onEditBatchClicked={(batchId: string) => {
            handleEditBatch(batchId);
          }}
        />
      )}

      <AddBatchModal
        isOpen={isAddBatchModalOpen}
        onClose={toggleAddBatchModal}
        onAddBatch={(
          batchName: string,
          selectedSubjects: string[],
          selectedCourses: string[],
          days: (Date | null)[]
        ) => {
          addbatch(batchName, selectedSubjects, selectedCourses, days);
        }}
        initialData={editBatchData}
        subjects={subjects}
        onUpdateBatch={(
          classId: string,
          batchName: string,
          selectedSubjects: string[],
          selectedCourses: string[],
          days: (Date | null)[]
        ) => {
          updatebatch(
            classId,
            batchName,
            selectedSubjects,
            selectedCourses,
            days
          );
        }}
        instituteCourses={instituteCourses.map((course) => {
          return {
            label: course.name,
            value: course._id,
          };
        })}
      />

      {isCourseFeesEdit !== null && (
        <EditCourseFeeModal
          isCourseFeesEdit={isCourseFeesEdit}
          setisCourseFeesEdit={setisCourseFeesEdit}
        />
      )}

      <Modal
        opened={deleteModal}
        onClose={() => setDeleteModal(false)}
        centered
        zIndex={999}
        styles={{
          title: {
            fontSize: 20,
            fontWeight: 700,
          },
        }}
      >
        <Text fw={500} fz={20} align="center">
          Are you sure you want to delete this batch?
        </Text>
        <Group position="center" mt={20}>
          <Button
            variant="outline"
            color="dark"
            fw={700}
            radius={50}
            onClick={() => {
              setDeleteModal(false);
              setDeleteBatchId(null);
            }}
          >
            Cancel
          </Button>
          <Button
            fw={700}
            radius={50}
            style={{ background: "red " }}
            onClick={() => {
              setDeleteModal(false);
              if (deleteBatchId) deleteBatch(deleteBatchId);
            }}
          >
            Delete
          </Button>
        </Group>
      </Modal>
    </Center>
  );
}
