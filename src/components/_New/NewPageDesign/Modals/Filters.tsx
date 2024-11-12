import { Checkbox, Flex, Stack, Text, useMantineTheme } from "@mantine/core";
import { FilterType } from "./FilterModal";
import React, { useState } from "react";
import {
  allDifficultyLevels,
  allQuestionsTypes,
} from "../../../../@types/QuestionTypes.d";
import { useMediaQuery } from "@mantine/hooks";

export function Filters(props: {
  filters: {
    questionType: string[];
    difficultyLevel: string[];
  };
  setFilters: (
    val: React.SetStateAction<{
      questionType: string[];
      difficultyLevel: string[];
    }>
  ) => void;
}) {
  const [selectedFilterType, setSelectedFilterType] = useState<FilterType>(
    FilterType.Type
  );
  const theme = useMantineTheme();
  const isMd = useMediaQuery(`(max-width: ${theme.breakpoints.md}px)`);

  return (
    <Flex h="100%">
      <Stack
        w={isMd ? "120px" : "200px"}
        style={{
          backgroundColor: "#F8F8F8",
        }}
        spacing={0}
      >
        <Text
          fz={18}
          fw={500}
          py={30}
          style={{
            backgroundColor:
              selectedFilterType === FilterType.Type ? "#FFFFFF" : "#F8F8F8",
            borderLeft:
              selectedFilterType === FilterType.Type
                ? "5px solid #4B65F6"
                : "none",
            cursor: "pointer",
          }}
          px={20}
          onClick={() => setSelectedFilterType(FilterType.Type)}
          color="black"
        >
          Type
        </Text>
        <Text
          fz={18}
          fw={500}
          py={30}
          style={{
            backgroundColor:
              selectedFilterType === FilterType.Difficulty
                ? "#FFFFFF"
                : "#F8F8F8",
            borderLeft:
              selectedFilterType === FilterType.Difficulty
                ? "5px solid #4B65F6"
                : "none",
            cursor: "pointer",
          }}
          px={20}
          onClick={() => setSelectedFilterType(FilterType.Difficulty)}
          color="black"
        >
          Difficulty
        </Text>
      </Stack>
      <Stack px={30} py={30}>
        {selectedFilterType === FilterType.Type &&
          allQuestionsTypes.map((type) => {
            return (
              <Checkbox
                label={type.name}
                checked={props.filters.questionType.includes(type.type)}
                onChange={(val) => {
                  console.log(val.currentTarget.checked);
                  if (val.currentTarget.checked) {
                    props.setFilters((prev) => {
                      return {
                        ...prev,
                        questionType: [...prev.questionType, type.type],
                      };
                    });
                  } else {
                    props.setFilters((prev) => {
                      return {
                        ...prev,
                        questionType: prev.questionType.filter(
                          (x) => x !== type.type
                        ),
                      };
                    });
                  }
                }}
                styles={{
                  label: { fontSize: "18px" },
                }}
              />
            );
          })}
        {selectedFilterType === FilterType.Difficulty &&
          allDifficultyLevels.map((level) => {
            return (
              <Checkbox
                label={`${level[0]}${level.slice(1).toLowerCase()}`}
                checked={props.filters.difficultyLevel.includes(level)}
                onChange={(val) => {
                  if (val.currentTarget.checked) {
                    props.setFilters((prev) => {
                      return {
                        ...prev,
                        difficultyLevel: [...prev.difficultyLevel, level],
                      };
                    });
                  } else {
                    props.setFilters((prev) => {
                      return {
                        ...prev,
                        difficultyLevel: prev.difficultyLevel.filter(
                          (x) => x !== level
                        ),
                      };
                    });
                  }
                }}
                styles={{
                  label: { fontSize: "18px" },
                }}
              />
            );
          })}
      </Stack>
    </Flex>
  );
}
