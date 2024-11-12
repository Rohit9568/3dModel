import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Center,
  Flex,
  Modal,
  MultiSelect,
  Radio,
  Select,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { TimeInput } from "@mantine/dates";
import { ScheduleToggle } from "../../../utils/ScheduleToggle";
import { IconPlus } from "@tabler/icons";
import { set } from "date-fns";

function AddBoardClasses(props: {
  selectedSubjects: string[];
  boardsData: {
    label: string;
    value: string;
  }[];
  setSelectedSubjects: (val: string[]) => void;
  allSubjects: {
    label: string;
    value: string;
    boardId: string;
    boardName: string;
  }[];
  selectedBoard: string;
  setselectedBaoard: (val: string) => void;
  onDeleteBoard: () => void;
  isCrossVisible: boolean;
}) {
  const [selectedSubjects, setSelectedSubjects] = useState<
    {
      label: string;
      value: string;
    }[]
  >([]);

  useEffect(() => {
    setSelectedSubjects(
      props.allSubjects
        .filter((x) => {
          return x.boardId === props.selectedBoard;
        })
        .map((x) => {
          return {
            label: x.label,
            value: x.value,
          };
        })
    );
  }, [props.selectedBoard]);
  return (
    <Stack
      spacing={5}
      style={{
        border: "1px solid #CCCCCC",
        borderRadius: 8,
      }}
      py={20}
      px={20}
    >
      {props.isCrossVisible && (
        <Flex justify="right">
          <img
            src={require("../../../../assets/minuscircle.png")}
            onClick={() => {
              props.onDeleteBoard();
            }}
            style={{
              cursor: "pointer",
            }}
          />
        </Flex>
      )}
      <Select
        data={props.boardsData}
        label="Select Board"
        value={props.selectedBoard}
        onChange={(value) => {
          if (value) {
            props.setselectedBaoard(value);
          }
        }}
        placeholder="Select your Board"
      />
      <MultiSelect
        data={selectedSubjects}
        label="Select Subjects"
        value={props.selectedSubjects}
        onChange={(value) => {
          props.setSelectedSubjects(value);
        }}
        searchable
        placeholder="Select your Subjects"
      />
    </Stack>
  );
}

interface AddBatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddBatch: (
    batchName: string,
    selectedSubjects: string[],
    selectedCourses: string[],
    days: (Date | null)[]
  ) => void;
  onUpdateBatch: (
    classId: string,
    batchName: string,
    selectedSubjects: string[],
    selectedCourses: string[],
    days: (Date | null)[]
  ) => void;
  initialData?: {
    _id: string;
    batchName: string;
    selectedSubjects: string[];
    selectedCourses: string[];
    days: (Date | null)[];
  } | null;
  subjects: {
    label: string;
    value: string;
    boardId: string;
    boardName: string;
  }[];
  instituteCourses: { label: string; value: string }[];
}

const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const AddBatchModal: React.FC<AddBatchModalProps> = ({
  isOpen,
  onClose,
  onAddBatch,
  initialData,
  subjects,
  instituteCourses,
  onUpdateBatch,
}) => {
  const initialDaysData = [null, null, null, null, null, null, null];
  const [formData, setFormData] = useState<{
    batchName: string;
    selectedCourses: string[];
  }>({
    batchName: initialData ? initialData.batchName : "",
    selectedCourses: initialData ? initialData.selectedCourses : [],
  });
  const [scheduleEnabled, setScheduleEnabled] = useState(false);
  const [selectedDays, setSelectedDays] =
    useState<(Date | null)[]>(initialDaysData);
  const [boardCards, setBoardCards] = useState<
    {
      boardId: string;
      boardName: string;
      subjects: {
        label: string;
        value: string;
      }[];
    }[]
  >([]);
  const [allBoards, setAllBoards] = useState<
    {
      label: string;
      value: string;
    }[]
  >([]);

  useEffect(() => {
    const boardCards: {
      boardId: string;
      boardName: string;
      subjects: {
        label: string;
        value: string;
      }[];
    }[] = [];
    initialData?.selectedSubjects.map((x) => {
      const found = subjects.find((y) => y.value === x);
      if (found) {
        const foundBoard = boardCards.find((y) => y.boardId === found.boardId);
        if (foundBoard) {
          foundBoard.subjects.push({
            label: found.label,
            value: found.value,
          });
        } else {
          boardCards.push({
            boardId: found.boardId,
            boardName: found.boardName,
            subjects: [{ label: found.label, value: found.value }],
          });
        }
      }
    });
    if (initialData) setBoardCards(boardCards);
    else {
      setBoardCards([
        {
          boardId: "",
          boardName: "",
          subjects: [],
        },
      ]);
    }
  }, [initialData?.selectedSubjects, subjects]);

  useEffect(() => {
    setAllBoards(
      subjects
        .map((x) => {
          return { label: x.boardName, value: x.boardId };
        })
        .filter((x, i, a) => a.findIndex((y) => y.value === x.value) === i)
    );
  }, [subjects]);

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.currentTarget;
    setFormData({ ...formData, [name]: value });
  };

  useEffect(() => {
    setFormData({
      batchName: initialData ? initialData.batchName : "",
      selectedCourses: initialData ? initialData.selectedCourses : [],
    });
    setSelectedDays(initialData ? initialData.days : initialDaysData);
    setScheduleEnabled(
      initialData && initialData?.days?.find((x) => x !== null) ? true : false
    );
    console.log(initialData);
  }, [initialData]);

  const handleAddBatch = () => {
    onClose();
    const allSelectedSubjects: string[] = [];
    boardCards.forEach((boardCard) => {
      allSelectedSubjects.push(...boardCard.subjects.map((x) => x.value));
    });
    if (initialData) {
      onUpdateBatch(
        initialData._id,
        formData.batchName,
        allSelectedSubjects,
        formData.selectedCourses,
        scheduleEnabled ? selectedDays : []
      );
    } else {
      onAddBatch(
        formData.batchName,
        allSelectedSubjects,
        formData.selectedCourses,
        scheduleEnabled ? selectedDays : []
      );
    }
    setFormData({
      batchName: "",
      selectedCourses: [] as string[],
    });
    setBoardCards([]);
  };

  function toggleDaySelection(day: number) {
    if (selectedDays[day] !== null) {
      setSelectedDays((prev) => {
        const prev1 = [...prev];
        prev1[day] = null;
        return prev1;
      });
    } else {
      setSelectedDays((prev) => {
        const prev1 = [...prev];
        prev1[day] = new Date();
        return prev1;
      });
    }
  }

  function isDisabledNextButton() {
    return (
      formData.batchName === "" ||
      (scheduleEnabled && selectedDays.every((x) => x === null))
    );
  }
  return (
    <Center>
      <Modal
        opened={isOpen}
        onClose={onClose}
        title={
          <Text fz={20} fw={700}>
            Add Batch
          </Text>
        }
        radius="sm"
        size="sm"
        centered
      >
        <Stack spacing={10}>
          <TextInput
            label="Batch Name"
            name="batchName"
            value={formData.batchName}
            onChange={handleInputChange}
            placeholder="Enter your batch name"
          />
          {boardCards.map((boardCard, index) => {
            return (
              <AddBoardClasses
                selectedSubjects={boardCard.subjects.map((x) => x.value)}
                boardsData={
                  boardCard.boardId === ""
                    ? allBoards.filter(
                        (x) =>
                          !boardCards.map((x) => x.boardId).includes(x.value)
                      )
                    : [allBoards.find((x) => x.value === boardCard.boardId)!!]
                }
                setSelectedSubjects={(val) => {
                  const boardCards1 = [...boardCards];
                  const found = boardCards1.find(
                    (x) => x.boardId === boardCard.boardId
                  );
                  if (found) {
                    found.subjects = val.map((x) => {
                      return {
                        label: subjects.find((y) => y.value === x)?.label || "",
                        value: x,
                      };
                    });
                  }
                  setBoardCards(boardCards1);
                }}
                allSubjects={subjects}
                selectedBoard={boardCard.boardId}
                setselectedBaoard={(val) => {
                  setBoardCards((prev) => {
                    const prev1 = [...prev];
                    const found = prev1[index];
                    if (found) {
                      prev1[index].boardId = val;
                      prev1[index].boardName = allBoards.find(
                        (x) => x.value === val
                      )?.label as string;
                    }
                    return prev1;
                  });
                }}
                onDeleteBoard={() => {
                  setBoardCards((prev) => {
                    const prev1 = [...prev];
                    prev1.splice(index, 1);
                    return prev1;
                  });
                }}
                isCrossVisible={boardCards.length > 1}
              />
            );
          })}
          {allBoards.filter(
            (x) => !boardCards.map((x) => x.boardId).includes(x.value)
          ).length > 0 && (
            <Flex justify="right">
              <Button
                variant="subtle"
                onClick={() => {
                  setBoardCards((prev) => {
                    const prev1 = [...prev];
                    prev1.push({
                      boardId: "",
                      boardName: "",
                      subjects: [],
                    });
                    return prev1;
                  });
                }}
                leftIcon={<IconPlus size={14} />}
                c="#4B65F6"
              >
                Add Boards
              </Button>
            </Flex>
          )}
          {instituteCourses != null && instituteCourses.length > 0 && (
            <MultiSelect
              data={instituteCourses}
              label="Link Courses (if any)"
              value={formData.selectedCourses}
              onChange={(value) =>
                setFormData({ ...formData, selectedCourses: value })
              }
              searchable
              placeholder="Select your courses"
            />
          )}

          <ScheduleToggle
            isFirstEnabled={scheduleEnabled}
            setisFirstEnabled={setScheduleEnabled}
            firstLabel="Enable Schedule"
            secondLabel="Disable Schedule"
          />
          {scheduleEnabled && (
            <Stack bg="#FAFAFA" spacing={1} pl={10} py={5}>
              <Text fz={16} fw={500}>
                Schedule
              </Text>
              <Stack w="100%">
                {days.map((day, index) => (
                  <Flex align="center" justify="space-between">
                    <Button
                      key={index}
                      onClick={() => toggleDaySelection(index)}
                      variant={
                        selectedDays[index] !== null ? "filled" : "outline"
                      }
                      mr={10}
                      mt={10}
                      bg={selectedDays[index] !== null ? "#4B65F6" : ""}
                      style={{
                        border: "#4B65F6 1px solid",
                        color:
                          selectedDays[index] !== null ? "white" : "#4B65F6",
                        fontWeight: 700,
                      }}
                      p={10}
                      sx={{
                        "&:hover": {
                          backgroundColor:
                            selectedDays[index] !== null
                              ? "#4B65F6"
                              : "#E7E8E8",
                          color: "white",
                        },
                      }}
                      w="80px"
                    >
                      {day.slice(0, 3)}
                    </Button>
                    <Flex align="center">
                      <Text fz={16} fw={500} mr={10}>
                        Starts at
                      </Text>
                      <TimeInput
                        value={selectedDays[index]}
                        onChange={(value) => {
                          setSelectedDays((prev) => {
                            const prev1 = [...prev];
                            prev1[index] = value;
                            return prev1;
                          });
                        }}
                        style={{
                          minHeight: "42px",
                          width: "100px",
                        }}
                        disabled={selectedDays[index] === null}
                      />
                    </Flex>
                  </Flex>
                ))}
              </Stack>
            </Stack>
          )}
          <Flex justify="flex-end" mt={10}>
            <Button
              id="cancel-btn"
              size="md"
              onClick={onClose}
              style={{
                backgroundColor: "white",
                color: "black",
                border: "1px solid #808080",
                padding: "11px, 13px, 11px, 13px",
                borderRadius: "20px",
              }}
            >
              <Text fz={14} fw={700}>
                Cancel
              </Text>
            </Button>
            <Button
              onClick={handleAddBatch}
              size="md"
              px={26}
              bg="#4B65F6"
              radius={20}
              ml={10}
              disabled={isDisabledNextButton()}
              sx={{
                "&:hover": {
                  backgroundColor: "#4B65F6",
                },
              }}
            >
              <Text fz={14} fw={700}>
                {initialData ? "Update" : "Add"} Batch
              </Text>
            </Button>
          </Flex>
        </Stack>
      </Modal>
    </Center>
  );
};

export default AddBatchModal;
