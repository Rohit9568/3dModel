import { Box, Center } from "@mantine/core";
import { convertToHyphenSeparated } from "../../../utilities/HelperFunctions";
import { HomeworkSection } from "../../TeacherAdminPage/HomeworkSection/HomeworkSection";
import { useEffect, useState } from "react";
import { HomeworkTeacher } from "../HomeSection/HomeworkTeacher";
import { IconBackArrow } from "../../_Icons/CustonIcons";
import { DashBoardSection } from "./DashBoard";

export function DashBoardHomework(props: {
  classes: InstituteClass[];
  instituteId: string;
  resetData: () => void;
  instituteName: string;
  setSelectedSection: (val: DashBoardSection) => void;
  openedAddDairy: boolean;
  setOpenedAddDairy: (val: boolean) => void;
  reloadInstituteData: () => void;
  diaryNotificationClassId: string | null;
  setdiaryNotificationClassId: (val: string | null) => void;
}) {
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
  useEffect(() => {
    if (props.openedAddDairy && props.classes) {
      if (props.diaryNotificationClassId) {
        setSelectedClassId(props.diaryNotificationClassId);
      } else setSelectedClassId(props.classes[0]._id);
    }
  }, [props.openedAddDairy]);
  return (
    <>
      <Box px={30} pt={30}>
        {!selectedClassId && (
          <>
            <Box
              onClick={() => {
                props.setSelectedSection(DashBoardSection.HOME);
              }}
              mr={10}
              style={{
                backgroundColor: "#F8F8F8",
                borderRadius: "50%",
                width: "40px",
                height: "40px",
                cursor: "pointer",
              }}
            >
              <Center w="100%" h="100%">
                <Box w="60%" h="50%">
                  <IconBackArrow col="black" />
                </Box>
              </Center>
            </Box>
            <HomeworkSection
              classes={props.classes}
              instituteName={convertToHyphenSeparated(props.instituteId)}
              instituteId={props.instituteName}
              onAddDiaryClick={(data) => {
                setSelectedClassId(data);
              }}
              userType="teacheradmin"
            />
          </>
        )}
        {
        selectedClassId && (
          <>
            {/* <HomeworkTeacher
              batchId={selectedClassId}
              classes={props.classes}
              onLastDateChange={(val) => {
                props.resetData();
                props.reloadInstituteData();
              }}
              onBackClick={() => {
                props.setOpenedAddDairy(false);
                setSelectedClassId(null);
                props.setdiaryNotificationClassId(null);
              }}
              reloadInstituteData={props.reloadInstituteData}
            /> */}
          </>
        )}
      </Box>
    </>
  );
}
