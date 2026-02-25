import { Box } from "lucide-react";
import { motion } from "motion/react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { useNavigate } from "react-router";

export default function Welcome() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
        {/* Left Content Section */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center lg:items-start text-center lg:text-left space-y-8"
        >
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05, rotate: 5 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="relative"
          >
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-8 rounded-3xl shadow-2xl">
              <Box className="w-20 h-20 text-white" strokeWidth={1.5} />
            </div>
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-purple-500 rounded-full animate-pulse"></div>
          </motion.div>

          {/* System Name */}
          <div className="space-y-3">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 bg-clip-text text-transparent leading-tight">
              Smart Floor Plan to 3D Room Layout
            </h1>
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Optimization System
            </h2>
          </div>

          {/* Description */}
          <p className="text-lg md:text-xl text-gray-700 max-w-2xl leading-relaxed">
            Automatically convert your 2D floor plan into optimized and
            interactive 3D room layouts using{" "}
            <span className="font-semibold text-indigo-700">
              AI-powered room detection
            </span>{" "}
            and{" "}
            <span className="font-semibold text-indigo-700">
              smart furniture placement
            </span>
            .
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            {/* Sign Up Button - Primary */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/signup")}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-700 text-white text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-indigo-800 transition-all duration-300"
            >
              Sign Up
            </motion.button>

            {/* Sign In Button - Secondary */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/signin")}
              className="px-8 py-4 bg-transparent border-2 border-indigo-600 text-indigo-700 text-lg font-semibold rounded-xl hover:bg-indigo-50 hover:border-indigo-700 transition-all duration-300"
            >
              Sign In
            </motion.button>
          </div>

          {/* Features Badges */}
          <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
            <span className="px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full text-sm font-medium text-indigo-700 shadow-md">
              🤖 AI-Powered
            </span>
            <span className="px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full text-sm font-medium text-indigo-700 shadow-md">
              ⚡ Fast Processing
            </span>
            <span className="px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full text-sm font-medium text-indigo-700 shadow-md">
              🎨 Smart Design
            </span>
          </div>
        </motion.div>

        {/* Right Image Section */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative hidden lg:block"
        >
          <div className="relative rounded-3xl overflow-hidden shadow-2xl">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1757344454271-bad02eff9fda?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBtaW5pbWFsaXN0JTIwYmVkcm9vbSUyMDNEJTIwcmVuZGVyfGVufDF8fHx8MTc3MjAwMTI1MHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
              alt="3D Room Layout Preview"
              className="w-full h-auto object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/30 to-transparent"></div>
          </div>

          {/* Floating Elements */}
          <motion.div
            animate={{
              y: [0, -20, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute -top-6 -right-6 bg-white p-4 rounded-2xl shadow-xl"
          >
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-semibold text-gray-800">
                Real-time Processing
              </span>
            </div>
          </motion.div>

          <motion.div
            animate={{
              y: [0, 15, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5,
            }}
            className="absolute -bottom-6 -left-6 bg-white p-4 rounded-2xl shadow-xl"
          >
            <div className="flex items-center gap-2">
              <span className="text-2xl">🏠</span>
              <span className="text-sm font-semibold text-gray-800">
                3D Optimization
              </span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
