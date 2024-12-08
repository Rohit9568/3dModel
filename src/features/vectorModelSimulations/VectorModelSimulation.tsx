import React, { useEffect, useRef, useState } from 'react';
import { Box, Group, Button, Text, Slider, Checkbox, Container, Notification, Overlay, Input } from '@mantine/core';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import BoatSimulation from './BoatSimulation';
import * as THREE from 'three';
import { useMediaQuery } from '@mantine/hooks';
import AeroplaneSimulation from './AeroplaneSimulation';
import CannonSimulation from './CannonSimulation';
import WedgeSimulation from './WedgeSimulation';
import VectorGraph from './VectorGraph';
import { createUserSavedSimulation } from '../Simulations/getSimulationSlice';
import { useLocation, useNavigate } from 'react-router-dom';
import { GetUserToken } from '../../utilities/LocalstorageUtility';
import ThreeJSSimulationHandler from '../../components/threejsSimulationHandler/ThreeJSSimulationHandler';

enum ModelType{
  BOATMODEL="BOATMODEL",
  AEROPLANEMODEL="AEROPLANEMODEL",
  CANNONMODEL="CANNONMODEL",
  WEDGEMODEL="WEDGEMODEL",
  GRAPHMODEL="WEDGEMODEL",
}

const modelItems = [
    { id: 1, name: 'BoatSimulation', img: "https://vignam-content-images.s3.ap-south-1.amazonaws.com/2024-07-19T07-58-01-862Z.png" },
    { id: 2, name: 'AeroplaneSimulation', img: "https://vignam-content-images.s3.ap-south-1.amazonaws.com/2024-07-19T07-48-55-854Z.png"},
    { id: 3, name: 'CannonSimulation', img: "https://vignam-content-images.s3.ap-south-1.amazonaws.com/2024-07-19T07-58-38-742Z.png" },
    { id: 4, name: 'WedgeSimulation', img: "https://vignam-content-images.s3.ap-south-1.amazonaws.com/2024-07-19T07-59-03-482Z.png" },
    { id: 5, name: 'graph', img: "https://vignam-content-images.s3.ap-south-1.amazonaws.com/2024-07-19T07-59-22-467Z.png" },
    // { id: 6, name: 'vector', img: vectorImg },
]
const menuItems = [
    { id: 8, name: 'zoom in', img: "https://vignam-content-images.s3.ap-south-1.amazonaws.com/2024-07-19T07-59-51-504Z.png" },
    { id: 9, name: 'zoom out', img: "https://vignam-content-images.s3.ap-south-1.amazonaws.com/2024-07-19T08-00-06-254Z.png"},
]
const annotationItems = [
    { id: 10, name: 'cursor', img: "https://vignam-content-images.s3.ap-south-1.amazonaws.com/2024-07-19T08-00-26-504Z.png" },
    // { id: 11, name: 'panImg', img: "https://vignam-content-images.s3.ap-south-1.amazonaws.com/2024-07-19T08-00-46-579Z.png" },
    { id: 12, name: 'pencil', img: "https://vignam-content-images.s3.ap-south-1.amazonaws.com/2024-07-19T08-01-03-464Z.png" },
    { id: 14, name: 'eraser', img: "https://vignam-content-images.s3.ap-south-1.amazonaws.com/2024-07-19T08-01-23-295Z.png" },
    { id: 15, name: 'reset', img: "https://vignam-content-images.s3.ap-south-1.amazonaws.com/2024-07-19T08-01-41-855Z.png" }
]

const selectKnobImg = "https://vignam-content-images.s3.ap-south-1.amazonaws.com/2024-07-19T08-03-24-745Z.png";
const PlayImg = "https://vignam-content-images.s3.ap-south-1.amazonaws.com/2024-07-19T08-05-10-968Z.png";
const PauseImg = "https://vignam-content-images.s3.ap-south-1.amazonaws.com/2024-07-19T08-05-46-492Z.png";
const deleteImg = "https://vignam-content-images.s3.ap-south-1.amazonaws.com/2024-07-19T08-06-23-123Z.png";
const saveImg = "https://vignam-content-images.s3.ap-south-1.amazonaws.com/2024-07-19T08-07-04-248Z.png";
const closeImg = "https://vignam-content-images.s3.ap-south-1.amazonaws.com/2024-07-19T08-07-39-787Z.png";
const maincloseImg = "https://vignam-content-images.s3.ap-south-1.amazonaws.com/2024-07-19T08-08-49-765Z.png";

const VectorModelSimulation: React.FC = () => {
    const location = useLocation();
    const [isCursorOn, setCursorOn] = useState<boolean>(true);
    const [showBoatSimulation, setShowBoatSimulation] = useState<boolean>(false);
    const [showAeroplaneSimulation, setShowAeroplaneSimulation] = useState<boolean>(false);
    const [showCannonSimulation, setShowCannonSimulation] = useState<boolean>(false);
    const [showWedgeSimulation, setShowWedgeSimulation] = useState<boolean>(false);
    const [showSimulation, setShowSimulation] = useState<boolean>(false);
    const [velocityStream, setVelocityStream] = useState<number>(2);
    const [magnitudeBoat, setMagnitudeBoat] = useState<number>(2);
    const [directionBoat, setDirectionBoat] = useState<number>(4);
    const[directionAir, setDirectionAir] = useState<number>(4);
    const [showResultant, setShowResultant] = useState<boolean>(true);
    const [showValues, setShowValues] = useState<boolean>(false);
    const [boatAnimation, setBoatAnimation] = useState<boolean>(false);
    const [resetPosition, setResetPositoin] = useState<boolean>(false);
    const [showreset, setReset] = useState<boolean>(false);
    const [launchVelocity, setLaunchVelocity] = useState<number>(14);
    const [launchAngle, setLaunchAngle] = useState<number>(3);
    const [gravityValue,  setGravityValue] = useState<number>(10);
    const [frictionCoefficient, setFrictionCoefficient] = useState<number>(0.5);
    const [wedgeAngle, setWedgeAngle] = useState<number>(3);
    const [boxWeight, setBoxWeight] = useState<number>(5);
    const [showGraphScene, setShowGraphScene] = useState<boolean>(false)
    const [vector1,setVector1] = useState<boolean>(false);
    const [vector2,setVector2] = useState<boolean>(false);
    const [vectorangle, setvectorAngle] = useState<number>(2);
    const [vectorlength, setVectorLength] = useState<number>(8);
    const [vector2angle, setVector2Angle] = useState<number>(-1);
    const [vector2length, setVector2Length] = useState<number>(8);
    const [vector1selected, isVector1Selected] = useState<boolean>(false);
    const [vector2selected, isVector2Selected] = useState<boolean>(false);
    const isSmallScreen = useMediaQuery("(max-width: 768px)");
    const isMediumScreen = useMediaQuery("(max-width: 1024px");
    const [drawingMode, setDrawingMode] = useState(false);
    const drawCanvasRef = useRef<HTMLCanvasElement | null>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [lastPosition, setLastPosition] = useState<{
      x: number;
      y: number;
    } | null>(null);
    const [isPan, setIsPan] = useState<boolean>(false);
    const [zoom, setZoom] = useState<number>(25);
    const [isSaveOpen, setisSaveOpen] = useState<boolean>(false);
    const [successmessage, setSuccessmessage] = useState<boolean>(false);
    const [errorMessage, setErrormessage] = useState<boolean>(false);
    const [SaveTitle, setSaveTitle] = useState<string | null>(null);
    const navigate = useNavigate();
    const pathParts = window.location.pathname.split('/');
    const sim_id = pathParts[pathParts.length - 1];

    const dataFromState = location.state && location.state.data;
    useEffect(()=>{
        if(dataFromState){
            if(dataFromState.data.simulationType == ModelType.CANNONMODEL){
                setShowCannonSimulation(true);
                setLaunchAngle(dataFromState.data.launchAngle);
                setLaunchVelocity(dataFromState.data.launchVelocity);
                setGravityValue(dataFromState.data.gravity);
                setShowResultant(dataFromState.data.showResultant);
            }else if(dataFromState.data.simulationType == ModelType.BOATMODEL){
                setShowBoatSimulation(true);
                setVelocityStream(dataFromState.data.velocityStream);
                setMagnitudeBoat(dataFromState.data.magnitudeBoat);
                setDirectionBoat(dataFromState.data.directionBoat);
                setShowResultant(dataFromState.data.showResultant);
            }else if(dataFromState.data.simulationType == ModelType.AEROPLANEMODEL){
                setShowAeroplaneSimulation(true);
                setVelocityStream(dataFromState.data.velocityAir);
                setDirectionAir(dataFromState.data.directionAir);
                setMagnitudeBoat(dataFromState.data.magnitudeAeroplane);
                setDirectionBoat(dataFromState.data.directionAeroplane);
            }else if(dataFromState.data.simulationType == ModelType.WEDGEMODEL){
                setShowWedgeSimulation(true);
                setFrictionCoefficient(dataFromState.data.frictionCoefficient);
                setWedgeAngle(dataFromState.data.wedgeAngle);
                setBoxWeight(dataFromState.data.boxWeight);
                setGravityValue(dataFromState.data.gravity);
                setShowResultant(dataFromState.data.showResultant);
            }else if(dataFromState.data.simulationType == ModelType.GRAPHMODEL){
                setShowGraphScene(true);
                setVector1(dataFromState.data.vector1);
                setVector2(dataFromState.data.vector2);
                isVector1Selected(dataFromState.data.isVector1Selected);
                isVector2Selected(dataFromState.data.isVector2Selected);
                setVectorLength(dataFromState.data.selectedVectorLength);
                setvectorAngle(dataFromState.data.selectedVectorAngle);
                setShowResultant(dataFromState.data.showResultant);
                setVector2Angle(dataFromState.data.vector2Angle);
                setVector2Length(dataFromState.data.vector2Length);
            }
        }
    },[dataFromState])

    const handleBackButton = ()=>{
        const currentPath = window.location.pathname;
        const segments = currentPath.split('/');
        const newPathname = segments.slice(0, -2).join('/');
        navigate(`${newPathname}`);
    }

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
        context.strokeStyle = "white";
        context.lineWidth = 2;
        context.beginPath();
        context.moveTo(lastPosition.x, lastPosition.y);
        context.lineTo(event.clientX, event.clientY);
        context.stroke();
        setLastPosition({ x: event.clientX, y: event.clientY });
      }
    }
  };
    const handleMenuItemClick = (key: number) => {
        if (key === 10) {
            setCursorOn(true);
            setDrawingMode(false);
        }else if(key === 14){
            const canvas = drawCanvasRef.current;
            if (canvas) {
              const context = canvas.getContext("2d");
              if (context) {
                context.clearRect(0, 0, canvas.width, canvas.height);
              }
            }
        }else if(key === 15){
        setisSaveOpen(false);
            setBoatAnimation(false);
            setResetPositoin(true);
            setVector1(false);
            setVector2(false);
        setDrawingMode(false);
        setIsPan(false);
        setZoom(25);
      setCursorOn(true);
      const canvas = drawCanvasRef.current;
      if (canvas) {
        const context = canvas.getContext("2d");
        if (context) {
          context.clearRect(0, 0, canvas.width, canvas.height);
        }
      }
    }else if(key === 12){
        setDrawingMode(!drawingMode);
        setCursorOn(false)
    }else if(key === 11){
        setIsPan(!isPan)
    }else if(key === 8 && zoom <30){
        setZoom(zoom+1)
    }else if(key === 9 && zoom >20){
        setZoom(zoom-1)
    }
    }

    const handleDragStart = (event: React.DragEvent<HTMLButtonElement>, id: number) => {
        event.dataTransfer.setData('modelId', id.toString());
      };

      const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        const id = event.dataTransfer.getData('modelId');
        if (id == '1') {
            setShowBoatSimulation(true);
            setShowAeroplaneSimulation(false);
            setShowCannonSimulation(false);
            setShowWedgeSimulation(false);
            setBoatAnimation(false);
            setShowGraphScene(false);
            setZoom(25);
            setDrawingMode(false);
            handleMenuItemClick (14);
            handleMouseUp();
        } else if (id == '2') {
            setShowBoatSimulation(false);
            setShowAeroplaneSimulation(true);
            setShowCannonSimulation(false);
            setShowWedgeSimulation(false);
            setBoatAnimation(false);
            setZoom(25);
            setShowGraphScene(false);
            setDrawingMode(false);
            handleMenuItemClick (14);
            handleMouseUp();
        }else if(id == '3'){
            setShowBoatSimulation(false);
            setShowAeroplaneSimulation(false);
            setShowCannonSimulation(true);
            setShowWedgeSimulation(false);
            setBoatAnimation(false);
            setShowGraphScene(false);
            setZoom(25);
            setDrawingMode(false);
            handleMenuItemClick (14);
            handleMouseUp();
        }else if(id == '4'){
            setBoatAnimation(false);
            setShowWedgeSimulation(true);
            setShowBoatSimulation(false);
            setShowAeroplaneSimulation(false);
            setShowCannonSimulation(false);
            setShowGraphScene(false);
            setZoom(25);
            setDrawingMode(false);
            handleMenuItemClick (14);
            handleMouseUp();
        } else if (id == '5') {
            setShowGraphScene(true);
            setBoatAnimation(false);
            setShowWedgeSimulation(false);
            setShowBoatSimulation(false);
            setShowAeroplaneSimulation(false);
            setShowCannonSimulation(false);
            setZoom(25);
            setDrawingMode(false);
            handleMenuItemClick (14);
            handleMouseUp();
        }
    };
    
      const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
      };
      const handleBoatAnimation=()=>{
          setResetPositoin(false);
          setBoatAnimation(!boatAnimation);
      }

    const handledeletebutton = () => {
        setShowBoatSimulation(false);
        setShowAeroplaneSimulation(false);
        setShowCannonSimulation(false);
        setShowWedgeSimulation(false);
        setShowGraphScene(false);
        setResetPositoin(false);
        setBoatAnimation(false);
        setVector1(false);
        setVector2(false);
        isVector1Selected(false);
        isVector2Selected(false);
        setIsPan(false);
        setZoom(25);
        setisSaveOpen(false);
    };

    const handleSaveButtonclick=()=>{
        setisSaveOpen(false);
        if(showBoatSimulation){
            const savedValue = {
                simulationType: ModelType.BOATMODEL,
                velocityStream: velocityStream,
                magnitudeBoat: magnitudeBoat,
                directionBoat: directionBoat,
                showResultant: showResultant,
            }
            const requestedData = {
                name: SaveTitle ?? 'Vector Model Simulation (Boat)',
                simulationId: 'SIM-e5ac893d-ce6d-4272-b30c-73229e69c694',
                data: savedValue,
            }
            createUserSavedSimulation(requestedData).then((data)=>{
                setSuccessmessage(true);
                setTimeout(() => {
                  setSuccessmessage(false);
                }, 4000);
              }).catch((err)=>{
                setErrormessage(true);
                setTimeout(() => {
                  setErrormessage(false);
                }, 4000);
              })
        }else if(showAeroplaneSimulation){
            const savedValue = {
                simulationType: ModelType.AEROPLANEMODEL,
                velocityAir: velocityStream,
                directionAir: directionAir,
                magnitudeAeroplane: magnitudeBoat,
                directionAeroplane: directionBoat,
            }
            const requestedData = {
                name: SaveTitle ?? 'Vector Model Simulation (Aeroplane)',
                simulationId: 'SIM-e5ac893d-ce6d-4272-b30c-73229e69c694',
                data: savedValue,
            }
            createUserSavedSimulation(requestedData).then((data)=>{
                setSuccessmessage(true);
                setTimeout(() => {
                  setSuccessmessage(false);
                }, 4000);
              }).catch((err)=>{
                setErrormessage(true);
                setTimeout(() => {
                  setErrormessage(false);
                }, 4000);
              })
        }else if(showCannonSimulation){
            const savedValue = {
                simulationType: ModelType.CANNONMODEL,
                launchAngle: launchAngle,
                launchVelocity: launchVelocity,
                gravity: gravityValue,
                showResultant: showResultant,
            }
            const requestedData = {
                name: SaveTitle ?? 'Vector Model Simulation (Cannon)',
                simulationId: 'SIM-e5ac893d-ce6d-4272-b30c-73229e69c694',
                data: savedValue,
            }
            createUserSavedSimulation(requestedData).then((data)=>{
                setSuccessmessage(true);
                setTimeout(() => {
                  setSuccessmessage(false);
                }, 4000);
              }).catch((err)=>{
                setErrormessage(true);
                setTimeout(() => {
                  setErrormessage(false);
                }, 4000);
              })
        }else if(showWedgeSimulation){
            const savedValue = {
                simulationType: ModelType.WEDGEMODEL,
                frictionCoefficient: frictionCoefficient,
                wedgeAngle: wedgeAngle,
                boxWeight: boxWeight,
                gravity: gravityValue,
                showResultant: showResultant,
            }
            const requestedData = {
                name: SaveTitle ?? 'Vector Model Simulation (Wedge)',
                simulationId: 'SIM-e5ac893d-ce6d-4272-b30c-73229e69c694',
                data: savedValue,
            }
            createUserSavedSimulation(requestedData).then((data)=>{
                setSuccessmessage(true);
                setTimeout(() => {
                  setSuccessmessage(false);
                }, 4000);
              }).catch((err)=>{
                setErrormessage(true);
                setTimeout(() => {
                  setErrormessage(false);
                }, 4000);
              })
        }else if(showGraphScene){
            const savedValue = {
                simulationType: ModelType.GRAPHMODEL,
                vector1: vector1, 
                vector2: vector2,
                isVector1Selected: vector1selected,
                isVector2Selected: vector2selected, 
                selectedVectorLength: vectorlength,
                selectedVectorAngle: vectorangle,
                showResultant: showResultant,
                vector2Length: vector2length, 
                vector2Angle: vector2angle,
            }
            const requestedData = {
                name: SaveTitle ?? 'Vector Model Simulation (Vectors)',
                simulationId: 'SIM-e5ac893d-ce6d-4272-b30c-73229e69c694',
                data: savedValue,
            }
            createUserSavedSimulation(requestedData).then((data)=>{
                setSuccessmessage(true);
                setTimeout(() => {
                  setSuccessmessage(false);
                }, 4000);
              }).catch((err)=>{
                setErrormessage(true);
                setTimeout(() => {
                  setErrormessage(false);
                }, 4000);
              })
        }
    }


    const handleclosebutton  = ()=>{
        setisSaveOpen(false);
        setSaveTitle(null);
       }
       const handleSaveTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSaveTitle(event.target.value)
      };
      const stopWedgeAnimation=()=>{
        setBoatAnimation(false);
      }
    return (
        <Box
            sx={{
                width: '100vw',
                height: '100vh',
                background: `linear-gradient(180deg, #2B2C43 0%, #111018 100%)`,
                position: 'absolute',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: -1, 
            }}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
        >
              
                <div
        style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundImage: `url("https://vignam-content-images.s3.ap-south-1.amazonaws.com/2024-07-19T08-02-34-609Z.png")`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            zIndex: 0,
        }}
    />
          <canvas
        ref={drawCanvasRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          pointerEvents: drawingMode ? "auto" : "none",
          display: drawingMode ? "block" : "none",
          zIndex: 10,
        }}
      />
        {successmessage && 
    <Notification onClose={()=>setSuccessmessage(!successmessage)} color="green" radius="md"  style={{minWidth: '15%', position: 'fixed', top:100, left: '50%', transform: 'translateX(-50%)', zIndex: 1001}} title="Successfully saved!">
</Notification>}
{errorMessage && 
    <Notification onClose={()=>setErrormessage(!errorMessage)} color="red" radius="md"  style={{minWidth: '15%', position: 'fixed', top:100, left: '50%', transform: 'translateX(-50%)',zIndex: 1001}} title="Error Occured">
Please try saving after sometime</Notification>}
            <Box
                sx={{position: 'absolute', top:isSmallScreen ? '': 10,right:isSmallScreen? 10: "" , left:isSmallScreen? "": "50%", transform:isSmallScreen? "": 'translateX(-50%)', zIndex: 1001, backgroundColor: 'black', padding: isSmallScreen ? "4px": '10px',
                    border: '2px solid black', borderRadius: '10px', display: 'flex',flexDirection:isSmallScreen? "column":"row"  ,alignItems: 'center', gap: isSmallScreen ? 5 : 10, }}
            >
            {modelItems.map(item => (
                    <Button
                        key={item.id}
                        variant='outline'
                        draggable
                        onDragStart={(e) => handleDragStart(e, item.id)}
                        sx={{
                            display: 'flex', alignItems: 'center', justifyContent: 'center', width: isSmallScreen ? 30 :  40, height: isSmallScreen? 30: 40, padding: 0,
                            '&:hover': {
                                opacity: 0.8,
                                border: '1px solid white',
                                backgroundColor: 'white',
                            },
                            backgroundColor:
                                item.id === 10 && isCursorOn ? "#4B65F6" : "white",
                            color: "white",
                        }}
                    >
                        <img src={item.img} alt={item.name} style={{ width: 25, height: 25, filter: item.id === 10 && isCursorOn ? 'invert(1)' : 'invert(0)' }} />
                    </Button>
                ))}
                <Box style={{height:isSmallScreen? "2px": '50px', width:isSmallScreen? '35px' :'2px', backgroundColor: 'white'}} />
                {menuItems.map(item => (
                    <Button
                        key={item.id}
                        variant='outline'
                        onClick={() => handleMenuItemClick(item.id)}
                        sx={{
                            display: 'flex', alignItems: 'center', justifyContent: 'center', width:  isSmallScreen ? 30 : 40, height:  isSmallScreen ? 30 : 40, padding: 0,
                            transition: 'opacity 0.3s',
                            '&:hover': {
                                opacity: 0.8,
                                border: '1px solid white',
                                backgroundColor: 'white',
                            },
                            backgroundColor:
                                item.id === 10 && isCursorOn 
                                ? "#4B65F6": "white",
                            color: "white",
                        }}
                    >
                        <img src={item.img} alt={item.name} style={{ width: 25, height: 25, filter: item.id === 10 && isCursorOn ? 'invert(1)' : 'invert(0)' }} />
                    </Button>
                ))}
                <Box style={{height:isSmallScreen? "2px": '50px', width:isSmallScreen? '35px' :'2px',  backgroundColor: 'white'}} />
                {annotationItems.map(item => (
                    <Button
                        key={item.id}
                        variant='outline'
                        onClick={() => handleMenuItemClick(item.id)}
                        sx={{
                            display: 'flex', alignItems: 'center', justifyContent: 'center', width: isSmallScreen ? 30 :  40, height: isSmallScreen ? 30 :  40, padding: 0,
                            transition: 'opacity 0.3s',
                            '&:hover': {
                                opacity: 0.8,
                                border: '1px solid white',
                                backgroundColor: 'white',
                            },
                            backgroundColor:
                                item.id === 10 && isCursorOn ? "#4B65F6" :
                                item.id ===12 && drawingMode
                                ? "#4B65F6" :
                                item.id === 11 && isPan
                                ? "#4B65F6": "white",
                            color: "white",
                        }}
                    >
                        <img src={item.img} alt={item.name} style={{ width: 25, height: 25, filter: item.id === 10 && isCursorOn ? 'invert(1)' : item.id===12 && drawingMode ? "invert(1)": item.id === 11 && isPan ? 'invert(1)': 'invert(0)' }} />
                    </Button>
                ))}
                {!isSmallScreen && 
                    <Button onClick={()=>setisSaveOpen(true)} sx={{display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'opacity 0.3s', width: 70,
                    '&:hover': { opacity: 0.8, border: '1px solid white', backgroundColor: 'white',},
                    backgroundColor: "white", color: 'black'}}>
                        <img src={saveImg} /><Text sx={{marginLeft: '5px'}}>Save</Text>
                    </Button>}
            </Box>
            {isSmallScreen && 
                    <Button onClick={()=>setisSaveOpen(true)} sx={{position: 'absolute', bottom: 20, right: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'opacity 0.3s', width: 70,
                    '&:hover': { opacity: 0.8, border: '1px solid white', backgroundColor: 'white',},
                    backgroundColor: "white", color: 'black'}}>
                        <img src={saveImg} /><Text sx={{marginLeft: '5px'}}>Save</Text>
                    </Button>}

                    {isSaveOpen && <>
                  <Overlay opacity={0.8} color="#000" zIndex={1001} />
                  <Box style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: 'white',
                  padding: '20px', boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)', borderRadius: '8px',
                  zIndex: 1001, cursor: 'pointer', width: isSmallScreen ? "250px" : isMediumScreen? "35%" :'20%', }}>
                      <Box style={{marginBottom: '2px', display: 'flex', justifyContent: 'space-between', alignItems: 'top'}}>
                <Text size={25} weight={700} style={{marginBottom: '15px'}}>Save As</Text>
                <Box style={{cursor: 'pointer'}}>
                <img style={{cursor: 'pointer'}} onClick={handleclosebutton}
                 src={closeImg} width={20} height={20} />
                 </Box>
                </Box>
                <Text size='lg' mb={10}>Vector Model Simulation</Text>
                <Input
                    placeholder="Save As"
                    value={SaveTitle ?? ""}
                    onChange={handleSaveTitleChange}
                    style={{ marginTop: '2px', marginBottom: '10px' }}
                />
                    <Box  style={{ marginTop: '35px', display: 'flex', justifyContent: 'end', alignItems: 'end'  }}>
                    <Button style={{borderRadius: '20px', width: '70px', marginRight: '10px',  padding: '0', border: '1px solid #4B65F6', color:'#4B65F6' }} onClick={handleclosebutton} variant='outline'>Cancel</Button>
                    <Button style={{borderRadius: '20px', width: '120px', padding: '0', backgroundColor: '#4B65F6'}} onClick={handleSaveButtonclick} color="blue">Save</Button>
                </Box>
        </Box></>}

        <Button onClick={handleBackButton } variant='outline' style={{position: 'fixed', top: 10, right: 10, zIndex: 1001, padding: 0, border: '0.1px solid #BADEF4'}}>
          <img src={maincloseImg} alt="building" style={{ width: 35, height:  35,}} />
        </Button>

            {(!showBoatSimulation && !showAeroplaneSimulation && !showCannonSimulation && !showWedgeSimulation && !showGraphScene) && <>
            <Text style={{color: 'white', fontSize: '40px', maxWidth: isSmallScreen ? "60%" :  '100%'}}>
                Drag n Drop the model from menu to screen
                </Text></>}
            {showBoatSimulation && <>
            <Box style={{display: 'flex',flexDirection: 'column', justifyContent: 'center', alignItems:'center',padding: isSmallScreen? '10px 10px 0px 10px':isMediumScreen ? "15px 15px 0px 15px" : '30px 30px 0px 30px', border: '2px dashed #FAFF08',borderRadius: '20px', 
                 transform: isSmallScreen ? "translate(-7%, -50%)" : isMediumScreen ? "translate(-25%, 5%)" :'translate(-15%, 5%)' }}>
            <BoatSimulation 
                velocityStream={velocityStream}
                magnitudeBoat= {magnitudeBoat}
                directionBoat= {directionBoat}
                showResultant={showResultant}
                boatAnimation={boatAnimation}
                resetPosition = {resetPosition}
                showValues = {showValues}
                isPan={isPan}
                zoomValue={zoom}
            />
            <Box style={{transform: 'translateY(50%)'}}>
            <Button style={{backgroundColor: '#FAFF08', width: 45, height: 45, padding: 0}} onClick={handleBoatAnimation}><img src={boatAnimation ? PauseImg : PlayImg} height={25} width={25} /></Button>
            <Button style={{backgroundColor: '#FAFF08', width: 45, height: 45, padding: 0, marginLeft: '10px'}} onClick={handledeletebutton}><img src={deleteImg} /></Button>
             </Box>
            </Box>
            <Box
                        sx={{ position: 'absolute',
                            bottom: isSmallScreen ? 20: "",
                            top: isSmallScreen? "" : '50%',
                            right: isSmallScreen? "50%": 20,
                            transform:isSmallScreen ? "translateX(38%)" : 'translateY(-50%)',
                            zIndex: 1000,
                            backgroundColor: '#27292D',
                            border: '1px solid white',
                            borderRadius: '2px',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems:isSmallScreen? "start" : 'center',
                            gap: isSmallScreen ? 1:2,
                            height: isSmallScreen? "43%" :'auto',
                            width: isSmallScreen? "77%" : isMediumScreen ? '30%': '21%',
                            overflowY: isSmallScreen ? "auto" : 'hidden'
                        }}
                    >
                        <Box style={{backgroundColor: "#1B1A1D", width: '100%', height: isSmallScreen? '15%': '10%', padding: '10px'}}>
                        <Text color='white' size={20} weight={600}>Motion of Boat</Text>
                        </Box>
                        <Box style={{width:'100%', padding:isSmallScreen ? "10px 0px 10px 25px": '10px 0px 28px 25px'}}>
                        <Text color='white' size={16} mb={isSmallScreen ? 4 : 20}> Velocity of stream (m/sec)</Text>
                        <Slider style={{ width: '90%', color: 'white' }}
                            styles={{markLabel: { color: 'white'}, mark: {color:'white'}}}
                             radius="xl"
                              value={velocityStream}
                              thumbChildren={<img src={selectKnobImg} width={40} height={40} />}
                              onChange={setVelocityStream}
                              step={1} min={-5} max={5}
                              marks={[
                                { value: -5, label: '-5' },
                                { value: -4, label: '-4' },
                                { value: -3, label: '-3' },
                                  { value: -2, label: '-2' },
                                  { value: -1, label: '-1' },
                                  { value: 0, label: '0' },
                                  { value: 1, label: '1' },
                                  { value: 2, label: '2' },
                                  { value: 3, label: '3' },
                                  { value: 4, label: '4' },
                                  { value: 5, label: '5' },
                                ]}/>
                                </Box>
                                <Box style={{width: '100%', padding:isSmallScreen ? "10px 0px 10px 25px": '10px 0px 28px 25px'}}>
                        <Text color='white' size={16} mb={isSmallScreen ? 4 : 20}>Magnitude of Velocity of Boat (m/sec)</Text>
                        <Slider style={{ width: '90%', color: 'white' }}
                            styles={{markLabel: { color: 'white'},}}
                              radius="xl"
                              value={magnitudeBoat}
                              thumbChildren={<img src={selectKnobImg} width={40} height={40} />}
                              onChange={setMagnitudeBoat}
                              step={2} min={0} max={10}
                              marks={[
                                  { value: 0, label: '0' },
                                  { value: 2, label: '2' },
                                  { value: 4, label: '4' },
                                  { value: 6, label: '6' },
                                  { value: 8, label: '8' },
                                  { value: 10, label: '10' },
                                ]}/>
                                </Box>
                                
                                <Box style={{width: '100%', padding:isSmallScreen ? "10px 0px 10px 25px": '10px 0px 28px 25px'}}>
                        <Text color='white' size={16} mb={isSmallScreen ? 4 : 20}>Direction of Motion of Boat (degrees)</Text>
                        <Slider style={{ width: '90%', color: 'white' }}
                            styles={{markLabel: { color: 'white', fontSize: '12px'},}}
                            radius="xl"
                              value={directionBoat}
                              thumbChildren={<img src={selectKnobImg} width={40} height={40} />}
                              onChange={setDirectionBoat}
                              step={1} min={0} max={8}
                              marks={[
                                  { value: 8, label: '180°' },
                                  { value: 7, label: '150°' },
                                  { value: 6, label: '135°' },
                                  { value: 5, label: '120°' },
                                  { value: 4, label: '90°' },
                                  { value: 3, label: '60°' },
                                  { value: 2, label: '45°' },
                                  { value: 1, label: '30°' },
                                  { value: 0, label: '0°' },

                                ]}/>
                                </Box>
                        
                        <Box style={{width: '95%', marginTop: '15px', paddingLeft: '20px', marginBottom: '10px'}}>
                        <Checkbox labelPosition="left" 
                            label="Show Resultant Vector" style={{marginBottom: '15px'}}
                            checked={showResultant}
                            size="md" styles={{label: {color: 'white', paddingRight: '20px', fontSize: '18px'}}}
                            onChange={(event) => setShowResultant(event.currentTarget.checked)}
                        />
                    <Checkbox labelPosition="left"
                            label="Show Values" 
                            checked={showValues}
                            size="md" styles={{label: {color: 'white', paddingRight: '20px', fontSize: '18px'}}}
                            onChange={(event) => setShowValues(event.currentTarget.checked)}
                        />
                    </Box>
                    </Box></>}

                    {showAeroplaneSimulation&& <>
                        <Box style={{display: 'flex',flexDirection: 'column', justifyContent: 'center', alignItems:'center',padding: isSmallScreen? '10px 10px 0px 10px': isMediumScreen ? "15px 15px 0px 15px" : '20px 20px 0px 20px', border: '2px dashed #FAFF08',borderRadius: '20px', 
                 transform: isSmallScreen ? "translate(-7%, -48%)" : isMediumScreen ? "translate(-28%, 5%)" :'translate(-18%, 5%)' }}>
            <AeroplaneSimulation 
                velocityAir={velocityStream}
                directionAir={directionAir}
                magnitudeAeroplane= {magnitudeBoat}
                directionAeroplane= {directionBoat}
                showResultant={showResultant}
                AeroplaneAnimation={boatAnimation}
                resetPosition = {resetPosition}
                showValues = {showValues}
                isPan={isPan}
                zoomValue={zoom}
            />
            <Box style={{transform: 'translateY(50%)'}}>
            <Button style={{backgroundColor: '#FAFF08', width: 45, height: 45, padding: 0}} onClick={handleBoatAnimation}><img src={boatAnimation ? PauseImg : PlayImg}  height={25} width={25}/></Button>
            <Button style={{backgroundColor: '#FAFF08', width: 45, height: 45, padding: 0, marginLeft: '10px'}} onClick={handledeletebutton}><img src={deleteImg} /></Button>
             </Box>
            </Box>
            <Box
                        sx={{ position: 'absolute',
                            bottom: isSmallScreen ? 15: "",
                            top: isSmallScreen? "" : '50%',
                            right: isSmallScreen? "50%": 20,
                            transform:isSmallScreen ? "translateX(38%)" : 'translateY(-50%)',
                            zIndex: 1000,
                            backgroundColor: '#27292D',
                            // padding: '10px',
                            border: '1px solid white',
                            borderRadius: '2px',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems:isSmallScreen? "start" : 'center',
                            gap: isSmallScreen ? 1:1,
                            height: isSmallScreen? "42%" :'auto',
                            width: isSmallScreen? "77%" : isMediumScreen ? '33%': '24%',
                            overflowY: isSmallScreen? 'scroll' : "hidden", paddingBottom: '10px'
                        }}
                    >
                        <Box style={{backgroundColor: "#1B1A1D", width: '100%', height: isSmallScreen? '20%': '10%', padding: '10px'}}>
                        <Text color='white' size={20} weight={600}>Motion of Aeroplane</Text>
                        </Box>
                        <Box style={{width:'100%', padding:isSmallScreen ? "10px 0px 25px 25px": '10px 0px 15px 15px'}}>
                        <Text color='white' size={15} mb={isSmallScreen ? 5 : 5}> Magnitude of Velocity of Wind (km/sec)</Text>
                        <Slider style={{ width: '90%', color: 'white' }}
                            styles={{markLabel: { color: 'white'}, mark: {color:'white'}}}
                             radius="xl"
                              value={velocityStream}
                              thumbChildren={<img src={selectKnobImg} width={40} height={30} />}
                              onChange={setVelocityStream}
                              step={1} min={0} max={8}
                              marks={[
                                  { value: 0, label: '0' },
                                  { value: 1, label: '1' },
                                  { value: 2, label: '2' },
                                  { value: 3, label: '3' },
                                  { value: 4, label: '4' },
                                  { value: 5, label: '5' },
                                  { value: 6, label: '6' },
                                  { value: 7, label: '7' },
                                  { value: 8, label: '8' },
                                ]}/>
                                </Box>
                                <Box style={{width: '100%', padding:isSmallScreen ? "10px 0px 25px 25px": '10px 0px 15px 15px'}}>
                        <Text color='white' size={15} mb={isSmallScreen ? 5 :5}>Direction of flow of wind (degrees)</Text>
                        <Slider style={{ width: '90%', color: 'white' }}
                            styles={{markLabel: { color: 'white', fontSize: '12px'},}}
                            radius="xl"
                              value={directionAir}
                              thumbChildren={<img src={selectKnobImg} width={40} height={40} />}
                              onChange={setDirectionAir}
                              step={1} min={0} max={8}
                              marks={[
                                  { value: 0, label: '-90°' },
                                  { value: 1, label: '-60°' },
                                  { value: 2, label: '-45°' },
                                  { value: 3, label: '-30°' },
                                  { value: 4, label: '0°' },
                                  { value: 5, label: '30°' },
                                  { value: 6, label: '45°' },
                                  { value: 7, label: '60°' },
                                  { value: 8, label: '90°' },

                                ]}/>
                                </Box>
                                <Box style={{width: '100%', padding:isSmallScreen ? "10px 0px 25px 25px": '10px 0px 15px 15px'}}>
                        <Text color='white' size={15} mb={isSmallScreen ? 5 : 5}>Magnitude of Velocity of Aeroplane (km/sec)</Text>
                        <Slider style={{ width: '90%', color: 'white' }}
                            styles={{markLabel: { color: 'white'},}}
                              radius="xl"
                              value={magnitudeBoat}
                              thumbChildren={<img src={selectKnobImg} width={40} height={40} />}
                              onChange={setMagnitudeBoat}
                              step={2} min={0} max={10}
                              marks={[
                                  { value: 0, label: '0' },
                                  { value: 2, label: '2' },
                                  { value: 4, label: '4' },
                                  { value: 6, label: '6' },
                                  { value: 8, label: '8' },
                                  { value: 10, label: '10' },
                                ]}/>
                                </Box>
                                
                                <Box style={{width: '100%',padding:isSmallScreen ? "10px 0px 25px 25px": '10px 0px 20px 15px'}}>
                        <Text color='white' size={15} mb={isSmallScreen ? 5 : 5}>Direction of Motion of Aeroplane (degrees)</Text>
                        <Slider style={{ width: '90%', color: 'white' }}
                            styles={{markLabel: { color: 'white', fontSize: '12px'},}}
                            radius="xl"
                              value={directionBoat}
                              thumbChildren={<img src={selectKnobImg} width={40} height={40} />}
                              onChange={setDirectionBoat}
                              step={1} min={0} max={8}
                              marks={[
                                  { value: 8, label: '180°' },
                                  { value: 7, label: '150°' },
                                  { value: 6, label: '135°' },
                                  { value: 5, label: '120°' },
                                  { value: 4, label: '90°' },
                                  { value: 3, label: '60°' },
                                  { value: 2, label: '45°' },
                                  { value: 1, label: '30°' },
                                  { value: 0, label: '0°' },

                                ]}/>
                                </Box>
                        
                        <Box style={{width: '100%', marginTop: '15px', paddingLeft: '20px', }}>
                        <Checkbox labelPosition="left" 
                            label="Show Resultant Vector" style={{marginBottom: '10px'}}
                            checked={showResultant}
                            size="md" styles={{label: {color: 'white', paddingRight: '20px', fontSize: '18px'}}}
                            onChange={(event) => setShowResultant(event.currentTarget.checked)}
                        />
                    <Checkbox labelPosition="left"
                            label="Show Values" 
                            checked={showValues}
                            size="md" styles={{label: {color: 'white', paddingRight: '20px', fontSize: '18px'}}}
                            onChange={(event) => setShowValues(event.currentTarget.checked)}
                        />
                    </Box>
                    </Box></>}

                    {showCannonSimulation && <>
                        <Box style={{display: 'flex',flexDirection: 'column', justifyContent: 'center', alignItems:'center',padding: isSmallScreen? '10px 10px 0px 10px': isMediumScreen ? "15px 15px 0px 15px": '30px 30px 0px 30px', border: '2px dashed #FAFF08',borderRadius: '20px', 
                 transform: isSmallScreen ? "translate(-7%, -50%)" : isMediumScreen ? "translate(-30%, 5%)" :'translate(-15%, 5%)' }}>
            <CannonSimulation 
                launchAngle={launchAngle}
                launchVelocity={launchVelocity}
                gravity={gravityValue}
                showResultant={showResultant}
                CannonAnimation={boatAnimation}
                resetPosition = {resetPosition}
                showValues = {showValues}
                isPan={isPan}
                zoomValue={zoom}
            />
            <Box style={{transform: 'translateY(50%)'}}>
            <Button style={{backgroundColor: '#FAFF08', width: 45, height: 45, padding: 0}} onClick={handleBoatAnimation}><img src={boatAnimation ? PauseImg : PlayImg}  height={25} width={25} /></Button>
            <Button style={{backgroundColor: '#FAFF08', width: 45, height: 45, padding: 0, marginLeft: '10px'}} onClick={handledeletebutton}><img src={deleteImg} /></Button>
             </Box>
            </Box>
            <Box
                        sx={{ position: 'absolute',
                            bottom: isSmallScreen ? 20: "",
                            top: isSmallScreen? "" : '50%',
                            right: isSmallScreen? "50%": 20,
                            transform:isSmallScreen ? "translateX(37%)" : 'translateY(-50%)',
                            zIndex: 1000,
                            backgroundColor: '#27292D',
                            // padding: '10px',
                            border: '1px solid white',
                            borderRadius: '2px',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems:isSmallScreen? "start" : 'center',
                            gap: isSmallScreen ? 1:1,
                            height: isSmallScreen? "43%" :'auto',
                            width: isSmallScreen? "78%" : isMediumScreen ? '33%': '22%',
                            overflowY: isSmallScreen ?"auto" : 'hidden',
                        }}
                    >
                        <Box style={{backgroundColor: "#1B1A1D", width: '100%', height: isSmallScreen? '20%': '10%', padding: '10px'}}>
                        <Text color='white' size={20} weight={600}>Cannon Setup</Text>
                        </Box>
                        <Box style={{width: '100%', height: isSmallScreen?  '50%': '20%', padding:isSmallScreen ? "10px 0px 25px 25px": '10px 0px 25px 25px'}}>
                        <Text color='white' size={16} mb={isSmallScreen ? 10 : 5}> Initial Launch Velocity (m/sec)</Text>
                        <Slider style={{ width: '90%', color: 'white' }}
                            styles={{markLabel: { color: 'white'}, mark: {color:'white'}}}
                             radius="xl"
                              value={launchVelocity}
                              thumbChildren={<img src={selectKnobImg} width={40} height={40} />}
                              onChange={setLaunchVelocity}
                              step={2} min={0} max={32}
                              marks={[
                                  { value: 0, label: '0' },
                                  { value: 4, label: '4' },
                                  { value: 8, label: '8' },
                                  { value: 12, label: '12' },
                                  { value: 16, label: '16' },
                                  { value: 20, label: '20' },
                                  { value: 24, label: '24' },
                                  { value: 28, label: '28' },
                                  { value: 32, label: '32' },
                                ]}/>
                                </Box>
                                <Box style={{width: '100%', height:isSmallScreen?  '50%': '20%', padding:isSmallScreen ? "10px 0px 25px 25px": '10px 0px 25px 25px'}}>
                        <Text color='white' size={16} mb={isSmallScreen ? 10 :5}>Launch Angle (degrees)</Text>
                        <Slider style={{ width: '90%', color: 'white' }}
                            styles={{markLabel: { color: 'white', fontSize: '12px'},}}
                            radius="xl"
                              value={launchAngle}
                              thumbChildren={<img src={selectKnobImg} width={40} height={40} />}
                              onChange={setLaunchAngle}
                              step={1} min={0} max={4}
                              marks={[
                                  { value: 0, label: '0°' },
                                  { value: 1, label: '30°' },
                                  { value: 2, label: '45°' },
                                  { value: 3, label: '60°' },
                                  { value: 4, label: '90°' },
                                ]}/>
                                </Box>
                                <Box style={{width: '100%', height:isSmallScreen?  '50%': '20%', padding:isSmallScreen ? "10px 0px 25px 25px": '10px 0px 25px 25px'}}>
                        <Text color='white' size={16} mb={isSmallScreen ? 10 : 5}> Gravity (m/sec^2)</Text>
                        <Slider style={{ width: '90%', color: 'white' }}
                            styles={{markLabel: { color: 'white'},}}
                              radius="xl"
                              value={gravityValue}
                              thumbChildren={<img src={selectKnobImg} width={40} height={40} />}
                              onChange={setGravityValue}
                              step={2} min={10} max={20}
                              marks={[
                                  { value: 10, label: '10' },
                                  { value: 12, label: '12' },
                                  { value: 14, label: '14' },
                                  { value: 16, label: '16' },
                                  { value: 18, label: '18' },
                                  { value: 20, label: '20' },
                                ]}/>
                                </Box>
                        <Box style={{width: '100%', marginTop: '15px', paddingLeft: '20px', paddingBottom: '10px' }}>
                        <Checkbox labelPosition="left" 
                            label="Show Resultant Vector" style={{marginBottom: '10px'}}
                            checked={showResultant}
                            size="md" styles={{label: {color: 'white', paddingRight: '20px', fontSize: '18px'}}}
                            onChange={(event) => setShowResultant(event.currentTarget.checked)}
                        />
                    <Checkbox labelPosition="left"
                            label="Show Values" 
                            checked={showValues}
                            size="md" styles={{label: {color: 'white', paddingRight: '20px', fontSize: '18px'}}}
                            onChange={(event) => setShowValues(event.currentTarget.checked)}
                        />
                    </Box>
                    </Box>

                    </>}
                    {showWedgeSimulation && <>
                        <Box style={{display: 'flex',flexDirection: 'column', justifyContent: 'center', alignItems:'center',padding: isSmallScreen? '10px 10px 0px 10px': isMediumScreen ? "15px 15px 0px 15px": '30px 30px 0px 30px', border: '2px dashed #FAFF08',borderRadius: '20px', 
                 transform: isSmallScreen ? "translate(-7%, -50%)" : isMediumScreen ? "translate(-30%, 5%)" :'translate(-15%, 5%)' }}>
            <WedgeSimulation
                frictionCoefficient={frictionCoefficient}
                wedgeAngle={wedgeAngle}
                boxWeight={boxWeight}
                gravity={gravityValue}
                showResultant={showResultant}
                WedgeAnimation={boatAnimation}
                resetPosition = {resetPosition}
                showValues = {showValues}
                isPan={isPan}
                zoomValue={zoom}
                stopWedgeAnimation={stopWedgeAnimation}
                
            />
            <Box style={{transform: 'translateY(50%)'}}>
            <Button style={{backgroundColor: '#FAFF08', width: 45, height: 45, padding: 0}} onClick={handleBoatAnimation}><img src={boatAnimation ? PauseImg : PlayImg}  height={25} width={25}/></Button>
            <Button style={{backgroundColor: '#FAFF08', width: 45, height: 45, padding: 0, marginLeft: '10px'}} onClick={handledeletebutton}><img src={deleteImg} /></Button>
             </Box>
            </Box>
            <Box
                        sx={{ position: 'absolute',
                            bottom: isSmallScreen ? 20: "",
                            top: isSmallScreen? "" : '50%',
                            right: isSmallScreen? "50%": 20,
                            transform:isSmallScreen ? "translateX(37%)" : 'translateY(-50%)',
                            zIndex: 1000,
                            backgroundColor: '#27292D',
                            // padding: '10px',
                            border: '1px solid white',
                            borderRadius: '2px',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems:isSmallScreen? "start" : 'center',
                            gap: isSmallScreen ? 1:1,
                            height: isSmallScreen? "43%" :'75%',
                            width: isSmallScreen? "78%" : isMediumScreen ? '33%': '21%',
                            overflowY: isSmallScreen ? "scroll" :"hidden",
                        }}
                    >
                        <Box style={{backgroundColor: "#1B1A1D", width: '100%', height: isSmallScreen? '20%': '10%', padding: '10px'}}>
                        <Text color='white' size={20} weight={600}>Wedge and Box Setup</Text>
                        </Box>
                        <Box style={{width: '100%', height: isSmallScreen?  '25%': '20%', padding:isSmallScreen ? "10px 0px 25px 25px": '10px 0px 15px 25px'}}>
                        <Text color='white' size={16} mb={isSmallScreen ? 10 : 14}> Coefficient of Friction</Text>
                        <Slider style={{ width: '90%', color: 'white' }}
                            styles={{markLabel: { color: 'white'}, mark: {color:'white'}}}
                             radius="xl"
                              value={frictionCoefficient}
                              thumbChildren={<img src={selectKnobImg} width={40} height={40} />}
                              onChange={setFrictionCoefficient}
                              step={0.1} min={0.1} max={0.9}
                              marks={[
                                  { value: 0.1, label: '0.1' },
                                  { value: 0.2, label: '0.2' },
                                  { value: 0.3, label: '0.3' },
                                  { value: 0.4, label: '0.4' },
                                  { value: 0.5, label: '0.5' },
                                  { value: 0.6, label: '0.6' },
                                  { value: 0.7, label: '0.7' },
                                  { value: 0.8, label: '0.8' },
                                  { value: 0.9, label: '0.9' },
                                ]}/>
                                </Box>
                                <Box style={{width: '100%', height:isSmallScreen?  '25%': '20%', padding:isSmallScreen ? "10px 0px 25px 25px": '10px 0px 15px 25px'}}>
                        <Text color='white' size={16} mb={isSmallScreen ? 10 :14}>Angle of Wedge (degrees)</Text>
                        <Slider style={{ width: '90%', color: 'white' }}
                            styles={{markLabel: { color: 'white', fontSize: '12px'},}}
                            radius="xl"
                              value={wedgeAngle}
                              thumbChildren={<img src={selectKnobImg} width={40} height={40} />}
                              onChange={setWedgeAngle}
                              step={1} min={0} max={4}
                              marks={[
                                  { value: 0, label: '0°' },
                                  {value: 1, label: '15%'},
                                  { value: 2, label: '30°' },
                                  { value: 3, label: '45°' },
                                  { value: 4, label: '60°' },
                                ]}/>
                                </Box>
                                <Box style={{width:'100%', height:isSmallScreen?  '25%': '20%', padding:isSmallScreen ? "10px 0px 25px 25px": '10px 0px 15px 25px'}}>
                        <Text color='white' size={16} mb={isSmallScreen ? 10 : 14}> Weight of Box (kg)</Text>
                        <Slider style={{ width: '90%', color: 'white' }}
                            styles={{markLabel: { color: 'white'},}}
                              radius="xl"
                              value={boxWeight}
                              thumbChildren={<img src={selectKnobImg} width={40} height={40} />}
                              onChange={setBoxWeight}
                              step={1} min={1} max={10}
                              marks={[
                                  { value: 2, label: '10' },
                                  { value: 4, label: '12' },
                                  { value: 6, label: '14' },
                                  { value: 8, label: '16' },
                                  { value: 10, label: '18' },
                                ]}/>
                                </Box>
                        <Box style={{width: '100%', height:isSmallScreen?  '25%': '20%', padding:isSmallScreen ? "10px 0px 25px 25px": '10px 0px 15px 25px'}}>
                        <Text color='white' size={16} mb={isSmallScreen ? 10 : 14}> Gravity (m/s<sup>2</sup>)</Text>
                        <Slider style={{ width: '90%', color: 'white' }}
                            styles={{markLabel: { color: 'white'},}}
                              radius="xl"
                              value={gravityValue}
                              thumbChildren={<img src={selectKnobImg} width={40} height={40} />}
                              onChange={setGravityValue}
                              step={2} min={10} max={20}
                              marks={[
                                  { value: 10, label: '10' },
                                  { value: 12, label: '12' },
                                  { value: 14, label: '14' },
                                  { value: 16, label: '16' },
                                  { value: 18, label: '18' },
                                  { value: 20, label: '20' },
                                ]}/>
                                </Box>
                        <Box style={{width: '100%', marginTop: '15px', paddingLeft: '20px',paddingBottom: '10px'}}>
                        <Checkbox labelPosition="left" 
                            label="Show Resultant Vector" style={{marginBottom: '10px'}}
                            checked={showResultant}
                            size="md" styles={{label: {color: 'white', paddingRight: '20px', fontSize: '18px'}}}
                            onChange={(event) => setShowResultant(event.currentTarget.checked)}
                        />
                    <Checkbox labelPosition="left"
                            label="Show Values" 
                            checked={showValues}
                            size="md" styles={{label: {color: 'white', paddingRight: '20px', fontSize: '18px'}}}
                            onChange={(event) => setShowValues(event.currentTarget.checked)}
                        />
                    </Box>
                    </Box>
            
                    </>}

                    {showGraphScene &&<>
                        <Box style={{display: 'flex',flexDirection: 'column', justifyContent: 'center', alignItems:'center',padding: isSmallScreen? '10px 10px 0px 10px':isMediumScreen ? "15px 15px 0px 15px": '30px 30px 0px 30px', border: '2px dashed #FAFF08',borderRadius: '20px', 
                 transform: isSmallScreen ? "translate(-7%, -50%)" : isMediumScreen ? "translate(-30%, 5%)" :'translate(-15%, 5%)' }}>
                        <VectorGraph vector1={vector1} vector2={vector2} 
                        onDrop={handleDrop}
                        isVector1Selected={vector1selected} isVector2Selected={vector2selected} selectedVectorLength={vectorlength}
                isPan={isPan} zoomValue={zoom} selectedVectorAngle={vectorangle} showResultant={showResultant} showValues={showValues} 
                vector2Length={vector2length} vector2Angle={vector2angle}/>
            <Box style={{transform: 'translateY(50%)'}}>
            <Button style={{backgroundColor: '#FAFF08', width: 45, height: 45, padding: 0, marginLeft: '10px'}} onClick={handledeletebutton}><img src={deleteImg} /></Button>
             </Box>
            </Box>
                    <Box
                        sx={{ position: 'absolute',
                            bottom: isSmallScreen ? 20: "",
                            top: isSmallScreen? "" : '50%',
                            right: isSmallScreen? "50%": 20,
                            transform:isSmallScreen ? "translateX(37%)" : 'translateY(-50%)',
                            zIndex: 1000,
                            backgroundColor: '#27292D',
                            // padding: '10px',
                            border: '1px solid white',
                            borderRadius: '2px',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems:isSmallScreen? "start" : 'center',
                            gap: isSmallScreen ? 1:1,
                            height: isSmallScreen? "43%" :'auto',
                            width: isSmallScreen? "78%" : isMediumScreen ? '33%': '21%',
                            overflowY: isSmallScreen ? "auto" : "hidden"
                        }}
                    >
                        <Box style={{backgroundColor: "#1B1A1D", width: '100%', height: isSmallScreen? '20%': '10%', padding: '10px'}}>
                        <Text color='white' size={20} weight={600}>Custom Vectors</Text>
                        </Box>
                        {<>
                        <Box style={{width:'100%', height: isSmallScreen?  '50%': '15%', padding:isSmallScreen ? "10px 0px 25px 25px": '10px 0px 25px 25px'}}>
                        <Text color='white' size={16} mb={isSmallScreen ? 10 : 5}>Length of Vector1 </Text>
                        <Slider style={{ width: '90%', color: 'white' }}
                            styles={{markLabel: { color: 'white'}, mark: {color:'white'}}}
                             radius="xl"
                              value={vectorlength}
                              thumbChildren={<img src={selectKnobImg} width={40} height={40} />}
                              onChange={setVectorLength}
                              step={1} min={2} max={16}
                              marks={[
                                  { value: 2, label: '2' },
                                  { value: 4, label: '4' },
                                  { value: 6, label: '6' },
                                  { value: 8, label: '8' },
                                  { value: 10, label: '10' },
                                  { value: 12, label: '12' },
                                  { value: 14, label: '14' },
                                  { value: 16, label: '16' },
                                ]}/>
                                </Box>
                                <Box style={{width: '100%', height:isSmallScreen?  '50%': '15%', padding:isSmallScreen ? "10px 0px 25px 25px": '10px 0px 25px 25px'}}>
                        <Text color='white' size={16} mb={isSmallScreen ? 10 :5}>Angle of Vector1</Text>
                        <Slider style={{ width: '90%', color: 'white' }}
                            styles={{markLabel: { color: 'white', fontSize: '12px'},}}
                            radius="xl"
                              value={vectorangle}
                              thumbChildren={<img src={selectKnobImg} width={40} height={40} />}
                              onChange={setvectorAngle}
                              step={1} min={-4} max={4}
                              marks={[
                                {value: -4, label: '-90°'},
                                { value: -3, label: '-60°' },
                                { value: -2, label: '-45°' },
                                { value: -1, label: '-30°' },
                                  { value: 0, label: '0°' },
                                  {value: 1, label: '30°'},
                                  { value: 2, label: '45°' },
                                  { value: 3, label: '60°' },
                                  { value: 4, label: '90°' },
                                ]}/>
                                </Box> </>} 
                                { <>
                        <Box style={{width: '100%', height: isSmallScreen?  '50%': '15%', padding:isSmallScreen ? "10px 0px 25px 25px": '10px 0px 25px 25px'}}>
                        <Text color='white' size={16} mb={isSmallScreen ? 10 : 5}>Length of Vector2 </Text>
                        <Slider style={{ width: '90%', color: 'white' }}
                            styles={{markLabel: { color: 'white'}, mark: {color:'white'}}}
                             radius="xl"
                              value={vector2length}
                              thumbChildren={<img src={selectKnobImg} width={40} height={40} />}
                              onChange={setVector2Length}
                              step={1} min={2} max={16}
                              marks={[
                                  { value: 2, label: '2' },
                                  { value: 4, label: '4' },
                                  { value: 6, label: '6' },
                                  { value: 8, label: '8' },
                                  { value: 10, label: '10' },
                                  { value: 12, label: '12' },
                                  { value: 14, label: '14' },
                                  { value: 16, label: '16' },
                                ]}/>
                                </Box>
                                <Box style={{width:'100%', height:isSmallScreen?  '50%': '15%', padding:isSmallScreen ? "10px 0px 25px 25px": '10px 0px 25px 25px'}}>
                        <Text color='white' size={16} mb={isSmallScreen ? 10 :5}>Angle of Vector2</Text>
                        <Slider style={{ width: '90%', color: 'white' }}
                            styles={{markLabel: { color: 'white', fontSize: '12px'},}}
                            radius="xl"
                              value={vector2angle}
                              thumbChildren={<img src={selectKnobImg} width={40} height={40} />}
                              onChange={setVector2Angle}
                              step={1} min={-4} max={4}
                              marks={[
                                {value: -4, label: '-90°'},
                                { value: -3, label: '-60°' },
                                { value: -2, label: '-45°' },
                                { value: -1, label: '-30°' },
                                  { value: 0, label: '0°' },
                                  {value: 1, label: '30°'},
                                  { value: 2, label: '45°' },
                                  { value: 3, label: '60°' },
                                  { value: 4, label: '90°' },
                                ]}/>
                                </Box> </>} 
                        <Box style={{width:'100%', marginTop: '10px', paddingLeft: '20px',paddingBottom: '10px', }}>
                        <Checkbox labelPosition="left" 
                            label="Show Resultant Vector" style={{marginBottom: '10px'}}
                            checked={showResultant}
                            size="md" styles={{label: {color: 'white', paddingRight: '20px', fontSize: '18px'}}}
                            onChange={(event) => setShowResultant(event.currentTarget.checked)}
                        />
                    <Checkbox labelPosition="left"
                            label="Show Values" 
                            checked={showValues}
                            size="md" styles={{label: {color: 'white', paddingRight: '20px', fontSize: '18px'}}}
                            onChange={(event) => setShowValues(event.currentTarget.checked)}
                        />
                    </Box>
                    </Box></>}
        </Box>
    );
};

export default VectorModelSimulation;
