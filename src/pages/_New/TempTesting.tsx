import { Button, Group, Text } from "@mantine/core";
import {
  GetOrderData,
  VerifyPayment,
} from "../../_parentsApp/features/paymentSlice";
import { showNotification } from "@mantine/notifications";
import { loadScript } from "../../utilities/HelperFunctions";
import { useState } from "react";
import { displayRazorpay } from "../../utilities/Payment";

export function TempTesting() {
  const [k, sk] = useState<boolean>(false);
  async function ggat(id: string) {
    await GetOrderData(id).then((data: any) => {
      displayRazorpay(
        {
          currency: data.order.currency,
          amount: data.order.amount,
          id: data.order.id,
        },
        () => {
          showNotification({ message: "Success" });
          sk(true);
        }
      );
    });
  }
  return (
    <>
      <Group m={30}>
        {!k && (
          <Button
            onClick={() => ggat("PPL-8e0d9dc0-9068-475d-8cf3-2aabf219812d")}
          >
            Basic
          </Button>
        )}
        {k && <Text>PAID(Refresh will reset)</Text>}
      </Group>
    </>
  );
}
