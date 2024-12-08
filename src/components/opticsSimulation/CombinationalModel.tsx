import React, { useEffect, useState } from 'react';
import { Canvas, useLoader,useThree } from '@react-three/fiber';
import { OrthographicCamera, OrbitControls, Text, Line } from '@react-three/drei';
import * as THREE from 'three';
import { TextureLoader, ArrowHelper } from 'three';

const planeMirrorImg = "https://vignam-content-images.s3.ap-south-1.amazonaws.com/2024-07-24T11-19-08-550Z.png";
const ConcaveMirrorImg = "https://vignam-content-images.s3.ap-south-1.amazonaws.com/2024-07-24T11-19-45-497Z.png";
const ConvexMirrorImg = "https://vignam-content-images.s3.ap-south-1.amazonaws.com/2024-07-24T11-20-42-504Z.png";
const ConcaveLensImg = "https://vignam-content-images.s3.ap-south-1.amazonaws.com/2024-07-24T11-21-13-393Z.png";
const ConvexLensImg  = "https://vignam-content-images.s3.ap-south-1.amazonaws.com/2024-07-24T11-21-39-269Z.png";
const PenguinImg = "https://vignam-content-images.s3.ap-south-1.amazonaws.com/2024-07-24T11-22-13-172Z.png";
const PencilImg = "https://vignam-content-images.s3.ap-south-1.amazonaws.com/2024-07-24T11-22-36-724Z.png";
const CandleImg = "https://vignam-content-images.s3.ap-south-1.amazonaws.com/2024-07-24T11-23-03-788Z.png";
const ObjectImg = "https://vignam-content-images.s3.ap-south-1.amazonaws.com/2024-07-24T11-23-24-546Z.png";
const PenguinInvertedImg = "https://vignam-content-images.s3.ap-south-1.amazonaws.com/2024-07-24T11-24-21-841Z.png";
const imageImg = "https://vignam-content-images.s3.ap-south-1.amazonaws.com/2024-07-24T11-24-39-446Z.png";


interface OpticsModelProps{
    showLabels?: boolean;
    showRays?: boolean;
    showFocals?: boolean;
    showRuler?: boolean;
    mirrorSequence: string[];
    handleCurvatureChange: (id: number)=>void;
    firstRadius: number;
    secondRadius: number;
    thirdRadius: number;
    isResetted: boolean;
    isDataTransferCom: boolean;
    savedData: any;
    zoom: number;
    handleDataTransfer: (data: any)=> void;
}
interface OpticsSceneProps{
    showLabels?: boolean;
    showRays?: boolean;
    showFocals?: boolean;
    showRuler?: boolean;
    mirrorSequence: string[];
    handleCurvatureChange: (id: number)=> void;
    firstRadius: number;
    secondRadius: number;
    thirdRadius: number;
    isResetted: boolean;
    isDataTransferCom: boolean;
    savedData: any;
    zoom:number;
    handleDataTransfer: (data: any)=> void;
}
const CombinationalScene = ({ mirrorSequence,handleCurvatureChange, showRays, showLabels, firstRadius, 
  secondRadius, thirdRadius, isResetted, isDataTransferCom, handleDataTransfer, savedData, zoom}: OpticsSceneProps) => {
    const planeMirrorTexture = useLoader(TextureLoader, planeMirrorImg);
    const ConcaveMirrorTexture = useLoader(TextureLoader, ConcaveMirrorImg);
    const ConvexMirrorTexture = useLoader(TextureLoader, ConvexMirrorImg);
    const ConcaveLensTexture = useLoader(TextureLoader, ConcaveLensImg);
    const ConvexLensTexture = useLoader(TextureLoader, ConvexLensImg);
    const PenguinTexture = useLoader(TextureLoader, PenguinImg);
    const PencilTexture = useLoader(TextureLoader, PencilImg);
    const CandleTexture = useLoader(TextureLoader, CandleImg);
    const ObjectTexture = useLoader(TextureLoader, ObjectImg);
    const ImageTexture = useLoader(TextureLoader, imageImg);
    const PenguinInvertedTexture = useLoader(TextureLoader, PenguinInvertedImg);
    const [selectedObjectId, setselectedObjectId] = useState<number>(0);
    const [isObjectSelected, setObjectSelected] = useState<boolean>(false);
    const [objectXPosition, setobjectXPosition] = useState<number>(-5);
    const [pointerChange, setPointerChange] = useState<boolean>(false);
    const [imageXPosition, setImageXPosition] = useState<number>(5);
    const [imageHeight, setImageHeight] = useState<number>(1);
    const [imageDirection, setImageDirection] = useState<number>(0);
    const [boxYposition, setBoxYPosition] = useState<number>(-1);
    const [magniValue, setMagniValue] = useState<number>(0);
    const [ImageRayPosition, setImageRayPosition]  = useState(new THREE.Vector3());
    const [Image2RayPosition, setImage2RayPosition]= useState<number>(0);
    const [lastimageHeight, setLastImageHeight] = useState<number>(0);
    const [angle, setAngle] = useState<number>(0);
    const [angle2, setAngle2] = useState<number>(0);
    const { size } = useThree();
    const scaleX = size.width/1536;
    
  const pointsX = [];
  pointsX.push(new THREE.Vector3(-50, 0, 0));
  pointsX.push(new THREE.Vector3(50, 0, 0));
  const geometryX = new THREE.BufferGeometry().setFromPoints(pointsX);
  const Xline = new THREE.LineSegments(
    geometryX,
    new THREE.LineDashedMaterial({ color: 'red', linewidth: 1, scale: 1, dashSize: 0.4, gapSize: 0.2})
  );
  Xline.computeLineDistances();

  const pointsY = [];
  pointsY.push(new THREE.Vector3(0, 50, 0));
  pointsY.push(new THREE.Vector3(0, -50, 0));
  const geometryY = new THREE.BufferGeometry().setFromPoints(pointsY);
  const Yline = new THREE.LineSegments(
    geometryY,
    new THREE.LineDashedMaterial({ color: 'red', linewidth: 1, scale: 1, dashSize: 0.4, gapSize: 0.2})
  );
  Yline.computeLineDistances();

  useEffect(()=>{
    if(isDataTransferCom){
      const data = {
        selectedObjectId: selectedObjectId,
        objectXPosition: objectXPosition,
        angle: angle,
      }
      handleDataTransfer(data);
}
},[isDataTransferCom])

  useEffect(()=>{
    if(isResetted){
      setobjectXPosition(-5);
      setImage2RayPosition(0);
    }
  },[isResetted])
  
  useEffect(() => {
    document.body.style.cursor = pointerChange ? 'pointer' : 'auto'
  }, [pointerChange])

const handlePointerChangeOver = ()=>{
    setPointerChange(true);
}
const handlePointerChangeOut = ()=>{
    setPointerChange(false);
}


useEffect(()=>{
var objectPosition = objectXPosition;
var imagePosition = 0;
var imageHeight = 0;
var objectHeight = 1;
var magnitude = 1;
mirrorSequence.map((element, index)=>{
if(element == "Plane Mirror"){
  imagePosition = -objectPosition;
  imageHeight = objectHeight;
  magnitude = objectHeight;
}else if(element == "Concave Mirror"){
  var r = 15;
  if(index == 0){
    r = -firstRadius/10
  }else if(index == 1){
    r = -secondRadius/10
  }else if(index == 2){
    r = -thirdRadius/10;
  }
  const fI = 2/r;
  const uI = 1/objectPosition;
  const vI = 1/(fI - uI);
  imagePosition = vI;
  const m = -vI/objectXPosition;
  imageHeight = m*objectHeight;
}else if(element == "Convex Mirror"){
  var r = 15;
  if(index == 0){
    r = firstRadius/10
  }else if(index == 1){
    r = secondRadius/10
  }else if(index == 2){
    r = thirdRadius/10;
  } 
   const fI = 2/r;
  const uI = 1/objectPosition;
  const vI = 1/(fI - uI);
  imagePosition = vI;
  const m = -vI/objectPosition;
  imageHeight = m*objectHeight;
}else if(element == "Concave Lens"){
  var r = 15;
  if(index == 0){
    r = -firstRadius/10
  }else if(index == 1){
    r = -secondRadius/10
  }else if(index == 2){
    r = -thirdRadius/10;
  } 
   const fI = 2/r;
  const uI = 1/objectPosition;
  const vI = 1/(fI +uI);
  imagePosition = vI;
  const m = vI/objectPosition;
  imageHeight = m*objectHeight;
}else if(element == "Convex Lens"){
  var r = 15;
  if(index == 0){
    r = firstRadius/10
  }else if(index == 1){
    r = secondRadius/10
  }else if(index == 2){
    r = thirdRadius/10;
  } 
   const fI = 2/r;
  const uI = 1/objectPosition;
  const vI = 1/(fI +uI);
  imagePosition = vI;
  const m = vI/objectPosition;
  imageHeight = m*objectHeight;
}
objectPosition = imagePosition - (index+1)*2;
objectHeight = imageHeight;
})

setImageXPosition(imagePosition);
setImageHeight(imageHeight);
setMagniValue(imageHeight);
if(imageHeight > 0){
  setBoxYPosition(-1);
}else {
  setBoxYPosition(1);
}
},[mirrorSequence, objectXPosition, firstRadius, secondRadius, thirdRadius, savedData])


useEffect(()=>{

  if(mirrorSequence.length == 1){
    setImage2RayPosition(0);
  }else if(mirrorSequence.length == 2){
    setImage2RayPosition(2);
  }else if(mirrorSequence.length == 3){
    setImage2RayPosition(4);
  }

},[mirrorSequence, objectXPosition, imageXPosition,firstRadius, secondRadius, thirdRadius])


const RayCreater = (start: THREE.Vector3, end: THREE.Vector3) => {
  const arrows = [];
  const points = [start, end];
  const totalLength = points[1].distanceTo(points[0]);
  const numArrows = Math.abs(Math.floor((start.x - end.x) / 2));
  const intervalLength = totalLength / numArrows;
  for (let i = 0; i < numArrows; i++) {
      const position = points[0].clone().lerp(points[1], i / numArrows);
      const direction = new THREE.Vector3().subVectors(points[1], points[0]).normalize();
      const arrow = new THREE.ArrowHelper( direction, position, intervalLength, 0x000000, 0.3, 0.3);
      arrows.push(arrow);
  }
  return arrows;
};

const ImageRayCreater = (start: THREE.Vector3, end: THREE.Vector3) => {
const arrows = [];
const points = [start, end];
const totalLength = points[1].distanceTo(points[0]);
const numArrows = Math.abs(Math.floor((start.x - end.x) / 2.5));
const intervalLength = totalLength / numArrows;
for (let i = 0; i < numArrows; i++) {
    const position = points[0].clone().lerp(points[1], i / numArrows);
    const direction = new THREE.Vector3().subVectors(points[1], points[0]).normalize();
    const arrow = new THREE.ArrowHelper( direction, position, intervalLength, 0xfa4646, 0.3, 0.3);
    arrows.push(arrow);
}
return arrows;
};

const dottedlines = (start: THREE.Vector3, end: THREE.Vector3)=>{
  const dottedpoints = [];
  dottedpoints.push(start);
  dottedpoints.push(end);
  const geometry = new THREE.BufferGeometry().setFromPoints(dottedpoints);
  const line = new THREE.LineSegments(
    geometry,
    new THREE.LineDashedMaterial({ color: '#fa4646', linewidth: 1, scale: 1, dashSize: 0.2, gapSize: 0.1})
  );
  line.computeLineDistances();
  return line;
}


const renderedElements = mirrorSequence.map((element, index) => {
  let texture, size;
  switch (element) {
    case 'Plane Mirror':
      texture = planeMirrorTexture;
      size = [0.5, 8];
      break;
    case 'Concave Mirror':
      texture = ConcaveMirrorTexture;
      size = [1.5, 10];
      break;
    case 'Convex Mirror':
      texture = ConvexMirrorTexture;
      size = [1.5, 10];
      break;
    case 'Concave Lens':
      texture = ConcaveLensTexture;
      size = [2, 10];
      break;
    case 'Convex Lens':
      texture = ConvexLensTexture;
      size = [1.5, 10];
      break;
    default:
      return null;
  }

  return (
    <mesh key={index} position={[index * 2, 0, 0]} onClick={()=>handleCurvatureChange(index)}>
      <planeGeometry args={[size?.[0], size?.[1]]} />
      <meshBasicMaterial map={texture} transparent />
    </mesh>
  );
});


useEffect(()=>{
  if(savedData.simulationType == "OpticsLab" && savedData.showCombinational == true){
    setselectedObjectId(savedData.selectedObjectId);
    setobjectXPosition(savedData.objectXPosition);
    setAngle(savedData.angle);
  }
},[savedData])



const handleGroupDown = (e: any) => {
  const mesh = e.intersections[0]?.object;
  if (mesh) {
      if(mesh.name == "OpticsObject"){
        setObjectSelected(true);
      }
  }
};
const handlePointerUp= ()=>{
  setObjectSelected(false);
}

const handlePointerMove=(e: any)=>{
  const value = scaleX*((1536/zoom)/2)*((e.clientX/window.innerWidth)*2 - 1);
  if(isObjectSelected && value <-2){
    setobjectXPosition(value);
  }
}

  return (
    <>
      <ambientLight intensity={1} />
      <group onPointerDown={handleGroupDown} onPointerUp={handlePointerUp} onPointerMove={handlePointerMove}>
      {renderedElements}
{(mirrorSequence.length > 0) && <>
      <mesh position={[objectXPosition, 1.07, 2]}  name="OpticsObject"
       onPointerOver={handlePointerChangeOver} onPointerOut={handlePointerChangeOut}>
       <planeGeometry args={[1 * 0.35, 8.56 * 0.25]} />
       <meshBasicMaterial map={PencilTexture} transparent />
       </mesh>
{showLabels && <>
       <mesh position={[objectXPosition, -1, 2]}   name="OpticsObject"
       onPointerOver={handlePointerChangeOver} onPointerOut={handlePointerChangeOut}>
       <planeGeometry args={[2, 0.9]} />
       <meshBasicMaterial map={ObjectTexture} transparent />
       </mesh>
       <mesh position={[imageXPosition, boxYposition, 0]}>
       <planeGeometry args={[2, 0.9]} />
       <meshBasicMaterial map={ImageTexture} transparent />
       </mesh></>}
       <mesh position={[imageXPosition,imageDirection == 0 ?  imageHeight*1.07 :  -imageHeight*1.07, 0]} rotation={[0,0, imageDirection*Math.PI]}>
       <planeGeometry args={[imageHeight*0.35, imageHeight* 8.56*0.25]} />
       <meshBasicMaterial map={PencilTexture} transparent />
       </mesh>


       <Text color="black" fontSize={0.4} position={[imageXPosition, imageDirection == 0 ? imageHeight*2.5 : -imageHeight*2.5, 1]}>x = {(imageXPosition*10).toFixed(2)}</Text>
       <Text color="black" fontSize={0.4} position={[imageXPosition, imageDirection == 0 ? imageHeight*2.5 + 0.5 : -imageHeight*2.5 - 0.5, 1]}>m = {(magniValue).toFixed(2)}</Text>
       {pointerChange && 
       <Text color="black" fontSize={0.35} position={[objectXPosition ,2.55, 1]}>x = {(objectXPosition*10).toFixed(2)}</Text>}
{showRays && <>
       {RayCreater(new THREE.Vector3(objectXPosition,2.19,1), new THREE.Vector3(0, 0, 1)).map((arrow, index) => (
            <primitive key={index} object={arrow} />))}
        {RayCreater(new THREE.Vector3(objectXPosition,2.19,1), new THREE.Vector3(0, 2.19, 1)).map((arrow, index) => (
            <primitive key={index} object={arrow} />))}
            </>}
</>}
{showRays && <>
{(imageXPosition < 0) && <>
       {ImageRayCreater(new THREE.Vector3(Image2RayPosition,2.19,1), new THREE.Vector3(imageXPosition,  imageHeight* 8.56*0.25, 1)).map((arrow, index) => (
            <primitive key={index} object={arrow} />))}
        {ImageRayCreater(new THREE.Vector3(Image2RayPosition,0,1), new THREE.Vector3(imageXPosition,  imageHeight* 8.56*0.25,1)).map((arrow, index) => (
            <primitive key={index} object={arrow} />))}
</>}
{(imageXPosition >=0) && <>
           <primitive object={dottedlines(new THREE.Vector3(Image2RayPosition, 2.19, 1), new THREE.Vector3(imageXPosition,  imageHeight* 8.56*0.25,1))} />
           <primitive object={dottedlines(new THREE.Vector3(Image2RayPosition,0, 1), new THREE.Vector3(imageXPosition,  imageHeight* 8.56*0.25,1))} />
</>}       
</>}
{(mirrorSequence.length > 1) && 
<group>
<arrowHelper  args={[new THREE.Vector3(-1,0, 0), new THREE.Vector3(0.5,-5.5, 1), 0.5, 0x5708FF, 0.3, 0.3]} />
<arrowHelper  args={[new THREE.Vector3(1,0, 0), new THREE.Vector3(0.5, -5.5, 1), 1.5, 0x5708FF, 0.3, 0.3]} />
<Text color="black" fontSize={0.4} position={[ 1,-5.8, 1]}>20cm</Text>
</group>

}
{(mirrorSequence.length > 2) && 
<group>
<arrowHelper  args={[new THREE.Vector3(-1,0, 0), new THREE.Vector3(2.5,-5.5, 1), 0.5, 0x5708FF, 0.3, 0.3]} />
<arrowHelper  args={[new THREE.Vector3(1,0, 0), new THREE.Vector3(2.5, -5.5, 1), 1.5, 0x5708FF, 0.3, 0.3]} />
<Text color="black" fontSize={0.4} position={[ 3,-5.8, 1]}>20cm</Text>
</group>}
      <primitive object={Xline} />
      <primitive object={Yline} />
      </group>
    </>
  );
  };

const CombinationalModel= ({mirrorSequence, handleCurvatureChange,firstRadius, secondRadius, thirdRadius, showLabels, 
      showRays, isResetted, isDataTransferCom, handleDataTransfer, savedData, zoom}: OpticsModelProps) => {
  return (
    <Canvas style={{ width: '100vw', height: '100vh', top: 0, left: 0, zIndex: 5 }}>
      <OrthographicCamera makeDefault position={[0, 0, 10]} zoom={zoom} />
      <CombinationalScene mirrorSequence={mirrorSequence} showRays={showRays} showLabels={showLabels}
       handleCurvatureChange={handleCurvatureChange}
      firstRadius={firstRadius} secondRadius={secondRadius} thirdRadius={thirdRadius}
      isResetted={isResetted} isDataTransferCom={isDataTransferCom} handleDataTransfer={handleDataTransfer} 
      savedData={savedData} zoom={zoom}/>
      <OrbitControls enableRotate={false} enablePan={false} enableZoom={false} />
    </Canvas>
  );
};

export default CombinationalModel;
