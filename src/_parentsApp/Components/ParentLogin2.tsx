import {
  Button,
  Center,
  Flex,
  Image,
  LoadingOverlay,
  NumberInput,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { useEffect, useRef, useState } from "react";
import {
  LocalStorageKey,
  SaveValueToLocalStorage,
} from "../../utilities/LocalstorageUtility";
import { ParentPageEvents } from "../../utilities/Mixpanel/AnalyticEventParentApp";
import { Mixpanel } from "../../utilities/Mixpanel/MixpanelHelper";
import LoginIcon from "../Assets/icons/enter Image icon.png";
import {
  CreateNewCourseStudent,
  GetStudentUserInfo,
  StudentAuthorization,
} from "../features/instituteStudentSlice";
interface ParentLoginPageProps {
  onSubmit: (
    id: string,
    name: string,
    parentName: string,
    type: "login" | "signup"
  ) => void;
  error: string | null;
  institute: {
    _id: string;
    name: string;
  };
  setUserInfo: (val: any) => void;
}
const ParentLoginPage2 = ({
  onSubmit,
  error,
  institute,
  setUserInfo,
}: ParentLoginPageProps) => {
  const [phoneNumber, setPhoneNumber] = useState<number>();
  const [nameValue, setnameValue] = useState<string>("");
  const [parentName, setParentname] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);
  const [toBeRegister, setToBeRegister] = useState<boolean>(false);
  const [isLoading, setisLoading] = useState<boolean>(false);
  const [isnumbererror, setisnumberError] = useState<string>("");

  function handleSubmit1(phoneNo: string) {
    setisLoading(true);
    StudentAuthorization({ phoneNo, instituteId: institute._id })
      .then((x: any) => {
        setUserInfo(x.users);
        setisLoading(false);
        // Mixpanel.registerParentFromLocalStorage(x, institute.name);
        SaveValueToLocalStorage(LocalStorageKey.Token, x.token);
        onSubmit(
          x.users[0]._id,
          x.users[0].name,
          x.users[0].parentName,
          "login"
        );
        Mixpanel.track(ParentPageEvents.PARENTS_APP_RESULT_PAGE_LOGIN_SUCCESS);
      })
      .catch((e) => {
        console.log(e);
        setUserInfo([]);
        setToBeRegister(true);
        setisLoading(false);
      });
  }

  function handleRegisterUser() {
    setisLoading(true);
    CreateNewCourseStudent({
      phoneNumber: [(phoneNumber ?? 0).toString()],
      name: nameValue,
      instituteId: institute._id,
      parentName: parentName,
    })
      .then((x: any) => {
        setisLoading(false);
        SaveValueToLocalStorage(LocalStorageKey.Token, x.token);
        onSubmit(x._id, x.name, x.parentName, "signup");
      })
      .catch((e) => {
        setisLoading(false);
        console.log(e);
      });
  }

  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
  }, []);
  return (
    <>
      <Stack spacing={0}>
        <Center w="100%">
          <Image src={LoginIcon} alt="Logo" height={120} width={120} />
        </Center>
        <Text
          style={{
            color: "#4F4F4F",
            fontSize: "19px",
            fontStyle: "normal",
            fontWeight: 700,
            lineHeight: "normal",
            marginTop: "20px",
          }}
          mt={10}
        >
          Enter your Phone Number
        </Text>
        {error && <Text color="red">{error}</Text>}
        <Stack mt={20}>
          <NumberInput
            placeholder="Your phone"
            // type="tel"
            value={phoneNumber}
            onChange={(event) => {
              if (isnumbererror.length > 0) setisnumberError("");
              if (event) {
                setPhoneNumber(event);
              }
            }}
            ref={inputRef}
            maxLength={10}
            hideControls
            minLength={10}
            error={isnumbererror}
            disabled={toBeRegister}
          />
          {toBeRegister && (
            <>
              <TextInput
                placeholder="Your Name"
                value={nameValue}
                onChange={(event) => setnameValue(event.currentTarget.value)}
              />
              <TextInput
                placeholder="Parent Name"
                value={parentName}
                onChange={(event) => setParentname(event.currentTarget.value)}
              />
            </>
          )}
        </Stack>
        <Flex mt={20}>
          <Button
            color="blue"
            size="lg"
            onClick={() => {
              if (toBeRegister) {
                handleRegisterUser();
              } else {
                if (phoneNumber && phoneNumber.toString().length === 10)
                  handleSubmit1(phoneNumber.toString());
                else {
                  setisnumberError("Number should be of 10 digits");
                }
              }
            }}
            bg="#4B65F6"
          >
            {toBeRegister ? "Login" : "Submit"}
          </Button>
        </Flex>
      </Stack>
      <LoadingOverlay visible={isLoading} />
    </>
  );
};

export default ParentLoginPage2;
