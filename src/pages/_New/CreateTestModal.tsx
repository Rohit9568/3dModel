import {
  Button,
  Flex,
  NumberInput,
  Select,
  Stack,
  Switch,
  Text,
  TextInput,
} from "@mantine/core";
import { useEffect, useState } from "react";
import { getAllTemplates } from "../../features/template/templateSlice";
import { ScheduleToggle } from "../../components/utils/ScheduleToggle";
import { useMediaQuery } from "@mantine/hooks";
import { IconCalendar, IconPlus, IconClock } from "@tabler/icons";
import { DatePicker, TimeInput } from "@mantine/dates";
import { TestScreen } from "../../components/_New/ContentTest";
import { TestSettingsModal } from "./NewTeacherTest";

export const customTemplate = "Custom";

interface CreateTestModalProps {
  testScreen: TestScreen;
  onSubmitClick: (val: TestBasicSettings) => void;
  testData: null | TestBasicSettings;
  onClose: () => void;
  setTestData: (val: TestBasicSettings | null) => void;
  btnText: TestSettingsModal;
}

export function CreateTestModal(props: CreateTestModalProps) {
  const [testName, setTestName] = useState<string>("");
  const [duration, setDuration] = useState<number>();
  const [allTestTemplates, setAllTestTemplates] = useState<any[]>([]);
  const [selectedTestTemplate, setSelectedTemplate] =
    useState<string>(customTemplate);
  const [isInputError, setInputError] = useState<string>("");
  const [durationError, setDurationError] = useState<string>("");
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [isEnableMultipleTestAttempts, setIsEnableMultipleTestAttempts] =
    useState<boolean>(false);
  const [scheduleEnabled, setScheduleEnabled] = useState(false);
  const isMd = useMediaQuery(`(max-width: 820px)`);
  useEffect(() => {
    getAllTemplates()
      .then((data: any) => {
        console.log(data);
        setAllTestTemplates([...data, customTemplate]);
      })
      .catch((e) => {
        console.log(e);
      });
    return () => {
      props.setTestData(null);
    };
  }, []);

  useEffect(() => {
    if (props.testData) {
      setTestName(props.testData.name);
      setDuration(props.testData.duration);
      setSelectedTemplate(props.testData.selectedTestTemplate);
      setIsEnableMultipleTestAttempts(
        props.testData.isEnableMultipleTestAttempts
      );
      setStartTime(props.testData.startTime);
      setScheduleEnabled(props.testData.startTime ? true : false);
    }
  }, [props.testData]);

  useEffect(() => {
    if (selectedTestTemplate && selectedTestTemplate !== customTemplate) {
      const found = allTestTemplates.find(
        (temp) => temp._id === selectedTestTemplate
      );
      setDuration(parseInt(found.duration));
    }
  }, [selectedTestTemplate, allTestTemplates]);
  return (
    <Stack>
      {props.btnText === TestSettingsModal.CreateTest && (
        <Select
          label="Select Test Template"
          data={allTestTemplates.map((temp) => {
            if (temp === customTemplate) {
              return {
                value: temp,
                label: temp,
              };
            }
            return {
              value: temp._id,
              label: temp.name,
            };
          })}
          value={selectedTestTemplate}
          onChange={(val) => {
            if (val) setSelectedTemplate(val);
          }}
        />
      )}
      <TextInput
        label="Test Name"
        placeholder="Test Name"
        styles={{
          label: {
            fontSize: 18,
            fontWeight: 500,
            color: "#525252",
          },
        }}
        value={testName}
        onChange={(e) => {
          setInputError("");
          setTestName(e.currentTarget.value);
        }}
        error={isInputError}
        withAsterisk
      />

      <NumberInput
        label="Set Duration (In Minutes)"
        placeholder="Duration"
        styles={{
          label: {
            fontSize: 18,
            fontWeight: 500,
            color: "#525252",
          },
        }}
        value={duration}
        onChange={(e) => {
          setDurationError("");
          setDuration(e);
        }}
        min={0}
        error={durationError}
        hideControls
        disabled={selectedTestTemplate !== customTemplate}
      />
      <Flex align="center" justify="space-between" pr={20}>
        <Text>Enable Multiple Test Attempts</Text>
        <Switch
          checked={isEnableMultipleTestAttempts}
          onChange={(event) => {
            setIsEnableMultipleTestAttempts(event.currentTarget.checked);
          }}
          size="md"
          color="#4B65F6"
        />
      </Flex>
      <ScheduleToggle
        isFirstEnabled={scheduleEnabled}
        setisFirstEnabled={setScheduleEnabled}
        firstLabel="Enable Schedule"
        secondLabel="Disable Schedule"
      />

      {scheduleEnabled && (
        <>
          <DatePicker
            placeholder="Pick date"
            label="Test Date"
            onChange={(val) => {
              if (val)
                setStartTime((prev) => {
                  if (prev) {
                    prev.setFullYear(val.getFullYear());
                    prev.setMonth(val.getMonth());
                    prev.setDate(val.getDate());
                    return prev;
                  } else {
                    return val;
                  }
                });
            }}
            styles={{
              label: {
                fontSize: 18,
                fontWeight: 500,
                color: "#525252",
              },
            }}
            value={startTime}
            rightSection={<IconCalendar />}
            py={10}
            pr={8}
            minDate={new Date()}
          />

          <TimeInput
            value={startTime}
            onChange={(value) => {
              setStartTime((prev) => {
                if (prev) {
                  prev.setHours(value.getHours());
                  prev.setMinutes(value.getMinutes());
                  return prev;
                } else {
                  return value;
                }
              });
            }}
            format="12"
            styles={{
              label: {
                fontSize: 18,
                fontWeight: 500,
                color: "#525252",
              },
            }}
            rightSection={<IconClock />}
            label="Starts At"
            py={10}
            pr={8}
            mt={-20}
          />
        </>
      )}

      <Flex justify="right">
        <Button
          variant="outline"
          style={{
            border: "1px solid #808080",
            borderRadius: "30px",
            color: "#000",
          }}
          size={isMd ? "sm" : "lg"}
          mr={10}
          onClick={() => {
            props.onClose();
            // onModalClose();
          }}
        >
          Cancel
        </Button>
        <Button
          leftIcon={<IconPlus color="white" size={isMd ? 15 : 20} />}
          bg="#4B65F6"
          size={isMd ? "sm" : "lg"}
          style={{
            border: "1px solid #808080",
            borderRadius: "30px",
          }}
          sx={{
            "&:hover": {
              background: "#4B65F6",
            },
            "&:disabled": {
              opacity: 0.3,
              background: "#4B65F6",
            },
          }}
          onClick={() => {
            if (testName.trim().length < 1) {
              setInputError("Please Enter Test Name");
              // } else if (!duration || duration.toString().length === 0) {
              //   setDurationError("Please Enter Duration");
            } else {
              props.onSubmitClick({
                name: testName,
                duration: duration,
                selectedTestTemplate: selectedTestTemplate,
                isEnableMultipleTestAttempts: isEnableMultipleTestAttempts,
                startTime: scheduleEnabled ? startTime : null,
              });
            }
          }}
          disabled={testName.trim().length < 1}
        >
          {props.btnText}
        </Button>
      </Flex>
    </Stack>
  );
}
