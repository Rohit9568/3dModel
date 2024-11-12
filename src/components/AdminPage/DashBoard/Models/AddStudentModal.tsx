import { Button, Center, Flex, Modal, SimpleGrid, Stack,Text } from "@mantine/core"
import { useState } from "react"

interface AddStudentModalProps {
    isOpen:boolean;
    setIsOpen: (isOpen:boolean)=>void
    onNextButtonClicked:(selectedIndex:number)=>void
  }
  
  export const AddStudentModal: React.FC<AddStudentModalProps> = ({isOpen,setIsOpen,onNextButtonClicked}) => {

    const [selectedItemIndex,setSelectedItemIndex] = useState<number>(0);

      return <>
        <Modal
              radius="sm"
              size="mdt"
              opened={isOpen}
              title="Add Student"
              centered
            onClose= { ()=>{
              setIsOpen(false);
            } }
            closeOnClickOutside ={false}
            >
          <Stack spacing={8} justify="flex-end">
              <Flex
                direction="row"
                style={{
                  marginTop: "20px",
                  marginLeft:"4px"
                }}
                align="center"
              >
                  <Stack
                    key={0}
                    style={{
                      border:
                        selectedItemIndex === 0
                          ? "1px solid blue"
                          : "1px solid #808080",
                      backgroundColor:
                        selectedItemIndex === -1
                          ? "transparent"
                          : selectedItemIndex === 0
                          ? "#EFF1FE"
                          : "transparent",
                      cursor: "pointer",
                      borderRadius: "10px",
                      
                    }}
                    onClick={() =>{setSelectedItemIndex(0)} }
                    spacing={5}
                    mr={15}
                    w="145px"
                    h="172px"
                    justify="center"
                     align="center"
                  >
                    <img
                      src={require("../../../../assets/addNewStudent.png")}
                      width="64px"
                      height="64px"
                    />
                   <Text mx={24} size={12} fw={400} mt={8}> Add new student</Text>
                  </Stack>

                  <Stack
                    key={0}
                    style={{
                      border:
                        selectedItemIndex === 1
                          ? "1px solid blue"
                          : "1px solid #808080",
                      backgroundColor:
                        selectedItemIndex === -1
                          ? "transparent"
                          : selectedItemIndex === 1
                          ? "#EFF1FE"
                          : "transparent",
                      cursor: "pointer",
                      borderRadius: "10px",
                    }}
                    onClick={() =>{ setSelectedItemIndex(1)} }
                    align="center"
                    spacing={5}
                    justify="center"
                    w="145px"
                    h="172px"
                  >
                    <img
                      src={require("../../../../assets/chooseFromExisting.png")}
                      width="64px"
                      height="64px"
                    />
                    <Text  size={12} fw={400} mt={8}> Add Existing Student</Text>
                  </Stack>

              </Flex>

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
                setIsOpen(false);
                onNextButtonClicked(selectedItemIndex)
              }}
              py={5}
              style={{
                backgroundColor: "",
                borderRadius: "20px",
                marginLeft: "8px",
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
                Next
              </Text>
            </Button>
        </Flex>
              </Stack>

              </Modal>
              </>
        }



