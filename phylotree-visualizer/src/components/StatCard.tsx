import type { FC } from "react";
import { vstyles } from "../utils/styles";

export const StatCard: FC<{ label: string; value: string; sub?: string; warn?: boolean; good?: boolean }> = ({ label, value, sub, warn, good }) => (
  <div style={{ ...vstyles.card, borderColor: warn ? "#f9731633" : good ? "#00e5b033" : "#0f2133" }}>
    <div style={{ fontSize: 10, color: "#475569", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>{label}</div>
    <div style={{ fontSize: 20, fontWeight: 700, color: warn ? "#f97316" : good ? "#00e5b0" : "#e2e8f0", fontVariantNumeric: "tabular-nums" }}>{value}</div>
    {sub && <div style={{ fontSize: 10, color: "#334155", marginTop: 3 }}>{sub}</div>}
  </div>
);