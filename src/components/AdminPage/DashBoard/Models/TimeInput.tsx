import { Checkbox } from "@mantine/core";

export function CustomCheckBox(props: {
  label: string;
  checked: boolean;
  onChange: (e: any) => void;
}) {
  return (
    <Checkbox
      label={props.label}
      checked={props.checked}
      onChange={(event) => {
        props.onChange(event);
      }}
      styles={{
        label: {
          fontWeight: 600,
          fontSize: 16,
        },
      }}
    />
  );
}
