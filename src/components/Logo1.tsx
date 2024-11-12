import { Group, Title, Image } from "@mantine/core";

export function Logo1(props: { title?: string; isWhite?: boolean }) {
  return (
    <Group align="center">
      <Group Text-align="center" spacing={5}>
        <img
          height={30}
          src={require(props.isWhite
            ? "../assets/LogoWhite.png"
            : "../assets/LOGO.png")}
        />
        <Title
          fz={25}
          style={{
            fontWeight: 700,

            color: props.isWhite ? "white" : "black",
          }}
        >
          {props.title ?? "VIGNAM"}
        </Title>
      </Group>
    </Group>
  );
}
