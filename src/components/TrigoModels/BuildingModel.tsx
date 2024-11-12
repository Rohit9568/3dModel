import React, { useEffect, useRef, useState } from 'react';
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber';
import { OrthographicCamera, Line, Text } from '@react-three/drei';
import * as THREE from 'three';
import { TextureLoader } from 'three';
import { OrbitControls } from '@react-three/drei';
import { Box, Button } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';

const CameraManImage= "https://vignam-content-images.s3.ap-south-1.amazonaws.com/2024-07-23T11-53-18-178Z.png";
const baseImg = "https://vignam-content-images.s3.ap-south-1.amazonaws.com/2024-07-23T05-34-47-931Z.png";
const manbodyImg = "https://vignam-content-images.s3.ap-south-1.amazonaws.com/2024-07-23T05-35-09-494Z.png";
const manHandImg = "https://vignam-content-images.s3.ap-south-1.amazonaws.com/2024-07-23T05-35-36-259Z.png";
const camerainManHandImg = "https://vignam-content-images.s3.ap-south-1.amazonaws.com/2024-07-23T05-36-10-435Z.png";
const buildingImg = "https://vignam-content-images.s3.ap-south-1.amazonaws.com/2024-07-23T05-36-37-117Z.png";
const buildingleftImg = "https://vignam-content-images.s3.ap-south-1.amazonaws.com/2024-07-23T05-37-00-682Z.png";
const mainCameraImg = "https://vignam-content-images.s3.ap-south-1.amazonaws.com/2024-07-23T05-38-36-699Z.png";
const angleSetterImg = "https://vignam-content-images.s3.ap-south-1.amazonaws.com/2024-07-23T05-39-00-599Z.png";
const manInvertedImg = "https://vignam-content-images.s3.ap-south-1.amazonaws.com/2024-07-23T05-39-21-471Z.png";
const manhandInvertedImg = "https://vignam-content-images.s3.ap-south-1.amazonaws.com/2024-07-23T05-39-55-166Z.png";
const clickimageImg = "https://vignam-content-images.s3.ap-south-1.amazonaws.com/2024-07-23T05-40-25-609Z.png";
const cameraClickedImage = "https://vignam-content-images.s3.ap-south-1.amazonaws.com/2024-07-23T05-41-01-885Z.png";
const showExplanationImg = "https://vignam-content-images.s3.ap-south-1.amazonaws.com/2024-07-23T05-41-23-751Z.png";
const bordedBoxImg = "https://vignam-content-images.s3.ap-south-1.amazonaws.com/2024-07-23T05-41-47-157Z.png";
const redboxImg = "https://vignam-content-images.s3.ap-south-1.amazonaws.com/2024-07-23T05-42-29-778Z.png";
const blackboximg = "https://vignam-content-images.s3.ap-south-1.amazonaws.com/2024-07-23T05-42-57-740Z.png";
const blackbox2img = "https://vignam-content-images.s3.ap-south-1.amazonaws.com/2024-07-23T05-43-34-803Z.png";
const blackbox21img = "https://vignam-content-images.s3.ap-south-1.amazonaws.com/2024-07-23T05-43-59-477Z.png";
const blackbox3img = "https://vignam-content-images.s3.ap-south-1.amazonaws.com/2024-07-23T05-44-24-778Z.png";
const blackbox31img = "https://vignam-content-images.s3.ap-south-1.amazonaws.com/2024-07-23T05-44-56-924Z.png";
const blackbox4img = "https://vignam-content-images.s3.ap-south-1.amazonaws.com/2024-07-23T05-45-18-863Z.png";
const skipdemoImg = "https://vignam-content-images.s3.ap-south-1.amazonaws.com/2024-07-23T05-45-38-553Z.png";
const demoCursorImg = "https://vignam-content-images.s3.ap-south-1.amazonaws.com/2024-07-23T05-45-58-557Z.png";

interface buildingprops {
        onDrop: (event: React.DragEvent<HTMLDivElement>) => void;
        handleExplainationClick: (h: string, b: string , aoe: string, angle: string)=> void;
        isBuilding1Shown: boolean;
        isBuilding2Shown: boolean;
        zoomValue: number;
        isPan: boolean;
        isDataTransfer: boolean;
        isResetted : boolean;
        savedData: any;
        handleDataTransfer: (data: any)=> void;
}
interface buildingsceneprops {
        handleExplainationClick: (h: string, b: string , aoe: string, angle: string)=> void;
        isBuilding1Shown: boolean;
        isBuilding2Shown: boolean;
        isResetted : boolean;
        isDataTransfer: boolean;
        savedData: any;
        zoom: number;
        handleDataTransfer: (data: any)=> void;
}

const BuildingScene = ({savedData, isBuilding1Shown,isDataTransfer, isBuilding2Shown,zoom, handleExplainationClick,handleDataTransfer, isResetted }: buildingsceneprops)=>{
  const baseTexture = useLoader(TextureLoader, baseImg);
  const manbodyTexture = useLoader(TextureLoader, manbodyImg);
  const manhandTexture = useLoader(TextureLoader, manHandImg);
  const cameraTexture = useLoader(TextureLoader, camerainManHandImg);
  const buildingTexture = useLoader(TextureLoader, buildingImg);
  const buildingleftTexture = useLoader(TextureLoader, buildingleftImg);
  const mainCameraTexture = useLoader(TextureLoader, mainCameraImg);
  const angleSetterTexture = useLoader(TextureLoader, angleSetterImg);
  const manInvertedTexture = useLoader(TextureLoader, manInvertedImg);
  const manhandInvertedTexture = useLoader(TextureLoader, manhandInvertedImg);
  const clickImageTexture = useLoader(TextureLoader, clickimageImg);
  const showExplanationTexture = useLoader(TextureLoader, showExplanationImg);
  const bordedBoxTexture = useLoader(TextureLoader, bordedBoxImg);
  const redBoxTexture = useLoader(TextureLoader, redboxImg);
  const blackBoxTexture = useLoader(TextureLoader, blackboximg);
  const blackBox2Texture = useLoader(TextureLoader, blackbox2img);
  const blackBox21Texture = useLoader(TextureLoader, blackbox21img);
  const blackBox3Texture = useLoader(TextureLoader, blackbox3img);
  const blackBox31Texture = useLoader(TextureLoader, blackbox31img);
  const blackBox4Texture = useLoader(TextureLoader, blackbox4img);
  const skipdemoTexture = useLoader(TextureLoader, skipdemoImg);
  const demoCursorTexture = useLoader(TextureLoader, demoCursorImg);
  const [angle, setAngle] = useState<number>(30);
  const [angleLeft, setLeftAngle] = useState<number>(45);
  const [endPoint, setEndPoint] = useState(new THREE.Vector3(-1, -1, 4));
  const [endPoint2, setEndPoint2] = useState(new THREE.Vector3(-5.6, -7.4, 4));
  const [isDragging, setIsDragging] = useState(false);
  const [isDraggingLeft, setIsDraggingLeft] = useState<boolean>(false);
  const [isDragging2, setIsDragging2] = useState(false);
  const [isDragging3, setIsDragging3] = useState(false);
  const [mousePosition, setMousePosition] = useState(new THREE.Vector2());
  const [mouseLeftPosition, setMouseLeftPosition] = useState(new THREE.Vector2(-4.6, -4));
  const [mouse2Position, setMouse2Position] = useState(new THREE.Vector2());
  const [mouse3Position, setMouse3Position] = useState(new THREE.Vector2());
  const [arcpoint, setarcpoint] = useState(new THREE.Vector3(-7.3, -5, 3));
  const [arcpointleft, setarcpointLeft] = useState(new THREE.Vector3(-7.3, -5, 9));
  const [isBuildingon, setisBuildingOn] = useState<boolean>(false);
  const [isBuilding2on, setisBuilding2On] = useState<boolean>(false);
  const [isManon, setisManOn] = useState<boolean>(false);
  const [buildingPosition, setbuildingPosition] = useState<number>(0);
  const [building2Position, setbuilding2Position] = useState<number>(0);
  const [manPosition, setManPosition] = useState<number>(0);
  const [boy1Angle, setBoy1Angle] = useState<number>(45);
  const [boy2Angle, setBoy2Angle] = useState<number>(45);
  const [b2EndPoint, setB2EndPoint] = useState(new THREE.Vector3(-1, -1, 0));
  const [b1EndPoint, setB1EndPoint] = useState(new THREE.Vector3(-1, -1, 0));
  const [arcpoint2, setarcpoint2] = useState(new THREE.Vector3(11, 5.5, 4));
  const [arcpoint3, setarcpoint3] = useState(new THREE.Vector3(11, 5.5, 4));
  const [isboy1visible, setBoy1Visible] = useState<boolean>(false);
  const [isboy2visible, setBoy2Visible] = useState<boolean>(false);
  const [isman1visible, setMan1Visible] = useState<boolean>(false);
  const [isman2Visible, setMan2Visible] = useState<boolean>(false);
  const [angleofElevation, setAngleofElevation] = useState<number>(0);
  const [angleofElevationLeft, setAngleofElevationLeft] = useState<number>(0);
  const [isImageClicked, setIsImageclicked] = useState<boolean>(false);
  const [isBoyCapturing, setBoyCapturing] = useState<boolean>(false);
  const [imageOffset, setImageOffset] = useState<number>(0.2);
  const [offvalue, setoffvalue] = useState<number>(0.2);
  const [positionY, setPositionY] = useState(4.8);
  const [pointerChange, setPointerChange] = useState<boolean>(false);
  const [isdemoSkipped, setDemoSkipped] = useState<boolean>(true);
  const [isdemoangle, setdemoangle] = useState<boolean>(true);
  const [isclickimg, setisclickimage] = useState<boolean>(false);
  const [isexplainbox, setExplainBox] = useState<boolean>(false);
  const [cursorScale, setCursorScale] = useState<number>(1);
  const cameraClickedTexture = useLoader(TextureLoader, cameraClickedImage)
  const CameraManImageTexture= useLoader(TextureLoader, CameraManImage);
  cameraClickedTexture.wrapS = THREE.RepeatWrapping;
  cameraClickedTexture.repeat.y = 0.3
  cameraClickedTexture.offset.y = imageOffset; 

  CameraManImageTexture.wrapS = THREE.RepeatWrapping;
  CameraManImageTexture.repeat.y = 0.3
  CameraManImageTexture.offset.y = offvalue-0.05; 

  const { size } = useThree();
  const scaleX = size.width;
  const scaleY = size.height;
  const sX = size.width/1536;
  const sY = size.height/750.40;

useEffect(()=>{
if(!isdemoangle && !isclickimg){
                setExplainBox(true);
        }
},[isclickimg])

useEffect(()=>{
        if(!isdemoangle){
                setisclickimage(true);
        }
},[isdemoangle])

useEffect(()=>{
                const value = angleofElevation - boy1Angle;
                if( value < 3.5 && value > -3.5){
                        setoffvalue(0.45 + value/10)
                }else if (value > 3.5){
                        setoffvalue(0.9);
                }else if(value < -3.5){
                        setoffvalue(0.4 + value/15);
                }
},[boy1Angle, buildingPosition, manPosition])

useEffect(()=>{
        const value = angleofElevationLeft - boy2Angle;
        if( value < 3.5 && value > -3.5){
                setoffvalue(0.45 + value/12)
        }else if (value > 3.5){
                setoffvalue(0.8);
        }else if(value < -3.5){
                setoffvalue(0.3 + value/15);
        }
},[boy2Angle, building2Position, manPosition])

useEffect(()=>{
if(isBoyCapturing){
        setIsImageclicked(false);
}else if(isImageClicked){
        setBoyCapturing(false);
}
},[isBoyCapturing, isImageClicked])

  useEffect(()=>{
        if(isDataTransfer){
                const data = {
                        angle: angle,
                        angleLeft: angleLeft,
                        isBuildingon: isBuildingon,
                        isBuilding2on: isBuilding2on,
                        isManon: isManon,
                        buildingPosition: buildingPosition,
                        building2Position: building2Position,
                        manPosition: manPosition,
                        isboy1visible: isboy1visible,
                        isboy2visible: isboy2visible,
                        isman1visible: isman1visible,
                        isman2Visible: isman2Visible,
                        angleofElevation: angleofElevation,
                        angleofElevationLeft: angleofElevationLeft,
                        isImageClicked: isImageClicked,
                        imageOffset: imageOffset,
                        positionY: positionY,
                        boy1Angle: boy1Angle,
                        boy2Angle: boy2Angle,
                }
                handleDataTransfer(data);
        }
  },[isDataTransfer])

  useEffect(()=>{
        if(isResetted){
                setBoy2Visible(false);
                setBoy1Visible(false);
                setIsImageclicked(false);
                setMan2Visible(false);
                setMan1Visible(true);
                setbuilding2Position(0);
                setbuildingPosition(0);
                setManPosition(0);
                setDemoSkipped(false);
        }
  },[isResetted])

  useEffect(()=>{
    const x = 5 * Math.cos(angle*Math.PI/180)
    const y = 5* Math.sin(angle*Math.PI/180)
    setarcpoint(new THREE.Vector3(-7.3 + 2.7 + 5 + manPosition  + (x/3), -7.4 + (y/3), 4)); 
    setEndPoint(new THREE.Vector3(-7.3 + 2.7 + 5 + manPosition + x, -7.4 + y, 4))
  },[angle, manPosition])

  useEffect(()=>{
        const x = 5 * Math.cos(angleLeft*Math.PI/180)
        const y = 5* Math.sin(angleLeft*Math.PI/180)
        setarcpointLeft(new THREE.Vector3(-0.6+ manPosition  - (x/3), -7.4 + (y/3), 100)); 
        setEndPoint2(new THREE.Vector3(-0.6 + manPosition - x, -7.4 + y, 5))
      },[manPosition, mouseLeftPosition, angleLeft])

  useEffect(()=>{
        const x = 5 * Math.cos(boy2Angle*Math.PI/180)
        const y = 5* Math.sin(boy2Angle*Math.PI/180)
        setarcpoint3(new THREE.Vector3( -14.5+ (x/2.7), 6 + building2Position - (y/2.7), 4)); 
        setB1EndPoint(new THREE.Vector3( -14.5 + x, 6  + building2Position- y, 5))
      },[boy2Angle, building2Position])

      useEffect(()=>{
        const x = 5 * Math.cos(boy1Angle*Math.PI/180)
        const y = 5* Math.sin(boy1Angle*Math.PI/180)
        setarcpoint2(new THREE.Vector3( 12- (x/2.7), 5.5 + buildingPosition - (y/2.7), 4)); 
        setB2EndPoint(new THREE.Vector3( 12 - x, 5.5 + buildingPosition - y, 5))
      },[boy1Angle, buildingPosition])

  const calculateAngle = (mousePosition: THREE.Vector2) => {
        const referencePoint = new THREE.Vector2((-1.3 + 1.7 + manPosition)*sX , -7.4*sY);
        const vectorToMouse = new THREE.Vector2(
          mousePosition.x - referencePoint.x,
          mousePosition.y - referencePoint.y
        );
        let angle = Math.atan2(vectorToMouse.y, vectorToMouse.x);
        angle = THREE.MathUtils.radToDeg(angle);
        if (angle < 0) {
          angle += 360;
        }
        return angle;
      };
      const calculateLeftAngle = (mousePosition: THREE.Vector2) => {
        const referencePoint = new THREE.Vector2(-0.6*sX + manPosition*sX , -7.4*sY);
        const vectorToMouse = new THREE.Vector2(
          mousePosition.x - referencePoint.x,
          mousePosition.y - referencePoint.y
        );
        let angle = Math.atan2(vectorToMouse.y, vectorToMouse.x);
        angle = THREE.MathUtils.radToDeg(angle);
        if (angle < 0) {
          angle += 360;
        }
        return angle;
      };
      const calculateAngle2 = (mousePosition: THREE.Vector2) => {
        const referencePoint = new THREE.Vector2(12*sX , 5.5*sY + buildingPosition*sY);
        const vectorToMouse = new THREE.Vector2(
          mousePosition.x - referencePoint.x,
          mousePosition.y - referencePoint.y
        );
        let angle = Math.atan2(vectorToMouse.y, vectorToMouse.x);
        angle = THREE.MathUtils.radToDeg(angle);
        if (angle < 0) {
          angle += 360;
        }
        return angle;
      };

      const calculateAngle3 = (mousePosition: THREE.Vector2) => {
        const referencePoint = new THREE.Vector2(-14.5*sX , 6*sY + building2Position*sY);
        const vectorToMouse = new THREE.Vector2(
          mousePosition.x - referencePoint.x,
          mousePosition.y - referencePoint.y
        );
        let angle = Math.atan2(vectorToMouse.y, vectorToMouse.x);
        angle = THREE.MathUtils.radToDeg(angle);
        if (angle < 0) {
          angle += 360;
        }
        return angle;
      };

      
useEffect(()=>{
 const angle = calculateAngle(mousePosition);
  if(angle <= 90){
        setAngle(Math.round(angle));
  }
},[mousePosition])

useEffect(()=>{
        const angle = calculateLeftAngle(mouseLeftPosition);
         if( 180 - angle >= 90){
               setLeftAngle(90);
         }else if(180-angle < 0){
                setLeftAngle(0);
         }else{
                setLeftAngle(180 - Math.round(angle));
         }
},[mouseLeftPosition])

useEffect(()=>{
        const angle = calculateAngle2(mouse2Position);
         if((Math.round(angle) - 180) <= 90 && (angle - 180 >= 0)){
                setBoy1Angle(Math.round(angle ) - 180);
         }
},[mouse2Position])

useEffect(()=>{
                const angle = calculateAngle3(mouse3Position);
                 if((360 - Math.round(angle)) <= 90 && (360 -angle  >= 0)){
                        setBoy2Angle(360 - Math.round(angle));
                 }
},[mouse3Position])

useEffect(()=>{
        if(isBuilding1Shown){
                setMan1Visible(true);
                setMan2Visible(false);
        }else if(isBuilding2Shown){
                setMan2Visible(true);
                setMan1Visible(false);
        }
},[isBuilding1Shown, isBuilding2Shown])

  const startPoint = new THREE.Vector3((-5.3  + 2.7 + 5 + manPosition)*sX, -7.4*sY, 4);
  const curveCenter = new THREE.Vector3((-7.3 + 2.7 + 5 + manPosition)*sX, -7.4*sY, 4).clone();
  const curveRadius = startPoint.distanceTo(curveCenter);
  const startAngle = Math.atan2(startPoint.y - curveCenter.y, startPoint.x - curveCenter.x);
  const endAngle = Math.atan2(arcpoint.y*sY - curveCenter.y, arcpoint.x*sX - curveCenter.x);
  const curve = new THREE.EllipseCurve(
      curveCenter.x, curveCenter.y,
      curveRadius, curveRadius,
      startAngle, endAngle,
      false, 0
  );
  const points = curve.getPoints(50);
  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  const material = new THREE.LineBasicMaterial({ color: 0x000000, depthTest: false, });
  const arc = new THREE.Line(geometry, material);
  arc.renderOrder = 1;
  

  const startPointl = new THREE.Vector3( (-2.6 + manPosition)*sX, -7.4*sY, 4);
  const curveCenterl = new THREE.Vector3((-0.6 +  manPosition)*sX, -7.4*sY, 4).clone();
  const curveRadiusl = startPoint.distanceTo(curveCenterl);
  const startAnglel = Math.atan2(startPointl.y - curveCenterl.y, startPointl.x - curveCenterl.x);
  const endAnglel = Math.atan2(arcpointleft.y*sY - curveCenterl.y, arcpointleft.x*sX - curveCenterl.x);
  const curvel = new THREE.EllipseCurve(
      curveCenterl.x, curveCenterl.y,
      curveRadiusl, curveRadiusl,
      startAnglel, endAnglel,
      true, 0
  );
  const pointsl = curvel.getPoints(50);
  const geometryl = new THREE.BufferGeometry().setFromPoints(pointsl);
  const materiall = new THREE.LineBasicMaterial({ color: 0x000000, depthTest: false, });
  const arcl = new THREE.Line(geometryl, materiall);
  arcl.renderOrder = 1;



  const startPoint2 = new THREE.Vector3( 10.5*sX, (5.5 + buildingPosition)*sY, 4);
  const curveCenter2 = new THREE.Vector3(12*sX, (5.5 + buildingPosition)*sY, 4).clone();
  const curveRadius2 = startPoint2.distanceTo(curveCenter2);
  const startAngle2 = Math.atan2(startPoint2.y - curveCenter2.y, startPoint2.x - curveCenter2.x);
  const endAngle2 = Math.atan2(arcpoint2.y*sY - curveCenter2.y, arcpoint2.x*sX - curveCenter2.x);
  const curve2 = new THREE.EllipseCurve(
      curveCenter2.x, curveCenter2.y,
      curveRadius2, curveRadius2,
      startAngle2, endAngle2,
      false, 0
  );
  const points2 = curve2.getPoints(50);
  const geometry2 = new THREE.BufferGeometry().setFromPoints(points2);
  const material2 = new THREE.LineBasicMaterial({ color: 0x000000, depthTest: false, });
  const arc2 = new THREE.Line(geometry2, material2);
  arc2.renderOrder = 1;

  const startPoint3 = new THREE.Vector3( -13.5*sX, 6*sY + building2Position*sY, 4);
  const curveCenter3 = new THREE.Vector3(-14.5*sX, 6*sY + building2Position*sY, 4).clone();
  const curveRadius3 = startPoint3.distanceTo(curveCenter3);
  const startAngle3 = Math.atan2(startPoint3.y - curveCenter3.y, startPoint3.x - curveCenter3.x);
  const endAngle3 = Math.atan2(arcpoint3.y*sY - curveCenter3.y, arcpoint3.x*sX - curveCenter3.x);
  const curve3 = new THREE.EllipseCurve(
      curveCenter3.x, curveCenter3.y,
      curveRadius3, curveRadius3,
      startAngle3, endAngle3,
      true, 0
  );
  const points3 = curve3.getPoints(50);
  const geometry3 = new THREE.BufferGeometry().setFromPoints(points3);
  const material3 = new THREE.LineBasicMaterial({ color: 0x000000, depthTest: false, });
  const arc3 = new THREE.Line(geometry3, material3);
  arc3.renderOrder = 1;


  useEffect(() => {
        var x = 11 - manPosition;
        var y = 13 + buildingPosition ;
        let angleOfElevation = Math.atan2(y, x);
        let angleBetweenHypotenuseAndBase = Math.PI / 2 - angleOfElevation;
        let angleDegrees = angleBetweenHypotenuseAndBase * (180 / Math.PI);
        setAngleofElevation(90 - angleDegrees);
      }, [manPosition, buildingPosition]);

      useEffect(() => {
        var x = 14.5 + manPosition;
        var y = 14 + building2Position;
        let angleOfElevationLeft = Math.atan2(y, x);
        let angleBetweenHypotenuseAndBase = Math.PI / 2 - angleOfElevationLeft;
        let angleDegrees = angleBetweenHypotenuseAndBase * (180 / Math.PI);
        setAngleofElevationLeft(90 - angleDegrees);
      }, [manPosition, building2Position]);

const handleMan1Click = ()=>{
        setIsImageclicked(true);
        setisclickimage(false);
        setBoyCapturing(false);
        if(isman1visible){
                const value = angle - angleofElevation
                if( value < 3.5 && value > -3.5){
                        setImageOffset(0.45 + value/10)
                }else if (value > 3.5){
                        setImageOffset(0.9);
                }else if(value < -3.5){
                        setImageOffset(0.4 + value/15);
                }
        }
}
const handleMan2Click = ()=>{
        setIsImageclicked(true);
        setisclickimage(false);
        setBoyCapturing(false);
        if(isman2Visible){
                const value = angleLeft - angleofElevationLeft
                if( value < 3.5 && value > -3.5){
                        setImageOffset(0.45 + value/12)
                }else if (value > 3.5){
                        setImageOffset(0.8);
                }else if(value < -3.5){
                        setImageOffset(0.3 + value/15);
                }
        }
}

const handleshowexplanationclick = ()=>{
        setExplainBox(false);
        if(isman1visible){
                var b = (11 - manPosition).toFixed(2);
                var h = (13 + buildingPosition).toFixed(2);
                handleExplainationClick(h, b, angleofElevation.toFixed(2), angle.toString());
        }else if(isman2Visible){
                var b = (14.5 + manPosition).toFixed(2);
                var h = (14 + building2Position).toFixed(2);
                handleExplainationClick(h, b, angleofElevationLeft.toFixed(2), angleLeft.toString());
        }
}

useFrame(() => {
        const yPos = 4.8 + 0.3* Math.sin(0.5 * Date.now() * 0.01);
        setPositionY(yPos);
      });

useEffect(()=>{
        if(savedData.simulationType == "TrigoBasis"){
          setAngle(savedData.angle);
          setLeftAngle(savedData.angleLeft);
          setisBuildingOn(savedData.isBuildingon);
          setisBuilding2On(savedData.isBuilding2on);
          setisManOn(savedData.isManon);
          setbuildingPosition(savedData.buildingPosition);
          setbuilding2Position(savedData.building2Position);
          setManPosition(savedData.manPosition);
          setBoy1Visible(savedData.isboy1visible);
          setBoy2Visible(savedData.isboy2visible);
          setMan1Visible(savedData.isman1visible);
          setMan2Visible(savedData.isman2Visible);
          setAngleofElevation(savedData.angleofElevation);
          setAngleofElevationLeft(savedData.angleofElevationLeft);
          setIsImageclicked(savedData.isImageClicked);
          setImageOffset(savedData.imageOffset);
          setPositionY(savedData.positionY);
          setBoy1Angle(savedData.boy1Angle);
          setBoy2Angle(savedData.boy2Angle);
          setDemoSkipped(false);
        }
    },[savedData])

    useEffect(() => {
        document.body.style.cursor = pointerChange ? 'pointer' : 'auto'
      }, [pointerChange])

    const handlePointerChangeOver = ()=>{
        setPointerChange(true);
    }
    const handlePointerChangeOut = ()=>{
        setPointerChange(false);
    }

    const handleGroupDown = (e: any) => {
        const mesh = e.intersections[0]?.object;
        if (mesh) {
            if(mesh.name == "cameraMan"){
                setisManOn(true);
            }else if(mesh.name == "Man1AngleSetter"){
                setIsDragging(true);
            }else if(mesh.name == "Man2AngleSetter"){
                setIsDraggingLeft(true);
            }else if(mesh.name == "Boy1AngleSetter"){
                setIsDragging2(true);
                setBoyCapturing(true);
            }else if(mesh.name == "Boy2AngleSetter"){
                setIsDragging3(true);
                setBoyCapturing(true);
            }else if(mesh.name == "Building1"){
                setisBuildingOn(true);
                setMan1Visible(true);
                setMan2Visible(false);
            }else if(mesh.name == "Building2"){
                setisBuilding2On(true);
                setMan1Visible(false);
                setMan2Visible(true);
            }else{
                setisManOn(false);
                setIsDragging(false);
                setIsDraggingLeft(false);
                setIsDragging2(false);
                setIsDragging3(false);
                setisBuildingOn(false);
                setisBuilding2On(false);
            }
        }
    };
    const handlePointerUp= ()=>{
        setisManOn(false);
        setIsDragging(false);
        setIsDraggingLeft(false);
        setIsDragging2(false);
        setIsDragging3(false);
        setisBuildingOn(false);
        setisBuilding2On(false);
    }
    const handlePointerMove=(e: any)=>{
        const sensitivityThreshold = 0.1;
        if(isManon){
                const value =  scaleX*((1/zoom)/2)*((e.clientX/window.innerWidth)*2 - 1);
                if (Math.abs(value - manPosition) > sensitivityThreshold) {
                if(value <= -10){
                        setManPosition(-10)
                }else if(value > 2.5){
                        setManPosition(2.5)
                } else {
                        setManPosition(value);
                }
        }
        }else if(isDragging){
                setMousePosition(new THREE.Vector2( scaleX*((1/zoom)/2)*((e.clientX/window.innerWidth)*2 - 1) , -scaleY*((1/zoom)/2)*((e.clientY/window.innerHeight)*2 -1)));
                setdemoangle(false);
        }else if(isDraggingLeft){
                setMouseLeftPosition(new THREE.Vector2( scaleX*((1/zoom)/2)*((e.clientX/window.innerWidth)*2 - 1) ,-scaleY*((1/zoom)/2)*((e.clientY/window.innerHeight)*2 -1)));
                setdemoangle(false);
        }else if(isDragging2){
                setMouse2Position(new THREE.Vector2( scaleX*((1/zoom)/2)*((e.clientX/window.innerWidth)*2 - 1) ,-scaleY*((1/zoom)/2)*((e.clientY/window.innerHeight)*2 -1)));
        }else if(isDragging3){
                setMouse3Position(new THREE.Vector2( scaleX*((1/zoom)/2)*((e.clientX/window.innerWidth)*2 - 1) ,-scaleY*((1/zoom)/2)*((e.clientY/window.innerHeight)*2 -1)));
        }else if(isBuildingon){
                const value = -11*((e.clientY/window.innerHeight)*2 -1);
                if(value <=-8){
                        setbuildingPosition(-8);
                }else if(value >=4){
                        setbuildingPosition(4)
                }else{
                        setbuildingPosition(value);
                }
        }else if(isBuilding2on){
                const value = -11*((e.clientY/window.innerHeight)*2 -1);
                if(value <=-8){
                        setbuilding2Position(-8);
                }else if(value >=4){
                        setbuilding2Position(4)
                }else{
                        setbuilding2Position(value);
                }
             }
    }

const skipdemoButton = ()=>{
        setDemoSkipped(false);
}

useFrame(() => {
                const yPos = 1 + 0.1* Math.sin(0.5 * Date.now() * 0.02);
                setCursorScale(yPos);
      });

return <>
<ambientLight intensity={1} />
<group onPointerDown={handleGroupDown} onPointerUp={handlePointerUp} onPointerMove={handlePointerMove}>
{(isdemoSkipped) && <>
{(!isBuilding1Shown && !isBuilding2Shown) && <>
<mesh  position={[(-3)*sX, 6.7*sY, 0]}>
        <planeGeometry args={[10*sX, 3*sY]} />
        <meshBasicMaterial map={blackBoxTexture} transparent />
</mesh>
<mesh  position={[(0.8)*sX, 5.8*sY, 0]} onClick={skipdemoButton}
onPointerOver={handlePointerChangeOver} onPointerOut={handlePointerChangeOut}>
        <planeGeometry args={[2.2*sX, 1*sY]} />
        <meshBasicMaterial map={skipdemoTexture} transparent />
</mesh>
<mesh  position={[(-5)*sX, 7.8*sY, 4]} onClick={skipdemoButton}
onPointerOver={handlePointerChangeOver} onPointerOut={handlePointerChangeOut}>
        <planeGeometry args={[cursorScale*sX, cursorScale*sY]} />
        <meshBasicMaterial map={demoCursorTexture} transparent />
</mesh>
</>}

{(isdemoangle && (isman1visible) && (isBuilding1Shown || isBuilding2Shown)) && <>
<mesh  position={[(-3 + manPosition)*sX, -4.7*sY, 3]}>
        <planeGeometry args={[10*sX, 3*sY]} />
        <meshBasicMaterial map={blackBox2Texture} transparent />
</mesh>
<mesh  position={[(-6.7+ manPosition)*sX, -5.1*sY, 3.1]} onClick={skipdemoButton}
onPointerOver={handlePointerChangeOver} onPointerOut={handlePointerChangeOut}>
        <planeGeometry args={[2.2*sX, 1*sY]} />
        <meshBasicMaterial map={skipdemoTexture} transparent />
</mesh>
<mesh  position={[(6 + manPosition)*sX, -5.8*sY, 4]} onClick={skipdemoButton}
onPointerOver={handlePointerChangeOver} onPointerOut={handlePointerChangeOut}>
        <planeGeometry args={[cursorScale*sX, cursorScale*sY]} />
        <meshBasicMaterial map={demoCursorTexture} transparent />
</mesh>
</>}

{(isdemoangle && (isman2Visible))&& (isBuilding1Shown || isBuilding2Shown) && <>
<mesh  position={[(2.8 + manPosition)*sX, -4.7*sY, 3]}>
        <planeGeometry args={[10*sX, 3*sY]} />
        <meshBasicMaterial map={blackBox21Texture} transparent />
</mesh>
<mesh  position={[(6.5 + manPosition)*sX, -5.1*sY, 3.1]} onClick={skipdemoButton}
onPointerOver={handlePointerChangeOver} onPointerOut={handlePointerChangeOut}>
        <planeGeometry args={[2.2*sX, 1*sY]} />
        <meshBasicMaterial map={skipdemoTexture} transparent />
</mesh>
<mesh  position={[(-3+manPosition)*sX, -5*sY, 5]} onClick={skipdemoButton}
onPointerOver={handlePointerChangeOver} onPointerOut={handlePointerChangeOut}>
        <planeGeometry args={[cursorScale*sX, cursorScale*sY]} />
        <meshBasicMaterial map={demoCursorTexture} transparent />
</mesh>
</>}

{(isclickimg && (isman1visible)) && <>
<mesh  position={[(-5 + manPosition)*sX, -5.4*sY, 3]}>
        <planeGeometry args={[10*sX, 3*sY]} />
        <meshBasicMaterial map={blackBox3Texture} transparent />
</mesh>
<mesh  position={[(-1.1 + manPosition)*sX, -5.8*sY, 3.1]} onClick={skipdemoButton}
onPointerOver={handlePointerChangeOver} onPointerOut={handlePointerChangeOut}>
        <planeGeometry args={[2*sX, 0.8*sY]} />
        <meshBasicMaterial map={skipdemoTexture} transparent />
</mesh>
<mesh  position={[(-1.5 + manPosition)*sX, -8.7*sY, 5]} onClick={skipdemoButton}
onPointerOver={handlePointerChangeOver} onPointerOut={handlePointerChangeOut}>
        <planeGeometry args={[cursorScale*sX, cursorScale*sY]} />
        <meshBasicMaterial map={demoCursorTexture} transparent />
</mesh>
</>}
{(isclickimg && (isman2Visible)) && <>
<mesh  position={[(5 + manPosition)*sX, -5.4*sY, 3]}>
        <planeGeometry args={[10*sX, 3*sY]} />
        <meshBasicMaterial map={blackBox31Texture} transparent />
</mesh>
<mesh  position={[(8.8 + manPosition)*sX, -5.8*sY, 3.1]} onClick={skipdemoButton}
onPointerOver={handlePointerChangeOver} onPointerOut={handlePointerChangeOut}>
        <planeGeometry args={[2*sX, 0.8*sY]} />
        <meshBasicMaterial map={skipdemoTexture} transparent />
</mesh>
<mesh  position={[(3.5 + manPosition)*sX, -8.7*sY, 5]} onClick={skipdemoButton}
onPointerOver={handlePointerChangeOver} onPointerOut={handlePointerChangeOut}>
        <planeGeometry args={[cursorScale*sX, cursorScale*sY]} />
        <meshBasicMaterial map={demoCursorTexture} transparent />
</mesh>
</>}

{(isexplainbox && !isclickimg) && <>
<mesh  position={[(-3.5)*sX, 1.4*sY, 3]}>
        <planeGeometry args={[10*sX, 3*sY]} />
        <meshBasicMaterial map={blackBox4Texture} transparent />
</mesh>
<mesh  position={[(0.3)*sX, 0.5*sY, 3.1]} onClick={skipdemoButton}
onPointerOver={handlePointerChangeOver} onPointerOut={handlePointerChangeOut}>
        <planeGeometry args={[2*sX, 1*sY]} />
        <meshBasicMaterial map={skipdemoTexture} transparent />
</mesh>
<mesh  position={[(-3.8)*sX, 4*sY, 5]} onClick={skipdemoButton}
onPointerOver={handlePointerChangeOver} onPointerOut={handlePointerChangeOut}>
        <planeGeometry args={[cursorScale*sX, cursorScale*sY]} />
        <meshBasicMaterial map={demoCursorTexture} transparent />
</mesh>
</>}
</>}
{isman1visible && <>
<mesh  position={[(1 + manPosition)*sX, -7.2*sY, 0]} name='cameraMan'>
        <planeGeometry args={[1.6*sX, 1.3*sY]} />
        <meshBasicMaterial map={manhandTexture} transparent />
</mesh>
<mesh  position={[1.8*sX + manPosition*sX, -6.8*sY, 0]} name='cameraMan'>
        <planeGeometry args={[0.5*sX, 0.35*sY]} />
        <meshBasicMaterial map={cameraTexture} transparent />
</mesh>

</>}
<mesh  position={[-3*sX, -19.88*sY, -4]} >
        <planeGeometry args={[20*sX, 40*sY]} />
        <meshBasicMaterial map={baseTexture} transparent />
</mesh>

{isman1visible && <>
<mesh name='cameraMan' position={[ manPosition*sX, -7.7*sY, 0]} 
onPointerOver={handlePointerChangeOver} onPointerOut={handlePointerChangeOut}>
        <planeGeometry args={[1.5*sX, 2.5*sY]} />
        <meshBasicMaterial map={manbodyTexture} transparent />
</mesh>

<mesh  position={[ manPosition*sX - 2.2*sX, -7.7*sY, 0]} onClick={handleMan1Click}
onPointerOver={handlePointerChangeOver} onPointerOut={handlePointerChangeOut}>
        <planeGeometry args={[3*sX, 1.5*sY]} />
        <meshBasicMaterial map={clickImageTexture} transparent />
</mesh>

<Line points={[[(-1.3 + 1.7 + manPosition)*sX , -7.4*sY, 4], [(-1.3 + 1.7+ 5 + manPosition)*sX, -7.4*sY, 4]]} color="gray" lineWidth={3} />
<Line points={[[(-1.3 + 1.7 + manPosition)*sX, -7.4*sY, 4], [endPoint.x*sX,endPoint.y*sY, endPoint.z]]} color="gray" lineWidth={3} />
<primitive object={arc} />


<mesh position={[(-4.4 + 2.7 + 5 + manPosition)*sX , -6.8*sY, 4]}>
        <planeGeometry args={[1.3*sX, 0.8*sY]} />
        <meshBasicMaterial color="white" />
</mesh>
<primitive object={arc} />
<Text color="black" fontSize={0.5} fontWeight={700} position={[(-4.4 + 2.7 + 5 + manPosition)*sX ,-6.8*sY, 4]}>
    {angle}°
</Text>

<mesh  position={ [endPoint.x*sX,endPoint.y*sY, endPoint.z]} name='Man1AngleSetter'
onPointerOver={handlePointerChangeOver} onPointerOut={handlePointerChangeOut}>
        <planeGeometry args={[3*sX,3*sY]} />
        <meshBasicMaterial map={angleSetterTexture} transparent />
</mesh>
</>}

{isman2Visible && <>
<mesh  position={[-1*sX+ manPosition*sX, -7.2*sY, 0]} name="cameraMan">
        <planeGeometry args={[1.6*sX, 1.3*sY]} />
        <meshBasicMaterial map={manhandInvertedTexture} transparent />
</mesh>
<mesh  position={[-1.8*sX  + manPosition*sX, -6.8*sY, 0]} name="cameraMan">
        <planeGeometry args={[0.5*sX, 0.35*sY]} />
        <meshBasicMaterial map={cameraTexture} transparent />
</mesh>
<mesh  position={[ manPosition*sX, -7.7*sY, 0]}  name="cameraMan"
onPointerOver={handlePointerChangeOver} onPointerOut={handlePointerChangeOut}>
        <planeGeometry args={[1.5*sX, 2.5*sY]} />
        <meshBasicMaterial map={manInvertedTexture} transparent />
</mesh>

<mesh  position={[ manPosition*sX + 2.2*sX, -7.7*sY, 0]} onClick={handleMan2Click}
onPointerOver={handlePointerChangeOver} onPointerOut={handlePointerChangeOut}>
        <planeGeometry args={[3*sX, 1.5*sY]} />
        <meshBasicMaterial map={clickImageTexture} transparent />
</mesh>

<Line points={[[-5.6*sX + manPosition*sX , -7.4*sY, 4], [ -0.6*sX+ manPosition*sX, -7.4*sY, 4]]} color="gray" lineWidth={3} />
<Line points={[ [endPoint2.x*sX, endPoint2.y*sY, endPoint2.z ], [-0.6*sX + manPosition*sX, -7.4*sY, 4]]} color="gray" lineWidth={3} />
<primitive object={arcl} />


<mesh position={[-4.4*sX + manPosition*sX , -6.8*sY, 5]}>
        <planeGeometry args={[1.3*sX, 0.8*sY]} />
        <meshBasicMaterial color="white" />
</mesh>
<Text color="black" fontSize={0.5} fontWeight={700} position={[-4.4*sX + manPosition*sX ,-6.8*sY, 5]}>
    {angleLeft}°
</Text>

<mesh  position={[endPoint2.x*sX, endPoint2.y*sY, endPoint2.z]}  name='Man2AngleSetter'
onPointerOver={handlePointerChangeOver} onPointerOut={handlePointerChangeOut}>
        <planeGeometry args={[3*sX,3*sY]} />
        <meshBasicMaterial map={angleSetterTexture} transparent />
</mesh>
</>}
{isBuilding1Shown &&  <>
<group>
<mesh  position={[16*sX, -5*sY + buildingPosition*sY, 0]} name="Building1"
onPointerOver={handlePointerChangeOver} onPointerOut={handlePointerChangeOut}>
        <planeGeometry args={[8*sX, 24*sY]} />
        <meshBasicMaterial map={buildingTexture} transparent />
</mesh>
</group>
<group>
<arrowHelper  args={[new THREE.Vector3(-1, 0, 0), new THREE.Vector3(-0.8*sX + 2*sX + manPosition*sX, -8.5*sY, 2), 0.5*sX, 0xFF0808, 0.5, 0.5]} />
<arrowHelper args={[new THREE.Vector3(1, 0, 0), new THREE.Vector3(-0.8*sX+ 2*sX + manPosition*sX, -8.5*sY, 2), 10.5*sX- manPosition*sX, 0xFF0808, 0.5, 0.5]} />
</group>
<group>
<arrowHelper  args={[new THREE.Vector3(0, -1, 0), new THREE.Vector3(11.5*sX, -7.5*sY, 2), 0.5*sY, 0x5708FF, 0.5, 0.5]} />
<arrowHelper  args={[new THREE.Vector3(0, 1, 0), new THREE.Vector3(11.5*sX, -7.5*sY, 2), 12.5*sY + buildingPosition*sY, 0x5708FF, 0.5, 0.5]} />
</group>

<mesh  position={[10.5*sX, -1.5*sY + (buildingPosition/2)*sY, 0]} rotation={[0,0,Math.PI/2]} >
        <planeGeometry args={[2.66*sY, 1.2*sX]} />
        <meshBasicMaterial map={bordedBoxTexture} transparent />
</mesh>
<mesh  position={[6.5*sX + (manPosition/2)*sX, -9.3*sY, 0]} >
        <planeGeometry args={[2.66*sX, 1.2*sY]} />
        <meshBasicMaterial map={redBoxTexture} transparent />
</mesh>
<Text color="white" fontSize={0.5 *sX} fontWeight={700} position={[6.5*sX + (manPosition/2)*sX ,-9.3*sY, 2]} >
    {(11 - manPosition).toFixed(2)}m</Text>
<Text color="white" fontSize={0.5*sY} fontWeight={700} position={[10.5*sX,-1.5*sY + (buildingPosition/2)*sY, 2]} rotation={[0, 0, Math.PI/2]}>
    {(13+buildingPosition ).toFixed(2)}m</Text>




{isman1visible &&<>
<Line points={[[7*sX, 5.5*sY + buildingPosition*sY, 3], [12*sX, 5.5*sY + buildingPosition*sY, 0]]} color="gray" lineWidth={4} />
<Line points={[[b2EndPoint.x*sX, b2EndPoint.y*sY, b2EndPoint.z], [12*sX, 5.5*sY + buildingPosition*sY, 0]]} color="gray" lineWidth={4} />

<mesh position={[8*sX, 4.8*sY + buildingPosition*sY, 2]}>
        <planeGeometry args={[1.3*sX, 0.8*sY]} />
        <meshBasicMaterial color="white" />
</mesh>
<mesh  position={[b2EndPoint.x*sX, b2EndPoint.y*sY, b2EndPoint.z]} name="Boy1AngleSetter">
        <planeGeometry args={[3*sX,3*sY]} />
        <meshBasicMaterial map={angleSetterTexture} transparent />
</mesh>
<primitive object={arc2} />
<Text color="black" fontSize={0.5} fontWeight={700} position={[ 8*sX,4.8*sY + buildingPosition*sY, 4]}>
    {boy1Angle}°
</Text>
</>}

</>}

{ (isBuilding1Shown || isBuilding2Shown) && <>
<mesh  position={[0*sX, 5.5*sY, 0]}>
        <planeGeometry args={[6*sX, 4.5*sY]} />
        <meshBasicMaterial map={mainCameraTexture} transparent />
</mesh>
{(isBoyCapturing && !isImageClicked) && <><mesh  position={[-1.15*sX, 4.9*sY, 3]}>
        <planeGeometry args={[3.1*sX, 2.6*sY]} />
        <meshBasicMaterial map={CameraManImageTexture} transparent />
</mesh></>}
{(isImageClicked && !isBoyCapturing) && <>
<mesh  position={[-1.15*sX, 4.9*sY, 3]}>
        <planeGeometry args={[3.1*sX, 2.6*sY]} />
        <meshBasicMaterial map={cameraClickedTexture} transparent />
</mesh>

<mesh  position={[-5.8*sX,positionY*sY ,3]} onClick={handleshowexplanationclick} 
onPointerOver={handlePointerChangeOver} onPointerOut={handlePointerChangeOut}>
        <planeGeometry args={[6*sX, 2.5*sX]} />
        <meshBasicMaterial map={showExplanationTexture} transparent />
</mesh>
</>}
</>}

{isBuilding2Shown && <>
 <group>
<mesh  position={[- 18.5*sX, -5*sY + building2Position*sY, 0]} name="Building2"
onPointerOver={handlePointerChangeOver} onPointerOut={handlePointerChangeOut}>
        <planeGeometry args={[7*sX, 25*sY]} />
        <meshBasicMaterial map={buildingleftTexture} transparent />
</mesh>
</group>

<group>
<arrowHelper  args={[new THREE.Vector3(-1, 0, 0), new THREE.Vector3(-14.5*sX, -8.5*sY, 2), 0.5*sX, 0xFF0808, 0.5, 0.5]} />
<arrowHelper args={[new THREE.Vector3(1, 0, 0), new THREE.Vector3(-14.5*sX, -8.5*sY, 2), 14*sX + manPosition*sX , 0xFF0808, 0.5, 0.5]} />
</group>

<group>
<arrowHelper  args={[new THREE.Vector3(0, -1, 0), new THREE.Vector3(-14.5*sX, -7.8*sY, 2), 0.5*sY, 0x5708FF, 0.5, 0.5]} />
<arrowHelper  args={[new THREE.Vector3(0, 1, 0), new THREE.Vector3(-14.5*sX, -7.8*sY, 2), 13.5*sY+ building2Position*sY, 0x5708FF, 0.5, 0.5]} />
</group>

<mesh 
 position={[-7.5*sX + (manPosition/2)*sX, -9.3*sY, 0]} >
        <planeGeometry args={[2.66*sX, 1.2*sY]} />
        <meshBasicMaterial map={redBoxTexture} transparent />
</mesh>
<Text  color="white" fontSize={0.5*sX} fontWeight={800} position={[-7.5*sX + (manPosition/2)*sX,-9.3*sY, 2]} >
    {(14.5 + manPosition).toFixed(2)}m
</Text>

<mesh  position={[-13.5*sX, -2.5*sY + (building2Position/2)*sY, 0]} rotation={[0,0,Math.PI/2]} >
        <planeGeometry args={[2.66*sY, 1.2*sY]} />
        <meshBasicMaterial map={bordedBoxTexture} transparent />
</mesh>
<Text color="white" fontSize={0.5*sY} fontWeight={700} position={[-13.5*sX,-2.5*sY+ (building2Position/2)*sY, 2]} rotation={[0, 0, Math.PI/2]}>
    {(14 + building2Position).toFixed(2)}m
</Text>

{isman2Visible && <>
<Line points={[[-9.5*sX, 6*sY + building2Position*sY, 3], [-14.5*sX, 6*sY + building2Position*sY, 0]]} color="gray" lineWidth={4} />
<Line points={[[b1EndPoint.x*sX, b1EndPoint.y*sY, b1EndPoint.z], [-14.5*sX, 6*sY + building2Position*sY, 0]]} color="gray" lineWidth={4} />
<mesh position={[-11*sX, 5.4*sY + building2Position*sY, 2]}>
        <planeGeometry args={[1.3*sX, 0.8*sY]} />
        <meshBasicMaterial color="white" />
</mesh>
<primitive object={arc3} />
<Text color="black" fontSize={0.5*sX} fontWeight={700} position={[ -11*sX,5.4*sY + building2Position*sY, 4]}>
    {boy2Angle}°
</Text>
<mesh  position={[b1EndPoint.x*sX, b1EndPoint.y*sY, b1EndPoint.z]} name="Boy2AngleSetter">
        <planeGeometry args={[3*sX,3*sY]} />
        <meshBasicMaterial map={angleSetterTexture} transparent />
</mesh>
</>}

</>}
</group>
</>
}

const BuildingModel= ({onDrop,handleDataTransfer,isDataTransfer,savedData,  isBuilding1Shown, isBuilding2Shown, handleExplainationClick, zoomValue, isPan, isResetted }: buildingprops) => {
    return (
        <div onDrop={onDrop} onDragOver={(e) => e.preventDefault()}>
      <Canvas style={{ width: '100vw', height: '100vh', zIndex: 9,}} >
        <OrthographicCamera makeDefault position={[0, 0, 10]} zoom={zoomValue} />
        <BuildingScene isBuilding1Shown={isBuilding1Shown} isBuilding2Shown={isBuilding2Shown}
        handleExplainationClick={handleExplainationClick} isResetted ={isResetted } zoom={zoomValue}
        handleDataTransfer={handleDataTransfer} isDataTransfer={isDataTransfer} savedData={savedData}/>
        <OrbitControls enableRotate={false} enableZoom={false} enablePan={isPan} />
      </Canvas>
      </div>
    );
  };
  
  export default BuildingModel;