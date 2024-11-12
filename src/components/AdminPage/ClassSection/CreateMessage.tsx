import React, { useState } from "react";
import {
  Box,
  Text,
  Modal,
  Checkbox,
  Textarea,
  Button,
  Flex,
} from "@mantine/core";
import { IconTickMark } from "../../_Icons/CustonIcons";
// import { SendMessageUsingPhoneNumber } from "../../../features/SendMessageSlice";
import { useParams } from "react-router-dom";
import { Mixpanel } from "../../../utilities/Mixpanel/MixpanelHelper";
import { TeacherPageEvents } from "../../../utilities/Mixpanel/AnalyticeEventTeacherApp";
import { AdminPageEvents } from "../../../utilities/Mixpanel/AnalyticEventAdminApp";
import { SendMessageUsingPhoneNumber } from "../../../features/SendMessageSlice";

interface CreateMessageProps {
  reciepientName: string;
  opened: boolean;
  isTeacher: boolean;
  phoneNumber: string;
  onClose: () => void;
  openedFromAdminPage: boolean;
}

const CreateMessage = (props: CreateMessageProps) => {
  const [sendDefaulter, setSendDefaulter] = useState(true);
  const [sendCustom, setSendCustom] = useState(false);
  const [isUpdated, setIsUpdated] = useState(false);
  const [message, setMessage] = useState<string>("");
  const [defaulterMessage, setDefaulterMessage] = useState(
    "We've observed that your ward has been absent from classes recently. Consistent attendance greatly contributes to academic progress. Let's collaborate to ensure [his/her] success."
  );
  const [customMessage, setCustomMessage] = useState("");
  const [messageType, setMessageType] = useState<"defaulter" | "custom">(
    "defaulter"
  );
  const params = useParams<any>();
  const handleUpdateClick = () => {
    if (!props.openedFromAdminPage) {
      Mixpanel.track(
        TeacherPageEvents.TEACHERS_APP_STUDENTS_PAGE_UPDATE_BUTTON_CLICK
      );
    } else if (props.openedFromAdminPage) {
      if (props.isTeacher) {
        Mixpanel.track(
          AdminPageEvents.ADMIN_APP_TEACHERS_PAGE_UPDATE_BUTTON_CLICK
        );
      } else if (!props.isTeacher) {
        Mixpanel.track(
          AdminPageEvents.ADMIN_APP_STUDENTS_PAGE_UPDATE_BUTTON_CLICK
        );
      }
    }
    setIsUpdated(true);
    // Call sendhandler with the appropriate message based on messageType
    const selectedMessage =
      messageType === "defaulter" ? defaulterMessage : customMessage;
    sendhandler(selectedMessage);
  };
  const handleDefaultCheckBox = () => {
    // setSendDefaulter(!sendDefaulter);
    // setSendCustom(!sendCustom);
  };
  const handleCustomCheckBox = () => {
    setSendDefaulter(!sendDefaulter);
    setSendCustom(!sendCustom);
  };
  function sendhandler(messageToSend: string) {
    // Use the schoolName obtained from useParams
    const instituteName = params.Institutename;

    SendMessageUsingPhoneNumber({
      studentName: props.reciepientName,
      phoneNumber: props.phoneNumber,
      instituteName: instituteName || "",
    })
      .then((x: any) => {
        // Handle success if needed
      })
      .catch((e) => {
        console.log(e);
      });
  }

  return (
    <Modal
      opened={props.opened}
      onClose={props.onClose}
      title={props.reciepientName}
      style={{ zIndex: 9999 }}
      fw={500}
      fz={18}
      centered
    >
      {isUpdated ? (
        <Box>
          <center>
            <Flex
              bg={"#14FF00"}
              style={{ borderRadius: "50%", width: "80px", height: "80px" }}
              align="center"
              justify="center"
            >
              <IconTickMark col="white"></IconTickMark>
            </Flex>
            <Text mt={14} c={"#14FF00"} fz={16}>
              Message Send
            </Text>
            <Text mt={8} c={"#CBCBCB"} fz={12}>
              Click close button to close the tab
            </Text>
            <Button mt={51} w={"100%"} onClick={props.onClose}>
              Close
            </Button>
          </center>
        </Box>
      ) : (
        <>
          <Flex direction={"column"} gap={"md"}>
            {!props.isTeacher && (
              <>
                {/* <Checkbox
                  checked={sendDefaulter}
                  onChange={handleDefaultCheckBox}
                  c={"blue"}
                  label={"Send Defaulter Message"}
                ></Checkbox> */}
                <Textarea
                  minRows={4}
                  value={defaulterMessage}
                  onChange={(event) =>
                    setDefaulterMessage(event.currentTarget.value)
                  }
                  disabled={true}
                />
              </>
            )}
            {/* {props.isTeacher ? (
              <>
                <Text fz={16}>Send custom message</Text>
                <Textarea
                  minRows={4}
                  value={customMessage}
                  onChange={(event) =>
                    setCustomMessage(event.currentTarget.value)
                  }
                />
              </>
            ) : (
              <>
                <Checkbox
                  checked={sendCustom}
                  onChange={handleCustomCheckBox}
                  label={"Send Custom Message"}
                ></Checkbox>
                <Textarea
                  minRows={4}
                  value={customMessage}
                  onChange={(event) =>
                    setCustomMessage(event.currentTarget.value)
                  }
                  disabled={!sendCustom}
                />
              </>
            )} */}
          </Flex>
          <Flex
            mt={10}
            gap={"md"}
            justify={"center"}
            style={{ border: "red solid px" }}
          >
            <Button
              variant="white"
              style={{
                border: "1px solid #3174F3",
                borderRadius: "4px",
                // color: "#3174F3",
                width: "100%",
                height: "45px",
              }}
              onClick={props.onClose}
            >
              Cancel
            </Button>
            <Button
              bg={"#3174F3"}
              style={{
                border: "1px solid #3174F3",
                borderRadius: "4px",
                width: "100%",
                height: "45px",
              }}
              onClick={handleUpdateClick}
            >
              Submit
            </Button>
          </Flex>
        </>
      )}
    </Modal>
  );
};

export default CreateMessage;
