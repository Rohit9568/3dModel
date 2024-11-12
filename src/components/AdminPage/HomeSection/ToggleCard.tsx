import { Box, Center, Flex, Text } from "@mantine/core";
import React, { useEffect, useState } from "react";
import { DiaryType } from "./HomeworkTeacher";



interface ToggleCardProps{
    firstButton:string,
    secondButton:string,
    cardColor:string,
    textColor:string,
    cardTextColor:string,
    onChange:(val:string)=>void,
    onFirstButtonClick:() =>void,
    onSecondButtonClick:() =>void,
}
function ToggleCard(props:ToggleCardProps) {
  const [selectedOption, setSelectedOption] = useState<string>(
    props.firstButton
  );
  const [leftspacing, setLeftSpacing] = useState<string>("");
  const [textContent, setTextContent] = useState<string>(props.firstButton);

  useEffect(() => {
    if (selectedOption === props.firstButton) {
      props.onChange(props.firstButton)
      setLeftSpacing("2%");
      setTextContent(props.firstButton);
    } else if (selectedOption === props.secondButton) {
      props.onChange(props.secondButton)
      setLeftSpacing("52%");
      setTextContent(props.secondButton);
    }
  }, [selectedOption]);

  useEffect(() => {
    if (selectedOption === props.firstButton) {
      setLeftSpacing("2%");
    } else if (selectedOption === props.secondButton) {
      setLeftSpacing("52%");
    }
  }, [selectedOption]);

  return (
    <Flex
      w={300}
      style={{
        position: "relative",
        borderRadius: "18px",
        backgroundColor: "#ECECF1",
        cursor:'pointer',
      }}
    >
      <Box
        style={{
          position: "absolute",
          width: "46%",
          height: "85%",
          left: leftspacing,
          top: 4,
          transition: "all 0.2s ease-in-out",
          boxShadow: "0px 0px 4px 0px rgba(0, 0, 0, 0.25)",
          backgroundColor: props.cardColor,
          borderRadius: "12px",
        }}
      >
        <Center h="100%" w="100%">
          <Text
            style={{
              color: props.cardTextColor,
            }}
            ta="center"
            py={15}
            fz={16}
            fw={600}
          >
            {textContent}
          </Text>
        </Center>
      </Box>
      <Text
        w="50%"
        style={{
          color: props.textColor,
        }}
        ta="center"
        py={15}
        fz={16}
        fw={600}
        onClick={() => {
          props.onFirstButtonClick();
          setSelectedOption(props.firstButton);
        }}
      >
        {props.firstButton}
      </Text>
      <Text
        w="50%"
        style={{
          color:  props.textColor,
        }}
        ta="center"
        py={15}
        fz={16}
        fw={600}
        onClick={() => {
          setSelectedOption(props.secondButton);
          props.onSecondButtonClick();
        }}
      >
        {props.secondButton}
      </Text>
    </Flex>
  );
}

export default ToggleCard;
