import React, { useEffect, useRef, useState } from 'react';
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber';
import { OrthographicCamera, Line, Text } from '@react-three/drei';
import * as THREE from 'three';
import { TextureLoader } from 'three';
import { OrbitControls } from '@react-three/drei';
import { Box, Button } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
const AeroplaneImg = "https://vignam-content-images.s3.ap-south-1.amazonaws.com/2024-07-19T08-44-06-393Z.png";
const AirFlowImg ="https://vignam-content-images.s3.ap-south-1.amazonaws.com/2024-07-19T08-44-28-867Z.png";

interface ModelProps {
  velocityAir: number;
  directionAeroplane: number;
  magnitudeAeroplane: number;
  showResultant: boolean;
  AeroplaneAnimation?: boolean;
  resetPosition: boolean;
  directionAir: number;
  showValues: boolean;
  isPan?: boolean;
  zoomValue: number;
}

const AeroplaneScene = ({ velocityAir, directionAeroplane, magnitudeAeroplane,zoomValue, showResultant, AeroplaneAnimation, resetPosition, directionAir, showValues}: ModelProps) => {
  const aeroplaneRef = useRef<THREE.Mesh | null>(null);
  const [aeroplaneVelocity, setAeroplaneVelocity] = useState(new THREE.Vector3(0, 4, 0)); 
  const [airVelocity, setAirVelocity] = useState(new THREE.Vector3(2, 0, 0));
  const [resultantVelocity, setResultantVelocity] = useState(new THREE.Vector3())
  const [aeroplanedirectionangle, setAeroplaneDirection] = useState<number>(90);
  const [airdirectionangle, setairDirection] = useState<number>(90);
  const aeroplaneTexture = useLoader(TextureLoader, AeroplaneImg);
  const airTexture = useLoader(TextureLoader, AirFlowImg);
  const { size } = useThree();
  const scaleX = size.width / 500;
  const scaleY = size.height / 500;
  const sX = size.width*(1/zoomValue)/2 
  const sY = size.height*(1/zoomValue)/2
  const initialAeroplanePosition = new THREE.Vector3(0 * scaleX, -sY + 1, 0);
  const [aeroplanePosition, setAeroplanePosition] = useState(initialAeroplanePosition.clone());

  const airRefs = useRef<(THREE.Mesh | null)[]>([]);
  const [airPositions] = useState(() => {
    const positions = [];
    const rows = 10; 
    const cols = 10;
    const spacing = 2;
    const offsetRange = 0.5; 

    for (let i = -10; i < rows; i++) {
      for (let j = -10; j < cols; j++) {
        const xOffset = (Math.random() * 2 - 1) * offsetRange;
        const yOffset = (Math.random() * 2 - 1) * (offsetRange);
        positions.push(new THREE.Vector3(i * spacing + xOffset, j * spacing + yOffset, 0));
      }
    }

    return positions;
  });

  useEffect(() => {
    const newResultantVelocity = new THREE.Vector3();
    newResultantVelocity.addVectors(aeroplaneVelocity, airVelocity);
    setResultantVelocity(newResultantVelocity);
  }, [aeroplaneVelocity, airVelocity]);

  useEffect(()=>{
    const airdirectionRadians = airdirectionangle * Math.PI/180;
    const x = velocityAir * Math.cos(airdirectionRadians);
    const y = velocityAir * Math.sin(airdirectionRadians);
    setAirVelocity(new THREE.Vector3(-x, y, 0));
  }, [airdirectionangle, velocityAir])

  useEffect(() => {
    const boatdirectionangleRadians = aeroplanedirectionangle * Math.PI / 180;
    const boatx = magnitudeAeroplane * Math.cos(boatdirectionangleRadians);
    const boaty = magnitudeAeroplane * Math.sin(boatdirectionangleRadians);
    setAeroplaneVelocity(new THREE.Vector3(boatx, boaty, 0));
  }, [magnitudeAeroplane, aeroplanedirectionangle]);

  useEffect(()=>{
    if(directionAeroplane == 0){
      setAeroplaneDirection(0);
    }else if(directionAeroplane == 1){
      setAeroplaneDirection(30)
    }else if(directionAeroplane == 2){
      setAeroplaneDirection(45)
    }else if(directionAeroplane == 3){
      setAeroplaneDirection(60)
    }else if(directionAeroplane == 4){
      setAeroplaneDirection(90)
    }else if(directionAeroplane == 5){
      setAeroplaneDirection(120)
    }else if(directionAeroplane == 6){
      setAeroplaneDirection(135)
    }else if(directionAeroplane == 7){
      setAeroplaneDirection(150)
    }else if(directionAeroplane == 8){
      setAeroplaneDirection(180)
    }
  },[directionAeroplane])

  useEffect(()=>{
    if(directionAir == 0){
      setairDirection(0);
    }else if(directionAir == 1){
      setairDirection(30)
    }else if(directionAir == 2){
      setairDirection(45)
    }else if(directionAir == 3){
      setairDirection(60)
    }else if(directionAir == 4){
      setairDirection(90)
    }else if(directionAir == 5){
      setairDirection(120)
    }else if(directionAir == 6){
      setairDirection(135)
    }else if(directionAir == 7){
      setairDirection(150)
    }else if(directionAir == 8){
      setairDirection(180)
    }
  },[directionAir])


  useEffect(() => {
    const boatdirectionangleRadians = aeroplanedirectionangle * Math.PI / 180;
    const boatx = magnitudeAeroplane * Math.cos(boatdirectionangleRadians);
    const boaty = magnitudeAeroplane * Math.sin(boatdirectionangleRadians);
    setAeroplaneVelocity(new THREE.Vector3(boatx, boaty, 0));
  }, [magnitudeAeroplane, aeroplanedirectionangle]);
  
  useEffect(() => {
    if (resetPosition && aeroplaneRef.current) {
      setAeroplanePosition(initialAeroplanePosition.clone());
      aeroplaneRef.current.position.copy(initialAeroplanePosition);
      aeroplaneRef.current.rotation.set(0, 0, (Math.PI/4));
    }
  }, [resetPosition, initialAeroplanePosition]);

  useFrame(() => {
    if (AeroplaneAnimation) {
      if (aeroplaneRef.current) {
        const delta = resultantVelocity.clone().multiplyScalar(0.008);
        const newPosition = aeroplanePosition.clone().add(delta);
        if (newPosition.y < 9 * scaleY && newPosition.y > -sY + 0.9 && newPosition.x < 9.5 * scaleX && newPosition.x >= -9.5 * scaleX) {
          setAeroplanePosition(newPosition);
          aeroplaneRef.current.position.copy(newPosition);
          const angle = Math.atan2(resultantVelocity.y, resultantVelocity.x);
          aeroplaneRef.current.rotation.z = (angle - (Math.PI / 4));
        }
      }
    }
  
    airRefs.current.forEach((mesh) => {
      if (mesh) {
        const speed = 0.01 * velocityAir;
        const delta = airVelocity.clone().multiplyScalar(speed);
        mesh.position.add(delta);
        if (mesh.position.y > 19.5) {
          mesh.position.y = -19.5;
        } else if (mesh.position.y < -19.5 ) {
          mesh.position.y = 19.5;
        }else if(mesh.position.x < -20){
            mesh.position.x = 20
        }else if(mesh.position.x> 20){
            mesh.position.x = -20
        }
      }
    });
  });
  
  return (
    <>
      <ambientLight intensity={0.5} />
      {airPositions.map((position, index) => (
  <mesh key={index} position={position} ref={(ref) => (airRefs.current[index] = ref)} rotation={[0, 0, Math.atan2(airVelocity.y, airVelocity.x)]}>
    <planeGeometry args={[1.7, 0.2]} />
    <meshBasicMaterial map={airTexture} transparent />
  </mesh>
))}
      <mesh ref={aeroplaneRef} position={aeroplanePosition} rotation={[0,0,(Math.PI/4)]}>
        <planeGeometry args={[5, 5]} />
        <meshBasicMaterial map={aeroplaneTexture} transparent />
      </mesh>
      <Line points={[[-sX +1, -sY+ 1, 2], [sX - 1, -sY + 1, 2]]} color="white" lineWidth={2} />
      <Line points={[[-sX+1, -sY+1, 2], [-sX + 1, sY -1, 2]]} color="white" lineWidth={2} />
      <arrowHelper args={[new THREE.Vector3(0, 1, 0), new THREE.Vector3(-sX +1, sY-1, 0), 1, 0xffffff, 1, 1]} />
      <arrowHelper  args={[new THREE.Vector3(1, 0, 0), new THREE.Vector3(sX-1, -sY + 1, 0), 1, 0xffffff, 1, 1]} />
      {!AeroplaneAnimation && <>
      <arrowHelper args={[aeroplaneVelocity.clone().normalize(), new THREE.Vector3(aeroplanePosition.x, aeroplanePosition.y, 0), aeroplaneVelocity.length(), 0xFF08E6, 0.5,0.6]} />
      <arrowHelper args={[airVelocity.clone().normalize(), new THREE.Vector3((aeroplanePosition.x+aeroplaneVelocity.x), (aeroplanePosition.y+aeroplaneVelocity.y), 0), airVelocity.length(), 0xFAFF08, 0.5,0.6]} />
    {showResultant &&  <arrowHelper args={[resultantVelocity.clone().normalize(), new THREE.Vector3(aeroplanePosition.x, aeroplanePosition.y, 0), resultantVelocity.length(), 0xFF0808, 0.5,0.6]} />}
    <Text
        position={[aeroplanePosition.x -1 + aeroplaneVelocity.x,  aeroplanePosition.y -0.9 + aeroplaneVelocity.y, 0]}
        color="#FF08E6"
        fontSize={0.9}
      >
        V 
      </Text>
      <Text
              position={[aeroplanePosition.x+0.2 + aeroplaneVelocity.x + 0.5, aeroplanePosition.y - 1 + aeroplaneVelocity.y, 0]}
              color="#FF08E6" fontSize={0.60}>
         aeroplane
      </Text>
      {showValues &&
      <Text
              position={[aeroplanePosition.x +2.8  + aeroplaneVelocity.x + 0.5,aeroplanePosition.y- 0.9 + aeroplaneVelocity.y, 0]}
              color="#FF08E6" fontSize={0.7}>
         = {aeroplaneVelocity.length().toFixed(1)}
      </Text>}
      
      <Text
        position={[aeroplanePosition.x+ aeroplaneVelocity.x + airVelocity.x,aeroplanePosition.y+1.1+aeroplaneVelocity.y + airVelocity.y, 0]}
        color="#FAFF08"
        fontSize={0.9}
      >
        V 
      </Text>
      <Text
        position={[aeroplanePosition.x+ 1 + aeroplaneVelocity.x + airVelocity.x, aeroplanePosition.y +1+aeroplaneVelocity.y + airVelocity.y, 0]}
        color="#FAFF08"
        fontSize={0.6}
      >
        wind
      </Text>
      {showValues &&
      <Text
        position={[aeroplanePosition.x + 2.6 + aeroplaneVelocity.x + airVelocity.x, aeroplanePosition.y +1.1+aeroplaneVelocity.y + airVelocity.y, 0]}
        color="#FAFF08"
        fontSize={0.7}
      >
         = {airVelocity.length().toFixed(1)}
      </Text>}

      {showResultant && <>
      <Text
        position={[aeroplanePosition.x+1.2 + resultantVelocity.x, aeroplanePosition.y -0.9 + resultantVelocity.y, 0]}
        color="#FF0808"
        fontSize={0.9}
      >
        V 
      </Text>
      <Text
        position={[aeroplanePosition.x+2.8 + resultantVelocity.x, aeroplanePosition.y -1 + resultantVelocity.y, 0]}
        color="#FF0808"
        fontSize={0.6}
      >
        resultant
      </Text>
      {showValues && <Text
              position={[aeroplanePosition.x+5.5 + resultantVelocity.x,aeroplanePosition.y-0.9 + resultantVelocity.y, 0]}
              color="#FF0808"
              fontSize={0.7}>
            = {resultantVelocity.length().toFixed(2)}
        </Text>}
      </>}
      </>
    }
    </>
  );
};

const AeroplaneSimulation= ({zoomValue, isPan, velocityAir,showValues, magnitudeAeroplane, directionAeroplane,directionAir, showResultant, AeroplaneAnimation, resetPosition}: ModelProps) => {
  const isSmallScreen = useMediaQuery("(max-width: 768px)");
  const ismediumScreen = useMediaQuery("(max-width: 1024px)");
  return (
    <Canvas style={{  width: isSmallScreen? '75vw': ismediumScreen ? "55vw" : '65vw', height:isSmallScreen?  '40vh':  ismediumScreen ? "65vh" : '70vh', background: '#84DBFFCC' }}>
      <OrthographicCamera makeDefault position={[0, 0, 10]} zoom={zoomValue} />
      <AeroplaneScene showValues={showValues} velocityAir={velocityAir} magnitudeAeroplane={magnitudeAeroplane} directionAeroplane={directionAeroplane} showResultant={showResultant} 
      AeroplaneAnimation={AeroplaneAnimation} resetPosition={resetPosition} directionAir={directionAir} zoomValue={zoomValue}/>
      <OrbitControls enableRotate={false} enableZoom={false} enablePan={isPan} />
    </Canvas>
  );
};

export default AeroplaneSimulation;
