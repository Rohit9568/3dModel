import {
  Box,
  Button,
  Center,
  Divider,
  Flex,
  LoadingOverlay,
  Modal,
  Stack,
  Text,
} from "@mantine/core";

import { DatePicker } from "@mantine/dates";
import {
  IconCalendarEvent,
  IconPlus,
} from "@tabler/icons";
import { useEffect, useState } from "react";
import { AddHomeworkModal } from "./AddHomeworkModal";
import { FileUpload } from "../../../features/fileUpload/FileUpload";
import {
  CreateHomework,
  UpdateHomework,
} from "../../../_parentsApp/features/instituteHomeworkSlice";
import {
  GetAllHomeworksByDate,
} from "../../../_parentsApp/features/instituteClassSlice";
import { useLocation } from "react-router-dom";
import { EditDiaryModal } from "./EditDiaryModal";
import { Mixpanel } from "../../../utilities/Mixpanel/MixpanelHelper";
import { TeacherPageEvents } from "../../../utilities/Mixpanel/AnalyticeEventTeacherApp";
import { showNotification } from "@mantine/notifications";
import { compareDatesOnly } from "../../../utilities/HelperFunctions";
import { GetBatchesInfo } from "../../../_parentsApp/features/instituteSlice";
import { batch } from "react-redux";

export enum DiaryType {
  CLASSWORK ="Class Work",
  HOMEWORK = "Home Work",
}

interface HomeworkTeacherProps {
  batchId: string;
  batch: InstituteClass;
  onLastDateChange: (val: number) => void;
  onBackClick: () => void;
  uploadPhoto?: string;
  reloadInstituteData?: () => void;
}
export interface ResponseForImage {
  url: string;
}
export function HomeworkTeacher(props: HomeworkTeacherProps) {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const paramValue = queryParams.get("date");

  const [isLoading, setIsloading] = useState<boolean>(false);
  const [dateValue, setDateValue] = useState<Date | null>(null);
  const [isAddHomeworkClicked, setIsAddHomeworkClicked] = useState<string>("");
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>("");
  const [subjectDiary, setSubjectDiary] = useState<InstituteSubjectDiary[]>([]);
  const [viewClicked, setViewClicked] = useState<{
    subjectId: string;
    subjectName: string;
    description: string;
    dateValue: number;
    id: string;
    uploadPhoto?: string;
  } | null>(null);
  const isDateOld = dateValue
    ? compareDatesOnly(dateValue, new Date(Date.now()))
    : false;
  useEffect(() => {
    if (paramValue) {
      const timestamp = parseInt(paramValue);
      const date = new Date(timestamp);
      setDateValue(date);
    } else {
      const today = new Date(Date.now());
      today.setHours(6, 0, 0, 0);
      setDateValue(today);
    }
  }, [paramValue]);



  async function addHomeworkhandler(description: string, uploadPhoto?: File) {
    if (dateValue) {
      setIsloading(true);
      setIsAddHomeworkClicked("");
      dateValue.setHours(0, 0, 0, 0);
      props.onLastDateChange(dateValue.getTime());

      if (uploadPhoto) {
        const response = (await FileUpload({
          file: uploadPhoto,
        })) as ResponseForImage;
        if (response.url) {
          CreateHomework({
            date: dateValue.getTime(),
            description,
            instituteClassId: props.batchId,
            userSubjectId: selectedSubjectId,
            uploadImage: response.url,
          })
            .then((x: any) => {
              Mixpanel.track(
                TeacherPageEvents.TEACHER_APP_HOMEWORK_PAGE_HOME_WORK_UPLOADED_SUCCESS
              );
              showNotification({
                message: "New HomeWork Added Successfully",
              });

              setSubjectDiary((prev) => {
                const prev1 = prev.map((sub) => {
                  if (sub.id === x.userSubjectId) sub.homeworks = x;
                  return sub;
                });
                return prev1;
              });

              setIsloading(false);
            })
            .catch((e) => {
              console.log(e);
              setIsloading(false);
            });
        }
      } else {
        CreateHomework({
          date: dateValue.getTime(),
          description,
          instituteClassId: props.batchId,
          userSubjectId: selectedSubjectId,
          uploadImage: "",
        })
          .then((x: any) => {
            Mixpanel.track(
              TeacherPageEvents.TEACHER_APP_HOMEWORK_PAGE_HOME_WORK_UPLOADED_SUCCESS
            );

            setSubjectDiary((prev) => {
              const prev1 = prev.map((sub) => {
                if (sub.id === x.userSubjectId) sub.homeworks = x;
                return sub;
              });
              return prev1;
            });
            setIsloading(false);
          })
          .catch((e) => {
            console.log(e);
            setIsloading(false);
          });
      }
    }
    if (props.reloadInstituteData) props.reloadInstituteData();
  }



  async function editHomework(
    id: string,
    description: string,
    subjectId: string,
    uploadPhoto: string | undefined
  ) {
    setIsloading(true);

    UpdateHomework({
      id,
      description,
      uploadPhoto: uploadPhoto,
    })
      .then((x: any) => {
        setIsloading(false);
        showNotification({ message: "Successfully Edited" });
        setSubjectDiary((prev) => {
          const prev1 = prev.map((sub) => {
            if (sub.id === subjectId) {
              const sub1 = sub;
              sub1.homeworks = x;
              return sub1;
            }
            return sub;
          });
          return prev1;
        });
      })
      .catch((e) => {
        setIsloading(false);
        console.log(e);
      });
  }

  useEffect(() => {
      if (dateValue !== null) {
        dateValue.setHours(0, 0, 0, 0);
        const subjects1: InstituteSubjectDiary[] = props.batch.userSubjects.map(
          (x: any) => {
            return {
              id: x._id,
              name: x.subjectId.name,
              classworks: null,
              homeworks: null,
              date: dateValue.getTime(),
            };
          }
        );
        setIsloading(true);
        GetAllHomeworksByDate({ date: dateValue.getTime(), id: props.batchId })
          .then((data: any) => {
            for (let sub of subjects1) {
            const matchingHomeworks = data.find(
              (homework: any) => homework.subjectId === sub.id
            );
            if (matchingHomeworks) sub.homeworks = matchingHomeworks;
          }
          setSubjectDiary(subjects1);
          setIsloading(false);
          })
          .catch((e) => {
            setIsloading(false);
            console.log(e);
          });
      }

  }, [dateValue, props.batchId]);


  return (
    <Stack w={"100%"}>
        <DatePicker
          rightSection={<IconCalendarEvent color="#3174F3" />}
          placeholder="Click here to select a date"
          style={{
            borderRadius: "7px",
          }}
          styles={{
            rightSection: { pointerEvents: "none" },
            label: { color: "blue" },
            input: {
              "::placeholder": { color: "#3174F3" },
              color: "#3174F3",
              height: "50px",
              border: "1px #3174F3 solid",
            },
          }}
          value={dateValue}
          onChange={ (val) => {
            if (val !== null) {
              val.setHours(0, 0, 0, 0);
              setDateValue(val);
            }
          }
        }
        w={250}
        />

      <Flex
        color=""
        style={{
          backgroundColor: "#E4EDFD",
        }}
        justify="space-between"
        px={15}
        py={5}
      >
        <Text fz={14} fw={500} color="#000">
          Subject
        </Text>
        <Text fz={14} fw={500} color="#000" mr={15}>
          Assignment
        </Text>
      </Flex>
      <Stack>
        {subjectDiary.map((x) => {
          return (
            <Stack key={x.id}>
              <Flex justify="space-between" px={15} align="center" h={35}>
                <Text color="#7D7D7D" fz={14} fw={500}>
                  {x.name}
                </Text>
                {
                true &&
                  x.homeworks !== null && (
                    <Flex align={"center"} gap={"sm"}>
                      <Button
                        variant="outline"
                        onClick={() => {
                          Mixpanel.track(
                            TeacherPageEvents.TEACHER_APP_HOMEWORK_PAGE_HOME_WORK_EDIT_BUTTON_CLICKED
                          );
                          if (x.homeworks?.description) {
                            const uploadedPhoto = x.homeworks.uploadPhoto;
                            setViewClicked({
                              subjectName: x.name,
                              description: x.homeworks?.description,
                              dateValue: x.date,
                              id: x.homeworks._id,
                              subjectId: x.id,
                              uploadPhoto: x.homeworks.uploadPhoto,
                            });
                          }
                        }}
                      >
                        {isDateOld ? "View" : "Edit"}
                      </Button>
                    </Flex>

                  )}

                { true &&
                  x.homeworks === null && (
                    <Box
                      h="30px"
                      w="30px"
                      style={{
                        borderRadius: "50%",
                        backgroundColor: isDateOld ? "gray" : "#3174F3",
                        cursor: isDateOld ? "none" : "pointer",
                      }}
                      onClick={() => {
                        Mixpanel.track(
                          TeacherPageEvents.TEACHER_APP_HOMEWORK_PAGE_HOME_WORK_ADD_ICON_CLICKED
                        );
                        if (!isDateOld) {
                          setIsAddHomeworkClicked(x.name);
                          setSelectedSubjectId(x.id);
                        }
                      }}
                      mr={20}
                    >
                      <Center h="100%" w="100%">
                        <IconPlus color="white" height="80%" width="80%" />
                      </Center>
                    </Box>
                  )}
              </Flex>
              <Divider w="100%" />
            </Stack>
          );
        })}
      </Stack>
      <Modal
        style={{ zIndex: 9999 }}
        opened={isAddHomeworkClicked !== ""}
        onClose={() => {
          setIsAddHomeworkClicked("");
        }}
        title={isAddHomeworkClicked}
        centered
      >
        { true && (
          <AddHomeworkModal
            onSubmitClick={addHomeworkhandler}
          />
        )}
      </Modal>
      <Modal
        style={{ zIndex: 9999 }}
        opened={viewClicked !== null}
        onClose={() => {
          setViewClicked(null);
        }}
        title={viewClicked?.subjectName}
        centered
      >
        {viewClicked?.description && isDateOld && (
          <div dangerouslySetInnerHTML={{ __html: viewClicked?.description }} />
        )}
        {viewClicked?.description && !isDateOld && (
          <>
            <EditDiaryModal
              onSubmitClick={(val, uploadPhoto) => {
                setViewClicked(null);

                editHomework(
                      viewClicked.id,
                      val,
                      viewClicked.subjectId,
                      uploadPhoto
                    );
              }}
              diaryContent={viewClicked.description}
              uploadedPhoto={viewClicked.uploadPhoto}
              onPicUpload={(data, file) => {
                setViewClicked(null);
                setIsloading(true);
                FileUpload({ file: file })
                  .then((x) => {
                    editHomework(
                          viewClicked.id,
                          data,
                          viewClicked.subjectId,
                          x.url
                        );
                  })
                  .catch((e) => {
                    console.log(e);
                  });
              }}
            />
          </>
        )}
      </Modal>
      <LoadingOverlay visible={isLoading} />
    </Stack>
  );
}
