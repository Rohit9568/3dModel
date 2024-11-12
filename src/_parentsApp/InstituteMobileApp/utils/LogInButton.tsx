import { Button, Flex } from "@mantine/core";

export function LoginButton(props: {
  onClick: () => void;
  text: string;
  disabled: boolean;
}) {
  return (
    <Flex justify="center" w="100%">
      <Button
        bg="#4B65F6"
        size="lg"
        w="90%"
        onClick={() => {
          props.onClick();
        }}
        disabled={props.disabled}
      >
        {props.text}
      </Button>
    </Flex>
  );
}
