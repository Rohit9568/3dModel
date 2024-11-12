import { Box, Center } from "@mantine/core";
import ListClasses from "../ClassSection/ListClasses";
import { IconBackArrow } from "../../_Icons/CustonIcons";
import { DashBoardSection } from "./DashBoard";

export function DashBoardStudents(props: {
  classes: InstituteClass[];
  resetData: () => void;
  instituteId: string;
  setSelectedSection: (val: DashBoardSection) => void;
  openAddStudent: boolean;
  featureAccess: AppFeaturesAccess;
  setOpenedAddStudent: (val: boolean) => void;
  setIsCourseStudentSelected: (val: boolean) => void;
  setSelectedClassId: (val: string) => void;
}) {
  return (
    <>
      <Box>
        <>
          <Box
            onClick={() => {
              props.setSelectedSection(DashBoardSection.STAFF);
            }}
            mr={10}
            mt={50}
            ml={10}
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

          <ListClasses
            instituteId={props.instituteId}
            openedFromAdminPage={true}
            classes={props.classes}
            onClassClick={(classId: string) => {
              if (classId.includes("CRS") || classId === "NEW") {
                props.setIsCourseStudentSelected(true);
              } else {
                props.setIsCourseStudentSelected(false);
              }
              props.setSelectedClassId(classId);
            }}
            onClassAdd={() => {}}
            resetData={props.resetData}
            isFeeService={props.featureAccess.feeManagementService}
            isFeeReceiptFeature={props.featureAccess.feeReceiptAccess}
          />
        </>
      </Box>
    </>
  );
}
