import { Box, Flex, Footer, Stack, Text } from "@mantine/core";
import {
  IconExcercise,
  IconTeach,
  IconTestForFooter,
} from "../../components/_Icons/CustonIcons";
import { Pages } from "../../pages/_New/Teach";
import { Mixpanel } from "../../utilities/Mixpanel/MixpanelHelper";
import { WebAppEvents } from "../../utilities/Mixpanel/AnalyticeEventWebApp";

interface MobileFooterProps {
  currentPage: Pages;
  OnPageTabClick: (tab: Pages) => void;
}
export function MobileFooter(props: MobileFooterProps) {
  return (
    <Footer
      height="60px"
      w="100%"
    >
      <Flex
        style={{
          boxShadow: "0px -5px 5px 0px rgba(0, 0, 0, 0.1)",
          backgroundColor: "#ffffff",
        }}
        w="100%"
        justify="space-around"
        py={5}
      >
        <Stack
          spacing={0}
          justify="center"
          align="center"
          onClick={() => {
            props.OnPageTabClick(Pages.Teach);
            Mixpanel.track(WebAppEvents.TEACHER_APP_LEARN_CLICKED, {
              page: props.currentPage,
            });
          }}
          style={{ cursor: "pointer" }}
        >
          <Box h={32} w={32}>
            <IconTeach
              col={props.currentPage === Pages.Teach ? "#3174F3" : "black"}
            />
          </Box>
          <Text
            color={props.currentPage === Pages.Teach ? "#3174F3" : "black"}
            fz={12}
            fw={500}
          >
            Teach
          </Text>
        </Stack>
        <Stack
          spacing={0}
          justify="center"
          align="center"
          onClick={() => {
            props.OnPageTabClick(Pages.Exercise);
            Mixpanel.track(WebAppEvents.TEACHER_APP_PRACTICE_CLICKED, {
              page: props.currentPage,
            });
          }}
          style={{ cursor: "pointer" }}
        >
          <Box h={32} w={32}>
            <IconExcercise
              col={props.currentPage === Pages.Exercise ? "#3174F3" : "black"}
            />
          </Box>
          <Text
            color={props.currentPage === Pages.Exercise ? "#3174F3" : "black"}
            fz={12}
            fw={500}
          >
            Exercise
          </Text>
        </Stack>
        <Stack
          spacing={0}
          justify="center"
          align="center"
          onClick={() => {
            props.OnPageTabClick(Pages.Test);
            Mixpanel.track(WebAppEvents.TEACHER_APP_TEST_CLICKED, {
              page: props.currentPage,
            });
          }}
          style={{ cursor: "pointer" }}
        >
          <Box h={32} w={32}>
            <IconTestForFooter
              col={props.currentPage === Pages.Test ? "#3174F3" : "black"}
            />
          </Box>
          <Text
            color={props.currentPage === Pages.Test ? "#3174F3" : "black"}
            fz={12}
            fw={500}
          >
            Test
          </Text>
        </Stack>
      </Flex>
    </Footer>
  );
}
