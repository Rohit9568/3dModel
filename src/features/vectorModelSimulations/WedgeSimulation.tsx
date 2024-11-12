import React, { useEffect, useRef, useState } from 'react';
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber';
import { OrthographicCamera, Line, Text } from '@react-three/drei';
import * as THREE from 'three';
import { TextureLoader, ArrowHelper } from 'three';
import { OrbitControls } from '@react-three/drei';
import { useMediaQuery, useSetState } from '@mantine/hooks';
const WedgeImg = "https://vignam-content-images.s3.ap-south-1.amazonaws.com/2024-07-19T08-42-41-992Z.png";
const WoodenBoxImg = "https://vignam-content-images.s3.ap-south-1.amazonaws.com/2024-07-19T08-43-08-033Z.png";

interface ModelProps {
  frictionCoefficient: number;
  wedgeAngle: number;
  boxWeight: number;
  gravity: number;
  WedgeAnimation: boolean;
  resetPosition: boolean;
  showResultant: boolean;
  showValues: boolean;
  isPan?: boolean;
  zoomValue: number;
  stopWedgeAnimation: ()=>void;
}


const WedgeScene = ({frictionCoefficient, wedgeAngle, boxWeight,zoomValue, stopWedgeAnimation, gravity, showResultant, WedgeAnimation, resetPosition, showValues }: ModelProps) => {
  const WedgeRef = useRef<THREE.Mesh | null>(null);
  const WoodenBoxRef = useRef<THREE.Mesh | null>(null);
  const WedgeTexture = useLoader(TextureLoader, WedgeImg);
  const WoodenBoxTexture = useLoader(TextureLoader, WoodenBoxImg);
  const [wedgeDiagonal, setWedgeDiagonal] = useState<number>(20);
  const [wedgeHeight, setWedgeHeight] = useState<number>(18);
  const [wedgeWidth,setWedgeWidth] = useState<number>(12);
  const [wedgeAngleDegree, setWedgeAngleDegree] = useState<number>(45);
  const [friction, setFriction] = useState<number>(20);
  const [frictionAngle, setFrictionAngle] = useState(new THREE.Vector3(0.2,0.3,0));
  const [weightForce, setWeightForce] = useState<number>(20);
  const [weightNormal, setWeightNormal] = useState<number>(20);
  const [weightForceAngle, setWeightForceAngle] = useState(new THREE.Vector3(-0.2,-0.3,0));
  const [weightNormalAngle, setWeightNormalAngle] = useState(new THREE.Vector3(-0.2,-0.3,0));
  const velocityRef = useRef(new THREE.Vector3(0, 0, 0));
  const { size } = useThree();
  const scaleX = size.width / 500;
  const scaleY = size.height / 500;
  const sX = size.width*(1/zoomValue)/2 
  const sY = size.height*(1/zoomValue)/2
  const [woodenPosition, setWoodenPosition] = useState(new THREE.Vector3(0*scaleX, 2.5*scaleY, 2));
  const [wedgePosition, setWedgePosition] = useState(new THREE.Vector3(0*scaleX, 0*scaleY, 0));

  useEffect(() => {
    if (wedgeAngle === 0) {
      setWedgeAngleDegree(0);
      setWedgePosition(new THREE.Vector3(0.9*scaleX/2.15, 0.9*scaleY/1.08, 0));
    } else if (wedgeAngle === 1) {
      setWedgeAngleDegree(15);
      setWedgePosition(new THREE.Vector3(0.75*scaleX/2.15, 0.75*scaleY/1.08, 0));
    } else if (wedgeAngle === 2) {
      setWedgeAngleDegree(30);
      setWedgePosition(new THREE.Vector3(0.5*scaleX/2.15, 0.5*scaleY/1.08, 0));
    } else if (wedgeAngle === 3) {
      setWedgeAngleDegree(45);
      setWedgePosition(new THREE.Vector3(0.2*scaleX/2.15, 0.2*scaleY/1.08, 0));
    }else if (wedgeAngle === 4) {
        setWedgeAngleDegree(60);
      setWedgePosition(new THREE.Vector3(-0.1*scaleX/2.15, -0.1*scaleY/1.08, 0));
      }
  }, [wedgeAngle,  zoomValue, scaleX, scaleY]);

  useEffect(()=>{
    const radianAngle = (wedgeAngleDegree * Math.PI) / 180;
    if(wedgeAngleDegree == 0){
        setWedgeHeight(1);
        setWedgeWidth(20);
    }else{
        const h = wedgeDiagonal * Math.sin(radianAngle);
        const w = wedgeDiagonal * Math.cos(radianAngle);
        setWedgeHeight(h);
        setWedgeWidth(w);
    }
  },[wedgeAngle,wedgeAngleDegree,  zoomValue, scaleX, scaleY])

  useEffect(()=>{
    const normalForce = boxWeight * gravity * Math.cos(wedgeAngleDegree* Math.PI/180)
    const weight = boxWeight * gravity * Math.sin(wedgeAngleDegree*Math.PI/180);
    const weightN =  boxWeight * gravity * Math.cos(wedgeAngleDegree*Math.PI/180);
    setFriction(normalForce*frictionCoefficient)
    setWeightForce(weight);
    setWeightNormal(weightN);
    const ax = Math.cos(Math.PI- wedgeAngleDegree*Math.PI/180);
    const ay = Math.sin(Math.PI-wedgeAngleDegree* Math.PI/180);
    const wx = Math.cos(-wedgeAngleDegree*Math.PI/180);
    const wy = Math.sin(-wedgeAngleDegree* Math.PI/180);
    const nx = Math.cos(Math.PI/2- wedgeAngleDegree*Math.PI/180);
    const ny = Math.sin(Math.PI/2-wedgeAngleDegree* Math.PI/180);
    setFrictionAngle(new THREE.Vector3(ax, ay, 0));
    setWeightForceAngle(new THREE.Vector3(wx, wy, 0));
    setWeightNormalAngle(new THREE.Vector3(-nx, -ny, 0));
  },[boxWeight, wedgeAngleDegree, gravity, frictionCoefficient, zoomValue, scaleX, scaleY])

useEffect(()=>{
    if(resetPosition){
        WoodenBoxRef.current?.position.set(0 * scaleX, 2.5 * scaleY, 0);
        velocityRef.current?.set(0,0,0);
        setWoodenPosition(new THREE.Vector3(0 * scaleX, 2.5 * scaleY, 2));
    }

},[resetPosition])

  useFrame(({ clock }) => {
    if (WedgeAnimation) {
      if (WoodenBoxRef.current) {
        const delta = clock.getDelta();
        const acceleration = (weightForce - friction) / boxWeight * gravity;
        if (acceleration > 0 && WoodenBoxRef.current.position.y >= -sY + 1) {
          const movementVector = weightForceAngle.clone().multiplyScalar(acceleration * delta);
          velocityRef.current.add(movementVector);
          WoodenBoxRef.current.position.add(velocityRef.current);
          setWoodenPosition(new THREE.Vector3(WoodenBoxRef.current.position.x,WoodenBoxRef.current.position.y, 2 ));
          
          if (WoodenBoxRef.current.position.y <= -sY + 1) {
            stopWedgeAnimation();
          }
        }
      }
    }
  });

  return (
    <>
      <ambientLight intensity={1} />
      <mesh ref={WedgeRef} position={wedgePosition}>
        <planeGeometry args={[wedgeWidth,wedgeHeight]} />
        <meshBasicMaterial map={WedgeTexture} transparent />
      </mesh>
      <mesh ref={WoodenBoxRef} position={[0 * scaleX, 2.5 * scaleY, 0]} rotation={[0,0,(0.9 *Math.PI/6 - wedgeAngleDegree*Math.PI/180)]}>
        <planeGeometry args={[5, 5]} />
        <meshBasicMaterial map={WoodenBoxTexture} transparent />
      </mesh>
      <Line points={[[-sX +1, -sY+ 1, 2], [sX - 1, -sY + 1, 2]]} color="white" lineWidth={2} />
      <Line points={[[-sX+1, -sY+1, 2], [-sX + 1, sY -1, 2]]} color="white" lineWidth={2} />
      <arrowHelper args={[new THREE.Vector3(0, 1, 0), new THREE.Vector3(-sX +1, sY-1, 0), 1, 0xffffff, 1, 1]} />
      <arrowHelper  args={[new THREE.Vector3(1, 0, 0), new THREE.Vector3(sX-1, -sY + 1, 0), 1, 0xffffff, 1, 1]} />
      <arrowHelper args={[
        frictionAngle.clone().normalize(), 
        woodenPosition, friction/5, 0xFF08E6, 0.5, 0.5]} />
        {showResultant && <>
          <arrowHelper args={[
        weightNormalAngle.clone().normalize(), 
        woodenPosition, weightNormal/5,  0xFF0808, 0.5, 0.5]} />
        <arrowHelper args={[
        weightForceAngle.clone().normalize(), 
        woodenPosition, weightForce/5,  0xFF0808, 0.5, 0.5]} /></>}
<Text
  position={[
    (woodenPosition.x) + frictionAngle.clone().normalize().x * friction / 5 - 1.3,
    (woodenPosition.y) + frictionAngle.clone().normalize().y * friction / 5 + 1,
    0
  ]}
  color="#FF08E6"
  fontSize={1}
>
  F
</Text>
<Text
  position={[
    (woodenPosition.x) + frictionAngle.clone().normalize().x * friction / 5 - 0.9,
    (woodenPosition.y) + frictionAngle.clone().normalize().y * friction / 5 + 0.7,
    0
  ]}
  color="#FF08E6"
  fontSize={0.7}
>
  f
</Text>
{showValues && 
<Text
  position={[
    (woodenPosition.x) + frictionAngle.clone().normalize().x * friction / 5 + 1,
    (woodenPosition.y) + frictionAngle.clone().normalize().y * friction / 5 + 0.9,
    0
  ]}
  color="#FF08E6"
  fontSize={0.8}
>
  = {friction.toFixed(2)}
</Text>}
{showResultant && <>
<Text
  position={[
    (woodenPosition.x) + weightForceAngle.clone().normalize().x *weightForce / 5 + 1.3,
    (woodenPosition.y) + weightForceAngle.clone().normalize().y * weightForce / 5 + 1,
    0
  ]}
  color="#FF0808"
  fontSize={1}
>
  F
</Text>
<Text
  position={[
    (woodenPosition.x) + weightForceAngle.clone().normalize().x *weightForce / 5 + 2.9,
    (woodenPosition.y) + weightForceAngle.clone().normalize().y * weightForce / 5 + 0.8,
    0
  ]}
  color="#FF0808"
  fontSize={0.7}
>
  mgcosθ
</Text>
{showValues && 
<Text
  position={[
    (woodenPosition.x) + weightForceAngle.clone().normalize().x *weightForce / 5 + 5.9,
    (woodenPosition.y) + weightForceAngle.clone().normalize().y * weightForce / 5 + 1,
    0
  ]}
  color="#FF0808"
  fontSize={0.8}
>
  = {weightForce.toFixed(2)}
</Text>}


<Text
  position={[
    (woodenPosition.x) + weightNormalAngle.clone().normalize().x *weightNormal/ 5 + 1,
    (woodenPosition.y) + weightNormalAngle.clone().normalize().y * weightNormal / 5 - 0.2,
    0
  ]}
  color="#FF0808"
  fontSize={1}
>
  F
</Text>
<Text
  position={[
    (woodenPosition.x) + weightNormalAngle.clone().normalize().x *weightNormal / 5 + 2.5,
    (woodenPosition.y) + weightNormalAngle.clone().normalize().y * weightNormal / 5 - 0.5,
    0
  ]}
  color="#FF0808"
  fontSize={0.7}
>
  mgsinθ
</Text>
{showValues && 
<Text
  position={[
    (woodenPosition.x) + weightNormalAngle.clone().normalize().x *weightNormal / 5 + 5.3,
    (woodenPosition.y) + weightNormalAngle.clone().normalize().y * weightNormal / 5 - 0.2,
    0
  ]}
  color="#FF0808"
  fontSize={0.8}
>
  = {weightNormal.toFixed(2)}
</Text>}
</>}
    </>
  );
};

const WedgeSimulation = ({zoomValue,isPan, frictionCoefficient, stopWedgeAnimation, wedgeAngle, boxWeight, gravity, showValues, showResultant, WedgeAnimation, resetPosition }: ModelProps) => {
  const isSmallScreen = useMediaQuery("(max-width: 768px)");
  const ismediumScreen = useMediaQuery("(max-width: 1024px)");

  return (
    <Canvas style={{  width: isSmallScreen? '75vw': ismediumScreen ? "58vw" : '70vw', height:isSmallScreen?  '40vh':  ismediumScreen ? "65vh" : '72vh', background: '#D9D9D966'}}>
      <OrthographicCamera makeDefault position={[0, 0, 10]} zoom={zoomValue - 2} />
      <WedgeScene frictionCoefficient={frictionCoefficient} wedgeAngle={wedgeAngle} boxWeight={boxWeight} gravity={gravity} showValues={showValues} showResultant={showResultant}
        WedgeAnimation={WedgeAnimation} resetPosition={resetPosition} zoomValue={zoomValue}
        stopWedgeAnimation={stopWedgeAnimation}/>
      <OrbitControls enableRotate={false} enableZoom={false} enablePan={isPan} />
    </Canvas>
  );
};

export default WedgeSimulation;
