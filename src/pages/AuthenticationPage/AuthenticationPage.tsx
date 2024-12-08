import { Container, LoadingOverlay, Group, Stack, Text, Flex } from "@mantine/core";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Login, LoginUsers } from "../../components/Authentication/Login/Login";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/ReduxStore";
import { loginUser } from "../../features/auth/loginSlice";
import { Mixpanel } from "../../utilities/Mixpanel/MixpanelHelper";
import {
  GetUser,
  GetValueFromLocalStorage,
  LocalStorageKey,
  RemoveValueFromLocalStorage,
} from "../../utilities/LocalstorageUtility";
import { useMediaQuery } from "@mantine/hooks";
import { MobileLogin } from "../../components/Authentication/Login/MobileLogin";
import { TeacherPageEvents } from "../../utilities/Mixpanel/AnalyticeEventTeacherApp";
import { convertToHyphenSeparated } from "../../utilities/HelperFunctions";
import { WebAppEvents } from "../../utilities/Mixpanel/AnalyticeEventWebApp";
import { LoginPageFooter } from "../../components/LoginPageFooter";

interface AuthenticationPageProps {
  onLoginSuccess: () => void;
  isTeacherLogin?: boolean;
  defaultDetails?: LoginFormDetails;
}

export function AuthenticationPage(props: AuthenticationPageProps) {
  enum AuthPageType {
    Login,
    Signup,
    ForgotPassword,
  }
  const [shownAuthPageType, setShownAuthPageType] = useState(
    AuthPageType.Login
  );

  useEffect(() => {
    Mixpanel.track(WebAppEvents.VIGNAM_APP_LOGIN_PAGE_ACCESSED);
    console.log(props.defaultDetails);
    if(props.defaultDetails && props.defaultDetails.email!=null && props.defaultDetails.email!=""){
      onLoginClick(props.defaultDetails)
    }
  }, []);
  useEffect(() => {
    RemoveValueFromLocalStorage(LocalStorageKey.User);
    RemoveValueFromLocalStorage(LocalStorageKey.Token);
    RemoveValueFromLocalStorage(LocalStorageKey.UserType);
  }, []);
  const [loadingData, setLoadingData] = useState<boolean>(false);
  const [iserror, setIsError] = useState<boolean>(false);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const isMd = useMediaQuery(`(max-width:770px)`);
  const instituteDetails = useSelector<RootState, InstituteDetails | null>(
    (state) => state.instituteDetailsSlice.instituteDetails
  );

  function onLoginClick(details: LoginFormDetails) {
    setLoadingData(true);
    dispatch(loginUser({ email: details.email, password: details.password }))
      .unwrap()
      .then((data) => {
        Mixpanel.track(TeacherPageEvents.USER_SIGN_IN_SUCCESS, {
          email: details.email,
        });
        setLoadingData(false);
        const user = GetUser();
        const userType = GetValueFromLocalStorage(LocalStorageKey.UserType);

        if (userType === LoginUsers.ADMIN && user.instituteId) {
          navigate(
            `/${user.instituteName}/${user.instituteId}/teach1/dashboard`
          );
        } else if (
          (userType === LoginUsers.TEACHER ||
            userType === LoginUsers.TEACHERADMIN) &&
          user.instituteId
        ) {
          navigate(
            `/${convertToHyphenSeparated(user.instituteName)}/${
              user.instituteId
            }/teach1/dashboard`
          );
        }
        props.onLoginSuccess();
      })
      .catch((error) => {
        Mixpanel.track(WebAppEvents.USER_SIGN_IN_FAILED, {
          error: error.message,
        });
        setIsError(true);
        setLoadingData(false);
      });
  }

  function showView(type: AuthPageType) {
    switch (type) {
      case AuthPageType.Login:
        setShownAuthPageType(AuthPageType.Login);
        break;
      case AuthPageType.Signup:
        setShownAuthPageType(AuthPageType.Signup);
        break;
      case AuthPageType.ForgotPassword:
        setShownAuthPageType(AuthPageType.ForgotPassword);
        break;
    }
  }

  return (
    <Stack>
      <Group w={"100%"}>
        {!isMd && (
          <div style={{ width: "64vw", height: "100vh" }}>
            <img
              src={require("../../assets/signUpImage.svg").default}
              style={{ objectFit: "cover", height: "100%", width: "100%" }}
            />
            {shownAuthPageType === AuthPageType.Signup && (
              <div>
                <p
                  style={{
                    position: "absolute",
                    top: "30%",
                    left: "1%",
                    fontSize: "3vw",
                    fontWeight: "700",
                    color: "white",
                  }}
                >
                  <p
                    style={{
                      margin: "0",
                      padding: "0",
                      letterSpacing: "0.07em",
                    }}
                  >
                    Hello Educators!
                  </p>
                  <p
                    style={{
                      fontSize: ".33em",
                    }}
                  >
                    Let's Make Learning Fun and Engaging Together! <br />
                    Sign up and Get Started.
                  </p>
                </p>
              </div>
            )}
            {shownAuthPageType === AuthPageType.Login && (
              <div>
                <p
                  style={{
                    position: "absolute",
                    top: "30%",
                    left: "1%",
                    fontSize: "3vw",
                    fontWeight: "700",
                    color: "white",
                  }}
                >
                  <p
                    style={{
                      margin: "0",
                      padding: "0",
                      letterSpacing: "0.07em",
                    }}
                  >
                    Welcome Back!
                  </p>
                  <p
                    style={{
                      fontSize: ".33em",
                    }}
                  >
                    Step into a World of Engaging Education.
                    <br /> Log in Now!
                  </p>
                </p>
              </div>
            )}
          </div>
        )}
        <Container style={{ width: isMd ? "100vw" : "33vw" }}>
          {shownAuthPageType === AuthPageType.Login && (
            <>
              {isMd ? (
                <MobileLogin
                  OnForgotPasswordClick={() =>
                    showView(AuthPageType.ForgotPassword)
                  }
                  OnLoginClick={onLoginClick}
                  OnSignupClick={() => showView(AuthPageType.Signup)}
                  iserror={iserror}
                  setisError={setIsError}
                />
              ) : (
                <Login
                  OnForgotPasswordClick={() =>
                    showView(AuthPageType.ForgotPassword)
                  }
                  OnLoginClick={onLoginClick}
                  OnSignupClick={() => showView(AuthPageType.Signup)}
                  iserror={iserror}
                  setisError={setIsError}
                />
              )}
            </>
          )}
          <LoadingOverlay visible={loadingData}></LoadingOverlay>
        </Container>
      </Group>
      <LoginPageFooter 
      instituteName={instituteDetails?.name??""} />
    </Stack>
  );
}
