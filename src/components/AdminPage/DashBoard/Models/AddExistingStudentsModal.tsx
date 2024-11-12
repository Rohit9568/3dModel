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

interface AddExistingStudentsModal {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  studentList: StudentsDataWithBatch[];
  onAddStudentsClicked:(students:StudentsDataWithBatch[])=> void;
  preSelectedStudentId?:string
}



export const AddExistingStudentsModal: React.FC<AddExistingStudentsModal> = ({
  isOpen,
  setIsOpen,
  studentList,
  onAddStudentsClicked,
  preSelectedStudentId
}) => {

    const isMd = useMediaQuery(`(max-width: 820px)`);
    const [values, handlers] = useListState(studentList.sort(function(a, b){
      return b._id==preSelectedStudentId?-1:0
    }));
    const allChecked = values.every((value) => value.checked);
    const indeterminate = values.some((value) => value.checked) && !allChecked;
    const selectedStudents = values.filter((student)=>{ return student.checked == true});



  return (
    <>
      <Modal
        radius="sm"
        size= {isMd?"mdt":"md"}
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
        <Text color="#000000" size={20} fw={700}>Choose from Existing Students</Text>
        </Grid.Col>
        <Grid.Col span={1} mt={4}><IconX size={22} cursor="pointer" onClick={()=>{setIsOpen(false)}}/></Grid.Col>
        </Grid>
        <Text color="#808080" size={14} fw={400}> Selected Students: {selectedStudents.length}</Text>
        <Divider my="sm" />

          <Grid
            bg={"#E4EDFD"}
            grow
            mt={16}
          >
            <Grid.Col span={1}>
              <Checkbox 
              indeterminate={indeterminate}
              checked={allChecked}
              onChange={() =>
                handlers.setState((current) =>
                  current.map((value) => ({ ...value, checked: !allChecked })
            )
                )
              }
              />
            </Grid.Col>
            <Grid.Col span={4} ml={10}>
              <Text size={16}>Name</Text>
            </Grid.Col>
            <Grid.Col span={5} ml={10}>
              <Text size={16}>Phone Number</Text>
            </Grid.Col>
          </Grid>
          {
          values.map(
            (student,index) => {
            return (
              <Grid grow mt={20}>
                <Grid.Col span={1}>
                  <Checkbox 
                  checked={student.checked}
                  onChange={(event) => handlers.setItemProp(index, 'checked', event.currentTarget.checked)}
                  />
                </Grid.Col>
                <Grid.Col span={4} ml={10}>
                <Text  size={14} c={"#7D7D7D"}>{student.name}</Text>
                </Grid.Col>
                <Grid.Col span={5} ml={10}>
                <Text size={14}  c={"#7D7D7D"}>{student.phoneNumber[0]}</Text>
                </Grid.Col>
              </Grid>
            );
          }
        )
          }
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
              onClick={()=>{
                onAddStudentsClicked(selectedStudents)
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
                + Add Students
              </Text>
            </Button>
        </Flex>
        </Stack>
      </Modal>
    </>
  );
};
