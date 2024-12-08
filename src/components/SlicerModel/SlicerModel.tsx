import React, { useEffect, useRef, useState } from 'react';
import { useGLTF } from '@react-three/drei';
import { GroupProps, ThreeEvent, useThree } from '@react-three/fiber';
import * as THREE from 'three';

interface ModelProps extends GroupProps {
  modelPath: string;
  addingAnnotation: boolean;
  isSlicing: boolean;
  isResetted: boolean;
  savedMeshPositions: Map<number, THREE.Vector3>;
  zoomValue: number;
  changedMeshPositions: (meshesPosition: Map<number, THREE.Vector3>) => void;
  addAnnotation: (point: THREE.Vector3, normal: THREE.Vector3) => void;
}

interface GLTFResult {
  nodes: { [key: string]: THREE.Mesh };
  materials: { [key: string]: THREE.Material };
  scene: THREE.Group;
  animations: THREE.AnimationClip[];
}

export function DynamicModel({ modelPath, addingAnnotation, isSlicing, isResetted, savedMeshPositions,zoomValue, addAnnotation, changedMeshPositions, ...props }: ModelProps) {
  const { scene, nodes } = useGLTF(modelPath) as unknown as GLTFResult;
  const groupRef = useRef<THREE.Group>(null);
  const { camera, gl } = useThree();
  const [selectedMesh, setSelectedMesh] = useState<THREE.Mesh | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [initialPositions, setInitialPositions] = useState<Map<number, THREE.Vector3>>(new Map());
  const [newChangedMeshPositions, setNewChangedMeshPositions] = useState<Map<number, THREE.Vector3>>(new Map());
  const [hoveredMesh, setHoveredMesh] = useState<THREE.Mesh | null>(null);
  const [hoveredOutMesh, setHoveredOutMesh] = useState(null);
  const { size } = useThree();
  const scaleX = size.width;
  const scaleY = size.height;

  let meshIndex = 0;

  const traverseAndStoreInitialPositions = (object: THREE.Object3D) => {
    object.traverse(child => {
      if (child instanceof THREE.Mesh) {
        (child as any).meshIndex = meshIndex++;
        initialPositions.set((child as any).meshIndex, child.position.clone());
      }
    });
  };

  useEffect(() => {
    if (groupRef.current) {
      const group = groupRef.current;
      group.traverse((obj) => {
        if (obj instanceof THREE.Mesh) {
          if (Object.values(nodes).some(node => node.geometry === obj.geometry && (node.name.includes('Annotation') || node.name.includes('annotation') 
            || node.name.includes('key')|| node.name.includes('Key') || node.name.includes('Text') || node.name.includes('Plane') ))) {
            obj.visible = false;
          } else {
            obj.visible = true;
          }
        }
      });
    }
  }, []);

  useEffect(() => {
    if (groupRef.current) {
      traverseAndStoreInitialPositions(groupRef.current);
    }
    
    if(savedMeshPositions.size > 0){
      savedMeshPositions.forEach((position, meshIndex)=>{
        const mesh = groupRef.current?.getObjectByProperty('meshIndex', meshIndex) as THREE.Mesh;
        if(mesh){
          mesh.position.copy(position);
        }
      });
    }
  }, [scene]);

  useEffect(() => {
    if (isResetted && initialPositions.size > 0) {
      initialPositions.forEach((position, meshIndex) => {
        const mesh = groupRef.current?.getObjectByProperty('meshIndex', meshIndex) as THREE.Mesh;
        if(mesh){
          mesh.position.copy(position);
        }
      });
      setNewChangedMeshPositions(new Map(initialPositions));
      changedMeshPositions(new Map());
    }
  }, [isResetted, initialPositions]);

  const handleClick = (event: ThreeEvent<MouseEvent>) => {
    if (addingAnnotation && groupRef.current) {
      const ndc = new THREE.Vector2(
        (event.clientX / gl.domElement.clientWidth) * 2 - 1,
        -(event.clientY / gl.domElement.clientHeight) * 2 + 1
      );

      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(ndc, camera);
      const intersects = raycaster.intersectObject(groupRef.current, true);

      if (intersects.length > 0) {
        const intersection = intersects[0];
        const point = intersection.point.clone();
        const offsetZ = 0.1;
        point.z += offsetZ;
        if (intersection.face) {
          const normal = intersection.face.normal.clone();
          normal.transformDirection(intersection.object.matrixWorld);
          addAnnotation(point, normal);
        }
      }
    } else if (isSlicing) {
      const mesh = event.object as THREE.Mesh;
      if (mesh === selectedMesh) {
        setSelectedMesh(null);
        setIsDragging(false);
      } else {
        setSelectedMesh(mesh);
        setIsDragging(true);

        const mouse = new THREE.Vector2( (event.clientX / window.innerWidth) * 2 - 1, -(event.clientY / window.innerHeight) * 2 + 1);
        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouse, camera);
        const planeNormal = new THREE.Vector3();
        camera.getWorldDirection(planeNormal).negate();
        const plane = new THREE.Plane().setFromNormalAndCoplanarPoint(planeNormal, mesh.position);
        const intersectPoint = new THREE.Vector3();
        raycaster.ray.intersectPlane(plane, intersectPoint);
    
        if (intersectPoint) {
          if (mesh.parent) {
            const localIntersectPoint = intersectPoint.clone().applyMatrix4(mesh.parent.matrixWorld.clone().invert());
            const offset = new THREE.Vector3().subVectors(mesh.position, localIntersectPoint);
            mesh.userData.offset = offset;
          } else {
            const offset = new THREE.Vector3().subVectors(mesh.position, intersectPoint);
            mesh.userData.offset = offset;
          }
        }
      }
    }
  };

  const handleHover = (event: ThreeEvent<MouseEvent>)=>{
    if (isSlicing) {
      const mesh = event.object as THREE.Mesh;
      if(hoveredMesh !== mesh || hoveredMesh == null){
        unnhighlightMesh(hoveredMesh);
        highlightMesh(mesh);
        setHoveredMesh(mesh);
      }
    }
  }
  const handlehoverout = ()=>{
    unhighlightMesh();
    setHoveredMesh(null);
  }
  const unnhighlightMesh = (mesh: THREE.Mesh | null) => {
    if(mesh){
      if (mesh.material instanceof THREE.MeshStandardMaterial) {
        mesh.material.emissive = new THREE.Color(0x000000);
        mesh.material.emissiveIntensity = 0;
      }
    }
  };

  const highlightMesh = (mesh: THREE.Mesh) => {
    if (mesh.material instanceof THREE.MeshStandardMaterial) {
        const a = mesh.material.clone()
        a.name = "Material Highlight";
        a.emissive = new THREE.Color(0xfaee02);
        a.emissiveIntensity = 0.2;
        mesh.material = a;
      }
  };

  const unhighlightMesh = () => {
    const object = groupRef.current;
    if(object){
      object.traverse(child => {
        if (child instanceof THREE.Mesh) {
          if (child.material instanceof THREE.MeshStandardMaterial) {
            child.material.emissive = new THREE.Color(0x000000);
            child.material.emissiveIntensity = 0;
          }
        }
      });
    }
  };
  
  const handlePointerMove = (event: MouseEvent) => {
    if (selectedMesh && isSlicing && isDragging) {
      const mouse = new THREE.Vector2((event.clientX / window.innerWidth) * 2 - 1, -(event.clientY / window.innerHeight) * 2 + 1);
      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(mouse, camera);
      const planeNormal = new THREE.Vector3();
      camera.getWorldDirection(planeNormal).negate();
      const plane = new THREE.Plane().setFromNormalAndCoplanarPoint(planeNormal, selectedMesh.position);
      const intersectPoint = new THREE.Vector3();
      raycaster.ray.intersectPlane(plane, intersectPoint);
  
      if (intersectPoint) {
        const offset = selectedMesh.userData.offset || new THREE.Vector3();
        if (selectedMesh.parent) {
          const localIntersectPoint = intersectPoint.clone().applyMatrix4(selectedMesh.parent.matrixWorld.clone().invert());
          localIntersectPoint.add(offset);
          selectedMesh.position.copy(localIntersectPoint);
        } else {
          intersectPoint.add(offset);
          selectedMesh.position.copy(intersectPoint);
        }
        const newPositions = new Map(newChangedMeshPositions);
        newPositions.set((selectedMesh as any).meshIndex, selectedMesh.position.clone());
        changedMeshPositions(newPositions);
        setNewChangedMeshPositions(newPositions);
      }
    }
  };
  
  

  const handlePointerUp = () => {
    setIsDragging(false);
    setSelectedMesh(null);
    unhighlightMesh();
  };

  useEffect(() => {
    if (isSlicing) {
      window.addEventListener('mousemove', handlePointerMove);
      window.addEventListener('mouseup', handlePointerUp);
    } else {
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('mouseup', handlePointerUp);
    }

    return () => {
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('mouseup', handlePointerUp);
    };
  }, [isSlicing, selectedMesh, isDragging]);

  return (
    <primitive
      ref={groupRef}
      {...props}
      object={scene}
      onPointerDown={handleClick}
      onPointerOver={handleHover}
      onPointerOut={handlehoverout}
    />
  );
}

export function SlicerModel({ modelPath, addingAnnotation, isSlicing, isResetted, addAnnotation, ...props }: ModelProps) {
  return (
    <DynamicModel
      modelPath={modelPath}
      addingAnnotation={addingAnnotation}
      addAnnotation={addAnnotation}
      isSlicing={isSlicing}
      isResetted={isResetted}
      {...props}
    />
  );
}
