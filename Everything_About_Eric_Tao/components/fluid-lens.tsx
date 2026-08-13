"use client";

import * as THREE from "three";
import { useRef, useState, type ReactNode } from "react";
import { Canvas, createPortal, useFrame, useThree } from "@react-three/fiber";
import { MeshTransmissionMaterial, Preload, useFBO, useGLTF } from "@react-three/drei";
import { easing } from "maath";

/**
 * Adapted from React Bits' FluidGlass, reduced to the lens mode and detached
 * from its ScrollControls demo scaffolding.
 *
 * How the refraction actually works, which is the part that constrains usage:
 * children are portalled into a *separate* THREE.Scene, that scene is rendered
 * into a framebuffer each frame, and MeshTransmissionMaterial refracts that
 * buffer. So the lens can only bend things drawn inside the canvas — it cannot
 * see the surrounding DOM. Anything that should appear under the glass has to
 * be scene content, which is why the wordmark below is drei <Text> rather than
 * the HTML <h2> the specimen uses.
 */

const LENS_GLB = "/assets/3d/lens.glb";
const BRAND_GREEN = "#17593a";

useGLTF.preload(LENS_GLB);

/**
 * `scale` sizes the lens mesh; everything else is a MeshTransmissionMaterial
 * property. They arrive together because FluidGlass bundles them in one
 * `lensProps` object, but only the material ones affect refraction.
 */
type LensMaterial = {
  scale?: number;
  ior?: number;
  thickness?: number;
  anisotropy?: number;
  chromaticAberration?: number;
  roughness?: number;
  /** Liquid wobble. distortion is amount, distortionScale its size, and
   *  temporalDistortion animates it over time — 0 on all three is still glass. */
  distortion?: number;
  distortionScale?: number;
  temporalDistortion?: number;
};

function LensRig({ children, material = {} }: { children: ReactNode; material?: LensMaterial }) {
  const lens = useRef<THREE.Mesh>(null!);
  const { nodes } = useGLTF(LENS_GLB);
  const buffer = useFBO();
  const { viewport } = useThree();
  const [scene] = useState(() => new THREE.Scene());

  useFrame((state, delta) => {
    const { gl, pointer, camera, viewport: vp } = state;
    const v = vp.getCurrentViewport(camera, [0, 0, 15]);

    // Chase the pointer in world units rather than pixels, so the lens tracks
    // correctly at any canvas size.
    easing.damp3(lens.current.position, [(pointer.x * v.width) / 2, (pointer.y * v.height) / 2, 15], 0.15, delta);

    gl.setRenderTarget(buffer);
    gl.render(scene, camera);
    gl.setRenderTarget(null);
  });

  return (
    <>
      {createPortal(children, scene)}

      {/* The scene texture, drawn flat behind the lens. Without this the page
          would show only the refracted disc floating over nothing. */}
      <mesh scale={[viewport.width, viewport.height, 1]}>
        <planeGeometry />
        <meshBasicMaterial map={buffer.texture} transparent />
      </mesh>

      <mesh
        ref={lens}
        scale={material.scale ?? 0.20}
        rotation-x={Math.PI / 2}
        geometry={(nodes.Cylinder as THREE.Mesh).geometry}
      >
        <MeshTransmissionMaterial
          buffer={buffer.texture}
          ior={material.ior ?? 1.15}
          thickness={material.thickness ?? 5}
          // Off by default. Chromatic aberration is the rainbow fringe at the
          // rim; it reads as a lens artefact rather than as brand, and fights
          // the flat green. Pass a small value (0.05–0.1) to bring it back.
          chromaticAberration={material.chromaticAberration ?? 0}
          anisotropy={material.anisotropy ?? 0}
          roughness={material.roughness ?? 0}
          distortion={material.distortion ?? 0}
          distortionScale={material.distortionScale ?? 0.3}
          temporalDistortion={material.temporalDistortion ?? 0}
        />
      </mesh>
    </>
  );
}

export default function FluidLens({
  children,
  material,
  background = BRAND_GREEN,
  className,
}: {
  /**
   * Scene content to refract. Must be three.js elements, not DOM. Omitting it
   * gives a lens over an empty background — valid, but there is nothing to bend.
   */
  children?: ReactNode;
  material?: LensMaterial;
  background?: string;
  className?: string;
}) {
  return (
    // cursor:none — the lens follows the pointer, so the OS arrow on top of
    // it reads as a duplicate. Scoped to this element, not the page.
    <div className={className} style={{ backgroundColor: background, cursor: "none" }}>
      <Canvas camera={{ position: [0, 0, 20], fov: 15 }} gl={{ alpha: true }}>
        <LensRig material={material}>
          <color attach="background" args={[background]} />
          {children}
          <Preload all />
        </LensRig>
      </Canvas>
    </div>
  );
}
