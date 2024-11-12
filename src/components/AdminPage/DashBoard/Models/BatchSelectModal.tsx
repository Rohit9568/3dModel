import {
  Button,
  Checkbox,
  Divider,
  Flex,
  Grid,
  Modal,
  Stack,
  Text,
} from "@mantine/core";
import { useListState, useMediaQuery } from "@mantine/hooks";
import { IconX } from "@tabler/icons";
import { useEffect } from "react";

interface BatchSelectModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  batchList: InstituteClass[];
  onBatchSelected: (students: InstituteClass[]) => void;
}

export const BatchSelectModal: React.FC<BatchSelectModalProps> = ({
  isOpen,
  setIsOpen,
  batchList,
  onBatchSelected,
}) => {
  const isMd = useMediaQuery(`(max-width: 820px)`);
  const [values, handlers] = useListState(
   batchList
  );
  const allChecked = values.every((value) => value.checked);
  const indeterminate = values.some((value) => value.checked) && !allChecked;
  const selectedBatches = values.filter((batch) => {
    return batch.checked == true;
  });

  useEffect(()=>{
console.log("hello");
  },[])

  return (
    <>
      <Modal
        radius="sm"
        size={isMd ? "mdt" : "md"}
        opened={isOpen}
        centered
        onClose={() => {
          setIsOpen(false);
        }}
        closeOnClickOutside={false}
        withCloseButton={false}
      >
        <Stack spacing={0}>
          <Grid grow align="center">
            <Grid.Col span={10}>
              <Text color="#000000" size={20} fw={700}>
                Select Batches
              </Text>
            </Grid.Col>
            <Grid.Col span={1} mt={4}>
              <IconX
                size={22}
                cursor="pointer"
                onClick={() => {
                  setIsOpen(false);
                }}
              />
            </Grid.Col>
          </Grid>
          <Text color="#808080" size={14} fw={400}>
            {" "}
            Selected Batches: {selectedBatches.length}
          </Text>
          <Divider my="sm" />

          <Grid bg={"#E4EDFD"} grow mt={16}>
            <Grid.Col span={1}>
              <Checkbox
                indeterminate={indeterminate}
                checked={allChecked}
                onChange={() =>
                  handlers.setState((current) =>
                    current.map((value) => ({ ...value, checked: !allChecked }))
                  )
                }
              />
            </Grid.Col>
            <Grid.Col span={4} ml={10}>
              <Text size={16}>Batch Name</Text>
            </Grid.Col>
          </Grid>

          {
          values.map((batch, index) => {
            return (
              <Grid grow mt={20}>
                <Grid.Col span={1}>
                  <Checkbox
                    checked={batch.checked}
                    onChange={(event) =>
                      handlers.setItemProp(
                        index,
                        "checked",
                        event.currentTarget.checked
                      )
                    }
                  />
                </Grid.Col>
                <Grid.Col span={4} ml={10}>
                  <Text size={14} c={"#7D7D7D"}>
                    {batch.name}
                  </Text>
                </Grid.Col>
              </Grid>
            );
          })}
          <Flex justify="flex-end" mt={28} pr={4}>
            <Button
              id="cancel-btn"
              onClick={() => {
                setIsOpen(false);
              }}
              size="md"
              style={{
                backgroundColor: "white",
                color: "black",
                border: "1px solid #808080",
                padding: "11px, 13px, 11px, 13px",
                borderRadius: "20px",
              }}
            >
              <Text fz={14} fw={700}>
                Cancel
              </Text>
            </Button>

            <Button
              onClick={() => {
                onBatchSelected(selectedBatches);
              }}
              py={5}
              style={{
                backgroundColor: "",
                borderRadius: "24px",
                marginLeft: "12px",
                cursor: "pointer",
              }}
              px={40}
              bg="#4B65F6"
              size="md"
              sx={{
                "&:hover": {
                  backgroundColor: "#4B65F6",
                },
              }}
            >
              <Text fz={14} fw={700}>
                Move to batches
              </Text>
            </Button>
          </Flex>
        </Stack>
      </Modal>
    </>
  );
};
