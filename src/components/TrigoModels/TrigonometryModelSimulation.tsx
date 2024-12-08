import React, { useEffect, useRef, useState } from 'react';
import { Box, Button, Input, Notification, Overlay, Text } from '@mantine/core';
import BuildingModel from './BuildingModel';
import { createUserSavedSimulation } from '../../features/Simulations/getSimulationSlice';
import { useLocation, useNavigate } from 'react-router-dom';
import { useMediaQuery } from '@mantine/hooks';
import { GetUserToken } from '../../utilities/LocalstorageUtility';
import ThreeJSSimulationHandler from '../threejsSimulationHandler/ThreeJSSimulationHandler';

enum MenuItemsEnum{
  ZOOMIN = 'ZOOMIN',
  ZOOMOUT='ZOOMOUT',
  CURSOR='CURSOR',
  PENCIL='PENCIL',
  ERASER='ERASER',
  RESET='RESET'
}

const bgImg = "https://vignam-content-images.s3.ap-south-1.amazonaws.com/2024-07-23T05-29-16-176Z.png";
const zoominImg = "https://vignam-content-images.s3.ap-south-1.amazonaws.com/2024-07-23T05-29-46-058Z.png";
const zoomoutImg = "https://vignam-content-images.s3.ap-south-1.amazonaws.com/2024-07-23T05-30-19-900Z.png";
const cursorImg = "https://vignam-content-images.s3.ap-south-1.amazonaws.com/2024-07-23T05-30-42-760Z.png";
const pencilImg = "https://vignam-content-images.s3.ap-south-1.amazonaws.com/2024-07-23T05-31-08-985Z.png";
const eraseImg = "https://vignam-content-images.s3.ap-south-1.amazonaws.com/2024-07-23T05-31-29-440Z.png";
const resetImg = "https://vignam-content-images.s3.ap-south-1.amazonaws.com/2024-07-23T05-32-11-947Z.png";
const buildingImg = "https://vignam-content-images.s3.ap-south-1.amazonaws.com/2024-07-23T05-32-37-435Z.png";
const hideImg = "https://vignam-content-images.s3.ap-south-1.amazonaws.com/2024-07-23T05-32-55-532Z.png";
const closeImg = "https://vignam-content-images.s3.ap-south-1.amazonaws.com/2024-07-23T05-33-13-901Z.png";
const maincloseImg = "https://vignam-content-images.s3.ap-south-1.amazonaws.com/2024-07-19T08-08-49-765Z.png";
const menuItems = [
    { id: MenuItemsEnum.ZOOMIN, name: 'zoom in', img: zoominImg },
    { id: MenuItemsEnum.ZOOMOUT, name: 'zoom out', img: zoomoutImg },
]
const annotationItems = [
    { id: MenuItemsEnum.CURSOR, name: 'cursor', img: cursorImg },
    // { id: 11, name: 'panImg', img: panImg },
    { id: MenuItemsEnum.PENCIL, name: 'pencil', img: pencilImg },
    { id: MenuItemsEnum.ERASER, name: 'eraser', img: eraseImg },
    { id: MenuItemsEnum.RESET, name: 'reset', img: resetImg }
]

const TrigonometryModelSimulation = () => {
    const location = useLocation();
    const isSmallScreen = useMediaQuery("(max-width: 768px)");
    const isMediumScreen = useMediaQuery("(max-width: 1072px)");
    const [building1Show, setBuilding1Show] = useState<boolean>(false);
    const [building2Show, setBuilding2Show] = useState<boolean>(false);
    const [isExplaination, setExplaination] = useState<boolean>(false);
    const [h, sh] = useState<string>('');
    const [b, sb] = useState<string>('');
    const [aoe, saoe] = useState<string>('');
    const [angle, sAngle] = useState<string>('');
    const [zoomValue, setZoomValue] = useState<number>(35);
    const [isPan, setIsPan] = useState<boolean>(false);
    const [isCursoron, setCursorOn] = useState<boolean>(true);
    const [drawingMode, setDrawingMode] = useState(false);
    const drawCanvasRef = useRef<HTMLCanvasElement | null>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [lastPosition, setLastPosition] = useState<{
      x: number;
      y: number;
    } | null>(null);
  const [isResetted, setResetted] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<boolean>(false);
  const [isDataTransfer, setDataTransfer] = useState<boolean>(false);
  const [isSave, setIsSave] = useState<boolean>(false);
  const [SaveTitle, setSaveTitle] = useState<string | null>(null);
  const [savedData, setSavedData] = useState<any>({});
  const dataFromState = location.state && location.state.data;
  const navigate = useNavigate();
  const pathParts = window.location.pathname.split('/');
  const sim_id = pathParts[pathParts.length - 1];
  
  const handleBackButton = ()=>{
    const currentPath = window.location.pathname;
    const segments = currentPath.split('/');
    const newPathname = segments.slice(0, -2).join('/');
    navigate(`${newPathname}`);
}

  useEffect(()=>{
    if(dataFromState){
  setBuilding1Show(dataFromState.data.isBuilding1);
  setBuilding2Show(dataFromState.data.isBuilding2);
  setSavedData(dataFromState.data);
}
  },[dataFromState])

  useEffect(()=>{
    if(isResetted){
      setTimeout(() => {
        setResetted(false);
      }, 2000);
    }
  },[isResetted])
  
    useEffect(() => {
        const canvas = drawCanvasRef.current;
    if (canvas) {
      canvas.width = window.innerWidth;

      canvas.height = window.innerHeight;
    }
  }, []);
  useEffect(() => {
    const handleWheel = (event: any) => {
      if (event.ctrlKey) {
        event.preventDefault();
      }
    };

    const canvas = document.querySelector("canvas");
    if (canvas) {
      canvas.addEventListener("wheel", handleWheel);
    }

    return () => {
      if (canvas) {
        canvas.removeEventListener("wheel", handleWheel);
      }
    };
  }, []);
  const handleMouseDown = (event: React.MouseEvent) => {
    if (drawingMode) {
      setCursorOn(false);
      setIsDrawing(true);
      setLastPosition({ x: event.clientX, y: event.clientY });
    }
  };

  const handleMouseUp = () => {
    if (drawingMode) {
      setIsDrawing(false);
      setLastPosition(null);
    }
  };
  const handleMouseMove = (event: React.MouseEvent) => {
    if (isDrawing && drawingMode && lastPosition) {
      const canvas = drawCanvasRef.current;
      const context = canvas?.getContext("2d");
      if (context) {
        context.strokeStyle = "black";
        context.lineWidth = 2;
        context.beginPath();
        context.moveTo(lastPosition.x, lastPosition.y);
        context.lineTo(event.clientX, event.clientY);
        context.stroke();
        setLastPosition({ x: event.clientX, y: event.clientY });
      }
    }
  };


    const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
      };
      const handleDragStart = (event: React.DragEvent<HTMLButtonElement>, id: string) => {
        event.dataTransfer.setData('modelId', id);
      };
      const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        const position = window.innerWidth*((1/zoomValue)/2)*((event.clientX/window.innerWidth)*2 - 1)
        const id = event.dataTransfer.getData('modelId');
        if(id == 'building'){
            if(position >=0){
              setBuilding1Show(true);
            }else if(position < 0){
              setBuilding2Show(true);
            }
        }
    }

    const handleBuildingClick = ()=>{
      if(!building1Show){
        setBuilding1Show(true);
      }else if(!building2Show){
        setBuilding2Show(true);
      }
    }

    const handleMenuItemClick = (id: string)=>{
        if(id === MenuItemsEnum.RESET){
            setDrawingMode(false);
            setIsPan(false);
            setZoomValue(35);
            setCursorOn(true);
            setResetted(true);
            setBuilding1Show(false);
            setBuilding2Show(false);
            const canvas = drawCanvasRef.current;
            if (canvas) {
              const context = canvas.getContext("2d");
              if (context) {
                context.clearRect(0, 0, canvas.width, canvas.height);
              }
            } 
        }else if(id == MenuItemsEnum.PENCIL){
            setDrawingMode(!drawingMode);
            setCursorOn(false);
        }else if(id == MenuItemsEnum.ERASER){
            const canvas = drawCanvasRef.current;
            if (canvas) {
              const context = canvas.getContext("2d");
              if (context) {
                context.clearRect(0, 0, canvas.width, canvas.height);
              }
            } 
        }else if(id == MenuItemsEnum.CURSOR){
            if(drawingMode){
                setDrawingMode(false);
                setCursorOn(true);
            }else if(!isCursoron){
                setCursorOn(true);
            }
        }
    }
    const handleZoomClick = (id: string)=>{
        if(id == MenuItemsEnum.ZOOMIN && zoomValue <=40){
            setZoomValue(zoomValue + 1);
        }else if(id == MenuItemsEnum.ZOOMOUT && zoomValue >=30){
            setZoomValue(zoomValue - 1);
        }
    }

    const handleHideClick = ()=>{
        setExplaination(false);
    }
    const handleShowClick = (h: string, b: 
    string, aoe: string, angle: string)=>{
        sh(h);
        sb(b);
        saoe(aoe);
        sAngle(angle);
        setExplaination(true);
    }

    const handleSaveClick  = ()=>{
      setDataTransfer(true);
    }
    const handleDataTransfer = (data: any)=>{
      setIsSave(false);
      if(data){
    const savedValue = {
        simulationType: "TrigoBasis",
        isBuilding1: building1Show,
        isBuilding2: building2Show,
         ...data
    }
    const requestedData = {
        name: SaveTitle ?? "Trigonometric Heights",
        simulationId: 'SIM-98715368-b544-4935-91b2-ad0fde086509',
        data: savedValue,
    }
    createUserSavedSimulation(requestedData).then((data)=>{
      setSuccessMessage(true);
      setDataTransfer(false);
      setTimeout(() => {
        setSuccessMessage(false);
      setDataTransfer(false);
      }, 4000);
    }).catch((err)=>{
      setErrorMessage(true);
      setDataTransfer(false);
      setTimeout(() => {
        setErrorMessage(false);
      setDataTransfer(false);
      }, 4000);
    })
  }
    }
 const handleCloseButton  = ()=>{
  setIsSave(false);
  setSaveTitle(null);
 }
 const handleSaveTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  setSaveTitle(event.target.value)
};

  return (
    <Box style={{position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundSize: 'cover', backgroundPosition: 'center', zIndex: 2,}}
    onDragOver={handleDragOver} onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} onMouseMove={handleMouseMove}>
      <ThreeJSSimulationHandler sim_id={sim_id} data={dataFromState} />
    <Box style={{position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundImage: `url(${bgImg})`, backgroundSize: 'cover', backgroundPosition: 'center',opacity: 0.7, zIndex: -1,}} />
      <Box style={{position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: '#BADEF4', opacity: 0.6, zIndex: -1,}} />
      <Button onClick={handleBackButton } variant='outline' style={{position: 'fixed', top: 10, right: 10, zIndex: 1001, padding: 0, border: '0.1px solid #BADEF4'}}>
          <img src={maincloseImg} alt="building" style={{ width: 35, height:  35,}} />
        </Button>
      <Box
                sx={{position: 'absolute', left: "50%", transform: 'translateX(-50%)', zIndex: 14, backgroundColor: 'black', padding: isMediumScreen? "4px" :'10px',
                    border: '2px solid black', borderRadius: '10px', display: 'flex',flexDirection:"row"  ,alignItems: 'center', gap: isMediumScreen ? 5 : 10, marginTop: '10px' }} >
                    <Button
                        key={1}
                        variant='outline'
                        draggable
                        onDragStart={(e) => handleDragStart(e, "building")}
                        onClick={handleBuildingClick}
                        sx={{
                            display: 'flex', alignItems: 'center', justifyContent: 'center', width: isMediumScreen ? 35: 40, height:  isMediumScreen ? 35:40, padding: 0,
                            '&:hover': {
                                opacity: 0.8,
                                border: '1px solid white',
                                backgroundColor: 'white',
                            },
                            backgroundColor: "white",
                            color: "white",
                        }}
                    >
                        <img src={buildingImg} alt="building" style={{ width: isMediumScreen ? 22:  25, height:  isMediumScreen ? 22: 25, }} />
                    </Button>
                <Box style={{height:isMediumScreen ? "40px" :'50px', width:'2px', backgroundColor: 'white'}} />
                {menuItems.map(item => (
                    <Button
                        key={item.id}
                        variant='outline'
                        onClick={() => handleZoomClick(item.id)}
                        sx={{
                            display: 'flex', alignItems: 'center', justifyContent: 'center', width: isMediumScreen ? 35: 40, height:  isMediumScreen ? 35:40, padding: 0,
                            transition: 'opacity 0.3s',
                            '&:hover': {
                                opacity: 0.8,
                                border: '1px solid white',
                                backgroundColor: 'white',
                            },
                            backgroundColor: "white",
                            color: "white",
                        }}
                    >
                        <img src={item.img} alt={item.name} style={{ width: isMediumScreen ? 22:  25, height:  isMediumScreen ? 22: 25,}} />
                    </Button>
                ))}
                <Box style={{height: isMediumScreen ? "40px" :'50px', width:'2px',  backgroundColor: 'white'}} />
                {annotationItems.map(item => (
                    <Button
                        key={item.id}
                        variant='outline'
                        onClick={() => handleMenuItemClick(item.id)}
                        sx={{
                            display: 'flex', alignItems: 'center', justifyContent: 'center',  width: isMediumScreen ? 35: 40, height:  isMediumScreen ? 35:40, padding: 0,
                            transition: 'opacity 0.3s',
                            '&:hover': {
                                opacity: 0.8,
                                border: '1px solid white',
                                backgroundColor: 'white',
                            },
                            backgroundColor: item.id===MenuItemsEnum.CURSOR && isCursoron ? "#4B65F6" :
                            item.id === MenuItemsEnum.PENCIL && drawingMode ? "#4B65F6": "white",
                            color: "white",
                        }}
                    >
                        <img src={item.img} alt={item.name} style={{width: isMediumScreen ? 22:  25, height:  isMediumScreen ? 22: 25, filter: item.id === MenuItemsEnum.CURSOR && !isCursoron ? "invert(1)":
                            item.id === MenuItemsEnum.PENCIL && drawingMode ? "invert(1)" : "invert(0)" }} />
                    </Button>
                ))}
                 <Button variant='outline' 
                 onClick={()=>setIsSave(true)}
                 sx={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'opacity 0.3s',
                    width: isMediumScreen ? 50 : 68 , height: isMediumScreen ? 35 : 40,
                    '&:hover': {
                        opacity: 0.8,
                        border: '1px solid white',
                        backgroundColor: 'white',
                    },
                    backgroundColor: "white",
                    color: 'black'
                }}>
                   <Text size={ isMediumScreen ? 15 : 18}>Save</Text>
                    </Button>
            </Box>
            <canvas ref={drawCanvasRef} style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%",
          pointerEvents: drawingMode ? "auto" : "none", display: drawingMode ? "block" : "none", zIndex: 10,}} />

{successMessage && 
    <Notification onClose={()=>setSuccessMessage(!successMessage)} color="green" radius="md"  style={{minWidth: '15%', position: 'fixed', top:100, left: '50%', transform: 'translateX(-50%)', zIndex: 11}} title="Successfully saved!">
</Notification>}
{errorMessage && 
    <Notification onClose={()=>setErrorMessage(!errorMessage)} color="red" radius="md"  style={{minWidth: '15%', position: 'fixed', top:100, left: '50%', transform: 'translateX(-50%)', zIndex: 11}} title="Error Occured">
Please try saving after sometime</Notification>}

            <BuildingModel onDrop={handleDrop} handleExplainationClick={handleShowClick} isBuilding1Shown={building1Show} isBuilding2Shown={building2Show} 
            zoomValue = {zoomValue} isPan={isPan} isResetted = {isResetted} handleDataTransfer={handleDataTransfer} isDataTransfer={isDataTransfer}
            savedData = {savedData} />

                {isExplaination && <>
                    <Overlay
                  opacity={0.7}
                  color="#000"
                  zIndex={10}
                />
            <Box style={{position: 'absolute', top:'50%',left: '50%', transform: 'translate(-50%, -50%)' , width: '45%', height:"60%", backgroundColor: 'white', zIndex: 11,
                borderRadius: '20px'
              }}>
                <Box style={{marginTop: '20px', paddingLeft: '20px',display: 'flex', justifyContent: 'space-between', paddingRight: '20px' }}>
                    <Text style={{color: 'black', fontWeight: '800', fontSize: '23px'}}>Explanation</Text>
                    <img src={hideImg} width={28} height={28} style={{cursor: 'pointer'}} onClick={handleHideClick} />
                </Box>
                <Box style={{ margin: '20px', fontSize: '18px', height: '80%', overflowY: 'auto', scrollbarWidth: 'thin'}}>
                    <Text lh={1.2}>
                    In trigonometry, we often find angles by comparing two sides of a triangle.
                    For a right-angled triangle, the ratio of the opposite side (height) to the adjacent side (base) helps us find the angle at the base.
                    </Text>
                    <Text mb={15} mt={2} lh={1.2}>
                    This ratio is called the tangent of the angle. We find the angle by calculating the 'inverse tangent' of this ratio.
                    </Text>
                    <Text lh={1.2}>
                    For our triangle, the height is <span style={{fontWeight: '800'}}>{h}</span> units, and the base is <span style={{fontWeight: '800'}}>{b}</span> units. So, we calculate the angle by finding the tan<sup>-1</sup> of the ratio (height/base).
                    </Text>
                    <Text mt={19} lh={1.2}>
                    This gives us the correct angle as <span style={{fontWeight: '800'}}>{aoe}°</span>.
                    </Text>
                    <Text mt={19} lh={1.2}>
                    Your angle was  <span style={{fontWeight: '800'}}>{angle}°</span>. Compare this with the correct angle to see how you did.
                    </Text>

                </Box>
            </Box></>}


            {isSave && <>
                  <Overlay opacity={0.8} color="#000" zIndex={1001} />
                  <Box style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: 'white',
                  padding: '20px', boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)', borderRadius: '8px',
                  zIndex: 1001, cursor: 'pointer', width: isSmallScreen ? "250px" : isMediumScreen? "35%" :'20%', }}>
                      <Box style={{marginBottom: '2px', display: 'flex', justifyContent: 'space-between', alignItems: 'top'}}>
                <Text size={25} weight={700} style={{marginBottom: '15px'}}>Save As</Text>
                <Box style={{cursor: 'pointer'}}>
                <img style={{cursor: 'pointer'}} onClick={handleCloseButton}
                 src={closeImg} width={20} height={20} />
                 </Box>
                </Box>
                <Text size='lg' mb={10}>Trigonometric Heights</Text>
                <Input
                    placeholder="Save As"
                    value={SaveTitle ?? ""}
                    onChange={handleSaveTitleChange}
                    style={{ marginTop: '2px', marginBottom: '10px' }}
                />
                    <Box  style={{ marginTop: '35px', display: 'flex', justifyContent: 'end', alignItems: 'end'  }}>
                    <Button style={{borderRadius: '20px', width: '70px', marginRight: '10px',  padding: '0', border: '1px solid #4B65F6', color:'#4B65F6' }} onClick={handleCloseButton} variant='outline'>Cancel</Button>
                    <Button style={{borderRadius: '20px', width: '120px', padding: '0', backgroundColor: '#4B65F6'}} onClick={handleSaveClick} color="blue">Save</Button>
                </Box>
        </Box></>}
    </Box>
  );
};

export default TrigonometryModelSimulation;
