import {
  TextInput,
  PasswordInput,
  Anchor,
  Paper,
  Title,
  Text,
  Button,
  Space,
  Select,
  Stack,
  Input,
  Group,
  Container,
} from "@mantine/core";
import InputMask from "react-input-mask";
import { useState, useEffect, Fragment } from "react";
import "react-phone-number-input/style.css";

interface SignupProps {
  OnLoginClick: () => void;
  OnSignupClick: (details: SignupFormDetails) => void;
  isTeacherLogin?: boolean;
  iserror: boolean;
  setisError: (val: boolean) => void;
}

enum UserRoleType {
  Student = "Student",
  Teacher = "Teacher",
}

export function Signup(props: SignupProps) {
  enum ValueChangeFieldType {
    name,
    role,
    email,
    password,
    phone,
    subjects,
  }
  const [signupDetails, setSignupDetails] = useState<SignupFormDetails>({
    fullName: "",
    email: "",
    password: "",
    phone: "",
    role: "",
    subjects: [],
  });
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const onUpdateField = (
    fieldType: ValueChangeFieldType,
    updatedValue: string
  ) => {
    var nextFormState;
    props.setisError(false);
    if (fieldType === ValueChangeFieldType.email) {
      nextFormState = {
        ...signupDetails,
        email: updatedValue,
      };
    } else if (fieldType === ValueChangeFieldType.password) {
      nextFormState = {
        ...signupDetails,
        password: updatedValue,
      };
    } else if (fieldType === ValueChangeFieldType.name) {
      nextFormState = {
        ...signupDetails,
        fullName: updatedValue,
      };
    } else if (fieldType === ValueChangeFieldType.role) {
      nextFormState = {
        ...signupDetails,
        role: updatedValue,
      };
    } else if (fieldType === ValueChangeFieldType.phone) {
      nextFormState = {
        ...signupDetails,
        phone: updatedValue,
      };
    }
    if (nextFormState != null) setSignupDetails(nextFormState);
  };
  function IsInputValid() {
    let isNameValid = signupDetails.fullName.length > 0;
    let isRoleValid = props.isTeacherLogin || signupDetails.role.length > 0;
    let isEmailValid = signupDetails.email.length > 0;
    let isPasswordValid = signupDetails.password.length > 0;
    let isPhoneValid = signupDetails.phone.length > 0;
    return (
      isNameValid &&
      isRoleValid &&
      isEmailValid &&
      isPasswordValid &&
      isPhoneValid
    );
  }

  const onSubmitForm = (e: any) => {
    e.preventDefault();
    props.OnSignupClick(signupDetails);
  };

  useEffect(() => {
    if (props.isTeacherLogin === true) {
      setSignupDetails((prev) => {
        return { ...prev, role: UserRoleType.Teacher };
      });
    }
  }, [props.isTeacherLogin]);

  useEffect(() => {
    if (firstName != "" && lastName != "")
      onUpdateField(ValueChangeFieldType.name, `${firstName} ${lastName}`);
  }, [firstName, lastName]);
  return (
    <div>
      <Title
        align="center"
        sx={(theme) => ({
          fontFamily: `Greycliff CF, ${theme.fontFamily}`,
          fontWeight: 900,
          fontSize: "1.8rem",
        })}
      >
        Harness the Power of Interactive Learning.
      </Title>
      <Text color="dimmed" size="sm" align="center" mt={5}>
        Already have an account?{" "}
        <Anchor<"a">
          href="#"
          size="sm"
          onClick={(event) => {
            event.preventDefault();
            props.OnLoginClick();
          }}
          styles={{ label: { fontWeight: 900 } }}
        >
          Login
        </Anchor>
      </Text>

      <Container p={15} mt={10}>
        <Stack>
          {props.iserror && (
            <Text
              sx={{
                color: "red",
              }}
              fz={15}
              fs="italic"
            >
              *Email is already there
            </Text>
          )}
          {/* <TextInput
            label="Full Name"
            placeholder="Your full name"
            required
            value={signupDetails.fullName}
            onChange={(e) =>
              onUpdateField(ValueChangeFieldType.name, e.target.value)
            }
            styles={{label:{fontWeight:900,color:'black'}}}
          /> */}
          <Group position="apart">
            <TextInput
              label="First Name"
              placeholder="First name"
              required
              value={firstName}
              radius="md"
              onChange={(e) => {
                setFirstName(e.target.value);
              }}
              styles={{ label: { fontWeight: 900, color: "black" } }}
              style={{ width: "45%", display: "inline-block" }}
            />
            <TextInput
              label="Last Name"
              placeholder="Last name"
              required
              value={lastName}
              radius="md"
              onChange={(e) => {
                setLastName(e.target.value);
              }}
              styles={{ label: { fontWeight: 900, color: "black" } }}
              style={{ width: "45%", display: "inline-block" }}
            />
          </Group>
          {props.isTeacherLogin !== true && (
            <Select
              label="Role"
              placeholder="Select role"
              value={signupDetails.role}
              required
              data={[UserRoleType.Student, UserRoleType.Teacher]}
              onChange={(e) => {
                onUpdateField(ValueChangeFieldType.role, e ?? "");
              }}
            />
          )}

          <Input.Wrapper
            label="Phone Number"
            required
            styles={{ label: { fontWeight: 900, color: "black" } }}
          >
            <Input
              component={InputMask}
              mask="9999999999"
              placeholder="Your Phone"
              value={signupDetails.phone}
              radius="md"
              onChange={(e) =>
                onUpdateField(ValueChangeFieldType.phone, e.target.value)
              }
            />
          </Input.Wrapper>
          <TextInput
            label="Email"
            placeholder="you@vignam.com"
            required
            value={signupDetails.email}
            radius="md"
            onChange={(e) =>
              onUpdateField(ValueChangeFieldType.email, e.target.value)
            }
            styles={{ label: { fontWeight: 900, color: "black" } }}
          />
          <PasswordInput
            label="Password"
            placeholder="Your password"
            required
            radius="md"
            onChange={(e) =>
              onUpdateField(ValueChangeFieldType.password, e.target.value)
            }
            styles={{ label: { fontWeight: 900, color: "black" } }}
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
            Sign Up
          </Button>
        </Stack>
      </Container>
      <Space h={20}></Space>
    </div>
  );
}
