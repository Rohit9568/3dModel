import { Box, Button, Divider, Flex, Modal, Stack } from "@mantine/core";
import { useEffect, useState } from "react";
import { Filters } from "./Filters";

export enum FilterType {
  Type = "Type",
  Difficulty = "Difficulty",
}
export function FilterModal(props: {
  isModalOpened: boolean;
  setisModalOpened: (val: boolean) => void;
  onSubmit: (data: any) => void;
  filters: {
    questionType: string[];
    difficultyLevel: string[];
  };
}) {
  const [filters, setFilters] = useState<{
    questionType: string[];
    difficultyLevel: string[];
  }>({
    questionType: [],
    difficultyLevel: [],
  });

  useEffect(() => {
    setFilters(props.filters);
  }, [props.filters]);
  return (
    <Modal
      onClose={() => {
        props.setisModalOpened(false);
      }}
      opened={props.isModalOpened}
      title="Filters"
      styles={{
        title: {
          fontWeight: 700,
          fontSize: 20,
        },
      }}
      size="xl"
      centered
    >
      <Stack
        style={{
          color: "#F8F8F8",
        }}
        spacing={0}
      >
        <Divider color="#CFCFCF" size="md" />
        <Box h="50vh">
          <Filters filters={filters} setFilters={setFilters} />
        </Box>
        <Divider color="#CFCFCF" size="md" />
        <Flex justify="flex-end" mt={30}>
          <Button
            onClick={() => {
              props.setisModalOpened(false);
            }}
            variant="outline"
            ml={5}
            style={{
              border: "#808080 1px solid",
              color: "#000000",
            }}
            size="lg"
            radius={25}
            px={50}
            mr={15}
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              props.setisModalOpened(false);
              props.onSubmit(filters);
            }}
            color="white"
            radius={25}
            ml={5}
            size="lg"
            bg="#4B65F6"
            px={50}
          >
            Save
          </Button>
        </Flex>
      </Stack>
    </Modal>
  );
}
