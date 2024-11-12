import { Box, Center, Flex, Text } from "@mantine/core";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IconManage, IconTeach } from "../../components/_Icons/CustonIcons";
import { useMediaQuery } from "@mantine/hooks";
import { Mixpanel } from "../../utilities/Mixpanel/MixpanelHelper";
import { TeacherPageEvents } from "../../utilities/Mixpanel/AnalyticeEventTeacherApp";
import { GetValueFromLocalStorage, LocalStorageKey } from "../../utilities/LocalstorageUtility";
import { LoginUsers } from "../../components/Authentication/Login/Login";
import { useSelector } from "react-redux";
import { RootState } from "../../store/ReduxStore";

interface ToggleCardProps {
  isTeach: boolean;
  firstButton: string;
  secondButton: string;
  cardColor: string;
  textColor: string;
  cardTextColor: string;
  instituteId: string;
  instituteName: string;
  onChange: (val: string) => void;
}

function ToggleTeach(props: ToggleCardProps) {
  const isMd = useMediaQuery(`(max-width: 820px)`);
  const navigate = useNavigate();
  const [selectedOption, setSelectedOption] = useState<string>(
    props.isTeach ? props.secondButton : props.firstButton
  );
  const mainPath=useSelector<RootState,string | null>((state)=>{
    return state.mainPathSlice.value;
  })
  const [leftspacing, setLeftSpacing] = useState<string>("");
  const [textContent, setTextContent] = useState<string>(props.firstButton);

  useEffect(() => {
    if (selectedOption === props.firstButton) {
      
      props.onChange(props.firstButton);
      setLeftSpacing("2%");
      setTextContent(props.firstButton);
    } else if (selectedOption === props.secondButton) {
    
      props.onChange(props.secondButton);
      setLeftSpacing("52%");
      setTextContent(props.secondButton);
    }
  }, [selectedOption]);

  return (
    <Flex
      w={isMd ? 140 : 250}
      h={"90%"}
      style={{
        position: "relative",
        borderRadius: "40px",
        backgroundColor: "#FFFFFF",
        border: "1px solid #3174F3",
        cursor: "pointer",
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
          borderRadius: "30px",
        }}
      >
        <Center h="100%" w="100%">
          <Flex align="center" justify="center">
            {!isMd &&
              (selectedOption === props.firstButton ? (
                <IconManage
                  col={props.cardTextColor}
                  size={isMd ? "15" : "28"}
                />
              ) : (
                <IconTeach
                  col={props.cardTextColor}
                  size={isMd ? "15" : "28"}
                />
              ))}
            <Text
              style={{
                color: props.cardTextColor,
                marginLeft: "8px", // Add some spacing between the icon and text
              }}
              ta="center"
              fz={isMd ? 10 : 14}
              fw={600}
            >
              {textContent}
            </Text>
          </Flex>
        </Center>
      </Box>
      <Flex
        w="50%"
        align="center"
        justify="center"
        onClick={() => {
          Mixpanel.track(
            TeacherPageEvents.TEACHER_APP_HOMEWORK_MANAGE_BUTTON_CLICKED
          );
          setSelectedOption(props.firstButton);
          const userType=GetValueFromLocalStorage(LocalStorageKey.UserType)
          if(userType===LoginUsers.TEACHER)
            navigate(`/${props.instituteName}/${props.instituteId}/teacher`);
          else if(userType===LoginUsers.TEACHERADMIN)
            navigate(`/${props.instituteName}/${props.instituteId}/teacheradmin`);
          else if(userType===LoginUsers.ADMIN)
            navigate('/')
        }}
      >
        {!isMd && (
          <IconManage col={props.cardColor} size={isMd ? "15" : "28"} />
        )}
        <Text
          style={{
            color: props.textColor,
            marginLeft: "8px", // Add some spacing between the icon and text
          }}
          ta="center"
          fz={isMd ? 10 : 14}
          fw={600}
        >
          {props.firstButton}
        </Text>
      </Flex>
      <Flex
        w="50%"
        align="center"
        justify="center"
        onClick={() => {
          Mixpanel.track(
            TeacherPageEvents.TEACHER_APP_HOMEWORK_TEACH_BUTTON_CLICKED
          );
          setSelectedOption(props.secondButton);
          navigate(`${mainPath}/teach`);
        }}
      >
        {!isMd && <IconTeach col={props.cardColor} size={isMd ? "15" : "28"} />}
        <Text
          style={{
            color: props.textColor,
            marginLeft: "8px", // Add some spacing between the icon and text
          }}
          ta="left"
          fz={isMd ? 10 : 14}
          fw={600}
        >
          {props.secondButton}
        </Text>
      </Flex>
    </Flex>
  );
}

export default ToggleTeach;
