import { Button, Group, MultiSelect, Select, Stack, Text } from "@mantine/core";
import { useEffect, useState } from "react";
import { createInstituteClass } from "../../features/classes/classSlice";

const classSubjects = {
  "Class 1": [
    "English",
    "Hindi",
    "Maths",
    "General Knowledge",
    "Environmental Studies",
  ],
  "Class 2": [
    "English",
    "Hindi",
    "Maths",
    "General Knowledge",
    "Environmental Studies",
  ],
  "Class 3": [
    "English",
    "Hindi",
    "Maths",
    "General Knowledge",
    "Environmental Studies",
  ],
  "Class 4": [
    "English",
    "Hindi",
    "Maths",
    "General Knowledge",
    "Environmental Studies",
  ],
  "Class 5": [
    "English",
    "Hindi",
    "Maths",
    "General Knowledge",
    "Environmental Studies",
  ],
  "Class 6": ["English", "Hindi", "Maths", "Science", "Social Science"],
  "Class 7": ["English", "Hindi", "Maths", "Science", "Social Science"],
  "Class 8": ["English", "Hindi", "Maths", "Science", "Social Science"],
  "Class 9": ["English", "Hindi", "Maths", "Science", "Social Science"],
  "Class 10": ["English", "Hindi", "Maths", "Science", "Social Science"],
  "Class 11": [
    "English",
    "Hindi",
    "Maths",
    "Physics",
    "Chemistry",
    "Biology",
    "Accountancy",
    "Business Studies",
    "Economics",
    "Informatics Practices",
    "Physical Education",
  ],
  "Class 12": [
    "English",
    "Hindi",
    "Maths",
    "Physics",
    "Chemistry",
    "Biology",
    "Accountancy",
    "Business Studies",
    "Economics",
    "Informatics Practices",
    "Physical Education",
  ],
};
interface AddNewClassModalProps {
  instituteId: string;
  onClose: () => void;
  onClassAdd: () => void;
  allClasses:InstituteClass[] | InstituteClassTeacher[]
}
export function AddNewClassModal(props: AddNewClassModalProps) {
  const [selectedClass, setSelectedClass] = useState<null | string>(null);
  const [selectedSection, setSelectedSection] = useState<null | string>(null);
  const [selectedSubjects, setSelectedsubjects] = useState<string[]>([]);
  const [selectedSubjects1, setSelectedSubjects1] = useState<string[]>([]);
  const [error,setError]=useState<string | null>(null);
  const classes = [
    "Class 1",
    "Class 2",
    "Class 3",
    "Class 4",
    "Class 5",
    "Class 6",
    "Class 7",
    "Class 8",
    "Class 9",
    "Class 10",
    "Class 11",
    "Class 12",
  ];
  const sections = ["A", "B", "C", "D", "E", "F", "G", "H", "I"];
  const isValid =
    selectedClass !== null &&
    selectedSection !== null &&
    selectedSubjects1?.length !== 0;

  const handleClassChange = (value: string | null) => {
    setSelectedClass(value);
    setSelectedSubjects1([]);
    setSelectedsubjects(
      classSubjects[value as keyof typeof classSubjects] || []
    );
  };

  function submitHandler() {
    const found=props.allClasses.find((x)=>x.name===`${selectedClass}${selectedSection}`)
    if(found)
    {
      setError('Class already exists in Institute')
    }
    else{
    props.onClose();
    setError(null)
    if (selectedClass && selectedSection && selectedSubjects1)
      createInstituteClass({
        name: selectedClass + selectedSection,
        instituteId: props.instituteId,
        subjectNames: selectedSubjects1,
      })
        .then((x) => {
          props.onClassAdd();
        })
        .catch((e) => {
          console.log(e);
        });
    }
  }
  return (
    <Stack>
      <Select
        data={classes}
        label="Class"
        value={selectedClass}
        onChange={handleClassChange}
      />
      <Select
        data={sections}
        label="Section"
        value={selectedSection}
        onChange={setSelectedSection}
      />
      <MultiSelect
        label="Subject"
        nothingFound="Nothing found"
        data={selectedSubjects}
        searchable
        value={selectedSubjects1}
        onChange={setSelectedSubjects1}
      />
      {
        error &&
        <Text
            color="red"
        >{error}</Text>
      }
      <Group w="100%" position="apart">
        <Button
          variant="outline"
          w="45%"
          size="lg"
          fz={16}
          fw={500}
          color="#3174F3"
          style={{
            border: "#3174F3 1px solid",
          }}
          onClick={() => {
            props.onClose();
          }}
        >
          Cancel
        </Button>
        <Button
          variant="outline"
          w="45%"
          size="lg"
          fz={16}
          fw={500}
          color="#3174F3"
          style={{
            border: isValid ? "#3174F3 1px solid" : "",
          }}
          onClick={submitHandler}
          disabled={!isValid}
        >
          Next
        </Button>
      </Group>
    </Stack>
  );
}
