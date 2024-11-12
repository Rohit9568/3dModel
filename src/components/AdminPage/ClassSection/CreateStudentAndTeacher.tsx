import  { useEffect, useState } from "react";
import {
  Box,
  Text,
  TextInput,
  Button,
  Flex,
  Loader,
  MultiSelect,
} from "@mantine/core";
import { IconBackArrow } from "../../_Icons/CustonIcons";
import { CreateStudent } from "../../../features/StudentSlice";
import { useParams } from "react-router-dom";
import { GetAllClassesByInstituteId } from "../../../_parentsApp/features/instituteSlice";
import { CreateTeacher } from "../../../features/instituteTeacherSlice";
import { Mixpanel } from "../../../utilities/Mixpanel/MixpanelHelper";
import { TeacherPageEvents } from "../../../utilities/Mixpanel/AnalyticeEventTeacherApp";
import { showNotification } from "@mantine/notifications";
import { AdminPageEvents } from "../../../utilities/Mixpanel/AnalyticEventAdminApp";
interface Subject {
  name: string;
  teacherId: string;
  tests: Array<{ _id: string; mark: number; count: number }>;
  _id: string;
}

interface InstituteClass {
  name: string;
  students: string[];
  subjects: Subject[];
  _id: string;
}

interface Data {
  _id: string;
  instituteClasses: InstituteClass[];
  name: string;
}
interface CreateStudentOrTeacherProps {
  isTeacher: boolean;
  onBack: () => void;
  instituteId: string;
  instituteClassId: string;
  openedFromAdminPage: boolean;
}
interface SubjectMapping {
  uniqueId: string;
  name: string;
  classId: string;
  subjectId: string;
  instituteId: string;
}
interface MultiSelectOption {
  label: string;
  value: string;
}

const CreateStudentAndTeacher = (props: CreateStudentOrTeacherProps) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [multiSelectData, setMultiSelectData] = useState<MultiSelectOption[]>(
    []
  );
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [subjectError, setSubjectError] = useState<string>("");
  const [subjectMappings, setSubjectMappings] = useState<SubjectMapping[]>([]);
  const { id: instituteId } = useParams();
  const [formData, setFormData] = useState({
    name: "",
    phoneNumber: "",
    parentName: "",
  });

  const [formErrors, setFormErrors] = useState({
    name: "",
    phoneNumber: "",
    parentName: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setFormErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handlePhoneNumberChange = (value: string) => {
    if (/^\d*$/.test(value)) {
      handleInputChange("phoneNumber", value);
    }
  };

  const validateForm = () => {
    let isValid = true;
    let errors = {
      name: "",
      phoneNumber: "",
      parentName: "",
    };

    if (!formData.name.trim()) {
      isValid = false;
      errors.name = "Name is required";
    }

    if (!/^\d{10}$/.test(formData.phoneNumber)) {
      isValid = false;
      errors.phoneNumber = "Phone number should be a 10-digit number";
    }

    if (!props.isTeacher && !formData.parentName.trim()) {
      isValid = false;
      errors.parentName = "Parent's Name is required";
    }
    if (props.isTeacher && selectedSubjects.length === 0) {
      isValid = false;
      setSubjectError("At least one subject must be selected for the teacher.");
    } else {
      setSubjectError("");
    }
    setFormErrors(errors);
    return isValid;
  };

  const transformDataForMultiSelect = (data: Data): MultiSelectOption[] => {
    let result: any[] = [];
    let mappings: any[] = [];
    let uniqueTeacherClassCombinations = new Set<string>();

    data.instituteClasses.forEach((classItem, i) => {
      classItem.subjects.forEach((subject, j) => {
        const uniqueId = `${instituteId}-${classItem._id}-${i}-${j}`; // Using instituteId and classId in the unique ID

        const combination = `${subject.teacherId}-${classItem._id}`;
        if (uniqueTeacherClassCombinations.has(combination)) {
          return; // Skip this iteration if the combination is already processed
        }
        uniqueTeacherClassCombinations.add(combination);

        result.push({
          label: `${classItem.name} (${subject.name})`,
          value: uniqueId,
        });
        mappings.push({
          uniqueId: uniqueId,
          name: `${classItem.name} (${subject.name})`,
          classId: classItem._id,
          subjectId: subject._id,
          instituteId: instituteId,
        });
      });
    });

    setSubjectMappings(mappings);
    return result;
  };

  useEffect(() => {
    GetAllClassesByInstituteId({ id: instituteId! })
      .then((response: any) => {
        const transformedData = transformDataForMultiSelect(response);
        setMultiSelectData(transformedData);
      })
      .catch((error) => {
        console.error("Error fetching classes:", error);
      });
  }, [instituteId]);
  useEffect(() => {
    if (selectedSubjects.length > 0) {
      setSubjectError(""); // Clear the error if there are selected subjects
    }
  }, [selectedSubjects]);

  const handleSubmit = () => {
    if (validateForm()) {

      setLoading(true);
      if (!props.isTeacher) {
        if (!props.openedFromAdminPage) {
          Mixpanel.track(
            TeacherPageEvents.TEACHERS_APP_STUDENTS_PAGE_SUBMIT_BUTTON_CLICK
          );
        } else {
          Mixpanel.track(
            AdminPageEvents.ADMIN_APP_STUDENTS_PAGE_SUBMIT_BUTTON_CLICK
          );
        }
        // CreateStudent({
        //   name: formData.name,
        //   phoneNumber: formData.phoneNumber,
        //   instituteId: instituteId!,
        //   instituteClassId: props.instituteClassId!,
        //   parentName: formData.parentName,
        // })
        //   .then((response) => {
        //     showNotification({
        //       message: "New Student Added Successfully ✔",
        //     });
        //     if (!props.openedFromAdminPage) {
        //       Mixpanel.track(
        //         TeacherPageEvents.TEACHERS_APP_STUDENTS_PAGE_STUDENT_ADDED_SUCCESS
        //       );
        //     } else {
        //       Mixpanel.track(
        //         AdminPageEvents.ADMIN_APP_STUDENTS_PAGE_STUDENT_ADDED_SUCCESS
        //       );
        //     }
        //     props.onBack();
        //   })
        //   .catch((error) => {
        //     console.error("Error creating student", error);
        //   })
        //   .finally(() => {});
      } else {
        if (props.openedFromAdminPage) {
          Mixpanel.track(
            AdminPageEvents.ADMIN_APP_TEACHERS_PAGE_SUBMIT_BUTTON_CLICK
          );
        }
        const classIdsSet = new Set<string>();
        const subjectIdsSet = new Set<string>();

        selectedSubjects.forEach((subject) => {
          const mapping = subjectMappings.find((m) => m.uniqueId === subject);
          if (mapping) {
            classIdsSet.add(mapping.classId);
            subjectIdsSet.add(mapping.subjectId);
          }
        });
        const classIds = Array.from(classIdsSet);
        const subjectIds = Array.from(subjectIdsSet);

        CreateTeacher({
          name: formData.name,
          phoneNumber: formData.phoneNumber,
          instituteId: instituteId!,
          classIds: classIds,
          subjectIds: subjectIds,
        })
          .then((response) => {
            showNotification({
              message: "New Teacher Added Successfully ✔",
            });
            if (props.openedFromAdminPage) {
              Mixpanel.track(
                AdminPageEvents.ADMIN_APP_TEACHERS_PAGE_TEACHER_ADDED_SUCCESS
              );
            }
            props.onBack();
          })
          .catch((error) => {
            console.error("Error creating teacher", error);
          })
          .finally(() => {});
      }
    }
  };

  const isFormFilled = formData.name && /^\d{10}$/.test(formData.phoneNumber);

  return (
    <Box mx={10}>
      <Flex direction="column" align="center">
        {loading ? (
          <Flex direction="column" align="center">
            <Loader size="xl" />
            <Text align="center" style={{ marginTop: "20px" }}>
              {props.isTeacher
                ? "Teacher is being added..."
                : "Student is being added..."}
            </Text>
          </Flex>
        ) : (
          <>
            <Flex
              w={"100%"}
              direction="row"
              align="center"
              justify="space-evenly"
            >
              <Box
                onClick={props.onBack}
                style={{
                  backgroundColor: "#F8F8F8",
                  borderRadius: "44px",
                  width: "30px",
                  height: "30px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  cursor: "pointer",
                }}
              >
                <IconBackArrow col="black"></IconBackArrow>
              </Box>
              <Text fz={24} fw={700} size="xl" w={"95%"} ta={"center"}>
                {props.isTeacher ? "Add Teacher" : "Add Student"}
              </Text>
            </Flex>

            <Box mt="md" w={"100%"}>
              <TextInput
                label="Name"
                placeholder="Enter name"
                value={formData.name}
                onChange={(event) =>
                  handleInputChange("name", event.currentTarget.value)
                }
                error={formErrors.name}
              />
            </Box>

            {!props.isTeacher && (
              <Box mt="md" w={"100%"}>
                <TextInput
                  label="Parent's Name"
                  placeholder="Enter parent's name"
                  value={formData.parentName}
                  onChange={(event) =>
                    handleInputChange("parentName", event.currentTarget.value)
                  }
                  error={formErrors.parentName}
                />
              </Box>
            )}

            <Box mt="md" w={"100%"}>
              <TextInput
                label="Phone no"
                placeholder="Enter phone number"
                value={formData.phoneNumber}
                onChange={(event) =>
                  handlePhoneNumberChange(event.currentTarget.value)
                }
                error={formErrors.phoneNumber}
              />
            </Box>
            {props.isTeacher && (
              <Box mt={"md"} w={"100%"}>
                <MultiSelect
                  label="Assign Subjects"
                  placeholder="Select subjects for the teacher"
                  data={multiSelectData}
                  value={selectedSubjects}
                  onChange={setSelectedSubjects}
                  error={subjectError || false}
                />
              </Box>
            )}

            <Flex w={"100%"} justify="flex-end" mt="md">
              <Button
                onClick={handleSubmit}
                disabled={loading}
                style={{
                  backgroundColor: isFormFilled ? "#3174F3" : "transparent",
                  color: isFormFilled ? "#ffffff" : "#A7A7A7",
                  border: "1px solid #A7A7A7",
                }}
              >
                Submit
              </Button>
            </Flex>
          </>
        )}
      </Flex>
    </Box>
  );
};

export default CreateStudentAndTeacher;
