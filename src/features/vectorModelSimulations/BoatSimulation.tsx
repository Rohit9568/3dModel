import React, { useEffect, useRef, useState } from 'react';
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber';
import { OrthographicCamera, Line, Text } from '@react-three/drei';
import * as THREE from 'three';
import { TextureLoader } from 'three';
import { OrbitControls } from '@react-three/drei';
import { Box, Button } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
const BoatImg = "https://vignam-content-images.s3.ap-south-1.amazonaws.com/2024-07-19T08-33-34-297Z.png";
const RiverFlowImg ="https://vignam-content-images.s3.ap-south-1.amazonaws.com/2024-07-19T08-34-04-097Z.png";
const boatShoreImg ="https://vignam-content-images.s3.ap-south-1.amazonaws.com/2024-07-19T08-34-40-932Z.png"

interface ModelProps {
  velocityStream: number;
  directionBoat: number;
  magnitudeBoat: number;
  showResultant: boolean;
  boatAnimation?: boolean;
  resetPosition: boolean;
  showValues: boolean;
  isPan?: boolean;
  zoomValue: number;
}

const BoatScene = ({ velocityStream,showValues,  directionBoat, magnitudeBoat, showResultant, boatAnimation, resetPosition, zoomValue}: ModelProps) => {
  const boatRef = useRef<THREE.Mesh | null>(null);
  const [boatVelocity, setBoatVelocity] = useState(new THREE.Vector3(0, 4, 0)); 
  const [riverVelocity, setRiverVelocity] = useState(new THREE.Vector3(2, 0, 0));
  const [resultantVelocity, setResultantVelocity] = useState(new THREE.Vector3())
  const [boatdirectionangle, setBoatDirectionangle] = useState<number>(90);
  const boatTexture = useLoader(TextureLoader, BoatImg);
  const riverTexture = useLoader(TextureLoader, RiverFlowImg);
  const riverShoreTexture = useLoader(TextureLoader, boatShoreImg);

  const { size } = useThree();
  const scaleX = size.width / 500;
  const scaleY = size.height / 500;
  const sX = size.width*(1/zoomValue)/2 
  const sY = size.height*(1/zoomValue)/2
  const initialBoatPosition = new THREE.Vector3(0 * scaleX, -sY + 1, 0);
  const [boatPosition, setBoatPosition] = useState(initialBoatPosition);
  const riverRefs = useRef<(THREE.Mesh | null)[]>([]);
  const [riverPositions] = useState(() => {
    const positions = [];
    const rows = 25; 
    const cols = 25;
    const spacing = 2;
    const offsetRange = 0.5; 

    for (let i = -25; i < rows; i++) {
      for (let j = -25; j < cols; j++) {
        const xOffset = (Math.random() * 2 - 1) * offsetRange;
        const yOffset = (Math.random() * 2 - 1) * (offsetRange / 2);
        positions.push(new THREE.Vector3(i * spacing + xOffset, j * spacing + yOffset, 0));
      }
    }

    return positions;
  });

  useEffect(() => {
    const newResultantVelocity = new THREE.Vector3();
    newResultantVelocity.addVectors(boatVelocity, riverVelocity);
    setResultantVelocity(newResultantVelocity);
  }, [boatVelocity, riverVelocity]);

  useEffect(()=>{
    setRiverVelocity(new THREE.Vector3((velocityStream), 0, 0));
  }, [velocityStream])

  useEffect(()=>{
    if(directionBoat == 0){
      setBoatDirectionangle(0);
    }else if(directionBoat == 1){
      setBoatDirectionangle(30)
    }else if(directionBoat == 2){
      setBoatDirectionangle(45)
    }else if(directionBoat == 3){
      setBoatDirectionangle(60)
    }else if(directionBoat == 4){
      setBoatDirectionangle(90)
    }else if(directionBoat == 5){
      setBoatDirectionangle(120)
    }else if(directionBoat == 6){
      setBoatDirectionangle(135)
    }else if(directionBoat == 7){
      setBoatDirectionangle(150)
    }else if(directionBoat == 8){
      setBoatDirectionangle(180)
    }
  },[directionBoat])


  useEffect(() => {
    const boatdirectionangleRadians = boatdirectionangle * Math.PI / 180;
    const boatx = magnitudeBoat * Math.cos(boatdirectionangleRadians);
    const boaty = magnitudeBoat * Math.sin(boatdirectionangleRadians);
    setBoatVelocity(new THREE.Vector3(boatx, boaty, 0));
  }, [magnitudeBoat, boatdirectionangle]);
  
  useEffect(() => {
    if (resetPosition && boatRef.current) {
      setBoatPosition(initialBoatPosition.clone());
      boatRef.current.position.copy(initialBoatPosition);
      boatRef.current.rotation.set(0, 0, 0);
    }
  }, [resetPosition, initialBoatPosition]);

useFrame(() => {
  if (boatAnimation) {
    if (boatRef.current) {
      const delta = resultantVelocity.clone().multiplyScalar(0.02);
      const newPosition = boatPosition.clone().add(delta);
      if (newPosition.y < 9 * scaleY && newPosition.y>=-sY + 0.9 && newPosition.x < 9.5*scaleX && newPosition.x >= -9.5*scaleX) {
        setBoatPosition(newPosition);
        boatRef.current.position.copy(newPosition);
        const angle = Math.atan2(resultantVelocity.y, resultantVelocity.x);
          boatRef.current.rotation.z = (angle-(Math.PI/2));
      }
    }
  }

    riverRefs.current.forEach((mesh) => {
      if (mesh) {
        const speed = 0.02 * velocityStream;
        mesh.position.x += speed;
        if (mesh.position.x > 50 && speed >= 0) {
          mesh.position.x = -50;
        }else if(mesh.position.x <-50 && speed < 0){
          mesh.position.x = 50
        }
      }
    });
  });
  return (
    <>
      <ambientLight intensity={0.5} />
      {riverPositions.map((position, index) => (
        <mesh key={index} position={position} ref={(ref) => (riverRefs.current[index] = ref)}>
          <planeGeometry args={[1, 0.15]} />
          <meshBasicMaterial map={riverTexture} transparent />
        </mesh>
      ))}

<mesh ref={boatRef} position={[0*scaleX, 9*scaleY + 1*scaleY, -2]} rotation={[0,0, Math.PI]}>
        <planeGeometry args={[80, 5]} />
        <meshBasicMaterial map={riverShoreTexture} transparent />
      </mesh>

      <mesh ref={boatRef} position={boatPosition}>
        <planeGeometry args={[1, 2]} />
        <meshBasicMaterial map={boatTexture} transparent />
      </mesh>

      <Line points={[[-sX +1, -sY+ 1, 2], [sX - 1, -sY + 1, 2]]} color="white" lineWidth={2} />
      <Line points={[[-sX+1, -sY+1, 2], [-sX + 1, sY -1, 2]]} color="white" lineWidth={2} />
      <arrowHelper args={[new THREE.Vector3(0, 1, 0), new THREE.Vector3(-sX +1, sY-1, 0), 1, 0xffffff, 1, 1]} />
      <arrowHelper  args={[new THREE.Vector3(1, 0, 0), new THREE.Vector3(sX-1, -sY + 1, 0), 1, 0xffffff, 1, 1]} />
      {!boatAnimation && <>
      <arrowHelper args={[boatVelocity.clone().normalize(), new THREE.Vector3(boatPosition.x, boatPosition.y, 0), boatVelocity.length(), 0xFF08E6, 0.5,0.6]} />
      <arrowHelper args={[riverVelocity.clone().normalize(), new THREE.Vector3((boatPosition.x+boatVelocity.x), (boatPosition.y+boatVelocity.y), 0), riverVelocity.length(), 0xFAFF08, 0.5,0.6]} />
    {showResultant &&  <arrowHelper args={[resultantVelocity.clone().normalize(), new THREE.Vector3(boatPosition.x, boatPosition.y, 0), resultantVelocity.length(), 0xFF0808, 0.5,0.6]} />}
    <Text
        position={[boatPosition.x -1 + boatVelocity.x, boatPosition.y -1 + boatVelocity.y, 0]}
        color="#FF08E6"
        fontSize={0.85}
      >
        V
      </Text>
      <Text
        position={[boatPosition.x -0.1 + boatVelocity.x, boatPosition.y-1.2 + boatVelocity.y, 0]}
        color="#FF08E6"
        fontSize={0.6}
      >
        boat
      </Text>
      {showValues &&
      <Text
        position={[boatPosition.x +1.4 + boatVelocity.x,boatPosition.y-1.1 + boatVelocity.y, 0]}
        color="#FF08E6"
        fontSize={0.7}
      >
        = {boatVelocity.length().toFixed(1)}
      </Text>}
      <Text
        position={[boatPosition.x + boatVelocity.x + riverVelocity.x,boatPosition.y+1+boatVelocity.y + riverVelocity.y, 0]}
        color="#FAFF08"
        fontSize={0.85}
      >
        V
      </Text>
      <Text
        position={[boatPosition.x + 1.3+ boatVelocity.x + riverVelocity.x, boatPosition.y+0.8+boatVelocity.y + riverVelocity.y, 0]}
        color="#FAFF08"
        fontSize={0.6}
      >
        stream
      </Text>
      {showValues && 
      <Text
        position={[boatPosition.x+ 3.2+ boatVelocity.x + riverVelocity.x,boatPosition.y +0.9+boatVelocity.y + riverVelocity.y, 0]}
        color="#FAFF08"
        fontSize={0.7}
      >
        = {riverVelocity.length().toFixed(1)}
      </Text>}
      {showResultant && <>
      <Text
        position={[boatPosition.x+1.2 + resultantVelocity.x, boatPosition.y -1 + resultantVelocity.y, 0]}
        color="#FF0808"
        fontSize={0.8}
      >
        V
      </Text>
      <Text
        position={[boatPosition.x+2.7 + resultantVelocity.x,boatPosition.y -1.2 + resultantVelocity.y, 0]}
        color="#FF0808"
        fontSize={0.6}
      >
        resultant
      </Text>
      {showValues && 
      <Text
        position={[boatPosition.x+5 + resultantVelocity.x,boatPosition.y-1.1 + resultantVelocity.y, 0]}
        color="#FF0808"
        fontSize={0.7}
      >
        = {resultantVelocity.length().toFixed(2)}
      </Text>}</>}
      </>
    }
    </>
  );
};

const BoatSimulation= ({zoomValue,isPan,showValues, velocityStream, magnitudeBoat, directionBoat, showResultant, boatAnimation, resetPosition}: ModelProps) => {
  const isSmallScreen = useMediaQuery("(max-width: 768px)");
  const ismediumScreen = useMediaQuery("(max-width: 1024px)");
  return (
    <Canvas style={{ width: isSmallScreen? '75vw': ismediumScreen ? "60vw" : '70vw', height:isSmallScreen?  '40vh':  ismediumScreen ? "65vh" : '72vh', background: '#089BD7CC'}}>
      <OrthographicCamera makeDefault position={[0, 0, 10]} zoom={zoomValue} />
      <BoatScene showValues={showValues} velocityStream={velocityStream} magnitudeBoat={magnitudeBoat} directionBoat={directionBoat} showResultant={showResultant} 
      boatAnimation={boatAnimation} resetPosition={resetPosition} zoomValue={zoomValue}/>
      <OrbitControls enableRotate={false} enableZoom={false} enablePan={isPan} />
    </Canvas>
  );
};

export default BoatSimulation;
