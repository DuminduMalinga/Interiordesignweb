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
  Clock
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate } from "react-router";

export default function Dashboard() {
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState("dashboard");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Mock user data
  const username = "John Smith";

  const handleLogout = () => {
    // In a real app, clear auth tokens here
    navigate("/");
  };

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "upload", label: "Upload Floor Plan", icon: Upload },
    { id: "designs", label: "View Previous Designs", icon: History },
    { id: "profile", label: "Profile", icon: User },
  ];

  const stats = [
    { label: "Total Uploads", value: "24", icon: FileUp, color: "text-blue-600", bg: "bg-blue-100" },
    { label: "Designs Generated", value: "18", icon: Boxes, color: "text-indigo-600", bg: "bg-indigo-100" },
    { label: "Success Rate", value: "98%", icon: TrendingUp, color: "text-green-600", bg: "bg-green-100" },
  ];

  const recentActivity = [
    { id: 1, name: "Modern Bedroom Layout", date: "2 hours ago", status: "Completed" },
    { id: 2, name: "Master Suite Design", date: "1 day ago", status: "Completed" },
    { id: 3, name: "Guest Room Optimization", date: "2 days ago", status: "Completed" },
  ];

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative">
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
                  onClick={() => setActiveMenu(item.id)}
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

            {/* Page Title */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">Dashboard</h2>
              <p className="text-gray-600">Manage your floor plans and 3D layouts</p>
            </motion.div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -4, transition: { duration: 0.2 } }}
                    className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-shadow duration-300"
                  >
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

            {/* Main Action Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Upload Floor Plan Card */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
                className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 cursor-pointer"
                onClick={() => navigate("/upload")}
              >
                <div className="flex flex-col items-center text-center space-y-6">
                  {/* Icon */}
                  <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-6 rounded-2xl shadow-lg">
                    <FileUp className="w-16 h-16 text-white" strokeWidth={1.5} />
                  </div>

                  {/* Content */}
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-3">
                      Upload Floor Plan
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      Upload your 2D floor plan to generate optimized 3D bedroom layouts with AI-powered furniture placement.
                    </p>
                  </div>

                  {/* Button */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate("/upload");
                    }}
                    className="w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-indigo-800 transition-all duration-300"
                  >
                    Start Upload
                  </motion.button>
                </div>
              </motion.div>

              {/* View Previous Designs Card */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
                className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 cursor-pointer"
                onClick={() => setActiveMenu("designs")}
              >
                <div className="flex flex-col items-center text-center space-y-6">
                  {/* Icon */}
                  <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-6 rounded-2xl shadow-lg">
                    <Boxes className="w-16 h-16 text-white" strokeWidth={1.5} />
                  </div>

                  {/* Content */}
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-3">
                      View Previous Designs
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      View and manage your previously generated 3D layouts. Download, edit, or share your designs.
                    </p>
                  </div>

                  {/* Button */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveMenu("designs");
                    }}
                    className="w-full px-6 py-4 bg-transparent border-2 border-indigo-600 text-indigo-700 font-semibold rounded-xl hover:bg-indigo-50 hover:border-indigo-700 transition-all duration-300"
                  >
                    View Designs
                  </motion.button>
                </div>
              </motion.div>
            </div>

            {/* Recent Activity Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-3xl p-6 md:p-8 shadow-lg"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                  <Clock className="w-6 h-6 text-indigo-600" />
                  Recent Activity
                </h3>
                <button
                  onClick={() => setActiveMenu("designs")}
                  className="text-sm text-indigo-600 hover:text-indigo-800 font-semibold hover:underline"
                >
                  View All
                </button>
              </div>

              <div className="space-y-3">
                {recentActivity.map((activity, index) => (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    whileHover={{ x: 4 }}
                    className="flex items-center justify-between p-4 bg-gray-50 hover:bg-indigo-50 rounded-xl transition-all duration-200 cursor-pointer"
                  >
                    <div className="flex items-center gap-4">
                      <div className="bg-indigo-100 p-2 rounded-lg">
                        <Boxes className="w-5 h-5 text-indigo-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">{activity.name}</p>
                        <p className="text-sm text-gray-500">{activity.date}</p>
                      </div>
                    </div>
                    <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                      {activity.status}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
}