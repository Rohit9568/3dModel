import {
  Button,
  Flex,
  Modal,
  NumberInput,
  Radio,
  Select,
  Stack,
  Text,
} from "@mantine/core";
import { useEffect, useState } from "react";
import {
  FeeOptions,
  feeOptions,
  getNextYearMonths,
  getPreviousMonths,
  getThisAndNextYearMonths,
  months,
} from "../../ClassSection/ListClasses";
import {
  AddCourseFee,
  GetAllMonthsDataByClassId,
} from "../../../../_parentsApp/features/instituteClassSlice";
import { WebAppEvents } from "../../../../utilities/Mixpanel/AnalyticeEventWebApp";
import { Mixpanel } from "../../../../utilities/Mixpanel/MixpanelHelper";

export function EditCourseFeeModal(props: {
  isCourseFeesEdit: InstituteClass;
  setisCourseFeesEdit: (val: InstituteClass | null) => void;
}) {
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
  const [selectedMonth, setSelectedMonth] = useState<Date | null>(
    new Date(Date.now())
  );
  const [datesData, setDatesData] = useState<
    {
      value: string;
      label: string;
    }[]
  >([]);

  const [startYearDate, setStartYearDate] = useState<Date>(new Date());
  const [defaultCoursePrice, setDefaultCoursePrice] = useState<number>(0);
  const [price, setPrice] = useState<number>(0);
  const [selectedFeeOption, setSelectedFeeOption] = useState<FeeOptions>(
    FeeOptions.MONTHLY
  );
  const [quaterFees, setquarterFees] = useState<
    {
      date: Date;
      price: number;
    }[]
  >([]);
  const [showarning, setShowWarning] = useState<boolean>(false);

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
    console.log(props.isCourseFeesEdit);
    if (props.isCourseFeesEdit)
      GetAllMonthsDataByClassId({ id: props.isCourseFeesEdit?._id })
        .then((x: any) => {
          setSelectedClassMonthFeeData(x.courseFees);
          setDefaultCoursePrice(x.lastupdatedCourseFee);
          setSelectedFeeOption(x.selectedFeeOption);
          setSelectedClassYearlyFeeData(x.yearlyFeeDates);
          setSelectedClassQuaterlyFeeData(x.quaterlyFeeDates);
          const values = (
            x.selectedFeeOption == "Monthly" ? x.courseFees : x.quaterlyFeeDates
          ).sort(
            (a: any, b: any) =>
              new Date(a.monthDate).getTime() - new Date(b.monthDate).getTime()
          );
          console.log(values);
          setSelectedMonth(new Date(values[0].monthDate));
        })
        .catch((e) => {
          console.log(e);
        });
  }, [props.isCourseFeesEdit]);

  useEffect(() => {
    if (props.isCourseFeesEdit) {
      const nextYearMonthsArray = getThisAndNextYearMonths()
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
  }, [props.isCourseFeesEdit, selectedFeeOption, selectedClassMonthFeeData]);

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

  function submithandler(id: string) {
    props.setisCourseFeesEdit(null);
    setSelectedMonth(null);
    setDefaultCoursePrice(0);
    setPrice(0);
    if (props.isCourseFeesEdit && selectedMonth)
      AddCourseFee({
        id: props.isCourseFeesEdit?._id,
        courseFees: price,
        date: selectedMonth,
        selectedFeeOption: selectedFeeOption,
        quaterFees: quaterFees,
      })
        .then((x) => {
          //   if (props.resetData) props.resetData();
        })
        .catch((e) => {
          console.log(e);
        });
  }

  return (
    <>
      <Modal
        onClose={() => {
          props.setisCourseFeesEdit(null);
          setSelectedMonth(null);
          setDefaultCoursePrice(0);
          setPrice(0);
        }}
        opened={props.isCourseFeesEdit !== null}
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
                if (props.isCourseFeesEdit)
                  submithandler(props.isCourseFeesEdit._id);
                setShowWarning(false);
              }}
              size="md"
              bg="#4B65F6"
              sx={{
                "&:hover": {
                  backgroundColor: "#3C51C5",
                },
              }}
            >
              Yes
            </Button>
          </Flex>
        </Stack>
      </Modal>
    </>
  );
}
