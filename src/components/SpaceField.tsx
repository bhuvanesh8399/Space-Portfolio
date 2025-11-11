import React, { useMemo, useRef } from "react";
// Note: Requires @react-three/fiber, @react-three/drei, and three
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";

function Stars({ count = 1400 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null!);
  const positions = useMemo(() => {
    const pts = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pts[i * 3 + 0] = (Math.random() * 2 - 1) * 60;
      pts[i * 3 + 1] = (Math.random() * 2 - 1) * 60;
      pts[i * 3 + 2] = (Math.random() * 2 - 1) * 60;
    }
    return pts;
  }, [count]);
  useFrame(({ clock }) => {
    if (ref.current) ref.current.rotation.y = clock.getElapsedTime() * 0.02;
  });
  return (
    <Points ref={ref} positions={positions} frustumCulled>
      <PointMaterial size={0.04} sizeAttenuation depthWrite={false} transparent color="#ffffff" />
    </Points>
  );
}

export default function SpaceField() {
  return (
    <div className="space-canvas" aria-hidden>
      <Canvas dpr={[1, 1.5]} camera={{ position: [0, 0, 8], fov: 60 }}>
        <ambientLight intensity={0.2} />
        <Stars count={1400} />
      </Canvas>
    </div>
  );
}

