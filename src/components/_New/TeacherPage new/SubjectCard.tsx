import {
  Card,
  Text,
  Grid,
  Box,
  Image,
  Center,
  useMantineTheme,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import blob1 from "../../../assets/SubjectsIcon/Blob 1.png";
import blob2 from "../../../assets/SubjectsIcon/Blob 2.png";
import blob3 from "../../../assets/SubjectsIcon/Blob 3.png";
import blob4 from "../../../assets/SubjectsIcon/Blob 4.png";
import englishIcon from "../../../assets/SubjectsIcon/English.png";
import mathsIcon from "../../../assets/SubjectsIcon/Maths.png";
import hindiIcon from "../../../assets/SubjectsIcon/Hindi.png";
import historyIcon from "../../../assets/SubjectsIcon/History.png";
import evsIcon from "../../../assets/SubjectsIcon/Evs.png";
import biologyIcon from "../../../assets/SubjectsIcon/Biology.png";
import chemistryIcon from "../../../assets/SubjectsIcon/Chemistry.png";
import civicsIcon from "../../../assets/SubjectsIcon/Civics.png";
import economicsIcon from "../../../assets/SubjectsIcon/Economics.png";
import gkIcon from "../../../assets/SubjectsIcon/General Knowledge.png";
import scienceIcon from "../../../assets/SubjectsIcon/Science.png";
import physicsIcon from "../../../assets/SubjectsIcon/Physics.png";
import geographyIcon from "../../../assets/SubjectsIcon/Geography.png";
import computerIcon from "../../../assets/SubjectsIcon/Computer.png";
import paintingicon from "../../../assets/SubjectsIcon/Painting.png";
import physicalEducationIcon from "../../../assets/SubjectsIcon/Physical Education.png";
import otherIcon from "../../../assets/SubjectsIcon/Other.png";

interface UserSubject {
  name: string;
  chaptersCount: number;
}

interface SubjectCardProps {
  subject: UserSubject;
  onClick: () => void;
}

const getSubjectIcon = (subjectName: string) => {
  if (subjectName.includes("English")) {
    return englishIcon;
  } else if (subjectName.toLowerCase().includes("Mathematics".toLowerCase())) {
    return mathsIcon;
  } else if (subjectName.toLowerCase().includes("Hindi".toLowerCase())) {
    return hindiIcon;
  } else if (subjectName.toLowerCase().includes("History".toLowerCase())) {
    return historyIcon;
  } else if (
    subjectName.toLowerCase().includes("Environmental Studies".toLowerCase())
  ) {
    return evsIcon;
  } else if (
    subjectName.toLowerCase().includes("General Knowledge".toLowerCase())
  ) {
    return gkIcon;
  } else if (subjectName.toLowerCase().includes("Science".toLowerCase())) {
    return scienceIcon;
  } else if (subjectName.toLowerCase().includes("Biology".toLowerCase())) {
    return biologyIcon;
  } else if (subjectName.toLowerCase().includes("Chemistry".toLowerCase())) {
    return chemistryIcon;
  } else if (subjectName.toLowerCase().includes("Civics".toLowerCase())) {
    return civicsIcon;
  } else if (subjectName.toLowerCase().includes("Economics".toLowerCase())) {
    return economicsIcon;
  } else if (subjectName.toLowerCase().includes("Physics".toLowerCase())) {
    return physicsIcon;
  } else if (subjectName.toLowerCase().includes("Geography".toLowerCase())) {
    return geographyIcon;
  } else if (subjectName.toLowerCase().includes("Painting".toLowerCase())) {
    return paintingicon;
  } else if (subjectName.toLowerCase().includes("Computer".toLowerCase())) {
    return computerIcon;
  } else if (
    subjectName.toLowerCase().includes("Physical Educatio.toLowerCase(n")
  ) {
    return physicalEducationIcon;
  } else {
    return otherIcon;
  }
};

const getDisplayName = (subjectName: string) => {
  switch (subjectName) {
    case "Environmental Studies":
      return "EVS";
    case "General Knowledge":
      return "GK";
    default:
      return subjectName;
  }
};
const getRandomBackground = () => {
  const backgrounds = [blob1, blob2, blob3, blob4];
  const randomIndex = Math.floor(Math.random() * backgrounds.length);
  return backgrounds[randomIndex];
};

export function SubjectCard(props: SubjectCardProps) {
  const theme = useMantineTheme();
  const isMd = useMediaQuery(`(max-width: ${theme.breakpoints.md}px)`);
  const subjectIcon = getSubjectIcon(props.subject.name);
  const displayName = getDisplayName(props.subject.name);
  const randomBackground = getRandomBackground();

  return (
    <Box
      onClick={props.onClick}
      p={10}
      style={{
        cursor: "pointer",
        maxWidth: "120px",
      }}
    >
      <Grid gutter="md" columns={100}>
        <Grid.Col span={100}>
          <div style={{ position: "relative" }}>
            <Image
              src={randomBackground}
              fit="cover"
              style={{
                objectFit: "cover",
                width: "100%",
                height: "100%",
              }}
            />
            {subjectIcon && (
              <Image
                src={subjectIcon}
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  zIndex: 1,
                  width: "70%",
                  height: "auto",
                }}
              />
            )}
          </div>
        </Grid.Col>

        <Grid.Col span={100} p={8} pb={2}>
          <Center style={{ width: "100%" }}>
            <Text align="center" fz={18} fw={600}>
              {displayName}
            </Text>
          </Center>
        </Grid.Col>
        <Grid.Col span={100} p={0} mb={15}>
          <Center style={{ width: "100%" }}>
            <Text align="center" c={"#626262"} fz={14} fw={400}>
              {props.subject.chaptersCount} Chapters
            </Text>
          </Center>
        </Grid.Col>
      </Grid>
    </Box>
  );
}
