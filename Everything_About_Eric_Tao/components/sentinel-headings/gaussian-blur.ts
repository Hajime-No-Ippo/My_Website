"use client";

import * as THREE from "three";
import { useState } from "react";
import { useThree } from "@react-three/fiber";
import { useFBO } from "@react-three/drei";

/**
 * Separable Gaussian blur as a reusable render pass: 5 taps at
 * linear-sampling offsets (so it reads 9 texels' worth), run horizontally
 * then vertically into half-res ping-pong buffers. Half resolution is
 * deliberate — it quarters the fill cost and the lost detail is detail the
 * blur was about to destroy anyway.
 *
 * This is GPU plumbing with no opinion about what it blurs — FluidLens uses
 * it for the frost layer, but any within-Canvas consumer can call it.
 */

const VERTEX = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

const FRAGMENT = /* glsl */ `
  uniform sampler2D tDiffuse;
  uniform vec2 uDirection;
  varying vec2 vUv;
  void main() {
    vec4 c = texture2D(tDiffuse, vUv) * 0.2270270270;
    c += texture2D(tDiffuse, vUv + uDirection * 1.3846153846) * 0.3162162162;
    c += texture2D(tDiffuse, vUv - uDirection * 1.3846153846) * 0.3162162162;
    c += texture2D(tDiffuse, vUv + uDirection * 3.2307692308) * 0.0702702703;
    c += texture2D(tDiffuse, vUv - uDirection * 3.2307692308) * 0.0702702703;
    gl_FragColor = c;
  }
`;

export type GaussianBlur = {
  /** Where the last render() landed. The object identity is stable across
   *  frames, so it is safe to hand to a material map in JSX once. */
  texture: THREE.Texture;
  /** Blur `source` by `radius` (in half-res texels — at dpr 2 one unit is
   *  ~4 device pixels per pass). Restores the render target to the canvas
   *  before returning. */
  render: (gl: THREE.WebGLRenderer, source: THREE.Texture, radius: number) => THREE.Texture;
};

/** Must be called inside <Canvas>. `passes` repeats the H+V pair — each
 *  extra pass widens the effective kernel far cheaper than more taps would. */
export function useGaussianBlur(passes = 2): GaussianBlur {
  const { size } = useThree();

  // Ping-pong targets; drei resizes them with the canvas.
  const blurA = useFBO(Math.max(1, Math.floor(size.width / 2)), Math.max(1, Math.floor(size.height / 2)));
  const blurB = useFBO(Math.max(1, Math.floor(size.width / 2)), Math.max(1, Math.floor(size.height / 2)));

  // A fullscreen quad in its own scene — the vertex shader ignores the
  // camera, so the ortho camera exists only because gl.render wants one.
  const [quad] = useState(() => {
    const material = new THREE.ShaderMaterial({
      uniforms: { tDiffuse: { value: null }, uDirection: { value: new THREE.Vector2() } },
      vertexShader: VERTEX,
      fragmentShader: FRAGMENT,
      depthTest: false,
      depthWrite: false,
    });
    const scene = new THREE.Scene();
    scene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material));
    return { material, scene, camera: new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1) };
  });

  return {
    texture: blurB.texture,
    render(gl, source, radius) {
      const { tDiffuse, uDirection } = quad.material.uniforms;
      let src = source;
      for (let i = 0; i < passes; i++) {
        tDiffuse.value = src;
        (uDirection.value as THREE.Vector2).set(radius / blurA.width, 0);
        gl.setRenderTarget(blurA);
        gl.render(quad.scene, quad.camera);

        tDiffuse.value = blurA.texture;
        (uDirection.value as THREE.Vector2).set(0, radius / blurA.height);
        gl.setRenderTarget(blurB);
        gl.render(quad.scene, quad.camera);
        src = blurB.texture;
      }
      gl.setRenderTarget(null);
      return blurB.texture;
    },
  };
}
