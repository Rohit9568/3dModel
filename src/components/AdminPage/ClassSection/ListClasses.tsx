import {
  Box,
  Flex,
  Text,
  ScrollArea,
  Group,
  Tooltip,
  Center,
  Modal,
  Select,
  Stack,
  Button,
  MultiSelect,
  SimpleGrid,
  NumberInput,
  Radio,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { Mixpanel } from "../../../utilities/Mixpanel/MixpanelHelper";
import { AdminPageEvents } from "../../../utilities/Mixpanel/AnalyticEventAdminApp";
import { useEffect, useState } from "react";
import { IconPlus } from "@tabler/icons";
import ClassCard from "./ClassCard";
import { AddNewClassModal } from "../../AddNewClassModal/AddNewClassModal";
import { getAllInstituteCoursesAndTestSeries } from "../../../features/course/courseSlice";
import { getColorForPercentage } from "../../../utilities/HelperFunctions";
import {
  AddCourseFee,
  GetAllMonthsDataByClassId,
  RenameInstituteClass,
} from "../../../_parentsApp/features/instituteClassSlice";
import { WebAppEvents } from "../../../utilities/Mixpanel/AnalyticeEventWebApp";
import { ViewMonthlyFeeDetails } from "./ViewMonthlyFeeDetailModal";
import { getAllUnregisteredStudents } from "../../../_parentsApp/features/instituteSlice";

export const SingleCourseCard = (props: {
  name: string;
  studentsCount: number;
}) => {
  return (
    <Box
      style={{
        cursor: "pointer",
        position: "relative",
        width: "100%",
        height: "82px",
        flexShrink: 0,
        borderRadius: "8px",
        background: "#FFF",
        boxShadow: "0px 0px 8px 0px rgba(0, 0, 0, 0.25)",
        paddingLeft: "20px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <Box
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: "11px",
          borderRadius: "8px 0px 0px 8px",
          background: getColorForPercentage(50),
        }}
      />
      <Box
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <Text fz={16} weight={600}>
          {props.name}
        </Text>

        <Stack spacing={1}>
          <Text size="md" fz={12} style={{ color: "#929292" }}>
            Total Students: {props.studentsCount}
          </Text>
        </Stack>
      </Box>
    </Box>
  );
};
interface ListClassesProps {
  classes: InstituteClass[] | InstituteClassTeacher[];
  onClassClick: (data: string) => void;
  isTeacher?: boolean;
  openedFromAdminPage: boolean;
  instituteId: string;
  onClassAdd: () => void;
  resetData?: () => void;
  isFeeService?: boolean;
  isFeeReceiptFeature?: boolean;
}
export const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export function getThisAndNextYearMonths(): { value: string; label: string }[] {
  const today = new Date();
  let currentMonth = today.getMonth();
  currentMonth = currentMonth >= 0 && currentMonth <= 11 ? currentMonth : 0;
  const currentYear = today.getFullYear();

  const yearMonths = [];

  for (let i = 0; i < 24; i++) {
    const monthIndex = i % 12;
    const year = currentYear + Math.floor((currentMonth + i) / 12);

    const firstDayOfMonth = new Date(year, monthIndex, 2);

    yearMonths.push({
      value: firstDayOfMonth.toUTCString(),
      label: `${months[monthIndex]} ${year}`,
    });
  }

  return yearMonths;
}

export function getNextYearMonths() {
  const today = new Date();
  let currentMonth = today.getMonth();
  currentMonth = currentMonth >= 0 && currentMonth <= 11 ? currentMonth : 0;
  const currentYear = today.getFullYear();

  const nextYearMonths = [];

  for (let i = 0; i < 12; i++) {
    const monthIndex = (currentMonth + i) % 12;
    const year = currentYear + Math.floor((currentMonth + i) / 12);

    const firstDayOfMonth = new Date(year, monthIndex, 2);

    nextYearMonths.push({
      value: firstDayOfMonth.toUTCString(),
      label: `${months[monthIndex]} ${year}`,
    });
  }

  return nextYearMonths;
}
export function getMonthsFromDate(startDate: Date) {
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const monthsArray = [];

  let currentDate = startDate;


  while (currentDate <= today) {
    const monthIndex = currentDate.getMonth();
    const year = currentDate.getFullYear();
    const firstDayOfMonth = new Date(year, monthIndex, 2);

    monthsArray.push({
      value: firstDayOfMonth.toUTCString(),
      label: `${months[monthIndex]} ${year}`,
    });

    // Move to the next month
    currentDate.setMonth(monthIndex + 1);
  }

  // Add another 12 months
  for (let i = 1; i < 12; i++) {
    const monthIndex = (currentMonth + i) % 12;
    const year = currentYear + Math.floor((currentMonth + i) / 12);

    const firstDayOfMonth = new Date(year, monthIndex, 2);

    monthsArray.push({
      value: firstDayOfMonth.toUTCString(),
      label: `${months[monthIndex]} ${year}`,
    });
  }

  return monthsArray;
}

export function getPreviousMonths(startDate: Date) {
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();

  const monthsArray = [];

  let currentDate = startDate;

  while (currentDate <= today) {
    const monthIndex = currentDate.getMonth();
    const year = currentDate.getFullYear();
    const firstDayOfMonth = new Date(year, monthIndex, 2);

    monthsArray.push({
      value: firstDayOfMonth,
      label: `${months[monthIndex]} ${year}`,
    });

    currentDate.setMonth(monthIndex + 1);
  }
  return monthsArray;
}

export enum FeeOptions {
  MONTHLY = "Monthly",
  YEARLY = "Yearly",
  QUARTERLY = "Quarterly",
}

interface FeeOption {
  label: string;
  value: FeeOptions;
}

export const feeOptions: FeeOption[] = [
  { label: "Monthly", value: FeeOptions.MONTHLY },
  { label: "Yearly", value: FeeOptions.YEARLY },
  { label: "Quarterly", value: FeeOptions.QUARTERLY },
];

const ListClasses = (props: ListClassesProps) => {
  const isMd = useMediaQuery(`(max-width: 500px)`);
  const [isAddClassModal, setIsAddClassModal] = useState<boolean>(false);
  const [couses, setCourses] = useState<Course[]>([]);
  const [isCourseFeesEdit, setisCourseFessEdit] =
    useState<InstituteClass | null>(null);
  const [isViewMonthlyDetails, setIsViewMonthlyDetails] =
    useState<InstituteClass | null>(null);
  const [selectedClassMonthFeeData, setSelectedClassMonthFeeData] = useState<
    FeeData[]
  >([]);
  const [selectedClassYearlyFeeData, setSelectedClassYearlyFeeData] = useState<
    FeeData[]
  >([]);
  const [selectedClassQuaterlyFeeData, setSelectedClassQuaterlyFeeData] =
    useState<FeeData[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<Date | null>(null);
  const [datesData, setDatesData] = useState<
    {
      value: string;
      label: string;
    }[]
  >([]);

  const [startYearDate, setStartYearDate] = useState<Date>(new Date());
  const [defaultCoursePrice, setDefaultCoursePrice] = useState<number>(0);
  const [price, setPrice] = useState<number>(0);
  const [unregisteredStudents, setUnregisteredStudents] = useState<
    StudentInfo[]
  >([]);

  const [selectedFeeOption, setSelectedFeeOption] = useState<FeeOptions>(
    FeeOptions.MONTHLY
  );
  const [showarning, setShowWarning] = useState<boolean>(false);
  const [quaterFees, setquarterFees] = useState<
    {
      date: Date;
      price: number;
    }[]
  >([]);

  const handleClick = (classId: string) => {
    if (props.openedFromAdminPage) {
      if (props.isTeacher) {
        Mixpanel.track(AdminPageEvents.ADMIN_APP_TEACHERS_PAGE_CLASS_CLICK, {
          class_id: classId,
        });
      }
      if (!props.isTeacher) {
        Mixpanel.track(AdminPageEvents.ADMIN_APP_STUDENTS_PAGE_CLASS_CLICK, {
          class_id: classId,
        });
      }
    }
    props.onClassClick(classId);
  };

  function submithandler(id: string) {
    setisCourseFessEdit(null);
    setSelectedMonth(null);
    setDefaultCoursePrice(0);
    setPrice(0);
    if (isCourseFeesEdit && selectedMonth)
      AddCourseFee({
        id: isCourseFeesEdit?._id,
        courseFees: price,
        date: selectedMonth,
        selectedFeeOption: selectedFeeOption,
        quaterFees: quaterFees,
      })
        .then((x) => {
          if (props.resetData) props.resetData();
        })
        .catch((e) => {
          console.log(e);
        });
  }
  function getunregisterdStudents() {
    getAllUnregisteredStudents({ id: props.instituteId })
      .then((x: any) => {
        setUnregisteredStudents(x);
      })
      .catch((e) => {
        console.log(e);
      });
  }

  useEffect(() => {
    //need to remove this not used
    getAllInstituteCoursesAndTestSeries("")
      .then((x: any) => {
        setCourses(x.myCourses);
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);
  useEffect(() => {
    if (props.instituteId) {
      getunregisterdStudents();
    }
  }, [props.instituteId]);

  useEffect(() => {
    if (selectedFeeOption === FeeOptions.QUARTERLY) {
      if (selectedMonth) {
        const startMonth = selectedMonth.getMonth();
        const selectedYear = selectedMonth.getFullYear();
        const fees = [
          {
            date: selectedMonth,
            price: 0,
          },
          {
            date: new Date(
              selectedYear + Math.floor((startMonth + 3) / 12),
              (startMonth + 3) % 12,
              2
            ),
            price: 0,
          },
          {
            date: new Date(
              selectedYear + Math.floor((startMonth + 6) / 12),
              (startMonth + 6) % 12,
              2
            ),
            price: 0,
          },
          {
            date: new Date(
              selectedYear + Math.floor((startMonth + 9) / 12),
              (startMonth + 9) % 12,
              2
            ),
            price: 0,
          },
          {
            date: new Date(
              selectedYear + Math.floor((startMonth + 12) / 12),
              (startMonth + 12) % 12,
              2
            ),
            price: 0,
          },
        ];
        setquarterFees(fees);
      }
    }
  }, [selectedMonth]);

  useEffect(() => {
    if (
      selectedFeeOption === FeeOptions.YEARLY &&
      datesData.length > 0 &&
      selectedClassYearlyFeeData.length > 0
    ) {
      setSelectedMonth(new Date(selectedClassYearlyFeeData[0].monthDate));
    }
    if (
      selectedFeeOption === FeeOptions.QUARTERLY &&
      datesData.length > 0 &&
      selectedClassQuaterlyFeeData.length > 0
    ) {
      setSelectedMonth(new Date(selectedClassQuaterlyFeeData[0].monthDate));
    }
  }, [datesData, selectedClassYearlyFeeData, selectedFeeOption]);

  useEffect(() => {
    if (isCourseFeesEdit)
      GetAllMonthsDataByClassId({ id: isCourseFeesEdit?._id })
        .then((x: any) => {
          setSelectedClassMonthFeeData(x.courseFees);
          setDefaultCoursePrice(x.lastupdatedCourseFee);
          setSelectedFeeOption(x.selectedFeeOption);
          setSelectedClassYearlyFeeData(x.yearlyFeeDates);
          setSelectedClassQuaterlyFeeData(x.quaterlyFeeDates);
          const values = x.quaterlyFeeDates.sort(
            (a: any, b: any) =>
              new Date(a.monthDate).getTime() - new Date(b.monthDate).getTime()
          );
          setSelectedMonth(new Date(values[0].monthDate));
        })
        .catch((e) => {
          console.log(e);
        });
  }, [isCourseFeesEdit]);

  useEffect(() => {
    if (isCourseFeesEdit) {
      const nextYearMonthsArray = getNextYearMonths();
      if (selectedFeeOption === FeeOptions.MONTHLY) {
        setDatesData(nextYearMonthsArray);
        const found = selectedClassMonthFeeData.find((x) => {
          return (
            new Date(x.monthDate).toUTCString() ===
            new Date(nextYearMonthsArray[0].value).toUTCString()
          );
        });
        if (found) {
          setPrice(found.coursefees);
        } else {
          setPrice(defaultCoursePrice);
        }
      } else {
        setDatesData(getThisAndNextYearMonths());
      }
    }
  }, [isCourseFeesEdit, selectedFeeOption, selectedClassMonthFeeData]);

  useEffect(() => {
    if (selectedMonth) {
      if (selectedFeeOption === FeeOptions.MONTHLY) {
        const found = selectedClassMonthFeeData.find((x) => {
          return (
            new Date(x.monthDate).toUTCString() === selectedMonth.toUTCString()
          );
        });
        if (found) {
          setPrice(found.coursefees);
        } else {
          setPrice(defaultCoursePrice);
        }
      } else if (selectedFeeOption === FeeOptions.YEARLY) {
        const found = selectedClassYearlyFeeData.find((x) => {
          return (
            new Date(x.monthDate).toUTCString() === selectedMonth.toUTCString()
          );
        });
        if (found) {
          setPrice(found.coursefees);
        } else {
          setPrice(0);
        }
      } else if (selectedFeeOption === FeeOptions.QUARTERLY) {
        const found = selectedClassQuaterlyFeeData.find((x) => {
          return (
            new Date(x.monthDate).toUTCString() === selectedMonth.toUTCString()
          );
        });
        if (found) {
          setquarterFees((prev) => {
            const prev1 = prev;
            prev1[0].price =
              selectedClassQuaterlyFeeData.find((x) => {
                return (
                  new Date(x.monthDate).toUTCString() ===
                  prev[0].date.toUTCString()
                );
              })?.coursefees ?? 0;
            prev1[1].price =
              selectedClassQuaterlyFeeData.find((x) => {
                return (
                  new Date(x.monthDate).toUTCString() ===
                  prev[1].date.toUTCString()
                );
              })?.coursefees ?? 0;
            prev1[2].price =
              selectedClassQuaterlyFeeData.find((x) => {
                return (
                  new Date(x.monthDate).toUTCString() ===
                  prev[2].date.toUTCString()
                );
              })?.coursefees ?? 0;
            prev1[3].price =
              selectedClassQuaterlyFeeData.find((x) => {
                return (
                  new Date(x.monthDate).toUTCString() ===
                  prev[3].date.toUTCString()
                );
              })?.coursefees ?? 0;
            return prev1;
          });
        } else {
          setPrice(0);
        }
      }
    }
  }, [selectedMonth, datesData]);

  function isValid() {
    if (selectedFeeOption === FeeOptions.QUARTERLY) {
      return quaterFees.slice(0, 4).every((x) => x.price > 0);
    }
    return price > 0;
  }

  return (
    <Box px={10} w={"100%"}>
      <Flex gap={"sm"} mx={5}></Flex>
      <Box mx={5} mt={10}>
        {(!props.classes || props.classes.length === 0) &&
          props.openedFromAdminPage && (
            <Center h="65vh" w="100%">
              <Stack>
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
                  No class added yet!
                </Text>
                <Button
                  leftIcon={<IconPlus />}
                  bga="#3174F3"
                  style={{
                    borderRadius: "20px",
                  }}
                  color="white"
                  size="md"
                  onClick={() => {
                    setIsAddClassModal(true);
                  }}
                >
                  Class
                </Button>
              </Stack>
            </Center>
          )}
        {props.classes && props.classes.length !== 0 && (
          <>
            <Group></Group>
            <ScrollArea
              h={isMd ? "calc(100vh -200px)" : "calc(100vh - 150px)"}
              mt={11}
              style={{
                border: "red",
              }}
            >
              <Text c={"#595959"} fz={23} fw={600}>
                Offline Batches
              </Text>
              <SimpleGrid cols={isMd ? 1 : 2}>
                {props.classes.map((classItem) => (
                  <Box px={2} key={classItem._id} mt={9}>
                    <ClassCard
                      name={classItem.name}
                      studentsCount={classItem.studentsLength}
                      averageScore={classItem.averageScore}
                      teachersCount={classItem.totalTeachers}
                      isTeacher={props.isTeacher}
                      onClick={() => {
                        handleClick(classItem._id);
                      }}
                      onEditCourseFees={() => {
                        setisCourseFessEdit(classItem as InstituteClass);
                      }}
                      onEditClassName={(val: string) => {
                        RenameInstituteClass({
                          id: classItem._id,
                          nameValue: val,
                        })
                          .then((x) => {
                            if (props.resetData) props.resetData();
                          })
                          .catch((e) => {
                            console.log(e);
                          });
                      }}
                      isFeeFeature={props.isFeeService}
                      isReceiptFeature={props.isFeeReceiptFeature}
                      totalClassFees={
                        (classItem as InstituteClass).totalClassFees
                      }
                      totalFeesPaid={
                        (classItem as InstituteClass).totalFeesPaid
                      }
                      onMonthlyCardDetailsCardClick={() => {
                        setIsViewMonthlyDetails(classItem as InstituteClass);
                      }}
                    ></ClassCard>
                  </Box>
                ))}
              </SimpleGrid>
              {!props.isTeacher &&
                unregisteredStudents &&
                unregisteredStudents.length > 0 && (
                  <>
                    <Text c={"#595959"} fz={23} fw={600} mt={30}>
                      Unregistered Students
                    </Text>
                    <SimpleGrid cols={isMd ? 1 : 2}>
                      <Box
                        px={2}
                        mt={9}
                        onClick={() => {
                          handleClick("NEW");
                        }}
                      >
                        <SingleCourseCard
                          name={"Unregistered Students"}
                          studentsCount={unregisteredStudents.length}
                        ></SingleCourseCard>
                      </Box>
                    </SimpleGrid>
                  </>
                )}
              {!props.isTeacher && couses.length > 0 && (
                <>
                  {couses.length > 0 && (
                    <Text c={"#595959"} fz={23} fw={600} mt={30}>
                      Online Batches
                    </Text>
                  )}
                  <SimpleGrid cols={isMd ? 1 : 2}>
                    {couses.map((course) => (
                      <Box
                        px={2}
                        key={course._id}
                        mt={9}
                        onClick={() => handleClick(course._id)}
                      >
                        <SingleCourseCard
                          name={course.name}
                          studentsCount={course.students.length}
                        ></SingleCourseCard>
                      </Box>
                    ))}
                  </SimpleGrid>
                </>
              )}
            </ScrollArea>
          </>
        )}
      </Box>
      <Modal
        opened={isAddClassModal}
        onClose={() => {
          setIsAddClassModal(false);
        }}
        title="Add Class"
        centered
      >
        <AddNewClassModal
          instituteId={props.instituteId}
          onClose={() => {
            setIsAddClassModal(false);
          }}
          onClassAdd={() => {
            props.onClassAdd();
          }}
          allClasses={props.classes}
        />
      </Modal>
      <Modal
        onClose={() => {
          setisCourseFessEdit(null);
          setSelectedMonth(null);
          setDefaultCoursePrice(0);
          setPrice(0);
        }}
        opened={isCourseFeesEdit !== null}
        title="Edit Course Fees"
        centered
        styles={{
          title: {
            color: "black",
            fontSize: "20px",
            fontWeight: 700,
          },
        }}
      >
        <Stack>
          <Radio.Group
            value={selectedFeeOption}
            onChange={(val) => {
              setSelectedFeeOption(val as FeeOptions);
            }}
          >
            <Flex gap="30px">
              <Radio
                value={feeOptions[0].value}
                label={feeOptions[0].label}
              ></Radio>
              <Radio
                value={feeOptions[1].value}
                label={feeOptions[1].label}
              ></Radio>
              <Radio
                value={feeOptions[2].value}
                label={feeOptions[2].label}
              ></Radio>
            </Flex>
          </Radio.Group>
          {selectedFeeOption === FeeOptions.MONTHLY && (
            <>
              <Flex align="center">
                <Text mr={10}>Month:</Text>
                <Select
                  data={datesData}
                  value={selectedMonth?.toUTCString()}
                  onChange={(val) => {
                    if (val) {
                      const date = new Date(val);
                      setSelectedMonth(date);
                    }
                  }}
                ></Select>
              </Flex>
            </>
          )}
          {selectedFeeOption === FeeOptions.YEARLY && (
            <>
              <Flex align="center">
                <Text mr={10}>Start Month:</Text>
                <Select
                  data={datesData}
                  value={selectedMonth?.toUTCString()}
                  onChange={(val) => {
                    if (val) {
                      const date = new Date(val);
                      setSelectedMonth(date);
                    }
                  }}
                ></Select>
              </Flex>
              <Text>
                {months[selectedMonth?.getMonth() ?? 0]}{" "}
                {selectedMonth?.getFullYear()} -
                {months[selectedMonth?.getMonth() ?? 0]}{" "}
                {(selectedMonth?.getFullYear() ?? 0) + 1}
              </Text>
            </>
          )}
          {selectedFeeOption === FeeOptions.QUARTERLY && (
            <>
              <Flex align="center">
                <Text mr={10}>Start Month:</Text>
                <Select
                  data={datesData}
                  value={selectedMonth?.toUTCString()}
                  onChange={(val) => {
                    if (val) {
                      const date = new Date(val);
                      setSelectedMonth(date);
                    }
                  }}
                ></Select>
              </Flex>
              {quaterFees.slice(0, 4).map((x, i) => {
                return (
                  <Flex justify="space-between">
                    <Text>
                      Q{i + 1}.{months[quaterFees[i].date.getMonth()]}-
                      {
                        months[
                          quaterFees[i + 1].date.getMonth() - 1 < 0
                            ? 11
                            : quaterFees[i + 1].date.getMonth() - 1
                        ]
                      }{" "}
                    </Text>
                    <NumberInput
                      value={quaterFees[i]?.price}
                      onChange={(val) => {
                        if (val) {
                          if (i === 0) {
                            setSelectedMonth(quaterFees[i].date);
                          }
                          const newQuarterFees = [...quaterFees];
                          newQuarterFees[i].price = val;
                          setquarterFees(newQuarterFees);
                        }
                      }}
                    />
                  </Flex>
                );
              })}
            </>
          )}
          {selectedFeeOption !== FeeOptions.QUARTERLY && (
            <Flex align="center">
              <Text mr={20}>Price:</Text>
              <NumberInput
                value={price}
                onChange={(val) => {
                  if (val !== undefined) {
                    setPrice(val);
                  }
                }}
              />
            </Flex>
          )}
          <Flex justify="right">
            <Button
              onClick={() => {
                // Mixpanel.track(WebAppEvents.COURSE_FEE_ADDED, {
                //   month: selectedMonth?.getUTCMonth(),
                //   price: price,
                // });
                // if (isCourseFeesEdit) submithandler(isCourseFeesEdit._id);
                if (isValid()) setShowWarning(true);
              }}
              bg="#3174F3"
              sx={{
                "&:hover": {
                  backgroundColor: "#3C51C5",
                },
              }}
              disabled={!isValid()}
            >
              Submit
            </Button>
          </Flex>
        </Stack>
      </Modal>
      <Modal
        opened={isViewMonthlyDetails !== null}
        onClose={() => {
          setIsViewMonthlyDetails(null);
        }}
        title="Monthly Fee/Revenue"
        centered
      >
        {isViewMonthlyDetails && (
          <ViewMonthlyFeeDetails
            classId={isViewMonthlyDetails?._id}
            onClose={() => {
              setIsViewMonthlyDetails(null);
            }}
          />
        )}
      </Modal>
      <Modal
        opened={showarning}
        onClose={() => {
          setShowWarning(false);
        }}
        centered
        title="Warning"
        styles={{
          title: {
            color: "black",
            fontWeight: 700,
            fontSize: 20,
          },
        }}
      >
        <Stack>
          <Text>
            Are you sure you want to change course fee? This action will delete
            all previous fee records.
          </Text>
          <Flex justify="right">
            <Button
              onClick={() => {
                setShowWarning(false);
              }}
              style={{
                border: "1px solid gray",
                color: "black",
              }}
              color="black"
              sx={{
                color: "#000000",
                border: "1px solid #808080",
              }}
              variant="outline"
              size="md"
              mr={10}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                Mixpanel.track(WebAppEvents.COURSE_FEE_ADDED, {
                  month: selectedMonth?.getUTCMonth(),
                  price: price,
                });
                if (isCourseFeesEdit) submithandler(isCourseFeesEdit._id);
                setShowWarning(false);
              }}
              size="md"
              bg="#4B65F6"
              sx={{
                "&:hover": {
                  backgroundColor: "#3C51C5",
                },
              }}
              // bg="#3174F3"
              // sx={{
              //   "&:hover": {
              //     backgroundColor: "#3C51C5",
              //   },
              // }}
              // variant="outline"
            >
              Yes
            </Button>
          </Flex>
        </Stack>
      </Modal>
    </Box>
  );
};

export default ListClasses;
