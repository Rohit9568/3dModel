import { Box, Button, Divider, Group, Input, Stack } from "@mantine/core";
import { useState } from "react";

export const CalculatorModal = () => {
  const [input, setInput] = useState<string>("");
  const [result, setResult] = useState<string>("");

  const handleButtonClick = (value: string) => {
    if (value === "C") {
      setInput("");
      setResult("");
    } else if (value === "=") {
      try {
        const formattedInput = input.replace(/x/g, "*").replace(/÷/g, "/");
        setResult(eval(formattedInput).toString());
        setInput(eval(formattedInput).toString());
      } catch (error) {
        setResult("Invalid input");
      }
    } else if (value === "⌫") {
      setInput((prev) => prev.slice(0, -1));
    } else {
      setInput((prev) => prev + value);
    }
  };

  const getButtonStyle = (value: string) => {
    if (value === "C") {
      return { backgroundColor: "#FF5959", color: "#FFFFFF", fontSize: 15 };
    }
    if (value === "=") {
      return { backgroundColor: " #66FF7F", color: "#FFFFFF", fontSize: 15 };
    }
    return { backgroundColor: "#F0F0F0", color: "#000000", fontSize: 15 };
  };

  return (
    <>
      <Box sx={{ width: "100%", padding: 5, paddingTop: 0 }}>
        <Input
          value={result}
          readOnly
          placeholder="Result"
          sx={{
            input: {
              backgroundColor: "#F0F0F0",
              border: "none",
              textAlign: "right",
              fontSize: 15,
            },
          }}
        />
        <Input
          value={input}
          placeholder="Input"
          sx={{
            marginTop: 5,
            input: {
              backgroundColor: "#F0F0F0",
              border: "none",
              textAlign: "right",
              fontSize: 15,
            },
          }}
        />
        <Divider size={2} sx={{ marginTop: 8 }} />
        <Stack spacing="xs">
          <Group grow sx={{ marginTop: 10 }}>
            {["C", "÷", "x", "-"].map((value) => (
              <Button
                sx={getButtonStyle(value)}
                key={value}
                onClick={() => handleButtonClick(value)}
              >
                {value}
              </Button>
            ))}
          </Group>
          <Group grow>
            {["7", "8", "9", "+"].map((value) => (
              <Button
                sx={getButtonStyle(value)}
                key={value}
                onClick={() => handleButtonClick(value)}
              >
                {value}
              </Button>
            ))}
          </Group>
          <Group grow>
            {["4", "5", "6", "."].map((value) => (
              <Button
                sx={getButtonStyle(value)}
                key={value}
                onClick={() => handleButtonClick(value)}
              >
                {value}
              </Button>
            ))}
          </Group>
          <Group grow>
            {["1", "2", "3", "="].map((value) => (
              <Button
                sx={getButtonStyle(value)}
                key={value}
                onClick={() => handleButtonClick(value)}
              >
                {value}
              </Button>
            ))}
          </Group>
          <Group grow>
            {["0", "⌫"].map((value) => (
              <Button
                sx={getButtonStyle(value)}
                key={value}
                onClick={() => handleButtonClick(value)}
              >
                {value}
              </Button>
            ))}
          </Group>
        </Stack>
      </Box>
    </>
  );
};
