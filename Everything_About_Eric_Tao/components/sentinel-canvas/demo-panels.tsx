import type React from "react";

/**
 * Stand-ins for SENTINEL's real workbench panels (Discovery / Source / Audit),
 * rendered in the same Swiss chrome but fed canned data from one real mapping
 * (Singapore · Electronic Transactions Act 2010). The originals talk to the
 * FastAPI backend; these are the demo's static evidence.
 */

const MONO = '"SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace';

function Frame({ title, tag, children }: { title: string; tag?: string; children: React.ReactNode }) {
  return (
    <div style={{ background: "#f3f1ea", border: "1.5px solid #111827", borderTop: "none" }}>
      <div
        className="panel-header"
        style={{
          display: "flex",
          alignItems: "baseline",
          gap: 8,
          padding: "10px 14px",
          borderBottom: "1.5px solid #111827",
          cursor: "grab",
        }}
      >
        <span
          style={{
            fontFamily: MONO,
            fontSize: "0.78rem",
            fontWeight: 800,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            color: "#111827",
          }}
        >
          {title}
        </span>
        {tag && (
          <span style={{ marginLeft: "auto", fontFamily: MONO, fontSize: "0.62rem", fontWeight: 700, color: "#6b675c" }}>
            {tag}
          </span>
        )}
      </div>
      <div style={{ padding: 14, display: "flex", flexDirection: "column", gap: 10 }}>{children}</div>
    </div>
  );
}

function Chip({ children, tone = "ink" }: { children: React.ReactNode; tone?: "ink" | "green" | "amber" | "blue" }) {
  const tones = {
    ink: { color: "#111827", bg: "transparent", border: "#111827" },
    green: { color: "#065f46", bg: "#d1fae5", border: "#065f46" },
    amber: { color: "#92400e", bg: "#fef3c7", border: "#92400e" },
    blue: { color: "#1e40af", bg: "#dbeafe", border: "#1e40af" },
  }[tone];
  return (
    <span
      style={{
        fontFamily: MONO,
        fontSize: "0.62rem",
        fontWeight: 700,
        textTransform: "uppercase",
        letterSpacing: "0.04em",
        padding: "2px 7px",
        color: tones.color,
        background: tones.bg,
        border: `1px solid ${tones.border}`,
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </span>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", gap: 10, alignItems: "baseline", fontSize: "0.78rem", color: "#26303d" }}>
      <span style={{ fontFamily: MONO, fontSize: "0.64rem", fontWeight: 700, textTransform: "uppercase", color: "#6b675c", flex: "0 0 92px" }}>
        {label}
      </span>
      <span style={{ flex: 1, lineHeight: 1.45 }}>{children}</span>
    </div>
  );
}

export function DiscoveryDemo() {
  const rows: { source: string; detail: string; status: React.ReactNode }[] = [
    {
      source: "Singapore Statutes Online",
      detail: "Electronic Transactions Act 2010 (2020 rev.)",
      status: <Chip tone="green">retrieved</Chip>,
    },
    {
      source: "IMDA",
      detail: "National e-invoicing framework pages",
      status: <Chip tone="green">retrieved</Chip>,
    },
    {
      source: "Government Gazette",
      detail: "Scanned amendment notice (2021) — OCR",
      status: <Chip tone="amber">ocr</Chip>,
    },
  ];
  return (
    <Frame title="Discovery" tag="SG · en">
      {rows.map((r) => (
        <div
          key={r.source + r.detail}
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: 10,
            padding: "8px 10px",
            background: "#ffffff",
            border: "1px solid #111827",
          }}
        >
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "#111827" }}>{r.source}</div>
            <div style={{ fontSize: "0.72rem", color: "#5a6573", marginTop: 1 }}>{r.detail}</div>
          </div>
          {r.status}
        </div>
      ))}
      <div style={{ fontFamily: MONO, fontSize: "0.66rem", color: "#6b675c" }}>
        + 6 more portals crawled · 2 session-gated · queries localised per language
      </div>
    </Frame>
  );
}

export function SourceDemo() {
  return (
    <Frame title="Source · Extraction" tag="§8(1) — chunk 14/62">
      <Row label="Provision">
        <span style={{ fontFamily: MONO, fontSize: "0.72rem", display: "block", padding: "8px 10px", background: "#ffffff", border: "1px solid #111827", lineHeight: 1.5 }}>
          Where a rule of law requires a signature, or provides for certain consequences if a
          document is not signed, that requirement is satisfied in relation to an electronic
          record if the method used is as reliable as appropriate for the purpose…
        </span>
      </Row>
      <Row label="Routed to">Electronic transactions — legal recognition of e-signatures</Row>
      <Row label="Feature">Functional-equivalence rule for electronic signatures (technology-neutral)</Row>
      <Row label="Verification">
        <span style={{ display: "inline-flex", gap: 6, flexWrap: "wrap" }}>
          <Chip tone="green">quote verbatim ✓</Chip>
          <Chip tone="blue">classifier route</Chip>
        </span>
      </Row>
      <div style={{ fontFamily: MONO, fontSize: "0.64rem", color: "#6b675c" }}>
        regex slice → keyword route → LLM extract → char-for-char verify
      </div>
    </Frame>
  );
}

export function AuditDemo() {
  return (
    <Frame title="Audit" tag="RDTII 2.1">
      <Row label="Indicator">Legal recognition of electronic signatures · pillar: Electronic transactions</Row>
      <Row label="Law">Electronic Transactions Act 2010, §8(1) — last amended 2021</Row>
      <Row label="Score">
        <span style={{ fontFamily: MONO, fontWeight: 800 }}>1</span>
        <span style={{ color: "#6b675c" }}> / allowed {"{0, 1}"} — assigned by the deterministic scorer, not the model</span>
      </Row>
      <Row label="Gates">
        <span style={{ display: "inline-flex", gap: 6, flexWrap: "wrap" }}>
          <Chip tone="green">verbatim ✓</Chip>
          <Chip tone="green">cross-model ✓</Chip>
          <Chip>scope guard: lower-only</Chip>
        </span>
      </Row>
      <Row label="Run cost">
        <span style={{ fontFamily: MONO, fontSize: "0.72rem" }}>12.4k tokens · $0.0041 · local path: $0</span>
      </Row>
    </Frame>
  );
}
