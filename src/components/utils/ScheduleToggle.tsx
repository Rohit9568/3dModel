import { Button, Flex, Radio } from "@mantine/core";

export function ScheduleToggle(props: {
  isFirstEnabled: boolean;
  setisFirstEnabled: (val: boolean) => void;
  firstLabel: string;
  secondLabel: string;
}) {
  return (
    <Flex justify="space-between" mt={10}>
      <Button
        onClick={() => props.setisFirstEnabled(true)}
        variant={props.isFirstEnabled ? "outline" : "outline"}
        bg={props.isFirstEnabled ? "#E4E7F6" : ""}
        w="49%"
        sx={{
          "&:hover": {
            backgroundColor: "#E4E7F6",
            color: "#4B65F6",
          },
        }}
        p={0}
        style={{
          border: "#4B65F6 1px solid",
          color: props.isFirstEnabled ? "#4B65F6" : "#808080",
        }}
      >
        <Radio color="indigo" checked={props.isFirstEnabled} mr={10} />
        {props.firstLabel}
      </Button>
      <Button
        onClick={() => props.setisFirstEnabled(false)}
        variant={!props.isFirstEnabled ? "outline" : "outline"}
        bg={!props.isFirstEnabled ? "#E4E7F6" : ""}
        w="49%"
        sx={{
          "&:hover": {
            backgroundColor: "#E4E7F6",
            color: "#4B65F6",
          },
        }}
        p={0}
        style={{
          border: "#4B65F6 1px solid",
          color: !props.isFirstEnabled ? "#4B65F6" : "#808080",
        }}
      >
        <Radio color="indigo" checked={!props.isFirstEnabled} mr={10} />
        {props.secondLabel}
      </Button>
    </Flex>
  );
}
