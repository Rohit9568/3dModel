import { Box, Center, Flex, Group, Text } from "@mantine/core";
import { Pages } from "../../pages/_New/Teach";
import { Mixpanel } from "../../utilities/Mixpanel/MixpanelHelper";
import { WebAppEvents } from "../../utilities/Mixpanel/AnalyticeEventWebApp";
interface TopBarProps {
  currentPage: Pages;
  OnPageTabClick: (tab: Pages) => void;
}
interface PageTabsProps {
  name: string;
  pageTab: Pages;
  currentPage: Pages;
  OntabClick: (tab: Pages) => void;
}
function PageTab(props: PageTabsProps) {
  return (
    <>
      <Box
        onClick={() => props.OntabClick(props.pageTab)}
        bg={props.currentPage === props.pageTab ? "white" : "#3174F3"}
        c={props.currentPage === props.pageTab ? "#3174F3" : "white"}
        px={25}
        py={10}
        fw={500}
        w={120}
        style={{
          borderRadius: "20px 20px 0px 0px",
          borderColor: "#E9ECEF",
          borderWidth: "1px 1px 0px 1px",
          borderStyle: "solid",
        }}
      >
        <Center>
          <Text>{props.name}</Text>
        </Center>
      </Box>
    </>
  );
}
export function Topbar(props: TopBarProps) {
  return (
    <>
      <Box
        bg="#FFFFFF"
        style={{
          width: "100%",
          height: "100%",
          border: "1px solid rgba(233, 236, 239, 1)",
        }}
      >
        <Flex
          justify="flex-end"
          align="flex-end"
          direction="row"
          mr={100}
          gap={15}
          style={{ height: "101%" }}
        >
          <PageTab
            currentPage={props.currentPage}
            name="Teach"
            pageTab={Pages.Teach}
            OntabClick={(val) => {
              props.OnPageTabClick(val);
              Mixpanel.track(WebAppEvents.TEACHER_APP_LEARN_CLICKED, {
                page: Pages.Teach,
              });
            }}
          />
          <PageTab
            currentPage={props.currentPage}
            name="Exercise"
            pageTab={Pages.Exercise}
            OntabClick={(val) => {
              props.OnPageTabClick(val);
              Mixpanel.track(WebAppEvents.TEACHER_APP_PRACTICE_CLICKED, {
                page: Pages.Exercise,
              });
            }}
          />
          <PageTab
            currentPage={props.currentPage}
            name="Test"
            pageTab={Pages.Test}
            OntabClick={(val) => {
              props.OnPageTabClick(val);
              Mixpanel.track(WebAppEvents.TEACHER_APP_TEST_CLICKED, {
                page: Pages.Test,
              });
            }}
          />
        </Flex>
      </Box>
    </>
  );
}
