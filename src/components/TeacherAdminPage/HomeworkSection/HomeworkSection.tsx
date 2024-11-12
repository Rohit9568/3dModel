import {
  Box,
  Button,
  Center,
  Flex,
  ScrollArea,
  SimpleGrid,
  Stack,
  Text,
} from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { GetUser } from "../../../utilities/LocalstorageUtility";
import { IconPlus } from "@tabler/icons";
import { useMediaQuery } from "@mantine/hooks";
import { Mixpanel } from "../../../utilities/Mixpanel/MixpanelHelper";
import { TeacherPageEvents } from "../../../utilities/Mixpanel/AnalyticeEventTeacherApp";
import { formatDate } from "../../../utilities/HelperFunctions";

interface SingleClassHomeworkProps {
  class: InstituteClass;
  instituteId: string;
  instituteName: string;
  userType: string;

  onAddDiaryClick: (data: string) => void;
}

function SingleClassHomework(props: SingleClassHomeworkProps) {
  const navigate = useNavigate();
  const currentDate = new Date(props.class.lastUpdateDiaryTimeinMillis);
  return (
    <Flex
      justify="space-between"
      align="center"
      style={{
        boxShadow: "0px 0px 4px 0px rgba(0, 0, 0, 0.25)",
        borderRadius: "10px",
      }}
      py={10}
      px={5}
      pr={10}
    >
      <Stack spacing={1} justify="center" ml={14}>
        <Text fz={12} color="#595959" fw={600}>
          {props.class.name}
        </Text>
        <Text fz={12} color="#595959" fw={600}>
          Last Updated:{formatDate(currentDate)}
        </Text>
      </Stack>
      <Button
        variant="outline"
        color="#3174F3"
        style={{
          borderColor: "#3174F3",
          borderRadius: "10px",
        }}
        size="lg"
        fz={13}
        onClick={() => {
          Mixpanel.track(
            TeacherPageEvents.TEACHER_APP_HOMEWORK_PAGE_VIEW_CLICKED
          );
          // navigate(
          //   `/${props.instituteName}/${props.instituteId}/${props.userType}/class/${props.class._id}?date=${props.class.lastUpdateDiaryTimeinMillis}`
          // );
          props.onAddDiaryClick(props.class._id);
        }}
      >
        View
      </Button>
    </Flex>
  );
}

interface HomeworkSectionProps {
  classes: InstituteClass[];
  instituteName: string;
  instituteId: string;
  onAddDiaryClick: (data: string) => void;
  userType: string;
}

export function HomeworkSection(props: HomeworkSectionProps) {
  const isMd = useMediaQuery(`(max-width: 820px)`);
  const filteredClasses = props.classes.filter((x) => {
    return (
      x.lastUpdateDiaryTimeinMillis !== undefined &&
      x.lastUpdateDiaryTimeinMillis !== null
    );
  });
  return (
    <Stack w="100%" h="100%">
      {filteredClasses.length === 0 && (
        <Center w="100%" h="100%">
          <Stack justify="center" align="center">
            <Box
              style={{
                borderRadius: "50%",
                backgroundColor: "#EEF4FF",
              }}
              h={148}
              w={148}
            >
              <Center h="100%" w="100%">
                <img
                  src={require("../../../assets/homework.png")}
                  height={89}
                  width={89}
                  alt="HomeworkEmpty"
                />
              </Center>
            </Box>
            <Text color="#A4A4A4" fz={20} fw={500}>
              Nothing added yet!
            </Text>
            <Button
              leftIcon={<IconPlus />}
              size="lg"
              w="70%"
              style={{
                backgroundColor: "#3174F3",
                borderRadius: 24,
                padding: 0,
              }}
              onClick={() => {
                Mixpanel.track(
                  TeacherPageEvents.TEACHER_APP_HOMEWORK_PAGE_ADD_DIARY_BUTTON_CLICKED
                );
                props.onAddDiaryClick(props.classes[0]._id);
              }}
            >
              Diary
            </Button>
          </Stack>
        </Center>
      )}
      {filteredClasses.length !== 0 && (
        <Stack h="100%">
          <Flex
            w="100%"
            style={{
              backgroundColor: "#3174F3",
              borderRadius: 33,
            }}
            justify={"space-between"}
            h={isMd ? 150 : 250}
          >
            <Flex
              h="100%"
              color="white"
              direction={"column"}
              justify={"space-between"}
              py={isMd ? 25 : 20}
              pl={isMd ? 15 : 25}
            >
              <Text color="white" fz={isMd ? 14 : 30} fw={600}>
                {!isMd && (
                  <Text color="white" fz={isMd ? 14 : 18} fw={600}>
                    Hi {GetUser().name}
                  </Text>
                )}
                Start Adding Homework Today!
              </Text>
              <Box w="100%">
                <Button
                  leftIcon={<IconPlus color="#3174F3" size="20px" />}
                  style={{
                    backgroundColor: "white",
                    borderRadius: 24,
                    color: "#3174F3",
                  }}
                  w={isMd ? "120px" : "200px"}
                  fz={isMd ? 14 : 18}
                  size={!isMd ? "sm" : "md"}
                  onClick={() => {
                    Mixpanel.track(
                      TeacherPageEvents.TEACHER_APP_HOMEWORK_PAGE_ADD_DIARY_BUTTON_CLICKED
                    );
                    props.onAddDiaryClick(props.classes[0]._id);
                  }}
                >
                  Diary
                </Button>
              </Box>
            </Flex>
            <img
              src={require("./../../../assets/homeworkbanner.png")}
              height="100%"
              style={{
                aspectRatio: 203 / 151,
                padding: "10px 0px",
              }}
              alt="AddHomework"
            />
          </Flex>
          <ScrollArea h="75%">
            <SimpleGrid cols={isMd ? 1 : 2} px={5} py={5}>
              {filteredClasses.map((x) => {
                return (
                  <SingleClassHomework
                    key={x._id}
                    class={x}
                    instituteId={props.instituteId}
                    instituteName={props.instituteName}
                    userType={props.userType}
                    onAddDiaryClick={props.onAddDiaryClick}
                  />
                );
              })}
            </SimpleGrid>
          </ScrollArea>
        </Stack>
      )}
    </Stack>
  );
}
