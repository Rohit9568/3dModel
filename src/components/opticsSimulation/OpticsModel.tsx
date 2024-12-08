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
    isPlainMirror: boolean;
    isConcaveMirror: boolean;
    isConvexMirror: boolean;
    isConcaveLens: boolean;
    isConvexLens: boolean;
    selectedObject: string;
    radiusOfCurvature: number;
    showLabels: boolean;
    showRays: boolean;
    showFocals: boolean;
    showRuler: boolean;
    isResetted: boolean;
    isDataTransfer: boolean;
    zoom: number;
    savedData: any;
    handleDataTransfer: (data: any)=> void;
}
interface OpticsSceneProps{
    isPlainMirror: boolean;
    isConcaveMirror: boolean;
    isConvexMirror: boolean;
    isConcaveLens: boolean;
    isConvexLens: boolean;
    selectedObject: string;
    radiusOfCurvature: number;
    showLabels: boolean;
    showRays: boolean;
    showFocals: boolean;
    showRuler: boolean;
    isResetted: boolean;
    isDataTransfer: boolean;
    savedData: any;
    zoom: number;
    handleDataTransfer: (data: any)=> void;
}
const OpticsScene = ({isPlainMirror, isConcaveLens, isConcaveMirror, isConvexLens, isConvexMirror, selectedObject, radiusOfCurvature, 
  showLabels, showRays, showFocals, showRuler, isResetted, isDataTransfer, handleDataTransfer, savedData, zoom}: OpticsSceneProps) => {
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
    const [angle, setAngle] = useState<number>(0);
    const [angle2, setAngle2] = useState<number>(0);
    const [ImageRayPosition, setImageRayPosition]  = useState(new THREE.Vector3());
    const [Image2RayPosition, setImage2RayPosition]= useState(new THREE.Vector3());
    const [curvaturePositon, setCurvaturePositon] = useState<number>(-5);
    const [imageXPosition, setImageXPosition] = useState<number>(-5);
    const [boxYposition, setBoxYPosition] = useState<number>(-1);
    const [imageHeight, setImageHeight] = useState<number>(1);
    const [imageDirection, setImageDirection] = useState<number>(0);
    const [onImagehover, setImageHover] = useState<boolean>(false);
    const [magniValue, setMagniValue] = useState<number>(0);
    const { size } = useThree();
    const scaleX = size.width/1536;

useEffect(()=>{
    if(isDataTransfer){
      const data = {
        selectedObjectId: selectedObjectId,
        objectXPosition: objectXPosition,
        angle: angle,
        angle2: angle2,
        curvaturePositon: curvaturePositon,
      }
      handleDataTransfer(data);
}
},[isDataTransfer])

    useEffect(()=>{
      if(isResetted){
        setobjectXPosition(-5);
      }
    },[isResetted])


    useEffect(()=>{
      if(isPlainMirror){
        setBoxYPosition(-1);
        setImageDirection(0);
      }else if(isConcaveMirror){
        if(objectXPosition < -curvaturePositon/2){
          setBoxYPosition(+1)
          setImageDirection(1);
        }else {
          setImageDirection(0);
          setBoxYPosition(-1);
        }
      }else {
        setBoxYPosition(-1);
      }

    },[isPlainMirror, isConcaveMirror, isConvexMirror, isConcaveLens, isConvexLens, objectXPosition, curvaturePositon])

    useEffect(()=>{
        setCurvaturePositon(radiusOfCurvature/10)
    },[radiusOfCurvature])

    useEffect(()=>{
     if(isPlainMirror){
      setImageXPosition(-objectXPosition);
      setImageHeight(1);
      setMagniValue(1);
     }else if(isConcaveMirror){
        const fI = 2/curvaturePositon;
        const uI = -1/objectXPosition;
        const vI = 1/(fI - uI);
        setImageXPosition(-vI);
        const m = vI/-objectXPosition
        const hI = m;
        setMagniValue(-m);
        if(hI >= 0){
          setImageHeight(hI);
        }else{
        setImageHeight(-hI);
        }
      }else if(isConvexMirror){
        setImageDirection(0);
        const fI = -2/curvaturePositon;
        const uI = -1/objectXPosition;
        const vI = 1/(fI - uI);
        setImageXPosition(-vI);
        const m = vI/-objectXPosition
        const hI = m;
        setMagniValue(-m);
        setImageHeight(-hI)
      }else if(isConcaveLens){
        setImageDirection(0);
        const fI = 2/curvaturePositon;
        const uI = -1/objectXPosition;
        const vI = 1/(fI + uI);
        setImageXPosition(-vI);
        const m = vI/-objectXPosition
        const hI = m;
        setMagniValue(m);
        setImageHeight(hI);
      }else if(isConvexLens){
        const fI = -2/curvaturePositon;
        const uI = -1/objectXPosition;
        const vI = 1/(fI + uI);
        setImageXPosition(-vI);
        const m = vI/-objectXPosition
        const hI = m;
        setMagniValue(m);
        if(hI >= 0){
          setImageDirection(0);
          setImageHeight(hI);
          setBoxYPosition(-1)
        }else{
          setImageDirection(1);
          setBoxYPosition(1);
        setImageHeight(-hI);
        }
      }
    },[objectXPosition, curvaturePositon, isPlainMirror, isConcaveMirror, isConvexMirror, isConcaveLens, isConvexLens])

  useEffect(()=>{
    const x = 50 * Math.cos(angle*Math.PI/180)
    const y = 50* Math.sin(angle*Math.PI/180)
    var pos = new THREE.Vector3(-x, -y, 1);
    const x2 = 50 * Math.cos(angle2*Math.PI/180)
    const y2 = 50* Math.sin(angle2*Math.PI/180)
    var pos2 = new THREE.Vector3(-x2, -y2 +2.19, 1);

    if(isConvexMirror){
    pos2 = new THREE.Vector3(-x2, y2 +2.19, 1);
    }else if(isConcaveLens){
      pos = new THREE.Vector3(x, -y, 1);
      pos2 = new THREE.Vector3(x2, y2+2.19, 1);
    }else if(isConvexLens){
      pos = new THREE.Vector3(x, -y, 1);
      pos2 = new THREE.Vector3(x2, -y2+2.19, 1);
    }
    setImageRayPosition(pos);
    setImage2RayPosition(pos2);
  },[angle, objectXPosition, curvaturePositon, angle2, isConvexMirror, isConcaveLens])

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

const dottedlines = (start: THREE.Vector3, end: THREE.Vector3)=>{
  const dottedpoints = [];
  dottedpoints.push(start);
  dottedpoints.push(end);
  const geometry = new THREE.BufferGeometry().setFromPoints(dottedpoints);
  const line = new THREE.LineSegments(
    geometry,
    new THREE.LineDashedMaterial({ color: 'black', linewidth: 1, scale: 1, dashSize: 0.2, gapSize: 0.1})
  );
  line.computeLineDistances();
  return line;
}

useEffect(()=>{
  if(isPlainMirror){
    const origin = new THREE.Vector3(0, 0, 1);
    const endPoint1 = new THREE.Vector3(objectXPosition, 2.19, 1);
    const endPoint2 = new THREE.Vector3(-10, 0, 1);
    const angle = calculateAngle(origin, endPoint1, endPoint2);
    setAngle(angle);
  }else if(isConcaveMirror){
    if(-objectXPosition < curvaturePositon/2){
      const origin = new THREE.Vector3(0, 0, 1);
      const endPoint1 = new THREE.Vector3(imageXPosition, imageHeight*2.19, 1);
      const endPoint2 = new THREE.Vector3(10, 0, 1);
      const origin2 =  new THREE.Vector3(0, 2.19, 1);
      const endpoint3 = new THREE.Vector3(objectXPosition, 2.19, 1)
      const endpoint4 = new THREE.Vector3(-curvaturePositon/2, 0, 1);
      const angle = calculateAngle(origin, endPoint1, endPoint2);
      const angle2 = calculateAngle(origin2, endpoint3, endpoint4);
      setAngle(angle);
      setAngle2(angle2);
    }else if(objectXPosition < -curvaturePositon/2 ){
      const origin = new THREE.Vector3(0, 0, 1);
      const endPoint1 = new THREE.Vector3(objectXPosition,2.19, 1);
      const endPoint2 = new THREE.Vector3(-10, 0, 1);
      const origin2 =  new THREE.Vector3(0, 2.19, 1);
      const endpoint3 = new THREE.Vector3(-10, 2.19, 1)
      const endpoint4 = new THREE.Vector3(-curvaturePositon/2, 0, 1);
      const angle = calculateAngle(origin, endPoint1, endPoint2);
      const angle2 = calculateAngle(origin2, endpoint3, endpoint4);
      setAngle(angle);
      setAngle2(angle2);
    }
  }else if(isConvexMirror){
    const origin = new THREE.Vector3(curvaturePositon/2, 0, 1);
    const endPoint1 = new THREE.Vector3(0, 2.19, 1);
    const endPoint2 = new THREE.Vector3(-5, 0, 1);
    const origin2 =  new THREE.Vector3(0, 0, 1);
    const endpoint3 = new THREE.Vector3(-10, 0, 1)
    const endpoint4 = new THREE.Vector3(objectXPosition, 2.19, 1);
    const angle = calculateAngle(origin, endPoint1, endPoint2);
    const angle2 = calculateAngle(origin2, endpoint3, endpoint4);
    setAngle(angle2);
    setAngle2(angle);
  }else if(isConcaveLens){
    const origin = new THREE.Vector3(-curvaturePositon/2, 0, 1);
    const endPoint1 = new THREE.Vector3(0, 2.19, 1);
    const endPoint2 = new THREE.Vector3(5, 0, 1);
    const origin2 =  new THREE.Vector3(0, 0, 1);
    const endpoint3 = new THREE.Vector3(-10, 0, 1)
    const endpoint4 = new THREE.Vector3(objectXPosition, 2.19, 1);
    const angle = calculateAngle(origin, endPoint1, endPoint2);
    const angle2 = calculateAngle(origin2, endpoint3, endpoint4);
    setAngle(angle2);
    setAngle2(angle);
  }else if(isConvexLens){
    const origin = new THREE.Vector3(0, 0, 1);
    const endPoint1 = new THREE.Vector3(objectXPosition, 2.19, 1);
    const endPoint2 = new THREE.Vector3(-5, 0, 1);
    const origin2 =  new THREE.Vector3(curvaturePositon/2, 0, 1);
    const endpoint3 = new THREE.Vector3(-5, 0, 1)
    const endpoint4 = new THREE.Vector3(0, 2.19, 1);
    const angle = calculateAngle(origin, endPoint1, endPoint2);
    const angle2 = calculateAngle(origin2, endpoint3, endpoint4);
    setAngle(angle);
    setAngle2(angle2);
  }
},[objectXPosition, isPlainMirror, isConcaveMirror,isConcaveLens,isConvexLens, imageXPosition, imageHeight])

useEffect(()=>{
  if(selectedObject == "penguin"){
    setselectedObjectId(0)
  }else if(selectedObject == "pencil"){
    setselectedObjectId(1)
  }else if(selectedObject == "candle"){
    setselectedObjectId(2)
  }
},[selectedObject])


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

  useEffect(() => {
    document.body.style.cursor = pointerChange ? 'pointer' : 'auto'
  }, [pointerChange])

const handlePointerChangeOver = ()=>{
    setPointerChange(true);
}
const handlePointerChangeOut = ()=>{
    setPointerChange(false);
}


function calculateAngle(origin: THREE.Vector3, end1: THREE.Vector3, end2: THREE.Vector3): number {
  const vector1 = new THREE.Vector3().subVectors(end1, origin);
  const vector2 = new THREE.Vector3().subVectors(end2, origin);
  const dotProduct = vector1.dot(vector2);
  const magnitude1 = vector1.length();
  const magnitude2 = vector2.length();
  const cosineAngle = dotProduct / (magnitude1 * magnitude2);
  const angleRad = Math.acos(cosineAngle);
  const angleDeg = THREE.MathUtils.radToDeg(angleRad);
  return angleDeg;
}
const onImageLeave = ()=>{
  setImageHover(false);
}
const onImageEnter = ()=>{
  setImageHover(true);
}

useEffect(()=>{
  if(savedData.simulationType == "OpticsLab" && savedData.showCombinational == false){
    setselectedObjectId(savedData.selectedObjectId);
    setobjectXPosition(savedData.objectXPosition);
    setAngle(savedData.angle);
    setAngle2(savedData.angle2);
    setCurvaturePositon(savedData.curvaturePositon);
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
{isPlainMirror && <>
       <mesh position={[0.13, 0, 0]}>
      <planeGeometry args={[0.3, 8]} />
      <meshBasicMaterial map={planeMirrorTexture} transparent />
      </mesh>
      {showRays && <>
{RayCreater(new THREE.Vector3(objectXPosition,2.19,1), new THREE.Vector3(0, 0, 1)).map((arrow, index) => (
  <primitive key={index} object={arrow} />))}
{RayCreater(new THREE.Vector3(objectXPosition,2.19,1), new THREE.Vector3(0, 2.19, 1)).map((arrow, index) => (
  <primitive key={index} object={arrow} />))}
{RayCreater(new THREE.Vector3(0,2.19,1), new THREE.Vector3(-50, 2.19, 1)).map((arrow, index) => (
  <primitive key={index} object={arrow} />))}
{RayCreater(new THREE.Vector3(0,0,1), ImageRayPosition).map((arrow, index) => (
  <primitive key={index} object={arrow} />))}
  {<primitive object={dottedlines(new THREE.Vector3(imageXPosition, 2.19, 1), new THREE.Vector3(0, 0, 1))} />}
  {<primitive object={dottedlines(new THREE.Vector3(imageXPosition, 2.19, 1), new THREE.Vector3(0, 2.19, 1))} />}
  </>}
</>}
{isConcaveMirror && <>
       <mesh position={[-0.3, 0, 0]}>
      <planeGeometry args={[1.5, 10]} />
      <meshBasicMaterial map={ConcaveMirrorTexture} transparent />
      </mesh>

{showFocals && <>
       <mesh position={[-curvaturePositon/2, 0, 0]}>
          <circleGeometry args={[0.25, 32]} />
          <meshBasicMaterial color="red" transparent />
        </mesh>
        <Text color="black" fontSize={0.6} fontWeight={700} position={[-curvaturePositon/2 ,-0.7, 0]}>F</Text>

        <mesh position={[-curvaturePositon, 0, 0]}>
          <circleGeometry args={[0.25, 32]} />
          <meshBasicMaterial color="red" transparent />
        </mesh>
        <Text color="black" fontSize={0.6} fontWeight={700} position={[-curvaturePositon ,-0.7, 0]}>2F</Text>
        </>}
        {showLabels && <>
        <mesh position={[0, 6.25, 2]}>
          <planeGeometry args={[3.5, 1]} />
          <meshBasicMaterial color="white" opacity={0.6} transparent />
        </mesh>
        <Text color="black" fontSize={0.4} position={[0 ,6.5, 2.5]}>Concave Mirror</Text>
        <Text color="black" fontSize={0.35} position={[0 ,6, 2.5]}>R ={radiusOfCurvature}cm</Text>
        </>}
{showRays && <>
        {RayCreater(new THREE.Vector3(objectXPosition,2.19,1), new THREE.Vector3(0, 0, 1)).map((arrow, index) => (
            <primitive key={index} object={arrow} />))}
        {RayCreater(new THREE.Vector3(objectXPosition,2.19,1), new THREE.Vector3(0, 2.19, 1)).map((arrow, index) => (
            <primitive key={index} object={arrow} />))}
        {RayCreater(new THREE.Vector3(0,0,1), ImageRayPosition).map((arrow, index) => (
            <primitive key={index} object={arrow} />))}
        {RayCreater(new THREE.Vector3(0,2.19,1), Image2RayPosition).map((arrow, index) => (
            <primitive key={index} object={arrow} />))}
        { ( imageXPosition > 0 ) && <primitive object={dottedlines(new THREE.Vector3(imageXPosition, imageHeight*2.19, 1), new THREE.Vector3(0, 2.19, 1))} />}
        {(  imageXPosition > 0 ) && <primitive object={dottedlines(new THREE.Vector3(imageXPosition, imageHeight*2.19, 1), new THREE.Vector3(0, 0, 1))} />}
        </>}
    </>}
{isConvexMirror &&  <>
        <mesh position={[0.3, 0, 0]}>
       <planeGeometry args={[1.5, 10]} />
       <meshBasicMaterial map={ConvexMirrorTexture} transparent />
       </mesh>
       {showFocals && <>
       <mesh position={[curvaturePositon/2, 0, 0]}>
          <circleGeometry args={[0.25, 32]} />
          <meshBasicMaterial color="red" transparent />
        </mesh>
        <Text color="black" fontSize={0.6} fontWeight={700} position={[curvaturePositon/2 ,-0.7, 0]}>F</Text>

        <mesh position={[curvaturePositon, 0, 0]}>
          <circleGeometry args={[0.25, 32]} />
          <meshBasicMaterial color="red" transparent />
        </mesh>
        <Text color="black" fontSize={0.6} fontWeight={700} position={[curvaturePositon ,-0.7, 0]}>2F</Text>
        </>}
        {showLabels && <>
        <mesh position={[0, 6.25, 2]}>
          <planeGeometry args={[3.5, 1]} />
          <meshBasicMaterial color="white" opacity={0.6} transparent />
        </mesh>
        <Text color="black" fontSize={0.4} position={[0 ,6.5, 2.5]}>Convex Mirror</Text>
        <Text color="black" fontSize={0.35} position={[0 ,6, 2.5]}>R ={radiusOfCurvature}cm</Text>
        </>}
{showRays && <>
        {RayCreater(new THREE.Vector3(objectXPosition,2.19,1), new THREE.Vector3(0, 0, 1)).map((arrow, index) => (
            <primitive key={index} object={arrow} />))}
        {RayCreater(new THREE.Vector3(objectXPosition,2.19,1), new THREE.Vector3(0, 2.19, 1)).map((arrow, index) => (
            <primitive key={index} object={arrow} />))}
        {RayCreater(new THREE.Vector3(0,0,1), ImageRayPosition).map((arrow, index) => (
            <primitive key={index} object={arrow} />))}
        {RayCreater(new THREE.Vector3(0,2.19,1), Image2RayPosition).map((arrow, index) => (
            <primitive key={index} object={arrow} />))}
        {<primitive object={dottedlines(new THREE.Vector3(curvaturePositon/2,0, 1), new THREE.Vector3(0, 2.19, 1))} />}
        {<primitive object={dottedlines(new THREE.Vector3(imageXPosition, imageHeight*2.19, 1), new THREE.Vector3(0, 0, 1))} />}
        </>}
       </>}
{isConcaveLens && <>
        <mesh position={[0, 0, 0]}>
       <planeGeometry args={[2, 10]} />
       <meshBasicMaterial map={ConcaveLensTexture} transparent />
       </mesh>
       {showFocals && <>
       <mesh position={[-curvaturePositon/2, 0, 0]}>
          <circleGeometry args={[0.25, 32]} />
          <meshBasicMaterial color="red" transparent />
        </mesh>
        <Text color="black" fontSize={0.6} fontWeight={700} position={[-curvaturePositon/2 ,-0.7, 0]}>F</Text>

        <mesh position={[-curvaturePositon, 0, 0]}>
          <circleGeometry args={[0.25, 32]} />
          <meshBasicMaterial color="red" transparent />
        </mesh>
        <Text color="black" fontSize={0.6} fontWeight={700} position={[-curvaturePositon ,-0.7, 0]}>2F</Text>
        <mesh position={[curvaturePositon/2, 0, 0]}>
          <circleGeometry args={[0.25, 32]} />
          <meshBasicMaterial color="red" transparent />
        </mesh>
        <Text color="black" fontSize={0.6} fontWeight={700} position={[curvaturePositon/2 ,-0.7, 0]}>F</Text>

        <mesh position={[curvaturePositon, 0, 0]}>
          <circleGeometry args={[0.25, 32]} />
          <meshBasicMaterial color="red" transparent />
        </mesh>
        <Text color="black" fontSize={0.6} fontWeight={700} position={[curvaturePositon ,-0.7, 0]}>2F</Text>
        </>}
        {showLabels && <>
        <mesh position={[0, 6.25, 2]}>
          <planeGeometry args={[3.5, 1]} />
          <meshBasicMaterial color="white" opacity={0.6} transparent />
        </mesh>
        <Text color="black" fontSize={0.4} position={[0 ,6.5, 2.5]}>Concave Lens</Text>
        <Text color="black" fontSize={0.35} position={[0 ,6, 2.5]}>R ={radiusOfCurvature}cm</Text>
        </>}
        {showRays && <>
        {RayCreater(new THREE.Vector3(objectXPosition,2.19,1), new THREE.Vector3(0, 0, 1)).map((arrow, index) => (
            <primitive key={index} object={arrow} />))}
        {RayCreater(new THREE.Vector3(objectXPosition,2.19,1), new THREE.Vector3(0, 2.19, 1)).map((arrow, index) => (
            <primitive key={index} object={arrow} />))}
        {RayCreater(new THREE.Vector3(0,0,1), ImageRayPosition).map((arrow, index) => (
            <primitive key={index} object={arrow} />))}
        {RayCreater(new THREE.Vector3(0,2.19,1), Image2RayPosition).map((arrow, index) => (
            <primitive key={index} object={arrow} />))}
        {<primitive object={dottedlines(new THREE.Vector3(-curvaturePositon/2,0, 1), new THREE.Vector3(0, 2.19, 1))} />}
          </>}
    </> }
{isConvexLens && <>
        <mesh position={[0, 0, 0]}>
       <planeGeometry args={[1, 10]} />
       <meshBasicMaterial map={ConvexLensTexture} transparent />
       </mesh>
       {showFocals && <>
       <mesh position={[-curvaturePositon/2, 0, 0]}>
          <circleGeometry args={[0.25, 32]} />
          <meshBasicMaterial color="red" transparent />
        </mesh>
        <Text color="black" fontSize={0.6} fontWeight={700} position={[-curvaturePositon/2 ,-0.7, 0]}>F</Text>

        <mesh position={[-curvaturePositon, 0, 0]}>
          <circleGeometry args={[0.25, 32]} />
          <meshBasicMaterial color="red" transparent />
        </mesh>
        <Text color="black" fontSize={0.6} fontWeight={700} position={[-curvaturePositon ,-0.7, 0]}>2F</Text>
        <mesh position={[curvaturePositon/2, 0, 0]}>
          <circleGeometry args={[0.25, 32]} />
          <meshBasicMaterial color="red" transparent />
        </mesh>
        <Text color="black" fontSize={0.6} fontWeight={700} position={[curvaturePositon/2 ,-0.7, 0]}>F</Text>

        <mesh position={[curvaturePositon, 0, 0]}>
          <circleGeometry args={[0.25, 32]} />
          <meshBasicMaterial color="red" transparent />
        </mesh>
        <Text color="black" fontSize={0.6} fontWeight={700} position={[curvaturePositon ,-0.7, 0]}>2F</Text>
        </>}
        {showLabels && <>
        <mesh position={[0, 6.25, 2]}>
          <planeGeometry args={[3.5, 1]} />
          <meshBasicMaterial color="white" opacity={0.6} transparent />
        </mesh>
        <Text color="black" fontSize={0.4} position={[0 ,6.5, 2.5]}>Convex Lens</Text>
        <Text color="black" fontSize={0.35} position={[0 ,6, 2.5]}>R ={radiusOfCurvature}cm</Text>
          </>}
        {showRays && <>
        {RayCreater(new THREE.Vector3(objectXPosition,2.19,1), new THREE.Vector3(0, 0, 1)).map((arrow, index) => (
            <primitive key={index} object={arrow} />))}
        {RayCreater(new THREE.Vector3(objectXPosition,2.19,1), new THREE.Vector3(0, 2.19, 1)).map((arrow, index) => (
            <primitive key={index} object={arrow} />))}
        {RayCreater(new THREE.Vector3(0,0,1), ImageRayPosition).map((arrow, index) => (
            <primitive key={index} object={arrow} />))}
        {RayCreater(new THREE.Vector3(0,2.19,1), Image2RayPosition).map((arrow, index) => (
            <primitive key={index} object={arrow} />))}
        { ( imageXPosition < 0 ) && <primitive object={dottedlines(new THREE.Vector3(imageXPosition, imageHeight*2.19, 1), new THREE.Vector3(0, 2.19, 1))} />}
        {(  imageXPosition < 0 ) && <primitive object={dottedlines(new THREE.Vector3(imageXPosition, imageHeight*2.19, 1), new THREE.Vector3(0, 0, 1))} />}
          </>}
     </>}
    {selectedObjectId === 0 && <>
      <mesh position={[objectXPosition, 1.1, 2]}   name="OpticsObject"
      onPointerOver={handlePointerChangeOver} onPointerOut={handlePointerChangeOut}>
       <planeGeometry args={[1, 2.19]} />
       <meshBasicMaterial map={PenguinTexture} transparent />
       </mesh>
       
       <mesh position={[imageXPosition,imageDirection == 0 ? imageHeight*1.1 : -imageHeight*1.1, 0]} rotation={[0,0, imageDirection*Math.PI]}
       onPointerEnter={onImageEnter} onPointerLeave={onImageLeave}>
       <planeGeometry args={[imageHeight, imageHeight *2.19]} />
       <meshBasicMaterial map={PenguinInvertedTexture} transparent />
       </mesh>
       </>}
      {selectedObjectId === 1 && <>
       <mesh position={[objectXPosition, 1.07, 2]} name="OpticsObject"
       onPointerOver={handlePointerChangeOver} onPointerOut={handlePointerChangeOut}>
       <planeGeometry args={[1 * 0.35, 8.56 * 0.25]} />
       <meshBasicMaterial map={PencilTexture} transparent />
       </mesh>

       <mesh position={[imageXPosition,imageDirection == 0 ?  imageHeight*1.07 :  -imageHeight*1.07, 0]} rotation={[0,0, imageDirection*Math.PI]}
       onPointerEnter={onImageEnter} onPointerLeave={onImageLeave}>
       <planeGeometry args={[imageHeight*0.35, imageHeight* 8.56*0.25]} />
       <meshBasicMaterial map={PencilTexture} transparent />
       </mesh>
       </>}
        {selectedObjectId === 2 && <>
       <mesh position={[objectXPosition, 1.14, 2]}name="OpticsObject"
       onPointerOver={handlePointerChangeOver} onPointerOut={handlePointerChangeOut}>
       <planeGeometry  args={[1 * 0.5, 4.57*0.5]} />
       <meshBasicMaterial map={CandleTexture} transparent />
       </mesh>
       
       <mesh position={[imageXPosition,imageDirection == 0 ? imageHeight*1.14 : -imageHeight*1.14 , 0]} rotation={[0,0, imageDirection*Math.PI]}
       onPointerEnter={onImageEnter} onPointerLeave={onImageLeave}>
       <planeGeometry args={[imageHeight*0.5, imageHeight*4.57*0.5]} />
       <meshBasicMaterial map={CandleTexture} transparent />
       </mesh>
       </>}
       {showLabels && <>
       <mesh position={[objectXPosition, -1, 2]} name="OpticsObject"
       onPointerOver={handlePointerChangeOver} onPointerOut={handlePointerChangeOut}>
       <planeGeometry args={[2, 0.9]} />
       <meshBasicMaterial map={ObjectTexture} transparent />
       </mesh>
       <mesh position={[imageXPosition, boxYposition, 0]}
       onPointerEnter={onImageEnter} onPointerLeave={onImageLeave}>
       <planeGeometry args={[2, 0.9]} />
       <meshBasicMaterial map={ImageTexture} transparent />
       </mesh>
       </>}
       <mesh position={[objectXPosition, 0, 1]}>
          <circleGeometry args={[0.10, 20]} />
          <meshBasicMaterial color="black" transparent />
        </mesh>        
        <mesh position={[imageXPosition, 0, 1]}>
          <circleGeometry args={[0.10, 20]} />
          <meshBasicMaterial color="black" transparent />
        </mesh>

       {pointerChange && 
       <Text color="black" fontSize={0.35} position={[objectXPosition ,2.55, 1]}>x = {(objectXPosition*10).toFixed(2)}</Text>
        }
        {onImagehover && <>
        <Text color="black" fontSize={0.4} position={[imageXPosition, imageDirection == 0 ? imageHeight*2.5 : -imageHeight*2.5, 1]}>x = {(imageXPosition*10).toFixed(2)}</Text>
       <Text color="black" fontSize={0.4} position={[imageXPosition, imageDirection == 0 ? imageHeight*2.5 + 0.5 : -imageHeight*2.5 -0.5, 1]}>m = {(magniValue).toFixed(2)}</Text>
       </>}
      <primitive object={Xline}/>
      <primitive object={Yline} />
      </group>
    </>
  );
};

const OpticsModel = ({isPlainMirror, isConcaveMirror, isConvexMirror, isConcaveLens, isConvexLens, selectedObject, radiusOfCurvature,
   showLabels, showFocals, showRays, showRuler, isResetted, zoom, isDataTransfer, handleDataTransfer, savedData}: OpticsModelProps) => {
  return (
    <Canvas style={{ width: '100vw', height: '100vh', top: 0, left: 0, zIndex: 5 }}>
      <OrthographicCamera makeDefault position={[0, 0, 10]} zoom={zoom} />
      <OpticsScene isPlainMirror={isPlainMirror} isConcaveMirror={isConcaveMirror}
      isConcaveLens={isConcaveLens} isConvexLens={isConvexLens} isConvexMirror={isConvexMirror}
      selectedObject={selectedObject} radiusOfCurvature={radiusOfCurvature} showLabels={showLabels}
      showFocals={showFocals} showRays={showRays} showRuler={showRuler} isResetted={isResetted} 
      isDataTransfer={isDataTransfer} handleDataTransfer={handleDataTransfer} savedData={savedData} zoom={zoom}/>
      <OrbitControls enableRotate={false} enablePan={true} enableZoom={false} />
    </Canvas>
  );
};

export default OpticsModel;
