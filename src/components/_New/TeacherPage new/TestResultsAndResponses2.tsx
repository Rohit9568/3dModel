import { Box, Center, Flex, Select, Stack, Text } from "@mantine/core";
import { useEffect, useState } from "react";
import { fetchFullTestWithResults } from "../../../features/test/TestSlice";
import { AnalysedMCQ, AnalysedTopic } from "../Test/TestAnalysis";
import { AnalyzedResult } from "./AnalyzedResult";
import { TestResponses } from "./TestResponses";
import { TestScreen } from "../ContentTest";
import { IconArrowLeft } from "@tabler/icons";
import { useMediaQuery } from "@mantine/hooks";

interface TestResultAndResponses {
  testId: string;
  setIsLoading: (input: boolean) => void;
  onBackClick: () => void;
}

export function TestResultAndResponses2(props: TestResultAndResponses) {
  const isMd = useMediaQuery(`(max-width: 820px)`);
  const [testWithResponses, setTestWithResponses] = useState<any>();

  useEffect(() => {
    setTimeout(() => {
      if (typeof window?.MathJax !== "undefined") {
        window.MathJax.typesetClear();
        window.MathJax.typeset();
      }
    }, 500);
  }, [props.testId, testWithResponses]);
  useEffect(() => {
    fetchFullTestWithResults(props.testId, "RESPONSE")
      .then((data: any) => {
        setTestWithResponses(data);
      })
      .catch((error) => {
        console.log(error);
        props.setIsLoading(false);
      });
  }, []);

  return (
    <Stack w={isMd ? "100%" : "100%"}>
      <TestResponses test={testWithResponses} onBackClick={props.onBackClick} />
    </Stack>
  );
}
