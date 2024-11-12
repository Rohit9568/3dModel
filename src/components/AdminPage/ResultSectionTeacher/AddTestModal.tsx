import {
  Button,
  Group,
  NumberInput,
  Stack,
  TextInput
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useEffect, useState } from "react";
import { GetAllTestsByClassId } from "../../../_parentsApp/features/instituteClassSlice";
import {
  CreateNewBasicTest
} from "../../../_parentsApp/features/instituteTest";
import { TeacherPageEvents } from "../../../utilities/Mixpanel/AnalyticeEventTeacherApp";
import { Mixpanel } from "../../../utilities/Mixpanel/MixpanelHelper";

interface AddTestModalProps {
  instituteId: string;
  classId: string;
  onClose: () => void;
  onTestCreated: (val: string) => void;
}
export function AddTestModal(props: AddTestModalProps) {
  const [allClassTests, setAllClassTests] = useState<
    {
      _id: string;
      name: string;
    }[]
  >([]);
  const [data, setData] = useState<
    {
      value: string;
      label: string;
    }[]
  >([]);
  const form = useForm({
    initialValues: {
      testId: "",
      testName: "",
      maxMarks: 0,
      subjectId: "",
    },
    validate: {
      testName: (value: string) =>
        value === "" ? "Enter valid test name" : null,
      maxMarks: (value: number) =>
        value <= 0 || value === undefined
          ? "Max Marks should be greater than 1"
          : null,
    },
  });

  const subjectId1 = form.getInputProps("subjectId").value;
  useEffect(() => {
    GetAllTestsByClassId({ id: props.classId })
      .then((data: any) => {
        const tests = data.map((x: any) => {
          return x.test;
        });
        setAllClassTests(tests);
        const testData = tests.map((x: any) => {
          return {
            label: x.name,
            value: x._id,
          };
        });
        setData(testData);
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);

  return (
    <form
      onSubmit={form.onSubmit((values) => {
        form.validate();
        const found = allClassTests.find((x) => x.name === values.testName);
        if (found) {
          props.onTestCreated(found._id);
        } else {
          CreateNewBasicTest({
            name: values.testName,
            maxMarks: values.maxMarks,
            classId: props.classId,
            subjectId: values.subjectId,
          })
            .then((x: any) => {
              props.onTestCreated(x._id);
            })
            .catch((e) => {
              console.log(e);
            });
        }
      })}
    >
      <Stack>
        <TextInput
          label="Test Name"
          placeholder="Enter Test Name"
          {...form.getInputProps("testName")}
        />
        <NumberInput
          {...form.getInputProps("maxMarks")}
          label="Total Marks"
          min={0}
        />

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
              Mixpanel.track(
                TeacherPageEvents.TEACHER_APP_RESULT_PAGE_CANCEL_BUTTON_CLICK
              );
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
              border: "#3174F3 1px solid",
            }}
            type="submit"
          >
            Next
          </Button>
        </Group>
      </Stack>
    </form>
  );
}
