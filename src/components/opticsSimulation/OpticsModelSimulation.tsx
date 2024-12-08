import { Box, Button, Checkbox, Flex, Input, Notification, Overlay, Select, Slider, Stack, Text } from '@mantine/core'
import React, { useEffect, useState } from 'react'
import OpticsModel from './OpticsModel'
import CombinationalModel from './CombinationalModel';
import { createUserSavedSimulation } from '../../features/Simulations/getSimulationSlice';
import {useLocation, useNavigate } from 'react-router-dom';
import { useMediaQuery } from '@mantine/hooks';
import ThreeJSSimulationHandler from '../threejsSimulationHandler/ThreeJSSimulationHandler';

const planeMirrorImg = "https://vignam-content-images.s3.ap-south-1.amazonaws.com/2024-07-24T11-12-34-232Z.png";
const concaveMirrorImg = "https://vignam-content-images.s3.ap-south-1.amazonaws.com/2024-07-24T11-13-12-054Z.png";
const convexMirrorImg = "https://vignam-content-images.s3.ap-south-1.amazonaws.com/2024-07-24T11-13-57-946Z.png";
const lensMirrorImg = "https://vignam-content-images.s3.ap-south-1.amazonaws.com/2024-07-24T11-14-25-936Z.jpg";
const convexLensImg = "https://vignam-content-images.s3.ap-south-1.amazonaws.com/2024-07-24T11-14-48-232Z.png";
const ResetImg = "https://vignam-content-images.s3.ap-south-1.amazonaws.com/2024-07-24T11-15-13-240Z.png";
const ZoomInImg = "https://vignam-content-images.s3.ap-south-1.amazonaws.com/2024-07-24T11-15-32-611Z.png";
const ZoomOutImg = "https://vignam-content-images.s3.ap-south-1.amazonaws.com/2024-07-24T11-15-51-689Z.png";
const SaveImg = "https://vignam-content-images.s3.ap-south-1.amazonaws.com/2024-07-24T11-16-09-427Z.png";
const InfoImg = "https://vignam-content-images.s3.ap-south-1.amazonaws.com/2024-07-24T11-16-27-600Z.png";
const infoBoxImg = "https://vignam-content-images.s3.ap-south-1.amazonaws.com/2024-07-24T11-16-57-180Z.png";
const OkayButtonImg = "https://vignam-content-images.s3.ap-south-1.amazonaws.com/2024-07-24T11-17-32-433Z.png";

const mirrorButtons = [
    {id: 1, name: 'Plane Mirror', img: planeMirrorImg},
    {id: 2, name: 'Concave Mirror', img: concaveMirrorImg},
    {id: 3, name: "Convex Mirror", img: convexMirrorImg},
    {id: 4, name: 'Concave Lens', img: lensMirrorImg},
    {id: 5, name: 'Convex lens', img: convexLensImg}
]

const closeImg = "https://vignam-content-images.s3.ap-south-1.amazonaws.com/2024-07-19T08-07-39-787Z.png";
const maincloseImg = "https://vignam-content-images.s3.ap-south-1.amazonaws.com/2024-07-19T08-08-49-765Z.png";

const OpticsModelSimulation = () => {
    const location = useLocation();
    const isSmallScreen = useMediaQuery("(max-width: 768px)");
    const isMediumScreen = useMediaQuery("(max-width: 1072px)");
    const [isPlaneMirroOn, setisPlainMirror] = useState<boolean>(true);
    const [isconvexMirror, setConvexMirror] = useState<boolean>(false);
    const [isConcaveMirror, setConcaveMirror] = useState<boolean>(false);
    const [isconvexLens, setConvexLens] = useState<boolean>(false);
    const [isConcaveLens, setConcaveLens] = useState<boolean>(false);
    const [selectedImage, setSelectedImage] = useState('pencil');
    const [radiusofC, setRadiusofC]= useState<number>(150);
    const [showRay, setShowRay] = useState<boolean>(true);
    const [showFocal, setShowFocals] = useState<boolean>(true);
    const [showlabel, setShowLabel] = useState<boolean>(true);
    const [showRuler, setShowRuler] = useState<boolean>(false);
    const [showCombinational, setShowCombinational] = useState<boolean>(false);
    const [isaddingcombination, setAddingCombination] = useState<boolean>(true);
    const [selectedButtons, setSelectedButtons] = useState<string[]>([]);
    const [noofButtons, setNoofButtons] = useState<number>(0);
    const[r1, SetR1] = useState<number>(120);
    const[r2, SetR2] = useState<number>(140);
    const[r3, SetR3] = useState<number>(180);
    const [isfirst, setFirst] = useState<boolean>(false);
    const [isSecond, setSecond] = useState<boolean>(false);
    const [isThird, setThird] = useState<boolean>(false);
    const [isResetted, setIsResetted] = useState<boolean>(false);
    const [zoom , setZoom] = useState<number>(35);
    const [successmessage, setSuccessmessage] = useState<boolean>(false);
    const [errorMessage, setErrormessage] = useState<boolean>(false);
    const [isdatatransfer, setDataTransfer] = useState<boolean>(false);
    const [isdatatransferCombinational, setDataTransferCombinational] = useState<boolean>(false);
    const [isSave, setIsSave] = useState<boolean>(false);
    const [SaveTitle, setSaveTitle] = useState<string | null>(null);
    const [isInfoOpen, setInfoOpen] = useState<boolean>(false);
    const [showmirrorError, setShowMirrorError] = useState<boolean>(false);
    const [savedData, setSavedData] = useState<any>({});
    const dataFromState = location.state && location.state.data;
    const navigate = useNavigate();
    const pathParts = window.location.pathname.split('/');
    const sim_id = pathParts[pathParts.length - 1];

 useEffect(()=>{
if(showmirrorError){
    setTimeout(() => {
        setShowMirrorError(false);
    }, 3000);
}
 },[showmirrorError])   
useEffect(()=>{
    if(isResetted){
        setTimeout(() => {
            setIsResetted(false);
        }, 3000);
    }
},[isResetted])

    const handleResetButton= ()=>{
        setIsResetted(true);
        setAddingCombination(true);
        setFirst(false);
        setSecond(false);
        setThird(false);
        SetR1(120);
        SetR2(140);
        SetR3(180);
        setSelectedButtons([]);
        setNoofButtons(0);
        setShowLabel(true);
        setShowFocals(true);
        setShowRay(true);
        setRadiusofC(150);
        setSelectedImage('pencil');
        setZoom(35);
        if(showCombinational){
            setisPlainMirror(false);
            setConvexMirror(false);
            setConcaveMirror(false);
            setConcaveLens(false);
            setConvexLens(false);
        }
    }

useEffect(()=>{
    if(!dataFromState){
        setNoofButtons(0);
        setSelectedButtons([]);
     if(showCombinational){
            setSelectedImage('pencil');
            setAddingCombination(true);
            setisPlainMirror(false);
            setConvexMirror(false);
            setConcaveMirror(false);
            setConcaveLens(false);
            setConvexLens(false);
        }else {
            setisPlainMirror(true);
            setConvexMirror(false);
            setConcaveMirror(false);
            setConcaveLens(false);
            setConvexLens(false);
        }}else {
            if(showCombinational){
                setSelectedImage('pencil');
            }else {
                setisPlainMirror(true);
                setConvexMirror(false);
                setConcaveMirror(false);
                setConcaveLens(false);
                setConvexLens(false);
            }
        }
},[showCombinational])

const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

const handleDragStart = (event: React.DragEvent<HTMLButtonElement>, id: number)=>{
    event.dataTransfer.setData('objectId', id.toString());
}

const handleDrop = (event: React.DragEvent<HTMLDivElement>)=>{
    event.preventDefault();
    const id = parseInt(event.dataTransfer.getData('objectId'));
    handleButtonClick(id);
}
    const handleButtonClick = (id: number)=>{
        if(!showCombinational){
        if(id == 1){
            setisPlainMirror(!isPlaneMirroOn);
            setConvexMirror(false);
            setConcaveMirror(false);
            setConcaveLens(false);
            setConvexLens(false);
        }else if(id ==2){
            setConcaveMirror(!isConcaveMirror);
            setisPlainMirror(false);
            setConvexMirror(false);
            setConcaveLens(false);
            setConvexLens(false);
        }else if(id ==3){
            setisPlainMirror(false);
            setConvexMirror(!isconvexMirror);
            setConcaveMirror(false);
            setConcaveLens(false);
            setConvexLens(false);
        }else if(id ==4){   
            setisPlainMirror(false);
            setConcaveLens(!isConcaveLens);
            setConvexMirror(false);
            setConcaveMirror(false);
            setConvexLens(false);
        }else if(id ==5){
            setisPlainMirror(false);
            setConvexLens(!isconvexLens);            
            setConvexMirror(false);
            setConcaveMirror(false);
            setConcaveLens(false);
        }}else if(showCombinational){
            if(id == 1 && (noofButtons < 3)){
                if(isaddingcombination){
                    setNoofButtons(noofButtons+1);
                    setisPlainMirror(true);
                    setAddingCombination(false);
                    setSelectedButtons([...selectedButtons, "Plane Mirror"]);
                }else {
                    setShowMirrorError(true);
                }

            }else if(id == 2 && (noofButtons < 3) ){
                if(isaddingcombination){
                    setNoofButtons(noofButtons+1);
                    setAddingCombination(false);
                    setConcaveMirror(true);
                    setSelectedButtons([...selectedButtons, "Concave Mirror"]);
                }else{
                    setShowMirrorError(true);
                }
            }else if(id == 3 && (noofButtons < 3) ){
                if(isaddingcombination){
                    setNoofButtons(noofButtons+1);
                    setAddingCombination(false);
                    setSelectedButtons([...selectedButtons, "Convex Mirror"]);
                    setConvexMirror(true);
                }else{
                    setShowMirrorError(true);
                }
            }else if(id == 4 && (noofButtons < 3)){  
                if(isaddingcombination){
                setNoofButtons(noofButtons+1);
                setSelectedButtons([...selectedButtons, "Concave Lens"]);
                setConcaveLens(true)
            }else{
                setShowMirrorError(true);
            }
            }else if(id == 5 && (noofButtons < 3)){
                if(isaddingcombination){
                setNoofButtons(noofButtons+1);
                setSelectedButtons([...selectedButtons, "Convex Lens"]);
                setConvexLens(true);
                }else {
                    setShowMirrorError(true);
                }
            }
        }
    }
    const handleChange = (event: any) => {
        setSelectedImage(event);
      };
      const handleMirrorCurvatureChange = (id: number)=>{
        if(id == 0){
            setFirst(true);
            setSecond(false);
            setThird(false);
        }else if(id == 1){
            setFirst(false);
            setSecond(true);
            setThird(false);
        }else if(id == 2){
            setFirst(false);
            setSecond(false);
            setThird(true);
        }
      }

      const handleSaveButtonclick  = ()=>{
        setIsSave(false);
        if(showCombinational){
            setDataTransferCombinational(true);
        }else {
            setDataTransfer(true);
        }
      }
      const handledatatransfer = (data: any)=>{ 
        if(data){
            const savedValue = {
            simulationType: "OpticsLab",
            isfirst: isfirst,
            isSecond: isSecond,
            isThird: isThird,
            isPlaneMirroOn: isPlaneMirroOn,
            isConcaveMirror: isConcaveMirror, 
            isconvexMirror: isconvexMirror,
            isConcaveLens: isConcaveLens,
            isconvexLens: isconvexLens,
            selectedImage: selectedImage,
            radiusofC: radiusofC,
            showRay: showRay,
            showFocal: showFocal,
            showlabel: showlabel,
            showCombinational: showCombinational,
            selectedButtons: selectedButtons,
            noofButtons: noofButtons,
            r1: r1,
            r2: r2,
            r3: r3,
            zoom: zoom,
            isaddingcombination: isaddingcombination,
            ...data
        }
        const requestedData = {
            name: SaveTitle ?? 'Optics Lab',
            simulationId: 'OpticsMega',
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
    setIsSave(false);
    setSaveTitle(null);
   }
   const handleSaveTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSaveTitle(event.target.value)
  };
  
  const handleBackButton = ()=>{
    const currentPath = window.location.pathname;
    const segments = currentPath.split('/');
    const newPathname = segments.slice(0, -2).join('/');
    navigate(`${newPathname}`);
  }

  useEffect(()=>{
    if(dataFromState){
        setFirst(dataFromState.data.isfirst);
        setSecond(dataFromState.data.isSecond);
        setThird(dataFromState.data.isThird);
        setisPlainMirror(dataFromState.data.isPlaneMirroOn);
        setConcaveMirror(dataFromState.data.isConcaveMirror);
        setConvexMirror(dataFromState.data.isconvexMirror);
        setConcaveLens(dataFromState.data.isConcaveLens);
        setConvexLens(dataFromState.data.isconvexLens);
        setSelectedImage(dataFromState.data.selectedImage);
        setRadiusofC(dataFromState.data.radiusofC);
        setShowRay(dataFromState.data.showRay);
        setShowFocals(dataFromState.data.showFocal);
        setShowLabel(dataFromState.data.showlabel);
        setShowCombinational(dataFromState.data.showCombinational);
        setSelectedButtons(dataFromState.data.selectedButtons);
        setNoofButtons(dataFromState.data.noofButtons);
        SetR1(dataFromState.data.r1);
        SetR2(dataFromState.data.r2);
        SetR3(dataFromState.data.r3);
        setZoom(dataFromState.data.zoom);
        setSavedData(dataFromState.data);
        setAddingCombination(dataFromState.isaddingcombination);
}
},[dataFromState])

  return (
    <Box style={{background: '#ECF2FF', width:'100vw', height: '100vh', top: 0, left: 0}}  onDragOver={handleDragOver} onDrop={handleDrop}>
        <Flex style={{bottom: isMediumScreen ?10 : 20, zIndex: 12, position: 'absolute', left: isSmallScreen?"10%" :'50%', transform:isSmallScreen ?"" : 'translateX(-50%)', gap: isMediumScreen ?1 : 10}}>
            {mirrorButtons.map((buttons)=>(
            <Box sx={{display: 'flex',flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
            <Box sx={{display: 'flex', alignItems: 'center', padding: isSmallScreen ?'2px' :"4px", borderRadius: '10px',
                border:  buttons.id == 1 && isPlaneMirroOn ? "2px solid black" : 
                buttons.id ==2 && isConcaveMirror ? "2px solid black" :
                buttons.id == 3 && isconvexMirror ? "2px solid black":
                buttons.id ==4 && isConcaveLens ? "2px solid black" :
                buttons.id == 5 && isconvexLens ? "2px solid black" : '2px solid #ECF2FF',}}>
            <Button draggable onDragStart={(e) => handleDragStart(e, buttons.id)}
            sx={{width: isSmallScreen ? 40 : isMediumScreen ? 50: 60, height: isSmallScreen ? 40 :isMediumScreen ? 50: 60, padding: 0, border: '1px solid black', borderRadius: '10px', overflow: 'clip',}} variant='outline'
            onClick={()=>handleButtonClick(buttons.id)}>
                <img src={buttons.img} width={ isSmallScreen ? 42 :isMediumScreen ? 52:62} height={ isSmallScreen ? 42 :isMediumScreen ? 52:62} style={{overflow: 'clip'}} />
            </Button>
            </Box>
            <Box sx={{ alignItems: 'center', width: isSmallScreen ? 30 :""}}>
            <Text size={11}>{buttons.name}</Text>
            </Box>
            </Box>
            ))}
        </Flex>
{(isInfoOpen) && <>
    <Overlay opacity={0.8} color="#000" zIndex={1001} />
    <Box style={{ position: 'fixed', zIndex: 1001, top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: isSmallScreen ? "320px" : isMediumScreen ? "600px": '800px', height: isSmallScreen ? "250px": isMediumScreen ? "400px" :'550px',
    background: `url(${infoBoxImg})`, backgroundSize: 'contain',  backgroundRepeat: 'no-repeat', backgroundPosition: 'center',
}}>
      <Box style={{ position: 'absolute', bottom: isSmallScreen ? "38px": isMediumScreen ? "42px" :'70px', width: '100%', textAlign: 'center' }}>
        <Button variant='outline' sx={{ width: isSmallScreen ? 110 : isMediumScreen ? 200 :  250, height: isSmallScreen ?27 : isMediumScreen ? 45 : 60, padding: 0, borderColor: '#ECF2FF' }} onClick={() => setInfoOpen(false)}>
          <img src={OkayButtonImg} width={  isSmallScreen ? 110 :isMediumScreen ? 200 :250} height={ isSmallScreen ? 27 : isMediumScreen ? 45 :60} />
        </Button>
      </Box>
</Box>
    </>}



        {isSave && <>
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
<Text size='lg' mb={10}>Optics Lab</Text>
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

        <Box style={{position: 'absolute', bottom: 10, right: 15, zIndex: 12}}>
        <Box style={{display: 'flex', flexDirection: 'column', alignItems: 'end', marginRight: isMediumScreen ? 0 : 6, marginBottom: isMediumScreen ? 2 : 10}}>
            <Button variant='outline' sx={{width:isSmallScreen ? 40: 50, height:isSmallScreen ? 40: 50, padding: 0, borderColor: '#ECF2FF',overflow: 'hidden'}}
            onClick={()=>{ if(zoom <42) setZoom(zoom + 1)}}>
            <img src={ZoomInImg} width={isSmallScreen ? 50:60} height={isSmallScreen ? 50:60}/></Button>
            <Button variant='outline' sx={{width:isSmallScreen ? 40: 50, height:isSmallScreen ? 40: 50, padding: 0, borderColor: '#ECF2FF',overflow: 'hidden'}}
            onClick={()=>{if(zoom >25)setZoom(zoom - 1)}}>
            <img src={ZoomOutImg} width={isSmallScreen ? 50:60} height={isSmallScreen ? 50:60}/></Button>
            </Box>
            <Box sx={{alignItems: isSmallScreen ?"end" : 'center', marginBottom: 0, display: 'flex', flexDirection: isSmallScreen ? "column-reverse": "row", gap: 5}}>
            <Button variant='outline'  sx={{marginRight:isSmallScreen ? 0 : 10,width: isSmallScreen ? 65 : isMediumScreen ? 75 : 88, height: isSmallScreen ? 30 : isMediumScreen ? 40 :  52, padding: 0,  borderColor: '#ECF2FF',}} onClick={()=>setIsSave(true)}>
            <img src={SaveImg} width={isSmallScreen ? 63 : isMediumScreen ? 73 : 85} height={isSmallScreen ? 28 : isMediumScreen ? 38 :50}/>
            </Button>
            <Button variant='outline' sx={{width:isSmallScreen ? 30 : isMediumScreen ? 40 :  52, height: isSmallScreen ? 30 : isMediumScreen ? 40 : 52, padding: 0, borderColor: '#ECF2FF',marginRight:isSmallScreen ?0: 5}}
            onClick={handleResetButton}>
                <img src={ResetImg} width={isSmallScreen ? 28 : isMediumScreen ? 38 : 50} height={isSmallScreen ? 28: isMediumScreen ? 38 : 50}/></Button>
                <Button variant='outline' sx={{width: isSmallScreen ? 30 : isMediumScreen ? 40 : 52, height:isSmallScreen ? 30 :  isMediumScreen ? 40 : 52, padding: 0, borderColor: '#ECF2FF',}}
            onClick={()=>setInfoOpen(true)}>
                <img src={InfoImg} width={isSmallScreen ? 28 : isMediumScreen ? 38 :50} height={isSmallScreen ? 28 : isMediumScreen ? 38 : 50}/></Button>
            </Box>
            
        </Box>
        
        <Box style={{top:isMediumScreen ?10: 20, left:isMediumScreen ?10: 20, position: 'absolute', zIndex: 12, border: '2px solid black', borderRadius: '10px',
             padding: isSmallScreen ?"5px": isMediumScreen ? "8px 10px" : '10px 15px', minWidth: '14%',}}>
            <Text mb={isMediumScreen ? 10:15} sx={{fontWeight: 700, fontSize:isSmallScreen ?"15px" :'20px'}}>Options</Text>
            <Checkbox mb={isMediumScreen ? 4: 8} size={isMediumScreen ?"sm":'md'} label="Light Ray" checked={showRay} 
            onChange={(event) => setShowRay(event.currentTarget.checked)}/>
            {!showCombinational &&
            <Checkbox mb={isMediumScreen ? 4:8} size={isMediumScreen ?"sm" :'md'} label="Focal Point (F)" checked={showFocal}
            onChange={(event) => setShowFocals(event.currentTarget.checked)}/>        }
            <Checkbox mb={isMediumScreen ? 6:10} size={isMediumScreen ?"sm" :'md'} label="Labels" checked={showlabel}
            onChange={(event) => setShowLabel(event.currentTarget.checked)}/>
            <Checkbox mb={isMediumScreen ? 4:8} size={isMediumScreen ?"sm" :'md'} label="Use Combination" checked={showCombinational}
            onChange={(event) => setShowCombinational(event.currentTarget.checked)}/>
        </Box>
        <Button onClick={handleBackButton } variant='outline' style={{position: 'fixed', top: 5, right: 5, zIndex: 1000, padding: 0, border: '0.1px solid #ECF2FF'}}>
<img src={maincloseImg} alt="building" style={{ width: isMediumScreen ?20 : 35, height: isMediumScreen ?20 : 35,}} />
</Button>
        <Box style={{top: isMediumScreen ? 35: 50, right: 10, position: 'absolute', zIndex: 12, maxWidth: isMediumScreen ?"35%": ""}}>
        {(!isPlaneMirroOn && !showCombinational) && <>
        <Box  style={{border: '2px solid black', borderRadius: '10px', 
            padding:isMediumScreen ?'7px 8px': '10px 15px', minWidth: isMediumScreen ?'100px' : '20%', minHeight: isMediumScreen ?"110px" : '150px'}}>
                <Text mb={isMediumScreen ?5 : 20} sx={{fontWeight: 700, fontSize: isMediumScreen ?'15px' :'20px'}}>Controls</Text>
                <Text mb={isMediumScreen ?5 :10} sx={{fontSize:isMediumScreen ?'13px': '17px'}}>Radius of Curvature (cm)</Text>
            <Slider step={10} min={100} max={200} color='violet'
                        value={radiusofC} onChange={setRadiusofC}
                styles={{markLabel: { color: 'black', fontSize: isMediumScreen ?'9px' :'12px'},}} radius="xl"
                marks={[{value: 100, label: '100'},{value: 150, label: '150'}, {value: 200, label: '200'}]} />
        </Box></>}
        {selectedButtons.length > 0  && <>
            <Box  style={{border: '2px solid black', borderRadius: '10px', 
            padding: isMediumScreen ?'7px 8px': '10px 15px', minWidth: '20%', minHeight:isSmallScreen ?"130px": isMediumScreen ?"110px" : '150px'}}>
                <Text mb={isMediumScreen ?7 :15} sx={{fontWeight: 700, fontSize: '20px'}}>Controls</Text>
            {(!isSecond && !isThird)&& <>
            <Text mb={isMediumScreen ?5 :10} sx={{fontSize:isMediumScreen ?'11px': '15px',}}>Radius of Curvature for {selectedButtons[0]} (cm)</Text>
            <Slider step={10} min={100} max={200} color='violet'
                        value={r1} onChange={SetR1}
                styles={{markLabel: { color: 'black', fontSize: '12px'},}} radius="xl"
                marks={[{value: 100, label: '100'},{value: 150, label: '150'}, {value: 200, label: '200'}]} />
                </>}
                {isSecond&& <>
            <Text mb={isMediumScreen ?5 :10} sx={{fontSize:isMediumScreen ?'11px': '15px'}}>Radius of Curvature for {selectedButtons[1]} (cm)</Text>
            <Slider step={10} min={100} max={200} color='violet'
                        value={r2} onChange={SetR2}
                styles={{markLabel: { color: 'black', fontSize: '12px'},}} radius="xl"
                marks={[{value: 100, label: '100'},{value: 150, label: '150'}, {value: 200, label: '200'}]} />
                </>}            
                {isThird&& <>
            <Text mb={isMediumScreen ?5 :10} sx={{fontSize:isMediumScreen ?'11px': '15px'}}>Radius of Curvature for {selectedButtons[2]} (cm)</Text>
            <Slider step={10} min={100} max={200} color='violet'
                        value={r3} onChange={SetR3}
                styles={{markLabel: { color: 'black', fontSize: '12px'},}} radius="xl"
                marks={[{value: 100, label: '100'},{value: 150, label: '150'}, {value: 200, label: '200'}]} />
                </>}
        </Box>
            </>}
        <Box mt={10}>
        <Select disabled={showCombinational}
      placeholder="Select Object"
      value={selectedImage}
      onChange={(v)=>handleChange(v)}
      data={[
        { value: 'penguin', label: 'Penguin' },
        { value: 'pencil', label: 'Pencil' },
        { value: 'candle', label: 'Candle' },
      ]}
    />
        </Box>
        </Box>
        {successmessage && 
    <Notification onClose={()=>setSuccessmessage(!successmessage)} color="green" radius="md"  style={{minWidth: '15%', position: 'fixed', top:50, left: '50%', transform: 'translateX(-50%)', zIndex: 12}} title="Successfully saved!">
</Notification>}
{errorMessage && 
    <Notification onClose={()=>setErrormessage(!errorMessage)} color="red" radius="md"  style={{minWidth: '15%', position: 'fixed', top:50, left: '50%', transform: 'translateX(-50%)', zIndex: 12}} title="Error Occured">
Please try saving after sometime</Notification>}

{showmirrorError && 
    <Notification onClose={()=>setShowMirrorError(!showmirrorError)} color="red" radius="md"  style={{minWidth: '15%', position: 'fixed', top:50, left: '50%', transform: 'translateX(-50%)', zIndex: 12}} title="Cannot Add more Objects!">
You Cannot Add Objects when there is a mirror</Notification>}

      {!showCombinational ? 
        <OpticsModel isPlainMirror={isPlaneMirroOn} isConcaveMirror={isConcaveMirror} isConvexMirror={isconvexMirror}
        isConcaveLens={isConcaveLens} isConvexLens={isconvexLens} selectedObject={selectedImage}
        radiusOfCurvature={radiusofC} showLabels={showlabel} showRays={showRay} showFocals={showFocal} showRuler={showRuler}
        isResetted={isResetted} zoom = {zoom} isDataTransfer={isdatatransfer} handleDataTransfer={handledatatransfer}
        savedData={savedData}/>

        :  <CombinationalModel mirrorSequence={selectedButtons} handleCurvatureChange={handleMirrorCurvatureChange}
        firstRadius={r1} secondRadius={r2} thirdRadius={r3} isResetted={isResetted} isDataTransferCom={isdatatransferCombinational}
        handleDataTransfer={handledatatransfer} savedData={savedData}  showLabels={showlabel} showRays={showRay} zoom ={zoom} />}
    </Box>)
}

export default OpticsModelSimulation
