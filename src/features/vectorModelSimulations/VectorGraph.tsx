import React, { useEffect, useRef, useState } from 'react';
import { Canvas, useThree, ThreeEvent } from '@react-three/fiber';
import { OrthographicCamera, Line, Text, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { useMediaQuery } from '@mantine/hooks';

interface VectorGraphProps {
    vector1: boolean;
    vector2: boolean;
    isVector1Selected: boolean;
    isVector2Selected: boolean;
    selectedVectorLength: number;
    selectedVectorAngle: number;
    vector2Length :number;
    vector2Angle: number;
    showResultant: boolean;
    showValues: boolean;
    isPan?: boolean;
    zoomValue: number;
    onDrop: (event: React.DragEvent<HTMLDivElement>) => void;
}

interface GraphSceneProps {
    vector1: boolean;
    vector2: boolean;
    isVector1Selected: boolean;
    isVector2Selected: boolean;
    selectedVectorLength: number;
    selectedVectorAngle: number;
    vector2Length :number;
    vector2Angle: number;
    showResultant: boolean;
    showValues: boolean;
    zoomValue: number;
}

const angleToDegreeMap: { [key: string]: number }  = {
    '-4': 180, '-3': 150, '-2': 135, '-1': 120,
    '0': 90, '1': 60, '2': 45, '3': 30, '4': 0 };

const GraphScene = ({ zoomValue,
    isVector1Selected, isVector2Selected, selectedVectorAngle, selectedVectorLength, showResultant, showValues, vector2Angle, vector2Length}: GraphSceneProps) => {
        const { size } = useThree();
        const scaleX = size.width / 500;
        const scaleY = size.height / 500;
        const sX = size.width*(1/zoomValue)/2 
        const sY = size.height*(1/zoomValue)/2
        const color = 0xFFF8E0;
    const [selectedVectorAngleDegree, setSelectedVectorAngleDegree] = useState<number>(0);
    const [vector2AngleDegree, setVector2AngleDegree] = useState<number>(0);
    const [vector1Tip, setVector1Tip] = useState(new THREE.Vector3());
    const [vector2Tip, setVector2Tip] = useState(new THREE.Vector3());
    const [resultantTip, setResultantTip] = useState(new THREE.Vector3());

    const [vector1Params, setVector1Params] = useState({
        origin: new THREE.Vector3(0 * scaleX, 0 * scaleY, 0),
        direction: new THREE.Vector3(1, 0, 0),
        length: 5/2
    });

    const [vector2Params, setVector2Params] = useState({
        origin: new THREE.Vector3(0* scaleX, 0 * scaleY, 0),
        direction: new THREE.Vector3(0, 1, 0),
        length: 5/2
    });
    const resultantDirection = new THREE.Vector3().subVectors(
        vector2Params.origin.clone().add(vector2Params.direction.clone().multiplyScalar(vector2Params.length)),
        vector1Params.origin
    ).normalize();

    const resultantLength = new THREE.Vector3().subVectors(
        vector2Params.origin.clone().add(vector2Params.direction.clone().multiplyScalar(vector2Params.length)),
        vector1Params.origin
    ).length();

const setSelectedVectorAngleDegreeFunction = (angle: number) => {
        const degree = angleToDegreeMap[angle.toString()];
        if (degree !== undefined) {
            setSelectedVectorAngleDegree(degree);
        }
    };

const setVector2AngleDegreeFunction = (angle: number) => {
        const degree = angleToDegreeMap[angle.toString()];
        if (degree !== undefined) {
            setVector2AngleDegree(degree);
        }
    };

    useEffect(() => {
        setSelectedVectorAngleDegreeFunction(selectedVectorAngle);
    }, [selectedVectorAngle, selectedVectorLength]);
    
    useEffect(() => {
        setVector2AngleDegreeFunction(vector2Angle);
    }, [vector2Angle, vector2Length]);

    useEffect(() => {
        const vector1Endpoint = new THREE.Vector3().copy(vector1Params.origin)
            .add(vector1Params.direction.clone().normalize().multiplyScalar(vector1Params.length));
        setVector2Params((prevParams) => ({
            ...prevParams,
            origin: vector1Endpoint
        }));
    }, [vector1Params.origin, vector1Params.direction, vector1Params.length]);
    
    useEffect(() => {
        const vector2Endpoint = new THREE.Vector3().copy(vector2Params.origin)
            .add(vector2Params.direction.clone().normalize().multiplyScalar(vector2Params.length));
        setVector2Tip(vector2Endpoint);
    
    }, [vector2Params.origin, vector2Params.direction, vector2Params.length]);
    
    useEffect(() => {
        const resultantTipPosition = new THREE.Vector3().copy(vector1Params.origin)
            .add(resultantDirection.clone().multiplyScalar(resultantLength));
        setResultantTip(resultantTipPosition);
    }, [vector1Params.origin, resultantDirection, resultantLength]);

    const calculateDirection = (angleDegree: number) => {
        const angleRadian = (angleDegree * Math.PI) / 180;
        return new THREE.Vector3(Math.cos(angleRadian), Math.sin(angleRadian), 0);
    };

    useEffect(() => {
        const vector1Endpoint = new THREE.Vector3().copy(vector1Params.origin)
            .add(vector1Params.direction.clone().normalize().multiplyScalar(vector1Params.length));
        setVector1Tip(vector1Endpoint);
    
        setVector2Params((prevParams) => ({
            ...prevParams,
            origin: vector1Endpoint
        }));
    }, [vector1Params.origin, vector1Params.direction, vector1Params.length]);
    
    useEffect(() => {
            setVector1Params(prevParams => ({
                ...prevParams,
                direction: calculateDirection(selectedVectorAngleDegree),
                length: selectedVectorLength/2
            }));
    }, [isVector1Selected, selectedVectorAngle, selectedVectorLength, selectedVectorAngleDegree]);

    useEffect(() => {
            setVector2Params(prevParams => ({
                ...prevParams,
                direction: calculateDirection(vector2AngleDegree),
                length: vector2Length/2
            }));
    }, [isVector2Selected, vector2Angle, vector2Length, vector2AngleDegree]);

    return (
        <>
            <ambientLight intensity={1.5} />
            <Line points={[[0, 0, 2], [sX, 0, 2]]} color="white" lineWidth={2} />
      <Line points={[[0, 0, 2], [0, sY, 2]]} color="white" lineWidth={2} />
      <Line points={[[0, 0, 2], [-sX, 0, 2]]} color="white" lineWidth={2} />
      <Line points={[[0, 0, 2], [0, -sY, 2]]} color="white" lineWidth={2} />
      <arrowHelper args={[new THREE.Vector3(0, 1, 0), new THREE.Vector3(0,sY - 0.5, 0), 0.75, 0xffffff, 0.75, 0.75]} />
      <arrowHelper  args={[new THREE.Vector3(1, 0, 0), new THREE.Vector3(sX, 0, 0), 0.75, 0xffffff, 0.75, 0.75]} />
      <arrowHelper args={[new THREE.Vector3(0, -1, 0), new THREE.Vector3(0,-sY+0.5, 0), 0.75, 0xffffff, 0.75, 0.75]} />
      <arrowHelper  args={[new THREE.Vector3(-1, 0, 0), new THREE.Vector3(-sX, 0, 0), 0.75, 0xffffff, 0.75, 0.75]} />

            { (
                <>
                    <arrowHelper args={[vector1Params.direction, vector1Params.origin, vector1Params.length, 0xFF0808, 1, 1]} />

<Text position={[vector1Tip.x + 0.7, vector1Tip.y -0.7, vector1Tip.z]} color="#FF0808" fontSize={1} > V </Text>
<Text position={[vector1Tip.x + 1, vector1Tip.y -1, vector1Tip.z]} color="#FF0808" fontSize={0.7}>   1 </Text>
{showValues && <><Text position={[vector1Tip.x + 2.8, vector1Tip.y -0.7, vector1Tip.z]} color="#FF0808" fontSize={0.9} >
    = {(vector1Params.length*2).toFixed(1)} </Text></>}
</> )}
            {(
                <>
                <arrowHelper
                    args={[vector2Params.direction, vector2Params.origin, vector2Params.length, 0x08FF08, 1, 1]}
                />
                {showResultant && <> 
                <arrowHelper
                    args={[resultantDirection, vector1Params.origin, resultantLength, 0x0000FF, 1, 1]}
                />
                <Text position={[resultantTip.x -1.7, resultantTip.y + 0.5, resultantTip.z]} color="#0000FF" fontSize={1.1}> V </Text>
<Text position={[resultantTip.x -1.1, resultantTip.y + 0.2, resultantTip.z]} color="#0000FF" fontSize={0.7} >  R</Text>
{showValues && <Text position={[resultantTip.x + 0.6, resultantTip.y + 0.4, resultantTip.z]} color="#0000FF" fontSize={0.9} >
    = {(resultantLength*2).toFixed(1)} </Text>}</>}

<Text position={[vector2Tip.x +1, vector2Tip.y -0.7, vector2Tip.z]} color="#08FF08" fontSize={1} >  V </Text>
<Text position={[vector2Tip.x +1.6, vector2Tip.y -1, vector2Tip.z]} color="#08FF08" fontSize={0.7} > 2 </Text>
{showValues && <Text position={[vector2Tip.x +3.1, vector2Tip.y -0.7, vector2Tip.z]}  color="#08FF08" fontSize={0.9} >
    = {(vector2Params.length*2).toFixed(1)} </Text>}
            </>
            )}
        </>
    );
};

const VectorGraph: React.FC<VectorGraphProps> = ({zoomValue,isPan, vector1, vector2, onDrop,
    isVector1Selected, isVector2Selected, selectedVectorAngle, selectedVectorLength,vector2Angle, vector2Length, showResultant, showValues}) => {
    const isSmallScreen = useMediaQuery("(max-width: 768px)");
  const ismediumScreen = useMediaQuery("(max-width: 1024px)");

    return (
        <div
            onDrop={onDrop}
            onDragOver={(e) => e.preventDefault()}
            style={{ width: isSmallScreen? '75vw': ismediumScreen ? "57vw" : '70vw', height:isSmallScreen?  '40vh':  ismediumScreen ? "65vh" : '72vh',}}
        >
            <Canvas style={{ background: '#D9D9D966' }}>
                <OrthographicCamera makeDefault position={[0, 0, 10]} zoom={zoomValue-2} />
                <GraphScene vector1={vector1} vector2={vector2} zoomValue={zoomValue}
                isVector1Selected={isVector1Selected} isVector2Selected={isVector2Selected} selectedVectorAngle={selectedVectorAngle}
                selectedVectorLength={selectedVectorLength} showResultant={showResultant} showValues={showValues}
                vector2Angle={vector2Angle} vector2Length={vector2Length} />
                <OrbitControls enableRotate={false} enableZoom={false}  enablePan={isPan} />
            </Canvas>
        </div>
    );
};

export default VectorGraph;