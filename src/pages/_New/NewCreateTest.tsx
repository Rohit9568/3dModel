import { Stack } from "@mantine/core";
import { TestScreen } from "../../components/_New/ContentTest";
import "./NewCreate.css";
import { TestType } from "./NewTeacherTest";
interface NewCreateTestProps {
  testName: string;
  testType: TestType;
  setTestScreen: (val: TestScreen) => void;
  startTime: Date | null;
  onTestCreation: () => void;
}
export function NewCreateTest(props: NewCreateTestProps) {
  return (
    <Stack
      style={{
        width: "100%",
        height: "100%",
      }}
    >
      <></>
    </Stack>
  );
}
