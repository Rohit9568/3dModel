import {
  Box,
  Button,
  Center,
  Flex,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import {
  CheckIfStudentRegistered,
  CreateUnregisteredStudent,
  generateAccessToken,
  verifyOtp,
} from "../features/instituteStudentSlice";
import { useSelector } from "react-redux";
import { RootState } from "../../store/ReduxStore";
import { InstituteFirstSection } from "./InstituteLoginPage";
import { IconLeftArrow } from "../../components/_Icons/CustonIcons";

import React, { useEffect, useState } from "react";
import PinInput from "./utils/PinInput";
import { MobilePhoneCard } from "./utils/MobilePhoneCard";
import { LoginButton } from "./utils/LogInButton";
import { TextInputFeild } from "./utils/TextInputFeild";
import {
  LocalStorageKey,
  RemoveValueFromLocalStorage,
  SaveValueToLocalStorage,
} from "../../utilities/LocalstorageUtility";
import { showNotification } from "@mantine/notifications";
import ResendOTP from "./utils/ResendOtp";
import { PrivacypolicyChecked } from "./utils/PrivacyPolicyCheckbox";
import { useLocation } from "react-router-dom";

interface PinInputProps {
  type: "number" | "text";
}

export function StudentLogin(props: {
  setisTeacherLogin: (val: boolean) => void;
  setisLoading: (val: boolean) => void;
}) {
  const [phone, setPhone] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [nameError, setNameError] = useState<boolean>(false);
  const [otpVerification, setOtpVerification] = useState<boolean>(false);
  const [registeredStudent, setRegisteredStudent] = useState<boolean>(false);
  const [studentId, setStudentId] = useState<string>("");

  const [isRegisterMode, setIsRegisterMode] = useState<boolean>(false);

  const instituteDetails = useSelector<RootState, InstituteDetails | null>(
    (state) => state.instituteDetailsSlice.instituteDetails
  );
  const [password, setPassword] = useState<string>();
  const [isConditionsAccepted, setIsConditionsAccepted] =
    useState<boolean>(true);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const meetingId = queryParams.get("meetingId");
  function sendOtpToRegisteredStudent() {
    if (instituteDetails) {
      props.setisLoading(true);
      CheckIfStudentRegistered({
        phoneNo: phone,
        instituteId: instituteDetails._id,
      })
        .then((x: any) => {
          //@ts-ignore
          window.sendOtp(
            phone.substring(1), // mandatory
            (data: any) => {
              setOtpVerification(true);
              props.setisLoading(false);
              setStudentId(x.id);
            },
            (error: any) => {
              props.setisLoading(false);
              if (error.code == "408") {
                console.log("Error Occured");
              }
            }
          );
        })
        .catch((e) => {
          props.setisLoading(false);
          console.log(e);
          if (e.response.status == 404) {
            setRegisteredStudent(true);
            showNotification({
              message: "Not a registered student",
            });
          } else {
            showNotification({
              message: e.message,
            });
          }
          console.log(e);
        });
    }
  }
  function createunregesteredstudent() {
    if (name.length === 0 || phone.length < 10) {
      if (name.length === 0) {
        setNameError(true);
        showNotification({
          message: "Name length should not be zero",
        });
      }
      if (phone.length < 10) {
        showNotification({
          message: "Invalid Phone Number",
        });
      }
      return;
    }
    if (instituteDetails) {
      props.setisLoading(true);
      CreateUnregisteredStudent({
        phoneNo: phone,
        instituteId: instituteDetails._id,
        name: name,
      })
        .then((x: any) => {
          props.setisLoading(false);
          setOtpVerification(true);
          setStudentId(x.id);
          sendOtpToRegisteredStudent();
        })
        .catch((e) => {
          if (e.response.data.message === "Student already exists") {
            showNotification({
              message: "Student already exists",
            });
          }
          props.setisLoading(false);
          console.log(e);
        });
    }
  }

  function studentAuththentication(token: string) {
    props.setisLoading(false);
    SaveValueToLocalStorage(LocalStorageKey.Token, token);
    RemoveValueFromLocalStorage(LocalStorageKey.User);
    RemoveValueFromLocalStorage(LocalStorageKey.UserType);
    window.location.href = `/${instituteDetails?.name}/${
      instituteDetails?._id
    }/home${meetingId ? `/videocall?meetingId=${meetingId}` : ""}`;
  }

  function verifyRegisteredStudentOtp(otp: string) {
    setOtpVerification(true);
    if (instituteDetails) {
      props.setisLoading(true);
      //@ts-ignore
      window.verifyOtp(
        Number(otp), // OTP value
        (data: any) => {
          props.setisLoading(false);
          //send generate token call here.
          generateAccessToken({
            studentId,
          })
            .then((x: any) => {
              studentAuththentication(x.token);
            })
            .catch((e) => {
              props.setisLoading(false);
              showNotification({
                message: "Error Occured",
              });
              console.log(e);
            });
        },
        (error: any) => {
          props.setisLoading(false);
          showNotification({
            message: error.message,
          });
          console.log(error);
        }
      );
    }
  }

  return (
    <>
      {!otpVerification && (
        <>
          <Stack
            justify="space-between"
            style={{
              height: "90%",
            }}
            px={20}
          >
            {!registeredStudent && (
              <>
                <Stack justify="left">
                  <InstituteFirstSection />
                  <MobilePhoneCard
                    phone={phone}
                    setPhone={(val) => setPhone(val)}
                  />
                  <Flex mt={20} align="center">
                    <div
                      style={{
                        width: "100%",
                        height: "2px",
                        backgroundColor: "#A3A3A3",
                      }}
                    />
                    <Text color="#A3A3A3" fz={20} px={10}>
                      Or
                    </Text>
                    <div
                      style={{
                        width: "100%",
                        height: "2px",
                        backgroundColor: "#A3A3A3",
                      }}
                    />
                  </Flex>
                  <Flex w="100%">
                    <Text mr={8} ta="center" w="100%">
                      Have a teacher account?
                      <span
                        style={{
                          cursor: "pointer",
                          fontWeight: 700,
                          color: "#4158D6",
                          marginLeft: "5px",
                        }}
                        onClick={() => props.setisTeacherLogin(true)}
                      >
                        Login as Teacher
                      </span>
                    </Text>
                  </Flex>
                 { !isRegisterMode && <Flex w="100%">
                    <Text mr={8} ta="center" w="100%">
                      Are you a new student?
                      <span
                        style={{
                          cursor: "pointer",
                          fontWeight: 700,
                          color: "#4158D6",
                          marginLeft: "5px",
                        }}
                        onClick={() =>setIsRegisterMode(!isRegisterMode)}
                      >
                        Register
                      </span>
                    </Text>
                  </Flex>
}
                </Stack>
                <Stack>
                  <PrivacypolicyChecked
                    isConditionsAccepted={isConditionsAccepted}
                    setIsConditionsAccepted={(val) =>
                      setIsConditionsAccepted(val)
                    }
                    instituteName={instituteDetails?.name??""}
                  />
                  <LoginButton
                    onClick={() => {
                      sendOtpToRegisteredStudent();
                    }}
                    text={isRegisterMode?"Register":"Login"}
                    disabled={!isConditionsAccepted}
                  />
                </Stack>
              </>
            )}
            {registeredStudent && (
              <>
                <Stack>
                  <InstituteFirstSection />
                  <MobilePhoneCard
                    phone={phone}
                    setPhone={(val) => setPhone(val)}
                  />
                  <TextInputFeild
                    label="Name"
                    value={name}
                    placeholder="Type Your Name"
                    onChange={(val) => {
                      if (val.length > 0) {
                        setNameError(false);
                      }
                      setName(val);
                    }}
                    error={nameError}
                  />
                </Stack>
                <Stack>
                  <PrivacypolicyChecked
                    isConditionsAccepted={isConditionsAccepted}
                    setIsConditionsAccepted={(val) =>
                      setIsConditionsAccepted(val)
                    }
                    instituteName={instituteDetails?.name??""}
                  />
                  <LoginButton
                    onClick={createunregesteredstudent}
                    text="Register"
                    disabled={!isConditionsAccepted}
                  />
                  <Text ta="center">
                    Already have an account?{" "}
                    <span
                      style={{
                        cursor: "pointer",
                        color: "#0D61FF",
                      }}
                      onClick={() => {
                        setIsRegisterMode(false);
                        setRegisteredStudent(false);
                      }}
                    >
                      Login
                    </span>
                  </Text>
                </Stack>
              </>
            )}
          </Stack>
        </>
      )}
      {otpVerification && (
        <Stack w="100%" spacing={0} mt={-50}>
          <Flex px={15} justify="space-between" py={20}>
            <Box
              style={{
                cursor: "pointer",
              }}
              w="10px"
              h="10px"
              onClick={() => {
                setOtpVerification(false);
              }}
            >
              <IconLeftArrow />
            </Box>
            <Text fz={18} fw={600}>
              Verification
            </Text>
            <Text></Text>
          </Flex>
          <Stack h="90vh" align="center" justify="center" spacing={30}>
            <Text ta="center" fw={700} fz={32}>
              Enter Your <br /> Verification Code
            </Text>
            <PinInput
              onComplete={(pin) => {
                verifyRegisteredStudentOtp(pin);
              }}
            />
            <Text ta="center" fw={600} fz={18} px={10}>
              We have sent a verification code to your registered whatsapp
              number .......{phone.slice(phone.length - 3)} You can check your
              inbox.
            </Text>
            <ResendOTP
              onResendClick={() => {
                sendOtpToRegisteredStudent();
              }}
            />
          </Stack>
        </Stack>
      )}
    </>
  );
}
