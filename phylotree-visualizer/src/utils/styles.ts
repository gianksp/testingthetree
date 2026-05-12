import type { CSSProperties } from "react";

export const s: Record<string, CSSProperties> = {
  container: {
    background: "#080e1a", height: "100dvh" as CSSProperties["height"],
    maxHeight: "100dvh" as CSSProperties["height"],
    fontFamily: "'JetBrains Mono','Fira Code',monospace", color: "#e2e8f0",
    display: "flex", flexDirection: "column", overflow: "hidden",
    paddingTop: "env(safe-area-inset-top)", paddingBottom: "env(safe-area-inset-bottom)",
    paddingLeft: "env(safe-area-inset-left)", paddingRight: "env(safe-area-inset-right)",
  },
  // Header
  header: {
    display: "flex", alignItems: "center", height: 52, minHeight: 52,
    padding: "0 8px", borderBottom: "1px solid #0f2133", background: "#060c16",
    flexShrink: 0, gap: 4,
  },
  logo: { fontSize: 14, fontWeight: 700, color: "#00e5b0", letterSpacing: "0.06em", flex: 1, textAlign: "center" },
  headerRight: { display: "flex", gap: 2, alignItems: "center" },
  menuBtn: {
    background: "transparent", color: "#64748b", border: "none",
    width: 44, height: 44, borderRadius: 8, cursor: "pointer", fontSize: 20,
    display: "flex", alignItems: "center", justifyContent: "center",
    WebkitTapHighlightColor: "transparent", flexShrink: 0,
  },
  iconBtn: {
    background: "transparent", color: "#64748b", border: "none",
    width: 44, height: 44, borderRadius: 8, cursor: "pointer", fontSize: 16,
    display: "flex", alignItems: "center", justifyContent: "center",
    WebkitTapHighlightColor: "transparent",
  },
  selBadge: {
    fontSize: 10, border: "1px solid", borderRadius: 4, padding: "2px 6px",
    maxWidth: 100, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
  },
  // Main area
  main: { flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", minHeight: 0 },
  treeArea: { flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", minHeight: 0 },
  canvasWrapper: {
    flex: 1, overflow: "scroll", background: "#080e1a",
    userSelect: "none",
    WebkitUserSelect: "none" as React.CSSProperties["WebkitUserSelect"],
    overscrollBehavior: "none", WebkitOverflowScrolling: "touch" as CSSProperties["WebkitOverflowScrolling"],
    minHeight: 0, position: "relative",
  },
  // Bottom tab bar
  tabBar: {
    display: "flex", background: "#060c16",
    borderTop: "1px solid #0f2133", flexShrink: 0,
    paddingBottom: "env(safe-area-inset-bottom)",
  },
  tab: {
    flex: 1, background: "transparent", border: "none", color: "#475569",
    display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
    padding: "6px 4px", cursor: "pointer", minHeight: 52,
    WebkitTapHighlightColor: "transparent", gap: 2,
  },
  tabActive: { color: "#00e5b0", borderTop: "2px solid #00e5b0" },
  tabIcon: { fontSize: 16, lineHeight: 1 },
  tabLabel: { fontSize: 9, letterSpacing: "0.03em" },
  // Side menu
  menuBackdrop: {
    position: "fixed", inset: 0, background: "#00000077", zIndex: 100,
  },
  menuDrawer: {
    position: "fixed", left: 0, top: 0, bottom: 0, width: 300, maxWidth: "85vw",
    background: "#060c16", borderRight: "1px solid #0f2133", zIndex: 101,
    display: "flex", flexDirection: "column", transition: "transform 0.25s ease",
    boxShadow: "4px 0 24px #000a",
  },
  menuHeader: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "0 16px", height: 52, borderBottom: "1px solid #0f2133", flexShrink: 0,
    paddingTop: "env(safe-area-inset-top)",
  },
  menuLogo: { fontSize: 15, fontWeight: 700, color: "#00e5b0" },
  menuClose: {
    background: "transparent", color: "#475569", border: "none",
    width: 44, height: 44, cursor: "pointer", fontSize: 18,
    display: "flex", alignItems: "center", justifyContent: "center",
    WebkitTapHighlightColor: "transparent",
  },
  menuBody: { flex: 1, overflowY: "auto", padding: "8px 0", WebkitOverflowScrolling: "touch" as CSSProperties["WebkitOverflowScrolling"] },
  menuSection: { padding: "12px 16px", borderBottom: "1px solid #0f2133" },
  menuSectionTitle: { fontSize: 10, color: "#334155", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 12 },
  menuInputGroup: { marginBottom: 12 },
  menuInputLabelRow: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 },
  menuInputLabel: { fontSize: 11, color: "#475569" },
  menuUploadBtn: {
    fontSize: 11, color: "#00e5b0", border: "1px solid #00e5b033",
    borderRadius: 4, padding: "3px 8px", cursor: "pointer", WebkitTapHighlightColor: "transparent",
  },
  menuTextarea: {
    width: "100%", boxSizing: "border-box" as CSSProperties["boxSizing"],
    background: "#0d1929", border: "1px solid #0f2133", borderRadius: 6,
    color: "#e2e8f0", padding: "8px 10px", fontFamily: "inherit",
    fontSize: 16 as CSSProperties["fontSize"], resize: "vertical" as CSSProperties["resize"], outline: "none",
  },
  menuError: { color: "#f87171", fontSize: 11, background: "#3b0a0a", padding: "7px 10px", borderRadius: 5, marginBottom: 8 },
  menuBuildBtn: {
    width: "100%", background: "#00e5b0", color: "#060c16", border: "none",
    borderRadius: 8, padding: "14px", fontWeight: 700, cursor: "pointer",
    fontSize: 14, fontFamily: "inherit", minHeight: 48, WebkitTapHighlightColor: "transparent",
  },
  // Tree list in menu
  treeList: { display: "flex", flexDirection: "column", gap: 4, maxHeight: 240, overflowY: "auto" },
  treeListItem: {
    background: "transparent", border: "1px solid #0f2133", borderRadius: 6,
    padding: "10px 12px", cursor: "pointer", fontFamily: "inherit",
    display: "flex", justifyContent: "space-between", alignItems: "center",
    color: "#64748b", fontSize: 12, textAlign: "left", WebkitTapHighlightColor: "transparent",
    minHeight: 44,
  },
  treeListItemActive: { background: "#00e5b011", borderColor: "#00e5b044", color: "#00e5b0" },
  treeListName: { overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 160 },
  treeListScore: { fontSize: 10, color: "#334155", flexShrink: 0, marginLeft: 8 },
  // Menu toggles
  menuToggle: { display: "flex", alignItems: "center", gap: 12, minHeight: 44, cursor: "pointer" },
  menuToggleTrack: {
    width: 36, height: 20, borderRadius: 10, position: "relative",
    flexShrink: 0, transition: "background 0.2s", cursor: "pointer",
  },
  menuToggleThumb: {
    position: "absolute", top: 2, left: 2, width: 16, height: 16,
    borderRadius: "50%", background: "#fff", transition: "transform 0.2s",
  },
  menuToggleLabel: { fontSize: 13, color: "#94a3b8" },
  // Tooltip
  tooltip: {
    position: "absolute", background: "#0d1929", border: "1px solid #1e3a5f",
    borderRadius: 6, padding: "6px 10px", pointerEvents: "none",
    zIndex: 50, whiteSpace: "nowrap", boxShadow: "0 4px 16px #0008",
  },
  // ClustalX legend
  legendPanel: {
    background: "#060c16", borderTop: "1px solid #0f2133",
    padding: "10px 14px", flexShrink: 0,
  },
  legendTitle: { fontSize: 10, color: "#334155", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 },
  legendGrid: { display: "flex", flexWrap: "wrap", gap: "6px 16px" },
  legendRow: { display: "flex", alignItems: "center", gap: 6 },
  legendSwatch: { width: 12, height: 12, borderRadius: 2, flexShrink: 0 },
  legendLabel: { fontSize: 11, color: "#94a3b8" },
  legendResidues: { fontSize: 9, color: "#334155", fontFamily: "monospace" },
  // FASTA panel
  fastaPanel: {
    background: "#060c16", borderTop: "1px solid #0f2133",
    maxHeight: "35dvh" as CSSProperties["maxHeight"], display: "flex", flexDirection: "column", flexShrink: 0,
  },
  fastaPanelHeader: {
    display: "flex", alignItems: "center", gap: 8, padding: "8px 14px",
    borderBottom: "1px solid #0f2133", flexShrink: 0,
  },
  fastaPanelTitle: { fontSize: 12, fontWeight: 700, color: "#00e5b0", fontFamily: "monospace" },
  fastaPanelLen: { fontSize: 10, color: "#334155", marginLeft: 4 },
  fastaPanelClose: {
    marginLeft: "auto", background: "transparent", border: "none", color: "#475569",
    cursor: "pointer", fontSize: 16, width: 36, height: 36,
    display: "flex", alignItems: "center", justifyContent: "center", WebkitTapHighlightColor: "transparent",
  },
  fastaSeqWrap: { overflowY: "auto", padding: "8px 14px", WebkitOverflowScrolling: "touch" as CSSProperties["WebkitOverflowScrolling"] },
  fastaLine: { display: "flex", alignItems: "center", gap: 8, marginBottom: 4 },
  fastaPos: { fontSize: 9, color: "#334155", width: 30, textAlign: "right", flexShrink: 0, fontFamily: "monospace" },
  fastaSeq: { display: "flex", flexWrap: "wrap", gap: 1 },
  fastaAA: {
    display: "inline-block", width: 12, height: 16, lineHeight: "16px",
    fontSize: 10, textAlign: "center", color: "#fff", borderRadius: 1,
    fontFamily: "monospace", fontWeight: 700,
  },
  fastaRaw: { marginTop: 12, borderTop: "1px solid #0f2133", paddingTop: 8 },
  fastaRawLabel: { fontSize: 9, color: "#334155", textTransform: "uppercase", marginBottom: 4 },
  fastaRawText: { fontSize: 10, color: "#475569", fontFamily: "monospace", whiteSpace: "pre-wrap", wordBreak: "break-all", margin: 0 },
  // Viz panels
  vizPanel: { flex: 1, overflowY: "auto", padding: "16px 14px", background: "#080e1a", minHeight: 0, WebkitOverflowScrolling: "touch" as CSSProperties["WebkitOverflowScrolling"] },
  vizTitle: { fontSize: 14, fontWeight: 700, color: "#e2e8f0", marginBottom: 6 },
  vizDesc: { fontSize: 11, color: "#475569", marginBottom: 14, lineHeight: 1.6 },
  // Tree navigator in menu header
  treeNavHeader: {
    display: "flex", alignItems: "center", gap: 4,
    padding: "8px 10px", borderBottom: "1px solid #0f2133",
    background: "#080e1a", flexShrink: 0, position: "relative",
  },
  treeNavArrow: {
    background: "#0d1929", border: "1px solid #1e3a5f", color: "#94a3b8",
    width: 36, height: 36, borderRadius: 8, cursor: "pointer", fontSize: 20,
    display: "flex", alignItems: "center", justifyContent: "center",
    flexShrink: 0, WebkitTapHighlightColor: "transparent", fontFamily: "inherit",
    transition: "opacity 0.15s",
  },
  treeNavDropdownWrap: { flex: 1, position: "relative" },
  treeNavDropdownBtn: {
    width: "100%", background: "#0d1929", border: "1px solid #1e3a5f",
    borderRadius: 8, padding: "0 10px", height: 36, cursor: "pointer",
    display: "flex", alignItems: "center", gap: 6, fontFamily: "inherit",
    WebkitTapHighlightColor: "transparent",
  },
  treeNavDropdownLabel: {
    flex: 1, fontSize: 11, color: "#94a3b8", textAlign: "left",
    overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
  },
  treeNavCounter: { fontSize: 10, color: "#334155", flexShrink: 0 },
  treeNavScore: { color: "#334155", fontSize: 9 },
  treeDropdownList: {
    position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0,
    background: "#0d1929", border: "1px solid #1e3a5f", borderRadius: 8,
    zIndex: 200, maxHeight: 260, overflowY: "auto",
    boxShadow: "0 8px 24px #0009",
    WebkitOverflowScrolling: "touch" as CSSProperties["WebkitOverflowScrolling"],
  },
  treeDropdownItem: {
    width: "100%", background: "transparent", border: "none",
    borderBottom: "1px solid #0f2133", padding: "10px 12px",
    display: "flex", alignItems: "center", gap: 8,
    cursor: "pointer", fontFamily: "inherit", textAlign: "left",
    color: "#64748b", fontSize: 11, minHeight: 44,
    WebkitTapHighlightColor: "transparent",
  },
  treeDropdownItemActive: { background: "#00e5b00d", color: "#00e5b0" },
  treeDropdownItemIdx: { fontSize: 9, color: "#334155", minWidth: 20, flexShrink: 0 },
  treeDropdownItemName: { flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
  treeDropdownItemScore: { fontSize: 9, color: "#334155", flexShrink: 0 },
};

export const vstyles: Record<string, CSSProperties> = {
  panel: { flex: 1, overflowY: "auto", padding: "16px 14px", background: "#080e1a", minHeight: 0, WebkitOverflowScrolling: "touch" as CSSProperties["WebkitOverflowScrolling"] },
  cards: { display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 20 },
  card: { background: "#0d1929", border: "1px solid #0f2133", borderRadius: 8, padding: "12px 14px", minWidth: 130, flex: "1 1 130px" },
  warning: { background: "#3b1a0a", border: "1px solid #f9731633", borderRadius: 6, padding: "10px 14px", fontSize: 12, color: "#f97316", marginBottom: 16, lineHeight: 1.5 },
  sectionHeader: { display: "flex", alignItems: "center", gap: 12, marginBottom: 8, flexWrap: "wrap" },
  sectionTitle: { fontSize: 13, fontWeight: 700, color: "#94a3b8" },
  sectionSub: { fontSize: 10, color: "#334155" },
  filterToggle: { fontSize: 12, color: "#64748b", display: "flex", alignItems: "center", marginLeft: "auto", cursor: "pointer" },
  tableWrap: { overflowX: "auto", WebkitOverflowScrolling: "touch" as CSSProperties["WebkitOverflowScrolling"], borderRadius: 6, border: "1px solid #0f2133" },
  table: { borderCollapse: "collapse", width: "100%", fontSize: 11, fontFamily: "'JetBrains Mono',monospace" },
  th: { background: "#060c16", color: "#475569", padding: "8px 12px", textAlign: "left", fontWeight: 600, whiteSpace: "nowrap", borderBottom: "1px solid #0f2133", userSelect: "none" },
  td: { padding: "6px 12px", borderBottom: "1px solid #0a1520", whiteSpace: "nowrap" } as CSSProperties,
};

// ══════════════════════════════════════════════════════════════════════════════
// ClustalX AA colors
// ══════════════════════════════════════════════════════════════════════════════
// export const AA_COLORS: Record<string, string> = {
//   A: "#ff1a1a", // alanine
//   C: "#1f45ff", // cysteine
//   D: "#6fd3ff", // aspartic acid
//   E: "#f2c200", // glutamic acid
//   F: "#7a35b8", // phenylalanine
//   G: "#bfbfbf", // glycine
//   H: "#002a8f", // histidine
//   I: "#14e514", // isoleucine
//   K: "#f3f000", // lysine
//   L: "#efb287", // leucine
//   M: "#8ee8df", // methionine
//   N: "#b7d7f2", // asparagine
//   P: "#c40000", // proline
//   Q: "#ff00d8", // glutamine
//   R: "#9a4e16", // arginine
//   S: "#72db72", // serine
//   T: "#ff8a00", // threonine
//   V: "#deb3d8", // valine
//   W: "#b7b86a", // tryptophan
//   Y: "#efc4ae", // tyrosine,

//   // optional extras for ambiguous / gap chars
//   X: "#e5e7eb",
//   B: "#d1d5db",
//   Z: "#d1d5db",
//   "-": "#f8fafc",
// };

// export const CLUSTALX_GROUPS = [
//   { label: "Hydrophobic", residues: "A I L M F W V", color: "#80a0f0" },
//   { label: "Positive", residues: "K R", color: "#f01505" },
//   { label: "Negative", residues: "D E", color: "#c048c0" },
//   { label: "Polar", residues: "S T N Q", color: "#15c015" },
//   { label: "Aromatic/His", residues: "Y H", color: "#15a4a4" },
//   { label: "Glycine", residues: "G", color: "#f09048" },
//   { label: "Proline", residues: "P", color: "#c0c000" },
//   { label: "Cysteine", residues: "C", color: "#f08080" },
// ];

// export const AA_COLOR_LEGEND = [
//   { code: "A", name: "alanine", swatchClass: "bg-[#ff1a1a]" },
//   { code: "C", name: "cysteine", swatchClass: "bg-[#1f45ff]" },
//   { code: "D", name: "aspartic acid", swatchClass: "bg-[#6fd3ff]" },
//   { code: "E", name: "glutamic acid", swatchClass: "bg-[#f2c200]" },
//   { code: "F", name: "phenylalanine", swatchClass: "bg-[#7a35b8]" },
//   { code: "G", name: "glycine", swatchClass: "bg-[#bfbfbf]" },
//   { code: "H", name: "histidine", swatchClass: "bg-[#002a8f]" },
//   { code: "I", name: "isoleucine", swatchClass: "bg-[#14e514]" },
//   { code: "K", name: "lysine", swatchClass: "bg-[#f3f000]" },
//   { code: "L", name: "leucine", swatchClass: "bg-[#efb287]" },
//   { code: "M", name: "methionine", swatchClass: "bg-[#8ee8df]" },
//   { code: "N", name: "asparagine", swatchClass: "bg-[#b7d7f2]" },
//   { code: "P", name: "proline", swatchClass: "bg-[#c40000]" },
//   { code: "Q", name: "glutamine", swatchClass: "bg-[#ff00d8]" },
//   { code: "R", name: "arginine", swatchClass: "bg-[#9a4e16]" },
//   { code: "S", name: "serine", swatchClass: "bg-[#72db72]" },
//   { code: "T", name: "threonine", swatchClass: "bg-[#ff8a00]" },
//   { code: "V", name: "valine", swatchClass: "bg-[#deb3d8]" },
//   { code: "W", name: "tryptophan", swatchClass: "bg-[#b7b86a]" },
//   { code: "Y", name: "tyrosine", swatchClass: "bg-[#efc4ae]" },
// ] as const;

// ClustalX-style amino acid coloring
// Based on canonical ClustalX palette/grouping

export const AA_COLORS: Record<string, string> = {
  // hydrophobic (blue)
  A: "#80a0f0",
  I: "#80a0f0",
  L: "#80a0f0",
  M: "#80a0f0",
  F: "#80a0f0",
  W: "#80a0f0",
  V: "#80a0f0",

  // positive (red)
  K: "#f01505",
  R: "#f01505",

  // negative (magenta)
  D: "#c048c0",
  E: "#c048c0",

  // polar (green)
  S: "#15c015",
  T: "#15c015",
  N: "#15c015",
  Q: "#15c015",

  // aromatic / histidine (cyan)
  Y: "#15a4a4",
  H: "#15a4a4",

  // glycine (orange)
  G: "#f09048",

  // proline (yellow)
  P: "#c0c000",

  // cysteine (pink)
  C: "#f08080",

  // optional extras
  X: "#e5e7eb",
  B: "#d1d5db",
  Z: "#d1d5db",
  "-": "#f8fafc",
};

export const CLUSTALX_GROUPS = [
  { label: "Hydrophobic", residues: "A I L M F W V", color: "#80a0f0" },
  { label: "Positive", residues: "K R", color: "#f01505" },
  { label: "Negative", residues: "D E", color: "#c048c0" },
  { label: "Polar", residues: "S T N Q", color: "#15c015" },
  { label: "Aromatic/His", residues: "Y H", color: "#15a4a4" },
  { label: "Glycine", residues: "G", color: "#f09048" },
  { label: "Proline", residues: "P", color: "#c0c000" },
  { label: "Cysteine", residues: "C", color: "#f08080" },
] as const;

export const AA_COLOR_LEGEND = [
  { code: "A", name: "alanine", swatchClass: "bg-[#80a0f0]" },
  { code: "C", name: "cysteine", swatchClass: "bg-[#f08080]" },
  { code: "D", name: "aspartic acid", swatchClass: "bg-[#c048c0]" },
  { code: "E", name: "glutamic acid", swatchClass: "bg-[#c048c0]" },
  { code: "F", name: "phenylalanine", swatchClass: "bg-[#80a0f0]" },
  { code: "G", name: "glycine", swatchClass: "bg-[#f09048]" },
  { code: "H", name: "histidine", swatchClass: "bg-[#15a4a4]" },
  { code: "I", name: "isoleucine", swatchClass: "bg-[#80a0f0]" },
  { code: "K", name: "lysine", swatchClass: "bg-[#f01505]" },
  { code: "L", name: "leucine", swatchClass: "bg-[#80a0f0]" },
  { code: "M", name: "methionine", swatchClass: "bg-[#80a0f0]" },
  { code: "N", name: "asparagine", swatchClass: "bg-[#15c015]" },
  { code: "P", name: "proline", swatchClass: "bg-[#c0c000]" },
  { code: "Q", name: "glutamine", swatchClass: "bg-[#15c015]" },
  { code: "R", name: "arginine", swatchClass: "bg-[#f01505]" },
  { code: "S", name: "serine", swatchClass: "bg-[#15c015]" },
  { code: "T", name: "threonine", swatchClass: "bg-[#15c015]" },
  { code: "V", name: "valine", swatchClass: "bg-[#80a0f0]" },
  { code: "W", name: "tryptophan", swatchClass: "bg-[#80a0f0]" },
  { code: "Y", name: "tyrosine", swatchClass: "bg-[#15a4a4]" },
] as const;

export const AA_H = 16;
export const AA_W_COMPACT = 6;
export const AA_W_EXPANDED = 14;

// ══════════════════════════════════════════════════════════════════════════════
// Viz sub-components
// ══════════════════════════════════════════════════════════════════════════════
export function identityColor(v: number) { return `rgb(${Math.round(220 * (1 - v))},${Math.round(200 * v)},40)`; }
export function conservationColor(v: number) { return `rgb(0,${Math.round(180 * v)},${Math.round(255 * v)})`; }
