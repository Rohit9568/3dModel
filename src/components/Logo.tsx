import { Group, Title, Image } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { useNavigate } from "react-router-dom";

export function Logo(props: {
  title?: string;
  size?: "default" | "small";
  icon: string;
}) {
  const navigate = useNavigate();
  const isMd = useMediaQuery(`(max-width: 800px)`);

  const logoSizes = {
    default: { height: 40, width: 32 },
    small: { height: 30, width: 23 },
  };
  const textSizes = {
    default: { fontSize: 26 },
    small: { fontSize: 18 },
  };

  const currentLogoSize = logoSizes[props.size ?? "default"];
  const currentTextSize = textSizes[props.size ?? "default"];

  return (
    <Group
      onClick={() => {
        navigate("/teach");
      }}
      align="center"
      style={{ cursor: "pointer" }}
    >
      <img src={props.icon} height={40} width={40} />
      {!isMd && (
        <Title style={{ fontWeight: 700 }} fz={currentTextSize.fontSize}>
          {props.title ?? "VIGNAM"}
        </Title>
      )}
    </Group>
  );
}
