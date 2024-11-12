import {
  Box,
  Divider,
  Flex,
  Stack,
  Text,
  Button,
  ScrollArea,
} from "@mantine/core";
import { IconX } from "@tabler/icons";
import { IconCheck, IconShareCustom } from "../_Icons/CustonIcons";
import { Fragment, useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { useMediaQuery } from "@mantine/hooks";
import { getWebsiteLink } from "../../utilities/HelperFunctions";

interface PreRequisiteModalProps {
  onClose: () => void;
  currentChapterData: SingleChapter;
  onShareClick: () => void;
  onViewTestClick: () => void;
  onReportClick: () => void;
  testId: string;
}

export function PreRequisiteModal(props: PreRequisiteModalProps) {
  const isMd = useMediaQuery(`(max-width: 820px)`);
  const [isShareClick, setisShareClick] = useState<boolean>(false);
  const shareLink = `${getWebsiteLink(window.location.href)}/student/test/${
    props.testId
  }`;
  const objectives = props.currentChapterData.objectives;
  return (
    <Flex
      direction={"column"}
      style={{
        position: "relative",
      }}
      // h={isMd ? "70vh" : "95vh"}
      h={"100%"}
    >
      <Flex
        style={{
          border: "#FFF solid 2px",
          position: "absolute",
          right: 15,
          top: 10,
          height: isMd ? 20 : 40,
          width: isMd ? 20 : 40,
          borderRadius: 4,
          cursor: "pointer",
        }}
        justify="center"
        align="center"
        onClick={() => props.onClose()}
      >
        <IconX height="70%" width="70%" color="#FFFFFF" />
      </Flex>
      <Flex
        sx={{
          backgroundColor: "#FDC00F",
          borderRadius: 8,
        }}
        // h="270px"
        align="center"
      >
        <Flex
          w={"50%"}
          justify="center"
          align="end"
          // h="100%"
        >
          <img
            src={require("../../assets/prereqimage2.png")}
            width="100%"
            style={{
              aspectRatio: 1.6,
            }}
          />
        </Flex>
        <Stack w="50%">
          <Text color="#FFFFFF" fw={600} fz={isMd ? 11 : 23}>
            Pre Requiste Test
          </Text>
          <Text color="#000000" fz={isMd ? 8 : 14} fw={500}>
            Assess your students' knowledge level through a pre-requisite test
            and begin teaching from the most suitable starting point based on
            their abilities and understanding.
          </Text>
        </Stack>
      </Flex>
      <Stack px={31}>
        <Flex direction="column">
          <Text color="#000000" fz={isMd ? 11 : 23} pt={10} fw={500} mb={7}>
            Objectives
          </Text>
          <Divider size="md"></Divider>
          <ScrollArea h={"35vh"}>
            {objectives.map((x, i) => {
              return (
                <Fragment key={i}>
                  <Flex justify="space-between" my={7}>
                    <Box h={isMd ? 10 : 20} w={isMd ? 13 : 23}>
                      <IconCheck />
                    </Box>
                    <Text fz={isMd ? 12 : 16} fw={400} color="#000" w="95%">
                      {x}
                    </Text>
                  </Flex>
                  <Divider size="md"></Divider>
                </Fragment>
              );
            })}
          </ScrollArea>
        </Flex>
      </Stack>
      {!isShareClick && (
        <Flex justify="right" mr={31} my={25}>
          <Button
            size={isMd ? "sm" : "md"}
            bg="#3174F3"
            fz={isMd ? 12 : 19}
            fw={500}
            mr={10}
            onClick={() => {
              props.onViewTestClick();
              props.onClose();
            }}
          >
            View Test
          </Button>
          {props.currentChapterData?.chapterPreTestsStatus.testTaken ===
            true && (
            <Button
              size={isMd ? "sm" : "md"}
              mx={11}
              bg="#3174F3"
              fz={isMd ? 12 : 19}
              fw={500}
              onClick={() => {
                props.onReportClick();
                props.onClose();
              }}
            >
              Report
            </Button>
          )}

          <Button
            size={isMd ? "sm" : "md"}
            mr={9}
            leftIcon={
              <Box w={20} h={22}>
                <IconShareCustom />
              </Box>
            }
            bg="#3174F3"
            fz={isMd ? 12 : 19}
            fw={500}
            onClick={() => {
              setisShareClick(true);
            }}
          >
            Share
          </Button>
        </Flex>
      )}
      {isShareClick && (
        <Flex
          justify="space-between"
          // mr={31}
          my={25}
          style={{
            border: "2px solid #B1B1B1",
            borderRadius: "14px",
          }}
          py={10}
          px={10}
          mx={isMd ? 8 : 32}
          align={"center"}
        >
          <Text color="#3D3D3D" fz={isMd ? 12 : 20} fw={400}>
            {shareLink}
          </Text>
          <Flex align={"center"}>
            <CopyToClipboard
              text={shareLink}
              onCopy={() => {
                props.onShareClick();
              }}
            >
              <Button
                size={isMd ? "sm" : "md"}
                mx={11}
                bg="#3174F3"
                fz={isMd ? 10 : 17}
                fw={500}
              >
                Copy
              </Button>
            </CopyToClipboard>
            <Button
              size={isMd ? "sm" : "md"}
              mr={9}
              bg="#3174F3"
              fz={isMd ? 10 : 17}
              fw={500}
              onClick={() => {
                props.onReportClick();
                props.onClose();
              }}
            >
              Report
            </Button>
          </Flex>
        </Flex>
      )}
    </Flex>
  );
}
