'use client'

import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment, useGLTF, Loader } from '@react-three/drei'
import { Suspense } from 'react'
import { motion } from 'framer-motion' // Using framer-motion for smooth animation

// Model Component: No major changes, but transformations are now on the <primitive> tag for clarity.
import { GroupProps } from "@react-three/fiber";

function TutMaskModel(props: GroupProps) {

  const { scene } = useGLTF('/tutankhamun_mask.glb')
  // We can pass props down to the primitive object
  return <primitive object={scene} {...props} />
}

// Main 3D Artifact Component
export default function Artifact3D() {
  return (
    // Replaced the problematic <Section> with a self-animating <motion.div>
    <motion.section
      id="artifact"
      className="bg-pharaoh-dark py-24" // Using themed colors for consistency
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    >
      <div className="container mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-cinzel text-egyptian-gold mb-4 drop-shadow-lg">
          Interactive Artifact
        </h2>
        <p className="text-lg text-papyrus/80 font-inter mb-10">
          Explore the Mask of Tutankhamun in 3D. Drag to rotate, scroll to zoom.
        </p>

        {/* The container for the 3D model with a cinematic border */}
        <div className="w-full h-[550px] rounded-2xl p-2 border-2 border-egyptian-gold/30 bg-black/30 shadow-2xl shadow-egyptian-gold/10">
          {/* FIX #1: We removed useMemo. The <Canvas> should be rendered directly.
            React Three Fiber is already optimized to prevent unnecessary re-renders.
            
            FIX #2: Added `frameloop="demand"`. This is a huge performance boost.
            It tells the canvas to only render a new frame when the camera moves
            or an animation is active, saving the user's GPU.
          */}
          <Canvas
            camera={{ position: [0, 0, 3.5], fov: 40 }}
            frameloop="demand" // <-- Major performance optimization
          >
            {/* Soft, balanced lighting for a museum feel */}
            <ambientLight intensity={1.5} />
            <directionalLight
              position={[2, 5, 5]}
              intensity={2.5}
              castShadow
            />

            {/* Suspense handles the loading state of the model */}
            <Suspense fallback={null}>
              <TutMaskModel
                scale={1.8}
                position={[0, -0.5, 0]}
                rotation-y={Math.PI / 6} // Use 'rotation-y' prop for rotation
              />
              <Environment preset="sunset" />
            </Suspense>

            <OrbitControls
              enableZoom={true}
              autoRotate // Keeps the model gently rotating
              autoRotateSpeed={0.75}
              minDistance={2.5} // Prevents zooming in too close
              maxDistance={6} // Prevents zooming out too far
              enablePan={false} // Disables moving the model side-to-side
            />
          </Canvas>
          {/* FIX #3: Added a <Loader /> component from Drei.
            This will automatically show a clean progress bar while the model downloads,
            making the experience feel much smoother and more professional.
          */}
          <Loader />
        </div>
      </div>
    </motion.section>
  )
}

// Preloading the model is a great practice, so we keep it.
useGLTF.preload('/tutankhamun_mask.glb')


