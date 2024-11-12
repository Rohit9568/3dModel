import  { Fragment, useEffect, useRef, useState } from "react";
import {
  createStyles,
  Button,
  Group,
  Container,
  Flex,
} from "@mantine/core";
import { useViewportSize } from "@mantine/hooks";

const useStyles = createStyles((theme) => ({
  wrapper: {
    padding: 0,
    minHeight: 650,
  },

  title: {
    marginBottom: theme.spacing.xl * 1.5,
  },
  item: {
    borderRadius: theme.radius.md,
    marginBottom: theme.spacing.lg,

    border: `1px solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[3]
    }`,
  },
  cana: {
    position: "relative",
  },
}));

interface CanvasDrawProps {
  videoLink:string
}

export const CanvasDrawVideo = (props: CanvasDrawProps) => {
  const { height, width } = useViewportSize();
  const { classes } = useStyles();
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastX, setLastX] = useState(10);
  const [lastY, setLastY] = useState(20);
  const [text, setText] = useState("");
  const [isPen, setisPen] = useState(false);
  const startDrawing = (e: any) => {
    setIsDrawing(true);
    setLastX(e.nativeEvent.offsetX);
    setLastY(e.nativeEvent.offsetY);
  };

  const draw = (e: any) => {
    if (!isDrawing) return;
    const canvas: any = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.beginPath();
    ctx.lineWidth = 2;
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    ctx.stroke();
    setLastX(e.nativeEvent.offsetX);
    setLastY(e.nativeEvent.offsetY);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };
  const clearCanvas = () => {
    const canvas: any = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const undoDraw = () => {
    const canvas: any = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.globalCompositeOperation = "destination-out";
    ctx.strokeStyle = "rgba(0,0,0,1)";
    ctx.lineWidth = 10;
    ctx.lineJoin = "round";
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(lastX - 1, lastY - 1);
    ctx.stroke();
    setLastX(lastX - 1);
    setLastY(lastY - 1);
  };

  const handleTextChange = (e: any) => {
    setText(e.target.value);
  };

  const addText = () => {
    const canvas: any = canvasRef.current;
    if (canvas !== null) {
      const ctx = canvas.getContext("2d");
      ctx.font = "24px sans-serif";
      ctx.fillText(text, lastX, lastY);
    }
  };

  const divRef = useRef(null);
  const [divDimensions, setDivDimensions] = useState({ width: 0, height: 0 });
  const [fixed, setFixed] = useState(false);

  const preventContextMenu = (event:any) => {
    event.preventDefault();
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.pageYOffset > 110) {
        setFixed(true);
      } else {
        setFixed(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  useEffect(() => {
    const divElement = divRef.current;
    if (divElement) {
      const { offsetWidth, offsetHeight } = divElement;
      setDivDimensions({ width: offsetWidth, height: offsetHeight });
    }
    setisPen(false);
  }, []);

  return (
    <Fragment>
      <Flex direction="column">
        <Group position="right">
          <Button onClick={clearCanvas} mx={10} variant="outline">
            Clear All
          </Button>
          <Button
            onClick={() => setisPen((prev) => !prev)}
            variant={!isPen ? "outline" : "filled"}
          >
            Pen
          </Button>
        </Group>
      </Flex>
      <Container
          size={"xl"}
          style={{
            paddingLeft: 0,
            paddingBottom: 10,
            paddingTop: 20,
            position: "relative",
            zIndex: "99",
          }}
          ref={divRef}
        >
          <div
            style={{
              position: "absolute",
            }}
          >
            <canvas
              ref={canvasRef}
              onMouseDown={startDrawing}
              onMouseMove={(val) => {
                if (isPen) draw(val);
              }}
              onMouseUp={stopDrawing}
              onMouseOut={stopDrawing}
              className={classes.cana}
              width={divDimensions.width}
              height={
                divDimensions.height
              }
              style={{
                zIndex:isPen?99:0
              }}
            />
          </div>
          <div>
          <div
          style={{
            width: "100%",
            paddingTop: "56.25%",
          }}
        >
        
          
          <iframe
            style={{
              position: "absolute",
              top: "0",
              left: "0",
              bottom: "0",
              right: "0",
              width: "100%",
              height: "100%",
            }}
            onContextMenu={preventContextMenu}
            allow="autoplay"
            src={props.videoLink}
          ></iframe>
        </div>
          </div> 
        </Container>
    </Fragment>
  );
};

