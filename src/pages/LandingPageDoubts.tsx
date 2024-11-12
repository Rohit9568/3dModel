import { Box } from "@mantine/core";
import { DoubtsSection } from "../components/AdminPage/DoubtsSection/DoubtsSection";
import { convertToHyphenSeparated } from "../utilities/HelperFunctions";

export function LandingPageDoubts(props: {
  doubts: Doubt[];
  instituteName: string;
  reloadInstituteData: () => void;
}) {
  return (
    <>
      <Box px={50} mt={20}>
        <DoubtsSection
          openedFromAdminPage={false}
          doubts={props.doubts}
          onUpdateDoubt={(data) => {
            props.reloadInstituteData();
          }}
          instituteName={convertToHyphenSeparated(props.instituteName)}
        />
      </Box>
    </>
  );
}
