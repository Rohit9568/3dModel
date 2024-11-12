import React, { useEffect, useRef, useState } from 'react';
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber';
import { OrthographicCamera, Line, Text } from '@react-three/drei';
import * as THREE from 'three';
import { TextureLoader, ArrowHelper } from 'three';
import { OrbitControls } from '@react-three/drei';
import { useMediaQuery } from '@mantine/hooks';

const CannonImg ="https://vignam-content-images.s3.ap-south-1.amazonaws.com/2024-07-19T08-39-00-838Z.png";
const cannonBallImg = "https://vignam-content-images.s3.ap-south-1.amazonaws.com/2024-07-19T08-39-26-224Z.png";
interface ModelProps {
  launchAngle: number;
  launchVelocity: number;
  gravity: number;
  CannonAnimation: boolean;
  resetPosition: boolean;
  showResultant: boolean;
  showValues: boolean;
  isPan?: boolean;
  zoomValue: number;
}

const calculateTrajectory = (launchAngle: number, launchVelocity: number, gravity: number, scaleX: number, scaleY: number, sX: number, sY: number, zoomValue: number): Array<[number, number, number]> => {
  const points: Array<[number, number, number]> = [];
  const radianAngle = (launchAngle * Math.PI) / 180;
  const vX = launchVelocity * Math.cos(radianAngle);
  const vY = launchVelocity * Math.sin(radianAngle);

  for (let t = 0; t <= 2 * vY / gravity; t += 0.1) {
    const x = vX * t;
    const y = vY * t - 0.5 * gravity * t * t;
    points.push([(-sX + 1+ x*scaleX), (-sY+ 1 + y*scaleY), 0]);
  }
  return points;
};

const CannonScene = ({ launchAngle, launchVelocity, gravity, showResultant, CannonAnimation, resetPosition, showValues, zoomValue }: ModelProps) => {
  const cannonRef = useRef<THREE.Mesh | null>(null);
  const cannonBallRef = useRef<THREE.Mesh | null>(null);
  const CannonTexture = useLoader(TextureLoader, CannonImg);
  const CannonBallTexture = useLoader(TextureLoader, cannonBallImg);
  const [launchAngleDegree, setLaunchAngleDegree] = useState<number>(45);
  const { size } = useThree();
  const scaleX = size.width / 500;
  const scaleY = size.height / 500;
  const sX = size.width*(1/zoomValue)/2 
  const sY = size.height*(1/zoomValue)/2
  const clockRef = useRef<THREE.Clock>(new THREE.Clock(false));
  const [pausedTime, setPausedTime] = useState(0);
  const [trajectoryPoints, setTrajectoryPoints] = useState<Array<[number, number, number]>>([]);
  const [resultantVector, setResultantVector] = useState(new THREE.Vector3());
  const gravityArrowHelperRef = useRef<THREE.ArrowHelper | null>(null);
  const velocityArrowHelperRef = useRef<THREE.ArrowHelper | null>(null);
  const resultantArrowHelperRef = useRef<THREE.ArrowHelper | null>(null);

  useEffect(()=>{
    resultantArrowHelperRef.current?.position.set(-sX + 1, -sY+ 1, 0);
    gravityArrowHelperRef.current?.position.set(-sX + 1, -sY+ 1, 0);
    velocityArrowHelperRef.current?.position.set(-sX + 1, -sY+ 1, 0);
  },[zoomValue])

  useEffect(() => {
    const radianAngle = (launchAngleDegree * Math.PI) / 180;
    const vX = launchVelocity * Math.cos(radianAngle);
    const vY = launchVelocity * Math.sin(radianAngle);
    const cannonvelocity = new THREE.Vector3(vX, vY, 0);
        setResultantVector(cannonvelocity);
  }, [launchAngleDegree, launchVelocity, gravity, zoomValue]);
  
  useEffect(() => {
    if (launchAngle === 0) {
      setLaunchAngleDegree(0);
    } else if (launchAngle === 1) {
      setLaunchAngleDegree(30);
    } else if (launchAngle === 2) {
      setLaunchAngleDegree(45);
    } else if (launchAngle === 3) {
      setLaunchAngleDegree(60);
    } else if (launchAngle === 4) {
      setLaunchAngleDegree(90);
    }
  }, [launchAngle]);

  useEffect(() => {
    const points = calculateTrajectory(launchAngleDegree, launchVelocity, gravity, scaleX, scaleY, sX ,sY, zoomValue);
    setTrajectoryPoints(points);
  }, [launchAngleDegree, launchVelocity, gravity, scaleX, scaleY, zoomValue]);

  useEffect(() => {
    if (CannonAnimation) {
      clockRef.current.start();
    } else {
      clockRef.current.stop();
      setPausedTime(pausedTime +  clockRef.current.getElapsedTime());
    }
  }, [CannonAnimation, zoomValue]);

  useEffect(() => {
    if (resetPosition) {
      if (cannonBallRef.current) {
        cannonBallRef.current.position.set(-sX + 1, -sY+ 1 , 0); 
      }
      if (gravityArrowHelperRef.current) {
        gravityArrowHelperRef.current.position.set(-sX + 1, -sY+ 1 , 0);
      }
      if (velocityArrowHelperRef.current) {
        velocityArrowHelperRef.current.position.set(-sX + 1, -sY+ 1 , 0);
      }
      if (resultantArrowHelperRef.current) {
        resultantArrowHelperRef.current.position.set(-sX + 1, -sY+ 1 , 0);
        const radianAngle = (launchAngleDegree * Math.PI) / 180;
        const vX = launchVelocity * Math.cos(radianAngle);
        const vY = launchVelocity * Math.sin(radianAngle);
        const cannonvelocity = new THREE.Vector3(vX, vY, 0);
            setResultantVector(cannonvelocity);
      }

      clockRef.current.stop();
      clockRef.current.elapsedTime = 0;
      setPausedTime(0);
    }
  }, [resetPosition, scaleX, scaleY]);

  useFrame(() => {
    if (CannonAnimation && cannonBallRef.current) {
      const t = clockRef.current.getElapsedTime() + pausedTime;
      const radianAngle = (launchAngleDegree * Math.PI) / 180;
      const vX = launchVelocity * Math.cos(radianAngle);
      const vY = launchVelocity * Math.sin(radianAngle);

      const x = vX * t;
      const y = vY * t - 0.5 * gravity * t * t;
      const rY = vY - gravity*t;
      const resultantDirection = new THREE.Vector3(vX, rY, 0);
      

      cannonBallRef.current.position.set((-sX+ 1  + x*scaleX), (-sY+ 1 + y*scaleY) , 0);

      if (gravityArrowHelperRef.current) {
        gravityArrowHelperRef.current.position.copy(cannonBallRef.current.position);
      }
      if (velocityArrowHelperRef.current) {
        velocityArrowHelperRef.current.position.copy(cannonBallRef.current.position);
      }
      if (resultantArrowHelperRef.current) {
        resultantArrowHelperRef.current.position.copy(cannonBallRef.current.position);
        setResultantVector(resultantDirection);
      }

      if (y <= 0) {
        clockRef.current.stop();
      }
    }
  });

  return (
    <>
      <ambientLight intensity={0.5} />
      <mesh ref={cannonBallRef} position={[-sX + 1, -sY + 1, 0]}>
        <sphereGeometry args={[0.6, 32, 32]} />
        <meshBasicMaterial map={CannonBallTexture} />
      </mesh>
      <mesh ref={cannonRef} position={[-sX + 1, -sY + 1, 1]} rotation={[0, 0, (launchAngleDegree -45)* Math.PI / 180]}>
        <planeGeometry args={[5, 5]} />
        <meshBasicMaterial map={CannonTexture} transparent />
      </mesh>
      <Line points={[[-sX +1, -sY+ 1, 2], [sX - 1, -sY + 1, 2]]} color="white" lineWidth={2} />
      <Line points={[[-sX+1, -sY+1, 2], [-sX + 1, sY -1, 2]]} color="white" lineWidth={2} />
      <arrowHelper args={[new THREE.Vector3(0, 1, 0), new THREE.Vector3(-sX +1, sY-1, 0), 1, 0xffffff, 1, 1]} />
      <arrowHelper  args={[new THREE.Vector3(1, 0, 0), new THREE.Vector3(sX-1, -sY + 1, 0), 1, 0xffffff, 1, 1]} />
      {trajectoryPoints.length > 0 && (
        <Line points={trajectoryPoints} color="white" lineWidth={1} />
      )}
        <arrowHelper ref={gravityArrowHelperRef} args={[new THREE.Vector3(Math.cos(launchAngleDegree * Math.PI / 180), Math.sin(launchAngleDegree * Math.PI / 180), 0),gravityArrowHelperRef.current?.position, launchVelocity/2 , 0xFF08E6, 0.5, 0.5]} />
        <arrowHelper ref={velocityArrowHelperRef} args={[new THREE.Vector3(0, -gravity, 0), velocityArrowHelperRef.current?.position , gravity/2 , 0xFAFF08, 0.5, 0.5]} />
        {showResultant && <arrowHelper ref={resultantArrowHelperRef} args={[resultantVector.clone().normalize(),resultantArrowHelperRef.current?.position, resultantVector.length()/2,  0xFF0808, 0.5 , 0.5]} />}
        <Text
  position={[
    (gravityArrowHelperRef.current?.position.x ?? 0) + launchVelocity/2 -5, 
    (gravityArrowHelperRef.current?.position.y ?? 0) + launchVelocity/2 -2, 
    gravityArrowHelperRef.current?.position.z ?? 0
  ]}
  color="#FF08E6"
  fontSize={0.9}
>
  V
</Text>
<Text
  position={[
    (gravityArrowHelperRef.current?.position.x ?? 0) + launchVelocity/2 -4.5, 
    (gravityArrowHelperRef.current?.position.y ?? 0) + launchVelocity/2 -2.2, 
    gravityArrowHelperRef.current?.position.z ?? 0
  ]}
  color="#FF08E6"
  fontSize={0.7}
>
  b
</Text>
{showValues && 
<Text
  position={[
    (gravityArrowHelperRef.current?.position.x ?? 0) + launchVelocity/2 -3, 
    (gravityArrowHelperRef.current?.position.y ?? 0) + launchVelocity/2 -2.1, 
    gravityArrowHelperRef.current?.position.z ?? 0
  ]}
  color="#FF08E6"
  fontSize={0.8}
>
  = {launchVelocity}
</Text>}

<Text
  position={[
    (velocityArrowHelperRef.current?.position.x ?? 0) , 
    (velocityArrowHelperRef.current?.position.y ?? 0) - gravity/2 - 0.5, 
    velocityArrowHelperRef.current?.position.z ?? 0
  ]}
  color="#FAFF08"
  fontSize={0.9}
>
  gravity
</Text>
{showValues && 
<Text
  position={[
    (velocityArrowHelperRef.current?.position.x ?? 0) + 2.4 , 
    (velocityArrowHelperRef.current?.position.y ?? 0) - gravity/2 - 0.5, 
    velocityArrowHelperRef.current?.position.z ?? 0
  ]}
  color="#FAFF08"
  fontSize={0.8}
>
  = {gravity}
</Text>}

{showResultant && <>
<Text
  position={[
    (resultantArrowHelperRef.current?.position.x ?? 0) + resultantVector.x / 2 ,
    (resultantArrowHelperRef.current?.position.y ?? 0) + resultantVector.y / 2 - 1,
    (resultantArrowHelperRef.current?.position.z ?? 0)
  ]}
  color="#FF0808"
  fontSize={0.9}
>
  V
</Text>
<Text
  position={[
    (resultantArrowHelperRef.current?.position.x ?? 0) + resultantVector.x / 2 + 0.4 ,
    (resultantArrowHelperRef.current?.position.y ?? 0) + resultantVector.y / 2 - 1.1,
    (resultantArrowHelperRef.current?.position.z ?? 0)
  ]}
  color="#FF0808"
  fontSize={0.7}
>
  r
</Text>
{showValues && 
<Text
  position={[
    (resultantArrowHelperRef.current?.position.x ?? 0) + resultantVector.x / 2 + 1.6 ,
    (resultantArrowHelperRef.current?.position.y ?? 0) + resultantVector.y / 2 - 1,
    (resultantArrowHelperRef.current?.position.z ?? 0)
  ]}
  color="#FF0808"
  fontSize={0.8}
>
  ={resultantVector.length().toFixed(1)}
</Text>}
</>}
    </>
  );
};

const CannonSimulation = ({zoomValue, isPan,launchAngle, launchVelocity, gravity, showValues, showResultant, CannonAnimation, resetPosition }: ModelProps) => {
  const isSmallScreen = useMediaQuery("(max-width: 768px)");
  const ismediumScreen = useMediaQuery("(max-width: 1024px)");
  return (
    <Canvas style={{  width: isSmallScreen? '75vw': ismediumScreen ? "57vw" : '70vw', height:isSmallScreen?  '40vh':  ismediumScreen ? "65vh" : '72vh', background: '#84DBFFCC' }}>
      <OrthographicCamera makeDefault position={[0, 0, 10]} zoom={zoomValue - 2} />
      <CannonScene launchAngle={launchAngle} launchVelocity={launchVelocity} gravity={gravity} showValues={showValues} showResultant={showResultant}
        CannonAnimation={CannonAnimation} resetPosition={resetPosition} zoomValue={zoomValue} />
      <OrbitControls enableRotate={false} enableZoom={false} enablePan={isPan} />
    </Canvas>
  );
};

export default CannonSimulation;
