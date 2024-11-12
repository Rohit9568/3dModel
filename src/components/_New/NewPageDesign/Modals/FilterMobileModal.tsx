import { Box, Button, Divider, Drawer, Flex, Stack, Text } from "@mantine/core";
import { useEffect, useState } from "react";
import { Filters } from "./Filters";
import { IconChevronLeft } from "@tabler/icons";
export function FilterMobileModal(props: {
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
    <Drawer
      size="100%"
      opened={props.isModalOpened}
      onClose={() => {
        props.setisModalOpened(false);
      }}
      withCloseButton={false}
    >
      <Stack spacing={0}>
        <Stack
          style={{
            display: "fixed",
          }}
          pt={10}
        >
          <Flex justify="space-between" align="center" px={10}>
            <Flex align="center">
              <IconChevronLeft
                onClick={() => {
                  props.setisModalOpened(false);
                }}
              />
              <Text fz={16} fw={500}>
                Filters
              </Text>
            </Flex>
            <Text
              fz={16}
              fw={500}
              onClick={() => {
                setFilters({
                  questionType: [],
                  difficultyLevel: [],
                });
              }}
            >
              Clear Filter
            </Text>
          </Flex>
          <Divider color="#CFCFCF" size="xs" />
        </Stack>
        <Box h="100vh">
          <Filters filters={filters} setFilters={setFilters} />
        </Box>
        <Stack
          style={{
            position: "fixed",
            bottom: 0,
            width: "100%",
            backgroundColor: "#F8F8F8",
            boxShadow: "0px -10px 9px 0px #0000000A",
            border: "1px solid #E9ECEF",
          }}
          px={20}
          py={20}
        >
          <Button
            w="100%"
            bg="#4B65F6"
            onClick={() => {
              props.onSubmit(filters);
              props.setisModalOpened(false);
            }}
            size="lg"
          >
            Apply
          </Button>
        </Stack>
      </Stack>
    </Drawer>
  );
}
