import { useState } from "react";
import { convertToHyphenSeparated } from "../../../utilities/HelperFunctions";
import { ResultSectionAdmin } from "../ResultSection/ResultSectionAdmin";
import { DashBoardSection } from "./DashBoard";
import { Box, Center } from "@mantine/core";
import { IconBackArrow } from "../../_Icons/CustonIcons";

export function DashboardResult(props: {
  classes: InstituteClass[];
  resetData: () => void;
  instituteId: string;
  instituteName: string;
  setSelectedSection: (val: DashBoardSection) => void;
}) {
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null);

  const [selectedTestId, setSelectedTestId] = useState<string | null>(null);
  return (
    <>
      <Box pt={20} px={20}>
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
            <ResultSectionAdmin
              classes={props.classes}
              instituteId={props.instituteId}
              instituteName={convertToHyphenSeparated(props.instituteName)}
              setSelectedType={setSelectedType}
              onClassAdd={() => {
                props.resetData();
              }}
              userType="teacheradmin"
              setSelectedClassId={setSelectedClassId}
            />
          </>
        )}
        {selectedClassId && !selectedTestId && (
          <></>
          // <SingleClassResult
          //   openedFromAdminPage={true}
          //   teacherSubjectIds={null}
          //   classId={selectedClassId}
          //   instituteId={props.instituteId}
          //   instituteName={convertToHyphenSeparated(props.instituteName)}
          //   userType="teacheradmin"
          //   selectedType={selectedType}
          //   setSelectedType={setSelectedType}
          //   setSelectedClassId={setSelectedClassId}
          //   setTestId={setSelectedTestId}
          // />
        )}
        {/* { selectedClassId && selectedTestId && selectedType && (
          <SingleTest
            testId={selectedTestId}
            subjectId={selectedType}
            classId={selectedClassId}
            onSubmit={(id) => {
              setSelectedTestId(null);
              setSelectedType(null);
              setSelectedClassId(id);
            }}
          />
        )} */}
      </Box>
    </>
  );
}
