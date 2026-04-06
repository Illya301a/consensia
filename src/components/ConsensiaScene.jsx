import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import {
  Float,
  Line,
  MeshDistortMaterial,
  OrbitControls,
  PerspectiveCamera,
  Sparkles,
} from '@react-three/drei'
import * as THREE from 'three'

const PINK = '#f472b6'
const PINK_SOFT = '#fbcfe8'
const PINK_MIST = '#fce7f3'

const ORBIT_RADIUS = 9.5
const ORBIT_LOAD_POLAR = Math.PI / 3.45
const ORBIT_LOAD_AZIMUTH = 0

function orbitCameraFromRadius(radius) {
  const sinP = Math.sin(ORBIT_LOAD_POLAR)
  return [
    radius * sinP * Math.sin(ORBIT_LOAD_AZIMUTH),
    radius * Math.cos(ORBIT_LOAD_POLAR),
    radius * sinP * Math.cos(ORBIT_LOAD_AZIMUTH),
  ]
}

function useNarrowViewport() {
  const [narrow, setNarrow] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767.98px)')
    const sync = () => setNarrow(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])
  return narrow
}

function ParticleCloud({ count = 4500, animationsEnabled = true }) {
  const ref = useRef(null)
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const r = 3.5 + Math.random() * 9
      const u = Math.random()
      const v = Math.random()
      const theta = u * Math.PI * 2
      const phi = Math.acos(2 * v - 1)
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.85
      pos[i * 3 + 2] = r * Math.cos(phi)
    }
    return pos
  }, [count])

  const colors = useMemo(() => {
    const c = new Float32Array(count * 3)
    const nearWhite = new THREE.Color('#ff0000')
    const blush = new THREE.Color('#fdf2f8')
    for (let i = 0; i < count; i++) {
      const col = nearWhite.clone().lerp(blush, 0.08 + Math.random() * 0.22)
      c[i * 3] = col.r
      c[i * 3 + 1] = col.g
      c[i * 3 + 2] = col.b
    }
    return c
  }, [count])

  useFrame((_, delta) => {
    if (!animationsEnabled || !ref.current) return
    ref.current.rotation.y += delta * 0.04
    ref.current.rotation.x += delta * 0.015
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        vertexColors
        size={0.045}
        transparent
        opacity={0.92}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

function ConsensiaNetwork({ animationsEnabled = true }) {
  const group = useRef(null)

  const { nodes, segments } = useMemo(() => {
    const n = 14
    const nd = []
    for (let i = 0; i < n; i++) {
      const t = (i / n) * Math.PI * 2
      const layer = i % 2 === 0 ? 0 : 0.35
      const r = 2.4 + (i % 3) * 0.15
      nd.push(
        new THREE.Vector3(
          Math.cos(t) * r,
          layer * 1.8 - 0.4,
          Math.sin(t) * r
        )
      )
    }
    const inner = []
    for (let i = 0; i < 6; i++) {
      const t = (i / 6) * Math.PI * 2 + 0.4
      inner.push(
        new THREE.Vector3(Math.cos(t) * 0.95, 0, Math.sin(t) * 0.95)
      )
    }
    const all = [...nd, ...inner]
    const seg = []
    const connect = (a, b) => seg.push([all[a].clone(), all[b].clone()])
    for (let i = 0; i < n; i++) {
      connect(i, (i + 1) % n)
      connect(i, (i + 4) % n)
      connect(i, n + (i % 6))
    }
    for (let i = 0; i < 6; i++) {
      connect(n + i, n + ((i + 1) % 6))
      connect(n + i, i % n)
    }
    return { nodes: all, segments: seg }
  }, [])

  useFrame((_, delta) => {
    if (!animationsEnabled || !group.current) return
    group.current.rotation.y += delta * 0.12
  })

  return (
    <group ref={group}>
      {segments.map((pair, i) => (
        <Line
          key={i}
          points={pair}
          color={PINK_SOFT}
          transparent
          opacity={0.35}
          lineWidth={1.2}
        />
      ))}
      {nodes.map((p, i) => (
        <mesh key={i} position={p}>
          <sphereGeometry args={[0.07 + (i % 3) * 0.02, 16, 16]} />
          <meshPhysicalMaterial
            color={i >= nodes.length - 6 ? PINK : PINK_MIST}
            emissive={PINK}
            emissiveIntensity={0.35}
            roughness={0.25}
            metalness={0.6}
            clearcoat={1}
            clearcoatRoughness={0.2}
          />
        </mesh>
      ))}
    </group>
  )
}

function CoreOrb({ animationsEnabled = true }) {
  const mesh = (
    <mesh scale={1.15}>
      <icosahedronGeometry args={[1.35, 2]} />
      <MeshDistortMaterial
        color={PINK_SOFT}
        emissive={PINK}
        emissiveIntensity={0.15}
        roughness={0.15}
        metalness={0.85}
        distort={animationsEnabled ? 0.28 : 0}
        speed={animationsEnabled ? 2.2 : 0}
      />
    </mesh>
  )

  if (!animationsEnabled) {
    return <group>{mesh}</group>
  }

  return (
    <Float speed={1.6} rotationIntensity={0.35} floatIntensity={0.55}>
      {mesh}
    </Float>
  )
}

function SceneContent({ animationsEnabled = true, orbitRadius }) {
  const cameraPosition = useMemo(
    () => orbitCameraFromRadius(orbitRadius),
    [orbitRadius]
  )

  return (
    <>
      <PerspectiveCamera makeDefault position={cameraPosition} fov={42} />
      <fog attach="fog" args={[PINK_MIST, 8, 22]} />

      <ambientLight intensity={0.55} />
      <directionalLight position={[6, 8, 4]} intensity={1.1} color="#ffffff" />
      <directionalLight position={[-5, -2, -3]} intensity={0.45} color={PINK_SOFT} />
      <pointLight position={[0, 2, 2]} intensity={0.8} color={PINK} distance={14} />

      <ParticleCloud animationsEnabled={animationsEnabled} />
      <ConsensiaNetwork animationsEnabled={animationsEnabled} />
      <CoreOrb animationsEnabled={animationsEnabled} />

      <Sparkles
        count={120}
        scale={14}
        size={2.2}
        speed={animationsEnabled ? 0.35 : 0}
        opacity={0.55}
        color={PINK}
      />

      <OrbitControls
        enablePan={false}
        enableZoom={false}
        autoRotate={animationsEnabled}
        autoRotateSpeed={0.35}
        maxPolarAngle={Math.PI / 1.85}
        minPolarAngle={Math.PI / 4}
      />
    </>
  )
}

export function ConsensiaScene({ animationsEnabled = true }) {
  const [surfaceReady, setSurfaceReady] = useState(false)
  const narrow = useNarrowViewport()
  const orbitRadius = narrow ? ORBIT_RADIUS * 1.42 : ORBIT_RADIUS

  const onCreated = useCallback(({ gl }) => {
    gl.setClearColor(0x000000, 0)
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setSurfaceReady(true))
    })
  }, [])

  return (
    <div
      className={
        surfaceReady
          ? 'consensia-canvas-shell consensia-canvas-shell--ready'
          : 'consensia-canvas-shell'
      }
    >
      <Canvas
        className="consensia-canvas"
        dpr={[1, 1.75]}
        gl={{
          alpha: true,
          antialias: true,
          powerPreference: 'high-performance',
        }}
        onCreated={onCreated}
      >
        <SceneContent
          animationsEnabled={animationsEnabled}
          orbitRadius={orbitRadius}
        />
      </Canvas>
    </div>
  )
}
