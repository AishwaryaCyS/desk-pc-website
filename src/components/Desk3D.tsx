'use client'
import { useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'

// LED colour at time t (seconds) with a phase offset. Same cycle as the page accent.
const led = (t: number, off = 0, l = 0.55) => new THREE.Color().setHSL((((t * 9 + off) % 360) + 360) % 360 / 360, 1, l)

function Fan({ pos, off }: { pos: [number, number, number]; off: number }) {
  const ring = useRef<THREE.MeshStandardMaterial>(null!)
  const blades = useRef<THREE.Group>(null!)
  useFrame(({ clock }) => {
    blades.current.rotation.z = clock.elapsedTime * 6
    ring.current.emissive.copy(led(clock.elapsedTime, off))
  })
  return (
    <group position={pos} rotation={[-Math.PI / 2, 0, 0]}>
      <mesh><torusGeometry args={[0.3, 0.035, 8, 32]} /><meshStandardMaterial ref={ring} color="#111" emissiveIntensity={2.2} /></mesh>
      <group ref={blades}>
        {[0, 1, 2].map((k) => (
          <group key={k} rotation={[0, 0, k * 2.094]}>
            <mesh position={[0.15, 0, 0]}><boxGeometry args={[0.26, 0.12, 0.01]} /><meshStandardMaterial color="#15171d" /></mesh>
          </group>
        ))}
      </group>
    </group>
  )
}

function Desk({ feet }: { feet: number }) {
  const L = feet, W = 2, H = 2.5
  const strip = useRef<THREE.MeshStandardMaterial>(null!)
  const gpu = useRef<THREE.MeshStandardMaterial>(null!)
  const floor = useRef<THREE.MeshBasicMaterial>(null!)
  const light = useRef<THREE.PointLight>(null!)
  const glow = useMemo(() => {
    const c = document.createElement('canvas'); c.width = c.height = 128
    const g = c.getContext('2d')!, r = g.createRadialGradient(64, 64, 0, 64, 64, 64)
    r.addColorStop(0, 'rgba(255,255,255,1)'); r.addColorStop(1, 'rgba(255,255,255,0)')
    g.fillStyle = r; g.fillRect(0, 0, 128, 128)
    return new THREE.CanvasTexture(c)
  }, [])
  useFrame(({ clock }) => {
    const t = clock.elapsedTime
    strip.current.emissive.copy(led(t)); gpu.current.emissive.copy(led(t, 60))
    floor.current.color.copy(led(t, 30)); light.current.color.copy(led(t, 30))
  })
  const x0 = -L / 2
  return (
    <group position={[0, -H / 2, 0]}>
      <pointLight ref={light} position={[0, H - 0.3, 0]} intensity={4} distance={6} />
      {/* frame: base plate and four bars, black metal */}
      <mesh position={[0, H - 0.12, 0]}><boxGeometry args={[L, 0.04, W]} /><meshStandardMaterial color="#0a0a0c" metalness={0.5} roughness={0.5} /></mesh>
      {[-1, 1].map((s) => <mesh key={s} position={[0, H - 0.04, s * (W / 2 - 0.04)]}><boxGeometry args={[L, 0.16, 0.08]} /><meshStandardMaterial color="#0a0a0c" metalness={0.6} roughness={0.4} /></mesh>)}
      {[-1, 1].map((s) => <mesh key={s} position={[s * (L / 2 - 0.04), H - 0.04, 0]}><boxGeometry args={[0.08, 0.16, W]} /><meshStandardMaterial color="#0a0a0c" metalness={0.6} roughness={0.4} /></mesh>)}
      {/* LED strip on the front edge */}
      <mesh position={[0, H - 0.04, W / 2 + 0.01]}><boxGeometry args={[L - 0.1, 0.03, 0.02]} /><meshStandardMaterial ref={strip} color="#000" emissiveIntensity={3} /></mesh>
      {/* inside: motherboard, graphics card (lit lettering stands in for the logo), fans */}
      <mesh position={[0.1, H - 0.08, -0.2]}><boxGeometry args={[L * 0.45, 0.03, W * 0.55]} /><meshStandardMaterial color="#14161c" /></mesh>
      <mesh position={[L * 0.12, H - 0.02, -0.15]}><boxGeometry args={[1.2, 0.1, 0.38]} /><meshStandardMaterial color="#0d0e12" metalness={0.5} roughness={0.4} /></mesh>
      <mesh position={[L * 0.12, H + 0.035, -0.15]}><boxGeometry args={[0.9, 0.005, 0.07]} /><meshStandardMaterial ref={gpu} color="#000" emissiveIntensity={2.5} /></mesh>
      {Array.from({ length: feet }, (_, i) => <Fan key={i} pos={[x0 + 0.45 + i * ((L - 0.9) / Math.max(feet - 1, 1)), H - 0.05, W / 2 - 0.45]} off={i * 40} />)}
      {[-0.6, 0, 0.6].map((z, i) => <Fan key={'b' + i} pos={[x0 + 0.5, H - 0.05, z - 0.2]} off={200 + i * 40} />)}
      {/* glass top */}
      <mesh position={[0, H + 0.06, 0]}><boxGeometry args={[L - 0.02, 0.03, W - 0.02]} /><meshStandardMaterial color="#9fb3c8" transparent opacity={0.14} metalness={0.9} roughness={0.05} /></mesh>
      {/* legs: black uprights with long feet, as on the real desk */}
      {[-1, 1].map((s) => (
        <group key={s} position={[s * (L / 2 - 0.4), 0, 0]}>
          <mesh position={[0, (H - 0.12) / 2, 0]}><boxGeometry args={[0.14, H - 0.12, 0.14]} /><meshStandardMaterial color="#0a0a0c" metalness={0.5} roughness={0.5} /></mesh>
          <mesh position={[0, 0.03, 0]}><boxGeometry args={[0.2, 0.06, W + 0.3]} /><meshStandardMaterial color="#0a0a0c" metalness={0.5} roughness={0.5} /></mesh>
        </group>
      ))}
      {/* light spilled on the floor */}
      <mesh position={[0, 0.005, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[L + 2.5, W + 3]} />
        <meshBasicMaterial ref={floor} map={glow} transparent opacity={0.45} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
    </group>
  )
}

export default function Desk3D({ feet, active }: { feet: number; active: boolean }) {
  return (
    <Canvas dpr={[1, 1.5]} frameloop={active ? 'always' : 'never'} camera={{ position: [5, 3.2, 7.5], fov: 35 }}>
      <ambientLight intensity={0.35} />
      <directionalLight position={[3, 6, 4]} intensity={0.6} />
      <Desk feet={feet} />
      <OrbitControls autoRotate autoRotateSpeed={1.2} enableZoom={false} enablePan={false} minPolarAngle={0.6} maxPolarAngle={1.45} />
    </Canvas>
  )
}
