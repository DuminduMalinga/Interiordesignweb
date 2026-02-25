import { useEffect, useState } from "react";
import { Box, CheckCircle2, Loader2, LogOut, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import { useNavigate } from "react-router";

export default function Processing() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const username = "John Smith";

  const processingSteps = [
    { label: "Analyzing floor plan image", duration: 2000 },
    { label: "Detecting room boundaries", duration: 2000 },
    { label: "Identifying walls, doors, and windows", duration: 2000 },
    { label: "Calculating optimal furniture placement", duration: 2000 },
    { label: "Generating 3D visualization", duration: 2000 },
  ];

  useEffect(() => {
    if (currentStep < processingSteps.length) {
      const timer = setTimeout(() => {
        setCurrentStep(currentStep + 1);
      }, processingSteps[currentStep].duration);
      return () => clearTimeout(timer);
    } else {
      // All steps complete - navigate to select room
      setTimeout(() => {
        navigate("/select-room");
      }, 1500);
    }
  }, [currentStep, navigate]);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative">
      {/* Top Navigation Bar */}
      <nav className="relative bg-white shadow-md border-b border-gray-200">
        <div className="px-4 md:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-2 rounded-xl shadow-lg">
                <Box className="w-8 h-8 text-white" strokeWidth={1.5} />
              </div>
              <div className="hidden md:block">
                <h1 className="text-lg font-bold text-gray-800">3D Layout System</h1>
                <p className="text-xs text-gray-500">AI-Powered Design</p>
              </div>
            </div>

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
                <span className="hidden sm:inline">Logout</span>
              </motion.button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative flex items-center justify-center p-4 md:p-8 min-h-[calc(100vh-73px)]">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl p-8 md:p-12"
        >
          {/* Processing Icon */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-6 rounded-2xl shadow-lg">
                <Sparkles className="w-16 h-16 text-white" strokeWidth={1.5} />
              </div>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="absolute -top-2 -right-2"
              >
                <Loader2 className="w-8 h-8 text-indigo-600" />
              </motion.div>
            </div>
          </div>

          {/* Title */}
          <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent mb-3">
            Processing Your Floor Plan
          </h2>
          <p className="text-center text-gray-600 mb-8">
            Our AI is analyzing your floor plan and creating optimized layouts...
          </p>

          {/* Processing Steps */}
          <div className="space-y-4 mb-8">
            {processingSteps.map((step, index) => {
              const isComplete = index < currentStep;
              const isActive = index === currentStep;

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`flex items-center gap-4 p-4 rounded-xl transition-all duration-300 ${
                    isActive ? "bg-indigo-50 border-2 border-indigo-300" :
                    isComplete ? "bg-green-50 border-2 border-green-300" :
                    "bg-gray-50 border-2 border-gray-200"
                  }`}
                >
                  <div className="flex-shrink-0">
                    {isComplete ? (
                      <CheckCircle2 className="w-6 h-6 text-green-600" />
                    ) : isActive ? (
                      <Loader2 className="w-6 h-6 text-indigo-600 animate-spin" />
                    ) : (
                      <div className="w-6 h-6 rounded-full border-2 border-gray-300"></div>
                    )}
                  </div>
                  <span className={`font-medium ${
                    isActive ? "text-indigo-700" :
                    isComplete ? "text-green-700" :
                    "text-gray-500"
                  }`}>
                    {step.label}
                  </span>
                </motion.div>
              );
            })}
          </div>

          {/* Overall Progress Bar */}
          <div className="mb-4">
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(currentStep / processingSteps.length) * 100}%` }}
                transition={{ duration: 0.5 }}
                className="h-full bg-gradient-to-r from-blue-600 to-indigo-700 rounded-full"
              ></motion.div>
            </div>
            <p className="text-center text-sm text-gray-600 mt-2">
              {Math.round((currentStep / processingSteps.length) * 100)}% complete
            </p>
          </div>

          {/* Info Message */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-center">
            <p className="text-sm text-blue-700">
              This process typically takes 10-20 seconds. Please don't close this window.
            </p>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
