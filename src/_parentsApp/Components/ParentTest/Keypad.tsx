import { Input, NumberInput, Stack } from "@mantine/core";
import React, { useEffect, useState } from "react";

export function Keypad (props:{
  onKeyPress:(val:any)=>{},
  defaultInput?:string
}) {
  const [input, setInput] = useState(props.defaultInput??"");

  useEffect(()=>{
    setInput(props.defaultInput??"")
  },[props.defaultInput])


  const handleKeyPress  = (value: any) => {
    setInput(input + value);
    props.onKeyPress(input + value);
  };

  const handleDelete = () => {
    setInput(input.slice(0, -1));
      props.onKeyPress(input.slice(0, -1));
    }

  const buttonStyle = {
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "5px",
    backgroundColor: "#f0f0f0",
    cursor: "pointer",
    fontSize: "16px",
  };

  const deleteButtonStyle = {
    ...buttonStyle,
    color: "red",
  };

  return (
    <Stack>
      <Input
        placeholder="Your Answer!"
        value={input}
        onChange={(num) => {}}
        contentEditable={false}
        readOnly
      />
      <div
        style={{
          border: "2px solid #ccc",
          padding: "15px",
          borderRadius: "5px",
          width: "160px",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "5px",
            }}
          >
            <button style={buttonStyle} onClick={() => handleKeyPress("1")}>
              1
            </button>
            <button style={buttonStyle} onClick={() => handleKeyPress("2")}>
              2
            </button>
            <button style={buttonStyle} onClick={() => handleKeyPress("3")}>
              3
            </button>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "5px",
            }}
          >
            <button style={buttonStyle} onClick={() => handleKeyPress("4")}>
              4
            </button>
            <button style={buttonStyle} onClick={() => handleKeyPress("5")}>
              5
            </button>
            <button style={buttonStyle} onClick={() => handleKeyPress("6")}>
              6
            </button>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "5px",
            }}
          >
            <button style={buttonStyle} onClick={() => handleKeyPress("7")}>
              7
            </button>
            <button style={buttonStyle} onClick={() => handleKeyPress("8")}>
              8
            </button>
            <button style={buttonStyle} onClick={() => handleKeyPress("9")}>
              9
            </button>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <button style={deleteButtonStyle} onClick={handleDelete}>
              Del
            </button>
            <button style={buttonStyle} onClick={() => handleKeyPress(".")}>
              .
            </button>
            <button style={buttonStyle} onClick={() => handleKeyPress("0")}>
              0
            </button>
          </div>
      </div>
      </div>
    </Stack>
  );

}

export default Keypad;
