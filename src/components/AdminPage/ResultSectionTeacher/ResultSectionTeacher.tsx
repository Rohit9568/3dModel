import { Box, Flex, ScrollArea, SimpleGrid, Text } from "@mantine/core";
import { useEffect } from "react";
import { GetUser } from "../../../utilities/LocalstorageUtility";
import { useNavigate } from "react-router-dom";
import { Mixpanel } from "../../../utilities/Mixpanel/MixpanelHelper";
import { TeacherPageEvents } from "../../../utilities/Mixpanel/AnalyticeEventTeacherApp";
import ClassCard from "../ClassSection/ClassCard";
import { useMediaQuery } from "@mantine/hooks";

interface ResultSectionTeacherProps {
  classes: InstituteClassTeacher[];
  teacherSubjectIds: string[];
  tabClicked: boolean;
  setTabClicked: (val: boolean) => void;
  instituteName: string;
  setSelectedType: (val: string) => void;
  userType: string;
}
export function ResultSectionTeacher(props: ResultSectionTeacherProps) {
  const navigate = useNavigate();
  const isMd = useMediaQuery(`(max-width: 500px)`);
  useEffect(() => {
    props.setSelectedType("All");
  }, []);
  return (
    <Box mb={60}>
      <Flex gap={"sm"} mx={5}></Flex>
      <Box mx={5} mt={10}>
        <Text c={"#595959"} fz={23} fw={600}>
          Choose Class
        </Text>
        <ScrollArea h={"65vh"} mt={11}>
          <SimpleGrid cols={isMd ? 1 : 2}>
            {props.classes.map((classItem) => (
              <Box
                px={2}
                key={classItem._id}
                mt={9}
                onClick={() => {
                  Mixpanel.track(
                    TeacherPageEvents.TEACHER_APP_RESULT_PAGE_CLASS_CLICKED,
                    { class_id: classItem._id }
                  );
                  const user: any = GetUser();
                  navigate(
                    `/${props.instituteName}/${user.instituteId}/${props.userType}/result/${classItem._id}`
                  );
                }}
              >
                <ClassCard
                  name={classItem.name}
                  studentsCount={classItem.studentsLength}
                  averageScore={classItem.averageScore}
                  teachersCount={classItem.totalTeachers}
                  isTeacher={false}
                  onClick={() => {}}
                ></ClassCard>
              </Box>
            ))}
          </SimpleGrid>
        </ScrollArea>
      </Box>
    </Box>
  );
}
