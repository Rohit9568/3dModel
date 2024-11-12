import { Fragment, useEffect, useState } from "react";
// import { ShowName } from "../NavbarTeacher/NavbarTeacher";
import {
  Button,
  Checkbox,
  Group,
  LoadingOverlay,
  Text,
  useMantineTheme,
} from "@mantine/core";
import { IsUserLoggedIn } from "../../utilities/AuthUtility";
import {
  LocalStorageKey,
  RemoveValueFromLocalStorage,
  SaveValueToLocalStorage,
} from "../../utilities/LocalstorageUtility";
import { TeacherPageEvents } from "../../utilities/Mixpanel/AnalyticeEventTeacherApp";
import { Mixpanel } from "../../utilities/Mixpanel/MixpanelHelper";
import { MultiChipSelect } from "../MultiChipSelect/MultiChipSelect";

import { useMediaQuery } from "@mantine/hooks";
import {
  IconArrowLeft,
  IconArrowNarrowRight,
  IconArrowRight,
} from "@tabler/icons";
import { useLocation, useNavigate } from "react-router-dom";
import { Logo1 } from "../../components/Logo1";
import {
  onboardingSolutions,
  teacherOnboarding,
} from "../../features/UserSubject/TeacherSubjectSlice";
import { GetUser } from "../../utilities/LocalstorageUtility";
import { ShowName } from "../NavbarTeacher/TopBarTeacher";
import { getAllBoards } from "../../features/board/boardSlice";
interface Subject1 {
  uniqueKey: string;
  name: string;
  subjectIds: string[];
  boardId: string;
}
interface TeacherSetupProps {
  isSetup: boolean;
  classes: ClassModelWithSubjects[];
  maxClasses: number;
  logout: () => void;
}
interface ResponseProps {
  userId: string;
  instituteId: string;
  token: string;
  instituteName: string;

  user: {
    createdAt: string;
    email: string;
    instituteClasses: any[];
    instituteId: string;
    instituteSubjects: any[];
    name: string;
    password: string;
    phoneNo: string;
    role: string;
    updatedAt: string;
    userSubjects: any[];
    __v: number;
    _id: string;
  };
}

export function TeacherSetup(props: TeacherSetupProps) {
  const theme = useMantineTheme();
  const [isClassSelection, setisClassSelection] = useState<boolean>(true);
  const [isModalOpened, setIsModalOpened] = useState(false);
  const [classValue, setClassValue] = useState<ClassModelWithSubjects[]>([]);
  const [subjects, setSubjects] = useState<Subject1[]>([]);
  const [subjectValue, setSubjectValue] = useState<Subject1[]>([]);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [onboardingResponse, setOnboardingResponse] = useState<ResponseProps>();
  const [isLoading, setisLoading] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [globalValues, setGlobalValue] = useState(1);
  const [boards, setBoards] = useState<any[]>([]);
  const handleGlobalValueChange = (change: number) => {
    // if (globalValues >= 0 && globalValues < 4) {
    setGlobalValue((prev) => prev + change);
    // }
  };

  const [instituteInfo, setInstituteInfo] = useState<{
    name: string;
    icon: string;
  } | null>(null);
  const location = useLocation();

  useEffect(() => {
    getAllBoards()
      .then((x: any) => {
        setBoards(x);
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);
  const queryParams = new URLSearchParams(location.search);
  const usernameValue = queryParams.get("username");
  const instituteNameValue = queryParams.get("instituteName");
  const roleValue = queryParams.get("typeOfRole");
  const phonenumberValue = queryParams.get("phoneNumber");
  const isMd = useMediaQuery(`(max-width: ${theme.breakpoints.md}px)`);
  const isLg = useMediaQuery(`(max-width: ${theme.breakpoints.lg}px)`);

  const navigate = useNavigate();
  // if (usernameValue && phonenumberValue) {
  //   localStorage.setItem("usernameVal", usernameValue);
  //   localStorage.setItem("userNumber", phonenumberValue);
  //   if (instituteNameValue) {
  //     localStorage.setItem("instiVal", instituteNameValue);
  //   }
  // }

  useEffect(() => {
    const subject1: Subject1[] = [];
    classValue.map((x) => {
      x.subjects.map((y) => {
        const found = subject1.findIndex(
          (k) => k.uniqueKey === x.classType + y.name
        );
        if (found !== -1) {
          subject1[found].subjectIds.push(y._id);
        } else {
          subject1.push({
            uniqueKey: x.classType + y.name,
            name: y.name,
            subjectIds: [y._id],
            boardId: x.boardId,
          });
        }
      });
    });
    setSubjects(subject1);
  }, [classValue]);

  useEffect(() => {
    const subjects1: string[] = [];
    subjectValue.map((x) => {
      subjects1.push(...x.subjectIds);
    });
    setSelectedSubjects(subjects1);
  }, [subjectValue]);

  const loginAndSetValues = (result: ResponseProps) => {
    SaveValueToLocalStorage(
      LocalStorageKey.User,
      JSON.stringify({
        _id: result.user._id,
        email: result.user.email,
        name: result.user.name,
        role: result.user.role,
        instituteId: result.instituteId,
        phone: result.user.phoneNo,
        instituteName: result.instituteName,
      })
    );
    SaveValueToLocalStorage(LocalStorageKey.Token, result.token);
    SaveValueToLocalStorage(LocalStorageKey.UserType, result.user.role);
    // Mixpanel.registerFromLocalStorage();
    Mixpanel.track(TeacherPageEvents.USER_SIGN_IN_SUCCESS, {
      email: result.user.email,
    });
  };

  const createUserWithDetails = async () => {
    if (IsUserLoggedIn() === true) {
      window.location.reload();
      RemoveValueFromLocalStorage(LocalStorageKey.Token);
      RemoveValueFromLocalStorage(LocalStorageKey.User);
    } else if (
      usernameValue &&
      phonenumberValue &&
      instituteNameValue === null
    ) {
      try {
        const response = await onboardingSolutions({
          name: usernameValue,
          phoneNo: phonenumberValue,
        });
        const result = response as ResponseProps;
        setOnboardingResponse(result);
        loginAndSetValues(result);
      } catch (err) {
        console.log(err);
      }
    } else if (instituteNameValue && usernameValue && phonenumberValue) {
      try {
        const response = await onboardingSolutions({
          instituteName: instituteNameValue,
          name: usernameValue,
          phoneNo: phonenumberValue,
        });
        const result = response as ResponseProps;
        setOnboardingResponse(result);
        loginAndSetValues(result);
      } catch (err) {
        console.log(err);
      }
    }
  };
  // useEffect(() => {
  //   createUserWithDetails();
  // }, []);

  const handleOnChange = (val: boolean) => {
    if (isClassSelection) {
      if (val) {
        setClassValue(props.classes);
      } else {
        setClassValue([]);
      }
    } else {
      if (val) setSubjectValue(subjects);
      else setSubjectValue([]);
    }
  };
  const handleOnChangeClassTypes = (val: boolean, classType: string) => {
    if (val) {
      const temp: ClassModelWithSubjects[] = classValue.filter((x) => {
        return x.classType !== classType;
      });
      setClassValue([
        ...temp,
        ...props.classes.filter((x) => {
          return x.classType === classType;
        }),
      ]);
    } else {
      setClassValue(
        classValue.filter((x) => {
          return x.classType !== classType;
        })
      );
    }
  };
  const handleOnChangeSubjectTypes = (val: boolean, boardId: string) => {
    if (val) {
      const temp: Subject1[] = subjectValue.filter((x) => {
        return x.boardId !== boardId;
      });
      setSubjectValue([
        ...temp,
        ...subjects.filter((x) => {
          return x.boardId === boardId;
        }),
      ]);
    } else {
      setSubjectValue(
        subjectValue.filter((x) => {
          return x.boardId !== boardId;
        })
      );
    }
  };

  function classTypeList(boardId: string): ClassModelWithSubjects[] {
    return props.classes.filter((x) => {
      return x.boardId === boardId;
    });
  }
  function subjectTypeList(boardId: string): Subject1[] {
    return subjects.filter((x) => {
      return x.boardId === boardId;
    });
  }

  async function formHandler() {
    const user = GetUser();
    window.scrollTo(0, 0);

    setIsSubmitting(true);
    if (user) {
      setisLoading(true);
      try {
        const response = await teacherOnboarding({
          subjectIds: selectedSubjects,
          userId: user._id,
          instituteId: user.instituteId,
        });
        // setIsModalOpened(true);
        setisLoading(true);
        setIsSubmitting(false);
        window.location.href = "/";
        localStorage.setItem("ModalOpen", "Opened");
      } catch (err) {
        console.log(err);
        setIsSubmitting(false);
      }
    } else {
      navigate("/");
    }

    // await createTeacherSubject({
    //   _ids: selectedSubjects,
    // })
    //   .then((data: any) => {
    //     setisLoading(false);
    //     if (props.isSetup === true) window.location.reload();
    //     else navigate("/");
    //   })
    //   .catch((error) => {
    //     setisLoading(false);
    //     console.log(error);
    //   });
  }

  const user = GetUser();
  // useEffect(() => {
  //   GetAllInfoForInstitute({ id: user.instituteId })
  //     .then((x: any) => {
  //       setInstituteInfo({
  //         name: x.name,
  //         icon: x.schoolIcon,
  //       });
  //     })
  //     .catch((e) => {
  //       console.log(e);
  //     });
  // }, []);

  return (
    <div style={{}}>
      <div>
        <LoadingOverlay visible={isLoading}></LoadingOverlay>
        <div
          style={{
            position: "absolute",
            top: "1%",
            right: "1%",
          }}
        >
          <Group>
            {/* <Checkbox
              radius={50}
              label="Select All"
              styles={{
                input: { backgroundColor: "#F1F1F1" },
                label: { fontSize: "19px" },
              }}
              checked={
                isClassSelection
                  ? classValue.length === props.classes.length
                  : subjectValue.length === subjects.length
              }
              onChange={(event) => {
                handleOnChange(event.target.checked);
              }}
            /> */}
            {instituteInfo?.icon ? (
              <ShowName icon={instituteInfo?.icon} logout={props.logout} />
            ) : (
              <img
                src={require("../../assets/vignamIconImg.png")}
                alt="Vignam Image"
              />
            )}
          </Group>
        </div>
        <div
          style={{
            width: "30vw",
            height: "100%",
            display: isLg ? "none" : "inline-block",
            float: "left",
            position: "fixed",
            zIndex: "10",
          }}
        >
          <img
            src={require(isClassSelection
              ? "../../assets/OnboardingSelectClass.png"
              : "../../assets/OnboardingSelectSubject.png")}
            style={{
              objectFit: "cover",
              height: "100%",
              width: "100%",
            }}
          />
          {isClassSelection && (
            <div
              style={{
                position: "absolute",
                top: "2%",
                padding: "1%",
                left: "5%",
              }}
            >
              <Logo1 isWhite={isClassSelection} />
            </div>
          )}
          {!isClassSelection && (
            <div
              style={{
                position: "absolute",
                top: "1%",
                padding: "1%",
                left: "5%",
              }}
            >
              <Logo1 isWhite={isClassSelection} />
            </div>
          )}
          {!isClassSelection && (
            <div style={{ position: "absolute", top: "20%", left: "3%" }}>
              <img
                src={require("../../assets/OnboardingSelectSubjectGraphic.png")}
                alt="404"
              />
            </div>
          )}
          <div style={{ position: "absolute", bottom: "5%", right: "5%" }}>
            <img
              src={require(isClassSelection
                ? "../../assets/OnboardingSelectClassWhiteStand.png"
                : "../../assets/OnboardingSelectSubjectBLueStand.png")}
            />
          </div>
          {isClassSelection && (
            <p
              style={{
                position: "absolute",
                top: "20%",
                left: "5%",
                right: "30%",

                fontWeight: "700",
                color: "white",
                fontSize: "2rem",
              }}
            >
              <p>Few clicks away from creating your own course</p>
              <p
                style={{
                  fontSize: "0.5em",
                  fontWeight: "500",
                  color: "rgba(255, 255, 255, 0.61)",
                }}
              >
                Make your own course in minutes and <br />
                enter the world of immersive learning.
              </p>
            </p>
          )}
        </div>
        <>
          <div
            style={{
              display: "inline-block",
              float: "left",
              marginLeft: `${isLg ? "" : "25vw"}`,
              width: isLg ? "100%" : "68.3vw",
            }}
          >
            <div
              style={{
                // marginLeft: "30px",
                marginTop: "0px",
                padding: "0px",
              }}
            >
              {isClassSelection && (
                <>
                  {/* <Flex direction="column" align={"left"}>
                    <Text mt={10} mb={10} style={{ fontSize: "2rem" }}>
                      Add Classes to your course
                    </Text>
                    <Checkbox
                      size="md"
                      radius={50}
                      label="Primary School"
                      styles={{
                        input: { backgroundColor: "#F1F1F1" },
                        label: {
                          fontSize: "17px",
                          color: "#7D7D7D",
                          fontWeight: 700,
                        },
                      }}
                      checked={
                        classValue.filter((x) => {
                          return x.classType === "PS";
                        }).length === classTypeList("PS").length
                      }
                      onChange={(event) => {
                        handleOnChangeClassTypes(event.target.checked, "PS");
                      }}
                    />
                    <MultiChipSelect
                      values={classTypeList("PS")}
                      setSelectedValues={(val: any) => setClassValue(val)}
                      selectedValues={classValue}
                      matchValue="_id"
                    />
                    <Checkbox
                      size="md"
                      radius={50}
                      label="Middle School/Secondary School"
                      styles={{
                        input: { backgroundColor: "#F1F1F1" },
                        label: {
                          fontSize: "17px",
                          color: "#7D7D7D",
                          fontWeight: 700,
                        },
                      }}
                      checked={
                        classValue.filter((x) => {
                          return x.classType === "MS";
                        }).length === classTypeList("MS").length
                      }
                      onChange={(event) => {
                        handleOnChangeClassTypes(event.target.checked, "MS");
                      }}
                    />
                    <MultiChipSelect
                      values={classTypeList("MS")}
                      setSelectedValues={(val: any) => {
                        setClassValue(val);
                      }}
                      selectedValues={classValue}
                      matchValue="_id"
                    />
                    <Checkbox
                      size="md"
                      radius={50}
                      label="Senior School"
                      styles={{
                        input: { backgroundColor: "#F1F1F1" },
                        label: {
                          fontSize: "17px",
                          color: "#7D7D7D",
                          fontWeight: 700,
                        },
                      }}
                      checked={
                        classValue.filter((x) => {
                          return x.classType === "SS";
                        }).length === classTypeList("SS").length
                      }
                      onChange={(event) => {
                        handleOnChangeClassTypes(event.target.checked, "SS");
                      }}
                    />
                    <MultiChipSelect
                      values={classTypeList("SS")}
                      setSelectedValues={(val: any) => setClassValue(val)}
                      selectedValues={classValue}
                      matchValue="_id"
                    />
                  </Flex> */}
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "left",
                      textAlign: "left",
                      marginBottom: `${isMd ? "5rem" : "5rem"}`,
                      paddingTop: "60px",
                      paddingRight: "10px",

                      paddingLeft: `${isMd ? "20px" : "8rem"}`,
                    }}
                  >
                    <Text
                      mt={10}
                      mb={10}
                      style={{
                        fontSize: `${isMd ? "28px" : "32px"}`,
                        fontWeight: "700",
                        fontFamily: "Nunito",
                        marginLeft: "10px",
                      }}
                    >
                      Which classes do you want to teach?
                    </Text>
                    {boards.map((board) => {
                      return (
                        <>
                          <span
                            style={{
                              fontSize: "14px",
                              fontFamily: "Nunito",
                              fontWeight: "400",
                              color: "#818181",
                              marginLeft: "14px",
                            }}
                          >
                            {board.name}
                          </span>
                          <MultiChipSelect
                            values={classTypeList(board._id)}
                            setSelectedValues={(val: any) => setClassValue(val)}
                            selectedValues={classValue}
                            matchValue="_id"
                            maxCount={props.maxClasses}
                            setGlobalValue={handleGlobalValueChange}
                            globalValues={globalValues}
                          />
                        </>
                      );
                    })}
                    {/* {props.classes.length !== 0 && (
                      <>
                        <span
                          style={{
                            fontSize: "14px",
                            fontFamily: "Nunito",
                            fontWeight: "400",
                            color: "#818181",
                            marginLeft: "14px",
                          }}
                        >
                          Primary School
                        </span>
                        <MultiChipSelect
                          values={classTypeList("PS")}
                          setSelectedValues={(val: any) => setClassValue(val)}
                          selectedValues={classValue}
                          matchValue="_id"
                          maxCount={props.maxClasses}
                          setGlobalValue={handleGlobalValueChange}
                          globalValues={globalValues}
                        />
                        {/* <Checkbox
                      size="sm"
                      radius={50}
                      label="Middle School/Secondary School"
                      styles={{
                        input: { backgroundColor: "#F1F1F1" },
                        label: {
                          fontSize: "17px",
                          color: "#7D7D7D",
                          fontWeight: 700,
                        },
                      }}
                      checked={
                        classValue.filter((x) => {
                          return x.classType === "MS";
                        }).length === classTypeList("MS").length
                      }
                      onChange={(event) => {
                        handleOnChangeClassTypes(event.target.checked, "MS");
                      }}
                    /> */}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      paddingTop: `${isMd ? "20px" : "15px"}`,
                      paddingBottom: `${isMd ? "20px" : "15px"}`,
                      boxShadow: `${isMd ? " 0px 0px 12px 0px #00000040" : ""}`,
                      justifyContent: "center",
                      backgroundColor: "#F4F6FE",
                      position: "fixed",
                      width: `${isLg ? "100%" : "80%"}`,
                      bottom: "0",
                    }}
                  >
                    <Button
                      sx={{
                        backgroundColor: "#4B65F6",
                        height: "50px",
                        width: `${isMd ? "85%" : "188px"}`,
                        ":hover": {
                          color: "white",
                          backgroundColor: "#3c51c5",
                          border: "1px solid #4b65f6",
                        },
                      }}
                      fz={20}
                      px={40}
                      onClick={() => {
                        setisClassSelection(false);
                        setSubjectValue([]);
                      }}
                      disabled={classValue.length === 0}
                    >
                      Next{" "}
                      <IconArrowNarrowRight style={{ marginLeft: "5px" }} />
                    </Button>
                  </div>
                </>
              )}
              {!isClassSelection && (
                <Fragment>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "left",
                      textAlign: "left",
                      marginBottom: `${isMd ? "6.5rem" : "5rem"}`,
                      paddingTop: "60px",
                      paddingRight: "10px",
                      paddingLeft: `${isMd ? "20px" : "8rem"}`,
                    }}
                  >
                    <Text
                      mt={10}
                      mb={10}
                      style={{
                        fontSize: `${isMd ? "28px" : "32px"}`,

                        fontWeight: "700",
                        fontFamily: "Nunito",
                        marginLeft: "10px",
                      }}
                    >
                      Which subjects do you want to teach?
                    </Text>
                    <span
                      style={{
                        fontSize: "15px",
                        color: "#989898",
                        marginBottom: "10px",
                        marginLeft: "13px",
                      }}
                    >
                      You can select multiple subjects as per your requirement.
                    </span>
                    {boards.map((board) => {
                      return (
                        <>
                          {subjectTypeList(board._id).length !== 0 && (
                            <>
                              <Checkbox
                                size="xs"
                                radius={50}
                                label={board.name}
                                styles={{
                                  input: { backgroundColor: "#fff" },
                                  label: {
                                    fontSize: "13px",
                                    color: "#7D7D7D",
                                    fontWeight: 40,
                                  },
                                }}
                                color="#4b65f6"
                                style={{
                                  marginLeft: "14px",
                                }}
                                checked={
                                  subjectValue.filter((x) => {
                                    return x.boardId === board._id;
                                  }).length ===
                                  subjectTypeList(board._id).length
                                }
                                onChange={(event) => {
                                  handleOnChangeSubjectTypes(
                                    event.target.checked,
                                    board._id
                                  );
                                }}
                              />
                              <MultiChipSelect
                                values={subjectTypeList(board._id)}
                                setSelectedValues={(val: any) =>
                                  setSubjectValue(val)
                                }
                                selectedValues={subjectValue}
                                matchValue="uniqueKey"
                                isIconPresent={true}
                              />
                            </>
                          )}
                        </>
                      );
                    })}
                    {/* {subjects.length === 0 && (
                      <span
                        style={{
                          fontSize: "15px",
                          color: "#989898",
                          marginBottom: "10px",
                        }}
                      >
                        No Subjects Found
                      </span>
                    )}
                    {subjects.length !== 0 && (
                      <>
                        {subjectTypeList("PS").length !== 0 && (
                          <>
                            <Checkbox
                              size="xs"
                              radius={50}
                              label="Primary School"
                              styles={{
                                input: { backgroundColor: "#fff" },
                                label: {
                                  fontSize: "13px",
                                  color: "#7D7D7D",
                                  fontWeight: 40,
                                },
                              }}
                              color="#4b65f6"
                              style={{
                                marginLeft: "14px",
                              }}
                              checked={
                                subjectValue.filter((x) => {
                                  return x.uniqueKey.slice(0, 2) === "PS";
                                }).length === subjectTypeList("PS").length
                              }
                              onChange={(event) => {
                                handleOnChangeSubjectTypes(
                                  event.target.checked,
                                  "PS"
                                );
                              }}
                            />
                            <MultiChipSelect
                              values={subjectTypeList("PS")}
                              setSelectedValues={(val: any) =>
                                setSubjectValue(val)
                              }
                              selectedValues={subjectValue}
                              matchValue="uniqueKey"
                              isIconPresent={true}
                            />
                          </>
                        )}
                        {subjectTypeList("MS").length !== 0 && (
                          <>
                            <Checkbox
                              size="xs"
                              radius={50}
                              label="Middle/Secondary School"
                              styles={{
                                input: { backgroundColor: "#fff" },
                                label: {
                                  fontSize: "13px",
                                  color: "#7D7D7D",
                                  fontWeight: 40,
                                },
                              }}
                              color="#4b65f6"
                              style={{
                                marginLeft: "14px",
                              }}
                              checked={
                                subjectValue.filter((x) => {
                                  return x.uniqueKey.slice(0, 2) === "MS";
                                }).length === subjectTypeList("MS").length
                              }
                              onChange={(event) => {
                                handleOnChangeSubjectTypes(
                                  event.target.checked,
                                  "MS"
                                );
                              }}
                            />
                            <MultiChipSelect
                              values={subjectTypeList("MS")}
                              setSelectedValues={(val: any) =>
                                setSubjectValue(val)
                              }
                              selectedValues={subjectValue}
                              matchValue="uniqueKey"
                              isIconPresent={true}
                            />
                          </>
                        )}
                        {subjectTypeList("SS").length !== 0 && (
                          <>
                            <Checkbox
                              size="xs"
                              radius={50}
                              label="Senior School"
                              styles={{
                                input: { backgroundColor: "#fff" },
                                label: {
                                  fontSize: "13px",
                                  color: "#7D7D7D",
                                  fontWeight: 40,
                                },
                              }}
                              color=""
                              style={{
                                marginLeft: "14px",
                              }}
                              checked={
                                subjectValue.filter((x) => {
                                  return x.uniqueKey.slice(0, 2) === "SS";
                                }).length === subjectTypeList("SS").length
                              }
                              onChange={(event) => {
                                handleOnChangeSubjectTypes(
                                  event.target.checked,
                                  "SS"
                                );
                              }}
                            />
                            <MultiChipSelect
                              values={subjectTypeList("SS")}
                              setSelectedValues={(val: any) =>
                                setSubjectValue(val)
                              }
                              selectedValues={subjectValue}
                              matchValue="uniqueKey"
                              isIconPresent={true}
                              isSenior={true}
                            />
                          </>
                        )}
                        {subjectTypeList("EX").length !== 0 && (
                          <>
                            <Checkbox
                              size="xs"
                              radius={50}
                              label="Senior School"
                              styles={{
                                input: { backgroundColor: "#fff" },
                                label: {
                                  fontSize: "13px",
                                  color: "#7D7D7D",
                                  fontWeight: 40,
                                },
                              }}
                              color=""
                              style={{
                                marginLeft: "14px",
                              }}
                              checked={
                                subjectValue.filter((x) => {
                                  return x.uniqueKey.slice(0, 2) === "EX";
                                }).length === subjectTypeList("EX").length
                              }
                              onChange={(event) => {
                                handleOnChangeSubjectTypes(
                                  event.target.checked,
                                  "EX"
                                );
                              }}
                            />
                            <MultiChipSelect
                              values={subjectTypeList("EX")}
                              setSelectedValues={(val: any) =>
                                setSubjectValue(val)
                              }
                              selectedValues={subjectValue}
                              matchValue="uniqueKey"
                              isIconPresent={true}
                              isSenior={true}
                            />
                          </>
                        )}
                      </>
                    )} */}
                  </div>
                  <div
                    style={{
                      position: "fixed",
                      display: "flex",
                      gap: "15px",
                      bottom: "0",
                      paddingTop: "15px",
                      paddingBottom: "15px",
                      width: `${isLg ? "100%" : "80%"}`,
                      background: "#F4F6FE",
                      boxShadow: `${isMd ? " 0px 0px 12px 0px #00000040" : ""}`,

                      justifyContent: "center",
                    }}
                  >
                    <Button
                      sx={{
                        background: "transparent",
                        border: "1px solid #4B65F6",
                        height: "50px",
                        color: "#4B65F6",
                        ":hover": {
                          color: "white",
                          backgroundColor: "#3c51c5",
                          border: "1px solid #4b65f6",
                        },
                        width: `${!isMd ? "" : "45%"}`,
                      }}
                      fz={20}
                      px={40}
                      onClick={() => setisClassSelection(true)}
                    >
                      <IconArrowLeft
                        fill="#4B65F6"
                        style={{ marginRight: "5px" }}
                      />
                      Back
                    </Button>
                    <Button
                      sx={{
                        backgroundColor: "#4B65F6",
                        height: "50px",
                        width: `${!isMd ? "" : "45%"}`,
                        ":hover": {
                          color: "white",
                          backgroundColor: "#3c51c5",
                          border: "1px solid #4b65f6",
                        },
                      }}
                      fz={20}
                      px={40}
                      onClick={formHandler}
                      disabled={
                        subjectValue.length === 0 || isSubmitting === true
                      }
                    >
                      Submit
                      <IconArrowRight style={{ marginLeft: "5px" }} />
                    </Button>
                  </div>
                </Fragment>
              )}
            </div>
          </div>
        </>
      </div>
      {/* {isModalOpened && (
        <Modal
          opened={isModalOpened}
          onClose={() => setIsModalOpened(false)}
          withCloseButton={false}
          padding={0}
          radius={"md"}
          centered
        >
          <div
            style={{
              width: "100%",
              backgroundColor: "white",
              // marginTop: "-45px",
              borderRadius: "10px",
            }}
          >
            <div
              style={{
                background: "#4B65F6",
                paddingTop: "1rem",
                paddingBottom: "1rem",
                paddingLeft: "20px",
                position: "relative",
                paddingRight: "20px",
                borderTopLeftRadius: "7px",
                borderTopRightRadius: "7px",
              }}
            >
              <span
                style={{
                  fontWeight: "600",
                  color: "white",
                  fontFamily: "Nunito",
                  fontSize: `${isMd ? "16px" : "22px"}`,
                  marginLeft: `${isMd ? "10px" : ""}`,
                }}
              >
                Grow With Vignam
              </span>
              <button
                style={{
                  position: "absolute",
                  top: "15px",
                  right: `${isMd ? "25px" : "10px"}`,
                  border: "none",
                  outline: "none",
                  cursor: "pointer",
                  display: "flex",
                  padding: "3px",
                  transitionDelay: "300ms",
                  borderRadius: "50%",
                  justifyContent: "center",
                  alignItems: "center",
                  background: "transparent",
                }}
                onClick={() => setIsModalOpened(false)}
              >
                <IconX color="white" />
              </button>
            </div>
            <div
              style={{
                height: "280px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
                gap: "20px",
              }}
            >
              Thankyou, {user.name}
              <span>Our Sales Team will contact you shortly.</span>
              <Button
                sx={{
                  backgroundColor: "#4B65F6",
                  width: "180px",
                  height: "50px",
                }}
                onClick={() => {
                  setIsModalOpened(false);
                  window.location.href = "/";
                }}
              >
                Okay!
              </Button>
            </div>
          </div>
        </Modal> */}
      {/* )} */}
    </div>
  );
}
