import { Carousel, Embla } from "@mantine/carousel";
import {
  Box,
  Card,
  Center,
  Flex,
  Group,
  Image,
  Stack,
  Popover,
  Button,
  Menu,
  Text,
  Divider,
} from "@mantine/core";
import {
  IconArrowRight,
  IconChevronLeft,
  IconChevronRight,
  IconCurrencyRupee,
  IconPlus,
} from "@tabler/icons";
import { useEffect, useRef, useState } from "react";
import { DashBoardSection } from "./DashBoard";
import { useNavigate } from "react-router";
import { MainPageTabs } from "../../../pages/LandingPage";
import { LoginUsers } from "../../Authentication/Login/Login";
import { IconDotsVertical, IconDownload } from "@tabler/icons";
import { useMediaQuery } from "@mantine/hooks";
import { NameEditor } from "../../MyCourses/AddContentForCourses";
import { format } from "date-fns";
import useFeatureAccess from "../../../hooks/useFeatureAccess";
import { useSelector } from "react-redux";
import { RootState } from "../../../store/ReduxStore";
import { UserType } from "./InstituteBatchesSection";
import { User1 } from "../../../@types/User";
import { showNotification } from "@mantine/notifications";

interface DashboardCardsProps {
  dashboardCounts: {
    teachers: number;
    students: number;
    sharedTests: number;
    notesUploaded: number;
    monthRevenue: number;
    lastMonthTrends: number;
  };
  setSelectedSection: (val: DashBoardSection) => void;
  setOpenedAddStudent: (val: boolean) => void;
  notesUploadedinLastWeek: number;
  testsSharedinLastWeek: number;
  mainPath: string;
  userRole: string | undefined;
  onAuthClick: () => void;
  featureAccess: AppFeaturesAccess;
}
interface DashboardStaffCardProps {
  dashboardCounts: {
    teachers: number;
    students: number;
  };
  setSelectedSection: (val: DashBoardSection) => void;
}

interface instituteDetailsCardsProps {
  noOfBatches: number;
  monthyRevenue: number;
  noOfStudents: number;
  nofOfTeachers: number;
}

interface instituteUserProfileCardsProps {
  users: {
    id: string;
    name: string;
    role: string;
  }[];
  onViewProfile: (userId: string) => void;
  onEditProfile: (userId: string) => void;
  setDeleteProfileId: (profileId: string) => void;
  setDeleteModal: (val: boolean) => void;
}

interface ScheduledBatchesCardsProps {
  batches: {
    id: string;
    name: string;
    days: number[];
    subjects: { id: string; name: string }[];
    teachers: { id: string; name: string }[];
    batchTime: Date;
    teachersLength: number;
  }[];
}

export const studentColors = ["#DF5FFF", "#5F5FFF", "#FF9F5F"];
export const teacherColors = ["#FF9F5F", "#DF5FFF", "#5F5FFF"];

export function formatNumberToK(number: number) {
  if (typeof number !== "number") {
    return "Invalid input";
  }

  if (number < 1000) {
    return number.toString(); // No conversion needed for numbers less than 1000
  }

  const divisor = number >= 1000000 ? 1000000 : 1000;
  const suffix = number >= 1000000 ? "M" : "K";

  const formattedNumber = (number / divisor).toFixed(
    number % divisor !== 0 ? 1 : 0
  );

  return formattedNumber + suffix;
}

function convertNumberIntoIntegerString(number: number) {
  if (number >= 0) return `+${formatNumberToK(number)}`;
  return `${formatNumberToK(number)}`;
}
export function DashboardCards(props: DashboardCardsProps) {
  const navigate = useNavigate();
  return (
    <>
      <SingleCard
        heading="Total Tests Shared"
        displayNumber={props.dashboardCounts.sharedTests.toString()}
        icon={require("../../../assets/dashboardtestshared.png")}
        dashColor="#00900E"
        imageBackgroundColor="#cce9cf"
        notification={`+${props.testsSharedinLastWeek} tests shared in past 7 days`}
        OnCardClick={() => {
          if (props.userRole !== LoginUsers.ADMINISTRATOR) {
            navigate(`${props.mainPath}/${MainPageTabs.TEST.toLowerCase()}`);
          } else {
            props.onAuthClick();
          }
        }}
      />
      {(!props.featureAccess.feeManagementService ||
        !props.featureAccess.feeReceiptAccess ||
        props.userRole !== LoginUsers.OWNER) && (
        <SingleCard
          heading="Total Notes Uploaded"
          displayNumber={props.dashboardCounts.notesUploaded.toString()}
          icon={require("../../../assets/dashboardnotesuploaded.png")}
          dashColor="#B54BF6"
          imageBackgroundColor="#f0dbfd"
          notification={`+${props.notesUploadedinLastWeek} uploads in past 7 days`}
        />
      )}

      {props.featureAccess.feeManagementService &&
        props.featureAccess.feeReceiptAccess &&
        props.userRole === LoginUsers.OWNER && (
          <SingleCard
            heading="Monthly Revenue"
            displayNumber={formatNumberToK(props.dashboardCounts.monthRevenue)}
            icon={require("../../../assets/dashboardnotesuploaded.png")}
            dashColor="#B54BF6"
            imageBackgroundColor="#f0dbfd"
            notification={`${convertNumberIntoIntegerString(
              props.dashboardCounts.lastMonthTrends
            )} from previous month`}
            notificationColor={
              props.dashboardCounts.lastMonthTrends < 0 ? "red" : "#4FDA43"
            }
            numberIcon={<IconCurrencyRupee size={28} />}
          />
        )}
    </>
  );
}

export function DashboardStaffCard(props: DashboardStaffCardProps) {
  return (
    <>
      <TotalStudentsAndTeachersCard
        totalStudents={props.dashboardCounts.students}
        totalTeachers={props.dashboardCounts.teachers}
        onNextButtonClick={() => {
          props.setSelectedSection(DashBoardSection.STAFF);
        }}
      />
    </>
  );
}
export function DashBoardCardsCarousel(props: DashboardCardsProps) {
  const [embla, setEmbla] = useState<Embla | null>(null);
  const isMd = useMediaQuery(`(max-width: 968px)`);
  const TRANSITION_DURATION = 200;
  const navigate = useNavigate();
  return (
    <>
      <Carousel
        getEmblaApi={setEmbla}
        slideSize={"75%"}
        slideGap={10}
        align={"center"}
        w={"100%"}
        py={"4%"}
        loop
        nextControlIcon={
          <Box
            w={"60%"}
            h={"100%"}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              borderRadius: "4px",
              marginRight: "-10px",
            }}
          >
            <IconChevronRight size={60} stroke={1} color="#747474" />
          </Box>
        }
        previousControlIcon={
          <Box
            w={"60%"}
            h={"100%"}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              borderRadius: "4px",
              marginLeft: "-10px",
            }}
          >
            <IconChevronLeft size={60} stroke={1} color="#747474" />
          </Box>
        }
        styles={{
          root: {
            maxWidth: "100%",
            margin: 0,
          },
          controls: {
            top: 0,
            height: "100%",
            padding: "0px",
            margin: "0px",
          },
          control: {
            background: "transparent",
            border: "none",
            boxShadow: "none",
            height: "200px",
            "&[data-inactive]": {
              opacity: 0,
              cursor: "default",
            },
          },
          indicator: {
            width: 8,
            height: 8,
            backgroundColor: "red",
          },
          indicators: {
            top: "110%",
          },
        }}
        m={0}
      >
        <Carousel.Slide>
          <Flex w="90vw">
            <TotalStudentsAndTeachersCard
              totalStudents={props.dashboardCounts.students}
              totalTeachers={props.dashboardCounts.teachers}
              onNextButtonClick={() => {
                props.setSelectedSection(DashBoardSection.STAFF);
              }}
            />
          </Flex>
        </Carousel.Slide>
        <Carousel.Slide>
          <SingleCard
            heading="Total Tests Shared"
            displayNumber={props.dashboardCounts.sharedTests.toString()}
            icon={require("../../../assets/dashboardtestshared.png")}
            dashColor="#00900E"
            imageBackgroundColor="#cce9cf"
            OnCardClick={() => {
              if (props.userRole !== LoginUsers.ADMINISTRATOR) {
                navigate(
                  `${props.mainPath}/${MainPageTabs.TEST.toLowerCase()}`
                );
              } else {
                props.onAuthClick();
              }
            }}
          />
        </Carousel.Slide>
        <Carousel.Slide>
          <SingleCard
            heading="Total Notes Uploaded"
            displayNumber={props.dashboardCounts.notesUploaded.toString()}
            icon={require("../../../assets/dashboardnotesuploaded.png")}
            dashColor="#B54BF6"
            imageBackgroundColor="#f0dbfd"
            notification={`+${props.notesUploadedinLastWeek} uploads in past 7 days`}
          />
        </Carousel.Slide>
        {props.featureAccess.feeManagementService &&
          props.userRole === LoginUsers.OWNER && (
            <Carousel.Slide>
              <SingleCard
                heading="Monthly Revenue"
                displayNumber={formatNumberToK(
                  props.dashboardCounts.monthRevenue
                )}
                icon={require("../../../assets/dashboardnotesuploaded.png")}
                dashColor="#B54BF6"
                imageBackgroundColor="#f0dbfd"
                notification={`${convertNumberIntoIntegerString(
                  props.dashboardCounts.lastMonthTrends
                )} from previous month`}
                numberIcon={<IconCurrencyRupee size={28} />}
              />
            </Carousel.Slide>
          )}
      </Carousel>
    </>
  );
}

export function InstituteUserProfileCarousel(
  props: instituteUserProfileCardsProps
) {
  const [embla, setEmbla] = useState<Embla | null>(null);
  const isMd = useMediaQuery(`(max-width: 968px)`);
  const TRANSITION_DURATION = 200;
  const navigate = useNavigate();
  return (
    <>
      <Carousel
        getEmblaApi={setEmbla}
        slideSize={"75%"}
        slideGap={10}
        align={isMd ? "center" : "start"}
        w={"100%"}
        py={"1%"}
        bg="#FCFCFF"
        loop
        nextControlIcon={
          <Box
            w={"60%"}
            h={"100%"}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              borderRadius: "4px",
              marginRight: "-10px",
            }}
          >
            <IconChevronRight size={60} stroke={1} color="#747474" />
          </Box>
        }
        previousControlIcon={
          <Box
            w={"60%"}
            h={"100%"}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              borderRadius: "4px",
              marginLeft: "-10px",
            }}
          >
            <IconChevronLeft size={60} stroke={1} color="#747474" />
          </Box>
        }
        styles={{
          root: {
            maxWidth: "100%",
            margin: 0,
          },
          controls: {
            top: 0,
            height: "100%",
            padding: "0px",
            margin: "0px",
          },
          control: {
            background: "transparent",
            // border: "none",
            boxShadow: "none",
            // height: "200px",
            "&[data-inactive]": {
              opacity: 0,
              cursor: "default",
            },
            padding: 0,
          },
          indicator: {
            width: 8,
            height: 8,
            backgroundColor: "red",
          },
          indicators: {
            top: "110%",
          },
        }}
        m={0}
      >
        {props.users.map((user) => (
          <Carousel.Slide key={user.name}>
            <SingleUserCard
              id={user.id}
              name={user.name}
              role={user.role}
              onViewProfile={() => props.onViewProfile(user.id)}
              onEditProfile={() => props.onEditProfile(user.id)}
              setDeleteProfileId={props.setDeleteProfileId}
              setDeleteModal={props.setDeleteModal}
            />
          </Carousel.Slide>
        ))}
      </Carousel>
    </>
  );
}

export function TotalStudentsAndTeachersCard(props: {
  totalStudents: number;
  totalTeachers: number;
  onNextButtonClick: () => void;
}) {
  const isMd = useMediaQuery(`(max-width: 500px)`);
  return (
    <Card
      shadow="0px 0px 30px 0px rgba(0, 0, 0, 0.10)"
      radius={15}
      onClick={props.onNextButtonClick}
      style={{ cursor: "pointer" }}
      w={isMd ? "90vw" : "100%"}
      px={isMd ? 15 : 20}
      py={10}
    >
      <Flex
        justify={isMd ? "space-between" : "flex-start"}
        gap={isMd ? 0 : 30}
        pt={5}
      >
        <Flex justify={"space-between"} align="center">
          <Center
            style={{
              backgroundColor: "rgba(75, 101, 246, 0.2)",
              paddingLeft: "10px",
              borderRadius: "4px",
            }}
            w={50}
            h={40}
            mr={10}
          >
            <Image
              width={40}
              src={require("../../../assets/dashboardteacher.png")}
              mr={10}
            ></Image>
          </Center>
          <Stack spacing={0} px={5} style={{ borderLeft: `4px solid #4B65F6` }}>
            <Text c={"#ABABAB"} fz={14} fw={500}>
              Total Staff
            </Text>
            <Flex align="center">
              <Text fz={34} fw={500}>
                {props.totalTeachers}
              </Text>
            </Flex>
          </Stack>
        </Flex>
        <Flex justify={"space-between"} align="center">
          <Center
            style={{
              backgroundColor: "rgba(253, 192, 15, 0.2)",
              paddingLeft: "10px",
              borderRadius: "4px",
            }}
            w={50}
            h={40}
            mr={10}
          >
            <Image
              width={40}
              src={require("../../../assets/dashboardstudent.png")}
              mr={10}
            ></Image>
          </Center>
          <Stack spacing={0} px={5} style={{ borderLeft: `4px solid #FDC00F` }}>
            <Text c={"#ABABAB"} fz={14} fw={500}>
              Total Students
            </Text>
            <Flex align="center">
              <Text fz={34} fw={500}>
                {props.totalStudents}
              </Text>
            </Flex>
          </Stack>
        </Flex>
      </Flex>
      <Flex justify={"flex-end"} align={"center"} p={0}>
        <Box
          w={40}
          h={35}
          style={{
            border: "1px #ABABAB solid",
            borderRadius: 10,
            cursor: "pointer",
          }}
          onClick={props.onNextButtonClick}
        >
          <Center h={"100%"}>
            <IconArrowRight color="#ABABAB" />
          </Center>
        </Box>
      </Flex>
    </Card>
  );
}

export function InstituteDetailsCards(props: instituteDetailsCardsProps) {
  const { isFeatureValid, UserFeature } = useFeatureAccess();

  const currentUser = useSelector<RootState, User1 | null>((state) => {
    return state.currentUser.user;
  });



  return (
    <>
      <SingleInstituteCard
        heading="Batches"
        displayNumber={props.noOfBatches}
        dashColor="#B54BF6"
      />
      {(isFeatureValid(UserFeature.FEEMANAGEMENT) &&
       (currentUser?.role == LoginUsers.ADMIN ||
        currentUser?.role == LoginUsers.TEACHERADMIN || 
        currentUser?.role == LoginUsers.OWNER) && (
          <SingleInstituteCard
            heading="Revenue"
            displayNumber={props.monthyRevenue}
            dashColor="#F64BAE"
            icon={<IconCurrencyRupee />}
          />
        ))}
      <SingleInstituteCard
        heading="Students"
        displayNumber={props.noOfStudents}
        dashColor="#F6714B"
      />
      <SingleInstituteCard
        heading="Staff"
        displayNumber={props.nofOfTeachers}
        dashColor="#6AF64B"
      />
    </>
  );
}

export function InstituteUserCard(props: instituteUserProfileCardsProps) {
  return (
    <>
      {props.users.map((user) => (
        <SingleUserCard
          key={user.name}
          id={user.id}
          name={user.name}
          role={user.role}
          onViewProfile={() => props.onViewProfile(user.id)}
          onEditProfile={() => props.onEditProfile(user.id)}
          setDeleteProfileId={props.setDeleteProfileId}
          setDeleteModal={props.setDeleteModal}
        />
      ))}
    </>
  );
}

export function AddCardWithButton(props: {
  onAddBatchButtonClick: () => void;
}) {
  return (
    <>
      <Card
        radius={10}
        bg={"#FFFFFF"}
        h={"100%"}
        p={20}
        shadow="0px 0px 30px 0px rgba(0, 0, 0, 0.10)"
      >
        <Center mt={30}>
          <Flex direction="column" justify="center" align="center">
            <img
              src={require("../../../assets/virtualevent.png")}
              width="52px"
              alt="profile"
            />
            <Button
              size="sm"
              style={{
                backgroundColor: "#f7f7ff",
                color: "black",
                borderRadius: "20px",
                border: "1px solid #808080",
                marginTop: "10px",
              }}
              onClick={props.onAddBatchButtonClick}
            >
              <Text fz={16} fw={700}>
                Add Batch
              </Text>
            </Button>
          </Flex>
        </Center>
      </Card>
    </>
  );
}

export function SingleCard(props: {
  heading: string;
  icon: string;
  displayNumber: string;
  dashColor: string;
  imageBackgroundColor: string;
  hasNextButton?: boolean;
  hasAddStudentsButton?: boolean;
  OnNextButtonClick?: () => void;
  OnAddStudentButtonClick?: () => void;
  notification?: string;
  OnCardClick?: () => void;
  numberIcon?: any;
  notificationColor?: string;
  fontSize?: number;
  headingColor?: string;
  backgroundColour?: string;
  noShadow?: boolean;
}) {
  return (
    <>
      <Card
        shadow={props.noShadow ? "" : "0px 0px 30px 0px rgba(0, 0, 0, 0.10)"}
        radius={15}
        bg={props.backgroundColour ?? "#FFFFFF"}
        h={"100%"}
        onClick={() => {
          if (props.OnCardClick) props.OnCardClick();
        }}
        style={{ cursor: props.OnCardClick ? "pointer" : "default" }}
      >
        <Flex justify={"space-between"} h={"80%"}>
          <Stack
            spacing={0}
            style={{ borderLeft: `4px solid ${props.dashColor}` }}
            px={8}
            h={"100%"}
          >
            <Text
              c={props.headingColor ?? "#ABABAB"}
              fz={props.fontSize ?? 14}
              fw={500}
            >
              {props.heading}
            </Text>
            <Flex align="center">
              {props.numberIcon}
              <Text fz={34} fw={500}>
                {props.displayNumber}
              </Text>
            </Flex>
          </Stack>
          <Box
            bg={props.imageBackgroundColor}
            w={48}
            h={48}
            style={{ borderRadius: 4 }}
          >
            <Center h={"100%"}>
              <Image width={36} h={36} src={props.icon}></Image>
            </Center>
          </Box>
        </Flex>
        <Flex
          justify={
            props.hasAddStudentsButton
              ? "space-between"
              : props.notification
              ? "flex-start"
              : "flex-end"
          }
          align={"center"}
          p={0}
        >
          {props.hasAddStudentsButton && (
            <Group
              position="left"
              spacing={5}
              onClick={() => {
                if (props.OnAddStudentButtonClick)
                  props.OnAddStudentButtonClick();
              }}
              style={{ cursor: "pointer" }}
            >
              <Box bg={"#4FDA43"} style={{ borderRadius: "50%" }}>
                <Center h={"100%"}>
                  <IconPlus width={"75%"} color="white" stroke={3} />
                </Center>
              </Box>
              <Text fz={12} fw={400} c={"#4B65F6"}>
                Add Students
              </Text>
            </Group>
          )}
          {props.hasNextButton && (
            <Box
              w={32}
              h={32}
              style={{
                border: "1px #ABABAB solid",
                borderRadius: 10,
                cursor: "pointer",
              }}
              onClick={props.OnNextButtonClick}
            >
              <Center h={"100%"}>
                <IconArrowRight color="#ABABAB" />
              </Center>
            </Box>
          )}
          {props.notification && (
            <Text
              fz={12}
              fw={500}
              c={props.notificationColor ? props.notificationColor : "#4FDA43"}
            >
              {props.notification}
            </Text>
          )}
        </Flex>
      </Card>
    </>
  );
}

function SingleInstituteCard(props: {
  heading: string;
  displayNumber: number;
  dashColor: string;
  icon?: any;
}) {
  const isMd = useMediaQuery(`(max-width: 968px)`);
  return (
    <>
      <Card
        bg={"#FFFFFF"}
        radius={10}
        shadow="0px 0px 30px 0px rgba(0, 0, 0, 0.10)"
        h={90}
      >
        <Stack
          spacing={0}
          style={{ borderLeft: `4px solid ${props.dashColor}` }}
          px={8}
          h={"100%"}
        >
          <Text c={"#ABABAB"} fz={14} fw={500} w="100%">
            {props.heading}
          </Text>
          <Flex align="center">
            <Text fz={isMd ? 20 : 34} fw={500}>
              {props.icon ? props.icon : ""}
              {props.displayNumber}
            </Text>
          </Flex>
        </Stack>
      </Card>
    </>
  );
}

function SingleUserCard(props: {
  id: string;
  name: string;
  role: string;
  onViewProfile: () => void;
  onEditProfile: () => void;
  setDeleteProfileId: (profileId: string) => void;
  setDeleteModal: (val: boolean) => void;
}) {
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const { isFeatureValid, UserFeature, isFeatureValidwithNotification } =
    useFeatureAccess();
  const popupRef = useRef<HTMLDivElement>(null);
  const currentUser = useSelector<RootState, User1 | null>((state) => {
    return state.currentUser.user;
  });

  const handleIconClick = () => {
    setIsPopupVisible(!isPopupVisible);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
      setIsPopupVisible(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const closePopup = () => {
    setIsPopupVisible(false);
  };
  const isMd = useMediaQuery(`(max-width: 968px)`);
  return (
    <>
      <Box
        // radius={8}
        p={10}
        style={{
          border: "1px solid #DBDBDE",
          position: "relative",
          backgroundColor: "#FCFCFF",
          borderRadius: "7px",
        }}
        mt={20}
        mr={20}
        miw={"210px"}
        maw={isMd ? "240px" : "none"}
      >
        <Flex justify="space-between" align="center">
          <Flex align="center">
            <img
              src={require("../../../assets/userpicture.png")}
              width="58px"
              alt="User Image"
            />
            <Box ml={10}>
              <Text
                fz={16}
                fw={600}
                style={{
                  whiteSpace: "nowrap",
                  maxWidth: "120px",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {props.name}
              </Text>
              <Text
                c={props.role === "Admin" ? "#F6754B" : "blue"}
                fz={14}
                fw={700}
              >
                {props.role}
              </Text>
            </Box>
          </Flex>
          <Menu width={200} withinPortal={true}>
            <Menu.Target>
              <Box style={{ cursor: "pointer" }} onClick={() => {}}>
                <IconDotsVertical />
              </Box>
            </Menu.Target>
            <Menu.Dropdown px={0}>
              <Menu.Item
                onClick={() => {
                  if (
                    isFeatureValidwithNotification(UserFeature.ADDREMOVESTAFF)
                  ) {
                    if (
                      currentUser &&
                      currentUser.role === LoginUsers.TEACHER &&
                      props.role === LoginUsers.OWNER
                    ) {
                      showNotification({
                        message:
                          "You are not allowed to edit the owner profile",
                      });
                    } else {
                      props.onViewProfile();
                    }
                  }
                }}
              >
                <Flex align="center">
                  <Flex align="center">
                    <Box mr={2}>
                      <img
                        src={require("../../../assets/viewprofile.png")}
                        width="20px"
                        alt="profile"
                      />
                    </Box>
                  </Flex>
                  <Text fz={15} fw={600} ml={10}>
                    View Profile
                  </Text>
                </Flex>
              </Menu.Item>
              {
                <Menu.Item
                  onClick={() => {
                    if (
                      isFeatureValidwithNotification(UserFeature.ADDREMOVESTAFF)
                    ) {
                      if (
                        currentUser &&
                        currentUser.role === LoginUsers.TEACHER &&
                        props.role === LoginUsers.OWNER
                      ) {
                        showNotification({
                          message:
                            "You are not allowed to edit the owner profile",
                        });
                      } else {
                        props.onEditProfile();
                      }
                    }
                  }}
                >
                  <Flex align="center">
                    <Flex align="center">
                      <Box mr={2}>
                        <img
                          src={require("../../../assets/editprofile.png")}
                          width="20px"
                          alt="profile"
                        />
                      </Box>
                    </Flex>
                    <Text fz={15} fw={600} ml={15}>
                      Edit Profile
                    </Text>
                  </Flex>
                </Menu.Item>
              }
              <Menu.Item
                onClick={() => {
                  if (
                    isFeatureValidwithNotification(UserFeature.ADDREMOVESTAFF)
                  ) {
                    if (
                      currentUser &&
                      currentUser.role === LoginUsers.TEACHER &&
                      props.role === LoginUsers.OWNER
                    ) {
                      showNotification({
                        message:
                          "You are not allowed to delete the owner profile",
                      });
                    } else {
                      props.setDeleteProfileId(props.id);
                      props.setDeleteModal(true);
                    }
                  }
                }}
              >
                <Flex align="center">
                  <Flex align="center">
                    <Box mr={2}>
                      <img
                        src={require("../../../assets/deleteprofile.png")}
                        width="20px"
                        alt="profile"
                      />
                    </Box>
                  </Flex>
                  <Text fz={15} fw={600} ml={10}>
                    Delete Profile
                  </Text>
                </Flex>
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Flex>
      </Box>
    </>
  );
}

export default SingleUserCard;

export function SingleBatchCard(props: {
  id: string;
  name: string;
  noOfStudents: number;
  firstThreeStudents: string[];
  userType: UserType;
  onbatchCardClick: () => void;
  onEditBatchName: (val: string) => void;
  onEditCourseFees: () => void;
  subjects: string[];
  noOfTeachers: number;
  firstThreeTeachers: string[];
  hasNextButton: boolean;
  onEditBatchButtonClick: () => void;
  setDeleteBatchId: (batchId: string) => void;
  setDeleteModal: (val: boolean) => void;
}) {
  const [nameValue, setNameValue] = useState<string>(props.name);
  const [isnameEdit, setIsnameEdit] = useState<boolean>(false);
  const instituteDetails = useSelector<RootState, InstituteDetails | null>(
    (state) => {
      return state.instituteDetailsSlice.instituteDetails;
    }
  );
  const { isFeatureValid, UserFeature } = useFeatureAccess();
  return (
    <>
      <Card
        shadow="0px 0px 30px 0px rgba(0, 0, 0, 0.10)"
        bg={"#FFFFFF"}
        h={"100%"}
        p={20}
        onClick={() => {
          props.onbatchCardClick();
        }}
        style={{
          borderRadius: "10px",
          cursor: "pointer",
        }}
      >
        <Flex justify="space-between" align="center" ml={5} mr={5}>
          {!isnameEdit && (
            <Text
              fz={22}
              weight={500}
              style={{
                whiteSpace: "nowrap",
                maxWidth: "70%",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {props.name}
            </Text>
          )}
          {isnameEdit && (
            <NameEditor
              fileName={nameValue}
              setOnRenameClicked={setIsnameEdit}
              onRenameClick={(val: string) => {
                if (props.onEditBatchName) props.onEditBatchName(val);
              }}
            />
          )}
          {props.userType == UserType.OTHERS &&
            props.id.startsWith("ICLS") &&
            isFeatureValid(UserFeature.ADDREMOVEBATCHES) && (
              <Menu withinPortal={true}>
                <Menu.Target>
                  <Flex
                    style={{ cursor: "pointer" }}
                    justify="center"
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                  >
                    <IconDotsVertical />
                  </Flex>
                </Menu.Target>
                <Menu.Dropdown
                  mr={50}
                  style={{
                    position: "absolute",
                    top: "100%",
                    marginTop: -20,
                    marginLeft: -50,
                  }}
                >
                  <Menu.Item
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsnameEdit(true);
                    }}
                  >
                    <Flex align="center">
                      <Flex align="center">
                        <Box mr={2}>
                          <img
                            src={require("../../../assets/rename.png")}
                            width="16px"
                            alt="profile"
                          />
                        </Box>
                      </Flex>
                      <Text fz={16} fw={500} ml={10}>
                        Rename
                      </Text>
                    </Flex>
                  </Menu.Item>
                  {isFeatureValid(UserFeature.FEEMANAGEMENT) &&
                    instituteDetails?.featureAccess.feeManagementService && (
                      <Menu.Item
                        onClick={(e) => {
                          e.stopPropagation();
                          props.onEditCourseFees();
                        }}
                      >
                        <Flex align="center">
                          <Flex align="center">
                            <Box mr={2}>
                              <img
                                src={require("../../../assets/editprofile.png")}
                                width="16px"
                                alt="profile"
                              />
                            </Box>
                          </Flex>
                          <Text fz={16} fw={500} ml={10}>
                            Edit Course Fees
                          </Text>
                        </Flex>
                      </Menu.Item>
                    )}
                  <Menu.Item
                    onClick={(e) => {
                      e.stopPropagation();
                      props.onEditBatchButtonClick();
                    }}
                  >
                    <Flex align="center">
                      <Flex align="center">
                        <Box mr={2}>
                          <img
                            src={require("../../../assets/editprofile.png")}
                            width="16px"
                            alt="profile"
                          />
                        </Box>
                      </Flex>
                      <Text fz={16} fw={500} ml={10}>
                        Edit Batch
                      </Text>
                    </Flex>
                  </Menu.Item>
                  <Menu.Item
                    onClick={(e) => {
                      e.stopPropagation();
                      props.setDeleteBatchId(props.id);
                      props.setDeleteModal(true);
                    }}
                  >
                    <Flex align="center">
                      <Flex align="center">
                        <Box mr={2}>
                          <img
                            src={require("../../../assets/deleteprofile.png")}
                            width="16px"
                            alt="profile"
                          />
                        </Box>
                      </Flex>
                      <Text fz={16} fw={500} ml={10}>
                        Delete Batch
                      </Text>
                    </Flex>
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            )}
        </Flex>
        <Flex direction="column" ml={5}>
          <Flex>
            <Text mr={4} fz={12} fw={500} color="#8F8F8F">
              {props.subjects.length > 6
                ? `${props.subjects.slice(0, 6).join(", ")}...`
                : props.subjects.join(", ")}
            </Text>
          </Flex>
          <Flex mt={10}>
            <Flex>
              {props.firstThreeStudents.length > 0 ? (
                props.firstThreeStudents.map((student, index) => (
                  <div
                    key={index}
                    style={{
                      backgroundColor: studentColors[index],
                      borderRadius: "50%",
                      width: "30px",
                      height: "30px",
                      color: "white",
                    }}
                  >
                    <Flex
                      align="center"
                      justify="center"
                      style={{ height: "100%" }}
                    >
                      <Text fz={14} fw={500}>
                        {" "}
                        {student[0]}{" "}
                      </Text>
                    </Flex>
                  </div>
                ))
              ) : props.id.startsWith("ICLS") ? (
                <Text fz={14} fw={700} mt={3}>
                  Add Students
                </Text>
              ) : (
                <></>
              )}
            </Flex>

            {props.firstThreeStudents.length > 0 ? (
              <Text fz={14} fw={600} ml={6} mt={4}>
                {props.noOfStudents - 3 > 0
                  ? `+${props.noOfStudents - 3}`
                  : props.noOfStudents}{" "}
                students{" "}
              </Text>
            ) : (
              ""
            )}
          </Flex>
          <Flex mt={5}>
            <Flex>
              {props.firstThreeTeachers.map((teacher, index) => (
                <div
                  key={index}
                  style={{
                    backgroundColor: teacherColors[index],
                    borderRadius: "50%",
                    width: "30px",
                    height: "30px",
                    color: "white",
                  }}
                >
                  <Flex
                    align="center"
                    justify="center"
                    style={{ height: "100%" }}
                  >
                    <Text fz={14} fw={500}>
                      {teacher[0]}
                    </Text>
                  </Flex>
                </div>
              ))}
            </Flex>
            {props.firstThreeTeachers.length > 0 ? (
              <Text fz={14} fw={600} ml={6} mt={4}>
                {props.noOfTeachers - 3 > 0
                  ? `+${props.noOfTeachers - 3}`
                  : props.noOfTeachers}{" "}
                teachers{" "}
              </Text>
            ) : (
              ""
            )}
          </Flex>
        </Flex>
      </Card>
    </>
  );
}

function ScheduledBatches(props: {
  id: string;
  name: string;
  batchTime: Date;
  subjects: string[];
  teachers: string[];
  teachersLength: number;
}) {
  const teacherColors = ["#FF9F5F", "#DF5FFF", "#5F5FFF"];
  return (
    <>
      <Stack>
        <Divider
          my="sm"
          label={format(props.batchTime, "hh:mm")}
          labelPosition="left"
        />
        <Card radius={8} bg={"#F2F2F2"} h={"100%"} p={20}>
          <Flex justify="space-between" align="center" ml={5} mr={5}>
            <Text fz={22} fw={500} style={{ whiteSpace: "nowrap" }}>
              {props.name}
            </Text>
          </Flex>
          <Flex direction="column" ml={5}>
            <Flex mt={10}>
              <Flex>
                {props.teachers.map((teacher, index) => (
                  <div
                    key={index}
                    style={{
                      backgroundColor: teacherColors[index],
                      borderRadius: "50%",
                      width: "30px",
                      height: "30px",
                      color: "white",
                    }}
                  >
                    <Flex
                      align="center"
                      justify="center"
                      style={{ height: "100%" }}
                    >
                      <Text fz={14} fw={500}>
                        {" "}
                        {teacher[0]}{" "}
                      </Text>
                    </Flex>
                  </div>
                ))}
              </Flex>
              {props.teachersLength > 0 ? (
                <Text fz={14} fw={600} ml={6} mt={4}>
                  {" "}
                  {props.teachersLength} Teachers{" "}
                </Text>
              ) : (
                ""
              )}
            </Flex>
          </Flex>
        </Card>
      </Stack>
    </>
  );
}
export function ScheduledBatchesCards(props: ScheduledBatchesCardsProps) {
  useEffect(() => {
    console.log(props.batches);
  }, []);

  return (
    <>
      {props.batches.map((batch) => (
        <ScheduledBatches
          key={batch.id}
          id={batch.id}
          name={batch.name}
          batchTime={batch.batchTime}
          subjects={batch.subjects.map((subject) => subject.name)}
          teachers={batch.teachers.map((teacher) => teacher.name)}
          teachersLength={batch.teachersLength}
        />
      ))}
    </>
  );
}
