import { Flex, Grid, Image, LoadingOverlay, Stack, Text } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState } from "../../store/ReduxStore";
import { StudentLogin } from "./StudentLogin";
import { TeacherLogin } from "./TeacherLogin";
import { LoginPageFooter } from "../../components/LoginPageFooter";

export function InstituteFirstSection() {
  const instituteDetails = useSelector<RootState, InstituteDetails | null>(
    (state) => state.instituteDetailsSlice.instituteDetails
  );
  if (instituteDetails)
    return (
      <>
        <Flex justify="center">
          <img
            src={instituteDetails.iconUrl}
            alt="Institute Logo"
            style={{ width: "150px", height: "150px" }}
          />
        </Flex>
        <Text ta="center" fz={32} fw={700}>
          Experience a new way of learning
        </Text>
      </>
    );
  else return <LoadingOverlay visible={instituteDetails ? false : true} />;
}

export function InstituteLoginPage() {
  const [isTeacherLogin, setIsTeacherLogin] = useState<boolean>(false);
  const [isLoading, setisLoading] = useState<boolean>(false);
  const isMd = useMediaQuery(`(max-width: 820px)`);
  const instituteDetails = useSelector<RootState, InstituteDetails | null>(
    (state) => state.instituteDetailsSlice.instituteDetails
  );

  const navigate = useNavigate();
  return (
    <Stack>
      <Grid m={0} p={0}>
        {!isMd && (
          <Grid.Col span={8} p={0}>
            <img
              style={{
                height: "100vh",
                width: "100%",
              }}
              src={require("../../assets/loginImage.png")}
            />
          </Grid.Col>
        )}
        <Grid.Col span={isMd ? 12 : 4} p={0}>
          <Stack
            h="100vh"
            align="center"
            pt={50}
            style={{
              maxHeight: "100vh",
            }}
          >
            {!isTeacherLogin && (
              <StudentLogin
                setisTeacherLogin={(val) => setIsTeacherLogin(val)}
                setisLoading={(val) => setisLoading(val)}
              />
            )}
            {isTeacherLogin && (
              <TeacherLogin
                setisTeacherLogin={(val) => setIsTeacherLogin(val)}
                setisLoading={(val) => setisLoading(val)}
              />
            )}
            <LoadingOverlay visible={isLoading} />
          </Stack>
        </Grid.Col>
      </Grid>
      <LoginPageFooter
      instituteName ={instituteDetails?.name??""}
       />
    </Stack>
  );
}
