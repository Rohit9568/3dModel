import { Button, Flex, Stack, Text, useMantineTheme } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";

export function GiftRedeemCard(props: {
  gift: InstituteGift;
  onRedeemClick: () => void;
  btnText: string;
  isDisabled: boolean;
}) {
  const theme = useMantineTheme();
  const isMd = useMediaQuery(`(max-width: ${theme.breakpoints.md}px)`);
  return (
    <Stack
      w="100%"
      style={{
        border: "1px solid #D3D3D3",
        borderRadius: 20,
      }}
      align="center"
      spacing={0}
    >
      <img src={props.gift.imageLink} width="50%" />
      <Stack px={isMd ? 20 : 30} py={isMd ? 20 : 25} w="100%" spacing={3}>
        <Text fw={700} fz={isMd ? 14 : 16}>
          {props.gift.title}
        </Text>
        <Flex gap={10} align="center">
          <img src={require("../../assets/coinImage.png")} width={20} />
          <Text color="#888888" fz={isMd ? 12 : 14}>
            {props.gift.points} Points
          </Text>
        </Flex>
        <Button
          bg="#4B65F6"
          size={isMd ? "md" : "lg"}
          onClick={() => {
            props.onRedeemClick();
          }}
          mt={20}
          sx={{
            "&:hover": {
              backgroundColor: "#4B65F6",
            },
            borderRadius: 10,
          }}
          disabled={props.isDisabled}
        >
          {props.btnText}
        </Button>
      </Stack>
    </Stack>
  );
}
