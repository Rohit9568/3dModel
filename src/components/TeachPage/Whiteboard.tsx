import { Excalidraw } from "@excalidraw/excalidraw";
import { Center } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";

function Whiteboard() {
  const isMd = useMediaQuery(`(max-width: 820px)`);

  return (
    <Center
      style={{ height: "90vh", width: "100%" }}
    >
      <Excalidraw />
    </Center>
  );
}

export default Whiteboard;
