import { PasswordInput } from "@mantine/core";

export function PasswordInputFeild(props: {
  password: string;
  onChange: (val: string) => void;
}) {
  return (
    <PasswordInput
      label="Password"
      value={props.password}
      placeholder="Password"
      onChange={(e) => props.onChange(e.currentTarget.value)}
      styles={{
        input: {
          height: "45px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        },
        label: {
          fontSize: "18px",
          fontWeight: 700,
        },
      }}
      height={45}
      required
    />
  );
}
