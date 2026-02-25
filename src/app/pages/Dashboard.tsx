import { useState } from "react";
import { 
  Box, 
  LayoutDashboard, 
  Upload, 
  History, 
  User, 
  LogOut,
  FileUp,
  Boxes,
  Menu,
  X,
  TrendingUp,
  Clock,
  Mail,
  Phone,
  MapPin,
  Lock,
  Eye,
  EyeOff,
  Save,
  Camera,
  CheckCircle2,
  Bell,
  Shield,
  Pencil,
  Trash2,
  Download,
  ExternalLink,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate } from "react-router";

export default function Dashboard() {
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState("dashboard");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Profile state
  const [profileEdit, setProfileEdit] = useState(false);
  const [profileSaved, setProfileSaved] = useState(false);
  const [showOldPass, setShowOldPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfPass, setShowConfPass] = useState(false);
  const [profile, setProfile] = useState({
    fullName: "John Smith",
    username: "johnsmith",
    email: "john@example.com",
    phone: "+1 (555) 012-3456",
    location: "New York, USA",
    bio: "Interior design enthusiast. Using AI to bring floor plans to life.",
  });
  const [profileDraft, setProfileDraft] = useState({ ...profile });
  const [passwords, setPasswords] = useState({ old: "", newP: "", conf: "" });
  const [passMsg, setPassMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const [notifications, setNotifications] = useState({ email: true, browser: false, updates: true });

  // Delete account modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [deletePassError, setDeletePassError] = useState(false);

  const username = profile.fullName;

  const handleDeleteAccount = () => {
    if (deletePassword.trim() === "") {
      setDeletePassError(true);
      return;
    }
    setShowDeleteModal(false);
    setDeletePassword("");
    setDeletePassError(false);
    navigate("/");
  };

  const handleLogout = () => {
    navigate("/");
  };

  const menuItems = [
    { id: "dashboard", label: "Dashboard",           icon: LayoutDashboard, path: "/dashboard" },
    { id: "upload",    label: "Upload Floor Plan",   icon: Upload,          path: "/upload" },
    { id: "designs",   label: "View Previous Designs", icon: History,       path: null },
    { id: "profile",   label: "Profile",             icon: User,            path: null },
  ];

  const stats = [
    { label: "Total Uploads",     value: "24", icon: FileUp,     color: "text-blue-600",   bg: "bg-blue-100" },
    { label: "Designs Generated", value: "18", icon: Boxes,      color: "text-indigo-600", bg: "bg-indigo-100" },
    { label: "Success Rate",      value: "98%", icon: TrendingUp, color: "text-green-600",  bg: "bg-green-100" },
  ];

  const recentActivity = [
    { id: 1, name: "Modern Bedroom Layout",     date: "2 hours ago", status: "Completed" },
    { id: 2, name: "Master Suite Design",       date: "1 day ago",   status: "Completed" },
    { id: 3, name: "Guest Room Optimization",   date: "2 days ago",  status: "Completed" },
  ];

  const previousDesigns = [
    { id: 1, name: "Modern Bedroom Layout",     date: "Feb 23, 2026", rooms: "Bedroom 1",   score: 92, thumb: "MB" },
    { id: 2, name: "Master Suite Design",       date: "Feb 22, 2026", rooms: "Bedroom 2",   score: 87, thumb: "MS" },
    { id: 3, name: "Guest Room Optimization",   date: "Feb 20, 2026", rooms: "Guest Room",  score: 78, thumb: "GR" },
    { id: 4, name: "Living Room Layout",        date: "Feb 18, 2026", rooms: "Living Room", score: 85, thumb: "LR" },
    { id: 5, name: "Home Office Setup",         date: "Feb 15, 2026", rooms: "Study Room",  score: 91, thumb: "HO" },
    { id: 6, name: "Kids Bedroom Plan",         date: "Feb 10, 2026", rooms: "Bedroom 3",   score: 74, thumb: "KB" },
  ];

  const handleSaveProfile = () => {
    setProfile({ ...profileDraft });
    setProfileEdit(false);
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 3000);
  };

  const handleChangePassword = () => {
    if (!passwords.old) { setPassMsg({ type: "err", text: "Enter your current password." }); return; }
    if (passwords.newP.length < 8) { setPassMsg({ type: "err", text: "New password must be at least 8 characters." }); return; }
    if (passwords.newP !== passwords.conf) { setPassMsg({ type: "err", text: "New passwords do not match." }); return; }
    setPassMsg({ type: "ok", text: "Password updated successfully." });
    setPasswords({ old: "", newP: "", conf: "" });
    setTimeout(() => setPassMsg(null), 3500);
  };

  // ── Tab content renderers ──────────────────────────────────────────────────

  const renderDashboard = () => (
    <>
      {/* Page Title */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">Dashboard</h2>
        <p className="text-gray-600">Manage your floor plans and 3D layouts</p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }} whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-800">{stat.value}</p>
                </div>
                <div className={`${stat.bg} p-3 rounded-xl`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Action Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
          whileHover={{ y: -8, transition: { duration: 0.3 } }}
          className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 cursor-pointer"
          onClick={() => navigate("/upload")}>
          <div className="flex flex-col items-center text-center space-y-6">
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-6 rounded-2xl shadow-lg">
              <FileUp className="w-16 h-16 text-white" strokeWidth={1.5} />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">Upload Floor Plan</h3>
              <p className="text-gray-600 leading-relaxed">Upload your 2D floor plan to generate optimized 3D bedroom layouts with AI-powered furniture placement.</p>
            </div>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              onClick={(e) => { e.stopPropagation(); navigate("/upload"); }}
              className="w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
              Start Upload
            </motion.button>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}
          whileHover={{ y: -8, transition: { duration: 0.3 } }}
          className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 cursor-pointer"
          onClick={() => setActiveMenu("designs")}>
          <div className="flex flex-col items-center text-center space-y-6">
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-6 rounded-2xl shadow-lg">
              <Boxes className="w-16 h-16 text-white" strokeWidth={1.5} />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">View Previous Designs</h3>
              <p className="text-gray-600 leading-relaxed">View and manage your previously generated 3D layouts. Download, edit, or share your designs.</p>
            </div>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              onClick={(e) => { e.stopPropagation(); setActiveMenu("designs"); }}
              className="w-full px-6 py-4 bg-transparent border-2 border-indigo-600 text-indigo-700 font-semibold rounded-xl hover:bg-indigo-50 transition-all duration-300">
              View Designs
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* Recent Activity */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
        className="bg-white rounded-3xl p-6 md:p-8 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Clock className="w-6 h-6 text-indigo-600" /> Recent Activity
          </h3>
          <button onClick={() => setActiveMenu("designs")}
            className="text-sm text-indigo-600 hover:text-indigo-800 font-semibold hover:underline">View All</button>
        </div>
        <div className="space-y-3">
          {recentActivity.map((activity, index) => (
            <motion.div key={activity.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }} whileHover={{ x: 4 }}
              className="flex items-center justify-between p-4 bg-gray-50 hover:bg-indigo-50 rounded-xl transition-all duration-200 cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="bg-indigo-100 p-2 rounded-lg">
                  <Boxes className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-800">{activity.name}</p>
                  <p className="text-sm text-gray-500">{activity.date}</p>
                </div>
              </div>
              <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">{activity.status}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </>
  );

  const renderDesigns = () => (
    <>
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">Previous Designs</h2>
        <p className="text-gray-600">All your AI-generated 3D layouts in one place.</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {previousDesigns.map((design, index) => (
          <motion.div key={design.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.07 }} whileHover={{ y: -6, transition: { duration: 0.2 } }}
            className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden">
            {/* Thumbnail */}
            <div className="h-36 bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center relative">
              <span className="text-5xl font-black text-indigo-300 select-none">{design.thumb}</span>
              <span className={`absolute top-3 right-3 px-2 py-1 text-xs font-bold rounded-full ${
                design.score >= 90 ? "bg-green-100 text-green-700" :
                design.score >= 80 ? "bg-blue-100 text-blue-700" : "bg-amber-100 text-amber-700"
              }`}>
                Score: {design.score}
              </span>
            </div>
            <div className="p-5">
              <h4 className="font-bold text-gray-800 text-base mb-1 truncate">{design.name}</h4>
              <p className="text-xs text-gray-500 mb-1">{design.rooms}</p>
              <p className="text-xs text-gray-400 mb-4">{design.date}</p>
              <div className="flex gap-2">
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                  onClick={() => navigate("/room-view-3d")}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-indigo-50 text-indigo-700 text-xs font-semibold rounded-xl hover:bg-indigo-100 transition-colors">
                  <ExternalLink className="w-3.5 h-3.5" /> Open
                </motion.button>
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-gray-50 text-gray-700 text-xs font-semibold rounded-xl hover:bg-gray-100 transition-colors">
                  <Download className="w-3.5 h-3.5" /> Export
                </motion.button>
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                  className="py-2 px-3 bg-red-50 text-red-500 text-xs font-semibold rounded-xl hover:bg-red-100 transition-colors">
                  <Trash2 className="w-3.5 h-3.5" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </>
  );

  const renderProfile = () => (
    <>
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">Profile</h2>
          <p className="text-gray-600">Manage your personal information and account settings.</p>
        </div>
        {profileSaved && (
          <motion.div initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-xl text-sm font-semibold">
            <CheckCircle2 className="w-4 h-4" /> Saved!
          </motion.div>
        )}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ── Avatar Card ── */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-2xl shadow-md p-6 flex flex-col items-center text-center gap-4 border border-gray-100">
          <div className="relative">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white text-3xl font-black shadow-lg">
              {profile.fullName.split(" ").map(w => w[0]).join("").slice(0, 2)}
            </div>
            <button className="absolute -bottom-2 -right-2 w-8 h-8 bg-white border-2 border-gray-200 rounded-full flex items-center justify-center hover:bg-indigo-50 transition-colors shadow-sm">
              <Camera className="w-3.5 h-3.5 text-indigo-600" />
            </button>
          </div>
          <div>
            <p className="font-bold text-gray-800 text-lg">{profile.fullName}</p>
            <p className="text-gray-500 text-sm">@{profile.username}</p>
          </div>
          <div className="w-full space-y-2 text-left">
            {[
              { icon: Mail, value: profile.email },
              { icon: Phone, value: profile.phone },
              { icon: MapPin, value: profile.location },
            ].map(({ icon: Icon, value }) => (
              <div key={value} className="flex items-center gap-2 text-xs text-gray-500">
                <Icon className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                <span className="truncate">{value}</span>
              </div>
            ))}
          </div>
          <div className="w-full pt-2 border-t border-gray-100">
            <p className="text-xs text-gray-400 italic text-left">{profile.bio}</p>
          </div>
        </motion.div>

        {/* ── Right Column ── */}
        <div className="lg:col-span-2 space-y-5">

          {/* Personal Info */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}
            className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-gray-800 flex items-center gap-2">
                <User className="w-4 h-4 text-indigo-500" /> Personal Information
              </h3>
              {!profileEdit ? (
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                  onClick={() => { setProfileDraft({ ...profile }); setProfileEdit(true); }}
                  className="flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition-colors">
                  <Pencil className="w-3.5 h-3.5" /> Edit
                </motion.button>
              ) : (
                <div className="flex gap-2">
                  <button onClick={() => setProfileEdit(false)}
                    className="text-xs font-semibold text-gray-500 hover:text-gray-700 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors">
                    Cancel
                  </button>
                  <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                    onClick={handleSaveProfile}
                    className="flex items-center gap-1.5 text-xs font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-700 px-4 py-1.5 rounded-lg shadow-sm">
                    <Save className="w-3.5 h-3.5" /> Save
                  </motion.button>
                </div>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {(["fullName", "username", "email", "phone", "location"] as const).map((field) => (
                <div key={field} className={field === "email" || field === "location" ? "sm:col-span-2" : ""}>
                  <label className="text-xs font-semibold text-gray-500 mb-1 block capitalize">
                    {field === "fullName" ? "Full Name" : field === "username" ? "Username" : field.charAt(0).toUpperCase() + field.slice(1)}
                  </label>
                  {profileEdit ? (
                    <input value={profileDraft[field]}
                      onChange={e => setProfileDraft(d => ({ ...d, [field]: e.target.value }))}
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all" />
                  ) : (
                    <p className="w-full border border-gray-100 bg-gray-50 rounded-xl px-4 py-2.5 text-sm text-gray-700">
                      {profile[field]}
                    </p>
                  )}
                </div>
              ))}
              <div className="sm:col-span-2">
                <label className="text-xs font-semibold text-gray-500 mb-1 block">Bio</label>
                {profileEdit ? (
                  <textarea rows={2} value={profileDraft.bio}
                    onChange={e => setProfileDraft(d => ({ ...d, bio: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all resize-none" />
                ) : (
                  <p className="w-full border border-gray-100 bg-gray-50 rounded-xl px-4 py-2.5 text-sm text-gray-700">{profile.bio}</p>
                )}
              </div>
            </div>
          </motion.div>

          {/* Change Password */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.14 }}
            className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
            <h3 className="font-bold text-gray-800 flex items-center gap-2 mb-5">
              <Lock className="w-4 h-4 text-indigo-500" /> Change Password
            </h3>
            <div className="space-y-3">
              {([
                { label: "Current Password",  key: "old",  show: showOldPass, setShow: setShowOldPass },
                { label: "New Password",       key: "newP", show: showNewPass, setShow: setShowNewPass },
                { label: "Confirm New Password", key: "conf", show: showConfPass, setShow: setShowConfPass },
              ] as const).map(({ label, key, show, setShow }) => (
                <div key={key}>
                  <label className="text-xs font-semibold text-gray-500 mb-1 block">{label}</label>
                  <div className="relative">
                    <input type={show ? "text" : "password"}
                      value={passwords[key]}
                      onChange={e => setPasswords(p => ({ ...p, [key]: e.target.value }))}
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 pr-10 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all" />
                    <button type="button" onClick={() => setShow(!show)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                      {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              ))}
              {passMsg && (
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className={`text-xs font-semibold flex items-center gap-1.5 ${passMsg.type === "ok" ? "text-green-600" : "text-red-500"}`}>
                  {passMsg.type === "ok" ? <CheckCircle2 className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                  {passMsg.text}
                </motion.p>
              )}
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                onClick={handleChangePassword}
                className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-semibold rounded-xl text-sm shadow-md shadow-indigo-200 hover:shadow-indigo-300 transition-all">
                Update Password
              </motion.button>
            </div>
          </motion.div>

          {/* Notification Preferences */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
            <h3 className="font-bold text-gray-800 flex items-center gap-2 mb-5">
              <Bell className="w-4 h-4 text-indigo-500" /> Notifications
            </h3>
            <div className="space-y-3">
              {([
                { key: "email",   label: "Email notifications",   desc: "Receive updates via email" },
                { key: "browser", label: "Browser notifications", desc: "Push alerts in browser" },
                { key: "updates", label: "Product updates",       desc: "News about new AI features" },
              ] as const).map(({ key, label, desc }) => (
                <div key={key} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{label}</p>
                    <p className="text-xs text-gray-500">{desc}</p>
                  </div>
                  <button onClick={() => setNotifications(n => ({ ...n, [key]: !n[key] }))}
                    className={`w-11 h-6 rounded-full transition-colors relative ${notifications[key] ? "bg-indigo-600" : "bg-gray-200"}`}>
                    <motion.span animate={{ x: notifications[key] ? 20 : 2 }}
                      className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
                  </button>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Danger Zone */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.26 }}
            className="bg-white rounded-2xl shadow-md p-6 border border-red-100">
            <h3 className="font-bold text-red-600 flex items-center gap-2 mb-4">
              <Shield className="w-4 h-4" /> Danger Zone
            </h3>
            <div className="flex items-center justify-between p-4 bg-red-50 rounded-xl border border-red-200">
              <div>
                <p className="text-sm font-semibold text-red-700">Delete Account</p>
                <p className="text-xs text-red-400">Permanently delete your account and all data.</p>
              </div>
              <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                onClick={() => { setShowDeleteModal(true); setDeletePassword(""); setDeletePassError(false); }}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white text-sm font-semibold rounded-xl hover:bg-red-700 transition-colors shadow-sm">
                <Trash2 className="w-3.5 h-3.5" /> Delete
              </motion.button>
            </div>
          </motion.div>

        </div>
      </div>
    </>
  );

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative">

      {/* ── Delete Account Confirmation Modal ── */}
      <AnimatePresence>
        {showDeleteModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowDeleteModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", stiffness: 320, damping: 26 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden"
            >
              {/* Red header */}
              <div className="bg-gradient-to-r from-red-500 to-rose-600 px-6 py-5">
                <div className="flex items-center gap-3">
                  <div className="bg-white/20 p-2.5 rounded-xl">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-lg">Delete Account</h3>
                    <p className="text-red-100 text-xs">This action is permanent and cannot be undone</p>
                  </div>
                  <button onClick={() => setShowDeleteModal(false)} className="ml-auto text-white/70 hover:text-white transition-colors">
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-4">
                {/* User preview */}
                <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-2xl p-4">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white font-bold text-sm shrink-0">
                    {profile.fullName.split(" ").map(n => n[0]).join("").slice(0,2).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-gray-900 text-sm truncate">{profile.fullName}</p>
                    <p className="text-xs text-gray-500 truncate">{profile.email}</p>
                    <p className="text-xs text-gray-400">@{profile.username}</p>
                  </div>
                </div>

                {/* Warning */}
                <p className="text-center text-gray-700 text-sm font-semibold">
                  Are you sure you want to permanently delete your account?
                </p>
                <p className="text-center text-gray-400 text-xs">
                  All your uploads, designs, and data will be removed forever.
                </p>

                {/* Password confirmation */}
                <div>
                  <label className="text-xs font-semibold text-gray-700 mb-1.5 flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-gray-500" />
                    Confirm with your password
                  </label>
                  <input
                    type="password"
                    autoFocus
                    placeholder="Enter your password…"
                    value={deletePassword}
                    onChange={(e) => { setDeletePassword(e.target.value); setDeletePassError(false); }}
                    onKeyDown={(e) => e.key === "Enter" && handleDeleteAccount()}
                    className={`w-full border rounded-xl px-4 py-2.5 text-sm outline-none transition-all ${
                      deletePassError
                        ? "border-red-400 ring-2 ring-red-200 bg-red-50"
                        : "border-gray-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                    }`}
                  />
                  {deletePassError && (
                    <p className="text-red-500 text-[11px] mt-1 flex items-center gap-1">
                      <X className="w-3 h-3" /> Password is required to confirm deletion.
                    </p>
                  )}
                </div>

                {/* Warning banner */}
                <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2.5">
                  <Shield className="w-4 h-4 text-amber-500 shrink-0" />
                  <p className="text-amber-700 text-[11px] font-semibold">
                    Warning: This action cannot be undone. Your account will be permanently removed.
                  </p>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-1">
                  <motion.button
                    whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                    onClick={() => setShowDeleteModal(false)}
                    className="flex-1 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-700 font-semibold text-sm hover:bg-gray-50 transition-all"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                    onClick={handleDeleteAccount}
                    className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-red-500 to-rose-600 text-white font-bold text-sm shadow-md shadow-red-200 hover:shadow-red-300 transition-all flex items-center justify-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete My Account
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Animated Blueprint Pattern Background */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(99, 102, 241, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(99, 102, 241, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }}></div>
      </div>

      {/* Top Navigation Bar */}
      <nav className="relative bg-white shadow-md border-b border-gray-200">
        <div className="px-4 md:px-8 py-4">
          <div className="flex items-center justify-between">
            {/* Left: Logo and System Name */}
            <div className="flex items-center gap-4">
              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden text-gray-600 hover:text-gray-800"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>

              <div 
                className="flex items-center gap-3 cursor-pointer"
                onClick={() => navigate("/")}
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

            {/* Right: User Info and Logout */}
            <div className="flex items-center gap-4">
              <div className="hidden md:block text-right">
                <p className="text-sm text-gray-600">Welcome back,</p>
                <p className="font-semibold text-gray-800">{username} 👋</p>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors duration-200"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </motion.button>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex">
        {/* Left Sidebar Navigation - Desktop */}
        <aside className="hidden lg:block w-64 bg-white shadow-lg border-r border-gray-200 min-h-[calc(100vh-73px)] relative">
          <nav className="p-4 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeMenu === item.id;
              return (
                <motion.button
                  key={item.id}
                  whileHover={{ x: 4 }}
                  onClick={() => { setActiveMenu(item.id); if (item.path) navigate(item.path); }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                    isActive
                      ? "bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-md"
                      : "text-gray-700 hover:bg-indigo-50"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </motion.button>
              );
            })}
          </nav>

          {/* Logout at Bottom of Sidebar */}
          <div className="absolute bottom-4 left-4 right-4">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </aside>

        {/* Mobile Sidebar Navigation */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.aside
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="lg:hidden fixed left-0 top-[73px] bottom-0 w-64 bg-white shadow-2xl border-r border-gray-200 z-50"
            >
              <nav className="p-4 space-y-2">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeMenu === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveMenu(item.id);
                        setMobileMenuOpen(false);
                        if (item.path) navigate(item.path);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                        isActive
                          ? "bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-md"
                          : "text-gray-700 hover:bg-indigo-50"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{item.label}</span>
                    </button>
                  );
                })}
              </nav>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Main Content Area */}
        <main className="flex-1 p-4 md:p-8 relative">
          <div className="max-w-7xl mx-auto">
            {/* Welcome Section - Mobile */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="md:hidden mb-6 bg-white rounded-2xl p-6 shadow-md"
            >
              <h2 className="text-2xl font-bold text-gray-800">
                Welcome back, {username} 👋
              </h2>
              <p className="text-gray-600 text-sm mt-1">
                Ready to create amazing 3D layouts?
              </p>
            </motion.div>

            <AnimatePresence mode="wait">
              <motion.div key={activeMenu} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.18 }}>
                {activeMenu === "dashboard" && renderDashboard()}
                {activeMenu === "designs"   && renderDesigns()}
                {activeMenu === "profile"   && renderProfile()}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
}