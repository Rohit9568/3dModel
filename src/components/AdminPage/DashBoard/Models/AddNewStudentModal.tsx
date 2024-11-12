import {
  Button,
  Center,
  Flex,
  Grid,
  Modal,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { DatePicker, DateRangePickerValue } from "@mantine/dates";
import { IconCalendar, IconDatabase, IconPlus, IconX } from "@tabler/icons";
import { useState } from "react";
import { showNotification } from "@mantine/notifications";

import { E164Number } from "libphonenumber-js/types.cjs";

import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

interface AddNewStudentModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onNextButtonClicked: (studentToCreate: StudentsDataWithBatch) => void;
}

export const AddNewStudentModal: React.FC<AddNewStudentModalProps> = ({
  isOpen,
  setIsOpen,
  onNextButtonClicked,
}) => {
  const isMd = useMediaQuery(`(max-width: 820px)`);
  const [additionalPhoneNumbers, setAdditionalPhoneNumbers] = useState<
    string[]
  >([]);


  const [studentName, setStudentName] = useState<string>("");
  const [parentName, setParentName] = useState<string>("");
  const [dateofBirth, setDateOfBirth] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");

  const [datePickerValue, setDatePickerValue] = useState<Date>();

  const isFormFilled = () => {
    console.log(phoneNumber);
    if (phoneNumber.length==0) return false;

    return studentName.trim().length !== 0 && parentName.trim().length !== 0
      ? true
      : false;
  };

  return (
    <>
      <Modal
        radius="sm"
        size={"md"}
        opened={isOpen}
        centered
        onClose={() => {
          setIsOpen(false);
        }}
        closeOnClickOutside={false}
        withCloseButton={false}
        mx={10}
      >
        <Stack>
          <Grid grow align="center">
            <Grid.Col span={10}>
              <Text color="#000000" size={20} fw={700}>
                Add New Student
              </Text>
            </Grid.Col>
            <Grid.Col span={1} mt={4}>
              <IconX
                size={22}
                cursor="pointer"
                onClick={() => {
                  setIsOpen(false);
                }}
              />
            </Grid.Col>
          </Grid>
          <TextInput
            placeholder="Enter Student Name"
            label="Student Name"
            value={studentName}
            onChange={(event) => setStudentName(event.currentTarget.value)}
            withAsterisk
          />

          <DatePicker
            placeholder="Select Date"
            label="Date of Birth"
            value={datePickerValue}
            onChange={(date: Date) => {
              setDatePickerValue(date);
            }}
            icon={<IconCalendar size={16} />}
          />

          <TextInput
            placeholder="Enter Parent's Name"
            label="Parent Name"
            value={parentName}
            onChange={(event) => setParentName(event.currentTarget.value)}
            withAsterisk
          />

          <TextInput
            placeholder="Enter your Address Here"
            label="Address"
            value={address}
            onChange={(event) => setAddress(event.currentTarget.value)}
          />

          <Text fz={14}>Phone Number *</Text>
        
          <PhoneInput
            country="in"
            placeholder="Enter phone number"
            value={phoneNumber}
            onChange={(value?: string | undefined) => {
              if (value) {
                var finalPhoneNum = value.toString();
                if (finalPhoneNum[0] == "0") {
                  finalPhoneNum = finalPhoneNum.substring(1);
                }
                setPhoneNumber(`+${finalPhoneNum}`);
              }
            }}
            containerStyle={{
              height:"36px"
            }}
            inputStyle={{
              width:"100%",
              height:"100%",
              border:"solid 1px #00000040",
            }}
          />

          { additionalPhoneNumbers.map((phoneNumber, index) => {
            return (
              <Grid grow align="center">
                <Grid.Col span={10}>
                  <PhoneInput
                   country="in"
                    placeholder="Enter phone number"
                    value={additionalPhoneNumbers[index]}
                    onChange={(value?: string | undefined) => {
                      if (value) {
                        var finalPhoneNum = value.toString();
                        if (finalPhoneNum[0] == "0") {
                          finalPhoneNum = finalPhoneNum.substring(1);
                        }
                        additionalPhoneNumbers[index] = `+${finalPhoneNum}`;
                        setAdditionalPhoneNumbers([...additionalPhoneNumbers]);
                      }
                    }}
                    containerStyle={{
                      height:"36px"
                    }}
                    inputStyle={{
                      width:"100%",
                      height:"100%",
                      border:"solid 1px #00000040",
                    }}
                  />

                </Grid.Col>
                <Grid.Col span={1}>
                  <IconX
                    cursor="pointer"
                    onClick={() => {
                      additionalPhoneNumbers.splice(index, 1);
                      setAdditionalPhoneNumbers([...additionalPhoneNumbers]);
                    }}
                  ></IconX>
                </Grid.Col>
              </Grid>
            );
          })}
          <Stack align="flex-end">
            <Button
              mt={8}
              variant="subtle"
              leftIcon={<IconPlus size={20} />}
              onClick={() => {
                setAdditionalPhoneNumbers([...additionalPhoneNumbers, ""]);
              }}
            >
              Add Phone Number
            </Button>
          </Stack>

          <Flex justify="flex-end" mt={28} pr={4}>
            <Button
              id="cancel-btn"
              onClick={() => {
                setIsOpen(false);
              }}
              size="md"
              style={{
                backgroundColor: "white",
                color: "black",
                border: "1px solid #808080",
                padding: "11px, 13px, 11px, 13px",
                borderRadius: "20px",
              }}
            >
              <Text fz={14} fw={700}>
                Cancel
              </Text>
            </Button>

            <Button
              onClick={() => {
                if (isFormFilled()) {
                  onNextButtonClicked({
                    name: studentName,
                    phoneNumber: [...additionalPhoneNumbers, phoneNumber],
                    parentName: parentName,
                    instituteId: "",
                    batchId: "",
                    dateOfBirth: datePickerValue?.toString(),
                    address: address,
                    totalRewardpoints: 0,
                    noofGivenTests: 0,
                  });
                } else {
                  showNotification({
                    message: "Enter Valid Form Details",
                  });
                }
              }}
              py={5}
              style={{
                backgroundColor: "",
                borderRadius: "20px",
                marginLeft: "8px",
                cursor: "pointer",
              }}
              px={40}
              bg="#4B65F6"
              size="md"
              sx={{
                "&:hover": {
                  backgroundColor: "#4B65F6",
                },
              }}
            >
              <Text fz={14} fw={700}>
                Next
              </Text>
            </Button>
          </Flex>
        </Stack>
      </Modal>
    </>
  );
};
