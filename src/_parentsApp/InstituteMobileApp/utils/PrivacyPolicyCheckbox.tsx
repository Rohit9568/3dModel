import { Checkbox, Flex, Text } from "@mantine/core";

export function PrivacypolicyChecked(props: {
  isConditionsAccepted: boolean;
  setIsConditionsAccepted: (val: boolean) => void;
  instituteName:string;
}) {
  return (
    <Flex>
      <Checkbox
        onChange={(e) => {
          props.setIsConditionsAccepted(e.currentTarget.checked);
        }}
        checked={props.isConditionsAccepted}
        label={
          <Text>
            I agree to the{" "}
            <span
              onClick={() => {
                window.open("/termsofuse", "_blank");
              }}
              style={{
                color: "#4B65F6",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Terms of Use{" "}
            </span>
            and the{" "}
            <span
              onClick={() => {
                window.open(`/privacypolicy/${props.instituteName}`, "_blank");
              }}
              style={{
                color: "#4B65F6",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Privacy Policy
            </span>
          </Text>
        }
      />
    </Flex>
  );
}
