import {
  Box,
  Button,
  Center,
  Flex,
  Stack,
  Text,
  Modal,
  Grid,
} from "@mantine/core";
import { IconBackArrow } from "../../_Icons/CustonIcons";
import { lazy, useEffect, useState } from "react";
import { showNotification } from "@mantine/notifications";
import { useMediaQuery } from "@mantine/hooks";
import ProfileStudentFees from "./ProfileStudentFees";
import ProfileStudentAttendance from "./ProfileStudentAttendance";
import { Carousel } from "@mantine/carousel";
import { GiftRedeemCard } from "../../../_parentsApp/Components/GiftRedeemCard";
import { StudentPrizes } from "../../../_parentsApp/Components/StudentPrizes";
import { GetStudentGifts } from "../../../_parentsApp/features/instituteStudentSlice";
import PhoneInput from "react-phone-input-2";
import React from "react";

const ShowStudentResults = lazy(
  () => import("../../../_parentsApp/Components/ShowStudentResults")
);

interface UpdateStudentProfile {
  name: string;
  parentName: string;
  phoneNumber: string[];
  dateBirth: string;
  address: string;
  onBack: () => void;
  instituteId: string;
  instituteClassId: string;
  openedFromAdminPage: boolean;
  isStudentAdd: boolean;
  onSubmitclick: (
    name: string,
    phoneNumber: string[],
    parentName: string,
    dateBirth: string,
    address: string
  ) => void;
  studentData: {
    studentId: string;
    studentName: string;
    profilePic: string;
  };
}

export function UpdateStudentProfile(props: UpdateStudentProfile) {
  const [nameValue, setNameValue] = useState<string>(props.name);
  const [parentNameValue, setParentNameValue] = useState<string>(
    props.parentName
  );
  const [dateBirthValue, setDateBirthValue] = useState<string>(props.dateBirth);
  const [addressValue, setAddressValue] = useState<string>(props.address);
  const [phoneNumbers, setPhoneNumbers] = useState<string[]>(props.phoneNumber);
  const [image, setImage] = useState<File | null>(null);
  const isMd = useMediaQuery(`(max-width: 968px)`);
  const [isEditing, setIsEditing] = useState(false);
  const [isModal, setIsModal] = useState(false);
  const [allStudentGifts, setAllStudentGifts] = useState<StudentGift[]>([]);

  const isFormFilled = () => {
    for (let phoneNumber of phoneNumbers) {
      const isNumberValid = phoneNumber.length > 8;
      if (!isNumberValid) return false;
    }
    return nameValue.trim().length !== 0 && parentNameValue.trim().length !== 0
      ? true
      : false;
  };
  const handleEditProfile = () => {
    setIsEditing(true);
    setIsModal(true);
  };

  const handleModalSubmit = () => {
    setIsModal(false);
    setIsEditing(false);
    if (isFormFilled())
      props.onSubmitclick(
        nameValue,
        phoneNumbers,
        parentNameValue,
        dateBirthValue,
        addressValue
      );
    else {
      showNotification({
        message: "Enter Valid Form Details",
      });
    }
  };

  function fetchStudentGifts() {
    GetStudentGifts({
      id: props.studentData.studentId,
    })
      .then((data: any) => {
        setAllStudentGifts(data);
      })
      .catch((err) => {
        console.log(err);
      });
  }
  useEffect(() => {
    fetchStudentGifts();
  }, [props.studentData]);
  return (
    <Box w={"100%"} mih={"100vh"}>
      <Center>
        <Stack w={"100%"} spacing={24}>
          <form onSubmit={handleModalSubmit}>
            <Modal
              radius="sm"
              size="sm"
              opened={isModal}
              onClose={() => setIsModal(false)}
              title={
                <Text size="lg" fz={20} fw={700}>
                  Edit Profile
                </Text>
              }
              style={{ top: "12vh" }}
            >
              <Stack spacing={8}>
                <Text fz={14} fw={400}>
                  Student Name
                </Text>
                <input
                  placeholder="Enter Student Name"
                  value={nameValue}
                  onChange={(event) => setNameValue(event.currentTarget.value)}
                  autoFocus={isEditing}
                  style={{
                    borderRadius: "6px",
                    padding: "8px",
                    border: "1px solid #808080",
                    borderColor: nameValue ? "#808080" : "red",
                  }}
                />
                <Text fz={14} fw={400}>
                  Father Name
                </Text>
                <input
                  placeholder="Enter parent's name"
                  value={parentNameValue}
                  onChange={(event) =>
                    setParentNameValue(event.currentTarget.value)
                  }
                  autoFocus={isEditing}
                  style={{
                    borderRadius: "6px",
                    padding: "8px",
                    border: "1px solid #808080",
                    borderColor: parentNameValue ? "#808080" : "red",
                  }}
                />
                <Text fz={14} fw={400}>
                  Phone Number
                </Text>
                {phoneNumbers.map((phoneNumber, index) => (
                  <div key={index}>
                    <PhoneInput
                      country="in"
                      placeholder="Enter phone number"
                      value={phoneNumber}
                      onChange={(value?: string | undefined) => {
                        if (value) {
                          var finalPhoneNum = value.toString();
                          if (finalPhoneNum[0] == "0") {
                            console.log(finalPhoneNum);
                            finalPhoneNum = finalPhoneNum.substring(1);
                          }
                          const newPhoneNumbers = [...phoneNumbers];
                          newPhoneNumbers[index] = `+${finalPhoneNum}`;
                          setPhoneNumbers(newPhoneNumbers);
                        }
                      }}
                      containerStyle={{
                        height: "36px",
                      }}
                      inputStyle={{
                        width: "100%",
                        height: "100%",
                        border: "solid 1px #00000040",
                      }}
                    />
                    {/* <input
                      placeholder="Enter phone number"
                      value={phoneNumber}
                      onChange={(event) => {
                        const newPhoneNumbers = [...phoneNumbers];
                        newPhoneNumbers[index] = event.currentTarget.value;
                        setPhoneNumbers(newPhoneNumbers);
                      }}
                      autoFocus={isEditing}
                      style={{
                        borderRadius: "6px",
                        padding: "8px",
                        border: "1px solid #808080",
                        borderColor: phoneNumber ? "#808080" : "red",
                        width: "100%",
                      }}
                      pattern="[0-9]{10}"
                      maxLength={10}
                    /> */}
                  </div>
                ))}
                <Text fz={14} fw={400}>
                  Date Of Birth
                </Text>
                <input
                  placeholder="Enter BirthDate"
                  type="date"
                  value={dateBirthValue}
                  onChange={(event) =>
                    setDateBirthValue(event.currentTarget.value)
                  }
                  autoFocus={isEditing}
                  style={{
                    borderRadius: "6px",
                    padding: "8px",
                    border: "1px solid #808080",
                  }}
                />
                <Text fz={14} fw={400}>
                  Address
                </Text>
                <input
                  placeholder="Enter Address"
                  value={addressValue}
                  onChange={(event) =>
                    setAddressValue(event.currentTarget.value)
                  }
                  autoFocus={isEditing}
                  style={{
                    borderRadius: "6px",
                    padding: "8px",
                    border: "1px solid #808080",
                  }}
                />
              </Stack>
              <Flex justify="flex-end" mt={10} pr={4}>
                <Button
                  id="cancel-btn"
                  onClick={() => setIsModal(false)}
                  style={{
                    backgroundColor: "white",
                    color: "black",
                    border: "1px solid #808080",
                    padding: "11px, 13px, 11px, 13px",
                    borderRadius: "20px",
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleModalSubmit}
                  disabled={!isFormFilled()}
                  style={{
                    backgroundColor: isFormFilled() ? "#3174F3" : "transparent",
                    color: isFormFilled() ? "#ffffff" : "#A7A7A7",
                    border: "1px solid #A7A7A7",
                    borderRadius: "20px",
                    marginLeft: "8px",
                    padding: "11px, 13px, 11px, 13px",
                    width: "20vh",
                    cursor: isFormFilled() ? "pointer" : "default",
                  }}
                >
                  Save Details
                </Button>
              </Flex>
            </Modal>
          </form>
          <Flex w={"100%"} direction="row" justify="space-between">
            <Flex ml={10} justify={"center"}>
              <Box
                w="24px"
                h="24px"
                onClick={() => props.onBack()}
                style={{ cursor: "pointer" }}
              >
                <IconBackArrow col="black" />
              </Box>
              <Text fz={24} fw={700} ml={16}>
                Student Profile
              </Text>
            </Flex>
            <Flex>
              <button
                onClick={handleEditProfile}
                style={{
                  borderRadius: "5vh",
                  fontSize: "16px",
                  fontWeight: "700",
                  padding: "1.4vh",
                  backgroundColor: "#F7F7FF",
                  border: "1px solid #A7A7A7",
                  cursor: "pointer",
                }}
              >
                Edit Profile
              </button>
            </Flex>
          </Flex>
          <Grid mt={5} ml={10} w={"100%"}>
            <Grid.Col span={isMd ? 12 : 4}>
              <div
                style={{
                  height: "100%",
                  overflowX: "hidden",
                  overflowY: "hidden",
                  transition: "height 0.3s ease-in-out",
                  borderRadius: "1.5vh",
                  backgroundColor: "white",
                  boxShadow:
                    "0px 0px 25.71428680419922px 0px rgba(0, 0, 0, 0.1)",
                  fontFamily: "Nunito",
                }}
              >
                <Flex
                  style={{
                    backgroundColor: "#FDC00F",
                    alignItems: "center",
                    padding: "2vh",
                  }}
                >
                  {props.studentData.profilePic !== "" && (
                    <img
                      src={props.studentData.profilePic}
                      width="50px"
                      height="50px"
                      alt="profile"
                      style={{
                        marginRight: "24px",
                        borderRadius: "50%",
                      }}
                    />
                  )}
                  {props.studentData.profilePic === "" && (
                    <img
                      src={require("../../../assets/Profile.png")}
                      width="90px"
                      alt="profile"
                      style={{
                        marginRight: "24px",
                      }}
                    />
                  )}
                  <Text fz={20} fw={600} mr={1}>
                    {props.name}
                  </Text>
                </Flex>
                <Flex pl={6} pb={isMd ? 26 : 8} mt={10} ml={7}>
                  <img
                    src={require("../../../assets/Rectangle.png")}
                    alt="Uploaded"
                  />
                  <Grid ml={3}>
                    <Grid.Col span={12}>
                      <Text fz={16} fw={600}>
                        Father Name:{" "}
                        <span style={{ marginLeft: "5px" }}>
                          {props.parentName}
                        </span>
                      </Text>
                    </Grid.Col>
                    <Grid.Col span={12}>
                      <Text fz={16} fw={600}>
                        Phone Number: {phoneNumbers.join(", ")}
                      </Text>
                    </Grid.Col>
                    <Grid.Col span={12}>
                      <Text fz={16} fw={600}>
                        Date of Birth:{" "}
                        <span style={{ marginLeft: "5px" }}>
                          {props.dateBirth}
                        </span>
                      </Text>
                    </Grid.Col>
                    <Grid.Col span={12} style={{ marginTop: "-5px" }}>
                      <Text fz={16} fw={600}>
                        Address:{" "}
                        <span style={{ marginLeft: "5px" }}>
                          {props.address}
                        </span>
                      </Text>
                    </Grid.Col>
                  </Grid>
                </Flex>
              </div>
            </Grid.Col>
            <Grid.Col span={isMd ? 12 : 4}>
              <ProfileStudentFees
                studentData={{
                  studentId: props.studentData.studentId,
                }}
                batchId={props.instituteClassId}
              />
            </Grid.Col>
            <Grid.Col span={isMd ? 12 : 4}>
              {isMd ? (
                <Center>
                  <ProfileStudentAttendance
                    studentData={{
                      studentId: props.studentData.studentId,
                    }}
                  />
                </Center>
              ) : (
                <ProfileStudentAttendance
                  studentData={{
                    studentId: props.studentData.studentId,
                  }}
                />
              )}
            </Grid.Col>
          </Grid>
          <Grid w={"100%"} ml={10} pr={isMd ? 0 : 80}>
            <Grid.Col span={isMd || allStudentGifts.length === 0 ? 12 : 8}>
              <React.Suspense fallback={<></>}>
                <ShowStudentResults
                  studentData={{
                    studentId: props.studentData.studentId,
                    batchId: props.instituteClassId,
                    batchName: "",
                    studentName: props.studentData.studentName,
                  }}
                  showTestCards={false}
                  onResultArrowClicked={() => {}}
                />
              </React.Suspense>
            </Grid.Col>
            {allStudentGifts.length > 0 && (
              <Grid.Col span={isMd ? 12 : 4}>
                <StudentPrizes
                  studentId={props.studentData.studentId}
                  onFetchGift={fetchStudentGifts}
                  allStudentGifts={allStudentGifts}
                />
              </Grid.Col>
            )}
          </Grid>
        </Stack>
      </Center>
    </Box>
  );
}
