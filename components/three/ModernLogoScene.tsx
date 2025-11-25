"use client"

import { useRef } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { Float, Environment, MeshTransmissionMaterial, ContactShadows, Lightformer } from "@react-three/drei"
import { easing } from "maath"
import * as THREE from "three"

function AbstractLogo(props: React.ComponentProps<"group">) {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (!meshRef.current) return
    const t = state.clock.getElapsedTime()
    // subtle rotation
    meshRef.current.rotation.x = Math.cos(t / 4) / 8
    meshRef.current.rotation.y = Math.sin(t / 4) / 8
    meshRef.current.rotation.z = (1 + Math.sin(t / 1.5)) / 20
  })

  return (
    <group {...props}>
      <mesh ref={meshRef} scale={1.2}>
        {/* A complex geometry that catches light well */}
        <torusKnotGeometry args={[1, 0.3, 128, 32]} />
        <MeshTransmissionMaterial
          backside
          backsideThickness={5}
          thickness={2}
          roughness={0.2}
          transmission={1}
          ior={1.5}
          chromaticAberration={1}
          anisotropy={20}
          distortion={0.5}
          distortionScale={0.5}
          temporalDistortion={0.2}
          color="#a855f7"
          background={new THREE.Color("#000000")}
        />
      </mesh>
    </group>
  )
}

function Rig() {
  useFrame((state, delta) => {
    // Parallax effect based on mouse position
    easing.damp3(
      state.camera.position,
      [state.pointer.x * 2, state.pointer.y * 2, 8],
      0.3,
      delta
    )
    state.camera.lookAt(0, 0, 0)
  })
  return null
}

export function ModernLogoScene() {
  return (
    <div className="w-full h-full relative">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
      >
        <color attach="background" args={["transparent"]} />

        <AbstractLogo />

        {/* Floating Background Particles */}
        <Float speed={2} rotationIntensity={1} floatIntensity={1}>
          <mesh position={[-3, 2, -5]} scale={0.5}>
            <sphereGeometry />
            <meshStandardMaterial color="#3b82f6" roughness={0.1} metalness={0.8} />
          </mesh>
          <mesh position={[3, -1, -4]} scale={0.8}>
            <boxGeometry />
            <meshStandardMaterial color="#ec4899" roughness={0.1} metalness={0.8} />
          </mesh>
        </Float>

        {/* Lighting Environment */}
        <Environment resolution={256}>
          <group rotation={[-Math.PI / 3, 0, 1]}>
            <Lightformer form="circle" intensity={4} rotation-x={Math.PI / 2} position={[0, 5, -9]} scale={2} />
            <Lightformer form="circle" intensity={2} rotation-y={Math.PI / 2} position={[-5, 1, -1]} scale={2} />
            <Lightformer form="circle" intensity={2} rotation-y={Math.PI / 2} position={[-5, -1, -1]} scale={2} />
            <Lightformer form="circle" intensity={2} rotation-y={-Math.PI / 2} position={[10, 1, 0]} scale={8} />
          </group>
        </Environment>

        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={10} castShadow />
        <ContactShadows resolution={512} scale={20} blur={2} opacity={0.5} far={10} color="#6d28d9" />
        <Rig />
      </Canvas>
    </div>
  )
}
