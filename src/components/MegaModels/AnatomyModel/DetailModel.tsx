import React, { useState, Suspense, useRef, useEffect } from "react";
import { Box, Button, Image, Text, Stack, Select, Overlay, Tabs } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import type { OrbitControls as OrbitControlsType } from "three-stdlib";
import ErrorBoundary from "./ErrorBoundary";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { Euler, Vector3 } from "three";
import { ModelRenderer } from "./ModelRenderer";
import { getLanguageEnumByKeyForAnatomyModel } from "../../../assets/LanguageEnums/AnatomyEnumFunction";

const anno1 = "https://vignam-content-images.s3.ap-south-1.amazonaws.com/2024-07-30T09-26-01-194Z.png";
const anno2 = "https://vignam-content-images.s3.ap-south-1.amazonaws.com/2024-07-30T09-26-20-082Z.png";
const anno5 = "https://vignam-content-images.s3.ap-south-1.amazonaws.com/2024-07-30T09-27-21-363Z.png";
const BackButton = "https://vignam-content-images.s3.ap-south-1.amazonaws.com/2024-07-30T09-30-15-462Z.png";
const Play = "https://vignam-content-images.s3.ap-south-1.amazonaws.com/2024-07-30T09-27-44-682Z.png";
const Pause = "https://vignam-content-images.s3.ap-south-1.amazonaws.com/2024-07-30T09-28-03-310Z.png";
const closeImg = "https://vignam-content-images.s3.ap-south-1.amazonaws.com/2024-07-30T09-28-22-597Z.png";
const AccountIcon = "https://vignam-content-images.s3.ap-south-1.amazonaws.com/2024-07-27T10-51-25-879Z.png";
const awsModellink = "https://vignammodelsstage.s3.ap-south-1.amazonaws.com/";
const menuItems = [
  { id: 1, text: "Go_Back", img: BackButton },
  { id: 2, text: "Draw_Tool", img: anno1 },
  { id: 3, text: "Annotations",img: anno2 },
  { id: 4, text: "Reset", img: anno5 },
];

var descdefault: any;
interface Tab {
  id: string;
  label: {en: string, hi: string};
  content: {en: string, hi: string};
  items?: Array<{
    part_id: string;
    part_name:{en: string, hi: string};
    content: {en: string, hi: string};
  }>;
}

const DetailModel = () => {
  const location = useLocation();
  const model = location.state?.model;
  const { modelId } = useParams();
  const navigate = useNavigate();
  const [hovered, setHovered] = useState<number | null>(null);
  const controlsRef = useRef<OrbitControlsType>(null);
  const [drawingMode, setDrawingMode] = useState(false);
  const drawCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastPosition, setLastPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [annotations, setAnnotations] = useState<boolean>(false);
  const [modelPathId, setModelPathId] = useState<string>("");
  const [modelPosition, setModelPosition] = useState<Vector3>(
    new Vector3(0, 0, 0)
  );
  const [modelscale, setModelScale] = useState<Vector3>(
    new Vector3(1, 1, 1)
  )
  const [modelRotation, setModelRotation] = useState<Euler>(new Euler(1, 1,1))
  const [isDetailModel, setisDetailModel] = useState<boolean>(true);
  const [cleanedName, setCleanedName] = useState<string>("");
  const [activeTab, setActiveTab] = useState("description");
  const isSmallScreen = useMediaQuery("(max-width: 768px)");
  const [selectedPartContent, setSelectedPartContent] = useState("");
  const [selectedPart, setSelectedPart] = useState<string | null>(null);
  const [selectedPartId, setSelectedPartId] = useState<string | null>(null);
  const [tabContents, setTabContents]=useState<Tab[]>([]);
  const [partsTab, setPartsTab] = useState<Tab>();
  const [imageColors, setImageColors] = useState<{ [key: number]: string }>({
    1: "black",
    2: "black",
    3: "white",
    4: "black",
  });
  const [isAnimation, setIsAnimation] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isAccountOpen, setAccountOpen] = useState<boolean>(false);
  const [userLanguage, setUserLanguage] = useState<string>('en');

const handleAnnotationClick = (name: string) => {
  setCleanedName(name);
  };
    
  useEffect(() => {
    setModelPathId(model.path);
    setModelPosition(model.detailPosition);
    setTabContents(model.tabContents);
    setModelRotation(new Euler(model.detailRotation[0], model.detailRotation[1], model.detailRotation[2]));
    setModelScale(new Vector3(model.detailScale[0], model.detailScale[1], model.detailScale[2]));
    setUserLanguage(location.state?.userLanguage)
    }, [modelId, model]);

useEffect(()=>{
    const found = tabContents.find((tab) => tab.id === "parts")
    if(found){
      setPartsTab(found);
      }

}, [tabContents, userLanguage])
      
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

  useEffect(() => {
    if (partsTab?.items) {
      const matchingPart = partsTab.items.find(
        (item) => item.part_id === cleanedName
      );
      if (matchingPart) {
        setActiveTab("parts");
        setSelectedPartId(matchingPart.part_id)
        setSelectedPart(userLanguage=="hi" ? matchingPart.part_name.hi: matchingPart.part_name.en);
        setSelectedPartContent(userLanguage=="hi" ? matchingPart.content.hi : matchingPart.content.en);
      } else {
        const matchingTab = tabContents.find(
          (tab) => tab.label.en === cleanedName
        );
        if (matchingTab) {
          setActiveTab(matchingTab.id);
        }
      }
    }
  }, [cleanedName,userLanguage]);

  useEffect(() => {
    if (partsTab?.items && partsTab.items.length > 0) {
      const firstPart = partsTab.items[0];
      setSelectedPartId(firstPart.part_id);
      setSelectedPart(userLanguage=="hi" ? firstPart.part_name.hi :  firstPart.part_name.en);
      setSelectedPartContent(userLanguage=="hi" ? firstPart.content.hi : firstPart.content.en);
    }
  }, [partsTab,userLanguage]);

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
      const currentPath = window.location.pathname;
      const segments = currentPath.split('/');
      const newPathname = segments.slice(0, -1).join('/');
      navigate(`${newPathname}`);
    } else if (key === 2) {
      setDrawingMode(!drawingMode);
    } else if (key === 3) {
      setAnnotations(!annotations);
    } else if (key === 4) {
      setDrawingMode(false);
      setAnnotations(false);
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
        3: "white",
      });
    } 

    setImageColors((prevColors) => ({
      ...prevColors,
      [key]: prevColors[key] === "black" ? "white" : "black",
    }));
  };

  const handlePartSelect = (value: string) => {
    if (partsTab?.items) {
      const selectedPart = partsTab.items.find(
        
        (item) => item.part_id=== value
      );
      if (selectedPart) {
        setSelectedPartId(selectedPart.part_id)
        setSelectedPart(userLanguage=="hi"? selectedPart.part_name.hi: selectedPart.part_name.en);
        setSelectedPartContent(userLanguage=="hi" ?  selectedPart.content.hi :  selectedPart.content.en);
      }
    }
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
        overflow: "hidden",
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
        </Button>
      </Box>
      <Box
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          zIndex: 0,
        }}
      />

      <ErrorBoundary>
        <Canvas
          camera={{ position: [0, 2, 10], fov: 35 }}
          style={{
            position: "absolute",
            top: isSmallScreen ? 0 : 0,
            left: isSmallScreen ? 0 : "calc(50% + 15vw)",
            transform: isSmallScreen ? "none" : "translateX(-50%)",
            width: isSmallScreen ? "100vw" : "130vw",
            height: isSmallScreen ? "50vh" : "100vh",
            zIndex: 1,
          }}
        >
          <Suspense fallback={null}>
            <ambientLight intensity={1} />
            <directionalLight position={[5, 5, 1]} intensity={1} />
            <ModelRenderer
              onAnnotationClick={handleAnnotationClick}
              detailModel={isDetailModel}
              annotationValue={annotations}
              position={modelPosition}
              scale={modelscale}
              rotation={modelRotation}
              modelPath={awsModellink+modelPathId}
              isPlaying={isPlaying}
              onAnimation = {handleAnimationAvailable}
            />
          </Suspense>
          <OrbitControls
            ref={controlsRef}
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
          zIndex: 9,
        }}
      />

      <Box
        style={{
          position: "absolute",
          top: isSmallScreen ? "50vh" : 0,
          left: 0,
          height: isSmallScreen ? "50vh" : "100vh",
          display: "flex",
          justifyContent: "flex-start",
          alignItems: "center",
          zIndex: 2,
        }}
      >
        <Box
          style={{
            width: isSmallScreen ? "95vw" : "38vw",
            height: "75%",
            backgroundColor: "white",
            padding: "20px",
            borderRadius: "10px",
            boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            marginLeft: isSmallScreen ? "2.5vw" : "2vw",
          }}
        >
          <Box style={{ marginBottom: "10px" }}>
            {tabContents && tabContents.map((tab) => (
              <Button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  backgroundColor: activeTab === tab.id ? "#4c6ef5" : "white",
                  color: activeTab === tab.id ? "white" : "black",
                  marginRight: "10px",
                  marginBottom: "10px",
                  border: activeTab === tab.id ? "none" : "1px solid #4c6ef5",
                }}
              >
                {userLanguage=="hi" ? tab.label.hi :  tab.label.en}
              </Button>
            ))}
          </Box>

          {partsTab && activeTab === "parts" && (
            <>
              <Select
                value={selectedPartId}
                data={
                  partsTab.items?.map((item) => ({
                    value: item.part_id,
                    label: userLanguage=="hi" ?  item.part_name.hi :  item.part_name.en,
                  })) || []
                }
                onChange={handlePartSelect}
                style={{
                  width: "50%",
                  marginLeft: "45%",
                  marginBottom: "10px",
                }}
              />
              <Text
                size={isSmallScreen ? "sm" : 30}
                weight={800}
                style={{ marginBottom: "10px", maxHeight: "200px" }}
              >
                {selectedPart}
              </Text>
              <Text
                size={isSmallScreen ? "sm" : "lg"}
                style={{
                  overflowY: "auto",
                  height: "calc(100% - 70px)",
                  maxHeight: "100%",
                }}
              >
                {selectedPartContent}
              </Text>
            </>
          )}

          {activeTab !== "parts" && (
            <>
              <Text
                size={isSmallScreen ? "sm" : 30}
                weight={800}
                style={{ marginBottom: "10px", maxHeight: "200px" }}
              >
                {userLanguage=="hi"? tabContents.find((tab) => tab.id === activeTab)?.label.hi : tabContents.find((tab) => tab.id === activeTab)?.label.en}
              </Text>

              <Text
                size={isSmallScreen ? "sm" : "lg"}
                style={{
                  overflowY: "auto",
                  height: "calc(100% - 70px)",
                  maxHeight: "100%",
                }}
              >
                {userLanguage=="hi" ? tabContents.find((tab) => tab.id === activeTab)?.content.hi:  tabContents.find((tab) => tab.id === activeTab)?.content.en}
              </Text>
            </>
          )}
        </Box>
      </Box>

      <Stack
        align="center"
        justify="center"
        style={{
          position: "absolute",
          right: "2%",
          top: isSmallScreen ? "7.5%" : "auto",
          bottom: isSmallScreen ? "auto" : "10px",
          height: isSmallScreen ? "auto" : "100%",
          background: "transparent",
          zIndex: 10,
        }}>
        {isAnimation && <Button
          onClick={handleAnimationButton}
          className="menu-item"
          style={{
            position: "relative",
            marginBottom: isSmallScreen ? "10px" : 10,
            paddingLeft: 0, paddingRight: 0, width: 50, height: 50, backgroundColor: "white", color: "white", }}
        onMouseEnter={() => setHovered(30)}
        onMouseLeave={() => setHovered(null)}>
          <Image
              src= {isPlaying ? Pause : Play }
              alt={"animation"}
              width={28}
              height={28}
            />
            { hovered === 30 && <Text
                className="hover-text"
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
                {isPlaying ? "Pause": "Play"}
              </Text> }
          </Button>}

        {menuItems.map((item) => (
          <Button
            key={item.id}
            onClick={() => handleMenuClick(item.id)}
            className="menu-item"
            style={{
              position: "relative",
              marginBottom: isSmallScreen ? "10px" : 10,
              paddingLeft: 0,
              paddingRight: 0,
              width: 50,
              height: 50,
              backgroundColor:
                item.id === 2 && drawingMode
                  ? '#4B65F6'
                  : item.id === 3 && !annotations
                  ? '#4B65F6'
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
                   imageColors[item.id] === "white"
                    ? "invert(1)"
                    : "invert(0)",
              }}
            />
            {hovered === item.id && (
              <Text
                className="hover-text"
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

export default DetailModel;
