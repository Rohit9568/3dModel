import {
  Button,
  Divider,
  Flex,
  Grid,
  LoadingOverlay,
  NumberInput,
  Select,
  Stack,
  Text,
  Tooltip,
} from "@mantine/core";
import { IconChevronDown, IconCurrencyRupee } from "@tabler/icons";
import { useEffect, useState } from "react";
import { FeeOptions, getMonthsFromDate } from "./ListClasses";
import { GetAllMonthsDataByClassId } from "../../../_parentsApp/features/instituteClassSlice";
import {
  AddStudentDiscount,
  CreateNewPaymentRecord,
  GetPaymentRecordsById,
} from "../../../_parentsApp/features/instituteStudentSlice";
import {
  formatDate,
  generateRandomFiveDigitNumber,
} from "../../../utilities/HelperFunctions";
import { downloadreceipt } from "../../FeeReceiptPdf/FeeReceiptPdf";
import { IconDownload } from "../../_Icons/CustonIcons";
import { Mixpanel } from "../../../utilities/Mixpanel/MixpanelHelper";
import { WebAppEvents } from "../../../utilities/Mixpanel/AnalyticeEventWebApp";
import { useSelector } from "react-redux";
import { RootState } from "../../../store/ReduxStore";
import { renderToPipeableStream } from "react-dom/server";
import useParentCommunication from "../../../hooks/useParentCommunication";

function formatDateRange(values: any[]) {
  const formattedDates = [];
  for (let i = 0; i < values.length; i++) {
    const currentDate = new Date(values[i].monthDate);
    const nextYear = currentDate.getFullYear() + 1;
    const formattedLabel = `${currentDate.toLocaleString("default", {
      month: "short",
    })} ${currentDate.getFullYear()}-${currentDate.toLocaleString("default", {
      month: "short",
    })} ${nextYear}`;
    formattedDates.push({
      value: values[i].monthDate,
      label: formattedLabel,
    });
  }
  return formattedDates;
}

function formatQuarterRange(values: any[]) {
  // Sort the input values by month date
  values.sort(
    (a, b) => new Date(a.monthDate).getTime() - new Date(b.monthDate).getTime()
  );

  const formattedQuarters = [];
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "April",
    "May",
    "June",
    "July",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  for (let i = 0; i < values.length; i++) {
    const startDate = new Date(values[i].monthDate);
    const endDate = new Date(startDate);
    endDate.setMonth(startDate.getMonth() + 2); // Adding 2 months to get end of quarter

    const formattedLabel = `${
      months[startDate.getMonth()]
    }-${startDate.getFullYear()} to ${
      months[endDate.getMonth()]
    }-${endDate.getFullYear()}`;

    formattedQuarters.push({
      value: values[i].monthDate,
      label: formattedLabel,
    });
  }

  return formattedQuarters;
}

export function ViewFeeDetailsModal(props: {
  selectedStudent: StudentsDataWithBatch;
  onClose: () => void;
  classId: string;
  instituteId: string;
  className: string;
  onSubmit: () => void;
}) {
  const today = new Date();
  const monthDate = new Date(today.getFullYear(), today.getMonth(), 2);
  const [dateValue, setDateValue] = useState<Date | null>(monthDate);
  const [numberValue, setNumberValue] = useState<number>(0);
  const [viewPaymentHistory, setViewPaymentHistory] = useState<boolean>(false);
  const [paymentRecords, setPaymentrecords] = useState<StudentFeeRecord[]>([]);
  const [dateStringvalue, setDateStringValue] = useState<string>("");
  const [datesData, setDatesData] = useState<
    {
      value: string;
      label: string;
    }[]
  >([]);
  const [selectedClassMonthFeeData, setSelectedClassMonthFeeData] = useState<
    FeeData[]
  >([]);
  const [
    initialselectedClassMonthFeeData,
    setinitialSelectedClassMonthFeeData,
  ] = useState<FeeData[]>([]);
  const [defaultPrice, setDefaultPrice] = useState<number>(0);
  const [originalMaxFee, setOriginalMaxFee] = useState<number>(0);
  const [maxFee, setMaxFee] = useState<number>(0);
  const [selectedMonthFee, setSelectedMonthFee] = useState<number>(0);
  const instituteDetails = useSelector<RootState, InstituteDetails | null>(
    (state) => {
      return state.instituteDetailsSlice.instituteDetails;
    }
  );

  const [isAddDiscount, setIsAddDiscount] = useState<boolean>(false);
  const [discountValue, setDiscountValue] = useState<number>(0);

  const [selectedFeeOption, setSelectedFeeOption] = useState<FeeOptions>(
    FeeOptions.MONTHLY
  );
  const { sendDataToReactnative, isReactNativeActive } =
    useParentCommunication();

  useEffect(() => {}, [discountValue]);
  useEffect(() => {
    setNumberValue(0);
  }, []);
  useEffect(() => {
    const today = new Date();
    const monthDate = new Date(today.getFullYear(), today.getMonth(), 2);
    setDateValue(monthDate);
  }, []);

  function getAllMonthFeeData() {
    GetAllMonthsDataByClassId({ id: props.classId })
      .then((x: any) => {
        if (x.selectedFeeOption === FeeOptions.MONTHLY) {
          setinitialSelectedClassMonthFeeData(x.courseFees);
        } else if (x.selectedFeeOption === FeeOptions.QUARTERLY) {
          setinitialSelectedClassMonthFeeData(x.quaterlyFeeDates);
        } else if (x.selectedFeeOption === FeeOptions.YEARLY) {
          setinitialSelectedClassMonthFeeData(x.yearlyFeeDates);
        }

        setDefaultPrice(x.lastupdatedCourseFee);
        setSelectedFeeOption(x.selectedFeeOption);

        if (x.selectedFeeOption === FeeOptions.YEARLY) {
          setDatesData(formatDateRange(x.yearlyFeeDates));
          setDateValue(new Date(x.yearlyFeeDates[0].monthDate));
          setDateStringValue(x.yearlyFeeDates[0].monthDate);
        } else if (x.selectedFeeOption === FeeOptions.MONTHLY) {
          const allDates = getMonthsFromDate(
            x.startFeeMonth ? new Date(x.startFeeMonth) : new Date()
          );
          setDatesData(allDates);
          allDates.map((x) => {
            if (
              new Date(x.value).getMonth() === today.getMonth() &&
              new Date(x.value).getFullYear() === today.getFullYear()
            ) {
              setDateValue(new Date(x.value));
              setDateStringValue(x.value);
            }
          });
        } else if (x.selectedFeeOption === FeeOptions.QUARTERLY) {
          setDatesData(formatQuarterRange(x.quaterlyFeeDates));
          setDateValue(new Date(x.quaterlyFeeDates[0].monthDate));
          setDateStringValue(x.quaterlyFeeDates[0].monthDate);
        }
      })
      .catch((e) => {
        console.log(e);
      });
  }

  useEffect(() => {
    getAllMonthFeeData();
  }, []);

  function getStudentPaymentRecords() {
    GetPaymentRecordsById({
      id: props.selectedStudent._id!!,
      batchId: props.classId,
    })
      .then((x: any) => {
        setPaymentrecords(x.paymentRecords);
        if (x.feeDiscount !== 0) {
          setDiscountValue(x.feeDiscount);
          setIsAddDiscount(true);
        }
      })
      .catch((e) => {
        console.log(e);
      });
  }
  useEffect(() => {
    getStudentPaymentRecords();
  }, []);
  useEffect(() => {
    if (dateValue) {
      // if (selectedFeeOption === FeeOptions.YEARLY) {
      const found = selectedClassMonthFeeData.find(
        (x) => new Date(x.monthDate).toUTCString() === dateValue.toUTCString()
      );
      if (found) {
        setMaxFee(found.coursefees);
      } else {
        setMaxFee(0);
      }
    }
  }, [dateValue, selectedClassMonthFeeData]);

  useEffect(() => {
    if (dateValue) {
      const found = initialselectedClassMonthFeeData.find(
        (x) => new Date(x.monthDate).toUTCString() === dateValue.toUTCString()
      );
      if (found) {
        setOriginalMaxFee(found.coursefees);
      } else {
        setOriginalMaxFee(0);
      }
    }
  }, [initialselectedClassMonthFeeData, dateValue]);

  useEffect(() => {
    setSelectedClassMonthFeeData((prev) => {
      const prev1: FeeData[] = initialselectedClassMonthFeeData.map((val) => {
        const found = paymentRecords.filter(
          (x) =>
            new Date(x.monthDate).toUTCString() ===
            new Date(val.monthDate).toUTCString()
        );
        const totalFeespaid = found.reduce(
          (total, x) => total + x.pricePaid,
          0
        );
        if (found) {
          return {
            _id: val._id,
            monthDate: val.monthDate,
            coursefees: val.coursefees - totalFeespaid,
          };
        } else {
          return val;
        }
      });
      return prev1;
    });
  }, [paymentRecords, initialselectedClassMonthFeeData]);

  useEffect(() => {
    if (dateValue) {
      const found = initialselectedClassMonthFeeData.find((x) => {
        return new Date(x.monthDate).toUTCString() === dateValue.toUTCString();
      });
      if (found) setSelectedMonthFee(found?.coursefees);
    }
  }, [dateValue, initialselectedClassMonthFeeData]);

  function updatehandler() {
    if (dateValue) {
      if (numberValue !== 0 && numberValue <= maxFee) {
        setLoading(true);
        CreateNewPaymentRecord({
          id: props.selectedStudent._id!!,
          monthDate: dateValue,
          pricePaid: numberValue,
          priceToBePaid: maxFee,
          instituteId: props.instituteId,
          batchId: props.classId,
        })
          .then((x) => {
            setLoading(false);
            Mixpanel.track(WebAppEvents.FEE_DETAILS_UPDATED, {
              amount: numberValue,
            });
            setNumberValue(0);
            getStudentPaymentRecords();
            getAllMonthFeeData();
            props.onSubmit();
          })
          .catch((e) => {
            setNumberValue(0);
            setLoading(false);
            console.log(e);
          });
      }
      if (discountValue !== undefined && isAddDiscount) {
        setLoading(true);
        AddStudentDiscount({
          id: props.selectedStudent._id!!,
          discount: discountValue,
        })
          .then((x) => {
            setLoading(false);
            setNumberValue(0);
            getStudentPaymentRecords();
            getAllMonthFeeData();
            props.onSubmit();
          })
          .catch((e) => {
            setNumberValue(0);
            setLoading(false);
            console.log(e);
          });
      }
    }
  }

  const [isLoading, setLoading] = useState<boolean>(false);

  return (
    <Stack>
      <LoadingOverlay visible={isLoading} />
      <Text>Student Name: {props.selectedStudent.name}</Text>
      <Text>Parent Name: {props.selectedStudent.parentName}</Text>
      <Text>Phone No: {props.selectedStudent.phoneNumber[0]}</Text>
      <Divider variant="dashed" size="md" />
      <Flex align="center" justify="space-between">
        <Text>Add Fee Details</Text>
        <Select
          data={datesData}
          value={dateStringvalue}
          onChange={(val) => {
            if (val) {
              const date = new Date(val);
              setDateValue(date);
              setDateStringValue(val);
            }
          }}
        />
      </Flex>
      {!isAddDiscount && (
        <Flex justify="right">
          <Text
            style={{
              cursor: "pointer",
              color: "#4B65F6",
              textDecoration: "underline",
            }}
            onClick={() => {
              setIsAddDiscount((prev) => !prev);
            }}
          >
            Add Discount
          </Text>
        </Flex>
      )}
      {isAddDiscount && (
        <Stack>
          <Flex align="center" justify="space-between">
            <Text>Add Discount</Text>
            <NumberInput
              value={discountValue}
              onChange={(val) => {
                if (val) {
                  if (val <= maxFee) {
                    setNumberValue(0);
                    setDiscountValue(val);
                  }
                } else {
                  setNumberValue(0);
                  setDiscountValue(0);
                }
              }}
              min={0}
              max={maxFee}
            />
          </Flex>
        </Stack>
      )}
      <Flex align="center" justify="center" my={15}>
        <NumberInput
          value={numberValue}
          onChange={(val) => {
            if (
              val !== undefined &&
              val <= maxFee - discountValue &&
              val >= 0
            ) {
              setNumberValue(val);
            }
          }}
          max={maxFee - discountValue}
        />
        <Text fz={25} ml={10}>
          / <IconCurrencyRupee size={20} />
          {maxFee - discountValue}
          <sub
            style={{
              fontSize: 12,
            }}
          >
            (pending fee)
          </sub>
        </Text>
      </Flex>
      {discountValue !== 0 && (
        <Flex align="center" justify="right">
          <Text>Total Fees:</Text>

          <Flex mx={10} align="center">
            <IconCurrencyRupee size={18} />
            <Text fz={20}>{originalMaxFee - discountValue}</Text>
          </Flex>
          <IconCurrencyRupee
            size={18}
            style={{
              textDecoration: "line-through",
            }}
          />
          <Text
            style={{
              textDecoration: "line-through",
              // color: "red",
              fontSize: 16,
            }}
          >
            {originalMaxFee}
          </Text>
        </Flex>
      )}
      {paymentRecords.length !== 0 && (
        <Grid
          // style={{
          //   border: "black solid 1px",
          // }}
          mb={20}
          mt={10}
        >
          <Grid.Col
            span={12}
            style={{
              border: "1px solid #CED4DA",
            }}
          >
            <Flex
              justify="space-between"
              style={{
                cursor: "pointer",
              }}
              py={5}
              px={2}
              onClick={() => {
                setViewPaymentHistory((prev) => !prev);
              }}
            >
              <Text>View Payment History</Text>
              <IconChevronDown
                style={{
                  rotate: viewPaymentHistory ? "-90deg" : "0deg",
                  transition: "0.2s ease-in-out all",
                }}
              />
            </Flex>
          </Grid.Col>
          {viewPaymentHistory === true && (
            <>
              <Grid.Col
                span={5}
                style={{
                  border: "1px solid #CED4DA",
                }}
              >
                Payment Record
              </Grid.Col>
              <Grid.Col
                span={4}
                style={{
                  border: "1px solid #CED4DA",
                }}
              >
                Date
              </Grid.Col>
              {instituteDetails?.featureAccess.feeReceiptAccess && (
                <Grid.Col
                  span={3}
                  style={{
                    border: "1px solid #CED4DA",
                  }}
                >
                  Receipt
                </Grid.Col>
              )}

              {paymentRecords.map((paymentRecord) => {
                return (
                  <>
                    <Grid.Col
                      span={5}
                      style={{
                        border: "1px solid #CED4DA",
                      }}
                    >
                      <Flex align="center">
                        <IconCurrencyRupee size={18} />
                        <Text>{paymentRecord.pricePaid}</Text>
                      </Flex>
                    </Grid.Col>
                    <Grid.Col
                      span={4}
                      style={{
                        border: "1px solid #CED4DA",
                      }}
                    >
                      {formatDate(new Date(paymentRecord.createdAt))}
                    </Grid.Col>
                    {instituteDetails?.featureAccess.feeReceiptAccess && (
                      <Grid.Col
                        span={3}
                        style={{
                          border: "1px solid #CED4DA",
                          cursor: "pointer",
                          textAlign: "center",
                        }}
                        onClick={() => {
                          Mixpanel.track(
                            WebAppEvents.INSTALLMENT_RECEIPT_DOWNLOADED,
                            {
                              type: "installment",
                            }
                          );
                          downloadreceipt(
                            isLoading,
                            setLoading,
                            paymentRecord.receiptNo,
                            props.selectedStudent.name,
                            new Date(paymentRecord.monthDate),
                            props.selectedStudent.parentName,
                            paymentRecord.pricePaid,
                            [paymentRecord],
                            paymentRecord.priceToBePaid -
                              paymentRecord.pricePaid,
                            props.instituteId,
                            props.className,
                            isReactNativeActive(),
                            sendDataToReactnative
                          );
                        }}
                      >
                        <Tooltip label="Download">
                          <IconDownload />
                        </Tooltip>
                      </Grid.Col>
                    )}
                  </>
                );
              })}
            </>
          )}
        </Grid>
      )}

      <LoadingOverlay visible={isLoading} />
      <Flex justify="space-between" px={30}>
        <Button
          // bg="#4B65F6"
          style={{ borderRadius: "24px" }}
          size="lg"
          onClick={() => {
            props.onClose();
          }}
          w="45%"
          sx={{
            color: "#000000",
            border: "1px solid #808080",
          }}
          variant="outline"
        >
          Cancel
        </Button>
        <Button
          bg="#4B65F6"
          style={{ borderRadius: "24px" }}
          size="lg"
          sx={{
            "&:hover": {
              backgroundColor: "#3C51C5",
            },
          }}
          w="45%"
          onClick={() => {
            updatehandler();
          }}
          disabled={
            (numberValue === 0 || numberValue > maxFee) && !isAddDiscount
          }
        >
          Update
        </Button>
      </Flex>
    </Stack>
  );
}
