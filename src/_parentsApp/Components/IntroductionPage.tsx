import { Divider, Flex, ScrollArea, Stack, Text } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { reduceImageScaleAndAlignLeft } from "../../utilities/HelperFunctions";

interface IntroductionPageProps {
  introduction: string;
  topics: SingleTopic[];
  onTopicClick: (data: string) => void;
}
export function IntroductionPage(props: IntroductionPageProps) {
  const isMd = useMediaQuery(`(max-width: 820px)`);
  return (
    <Flex h="100%" w="100%">
      {/* <Stack
        style={{
          border: "1px solid rgba(133, 150, 181, 0.35)",
          borderRadius: "10px",
        }}
        pl={14}
        h="100%"
        px={20}
        display={isMd ? "none" : "block"}
      >
        <Text
          color="#03183D"
          fz={isMd ? 18 : 24}
          fw={600}
          mt={isMd ? 3 : 10}
          mb={isMd ? 3 : 15}
        >
          Topics
        </Text>
        <ScrollArea h={isMd ? "16vh" : "100%"} mb={3}>
          {props.topics.map((x, i) => {
            return (
              <Flex mb={5} key={x._id}>
                <Text
                  color="#3174F3"
                  fz={16}
                  fw={400}
                  w="10%"
                  onClick={() => props.onTopicClick(x._id)}
                  style={{
                    cursor: "pointer",
                  }}
                >
                  {i + 1}.
                </Text>
                <Text
                  color="#3174F3"
                  fz={16}
                  fw={400}
                  onClick={() => props.onTopicClick(x._id)}
                  style={{
                    cursor: "pointer",
                  }}
                  sx={{
                    "&:hover": {
                      textDecoration: "underline",
                    },
                  }}
                >
                  {x.name}
                </Text>
              </Flex>
            );
          })}
        </ScrollArea>
      </Stack> */}
      <Stack px={10}>
        <Stack spacing={2}>
          <Divider color="#03183D" size="md" />
          <Text fz={30} fw={600}>
            Introduction
          </Text>
          <Divider color="#03183D" size="md" />
        </Stack>
        <Text
          style={{
            fontSize: isMd ? "12px" : "16px",
          }}
          fw={400}
          color="#3D3D3D"
          ta={"justify"}
        >
          {isMd && (
            <Text>
              <div
                dangerouslySetInnerHTML={{
                  __html:
                    reduceImageScaleAndAlignLeft(props.introduction) ?? "",
                }}
              />
            </Text>
          )}
          {!isMd && (
            <Text>
              <div
                dangerouslySetInnerHTML={{
                  __html: props.introduction ?? "",
                }}
              />
            </Text>
          )}
        </Text>
      </Stack>
    </Flex>
  );
}
