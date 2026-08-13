"use client";

import * as THREE from "three";
import { useCallback, useMemo, useState } from "react";
import { Text } from "@react-three/drei";
import { useThree } from "@react-three/fiber";

/**
 * The brand specimen as scene content: the wordmark plus a registration line
 * projected from every glyph's ink edge.
 *
 * The DOM version measures glyphs with Canvas TextMetrics. There is no DOM box
 * here, so the equivalent comes from troika — after it lays the text out it
 * publishes `textRenderInfo.glyphBounds`, four floats per glyph
 * (left, bottom, right, top) in the text's local space. Those are the same ink
 * edges, already in the units the scene draws in.
 */

/** troika parses ttf/otf/woff — not woff2. */
const FONT = "/fonts/boldonse.woff";
const LINE_COLOR = "#86efac";
/** Glyph edges closer than this collapse into one line. */
const EPSILON = 1e-3;

type Bounds = { xs: number[]; ys: number[] };

function dedupe(values: number[]) {
  const out: number[] = [];
  for (const v of values.sort((a, b) => a - b)) {
    if (out.length === 0 || Math.abs(v - out[out.length - 1]) > EPSILON) out.push(v);
  }
  return out;
}

export default function SpecimenScene({
  word = "Sentinel",
  fontSize = 1.7,
  color = "#ffffff",
}: {
  word?: string;
  fontSize?: number;
  color?: string;
}) {
  const { viewport } = useThree();
  const [bounds, setBounds] = useState<Bounds>({ xs: [], ys: [] });

  // troika calls this once layout is finished — the earliest point glyph
  // geometry actually exists.
  const onSync = useCallback((mesh: unknown) => {
    const info = (mesh as { textRenderInfo?: { glyphBounds?: Float32Array } })?.textRenderInfo;
    const gb = info?.glyphBounds;
    if (!gb?.length) return;

    const xs: number[] = [];
    const ys: number[] = [];
    for (let i = 0; i < gb.length; i += 4) {
      xs.push(gb[i], gb[i + 2]); // left, right
      ys.push(gb[i + 1], gb[i + 3]); // bottom, top
    }
    setBounds({ xs: dedupe(xs), ys: dedupe(ys) });
  }, []);

  // One buffer for every line rather than a mesh each — the whole grid is a
  // single draw call, which matters when it re-renders into the FBO per frame.
  const geometry = useMemo(() => {
    const points: number[] = [];
    const w = viewport.width;
    const h = viewport.height;

    for (const x of bounds.xs) points.push(x, -h, 0, x, h, 0);
    for (const y of bounds.ys) points.push(-w, y, 0, w, y, 0);

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.Float32BufferAttribute(points, 3));
    return geo;
  }, [bounds, viewport.width, viewport.height]);

  return (
    <>
      <Text
        font={FONT}
        fontSize={fontSize}
        color={color}
        anchorX="center"
        anchorY="middle"
        onSync={onSync}
      >
        {word}
      </Text>

      {bounds.xs.length > 0 && (
        <lineSegments geometry={geometry}>
          <lineBasicMaterial color={LINE_COLOR} transparent opacity={0.7} />
        </lineSegments>
      )}
    </>
  );
}
