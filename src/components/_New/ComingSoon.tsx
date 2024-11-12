import { Center, Group, Image, Stack, Text } from "@mantine/core";
import {
  IconIntroduction,
  IconLessonPlan,
  IconMindMap,
  IconNotes,
  IconSummary,
  IconSyllabus,
  IconTopics,
} from "../_Icons/CustonIcons";

export function ComingSoon() {
  return (
    <>
      <Center style={{ height: "100%" }}>
        <Stack align="center">
          <Image
            src={require("../../assets/ComingSoon.png")}
            width={400}
            style={{ maxWidth: "100%" }}
          />
          <Text
            fz={52}
            fw={500}
            c="blue"
            style={{
              letterSpacing: "0.365em",
              textShadow: " 0px 6px 2px rgba(0, 0, 0, 0.25)",
            }}
          >
            COMING SOON
          </Text>
        </Stack>
      </Center>
    </>
  );
}
