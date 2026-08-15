"use client";

import * as THREE from "three";
import { useRef, useState, type ComponentRef, type ReactNode } from "react";
import { Canvas, createPortal, useFrame, useThree } from "@react-three/fiber";
import { MeshTransmissionMaterial, Preload, useFBO, useGLTF } from "@react-three/drei";
import { easing } from "maath";
import { useGaussianBlur } from "./gaussian-blur";

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
 *
 * The frost layer exploits the same split: the sharp framebuffer has two
 * consumers, and they no longer get the same picture. The background plane
 * draws a Gaussian-blurred copy, while the lens keeps refracting the sharp
 * original — so the lens reads as wiping the frost off whatever it passes
 * over. CSS backdrop-filter can't do this; the blur has to happen inside the
 * canvas for the lens to see through it.
 */

const LENS_GLB = "/assets/3d/lens.glb";
const BRAND_GREEN = "#17593a";

/**
 * Motion dynamics. The lens no longer eases to the pointer — it is pulled by
 * an underdamped spring, so it overshoots and settles like something with
 * mass. Its velocity then drives a liquid response: squash-and-stretch along
 * the direction of travel, plus a distortion pulse on the glass itself.
 * Everything decays to zero at rest, so a still lens is still clean glass.
 */
// DAMPING below 2·√STIFFNESS (~21.9) is what makes the spring overshoot.
const STIFFNESS = 120;
const DAMPING = 14;
/** Integration step. The spring is stiff enough that integrating it once per
 *  frame goes unstable on frame hitches; fixed substeps keep it deterministic. */
const SPRING_STEP = 1 / 120;
/** World-units-per-second of velocity → stretch. The viewport at the lens
 *  plane is only ~2 units wide, so a quick flick peaks around 5–6 u/s. */
const STRETCH_GAIN = 0.09;
const STRETCH_MAX = 0.5;
/** How much a full stretch bends the glass (added to the material's own
 *  distortion props while moving). */
const MOTION_DISTORTION = 1.2;
const MOTION_TEMPORAL = 0.4;

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

function LensRig({ children, material = {}, frost = 0 }: { children: ReactNode; material?: LensMaterial; frost?: number }) {
  const rig = useRef<THREE.Group>(null!);
  const { nodes } = useGLTF(LENS_GLB);
  const buffer = useFBO();
  const { viewport } = useThree();
  const [scene] = useState(() => new THREE.Scene());
  const blur = useGaussianBlur();

  // Spring state lives outside React — position/velocity in world units at
  // the lens plane. The material ref lets velocity drive distortion per frame
  // without re-rendering; drei exposes MTM uniforms as instance properties.
  const spring = useRef({ px: 0, py: 0, vx: 0, vy: 0 });
  const stretch = useRef({ value: 0 });
  const glass = useRef<ComponentRef<typeof MeshTransmissionMaterial>>(null!);

  useFrame((state, delta) => {
    const { gl, pointer, camera, viewport: vp } = state;
    const v = vp.getCurrentViewport(camera, [0, 0, 15]);

    // Target in world units rather than pixels, so the lens tracks correctly
    // at any canvas size.
    const tx = (pointer.x * v.width) / 2;
    const ty = (pointer.y * v.height) / 2;

    const s = spring.current;
    let remaining = Math.min(delta, 0.1);
    while (remaining > 0) {
      const dt = Math.min(SPRING_STEP, remaining);
      s.vx += ((tx - s.px) * STIFFNESS - s.vx * DAMPING) * dt;
      s.vy += ((ty - s.py) * STIFFNESS - s.vy * DAMPING) * dt;
      s.px += s.vx * dt;
      s.py += s.vy * dt;
      remaining -= dt;
    }
    rig.current.position.set(s.px, s.py, 15);

    // Squash-and-stretch: elongate along the velocity, thin perpendicular to
    // it by the inverse, so the disc keeps its apparent area. The rotation
    // only orients the scale axes — the disc itself is rotationally symmetric.
    const speed = Math.hypot(s.vx, s.vy);
    easing.damp(stretch.current, "value", Math.min(speed * STRETCH_GAIN, STRETCH_MAX), 0.1, delta);
    const k = stretch.current.value;
    if (speed > 0.05) {
      const diff = Math.atan2(s.vy, s.vx) - rig.current.rotation.z;
      rig.current.rotation.z += Math.atan2(Math.sin(diff), Math.cos(diff)) * (1 - Math.exp(-12 * delta));
    }
    rig.current.scale.set(1 + k, 1 / (1 + k), 1);

    // Fast motion also ripples the glass; at rest this decays back to the
    // material's configured values.
    if (glass.current) {
      glass.current.distortion = (material.distortion ?? 0) + k * MOTION_DISTORTION;
      glass.current.temporalDistortion = (material.temporalDistortion ?? 0) + k * MOTION_TEMPORAL;
    }

    gl.setRenderTarget(buffer);
    gl.render(scene, camera);
    gl.setRenderTarget(null);

    // Frost: only the background plane shows the blurred copy — the lens
    // keeps sampling the sharp buffer rendered above.
    if (frost > 0) blur.render(gl, buffer.texture, frost);
  });

  return (
    <>
      {createPortal(children, scene)}

      {/* The scene texture, drawn flat behind the lens. Without this the page
          would show only the refracted disc floating over nothing. With frost
          on, this plane is the only consumer of the blurred copy. */}
      <mesh scale={[viewport.width, viewport.height, 1]}>
        <planeGeometry />
        <meshBasicMaterial map={frost > 0 ? blur.texture : buffer.texture} transparent />
      </mesh>

      {/* The group carries position, travel-aligned rotation and the
          squash-and-stretch scale; the mesh keeps its own base scale and the
          flat-disc orientation. */}
      <group ref={rig} position={[0, 0, 15]}>
        <mesh
          scale={material.scale ?? 0.35}
          rotation-x={Math.PI / 2}
          geometry={(nodes.Cylinder as THREE.Mesh).geometry}
        >
          <MeshTransmissionMaterial
            ref={glass}
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
      </group>
    </>
  );
}

export default function FluidLens({
  children,
  material,
  background = BRAND_GREEN,
  frost = 3,
  className,
}: {
  /**
   * Scene content to refract. Must be three.js elements, not DOM. Omitting it
   * gives a lens over an empty background — valid, but there is nothing to bend.
   */
  children?: ReactNode;
  material?: LensMaterial;
  background?: string;
  /**
   * Blur step in half-res texels — the frosted layer the lens wipes clear.
   * ~1 is a haze, 3 clearly frosted but legible, 6+ abstract shapes.
   * 0 turns the layer off and the background shows the scene sharp.
   */
  frost?: number;
  className?: string;
}) {
  return (
    // cursor:none — the lens follows the pointer, so the OS arrow on top of
    // it reads as a duplicate. Scoped to this element, not the page.
    <div className={className} style={{ backgroundColor: background, cursor: "none" }}>
      <Canvas camera={{ position: [0, 0, 20], fov: 15 }} gl={{ alpha: true }}>
        <LensRig material={material} frost={frost}>
          <color attach="background" args={[background]} />
          {children}
          <Preload all />
        </LensRig>
      </Canvas>
    </div>
  );
}
