import { Button, Center, Flex, Group, Stack, Text } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import {
  LocalStorageKey,
  RemoveValueFromLocalStorage,
} from "../../utilities/LocalstorageUtility";

export function ErrorPage() {
  const isMd = useMediaQuery(`(max-width: 820px)`);
  return (
    <Center w="100vw" h="100vh">
      <Flex
        justify="center"
        align="center"
        w={isMd ? "85vw" : "60vw"}
        direction={isMd ? "column" : "row"}
      >
        <Stack
          spacing={25}
          style={{
            order: isMd ? 2 : 1,
          }}
        >
          <Group>
            <img
              src={require("../../assets/LOGO.png")}
              height={isMd ? 50 : 80}
              width={isMd ? 40 : 60}
            />
            <Text
              style={{
                color: "#000",
                fontSize: isMd ? "30px" : "40px",
                fontWeight: 700,
              }}
            >
              VIGNAM
            </Text>
          </Group>
          <Text
            style={{
              color: "#000",
              fontWeight: 700,
              fontSize: isMd ? 18 : 20,
            }}
          >
            404.
            <span
              style={{
                color: "#868686",
                fontWeight: 400,
              }}
            >
              That's an error
            </span>
          </Text>
          <Text fz={isMd ? 16 : 20}>
            We’re sorry. The page requested could not be found. Please reload
            this webpage.
          </Text>

          <Button
            size={isMd ? "md" : "lg"}
            style={{
              backgroundColor: "#3174F3",
            }}
            w={!isMd ? 200 : "100%"}
            onClick={() => {
              RemoveValueFromLocalStorage(LocalStorageKey.User);
              RemoveValueFromLocalStorage(LocalStorageKey.Token);
              RemoveValueFromLocalStorage(LocalStorageKey.UserType);
              window.location.href = "/";
            }}
            fz={18}
          >
            Reload
          </Button>
        </Stack>
        <img
          src={require("../../assets/errorPage.jpg")}
          width={isMd ? "80%" : "40%"}
          style={{
            aspectRatio: 1,
            order: isMd ? 1 : 2,
          }}
        />
      </Flex>
    </Center>
  );
}
