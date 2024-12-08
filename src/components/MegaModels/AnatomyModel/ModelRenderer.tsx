import React, { useEffect, useRef, useState } from 'react';
import { useAnimations, useGLTF } from '@react-three/drei';
import { GroupProps, ThreeEvent } from '@react-three/fiber';
import * as THREE from 'three';

interface ModelProps extends GroupProps {
  annotationValue?: boolean;
  modelPath: string;
  detailModel: boolean;
  isPlaying?: boolean;
  onAnnotationClick: (name: string) => void;
  onPartClick?: (name: string)=> void;
  onModelClick?: (model: any) => void; 
  onAnimation?: ()=> void;
}

interface GLTFResult {
  nodes: { [key: string]: THREE.Mesh };
  materials: { [key: string]: THREE.Material };
  scene: THREE.Group;
  animations: THREE.AnimationClip[];
}

export function DynamicModel({ annotationValue, detailModel, modelPath,isPlaying, onAnimation, onAnnotationClick,onModelClick,onPartClick, ...props }: ModelProps) {
  const { nodes, materials, scene, animations } = useGLTF(modelPath) as unknown as GLTFResult;
  const groupRef = useRef<THREE.Group>(null);
  const { actions } = useAnimations(animations, groupRef);
  const [highlightedParent, setHighlightedParent] = useState<THREE.Mesh | null>(null);
  const [pausedTime, setPausedTime] = useState(0);

  useEffect(() => {
    if (animations && animations.length > 0) {
      onAnimation && onAnimation();
      animations.forEach((clip) => {
        const action = actions[clip.name];
        if (action) {
          action.setLoop(THREE.LoopOnce, 1);
          action.clampWhenFinished = true;
        }
      });
    } else {
      console.log("No animations found.");
    }
  }, [animations]);


useEffect(() => {
  if (isPlaying) {
    Object.values(actions).forEach((action) => {
      if (action) {
        action.paused = false;
        action.play();
        action.time = pausedTime;
      }
    });
  } else if (!isPlaying) {
    Object.values(actions).forEach((action) => {
      if (action) {
        setPausedTime(action.time);
        action.paused = true;
      }
    });
  }
}, [isPlaying, actions, pausedTime]);

  useEffect(() => {
    if (groupRef.current) {
      const group = groupRef.current;
      group.traverse((obj) => {
        if (obj instanceof THREE.Mesh) {
          if (Object.values(nodes).some(node => node.geometry === obj.geometry && (node.name.includes('model') || node.name.includes('polySurface ')))) {
            obj.userData.isPolySurface = true;
            obj.traverse(child => {
              if (child instanceof THREE.Mesh) {
                child.userData.isChildOfPolySurface = true;
              }
            });
          } else {
            obj.userData.isPolySurface = false;
          }

          if (Object.values(nodes).some(node => node.geometry === obj.geometry && (node.name.includes('Annotation') || node.name.includes('annotation')))) {
            obj.userData.isAnnotation = true;
            obj.traverse(child => {
              if (child instanceof THREE.Mesh && child.children.length == 0) {
                child.userData.isChildOfAnnotation = true;
              }
            });
          } else {
            obj.userData.isAnnotation = false;
          }
        }
      });
    }
  }, [nodes]);

  useEffect(() => {
    if (groupRef.current) {
      const group = groupRef.current;
      group.traverse((obj) => {
        if (obj instanceof THREE.Mesh) {
          if (annotationValue && Object.values(nodes).some(node => node.geometry === obj.geometry && (node.name.includes('Annotation') || node.name.includes('annotation')))) {
            obj.visible = false;
          } else {
            obj.visible = true;
          }
        }
      });
    }
  }, [annotationValue]);

  const highlightMesh = (mesh: THREE.Mesh) => {
    if (mesh.material instanceof THREE.MeshStandardMaterial ) {
      if(mesh.userData.isChildOfAnnotation){
        const a = mesh.material.clone()
        a.emissive = new THREE.Color(0xfaee02);
        a.emissiveIntensity = 0.2;
        mesh.material = a;
      }else if( !mesh.userData.isChildOfAnnotation && !mesh.userData.isChildOfPolySurface) {
        const a = mesh.material.clone()
        a.emissive = new THREE.Color(0xfaee02);
        a.emissiveIntensity = 0.3;
        mesh.material = a;
      }else{
        mesh.material.emissive = new THREE.Color(0xfaee02);
        mesh.material.emissiveIntensity = 0.2;
      }
      }
  };

  const unhighlightMesh = (mesh: THREE.Mesh) => {
    if (mesh.material instanceof THREE.MeshStandardMaterial) {
      mesh.material.emissive = new THREE.Color(0x000000);
      mesh.material.emissiveIntensity = 0;
    }
  };

  const handlePointerOver = (event: ThreeEvent<PointerEvent>) => {
    const mesh = event.object as THREE.Mesh;
    if (mesh.userData.isChildOfAnnotation && detailModel) {
      const parent = mesh.parent;
      if (parent instanceof THREE.Mesh && parent.userData.isAnnotation) {
        setHighlightedParent(parent);
        parent.traverse((child) => {
          if (child instanceof THREE.Mesh && child.children.length == 0) {
            highlightMesh(child);
          }
          });
      }
    } else if (mesh.userData.isChildOfPolySurface ) {
      const parent = mesh.parent;
      if ( parent instanceof THREE.Mesh && !detailModel){
        setHighlightedParent(parent);
        parent.traverse((child)=>{
          if (child instanceof THREE.Mesh) {
            highlightMesh(child);
          }
        })
      }else{
        setHighlightedParent(mesh);
        highlightMesh(mesh);
      }
    }else{
      setHighlightedParent(mesh);
      highlightMesh(mesh);
    }
  };

  const handlePointerOut = (event: ThreeEvent<PointerEvent>) => {
    if (highlightedParent) {
      highlightedParent.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          unhighlightMesh(child);
        }
      });
      setHighlightedParent(null);
    }
  };

  const handlePointerClick = (event: ThreeEvent<PointerEvent>)=>{
    const mesh = event.object as THREE.Mesh;
    const parent = mesh.parent;
    var clickedPart : any;
    if(parent instanceof THREE.Mesh && mesh instanceof THREE.Mesh){
        Object.values(nodes).some(node => {
          if(node.geometry === parent.geometry && (node.name.includes('Annotation') || node.name.includes('annotation'))){
            const cleanedName = node.name.replace(/annotation/i, '');
            var remainingName = cleanedName.trim();
            onAnnotationClick(remainingName);
          }else{
            if(node.geometry === mesh.geometry){
              clickedPart = node.name;
            onPartClick && onPartClick(clickedPart);
            }
          }
        })
    }else{
      if(mesh instanceof THREE.Mesh){
        Object.values(nodes).some(node => {
          if(node.geometry === mesh.geometry){
            onPartClick && onPartClick(node.name);
          }
        })
      }
    }
        onModelClick && onModelClick(props);
  }


  return (
    <primitive
      ref={groupRef}
      object={scene}
      {...props}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      onClick={handlePointerClick}
    />
  );
}

export function ModelRenderer({ modelPath,onModelClick, ...props }: ModelProps) {
  return <DynamicModel modelPath={modelPath} onModelClick={onModelClick} {...props} />;
}
