import React, { useEffect, useRef, useState } from "react";
import {
  Col,
  Container,
  TextInput,
  Button,
  Grid,
  Text,
  Stack,
} from "@mantine/core";
import { Image } from "@mantine/core";
import LoginIcon from "../Assets/icons/enter Image icon.png";
import { useSelector } from "react-redux";
import { RootState } from "../../store/ReduxStore";
interface ParentLoginPageProps {
  onSubmit: (val: string, password?: string | null) => void;
  error: string | null;
}
const ParentLoginPage = ({ onSubmit, error }: ParentLoginPageProps) => {
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (
      instituteDetails &&
      instituteDetails?.featureAccess.studentCredentialsAccess
    ) {
      onSubmit(phoneNumber, password);
    } else onSubmit(phoneNumber);
  };

  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
  }, []);

  const instituteDetails = useSelector<RootState, InstituteDetails | null>(
    (state) => state.instituteDetailsSlice.instituteDetails
  );
  return (
    <Stack align="center">
      <Image src={LoginIcon} alt="Logo" height={120} width={120} />
      <Text color={"#4F4F4F"} fz={19} fw={700} mt={20}>
        Enter your Phone Number
      </Text>
      <form
        onSubmit={handleSubmit}
        style={{ width: "100%", marginTop: "20px" }}
      >
        {error && <Text color="red">{error}</Text>}
        <TextInput
          placeholder="Your phone"
          type="tel"
          value={phoneNumber}
          onChange={(event) => setPhoneNumber(event.currentTarget.value)}
          ref={inputRef}
        />
        <Button
          type="submit"
          color="blue"
          size="lg"
          radius="md"
          fullWidth
          mt={20}
          fz={14}
          fw={500}
          bg="#3174F3"
        >
          Log in
        </Button>
      </form>
    </Stack>
  );
};

export default ParentLoginPage;
