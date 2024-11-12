import { Divider, Flex, Stack, Text } from "@mantine/core";
import { IconClock } from "@tabler/icons";
import { convertDate, secondsToTime } from "../../utilities/HelperFunctions";
import { format } from "date-fns";

export function ScheduleTest(props: { onClick: () => void; test: VignamTest }) {
  return (
    <Stack>
      <Divider
        my="sm"
        label={format(new Date(props.test.testScheduleTime!!), "hh:mm")}
        labelPosition="left"
      />
      <Stack
        style={{
          background: "#F2F2F2",
          borderRadius: 10,
        }}
        spacing={5}
        px={25}
        py={20}
      >
        <Text fw={600} fz={24}>
          {props.test.name}
        </Text>
        {props.test.maxQuestions !== 0 && (
          <Text c="#898989" fw={400} fz={14}>
            {`Total Marks : ${props.test.maxMarks} | Total Questions: ${props.test.maxQuestions}`}
          </Text>
        )}
        <Flex align="center">
          <IconClock
            color="#898989"
            size={18}
            style={{
              marginRight: 5,
            }}
          />
          <Text c="#898989" fw={400} fz={14}>{`Date: ${convertDate(
            props.test.testScheduleTime ? props.test.testScheduleTime : ""
          )} | Duration:${secondsToTime(parseInt(props.test.duration))}`}</Text>
        </Flex>
      </Stack>
    </Stack>
  );
}
