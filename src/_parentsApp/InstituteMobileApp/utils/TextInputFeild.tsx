import { TextInput } from "@mantine/core";

export function TextInputFeild(props: {
  error: boolean;
  value: string;
  onChange: (val: string) => void;
  placeholder: string;
  label: string;
}) {
  return (
    <TextInput
      placeholder={props.placeholder}
      label={props.label}
      onChange={(e) => {
        props.onChange(e.currentTarget.value);
      }}
      error={props.error}
      value={props.value}
      required
      styles={{
        input: {
          height: "45px",
        },
        label: {
          fontSize: "18px",
          fontWeight: 700,
        },
      }}
    />
  );
}
