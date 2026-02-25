import {
  useState,
  useEffect,
  useRef,
  useCallback,
  type PointerEvent as ReactPointerEvent,
} from "react";
import {
  Box,
  LogOut,
  Check,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  RotateCw,
  RefreshCw,
  Save,
  Download,
  Maximize2,
  Minimize2,
  Sun,
  Moon,
  Layers,
  Grid3X3,
  Info,
  X,
  ChevronDown,
  CheckCircle2,
  AlertCircle,
  Cpu,
  ArrowLeft,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate } from "react-router";

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────
type ViewMode = "3D" | "2D";
type Theme = "light" | "dark";
type Quality = "High" | "Medium" | "Low";

interface FurnitureItem {
  id: string;
  label: string;
  description: string;
  // 3D Isometric floor position (grid units)
  x: number;
  y: number;
  w: number;
  d: number;
  h: number;
  colorTop: string;
  colorFront: string;
  colorSide: string;
}

// ─────────────────────────────────────────────
// Step Indicator
// ─────────────────────────────────────────────
const STEPS = [
  { label: "Upload", step: 1 },
  { label: "Detect", step: 2 },
  { label: "Select Room", step: 3 },
  { label: "Layouts", step: 4 },
  { label: "Confirm", step: 5 },
  { label: "3D View", step: 6 },
];

function StepIndicator({ current }: { current: number }) {
  return (
    <div className="flex items-center justify-center gap-0 flex-wrap select-none">
      {STEPS.map((s, i) => {
        const isDone = s.step < current;
        const isActive = s.step === current;
        return (
          <div key={s.step} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold border-2 transition-all duration-300 ${
                  isDone
                    ? "bg-gradient-to-br from-blue-600 to-indigo-700 border-indigo-700 text-white"
                    : isActive
                    ? "bg-white border-indigo-600 text-indigo-700 shadow-md shadow-indigo-200"
                    : "bg-white border-gray-300 text-gray-400"
                }`}
              >
                {isDone ? <Check className="w-3.5 h-3.5" /> : s.step}
              </div>
              <span
                className={`mt-1 text-[9px] font-medium whitespace-nowrap ${
                  isActive ? "text-indigo-700" : isDone ? "text-blue-600" : "text-gray-400"
                }`}
              >
                {s.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className={`h-0.5 w-6 md:w-8 mb-4 mx-0.5 transition-all duration-500 ${
                  s.step < current
                    ? "bg-gradient-to-r from-blue-600 to-indigo-700"
                    : "bg-gray-200"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─────────────────────────────────────────────
// Isometric 3D Room Renderer (SVG + CSS)
// ─────────────────────────────────────────────

// Convert 3D iso grid coordinates → 2D SVG screen coords
const ISO_TILE = 32; // pixels per grid unit (width of one tile face)

function isoProject(x: number, y: number, z: number) {
  // Classic 2:1 isometric projection
  const sx = (x - y) * ISO_TILE;
  const sy = (x + y) * ISO_TILE * 0.5 - z * ISO_TILE * 0.65;
  return { sx, sy };
}

function IsoBox({
  x,
  y,
  w,
  d,
  h,
  colorTop,
  colorFront,
  colorSide,
  onClick,
  highlighted,
}: FurnitureItem & { onClick?: () => void; highlighted: boolean }) {
  // 8 corners of the box
  const corners = [
    isoProject(x, y, 0),       // 0: bottom-front-left
    isoProject(x + w, y, 0),   // 1: bottom-front-right
    isoProject(x + w, y + d, 0), // 2: bottom-back-right
    isoProject(x, y + d, 0),   // 3: bottom-back-left
    isoProject(x, y, h),       // 4: top-front-left
    isoProject(x + w, y, h),   // 5: top-front-right
    isoProject(x + w, y + d, h), // 6: top-back-right
    isoProject(x, y + d, h),   // 7: top-back-left
  ];

  const pts = (indices: number[]) =>
    indices.map((i) => `${corners[i].sx},${corners[i].sy}`).join(" ");

  const glowStyle = highlighted
    ? { filter: "drop-shadow(0 0 6px rgba(99,102,241,0.8))" }
    : {};

  return (
    <g
      onClick={onClick}
      style={{ cursor: "pointer", ...glowStyle }}
      className="transition-all duration-300"
    >
      {/* Left face (front-left) */}
      <polygon
        points={pts([0, 4, 7, 3])}
        fill={colorSide}
        stroke={highlighted ? "#6366f1" : "rgba(0,0,0,0.12)"}
        strokeWidth={highlighted ? "1.5" : "0.8"}
      />
      {/* Right face (front-right) */}
      <polygon
        points={pts([1, 5, 4, 0])}
        fill={colorFront}
        stroke={highlighted ? "#6366f1" : "rgba(0,0,0,0.12)"}
        strokeWidth={highlighted ? "1.5" : "0.8"}
      />
      {/* Top face */}
      <polygon
        points={pts([4, 5, 6, 7])}
        fill={colorTop}
        stroke={highlighted ? "#6366f1" : "rgba(0,0,0,0.08)"}
        strokeWidth={highlighted ? "1.5" : "0.8"}
      />
    </g>
  );
}

// ─────────────────────────────────────────────
// Furniture dataset (isometric grid units)
// ─────────────────────────────────────────────
const FURNITURE: FurnitureItem[] = [
  {
    id: "bed",
    label: "Double Bed",
    description: "King-size bed placed along north wall. Optimal clearance on both sides.",
    x: 1, y: 1, w: 4, d: 5.5, h: 1.2,
    colorTop: "#dbeafe", colorFront: "#bfdbfe", colorSide: "#93c5fd",
  },
  {
    id: "mattress",
    label: "Mattress",
    description: "Memory foam mattress with pillow-top finish.",
    x: 1.3, y: 1.3, w: 3.4, d: 5, h: 0.4,
    colorTop: "#ede9fe", colorFront: "#ddd6fe", colorSide: "#c4b5fd",
  },
  {
    id: "pillow_l",
    label: "Pillow (Left)",
    description: "Ergonomic pillow positioned for left-side sleeper.",
    x: 1.4, y: 1.4, w: 1.2, d: 0.9, h: 0.3,
    colorTop: "#fafafa", colorFront: "#f3f4f6", colorSide: "#e5e7eb",
  },
  {
    id: "pillow_r",
    label: "Pillow (Right)",
    description: "Ergonomic pillow positioned for right-side sleeper.",
    x: 3.4, y: 1.4, w: 1.2, d: 0.9, h: 0.3,
    colorTop: "#fafafa", colorFront: "#f3f4f6", colorSide: "#e5e7eb",
  },
  {
    id: "nightstand_l",
    label: "Nightstand (Left)",
    description: "Bedside table with drawer. Easy lamp and book access.",
    x: 0, y: 1.5, w: 1, d: 1, h: 0.9,
    colorTop: "#fef3c7", colorFront: "#fde68a", colorSide: "#fcd34d",
  },
  {
    id: "nightstand_r",
    label: "Nightstand (Right)",
    description: "Matching bedside table on the right side.",
    x: 5, y: 1.5, w: 1, d: 1, h: 0.9,
    colorTop: "#fef3c7", colorFront: "#fde68a", colorSide: "#fcd34d",
  },
  {
    id: "wardrobe",
    label: "Wardrobe",
    description: "Full-height wardrobe. 180cm x 60cm footprint. Sliding doors.",
    x: 5, y: 0, w: 2, d: 3, h: 3.2,
    colorTop: "#d1fae5", colorFront: "#a7f3d0", colorSide: "#6ee7b7",
  },
  {
    id: "desk",
    label: "Study Desk",
    description: "120cm wide desk near window. Natural light workspace.",
    x: 0, y: 7, w: 3, d: 1.5, h: 0.9,
    colorTop: "#fef9c3", colorFront: "#fef08a", colorSide: "#fde047",
  },
  {
    id: "monitor",
    label: "Monitor",
    description: "24-inch monitor on desk.",
    x: 0.5, y: 7.2, w: 1.5, d: 0.1, h: 0.7,
    colorTop: "#1e293b", colorFront: "#0f172a", colorSide: "#334155",
  },
  {
    id: "chair",
    label: "Office Chair",
    description: "Ergonomic adjustable chair for desk workstation.",
    x: 0.5, y: 8.6, w: 1.5, d: 1.5, h: 1.1,
    colorTop: "#e0e7ff", colorFront: "#c7d2fe", colorSide: "#a5b4fc",
  },
  {
    id: "dresser",
    label: "Dresser",
    description: "4-drawer dresser. Storage for clothing and accessories.",
    x: 3, y: 7.5, w: 2, d: 1.2, h: 1.3,
    colorTop: "#ffe4e6", colorFront: "#fecdd3", colorSide: "#fda4af",
  },
  {
    id: "rug",
    label: "Floor Rug",
    description: "Decorative area rug. 200cm x 160cm. Adds warmth to the room.",
    x: 0.5, y: 0.5, w: 6, d: 6, h: 0.05,
    colorTop: "#f0fdf4", colorFront: "#dcfce7", colorSide: "#bbf7d0",
  },
  {
    id: "lamp_l",
    label: "Bedside Lamp (L)",
    description: "LED bedside lamp with warm light setting.",
    x: 0.3, y: 1.8, w: 0.4, d: 0.4, h: 1.6,
    colorTop: "#fef9c3", colorFront: "#fef08a", colorSide: "#fde047",
  },
  {
    id: "lamp_r",
    label: "Bedside Lamp (R)",
    description: "LED bedside lamp with warm light setting.",
    x: 5.3, y: 1.8, w: 0.4, d: 0.4, h: 1.6,
    colorTop: "#fef9c3", colorFront: "#fef08a", colorSide: "#fde047",
  },
];

// ─────────────────────────────────────────────
// 2D Floor Plan Component
// ─────────────────────────────────────────────
function FloorPlan2D({ darkMode }: { darkMode: boolean }) {
  const bg = darkMode ? "#1e293b" : "#f8fafc";
  const wallColor = darkMode ? "#6366f1" : "#3730a3";
  const gridColor = darkMode ? "#334155" : "#e2e8f0";
  const textColor = darkMode ? "#a5b4fc" : "#6366f1";

  const scale = 28;
  const furniture2D = [
    { x: 1, y: 1, w: 4, d: 5.5, color: "#bfdbfe", label: "Bed" },
    { x: 0, y: 1.5, w: 1, d: 1, color: "#fde68a", label: "NS" },
    { x: 5, y: 1.5, w: 1, d: 1, color: "#fde68a", label: "NS" },
    { x: 5, y: 0, w: 2, d: 3, color: "#a7f3d0", label: "Wardrobe" },
    { x: 0, y: 7, w: 3, d: 1.5, color: "#fef08a", label: "Desk" },
    { x: 0.5, y: 8.6, w: 1.5, d: 1.5, color: "#c7d2fe", label: "Chair" },
    { x: 3, y: 7.5, w: 2, d: 1.2, color: "#fecdd3", label: "Dresser" },
    { x: 0.5, y: 0.5, w: 6, d: 6, color: "none", label: "", stroke: "#bbf7d0" },
  ];

  const roomW = 8 * scale;
  const roomH = 11 * scale;
  const pad = 20;

  return (
    <svg
      viewBox={`0 0 ${roomW + pad * 2} ${roomH + pad * 2}`}
      style={{ width: "100%", height: "100%", maxHeight: 480, background: bg }}
    >
      {/* Grid */}
      {Array.from({ length: 9 }).map((_, i) => (
        <line
          key={`gx${i}`}
          x1={pad + i * scale}
          y1={pad}
          x2={pad + i * scale}
          y2={pad + roomH}
          stroke={gridColor}
          strokeWidth="0.5"
        />
      ))}
      {Array.from({ length: 12 }).map((_, i) => (
        <line
          key={`gy${i}`}
          x1={pad}
          y1={pad + i * scale}
          x2={pad + roomW}
          y2={pad + i * scale}
          stroke={gridColor}
          strokeWidth="0.5"
        />
      ))}
      {/* Room outline */}
      <rect
        x={pad}
        y={pad}
        width={roomW}
        height={roomH}
        fill="none"
        stroke={wallColor}
        strokeWidth="3"
        rx="2"
      />
      {/* Door arc */}
      <path
        d={`M ${pad} ${pad + roomH - 40} Q ${pad + 40} ${pad + roomH - 40} ${pad + 40} ${pad + roomH}`}
        fill="none"
        stroke={wallColor}
        strokeWidth="1.2"
        strokeDasharray="4,2"
      />
      {/* Window */}
      <line
        x1={pad + 3 * scale}
        y1={pad}
        x2={pad + 5 * scale}
        y2={pad}
        stroke="#60a5fa"
        strokeWidth="4"
      />
      {/* Furniture */}
      {furniture2D.map((f, i) => (
        <g key={i}>
          <rect
            x={pad + f.x * scale}
            y={pad + f.y * scale}
            width={f.w * scale}
            height={f.d * scale}
            fill={f.color === "none" ? "transparent" : f.color}
            stroke={f.stroke ?? (darkMode ? "#475569" : "#94a3b8")}
            strokeWidth="1"
            rx="2"
            fillOpacity={f.color === "none" ? 0 : 0.7}
            strokeDasharray={f.color === "none" ? "4,3" : "none"}
          />
          {f.label && f.label !== "NS" && (
            <text
              x={pad + (f.x + f.w / 2) * scale}
              y={pad + (f.y + f.d / 2) * scale + 4}
              textAnchor="middle"
              fontSize="7"
              fill={textColor}
              fontFamily="sans-serif"
              fontWeight="bold"
            >
              {f.label}
            </text>
          )}
        </g>
      ))}
      {/* Dimensions */}
      <text x={pad + roomW / 2} y={pad + roomH + 15} textAnchor="middle" fontSize="9" fill={textColor} fontFamily="sans-serif">
        14 ft
      </text>
      <text
        x={pad - 10}
        y={pad + roomH / 2}
        textAnchor="middle"
        fontSize="9"
        fill={textColor}
        fontFamily="sans-serif"
        transform={`rotate(-90, ${pad - 10}, ${pad + roomH / 2})`}
      >
        12 ft
      </text>
    </svg>
  );
}

// ─────────────────────────────────────────────
// Isometric 3D Room SVG
// ─────────────────────────────────────────────
function IsoRoom3D({
  rotate,
  zoom,
  darkMode,
  onFurnitureClick,
  highlightId,
}: {
  rotate: number;
  zoom: number;
  darkMode: boolean;
  onFurnitureClick: (id: string) => void;
  highlightId: string | null;
}) {
  const CX = 300;
  const CY = 200;
  const bg = darkMode ? "#0f172a" : "#f8fafc";
  const floorColor = darkMode ? "#1e293b" : "#f1f5f9";
  const wallColor = darkMode ? "#1e293b" : "#e2e8f0";
  const wallStroke = darkMode ? "#334155" : "#cbd5e1";
  const gridC = darkMode ? "#1e293b" : "#e2e8f0";

  // Room corners (10 x 12 grid)
  const RW = 8;
  const RD = 11;
  const RH = 4;

  const floor = [
    isoProject(0, 0, 0),
    isoProject(RW, 0, 0),
    isoProject(RW, RD, 0),
    isoProject(0, RD, 0),
  ];
  const wallBack1 = [
    isoProject(0, 0, 0),
    isoProject(RW, 0, 0),
    isoProject(RW, 0, RH),
    isoProject(0, 0, RH),
  ];
  const wallBack2 = [
    isoProject(0, 0, 0),
    isoProject(0, RD, 0),
    isoProject(0, RD, RH),
    isoProject(0, 0, RH),
  ];

  const pts = (corners: { sx: number; sy: number }[]) =>
    corners.map((c) => `${CX + c.sx},${CY + c.sy}`).join(" ");

  // Ceiling edges
  const ceiling = [
    isoProject(0, 0, RH),
    isoProject(RW, 0, RH),
    isoProject(0, RD, RH),
  ];

  return (
    <svg
      viewBox="0 0 600 420"
      style={{
        width: "100%",
        height: "100%",
        background: bg,
        transform: `scale(${zoom}) rotate(${rotate}deg)`,
        transformOrigin: "center center",
        transition: "transform 0.35s cubic-bezier(0.25,0.46,0.45,0.94)",
      }}
    >
      {/* ── Ambient light glow ── */}
      <defs>
        <radialGradient id="ambientGlow" cx="50%" cy="40%" r="55%">
          <stop offset="0%" stopColor={darkMode ? "#1e40af" : "#dbeafe"} stopOpacity="0.3" />
          <stop offset="100%" stopColor={darkMode ? "#0f172a" : "#f8fafc"} stopOpacity="0" />
        </radialGradient>
        <filter id="softShadow">
          <feDropShadow dx="1" dy="2" stdDeviation="2" floodColor="rgba(0,0,0,0.18)" />
        </filter>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <rect width="600" height="420" fill={bg} />
      <ellipse cx="300" cy="160" rx="280" ry="130" fill="url(#ambientGlow)" />

      {/* ── Floor ── */}
      <polygon points={pts(floor)} fill={floorColor} stroke={wallStroke} strokeWidth="1" />

      {/* Floor grid */}
      {Array.from({ length: RW }).map((_, i) => {
        const a = isoProject(i, 0, 0);
        const b = isoProject(i, RD, 0);
        return (
          <line
            key={`fgx${i}`}
            x1={CX + a.sx}
            y1={CY + a.sy}
            x2={CX + b.sx}
            y2={CY + b.sy}
            stroke={gridC}
            strokeWidth="0.5"
          />
        );
      })}
      {Array.from({ length: RD }).map((_, i) => {
        const a = isoProject(0, i, 0);
        const b = isoProject(RW, i, 0);
        return (
          <line
            key={`fgy${i}`}
            x1={CX + a.sx}
            y1={CY + a.sy}
            x2={CX + b.sx}
            y2={CY + b.sy}
            stroke={gridC}
            strokeWidth="0.5"
          />
        );
      })}

      {/* ── Back walls ── */}
      <polygon points={pts(wallBack2)} fill={wallColor} stroke={wallStroke} strokeWidth="1" />
      <polygon points={pts(wallBack1)} fill={wallColor} stroke={wallStroke} strokeWidth="1" />

      {/* Window on back wall 1 */}
      {(() => {
        const wl = isoProject(3, 0, 1.5);
        const wr = isoProject(5, 0, 1.5);
        const wlt = isoProject(3, 0, 3);
        const wrt = isoProject(5, 0, 3);
        return (
          <polygon
            points={`${CX+wl.sx},${CY+wl.sy} ${CX+wr.sx},${CY+wr.sy} ${CX+wrt.sx},${CY+wrt.sy} ${CX+wlt.sx},${CY+wlt.sy}`}
            fill={darkMode ? "#1e4070" : "#bfdbfe"}
            stroke="#60a5fa"
            strokeWidth="1.5"
            opacity="0.85"
          />
        );
      })()}

      {/* Light beam from window */}
      {(() => {
        const wl = isoProject(3.2, 0, 1.6);
        const wr = isoProject(4.8, 0, 1.6);
        const fl = isoProject(1.5, 5, 0);
        const fr = isoProject(6, 5, 0);
        return (
          <polygon
            points={`${CX+wl.sx},${CY+wl.sy} ${CX+wr.sx},${CY+wr.sy} ${CX+fr.sx},${CY+fr.sy} ${CX+fl.sx},${CY+fl.sy}`}
            fill={darkMode ? "#1e3a5f" : "#eff6ff"}
            opacity="0.25"
          />
        );
      })()}

      {/* Door on side wall */}
      {(() => {
        const db = isoProject(0, 9, 0);
        const dt = isoProject(0, 9, 2.5);
        const dt2 = isoProject(0, 10.5, 2.5);
        const db2 = isoProject(0, 10.5, 0);
        return (
          <polygon
            points={`${CX+db.sx},${CY+db.sy} ${CX+dt.sx},${CY+dt.sy} ${CX+dt2.sx},${CY+dt2.sy} ${CX+db2.sx},${CY+db2.sy}`}
            fill={darkMode ? "#2d3748" : "#e2e8f0"}
            stroke={wallStroke}
            strokeWidth="1"
          />
        );
      })()}

      {/* ── Furniture (ordered back to front) ── */}
      <g filter="url(#softShadow)">
        {[...FURNITURE]
          .sort((a, b) => (a.x + a.y) - (b.x + b.y))
          .map((item) => (
            <IsoBox
              key={item.id}
              {...item}
              highlighted={highlightId === item.id}
              onClick={() => onFurnitureClick(item.id)}
            />
          ))
          .map((el, i) => {
            const item = [...FURNITURE].sort((a, b) => (a.x + a.y) - (b.x + b.y))[i];
            return (
              <g key={item.id} transform={`translate(${CX}, ${CY})`}>
                {el}
              </g>
            );
          })}
      </g>

      {/* ── Ceiling edges ── */}
      <line
        x1={CX + ceiling[0].sx}
        y1={CY + ceiling[0].sy}
        x2={CX + ceiling[1].sx}
        y2={CY + ceiling[1].sy}
        stroke={wallStroke}
        strokeWidth="1.5"
        strokeDasharray="4,3"
        opacity="0.6"
      />
      <line
        x1={CX + ceiling[0].sx}
        y1={CY + ceiling[0].sy}
        x2={CX + ceiling[2].sx}
        y2={CY + ceiling[2].sy}
        stroke={wallStroke}
        strokeWidth="1.5"
        strokeDasharray="4,3"
        opacity="0.6"
      />

      {/* ── Ceiling light fixture ── */}
      {(() => {
        const lc = isoProject(4, 4, RH);
        return (
          <>
            <circle
              cx={CX + lc.sx}
              cy={CY + lc.sy}
              r="10"
              fill={darkMode ? "#fef9c3" : "#fef3c7"}
              stroke="#fde68a"
              strokeWidth="1.5"
              filter="url(#glow)"
              opacity="0.9"
            />
            <circle cx={CX + lc.sx} cy={CY + lc.sy} r="5" fill="#fef08a" opacity="1" />
          </>
        );
      })()}

      {/* Furniture labels on hover */}
      {highlightId && (() => {
        const item = FURNITURE.find((f) => f.id === highlightId);
        if (!item) return null;
        const center = isoProject(item.x + item.w / 2, item.y + item.d / 2, item.h + 0.3);
        return (
          <g>
            <rect
              x={CX + center.sx - 45}
              y={CY + center.sy - 22}
              width="90"
              height="18"
              rx="9"
              fill={darkMode ? "#1e40af" : "#3730a3"}
              opacity="0.92"
            />
            <text
              x={CX + center.sx}
              y={CY + center.sy - 10}
              textAnchor="middle"
              fontSize="9"
              fontWeight="bold"
              fill="white"
              fontFamily="sans-serif"
            >
              {item.label}
            </text>
          </g>
        );
      })()}
    </svg>
  );
}

// ─────────────────────────────────────────────
// Export Dropdown
// ─────────────────────────────────────────────
function ExportDropdown({ darkMode }: { darkMode: boolean }) {
  const [open, setOpen] = useState(false);
  const [exported, setExported] = useState<string | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fn = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, []);

  const handleExport = (type: string) => {
    setOpen(false);
    setExported(type);
    setTimeout(() => setExported(null), 2500);
  };

  return (
    <div className="relative" ref={ref}>
      <motion.button
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.97 }}
        onClick={() => setOpen((p) => !p)}
        className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 rounded-xl text-sm font-semibold shadow-sm transition-all"
      >
        <Download className="w-4 h-4" />
        Export
        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${open ? "rotate-180" : ""}`} />
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.95 }}
            className="absolute right-0 top-12 z-50 w-52 bg-white border border-gray-200 rounded-2xl shadow-xl overflow-hidden"
          >
            {[
              { icon: "🖼️", label: "Download as PNG", sub: "High-res image" },
              { icon: "📦", label: "Export 3D Model", sub: "GLTF / GLB format" },
              { icon: "📄", label: "Export PDF Summary", sub: "Layout report" },
            ].map((opt) => (
              <button
                key={opt.label}
                onClick={() => handleExport(opt.label)}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-indigo-50 text-left transition-colors"
              >
                <span className="text-lg">{opt.icon}</span>
                <div>
                  <p className="text-sm font-semibold text-gray-800">{opt.label}</p>
                  <p className="text-[11px] text-gray-400">{opt.sub}</p>
                </div>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {exported && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="absolute right-0 top-14 z-50 flex items-center gap-2 bg-green-600 text-white text-xs font-semibold px-3 py-2 rounded-xl shadow-lg whitespace-nowrap"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            {exported} — Done!
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─────────────────────────────────────────────
// Main Page
// ─────────────────────────────────────────────
export default function RoomView3D() {
  const navigate = useNavigate();
  const username = "John Smith";

  // Viewer states
  const [isLoading, setIsLoading] = useState(true);
  const [hasError] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("3D");
  const [darkMode, setDarkMode] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [quality, setQuality] = useState<Quality>("High");

  // 3D camera controls
  const [rotate, setRotate] = useState(0);
  const [zoom, setZoom] = useState(1);

  // Interaction
  const [isDragging, setIsDragging] = useState(false);
  const lastPointerX = useRef(0);
  const viewerRef = useRef<HTMLDivElement>(null);

  // Furniture tooltip
  const [hoveredFurniture, setHoveredFurniture] = useState<string | null>(null);
  const [savedMsg, setSavedMsg] = useState(false);

  // Simulate render loading
  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 2600);
    return () => clearTimeout(t);
  }, []);

  // Pointer drag → rotate
  const handlePointerDown = useCallback((e: ReactPointerEvent<HTMLDivElement>) => {
    setIsDragging(true);
    lastPointerX.current = e.clientX;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }, []);

  const handlePointerMove = useCallback(
    (e: ReactPointerEvent<HTMLDivElement>) => {
      if (!isDragging) return;
      const delta = e.clientX - lastPointerX.current;
      lastPointerX.current = e.clientX;
      setRotate((r) => r + delta * 0.4);
    },
    [isDragging]
  );

  const handlePointerUp = useCallback(() => setIsDragging(false), []);

  // Wheel → zoom
  const handleWheel = useCallback((e: React.WheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    setZoom((z) => Math.min(2.2, Math.max(0.5, z - e.deltaY * 0.001)));
  }, []);

  const handleSave = () => {
    setSavedMsg(true);
    setTimeout(() => setSavedMsg(false), 2800);
  };

  const hoveredItem = FURNITURE.find((f) => f.id === hoveredFurniture) ?? null;

  const qualityColors: Record<Quality, string> = {
    High: "text-green-600 bg-green-50 border-green-200",
    Medium: "text-yellow-600 bg-yellow-50 border-yellow-200",
    Low: "text-red-500 bg-red-50 border-red-200",
  };

  return (
    <div
      className={`min-h-screen w-full relative transition-colors duration-500 ${
        darkMode
          ? "bg-gray-950"
          : "bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50"
      }`}
    >
      {/* Blueprint grid */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(99,102,241,0.8) 1px, transparent 1px),
              linear-gradient(90deg, rgba(99,102,241,0.8) 1px, transparent 1px)
            `,
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      {/* ── Navigation ── */}
      <nav
        className={`relative shadow-md border-b z-30 ${
          darkMode ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200"
        }`}
      >
        <div className="px-4 md:px-8 py-4">
          <div className="flex items-center justify-between">
            <div
              className="flex items-center gap-3 cursor-pointer"
              onClick={() => navigate("/dashboard")}
            >
              <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-2 rounded-xl shadow-lg">
                <Box className="w-8 h-8 text-white" strokeWidth={1.5} />
              </div>
              <div className="hidden md:block">
                <h1 className={`text-lg font-bold ${darkMode ? "text-white" : "text-gray-800"}`}>
                  3D Layout System
                </h1>
                <p className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                  AI-Powered Design
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden md:block text-right">
                <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                  Welcome back,
                </p>
                <p className={`font-semibold ${darkMode ? "text-white" : "text-gray-800"}`}>
                  {username} 👋
                </p>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/")}
                className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline text-sm font-medium">Logout</span>
              </motion.button>
            </div>
          </div>
        </div>
      </nav>

      {/* ── Main ── */}
      <main className="relative px-4 md:px-8 py-6 md:py-8 max-w-[1400px] mx-auto">

        {/* Step Indicator */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div
            className={`rounded-2xl shadow-sm border px-6 py-4 flex justify-center ${
              darkMode ? "bg-gray-900 border-gray-800" : "bg-white border-gray-100"
            }`}
          >
            <StepIndicator current={6} />
          </div>
        </motion.div>

        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-5 flex flex-col sm:flex-row sm:items-end justify-between gap-3"
        >
          <div>
            <h2 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent">
              3D Room Visualization
            </h2>
            <p className={`mt-1.5 text-sm md:text-base ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
              Explore your optimized bedroom layout in an interactive 3D environment.
            </p>
          </div>

          {/* Toolbar */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* 2D / 3D Toggle */}
            <div
              className={`flex rounded-xl border overflow-hidden shadow-sm ${
                darkMode ? "border-gray-700" : "border-gray-200"
              }`}
            >
              {(["3D", "2D"] as ViewMode[]).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  className={`px-4 py-2 text-sm font-bold transition-all flex items-center gap-1.5 ${
                    viewMode === mode
                      ? "bg-gradient-to-r from-blue-600 to-indigo-700 text-white"
                      : darkMode
                      ? "bg-gray-800 text-gray-300 hover:bg-gray-700"
                      : "bg-white text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {mode === "3D" ? <Layers className="w-3.5 h-3.5" /> : <Grid3X3 className="w-3.5 h-3.5" />}
                  {mode}
                </button>
              ))}
            </div>

            {/* Dark/Light toggle */}
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setDarkMode((p) => !p)}
              className={`p-2.5 rounded-xl border shadow-sm transition-all ${
                darkMode
                  ? "bg-gray-800 border-gray-700 text-yellow-400 hover:bg-gray-700"
                  : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
              title={darkMode ? "Light mode" : "Dark mode"}
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </motion.button>

            {/* Fullscreen */}
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsFullscreen((p) => !p)}
              className={`p-2.5 rounded-xl border shadow-sm transition-all ${
                darkMode
                  ? "bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700"
                  : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
              title="Toggle fullscreen"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </motion.button>
          </div>
        </motion.div>

        {/* ── Content Grid ── */}
        <div className={`grid gap-5 ${isFullscreen ? "grid-cols-1" : "grid-cols-1 xl:grid-cols-4"}`}>

          {/* ── 3D Viewer ── */}
          <motion.div
            layout
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15 }}
            className={`${isFullscreen ? "col-span-1" : "xl:col-span-3"} relative`}
          >
            <div
              className={`rounded-3xl overflow-hidden shadow-2xl border transition-colors duration-500 ${
                darkMode ? "border-gray-700" : "border-gray-200"
              }`}
              style={{ minHeight: isFullscreen ? "80vh" : 480 }}
            >
              {/* Viewer header bar */}
              <div
                className={`flex items-center justify-between px-4 py-3 border-b ${
                  darkMode
                    ? "bg-gray-900/90 border-gray-700"
                    : "bg-white/90 border-gray-200"
                } backdrop-blur-sm`}
              >
                <div className="flex items-center gap-3">
                  <div className="flex gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-red-400" />
                    <span className="w-3 h-3 rounded-full bg-yellow-400" />
                    <span className="w-3 h-3 rounded-full bg-green-400" />
                  </div>
                  <span className={`text-xs font-semibold ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                    {viewMode === "3D" ? "Isometric 3D · Bedroom 1 · Layout A" : "2D Floor Plan · Bedroom 1"}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  {/* Quality badge */}
                  <select
                    value={quality}
                    onChange={(e) => setQuality(e.target.value as Quality)}
                    className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border cursor-pointer outline-none ${qualityColors[quality]} bg-transparent`}
                  >
                    {["High", "Medium", "Low"].map((q) => (
                      <option key={q} value={q}>{q}</option>
                    ))}
                  </select>
                  {/* Performance indicator */}
                  <div className="flex items-center gap-1.5">
                    <Cpu className={`w-3.5 h-3.5 ${darkMode ? "text-indigo-400" : "text-indigo-500"}`} />
                    <span
                      className={`text-[11px] font-semibold ${
                        darkMode ? "text-indigo-400" : "text-indigo-600"
                      }`}
                    >
                      60 FPS
                    </span>
                  </div>
                </div>
              </div>

              {/* Viewer canvas */}
              <div
                ref={viewerRef}
                className="relative w-full"
                style={{
                  height: isFullscreen ? "calc(80vh - 48px)" : 432,
                  cursor: isDragging ? "grabbing" : "grab",
                }}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerLeave={handlePointerUp}
                onWheel={handleWheel}
              >
                {/* Loading overlay */}
                <AnimatePresence>
                  {isLoading && (
                    <motion.div
                      initial={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className={`absolute inset-0 z-20 flex flex-col items-center justify-center gap-4 ${
                        darkMode ? "bg-gray-900" : "bg-slate-50"
                      }`}
                    >
                      {/* Spinning cube loader */}
                      <div className="relative w-20 h-20">
                        <motion.div
                          animate={{ rotateY: 360, rotateX: 20 }}
                          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                          style={{ transformStyle: "preserve-3d" }}
                          className="w-16 h-16 mx-auto mt-2"
                        >
                          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg flex items-center justify-center">
                            <Box className="w-8 h-8 text-white" strokeWidth={1.5} />
                          </div>
                        </motion.div>
                        <motion.div
                          animate={{ rotate: -360 }}
                          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                          className="absolute inset-0 rounded-full border-2 border-indigo-400 border-dashed opacity-50"
                        />
                      </div>
                      <div className="text-center">
                        <p className={`font-bold text-base ${darkMode ? "text-white" : "text-gray-800"}`}>
                          Rendering 3D Scene…
                        </p>
                        <p className={`text-sm mt-1 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                          Applying lighting, shadows & furniture
                        </p>
                      </div>
                      {/* Progress bar */}
                      <div className={`w-56 h-1.5 rounded-full overflow-hidden ${darkMode ? "bg-gray-700" : "bg-gray-200"}`}>
                        <motion.div
                          initial={{ width: "0%" }}
                          animate={{ width: "100%" }}
                          transition={{ duration: 2.6, ease: "easeInOut" }}
                          className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full"
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Error state */}
                {hasError && (
                  <div
                    className={`absolute inset-0 z-20 flex flex-col items-center justify-center gap-4 ${
                      darkMode ? "bg-gray-900" : "bg-white"
                    }`}
                  >
                    <div className="bg-red-100 p-4 rounded-2xl">
                      <AlertCircle className="w-10 h-10 text-red-500" />
                    </div>
                    <p className="font-bold text-gray-800">3D Generation Failed</p>
                    <p className="text-gray-500 text-sm text-center max-w-xs">
                      3D generation failed. Please try again or go back and re-select a layout.
                    </p>
                    <motion.button
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.97 }}
                      className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-xl font-semibold text-sm shadow-md"
                    >
                      <RefreshCw className="w-4 h-4" />
                      Retry
                    </motion.button>
                  </div>
                )}

                {/* 3D Scene */}
                {!isLoading && !hasError && viewMode === "3D" && (
                  <IsoRoom3D
                    rotate={rotate}
                    zoom={zoom}
                    darkMode={darkMode}
                    onFurnitureClick={setHoveredFurniture}
                    highlightId={hoveredFurniture}
                  />
                )}

                {/* 2D Floor Plan */}
                {!isLoading && !hasError && viewMode === "2D" && (
                  <div className="w-full h-full flex items-center justify-center p-4">
                    <FloorPlan2D darkMode={darkMode} />
                  </div>
                )}

                {/* Drag hint */}
                {!isLoading && viewMode === "3D" && (
                  <div
                    className={`absolute bottom-3 left-1/2 -translate-x-1/2 text-[11px] font-medium px-3 py-1.5 rounded-full backdrop-blur-sm border pointer-events-none select-none ${
                      darkMode
                        ? "bg-black/40 border-gray-700 text-gray-400"
                        : "bg-white/70 border-gray-200 text-gray-500"
                    }`}
                  >
                    Drag to rotate · Scroll to zoom · Click furniture for info
                  </div>
                )}

                {/* ── Camera Controls (bottom-right) ── */}
                {!isLoading && viewMode === "3D" && (
                  <div
                    className={`absolute bottom-4 right-4 flex flex-col gap-2 z-10`}
                  >
                    {[
                      {
                        icon: ZoomIn,
                        title: "Zoom In",
                        action: () => setZoom((z) => Math.min(2.2, z + 0.15)),
                      },
                      {
                        icon: ZoomOut,
                        title: "Zoom Out",
                        action: () => setZoom((z) => Math.max(0.5, z - 0.15)),
                      },
                      {
                        icon: RotateCcw,
                        title: "Rotate Left",
                        action: () => setRotate((r) => r - 15),
                      },
                      {
                        icon: RotateCw,
                        title: "Rotate Right",
                        action: () => setRotate((r) => r + 15),
                      },
                      {
                        icon: RefreshCw,
                        title: "Reset View",
                        action: () => { setRotate(0); setZoom(1); },
                      },
                    ].map(({ icon: Icon, title, action }) => (
                      <motion.button
                        key={title}
                        whileHover={{ scale: 1.12 }}
                        whileTap={{ scale: 0.92 }}
                        onClick={action}
                        title={title}
                        className={`w-9 h-9 flex items-center justify-center rounded-xl border shadow-md transition-all ${
                          darkMode
                            ? "bg-gray-800/90 border-gray-700 text-gray-300 hover:bg-gray-700"
                            : "bg-white/90 border-gray-200 text-gray-600 hover:bg-indigo-50 hover:text-indigo-700"
                        } backdrop-blur-sm`}
                      >
                        <Icon className="w-4 h-4" />
                      </motion.button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* ── Right Panel ── */}
          {!isFullscreen && (
            <div className="xl:col-span-1 flex flex-col gap-4">

              {/* Room Info */}
              <motion.div
                initial={{ opacity: 0, x: 18 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className={`rounded-2xl border shadow-md p-5 ${
                  darkMode ? "bg-gray-900 border-gray-700" : "bg-white border-gray-100"
                }`}
              >
                <h4
                  className={`text-sm font-bold mb-3 flex items-center gap-2 ${
                    darkMode ? "text-white" : "text-gray-700"
                  }`}
                >
                  <Box className="w-4 h-4 text-indigo-500" />
                  Layout Details
                </h4>
                <div className="space-y-2">
                  {[
                    { label: "Room", value: "Bedroom 1" },
                    { label: "Layout", value: "Layout A" },
                    { label: "Score", value: "92/100 ✦" },
                    { label: "Area", value: "168 sq ft" },
                    { label: "Furniture", value: `${FURNITURE.length} items` },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex justify-between items-center">
                      <span
                        className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                      >
                        {label}
                      </span>
                      <span
                        className={`text-xs font-bold ${
                          label === "Score"
                            ? "text-green-600"
                            : darkMode
                            ? "text-white"
                            : "text-gray-800"
                        }`}
                      >
                        {value}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Furniture Tooltip Panel */}
              <motion.div
                initial={{ opacity: 0, x: 18 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.25 }}
                className={`rounded-2xl border shadow-md p-5 ${
                  darkMode ? "bg-gray-900 border-gray-700" : "bg-white border-gray-100"
                }`}
              >
                <h4
                  className={`text-sm font-bold mb-3 flex items-center gap-2 ${
                    darkMode ? "text-white" : "text-gray-700"
                  }`}
                >
                  <Info className="w-4 h-4 text-indigo-500" />
                  Furniture Info
                </h4>
                <AnimatePresence mode="wait">
                  {hoveredItem ? (
                    <motion.div
                      key={hoveredItem.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      className="space-y-2"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p
                          className={`font-bold text-sm ${darkMode ? "text-white" : "text-gray-800"}`}
                        >
                          {hoveredItem.label}
                        </p>
                        <button
                          onClick={() => setHoveredFurniture(null)}
                          className={`${darkMode ? "text-gray-500 hover:text-gray-300" : "text-gray-400 hover:text-gray-600"}`}
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <p
                        className={`text-xs leading-relaxed ${
                          darkMode ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        {hoveredItem.description}
                      </p>
                      <div
                        className={`rounded-lg px-3 py-2 text-[11px] font-semibold ${
                          darkMode
                            ? "bg-indigo-900/40 text-indigo-300"
                            : "bg-indigo-50 text-indigo-700"
                        }`}
                      >
                        Position: ({hoveredItem.x}u, {hoveredItem.y}u) · Size:{" "}
                        {hoveredItem.w}×{hoveredItem.d}
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="empty"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className={`text-center py-4 ${darkMode ? "text-gray-500" : "text-gray-400"}`}
                    >
                      <Box className="w-7 h-7 mx-auto mb-2 opacity-30" />
                      <p className="text-xs">Click a furniture item in the 3D view to see details</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Furniture List */}
              <motion.div
                initial={{ opacity: 0, x: 18 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className={`rounded-2xl border shadow-md p-5 flex-1 ${
                  darkMode ? "bg-gray-900 border-gray-700" : "bg-white border-gray-100"
                }`}
              >
                <h4
                  className={`text-sm font-bold mb-3 flex items-center gap-2 ${
                    darkMode ? "text-white" : "text-gray-700"
                  }`}
                >
                  <Layers className="w-4 h-4 text-indigo-500" />
                  Items in Scene
                </h4>
                <div className="space-y-1.5 max-h-52 overflow-y-auto pr-1">
                  {FURNITURE.filter((f) => !["mattress", "pillow_l", "pillow_r", "rug"].includes(f.id)).map(
                    (item) => (
                      <button
                        key={item.id}
                        onClick={() =>
                          setHoveredFurniture((p) => (p === item.id ? null : item.id))
                        }
                        className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left transition-all text-xs font-medium ${
                          hoveredFurniture === item.id
                            ? "bg-gradient-to-r from-blue-600 to-indigo-700 text-white"
                            : darkMode
                            ? "text-gray-300 hover:bg-gray-800"
                            : "text-gray-700 hover:bg-indigo-50 hover:text-indigo-700"
                        }`}
                      >
                        <span
                          className="w-3 h-3 rounded-sm shrink-0"
                          style={{ background: item.colorTop }}
                        />
                        {item.label}
                      </button>
                    )
                  )}
                </div>
              </motion.div>

              {/* Save + Export Actions */}
              <motion.div
                initial={{ opacity: 0, x: 18 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.35 }}
                className="flex flex-col gap-3"
              >
                {/* Save button */}
                <div className="relative">
                  <motion.button
                    whileHover={{ scale: 1.03, y: -1 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={handleSave}
                    className="w-full flex items-center justify-center gap-2 px-5 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-xl font-semibold text-sm shadow-lg shadow-indigo-200 hover:shadow-indigo-300 transition-all"
                  >
                    <Save className="w-4 h-4" />
                    Save Design
                  </motion.button>
                  <AnimatePresence>
                    {savedMsg && (
                      <motion.div
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 6 }}
                        className="absolute -top-10 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-green-600 text-white text-[11px] font-semibold px-3 py-1.5 rounded-xl shadow-lg whitespace-nowrap"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Design saved successfully!
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Export dropdown */}
                <ExportDropdown darkMode={darkMode} />

                {/* Back */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => navigate("/view-layouts")}
                  className={`w-full flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm border shadow-sm transition-all ${
                    darkMode
                      ? "bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700"
                      : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Layouts
                </motion.button>
              </motion.div>
            </div>
          )}
        </div>

        {/* Mobile action strip */}
        <div className="xl:hidden mt-5 grid grid-cols-2 gap-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleSave}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-xl font-semibold text-sm shadow-md"
          >
            <Save className="w-4 h-4" />
            Save Design
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate("/view-layouts")}
            className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold text-sm border shadow-sm transition-all ${
              darkMode
                ? "bg-gray-800 border-gray-700 text-gray-300"
                : "bg-white border-gray-200 text-gray-700"
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </motion.button>
        </div>
      </main>
    </div>
  );
}
