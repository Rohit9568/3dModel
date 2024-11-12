import {
  Flex,
  Stack,
  Text,
  Image,
  SimpleGrid,
  Button,
  Table,
  Grid,
  Box,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import React, { lazy, useEffect, useState } from "react";
import { SingleCard } from "../DashBoardCards";
import { UserType } from "../InstituteBatchesSection";
import { useSelector } from "react-redux";
import { RootState } from "../../../../store/ReduxStore";
import { IconRight, IconRightArrow } from "../../../_Icons/CustonIcons";

const ShowStudentResults = lazy(()=> import("../../../../_parentsApp/Components/ShowStudentResults"))
const DashBoardResultDisplay  = lazy(()=> import("../DashBoardResultDisplay"))

interface BatchDetailsProps {
  batch: InstituteClass;
  userType: UserType;
  onEditBatchClick: (batchId: string) => void;
  moveToSelectedTab: (tab: string) => void;
}

export function BatchDetailsPage(props: BatchDetailsProps) {
  const isMd = useMediaQuery(`(max-width: 968px)`);
  const currentStudent = useSelector<RootState, StudentsDataWithBatch | null>(
    (state) => {
      return state.studentSlice.student;
    }
  );
  const [profileCardsInfo, setProfileCardsInfo] = useState<
    {
      heading: string;
      iconPath: string;
      displayNumber: number;
      dashColor: string;
    }[]
  >();
  const [batchSchedule, setBatchSchedule] = useState<string[] | null[]>([
    null,
    null,
    null,
    null,
    null,
    null,
    null,
  ]);
  const weekday = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  useEffect(() => {
    //setting profile cards

    const batchProfileCards = [
      //revenue card
      // {
      //   heading: "Revenue Collected",
      //   iconPath: require("../../../../assets/revenuecardicon.png"),
      //   displayNumber: props.batch.totalFeesPaid ?? 0,
      //   dashColor: "#EABC6B",
      // },
      //students card
      {
        heading: "Students",
        iconPath: require("../../../../assets/totalstudentsicon.png"),
        displayNumber: props.batch.studentsLength ?? 0,
        dashColor: "#6B80EA",
      },
      //teachers card
      {
        heading: "Teachers",
        iconPath: require("../../../../assets/totalteachersicon.png"),
        displayNumber: props.batch.totalTeachers ?? 0,
        dashColor: "#BC6BEA",
      },
    ];
    if (props.userType === UserType.OTHERS) {
      setProfileCardsInfo([
        ...batchProfileCards,
        {
          heading: "Tests Assigned",
          iconPath: require("../../../../assets/testassignicon.png"),
          displayNumber: props.batch.totalAssignedTestsNumber ?? 0,
          dashColor: "#EA6B80",
        },
      ]);
    } else {
      setProfileCardsInfo([
        {
          heading: "Tests Assigned",
          iconPath: require("../../../../assets/testassignicon.png"),
          displayNumber: props.batch.studentsLength ?? 0,
          dashColor: "#EA6B80",
        },
      ]);
    }

    if (
      props.batch.batchScheduleDays != null &&
      props.batch.batchScheduleDays.length > 0
    ) {
      setBatchSchedule(props.batch.batchScheduleDays);
    }
  }, []);

  return (
    <>
      <Stack spacing={32} w={"100%"} h={"100%"}>
        <Stack spacing={6} bg="#F7F7FF" px={40} py={16}>
          <Text fw={900} size={isMd ? 18 : 28}>
            View your batch details here!
          </Text>
          {props.batch.userSubjects.length > 0 && (
            <Flex align={"center"}>
              <Image
                width={14}
                height={14}
                src={require("../../../../assets/Books.png")}
                mr={4}
              />
              <Text fw={500} size={12} mr={6} color="#8F8F8F">
                {props.batch.userSubjects
                  .slice(0, 5)
                  .map((item) => {
                    return item.subjectId.name;
                  })
                  .join(", ") + "..."}
              </Text>
            </Flex>
          )}
          <Image
            width={84}
            height={7}
            src={require("../../../../assets/batchprofileline.png")}
            mr={4}
          />
        </Stack>
        <SimpleGrid cols={isMd ? 2 : 4}>
          {profileCardsInfo != null &&
            profileCardsInfo.map((item) => {
              return (
                <>
                  <SingleCard
                    heading={item.heading}
                    displayNumber={item.displayNumber.toString()}
                    icon={item.iconPath}
                    dashColor={item.dashColor}
                    imageBackgroundColor="#F7F7FF"
                    backgroundColour="#F7F7FF"
                    noShadow={true}
                    OnCardClick={() => {
                      if (
                        item.heading.toLowerCase() == "students" ||
                        item.heading.toLowerCase() == "teachers"
                      ) {
                        props.moveToSelectedTab(item.heading.toLowerCase());
                      }
                    }}
                  />
                </>
              );
            })}
        </SimpleGrid>

        <Grid h={400}>
          <Grid.Col span={isMd ? 12 : 7}>
            {props.userType == UserType.OTHERS ? (
              <React.Suspense fallback={<></>}>
              <DashBoardResultDisplay
                batchId={props.batch!!._id}
                onResultArrowClicked={() => {
                  props.moveToSelectedTab("results");
                }}
              />
              </React.Suspense>
            ) : (
              <React.Suspense fallback={<></>}>
              <ShowStudentResults
                studentData={{
                  studentId: currentStudent?._id!!,
                  batchId: props.batch._id,
                  batchName: props.batch.name,
                  studentName: currentStudent?.name!!,
                }}
                showTestCards={false}
                onResultArrowClicked={() => {
                  //TODO show student results
                  // props.moveToSelectedTab("results");
                }}
              />
              </React.Suspense>
            )}
          </Grid.Col>
          <Grid.Col span={isMd ? 12 : 5}>
            <Stack spacing={20} bg="#F7F7FF" px={20} py={24}>
              <Grid align="center">
                <Grid.Col span={8}>
                  <Text fw={700} size={18}>
                    Batch Schedule
                  </Text>
                </Grid.Col>
                {props.userType == UserType.OTHERS && (
                  <Grid.Col span={2}>
                    <Button
                      variant="default"
                      radius="xl"
                      fw={700}
                      bg="#F7F7FF"
                      fs="16px"
                      style={{ border: "1px #808080 solid" }}
                      onClick={() => {
                        props.onEditBatchClick(props.batch!!._id);
                      }}
                    >
                      Edit Batch
                    </Button>
                  </Grid.Col>
                )}
              </Grid>

              <Table
                withBorder
                withColumnBorders
                bg={"#FFFFFF"}
                style={{ border: "solid #949494 1px", borderRadius: "10px" }}
              >
                <thead>
                  <tr>
                    <th>Day</th>
                    <th style={{ width: "80%" }}>Schedule</th>
                  </tr>
                </thead>
                <tbody>
                  {batchSchedule.map((item, index) => {
                    return (
                      <tr>
                        <td
                          style={{
                            color: "#808080",
                            fontSize: "14px",
                            fontWeight: 600,
                          }}
                        >
                          {weekday[index]}
                        </td>
                        <td
                          style={{
                            color: "#808080",
                            fontSize: "14px",
                            fontWeight: 500,
                          }}
                        >
                          {item == null
                            ? ""
                            : `Class starts at: ${new Date(
                                item
                              ).toLocaleTimeString("en-US")}`}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </Stack>
          </Grid.Col>
        </Grid>
      </Stack>

      {/* <AddBatchModal
    isOpen={true}
    onClose={()=>{}}
    onAddBatch={()=>{}}
    onUpdateBatch={()=>{}}
    initialData={{
      _id:props.batch._id,
      batchName:props.batch.name,
      selectedSubjects:props.batch.sub
    }}
    subjects={}
    instituteCourses={}
    /> */}

      {/* interface AddBatchModalProps {
  onUpdateBatch: (
    classId: string,
    batchName: string,
    selectedSubjects: string[],
    selectedCourses: string[],
    days: (Date | null)[]
  ) => void;
  initialData?: {
    _id: string;
    batchName: string;
    selectedSubjects: string[];
    selectedCourses: string[];
    days: (Date | null)[];
  } | null;
  subjects: { label: string; value: string }[];
  instituteCourses: { label: string; value: string }[];
} */}
    </>
  );
}
