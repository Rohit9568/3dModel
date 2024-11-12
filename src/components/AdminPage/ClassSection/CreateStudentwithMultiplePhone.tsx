import {
  Box,
  Button,
  Center,
  Flex,
  ScrollArea,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { IconBackArrow } from "../../_Icons/CustonIcons";
import { useState } from "react";
import { CreateStudent } from "../../../features/StudentSlice";
import { showNotification } from "@mantine/notifications";
import { Mixpanel } from "../../../utilities/Mixpanel/MixpanelHelper";
import { TeacherPageEvents } from "../../../utilities/Mixpanel/AnalyticeEventTeacherApp";
import { AdminPageEvents } from "../../../utilities/Mixpanel/AnalyticEventAdminApp";
import { IconMinus } from "@tabler/icons";
import { useMediaQuery } from "@mantine/hooks";

interface CreateStudentProps {
  name: string;
  parentName: string;
  phoneNumber: string[];
  onBack: () => void;
  instituteId: string;
  instituteClassId: string;
  openedFromAdminPage: boolean;
  isStudentAdd: boolean;
  onSubmitclick: (
    name: string,
    phoneNumber: string[],
    parentName: string
  ) => void;
}

export function AddNewStudent(props: CreateStudentProps) {
  const [nameValue, setNameValue] = useState<string>(props.name);
  const [parentNameValue, setParentNameValue] = useState<string>(
    props.parentName
  );
  const [phoneNumbers, setPhoneNumbers] = useState<string[]>(props.phoneNumber);
  const isMd = useMediaQuery(`(max-width: 500px)`);
  const isFormFilled = () => {
    for (let phoneNumber of phoneNumbers) {
      const isNumberValid = /^[6-9]\d{9}$/.test(phoneNumber);
      if (!isNumberValid) return false;
    }
    return (nameValue.trim().length!==0 && parentNameValue.trim().length!==0) ? true : false;
  };
  return (
    <ScrollArea w="100%" h="100%">
      <Stack mt={50} px={10} w="100%" h="100%">
        <Flex w={"100%"} direction="row" align="center" justify="space-evenly">
          <Box
            onClick={props.onBack}
            style={{
              backgroundColor: "#F8F8F8",
              borderRadius: "44px",
              width: "40px",
              height: "40px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              cursor: "pointer",
            }}
          >
            <Box w="60%" h="50%">
                <IconBackArrow col="black" />
              </Box>
          </Box>
          <Text fz={24} fw={700} size="xl" w={"95%"} ta={"center"}>
            {props.isStudentAdd ? "Add Student" : "Edit Student"}
          </Text>
        </Flex>

        <Box mt="md" w={"100%"}>
          <TextInput
            label="Name"
            placeholder="Enter name"
            value={nameValue}
            onChange={(event) => setNameValue(event.currentTarget.value)}
            // error={formErrors.name}
          />
        </Box>

        <Box w={"100%"}>
          <TextInput
            label="Parent's Name"
            placeholder="Enter parent's name"
            value={parentNameValue}
            onChange={(event) => setParentNameValue(event.currentTarget.value)}
            //   error={formErrors.parentName}
          />
        </Box>

        <Box
          w={"100%"}
          //   mt={-20}
        >
          {phoneNumbers.length > 0 &&
            phoneNumbers.map((x, i) => {
              return (
                <Flex
                  //   justify="center"
                  align="center"
                  w="100%"
                  pb={10}
                  pt={i === 0 ? 0 : 10}
                  // mt={-10}
                >
                  <TextInput
                    label={i === 0 ? "Phone no" : ""}
                    placeholder="Enter phone number"
                    value={x}
                    onChange={(event) => {
                      setPhoneNumbers((prev) => {
                        const prev1 = [...prev];
                        prev1[i] = event.target.value;
                        return prev1;
                      });
                    }}
                    w={i===0?"100%":isMd?"93%":"98%"}
                  />
                  {i !== 0 && (
                    <Box
                      w={isMd?25:30}
                      h={isMd?25:30}
                      sx={{
                        borderRadius: "50%",
                        backgroundColor: "#999999",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        cursor: "pointer",
                        "&:hover": {
                          backgroundColor: "red",
                        },
                        minHeight:25,
                        minWidth:25
                      }}
                      onClick={() => {
                        setPhoneNumbers((prev) => {
                          const prev1 = [...prev];
                          prev1.splice(i, 1);
                          return prev1;
                        });
                      }}
                      ml={15}
                    >
                      <Center w="100%" h="100%">
                        <IconMinus color="white" 
                        size={isMd?18:25}
                        />
                      </Center>
                    </Box>
                  )}
                </Flex>
              );
            })}
        </Box>
        <Flex 
          onClick={() => {
            setPhoneNumbers((prev) => [...prev, ""]);
          }}
          style={{
            cursor: "pointer",
          }}
          align="center"
        >
        <Box
            w={isMd?25:30}
            h={isMd?25:30}
            style={{
              borderRadius: "50%",
              backgroundColor: "#3FAD21",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              cursor: "pointer",

            }}
            mx={10}
          >
            <Text fz={isMd?21:25} fw={600} color="white">
              +
            </Text>
          </Box>
          <Text fz={15}
          color="#4B65F6"
          >Add Phone Number</Text>
          
        </Flex>

        <Flex w={"100%"} justify="flex-end" mt="md">
          <Button
            onClick={() => {
              if (isFormFilled())
                props.onSubmitclick(nameValue, phoneNumbers, parentNameValue);
                else{
                    showNotification({
                        message:'Enter Valid Form Details'
                    })
                }
            }}
            // disabled={loading}
            style={{
              backgroundColor: isFormFilled() ? "#3174F3" : "transparent",
              color: isFormFilled() ? "#ffffff" : "#A7A7A7",
              border: "1px solid #A7A7A7",
              cursor: isFormFilled() ? "pointer" : "default",
            }}
          >
            Submit
          </Button>
        </Flex>
      </Stack>
    </ScrollArea>
  );
}
