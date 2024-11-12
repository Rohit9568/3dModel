import { Button, Divider, Flex, Stack, Text } from "@mantine/core";
import { format } from "date-fns";
import { isJoinClassDisabled } from "../../pages/_New/VideoCallingEmptyPage";
import { showNotification } from "@mantine/notifications";

export function ScheduleMeeting(props: {
  meeting: VideoCallMeetingWithBatchName;
  onjoinMeeting: (meeting: VideoCallMeetingWithBatchName) => void;
}) {
  const scheduleTime = new Date(props.meeting.scheduleTime!!);
  const isClassJoinedDisabled =
    isJoinClassDisabled(scheduleTime) || props.meeting.isActive === false;
  return (
    <Stack>
      <Divider
        my="sm"
        label={format(new Date(props.meeting.scheduleTime!!), "hh:mm")}
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
          {props.meeting.title}({props.meeting.batchName})
        </Text>
        <Flex justify="right">
          <Button
            size="lg"
            bg="#4B65F6"
            sx={{
              "&:hover": {
                backgroundColor: "#3C51C5",
              },
            }}
            onClick={() => {
              if (!isClassJoinedDisabled) {
                props.onjoinMeeting(props.meeting);
              } else {
                if (isJoinClassDisabled(scheduleTime))
                  showNotification({
                    message: "You can join 10 minutes before the class",
                    color: "red",
                  });
                else if (props.meeting.isActive === false) {
                  showNotification({
                    message: "Class is not active",
                    color: "red",
                  });
                }
              }
            }}
            style={{
              opacity: isClassJoinedDisabled ? 0.5 : 1,
              background: isClassJoinedDisabled ? "#D3D3D3" : "#4B65F6",
              borderRadius: "30px",
              color: isClassJoinedDisabled ? "#000" : "#fff",
            }}
          >
            Join Class
          </Button>
        </Flex>
      </Stack>
    </Stack>
  );
}
