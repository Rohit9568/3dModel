import {
  TextInput,
  PasswordInput,
  Title,
  Text,
  Container,
  Button,
  Space,
  Stack,
  Select,
} from "@mantine/core";
import { useState } from "react";
import { Mixpanel } from "../../../utilities/Mixpanel/MixpanelHelper";
import { WebAppEvents } from "../../../utilities/Mixpanel/AnalyticeEventWebApp";
import { isValidEmail } from "../../../utilities/HelperFunctions";
import { PrivacypolicyChecked } from "../../../_parentsApp/InstituteMobileApp/utils/PrivacyPolicyCheckbox";
import { useSelector } from "react-redux";
import { RootState } from "../../../store/ReduxStore";

interface LoginProps {
  OnLoginClick: (details: LoginFormDetails) => void;
  OnForgotPasswordClick: () => void;
  OnSignupClick: () => void;
  iserror: boolean;
  setisError: (val: boolean) => void;
}

export enum LoginUsers {
  ADMIN = "ADMIN",
  TEACHER = "TEACHER",
  TEACHERADMIN = "TEACHERADMIN",
  ADMINISTRATOR = "ADMINISTRATOR",
  OWNER = "OWNER",
}

export function Login(props: LoginProps) {
  const [emailError, setEmailError] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  enum ValueChangeFieldType {
    email,
    password,
  }

  const [loginDetails, setLoginDetails] = useState<LoginFormDetails>({
    email: "",
    password: "",
  });
  const [isConditionsAccepted, setIsConditionsAccepted] =
    useState<boolean>(true);

    const instituteDetails = useSelector<RootState, InstituteDetails | null>(
      (state) => state.instituteDetailsSlice.instituteDetails
    );

  const onUpdateField = (
    fieldType: ValueChangeFieldType,
    updatedValue: string
  ) => {
    var nextFormState: LoginFormDetails | null = null;
    props.setisError(false);
    if (fieldType === ValueChangeFieldType.email) {
      setEmailError(!isValidEmail(updatedValue));
      nextFormState = {
        ...loginDetails,
        email: updatedValue,
      };
    } else if (fieldType === ValueChangeFieldType.password) {
      nextFormState = {
        ...loginDetails,
        password: updatedValue,
      };
    }
    if (nextFormState != null) setLoginDetails(nextFormState);
  };

  function IsInputValid() {
    let isEmailValid = loginDetails.email.length > 0;
    let isPasswordValid = loginDetails.password.length > 0;
    return isEmailValid && isPasswordValid && isConditionsAccepted;
  }

  const onSubmitForm = (e: any) => {
    Mixpanel.track(WebAppEvents.VIGNAM_APP_LOGIN_BUTTON_CLICKED, {
      email: loginDetails.email,
    });
    e.preventDefault();
    setIsSubmitted(true);
    if (isValidEmail(loginDetails.email)) {
      props.OnLoginClick(loginDetails);
    } else {
      Mixpanel.track(WebAppEvents.USER_SIGN_IN_FAILED, {
        error: "Email Validation Failed",
      });
      setEmailError(true);
    }
  };

  return (
    <div>
      <Title
        align="center"
        sx={(theme) => ({
          fontFamily: `Greycliff CF, ${theme.fontFamily}`,
          fontWeight: 900,
          fontSize: "2rem",
        })}
        mt={30}
      >
        Harness the Power of Interactive Learning.
      </Title>

      <Container p={30} mt={30}>
        <Stack>
          {props.iserror && (
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
          <TextInput
            label="Email"
            placeholder="you@vignam.com"
            required
            value={loginDetails.email}
            error={
              isSubmitted && emailError ? "Invalid email format" : undefined
            }
            onChange={(e) =>
              onUpdateField(ValueChangeFieldType.email, e.target.value)
            }
            styles={{ label: { fontWeight: 900, color: "black" } }}
          />

          <PasswordInput
            label="Password"
            placeholder="Your password"
            required
            value={loginDetails.password}
            onChange={(e) =>
              onUpdateField(ValueChangeFieldType.password, e.target.value)
            }
            styles={{ label: { fontWeight: 900, color: "black" } }}
          />
          <PrivacypolicyChecked
            isConditionsAccepted={isConditionsAccepted}
            setIsConditionsAccepted={setIsConditionsAccepted}
            instituteName={instituteDetails?.name??""}
          />

          <Button
            fullWidth
            mt="xl"
            onClick={onSubmitForm}
            disabled={IsInputValid() == false}
            style={{ boxShadow: "2px 2px 4px rgba(0, 0, 0, 0.25)" }}
            styles={{
              root: {
                "&:disabled": { color: "white", backgroundColor: "#DCDCDC" },
              },
            }}
          >
            Sign in
          </Button>
        </Stack>
      </Container>
      <Space h={20}></Space>
    </div>
  );
}
