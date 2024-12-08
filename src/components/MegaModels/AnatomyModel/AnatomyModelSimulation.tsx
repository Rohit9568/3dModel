import React, { useState, Suspense, useRef, useEffect } from "react";
import { Box, Button, Image, Text, Stack, Overlay, Tabs } from "@mantine/core";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import type { OrbitControls as OrbitControlsType } from "three-stdlib";
import { useNavigate } from "react-router-dom";
import ErrorBoundary from "./ErrorBoundary";
import { useMediaQuery } from "@mantine/hooks";
import { Vector3 } from "three";
import { ModelRenderer } from "./ModelRenderer";
import { getLanguageEnumByKeyForAnatomyModel } from "../../../assets/LanguageEnums/AnatomyEnumFunction";

const anno1 = "https://vignam-content-images.s3.ap-south-1.amazonaws.com/2024-07-30T09-26-01-194Z.png";
const anno2 = "https://vignam-content-images.s3.ap-south-1.amazonaws.com/2024-07-30T09-26-20-082Z.png";
const anno3 = "https://vignam-content-images.s3.ap-south-1.amazonaws.com/2024-07-30T09-26-38-496Z.png";
const anno4 = "https://vignam-content-images.s3.ap-south-1.amazonaws.com/2024-07-30T09-27-03-358Z.png";
const anno5 = "https://vignam-content-images.s3.ap-south-1.amazonaws.com/2024-07-30T09-27-21-363Z.png";
const Play = "https://vignam-content-images.s3.ap-south-1.amazonaws.com/2024-07-30T09-27-44-682Z.png";
const Pause = "https://vignam-content-images.s3.ap-south-1.amazonaws.com/2024-07-30T09-28-03-310Z.png";
const closeImg = "https://vignam-content-images.s3.ap-south-1.amazonaws.com/2024-07-30T09-28-22-597Z.png";
const AccountIcon = "https://vignam-content-images.s3.ap-south-1.amazonaws.com/2024-07-27T10-51-25-879Z.png";
const awsModellink = "https://vignammodelsstage.s3.ap-south-1.amazonaws.com/";
const menuItems = [
  { id: 1, text: "Draw_Tool", img: anno1 },
  { id: 2, text: "Annotations", img: anno2 },
  { id: 3, text: "Rotate", img: anno3 },
  { id: 4, text: "Pan", img: anno4 },
  { id: 5, text: "Reset", img: anno5 },
];

const SimulationData = [
  {
    id: 1,
    ModelName:"dicotleaf",
    path: "dicotleaf.glb",
    position: [-4, -1.2, 0],
    rotation: [(Math.PI*0)/180,0,0],
    smallScreenPosition: [0, 2, 0],
    detailPosition: [0, -0.2, 0],
    detailRotation: [(Math.PI*0)/180,0,0],
    detailScale: [0.5, 0.5, 0.5],
    scale: [0.4, 0.4, 0.4],
    smallScreenScale: [0.15, 0.15, 0.15],
    object_reference: [],
    tabContents: [
      {
        id: "description",
        label: {en: "Description", 
          hi: 'हिंदी डिस्क्रिप्शन'},
        content: {en:`Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
        Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in 
        reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa 
        qui officia deserunt mollit anim id est laborum.`,
                       hi: 'हिंदी डिस्क्रिप्शन'},
      },
      {
        id: "Gotit",
        label:{en: "Got it",
           hi: 'hindi label'},
        content:{en: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
        Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in 
        reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa 
        qui officia deserunt mollit anim id est laborum.`, hi: 'hindi content of got it'},
      }]
  },
  {
    id: 2,
    ModelName: "dicotstem",
    path: "dicotstem.glb",
    position: [-0.5, -2, 0],
    rotation: [0,0,0],
    smallScreenPosition: [0, -0.5, 0],
    detailPosition: [0, -2, 0],
    detailRotation: [(Math.PI*0)/180,0,0],
    detailScale: [0.4, 0.4, 0.4],
    scale: [0.4, 0.4, 0.4],
    smallScreenScale: [0.15, 0.15, 0.15],
    object_reference: [],
    tabContents: [
      {
        id: "description",
        label:{en: "Description", hi: 'hindi description'},
        content:{en: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
          Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in 
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa
           qui officia deserunt mollit anim id est laborum.`, hi: 'hindi content'}
      },
      {
        id: "flow",
        label:{en: "Flow",hi: 'hindi word'},
        content:{ en: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore 
          magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. 
          Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat 
          non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`, hi: 'hindi content'}
      }]
  },
  {
    id: 3,
    ModelName: "dicotroot",
    path: "dicotroot.glb",
    position: [3.5, -1.7, 0],
    rotation: [0,0,0],
    smallScreenPosition: [0, -2.5, 0],
    detailPosition: [0, -1.8, 0],
    detailRotation: [(Math.PI*0)/180,0,0],
    detailScale: [0.4, 0.4, 0.4],
    scale: [0.35, 0.35, 0.35],
    smallScreenScale: [0.15, 0.15, 0.15],
    object_reference: [],
    tabContents: [
      {
        id: "description",
        label: {en: "Description", hi: 'hindi description'},
        content:{en:  `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
          Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in 
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui 
          officia deserunt mollit anim id est laborum.`, hi: 'hindi content'}
      },{
        id: "parts",
        label:{en: "Parts", hi: 'hindi'},
        content: {en: "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Nisi, commodi suscipit error quo, optio odio magni, officiis alias voluptatibus odit.",
                       hi: "hindi content of parts tab"},
        items: [
          {
            part_id: "Epidermis",
            part_name: {en: "Epidermis", hi: 'hindi epidermis'},
            content:{en: "content of epidermis part, content of epidermis part, content of epidermis part, content of epidermis part",
              hi: 'content of epidermis in hindi'},
          },
          {
            part_id: "Endodermis",
            part_name: {en: "Endodermis", hi: 'hindi endodermis'},
            content: { en: "content of endodermis part, content of endodermis part, content of endodermis part, content of endodermis part",
                            hi: 'content of endodermis in hindi'},
          },
          {
            part_id: "Connectivetissue",
            part_name: {en: "Connective Tissue", hi: 'hindi ConnectiveTissue'},
            content: {en: "content of Connective tissue part, content of Connective tissue part, content of Connective tissue part, content of Connective tissue part",
                          hi: 'content in hindi '},
          },
        ],
      },
    ]
  },
];


// const SimulationData = [
//   {
//     id: 3,
//     ModelName: "dicotroot",
//     path: "plant2.glb",
//     position: [3, -1.5, 0],
//     rotation: [0,0,0],
//     smallScreenPosition: [0, -2.5, 0],
//     detailPosition: [0, -1.6, 0],
//     detailRotation: [(Math.PI*0)/180,0,0],
//     scale: [0.4, 0.4, 0.4],
//     smallScreenScale: [0.15, 0.15, 0.15],
//     object_reference: [
//       {
//         ModelName: "root",
//         path: "dicotroot.glb",
//         label: "tree",
//         ref: "root",
//         detailPosition: [0, -1.6, 0],
//         detailRotation: [(Math.PI*0)/180,0,0],
//         detailScale: [0.4, 0.4, 0.4],
//         tabContents: [
//           {
//         id: "description",
//         label: {en: "Description", hi: 'hindi description'},
//         content:{en:  `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
//           Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in 
//           reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui 
//           officia deserunt mollit anim id est laborum.`, hi: 'hindi content'}
//         },
//           {
//                     id: "parts",
//                     label: {en: "Parts", hi: 'hindi word'},
//                     content:{en: "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Nisi, commodi suscipit error quo, optio odio magni, officiis alias voluptatibus odit.",
//                                  hi: 'hindi content'},
//                     items: [
//                       {
//                         part_id: "Epidermis",
//                         part_name: {en: "Epidermis", hi: 'hindi epidermis'},
//                         content:{en: "content of epidermis part, content of epidermis part, content of epidermis part, content of epidermis part",
//                           hi: 'content of epidermis in hindi'},
//                       },
//                       {
//                         part_id: "Endodermis",
//                         part_name: {en: "Endodermis", hi: 'hindi endodermis'},
//                         content: { en: "content of endodermis part, content of endodermis part, content of endodermis part, content of endodermis part",
//                                         hi: 'content of endodermis in hindi'},
//                       },
//                       {
//                         part_id: "Connectivetissue",
//                         part_name: {en: "Connective Tissue", hi: 'hindi ConnectiveTissue'},
//                         content: {en: "content of Connective tissue part, content of Connective tissue part, content of Connective tissue part, content of Connective tissue part",
//                                       hi: 'content in hindi '},
//                       },
//                     ],
//                   },
//         ],
//       },
//       {
//         ModelName: "base",
//         label: "Plane",
//         ref: "base",
//         path: "dicotstem.glb",
//         detailPosition: [0, -1.6, 0],
//         detailRotation: [(Math.PI*0)/180,0,0],
//         detailScale: [0.4, 0.4, 0.4],
//         tabContents: [
//           {
//             id: "description",
//             label: {en: "Description", hi: 'hindi description'},
//             content:{en:  `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
//               Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in 
//               reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui 
//               officia deserunt mollit anim id est laborum.`, hi: 'hindi content'}
//             },
//           {
//             id: "flow",
//             label: {en: "flow not", hi: 'hindi'},
//             content: {en: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
//               Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in 
//               reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa 
//               qui officia deserunt mollit anim id est laborum.`, hi: 'hindi content'}
//           },
//         ],
//       },
//       {
//         ModelName: "leaf",
//         label: "Object_2005",
//         ref: "leaf",
//         path: "dicotleaf.glb",
//         detailPosition: [0, -1.6, 0],
//         detailRotation: [(Math.PI*0)/180,0,0],
//         detailScale: [0.4, 0.4, 0.4],
//         tabContents: [
//           {
//             id: "description",
//             label: {en: "Description", hi: 'hindi description'},
//             content:{en:  `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
//               Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in 
//               reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui 
//               officia deserunt mollit anim id est laborum.`, hi: 'hindi content'}
//             },
//           {
//             id: "flow",
//             label: {en: "flow not", hi: 'hindi'},
//             content: {en: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
//               Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in 
//               reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa 
//               qui officia deserunt mollit anim id est laborum.`, hi: 'hindi content'}
//           },
//         ],
//       },
//       {
//         ModelName: "stem",
//         label: "Object_2016",
//         ref: "stem",
//         path: "plant2.glb",
//         detailPosition: [0, -1.6, 0],
//         detailRotation: [(Math.PI*0)/180,0,0],
//         detailScale: [0.4, 0.4, 0.4],
//         tabContents: [
//           {
//             id: "description",
//             label: {en: "Description", hi: 'hindi description'},
//             content:{en:  `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
//               Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in 
//               reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui 
//               officia deserunt mollit anim id est laborum.`, hi: 'hindi content'}
//             },
//           {
//             id: "flow",
//             label: {en: "flow", hi: 'hindi'},
//             content: {en: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
//               Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in 
//               reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa 
//               qui officia deserunt mollit anim id est laborum.`, hi: 'hindi content'}
//           },
//         ],
//       },
//       {
//         ModelName: "fruit",
//         label: "Object_2014",
//         ref: "fruit",
//         path: "dicotstem.glb",
//         detailPosition: [0, -1.6, 0],
//         detailRotation: [(Math.PI*30)/180,0,0],
//         detailScale: [0.4, 0.4, 0.4],
//         tabContents: [
//           {
//             id: "description",
//             label: {en: "Description", hi: 'hindi description'},
//             content:{en:  `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
//               Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in 
//               reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui 
//               officia deserunt mollit anim id est laborum.`, hi: 'hindi content'}
//             },
//           {
//             id: "done",
//             label: {en: "flow not", hi: 'hindi'},
//             content: {en: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
//               Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in 
//               reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa 
//               qui officia deserunt mollit anim id est laborum.`, hi: 'hindi content'}
//           },
//         ],
//       },
//     ],
//   },
// ];

const AnatomyModelSimulation = () => {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState<number | null>(null);
  const [pan, setPan] = useState<boolean>(false);
  const [rotate, setRotate] = useState<boolean>(false);
  const isSmallScreen = useMediaQuery("(max-width: 768px)");
  const controlsRef = useRef<OrbitControlsType>(null);
  const [drawingMode, setDrawingMode] = useState(false);
  const drawCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastPosition, setLastPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [annotations, setAnnotations] = useState<boolean>(true);
  const [isDetailModel, setisDetailModel] = useState<boolean>(false);
  const [cleanedName, setCleanedName] = useState<string>("");
  const [imageColors, setImageColors] = useState<{ [key: number]: string }>({
    1: "black",
    2: "black",
    3: "black",
    4: "black",
    5: "black",
  });
  const [modelStage, setModelStage] = useState<boolean | null>(null);
  const [clickedPart, setClickedPart] = useState<string>("");
  const [isAnimation, setIsAnimation] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isAccountOpen, setAccountOpen] = useState<boolean>(false);
  const [userLanguage, setUserLanguage] = useState<string>('en');
const path = window.location.pathname;
  useEffect(() => {
    if (SimulationData.length > 1) {
      setModelStage(true);
      setisDetailModel(false);
    } else if (SimulationData.length == 1) {
      setModelStage(false);
      setisDetailModel(true);
    }
  });

  const handleAnnotationClick = (name: string) => {
    setCleanedName(name);
  };

  const handleMouseClick = (model: any) => {
    const newPath = path+"/"+model.ModelName;
    navigate(`${newPath}`, {
      state: { model, userLanguage},
    });
  };

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

  const handleMenuClick = (key: number) => {
    if (key === 1) {
      setDrawingMode(!drawingMode);
    } else if (key === 4) {
      setPan(!pan);
    } else if (key === 3) {
      setRotate(!rotate);
    } else if (key === 2) {
      setAnnotations(!annotations);
    } else if (key === 5) {
      setPan(false);
      setRotate(false);
      setDrawingMode(false);
      setAnnotations(true);
      const canvas = drawCanvasRef.current;
      if (canvas) {
        const context = canvas.getContext("2d");
        if (context) {
          context.clearRect(0, 0, canvas.width, canvas.height);
        }
      }
      if (controlsRef.current) {
        controlsRef.current.reset();
      }
      setImageColors({
        1: "black",
        2: "black",
        3: "black",
        4: "black",
        5: "black",
      });
      return;
    }
    setImageColors((prevColors) => ({
      ...prevColors,
      [key]: prevColors[key] === "black" ? "white" : "black",
    }));
  };

  const handlePartClick = (name: any) => {
    const model = SimulationData[0];
    let clicked = false; 
    model.object_reference.map((object: any) => {
      if (object.label === name && !clicked) {
        setClickedPart(object.ref);
        clicked = true;
        handleMouseClick(object);
      }
    });
  };

  const handleAnimationButton = ()=>{
    setIsPlaying(!isPlaying);
  }

 const handleAnimationAvailable = ()=>{
  setIsAnimation(true);
 } 
  return (
    <Box
      style={{
        position: "relative",
        height: "100vh",
        width: "100vw",
        background: "linear-gradient(to right, #D9DEE8, #ffffff, #D9DEE8)",
      }}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
    >
     {isAccountOpen && <>
          <Overlay opacity={0.8} color='#000' zIndex={1001} onClick={()=>setAccountOpen(false)}/>
          <Box style={{position: 'absolute', top: '50%', left: '50%',zIndex: 1001, transform: 'translate(-50%, -50%)', backgroundColor: 'white', 
            padding: '20px', width: '400px', height: '250px', borderRadius: '15px'}}>
              <Box sx={{width: '100%',display: 'flex', justifyContent : 'space-between', height: '25%'}}>
                  <Text sx={{fontWeight: 700, fontSize: '25px'}}>{getLanguageEnumByKeyForAnatomyModel({ key: 'Preferences', LanguageId: userLanguage}) }</Text>
                  <Box style={{cursor: 'pointer'}}>
                <img style={{cursor: 'pointer'}} onClick={()=>setAccountOpen(false)}
                 src={closeImg} width={15} height={15} />
                 </Box>
              </Box>
              <Box sx={{height: '70%', width: '100%'}}>
              <Tabs defaultValue="overview">
      <Tabs.List>
        <Tabs.Tab value="overview">{getLanguageEnumByKeyForAnatomyModel({ key: "Overview", LanguageId: userLanguage}) }</Tabs.Tab>
        <Tabs.Tab value="languages">{getLanguageEnumByKeyForAnatomyModel({ key: "Languages", LanguageId: userLanguage}) }</Tabs.Tab>
      </Tabs.List>

      <Tabs.Panel value="overview" pt="lg">
      <Text>{getLanguageEnumByKeyForAnatomyModel({ key: "Preference_Content", LanguageId: userLanguage})}</Text>
      </Tabs.Panel>
      <Tabs.Panel value="languages" pt="lg">
              <Box sx={{width: '100%', height: '70px', border: '2px solid black', borderRadius :'10px', padding: '7px',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center'
              }}>
              <Button style={{borderRadius: '10px', height: '100%', width: '45%', border: '1px solid transparent', backgroundColor: userLanguage =='en' ? '#BACEF4' : 'transparent' }}
               variant='outline' onClick={()=>setUserLanguage('en')}>
                <Text sx={{fontSize: '22px'}} fw={700} c='black'>English</Text>
                </Button>
                <Button style={{borderRadius: '10px', height: '100%', width: '45%', border: '1px solid transparent', backgroundColor: userLanguage =='hi' ? '#BACEF4' : 'transparent'}}
                 variant='outline' onClick={()=>setUserLanguage('hi')}>
                <Text sx={{fontSize: '22px'}} fw={700} c='black'>हिंदी</Text>
                </Button>
              </Box>
      </Tabs.Panel>
    </Tabs>
              </Box>
          </Box>
          </>}
  <Box sx={{position: 'fixed', top: 10, right: 10, zIndex: 1000, display: 'flex', flexDirection: 'column', gap: 10}}>
<Button onClick={()=>setAccountOpen(true)} variant='outline' style={{ padding: 0, width: 50, height: 50, border: '0.1px solid transparent', }}>
          <img src={AccountIcon} alt="AccountIcon" style={{width: '100%', height: '100%', objectFit: 'cover', }} />
        </Button></Box>

      <ErrorBoundary>
        <Canvas
          shadows
          camera={{ position: [0, 2, 10], fov: 35 }}
          style={{ width: "100%", height: "100%" }}
        >
          <Suspense fallback={null}>
            <ambientLight intensity={1} />
            <directionalLight position={[1, 5, 1]} intensity={1.5} />
            {modelStage
              ? SimulationData.map((item) => (
                  <ModelRenderer
                    onClick={() => handleMouseClick(item)}
                    onAnnotationClick={handleAnnotationClick}
                    key={item.id}
                    annotationValue={annotations}
                    detailModel={isDetailModel}
                    rotation={[item.rotation[0], item.rotation[1], item.rotation[2]]}
                    position={
                      isSmallScreen
                        ? new Vector3(...item.smallScreenPosition)
                        : new Vector3(...item.position)
                    }
                    scale={
                      isSmallScreen
                        ? new Vector3(...item.smallScreenScale)
                        : new Vector3(...item.scale)
                    }
                    modelPath={(awsModellink+item.path)}
                    onModelClick={() => handleMouseClick(item)}
                  />
                ))
              : SimulationData.map((item) => (
                  <ModelRenderer
                    onAnnotationClick={handleAnnotationClick}
                    key={item.id}
                    annotationValue={annotations}
                    detailModel={isDetailModel}
                    rotation={[item.rotation[0], item.rotation[1], item.rotation[2]]}
                    position={
                      isSmallScreen
                        ? new Vector3(...item.smallScreenPosition)
                        : [0, -1.5, 0]
                    }
                    scale={
                      isSmallScreen
                        ? new Vector3(...item.smallScreenScale)
                        : [0.4, 0.4, 0.4]
                    }
                    modelPath={(awsModellink+item.path)}
                    onPartClick={handlePartClick}
                    isPlaying={isPlaying}
                    onAnimation={handleAnimationAvailable}
                  />
                ))}
          </Suspense>
          <OrbitControls
            ref={controlsRef}
            enablePan={pan}
            enableRotate={rotate}
          />
        </Canvas>
      </ErrorBoundary>
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
        }}
      />
      <Stack
        align="flex-end"
        justify="center"
        style={{
          right: "2%",
          top: "50%",
          transform: "translateY(-50%)",
          background: "transparent",
          position: "fixed",
        }}
      >
        {isAnimation && <Button
          onClick={handleAnimationButton}
          style={{
          position: "relative",
          marginBottom: 10,
          paddingLeft: 0,
          paddingRight: 0,
          width: 50,
          height: 50,
          backgroundColor: "white",
          color: "white",
        }}
        onMouseEnter={() => setHovered(30)}
        onMouseLeave={() => setHovered(null)}
        >
          <Image
              src= {isPlaying ? Pause : Play }
              alt={"animation"}
              width={28}
              height={28}
            />
            {hovered === 30 &&
            <Text
                style={{
                  position: "absolute",
                  right: "calc(100% + 20px)",
                  top: "50%",
                  transform: "translateY(-50%)",
                  whiteSpace: "nowrap",
                  backgroundColor: "black",
                  color: "white",
                  padding: "7px",
                  borderRadius: "5px",
                  fontSize: "0.8rem",
                  maxWidth: "150px",
                }}
              >
                {getLanguageEnumByKeyForAnatomyModel({ key: isPlaying? "Pause" : "Play", LanguageId: userLanguage}) }
              </Text>}
          </Button>}
        {menuItems.map((item) => (
          <Button
            key={item.id}
            onClick={() => handleMenuClick(item.id)}
            className="menu-item"
            style={{
              position: "relative",
              marginBottom: 10,
              paddingLeft: 0,
              paddingRight: 0,
              width: 50,
              height: 50,
              backgroundColor:
                item.id === 1 && drawingMode
                  ? "#4B65F6"
                  : item.id === 4 && pan
                  ? "#4B65F6"
                  : item.id === 3 && rotate
                  ? "#4B65F6"
                  : item.id === 2 && !annotations
                  ? "#4B65F6"
                  : hovered === item.id
                  ? "#F3F3F6"
                  : "white",
              color: item.id === 1 && drawingMode ? "white" : "black",
            }}
            onMouseEnter={() => setHovered(item.id)}
            onMouseLeave={() => setHovered(null)}
          >
            <Image
              src={item.img}
              alt={item.text}
              width={28}
              height={28}
              style={{
                filter:
                  item.id !== 5 && imageColors[item.id] === "white"
                    ? "invert(1)"
                    : "invert(0)",
              }}
            />
            {hovered === item.id && (
              <Text
                style={{
                  position: "absolute",
                  right: "calc(100% + 20px)",
                  top: "50%",
                  transform: "translateY(-50%)",
                  whiteSpace: "nowrap",
                  backgroundColor: "black",
                  color: "white",
                  padding: "7px",
                  borderRadius: "5px",
                  fontSize: "0.8rem",
                  maxWidth: "150px",
                }}
              >
                {getLanguageEnumByKeyForAnatomyModel({ key: item.text, LanguageId: userLanguage}) }
              </Text>
            )}
          </Button>
        ))}
      </Stack>
    </Box>
  );
};

export default AnatomyModelSimulation;
