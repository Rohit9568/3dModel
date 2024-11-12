import React, { useState, useRef, useEffect, useLayoutEffect } from "react";
import {
  useMantineTheme,
  Stack,
  Center,
  SimpleGrid,
  Text,
  Button,
  Paper,
  Box,
  Flex,
  Select,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AppDispatch, RootState } from "../../../store/ReduxStore";
import { WebAppEvents } from "../../../utilities/Mixpanel/AnalyticeEventWebApp";
import { Mixpanel } from "../../../utilities/Mixpanel/MixpanelHelper";
import { subjects } from "../../../store/subjectsSlice";
import { SubjectCard } from "./SubjectCard";

const subjectsActions = subjects.actions;

interface ClassesSubjectsProps {
  subjects: UserSubject[];
}

const SelectClass = (props: {
  userClassesSubjects: UserClassAndSubjects[];
  onSubjectClicked: (currentSubject: UserSubject) => void;
}) => {
  const [selectedClass, setSelectedClass] = useState<string>(
    props.userClassesSubjects[0]?.className
  );
  const [selectedBoard, setSelectedBoard] = useState<string>("");
  const [selectedBoardValues, setSelectedBoardValues] = useState<
    {
      value: string;
      label: string;
    }[]
  >([]);
  const [selectedClasses, setSelectedClasses] = useState<
    UserClassAndSubjects[]
  >([]);
  const theme = useMantineTheme();
  const isMd = useMediaQuery(`(max-width: ${theme.breakpoints.md}px)`);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const subjectsForSelectedClass =
    props.userClassesSubjects.find(
      (userClassSubj) => userClassSubj.className === selectedClass
    )?.subjects || [];

  useEffect(() => {
    if (props.userClassesSubjects.length > 0) {
      console.log(props.userClassesSubjects);
      setSelectedBoard(props.userClassesSubjects[0]?.boardId!!);
      setSelectedBoardValues(
        props.userClassesSubjects
          .map((x) => {
            return { value: x.boardId!!, label: x.boardName!! };
          })
          .filter((x, i, a) => a.findIndex((y) => y.value === x.value) === i)
      );
    }
  }, [props.userClassesSubjects]);

  const handleClassChange = (className: string) => {
    setSelectedClass(className);
  };
  useEffect(() => {
    setSelectedClass(props.userClassesSubjects[0]?.className);
  }, [props.userClassesSubjects]);

  useEffect(() => {
    setSelectedClass(selectedClasses[0]?.className);
  }, [selectedClasses]);

  useEffect(() => {
    setSelectedClasses(
      props.userClassesSubjects.filter(
        (userClassSubj) => userClassSubj.boardId === selectedBoard
      )
    );
  }, [selectedBoard]);

  return (
    <Stack w="100%">
      <Flex justify="right">
        <Select
          value={selectedBoard}
          onChange={(val) => {
            if (val) setSelectedBoard(val);
          }}
          style={{ width: "200px" }}
          placeholder="Select Board"
          data={selectedBoardValues}
        />
      </Flex>
      {selectedClasses.length > 0 && (
        <Paper
          style={{
            borderRadius: "24px",
            border: "4px solid #C9DFFB",
          }}
          w="100%"
        >
          <Stack w={"100%"}>
            <Flex
              style={{
                gap: "12px",
                borderBottom: "4px solid #C9DFFB",
                marginBottom: "-16px",
              }}
              w="100%"
              wrap="wrap"
              p={20}
            >
              {selectedClasses
                .map((x) => {
                  return x.className;
                })
                .map((className) => (
                  <div key={className} style={{ position: "relative" }}>
                    <Button
                      bg={className === selectedClass ? "#4B65F6" : "white"}
                      c={className === selectedClass ? "white" : "#4B65F6"}
                      ref={className === selectedClass ? buttonRef : null}
                      onClick={() => {
                        Mixpanel.track(
                          WebAppEvents.TEACHER_APP_HOME_PAGE_CLASS_FILTER_CLICKED,
                          {
                            class_id: props.userClassesSubjects.find(
                              (userClassSubj) =>
                                userClassSubj.className === selectedClass
                            )?.classId,
                          }
                        );
                        handleClassChange(className);
                      }}
                      variant={
                        className === selectedClass ? "filled" : "outline"
                      }
                      style={{
                        marginBottom: "8px",
                        fontSize: isMd ? "12px" : "16px",
                        padding: isMd ? "8px 8px" : "10px 10px",
                        position: "relative",
                      }}
                      styles={{
                        root: {
                          borderColor: "#4B65F6",
                          " &:hover": {
                            backgroundColor:
                              className === selectedClass ? "#4B65F6" : "white",
                          },
                        },
                      }}
                    >
                      {className === selectedClass && (
                        <div
                          style={{
                            height: "3px",
                            backgroundColor: "#4B65F6",
                            position: "absolute",
                            top: -12,
                            left: 0,
                          }}
                        ></div>
                      )}
                      {className}
                    </Button>
                  </div>
                ))}
            </Flex>

            <Stack
              p={10}
              px={20}
              style={{
                borderRadius: isMd ? 8 : 16,
              }}
            >
              <Text fz={24} fw={700} mb={-15}>
                Subjects
              </Text>
              <SimpleGrid
                cols={6}
                breakpoints={[
                  { maxWidth: "xl", cols: 6, spacing: "md" },
                  { maxWidth: "lg", cols: 5, spacing: "md" },
                  { maxWidth: "md", cols: 4, spacing: "md" },
                  { maxWidth: "sm", cols: 3, spacing: "sm" },
                  { maxWidth: "xs", cols: 2, spacing: "sm" },
                ]}
              >
                {subjectsForSelectedClass.map((x) => (
                  <SubjectCard
                    subject={x}
                    onClick={() => {
                      Mixpanel.track(
                        WebAppEvents.TEACHER_APP_SUBJECT_CARD_CLICKED,
                        {
                          subject_id: x.name,
                        }
                      );
                      props.onSubjectClicked(x);
                    }}
                    key={x._id}
                  />
                ))}
              </SimpleGrid>
            </Stack>

            <Stack
              p={isMd ? 15 : 30}
              px={20}
              py={4}
              style={{
                position: "relative",
              }}
            >
              <Box
                style={{
                  width: "165px",
                  height: "37px",
                  flexShrink: 0,
                  borderRadius: "0px 24px 0px 10px",
                  background: "#C9DFFB",
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                }}
              ></Box>
            </Stack>
          </Stack>
        </Paper>
      )}
    </Stack>
  );
};

export default SelectClass;
