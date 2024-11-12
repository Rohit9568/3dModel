import {
  Text,
  Grid,
  Group,
  createStyles,
  Flex,
  useMantineTheme,
  CheckIcon,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";

import { IconCheck, IconSquare, IconSquareCheck } from "@tabler/icons";
import style from "./MultiplechipSelect.module.css";
import { SubjecIcon } from "./SubjectsIcon";
import { useState } from "react";
const useStyles = createStyles((theme) => ({
  check: {
    [theme.fn.smallerThan("md")]: {
      display: "none",
    },
  },
}));
interface SingleChipProps {
  value: {
    name: string;
    [key: string]: any;
  };
  onSelect: (
    val: {
      name: string;
      [key: string]: any;
    }[]
  ) => void;
  selectedValues: {
    name: string;
    [key: string]: any;
  }[];
  matchValue: string;
  isIconPresent?: boolean;
  isSenior?: boolean;
  setGlobalValue?: (change: number) => void;
  globalValues?: number;
  maxCount: number;
}
function SingleChip(props: SingleChipProps) {
  const { classes } = useStyles();
  const theme = useMantineTheme();

  const fz = {
    [theme.breakpoints.lg]: 25,
    [theme.breakpoints.sm]: 20,
  };
  const isMd = useMediaQuery(`(max-width: ${theme.breakpoints.md}px)`);

  const handleSelect = () => {
    const found = props.selectedValues.find(
      (x) => x[`${props.matchValue}`] === props.value[`${props.matchValue}`]
    );
    // if (props.maxCount) {
    //   if (props.globalCount < props.maxCount) {
    //     if (!found) {
    //       props.onSelect([props.value, ...props.selectedValues]);

    //       props.handleGlobalChange(1);
    //     } else {
    //       const found = props.selectedValues.filter((x) => {
    //         return (
    //           x[`${props.matchValue}`] !== props.value[`${props.matchValue}`]
    //         );
    //       });
    //       props.onSelect(found);
    //       props.handleGlobalChange(-1);
    //     }
    //   } else if (props.globalCount >= props.maxCount && found) {
    //     const found = props.selectedValues.filter((x) => {
    //       return (
    //         x[`${props.matchValue}`] !== props.value[`${props.matchValue}`]
    //       );
    //     });
    //     props.onSelect(found);
    //     props.handleGlobalChange(-1);
    //   }
    // } else {

    if (props.setGlobalValue) {
      if (props.globalValues) {
        if (props.globalValues < props.maxCount) {
          if (!found) {
            props.onSelect([props.value, ...props.selectedValues]);
            props.setGlobalValue(1);
          } else {
            const found = props.selectedValues.filter((x) => {
              return (
                x[`${props.matchValue}`] !== props.value[`${props.matchValue}`]
              );
            });
            props.onSelect(found);
            props.setGlobalValue(-1);
          }
        } else if (props.globalValues >= props.maxCount && found) {
          const found = props.selectedValues.filter((x) => {
            return (
              x[`${props.matchValue}`] !== props.value[`${props.matchValue}`]
            );
          });
          props.onSelect(found);
          props.setGlobalValue(-1);
        } else if (props.globalValues >= props.maxCount) {
        }
      }
    } else {
      if (!found) {
        props.onSelect([props.value, ...props.selectedValues]);
      } else {
        const found = props.selectedValues.filter((x) => {
          return (
            x[`${props.matchValue}`] !== props.value[`${props.matchValue}`]
          );
        });
        props.onSelect(found);
      }
    }

    // }
  };
  return (
    <Grid.Col
      lg={3}
      xs={5}
      md={3}
      sx={{
        display: `${
          props.value.name === "L.K.G." || props.value.name === "U.K.G"
            ? "none"
            : "flex"
        }`,
        alignItems: "center",
        justifyContent: "space-between",
        borderRadius: "12px",
        backgroundColor: props.selectedValues.find(
          (x) => x[`${props.matchValue}`] === props.value[`${props.matchValue}`]
        )
          ? "#4B65F6"
          : "#fff",
        color: props.selectedValues.find(
          (x) => x[`${props.matchValue}`] === props.value[`${props.matchValue}`]
        )
          ? "#FFF"
          : "#000",
        border: props.selectedValues.find(
          (x) => x[`${props.matchValue}`] === props.value[`${props.matchValue}`]
        )
          ? "3px solid #FFFFFF"
          : "3px solid #f3f3f3",

        cursor: "pointer",
        userSelect: "none",
        width: "180px",
        transition: "all 0.2s ease-in-out",
        ":hover": {
          backgroundColor: `${
            props.globalValues && props.globalValues >= props.maxCount
              ? ""
              : "#3c51c5"
          }`,
          color: `${
            props.globalValues && props.globalValues >= props.maxCount
              ? ""
              : "white"
          }`,
        },
      }}
      style={{
        cursor:
          props.globalValues &&
          props.globalValues >= props.maxCount &&
          !props.selectedValues.find(
            (x) => x[props.matchValue] === props.value[props.matchValue]
          )
            ? "not-allowed"
            : "pointer",
      }}
      mx={10}
      my={10}
      py={15}
      onClick={handleSelect}
    >
      <Flex
        align="center"
        w={"100%"}
        justify={"space-between"}
        px={isMd ? "0" : "md"}
      >
        {/* {props.selectedValues.find(
          (x) => x[`${props.matchValue}`] === props.value[`${props.matchValue}`]
        ) && (
          <Group mx={5} className={classes.check}>
            <IconCheck
              style={{
                stroke: "#FFF",
                fontWeight: 600,
              }}
            />
            iconsPath[props.value.name]
          </Group>
        )} */}
        {/* {props.isIconPresent && (
          <div>
            <SubjecIcon
              name={props.value.name}
              isSenior={props.isSenior}
              isWhite={
                props.selectedValues.find(
                  (x) =>
                    x[`${props.matchValue}`] ===
                    props.value[`${props.matchValue}`]
                )
                  ? true
                  : false
              }
            ></SubjecIcon>
          </div>
        )} */}

        <Text
          fw={500}
          className={style.fontdiv}
          style={{
            fontFamily: "Nunito",
            fontSize: `${
              isMd ? (props.value.name.length > 15 ? "12.5px" : "15px") : "18px"
            }`,
          }}
        >
          {props.value.name}
        </Text>
        {props.selectedValues.find(
          (x) => x[`${props.matchValue}`] === props.value[`${props.matchValue}`]
        ) ? (
          <IconSquareCheck />
        ) : (
          <IconSquare />
        )}
      </Flex>
    </Grid.Col>
  );
}
interface MultiChipSelectProps {
  values: {
    name: string;
    [key: string]: any;
  }[];
  setSelectedValues: (
    val: {
      name: string;
      [key: string]: any;
    }[]
  ) => void;
  selectedValues: {
    name: string;
    [key: string]: any;
  }[];
  matchValue: string;
  isIconPresent?: boolean;
  isSenior?: boolean;
  setGlobalValue?: (change: number) => void;
  globalValues?: number;
  maxCount?: number;
}
export function MultiChipSelect(props: MultiChipSelectProps) {
  return (
    <Grid p={10}>
      {props.values.map((x, index) => {
        return (
          <SingleChip
            value={x}
            onSelect={(val) => {
              props.setSelectedValues(val);
            }}
            selectedValues={props.selectedValues}
            matchValue={props.matchValue}
            isIconPresent={props.isIconPresent}
            isSenior={props.isSenior}
            key={index}
            globalValues={props.globalValues}
            setGlobalValue={props.setGlobalValue}
            maxCount={props.maxCount ?? 100}
          />
        );
      })}
    </Grid>
  );
}
