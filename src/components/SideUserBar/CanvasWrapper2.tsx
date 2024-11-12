import { Fragment, ReactHTMLElement, ReactNode, useEffect, useRef, useState } from "react";
import { Box, ScrollArea } from "@mantine/core";
import CustomCursor from "../CustomCursor/CustomCursor";
import { SideBarItems } from "../../@types/SideBar.d";
import { useMediaQuery } from "@mantine/hooks";
import { Pages, TeachTabs } from "../_New/NewPageDesign/ModifiedOptionsSim";

interface CanvasWrapperProps {
  children: ReactNode;
  itemSelected: SideBarItems;
  setItemSelected: (x: SideBarItems) => void;
  currentPage: Pages;
  currentTab: string;
  viewportRef:any
  activeTab: TeachTabs | string | null
  //   topicId: string;
  //   isSidebarOpen: boolean;
}

export const CanvasWrapper2 = (props: CanvasWrapperProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastX, setLastX] = useState(10);
  const [lastY, setLastY] = useState(20);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [divDimensions, setDivDimensions] = useState({ width: 0, height: 0 });

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
      props.itemSelected === SideBarItems.Highlighter ? 20 : 2;
    canvasContext.strokeStyle =
      props.itemSelected === SideBarItems.Highlighter
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
      props.itemSelected === SideBarItems.Highlighter
        ? "rgba(255,255,0,0.4)"
        : "black";
    ctx.beginPath();
    ctx.lineWidth = props.itemSelected === SideBarItems.Highlighter ? 20 : 2;
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
      props.itemSelected === SideBarItems.Highlighter
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

  //   useEffect(() => {
  //     if (viewport && viewport.current)
  //       viewport.current.scrollTo({ top: 0, behavior: "smooth" });
  //   }, [props.topicId, props.currentTab]);

  useEffect(() => {
    if (props.itemSelected === SideBarItems.Erasor) {
      clearCanvas();
      props.setItemSelected(SideBarItems.NULL);
    }
  }, [props.itemSelected]);

  useEffect(() => {
    clearCanvas();
    props.setItemSelected(SideBarItems.NULL);
  }, [props.currentPage]);

  //   useEffect(() => {
  //     clearCanvas();
  //   }, [props.currentTab, props.topicId]);

  useEffect(() => {
    const divElement = props.viewportRef.current;
    if (props.itemSelected !== SideBarItems.NULL) {
      if (divElement) {
        const { offsetWidth, offsetHeight } = divElement;
        setDivDimensions({
          width: offsetWidth,
          height: offsetHeight,
        });
      }
    }
  }, [props.viewportRef, props.itemSelected]);

  //   useEffect(() => {
  //     props.setItemSelected(SideBarItems.NULL);
  //   }, [props.isSidebarOpen,viewport.current]);

  // useEffect(() => {
  //   const divElement = ref.current;
  //   if (divElement) {
  //     const { offsetWidth, offsetHeight } = divElement;
  //     setDivDimensions({ width: offsetWidth, height: offsetHeight });
  //   }
  // }, []);


  useEffect(() => {
    clearCanvas()
    stopDrawing()
  }, [props?.activeTab])


  return (
    <Fragment>
      <div
        style={{
          position: "relative",
          width: "100%",
        }}
        id="all-content"
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
              if (
                props.itemSelected === SideBarItems.Pen ||
                props.itemSelected === SideBarItems.Highlighter
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
              zIndex: 99,
              cursor:
                props.itemSelected === SideBarItems.Highlighter ||
                props.itemSelected === SideBarItems.Pen
                  ? "none"
                  : "auto",
              // border:'blue solid 1px'
            }}
            width={
              props.itemSelected === SideBarItems.NULL ||
              props.itemSelected === SideBarItems.WhiteBoard
                ? "0"
                : divDimensions.width
            }
            height={
              props.itemSelected === SideBarItems.NULL ||
              props.itemSelected === SideBarItems.WhiteBoard
                ? "0"
                : divDimensions.height
            }
          />
        </div>
      </div>
      <ScrollArea
        w={"100%"}
        h={"100%"}
        style={{
          overflowX: "hidden",
          cursor:
            props.itemSelected === SideBarItems.Highlighter ||
            props.itemSelected === SideBarItems.Pen
              ? "none"
              : "auto",
            // border:'red solid 1px'
          // border: "red solid 1px",
        }}
        viewportRef={props.viewportRef}
        // pt={30}
      >
       
        {props.itemSelected !== SideBarItems.WhiteBoard && props.children}
       
      </ScrollArea>
      {!isMd && props.itemSelected === SideBarItems.Highlighter && (
        <CustomCursor selectedItem={props.itemSelected} divId="all-content" />
      )}
      {!isMd && props.itemSelected === SideBarItems.Pen && (
        <CustomCursor selectedItem={props.itemSelected} divId="all-content" />
      )}
    </Fragment>
  );
};
