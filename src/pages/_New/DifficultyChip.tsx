import { Center, Text } from "@mantine/core";
import {
  DifficultyLevel,
  getColorForDiffuclityType,
} from "../../@types/QuestionTypes.d";
import { useMediaQuery } from "@mantine/hooks";

const array1 = [
  {
    name: DifficultyLevel.EASY,
    backgroundColor: "#FFDCDC",
    color: "#D48D8D",
  },
  {
    name: DifficultyLevel.MEDIUM,
    backgroundColor: "#DDEDFD",
    color: "#3976CA",
  },
  {
    name: DifficultyLevel.MOCKTEST,
    backgroundColor: "#DDEDFD",
    color: "#3976CA",
  },
  {
    name: DifficultyLevel.HARD,
    backgroundColor: "#E2F8E8",
    color: "#62A976",
  },
];

function getColor(val: string) {
  const found = array1.find((x) => x.name === val);
  if (found) return found;
  return null;
}

export function DifficultyChip(props: { difficultyLevel: DifficultyLevel }) {
  const isMd = useMediaQuery(`(max-width: 820px)`);
  const color = getColor(props.difficultyLevel ?? "")
    ? getColor(props.difficultyLevel ?? "")?.backgroundColor
    : "black";
  return (
    <span
      style={{
        background: getColor(props.difficultyLevel)
          ? getColor(props.difficultyLevel)?.backgroundColor
          : "black",
        padding: isMd ? "3px 7px" : "5px 20px",
        borderRadius: "5px",
        color: getColor(props.difficultyLevel)
          ? getColor(props.difficultyLevel)?.color
          : "black",
        border: `1px solid ${color}`,
        fontSize: isMd ? 12 : 14,
      }}
    >
      {`${props.difficultyLevel[0]}${props.difficultyLevel
        .toLowerCase()
        .slice(1, props.difficultyLevel.length)}`}
    </span>
  );
}
