import {
  Box,
  Center,
  Flex,
  Group,
  Modal,
  ScrollArea,
  SimpleGrid,
  Stack,
  Text,
  Tooltip,
} from "@mantine/core";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mixpanel } from "../../../utilities/Mixpanel/MixpanelHelper";
import ClassCard from "../ClassSection/ClassCard";
import { useMediaQuery } from "@mantine/hooks";
import { AdminPageEvents } from "../../../utilities/Mixpanel/AnalyticEventAdminApp";
import { IconPlus } from "@tabler/icons";
import { AddNewClassModal } from "../../AddNewClassModal/AddNewClassModal";

interface ResultSectionAdminProps {
  classes: InstituteClassTeacher[];
  tabClicked?: boolean;
  setTabClicked?: (val: boolean) => void;
  instituteId: string;
  instituteName: string;
  setSelectedType: (val: string) => void;
  onClassAdd: () => void;
  userType: string;
  setSelectedClassId?: (val: string) => void;
}
export function ResultSectionAdmin(props: ResultSectionAdminProps) {
  const navigate = useNavigate();
  const [isAddClassModal, setIsAddClassModal] = useState<boolean>(false);
  useEffect(() => {
    props.setSelectedType("All");
  }, []);
  const isMd = useMediaQuery(`(max-width: 500px)`);

  return (
    <Stack mb={60} mt={10} mx={5}>
      <Stack>
        {props.classes.length === 0 && (
          <Box w="100%" h="80vh">
            <Center h={"100%"} w={"100%"}>
              <Stack justify="center" align="center">
                <img
                  src={require("../../../assets/empty result page.gif")}
                  height="140px"
                  width="140px"
                  alt="Empty Result Page"
                />
                <Text fw={500} fz={20} color="#C9C9C9">
                  No Class found!
                </Text>
              </Stack>
            </Center>
          </Box>
        )}
        {props.classes.length !== 0 && (
          <>
            <Group>
              <Text c={"#595959"} fz={23} fw={600}>
                Choose Class
              </Text>
              {/* <Tooltip label="Add Class">
            <Box
              style={{
                borderRadius: "50%",
                backgroundColor: "#3174F3",
                cursor: "pointer",
              }}
              onClick={() => {
                setIsAddClassModal(true);
              }}
              h="22px"
              w="25px"
              ml={-10}
            >
              <Center w="100%" h="100%">
                <IconPlus color="white" height="80%" width="80%" />
              </Center>
            </Box>
          </Tooltip> */}
            </Group>
            <SimpleGrid cols={isMd ? 1 : 2}>
              {props.classes.length !== 0 &&
                props.classes.map((x) => {
                  return (
                    <Flex
                      pb={10}
                      my={1}
                      onClick={() => {
                        Mixpanel.track(
                          AdminPageEvents.ADMIN_APP_RESULT_PAGE_CLASS_CLICKED,
                          { class_id: x._id }
                        );
                        if (props.setSelectedClassId) {
                          props.setSelectedClassId(x._id);
                        } else {
                          navigate(
                            `/${props.instituteName}/${props.instituteId}/${props.userType}/result/${x._id}`
                          );
                        }
                      }}
                      px={2}
                      key={x._id}
                    >
                      <ClassCard
                        averageScore={x.averageScore}
                        name={x.name}
                        studentsCount={x.studentsLength}
                        teachersCount={x.totalTeachers}
                        isTeacher={false}
                        onClick={()=>{
                          
                        }}
                      />
                    </Flex>
                  );
                })}
            </SimpleGrid>
          </>
        )}
      </Stack>
      <Modal
        opened={isAddClassModal}
        onClose={() => {
          setIsAddClassModal(false);
        }}
        title="Add Class"
        centered
      >
        <AddNewClassModal
          instituteId={props.instituteId}
          onClose={() => {
            setIsAddClassModal(false);
          }}
          onClassAdd={() => {
            props.onClassAdd();
          }}
          allClasses={props.classes}
        />
      </Modal>
    </Stack>
  );
}
