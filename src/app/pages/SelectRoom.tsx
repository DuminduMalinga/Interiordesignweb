import { useState } from "react";
import {
  Box,
  LogOut,
  Menu,
  X,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Check,
  AlertCircle,
  BedDouble,
  Sofa,
  BookOpen,
  Utensils,
  Bath,
  Home,
  Maximize2,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate } from "react-router";

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────
type RoomType = "Bedroom" | "Living Room" | "Study Room" | "Kitchen" | "Bathroom" | "Other";

interface DetectedRoom {
  id: string;
  name: string;
  type: RoomType;
  width: number;   // ft
  height: number;  // ft
  /** Optional: polygon points as percentage positions for the thumbnail SVG */
  shape: [number, number][];
}

// ─────────────────────────────────────────────
// Mock detected rooms (replace with real API data)
// ─────────────────────────────────────────────
const DETECTED_ROOMS: DetectedRoom[] = [
  {
    id: "r1",
    name: "Bedroom 1",
    type: "Bedroom",
    width: 14,
    height: 12,
    shape: [[10, 10], [90, 10], [90, 90], [10, 90]],
  },
  {
    id: "r2",
    name: "Bedroom 2",
    type: "Bedroom",
    width: 11,
    height: 10,
    shape: [[15, 15], [85, 15], [85, 85], [15, 85]],
  },
  {
    id: "r3",
    name: "Living Room",
    type: "Living Room",
    width: 18,
    height: 14,
    shape: [[5, 20], [95, 20], [95, 80], [5, 80]],
  },
  {
    id: "r4",
    name: "Study Room",
    type: "Study Room",
    width: 10,
    height: 9,
    shape: [[20, 15], [80, 15], [80, 85], [20, 85]],
  },
  {
    id: "r5",
    name: "Kitchen",
    type: "Kitchen",
    width: 12,
    height: 10,
    shape: [[10, 10], [90, 10], [90, 60], [60, 90], [10, 90]],
  },
  {
    id: "r6",
    name: "Bathroom",
    type: "Bathroom",
    width: 8,
    height: 6,
    shape: [[15, 15], [85, 15], [85, 85], [15, 85]],
  },
];

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────
const ROOM_ICON: Record<RoomType, React.ElementType> = {
  Bedroom: BedDouble,
  "Living Room": Sofa,
  "Study Room": BookOpen,
  Kitchen: Utensils,
  Bathroom: Bath,
  Other: Home,
};

const ROOM_COLOR: Record<RoomType, { badge: string; icon: string }> = {
  Bedroom: { badge: "bg-blue-100 text-blue-700", icon: "text-blue-600" },
  "Living Room": { badge: "bg-purple-100 text-purple-700", icon: "text-purple-600" },
  "Study Room": { badge: "bg-emerald-100 text-emerald-700", icon: "text-emerald-600" },
  Kitchen: { badge: "bg-orange-100 text-orange-700", icon: "text-orange-600" },
  Bathroom: { badge: "bg-cyan-100 text-cyan-700", icon: "text-cyan-600" },
  Other: { badge: "bg-gray-100 text-gray-700", icon: "text-gray-600" },
};

const sqFt = (w: number, h: number) => w * h;

// ─────────────────────────────────────────────
// Step indicator
// ─────────────────────────────────────────────
const STEPS = [
  { label: "Upload", step: 1 },
  { label: "Detect", step: 2 },
  { label: "Select Room", step: 3 },
  { label: "Layout", step: 4 },
  { label: "3D View", step: 5 },
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
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all duration-300 ${
                  isDone
                    ? "bg-gradient-to-br from-blue-600 to-indigo-700 border-indigo-700 text-white"
                    : isActive
                    ? "bg-white border-indigo-600 text-indigo-700 shadow-md shadow-indigo-200"
                    : "bg-white border-gray-300 text-gray-400"
                }`}
              >
                {isDone ? <Check className="w-4 h-4" /> : s.step}
              </div>
              <span
                className={`mt-1 text-[10px] font-medium whitespace-nowrap ${
                  isActive ? "text-indigo-700" : isDone ? "text-blue-600" : "text-gray-400"
                }`}
              >
                {s.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className={`h-0.5 w-8 md:w-12 mb-4 mx-1 transition-all duration-500 ${
                  s.step < current ? "bg-gradient-to-r from-blue-600 to-indigo-700" : "bg-gray-200"
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
// Room thumbnail SVG
// ─────────────────────────────────────────────
function RoomThumbnail({
  shape,
  selected,
  roomType,
}: {
  shape: [number, number][];
  selected: boolean;
  roomType: RoomType;
}) {
  const points = shape.map(([x, y]) => `${x},${y}`).join(" ");
  const colors: Record<RoomType, string> = {
    Bedroom: "#e0e7ff",
    "Living Room": "#ede9fe",
    "Study Room": "#d1fae5",
    Kitchen: "#ffedd5",
    Bathroom: "#cffafe",
    Other: "#f3f4f6",
  };
  const strokeColors: Record<RoomType, string> = {
    Bedroom: "#6366f1",
    "Living Room": "#7c3aed",
    "Study Room": "#10b981",
    Kitchen: "#f97316",
    Bathroom: "#06b6d4",
    Other: "#6b7280",
  };
  return (
    <div
      className={`w-full rounded-lg overflow-hidden border transition-all duration-300 ${
        selected ? "border-indigo-400" : "border-gray-100"
      }`}
      style={{ height: 72 }}
    >
      <svg viewBox="0 0 100 100" width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
        {/* Grid lines */}
        {[20, 40, 60, 80].map((v) => (
          <g key={v}>
            <line x1={v} y1="0" x2={v} y2="100" stroke="#e5e7eb" strokeWidth="0.5" />
            <line x1="0" y1={v} x2="100" y2={v} stroke="#e5e7eb" strokeWidth="0.5" />
          </g>
        ))}
        {/* Room polygon */}
        <polygon
          points={points}
          fill={colors[roomType]}
          stroke={strokeColors[roomType]}
          strokeWidth={selected ? 2.5 : 1.5}
        />
        {/* Door indicator */}
        <line x1="50" y1="10" x2="65" y2="10" stroke={strokeColors[roomType]} strokeWidth="2" strokeDasharray="2,1" />
      </svg>
    </div>
  );
}

// ─────────────────────────────────────────────
// Room Card
// ─────────────────────────────────────────────
function RoomCard({
  room,
  selected,
  onClick,
}: {
  room: DetectedRoom;
  selected: boolean;
  onClick: () => void;
}) {
  const Icon = ROOM_ICON[room.type];
  const colors = ROOM_COLOR[room.type];
  const area = sqFt(room.width, room.height);

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`relative cursor-pointer rounded-2xl p-4 border-2 transition-all duration-300 bg-white ${
        selected
          ? "border-indigo-600 shadow-xl shadow-indigo-100 ring-2 ring-indigo-300 ring-offset-1"
          : "border-gray-200 shadow-md hover:shadow-lg hover:border-indigo-300"
      }`}
    >
      {/* Selected checkmark */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="absolute -top-2.5 -right-2.5 bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-full w-7 h-7 flex items-center justify-center shadow-lg z-10"
          >
            <CheckCircle2 className="w-4 h-4" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Room Thumbnail */}
      <RoomThumbnail shape={room.shape} selected={selected} roomType={room.type} />

      {/* Room Info */}
      <div className="mt-3 space-y-2">
        {/* Name + Icon */}
        <div className="flex items-center justify-between gap-2">
          <h3 className="font-semibold text-gray-900 text-sm truncate">{room.name}</h3>
          <div className={`p-1.5 rounded-lg ${selected ? "bg-indigo-50" : "bg-gray-50"}`}>
            <Icon className={`w-4 h-4 ${selected ? "text-indigo-600" : colors.icon}`} />
          </div>
        </div>

        {/* Room Type Badge */}
        <span
          className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
            selected ? "bg-indigo-100 text-indigo-700" : colors.badge
          }`}
        >
          {room.type}
        </span>

        {/* Dimensions */}
        <div className="flex items-center justify-between mt-1">
          <div className="flex items-center gap-1 text-gray-500 text-xs">
            <Maximize2 className="w-3 h-3" />
            <span>
              {room.width}ft × {room.height}ft
            </span>
          </div>
          <span className={`text-xs font-medium ${selected ? "text-indigo-700" : "text-gray-500"}`}>
            {area} sq ft
          </span>
        </div>
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────
// Main Page
// ─────────────────────────────────────────────
export default function SelectRoom() {
  const navigate = useNavigate();
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const username = "John Smith";

  // Swap this with an empty array to trigger the "no rooms" state
  const rooms = DETECTED_ROOMS;

  const selectedRoom = rooms.find((r) => r.id === selectedRoomId) ?? null;

  const handleContinue = () => {
    if (!selectedRoomId) return;
    // Pass selected room downstream (e.g., via state/context)
    navigate("/processing");
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative">
      {/* Blueprint grid overlay */}
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none">
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

      {/* ── Top Navigation ── */}
      <nav className="relative bg-white shadow-md border-b border-gray-200 z-30">
        <div className="px-4 md:px-8 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden text-gray-600 hover:text-gray-800"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
              <div
                className="flex items-center gap-3 cursor-pointer"
                onClick={() => navigate("/dashboard")}
              >
                <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-2 rounded-xl shadow-lg">
                  <Box className="w-8 h-8 text-white" strokeWidth={1.5} />
                </div>
                <div className="hidden md:block">
                  <h1 className="text-lg font-bold text-gray-800">3D Layout System</h1>
                  <p className="text-xs text-gray-500">AI-Powered Design</p>
                </div>
              </div>
            </div>

            {/* User + Logout */}
            <div className="flex items-center gap-4">
              <div className="hidden md:block text-right">
                <p className="text-sm text-gray-600">Welcome back,</p>
                <p className="font-semibold text-gray-800">{username} 👋</p>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/")}
                className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors duration-200"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline text-sm font-medium">Logout</span>
              </motion.button>
            </div>
          </div>
        </div>
      </nav>

      {/* ── Main ── */}
      <main className="relative px-4 md:px-8 py-8 md:py-10 max-w-6xl mx-auto">
        {/* Step Indicator */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-6 py-4 flex justify-center">
            <StepIndicator current={3} />
          </div>
        </motion.div>

        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-8"
        >
          <h2 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent">
            Select a Room
          </h2>
          <p className="text-gray-500 mt-2 text-sm md:text-base">
            Choose one detected room to generate optimized furniture layouts.
          </p>
        </motion.div>

        {rooms.length === 0 ? (
          /* ─── Empty / Error State ─── */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl shadow-xl border border-orange-200 p-12 flex flex-col items-center gap-4 text-center"
          >
            <div className="bg-orange-100 p-5 rounded-2xl">
              <AlertCircle className="w-12 h-12 text-orange-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-800">No Rooms Detected</h3>
            <p className="text-gray-500 max-w-sm">
              No rooms available. Please re-upload a valid floor plan so the AI can detect room
              structures.
            </p>
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate("/upload")}
              className="mt-2 flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-xl font-semibold shadow-md hover:shadow-indigo-200 transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              Re-upload Floor Plan
            </motion.button>
          </motion.div>
        ) : (
          <>
            {/* ─── Content Grid ─── */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              {/* Left: Room Cards */}
              <div className="xl:col-span-2">
                <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6">
                  {/* Subheader */}
                  <div className="flex items-center justify-between mb-5">
                    <div>
                      <h3 className="font-bold text-gray-800 text-base">Detected Rooms</h3>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {rooms.length} room{rooms.length !== 1 ? "s" : ""} found · Select one to continue
                      </p>
                    </div>
                    <span className="bg-indigo-50 text-indigo-700 text-xs font-semibold px-3 py-1.5 rounded-full border border-indigo-100">
                      {rooms.length} rooms
                    </span>
                  </div>

                  {/* Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {rooms.map((room, i) => (
                      <motion.div
                        key={room.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.07 }}
                      >
                        <RoomCard
                          room={room}
                          selected={room.id === selectedRoomId}
                          onClick={() =>
                            setSelectedRoomId((prev) => (prev === room.id ? null : room.id))
                          }
                        />
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right: Selection Summary Panel */}
              <div className="xl:col-span-1 flex flex-col gap-4">
                {/* Floor Plan Preview */}
                <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-5">
                  <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <Home className="w-4 h-4 text-indigo-500" />
                    Floor Plan Preview
                  </h4>
                  <div className="w-full rounded-xl overflow-hidden bg-indigo-50 border border-indigo-100 flex items-center justify-center" style={{ height: 160 }}>
                    <svg viewBox="0 0 200 160" width="100%" height="100%">
                      {/* Grid */}
                      {Array.from({ length: 10 }).map((_, i) => (
                        <g key={i}>
                          <line x1={i * 20} y1="0" x2={i * 20} y2="160" stroke="#c7d2fe" strokeWidth="0.5" />
                          <line x1="0" y1={i * 16} x2="200" y2={i * 16} stroke="#c7d2fe" strokeWidth="0.5" />
                        </g>
                      ))}
                      {/* Outer walls */}
                      <rect x="10" y="10" width="180" height="140" fill="none" stroke="#6366f1" strokeWidth="2" rx="2" />
                      {/* Room partitions */}
                      <line x1="100" y1="10" x2="100" y2="90" stroke="#6366f1" strokeWidth="1.5" />
                      <line x1="10" y1="90" x2="200" y2="90" stroke="#6366f1" strokeWidth="1.5" />
                      <line x1="130" y1="90" x2="130" y2="150" stroke="#6366f1" strokeWidth="1.5" />
                      {/* Room labels */}
                      <text x="55" y="55" textAnchor="middle" fill="#818cf8" fontSize="8" fontFamily="sans-serif">Bedroom 1</text>
                      <text x="150" y="55" textAnchor="middle" fill="#818cf8" fontSize="8" fontFamily="sans-serif">Bedroom 2</text>
                      <text x="70" y="120" textAnchor="middle" fill="#818cf8" fontSize="8" fontFamily="sans-serif">Living Room</text>
                      <text x="162" y="120" textAnchor="middle" fill="#818cf8" fontSize="8" fontFamily="sans-serif">Study</text>
                      {/* Highlighted selected room */}
                      {selectedRoom?.name === "Bedroom 1" && (
                        <rect x="10" y="10" width="90" height="80" fill="#6366f1" fillOpacity="0.15" stroke="#6366f1" strokeWidth="2" />
                      )}
                      {selectedRoom?.name === "Bedroom 2" && (
                        <rect x="100" y="10" width="90" height="80" fill="#6366f1" fillOpacity="0.15" stroke="#6366f1" strokeWidth="2" />
                      )}
                      {selectedRoom?.name === "Living Room" && (
                        <rect x="10" y="90" width="120" height="60" fill="#6366f1" fillOpacity="0.15" stroke="#6366f1" strokeWidth="2" />
                      )}
                      {selectedRoom?.name === "Study Room" && (
                        <rect x="130" y="90" width="60" height="60" fill="#6366f1" fillOpacity="0.15" stroke="#6366f1" strokeWidth="2" />
                      )}
                    </svg>
                  </div>
                  <p className="text-[11px] text-gray-400 mt-2 text-center">
                    {selectedRoom ? `Selected: ${selectedRoom.name}` : "No room selected"}
                  </p>
                </div>

                {/* Selection Summary */}
                <AnimatePresence mode="wait">
                  {selectedRoom ? (
                    <motion.div
                      key="selected"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl shadow-lg p-5 text-white"
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <div className="bg-white/20 p-2 rounded-xl">
                          {(() => {
                            const Icon = ROOM_ICON[selectedRoom.type];
                            return <Icon className="w-5 h-5 text-white" />;
                          })()}
                        </div>
                        <div>
                          <p className="text-white/70 text-xs font-medium">Selected Room</p>
                          <h4 className="font-bold text-base">{selectedRoom.name}</h4>
                        </div>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between items-center bg-white/10 rounded-lg px-3 py-2">
                          <span className="text-white/70">Type</span>
                          <span className="font-semibold">{selectedRoom.type}</span>
                        </div>
                        <div className="flex justify-between items-center bg-white/10 rounded-lg px-3 py-2">
                          <span className="text-white/70">Dimensions</span>
                          <span className="font-semibold">
                            {selectedRoom.width}ft × {selectedRoom.height}ft
                          </span>
                        </div>
                        <div className="flex justify-between items-center bg-white/10 rounded-lg px-3 py-2">
                          <span className="text-white/70">Area</span>
                          <span className="font-semibold">
                            {sqFt(selectedRoom.width, selectedRoom.height)} sq ft
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="empty"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="bg-white rounded-2xl shadow-md border border-dashed border-indigo-200 p-6 flex flex-col items-center gap-2 text-center"
                    >
                      <div className="bg-indigo-50 p-3 rounded-xl">
                        <CheckCircle2 className="w-7 h-7 text-indigo-300" />
                      </div>
                      <p className="text-gray-500 text-sm font-medium">No room selected yet</p>
                      <p className="text-gray-400 text-xs">Click on a room card to select it</p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Action Buttons */}
                <div className="flex flex-col gap-3 mt-auto">
                  <motion.button
                    whileHover={selectedRoomId ? { scale: 1.03, y: -1 } : {}}
                    whileTap={selectedRoomId ? { scale: 0.97 } : {}}
                    onClick={handleContinue}
                    disabled={!selectedRoomId}
                    className={`w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm transition-all duration-300 ${
                      selectedRoomId
                        ? "bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-lg shadow-indigo-200 hover:shadow-indigo-300"
                        : "bg-gray-100 text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    Continue to Layout Generation
                    <ArrowRight className="w-4 h-4" />
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => navigate("/upload")}
                    className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 hover:border-gray-300 shadow-sm transition-all duration-200"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back
                  </motion.button>
                </div>
              </div>
            </div>

            {/* Bottom action bar on mobile / small screens */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="xl:hidden mt-6 flex gap-3"
            >
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate("/upload")}
                className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm bg-white text-gray-700 border border-gray-200 shadow-sm hover:bg-gray-50 transition-all"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </motion.button>
              <motion.button
                whileHover={selectedRoomId ? { scale: 1.02 } : {}}
                whileTap={selectedRoomId ? { scale: 0.97 } : {}}
                onClick={handleContinue}
                disabled={!selectedRoomId}
                className={`flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm transition-all ${
                  selectedRoomId
                    ? "bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-lg shadow-indigo-100"
                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                }`}
              >
                Continue
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </motion.div>
          </>
        )}
      </main>
    </div>
  );
}
