import { useState, useRef, DragEvent } from "react";
import { 
  Box, 
  Upload as UploadIcon, 
  FileUp,
  X,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ArrowRight,
  Image as ImageIcon,
  FileText,
  LogOut,
  Menu
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate } from "react-router";

export default function UploadFloorPlan() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const username = "John Smith";

  // Supported file types
  const SUPPORTED_FORMATS = ["image/png", "image/jpeg", "image/jpg", "application/pdf"];
  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

  const validateFile = (file: File): boolean => {
    setError(null);
    setSuccess(null);

    // Check file type
    if (!SUPPORTED_FORMATS.includes(file.type)) {
      setError("Unsupported file format. Please upload PNG, JPG, or PDF files only.");
      return false;
    }

    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      setError("File size exceeds limit. Maximum file size is 10MB.");
      return false;
    }

    return true;
  };

  const handleFileSelect = (file: File) => {
    if (validateFile(file)) {
      setSelectedFile(file);
      
      // Create preview for image files
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewUrl(reader.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        setPreviewUrl(null); // PDF doesn't need preview
      }

      setSuccess("File selected successfully!");
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setError(null);
    setSuccess(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleUpload = () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setError(null);
    setSuccess(null);
    setUploadProgress(0);

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsUploading(false);
            setSuccess("File uploaded successfully! Processing floor plan...");
            // In real app: navigate to processing/results page
            setTimeout(() => {
              navigate("/processing");
            }, 2000);
          }, 500);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const steps = [
    { number: 1, label: "Upload", active: true },
    { number: 2, label: "Detect", active: false },
    { number: 3, label: "Layout", active: false },
    { number: 4, label: "3D View", active: false },
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
              <button
                onClick={() => navigate("/dashboard")}
                className="text-gray-600 hover:text-gray-800 lg:hidden"
              >
                <Menu className="w-6 h-6" />
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

            {/* Right: User Info and Logout */}
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
      <main className="relative p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
              Upload Floor Plan
            </h2>
            <p className="text-gray-600">
              Upload your 2D floor plan to begin automatic room detection and layout optimization.
            </p>
          </motion.div>

          {/* Step Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <div className="flex items-center justify-center gap-2 md:gap-4">
              {steps.map((step, index) => (
                <div key={step.number} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center font-bold transition-all duration-300 ${
                        step.active
                          ? "bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-lg"
                          : "bg-gray-200 text-gray-500"
                      }`}
                    >
                      {step.number}
                    </div>
                    <p className={`mt-2 text-xs md:text-sm font-medium ${
                      step.active ? "text-indigo-700" : "text-gray-500"
                    }`}>
                      {step.label}
                    </p>
                  </div>
                  {index < steps.length - 1 && (
                    <ArrowRight className="w-4 h-4 md:w-6 md:h-6 text-gray-400 mx-2 md:mx-4 mb-6" />
                  )}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Upload Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-3xl shadow-xl p-6 md:p-10"
          >
            {/* Error Message */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-start gap-2 p-4 mb-6 bg-red-50 border border-red-200 rounded-xl"
                >
                  <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-red-700">{error}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Success Message */}
            <AnimatePresence>
              {success && !isUploading && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-start gap-2 p-4 mb-6 bg-green-50 border border-green-200 rounded-xl"
                >
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-green-700">{success}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Drag & Drop Upload Area */}
            {!selectedFile && (
              <motion.div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                whileHover={{ scale: 1.01 }}
                className={`border-3 border-dashed rounded-2xl p-8 md:p-12 text-center transition-all duration-300 cursor-pointer ${
                  isDragging
                    ? "border-indigo-500 bg-indigo-50"
                    : "border-gray-300 hover:border-indigo-400 hover:bg-indigo-50/50"
                }`}
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="flex flex-col items-center space-y-4">
                  {/* Icon */}
                  <div className={`p-6 rounded-2xl transition-all duration-300 ${
                    isDragging
                      ? "bg-gradient-to-br from-blue-600 to-indigo-700 scale-110"
                      : "bg-gradient-to-br from-blue-500 to-indigo-600"
                  }`}>
                    <FileUp className="w-12 h-12 md:w-16 md:h-16 text-white" strokeWidth={1.5} />
                  </div>

                  {/* Text */}
                  <div>
                    <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">
                      {isDragging ? "Drop your file here" : "Drag & drop your floor plan"}
                    </h3>
                    <p className="text-gray-600 mb-4">or</p>
                    <div className="inline-block">
                      <span className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors cursor-pointer">
                        Choose File
                      </span>
                    </div>
                  </div>

                  {/* File Format Info */}
                  <div className="pt-4 border-t border-gray-200 w-full">
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold">Supported formats:</span> PNG, JPG, PDF
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      Maximum file size: 10MB
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* File Preview Area */}
            {selectedFile && !isUploading && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-6"
              >
                {/* Preview Box */}
                <div className="relative bg-gray-50 rounded-2xl p-6 border-2 border-gray-200">
                  <div className="flex flex-col md:flex-row items-center gap-6">
                    {/* Preview Image */}
                    <div className="flex-shrink-0">
                      {previewUrl ? (
                        <img
                          src={previewUrl}
                          alt="Floor plan preview"
                          className="w-32 h-32 md:w-40 md:h-40 object-cover rounded-xl border-2 border-gray-300 shadow-md"
                        />
                      ) : (
                        <div className="w-32 h-32 md:w-40 md:h-40 bg-indigo-100 rounded-xl flex items-center justify-center">
                          <FileText className="w-16 h-16 text-indigo-600" />
                        </div>
                      )}
                    </div>

                    {/* File Info */}
                    <div className="flex-1 text-center md:text-left">
                      <h4 className="text-lg font-bold text-gray-800 mb-1 break-all">
                        {selectedFile.name}
                      </h4>
                      <p className="text-sm text-gray-600 mb-2">
                        {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                      <div className="flex items-center gap-2 justify-center md:justify-start">
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                        <span className="text-sm text-green-600 font-medium">
                          Ready to upload
                        </span>
                      </div>
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={handleRemoveFile}
                      className="absolute top-4 right-4 p-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Change File Button */}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="text-sm text-indigo-600 hover:text-indigo-800 font-semibold hover:underline"
                >
                  Change File
                </button>
              </motion.div>
            )}

            {/* Upload Progress */}
            {isUploading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-center gap-3 mb-4">
                  <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
                  <span className="text-lg font-semibold text-gray-800">
                    Uploading and processing...
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${uploadProgress}%` }}
                    transition={{ duration: 0.3 }}
                    className="h-full bg-gradient-to-r from-blue-600 to-indigo-700 rounded-full"
                  ></motion.div>
                </div>
                <p className="text-center text-sm text-gray-600">
                  {uploadProgress}% complete
                </p>

                {/* Processing Steps Animation */}
                <div className="bg-indigo-50 rounded-xl p-4 mt-6">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <div className="w-2 h-2 bg-indigo-600 rounded-full animate-pulse"></div>
                      <span>Uploading file to server...</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                      <span>Detecting rooms and boundaries...</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                      <span>Generating 3D layout...</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Hidden File Input */}
            <input
              ref={fileInputRef}
              type="file"
              accept=".png,.jpg,.jpeg,.pdf"
              onChange={handleFileInputChange}
              className="hidden"
            />

            {/* Upload Button */}
            {selectedFile && !isUploading && (
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleUpload}
                disabled={!selectedFile}
                className="w-full mt-6 px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-700 text-white text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-indigo-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <UploadIcon className="w-5 h-5" />
                Upload & Process
              </motion.button>
            )}
          </motion.div>

          {/* Process Illustration */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-12 bg-white rounded-3xl shadow-lg p-6 md:p-8"
          >
            <h3 className="text-xl font-bold text-gray-800 mb-6 text-center">
              How It Works
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="flex flex-col items-center text-center">
                <div className="bg-blue-100 p-4 rounded-xl mb-3">
                  <FileUp className="w-8 h-8 text-blue-600" />
                </div>
                <h4 className="font-semibold text-gray-800 mb-1">1. Upload</h4>
                <p className="text-sm text-gray-600">Submit your 2D floor plan</p>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="bg-indigo-100 p-4 rounded-xl mb-3">
                  <ImageIcon className="w-8 h-8 text-indigo-600" />
                </div>
                <h4 className="font-semibold text-gray-800 mb-1">2. Detect</h4>
                <p className="text-sm text-gray-600">AI detects rooms & walls</p>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="bg-purple-100 p-4 rounded-xl mb-3">
                  <LayoutDashboard className="w-8 h-8 text-purple-600" />
                </div>
                <h4 className="font-semibold text-gray-800 mb-1">3. Layout</h4>
                <p className="text-sm text-gray-600">Optimize furniture placement</p>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="bg-green-100 p-4 rounded-xl mb-3">
                  <Box className="w-8 h-8 text-green-600" />
                </div>
                <h4 className="font-semibold text-gray-800 mb-1">4. 3D View</h4>
                <p className="text-sm text-gray-600">View interactive 3D model</p>
              </div>
            </div>
          </motion.div>

          {/* Back to Dashboard Link */}
          <div className="text-center mt-8">
            <button
              onClick={() => navigate("/dashboard")}
              className="text-gray-600 hover:text-gray-800 font-medium hover:underline transition-colors"
            >
              ← Back to Dashboard
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

import { LayoutDashboard } from "lucide-react";
