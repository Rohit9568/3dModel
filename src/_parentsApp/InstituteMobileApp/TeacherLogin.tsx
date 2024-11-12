import { Checkbox, Flex, PasswordInput, Stack, Text } from "@mantine/core";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../features/auth/loginSlice";
import { AppDispatch, RootState } from "../../store/ReduxStore";
import { TeacherPageEvents } from "../../utilities/Mixpanel/AnalyticeEventTeacherApp";
import { WebAppEvents } from "../../utilities/Mixpanel/AnalyticeEventWebApp";
import { Mixpanel } from "../../utilities/Mixpanel/MixpanelHelper";
import { InstituteFirstSection } from "./InstituteLoginPage";
import { LoginButton } from "./utils/LogInButton";
import { TextInputFeild } from "./utils/TextInputFeild";
import { PasswordInputFeild } from "./utils/PasswordInputFeild";
import { PrivacypolicyChecked } from "./utils/PrivacyPolicyCheckbox";
import { instituteDetails } from "../../store/instituteDetailsSlice";

export function TeacherLogin(props: {
  setisTeacherLogin: (val: boolean) => void;
  setisLoading: (val: boolean) => void;
}) {
  const [emailError, setEmailError] = useState<boolean>(false);
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return emailRegex.test(email);
  };
  const dispatch = useDispatch<AppDispatch>();

  const [loginDetails, setLoginDetails] = useState<LoginFormDetails>({
    email: "",
    password: "",
  });
  const [isConditionsAccepted, setIsConditionsAccepted] =
    useState<boolean>(false);

    const instituteDetails = useSelector<RootState, InstituteDetails | null>(
      (state) => state.instituteDetailsSlice.instituteDetails
    );

  const [isError, setIsError] = useState<boolean>(false);
  function handleLoginClick() {
    if (!isValidEmail(loginDetails.email)) {
      setEmailError(true);
    } else {
      props.setisLoading(true);
      dispatch(
        loginUser({
          email: loginDetails.email,
          password: loginDetails.password,
        })
      )
        .unwrap()
        .then((data) => {
          Mixpanel.registerFromLocalStorage();
          Mixpanel.track(TeacherPageEvents.USER_SIGN_IN_SUCCESS, {
            email: loginDetails.email,
          });
          window.location.reload();
          props.setisLoading(false);
        })
        .catch((error) => {
          Mixpanel.track(WebAppEvents.USER_SIGN_IN_FAILED, {
            error: error.message,
          });
          setIsError(true);
          props.setisLoading(false);
        });
    }
  }
  return (
    <Stack w="100%" px={20}>
      <InstituteFirstSection />
      {isError && (
        <Text
          sx={{
            color: "red",
          }}
          fz={15}
          fs="italic"
        >
          *Email or Password is Incorrect
        </Text>
      )}
      <TextInputFeild
        label="Email"
        value={loginDetails.email}
        placeholder="Email"
        onChange={(val) =>
          setLoginDetails({
            ...loginDetails,
            email: val,
          })
        }
        error={emailError}
      />
      <PasswordInputFeild
        onChange={(val) => {
          setLoginDetails({
            ...loginDetails,
            password: val,
          });
        }}
        password={loginDetails.password}
      />
      <PrivacypolicyChecked
        isConditionsAccepted={isConditionsAccepted}
        setIsConditionsAccepted={(val) => setIsConditionsAccepted(val)}
        instituteName={instituteDetails?.name??""}
      />
      <Flex justify="center" mt={20} w="100%">
        <LoginButton
          text="Login"
          onClick={() => {
            handleLoginClick();
          }}
          disabled={!isConditionsAccepted}
        />
      </Flex>
      <Text ta="center">
        Have a student account?
        <span
          onClick={() => {
            props.setisTeacherLogin(false);
          }}
          style={{
            color: "#4B65F6",
            fontWeight: 700,
          }}
        >
          {" "}
          Login as Student
        </span>
      </Text>
    </Stack>
  );
}
