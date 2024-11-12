import React, { useEffect, useState } from "react";
import {
  Box,
  Select,
  Flex,
  Text,
  ScrollArea,
  Stack,
  Divider,
  Center,
  LoadingOverlay,
  Button,
} from "@mantine/core";
import { Modal } from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import { IconChevronDown } from "@tabler/icons";
import {
  GetAllClassworksByDate,
  GetAllHomeworksByDate,
} from "../features/instituteClassSlice";
import ToggleCard from "../../components/AdminPage/HomeSection/ToggleCard";
import { DiaryType } from "../../components/AdminPage/HomeSection/HomeworkTeacher";
import { IconCalender } from "../../components/_Icons/CustonIcons";
import { Mixpanel } from "../../utilities/Mixpanel/MixpanelHelper";
import { useMediaQuery } from "@mantine/hooks";
import { ParentPageEvents } from "../../utilities/Mixpanel/AnalyticEventParentApp";

interface ShowHomeworkProps {
  studentData: {
    classId: string;
    className: string;
    studentName: string;
    studentId: string;
  };
}
const ShowHomework = (props: ShowHomeworkProps) => {
  const isMd = useMediaQuery(`(max-width: 500px)`);
  var today = new Date();
  const [isModalOpened, setIsModalOpened] = useState<boolean>(false);
  const [changePhoto, setChangePhoto] = useState<string>("");
  const [changeDescription, setChangeDescription] = useState<string>("");
  today.setHours(0, 0, 0, 0);
  const [dateValue, setDateValue] = useState<Date | null>(today);
  const [studentOptions, setStudentOptions] = useState<
    {
      value: string;
      label: string;
    }[]
  >([]);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(
    null
  );
  const [classworks, setClasssworks] = useState<InstituteClasswork[]>([]);
  const [homeworks, setHomeworks] = useState<InstituteHomework[]>([]);
  const [isLoading, setIsloading] = useState<boolean>(false);
  const selectedClassId = props.studentData.classId;

  useEffect(() => {
      setSelectedStudentId(props.studentData.studentId);
  }, [props.studentData]);


  useEffect(() => {
    if (dateValue !== null && selectedClassId) {
      dateValue.setHours(0, 0, 0, 0);
      setIsloading(true);
      GetAllHomeworksByDate({ date: dateValue.getTime(), id: selectedClassId })
        .then((data: any) => {
          setHomeworks(data);
          setIsloading(false);
        })
        .catch((e) => {
          setIsloading(false);
          console.log(e);
        });
    }
  }, [dateValue, selectedClassId]);
  return (
    <Stack h="100%" w={"100%"}spacing={20}>
      <LoadingOverlay visible={isLoading} />
        <DatePicker
          inputFormat="DD/MM/YY"
          labelFormat="MM/YY"
          rightSection={<IconCalender />}
          placeholder="select a date"
          styles={{
            rightSection: { pointerEvents: "none" },
            label: { color: "blue" },
            input: {
              "::placeholder": { color: "#3174F3" },
              color: "#3174F3",
              border: "1px #3174F3 solid",
              height: isMd ? "30px" : "50px",
              borderRadius: "7px",
            },
          }}
          value={dateValue}
          onChange={(value) => {
            setDateValue(value);
            Mixpanel.track(ParentPageEvents.PARENTS_DIARY_DATE_CLICKED);
          }}
          w={200}
        />
      <Stack spacing={0} h="100%">
        <Flex
          w={"100%"}
          style={{
            backgroundColor: "#E4EDFD",
          }}
        >
          <Text ta="center" w="30%" fz={isMd ? 14 : 18} fw={500} py={8}>
            Subject
          </Text>
          
          <Text ta="center" w="70%" fz={isMd ? 14 : 18} fw={500} py={8}>
            Homework
          </Text>
        </Flex>
        <ScrollArea h="50vh">
          {homeworks.length === 0 && (
            <Box w="100%" h="50vh">
              <Center h={"100%"} w={"100%"}>
                <Stack justify="center" align="center">
                  <img
                    src={require("../../assets/homework.png")}
                    height="90px"
                    width="90px"
                    alt="No homeowork found"
                  />
                  <Text fw={500} fz={20} color="#C9C9C9">
                    No Homeworks found!
                  </Text>
                </Stack>
              </Center>
            </Box>
          )}

          {
            homeworks.length !== 0 &&
            homeworks.map((x) => {
              const formattedDescription = x.description.replace(/\n/g, "<br>");
              return (
                <Stack spacing={0} key={x._id}>
                  <Flex w="100%" align={"center"}>
                    <Text w="30%" color="#7D7D7D" fz={isMd ? 14 : 18} fw={500}>
                      <Center h="100%">{x.subjectName} </Center>
                    </Text>
                    <Divider orientation="vertical" size="sm" />

                    <Button
                      style={{
                        width: "100px",
                        cursor: "pointer",
                        padding: "0",
                        margin: "10px",
                        transform: "translateX(20vw)",
                      }}
                      variant="outline"
                      onClick={() => {
                        setChangeDescription(formattedDescription);
                        setChangePhoto(x.uploadPhoto as string);
                        setIsModalOpened(true);
                      }}
                    >
                      View
                    </Button>
                  </Flex>
                  <Divider size="sm" />
                </Stack>
              );
            })}
        </ScrollArea>
      </Stack>
      <Modal
        opened={isModalOpened}
        onClose={() => setIsModalOpened(false)}
        size={"lg"}
        centered
        style={{ zIndex: 9999 }}
        title="View Diary"
      >
        <p
          dangerouslySetInnerHTML={{
            __html: changeDescription,
          }}
        />
        {changePhoto && changePhoto !== "" && (
          <img
            src={changePhoto}
            alt="Photo"
            style={{ maxWidth: "100%", maxHeight: "100%" }}
          />
        )}
      </Modal>
    </Stack>
  );
};

export default ShowHomework;