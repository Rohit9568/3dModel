import { Box, Button, Center, Stack, Text } from "@mantine/core";

interface EmptyListViewProps {
  emptyImage: string;
  emptyMessage: string;
  showButton: boolean;
  btnText?: string;
  onAddButtonClick?: () => void;
}

export function EmptyListView(props: EmptyListViewProps) {
  return (
    <Center h="50vh" w="100%">
      <Stack align="center" justify="center">
        <Box
          style={{
            backgroundColor: "#EEF4FF",
            borderRadius: "50%",
            height: 148,
            width: 148,
          }}
        >
          <Center h="100%" w="100%">
            <img src={props.emptyImage} width="50%" height="50%" />
          </Center>
        </Box>
        <Text color="#A4A4A4" fw={500}>
          {props.emptyMessage}
        </Text>
        {props.showButton && (
          <Button
            bga="#3174F3"
            style={{
              borderRadius: "20px",
            }}
            color="white"
            size="md"
            onClick={() => {
              props.onAddButtonClick!!();
            }}
          >
            {props.btnText}
          </Button>
        )}
      </Stack>
    </Center>
  );
}
