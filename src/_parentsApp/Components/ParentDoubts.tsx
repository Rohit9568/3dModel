import React, { useEffect, useState } from "react";
import {
  Box,
  TextInput,
  Button,
  Text,
  Textarea,
  Stack,
  Group,
} from "@mantine/core";
import { AddDoubt } from "../features/doubtsSlice";
import { useNavigate } from "react-router-dom";
import { Mixpanel } from "../../utilities/Mixpanel/MixpanelHelper";
import { ParentPageEvents } from "../../utilities/Mixpanel/AnalyticEventParentApp";
import { showNotification } from "@mantine/notifications";

interface DoubtForm {
  name: string;
  phoneNumber: string;
  doubt: string;
}
interface ParentDoubtsProps {
  instituteId: string;
  instituteName: string;
  mainPath: string;
}

const ParentDoubts = (props: ParentDoubtsProps) => {
  const [form, setForm] = useState<DoubtForm>({
    name: "",
    phoneNumber: "",
    doubt: "",
  });
  const [error, setError] = useState<{
    name: boolean;
    phoneNumber: boolean;
    doubt: boolean;
  }>({ name: false, phoneNumber: false, doubt: false });
  const navigate = useNavigate();

  const isPhoneNumberValid = (phoneNumber: string): boolean => {
    const phoneRegex = /^\d{10}$/;
    return phoneRegex.test(phoneNumber);
  };
  const handlePhoneNumberChange =
    (name: keyof DoubtForm) => (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      if (/^\d*$/.test(value) && value.length <= 10) {
        setForm((prevState) => ({ ...prevState, [name]: value }));
        setError((prevState) => ({ ...prevState, [name]: false }));
      } else {
        setError((prevState) => ({ ...prevState, [name]: true }));
      }
    };

  const handleInputChange =
    (name: keyof DoubtForm) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((prevState) => ({ ...prevState, [name]: event.target.value }));
      setError((prevState) => ({ ...prevState, [name]: false }));
    };
  const [message, setMessage] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleSubmit = () => {
    const isPhoneValid = isPhoneNumberValid(form.phoneNumber);
    const newError = {
      name: form.name.length === 0,
      phoneNumber: !isPhoneValid,
      doubt: form.doubt.length === 0,
    };

    if (newError.name || newError.phoneNumber || newError.doubt) {
      setError(newError);
    } else {
      AddDoubt({
        name: form.name,
        phoneNumber: form.phoneNumber,
        doubt: form.doubt,
        instituteId: props.instituteId,
      })
        .then((x) => {
          showNotification({
            message: "Doubt submitted successfully ✔",
          });
          Mixpanel.track(ParentPageEvents.PARENTS_APP_DOUBTS_SEND_CLICKED);
          setMessage("Doubt submitted successfully");
          setForm({ name: "", phoneNumber: "", doubt: "" });
          navigate(`/${props.mainPath}`);
        })
        .catch((e) => {
          setErrorMessage("Doubt limit exceeded");
        });
    }
  };
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    setIsValid(
      form.name.length > 0 &&
        isPhoneNumberValid(form.phoneNumber) &&
        form.doubt.length > 0
    );
  }, [form]);

  return (
    <Box style={{ paddingLeft: "20px" }}>
      <Stack spacing={12} style={{ marginRight: "20px" }}>
        <TextInput
          label={"Name"}
          placeholder={
            error.name ? "Field should not be empty" : "Enter your name"
          }
          value={form.name}
          onChange={handleInputChange("name")}
          error={error.name}
        />
        <TextInput
          label={"Phone Number"}
          placeholder={
            error.phoneNumber
              ? "Field should contain a 10-digit phone number"
              : "Enter your phone number"
          }
          value={form.phoneNumber}
          onChange={handlePhoneNumberChange("phoneNumber")}
          error={error.phoneNumber}
          maxLength={10} // limit to 10 digits
        />

        <Textarea
          label={"Ask your doubts here"}
          placeholder={
            error.doubt
              ? "Field should not be empty"
              : "type something here ..."
          }
          value={form.doubt}
          onChange={handleInputChange("doubt")}
          error={error.doubt}
          autosize
          minRows={12}
        />
        <Group position="right">
          {message && <Text fw={700}>{message}</Text>}
          {errorMessage && (
            <Text fw={700} style={{ color: "red" }}>
              {errorMessage}
            </Text>
          )}
          <Button
            style={{
              color: isValid ? "#ffffff" : "#A7A7A7",
              width: "117px",
              height: "51px",
              flexShrink: 0,
              backgroundColor: isValid ? "#3174F3" : "#ffffff",
              border: isValid ? "#3174F3 1px solid" : "#A7A7A7 1px solid",
              borderRadius: "5px",
            }}
            onClick={handleSubmit}
          >
            Send
          </Button>
        </Group>
      </Stack>
    </Box>
  );
};

export default ParentDoubts;
