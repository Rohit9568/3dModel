import { Flex, Text } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { useNavigate } from "react-router-dom";

export function LoginPageFooter(props:{
  instituteName:string;
}) {
  const navigate = useNavigate();
  const isMd = useMediaQuery(`(max-width: 820px)`);

  return (
    <Flex justify="center" gap={isMd ? 15 : 20} fz={isMd ? 14 : 20} fw={700}>
      <Text
        onClick={() => {
          navigate(`/privacypolicy/${props.instituteName}`);
        }}
        underline
        style={{
          cursor: "pointer",
        }}
      >
        Privacy Policy
      </Text>
      <Text
        onClick={() => {
          navigate("/refundpolicy");
        }}
        underline
        style={{
          cursor: "pointer",
        }}
      >
        Refund Policy
      </Text>
      <Text
        onClick={() => {
          navigate("/termsofuse");
        }}
        underline
        style={{
          cursor: "pointer",
        }}
      >
        Terms of Use
      </Text>
    </Flex>
  );
}
