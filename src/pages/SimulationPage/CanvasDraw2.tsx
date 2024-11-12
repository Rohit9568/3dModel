import { useMediaQuery } from "@mantine/hooks";
import { ReactNode, useEffect, useRef, useState } from "react";
import { SideBarItems } from "../../@types/SideBar.d";
import CustomCursor from "../../components/CustomCursor/CustomCursor";
import { SidePenBar } from "../../components/Simulations/SidePenBar";

export function CanvasDraw2(props:{
    children: ReactNode;
    viewport:any
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastX, setLastX] = useState(10);
  const [lastY, setLastY] = useState(20);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [divDimensions, setDivDimensions] = useState({ width: 0, height: 0 });
  const [itemSelected, setItemSelected] = useState<SideBarItems>(
    SideBarItems.NULL
  );

  const isMd = useMediaQuery(`(max-width: 820px)`);
  function getMosuePositionOnCanvas(event: any) {
    const clientX = event.clientX || event.touches[0].clientX;
    const clientY = event.clientY || event.touches[0].clientY;
    const { offsetLeft, offsetTop } = event.target;
    const canvasX = clientX;
    const canvasY = clientY;
    if (isMd) return { x: canvasX, y: canvasY - 80 };
    else {
      return { x: canvasX - 250, y: canvasY - 100 };
    }
  }

  const startDrawing = (e: any) => {
    setIsDrawing(true);
    setLastX(e.nativeEvent.offsetX);
    setLastY(e.nativeEvent.offsetY);
  };

  const handleWritingStart = (event: any) => {
    event.preventDefault();

    const mousePos = getMosuePositionOnCanvas(event);
    const canvasContext = canvasRef.current!.getContext("2d")!;
    canvasContext.beginPath();
    canvasContext.moveTo(mousePos.x, mousePos.y);
    canvasContext.lineWidth =
      itemSelected === SideBarItems.Highlighter ? 20 : 2;
    canvasContext.strokeStyle =
      itemSelected === SideBarItems.Highlighter
        ? "rgba(255,255,0,0.1)"
        : "black";
    canvasContext.fill();
    setIsMouseDown(true);
  };
  const draw = (e: any) => {
    if (!isDrawing) return;
    const canvas: any = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.strokeStyle =
      itemSelected === SideBarItems.Highlighter
        ? "rgba(255,255,0,0.4)"
        : "black";
    ctx.beginPath();
    ctx.lineWidth = itemSelected === SideBarItems.Highlighter ? 20 : 2;
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

  const handleWritingInProgress = (event: any) => {
    // event.preventDefault();

    // if (isMouseDown) {
    const mousePos = getMosuePositionOnCanvas(event);
    const canvasContext = canvasRef.current!.getContext("2d")!;
    canvasContext.strokeStyle =
      itemSelected === SideBarItems.Highlighter
        ? "rgba(255,255,0,0.1)"
        : "black";
    // canvasContext.globalCompositeOperation = "multiply";
    canvasContext.lineTo(mousePos.x, mousePos.y);
    canvasContext.stroke();
    // }
  };

  const handleDrawingEnd = (event: any) => {
    event.preventDefault();

    if (isMouseDown) {
      const canvasContext = canvasRef.current!.getContext("2d")!;
      canvasContext.stroke();
    }

    setIsMouseDown(false);
  };

  useEffect(() => {
    if (itemSelected === SideBarItems.Erasor) {
      clearCanvas();
      setItemSelected(SideBarItems.NULL);
    }
  }, [itemSelected]);

  useEffect(() => {
    const divElement = props.viewport.current;
    if (itemSelected !== SideBarItems.NULL) {
      if (divElement) {
        const { offsetWidth, offsetHeight } = divElement;
        setDivDimensions({
          width: offsetWidth,
          height: offsetHeight -40,
        });
      }
    }
  }, [props.viewport, itemSelected]);
  return (
    <div
      style={{
        border: "violet solid 2px",
        height: "100vh",
        width: "100vw",
        position: "relative",
        backgroundColor: "white",
        // backgroundColor:'white',
      }}
    //   ref = { props.viewport }
      id="all-content-II"
    >
      <SidePenBar
        itemSelected={itemSelected}
        setItemSelected={setItemSelected}
      />
      <div
        style={{
          position: "absolute",
        }}
      >
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={(val) => {
            if (
              itemSelected === SideBarItems.Pen ||
              itemSelected === SideBarItems.Highlighter
            ) {
              draw(val);
            }
          }}
          onMouseUp={stopDrawing}
          onMouseOut={stopDrawing}
          onTouchStart={handleWritingStart}
          onTouchMove={handleWritingInProgress}
          onTouchEnd={handleDrawingEnd}
          // onTouchCancel={stopDrawing}
          style={{
            position: "absolute",
            border: "blue solid 1px",
            zIndex: 99,
            cursor:
              itemSelected === SideBarItems.Highlighter ||
              itemSelected === SideBarItems.Pen
                ? "none"
                : "auto",
          }}
          width={
            itemSelected === SideBarItems.NULL ||
            itemSelected === SideBarItems.WhiteBoard
              ? "0"
              : divDimensions.width
          }
          height={
            itemSelected === SideBarItems.NULL ||
            itemSelected === SideBarItems.WhiteBoard
              ? "0"
              : divDimensions.height
          }
        />
        {props.children}
      </div>
      {!isMd && itemSelected === SideBarItems.Highlighter && (
        <CustomCursor selectedItem={itemSelected} divId="all-content-II" />
      )}
      {!isMd && itemSelected === SideBarItems.Pen && (
        <CustomCursor selectedItem={itemSelected} divId="all-content-II" />
      )}
    </div>
  );
}
