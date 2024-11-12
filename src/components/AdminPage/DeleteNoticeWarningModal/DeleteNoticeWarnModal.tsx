import { Button, Group, Stack, Text } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { DeleteNotice } from "../../../_parentsApp/features/noticeSlice";
import { Mixpanel } from "../../../utilities/Mixpanel/MixpanelHelper";
import { AdminPageEvents } from "../../../utilities/Mixpanel/AnalyticEventAdminApp";

interface DeleteNoticeWarningModalProps {
  setdeleteWarning: (val: string | null) => void;
  showDeleteWarning: string | null;
  ondeleteNotice: () => void;
}

export function DeleteNoticeWarningModal(props: DeleteNoticeWarningModalProps) {
  return (
    <Stack>
      <Text>Are you sure you want to delete this notice?</Text>
      <Group>
        <Button
          color="#909395"
          fz={16}
          fw={500}
          style={{
            border: "#909395 solid 1px",
            color: "#909395",
          }}
          variant="outline"
          size="lg"
          w="47%"
          onClick={() => {
            props.setdeleteWarning(null);
          }}
        >
          Cancel
        </Button>
        <Button
          style={{
            backgroundColor: "#FF0000",
            color: "white",
          }}
          size="lg"
          w="47%"
          fz={16}
          fw={500}
          onClick={() => {
            showNotification({
              message: "Notice Deleted",
            });
            DeleteNotice({ id: props.showDeleteWarning ?? "" })
              .then((data) => {
                Mixpanel.track(
                  AdminPageEvents.ADMIN_APP_HOME_PAGE_DELETE_NOTICE_SUCCESS
                );
                props.ondeleteNotice();
              })
              .catch((e) => {
                console.log(e);
              });
          }}
        >
          Yes,Delete it
        </Button>
      </Group>
    </Stack>
  );
}
