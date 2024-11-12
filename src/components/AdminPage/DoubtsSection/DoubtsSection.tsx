import {
  Box,
  Button,
  Flex,
  ScrollArea,
  SimpleGrid,
  Stack,
  Text,
  Textarea,
} from "@mantine/core";
import { IconCheck } from "@tabler/icons";
import { useState } from "react";
import { SendDoubt } from "../../../_parentsApp/features/doubtsSlice";
import { useMediaQuery } from "@mantine/hooks";
import { Mixpanel } from "../../../utilities/Mixpanel/MixpanelHelper";
import { TeacherPageEvents } from "../../../utilities/Mixpanel/AnalyticeEventTeacherApp";
import { AdminPageEvents } from "../../../utilities/Mixpanel/AnalyticEventAdminApp";

interface SingleDoubtProps {
  doubt: Doubt;
  onUpdateDoubts: (data: Doubt) => void;
  instituteName: string;
  openedFromAdminPage: boolean;
}
function SingleDoubt(props: SingleDoubtProps) {
  const [isReplyClicked, setisReplyClicked] = useState<boolean>(false);
  const [reply, setReply] = useState<string>("");
  function sendhandler() {
    // if (props.openedFromAdminPage) {
    //   Mixpanel.track(AdminPageEvents.ADMIN_APP_DOUBTS_PAGE_SEND_BUTTON_CLICK);
    // } else if (!props.openedFromAdminPage) {
    //   Mixpanel.track(
    //     TeacherPageEvents.TEACHER_APP_DOUBTS_PAGE_SEND_BUTTON_CLICK
    //   );
    // }
    // setisReplyClicked(false);
    // SendDoubt({
    //   id: props.doubt._id,
    //   reply,
    //   phoneNumber: props.doubt.phoneNumber,
    //   instituteName: props.instituteName,
    // })
    //   .then((x: any) => {
    //     if (props.openedFromAdminPage) {
    //       Mixpanel.track(
    //         AdminPageEvents.ADMIN_APP_DOUBTS_PAGE_MESSAGE_SEND_SUCCESS
    //       );
    //     } else if (!props.openedFromAdminPage) {
    //       Mixpanel.track(
    //         TeacherPageEvents.TEACHER_APP_DOUBTS_PAGE_MESSAGE_SEND_SUCCESS
    //       );
    //     }
    //     props.onUpdateDoubts(x);
    //   })
    //   .catch((e) => {
    //     console.log(e);
    //   });
  }
  return (
    <Stack
      style={{
        boxShadow: "0px 0px 4px 0px rgba(0, 0, 0, 0.25)",
        borderRadius: "10px",
      }}
      spacing={3}
    >
      <Flex w={"100%"} justify="space-between" align="center" px={5}>
        <Text w={"60%"} fz={13} fw={600} color="#595959" py={10}>
          {props.doubt.description}
        </Text>
        {props.doubt.reply !== null && (
          <Box
            w={"40%"}
            style={{
              border: "1px solid #CBFFB8",
              borderRadius: "8px",
              backgroundColor: "#42FF00",
              width: "100px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
            h="50px"
            my={5}
          >
            <IconCheck color="white" height="40px" width="50px" />
          </Box>
        )}
        {!isReplyClicked && props.doubt.reply === null && (
          <Button
            w={"40%"}
            variant={!isReplyClicked ? "outline" : "filled"}
            style={{
              borderRadius: "10px",
              border: "1px solid #3174F3",
              width: "100px",
              backgroundColor: props.doubt.reply === null ? "white" : "#CBFFB8",
            }}
            size="lg"
            color="#3174F3"
            fz={14}
            onClick={() => {
              if (props.openedFromAdminPage) {
                Mixpanel.track(
                  AdminPageEvents.ADMIN_APP_DOUBTS_PAGE_REPLY_BUTTON_CLICK,
                  { doubts_id: props.doubt._id }
                );
              } else if (!props.openedFromAdminPage) {
                Mixpanel.track(
                  TeacherPageEvents.TEACHER_APP_DOUBTS_PAGE_REPLY_BUTTON_CLICK,
                  { doubts_id: props.doubt._id }
                );
              }
              setisReplyClicked(true);
            }}
            my={5}
          >
            {props.doubt.reply === null && `Reply`}
          </Button>
        )}
      </Flex>
      {isReplyClicked && (
        <Stack>
          <Textarea
            placeholder="Type something here.."
            value={reply}
            onChange={(e) => setReply(e.target.value)}
          />
          <Flex justify="space-between">
            <Button
              w="49%"
              variant="outline"
              size="lg"
              fz={13}
              onClick={() => {
                if (props.openedFromAdminPage) {
                  Mixpanel.track(
                    AdminPageEvents.ADMIN_APP_DOUBTS_PAGE_CANCEL_BUTTON_CLICK
                  );
                } else if (!props.openedFromAdminPage) {
                  Mixpanel.track(
                    TeacherPageEvents.TEACHER_APP_DOUBTS_PAGE_CANCEL_BUTTON_CLICK
                  );
                }
                setisReplyClicked(false);
              }}
              mx={10}
              my={5}
            >
              Cancel
            </Button>
            <Button
              w="49%"
              size="lg"
              bg={"#3174F3"}
              fz={13}
              onClick={sendhandler}
              mx={10}
              my={5}
            >
              Send
            </Button>
          </Flex>
        </Stack>
      )}
    </Stack>
  );
}
interface DoubtSectionProps {
  openedFromAdminPage: boolean;
  doubts: Doubt[];
  onUpdateDoubt: (data: Doubt) => void;
  instituteName: string;
}
export function DoubtsSection(props: DoubtSectionProps) {
  const isMd = useMediaQuery(`(max-width: 500px)`);

  return (
    <Box>
      <Text ta="center" color="#303030" fz={24} fw={700} td="underline">
        Doubts
      </Text>
      <ScrollArea
        mx={2}
        style={{
          height: "80vh",
          overflowY: "auto",
        }}
      >
        <Box mx={2} mt={10} py={10}>
          <SimpleGrid cols={isMd ? 1 : 2}>
            {props.doubts.map((x) => {
              return (
                <SingleDoubt
                  key={x._id}
                  openedFromAdminPage = {props.openedFromAdminPage}
                  doubt={x}
                  onUpdateDoubts={props.onUpdateDoubt}
                  instituteName={props.instituteName}
                />
              );
            })}
          </SimpleGrid>
        </Box>
      </ScrollArea>
    </Box>
  );
}
