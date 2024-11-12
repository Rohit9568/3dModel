import { useEffect, useState } from "react";
import { WebsiteBuilder } from "../../WebsiteBuilder/WebsiteBuilder";
import { DashBoardHome } from "./DashboardHome";
import {
  Box,
  Button,
  Flex,
  LoadingOverlay,
  Modal,
  Stack,
  TextInput,
} from "@mantine/core";
import {
  GetAllClassesByInstituteId,
  GetDashboardDataForInstitute,
} from "../../../_parentsApp/features/instituteSlice";
import { DashBoardHomework } from "./DashboardHomework";
import { DashboardResult } from "./DashboardResult";
import { SingleNotice } from "../HomeSection/SingleNotice";
import { DeleteNoticeWarningModal } from "../DeleteNoticeWarningModal/DeleteNoticeWarnModal";
import {
  EmailShareButton,
  FacebookShareButton,
  WhatsappShareButton,
} from "react-share";
import { GetUser } from "../../../utilities/LocalstorageUtility";
import { convertToHyphenSeparated } from "../../../utilities/HelperFunctions";
import { Icon } from "../../../pages/_New/Teach";
import {
  IconBrandFacebook,
  IconBrandWhatsapp,
  IconMail,
  IconMessage2,
} from "@tabler/icons";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { Mixpanel } from "../../../utilities/Mixpanel/MixpanelHelper";
import { WebAppEvents } from "../../../utilities/Mixpanel/AnalyticeEventWebApp";
import { isPremiumModalOpened } from "../../../store/premiumModalSlice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../store/ReduxStore";
import { DashBoardStaff } from "./DashBoardStaff/DashBoardStaff";
import { useLocation, useNavigate } from "react-router-dom";
import MergeStudentAndTeachers from "../ClassSection/MergeStudentAndTeachers";
import { UserType } from "./InstituteBatchesSection";
const isPremiumModalOpenedActions = isPremiumModalOpened.actions;

export enum DashBoardSection {
  HOME = "Home",
  BUILDER = "Builder",
  HOMEWORK = "Homework",
  STAFF = "Staff",
  TEACHERS = "Teachers",
  STUDENTS = "Students",
  RESULT = "Result",
  NOTICE = "Notice",
}
function getParentURL() {
  const currentUrl = window.location.href;
  const urlParts = new URL(currentUrl);
  const user = GetUser();
  const base = urlParts.origin;
  const modifiedUrl = `${base}/${convertToHyphenSeparated(
    user.instituteName
  )}/${user.instituteId}/home`;
  return modifiedUrl;
}
const sendMessage = (url: string) => {
  const messageText = encodeURIComponent(url);
  const messageUrl = `sms:?body=${messageText}`; // You can use other URL schemes for different messaging apps
  window.open(messageUrl);
};
export function Dashboard(props: {
  instituteDetails: InstituteWebsiteDisplay;
  reloadInstituteData: () => void;
  mainPath: string;
  userRole: string | undefined;
  featureAccess: AppFeaturesAccess;
  onLogout: () => void;
}) {
  const [selectedSection, setSelectedSection] = useState<DashBoardSection>(
    DashBoardSection.HOME
  );
  const dispatch = useDispatch<AppDispatch>();
  
  const [dashboardCounts, setDashoardCounts] = useState<{
    teachers: number;
    students: number;
    sharedTests: number;
    notesUploaded: number;
    monthRevenue: number;
    lastMonthTrends: number;
  }>({
    students: 0,
    teachers: 0,
    sharedTests: 0,
    notesUploaded: 0,
    monthRevenue: 0,
    lastMonthTrends: 0,
  });

  const [allClasses, setAllClasses] = useState<InstituteClass[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [openAddDairy, setOpenedAddDairy] = useState<boolean>(false);
  const [diaryNotificationClassId, setdiaryNotificationClassId] = useState<
    string | null
  >(null);


  const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);
  const [showDeleteWarning, setdeleteWarning] = useState<string | null>(null);

  const [isShareLink, setIsShareLink] = useState<boolean>(false);
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
  const [isCourseStudentSelected, setIsCourseStudentSelected] =
    useState<boolean>(false);
  const modifiedURL = getParentURL();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const classId = queryParams.get("class");
  const navigate = useNavigate();

  useEffect(() => {
    if (classId) {
      if (classId.includes("CRS") || classId == "NEW") {
        setIsCourseStudentSelected(true);
      } else {
        setIsCourseStudentSelected(false);
      }
      setSelectedClassId(classId);
      setSelectedSection(DashBoardSection.STUDENTS);
    }
  }, [classId]);
  function fetchDashboardData() {
    setIsLoading(true);
    fetchClassesData();
    GetDashboardDataForInstitute({ id: props.instituteDetails._id })
      .then((data: any) => {
        setDashoardCounts((prev) => ({
          ...prev,
          sharedTests: data.totalTestShared,
          notesUploaded: data.totalNotesUploaded,
          lastMonthTrends: data.lastMonthTrends,
          monthRevenue: data.totalForCurrentMonth,
        }));
        setIsLoading(false);
      })
      .catch((e) => {
        console.log(e);
        setIsLoading(false);
      });
  }
  useEffect(() => {
    if (props.instituteDetails._id) {
      fetchDashboardData();
    }
  }, [props.instituteDetails]);

  function fetchClassesData() {
    const allteachers = props.instituteDetails.teachers.length;
    setDashoardCounts((prev) => ({
      ...dashboardCounts,
      teachers: allteachers,
    }));
    GetAllClassesByInstituteId({ id: props.instituteDetails._id })
      .then((x: any) => {
        const uniqueIds = new Set();
        var allstudents = 0;
        x.instituteClasses.map((cls: any) => {
          cls.allstudents += cls.studentsLength;
          cls.students.map((k: any) => {
            uniqueIds.add(k);
          });
        });
        setDashoardCounts((prev) => ({
          ...dashboardCounts,
          students: uniqueIds.size,
          teachers: allteachers,
        }));
        setAllClasses(x.instituteClasses);
      })
      .catch((e) => {
        console.log(e);
      });
  }

  useEffect(() => {
    if (isShareLink === true) {
      Mixpanel.track(WebAppEvents.DASHBOARD_WEBSITE_SHARE_BUTTON_CLICKED);
    }
  }, [isShareLink]);

  return (
    <>
      <LoadingOverlay visible={isLoading} zIndex={1002} pos={"fixed"} />
      {selectedSection === DashBoardSection.HOME && (
        <DashBoardHome
          instituteDetails={props.instituteDetails}
          setSelectedSection={(val) => {
            Mixpanel.track(WebAppEvents.DASHBOARD_FEATURE_ACCESSED, {
              type: val,
            });
            setSelectedSection(val);
          }}
          dashboardCounts={dashboardCounts}
          classes={allClasses}
          setOpenedAddDiary={setOpenedAddDairy}
          setOpenedAddStudent={()=>{}}
          setdiaryNotificationClassId={setdiaryNotificationClassId}
          mainPath={props.mainPath}
          setIsShareLink={setIsShareLink}
          userRole={props.userRole}
          featureAccess={props.featureAccess}
          onLogout={props.onLogout}
        />
      )}
      {selectedSection === DashBoardSection.BUILDER && (
        <WebsiteBuilder
          setSelectedSection={(val) => {
            Mixpanel.track(WebAppEvents.DASHBOARD_FEATURE_ACCESSED, {
              type: val,
            });
            setSelectedSection(val);
          }}
          setIsLoading={setIsLoading}
          instituteDetails={props.instituteDetails}
          reloadInstituteData={props.reloadInstituteData}
          setSelectedNotice={setSelectedNotice}
        />
      )}
      {selectedSection === DashBoardSection.RESULT && (
        <DashboardResult
          classes={allClasses}
          resetData={fetchClassesData}
          instituteId={props.instituteDetails._id}
          instituteName={props.instituteDetails.name}
          setSelectedSection={setSelectedSection}
        />
      )}
      {selectedSection === DashBoardSection.NOTICE && selectedNotice && (
        <Box w={"100%"}>
          <SingleNotice
            instituteId={props.instituteDetails._id}
            instituteName={props.instituteDetails.name}
            notice={selectedNotice}
            onUpdateNotice={(data, id) => {
              if (data === "DELETED") {
                setSelectedSection(DashBoardSection.BUILDER);
                setSelectedNotice(null);
              } else {
                setSelectedNotice(data);
              }
              props.reloadInstituteData();
            }}
            onBackClick={() => {
              setSelectedNotice(null);
              setSelectedSection(DashBoardSection.BUILDER);
            }}
            setdeleteWarning={setdeleteWarning}
          />
        </Box>
      )}
      <Modal
        opened={showDeleteWarning !== null}
        onClose={() => {
          setdeleteWarning(null);
        }}
        centered
        title="Delete Notice?"
        style={{ zIndex: 9999999 }}
        styles={{
          title: {
            color: "#909395",
            fontSize: 18,
            fontWeight: 500,
          },
        }}
      >
        <DeleteNoticeWarningModal
          setdeleteWarning={setdeleteWarning}
          showDeleteWarning={showDeleteWarning}
          ondeleteNotice={() => {
            props.reloadInstituteData();
            setSelectedSection(DashBoardSection.BUILDER);
            setSelectedNotice(null);
            setdeleteWarning(null);
          }}
        />
      </Modal>
      <Modal
        opened={isShareLink}
        onClose={() => {
          setIsShareLink(false);
        }}
        zIndex={999}
        title="Share Website Link"
        centered
      >
        <Stack>
          <Flex>
            <FacebookShareButton url={modifiedURL}>
              <Icon
                name="Facebook"
                icon={<IconBrandFacebook color="white" />}
                onClick={() => {}}
                color="#1776F1"
              />
            </FacebookShareButton>

            <WhatsappShareButton url={modifiedURL}>
              <Icon
                name="Whatsapp"
                icon={<IconBrandWhatsapp color="white" />}
                onClick={() => {}}
                color="#43C553"
              />
            </WhatsappShareButton>

            <EmailShareButton url={modifiedURL}>
              <Icon
                name="Email"
                icon={<IconMail color="white" />}
                onClick={() => {}}
                color="#E0534A"
              />
            </EmailShareButton>
            <Icon
              name="Message"
              icon={<IconMessage2 color="white" />}
              onClick={() => {
                sendMessage(modifiedURL);
              }}
              color="#0859C5"
            />
          </Flex>
          <Flex justify="space-between" align="center">
            <TextInput
              style={{
                // border: "gray solid 1px",
                marginRight: "5px",
                // borderRadius: "10px",
                // padding: "7px",
                height: "40px",
                width: "95%",
              }}
              value={modifiedURL}
            >
              {/* {!isMd && modifiedURL.slice(0, 30).concat("...")}
              {isMd && modifiedURL.slice(0, 20).concat("...")} */}
            </TextInput>
            <CopyToClipboard text={modifiedURL}>
              <Button
                bg="#3174F3"
                style={{
                  borderRadius: "20px",
                }}
              >
                Copy
              </Button>
            </CopyToClipboard>
          </Flex>
        </Stack>
      </Modal>
    </>
  );
}
