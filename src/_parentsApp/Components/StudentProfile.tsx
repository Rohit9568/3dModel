import {
  Box,
  Center,
  Divider,
  FileInput,
  Flex,
  LoadingOverlay,
  ScrollArea,
  Stack,
  Text,
  useMantineTheme,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { IconArrowLeft, IconArrowRight } from "@tabler/icons";
import { useEffect, useState } from "react";
import {
  AddStudentProfilePic,
  GetStudentInfoById,
} from "../features/instituteStudentSlice";
import { format } from "date-fns";
import { useFileInput } from "../../hooks/useFileInput";
import { RedeemPrizesSection } from "./RedeemPrizes";
import BookmarkQuestionsSection from "./BookmarkQuestionsSection";

enum ProfileTabs {
  OVERVIEW = "Overview",
  REDEEMPRIZES = "Redeem Prizes",
  BOOKMARK = "Bookmark"
}

function SingleField(props: { title: string; description: string }) {
  return (
    <Stack>
      <Flex py={10} fw={700} fz={15}>
        <Text color="#B3B3B3" w="30%">
          {props.title}
        </Text>
        <Text color="#383838" w="60%">
          {props.description}
        </Text>
      </Flex>
      <Divider color="#D3D3D3" />
    </Stack>
  );
}
export function StudentProfile(props: {
  studentId: string;
  onBack: () => void;
}) {
  const theme = useMantineTheme();
  const isMd = useMediaQuery(`(max-width: ${theme.breakpoints.md}px)`);
  const [activeTab, setActiveTab] = useState<ProfileTabs>(ProfileTabs.OVERVIEW);
  const [studentInfo, setStudentInfo] = useState<InstituteStudentInfo | null>(
    null
  );
  const {
    file,
    fileInputRef,
    isLoading,
    url,
    setFile,
    setFileType,
    error,
    setUrl,
    fileName,
  } = useFileInput(() => {});

  useEffect(() => {
    if (url) {
      AddStudentProfilePic({
        id: props.studentId,
        profilePic: url,
      })
        .then((x) => {
          console.log(x);
          getStudentnfo();
        })
        .catch((e) => {
          console.log(e);
        });
    }
  }, [url]);
  const getStudentnfo = async () => {
    GetStudentInfoById({
      id: props.studentId,
    })
      .then((x: any) => {
        console.log(x);
        setStudentInfo(x);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  useEffect(() => {
    getStudentnfo();
    setFileType("image");
  }, [props.studentId]);

  return (
    <>
      {studentInfo && (
        <Stack p={isMd ? 10 : 70} py={isMd ? 10 : 30}>
          <Flex align="center" gap={15}>
            <IconArrowLeft
              onClick={() => {
                props.onBack();
              }}
              style={{
                cursor: "pointer",
              }}
            />
            <Text fz={24} fw={700}>
              My Profile
            </Text>
          </Flex>
          <ScrollArea type="hover" w={"100%"}>
            <Flex mt={20} gap={isMd ? 10 : 20}>
              {Object.values(ProfileTabs).map((item) => {
                return (
                  <Text
                    onClick={() => setActiveTab(item)}
                    color={activeTab === item ? "#000000" : "#B3B3B3"}
                    fw={700}
                    style={{
                      cursor: "pointer",
                      borderBottom:
                        activeTab === item ? "3px solid #4B65F6" : "none",
                    }}
                    size={isMd ? 12 : 14}
                    align="center"
                    pb={10}
                    px={15}
                  >
                    {item}
                  </Text>
                );
              })}
            </Flex>
          </ScrollArea>
          <Divider mt={-15}></Divider>
          {activeTab === ProfileTabs.OVERVIEW && (
            <Stack w={isMd ? "100%" : "60%"}>
              <Flex
                align="center"
                w="100%"
                justify="space-between"
                direction={isMd ? "column" : "row"}
              >
                <Flex gap={30} w={isMd ? "100%" : "auto"}>
                  {studentInfo.profilePic === "" && (
                    <img
                      src={require("../../assets/blankProfile.png")}
                      style={{
                        width: isMd ? "80px" : "100px",
                      }}
                    />
                  )}
                  {studentInfo.profilePic !== "" && (
                    <img
                      src={studentInfo.profilePic}
                      style={{
                        width: isMd ? "60px" : "100px",
                        height: isMd ? "60px" : "100px",
                        borderRadius: "50%",
                        imageRendering: "pixelated",
                      }}
                    />
                  )}

                  <Stack spacing={0}>
                    <Text color="#303030" fz={isMd ? 18 : 23}>
                      Welcome
                    </Text>
                    <Text fz={isMd ? 30 : 40} fw={700}>
                      {studentInfo.name}
                    </Text>
                  </Stack>
                </Flex>
                <Flex
                  style={{
                    border: "1px solid #E9ECEF",
                    borderRadius: "10px",
                  }}
                  p={15}
                  gap={20}
                  w={isMd ? "100%" : "auto"}
                >
                  <Divider orientation="vertical" color="#FAA300" size="lg" />
                  <Stack spacing={0}>
                    <Flex gap={10} align="center">
                      <img src={require("../../assets/coins.png")} />
                      <Text>Available Points</Text>
                    </Flex>
                    <Flex align="center" justify="space-between">
                      <Text fz={43}>
                        {studentInfo.totalRewardpoints -
                          studentInfo.redeemedRewardpoints}
                      </Text>
                      <Center
                        w={32}
                        h={32}
                        style={{
                          borderRadius: "9px",
                          border: "1px solid #ABABAB",
                          cursor: "pointer",
                        }}
                        onClick={() => {
                          setActiveTab(ProfileTabs.REDEEMPRIZES);
                        }}
                      >
                        <IconArrowRight color="#ABABAB" />
                      </Center>
                    </Flex>
                  </Stack>
                </Flex>
              </Flex>
              <Stack
                style={{
                  border: "1px solid #D3D3D3",
                  borderRadius: "10px",
                }}
                p={30}
                px={35}
              >
                <Text fz={20}>Basic Info</Text>
                <Stack>
                  <Flex py={10} fw={700} fz={15} align="center">
                    <Text color="#B3B3B3" w="30%">
                      Profile Picture
                    </Text>
                    <Flex
                      w="60%"
                      justify="space-between"
                      align="center"
                      onClick={() => {
                        fileInputRef.current?.click();
                      }}
                      style={{
                        cursor: "pointer",
                      }}
                    >
                      <Text color="#383838">Add Profile Picture</Text>
                      <img
                        src={require("../../assets/addprofilepic.png")}
                        style={{
                          marginLeft: "15px",
                        }}
                      />
                    </Flex>
                  </Flex>
                  <Divider color="#D3D3D3" />
                </Stack>
                <SingleField title="Name" description={studentInfo.name} />
                <SingleField
                  title="Birthday"
                  description={
                    studentInfo.dateOfBirth !== ""
                      ? format(
                          new Date(studentInfo.dateOfBirth),
                          "do MMMM yyyy"
                        )
                      : "-"
                  }
                />
              </Stack>
              <Stack
                style={{
                  border: "1px solid #D3D3D3",
                  borderRadius: "10px",
                }}
                p={30}
                px={35}
              >
                <Text fz={20}>Contact Info</Text>
                <SingleField
                  title="Phone Number"
                  description={studentInfo.phoneNumber.join(", ")}
                />
                <SingleField
                  title="Address"
                  description={
                    studentInfo.address !== "" ? studentInfo.address : "-"
                  }
                />
              </Stack>
            </Stack>
          )}
          {activeTab === ProfileTabs.REDEEMPRIZES && (
            <RedeemPrizesSection
              totalPoints={studentInfo.totalRewardpoints}
              redeemedPoints={studentInfo.redeemedRewardpoints}
              studentId={props.studentId}
              onRedeemClick={() => {
                getStudentnfo();
              }}
            />
          )}
          {activeTab === ProfileTabs.BOOKMARK && (
            <BookmarkQuestionsSection 
              studentId={props.studentId}
            />
          )}
        </Stack>
      )}
      <FileInput
        value={file}
        onChange={setFile}
        ref={fileInputRef}
        display="none"
      />
      <LoadingOverlay visible={isLoading} />
    </>
  );
}
